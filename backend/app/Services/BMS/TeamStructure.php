<?php
namespace App\Services\BMS;

use App\Models\BMS\BmsRole;
use App\Models\BMS\BusinessUnit;
use App\Models\BMS\Team;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Stage B2 — rules of the team structure inside a business unit.
 *
 * Every write to team membership, the team lead and the unit's development
 * manager goes through this class, so the rules hold wherever the change
 * comes from:
 *
 *  1. A team belongs to exactly one business unit and never moves.
 *  2. A team member must be a member of the team's unit (`business_unit_user`).
 *     Adding somebody to a team never adds them to the unit: unit membership,
 *     and with it the primary assignment (PrimaryAssignment), is managed only
 *     through the existing unit/employee paths.
 *  3. The team lead must be a member of the team's unit and is always a member
 *     of the team. The lead cannot be removed from the team while still lead.
 *  4. The development manager of a unit must be a member of that unit. The same
 *     person may also be the director or lead a team.
 *  5. `users.manager_id` (the administrative reporting line) is never read or
 *     written here.
 *  6. When a unit membership is removed, the employee leaves that unit's teams
 *     and stops being a team lead or the development manager there.
 *
 * The team_lead role (ability teams.manage_own) is granted for the unit when
 * somebody becomes a team lead and withdrawn when they no longer lead any team
 * of that unit, the same way the unit director's role follows the director.
 */
class TeamStructure
{
    public const LEAD_ROLE = 'team_lead';

    private BmsAccess $access;
    private BmsAudit $audit;
    private array $roleCache = [];

    public function __construct(BmsAccess $access, BmsAudit $audit)
    {
        $this->access = $access;
        $this->audit = $audit;
    }

    /* ------------------------------------------------------------ authorization */

    /**
     * May the actor manage the teams (and the development manager) of this unit?
     *
     * Holding `teams.manage` somewhere is not enough: the role that grants it
     * must apply to THIS unit — either it was assigned for this unit, or it was
     * assigned without a unit — and the unit must be inside the actor's scope.
     * A director whose role is scoped to unit A and who is an ordinary member
     * of unit B therefore cannot manage B.
     */
    public function canManageUnit(int $unitId, ?User $user = null): bool
    {
        return $this->holdsForUnit('teams.manage', $unitId, $user);
    }

    public function authorizeManageUnit(int $unitId): void
    {
        abort_unless($this->canManageUnit($unitId), 403, 'You may not manage teams of this business unit.');
    }

    /** Team managers of the unit, and the team's own lead (teams.manage_own). */
    public function canManageMembers(Team $team, ?User $user = null): bool
    {
        $user = $user ?: $this->access->user();
        if (!$user) return false;
        if ($this->canManageUnit((int) $team->business_unit_id, $user)) return true;

        return (int) $team->lead_id === (int) $user->id
            && $this->holdsForUnit('teams.manage_own', (int) $team->business_unit_id, $user);
    }

    private function holdsForUnit(string $ability, int $unitId, ?User $user = null): bool
    {
        $user = $user ?: $this->access->user();
        if (!$user) return false;

        $applies = false;
        foreach ($this->rolesOf($user) as $role) {
            $abilities = $role->abilities ?: [];
            if (!in_array('*', $abilities, true) && !in_array($ability, $abilities, true)) continue;

            $scope = $role->pivot->business_unit_id ?? null;
            if ($scope === null || (int) $scope === $unitId) {
                $applies = true;
                break;
            }
        }

        // In every case the unit itself must be inside the actor's scope.
        return $applies && $this->access->canAccessUnit($unitId, $user);
    }

    /** Role rows of the actor, read once per request per user. */
    private function rolesOf(User $user)
    {
        return $this->roleCache[$user->id] ?? ($this->roleCache[$user->id] = $this->access->roles($user));
    }

    /* ------------------------------------------------------------------ writes */

    /**
     * Replace the members of a team.
     *
     * @param  int[]  $userIds
     */
    public function syncMembers(Team $team, array $userIds): Team
    {
        $userIds = $this->normalise($userIds);

        return DB::transaction(function () use ($team, $userIds) {
            $team = Team::whereKey($team->id)->lockForUpdate()->firstOrFail();
            $this->assertUnitMembers((int) $team->business_unit_id, $userIds, 'user_ids');
            if ($team->lead_id && !in_array((int) $team->lead_id, $userIds, true)) {
                throw ValidationException::withMessages(['user_ids' => ['The team lead cannot be removed from the team. Change or remove the team lead first.']]);
            }

            $before = $this->memberIds($team);
            $team->users()->sync($userIds);
            $after = $this->memberIds($team);
            if ($before !== $after) {
                $this->audit->record($team, 'team.members_updated', ['user_ids' => $before], ['user_ids' => $after]);
            }

            return $team;
        });
    }

    /** Assign (or, with null, remove) the team lead. The lead becomes a team member. */
    public function setLead(Team $team, ?int $userId): Team
    {
        return DB::transaction(function () use ($team, $userId) {
            $team = Team::whereKey($team->id)->lockForUpdate()->firstOrFail();
            $previous = $team->lead_id ? (int) $team->lead_id : null;
            if ($previous === $userId) return $team;

            if ($userId !== null) {
                $this->assertUnitMembers((int) $team->business_unit_id, [$userId], 'lead_id', 'The team lead must be a member of the team\'s business unit.');
                $team->users()->syncWithoutDetaching([$userId]);
            }
            $team->lead_id = $userId;
            $team->save();

            $this->audit->record($team, $userId === null ? 'team.lead_removed' : 'team.lead_assigned', ['lead_id' => $previous], ['lead_id' => $userId]);
            foreach (array_filter([$previous, $userId]) as $affected) {
                $this->syncLeadRole((int) $affected, (int) $team->business_unit_id);
            }

            return $team;
        });
    }

    /** Assign (or, with null, remove) the development manager of a unit. */
    public function setDevelopmentManager(BusinessUnit $unit, ?int $userId): BusinessUnit
    {
        return DB::transaction(function () use ($unit, $userId) {
            $unit = BusinessUnit::whereKey($unit->id)->lockForUpdate()->firstOrFail();
            $previous = $unit->development_manager_id ? (int) $unit->development_manager_id : null;
            if ($previous === $userId) return $unit;

            if ($userId !== null) {
                $this->assertUnitMembers((int) $unit->id, [$userId], 'user_id', 'The development manager must be a member of this business unit.');
            }
            $unit->development_manager_id = $userId;
            $unit->save();

            $this->audit->record(
                $unit,
                $userId === null ? 'unit.development_manager_removed' : 'unit.development_manager_assigned',
                ['development_manager_id' => $previous],
                ['development_manager_id' => $userId]
            );

            return $unit;
        });
    }

    /** Delete a team; its memberships go with it and the lead's role is reviewed. */
    public function delete(Team $team): void
    {
        DB::transaction(function () use ($team) {
            $team = Team::whereKey($team->id)->lockForUpdate()->firstOrFail();
            $snapshot = $team->toArray() + ['user_ids' => $this->memberIds($team)];
            $leadId = $team->lead_id ? (int) $team->lead_id : null;
            $unitId = (int) $team->business_unit_id;

            $team->delete();
            $this->audit->record($team, 'team.deleted', $snapshot, []);
            if ($leadId) $this->syncLeadRole($leadId, $unitId);
        });
    }

    /**
     * Bring the team structure back in line after unit memberships changed:
     * whoever is no longer a member of a unit leaves that unit's teams, and
     * stops being a team lead or the development manager there. Nothing is
     * reassigned to somebody else.
     *
     * Call after any change that can remove a unit membership, together with
     * PrimaryAssignment::clearOrphans().
     *
     * @param  int[]|null  $userIds  limit to these employees; null = everyone
     * @return array{team_memberships: int, team_leads: int, development_managers: int}
     */
    public function releaseOrphans(?array $userIds = null): array
    {
        $summary = ['team_memberships' => 0, 'team_leads' => 0, 'development_managers' => 0];
        if ($userIds !== null && $userIds === []) return $summary;

        return DB::transaction(function () use ($userIds, $summary) {
            $isUnitMember = function ($query, string $userColumn, string $unitColumn) {
                $query->select(DB::raw(1))->from('business_unit_user')
                    ->whereColumn('business_unit_user.user_id', $userColumn)
                    ->whereColumn('business_unit_user.business_unit_id', $unitColumn);
            };

            // 1. Team leads who left the unit (before memberships, so the audit shows both steps).
            $leads = DB::table('bms_teams')->whereNotNull('lead_id')
                ->when($userIds !== null, fn ($q) => $q->whereIn('lead_id', $userIds))
                ->whereNotExists(fn ($q) => $isUnitMember($q, 'bms_teams.lead_id', 'bms_teams.business_unit_id'))
                ->orderBy('id')->get(['id', 'lead_id', 'business_unit_id']);
            foreach ($leads as $row) {
                DB::table('bms_teams')->where('id', $row->id)->update(['lead_id' => null, 'updated_at' => now()]);
                $this->auditTeam((int) $row->id, 'team.lead_removed', ['lead_id' => (int) $row->lead_id], ['lead_id' => null], 'Unit membership removed');
                $summary['team_leads']++;
            }

            // 2. Team members who left the unit.
            $memberships = DB::table('bms_team_user')
                ->join('bms_teams', 'bms_teams.id', '=', 'bms_team_user.team_id')
                ->when($userIds !== null, fn ($q) => $q->whereIn('bms_team_user.user_id', $userIds))
                ->whereNotExists(fn ($q) => $isUnitMember($q, 'bms_team_user.user_id', 'bms_teams.business_unit_id'))
                ->orderBy('bms_team_user.team_id')->orderBy('bms_team_user.user_id')
                ->get(['bms_team_user.id as id', 'bms_team_user.team_id as team_id', 'bms_team_user.user_id as user_id']);
            foreach ($memberships->groupBy('team_id') as $teamId => $rows) {
                $before = DB::table('bms_team_user')->where('team_id', $teamId)->orderBy('user_id')->pluck('user_id')->map(fn ($id) => (int) $id)->all();
                DB::table('bms_team_user')->whereIn('id', $rows->pluck('id')->all())->delete();
                $after = array_values(array_diff($before, $rows->pluck('user_id')->map(fn ($id) => (int) $id)->all()));
                $this->auditTeam((int) $teamId, 'team.members_updated', ['user_ids' => $before], ['user_ids' => $after], 'Unit membership removed');
                $summary['team_memberships'] += $rows->count();
            }

            // 3. Development managers who left the unit.
            $managers = DB::table('business_units')->whereNotNull('development_manager_id')
                ->when($userIds !== null, fn ($q) => $q->whereIn('development_manager_id', $userIds))
                ->whereNotExists(fn ($q) => $isUnitMember($q, 'business_units.development_manager_id', 'business_units.id'))
                ->orderBy('id')->get(['id', 'development_manager_id']);
            foreach ($managers as $row) {
                DB::table('business_units')->where('id', $row->id)->update(['development_manager_id' => null, 'updated_at' => now()]);
                $unit = BusinessUnit::withTrashed()->find($row->id);
                if ($unit) {
                    $this->audit->record($unit, 'unit.development_manager_removed', ['development_manager_id' => (int) $row->development_manager_id], ['development_manager_id' => null], 'Unit membership removed');
                }
                $summary['development_managers']++;
            }

            // 4. The team_lead role follows the lead.
            foreach ($leads as $row) {
                $this->syncLeadRole((int) $row->lead_id, (int) $row->business_unit_id);
            }

            return $summary;
        });
    }

    /* ------------------------------------------------------------------ helpers */

    /**
     * Grant the unit-scoped team_lead role while the employee leads a team of
     * the unit, withdraw it when they lead none. Only the row for this unit is
     * touched; other roles and other units are left alone.
     */
    public function syncLeadRole(int $userId, int $unitId): void
    {
        $role = BmsRole::where('slug', self::LEAD_ROLE)->first();
        if (!$role) return;

        $leads = DB::table('bms_teams')->where('business_unit_id', $unitId)->where('lead_id', $userId)->exists();
        $assignment = DB::table('bms_role_user')->where('user_id', $userId)->where('bms_role_id', $role->id)->where('business_unit_id', $unitId);
        $held = (clone $assignment)->exists();
        if ($leads === $held) return;

        $user = User::withTrashed()->find($userId);
        // Same shape as the role audit written by the role assignment API.
        $payload = ['user_id' => $userId, 'role_id' => $role->id, 'business_unit_id' => $unitId];
        if ($leads) {
            DB::table('bms_role_user')->insert([
                'user_id' => $userId, 'bms_role_id' => $role->id, 'business_unit_id' => $unitId,
                'created_at' => now(), 'updated_at' => now(),
            ]);
            if ($user) $this->audit->record($user, 'role.assigned', [], $payload, 'Team lead assignment');
        } else {
            $assignment->delete();
            if ($user) $this->audit->record($user, 'role.revoked', [], $payload, 'No longer a team lead in this unit');
        }
    }

    /** @return int[] */
    public function memberIds(Team $team): array
    {
        return DB::table('bms_team_user')->where('team_id', $team->id)->orderBy('user_id')->pluck('user_id')->map(fn ($id) => (int) $id)->all();
    }

    /**
     * @param  int[]  $userIds
     * @throws ValidationException when somebody is not a (non-deleted) member of the unit
     */
    private function assertUnitMembers(int $unitId, array $userIds, string $field, ?string $message = null): void
    {
        if ($userIds === []) return;

        $members = DB::table('business_unit_user')
            ->join('users', 'users.id', '=', 'business_unit_user.user_id')
            ->where('business_unit_user.business_unit_id', $unitId)
            ->whereIn('business_unit_user.user_id', $userIds)
            ->whereNull('users.deleted_at')
            ->sharedLock()
            ->pluck('business_unit_user.user_id')->map(fn ($id) => (int) $id)->all();
        $outside = array_values(array_diff($userIds, $members));
        if ($outside !== []) {
            throw ValidationException::withMessages([$field => [
                $message ?: 'Every team member must be a member of the team\'s business unit. Not in this unit: user '.implode(', ', $outside).'.',
            ]]);
        }
    }

    /** @return int[] */
    private function normalise(array $ids): array
    {
        $ids = array_values(array_unique(array_map('intval', $ids)));
        sort($ids);

        return $ids;
    }

    private function auditTeam(int $teamId, string $event, array $old, array $new, string $reason): void
    {
        $team = Team::find($teamId);
        if ($team) $this->audit->record($team, $event, $old, $new, $reason);
    }
}
