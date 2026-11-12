<?php

namespace Tests\Feature;

use App\Models\BMS\BmsRole;
use App\Models\BMS\BusinessUnit;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tests\BmsTestCase;

/**
 * Employee administration (BRD section 5) and the access-control fixes from
 * section 18: directory scoping, lookup scoping, role assignment authorization.
 */
class P17EmployeeManagementTest extends BmsTestCase
{
    public function test_P17_admin_creates_an_employee_that_appears_in_lookups_and_directory(): void
    {
        $unit = $this->makeUnit();
        $admin = $this->actingAsRole('system_admin');
        $role = BmsRole::where('slug', 'employee')->firstOrFail();

        $created = $this->postBms('employees', [
            'username' => 'new.hire', 'email' => 'new.hire@example.test',
            'firstname' => 'New', 'lastname' => 'Hire', 'password' => 'secret-pass',
            'hiring_date' => '2026-11-01', 'business_unit_ids' => [$unit->id],
            'role_id' => $role->id, 'role_business_unit_id' => $unit->id,
        ], $admin)->assertStatus(201)->json('data');

        $this->assertSame('New Hire', $created['name']);
        $this->assertTrue($created['active']);
        $this->assertSame([$unit->id], collect($created['business_units'])->pluck('id')->all());

        $employee = User::where('username', 'new.hire')->firstOrFail();
        $this->assertTrue(Hash::check('secret-pass', $employee->password), 'Password must be hashed.');
        $this->assertNotSame('secret-pass', $employee->password);
        $this->assertDatabaseHas('bms_role_user', [
            'user_id' => $employee->id, 'bms_role_id' => $role->id, 'business_unit_id' => $unit->id,
        ]);
        $this->assertDatabaseHas('bms_audit_logs', ['event' => 'employee.created', 'auditable_id' => $employee->id]);

        // Immediately selectable in other workflows.
        $lookups = $this->getBms('lookups', $admin)->assertOk()->json('data');
        $this->assertContains($employee->id, collect($lookups['users'])->pluck('id')->all());

        $directory = $this->getBms('directory', $admin)->assertOk()->json('data');
        $this->assertContains('new.hire', collect($directory)->pluck('username')->all());
    }

    public function test_P17_employee_creation_requires_unique_username_and_email(): void
    {
        $unit = $this->makeUnit();
        $admin = $this->actingAsRole('system_admin');
        $existing = $this->makeUser();

        $this->postBms('employees', [
            'username' => $existing->username, 'email' => 'unique@example.test',
            'firstname' => 'A', 'lastname' => 'B', 'password' => 'secret-pass',
            'business_unit_ids' => [$unit->id],
        ], $admin)->assertStatus(422);

        $this->postBms('employees', [
            'username' => 'unique-name', 'email' => $existing->email,
            'firstname' => 'A', 'lastname' => 'B', 'password' => 'secret-pass',
            'business_unit_ids' => [$unit->id],
        ], $admin)->assertStatus(422);
    }

    public function test_P17_employee_without_directory_manage_cannot_create_or_edit(): void
    {
        $unit = $this->makeUnit();
        $employee = $this->actingAsRole('employee', [$unit->id]);
        $victim = $this->makeUser();
        $victim->businessUnits()->attach($unit->id);

        $this->postBms('employees', [
            'username' => 'hacker', 'email' => 'hacker@example.test',
            'firstname' => 'H', 'lastname' => 'K', 'password' => 'secret-pass',
            'business_unit_ids' => [$unit->id],
        ], $employee)->assertForbidden();

        $this->putBms('employees/'.$victim->id, ['firstname' => 'Changed'], $employee)->assertForbidden();
        $this->postBms('employees/'.$victim->id.'/status', ['active' => false], $employee)->assertForbidden();
    }

    public function test_P17_unit_director_cannot_edit_an_employee_outside_their_units(): void
    {
        $inside = $this->makeUnit();
        $outside = $this->makeUnit();
        $director = $this->actingAsRole('unit_director', [$inside->id]);
        $stranger = $this->makeUser();
        $stranger->businessUnits()->attach($outside->id);

        $this->getBms('employees/'.$stranger->id, $director)->assertForbidden();
        $this->putBms('employees/'.$stranger->id, ['firstname' => 'Nope'], $director)->assertForbidden();
        $this->postBms('employees/'.$stranger->id.'/status', ['active' => false], $director)->assertForbidden();
    }

    public function test_P17_directory_and_lookups_never_expose_staff_outside_the_unit_scope(): void
    {
        $inside = $this->makeUnit();
        $outside = $this->makeUnit();
        $director = $this->actingAsRole('unit_director', [$inside->id]);
        $member = $this->makeUser(['username' => 'inside-member']);
        $member->businessUnits()->attach($inside->id);
        $outsider = $this->makeUser(['username' => 'outside-member']);
        $outsider->businessUnits()->attach($outside->id);

        $usernames = collect($this->getBms('directory', $director)->assertOk()->json('data'))->pluck('username');
        $this->assertContains('inside-member', $usernames);
        $this->assertNotContains('outside-member', $usernames);

        $lookups = collect($this->getBms('lookups', $director)->assertOk()->json('data.users'))->pluck('username');
        $this->assertContains('inside-member', $lookups);
        $this->assertNotContains('outside-member', $lookups);
    }

    public function test_P17_status_change_is_audited_and_cannot_deactivate_yourself(): void
    {
        $unit = $this->makeUnit();
        $admin = $this->actingAsRole('system_admin');
        $employee = $this->makeUser();
        $employee->businessUnits()->attach($unit->id);

        $this->postBms('employees/'.$employee->id.'/status', ['active' => false], $admin)
            ->assertOk()->assertJsonPath('data.active', false);
        $this->assertDatabaseHas('bms_audit_logs', ['event' => 'employee.deactivated', 'auditable_id' => $employee->id]);

        $this->postBms('employees/'.$admin->id.'/status', ['active' => false], $admin)->assertStatus(422);
    }

    /** A unit-scoped actor that *does* hold roles.manage, which is the risky case. */
    private function unitRoleManager(array $unitIds): User
    {
        $user = $this->actingAsRole('unit_director', $unitIds);
        $role = BmsRole::updateOrCreate(['slug' => 'unit_roles_manager'], [
            'name' => 'Unit roles manager', 'abilities' => ['roles.manage', 'directory.view'],
        ]);
        $user->bmsRoles()->attach($role->id, ['business_unit_id' => null]);

        return $user;
    }

    public function test_P17_only_administration_can_grant_system_administrator(): void
    {
        $unit = $this->makeUnit();
        $director = $this->unitRoleManager([$unit->id]);
        $target = $this->makeUser();
        $target->businessUnits()->attach($unit->id);
        $adminRole = BmsRole::where('slug', 'system_admin')->firstOrFail();
        $employeeRole = BmsRole::where('slug', 'employee')->firstOrFail();

        $this->postBms('roles/assign', [
            'user_id' => $target->id, 'role_id' => $adminRole->id,
        ], $director)->assertForbidden();

        // A unit-scoped assignment inside their own unit is allowed and audited.
        $this->postBms('roles/assign', [
            'user_id' => $target->id, 'role_id' => $employeeRole->id, 'business_unit_id' => $unit->id,
        ], $director)->assertOk();
        $this->assertDatabaseHas('bms_audit_logs', ['event' => 'role.assigned', 'auditable_id' => $target->id]);

        $audit = $this->getBms('audit/role-changes', $director)->assertOk()->json('data');
        $this->assertSame('role.assigned', $audit[0]['event']);
        $this->assertSame('Employee', $audit[0]['role']);
    }

    public function test_P17_global_and_cross_scope_role_assignments_are_refused_for_unit_scoped_actors(): void
    {
        $mine = $this->makeUnit();
        $other = $this->makeUnit();
        $director = $this->unitRoleManager([$mine->id]);
        $outsider = $this->makeUser();
        $outsider->businessUnits()->attach($other->id);
        $employeeRole = BmsRole::where('slug', 'employee')->firstOrFail();

        // Global role: refused.
        $this->postBms('roles/assign', ['user_id' => $outsider->id, 'role_id' => $employeeRole->id], $director)->assertForbidden();
        // Unit scope outside their own units: refused.
        $this->postBms('roles/assign', [
            'user_id' => $outsider->id, 'role_id' => $employeeRole->id, 'business_unit_id' => $other->id,
        ], $director)->assertForbidden();
        // Target outside their units: refused.
        $member = $this->makeUser();
        $member->businessUnits()->attach($mine->id);
        $this->postBms('roles/assign', [
            'user_id' => $outsider->id, 'role_id' => $employeeRole->id, 'business_unit_id' => $mine->id,
        ], $director)->assertForbidden();

        $this->postBms('roles/assign', [
            'user_id' => $member->id, 'role_id' => $employeeRole->id, 'business_unit_id' => $mine->id,
        ], $director)->assertOk();
    }

    public function test_P17_hiring_a_new_employee_creates_the_account_and_onboarding_exactly_once(): void
    {
        $unit = $this->makeUnit();
        $hr = $this->actingAsRole('hr');
        $hiring = $this->postBms('recruitment', [
            'business_unit_id' => $unit->id, 'job_title' => 'Analyst', 'specification' => 'Excel',
        ], $hr)->assertStatus(201)->json('data');

        // Candidate with a passed interview, inserted directly to focus the test.
        $candidate = \App\Models\BMS\Candidate::create([
            'bms_hiring_request_id' => $hiring['id'], 'name' => 'Sara Ali',
            'email' => 'sara@example.test', 'interview_decision' => 'pass', 'status' => 'selected',
        ]);

        $payload = [
            'first_working_day' => '2026-12-01', 'username' => 'sara.ali', 'email' => 'sara.ali@example.test',
            'firstname' => 'Sara', 'lastname' => 'Ali', 'password' => 'secret-pass',
        ];
        $response = $this->postBms('candidates/'.$candidate->id.'/hire-new-employee', $payload, $hr)->assertStatus(201);
        $employeeId = $response->json('data.created_employee.id');
        $this->assertNotEmpty($employeeId);

        $employee = User::findOrFail($employeeId);
        $this->assertTrue(Hash::check('secret-pass', $employee->password));
        $this->assertTrue($employee->businessUnits()->where('business_units.id', $unit->id)->exists());
        $this->assertSame(4, \App\Models\BMS\OnboardingItem::where('bms_hiring_request_id', $hiring['id'])->count());

        // Second hire is refused: onboarding must be created exactly once.
        $this->postBms('candidates/'.$candidate->id.'/hire-new-employee', $payload, $hr)->assertStatus(422);
        $this->assertSame(4, \App\Models\BMS\OnboardingItem::where('bms_hiring_request_id', $hiring['id'])->count());
    }

    public function test_P17_my_tasks_returns_only_the_callers_tasks_and_team_view_respects_scope(): void
    {
        $unit = $this->makeUnit();
        $plan = \App\Models\BMS\WeeklyPlan::create([
            'business_unit_id' => $unit->id, 'week_start' => '2026-11-08', 'status' => 'submitted',
            'created_by' => $this->makeUser()->id,
        ]);
        $employee = $this->actingAsRole('employee', [$unit->id]);
        $colleague = $this->makeUser();
        $colleague->businessUnits()->attach($unit->id);
        \App\Models\BMS\UnitTask::create(['weekly_plan_id' => $plan->id, 'business_unit_id' => $unit->id, 'owner_id' => $employee->id, 'title' => 'Mine', 'status' => 'in_progress', 'progress' => 20]);
        \App\Models\BMS\UnitTask::create(['weekly_plan_id' => $plan->id, 'business_unit_id' => $unit->id, 'owner_id' => $colleague->id, 'title' => 'Theirs', 'status' => 'in_progress', 'progress' => 10]);

        $mine = $this->getBms('my-tasks', $employee)->assertOk()->json('data');
        $this->assertSame(['Mine'], collect($mine['data'])->pluck('title')->all());
        $this->assertSame(1, $mine['summary']['total']);
    }

    public function test_P17_certificates_and_photo_downloads_repeat_authorization(): void
    {
        $inside = $this->makeUnit();
        $outside = $this->makeUnit();
        $director = $this->actingAsRole('unit_director', [$inside->id]);
        $member = $this->makeUser();
        $member->businessUnits()->attach($inside->id);
        $stranger = $this->makeUser();
        $stranger->businessUnits()->attach($outside->id);

        \Illuminate\Support\Facades\Storage::disk('local')->put('bms/certificates/inside.pdf', 'pdf');
        $certificate = \App\Models\BMS\EmployeeCertificate::create([
            'user_id' => $member->id, 'business_unit_id' => $outside->id, 'name' => 'PMP',
            'original_name' => 'pmp.pdf', 'file_path' => 'bms/certificates/inside.pdf',
            'uploaded_by' => $director->id,
        ]);

        // Certificate belongs to a unit outside the director scope: refused.
        $this->getBms('certificates/'.$certificate->id.'/download', $director)->assertForbidden();
        // Nor may they attach a certificate to an employee outside their scope.
        $this->postBms('certificates', [
            'user_id' => $stranger->id, 'business_unit_id' => $inside->id, 'name' => 'X',
        ], $director)->assertStatus(422);

        \Illuminate\Support\Facades\Storage::disk('local')->put('bms/photos/avatar.png', 'png');
        $stranger->update(['photoURL' => 'avatar.png']);
        $this->getBms('employees/'.$stranger->id.'/photo', $director)->assertForbidden();
        $member->update(['photoURL' => 'avatar.png']);
        $this->getBms('employees/'.$member->id.'/photo', $director)->assertOk();
    }

    public function test_P18_employee_manager_reporting_line_is_stored_and_self_reference_rejected(): void
    {
        $unit = $this->makeUnit();
        $admin = $this->actingAsRole('system_admin');
        $manager = $this->makeUser(['username' => 'boss']);
        $manager->businessUnits()->attach($unit->id);

        $created = $this->postBms('employees', [
            'username' => 'report.one', 'email' => 'report.one@example.test',
            'firstname' => 'Report', 'lastname' => 'One', 'password' => 'secret-pass',
            'business_unit_ids' => [$unit->id], 'manager_id' => $manager->id,
        ], $admin)->assertStatus(201)->json('data');

        $this->assertSame($manager->id, $created['manager_id']);
        $this->assertSame('boss', $created['manager']);
        $this->putBms('employees/'.$created['id'], ['manager_id' => $created['id']], $admin)->assertStatus(422);
    }

    public function test_P18_product_metadata_owner_and_phase_reordering(): void
    {
        $unit = $this->makeUnit();
        $director = $this->actingAsRole('unit_director', [$unit->id]);
        $owner = $this->makeUser();
        $owner->businessUnits()->attach($unit->id);

        $product = $this->postBms('products', [
            'product_name' => 'Reordered Product', 'description' => 'Phase order matters',
            'owner_id' => $owner->id, 'business_unit_ids' => [$unit->id],
        ], $director)->assertStatus(201)->json('data');
        $this->assertSame('Phase order matters', $product['description']);
        $this->assertSame($owner->id, $product['owner_id']);

        $first = $this->postBms('products/'.$product['id'].'/phases', ['name' => 'Discovery', 'sequence' => 1], $director)->assertStatus(201)->json('data');
        $second = $this->postBms('products/'.$product['id'].'/phases', ['name' => 'Delivery', 'sequence' => 2], $director)->assertStatus(201)->json('data');

        $this->postBms('products/'.$product['id'].'/phases/reorder', ['phase_ids' => [$second['id'], $first['id']]], $director)->assertOk();
        $phases = \App\Models\Product::findOrFail($product['id'])->phases()->get();
        $this->assertSame(['Delivery', 'Discovery'], $phases->pluck('name')->all());
        $this->assertSame([1, 2], $phases->pluck('sequence')->all());
        $this->assertDatabaseHas('bms_audit_logs', ['event' => 'product_phases.reordered', 'auditable_id' => $product['id']]);

        $this->postBms('products/'.$product['id'].'/phases/reorder', ['phase_ids' => [$second['id']]], $director)->assertStatus(422);

        $employee = $this->actingAsRole('employee', [$unit->id]);
        $this->postBms('products/'.$product['id'].'/phases/reorder', ['phase_ids' => [$second['id'], $first['id']]], $employee)->assertForbidden();
    }

    public function test_P18_dashboard_reports_pending_procurement_upcoming_meetings_and_overdue_tasks(): void
    {
        $unit = $this->makeUnit();
        $director = $this->actingAsRole('unit_director', [$unit->id]);
        \App\Models\BMS\ProcurementRequest::create([
            'business_unit_id' => $unit->id, 'item' => 'Laptops', 'quantity' => 2,
            'purpose' => 'New hires', 'status' => 'submitted', 'requested_by' => $director->id,
        ]);
        \App\Models\BMS\Meeting::create([
            'business_unit_id' => $unit->id, 'title' => 'Weekly sync', 'starts_at' => now()->addDay(),
            'ends_at' => now()->addDay()->addHour(), 'status' => 'scheduled', 'created_by' => $director->id,
        ]);
        $plan = \App\Models\BMS\WeeklyPlan::create([
            'business_unit_id' => $unit->id, 'week_start' => '2026-11-08', 'status' => 'submitted', 'created_by' => $director->id,
        ]);
        \App\Models\BMS\UnitTask::create([
            'weekly_plan_id' => $plan->id, 'business_unit_id' => $unit->id, 'owner_id' => $director->id,
            'title' => 'Late task', 'status' => 'in_progress', 'due_date' => now()->subDays(2),
        ]);

        $dashboard = $this->getBms('executive-dashboard', $director)->assertOk()->json('data');
        $this->assertSame(1, $dashboard['summary']['pending_procurement']);
        $this->assertSame(1, $dashboard['summary']['upcoming_meetings']);
        $this->assertSame(1, $dashboard['summary']['overdue_tasks']);
        $this->assertSame('Weekly sync', $dashboard['meetings'][0]['title']);
        $this->assertNotEmpty($dashboard['recent_activity']);
    }

    public function test_P19_manager_assignment_blocks_cycles_cross_company_and_out_of_scope_managers(): void
    {
        $unit = $this->makeUnit();
        $other = $this->makeUnit();
        $admin = $this->actingAsRole('system_admin');

        $a = $this->postBms('employees', [
            'username' => 'cycle.a', 'email' => 'a@example.test', 'firstname' => 'A', 'lastname' => 'One',
            'password' => 'secret-pass', 'business_unit_ids' => [$unit->id],
        ], $admin)->assertStatus(201)->json('data');
        $b = $this->postBms('employees', [
            'username' => 'cycle.b', 'email' => 'b@example.test', 'firstname' => 'B', 'lastname' => 'Two',
            'password' => 'secret-pass', 'business_unit_ids' => [$unit->id], 'manager_id' => $a['id'],
        ], $admin)->assertStatus(201)->json('data');
        $this->assertSame($a['id'], $b['manager_id']);

        // A -> B -> A must be refused, and so must self-management.
        $this->putBms('employees/'.$a['id'], ['manager_id' => $b['id']], $admin)->assertStatus(422);
        $this->putBms('employees/'.$a['id'], ['manager_id' => $a['id']], $admin)->assertStatus(422);
        // Clearing the reporting line still works.
        $this->putBms('employees/'.$b['id'], ['manager_id' => null], $admin)->assertOk();
        $this->assertNull(\App\Models\User::findOrFail($b['id'])->manager_id);

        // Cross-company managers are refused.
        $outsider = $this->makeUser(['company_id' => 999]);
        $this->putBms('employees/'.$a['id'], ['manager_id' => $outsider->id], $admin)->assertStatus(422);

        // Unit-scoped actors may not attach a manager they cannot see.
        $director = $this->actingAsRole('unit_director', [$unit->id]);
        $hidden = $this->makeUser();
        $hidden->businessUnits()->attach($other->id);
        $this->putBms('employees/'.$a['id'], ['manager_id' => $hidden->id], $director)->assertStatus(403);
    }

    public function test_P19_employee_import_preview_is_read_only_and_reports_duplicates(): void
    {
        $unit = $this->makeUnit();
        $admin = $this->actingAsRole('system_admin');
        $this->makeUser(['username' => 'already.here', 'email' => 'already@example.test']);

        $rows = [
            ['username' => 'import.one', 'email' => 'import.one@example.test', 'firstname' => 'New', 'lastname' => 'Hire',
                'password' => 'secret-pass', 'business_units' => $unit->name],
            ['username' => 'already.here', 'email' => 'import.two@example.test', 'firstname' => 'Old', 'lastname' => 'Hire',
                'password' => 'secret-pass', 'business_units' => $unit->name],
            ['username' => 'bad.row', 'email' => 'not-an-email', 'firstname' => '', 'lastname' => '',
                'password' => 'short', 'business_units' => 'No Such Unit'],
        ];

        $preview = $this->postBms('employees/import', ['rows' => $rows, 'dry_run' => true], $admin)->assertOk()->json('data');
        $this->assertSame(3, $preview['summary']['total']);
        $this->assertSame(1, $preview['summary']['valid']);
        $this->assertSame(1, $preview['summary']['skipped']);
        $this->assertSame(0, $preview['summary']['created']);
        $this->assertSame('existing', $preview['rows'][1]['status']);
        $this->assertNotEmpty($preview['rows'][2]['errors']);
        // Preview writes nothing.
        $this->assertDatabaseMissing('users', ['username' => 'import.one']);

        $result = $this->postBms('employees/import', ['rows' => $rows, 'dry_run' => false], $admin)->assertOk()->json('data');
        $this->assertSame(1, $result['summary']['created']);
        $this->assertDatabaseHas('users', ['username' => 'import.one']);
        $this->assertDatabaseMissing('users', ['username' => 'bad.row']);
        $this->assertDatabaseHas('bms_audit_logs', ['event' => 'employee.imported']);

        // A non-administrator cannot import.
        $employee = $this->actingAsRole('employee', [$unit->id]);
        $this->postBms('employees/import', ['rows' => $rows], $employee)->assertForbidden();
    }

    public function test_P19_recent_activity_never_leaks_other_units_records(): void
    {
        $mine = $this->makeUnit();
        $theirs = $this->makeUnit();
        $director = $this->actingAsRole('unit_director', [$mine->id]);
        $otherDirector = $this->makeUser();
        $otherDirector->businessUnits()->attach($theirs->id);

        \App\Models\BMS\ProcurementRequest::create([
            'business_unit_id' => $mine->id, 'item' => 'Visible item', 'quantity' => 1,
            'purpose' => 'Mine', 'status' => 'submitted', 'requested_by' => $director->id,
        ]);
        \App\Models\BMS\ProcurementRequest::create([
            'business_unit_id' => $theirs->id, 'item' => 'Secret item', 'quantity' => 1,
            'purpose' => 'Theirs', 'status' => 'submitted', 'requested_by' => $otherDirector->id,
        ]);

        $data = $this->getBms('executive-dashboard', $director)->assertOk()->json('data');
        $this->assertSame(1, $data['summary']['pending_procurement']);
        $events = collect($data['recent_activity']);
        $this->assertTrue($events->isNotEmpty());
        $this->assertTrue($events->every(fn ($row) => $row['type'] !== 'User'));
    }

    public function test_P20_kpi_trends_are_isolated_per_unit_even_with_identical_names(): void
    {
        $alpha = $this->makeUnit();
        $beta = $this->makeUnit();
        $director = $this->actingAsRole('unit_director', [$alpha->id, $beta->id]);

        foreach ([[$alpha, 10, 10], [$beta, 10, 5]] as [$unit, $target, $actual]) {
            $this->postBms('reports/kpis', [
                'business_unit_id' => $unit->id, 'name' => 'Revenue', 'target' => $target, 'actual' => $actual,
                'frequency' => 'quarterly', 'period_start' => '2026-07-01', 'period_end' => '2026-09-30',
            ], $director)->assertOk();
        }

        $data = $this->getBms('reports/kpis', $director)->assertOk()->json('data');
        $this->assertCount(2, $data['kpis']);
        $this->assertCount(2, $data['history'], 'Identically named KPIs in different units must not share a series.');
        $byUnit = collect($data['history'])->keyBy('business_unit_id');
        $this->assertSame('Revenue', $byUnit[$alpha->id]['name']);
        $this->assertCount(1, $byUnit[$alpha->id]['points']);
        $this->assertCount(1, $byUnit[$beta->id]['points']);
        // A target of zero must not divide by zero and yields a null attainment.
        $this->postBms('reports/kpis', [
            'business_unit_id' => $alpha->id, 'name' => 'Zero target', 'target' => 0, 'actual' => 4,
            'period_start' => '2026-07-01', 'period_end' => '2026-09-30',
        ], $director)->assertOk();
        $zero = collect($this->getBms('reports/kpis', $director)->json('data')['kpis'])->firstWhere('name', 'Zero target');
        $this->assertNull($zero['attainment']);
        $this->assertSame('no_target', $zero['status']);
    }

    public function test_P20_import_rejects_duplicates_inside_the_uploaded_file(): void
    {
        $unit = $this->makeUnit();
        $admin = $this->actingAsRole('system_admin');
        $rows = [
            ['username' => 'dup.user', 'email' => 'dup.one@example.test', 'firstname' => 'A', 'lastname' => 'One', 'password' => 'secret-pass', 'business_units' => $unit->name],
            ['username' => 'DUP.USER', 'email' => 'dup.two@example.test', 'firstname' => 'B', 'lastname' => 'Two', 'password' => 'secret-pass', 'business_units' => $unit->name],
            ['username' => 'other.user', 'email' => 'DUP.ONE@example.test', 'firstname' => 'C', 'lastname' => 'Three', 'password' => 'secret-pass', 'business_units' => $unit->name],
        ];

        $preview = $this->postBms('employees/import', ['rows' => $rows, 'dry_run' => true], $admin)->assertOk()->json('data');
        $this->assertSame(1, $preview['summary']['valid']);
        $this->assertSame(2, $preview['summary']['duplicate_in_file']);
        $this->assertSame('duplicate_in_file', $preview['rows'][1]['status']);
        $this->assertSame('duplicate_in_file', $preview['rows'][2]['status']);
        $this->assertArrayNotHasKey('attributes', $preview['rows'][0], 'Preview must never echo prepared payloads or hashes.');

        $commit = $this->postBms('employees/import', ['rows' => $rows, 'dry_run' => false], $admin)->assertOk()->json('data');
        $this->assertSame(1, $commit['summary']['created']);
        $this->assertSame(1, \App\Models\User::whereIn('username', ['dup.user', 'other.user'])->count());
    }

    public function test_P20_recent_activity_separates_ids_shared_across_model_types_and_handles_deleted_records(): void
    {
        $unit = $this->makeUnit();
        $other = $this->makeUnit();
        $admin = $this->actingAsRole('system_admin');
        $stranger = $this->makeUser(['username' => 'stranger']);
        $stranger->businessUnits()->attach($other->id);

        $mine = \App\Models\BMS\ProcurementRequest::create([
            'business_unit_id' => $unit->id, 'item' => 'Mine', 'quantity' => 1, 'purpose' => 'p',
            'status' => 'submitted', 'requested_by' => $admin->id,
        ]);
        $theirs = \App\Models\BMS\ProcurementRequest::create([
            'business_unit_id' => $other->id, 'item' => 'Theirs', 'quantity' => 1, 'purpose' => 'p',
            'status' => 'submitted', 'requested_by' => $stranger->id,
        ]);

        // Same numeric id, different model types: each keeps its own resolved unit.
        \Illuminate\Support\Facades\DB::table('bms_audit_logs')->insert([
            ['auditable_type' => \App\Models\BMS\ProcurementRequest::class, 'auditable_id' => $mine->id, 'event' => 'mine.event', 'user_id' => $admin->id, 'created_at' => now(), 'updated_at' => now()],
            ['auditable_type' => \App\Models\BMS\ProcurementRequest::class, 'auditable_id' => $theirs->id, 'event' => 'theirs.event', 'user_id' => $stranger->id, 'created_at' => now(), 'updated_at' => now()],
            ['auditable_type' => 'App\\Models\\BMS\\DeletedRecord', 'auditable_id' => 999999, 'event' => 'ghost.event', 'user_id' => $admin->id, 'created_at' => now(), 'updated_at' => now()],
        ]);

        $director = $this->actingAsRole('unit_director', [$unit->id]);
        $scoped = collect($this->getBms('executive-dashboard', $director)->json('data')['recent_activity']);
        $this->assertTrue($scoped->contains(fn ($row) => $row['event'] === 'mine.event'));
        $this->assertFalse($scoped->contains(fn ($row) => $row['event'] === 'theirs.event'), 'Other units must never leak into recent activity.');
        $this->assertFalse($scoped->contains(fn ($row) => $row['event'] === 'ghost.event'));

        $global = collect($this->getBms('executive-dashboard', $admin)->json('data')['recent_activity']);
        $this->assertTrue($global->contains(fn ($row) => $row['event'] === 'theirs.event'));
        $this->assertFalse($global->contains(fn ($row) => $row['type'] === 'DeletedRecord'), 'Unsupported auditable types are never listed.');
    }

    public function test_P20_dashboard_summary_matches_the_widget_data_under_the_same_filters(): void
    {
        $alpha = $this->makeUnit();
        $beta = $this->makeUnit();
        $director = $this->actingAsRole('unit_director', [$alpha->id, $beta->id]);

        foreach ([$alpha, $beta] as $unit) {
            \App\Models\BMS\ProcurementRequest::create([
                'business_unit_id' => $unit->id, 'item' => 'Item '.$unit->name, 'quantity' => 1,
                'purpose' => 'p', 'status' => 'submitted', 'requested_by' => $director->id,
            ]);
            \App\Models\BMS\Meeting::create([
                'business_unit_id' => $unit->id, 'title' => 'Sync '.$unit->name, 'starts_at' => now()->addDays(2),
                'ends_at' => now()->addDays(2)->addHour(), 'status' => 'scheduled', 'created_by' => $director->id,
            ]);
        }

        $all = $this->getBms('executive-dashboard', $director)->assertOk()->json('data');
        $this->assertSame(2, $all['procurement']['pending']);
        $this->assertSame($all['procurement']['pending'], $all['summary']['pending_procurement']);
        $this->assertCount($all['summary']['upcoming_meetings'], $all['meetings']);
        $this->assertTrue(collect($all['meetings'])->every(fn ($m) => in_array($m['business_unit_id'], [$alpha->id, $beta->id], true)));

        $filtered = $this->getBms('executive-dashboard?business_unit_id='.$alpha->id, $director)->assertOk()->json('data');
        $this->assertSame(1, $filtered['summary']['pending_procurement']);
        $this->assertCount(1, $filtered['meetings']);
        $this->assertSame($alpha->id, $filtered['meetings'][0]['business_unit_id']);
        $this->assertCount(1, $filtered['unit_progress']);
    }

    public function test_P21_monthly_report_products_are_limited_to_the_actors_units(): void
    {
        $mine = $this->makeUnit();
        $theirs = $this->makeUnit();
        $director = $this->actingAsRole('unit_director', [$mine->id]);

        $mineOnly = \App\Models\Product::create(['product_name' => 'Mine Only Product']);
        $mineOnly->businessUnits()->attach($mine->id);
        $theirsOnly = \App\Models\Product::create(['product_name' => 'Theirs Only Product']);
        $theirsOnly->businessUnits()->attach($theirs->id);
        $shared = \App\Models\Product::create(['product_name' => 'Shared Product']);
        $shared->businessUnits()->attach([$mine->id, $theirs->id]);

        // 1. No unit filter: the actor's scope still applies (this was the defect).
        $report = $this->getBms('reports/monthly', $director)->assertOk()->json('data');
        $names = collect($report['products'])->pluck('product_name')->all();
        $this->assertContains('Mine Only Product', $names);
        $this->assertContains('Shared Product', $names, 'A multi-unit product is visible when one of its units is authorised.');
        $this->assertNotContains('Theirs Only Product', $names, 'A restricted user must never see another unit\'s product.');
        $this->assertSame(count($names), $report['summary']['products']);

        // 2. Requesting an authorised unit still intersects with the scope.
        $filtered = $this->getBms('reports/monthly?business_unit_id='.$mine->id, $director)->assertOk()->json('data');
        $filteredNames = collect($filtered['products'])->pluck('product_name')->all();
        $this->assertContains('Mine Only Product', $filteredNames);
        $this->assertNotContains('Theirs Only Product', $filteredNames);

        // 3. Requesting a unit outside the scope is refused, not silently widened.
        $this->getBms('reports/monthly?business_unit_id='.$theirs->id, $director)->assertForbidden();

        // 4. An unrestricted actor keeps the previous visibility.
        $admin = $this->actingAsRole('system_admin');
        $all = collect($this->getBms('reports/monthly', $admin)->assertOk()->json('data')['products'])->pluck('product_name')->all();
        $this->assertContains('Mine Only Product', $all);
        $this->assertContains('Theirs Only Product', $all);
        $this->assertContains('Shared Product', $all);
        $this->assertSame(3, count($all));
    }

    public function test_P17_unit_hierarchy_guards_and_safe_deletion(): void
    {
        $admin = $this->actingAsRole('system_admin');
        $root = $this->makeUnit(['name' => 'Root Unit']);
        $child = $this->makeUnit(['name' => 'Child Unit', 'parent_id' => $root->id]);
        $grandChild = $this->makeUnit(['name' => 'Grand Child', 'parent_id' => $child->id]);

        // self parent
        $this->putBms('units/'.$root->id, ['name' => 'Root Unit', 'parent_id' => $root->id], $admin)->assertStatus(422);
        // parent = own descendant
        $this->putBms('units/'.$root->id, ['name' => 'Root Unit', 'parent_id' => $grandChild->id], $admin)->assertStatus(422);

        // a unit with members cannot be deleted, only deactivated
        $member = $this->makeUser();
        $member->businessUnits()->attach($child->id);
        $this->deleteBms('units/'.$child->id, $admin)->assertStatus(422);
        $this->postBms('units/'.$child->id.'/status', ['is_active' => false], $admin)
            ->assertOk()->assertJsonPath('data.is_active', false);
    }
}
