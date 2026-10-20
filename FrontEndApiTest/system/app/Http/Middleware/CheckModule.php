<?php

namespace App\Http\Middleware;

use App\Services\ModuleService;
use Closure;
use Illuminate\Http\Request;

class CheckModule
{
    /**
     * Guard a route by sellable module entitlement.
     *
     * Explicit usage:
     *   Route::middleware('module:crm')->group(...)
     *   Route::middleware('module:crm,ticketing')->...  (any of the slugs)
     *
     * Bare usage (applied on a whole route group):
     *   Route::middleware('module')->...
     * The module slug is then resolved from the controller handling the
     * request through config('modules.controller_map'). Unmapped
     * controllers belong to the Core module and always pass.
     */
    public function handle(Request $request, Closure $next, ...$slugs)
    {
        $slugs = array_filter(array_map('trim', $slugs));

        if (empty($slugs)) {
            $resolved = $this->resolveSlugFromRoute($request);
            if ($resolved === null) {
                return $next($request); // Core / unmapped feature
            }
            $slugs = [$resolved];
        }

        /** @var ModuleService $service */
        $service = app(ModuleService::class);

        foreach ($slugs as $slug) {
            if ($service->isEnabled($slug)) {
                return $next($request);
            }
        }

        return response()->json([
            'data' => ['required_modules' => array_values($slugs)],
            'message' => 'The "' . implode('" or "', $slugs) . '" module is not enabled for your company.',
            'status' => 403,
        ], 403);
    }

    /**
     * Resolve a module slug from the controller bound to the current route.
     */
    private function resolveSlugFromRoute(Request $request): ?string
    {
        $route = $request->route();
        if (!$route) {
            return null;
        }

        $action = $route->getActionName();
        if (!$action || $action === 'Closure' || !str_contains($action, '@')) {
            return null;
        }

        $controller = explode('@', $action)[0];
        if (!$controller || $controller === 'Closure') {
            return null;
        }

        foreach (config('modules.controller_map', []) as $namespacePrefix => $slug) {
            if (str_starts_with($controller, $namespacePrefix)) {
                return $slug;
            }
        }

        return null;
    }
}
