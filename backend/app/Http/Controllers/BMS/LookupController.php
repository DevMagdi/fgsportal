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
        $this->authorizeAssignment($target, (int) $data['role_id'], $data['business_unit_id'] ?? null);
        $existing = $target->bmsRoles()->wherePivot('business_unit_id', $data['business_unit_id'] ?? null)
            ->where('bms_roles.id', $data['role_id'])->exists();
        abort_if($existing, 422, 'This role is already assigned at that scope.');
        $target->bmsRoles()->syncWithoutDetaching([
            $data['role_id'] => ['business_unit_id' => $data['business_unit_id'] ?? null],
        ]);
        $this->audit->record($target, 'role.assigned', [], $data);

        return $this->ok($this->assignments($target), 'BMS role assigned');
    }

    public function revokeRole(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role_id' => 'required|exists:bms_roles,id',
            'business_unit_id' => 'nullable|exists:business_units,id',
        ]);
        $target = User::findOrFail($data['user_id']);
        $this->authorizeAssignment($target, (int) $data['role_id'], $data['business_unit_id'] ?? null);
        abort_if($target->id === $this->access->user()->id && empty($data['business_unit_id']), 422, 'You cannot revoke your own global role.');
        $relation = $target->bmsRoles();
        if (empty($data['business_unit_id'])) $relation->wherePivotNull('business_unit_id');
        else $relation->wherePivot('business_unit_id', $data['business_unit_id']);
        $relation->detach($data['role_id']);
        $this->audit->record($target, 'role.revoked', [], $data);

        return $this->ok($this->assignments($target->fresh()), 'BMS role revoked');
    }

    /** Every role assignment of one employee, for the Access & Roles screen. */
    public function assignments(User $employee)
    {
        $visible = $this->access->visibleUnitIds();
        $pivots = \DB::table('bms_role_user')->where('user_id', $employee->id)->get();
        $roles = BmsRole::whereIn('id', $pivots->pluck('bms_role_id'))->get()->keyBy('id');
        $units = BusinessUnit::whereIn('id', $pivots->pluck('business_unit_id')->filter())->get()->keyBy('id');

        return $this->ok($pivots->map(function ($pivot) use ($roles, $units, $visible) {
            $unitId = $pivot->business_unit_id;
            $role = $roles->get($pivot->bms_role_id);
            $inScope = $visible === null || $unitId === null || in_array((int) $unitId, $visible, true);

            return $inScope ? [
                'role_id' => $pivot->bms_role_id,
                'role' => $role->name ?? null,
                'slug' => $role->slug ?? null,
                'business_unit_id' => $unitId,
                'business_unit' => $unitId ? ($units->get($unitId)->name ?? null) : null,
                'scope' => $unitId ? 'unit' : 'global',
            ] : null;
        })->filter()->values());
    }

    /**
     * Role assignment target/scope authorization.
     *
     * Route-level `roles.manage` is not enough: a unit director holding that
     * ability must not be able to grant global roles, System Administrator, or
     * roles scoped to units they cannot see.
     */
    private function authorizeAssignment(User $target, int $roleId, ?int $unitId): void
    {
        $actor = $this->access->user();
        $isAdmin = in_array((int) $actor->sub_departments_id, config('bms.admin_sub_department_ids', [1, 4]), true);
        abort_unless($this->access->can('roles.manage') || $isAdmin, 403, 'You cannot manage BMS roles.');

        $role = BmsRole::findOrFail($roleId);
        if ($role->slug === 'system_admin' && !$isAdmin) {
            abort(403, 'Only Administration may grant or revoke the System Administrator role.');
        }

        $targetUnitIds = $target->businessUnits()->pluck('business_units.id')->all();
        $visible = $this->access->visibleUnitIds();
        if ($visible !== null) {
            $targetInScope = in_array((int) $target->id, array_unique(array_merge($targetUnitIds, [$target->id])), true)
                || array_intersect($targetUnitIds, $visible)
                || (int) $target->id === (int) $actor->id;
            abort_unless($targetInScope, 403, 'This employee is outside your assigned unit scope.');
        }
        if ($unitId !== null) {
            $this->access->authorizeUnit($unitId);
        } elseif ($visible !== null && !$isAdmin) {
            abort(403, 'Global role assignments require global scope.');
        }
    }

    /**
     * Audit history of role changes (BRD section 18). Only actors with
     * roles.manage may read it, and only entries for employees inside their
     * unit scope are returned.
     */
    public function roleAudit(Request $request)
    {
        $entries = \App\Models\BMS\BmsAuditLog::with('user:id,username')
            ->whereIn('event', ['role.assigned', 'role.revoked'])
            ->latest()->limit(200)->get();
        $targets = \App\Models\User::whereIn('id', $entries->pluck('auditable_id'))->get()->keyBy('id');
        $visible = $this->access->visibleUnitIds();
        $roles = BmsRole::pluck('name', 'id');
        $units = BusinessUnit::pluck('name', 'id');

        return $this->ok($entries->map(function ($entry) use ($targets, $visible, $roles, $units) {
            $target = $targets->get($entry->auditable_id);
            if ($visible !== null) {
                $ids = $target ? $target->businessUnits()->pluck('business_units.id')->all() : [];
                if (!array_intersect($ids, $visible)) return null;
            }
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
        })->filter()->values());
    }

    private function currentAbilities(): array
    {
        $all = BmsRole::pluck('abilities')->flatMap(fn ($abilities) => $abilities ?: [])->unique();

        return $all->filter(fn ($a) => $this->access->can($a))->values()->all();
    }
}
