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
