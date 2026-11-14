<?php

namespace Tests\Feature;

use App\Models\BMS\BmsAuditLog;
use App\Models\BMS\BmsRole;
use App\Models\BMS\BusinessUnit;
use App\Models\BMS\Team;
use App\Models\User;
use App\Services\BMS\PrimaryAssignment;
use App\Services\BMS\TeamStructure;
use Illuminate\Support\Facades\DB;
use Tests\BmsTestCase;

/**
 * Stage B2 — Teams API: team CRUD, members, team lead, the unit's development
 * manager, unit-scoped authorization, clean-up when a unit membership is
 * removed, and the audit trail.
 */
class B2TeamsTest extends BmsTestCase
{
    private function member(BusinessUnit $unit, array $attributes = []): User
    {
        $user = $this->makeUser($attributes);
        $user->businessUnits()->attach($unit->id);

        return $user;
    }

    /** A user holding $slug for $unit only (role row scoped to the unit) and member of it. */
    private function scoped(string $slug, BusinessUnit $unit): User
    {
        $user = $this->member($unit);
        $user->bmsRoles()->attach(BmsRole::where('slug', $slug)->value('id'), ['business_unit_id' => $unit->id]);

        return $user;
    }

    private function team(BusinessUnit $unit, string $name = 'Platform', array $memberIds = [], ?int $leadId = null): Team
    {
        $team = Team::create(['business_unit_id' => $unit->id, 'name' => $name]);
        $structure = app(TeamStructure::class);
        if ($memberIds) $structure->syncMembers($team, $memberIds);
        if ($leadId) $structure->setLead($team, $leadId);

        return $team->fresh();
    }

    private function events($model): array
    {
        return BmsAuditLog::where('auditable_type', get_class($model))->where('auditable_id', $model->id)->orderBy('id')->pluck('event')->all();
    }

    private function leadRoleUnits(User $user): array
    {
        return DB::table('bms_role_user')->where('user_id', $user->id)
            ->where('bms_role_id', BmsRole::where('slug', 'team_lead')->value('id'))
            ->orderBy('business_unit_id')->pluck('business_unit_id')->map(fn ($id) => (int) $id)->all();
    }

    /* ----------------------------------------------------------------- creation */

    public function test_B2_director_creates_a_team_with_lead_and_members(): void
    {
        $unit = $this->makeUnit();
        $director = $this->actingAsRole('unit_director', [$unit->id]);
        $lead = $this->member($unit);
        $first = $this->member($unit);
        $second = $this->member($unit);
        DB::table('users')->where('id', $first->id)->update(['manager_id' => $second->id]);
        $usersBefore = User::count();

        $response = $this->postBms('teams', [
            'business_unit_id' => $unit->id, 'name' => 'Platform', 'description' => 'Core services',
            'lead_id' => $lead->id, 'user_ids' => [$first->id, $second->id],
        ], $director)->assertStatus(201);

        $data = $response->json('data');
        $this->assertSame('Platform', $data['name']);
        $this->assertSame($unit->id, $data['business_unit_id']);
        $this->assertSame($unit->name, $data['business_unit']['name']);
        $this->assertTrue($data['is_active']);
        $this->assertSame($lead->id, $data['lead_id']);
        $this->assertSame($lead->username, $data['lead']['username']);
        // The lead is always a member of the team.
        $this->assertEqualsCanonicalizing([$lead->id, $first->id, $second->id], array_column($data['members'], 'id'));
        $this->assertSame(3, $data['members_count']);
        $this->assertTrue($data['can_manage']);
        $this->assertArrayNotHasKey('password', $data['members'][0]);

        $team = Team::findOrFail($data['id']);
        $this->assertSame(['team.created', 'team.members_updated', 'team.lead_assigned'], $this->events($team));
        // One identity: nobody was created, the reporting line is untouched.
        $this->assertSame($usersBefore, User::count());
        $this->assertSame($second->id, (int) $first->fresh()->manager_id);
        $this->assertNull($lead->fresh()->manager_id);
        $this->assertNull($second->fresh()->manager_id);
        // The lead received the team_lead role for this unit only.
        $this->assertSame([$unit->id], $this->leadRoleUnits($lead));
    }

    public function test_B2_team_names_are_unique_per_unit_and_validated(): void
    {
        $unit = $this->makeUnit();
        $other = $this->makeUnit();
        $admin = $this->actingAsRole('system_admin');
        $this->postBms('teams', ['business_unit_id' => $unit->id, 'name' => 'Platform'], $admin)->assertStatus(201);
        $this->postBms('teams', ['business_unit_id' => $other->id, 'name' => 'Platform'], $admin)->assertStatus(201);

        $this->postBms('teams', ['business_unit_id' => $unit->id, 'name' => 'Platform'], $admin)
            ->assertStatus(422)->assertJsonValidationErrors('name');
        $this->postBms('teams', ['business_unit_id' => $unit->id], $admin)->assertStatus(422)->assertJsonValidationErrors('name');
        $this->postBms('teams', ['name' => 'No unit'], $admin)->assertStatus(422)->assertJsonValidationErrors('business_unit_id');
        $this->postBms('teams', ['business_unit_id' => 999999, 'name' => 'Ghost'], $admin)->assertStatus(422);
        $this->postBms('teams', ['business_unit_id' => $unit->id, 'name' => str_repeat('x', 151)], $admin)->assertStatus(422);

        $deleted = $this->makeUnit();
        $deleted->delete();
        $this->postBms('teams', ['business_unit_id' => $deleted->id, 'name' => 'On a deleted unit'], $admin)->assertStatus(422);
        $this->assertSame(2, Team::count());
    }

    /* ------------------------------------------------------------------- update */

    public function test_B2_team_update_renames_deactivates_and_never_moves_the_team(): void
    {
        $unit = $this->makeUnit();
        $other = $this->makeUnit();
        $admin = $this->actingAsRole('system_admin');
        $team = $this->team($unit);
        $this->team($unit, 'Data');

        $data = $this->putBms('teams/'.$team->id, ['name' => 'Platform Core', 'description' => 'Renamed', 'is_active' => false], $admin)
            ->assertOk()->json('data');
        $this->assertSame('Platform Core', $data['name']);
        $this->assertSame('Renamed', $data['description']);
        $this->assertFalse($data['is_active']);
        $this->assertSame(['team.updated'], $this->events($team));

        // Saving the same values is not a change.
        $this->putBms('teams/'.$team->id, ['name' => 'Platform Core'], $admin)->assertOk();
        $this->assertSame(['team.updated'], $this->events($team));

        $this->putBms('teams/'.$team->id, ['name' => 'Data'], $admin)->assertStatus(422)->assertJsonValidationErrors('name');
        $this->putBms('teams/'.$team->id, ['business_unit_id' => $other->id], $admin)->assertStatus(422);
        $this->putBms('teams/'.$team->id, ['business_unit_id' => $unit->id, 'name' => 'Platform Core'], $admin)->assertOk();
        $this->assertSame($unit->id, (int) $team->fresh()->business_unit_id);

        // Listing filters.
        $this->assertSame(['Data'], array_column($this->getBms('teams?active=1', $admin)->assertOk()->json('data'), 'name'));
        $this->assertSame(['Platform Core'], array_column($this->getBms('teams?active=0', $admin)->assertOk()->json('data'), 'name'));
        $this->assertCount(2, $this->getBms('teams?business_unit_id='.$unit->id, $admin)->assertOk()->json('data'));
        $this->assertCount(0, $this->getBms('teams?business_unit_id='.$other->id, $admin)->assertOk()->json('data'));
    }

    public function test_B2_team_update_can_replace_lead_and_members_in_one_request(): void
    {
        $unit = $this->makeUnit();
        $admin = $this->actingAsRole('system_admin');
        $oldLead = $this->member($unit);
        $newLead = $this->member($unit);
        $member = $this->member($unit);
        $team = $this->team($unit, 'Platform', [$oldLead->id, $member->id], $oldLead->id);

        $data = $this->putBms('teams/'.$team->id, ['lead_id' => $newLead->id, 'user_ids' => [$member->id]], $admin)->assertOk()->json('data');
        $this->assertSame($newLead->id, $data['lead_id']);
        $this->assertEqualsCanonicalizing([$newLead->id, $member->id], array_column($data['members'], 'id'));
        $this->assertSame([], $this->leadRoleUnits($oldLead));
        $this->assertSame([$unit->id], $this->leadRoleUnits($newLead));

        // Same lead again together with members: no lead churn in the audit trail.
        $before = count($this->events($team));
        $this->putBms('teams/'.$team->id, ['lead_id' => $newLead->id, 'user_ids' => [$newLead->id, $member->id]], $admin)->assertOk();
        $this->assertSame($before, count($this->events($team)));

        // Members without the current lead, lead untouched in the request: refused.
        $this->putBms('teams/'.$team->id, ['user_ids' => [$member->id]], $admin)->assertStatus(422)->assertJsonValidationErrors('user_ids');
        // Clearing the lead and the members together works.
        $data = $this->putBms('teams/'.$team->id, ['lead_id' => null, 'user_ids' => []], $admin)->assertOk()->json('data');
        $this->assertNull($data['lead_id']);
        $this->assertSame([], $data['members']);
        $this->assertSame([], $this->leadRoleUnits($newLead));
    }

    /* ------------------------------------------------------------------ members */

    public function test_B2_members_are_assigned_and_removed_and_audited(): void
    {
        $unit = $this->makeUnit();
        $director = $this->actingAsRole('unit_director', [$unit->id]);
        $first = $this->member($unit);
        $second = $this->member($unit);
        $team = $this->team($unit);

        $data = $this->putBms('teams/'.$team->id.'/members', ['user_ids' => [$first->id, $second->id]], $director)->assertOk()->json('data');
        $this->assertEqualsCanonicalizing([$first->id, $second->id], array_column($data['members'], 'id'));
        $data = $this->putBms('teams/'.$team->id.'/members', ['user_ids' => [$second->id]], $director)->assertOk()->json('data');
        $this->assertSame([$second->id], array_column($data['members'], 'id'));
        // Same list again: nothing to audit.
        $this->putBms('teams/'.$team->id.'/members', ['user_ids' => [$second->id]], $director)->assertOk();
        $this->putBms('teams/'.$team->id.'/members', ['user_ids' => []], $director)->assertOk();
        $this->assertSame(0, $team->users()->count());

        $logs = BmsAuditLog::where('auditable_type', Team::class)->where('auditable_id', $team->id)->orderBy('id')->get();
        $this->assertSame(['team.members_updated', 'team.members_updated', 'team.members_updated'], $logs->pluck('event')->all());
        $this->assertSame(['user_ids' => [$first->id, $second->id]], $logs[1]->old_values);
        $this->assertSame(['user_ids' => [$second->id]], $logs[1]->new_values);
        $this->assertSame($director->id, (int) $logs[0]->user_id);

        // Unit membership is not created or removed by team membership.
        $this->assertSame([$unit->id], $first->businessUnits()->pluck('business_units.id')->all());
        $this->putBms('teams/'.$team->id.'/members', [], $director)->assertStatus(422)->assertJsonValidationErrors('user_ids');
        $this->putBms('teams/'.$team->id.'/members', ['user_ids' => [$first->id, $first->id]], $director)->assertStatus(422);
        $this->putBms('teams/'.$team->id.'/members', ['user_ids' => [999999]], $director)->assertStatus(422);
    }

    public function test_B2_cross_unit_membership_is_rejected_everywhere(): void
    {
        $unit = $this->makeUnit();
        $other = $this->makeUnit();
        $admin = $this->actingAsRole('system_admin');
        $insider = $this->member($unit);
        $outsider = $this->member($other);
        $nobody = $this->makeUser();
        $former = $this->member($unit);
        $former->delete();
        $team = $this->team($unit, 'Platform', [$insider->id]);

        foreach ([$outsider, $nobody, $former] as $invalid) {
            $errors = $this->putBms('teams/'.$team->id.'/members', ['user_ids' => [$insider->id, $invalid->id]], $admin)->assertStatus(422)->json('errors');
            // A deleted employee is refused by request validation (user_ids.1), the others by the unit rule (user_ids).
            $this->assertNotEmpty(preg_grep('/^user_ids(\.\d+)?$/', array_keys($errors)));
            $this->putBms('teams/'.$team->id, ['user_ids' => [$invalid->id]], $admin)->assertStatus(422);
            $this->postBms('teams', ['business_unit_id' => $unit->id, 'name' => 'Team '.$invalid->id, 'user_ids' => [$invalid->id]], $admin)->assertStatus(422);
        }
        // Nothing was partially applied and no unit membership was created on the side.
        $this->assertSame([$insider->id], app(TeamStructure::class)->memberIds($team));
        $this->assertSame(1, Team::count());
        $this->assertSame([$other->id], $outsider->businessUnits()->pluck('business_units.id')->all());
        $this->assertSame(0, $nobody->businessUnits()->count());

        // Belonging to both units makes the same person valid in a team of each.
        $outsider->businessUnits()->attach($unit->id);
        $this->putBms('teams/'.$team->id.'/members', ['user_ids' => [$insider->id, $outsider->id]], $admin)->assertOk();
        $otherTeam = $this->team($other, 'Remote');
        $this->putBms('teams/'.$otherTeam->id.'/members', ['user_ids' => [$outsider->id]], $admin)->assertOk();
        $this->assertEqualsCanonicalizing([$team->id, $otherTeam->id], $outsider->teams()->pluck('bms_teams.id')->all());
        $this->assertSame(1, User::where('email', $outsider->email)->count());
    }

    /* --------------------------------------------------------------------- lead */

    public function test_B2_team_lead_is_assigned_changed_and_removed(): void
    {
        $unit = $this->makeUnit();
        $admin = $this->actingAsRole('system_admin');
        $first = $this->member($unit);
        $second = $this->member($unit);
        $manager = $this->makeUser();
        DB::table('users')->where('id', $first->id)->update(['manager_id' => $manager->id]);
        $team = $this->team($unit);
        $sibling = $this->team($unit, 'Data');

        $data = $this->putBms('teams/'.$team->id.'/lead', ['lead_id' => $first->id], $admin)->assertOk()->json('data');
        $this->assertSame($first->id, $data['lead_id']);
        $this->assertSame([$first->id], array_column($data['members'], 'id'), 'the lead joins the team');
        $this->assertSame([$unit->id], $this->leadRoleUnits($first));
        $this->assertSame($manager->id, (int) $first->fresh()->manager_id, 'the reporting line is not the team lead');

        // Leading a second team of the same unit keeps one role row; leaving one keeps the role.
        $this->putBms('teams/'.$sibling->id.'/lead', ['lead_id' => $first->id], $admin)->assertOk();
        $this->assertSame([$unit->id], $this->leadRoleUnits($first));
        $this->putBms('teams/'.$team->id.'/lead', ['lead_id' => $second->id], $admin)->assertOk();
        $this->assertSame([$unit->id], $this->leadRoleUnits($first));
        $this->assertSame([$unit->id], $this->leadRoleUnits($second));
        $this->assertEqualsCanonicalizing([$first->id, $second->id], app(TeamStructure::class)->memberIds($team), 'the former lead stays a member');

        // A lead cannot be dropped from the member list.
        $this->putBms('teams/'.$team->id.'/members', ['user_ids' => [$first->id]], $admin)->assertStatus(422)->assertJsonValidationErrors('user_ids');
        $this->assertSame($second->id, (int) $team->fresh()->lead_id);

        $this->putBms('teams/'.$team->id.'/lead', ['lead_id' => null], $admin)->assertOk()->assertJsonPath('data.lead_id', null);
        $this->assertSame([], $this->leadRoleUnits($second));
        $this->putBms('teams/'.$sibling->id.'/lead', ['lead_id' => null], $admin)->assertOk();
        $this->assertSame([], $this->leadRoleUnits($first));
        $this->putBms('teams/'.$team->id.'/members', ['user_ids' => [$first->id]], $admin)->assertOk();

        $this->assertSame(['team.lead_assigned', 'team.lead_assigned', 'team.lead_removed', 'team.members_updated'], $this->events($team));
        $this->assertSame(
            ['role.assigned', 'role.revoked'],
            BmsAuditLog::where('auditable_type', User::class)->where('auditable_id', $second->id)->orderBy('id')->pluck('event')->all()
        );
        $this->putBms('teams/'.$team->id.'/lead', [], $admin)->assertStatus(422)->assertJsonValidationErrors('lead_id');
    }

    public function test_B2_invalid_team_lead_is_rejected(): void
    {
        $unit = $this->makeUnit();
        $other = $this->makeUnit();
        $admin = $this->actingAsRole('system_admin');
        $outsider = $this->member($other);
        $nobody = $this->makeUser();
        $former = $this->member($unit);
        $former->delete();
        $current = $this->member($unit);
        $team = $this->team($unit, 'Platform', [$current->id], $current->id);

        foreach ([$outsider, $nobody, $former] as $invalid) {
            $this->putBms('teams/'.$team->id.'/lead', ['lead_id' => $invalid->id], $admin)->assertStatus(422)->assertJsonValidationErrors('lead_id');
            $this->putBms('teams/'.$team->id, ['lead_id' => $invalid->id], $admin)->assertStatus(422);
            $this->putBms('teams/'.$team->id, ['lead_id' => $invalid->id, 'user_ids' => [$current->id]], $admin)->assertStatus(422);
            $this->postBms('teams', ['business_unit_id' => $unit->id, 'name' => 'Lead '.$invalid->id, 'lead_id' => $invalid->id], $admin)->assertStatus(422);
            $this->assertSame([], $this->leadRoleUnits($invalid));
        }
        $this->putBms('teams/'.$team->id.'/lead', ['lead_id' => 999999], $admin)->assertStatus(422);

        // Every failed attempt left the team exactly as it was (the combined request is atomic).
        $team->refresh();
        $this->assertSame($current->id, (int) $team->lead_id);
        $this->assertSame([$current->id], app(TeamStructure::class)->memberIds($team));
        $this->assertSame([$unit->id], $this->leadRoleUnits($current));
        $this->assertSame(1, Team::count());
        $this->assertSame(0, DB::table('bms_team_user')->whereIn('user_id', [$outsider->id, $nobody->id, $former->id])->count());
    }

    /* ------------------------------------------------------ development manager */

    public function test_B2_development_manager_is_assigned_and_removed(): void
    {
        $unit = $this->makeUnit();
        $director = $this->member($unit);
        $unit->update(['director_id' => $director->id]);
        $admin = $this->actingAsRole('system_admin');
        $person = $this->member($unit);
        $boss = $this->makeUser();
        DB::table('users')->where('id', $person->id)->update(['manager_id' => $boss->id]);
        $team = $this->team($unit, 'Platform', [$person->id], $person->id);

        $data = $this->putBms('units/'.$unit->id.'/development-manager', ['user_id' => $person->id], $admin)->assertOk()->json('data');
        $this->assertSame($person->id, $data['development_manager_id']);
        $this->assertSame($person->username, $data['development_manager']['username']);
        $this->assertSame($director->id, $data['director_id'], 'the director is a separate assignment');
        // One person may be development manager and team lead; the reporting line is untouched.
        $this->assertSame($person->id, (int) $team->fresh()->lead_id);
        $this->assertSame($boss->id, (int) $person->fresh()->manager_id);
        // Unit payloads expose it.
        $this->assertSame($person->id, $this->getBms('units/'.$unit->id, $admin)->assertOk()->json('data.development_manager.id'));
        $listed = collect($this->getBms('units', $admin)->assertOk()->json('data'))->firstWhere('id', $unit->id);
        $this->assertSame($person->id, $listed['development_manager']['id']);

        // The director may hold it too.
        $this->putBms('units/'.$unit->id.'/development-manager', ['user_id' => $director->id], $admin)->assertOk();
        $this->putBms('units/'.$unit->id.'/development-manager', ['user_id' => $director->id], $admin)->assertOk(); // no-op
        $this->putBms('units/'.$unit->id.'/development-manager', ['user_id' => null], $admin)->assertOk()->assertJsonPath('data.development_manager_id', null);
        $this->assertSame($director->id, (int) $unit->fresh()->director_id);

        $this->assertSame(
            ['unit.development_manager_assigned', 'unit.development_manager_assigned', 'unit.development_manager_removed'],
            array_values(array_filter($this->events($unit), fn ($event) => str_starts_with($event, 'unit.development_manager')))
        );
        // The ordinary unit update cannot set it on the side.
        $this->putBms('units/'.$unit->id, ['name' => $unit->name, 'development_manager_id' => $person->id], $admin)->assertOk();
        $this->assertNull($unit->fresh()->development_manager_id);
    }

    public function test_B2_invalid_development_manager_is_rejected(): void
    {
        $unit = $this->makeUnit();
        $other = $this->makeUnit();
        $admin = $this->actingAsRole('system_admin');
        $current = $this->member($unit);
        $outsider = $this->member($other);
        $nobody = $this->makeUser();
        $former = $this->member($unit);
        $former->delete();
        $this->putBms('units/'.$unit->id.'/development-manager', ['user_id' => $current->id], $admin)->assertOk();

        foreach ([$outsider, $nobody, $former] as $invalid) {
            $this->putBms('units/'.$unit->id.'/development-manager', ['user_id' => $invalid->id], $admin)->assertStatus(422)->assertJsonValidationErrors('user_id');
        }
        $this->putBms('units/'.$unit->id.'/development-manager', ['user_id' => 999999], $admin)->assertStatus(422);
        $this->putBms('units/'.$unit->id.'/development-manager', [], $admin)->assertStatus(422)->assertJsonValidationErrors('user_id');
        $this->putBms('units/999999/development-manager', ['user_id' => $current->id], $admin)->assertNotFound();

        $this->assertSame($current->id, (int) $unit->fresh()->development_manager_id);
        $this->assertNull($other->fresh()->development_manager_id);
        $this->assertSame(0, $outsider->businessUnits()->where('business_units.id', $unit->id)->count(), 'nobody is added to the unit on the side');
    }

    /* ------------------------------------------------------------ authorization */

    public function test_B2_reading_teams_respects_the_unit_scope(): void
    {
        $unit = $this->makeUnit();
        $other = $this->makeUnit();
        $mine = $this->team($unit, 'Mine');
        $theirs = $this->team($other, 'Theirs');
        $orphaned = $this->makeUnit();
        $hidden = $this->team($orphaned, 'On a deleted unit');
        $orphaned->delete();

        $employee = $this->actingAsRole('employee', [$unit->id]);
        $list = $this->getBms('teams', $employee)->assertOk()->json('data');
        $this->assertSame(['Mine'], array_column($list, 'name'));
        $this->assertFalse($list[0]['can_manage']);
        $this->assertFalse($list[0]['can_manage_members']);
        $this->getBms('teams/'.$mine->id, $employee)->assertOk();
        $this->getBms('teams/'.$theirs->id, $employee)->assertForbidden();
        $this->getBms('teams?business_unit_id='.$other->id, $employee)->assertForbidden();
        $this->getBms('teams/999999', $employee)->assertNotFound();

        // Global-scope roles read every live unit's teams but manage none.
        $executive = $this->actingAsRole('executive');
        $this->assertEqualsCanonicalizing(['Mine', 'Theirs'], array_column($this->getBms('teams', $executive)->assertOk()->json('data'), 'name'));
        $this->putBms('teams/'.$mine->id, ['name' => 'Taken over'], $executive)->assertForbidden();

        // No BMS role, or a role without teams.view: no access at all.
        $nobody = $this->makeUser(['sub_departments_id' => 2]);
        $this->getBms('teams', $nobody)->assertForbidden();
        $alphaDelta = $this->actingAsRole('alpha_delta', [$unit->id]);
        $this->getBms('teams', $alphaDelta)->assertForbidden();
        $this->getBms('teams/'.$mine->id, $alphaDelta)->assertForbidden();
        $this->getJson('/api/bms/teams')->assertStatus(404); // no token: legacy JWT middleware response
        $this->assertNotNull($hidden->fresh());
    }

    public function test_B2_only_the_units_own_team_managers_may_modify(): void
    {
        $unit = $this->makeUnit();
        $other = $this->makeUnit();
        $member = $this->member($unit);
        $stranger = $this->member($other);
        $team = $this->team($unit, 'Mine', [$member->id]);
        $foreign = $this->team($other, 'Theirs', [$stranger->id]);

        $assertReadOnly = function (User $actor, Team $target, User $candidate) {
            $unitId = $target->business_unit_id;
            $this->postBms('teams', ['business_unit_id' => $unitId, 'name' => 'Intruder '.$actor->id], $actor)->assertForbidden();
            $this->putBms('teams/'.$target->id, ['name' => 'Renamed by '.$actor->id], $actor)->assertForbidden();
            $this->putBms('teams/'.$target->id.'/members', ['user_ids' => []], $actor)->assertForbidden();
            $this->putBms('teams/'.$target->id.'/lead', ['lead_id' => $candidate->id], $actor)->assertForbidden();
            $this->putBms('units/'.$unitId.'/development-manager', ['user_id' => $candidate->id], $actor)->assertForbidden();
            $this->deleteBms('teams/'.$target->id, $actor)->assertForbidden();
        };

        // Roles without teams.manage, inside their own unit.
        foreach (['employee', 'department_manager', 'hr', 'coordinator', 'executive', 'team_lead'] as $slug) {
            $assertReadOnly($this->actingAsRole($slug, [$unit->id]), $team, $member);
        }
        // A user with no role at all.
        $assertReadOnly($this->makeUser(), $team, $member);

        // A director of another unit: outside the scope.
        $outsideDirector = $this->actingAsRole('unit_director', [$other->id]);
        $assertReadOnly($outsideDirector, $team, $member);
        $this->getBms('teams/'.$team->id, $outsideDirector)->assertForbidden();

        // A director whose role is scoped to ANOTHER unit and who is only an ordinary
        // member here may read this unit's teams but not manage them.
        $scopedElsewhere = $this->scoped('unit_director', $other);
        $scopedElsewhere->businessUnits()->attach($unit->id);
        $this->getBms('teams/'.$team->id, $scopedElsewhere)->assertOk()->assertJsonPath('data.can_manage', false);
        $this->getBms('units/'.$unit->id, $scopedElsewhere)->assertOk()->assertJsonPath('data.can_manage_teams', false);
        $this->getBms('units/'.$other->id, $scopedElsewhere)->assertOk()->assertJsonPath('data.can_manage_teams', true);
        $assertReadOnly($scopedElsewhere, $team, $member);
        $this->putBms('teams/'.$foreign->id, ['name' => 'Theirs v2'], $scopedElsewhere)->assertOk();

        // A unit-scoped role does not help once the holder is no longer inside the unit.
        $removed = $this->scoped('unit_director', $unit);
        $removed->businessUnits()->detach($unit->id);
        $assertReadOnly($removed, $team, $member);

        // Nothing changed.
        $this->assertSame('Mine', $team->fresh()->name);
        $this->assertNull($team->fresh()->lead_id);
        $this->assertSame([$member->id], app(TeamStructure::class)->memberIds($team));
        $this->assertNull($unit->fresh()->development_manager_id);
        $this->assertSame(2, Team::count());

        // The unit's own director and the administrator can.
        $director = $this->scoped('unit_director', $unit);
        $this->putBms('teams/'.$team->id, ['name' => 'Mine v2'], $director)->assertOk()->assertJsonPath('data.can_manage', true);
        $this->putBms('units/'.$unit->id.'/development-manager', ['user_id' => $member->id], $director)->assertOk();
        $this->putBms('teams/'.$foreign->id, ['name' => 'Not yours'], $director)->assertForbidden();
        $admin = $this->actingAsRole('system_admin');
        $this->putBms('teams/'.$foreign->id.'/lead', ['lead_id' => $stranger->id], $admin)->assertOk();
    }

    public function test_B2_team_lead_manages_members_of_led_teams_only(): void
    {
        $unit = $this->makeUnit();
        $other = $this->makeUnit();
        $admin = $this->actingAsRole('system_admin');
        $lead = $this->actingAsRole('employee', [$unit->id]);
        $member = $this->member($unit);
        $outsider = $this->member($other);
        $led = $this->team($unit, 'Led', [$lead->id], $lead->id);
        $sibling = $this->team($unit, 'Sibling');

        $data = $this->getBms('teams/'.$led->id, $lead)->assertOk()->json('data');
        $this->assertFalse($data['can_manage']);
        $this->assertTrue($data['can_manage_members']);
        $this->assertFalse($this->getBms('teams/'.$sibling->id, $lead)->assertOk()->json('data.can_manage_members'));

        // Allowed: members of the led team, inside the unit, keeping the lead.
        $this->putBms('teams/'.$led->id.'/members', ['user_ids' => [$lead->id, $member->id]], $lead)->assertOk();
        $this->putBms('teams/'.$led->id.'/members', ['user_ids' => [$lead->id, $outsider->id]], $lead)->assertStatus(422);
        $this->putBms('teams/'.$led->id.'/members', ['user_ids' => [$member->id]], $lead)->assertStatus(422);

        // Not allowed: anything else on the led team, anything on another team.
        $this->putBms('teams/'.$led->id, ['name' => 'Mine now'], $lead)->assertForbidden();
        $this->putBms('teams/'.$led->id.'/lead', ['lead_id' => $member->id], $lead)->assertForbidden();
        $this->deleteBms('teams/'.$led->id, $lead)->assertForbidden();
        $this->putBms('teams/'.$sibling->id.'/members', ['user_ids' => [$lead->id]], $lead)->assertForbidden();
        $this->postBms('teams', ['business_unit_id' => $unit->id, 'name' => 'Another'], $lead)->assertForbidden();
        $this->putBms('units/'.$unit->id.'/development-manager', ['user_id' => $lead->id], $lead)->assertForbidden();

        // The team_lead role does not widen the unit scope.
        $this->getBms('teams?business_unit_id='.$other->id, $lead)->assertForbidden();

        // Once somebody else leads the team, the former lead loses the right and the role.
        $this->putBms('teams/'.$led->id.'/lead', ['lead_id' => $member->id], $admin)->assertOk();
        $this->assertSame([], $this->leadRoleUnits($lead));
        $this->putBms('teams/'.$led->id.'/members', ['user_ids' => [$lead->id, $member->id]], $lead)->assertForbidden();
        $this->assertEqualsCanonicalizing([$lead->id, $member->id], app(TeamStructure::class)->memberIds($led));
    }

    /* ------------------------------------------------- clean-up and consistency */

    public function test_B2_leaving_a_unit_through_the_employee_update_cleans_up(): void
    {
        $unit = $this->makeUnit();
        $other = $this->makeUnit();
        $admin = $this->actingAsRole('system_admin');
        $person = $this->member($unit);
        $person->businessUnits()->attach($other->id);
        $colleague = $this->member($unit);
        $led = $this->team($unit, 'Led', [$person->id, $colleague->id], $person->id);
        $joined = $this->team($unit, 'Joined', [$person->id, $colleague->id]);
        $elsewhere = $this->team($other, 'Elsewhere', [$person->id], $person->id);
        $this->putBms('units/'.$unit->id.'/development-manager', ['user_id' => $person->id], $admin)->assertOk();
        $this->putBms('units/'.$other->id.'/development-manager', ['user_id' => $person->id], $admin)->assertOk();
        app(PrimaryAssignment::class)->assign($person, PrimaryAssignment::TYPE_UNIT, $unit->id);
        app(PrimaryAssignment::class)->assign($colleague, PrimaryAssignment::TYPE_UNIT, $unit->id);
        $this->assertSame([$unit->id, $other->id], $this->leadRoleUnits($person));

        // An update that keeps the units changes nothing.
        $this->putBms('employees/'.$person->id, ['business_unit_ids' => [$unit->id, $other->id]], $admin)->assertOk();
        $this->assertSame($person->id, (int) $led->fresh()->lead_id);
        $this->assertSame($person->id, (int) $unit->fresh()->development_manager_id);

        // The employee leaves the first unit.
        $this->putBms('employees/'.$person->id, ['business_unit_ids' => [$other->id]], $admin)->assertOk();

        $structure = app(TeamStructure::class);
        $this->assertNull($led->fresh()->lead_id);
        $this->assertSame([$colleague->id], $structure->memberIds($led));
        $this->assertSame([$colleague->id], $structure->memberIds($joined));
        $this->assertNull($unit->fresh()->development_manager_id);
        $this->assertNull($person->fresh()->primary_business_unit_id, 'B1: the primary assignment is cleared, not moved');
        $this->assertSame([$other->id], $this->leadRoleUnits($person));
        // The other unit is untouched.
        $this->assertSame($person->id, (int) $elsewhere->fresh()->lead_id);
        $this->assertSame([$person->id], $structure->memberIds($elsewhere));
        $this->assertSame($person->id, (int) $other->fresh()->development_manager_id);
        // The colleague is untouched; nobody was promoted in the leaver's place.
        $this->assertSame($unit->id, (int) $colleague->fresh()->primary_business_unit_id);
        $this->assertSame([], $this->leadRoleUnits($colleague));

        $logs = BmsAuditLog::where('reason', 'Unit membership removed')->orderBy('id')->get();
        $this->assertEqualsCanonicalizing(
            ['team.lead_removed', 'team.members_updated', 'team.members_updated', 'unit.development_manager_removed'],
            $logs->pluck('event')->all()
        );
        $this->assertSame(1, BmsAuditLog::where('auditable_id', $person->id)->where('event', 'role.revoked')->count());
    }

    public function test_B2_removing_members_through_the_unit_update_cleans_up(): void
    {
        $unit = $this->makeUnit();
        $director = $this->member($unit);
        $unit->update(['director_id' => $director->id]);
        $admin = $this->actingAsRole('system_admin');
        $leaver = $this->member($unit);
        $stayer = $this->member($unit);
        $directorsTeam = $this->team($unit, 'Directors', [$director->id, $leaver->id], $director->id);
        $leaversTeam = $this->team($unit, 'Leavers', [$leaver->id, $stayer->id], $leaver->id);
        $this->putBms('units/'.$unit->id.'/development-manager', ['user_id' => $leaver->id], $admin)->assertOk();
        app(PrimaryAssignment::class)->assign($leaver, PrimaryAssignment::TYPE_UNIT, $unit->id);

        // Unit update without member data touches nothing.
        $this->putBms('units/'.$unit->id, ['name' => $unit->name, 'director_id' => $director->id], $admin)->assertOk();
        $this->assertSame($leaver->id, (int) $leaversTeam->fresh()->lead_id);

        $this->putBms('units/'.$unit->id, ['name' => $unit->name, 'director_id' => $director->id, 'user_ids' => [$stayer->id]], $admin)->assertOk();

        $structure = app(TeamStructure::class);
        // The director is re-added to the unit by the existing behaviour and keeps team and lead.
        $this->assertSame($director->id, (int) $directorsTeam->fresh()->lead_id);
        $this->assertSame([$director->id], $structure->memberIds($directorsTeam));
        $this->assertSame([$unit->id], $this->leadRoleUnits($director));
        // The leaver lost team memberships, the lead, the development manager post, the role and the primary assignment.
        $this->assertNull($leaversTeam->fresh()->lead_id);
        $this->assertSame([$stayer->id], $structure->memberIds($leaversTeam));
        $this->assertNull($unit->fresh()->development_manager_id);
        $this->assertSame([], $this->leadRoleUnits($leaver));
        $this->assertNull($leaver->fresh()->primary_business_unit_id);
        $this->assertSame(0, $leaver->teams()->count());
        $this->assertNotNull(User::find($leaver->id), 'the employee record itself is untouched');
    }

    public function test_B2_release_orphans_is_scoped_and_idempotent(): void
    {
        $unit = $this->makeUnit();
        $first = $this->member($unit);
        $second = $this->member($unit);
        $team = $this->team($unit, 'Platform', [$first->id, $second->id], $first->id);
        $structure = app(TeamStructure::class);
        $nothing = ['team_memberships' => 0, 'team_leads' => 0, 'development_managers' => 0];

        $this->assertSame($nothing, $structure->releaseOrphans());
        DB::table('business_unit_user')->whereIn('user_id', [$first->id, $second->id])->delete();
        $this->assertSame($nothing, $structure->releaseOrphans([]), 'an empty filter touches nobody');
        $this->assertSame(['team_memberships' => 1, 'team_leads' => 0, 'development_managers' => 0], $structure->releaseOrphans([$second->id]));
        $this->assertSame($first->id, (int) $team->fresh()->lead_id);
        $this->assertSame(['team_memberships' => 1, 'team_leads' => 1, 'development_managers' => 0], $structure->releaseOrphans());
        $this->assertSame($nothing, $structure->releaseOrphans());
        $this->assertSame([], $this->leadRoleUnits($first));
    }

    public function test_B2_team_operations_never_touch_unit_membership_or_the_primary_assignment(): void
    {
        $unit = $this->makeUnit();
        $other = $this->makeUnit();
        $admin = $this->actingAsRole('system_admin');
        $person = $this->member($unit);
        $person->businessUnits()->attach($other->id);
        app(PrimaryAssignment::class)->assign($person, PrimaryAssignment::TYPE_UNIT, $other->id);
        $snapshot = fn () => [
            DB::table('business_unit_user')->orderBy('id')->get()->map(fn ($row) => [$row->business_unit_id, $row->user_id])->all(),
            (int) $person->fresh()->primary_business_unit_id,
            $person->fresh()->primary_central_department_id,
            $person->fresh()->manager_id,
        ];
        $before = $snapshot();

        $id = $this->postBms('teams', ['business_unit_id' => $unit->id, 'name' => 'Platform', 'lead_id' => $person->id], $admin)->assertStatus(201)->json('data.id');
        $this->putBms('units/'.$unit->id.'/development-manager', ['user_id' => $person->id], $admin)->assertOk();
        $this->assertSame($before, $snapshot(), 'leading a team in one unit does not move the primary assignment from another');
        $this->putBms('teams/'.$id.'/lead', ['lead_id' => null], $admin)->assertOk();
        $this->putBms('teams/'.$id.'/members', ['user_ids' => []], $admin)->assertOk();
        $this->putBms('units/'.$unit->id.'/development-manager', ['user_id' => null], $admin)->assertOk();
        $this->deleteBms('teams/'.$id, $admin)->assertOk();
        $this->assertSame($before, $snapshot());
    }

    public function test_B2_deleting_a_team_removes_memberships_and_keeps_people(): void
    {
        $unit = $this->makeUnit();
        $admin = $this->actingAsRole('system_admin');
        $lead = $this->member($unit);
        $member = $this->member($unit);
        $team = $this->team($unit, 'Platform', [$lead->id, $member->id], $lead->id);
        $kept = $this->team($unit, 'Kept', [$member->id]);

        $this->deleteBms('teams/'.$team->id, $admin)->assertOk();
        $this->assertNull(Team::find($team->id));
        $this->assertSame(0, DB::table('bms_team_user')->where('team_id', $team->id)->count());
        $this->assertSame([], $this->leadRoleUnits($lead));
        $this->assertNotNull(User::find($lead->id));
        $this->assertSame([$unit->id], $lead->businessUnits()->pluck('business_units.id')->all());
        $this->assertSame([$member->id], app(TeamStructure::class)->memberIds($kept));
        $log = BmsAuditLog::where('auditable_type', Team::class)->where('auditable_id', $team->id)->where('event', 'team.deleted')->firstOrFail();
        $this->assertSame('Platform', $log->old_values['name']);
        $this->assertEqualsCanonicalizing([$lead->id, $member->id], $log->old_values['user_ids']);
        $this->deleteBms('teams/'.$team->id, $admin)->assertNotFound();

        // A unit that still has teams is not deleted from under them.
        DB::table('business_unit_user')->where('business_unit_id', $unit->id)->delete();
        app(TeamStructure::class)->releaseOrphans();
        $response = $this->deleteBms('units/'.$unit->id, $admin)->assertStatus(422);
        $this->assertStringContainsString('teams', $response->json('message'));
        $this->deleteBms('teams/'.$kept->id, $admin)->assertOk();
        $this->deleteBms('units/'.$unit->id, $admin)->assertOk();
    }

    public function test_B2_legacy_departments_and_projects_are_untouched_by_team_work(): void
    {
        $unit = $this->makeUnit();
        $admin = $this->actingAsRole('system_admin');
        $person = $this->member($unit);
        $departments = DB::table('departments')->orderBy('id')->get()->toArray();
        $subDepartments = DB::table('sub_departments')->orderBy('id')->get()->toArray();
        $subDepartmentOfPerson = $person->sub_departments_id;
        DB::table('projects')->insert(['project_title' => 'Legacy', 'created_at' => now(), 'updated_at' => now()]);
        $projects = DB::table('projects')->get()->toArray();

        $id = $this->postBms('teams', ['business_unit_id' => $unit->id, 'name' => 'Platform', 'lead_id' => $person->id], $admin)->assertStatus(201)->json('data.id');
        $this->putBms('units/'.$unit->id.'/development-manager', ['user_id' => $person->id], $admin)->assertOk();
        $this->deleteBms('teams/'.$id, $admin)->assertOk();

        $this->assertEquals($departments, DB::table('departments')->orderBy('id')->get()->toArray());
        $this->assertEquals($subDepartments, DB::table('sub_departments')->orderBy('id')->get()->toArray());
        $this->assertEquals($projects, DB::table('projects')->get()->toArray());
        $this->assertSame($subDepartmentOfPerson, $person->fresh()->sub_departments_id);
        $this->assertSame(0, DB::table('bms_project_business_unit')->count());
        $this->assertSame(0, DB::table('bms_central_department_user')->count());
    }
}
