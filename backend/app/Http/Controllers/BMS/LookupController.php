<?php
namespace App\Http\Controllers\BMS;

use App\Models\BMS\BmsRole;
use App\Models\BMS\BusinessUnit;
use App\Models\Department;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class LookupController extends BmsController
{
    /**
     * Shared lookups for every BMS screen.
     *
     * `users` used to return every user in the database, which leaked the
     * whole company directory to any authenticated BMS user. It is now scoped
     * to the viewer's units (or to the whole company only for global roles),
     * and only includes active accounts.
     */
    public function index()
    {
        $visibleUnits = $this->access->visibleUnitIds();
        $units = BusinessUnit::when($visibleUnits !== null, fn ($q) => $q->whereIn('id', $visibleUnits))->orderBy('name')->get(['id', 'name', 'parent_id']);
        $products = Product::when($visibleUnits !== null, fn ($q) => $q->whereHas('businessUnits', fn ($u) => $u->whereIn('business_units.id', $visibleUnits)))->orderBy('product_name')->get(['id', 'product_name']);
        $leads = $this->access->can('leads.view') ? \App\Models\BMS\Lead::when($visibleUnits !== null, fn ($q) => $q->whereIn('business_unit_id', $visibleUnits))->orderBy('name')->get(['id', 'name']) : collect();
        $opportunities = $this->access->can('opportunities.view') ? \App\Models\BMS\Opportunity::when($visibleUnits !== null, fn ($q) => $q->whereIn('business_unit_id', $visibleUnits))->orderBy('title')->get(['id', 'title', 'reference']) : collect();

        $users = User::whereNull('deleted_at')->where('active', 1)
            ->when($visibleUnits !== null, function ($q) use ($visibleUnits) {
                $q->where(function ($scoped) use ($visibleUnits) {
                    $scoped->whereHas('businessUnits', fn ($u) => $u->whereIn('business_units.id', $visibleUnits))
                        ->orWhere('id', $this->access->user()->id);
                });
            })
            ->orderBy('username')->get(['id', 'username', 'firstname', 'lastname', 'email']);

        return $this->ok([
            'current_user' => $this->access->user()->only(['id', 'username', 'email']),
            'users' => $users,
            'units' => $units,
            'departments' => Department::orderBy('department_name')->get(['id', 'department_name']),
            // Centralised, read-only configuration lists (BRD §4.4): screens must
            // not hardcode department / job-title / meeting-type values.
            'meeting_types' => ['internal', 'external', 'hybrid'],
            'task_statuses' => ['achieved', 'in_progress', 'not_done'],
            'unit_categories' => \App\Models\BMS\BusinessUnit::whereNull('parent_id')->orderBy('name')->get(['id', 'name']),
            'opportunity_types' => ['opportunity', 'tender'],
            'work_degrees' => \App\Models\WorkDegree::orderBy(
                \Schema::hasColumn('work_degrees', 'work_degree_name') ? 'work_degree_name' : 'name'
            )->get(),
            'products' => $products,
            'leads' => $leads,
            'lead_stages' => \App\Models\BMS\PipelineStage::where('is_active', true)->orderBy('sequence')->get(),
            'opportunities' => $opportunities,
            'roles' => BmsRole::orderBy('name')->get(['id', 'name', 'slug', 'abilities']),
            'abilities' => array_values(array_unique(array_merge(...BmsRole::pluck('abilities')->map(fn ($a) => $a ?: [])->all() ?: [[]]))),
            'can' => $this->currentAbilities(),
        ]);
    }

    public function assignRole(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role_id' => 'required|exists:bms_roles,id',
            'business_unit_id' => 'nullable|exists:business_units,id',
        ]);
        $target = User::findOrFail($data['user_id']);
        $role = BmsRole::findOrFail((int) $data['role_id']);
        $unitId = ($data['business_unit_id'] ?? null) !== null ? (int) $data['business_unit_id'] : null;
        $this->access->authorizeRoleChange($target, $role, $unitId, 'assign');

        $existing = $target->bmsRoles()->wherePivot('business_unit_id', $data['business_unit_id'] ?? null)
            ->where('bms_roles.id', $role->id)->exists();
        abort_if($existing, 422, 'This role is already assigned at that scope.');
        $target->bmsRoles()->syncWithoutDetaching([
            $role->id => ['business_unit_id' => $data['business_unit_id'] ?? null],
        ]);
        $this->audit->record($target, 'role.assigned', [], $data);

        return $this->writeResponse($target, 'BMS role assigned');
    }

    public function revokeRole(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role_id' => 'required|exists:bms_roles,id',
            'business_unit_id' => 'nullable|exists:business_units,id',
        ]);
        $target = User::findOrFail($data['user_id']);
        $role = BmsRole::findOrFail((int) $data['role_id']);
        $unitId = ($data['business_unit_id'] ?? null) !== null ? (int) $data['business_unit_id'] : null;
        $this->access->authorizeRoleChange($target, $role, $unitId, 'revoke');
        abort_if($target->id === $this->access->user()->id && empty($data['business_unit_id']), 422, 'You cannot revoke your own global role.');

        // Only the requested assignment scope is detached: unit-scoped rows keep
        // their other units, and global rows are only touched when no unit is given.
        $relation = $target->bmsRoles();
        if ($unitId === null) $relation->wherePivotNull('business_unit_id');
        else $relation->wherePivot('business_unit_id', $unitId);
        $relation->detach($role->id);
        $this->audit->record($target, 'role.revoked', [], $data);

        return $this->writeResponse($target->fresh(), 'BMS role revoked');
    }

    /**
     * Every role assignment of one employee, for the Access & Roles screen.
     *
     * Unit-scoped viewers may only inspect employees inside their own scope
     * (403 otherwise) and only see the assignments that belong to their own
     * units — global assignments are not exposed to them. Global-scope
     * viewers keep the full picture. Soft-deleted/unknown employees resolve
     * to 404 through the route binding before this method runs.
     */
    public function assignments(User $employee)
    {
        $this->authorizeAssignmentRead($employee);

        return $this->ok($this->presentAssignments($employee));
    }

    /**
     * Write responses keep the historical envelope this endpoint has always
     * returned (the assignment list serialized through a nested response),
     * but they never re-run the read guard: authorization already succeeded
     * for the write itself, so a response builder must not be able to turn a
     * committed assignment into a spurious 403.
     */
    private function writeResponse(User $employee, string $message)
    {
        return $this->ok($this->ok($this->presentAssignments($employee)), $message);
    }

    /** Read-side scope guard: unrelated employees are 403, never a partial leak. */
    private function authorizeAssignmentRead(User $employee): void
    {
        $visible = $this->access->visibleUnitIds();
        if ($visible !== null) {
            $inScope = $employee->businessUnits()->whereIn('business_units.id', $visible)->exists();
            abort_unless($inScope, 403, 'This employee is outside your assigned unit scope.');
        }
    }

    /**
     * Renders the assignment rows of one employee: unit-scoped viewers only
     * receive rows from their own units (global rows stay hidden), while
     * global-scope viewers receive everything.
     */
    private function presentAssignments(User $employee)
    {
        $visible = $this->access->visibleUnitIds();
        $pivots = \DB::table('bms_role_user')->where('user_id', $employee->id)->get();
        $roles = BmsRole::whereIn('id', $pivots->pluck('bms_role_id'))->get()->keyBy('id');
        $units = BusinessUnit::whereIn('id', $pivots->pluck('business_unit_id')->filter())->get()->keyBy('id');

        return $pivots->map(function ($pivot) use ($roles, $units, $visible) {
            $unitId = $pivot->business_unit_id;
            $role = $roles->get($pivot->bms_role_id);
            if ($visible !== null) {
                if ($unitId === null) return null; // global assignments stay hidden from unit-scoped viewers
                if (!in_array((int) $unitId, $visible, true)) return null;
            }

            return [
                'role_id' => $pivot->bms_role_id,
                'role' => $role->name ?? null,
                'slug' => $role->slug ?? null,
                'business_unit_id' => $unitId,
                'business_unit' => $unitId ? ($units->get($unitId)->name ?? null) : null,
                'scope' => $unitId ? 'unit' : 'global',
            ];
        })->filter()->values();
    }

    /**
     * Audit history of role changes (BRD section 18). Only actors with
     * roles.manage may read it. Entries are scoped by the business unit the
     * entry itself belongs to: unit-scoped viewers never see global entries
     * or entries from other units, even when the employee also belongs to one
     * of their units. Global viewers see everything. Deleted employees are
     * rendered as "#id" without failing the request.
     */
    public function roleAudit(Request $request)
    {
        $entries = \App\Models\BMS\BmsAuditLog::with('user:id,username')
            ->whereIn('event', ['role.assigned', 'role.revoked'])
            ->latest()->limit(200)->get();

        $visible = $this->access->visibleUnitIds();
        if ($visible !== null) {
            $entries = $entries->filter(function ($entry) use ($visible) {
                $unitId = ($entry->new_values ?: [])['business_unit_id'] ?? null;
                return $unitId !== null && in_array((int) $unitId, $visible, true);
            })->values();
        }

        // One query for every employee referenced by the scoped entries (no N+1).
        $targets = \App\Models\User::whereIn('id', $entries->pluck('auditable_id'))->get()->keyBy('id');
        $roles = BmsRole::pluck('name', 'id');
        $units = BusinessUnit::pluck('name', 'id');

        return $this->ok($entries->map(function ($entry) use ($targets, $roles, $units) {
            $target = $targets->get($entry->auditable_id);
            $values = $entry->new_values ?: [];

            return [
                'id' => $entry->id,
                'created_at' => $entry->created_at,
                'employee' => $target ? trim($target->firstname.' '.$target->lastname) ?: $target->username : '#'.$entry->auditable_id,
                'event' => $entry->event,
                'role' => $roles->get($values['role_id'] ?? null, '-'),
                'business_unit' => $units->get($values['business_unit_id'] ?? null),
                'user' => $entry->user->username ?? null,
            ];
        })->values());
    }

    private function currentAbilities(): array
    {
        $all = BmsRole::pluck('abilities')->flatMap(fn ($abilities) => $abilities ?: [])->unique();

        return $all->filter(fn ($a) => $this->access->can($a))->values()->all();
    }
}
