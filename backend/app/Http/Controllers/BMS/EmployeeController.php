<?php
namespace App\Http\Controllers\BMS;

use App\Models\BMS\BmsRole;
use App\Models\BMS\BusinessUnit;
use App\Models\User;
use App\Models\UserDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

/**
 * Employee administration (BRD M10 + section 5 of the completion brief).
 *
 * Reuses the legacy `users` / `user_details` tables and the BMS pivot tables;
 * no duplicate employee entity is introduced. Every action is unit-scoped on
 * the server: an actor outside a unit can neither read nor mutate its staff.
 */
class EmployeeController extends BmsController
{
    public function index(Request $request)
    {
        $filters = $request->validate([
            'search' => 'nullable|string|max:100',
            'business_unit_id' => 'nullable|exists:business_units,id',
            'work_degrees_id' => 'nullable|exists:work_degrees,id',
            'active' => 'nullable|in:0,1',
            'role_id' => 'nullable|exists:bms_roles,id',
        ]);
        if (!empty($filters['business_unit_id'])) {
            $this->access->authorizeUnit((int) $filters['business_unit_id']);
        }

        $query = User::with(['work_degrees_id_fun', 'businessUnits:id,name', 'user_details_id_fun', 'bmsRoles', 'manager:id,username,firstname,lastname'])
            ->whereNull('deleted_at');

        $visible = $this->access->visibleUnitIds();
        if ($visible !== null) {
            $query->where(function ($scoped) use ($visible) {
                $scoped->whereHas('businessUnits', fn ($q) => $q->whereIn('business_units.id', $visible))
                    ->orWhere('id', $this->access->user()->id);
            });
        }
        if (array_key_exists('active', $filters) && $filters['active'] !== null) {
            $query->where('active', (int) $filters['active']);
        }
        if (!empty($filters['business_unit_id'])) {
            $query->whereHas('businessUnits', fn ($q) => $q->where('business_units.id', $filters['business_unit_id']));
        }
        if (!empty($filters['work_degrees_id'])) {
            $query->where('work_degrees_id', $filters['work_degrees_id']);
        }
        if (!empty($filters['role_id'])) {
            $query->whereHas('bmsRoles', fn ($q) => $q->where('bms_roles.id', $filters['role_id']));
        }
        if (!empty($filters['search'])) {
            $term = '%'.$filters['search'].'%';
            $query->where(function ($q) use ($term) {
                $q->where('username', 'like', $term)->orWhere('firstname', 'like', $term)
                    ->orWhere('lastname', 'like', $term)->orWhere('email', 'like', $term);
            });
        }

        $employees = $query->orderBy('firstname')->orderBy('username')->paginate(50);

        return $this->ok([
            'data' => collect($employees->items())->map(fn (User $user) => $this->present($user))->values(),
            'meta' => [
                'current_page' => $employees->currentPage(),
                'last_page' => $employees->lastPage(),
                'per_page' => $employees->perPage(),
                'total' => $employees->total(),
            ],
        ]);
    }

    public function show(User $employee)
    {
        $this->authorizeEmployee($employee);

        return $this->ok($this->present($employee->load([
            'work_degrees_id_fun', 'businessUnits:id,name,parent_id', 'user_details_id_fun', 'bmsRoles', 'manager:id,username,firstname,lastname',
        ])));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'username' => 'required|string|max:50|unique:users,username',
            'email' => 'required|email|max:50|unique:users,email',
            'firstname' => 'required|string|max:20',
            'lastname' => 'required|string|max:20',
            'password' => 'required|string|min:8',
            'mobile_number' => 'nullable|string|max:60',
            'gender' => 'nullable|string|max:10',
            'work_degrees_id' => 'nullable|exists:work_degrees,id',
            'sub_departments_id' => 'nullable|exists:sub_departments,id',
            'hiring_date' => 'nullable|date',
            'manager_id' => 'nullable|exists:users,id',
            'active' => 'sometimes|boolean',
            'business_unit_ids' => 'required|array|min:1',
            'business_unit_ids.*' => 'exists:business_units,id',
            'role_id' => 'nullable|exists:bms_roles,id',
            'role_business_unit_id' => 'nullable|exists:business_units,id',
        ]);
        $this->authorizeUnits($data['business_unit_ids']);
        if (!empty($data['role_id'])) {
            $this->authorizeRoleAssignment((int) $data['role_id'], $data['role_business_unit_id'] ?? null);
        }

        $employee = DB::transaction(function () use ($data) {
            $detail = UserDetail::create(['hiringDate' => $data['hiring_date'] ?? null]);
            $attributes = [
                'username' => $data['username'],
                'email' => $data['email'],
                'firstname' => $data['firstname'],
                'lastname' => $data['lastname'],
                'password' => Hash::make($data['password']),
                'active' => $data['active'] ?? true,
                'user_creator_id' => $this->access->user()->id,
                'user_details_id' => $detail->id,
                'work_degrees_id' => $data['work_degrees_id'] ?? null,
                'sub_departments_id' => $data['sub_departments_id'] ?? null,
                'company_id' => $this->access->user()->company_id,
            ];
            if (!empty($data['manager_id']) && \Schema::hasColumn('users', 'manager_id')) {
                abort_if((int) $data['manager_id'] === (int) $this->access->user()->id && false, 422);
                $attributes['manager_id'] = $data['manager_id'];
            }
            // Legacy installations and the test schema do not all carry the
            // same optional columns; only write what this database really has.
            if (\Schema::hasColumn('users', 'mobileNumber')) $attributes['mobileNumber'] = $data['mobile_number'] ?? null;
            if (\Schema::hasColumn('users', 'gender')) $attributes['gender'] = $data['gender'] ?? null;
            $attributes = $this->onlyExistingColumns($attributes);

            $employee = User::create($attributes);
            $employee->businessUnits()->sync($data['business_unit_ids']);
            if (!empty($data['role_id'])) {
                $employee->bmsRoles()->syncWithoutDetaching([
                    $data['role_id'] => ['business_unit_id' => $data['role_business_unit_id'] ?? null],
                ]);
            }
            $this->audit->record($employee, 'employee.created', [], [
                'username' => $employee->username,
                'email' => $employee->email,
                'business_unit_ids' => $data['business_unit_ids'],
                'role_id' => $data['role_id'] ?? null,
            ]);

            return $employee;
        });

        return $this->ok($this->present($employee->fresh(['work_degrees_id_fun', 'businessUnits', 'bmsRoles', 'manager:id,username,firstname,lastname'])), 'Employee created', 201);
    }

    public function update(Request $request, User $employee)
    {
        $this->authorizeEmployee($employee);
        $data = $request->validate([
            'username' => ['sometimes', 'string', 'max:50', Rule::unique('users', 'username')->ignore($employee->id)],
            'email' => ['sometimes', 'email', 'max:50', Rule::unique('users', 'email')->ignore($employee->id)],
            'firstname' => 'sometimes|string|max:20',
            'lastname' => 'sometimes|string|max:20',
            'mobile_number' => 'nullable|string|max:60',
            'gender' => 'nullable|string|max:10',
            'work_degrees_id' => 'nullable|exists:work_degrees,id',
            'sub_departments_id' => 'nullable|exists:sub_departments,id',
            'hiring_date' => 'nullable|date',
            'manager_id' => 'nullable|exists:users,id',
            'active' => 'sometimes|boolean',
            'business_unit_ids' => 'sometimes|array|min:1',
            'business_unit_ids.*' => 'exists:business_units,id',
            'password' => 'sometimes|string|min:8',
        ]);
        if (isset($data['business_unit_ids'])) {
            $this->authorizeUnits($data['business_unit_ids']);
        }

        DB::transaction(function () use ($employee, $data) {
            $old = $employee->only(['username', 'email', 'firstname', 'lastname', 'active']);
            $attributes = array_filter([
                'username' => $data['username'] ?? null,
                'email' => $data['email'] ?? null,
                'firstname' => $data['firstname'] ?? null,
                'lastname' => $data['lastname'] ?? null,
                'work_degrees_id' => $data['work_degrees_id'] ?? null,
                'sub_departments_id' => $data['sub_departments_id'] ?? null,
            ], fn ($value) => $value !== null);
            if (array_key_exists('active', $data)) $attributes['active'] = (bool) $data['active'];
            if (array_key_exists('manager_id', $data) && \Schema::hasColumn('users', 'manager_id')) {
                abort_if((int) ($data['manager_id'] ?? 0) === (int) $employee->id, 422, 'An employee cannot be their own manager.');
                $attributes['manager_id'] = $data['manager_id'];
            }
            if (!empty($data['password'])) $attributes['password'] = Hash::make($data['password']);
            if (array_key_exists('mobile_number', $data) && \Schema::hasColumn('users', 'mobileNumber')) {
                $attributes['mobileNumber'] = $data['mobile_number'];
            }
            if (array_key_exists('gender', $data) && \Schema::hasColumn('users', 'gender')) {
                $attributes['gender'] = $data['gender'];
            }
            $employee->update($this->onlyExistingColumns($attributes));
            if (array_key_exists('hiring_date', $data)) {
                if ($employee->user_details_id_fun) {
                    $employee->user_details_id_fun->update(['hiringDate' => $data['hiring_date']]);
                } else {
                    $detail = UserDetail::create(['hiringDate' => $data['hiring_date']]);
                    $employee->update(['user_details_id' => $detail->id]);
                }
            }
            if (isset($data['business_unit_ids'])) {
                $employee->businessUnits()->sync($data['business_unit_ids']);
            }
            $this->audit->record($employee, 'employee.updated', $old, $employee->fresh()->only(array_keys($old + [
                'username' => null, 'email' => null, 'firstname' => null, 'lastname' => null, 'active' => null,
            ])));
        });

        return $this->ok($this->present($employee->fresh(['work_degrees_id_fun', 'businessUnits', 'bmsRoles', 'manager:id,username,firstname,lastname'])));
    }

    public function status(Request $request, User $employee)
    {
        $this->authorizeEmployee($employee);
        $data = $request->validate(['active' => 'required|boolean']);
        abort_if($employee->id === $this->access->user()->id, 422, 'You cannot change your own account status.');
        $old = ['active' => $employee->active];
        $employee->update(['active' => (bool) $data['active']]);
        $this->audit->record($employee, $data['active'] ? 'employee.activated' : 'employee.deactivated', $old, ['active' => (bool) $data['active']]);

        return $this->ok($this->present($employee->fresh(['work_degrees_id_fun', 'businessUnits', 'bmsRoles'])));
    }

    public function uploadPhoto(Request $request, User $employee)
    {
        $this->authorizeEmployee($employee);
        $request->validate(['photo' => 'required|file|mimes:png,jpg,jpeg,webp|max:4096']);
        $file = $request->file('photo');
        $path = $file->store('bms/photos', 'local');
        $previous = $employee->photoURL;
        $employee->update(['photoURL' => basename($path)]);
        $this->audit->record($employee, 'employee.photo_updated', ['photo' => $previous], ['photo' => basename($path)]);

        return $this->ok(['photo_url' => '/api/bms/employees/'.$employee->id.'/photo'], 'Photo updated');
    }

    public function photo(User $employee)
    {
        $this->authorizeEmployee($employee);
        $path = 'bms/photos/'.$employee->photoURL;
        abort_unless($employee->photoURL && Storage::disk('local')->exists($path), 404);

        return Storage::disk('local')->response($path);
    }

    private function authorizeEmployee(User $employee): void
    {
        $ids = $employee->businessUnits()->pluck('business_units.id')->all();
        $visible = $this->access->visibleUnitIds();
        if ($visible === null) return;
        abort_unless(in_array($employee->id, [$this->access->user()->id], true) || array_intersect($ids, $visible), 403, 'This employee is outside your assigned unit scope.');
    }

    private function onlyExistingColumns(array $attributes): array
    {
        $columns = \Schema::getColumnListing('users');

        return array_filter($attributes, fn ($key) => in_array($key, $columns, true), ARRAY_FILTER_USE_KEY);
    }

    private function authorizeUnits(array $unitIds): void
    {
        foreach ($unitIds as $unitId) {
            $this->access->authorizeUnit((int) $unitId);
        }
    }

    /**
     * Only global administrators may hand out global roles, and a unit manager
     * may never assign a role beyond the units they can already see. Nobody can
     * grant themselves a wider role.
     */
    private function authorizeRoleAssignment(int $roleId, ?int $unitId): void
    {
        $actor = $this->access->user();
        $role = BmsRole::findOrFail($roleId);
        $isAdmin = in_array((int) $actor->sub_departments_id, config('bms.admin_sub_department_ids', [1, 4]), true);
        abort_unless($this->access->can('roles.manage') || $isAdmin, 403, 'You cannot assign BMS roles.');
        if ($unitId !== null) {
            $this->access->authorizeUnit($unitId);
        }
        if ($role->slug === 'system_admin' && !$isAdmin) {
            abort(403, 'Only Administration may grant the System Administrator role.');
        }
        if ($unitId === null && !$this->access->hasGlobalUnitScope() && !$isAdmin) {
            abort(403, 'Global role assignments require global scope.');
        }
    }

    private function present(User $user): array
    {
        $degree = $user->work_degrees_id_fun;
        $detail = $user->user_details_id_fun;

        return [
            'id' => $user->id,
            'name' => trim($user->firstname.' '.$user->lastname) ?: $user->username,
            'username' => $user->username,
            'email' => $user->email,
            'job_title' => $degree->work_degree_name ?? $degree->name ?? null,
            'work_degrees_id' => $user->work_degrees_id,
            'business_units' => $user->businessUnits,
            'hiring_date' => $detail->hiringDate ?? null,
            'manager_id' => $user->manager_id ?? null,
            'manager' => $user->manager ? (trim($user->manager->firstname.' '.$user->manager->lastname) ?: $user->manager->username) : null,
            'active' => (bool) $user->active,
            'roles' => $user->bmsRoles->map(fn ($role) => [
                'id' => $role->id, 'name' => $role->name, 'slug' => $role->slug,
                'business_unit_id' => $role->pivot->business_unit_id,
            ])->values(),
            'photo_url' => $user->photoURL ? '/api/bms/employees/'.$user->id.'/photo' : null,
            'has_photo' => (bool) $user->photoURL,
        ];
    }
}
