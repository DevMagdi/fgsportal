<?php

namespace Tests\Feature;

use App\Models\BMS\BmsAuditLog;
use App\Models\BMS\BmsRole;
use App\Models\BMS\BusinessUnit;
use App\Models\BMS\ProductPhase;
use App\Models\BMS\ProcurementRequest;
use App\Models\Product;
use App\Models\User;
use App\Services\BMS\BmsAccess;
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
            'business_unit_id' => $unit->id, 'reference' => 'P18-DASHBOARD', 'item' => 'Laptops', 'quantity' => 2,
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
            'business_unit_id' => $mine->id, 'reference' => 'P19-ACTIVITY-MINE', 'item' => 'Visible item', 'quantity' => 1,
            'purpose' => 'Mine', 'status' => 'submitted', 'requested_by' => $director->id,
        ]);
        \App\Models\BMS\ProcurementRequest::create([
            'business_unit_id' => $theirs->id, 'reference' => 'P19-ACTIVITY-SECRET', 'item' => 'Secret item', 'quantity' => 1,
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
            'business_unit_id' => $unit->id, 'reference' => 'P20-MINE', 'item' => 'Mine', 'quantity' => 1, 'purpose' => 'p',
            'status' => 'submitted', 'requested_by' => $admin->id,
        ]);
        $theirs = \App\Models\BMS\ProcurementRequest::create([
            'business_unit_id' => $other->id, 'reference' => 'P20-THEIRS', 'item' => 'Theirs', 'quantity' => 1, 'purpose' => 'p',
            'status' => 'submitted', 'requested_by' => $stranger->id,
        ]);

        // Same numeric id, different model types: each keeps its own resolved unit.
        \Illuminate\Support\Facades\DB::table('bms_audit_logs')->insert([
            ['auditable_type' => \App\Models\BMS\ProcurementRequest::class, 'auditable_id' => $mine->id, 'event' => 'mine.event', 'user_id' => $admin->id, 'created_at' => now(), 'updated_at' => now()],
            ['auditable_type' => \App\Models\BMS\ProcurementRequest::class, 'auditable_id' => $theirs->id, 'event' => 'theirs.event', 'user_id' => $stranger->id, 'created_at' => now(), 'updated_at' => now()],
            ['auditable_type' => 'App\\Models\\BMS\\DeletedRecord', 'auditable_id' => 999999, 'event' => 'ghost.event', 'user_id' => $admin->id, 'created_at' => now(), 'updated_at' => now()],
            ['auditable_type' => ProcurementRequest::class, 'auditable_id' => 999999, 'event' => 'missing.allowed.model.event', 'user_id' => $admin->id, 'created_at' => now(), 'updated_at' => now()],
        ]);

        $director = $this->actingAsRole('unit_director', [$unit->id]);
        $scoped = collect($this->getBms('executive-dashboard', $director)->json('data')['recent_activity']);
        $this->assertTrue($scoped->contains(fn ($row) => $row['event'] === 'mine.event'));
        $this->assertFalse($scoped->contains(fn ($row) => $row['event'] === 'theirs.event'), 'Other units must never leak into recent activity.');
        $this->assertFalse($scoped->contains(fn ($row) => $row['event'] === 'ghost.event'));
        $this->assertFalse($scoped->contains(fn ($row) => $row['event'] === 'missing.allowed.model.event'), 'Missing allowed models must not leak when unit scope cannot be resolved.');

        $global = collect($this->getBms('executive-dashboard', $admin)->json('data')['recent_activity']);
        $this->assertTrue($global->contains(fn ($row) => $row['event'] === 'theirs.event'));
        $this->assertFalse($global->contains(fn ($row) => $row['event'] === 'missing.allowed.model.event'), 'Unknown unit scope must be omitted for global and restricted viewers.');
        $this->assertFalse($global->contains(fn ($row) => $row['type'] === 'DeletedRecord'), 'Unsupported auditable types are never listed.');
    }

    public function test_P20_dashboard_summary_matches_the_widget_data_under_the_same_filters(): void
    {
        $alpha = $this->makeUnit();
        $beta = $this->makeUnit();
        $director = $this->actingAsRole('unit_director', [$alpha->id, $beta->id]);

        foreach ([$alpha, $beta] as $unit) {
            \App\Models\BMS\ProcurementRequest::create([
                'business_unit_id' => $unit->id, 'reference' => 'P20-SUMMARY-'.$unit->id, 'item' => 'Item '.$unit->name, 'quantity' => 1,
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

    public function test_P22_dashboard_recent_activity_respects_selected_unit_including_shared_products(): void
    {
        $alpha = $this->makeUnit();
        $beta = $this->makeUnit();
        $director = $this->actingAsRole('unit_director', [$alpha->id, $beta->id]);

        $sharedProduct = Product::create(['product_name' => 'Shared dashboard product']);
        $sharedProduct->businessUnits()->attach([$alpha->id, $beta->id]);
        BmsAuditLog::create([
            'auditable_type' => Product::class,
            'auditable_id' => $sharedProduct->id,
            'event' => 'product.shared.updated',
            'user_id' => $director->id,
        ]);
        $sharedPhase = ProductPhase::create([
            'product_id' => $sharedProduct->id, 'name' => 'Shared product phase', 'sequence' => 1,
            'status' => 'in_progress', 'updated_by' => $director->id,
        ]);
        BmsAuditLog::create([
            'auditable_type' => ProductPhase::class,
            'auditable_id' => $sharedPhase->id,
            'event' => 'product_phase.shared.updated',
            'user_id' => $director->id,
        ]);
        BmsAuditLog::create([
            'auditable_type' => BusinessUnit::class,
            'auditable_id' => $alpha->id,
            'event' => 'unit.alpha.updated',
            'user_id' => $director->id,
        ]);
        BmsAuditLog::create([
            'auditable_type' => BusinessUnit::class,
            'auditable_id' => $beta->id,
            'event' => 'unit.beta.updated',
            'user_id' => $director->id,
        ]);
        foreach ([$alpha, $beta] as $unit) {
            $request = ProcurementRequest::create([
                'business_unit_id' => $unit->id, 'reference' => 'P22-'.$unit->id, 'item' => 'Activity '.$unit->name, 'quantity' => 1,
                'purpose' => 'Activity filter test', 'status' => 'submitted', 'requested_by' => $director->id,
            ]);
            BmsAuditLog::create([
                'auditable_type' => ProcurementRequest::class,
                'auditable_id' => $request->id,
                'event' => 'procurement.unit.'.$unit->id,
                'user_id' => $director->id,
            ]);
        }

        $alphaActivity = collect($this->getBms('executive-dashboard?business_unit_id='.$alpha->id, $director)->assertOk()->json('data.recent_activity'));
        $this->assertTrue($alphaActivity->contains(fn ($row) => $row['event'] === 'product.shared.updated'));
        $this->assertTrue($alphaActivity->contains(fn ($row) => $row['event'] === 'product_phase.shared.updated'));
        $this->assertTrue($alphaActivity->contains(fn ($row) => $row['event'] === 'unit.alpha.updated'));
        $this->assertTrue($alphaActivity->contains(fn ($row) => $row['event'] === 'procurement.unit.'.$alpha->id));
        $this->assertFalse($alphaActivity->contains(fn ($row) => $row['event'] === 'unit.beta.updated'));
        $this->assertFalse($alphaActivity->contains(fn ($row) => $row['event'] === 'procurement.unit.'.$beta->id));

        $betaActivity = collect($this->getBms('executive-dashboard?business_unit_id='.$beta->id, $director)->assertOk()->json('data.recent_activity'));
        $this->assertTrue($betaActivity->contains(fn ($row) => $row['event'] === 'product.shared.updated'));
        $this->assertTrue($betaActivity->contains(fn ($row) => $row['event'] === 'product_phase.shared.updated'));
        $this->assertTrue($betaActivity->contains(fn ($row) => $row['event'] === 'unit.beta.updated'));
        $this->assertTrue($betaActivity->contains(fn ($row) => $row['event'] === 'procurement.unit.'.$beta->id));
        $this->assertFalse($betaActivity->contains(fn ($row) => $row['event'] === 'unit.alpha.updated'));
        $this->assertFalse($betaActivity->contains(fn ($row) => $row['event'] === 'procurement.unit.'.$alpha->id));

        $alphaOnly = $this->actingAsRole('unit_director', [$alpha->id]);
        $this->getBms('executive-dashboard?business_unit_id='.$beta->id, $alphaOnly)->assertForbidden();
        $alphaOnlyActivity = collect($this->getBms('executive-dashboard', $alphaOnly)->assertOk()->json('data.recent_activity'));
        $this->assertFalse($alphaOnlyActivity->contains(fn ($row) => $row['event'] === 'unit.beta.updated'));
        $this->assertFalse($alphaOnlyActivity->contains(fn ($row) => $row['event'] === 'procurement.unit.'.$beta->id));
    }

    public function test_P21_monthly_report_products_are_limited_to_the_actors_units(): void
    {
        // BmsTestCase runs BmsPhaseOneSeeder, which ships catalogue products (Kraken, Argus)
        // with no unit link. Every "whole catalogue" expectation is measured from this baseline.
        $baseline = \App\Models\Product::pluck('product_name')->all();

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
        $this->assertEqualsCanonicalizing(['Mine Only Product', 'Shared Product'], $names, 'A restricted user sees exactly the products of the authorised units and nothing else.');
        $this->assertSame(count($names), $report['summary']['products']);

        // 2. Requesting an authorised unit still intersects with the scope.
        $filtered = $this->getBms('reports/monthly?business_unit_id='.$mine->id, $director)->assertOk()->json('data');
        $filteredNames = collect($filtered['products'])->pluck('product_name')->all();
        $this->assertContains('Mine Only Product', $filteredNames);
        $this->assertContains('Shared Product', $filteredNames, 'A shared product stays visible through the authorised unit.');
        $this->assertNotContains('Theirs Only Product', $filteredNames);

        // 3. Requesting a unit outside the scope is refused, not silently widened.
        $this->getBms('reports/monthly?business_unit_id='.$theirs->id, $director)->assertForbidden();

        // 4. An unrestricted actor keeps the previous visibility.
        $admin = $this->actingAsRole('system_admin');
        $all = collect($this->getBms('reports/monthly', $admin)->assertOk()->json('data')['products'])->pluck('product_name')->all();
        $this->assertContains('Mine Only Product', $all);
        $this->assertContains('Theirs Only Product', $all);
        $this->assertContains('Shared Product', $all);
        // The catalogue is the seeded baseline plus the three fixtures above; the previous
        // hard-coded total of 3 ignored the products seeded by BmsTestCase.
        $this->assertEqualsCanonicalizing(
            array_merge($baseline, ['Mine Only Product', 'Theirs Only Product', 'Shared Product']),
            $all,
            'An unrestricted actor sees the whole catalogue: nothing hidden, nothing extra.'
        );
        $this->assertSame(count($baseline) + 3, count($all));
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

    // =====================================================================
    // Phase 1 — role assignment / revocation authorization hardening.
    // The original targetInScope check was tautological (the target id was
    // merged into the array it was searched in), so unit-scoped managers
    // could assign roles to any employee. These tests pin the whole policy.
    // =====================================================================

    private function role(string $slug): BmsRole
    {
        return BmsRole::where('slug', $slug)->firstOrFail();
    }

    private function memberOf(BusinessUnit $unit, array $attributes = []): User
    {
        $user = $this->makeUser($attributes);
        $user->businessUnits()->attach($unit->id);

        return $user;
    }

    private function auditCount(string $event): int
    {
        return BmsAuditLog::where('event', $event)->count();
    }

    public function test_P17_role_security_admin_assigns_unit_and_global_roles(): void
    {
        // Scenario 1: global administrator assigns a unit-level role to an eligible employee.
        $unit = $this->makeUnit();
        $admin = $this->actingAsRole('system_admin');
        $target = $this->memberOf($unit);

        $this->postBms('roles/assign', [
            'user_id' => $target->id, 'role_id' => $this->role('employee')->id, 'business_unit_id' => $unit->id,
        ], $admin)->assertOk();
        $this->assertDatabaseHas('bms_role_user', [
            'user_id' => $target->id, 'bms_role_id' => $this->role('employee')->id, 'business_unit_id' => $unit->id,
        ]);

        // Scenario 2: global administrator assigns a legitimate global role.
        $this->postBms('roles/assign', [
            'user_id' => $target->id, 'role_id' => $this->role('hr')->id,
        ], $admin)->assertOk();
        $this->assertDatabaseHas('bms_role_user', [
            'user_id' => $target->id, 'bms_role_id' => $this->role('hr')->id, 'business_unit_id' => null,
        ]);
    }

    public function test_P17_role_security_unit_manager_assigns_and_revokes_in_scope(): void
    {
        // Scenario 3: unit-scoped role manager assigns an allowed role inside their unit.
        // Scenario 5: revocation of that authorized unit-level role succeeds.
        $unit = $this->makeUnit();
        $manager = $this->unitRoleManager([$unit->id]);
        $target = $this->memberOf($unit);
        $employeeRole = $this->role('employee');

        $this->postBms('roles/assign', [
            'user_id' => $target->id, 'role_id' => $employeeRole->id, 'business_unit_id' => $unit->id,
        ], $manager)->assertOk();
        $this->assertDatabaseHas('bms_role_user', [
            'user_id' => $target->id, 'bms_role_id' => $employeeRole->id, 'business_unit_id' => $unit->id,
        ]);

        $this->postBms('roles/revoke', [
            'user_id' => $target->id, 'role_id' => $employeeRole->id, 'business_unit_id' => $unit->id,
        ], $manager)->assertOk();
        $this->assertDatabaseMissing('bms_role_user', [
            'user_id' => $target->id, 'bms_role_id' => $employeeRole->id, 'business_unit_id' => $unit->id,
        ]);
    }

    public function test_P17_role_security_multi_unit_employee_gets_role_in_authorized_unit(): void
    {
        // Scenario 4: an employee belonging to several units receives a role
        // in one of the units the actor is authorized for.
        $mine = $this->makeUnit();
        $also = $this->makeUnit();
        $manager = $this->unitRoleManager([$mine->id]);
        $target = $this->makeUser();
        $target->businessUnits()->attach([$mine->id, $also->id]);

        $this->postBms('roles/assign', [
            'user_id' => $target->id, 'role_id' => $this->role('employee')->id, 'business_unit_id' => $mine->id,
        ], $manager)->assertOk();
        $this->assertDatabaseHas('bms_role_user', [
            'user_id' => $target->id, 'bms_role_id' => $this->role('employee')->id, 'business_unit_id' => $mine->id,
        ]);
    }

    public function test_P17_role_security_scoped_changes_leave_other_assignments_untouched(): void
    {
        // Scenario 6: adding and revoking one scoped assignment never disturbs
        // the employee's other (unit or global) assignments.
        $unitA = $this->makeUnit();
        $unitB = $this->makeUnit();
        $manager = $this->unitRoleManager([$unitA->id]);
        $target = $this->makeUser();
        $target->businessUnits()->attach([$unitA->id, $unitB->id]);
        $target->bmsRoles()->syncWithoutDetaching([
            $this->role('unit_director')->id => ['business_unit_id' => $unitA->id],
            $this->role('employee')->id => ['business_unit_id' => $unitB->id],
            $this->role('hr')->id => ['business_unit_id' => null],
        ]);

        $this->postBms('roles/assign', [
            'user_id' => $target->id, 'role_id' => $this->role('department_manager')->id, 'business_unit_id' => $unitA->id,
        ], $manager)->assertOk();

        $this->postBms('roles/revoke', [
            'user_id' => $target->id, 'role_id' => $this->role('department_manager')->id, 'business_unit_id' => $unitA->id,
        ], $manager)->assertOk();

        $this->assertDatabaseHas('bms_role_user', [
            'user_id' => $target->id, 'bms_role_id' => $this->role('unit_director')->id, 'business_unit_id' => $unitA->id,
        ]);
        $this->assertDatabaseHas('bms_role_user', [
            'user_id' => $target->id, 'bms_role_id' => $this->role('employee')->id, 'business_unit_id' => $unitB->id,
        ]);
        $this->assertDatabaseHas('bms_role_user', [
            'user_id' => $target->id, 'bms_role_id' => $this->role('hr')->id, 'business_unit_id' => null,
        ]);
        $this->assertDatabaseMissing('bms_role_user', [
            'user_id' => $target->id, 'bms_role_id' => $this->role('department_manager')->id,
        ]);
    }

    public function test_P17_role_security_unit_manager_cannot_target_unrelated_employees(): void
    {
        // Scenario 7: target belongs exclusively to an unrelated unit.
        // Scenario 9: rejected even when the requested business_unit_id is
        // the actor's own unit — the crafted payload must not bypass scope.
        $mine = $this->makeUnit();
        $theirs = $this->makeUnit();
        $alsoTheirs = $this->makeUnit();
        $manager = $this->unitRoleManager([$mine->id]);
        $unrelated = $this->memberOf($theirs);
        $multiUnrelated = $this->makeUser();
        $multiUnrelated->businessUnits()->attach([$theirs->id, $alsoTheirs->id]);
        $employeeRole = $this->role('employee');

        $this->postBms('roles/assign', [
            'user_id' => $unrelated->id, 'role_id' => $employeeRole->id, 'business_unit_id' => $mine->id,
        ], $manager)->assertForbidden();

        $this->postBms('roles/assign', [
            'user_id' => $multiUnrelated->id, 'role_id' => $employeeRole->id, 'business_unit_id' => $mine->id,
        ], $manager)->assertForbidden();

        $this->assertDatabaseMissing('bms_role_user', [
            'user_id' => $unrelated->id, 'bms_role_id' => $employeeRole->id, 'business_unit_id' => $mine->id,
        ]);
        $this->assertDatabaseMissing('bms_role_user', [
            'user_id' => $multiUnrelated->id, 'bms_role_id' => $employeeRole->id, 'business_unit_id' => $mine->id,
        ]);
    }

    public function test_P17_role_security_unit_manager_cannot_target_employees_without_units(): void
    {
        // Scenario 8: no business-unit membership must not make a target
        // automatically manageable, even when the actor's own unit is used.
        $mine = $this->makeUnit();
        $manager = $this->unitRoleManager([$mine->id]);
        $drifter = $this->makeUser();
        $employeeRole = $this->role('employee');

        $this->postBms('roles/assign', [
            'user_id' => $drifter->id, 'role_id' => $employeeRole->id, 'business_unit_id' => $mine->id,
        ], $manager)->assertForbidden();

        $this->assertDatabaseMissing('bms_role_user', [
            'user_id' => $drifter->id, 'bms_role_id' => $employeeRole->id, 'business_unit_id' => $mine->id,
        ]);
    }

    public function test_P17_role_security_unit_manager_cannot_assign_unrelated_units(): void
    {
        // Scenario 10: the requested unit itself is outside the actor's scope.
        $mine = $this->makeUnit();
        $theirs = $this->makeUnit();
        $manager = $this->unitRoleManager([$mine->id]);
        $theirMember = $this->memberOf($theirs);

        $this->postBms('roles/assign', [
            'user_id' => $theirMember->id, 'role_id' => $this->role('employee')->id, 'business_unit_id' => $theirs->id,
        ], $manager)->assertForbidden();

        $this->assertDatabaseMissing('bms_role_user', [
            'user_id' => $theirMember->id, 'bms_role_id' => $this->role('employee')->id, 'business_unit_id' => $theirs->id,
        ]);
    }

    public function test_P17_role_security_unit_manager_cannot_create_global_assignments(): void
    {
        // Scenario 11: without business_unit_id the assignment is global and
        // must be refused for a unit-scoped actor.
        $unit = $this->makeUnit();
        $manager = $this->unitRoleManager([$unit->id]);
        $target = $this->memberOf($unit);
        $employeeRole = $this->role('employee');

        $this->postBms('roles/assign', [
            'user_id' => $target->id, 'role_id' => $employeeRole->id,
        ], $manager)->assertForbidden();

        $this->assertDatabaseMissing('bms_role_user', [
            'user_id' => $target->id, 'bms_role_id' => $employeeRole->id, 'business_unit_id' => null,
        ]);
    }

    public function test_P17_role_security_unit_manager_cannot_revoke_global_roles(): void
    {
        // Scenario 12: unit-scoped actors may not revoke global assignments.
        $unit = $this->makeUnit();
        $manager = $this->unitRoleManager([$unit->id]);
        $target = $this->memberOf($unit);
        $hrRole = $this->role('hr');
        $target->bmsRoles()->attach($hrRole->id, ['business_unit_id' => null]);

        $this->postBms('roles/revoke', [
            'user_id' => $target->id, 'role_id' => $hrRole->id,
        ], $manager)->assertForbidden();

        $this->assertDatabaseHas('bms_role_user', [
            'user_id' => $target->id, 'bms_role_id' => $hrRole->id, 'business_unit_id' => null,
        ]);
    }

    public function test_P17_role_security_unit_manager_cannot_revoke_roles_from_other_units(): void
    {
        // Scenario 13: cross-unit revocation is rejected and the assignment survives.
        $mine = $this->makeUnit();
        $theirs = $this->makeUnit();
        $manager = $this->unitRoleManager([$mine->id]);
        $target = $this->memberOf($theirs);
        $employeeRole = $this->role('employee');
        $target->bmsRoles()->attach($employeeRole->id, ['business_unit_id' => $theirs->id]);

        $this->postBms('roles/revoke', [
            'user_id' => $target->id, 'role_id' => $employeeRole->id, 'business_unit_id' => $theirs->id,
        ], $manager)->assertForbidden();

        $this->assertDatabaseHas('bms_role_user', [
            'user_id' => $target->id, 'bms_role_id' => $employeeRole->id, 'business_unit_id' => $theirs->id,
        ]);
    }

    public function test_P17_role_security_unauthorized_employee_cannot_assign_or_revoke(): void
    {
        // Scenario 14: an employee without roles.manage can neither assign nor revoke.
        $unit = $this->makeUnit();
        $plain = $this->actingAsRole('employee', [$unit->id]);
        $target = $this->memberOf($unit);
        $employeeRole = $this->role('employee');
        $target->bmsRoles()->attach($employeeRole->id, ['business_unit_id' => $unit->id]);

        $this->postBms('roles/assign', [
            'user_id' => $target->id, 'role_id' => $this->role('unit_director')->id, 'business_unit_id' => $unit->id,
        ], $plain)->assertForbidden();

        $this->postBms('roles/revoke', [
            'user_id' => $target->id, 'role_id' => $employeeRole->id, 'business_unit_id' => $unit->id,
        ], $plain)->assertForbidden();

        $this->assertDatabaseHas('bms_role_user', [
            'user_id' => $target->id, 'bms_role_id' => $employeeRole->id, 'business_unit_id' => $unit->id,
        ]);
    }

    public function test_P17_role_security_non_admin_cannot_grant_or_revoke_system_admin(): void
    {
        // Scenario 15: non-administration cannot grant system_admin — at any scope.
        // Scenario 16: non-administration cannot revoke system_admin either.
        $unit = $this->makeUnit();
        $manager = $this->unitRoleManager([$unit->id]);
        $target = $this->memberOf($unit);
        $adminRole = $this->role('system_admin');

        $this->postBms('roles/assign', [
            'user_id' => $target->id, 'role_id' => $adminRole->id,
        ], $manager)->assertForbidden();
        $this->postBms('roles/assign', [
            'user_id' => $target->id, 'role_id' => $adminRole->id, 'business_unit_id' => $unit->id,
        ], $manager)->assertForbidden();

        // Seed a unit-scoped system_admin assignment, then try to revoke it.
        $target->bmsRoles()->attach($adminRole->id, ['business_unit_id' => $unit->id]);
        $this->postBms('roles/revoke', [
            'user_id' => $target->id, 'role_id' => $adminRole->id, 'business_unit_id' => $unit->id,
        ], $manager)->assertForbidden();
        $this->assertDatabaseHas('bms_role_user', [
            'user_id' => $target->id, 'bms_role_id' => $adminRole->id, 'business_unit_id' => $unit->id,
        ]);
        $this->assertDatabaseMissing('bms_role_user', [
            'user_id' => $target->id, 'bms_role_id' => $adminRole->id, 'business_unit_id' => null,
        ]);
    }

    public function test_P17_role_security_self_assignment_cannot_escalate_privileges(): void
    {
        // Scenario 17: self-targeting must not become a generic bypass.
        $unit = $this->makeUnit();
        $manager = $this->unitRoleManager([$unit->id]);

        // Self-grant of system_admin (global or unit-scoped) is refused.
        $this->postBms('roles/assign', [
            'user_id' => $manager->id, 'role_id' => $this->role('system_admin')->id,
        ], $manager)->assertForbidden();
        $this->postBms('roles/assign', [
            'user_id' => $manager->id, 'role_id' => $this->role('system_admin')->id, 'business_unit_id' => $unit->id,
        ], $manager)->assertForbidden();

        // Self-grant of a global-scope role is refused with or without a unit.
        $this->postBms('roles/assign', [
            'user_id' => $manager->id, 'role_id' => $this->role('hr')->id,
        ], $manager)->assertForbidden();
        $this->postBms('roles/assign', [
            'user_id' => $manager->id, 'role_id' => $this->role('hr')->id, 'business_unit_id' => $unit->id,
        ], $manager)->assertForbidden();

        $this->assertDatabaseMissing('bms_role_user', [
            'user_id' => $manager->id, 'bms_role_id' => $this->role('system_admin')->id,
        ]);
        $this->assertDatabaseMissing('bms_role_user', [
            'user_id' => $manager->id, 'bms_role_id' => $this->role('hr')->id,
        ]);

        // Existing self-protection rule stays effective for global actors,
        // and a unit-scoped actor never reaches it because scope comes first.
        $admin = $this->actingAsRole('system_admin', [], ['sub_departments_id' => 1]);
        $this->postBms('roles/revoke', [
            'user_id' => $admin->id, 'role_id' => $this->role('system_admin')->id,
        ], $admin)->assertStatus(422);

        $this->postBms('roles/revoke', [
            'user_id' => $manager->id, 'role_id' => $this->role('unit_roles_manager')->id,
        ], $manager)->assertForbidden();
    }

    public function test_P17_role_security_privileged_role_grants_are_restricted(): void
    {
        // Scenario 18: the implemented policy (no hierarchy exists, so the
        // safest defensible restriction applies) — a unit-scoped manager may
        // not grant roles that confer global scope or role-management power.
        $unit = $this->makeUnit();
        $manager = $this->unitRoleManager([$unit->id]);
        $target = $this->memberOf($unit);

        // hr is a global-scope role: even attached to a unit it would widen
        // the holder's visibleUnitIds() to the whole company.
        $this->postBms('roles/assign', [
            'user_id' => $target->id, 'role_id' => $this->role('hr')->id, 'business_unit_id' => $unit->id,
        ], $manager)->assertForbidden();
        $this->postBms('roles/assign', [
            'user_id' => $target->id, 'role_id' => $this->role('executive')->id, 'business_unit_id' => $unit->id,
        ], $manager)->assertForbidden();

        // A role that itself carries roles.manage may not be minted either.
        $roleManagerRole = BmsRole::updateOrCreate(['slug' => 'unit_roles_manager'], [
            'name' => 'Unit roles manager', 'abilities' => ['roles.manage', 'directory.view'],
        ]);
        $this->postBms('roles/assign', [
            'user_id' => $target->id, 'role_id' => $roleManagerRole->id, 'business_unit_id' => $unit->id,
        ], $manager)->assertForbidden();

        $this->assertDatabaseMissing('bms_role_user', [
            'user_id' => $target->id, 'bms_role_id' => $this->role('hr')->id, 'business_unit_id' => $unit->id,
        ]);
        $this->assertDatabaseMissing('bms_role_user', [
            'user_id' => $target->id, 'bms_role_id' => $this->role('executive')->id, 'business_unit_id' => $unit->id,
        ]);
        $this->assertDatabaseMissing('bms_role_user', [
            'user_id' => $target->id, 'bms_role_id' => $roleManagerRole->id, 'business_unit_id' => $unit->id,
        ]);
    }

    public function test_P17_role_security_invalid_or_deleted_targets_are_handled_safely(): void
    {
        // Scenario 19: invalid, missing or deleted target employees are safe.
        // Scenario 20: invalid role and invalid unit get the validation response.
        $unit = $this->makeUnit();
        $admin = $this->actingAsRole('system_admin');
        $employeeRole = $this->role('employee');
        $before = $this->auditCount('role.assigned');

        $this->postBms('roles/assign', ['user_id' => 999999, 'role_id' => $employeeRole->id], $admin)
            ->assertStatus(422);

        $deleted = $this->memberOf($unit);
        $deleted->delete();
        $this->postBms('roles/assign', [
            'user_id' => $deleted->id, 'role_id' => $employeeRole->id, 'business_unit_id' => $unit->id,
        ], $admin)->assertNotFound();

        $alive = $this->memberOf($unit);
        $this->postBms('roles/assign', [
            'user_id' => $alive->id, 'role_id' => 999999, 'business_unit_id' => $unit->id,
        ], $admin)->assertStatus(422);
        $this->postBms('roles/assign', [
            'user_id' => $alive->id, 'role_id' => $employeeRole->id, 'business_unit_id' => 999999,
        ], $admin)->assertStatus(422);

        // Route-bound reads of missing/deleted employees are 404, not a leak.
        $this->getBms('employees/999999/roles', $admin)->assertNotFound();
        $this->getBms('employees/'.$deleted->id.'/roles', $admin)->assertNotFound();

        $this->assertSame($before, $this->auditCount('role.assigned'), 'Rejected requests must not be audited.');
    }

    public function test_P17_role_security_authorized_changes_write_exactly_one_audit_record(): void
    {
        // Scenario 21: one authorized assignment writes exactly one audit record.
        // Scenario 22: one authorized revocation writes exactly one audit record.
        $unit = $this->makeUnit();
        $admin = $this->actingAsRole('system_admin');
        $target = $this->memberOf($unit);
        $employeeRole = $this->role('employee');
        $payload = ['user_id' => $target->id, 'role_id' => $employeeRole->id, 'business_unit_id' => $unit->id];

        $assignedBefore = $this->auditCount('role.assigned');
        $revokedBefore = $this->auditCount('role.revoked');

        $this->postBms('roles/assign', $payload, $admin)->assertOk();
        $this->assertSame($assignedBefore + 1, $this->auditCount('role.assigned'));

        $this->postBms('roles/revoke', $payload, $admin)->assertOk();
        $this->assertSame($revokedBefore + 1, $this->auditCount('role.revoked'));
        $this->assertSame($assignedBefore + 1, $this->auditCount('role.assigned'), 'Revocation must not add an assignment record.');
    }

    public function test_P17_role_security_unauthorized_changes_write_no_audit_record(): void
    {
        // Scenario 23: unauthorized assignments write no audit record.
        // Scenario 24: unauthorized revocations write no audit record.
        $mine = $this->makeUnit();
        $theirs = $this->makeUnit();
        $manager = $this->unitRoleManager([$mine->id]);
        $outsider = $this->memberOf($theirs);
        $member = $this->memberOf($mine);
        $employeeRole = $this->role('employee');
        $member->bmsRoles()->attach($employeeRole->id, ['business_unit_id' => $theirs->id]);

        $assignedBefore = $this->auditCount('role.assigned');
        $revokedBefore = $this->auditCount('role.revoked');

        // Cross-unit target, unrelated unit, global grant, system_admin grant.
        $this->postBms('roles/assign', [
            'user_id' => $outsider->id, 'role_id' => $employeeRole->id, 'business_unit_id' => $mine->id,
        ], $manager)->assertForbidden();
        $this->postBms('roles/assign', [
            'user_id' => $member->id, 'role_id' => $employeeRole->id, 'business_unit_id' => $theirs->id,
        ], $manager)->assertForbidden();
        $this->postBms('roles/assign', [
            'user_id' => $member->id, 'role_id' => $employeeRole->id,
        ], $manager)->assertForbidden();
        $this->postBms('roles/assign', [
            'user_id' => $member->id, 'role_id' => $this->role('system_admin')->id, 'business_unit_id' => $mine->id,
        ], $manager)->assertForbidden();

        // Unauthorized revocations (global + cross-unit).
        $this->postBms('roles/revoke', [
            'user_id' => $member->id, 'role_id' => $this->role('hr')->id,
        ], $manager)->assertForbidden();
        $this->postBms('roles/revoke', [
            'user_id' => $member->id, 'role_id' => $employeeRole->id, 'business_unit_id' => $theirs->id,
        ], $manager)->assertForbidden();

        $this->assertSame($assignedBefore, $this->auditCount('role.assigned'));
        $this->assertSame($revokedBefore, $this->auditCount('role.revoked'));
        $this->assertDatabaseMissing('bms_role_user', [
            'user_id' => $outsider->id, 'bms_role_id' => $employeeRole->id, 'business_unit_id' => $mine->id,
        ]);
    }

    public function test_P17_role_security_unit_managers_cannot_see_outsider_assignments_or_audit(): void
    {
        // Scenario 25: unit-scoped users cannot read unrelated employees' assignments.
        // Scenario 26: unit-scoped users cannot read unrelated employees' audit entries,
        // not even global entries for employees who are inside their units.
        $mine = $this->makeUnit();
        $theirs = $this->makeUnit();
        $admin = $this->actingAsRole('system_admin');
        $manager = $this->unitRoleManager([$mine->id]);
        $employeeRole = $this->role('employee');

        $member = $this->memberOf($mine, ['username' => 'audit.member']);
        $stranger = $this->memberOf($theirs, ['username' => 'audit.stranger']);

        // Out-of-scope employees: 403, and no unit-less employee either.
        $drifter = $this->makeUser(['username' => 'audit.drifter']);
        $this->getBms('employees/'.$stranger->id.'/roles', $manager)->assertForbidden();
        $this->getBms('employees/'.$drifter->id.'/roles', $manager)->assertForbidden();

        // Real assignment for the in-scope employee creates one audit entry.
        $this->postBms('roles/assign', [
            'user_id' => $member->id, 'role_id' => $employeeRole->id, 'business_unit_id' => $mine->id,
        ], $admin)->assertOk();
        $memberEntry = BmsAuditLog::where('event', 'role.assigned')
            ->where('auditable_id', $member->id)->latest('id')->firstOrFail();

        // Directly seeded entries: another unit's change, and a global change.
        $strangerEntry = BmsAuditLog::create([
            'auditable_type' => User::class, 'auditable_id' => $stranger->id,
            'event' => 'role.assigned', 'user_id' => $admin->id,
            'new_values' => ['user_id' => $stranger->id, 'role_id' => $employeeRole->id, 'business_unit_id' => $theirs->id],
        ]);
        $globalEntry = BmsAuditLog::create([
            'auditable_type' => User::class, 'auditable_id' => $member->id,
            'event' => 'role.assigned', 'user_id' => $admin->id,
            'new_values' => ['user_id' => $member->id, 'role_id' => $employeeRole->id],
        ]);

        $visibleIds = collect($this->getBms('audit/role-changes', $manager)->assertOk()->json('data'))->pluck('id');
        $this->assertTrue($visibleIds->contains($memberEntry->id), 'Own-unit audit entries stay visible.');
        $this->assertFalse($visibleIds->contains($strangerEntry->id), 'Other units\' audit entries must not leak.');
        $this->assertFalse($visibleIds->contains($globalEntry->id), 'Global role changes must not leak to unit-scoped viewers.');

        // In-scope reads work, but global assignments stay hidden (F-rule).
        $member->bmsRoles()->attach($this->role('hr')->id, ['business_unit_id' => null]);
        $memberRows = $this->getBms('employees/'.$member->id.'/roles', $manager)->assertOk()->json('data');
        $this->assertCount(1, $memberRows, 'Only the unit-scoped assignment is exposed to a unit manager.');
        $this->assertSame('unit', $memberRows[0]['scope']);
        $this->assertSame($mine->id, (int) $memberRows[0]['business_unit_id']);
    }

    public function test_P17_role_security_global_administrators_retain_full_visibility(): void
    {
        // Scenario 27: global administrators keep the intended global visibility.
        $mine = $this->makeUnit();
        $theirs = $this->makeUnit();
        $admin = $this->actingAsRole('system_admin');
        $employeeRole = $this->role('employee');

        $stranger = $this->memberOf($theirs, ['username' => 'global.stranger']);
        $stranger->bmsRoles()->attach($employeeRole->id, ['business_unit_id' => $theirs->id]);
        $stranger->bmsRoles()->attach($this->role('hr')->id, ['business_unit_id' => null]);

        // All assignments of an unrelated employee, including the global one.
        $assignments = $this->getBms('employees/'.$stranger->id.'/roles', $admin)
            ->assertOk()->json('data');
        $this->assertCount(2, $assignments);
        $this->assertEqualsCanonicalizing(['unit', 'global'], collect($assignments)->pluck('scope')->all());

        // Audit entries from every unit and from global changes remain visible.
        BmsAuditLog::create([
            'auditable_type' => User::class, 'auditable_id' => $stranger->id,
            'event' => 'role.assigned', 'user_id' => $admin->id,
            'new_values' => ['user_id' => $stranger->id, 'role_id' => $employeeRole->id, 'business_unit_id' => $theirs->id],
        ]);
        BmsAuditLog::create([
            'auditable_type' => User::class, 'auditable_id' => $stranger->id,
            'event' => 'role.revoked', 'user_id' => $admin->id,
            'new_values' => ['user_id' => $stranger->id, 'role_id' => $employeeRole->id],
        ]);
        $ids = collect($this->getBms('audit/role-changes', $admin)->assertOk()->json('data'))->pluck('id');
        $expected = BmsAuditLog::whereIn('auditable_id', [$stranger->id])->pluck('id');
        $this->assertTrue($expected->every(fn ($id) => $ids->contains($id)), 'Global viewers see every role audit entry.');
    }

    // =====================================================================
    // Phase 1 follow-up — the hire flow is also a role-grant path.
    // RecruitmentController::hireNewEmployee used to attach role_id with
    // only recruitment.manage + unit scope, letting a recruiter mint
    // system_admin / global-scope roles. The centralized policy now guards
    // it, and BusinessUnitController::syncDirectorRole() is pinned as a
    // trusted, server-derived internal operation.
    // =====================================================================

    /** Builds a hiring request with a candidate whose interview has passed. */
    private function readyCandidateFor(User $recruiter, BusinessUnit $unit, string $tag): array
    {
        $hiring = $this->postBms('recruitment', [
            'business_unit_id' => $unit->id, 'job_title' => 'Analyst '.$tag, 'specification' => 'Excel',
        ], $recruiter)->assertStatus(201)->json('data');
        $candidate = \App\Models\BMS\Candidate::create([
            'bms_hiring_request_id' => $hiring['id'], 'name' => 'Candidate '.$tag,
            'email' => $tag.'@example.test', 'interview_decision' => 'pass', 'status' => 'selected',
        ]);

        return [$hiring, $candidate];
    }

    public function test_P17_role_security_recruiter_without_role_management_cannot_grant_roles(): void
    {
        // A recruiter holding recruitment.manage but NOT roles.manage (the
        // seeded unit_director profile) must not attach any role at hire —
        // while the role-less hire workflow keeps working.
        $unit = $this->makeUnit();
        $recruiter = $this->actingAsRole('unit_director', [$unit->id]);
        [$hiring, $candidate] = $this->readyCandidateFor($recruiter, $unit, 'rec1');
        $employeeRole = $this->role('employee');

        $payload = [
            'first_working_day' => '2026-12-01', 'username' => 'eve.rec1', 'email' => 'eve.rec1@example.test',
            'firstname' => 'Eve', 'lastname' => 'Rec1', 'password' => 'secret-pass',
        ];

        // Any role — ordinary, system_admin, or global-scope — is refused
        // before any account or onboarding row is written.
        foreach ([$employeeRole->id, $this->role('system_admin')->id, $this->role('hr')->id] as $roleId) {
            $this->postBms('candidates/'.$candidate->id.'/hire-new-employee',
                $payload + ['role_id' => $roleId], $recruiter)->assertForbidden();
        }
        $this->assertDatabaseMissing('users', ['username' => 'eve.rec1']);
        $this->assertSame(0, \App\Models\BMS\OnboardingItem::where('bms_hiring_request_id', $hiring['id'])->count());
        $this->assertSame(0, BmsAuditLog::where('event', 'employee.created_from_hiring')->count());

        // Legitimate recruitment workflow: hire without a role still succeeds.
        $this->postBms('candidates/'.$candidate->id.'/hire-new-employee', $payload, $recruiter)
            ->assertStatus(201);
        $employee = User::where('username', 'eve.rec1')->firstOrFail();
        $this->assertSame(0, $employee->bmsRoles()->count(), 'Role-less hire attaches nothing.');
        $this->assertTrue($employee->businessUnits()->where('business_units.id', $unit->id)->exists());
    }

    public function test_P17_role_security_recruitment_hire_role_grants_follow_the_central_policy(): void
    {
        // An actor who holds BOTH recruitment.manage and roles.manage (but is
        // still restricted: no "*", not Administration) passes the actor check
        // yet is still bound by the escalation rules on the hire path.
        $unit = $this->makeUnit();
        $recruiter = $this->actingAsRole('hr'); // recruitment.manage + global view, no roles.manage
        $roleManagerRole = BmsRole::updateOrCreate(['slug' => 'unit_roles_manager'], [
            'name' => 'Unit roles manager', 'abilities' => ['roles.manage', 'directory.view'],
        ]);
        $recruiter->bmsRoles()->attach($roleManagerRole->id, ['business_unit_id' => null]);
        [$hiring, $candidate] = $this->readyCandidateFor($recruiter, $unit, 'rec2');

        $payload = [
            'first_working_day' => '2026-12-01', 'username' => 'eve.rec2', 'email' => 'eve.rec2@example.test',
            'firstname' => 'Eve', 'lastname' => 'Rec2', 'password' => 'secret-pass',
        ];

        // B. system_admin is Administration-only on every path.
        $this->postBms('candidates/'.$candidate->id.'/hire-new-employee',
            $payload + ['role_id' => $this->role('system_admin')->id], $recruiter)->assertForbidden();
        // D. Global-scope and role-managing roles stay out of reach.
        $this->postBms('candidates/'.$candidate->id.'/hire-new-employee',
            $payload + ['role_id' => $this->role('hr')->id], $recruiter)->assertForbidden();
        $this->postBms('candidates/'.$candidate->id.'/hire-new-employee',
            $payload + ['role_id' => $roleManagerRole->id], $recruiter)->assertForbidden();

        $this->assertDatabaseMissing('users', ['username' => 'eve.rec2']);
        $this->assertSame(0, \App\Models\BMS\OnboardingItem::where('bms_hiring_request_id', $hiring['id'])->count());

        // Positive: an ordinary unit-scoped role at the hiring unit is granted.
        $this->postBms('candidates/'.$candidate->id.'/hire-new-employee',
            $payload + ['role_id' => $this->role('employee')->id], $recruiter)->assertStatus(201);
        $employee = User::where('username', 'eve.rec2')->firstOrFail();
        $this->assertDatabaseHas('bms_role_user', [
            'user_id' => $employee->id, 'bms_role_id' => $this->role('employee')->id, 'business_unit_id' => $unit['id'],
        ]);
    }

    public function test_P17_role_security_hire_existing_employee_never_attaches_roles(): void
    {
        // Option B (link an existing account) has no role_id in its validated
        // contract: even a smuggled role_id in the payload cannot create a
        // role assignment — only the hiring unit's membership is added.
        $unit = $this->makeUnit();
        $recruiter = $this->actingAsRole('hr');
        [$hiring, $candidate] = $this->readyCandidateFor($recruiter, $unit, 'rec3');
        $existing = $this->makeUser();

        $this->postBms('candidates/'.$candidate->id.'/hire', [
            'first_working_day' => '2026-12-01', 'employee_id' => $existing->id,
            'role_id' => $this->role('system_admin')->id, // stripped by validation
        ], $recruiter)->assertOk();

        $this->assertSame(0, $existing->fresh()->bmsRoles()->count(), 'The existing-employee hire flow grants no roles.');
        $this->assertTrue($existing->businessUnits()->where('business_units.id', $unit->id)->exists());
    }

    public function test_P17_role_security_director_role_sync_is_server_derived_and_unit_scoped(): void
    {
        // Evidence that BusinessUnitController::syncDirectorRole() is a
        // trusted internal operation, not an externally controllable
        // escalation path:
        //  1. the role slug is fixed server-side (never a request field);
        //  2. the endpoint requires units.manage (only "*" holders qualify
        //     under the seeded role matrix) and authorizeUnit on update;
        //  3. the granted role has neither global scope nor roles.manage.
        $admin = $this->actingAsRole('system_admin');
        $director = $this->makeUser();
        $unit = $this->postBms('units', ['name' => 'Director Sync Unit', 'director_id' => $director->id], $admin)
            ->assertCreated()->json('data');

        $unitDirectorRole = $this->role('unit_director');
        $this->assertDatabaseHas('bms_role_user', [
            'user_id' => $director->id, 'bms_role_id' => $unitDirectorRole->id, 'business_unit_id' => $unit['id'],
        ]);

        // The server-derived role carries neither global scope nor role-management power.
        $this->assertNotContains('unit_director', BmsAccess::GLOBAL_SCOPE_ROLE_SLUGS);
        $this->assertNotContains('*', $unitDirectorRole->abilities);
        $this->assertNotContains('roles.manage', $unitDirectorRole->abilities);

        // The director stays unit-scoped (not collapsed to global visibility)...
        $visible = app(BmsAccess::class)->visibleUnitIds($director);
        $this->assertNotNull($visible, 'unit_director must not confer global scope.');
        $this->assertContains($unit['id'], $visible);

        // ...and gains no role-management authority through the sync.
        $this->postBms('roles/assign', [
            'user_id' => $this->makeUser()->id, 'role_id' => $this->role('employee')->id, 'business_unit_id' => $unit['id'],
        ], $director)->assertForbidden();

        // Reassignment through the update endpoint behaves identically.
        $newDirector = $this->makeUser();
        $this->putBms('units/'.$unit['id'], ['name' => 'Director Sync Unit', 'director_id' => $newDirector->id], $admin)
            ->assertOk();
        $this->assertDatabaseHas('bms_role_user', [
            'user_id' => $newDirector->id, 'bms_role_id' => $unitDirectorRole->id, 'business_unit_id' => $unit['id'],
        ]);
    }
}
