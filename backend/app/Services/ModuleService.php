<?php

namespace App\Services;

use App\Models\Company;
use App\Models\Module;
use App\Models\User;
use Illuminate\Support\Facades\Cache;

class ModuleService
{
    /**
     * Resolve the company (tenant) for the given user.
     * Falls back to the seeded default company for legacy users
     * whose company_id was never populated.
     */
    public function resolveCompany(?User $user = null): ?Company
    {
        $user = $user ?? auth()->user();

        if ($user && !empty($user->company_id)) {
            $company = Company::find($user->company_id);
            if ($company) {
                return $company;
            }
        }

        return Company::where('slug', config('modules.default_company_slug', 'default'))->first();
    }

    /**
     * Whether a module is enabled for the user's company.
     *
     *  - core modules are always enabled
     *  - an explicit company_modules row wins
     *  - when the company has no provisioning at all, fail open/closed
     *    according to config('modules.fail_open') (legacy compatibility)
     */
    public function isEnabled(string $moduleSlug, ?User $user = null): bool
    {
        $module = Module::findBySlug($moduleSlug);

        if (!$module) {
            // Unknown module slug: do not block requests for unmapped features.
            return true;
        }

        if ((bool) $module->is_core) {
            return true;
        }

        if (!(bool) $module->is_active) {
            return false;
        }

        $company = $this->resolveCompany($user);
        if (!$company) {
            return (bool) config('modules.fail_open', true);
        }

        return Cache::remember(
            $this->cacheKey($company->id, $moduleSlug),
            now()->addMinutes(5),
            function () use ($company, $module) {
                $pivot = $company->modules()->where('modules.id', $module->id)->first();

                if ($pivot === null) {
                    return (bool) config('modules.fail_open', true);
                }

                return (bool) ($pivot->pivot->is_enabled ?? false);
            }
        );
    }

    /**
     * All modules with their current entitlement for the user's company.
     */
    public function modulesForUser(?User $user = null): array
    {
        $company = $this->resolveCompany($user);

        return Module::orderByDesc('is_core')->orderBy('name')->get()->map(function (Module $module) use ($company, $user) {
            $enabled = $module->is_core || ($company ? $this->isEnabled($module->slug, $user) : (bool) config('modules.fail_open', true));

            return [
                'id' => $module->id,
                'name' => $module->name,
                'slug' => $module->slug,
                'description' => $module->description,
                'is_core' => (bool) $module->is_core,
                'is_active' => (bool) $module->is_active,
                'is_enabled' => (bool) $enabled,
            ];
        })->all();
    }

    /**
     * Slugs of the modules enabled for the user's company.
     */
    public function enabledSlugs(?User $user = null): array
    {
        return array_values(array_map(
            fn ($module) => $module['slug'],
            array_filter($this->modulesForUser($user), fn ($module) => $module['is_enabled'])
        ));
    }

    public function forgetCache(int $companyId, string $moduleSlug): void
    {
        Cache::forget($this->cacheKey($companyId, $moduleSlug));
    }

    private function cacheKey(int $companyId, string $moduleSlug): string
    {
        return "module:{$companyId}:{$moduleSlug}";
    }
}
