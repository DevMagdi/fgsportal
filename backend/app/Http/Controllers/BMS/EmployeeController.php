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

        $managerId = $this->validatedManagerId($data['manager_id'] ?? null);
        $employee = DB::transaction(function () use ($data, $managerId) {
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
            $attributes['manager_id'] = $managerId;
            // Legacy installations and the test schema do not all carry the
            // same optional columns; only write what this database really has.
            if (\Schema::hasColumn('users', 'mobileNumber')) $attributes['mobileNumber'] = $data['mobile_number'] ?? null;
            if (\Schema::hasColumn('users', 'gender')) $attributes['gender'] = $data['gender'] ?? null;
            $attributes = $this->onlyExistingColumns($attributes);

            $employee = User::create($attributes);
            // manager_id is excluded from the legacy User fillable list. Persist
            // this value only after the validatedManagerId scope/cycle checks above.
            if (array_key_exists('manager_id', $attributes)) {
                $employee->manager_id = $attributes['manager_id'];
                $employee->save();
            }
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

    /** CSV template so administrators never have to guess the column names. */
    public function importTemplate()
    {
        $this->access->authorize('directory.manage');
        $headers = ['username', 'email', 'firstname', 'lastname', 'password', 'mobile_number',
            'hiring_date', 'work_degrees_id', 'sub_departments_id', 'manager_username', 'business_units'];
        $csv = implode(',', $headers)."\n";
        $csv .= 'ahmed.ali,ahmed.ali@example.com,Ahmed,Ali,ChangeMe123,0500000000,2026-01-01,,,manager.user,Alpha Delta|Beta Unit'."\n";

        return response($csv, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="bms-employee-import-template.csv"',
        ]);
    }

    /**
     * Bulk employee import (BRD §4.1). Two-phase by design:
     * `dry_run=1` validates and returns a per-row preview, `dry_run=0` writes every
     * valid row inside one transaction. Rows that fail are reported, never
     * half-written, and duplicates are matched — never re-created.
     */
    public function import(Request $request)
    {
        $this->access->authorize('directory.manage');
        $dryRun = $request->boolean('dry_run', true);
        if ($request->hasFile('file')) {
            $request->validate(['file' => 'required|file|mimes:csv,txt|max:5120']);
            $rows = $this->csvRows($request->file('file')->getRealPath());
        } else {
            $request->validate(['rows' => 'required|array|min:1|max:500', 'rows.*' => 'array']);
            $rows = array_values($request->input('rows'));
        }

        $companyId = $this->access->user()->company_id;
        $preview = [];
        // Duplicates *inside the uploaded file* must be caught before commit:
        // two rows sharing a username (or email) case-insensitively would make the
        // second insert violate the unique index or silently overwrite a colleague.
        $seenUsernames = [];
        $seenEmails = [];
        foreach ($rows as $index => $row) {
            $row = (array) $row;
            $result = $this->inspectImportRow($row, $index + 1, $companyId);
            $username = mb_strtolower(trim((string) ($row['username'] ?? '')));
            $email = mb_strtolower(trim((string) ($row['email'] ?? '')));
            if ($username !== '') {
                if (isset($seenUsernames[$username])) {
                    $result['errors'][] = 'username duplicated in this file (also on row '.$seenUsernames[$username].')';
                    $result['status'] = 'duplicate_in_file';
                } else { $seenUsernames[$username] = $index + 1; }
            }
            if ($email !== '') {
                if (isset($seenEmails[$email])) {
                    $result['errors'][] = 'email duplicated in this file (also on row '.$seenEmails[$email].')';
                    $result['status'] = 'duplicate_in_file';
                } else { $seenEmails[$email] = $index + 1; }
            }
            $preview[] = $result;
        }
        $valid = array_values(array_filter($preview, fn ($r) => empty($r['errors']) && $r['status'] === 'new'));
        $summary = [
            'total' => count($preview),
            'valid' => count($valid),
            'invalid' => count($preview) - count($valid),
            'created' => 0,
            'skipped' => count(array_filter($preview, fn ($r) => in_array($r['status'], ['existing', 'duplicate_in_file'], true))),
            'duplicate_in_file' => count(array_filter($preview, fn ($r) => $r['status'] === 'duplicate_in_file')),
        ];

        if ($dryRun) {
            $public = array_map(function ($row) {
                unset($row['attributes']); // never expose hashes or prepared payloads
                return $row;
            }, $preview);
            return $this->ok(['dry_run' => true, 'rows' => $public, 'summary' => $summary], 'Import preview');
        }

        $created = 0;
        DB::transaction(function () use ($valid, &$created) {
            foreach ($valid as $row) {
                // Re-check inside the transaction: a concurrent request could have
                // created the same account between preview and commit.
                $exists = User::whereRaw('LOWER(username) = ?', [mb_strtolower((string) $row['attributes']['username'])])
                    ->orWhereRaw('LOWER(email) = ?', [mb_strtolower((string) $row['attributes']['email'])])->exists();
                if ($exists) continue;
                $detail = UserDetail::create(['hiringDate' => $row['attributes']['hiring_date'] ?? null]);
                $attributes = $row['attributes'];
                unset($attributes['hiring_date'], $attributes['business_units'], $attributes['manager_username']);
                $attributes['user_details_id'] = $detail->id;
                $attributes['user_creator_id'] = $this->access->user()->id;
                $attributes['company_id'] = $this->access->user()->company_id;
                $attributes['active'] = true;
                $employee = User::create($this->onlyExistingColumns($attributes));
                $employee->businessUnits()->sync($row['unit_ids']);
                $employee->manager_id = $row['manager_id'];
                $employee->save();
                $this->audit->record($employee, 'employee.imported', [], [
                    'username' => $employee->username, 'row' => $row['row'],
                    'business_unit_ids' => $row['unit_ids'], 'manager_id' => $row['manager_id'],
                ]);
                $created++;
            }
        });
        $summary['created'] = $created;

        $public = array_map(function ($row) { unset($row['attributes']); return $row; }, $preview);
        return $this->ok(['dry_run' => false, 'rows' => $public, 'summary' => $summary], 'Import completed');
    }

    /** Validate one import row without writing anything. */
    private function inspectImportRow(array $row, int $rowNumber, $companyId): array
    {
        $result = ['row' => $rowNumber, 'username' => $row['username'] ?? null, 'status' => 'new', 'errors' => []];
        foreach (['username', 'email', 'firstname', 'lastname', 'password'] as $required) {
            if (empty($row[$required])) $result['errors'][] = $required.' is required';
        }
        if (!empty($row['email']) && !filter_var($row['email'], FILTER_VALIDATE_EMAIL)) $result['errors'][] = 'email is invalid';
        if (!empty($row['password']) && strlen((string) $row['password']) < 8) $result['errors'][] = 'password must be at least 8 characters';
        if (!empty($row['hiring_date']) && !strtotime((string) $row['hiring_date'])) $result['errors'][] = 'hiring_date is invalid';

        $existing = null;
        if (!empty($row['username'])) $existing = User::where('username', $row['username'])->first();
        if (!$existing && !empty($row['email'])) $existing = User::where('email', $row['email'])->first();
        if ($existing) {
            $result['status'] = 'existing';
            $this->authorizeEmployee($existing);
        }

        $unitIds = [];
        foreach (preg_split('/[|,;]/', (string) ($row['business_units'] ?? '')) as $unitName) {
            $unitName = trim($unitName);
            if ($unitName === '') continue;
            $unit = BusinessUnit::where('name', $unitName)
                ->when($companyId, fn ($q) => $q->where('company_id', $companyId))->first();
            if (!$unit) { $result['errors'][] = 'unknown business unit: '.$unitName; continue; }
            $unitIds[] = $unit->id;
        }
        if (!$unitIds) $result['errors'][] = 'at least one business unit is required';
        try { $this->authorizeUnits($unitIds); } catch (\Symfony\Component\HttpKernel\Exception\HttpException $e) {
            $result['errors'][] = 'business unit outside your scope';
        }

        $managerId = null;
        if (!empty($row['manager_username'])) {
            $manager = User::where('username', $row['manager_username'])->first();
            if (!$manager) $result['errors'][] = 'unknown manager: '.$row['manager_username'];
            else { try { $managerId = $this->validatedManagerId($manager->id); } catch (\Symfony\Component\HttpKernel\Exception\HttpException $e) { $result['errors'][] = $e->getMessage(); } }
        }

        if ($existing) $result['status'] = 'existing';

        // Passwords are hashed immediately and never echoed in the preview.
        $result['attributes'] = [
            'username' => $row['username'] ?? null, 'email' => $row['email'] ?? null,
            'firstname' => $row['firstname'] ?? null, 'lastname' => $row['lastname'] ?? null,
            'password' => !empty($row['password']) ? Hash::make($row['password']) : null,
            'mobileNumber' => $row['mobile_number'] ?? null,
            'hiring_date' => $row['hiring_date'] ?? null,
            'work_degrees_id' => ($row['work_degrees_id'] ?? null) ?: null,
            'sub_departments_id' => ($row['sub_departments_id'] ?? null) ?: null,
        ];
        $result['business_units'] = $unitIds;
        $result['unit_ids'] = $unitIds;
        $result['manager_id'] = $managerId;

        return $result;
    }

    private function csvRows(string $path): array
    {
        $handle = fopen($path, 'r');
        $headers = fgetcsv($handle);
        if (!$headers || count(array_filter($headers)) === 0) { fclose($handle); return []; }
        $headers = array_map(fn ($h) => trim((string) $h), $headers);
        $rows = [];
        while (($values = fgetcsv($handle)) !== false) {
            if (count($values) !== count($headers)) { $rows[] = ['username' => null, 'email' => '', 'firstname' => '', 'lastname' => '', 'password' => '']; continue; }
            $rows[] = array_combine($headers, $values);
        }
        fclose($handle);
        return $rows;
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
            if (array_key_exists('manager_id', $data)) {
                $attributes['manager_id'] = $this->validatedManagerId($data['manager_id'], $employee);
            }
            if (!empty($data['password'])) $attributes['password'] = Hash::make($data['password']);
            if (array_key_exists('mobile_number', $data) && \Schema::hasColumn('users', 'mobileNumber')) {
                $attributes['mobileNumber'] = $data['mobile_number'];
            }
            if (array_key_exists('gender', $data) && \Schema::hasColumn('users', 'gender')) {
                $attributes['gender'] = $data['gender'];
            }
            $employee->update($this->onlyExistingColumns($attributes));
            // User::$fillable intentionally excludes manager_id; persist the
            // validated assignment (including an explicit null to clear it)
            // after the existing manager scope/cycle checks.
            if (array_key_exists('manager_id', $attributes) && \Schema::hasColumn('users', 'manager_id')) {
                $employee->manager_id = $attributes['manager_id'];
                $employee->save();
            }
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

    /**
     * Validate a reporting line: the manager must exist in this company, must be
     * visible to the actor, and the assignment must not close a reporting cycle.
     * Returns the value that is safe to persist (null clears the reporting line).
     */
    private function validatedManagerId($managerId, ?User $employee = null): ?int
    {
        if ($managerId === null || $managerId === '' || !\Schema::hasColumn('users', 'manager_id')) {
            return null;
        }
        $managerId = (int) $managerId;
        abort_if($employee && $managerId === (int) $employee->id, 422, 'An employee cannot be their own manager.');
        $manager = User::find($managerId);
        abort_if(!$manager, 422, 'The selected manager does not exist.');
        // Cross-company managers are never allowed, even for global admins.
        abort_if($manager->company_id && $this->access->user()->company_id && (int) $manager->company_id !== (int) $this->access->user()->company_id, 422, 'The selected manager belongs to another company.');
        // Unit-scoped actors may only point at people they can already see.
        if (!$this->access->hasGlobalUnitScope()) {
            $visible = $this->access->visibleUnitIds() ?? [];
            $shared = $manager->businessUnits()->whereIn('business_units.id', $visible)->exists();
            abort_unless($shared, 403, 'The selected manager is outside your business units.');
        }
        // Walk up the proposed manager's chain: hitting the employee is a cycle.
        if ($employee) {
            $cursor = $manager;
            $seen = [];
            while ($cursor && !isset($seen[$cursor->id])) {
                abort_if((int) $cursor->id === (int) $employee->id, 422, 'That reporting line would create a cycle.');
                $seen[$cursor->id] = true;
                $cursor = $cursor->manager;
            }
        }
        return $managerId;
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
     * may never assign a role beyond the units they can already see. The full
     * policy (including the Phase 1 privilege-escalation restrictions) is
     * centralized in BmsAccess::authorizeRoleChange() so employee creation,
     * role assignment and revocation cannot drift apart.
     */
    private function authorizeRoleAssignment(int $roleId, ?int $unitId): void
    {
        $this->access->authorizeRoleChange(null, BmsRole::findOrFail($roleId), $unitId, 'create');
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
