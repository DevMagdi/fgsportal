<?php
namespace App\Http\Controllers\BMS;

use App\Models\BMS\BusinessUnit;
use App\Models\BMS\BmsRole;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class BusinessUnitController extends BmsController
{
    public function index()
    {
        $query = BusinessUnit::with(['parent', 'director:id,username,firstname,lastname,email', 'users:id,username,firstname,lastname,email', 'minutes.meeting']);
        $visibleUnits = $this->access->visibleUnitIds();
        if ($visibleUnits !== null) $query->whereIn('id', $visibleUnits);

        return $this->ok($query->orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $data = $this->validateData($request);
        $data['slug'] = Str::slug($data['name']);
        $unit = BusinessUnit::create($data);
        $unit->users()->sync($request->input('user_ids', []));
        $this->syncDirectorRole($unit);
        $this->audit->record($unit, 'unit.created', [], $unit->toArray());

        return $this->ok($unit->load(['parent', 'director', 'users']), 'Business unit created', 201);
    }

    public function show(BusinessUnit $unit)
    {
        $this->access->authorizeUnit($unit->id);

        return $this->ok($unit->load([
            'parent', 'children', 'director', 'users', 'weeklyPlans.tasks', 'minutes.meeting',
        ])->setAttribute('headcount', $unit->users()->whereNull('deleted_at')->count()));
    }

    public function update(Request $request, BusinessUnit $unit)
    {
        $this->access->authorizeUnit($unit->id);
        $data = $this->validateData($request, $unit->id);
        if (array_key_exists('parent_id', $data)) {
            $this->assertValidParent($unit, $data['parent_id'] ? (int) $data['parent_id'] : null);
        }
        $data['slug'] = Str::slug($data['name']);
        $old = $unit->only(array_keys($data));
        $unit->update($data);
        $detached = [];
        if ($request->has('user_ids')) {
            $changes = $unit->users()->sync($request->input('user_ids', []));
            $detached = array_map('intval', $changes['detached'] ?? []);
        }
        $this->syncDirectorRole($unit);
        // A primary assignment must reference an actual membership (Stage B1): employees removed
        // from this unit lose a primary assignment that pointed at it. Runs after the director
        // has been re-added as a member, so a director is not affected.
        app(\App\Services\BMS\PrimaryAssignment::class)->clearOrphans($detached);
        $this->audit->record($unit, 'unit.updated', $old, $unit->only(array_keys($data)));

        return $this->ok($unit->load(['parent', 'director', 'users']));
    }

    /**
     * Safe deletion. A unit that still owns business records is never deleted;
     * the API asks the caller to deactivate it instead (BRD: archive historical
     * data instead of destroying it).
     */
    public function destroy(BusinessUnit $unit)
    {
        $this->access->authorizeUnit($unit->id);
        $dependencies = $this->dependencies($unit);
        abort_if($dependencies !== [], 422, 'This unit still has '.implode(', ', $dependencies).'. Deactivate it instead of deleting it.');
        $snapshot = $unit->toArray();
        $unit->delete();
        $this->audit->record($unit, 'unit.deleted', $snapshot, []);

        return $this->ok(null, 'Business unit deleted');
    }

    /** Activate / deactivate without destroying history. */
    public function status(Request $request, BusinessUnit $unit)
    {
        $this->access->authorizeUnit($unit->id);
        $data = $request->validate(['is_active' => 'required|boolean']);
        $unit->update(['is_active' => (bool) $data['is_active']]);
        $this->audit->record($unit, $data['is_active'] ? 'unit.activated' : 'unit.deactivated', [], ['is_active' => (bool) $data['is_active']]);

        return $this->ok($unit->load(['parent', 'director', 'users']));
    }

    private function validateData(Request $request, ?int $id = null): array
    {
        return $request->validate([
            'parent_id' => 'nullable|exists:business_units,id',
            'name' => ['required', 'string', 'max:150', Rule::unique('business_units', 'name')->ignore($id)],
            'description' => 'nullable|string', 'key_messages' => 'nullable|string', 'services' => 'nullable|array', 'services.*' => 'string|max:255',
            'director_id' => 'nullable|exists:users,id', 'is_active' => 'sometimes|boolean',
            'user_ids' => 'sometimes|array', 'user_ids.*' => 'exists:users,id',
        ]);
    }

    /**
     * Hierarchy guard: a unit can never be its own parent nor a child of one of
     * its descendants (which would create an infinite loop and break the tree).
     */
    private function assertValidParent(BusinessUnit $unit, ?int $parentId): void
    {
        if ($parentId === null) return;
        abort_if($parentId === $unit->id, 422, 'A unit cannot be its own parent.');
        $cursor = BusinessUnit::find($parentId);
        $guard = 0;
        while ($cursor && $guard++ < 100) {
            abort_if($cursor->id === $unit->id, 422, 'A unit cannot become a child of one of its descendants.');
            $cursor = $cursor->parent_id ? BusinessUnit::find($cursor->parent_id) : null;
        }
    }

    /** @return string[] human readable list of blocking business records */
    private function dependencies(BusinessUnit $unit): array
    {
        $checks = [
            'child units' => \App\Models\BMS\BusinessUnit::where('parent_id', $unit->id)->exists(),
            'weekly plans' => $unit->weeklyPlans()->exists(),
            'employee task records' => \App\Models\BMS\UnitTask::where('business_unit_id', $unit->id)->exists(),
            'opportunities' => \App\Models\BMS\Opportunity::where('business_unit_id', $unit->id)->exists(),
            'leads' => \App\Models\BMS\Lead::where('business_unit_id', $unit->id)->exists(),
            'product assignments' => \DB::table('product_business_unit')->where('business_unit_id', $unit->id)->exists(),
            'meetings' => \App\Models\BMS\Meeting::where('business_unit_id', $unit->id)->exists(),
            'member assignments' => $unit->users()->exists(),
            'certificates' => \App\Models\BMS\EmployeeCertificate::where('business_unit_id', $unit->id)->exists(),
        ];

        return array_keys(array_filter($checks));
    }

    private function syncDirectorRole(BusinessUnit $unit): void
    {
        if (!$unit->director_id) return;
        $role = BmsRole::where('slug', 'unit_director')->first();
        if ($role) $unit->director->bmsRoles()->syncWithoutDetaching([$role->id => ['business_unit_id' => $unit->id]]);
        $unit->users()->syncWithoutDetaching([$unit->director_id]);
    }
}
