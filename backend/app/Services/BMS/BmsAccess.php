<?php

namespace App\Services\BMS;

use App\Models\BMS\BmsRole;
use App\Models\BMS\BusinessUnit;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

/** Central BRD role matrix. HTTP and UI checks both use these ability slugs. */
class BmsAccess
{
    /**
     * Roles whose holder receives company-wide unit scope through
     * hasGlobalUnitScope(): visibleUnitIds() collapses to null (every unit)
     * for any user holding one of them, regardless of the pivot's
     * business_unit_id. A unit-scoped actor must never be able to hand these
     * out — even attached to a single unit they would widen the recipient's
     * scope to the whole company.
     */
    public const GLOBAL_SCOPE_ROLE_SLUGS = [
        'system_admin', 'executive', 'coordinator', 'operations', 'pr_marketing', 'hr', 'finance', 'it',
    ];

    public function user(): ?User
    {
        return Auth::guard('user_api')->user() ?: Auth::user();
    }

    public function roles(?User $user = null)
    {
        $user = $user ?: $this->user();
        if (!$user) return collect();
        return $user->bmsRoles()->get();
    }

    public function can(string $ability, ?User $user = null): bool
    {
        $user = $user ?: $this->user();
        if (!$user) return false;
        // Existing Management/Administration users administer BMS role assignment.
        if ($ability === 'roles.manage' && $this->isAdmin($user)) return true;
        return $this->roles($user)->contains(function ($role) use ($ability) {
            $abilities = $role->abilities ?: [];
            return in_array('*', $abilities, true) || in_array($ability, $abilities, true);
        });
    }

    /**
     * The documented global administration authority: members of the
     * Administration / Management sub-departments (config
     * bms.admin_sub_department_ids). This is the same rule that already
     * short-circuits can('roles.manage') — it is NOT a new bypass.
     */
    public function isAdmin(?User $user = null): bool
    {
        $user = $user ?: $this->user();
        if (!$user) return false;

        return in_array((int) $user->sub_departments_id, config('bms.admin_sub_department_ids', [1, 4]), true);
    }

    /**
     * Actors that may grant any role: the documented Administration
     * sub-departments, or holders of a role carrying the `*` ability
     * (System Administrator). Everyone else is a restricted, possibly
     * unit-scoped, role manager.
     */
    public function hasUnrestrictedAuthority(?User $user = null): bool
    {
        if ($this->isAdmin($user)) return true;

        return $this->roles($user)->contains(fn ($role) => in_array('*', $role->abilities ?: [], true));
    }

    public function units(?User $user = null)
    {
        $user = $user ?: $this->user();
        if (!$user) return collect();
        return $user->businessUnits()->pluck('business_units.id');
    }

    public function hasGlobalUnitScope(?User $user = null): bool
    {
        return $this->roles($user)->contains(fn($role) => in_array($role->slug, self::GLOBAL_SCOPE_ROLE_SLUGS, true));
    }

    /** Directors, the Coordinator and global roles see every employee in scope; employees only themselves. */
    public function canViewTeamTasks(?User $user = null): bool
    {
        return $this->can('plans.manage', $user) || $this->hasGlobalUnitScope($user);
    }

    /** Null means all units; an array is a hard unit scope. */
    public function visibleUnitIds(?User $user = null): ?array
    {
        if ($this->hasGlobalUnitScope($user)) return null;
        $user = $user ?: $this->user();
        $ids = $this->units($user)->all();
        $directed = BusinessUnit::where('director_id', $user ? $user->id : 0)->pluck('id')->all();
        return array_values(array_unique(array_merge($ids, $directed)));
    }

    public function canAccessUnit(int $unitId, ?User $user = null): bool
    {
        $user = $user ?: $this->user();
        if (!$user) return false;
        if ($this->hasGlobalUnitScope($user)) return true;
        return in_array($unitId, $this->visibleUnitIds($user) ?: [], true);
    }

    public function authorize(string $ability): void
    {
        abort_unless($this->can($ability), 403, 'You do not have the required BMS permission: '.$ability);
    }

    public function authorizeUnit(int $unitId, ?User $user = null): void
    {
        abort_unless($this->canAccessUnit($unitId, $user), 403, 'This business unit is outside your assigned scope.');
    }

    /**
     * Central authorization for every BMS role assignment/revocation, including
     * the role grant performed during employee creation.
     *
     * Rules (Phase 1 hardening):
     *  A. The actor must hold `roles.manage` (which already includes the
     *     documented Administration authority — no new bypass is introduced).
     *  B. Only Administration may grant or revoke `system_admin`.
     *  C. Unit-scoped assignments require the unit to be inside the actor's
     *     scope; global assignments (no unit) are reserved for actors with
     *     global scope or Administration.
     *  D. On grants, actors without unrestricted authority may not hand out
     *     roles that confer global unit scope (GLOBAL_SCOPE_ROLE_SLUGS) or
     *     role-management authority (`roles.manage` / `*`). The permission
     *     model defines no role hierarchy, so this is the safest defensible
     *     restriction: restricted actors can neither mint global
     *     administrators nor widen anyone's scope beyond what Administration
     *     itself hands out. Unrestricted authority = the documented
     *     Administration sub-departments or a role carrying `*`
     *     (System Administrator).
     *  E. Target eligibility: a grant into a unit requires the target to be a
     *     member of that unit; a revocation by a unit-scoped actor requires
     *     the target to be inside the actor's scope. Global-scope actors are
     *     not restricted by target membership.
     *
     * @param User|null $target Employee being changed; null only for the
     *                           creation-time grant in EmployeeController,
     *                           where the account does not exist yet.
     * @param string    $action 'assign' | 'revoke' | 'create'
     */
    public function authorizeRoleChange(?User $target, BmsRole $role, ?int $unitId, string $action = 'assign'): void
    {
        $actor = $this->user();

        // A. Actor authorization (route middleware repeats this; keep the
        // server-side check next to the payload-dependent rules).
        abort_unless($actor !== null && $this->can('roles.manage', $actor), 403, 'You cannot manage BMS roles.');

        // B. Role privilege escalation: system_admin is Administration-only,
        // for both granting and revoking, at any scope.
        if ($role->slug === 'system_admin' && !$this->isAdmin($actor)) {
            abort(403, 'Only Administration may grant or revoke the System Administrator role.');
        }

        // D. Grant-only privilege restrictions for restricted actors.
        if ($action !== 'revoke' && !$this->hasUnrestrictedAuthority($actor)) {
            abort_if(
                in_array($role->slug, self::GLOBAL_SCOPE_ROLE_SLUGS, true),
                403,
                'Only Administration may grant global-scope roles.'
            );
            $abilities = $role->abilities ?: [];
            abort_if(
                in_array('*', $abilities, true) || in_array('roles.manage', $abilities, true),
                403,
                'Only Administration may grant roles that manage other roles.'
            );
        }

        // C. Assignment scope: never trust the payload's business_unit_id.
        if ($unitId !== null) {
            $this->authorizeUnit($unitId, $actor);
        } else {
            abort_unless(
                $this->visibleUnitIds($actor) === null || $this->isAdmin($actor),
                403,
                'Global role assignments require global scope.'
            );
        }

        // E. Target employee scope.
        if ($target === null) {
            return; // creation-time grant: membership is synced in the same request
        }
        if ($action === 'assign' && $unitId !== null) {
            // The target must be eligible for assignment in the selected unit.
            abort_unless(
                $target->businessUnits()->where('business_units.id', $unitId)->exists(),
                403,
                'This employee is outside your assigned unit scope.'
            );
        }
        if ($action !== 'assign') {
            $visible = $this->visibleUnitIds($actor);
            if ($visible !== null) {
                // Revocation stays inside the actor's scope: no cross-unit or
                // out-of-scope revocations by unit-scoped managers.
                abort_unless(
                    $target->businessUnits()->whereIn('business_units.id', $visible)->exists(),
                    403,
                    'This employee is outside your assigned unit scope.'
                );
            }
        }
    }
}
