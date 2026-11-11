<?php
namespace App\Services\BMS;

use App\Models\BMS\BusinessUnit;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

/** Central BRD role matrix. HTTP and UI checks both use these ability slugs. */
class BmsAccess
{
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
        if ($ability === 'roles.manage' && in_array((int) $user->sub_departments_id, [1, 4], true)) return true;
        return $this->roles($user)->contains(function ($role) use ($ability) {
            $abilities = $role->abilities ?: [];
            return in_array('*', $abilities, true) || in_array($ability, $abilities, true);
        });
    }

    public function units(?User $user = null)
    {
        $user = $user ?: $this->user();
        if (!$user) return collect();
        return $user->businessUnits()->pluck('business_units.id');
    }

    public function hasGlobalUnitScope(?User $user = null): bool
    {
        return $this->roles($user)->contains(fn($role) => in_array($role->slug, [
            'system_admin','executive','coordinator','operations','pr_marketing','hr','finance','it'
        ], true));
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

    public function authorizeUnit(int $unitId): void
    {
        abort_unless($this->canAccessUnit($unitId), 403, 'This business unit is outside your assigned scope.');
    }
}
