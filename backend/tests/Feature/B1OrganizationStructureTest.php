<?php

namespace Tests\Feature;

use App\Models\BMS\BmsAuditLog;
use App\Models\BMS\BmsRole;
use App\Models\BMS\BusinessUnit;
use App\Models\BMS\CentralDepartment;
use App\Models\BMS\Team;
use App\Models\Project;
use App\Models\User;
use App\Services\BMS\BmsAccess;
use App\Services\BMS\PrimaryAssignment;
use Database\Seeders\BmsOrganizationSeeder;
use Database\Seeders\BmsPhaseOneSeeder;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\ValidationException;
use Tests\BmsTestCase;

/**
 * Stage B1 — database foundation of the enterprise organization structure:
 * teams, team leads, unit development managers, central departments, the
 * employee's primary assignment, project ↔ unit links, abilities and the
 * team_lead role. No endpoint is added in B1; these tests exercise the schema,
 * the models, the migrations and the seeders directly, plus the two existing
 * endpoints that can remove a unit membership.
 */
class B1OrganizationStructureTest extends BmsTestCase
{
    private const NEW_ABILITIES = [
        'teams.view', 'teams.manage', 'teams.manage_own', 'departments.view', 'departments.manage', 'projects.view', 'projects.link',
    ];

    private function project(string $title = 'Legacy project'): Project
    {
        $id = DB::table('projects')->insertGetId(['project_title' => $title, 'created_at' => now(), 'updated_at' => now()]);

        return Project::findOrFail($id);
    }

    private function assertRejectedByDatabase(callable $write, string $message): void
    {
        try {
            $write();
        } catch (QueryException $exception) {
            $this->addToAssertionCount(1);

            return;
        }
        $this->fail($message);
    }

    /* ------------------------------------------------------------------ schema */

    public function test_B1_migration_creates_the_tables_and_columns(): void
    {
        $expected = [
            'bms_teams' => ['id', 'business_unit_id', 'name', 'description', 'lead_id', 'is_active', 'created_at', 'updated_at'],
            'bms_team_user' => ['id', 'team_id', 'user_id', 'created_at', 'updated_at'],
            'bms_central_departments' => ['id', 'code', 'name', 'name_ar', 'description', 'head_id', 'legacy_department_id', 'is_active', 'created_at', 'updated_at'],
            'bms_central_department_user' => ['id', 'central_department_id', 'user_id', 'created_at', 'updated_at'],
            'bms_project_business_unit' => ['id', 'project_id', 'business_unit_id', 'is_lead', 'created_at', 'updated_at'],
        ];
        foreach ($expected as $table => $columns) {
            $this->assertTrue(Schema::hasTable($table), "{$table} must exist");
            $this->assertEqualsCanonicalizing($columns, Schema::getColumnListing($table), "{$table} columns");
        }
        $this->assertTrue(Schema::hasColumn('business_units', 'development_manager_id'));
        $this->assertTrue(Schema::hasColumn('users', 'primary_business_unit_id'));
        $this->assertTrue(Schema::hasColumn('users', 'primary_central_department_id'));
    }

    public function test_B1_migration_is_additive_rerunnable_and_reversible(): void
    {
        $legacyColumns = [
            'departments' => Schema::getColumnListing('departments'),
            'sub_departments' => Schema::getColumnListing('sub_departments'),
            'projects' => Schema::getColumnListing('projects'),
        ];
        $unit = $this->makeUnit();
        $user = $this->makeUser();
        $user->businessUnits()->attach($unit->id);

        // Running it again on an installation that already has it changes nothing and does not fail.
        (new \CreateBmsOrganizationStructure())->up();
        $this->assertTrue(Schema::hasTable('bms_teams'));

        (new \CreateBmsOrganizationStructure())->down();
        foreach (['bms_teams', 'bms_team_user', 'bms_central_departments', 'bms_central_department_user', 'bms_project_business_unit'] as $table) {
            $this->assertFalse(Schema::hasTable($table), "{$table} must be removed by the rollback");
        }
        $this->assertFalse(Schema::hasColumn('business_units', 'development_manager_id'));
        $this->assertFalse(Schema::hasColumn('users', 'primary_business_unit_id'));
        $this->assertFalse(Schema::hasColumn('users', 'primary_central_department_id'));

        // The rollback leaves existing data and the legacy tables exactly as they were.
        $this->assertNotNull(User::find($user->id));
        $this->assertNotNull(BusinessUnit::find($unit->id));
        $this->assertSame(1, DB::table('business_unit_user')->where('user_id', $user->id)->count());
        foreach ($legacyColumns as $table => $columns) {
            $this->assertSame($columns, Schema::getColumnListing($table), "{$table} must not be altered");
        }

        (new \CreateBmsOrganizationStructure())->up();
        $this->assertTrue(Schema::hasColumn('users', 'primary_business_unit_id'));
    }

    public function test_B1_declared_constraints_match_the_schema_that_is_actually_built(): void
    {
        // The MySQL repair step adds whatever is missing from these two lists, so
        // they must describe exactly the constraints the migration builds.
        $created = ['bms_teams', 'bms_team_user', 'bms_central_departments', 'bms_central_department_user', 'bms_project_business_unit'];

        $declared = [];
        foreach (\CreateBmsOrganizationStructure::FOREIGN_KEYS as [$table, $column, $references, $onDelete]) {
            $this->assertTrue(Schema::hasColumn($table, $column), "{$table}.{$column} must exist");
            $this->assertTrue(Schema::hasTable($references), "{$references} must exist");
            if (in_array($table, $created, true)) {
                $declared[] = implode('|', [$table, $column, $references, strtoupper($onDelete)]);
            }
        }
        $actual = [];
        foreach ($created as $table) {
            foreach (DB::select("PRAGMA foreign_key_list('{$table}')") as $key) {
                $this->assertSame('id', $key->to);
                $actual[] = implode('|', [$table, $key->from, $key->table, strtoupper($key->on_delete)]);
            }
        }
        $this->assertEqualsCanonicalizing($actual, $declared);
        $this->assertCount(13, \CreateBmsOrganizationStructure::FOREIGN_KEYS);
        // The three keys on pre-existing tables are the ones SQLite cannot build.
        $this->assertCount(10, $declared);

        $declaredIndexes = [];
        foreach (\CreateBmsOrganizationStructure::UNIQUE_INDEXES as [$table, $columns, $name]) {
            $declaredIndexes[] = $table.'|'.$name.'|'.implode(',', $columns);
        }
        $actualIndexes = [];
        foreach ($created as $table) {
            foreach (DB::select("PRAGMA index_list('{$table}')") as $index) {
                if (!$index->unique || $index->origin !== 'c') continue;
                $columns = array_map(fn ($column) => $column->name, DB::select("PRAGMA index_info('{$index->name}')"));
                $actualIndexes[] = $table.'|'.$index->name.'|'.implode(',', $columns);
            }
        }
        $this->assertEqualsCanonicalizing($actualIndexes, $declaredIndexes);
    }

    /* ----------------------------------------------------------- relationships */

    public function test_B1_one_employee_sits_in_several_teams_without_a_second_account(): void
    {
        $unit = $this->makeUnit();
        $lead = $this->makeUser();
        $member = $this->makeUser();
        $manager = $this->makeUser();
        DB::table('users')->where('id', $member->id)->update(['manager_id' => $manager->id]);
        $usersBefore = User::count();

        $platform = Team::create(['business_unit_id' => $unit->id, 'name' => 'Platform', 'lead_id' => $lead->id]);
        $data = Team::create(['business_unit_id' => $unit->id, 'name' => 'Data']);
        $platform->users()->attach([$lead->id, $member->id]);
        $data->users()->attach($member->id);

        $this->assertSame($usersBefore, User::count(), 'team membership must not create user records');
        $this->assertEqualsCanonicalizing([$platform->id, $data->id], $member->teams()->pluck('bms_teams.id')->all());
        $this->assertEqualsCanonicalizing([$lead->id, $member->id], $platform->users()->pluck('users.id')->all());
        $this->assertTrue($platform->lead->is($lead));
        $this->assertTrue($platform->businessUnit->is($unit));
        $this->assertSame([$platform->id], $lead->ledTeams()->pluck('id')->all());
        $this->assertEqualsCanonicalizing([$platform->id, $data->id], $unit->teams()->pluck('id')->all());
        $this->assertTrue($platform->fresh()->is_active);

        // The team lead is not the reporting line: manager_id is untouched by team membership.
        $this->assertSame($manager->id, (int) $member->fresh()->manager_id);
        $this->assertNull($lead->fresh()->manager_id);
    }

    public function test_B1_development_manager_is_separate_from_director_and_team_lead(): void
    {
        $director = $this->makeUser();
        $person = $this->makeUser();
        $unit = $this->makeUnit(['director_id' => $director->id]);
        $unit->update(['development_manager_id' => $person->id]);
        $team = Team::create(['business_unit_id' => $unit->id, 'name' => 'Core', 'lead_id' => $person->id]);

        $unit->refresh();
        $this->assertTrue($unit->developmentManager->is($person));
        $this->assertTrue($unit->director->is($director));
        // The same person may hold both responsibilities.
        $this->assertTrue($team->lead->is($person));
        $this->assertSame([$unit->id], $person->developmentManagedUnits()->pluck('id')->all());

        $unit->update(['development_manager_id' => null]);
        $this->assertNull($unit->fresh()->developmentManager);
        $this->assertTrue($team->fresh()->lead->is($person), 'clearing the development manager must not touch team leads');
    }

    public function test_B1_central_departments_have_a_head_and_members_and_stay_separate_from_units(): void
    {
        $head = $this->makeUser();
        $member = $this->makeUser();
        $unit = $this->makeUnit();
        $member->businessUnits()->attach($unit->id);
        $unitsBefore = BusinessUnit::count();
        $usersBefore = User::count();

        $hr = CentralDepartment::where('code', 'hr')->firstOrFail();
        $finance = CentralDepartment::where('code', 'finance')->firstOrFail();
        $hr->update(['head_id' => $head->id, 'legacy_department_id' => 2]);
        $hr->users()->attach([$head->id, $member->id]);
        $finance->users()->attach($member->id);

        $this->assertTrue($hr->fresh()->head->is($head));
        $this->assertSame('HR', $hr->fresh()->legacyDepartment->department_name);
        $this->assertEqualsCanonicalizing([$hr->id, $finance->id], $member->centralDepartments()->pluck('bms_central_departments.id')->all());
        $this->assertSame([$hr->id], $head->headedCentralDepartments()->pluck('id')->all());
        // Same single user record in a unit and in two departments.
        $this->assertSame($usersBefore, User::count());
        $this->assertSame([$unit->id], $member->businessUnits()->pluck('business_units.id')->all());
        // Central departments are not business units.
        $this->assertSame($unitsBefore, BusinessUnit::count());
        $this->assertSame(0, BusinessUnit::whereIn('name', CentralDepartment::pluck('name'))->count());
    }

    public function test_B1_a_project_can_be_linked_to_several_units_without_altering_the_project(): void
    {
        $first = $this->makeUnit();
        $second = $this->makeUnit();
        $project = $this->project('Shared platform');
        $other = $this->project('Single unit');
        $before = (array) DB::table('projects')->where('id', $project->id)->first();

        $project->businessUnits()->attach([$first->id => ['is_lead' => true], $second->id => ['is_lead' => false]]);
        $other->businessUnits()->attach($first->id);

        $this->assertEqualsCanonicalizing([$first->id, $second->id], $project->businessUnits()->pluck('business_units.id')->all());
        $this->assertSame($first->id, $project->businessUnits()->wherePivot('is_lead', true)->firstOrFail()->id);
        $this->assertFalse((bool) $other->businessUnits()->firstOrFail()->pivot->is_lead, 'is_lead defaults to false');
        $this->assertEqualsCanonicalizing([$project->id, $other->id], $first->projects()->pluck('projects.id')->all());
        $this->assertSame([$project->id], $second->projects()->pluck('projects.id')->all());
        $this->assertSame($before, (array) DB::table('projects')->where('id', $project->id)->first(), 'the legacy project row must not change');
    }

    /* -------------------------------------------------------------- constraints */

    public function test_B1_team_names_are_unique_inside_a_unit_only(): void
    {
        $first = $this->makeUnit();
        $second = $this->makeUnit();
        Team::create(['business_unit_id' => $first->id, 'name' => 'Platform']);
        Team::create(['business_unit_id' => $second->id, 'name' => 'Platform']);

        $this->assertRejectedByDatabase(
            fn () => Team::create(['business_unit_id' => $first->id, 'name' => 'Platform']),
            'a second team with the same name in the same unit must be rejected'
        );
        $this->assertSame(2, Team::where('name', 'Platform')->count());
    }

    public function test_B1_memberships_and_links_cannot_be_duplicated(): void
    {
        $unit = $this->makeUnit();
        $user = $this->makeUser();
        $team = Team::create(['business_unit_id' => $unit->id, 'name' => 'Platform']);
        $department = CentralDepartment::where('code', 'hr')->firstOrFail();
        $project = $this->project();
        $team->users()->attach($user->id);
        $department->users()->attach($user->id);
        $project->businessUnits()->attach($unit->id);

        $this->assertRejectedByDatabase(fn () => $team->users()->attach($user->id), 'duplicate team membership must be rejected');
        $this->assertRejectedByDatabase(fn () => $department->users()->attach($user->id), 'duplicate department membership must be rejected');
        $this->assertRejectedByDatabase(fn () => $project->businessUnits()->attach($unit->id), 'duplicate project link must be rejected');
        $this->assertRejectedByDatabase(
            fn () => CentralDepartment::create(['code' => 'hr', 'name' => 'Another HR']),
            'duplicate department code must be rejected'
        );
        $this->assertRejectedByDatabase(
            fn () => CentralDepartment::create(['code' => 'hr2', 'name' => $department->name]),
            'duplicate department name must be rejected'
        );
    }

    public function test_B1_foreign_keys_reject_unknown_records(): void
    {
        $unit = $this->makeUnit();
        $user = $this->makeUser();
        $team = Team::create(['business_unit_id' => $unit->id, 'name' => 'Platform']);

        $this->assertRejectedByDatabase(fn () => Team::create(['business_unit_id' => 999999, 'name' => 'Ghost']), 'unknown unit');
        $this->assertRejectedByDatabase(fn () => Team::create(['business_unit_id' => $unit->id, 'name' => 'Ghost lead', 'lead_id' => 999999]), 'unknown lead');
        $this->assertRejectedByDatabase(fn () => DB::table('bms_team_user')->insert(['team_id' => $team->id, 'user_id' => 999999]), 'unknown member');
        $this->assertRejectedByDatabase(fn () => DB::table('bms_team_user')->insert(['team_id' => 999999, 'user_id' => $user->id]), 'unknown team');
        $this->assertRejectedByDatabase(fn () => DB::table('bms_central_department_user')->insert(['central_department_id' => 999999, 'user_id' => $user->id]), 'unknown department');
        $this->assertRejectedByDatabase(fn () => DB::table('bms_project_business_unit')->insert(['project_id' => 999999, 'business_unit_id' => $unit->id]), 'unknown project');
        $this->assertRejectedByDatabase(fn () => DB::table('bms_project_business_unit')->insert(['project_id' => $this->project()->id, 'business_unit_id' => 999999]), 'unknown unit on a project link');
        $this->assertRejectedByDatabase(fn () => CentralDepartment::create(['code' => 'x', 'name' => 'X', 'legacy_department_id' => 999999]), 'unknown legacy department');
    }

    public function test_B1_deletion_behaviour_of_the_new_tables(): void
    {
        $unit = $this->makeUnit();
        $lead = $this->makeUser();
        $member = $this->makeUser();
        $team = Team::create(['business_unit_id' => $unit->id, 'name' => 'Platform', 'lead_id' => $lead->id]);
        $team->users()->attach([$lead->id, $member->id]);
        $department = CentralDepartment::where('code', 'hr')->firstOrFail();
        $department->update(['head_id' => $lead->id]);
        $department->users()->attach([$lead->id, $member->id]);
        $project = $this->project();
        $project->businessUnits()->attach($unit->id);

        // The application soft-deletes employees: nothing is detached, history is kept.
        $member->delete();
        $this->assertSame(2, DB::table('bms_team_user')->where('team_id', $team->id)->count());

        // A hard delete of a user clears the lead/head pointers and removes the membership rows.
        DB::table('users')->where('id', $lead->id)->delete();
        $this->assertNull($team->fresh()->lead_id);
        $this->assertNull($department->fresh()->head_id);
        $this->assertSame(0, DB::table('bms_team_user')->where('user_id', $lead->id)->count());
        $this->assertSame(0, DB::table('bms_central_department_user')->where('user_id', $lead->id)->count());
        $this->assertNotNull($team->fresh(), 'the team itself survives the loss of its lead');

        // A unit that still owns teams or project links cannot be hard-deleted from under them.
        $this->assertRejectedByDatabase(fn () => DB::table('business_units')->where('id', $unit->id)->delete(), 'a unit with teams must not be hard-deleted');

        // Deleting a team removes its memberships; deleting a department removes its memberships.
        $team->delete();
        $this->assertSame(0, DB::table('bms_team_user')->where('team_id', $team->id)->count());
        $department->delete();
        $this->assertSame(0, DB::table('bms_central_department_user')->where('central_department_id', $department->id)->count());
        $this->assertNotNull(User::withTrashed()->find($member->id), 'deleting a team or department never deletes an employee');

        // Deleting the legacy department only clears the optional pointer.
        $finance = CentralDepartment::where('code', 'finance')->firstOrFail();
        $finance->update(['legacy_department_id' => 5]);
        DB::table('sub_departments')->where('departments_id', 5)->delete();
        DB::table('departments')->where('id', 5)->delete();
        $this->assertNull($finance->fresh()->legacy_department_id);

        // A hard-deleted project takes its unit links with it.
        DB::table('projects')->where('id', $project->id)->delete();
        $this->assertSame(0, DB::table('bms_project_business_unit')->where('project_id', $project->id)->count());
    }

    /* ------------------------------------------------------- abilities and role */

    public function test_B1_abilities_migration_merges_without_overwriting_customised_roles(): void
    {
        // Simulate an installation whose roles predate B1 and were customised by an administrator.
        $hr = BmsRole::where('slug', 'hr')->firstOrFail();
        $hr->update(['abilities' => ['custom.report', 'dashboard.view', 'teams.view']]);
        $employee = BmsRole::where('slug', 'employee')->firstOrFail();
        $employee->update(['abilities' => ['dashboard.view']]);
        $admin = BmsRole::where('slug', 'system_admin')->firstOrFail();
        $teamLead = BmsRole::where('slug', 'team_lead')->firstOrFail();
        $teamLead->update(['name' => 'Squad Lead', 'abilities' => ['dashboard.view']]);
        BmsRole::where('slug', 'finance')->delete();
        $rolesBefore = BmsRole::count();

        (new \AddBmsOrganizationAbilities())->up();

        // Existing abilities keep their place; only the missing ones are appended, once.
        $this->assertSame(['custom.report', 'dashboard.view', 'teams.view', 'departments.view'], $hr->fresh()->abilities);
        $this->assertSame(['dashboard.view', 'teams.view', 'departments.view', 'projects.view'], $employee->fresh()->abilities);
        $this->assertSame(['*'], $admin->fresh()->abilities, 'a wildcard role is left alone');
        // An existing team_lead role is never overwritten, a missing role is never created.
        $this->assertSame('Squad Lead', $teamLead->fresh()->name);
        $this->assertSame(['dashboard.view'], $teamLead->fresh()->abilities);
        $this->assertSame($rolesBefore, BmsRole::count());
        $this->assertFalse(BmsRole::where('slug', 'finance')->exists());

        // Running it again changes nothing.
        $snapshot = BmsRole::orderBy('id')->pluck('abilities', 'slug')->all();
        (new \AddBmsOrganizationAbilities())->up();
        $this->assertSame($snapshot, BmsRole::orderBy('id')->pluck('abilities', 'slug')->all());
    }

    public function test_B1_abilities_migration_creates_team_lead_on_an_existing_installation_and_rolls_back_safely(): void
    {
        // Installation before B1: every role except team_lead, none of the new abilities.
        BmsRole::where('slug', 'team_lead')->delete();
        foreach (BmsRole::all() as $role) {
            $role->update(['abilities' => array_values(array_diff($role->abilities, self::NEW_ABILITIES))]);
        }

        (new \AddBmsOrganizationAbilities())->up();

        $teamLead = BmsRole::where('slug', 'team_lead')->firstOrFail();
        $this->assertSame('Team Lead', $teamLead->name);
        // The migration and the seeder must describe the same matrix.
        foreach (BmsPhaseOneSeeder::ROLES as $slug => [$name, $abilities]) {
            $this->assertEqualsCanonicalizing($abilities, BmsRole::where('slug', $slug)->firstOrFail()->abilities, "{$slug} after migration must equal the seeder matrix");
        }

        // Rollback: what the migration added disappears; an assigned team_lead role is kept untouched.
        $holder = $this->makeUser();
        $unit = $this->makeUnit();
        $holder->bmsRoles()->attach($teamLead->id, ['business_unit_id' => $unit->id]);
        (new \AddBmsOrganizationAbilities())->down();
        foreach (BmsRole::where('slug', '!=', 'team_lead')->get() as $role) {
            $this->assertSame([], array_values(array_intersect($role->abilities, self::NEW_ABILITIES)), "{$role->slug} must lose the abilities the migration added");
        }
        $this->assertSame(BmsPhaseOneSeeder::ROLES['team_lead'][1], BmsRole::where('slug', 'team_lead')->firstOrFail()->abilities, 'a role that is still assigned is neither deleted nor stripped');
        $this->assertSame(1, DB::table('bms_role_user')->where('user_id', $holder->id)->count());
        $this->assertFalse(Schema::hasTable(\AddBmsOrganizationAbilities::LEDGER));

        // A second up() finds team_lead already there: it did not create it, so it will never delete it.
        (new \AddBmsOrganizationAbilities())->up();
        $holder->bmsRoles()->detach();
        (new \AddBmsOrganizationAbilities())->down();
        $this->assertTrue(BmsRole::where('slug', 'team_lead')->exists());
    }

    public function test_B1_abilities_rollback_removes_an_unassigned_unmodified_team_lead_it_created(): void
    {
        BmsRole::where('slug', 'team_lead')->delete();
        (new \AddBmsOrganizationAbilities())->up();
        $this->assertTrue(BmsRole::where('slug', 'team_lead')->exists());
        $this->assertSame(1, DB::table(\AddBmsOrganizationAbilities::LEDGER)->where('role_slug', 'team_lead')->whereNull('ability')->count());

        (new \AddBmsOrganizationAbilities())->down();
        $this->assertFalse(BmsRole::where('slug', 'team_lead')->exists());

        // Created by the migration but adjusted by an administrator afterwards: kept.
        (new \AddBmsOrganizationAbilities())->up();
        BmsRole::where('slug', 'team_lead')->firstOrFail()->update(['name' => 'Squad Lead']);
        (new \AddBmsOrganizationAbilities())->down();
        $this->assertSame('Squad Lead', BmsRole::where('slug', 'team_lead')->firstOrFail()->name);
    }

    public function test_B1_abilities_rollback_keeps_abilities_the_migration_did_not_add(): void
    {
        // Installation before B1, where one role already held one of the "new" abilities.
        BmsRole::where('slug', 'team_lead')->delete();
        foreach (BmsRole::all() as $role) {
            $role->update(['abilities' => array_values(array_diff($role->abilities, self::NEW_ABILITIES))]);
        }
        $hr = BmsRole::where('slug', 'hr')->firstOrFail();
        $hr->update(['abilities' => array_merge($hr->abilities, ['teams.view'])]);           // held before the migration
        $alphaDelta = BmsRole::where('slug', 'alpha_delta')->firstOrFail();
        $before = ['alpha_delta' => $alphaDelta->abilities, 'employee' => BmsRole::where('slug', 'employee')->value('abilities')];

        (new \AddBmsOrganizationAbilities())->up();
        (new \AddBmsOrganizationAbilities())->up(); // re-run: no duplicate ledger rows

        $ledger = DB::table(\AddBmsOrganizationAbilities::LEDGER)->get();
        $this->assertSame($ledger->count(), $ledger->unique(fn ($row) => $row->role_slug.'|'.$row->ability)->count());
        $this->assertSame(['departments.view'], $ledger->where('role_slug', 'hr')->pluck('ability')->values()->all(), 'only what was really appended is recorded');

        // After the migration an administrator grants more by hand.
        $alphaDelta->refresh()->update(['abilities' => array_merge($alphaDelta->abilities, ['teams.view', 'custom.board'])]); // role the migration never touched
        $finance = BmsRole::where('slug', 'finance')->firstOrFail();
        $finance->update(['abilities' => array_merge($finance->abilities, ['teams.manage', 'custom.ledger'])]);               // extra ability on a touched role
        $executive = BmsRole::where('slug', 'executive')->firstOrFail();
        $executive->update(['abilities' => array_merge($executive->abilities, ['*'])]);                                      // became a wildcard role
        $executiveAbilities = $executive->fresh()->abilities;
        $admin = BmsRole::where('slug', 'system_admin')->firstOrFail();

        (new \AddBmsOrganizationAbilities())->down();

        // Pre-existing ability kept, migration-added ability removed.
        $this->assertContains('teams.view', $hr->fresh()->abilities);
        $this->assertNotContains('departments.view', $hr->fresh()->abilities);
        // Manual grants survive, on untouched and on touched roles.
        $this->assertSame(array_merge($before['alpha_delta'], ['teams.view', 'custom.board']), $alphaDelta->fresh()->abilities);
        $this->assertContains('teams.manage', $finance->fresh()->abilities);
        $this->assertContains('custom.ledger', $finance->fresh()->abilities);
        $this->assertSame([], array_values(array_intersect($finance->fresh()->abilities, ['teams.view', 'departments.view', 'projects.view'])));
        // Wildcard roles are left exactly as they are.
        $this->assertSame($executiveAbilities, $executive->fresh()->abilities);
        $this->assertSame(['*'], $admin->fresh()->abilities);
        // A role the migration fully reverted is back to its earlier list.
        $this->assertSame(is_string($before['employee']) ? json_decode($before['employee'], true) : $before['employee'], BmsRole::where('slug', 'employee')->firstOrFail()->abilities);
    }

    public function test_B1_abilities_rollback_without_a_ledger_changes_nothing(): void
    {
        // Fresh installation: the seeder, not the migration, granted everything.
        $this->assertSame(0, DB::table(\AddBmsOrganizationAbilities::LEDGER)->count());
        $snapshot = BmsRole::orderBy('id')->get()->map->only(['slug', 'name', 'abilities'])->all();

        (new \AddBmsOrganizationAbilities())->down();
        $this->assertSame($snapshot, BmsRole::orderBy('id')->get()->map->only(['slug', 'name', 'abilities'])->all());
        (new \AddBmsOrganizationAbilities())->down(); // ledger already gone
        $this->assertSame($snapshot, BmsRole::orderBy('id')->get()->map->only(['slug', 'name', 'abilities'])->all());
    }

    public function test_B1_role_matrix_for_the_new_abilities(): void
    {
        $expected = [
            'executive' => ['teams.view', 'departments.view', 'projects.view'],
            'coordinator' => ['teams.view', 'departments.view', 'projects.view'],
            'operations' => ['teams.view', 'departments.view', 'projects.view'],
            'unit_director' => ['teams.view', 'teams.manage', 'departments.view', 'projects.view', 'projects.link'],
            'department_manager' => ['teams.view', 'departments.view', 'projects.view'],
            'alpha_delta' => [],
            'pr_marketing' => ['teams.view', 'departments.view', 'projects.view'],
            'finance' => ['teams.view', 'departments.view', 'projects.view'],
            'hr' => ['teams.view', 'departments.view'],
            'it' => ['teams.view', 'departments.view', 'projects.view'],
            'employee' => ['teams.view', 'departments.view', 'projects.view'],
            'team_lead' => ['teams.view', 'teams.manage_own', 'departments.view', 'projects.view'],
        ];
        foreach ($expected as $slug => $abilities) {
            $role = BmsRole::where('slug', $slug)->firstOrFail();
            $this->assertEqualsCanonicalizing($abilities, array_values(array_intersect($role->abilities, self::NEW_ABILITIES)), "{$slug} organization abilities");
            $this->assertSame(count($role->abilities), count(array_unique($role->abilities)), "{$slug} must not list an ability twice");
        }

        $access = app(BmsAccess::class);
        $unit = $this->makeUnit();
        $other = $this->makeUnit();

        // Company-level management is reachable only through the wildcard.
        $admin = $this->actingAsRole('system_admin');
        foreach (self::NEW_ABILITIES as $ability) {
            $this->assertTrue($access->can($ability, $admin), "system_admin must hold {$ability}");
        }
        $director = $this->actingAsRole('unit_director', [$unit->id]);
        $this->assertTrue($access->can('teams.manage', $director));
        $this->assertFalse($access->can('departments.manage', $director));
        $employee = $this->actingAsRole('employee', [$unit->id]);
        $this->assertFalse($access->can('teams.manage', $employee));
        $this->assertFalse($access->can('teams.manage_own', $employee));
        $this->assertFalse($access->can('projects.link', $employee));

        // team_lead is unit-scoped: it never widens the holder's scope to the whole company.
        $this->assertNotContains('team_lead', BmsAccess::GLOBAL_SCOPE_ROLE_SLUGS);
        $lead = $this->makeUser();
        $lead->bmsRoles()->attach(BmsRole::where('slug', 'team_lead')->value('id'), ['business_unit_id' => $unit->id]);
        $lead->businessUnits()->attach($unit->id);
        $this->assertFalse($access->hasGlobalUnitScope($lead));
        $this->assertSame([$unit->id], $access->visibleUnitIds($lead));
        $this->assertFalse($access->canAccessUnit($other->id, $lead));
        $this->assertTrue($access->can('teams.manage_own', $lead));
        $this->assertFalse($access->can('teams.manage', $lead));
        $this->assertFalse($access->can('roles.manage', $lead));

        // A user with no BMS role holds none of the new abilities.
        $nobody = $this->makeUser(['sub_departments_id' => 2]);
        foreach (self::NEW_ABILITIES as $ability) {
            $this->assertFalse($access->can($ability, $nobody), "a user without a role must not hold {$ability}");
        }
    }

    /* ------------------------------------------------------------------ seeding */

    public function test_B1_central_department_seeder_is_idempotent_and_never_overwrites(): void
    {
        $codes = ['hr', 'finance', 'marketing', 'central_it', 'legal_compliance'];
        $this->assertEqualsCanonicalizing($codes, CentralDepartment::pluck('code')->all());
        $this->assertSame(0, DB::table('bms_central_department_user')->count(), 'no member is seeded');
        $this->assertSame(0, CentralDepartment::whereNotNull('head_id')->count(), 'no head is seeded');
        $this->assertSame(0, CentralDepartment::whereNotNull('legacy_department_id')->count(), 'no legacy link is guessed');

        $head = $this->makeUser();
        $hr = CentralDepartment::where('code', 'hr')->firstOrFail();
        $hr->update(['name' => 'People & Culture', 'head_id' => $head->id, 'is_active' => false, 'legacy_department_id' => 2]);
        $hr->users()->attach($head->id);
        CentralDepartment::create(['code' => 'procurement', 'name' => 'Procurement']);

        (new BmsOrganizationSeeder())->run();
        (new BmsOrganizationSeeder())->run();

        $this->assertSame(6, CentralDepartment::count());
        $hr->refresh();
        $this->assertSame('People & Culture', $hr->name);
        $this->assertSame($head->id, (int) $hr->head_id);
        $this->assertFalse($hr->is_active);
        $this->assertSame(2, (int) $hr->legacy_department_id);
        $this->assertSame(1, $hr->users()->count());
    }

    public function test_B1_legacy_departments_are_untouched_and_still_served_by_lookups(): void
    {
        $this->assertSame(
            ['Administration', 'HR', 'IT', 'PR', 'Finance'],
            DB::table('departments')->orderBy('id')->pluck('department_name')->all()
        );
        $this->assertSame(6, DB::table('sub_departments')->count());

        $admin = $this->actingAsRole('system_admin');
        $lookups = $this->getBms('lookups', $admin)->assertOk()->json('data');
        $this->assertEqualsCanonicalizing(
            ['Administration', 'HR', 'IT', 'PR', 'Finance'],
            array_column($lookups['departments'], 'department_name'),
            'the existing lookups key keeps returning the legacy departments'
        );
    }

    public function test_B1_reseeding_roles_never_overwrites_a_customised_role(): void
    {
        // An administrator renamed roles and changed their abilities directly on this installation.
        $hr = BmsRole::where('slug', 'hr')->firstOrFail();
        $hr->update(['name' => 'People Operations', 'abilities' => ['custom.payroll', 'directory.view', 'dashboard.view']]);
        $teamLead = BmsRole::where('slug', 'team_lead')->firstOrFail();
        $teamLead->update(['name' => 'Squad Lead', 'abilities' => ['teams.manage_own', 'custom.standup']]);
        $admin = BmsRole::where('slug', 'system_admin')->firstOrFail();
        $admin->update(['name' => 'Platform Owner']);
        $wildcard = BmsRole::where('slug', 'executive')->firstOrFail();
        $wildcard->update(['name' => 'Board', 'abilities' => ['custom.board', '*']]);
        $custom = BmsRole::create(['slug' => 'auditor', 'name' => 'Auditor', 'abilities' => ['reports.view']]);
        BmsRole::where('slug', 'finance')->delete();
        $untouched = BmsRole::where('slug', 'employee')->firstOrFail();
        $untouchedUpdatedAt = (string) $untouched->updated_at;

        (new BmsPhaseOneSeeder())->run();
        $afterFirstRun = BmsRole::orderBy('id')->get()->map->only(['id', 'slug', 'name', 'abilities'])->all();
        (new BmsPhaseOneSeeder())->run();

        // Custom name kept; existing abilities kept in place and in order; only the missing defaults appended.
        $hr->refresh();
        $this->assertSame('People Operations', $hr->name);
        $defaults = BmsPhaseOneSeeder::ROLES['hr'][1];
        $appended = array_values(array_diff($defaults, ['custom.payroll', 'directory.view', 'dashboard.view']));
        $this->assertSame(array_merge(['custom.payroll', 'directory.view', 'dashboard.view'], $appended), $hr->abilities);
        $this->assertSame(count($hr->abilities), count(array_unique($hr->abilities)), 'no ability is appended twice');
        $this->assertContains('custom.payroll', $hr->abilities);

        // team_lead follows the same rule: configuration preserved, never replaced.
        $teamLead->refresh();
        $this->assertSame('Squad Lead', $teamLead->name);
        $this->assertSame(['teams.manage_own', 'custom.standup'], array_slice($teamLead->abilities, 0, 2));
        $this->assertEqualsCanonicalizing(
            array_values(array_unique(array_merge(['custom.standup'], BmsPhaseOneSeeder::ROLES['team_lead'][1]))),
            $teamLead->abilities
        );

        // Wildcard roles are not modified at all, whatever the default matrix says.
        $admin->refresh();
        $this->assertSame('Platform Owner', $admin->name);
        $this->assertSame(['*'], $admin->abilities);
        $wildcard->refresh();
        $this->assertSame('Board', $wildcard->name);
        $this->assertSame(['custom.board', '*'], $wildcard->abilities);

        // A role the seeder does not know is left alone; a missing default role is created once.
        $this->assertSame(['reports.view'], $custom->fresh()->abilities);
        $finance = BmsRole::where('slug', 'finance')->get();
        $this->assertCount(1, $finance);
        $this->assertSame(BmsPhaseOneSeeder::ROLES['finance'][0], $finance[0]->name);
        $this->assertSame(BmsPhaseOneSeeder::ROLES['finance'][1], $finance[0]->abilities);

        // A role that already matches the defaults is not rewritten.
        $this->assertSame($untouchedUpdatedAt, (string) $untouched->fresh()->updated_at);
        $this->assertSame(BmsPhaseOneSeeder::ROLES['employee'][1], $untouched->fresh()->abilities);

        // The second run changed nothing: the seeder is idempotent.
        $this->assertSame($afterFirstRun, BmsRole::orderBy('id')->get()->map->only(['id', 'slug', 'name', 'abilities'])->all());
    }

    /* ------------------------------------------------------- primary assignment */

    public function test_B1_backfill_sets_a_primary_unit_only_when_it_is_unambiguous(): void
    {
        $first = $this->makeUnit();
        $second = $this->makeUnit();
        $deleted = $this->makeUnit();
        $single = $this->makeUser();
        $multi = $this->makeUser();
        $none = $this->makeUser();
        $decided = $this->makeUser();
        $former = $this->makeUser();
        $inDepartment = $this->makeUser();
        $deletedUnitOnly = $this->makeUser();
        $single->businessUnits()->attach($first->id);
        $multi->businessUnits()->attach([$first->id, $second->id]);
        $decided->businessUnits()->attach([$first->id, $second->id]);
        $former->businessUnits()->attach($first->id);
        $inDepartment->businessUnits()->attach($first->id);
        $deletedUnitOnly->businessUnits()->attach($deleted->id);
        $deleted->delete();
        $former->delete();
        $hr = CentralDepartment::where('code', 'hr')->firstOrFail();
        $hr->users()->attach($inDepartment->id);
        app(PrimaryAssignment::class)->assign($decided, PrimaryAssignment::TYPE_UNIT, $second->id);
        app(PrimaryAssignment::class)->assign($inDepartment, PrimaryAssignment::TYPE_DEPARTMENT, $hr->id);

        (new \BackfillSingleUnitPrimaryAssignments())->up();
        (new \BackfillSingleUnitPrimaryAssignments())->up();

        $this->assertSame($first->id, (int) $single->fresh()->primary_business_unit_id);
        $this->assertNull($multi->fresh()->primary_business_unit_id, 'several units: nothing is guessed');
        $this->assertNull($none->fresh()->primary_business_unit_id);
        $this->assertSame($second->id, (int) $decided->fresh()->primary_business_unit_id, 'an existing decision is kept');
        $this->assertNull(User::withTrashed()->find($former->id)->primary_business_unit_id, 'deleted employees are skipped');
        $this->assertNull($inDepartment->fresh()->primary_business_unit_id, 'a department primary is not replaced');
        $this->assertSame($hr->id, (int) $inDepartment->fresh()->primary_central_department_id);
        $this->assertNull($deletedUnitOnly->fresh()->primary_business_unit_id, 'a deleted unit is never chosen');
        $this->assertNull($single->fresh()->primary_central_department_id);
    }

    public function test_B1_backfill_treats_inactive_employees_and_inactive_units_as_documented(): void
    {
        // Policy as approved and implemented (pinned here so it cannot change unnoticed):
        // "live" means not soft-deleted. The `active` flag of an employee and the
        // `is_active` flag of a unit are not part of the rule.
        $activeUnit = $this->makeUnit();
        $inactiveUnit = $this->makeUnit();
        DB::table('business_units')->where('id', $inactiveUnit->id)->update(['is_active' => false]);
        $inactiveEmployee = $this->makeUser();
        DB::table('users')->where('id', $inactiveEmployee->id)->update(['active' => 0]);
        $inInactiveUnit = $this->makeUser();
        $inBoth = $this->makeUser();
        $inDepartmentOnly = $this->makeUser();
        $inactiveEmployee->businessUnits()->attach($activeUnit->id);
        $inInactiveUnit->businessUnits()->attach($inactiveUnit->id);
        $inBoth->businessUnits()->attach([$activeUnit->id, $inactiveUnit->id]);
        CentralDepartment::where('code', 'hr')->firstOrFail()->users()->attach($inDepartmentOnly->id);

        (new \BackfillSingleUnitPrimaryAssignments())->up();

        // An inactive (not deleted) employee with one unit is backfilled.
        $this->assertSame($activeUnit->id, (int) $inactiveEmployee->fresh()->primary_business_unit_id);
        // An inactive (not deleted) unit is a live membership: it can become the primary unit...
        $this->assertSame($inactiveUnit->id, (int) $inInactiveUnit->fresh()->primary_business_unit_id);
        // ...and it counts, so an active + an inactive unit is "several units": nothing is guessed.
        $this->assertNull($inBoth->fresh()->primary_business_unit_id);
        // No central department is ever inferred, even from a single department membership.
        $this->assertNull($inDepartmentOnly->fresh()->primary_central_department_id);
        $this->assertNull($inDepartmentOnly->fresh()->primary_business_unit_id);
        $this->assertSame(0, User::withTrashed()->whereNotNull('primary_central_department_id')->count());
    }

    public function test_B1_availability_is_rechecked_until_the_columns_exist(): void
    {
        $service = app(PrimaryAssignment::class);
        $unit = $this->makeUnit();
        $user = $this->makeUser();
        $user->businessUnits()->attach($unit->id);

        // Before the schema migration: not available, and the answer is not kept.
        (new \CreateBmsOrganizationStructure())->down();
        $this->assertFalse($service->available());
        $this->assertFalse($service->available());
        $this->assertSame([], $service->clearOrphans());
        try {
            $service->assign($user, PrimaryAssignment::TYPE_UNIT, $unit->id);
            $this->fail('assign must refuse while the columns are missing');
        } catch (\Symfony\Component\HttpKernel\Exception\HttpException $exception) {
            $this->assertSame(409, $exception->getStatusCode());
        }

        // The migration runs while the same service instance is alive.
        (new \CreateBmsOrganizationStructure())->up();
        $this->assertTrue($service->available(), 'the same instance must see the columns without being recreated');
        $service->assign($user->fresh(), PrimaryAssignment::TYPE_UNIT, $unit->id);
        $this->assertSame($unit->id, (int) $user->fresh()->primary_business_unit_id);

        // Only the positive answer is cached: no further schema lookups.
        DB::flushQueryLog();
        DB::enableQueryLog();
        $this->assertTrue($service->available());
        $this->assertTrue($service->available());
        $this->assertCount(0, DB::getQueryLog());
        DB::disableQueryLog();
    }

    public function test_B1_assignment_never_saves_unrelated_unsaved_changes(): void
    {
        $service = app(PrimaryAssignment::class);
        $unit = $this->makeUnit();
        $created = $this->makeUser();
        $created->businessUnits()->attach($unit->id);

        // 1-2. Load the user and change unrelated attributes without saving.
        $user = User::findOrFail($created->id);
        $original = ['firstname' => $user->firstname, 'email' => $user->email, 'manager_id' => $user->manager_id];
        $user->firstname = 'Unsaved';
        $user->email = 'unsaved@example.test';
        $user->manager_id = $created->id;

        // 3. Assign.
        $returned = $service->assign($user, PrimaryAssignment::TYPE_UNIT, $unit->id);

        // 4-5. Stored: the primary assignment only.
        $stored = User::findOrFail($created->id);
        $this->assertSame($unit->id, (int) $stored->primary_business_unit_id);
        $this->assertNull($stored->primary_central_department_id);
        $this->assertSame($original['firstname'], $stored->firstname);
        $this->assertSame($original['email'], $stored->email);
        $this->assertSame($original['manager_id'], $stored->manager_id);

        // The supplied model shows the new assignment and still carries the caller's unsaved edits.
        $this->assertSame($user, $returned);
        $this->assertSame($unit->id, (int) $user->primary_business_unit_id);
        $this->assertSame('Unsaved', $user->firstname);
        $this->assertEqualsCanonicalizing(['firstname', 'email', 'manager_id'], array_keys($user->getDirty()));

        // Clearing behaves the same way.
        $service->assign($user, null);
        $stored = User::findOrFail($created->id);
        $this->assertNull($stored->primary_business_unit_id);
        $this->assertSame($original['firstname'], $stored->firstname);
        $this->assertNull($user->primary_business_unit_id);
        $this->assertEqualsCanonicalizing(['firstname', 'email', 'manager_id'], array_keys($user->getDirty()));

        // Audit behaviour is preserved: one record per real change, none for a no-op.
        $service->assign($user, null);
        $logs = BmsAuditLog::where('auditable_type', User::class)->where('auditable_id', $created->id)->orderBy('id')->get();
        $this->assertSame(['employee.primary_assignment_set', 'employee.primary_assignment_cleared'], $logs->pluck('event')->all());
        $this->assertSame(['type' => null, 'id' => null], $logs[0]->old_values ?: ['type' => null, 'id' => null]);
        $this->assertSame(['type' => 'business_unit', 'id' => $unit->id], $logs[0]->new_values);
        $this->assertSame(['type' => 'business_unit', 'id' => $unit->id], $logs[1]->old_values);
    }

    public function test_B1_assignment_is_atomic_and_works_from_the_stored_row(): void
    {
        $unit = $this->makeUnit();
        $other = $this->makeUnit();
        $user = $this->makeUser();
        $user->businessUnits()->attach([$unit->id, $other->id]);

        // If the audit record cannot be written, the assignment is rolled back with it.
        $failing = new PrimaryAssignment(new class extends \App\Services\BMS\BmsAudit {
            public function record(\Illuminate\Database\Eloquent\Model $model, string $event, array $old = [], array $new = [], ?string $reason = null): BmsAuditLog
            {
                throw new \RuntimeException('audit store unavailable');
            }
        });
        try {
            $failing->assign($user, PrimaryAssignment::TYPE_UNIT, $unit->id);
            $this->fail('the failure must surface');
        } catch (\RuntimeException $exception) {
            $this->assertSame('audit store unavailable', $exception->getMessage());
        }
        $this->assertNull($user->fresh()->primary_business_unit_id, 'no assignment without its audit record');

        $user->businessUnits()->detach($other->id);
        $service = app(PrimaryAssignment::class);
        $service->assign(User::findOrFail($user->id), PrimaryAssignment::TYPE_UNIT, $unit->id);
        $user->businessUnits()->detach($unit->id);
        try {
            $failing->clearOrphans();
            $this->fail('the failure must surface');
        } catch (\RuntimeException $exception) {
            $this->assertSame('audit store unavailable', $exception->getMessage());
        }
        $this->assertSame($unit->id, (int) $user->fresh()->primary_business_unit_id, 'no clearing without its audit record');
        $this->assertSame([$user->id], $service->clearOrphans());

        // A stale model does not decide anything: the stored row does.
        $user->businessUnits()->attach([$unit->id, $other->id]);
        $stale = User::findOrFail($user->id);                       // loaded while no primary is set
        $service->assign(User::findOrFail($user->id), PrimaryAssignment::TYPE_UNIT, $unit->id);
        $service->assign($stale, PrimaryAssignment::TYPE_UNIT, $other->id);
        $last = BmsAuditLog::where('auditable_id', $user->id)->where('event', 'employee.primary_assignment_set')->orderByDesc('id')->firstOrFail();
        $this->assertSame(['type' => 'business_unit', 'id' => $unit->id], $last->old_values, 'the audit trail records the stored previous value, not the stale one');
        $this->assertSame($other->id, (int) $user->fresh()->primary_business_unit_id);

        // A stale model that already "has" the value does not hide a real change either.
        $service->assign(User::findOrFail($user->id), null);
        $this->assertSame($other->id, (int) $stale->primary_business_unit_id);
        $service->assign($stale, PrimaryAssignment::TYPE_UNIT, $other->id);
        $this->assertSame($other->id, (int) $user->fresh()->primary_business_unit_id);
    }

    public function test_B1_primary_assignment_requires_an_actual_membership(): void
    {
        $service = app(PrimaryAssignment::class);
        $unit = $this->makeUnit();
        $other = $this->makeUnit();
        $hr = CentralDepartment::where('code', 'hr')->firstOrFail();
        $finance = CentralDepartment::where('code', 'finance')->firstOrFail();
        $user = $this->makeUser();
        $user->businessUnits()->attach($unit->id);
        $hr->users()->attach($user->id);

        $rejected = function (callable $attempt, string $field) use ($user) {
            try {
                $attempt();
                $this->fail('the assignment should have been rejected');
            } catch (ValidationException $exception) {
                $this->assertArrayHasKey($field, $exception->errors());
            }
            $fresh = $user->fresh();
            $this->assertNull($fresh->primary_business_unit_id);
            $this->assertNull($fresh->primary_central_department_id);
        };
        $rejected(fn () => $service->assign($user, PrimaryAssignment::TYPE_UNIT, $other->id), 'id');
        $rejected(fn () => $service->assign($user, PrimaryAssignment::TYPE_DEPARTMENT, $finance->id), 'id');
        $rejected(fn () => $service->assign($user, PrimaryAssignment::TYPE_UNIT, 999999), 'id');
        $rejected(fn () => $service->assign($user, PrimaryAssignment::TYPE_DEPARTMENT, 999999), 'id');
        $rejected(fn () => $service->assign($user, PrimaryAssignment::TYPE_UNIT, null), 'id');
        $rejected(fn () => $service->assign($user, 'team', $unit->id), 'type');
        $rejected(fn () => $service->assign($user, 'departments', 2), 'type');

        // A unit primary...
        $service->assign($user, PrimaryAssignment::TYPE_UNIT, $unit->id);
        $this->assertSame(['type' => 'business_unit', 'id' => $unit->id], $service->current($user->fresh()));
        $this->assertTrue($user->fresh()->primaryBusinessUnit->is($unit));
        $this->assertSame([$user->id], $unit->primaryUsers()->pluck('id')->all());

        // ...is replaced, never joined, by a department primary.
        $service->assign($user, PrimaryAssignment::TYPE_DEPARTMENT, $hr->id);
        $fresh = $user->fresh();
        $this->assertNull($fresh->primary_business_unit_id);
        $this->assertSame($hr->id, (int) $fresh->primary_central_department_id);
        $this->assertTrue($fresh->primaryCentralDepartment->is($hr));

        $service->assign($user, null);
        $this->assertSame(['type' => null, 'id' => null], $service->current($user->fresh()));

        // The columns cannot be mass-assigned around the service.
        $user->fill(['primary_business_unit_id' => $other->id, 'primary_central_department_id' => $finance->id]);
        $this->assertNull($user->primary_business_unit_id);
        $this->assertNull($user->primary_central_department_id);

        // Every real change is audited.
        $events = BmsAuditLog::where('auditable_type', User::class)->where('auditable_id', $user->id)->orderBy('id')->pluck('event')->all();
        $this->assertSame(['employee.primary_assignment_set', 'employee.primary_assignment_set', 'employee.primary_assignment_cleared'], $events);
    }

    public function test_B1_removing_a_membership_clears_the_primary_assignment_that_pointed_at_it(): void
    {
        $service = app(PrimaryAssignment::class);
        $unit = $this->makeUnit();
        $other = $this->makeUnit();
        $hr = CentralDepartment::where('code', 'hr')->firstOrFail();
        $inUnit = $this->makeUser();
        $inDepartment = $this->makeUser();
        $untouched = $this->makeUser();
        $inUnit->businessUnits()->attach([$unit->id, $other->id]);
        $untouched->businessUnits()->attach($unit->id);
        $hr->users()->attach($inDepartment->id);
        $service->assign($inUnit, PrimaryAssignment::TYPE_UNIT, $unit->id);
        $service->assign($untouched, PrimaryAssignment::TYPE_UNIT, $unit->id);
        $service->assign($inDepartment, PrimaryAssignment::TYPE_DEPARTMENT, $hr->id);

        $this->assertSame([], $service->clearOrphans(), 'valid assignments are left alone');

        $inUnit->businessUnits()->detach($unit->id);
        $hr->users()->detach($inDepartment->id);
        $this->assertSame([], $service->clearOrphans([]), 'an empty filter touches nobody');
        $this->assertSame([], $service->clearOrphans([$untouched->id]));
        $this->assertEqualsCanonicalizing([$inUnit->id, $inDepartment->id], $service->clearOrphans());

        // Cleared, not moved to the remaining unit: choosing one would be a guess.
        $this->assertNull($inUnit->fresh()->primary_business_unit_id);
        $this->assertSame([$other->id], $inUnit->businessUnits()->pluck('business_units.id')->all());
        $this->assertNull($inDepartment->fresh()->primary_central_department_id);
        $this->assertSame($unit->id, (int) $untouched->fresh()->primary_business_unit_id);
        $this->assertSame(1, BmsAuditLog::where('auditable_id', $inUnit->id)->where('event', 'employee.primary_assignment_cleared')->where('reason', 'Membership removed')->count());
    }

    public function test_B1_existing_endpoints_keep_the_primary_assignment_consistent(): void
    {
        $service = app(PrimaryAssignment::class);
        $admin = $this->actingAsRole('system_admin');
        $first = $this->makeUnit();
        $second = $this->makeUnit();
        $director = $this->makeUser();
        $employee = $this->makeUser();
        $colleague = $this->makeUser();
        $first->update(['director_id' => $director->id]);
        $director->businessUnits()->attach($first->id);
        $employee->businessUnits()->attach([$first->id, $second->id]);
        $colleague->businessUnits()->attach($first->id);
        foreach ([$director, $employee, $colleague] as $person) {
            $service->assign($person, PrimaryAssignment::TYPE_UNIT, $first->id);
        }

        // Employee update that keeps the unit: nothing changes.
        $this->putBms('employees/'.$employee->id, ['business_unit_ids' => [$first->id]], $admin)->assertOk();
        $this->assertSame($first->id, (int) $employee->fresh()->primary_business_unit_id);
        // Employee update without unit data: nothing changes.
        $this->putBms('employees/'.$employee->id, ['firstname' => 'Renamed'], $admin)->assertOk();
        $this->assertSame($first->id, (int) $employee->fresh()->primary_business_unit_id);
        // Employee moved out of the primary unit: the primary assignment is cleared.
        $this->putBms('employees/'.$employee->id, ['business_unit_ids' => [$second->id]], $admin)->assertOk();
        $this->assertNull($employee->fresh()->primary_business_unit_id);
        $this->assertSame([$second->id], $employee->businessUnits()->pluck('business_units.id')->all());

        // Unit update that drops members: the removed member loses the primary assignment;
        // the director is re-added as a member by the existing behaviour and keeps it.
        $this->putBms('units/'.$first->id, ['name' => $first->name, 'director_id' => $director->id, 'user_ids' => []], $admin)->assertOk();
        $this->assertNull($colleague->fresh()->primary_business_unit_id);
        $this->assertSame($first->id, (int) $director->fresh()->primary_business_unit_id);
        $this->assertSame([$director->id], $first->users()->pluck('users.id')->all());

        // Unit update without member data leaves everyone alone.
        $this->putBms('units/'.$first->id, ['name' => $first->name, 'director_id' => $director->id], $admin)->assertOk();
        $this->assertSame($first->id, (int) $director->fresh()->primary_business_unit_id);
    }
}
