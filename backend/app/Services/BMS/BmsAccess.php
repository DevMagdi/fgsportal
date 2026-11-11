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

    public function canAccessUnit(int $unitId, ?User $user = null): bool
    {
        $user = $user ?: $this->user();
        if (!$user) return false;
        if ($this->roles($user)->contains(fn($role) => in_array($role->slug, ['system_admin','executive','operations'], true))) return true;
        if ($this->units($user)->contains($unitId)) return true;
        return BusinessUnit::where('id', $unitId)->where('director_id', $user->id)->exists();
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
