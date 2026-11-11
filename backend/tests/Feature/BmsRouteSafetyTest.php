<?php

namespace Tests\Feature;

use Database\Seeders\BmsPhaseOneSeeder;
use Illuminate\Support\Facades\Route;
use Tests\BmsTestCase;

class BmsRouteSafetyTest extends BmsTestCase
{
    private const AUTH_ONLY_ROUTES = [
        'api/bms/lookups',
        'api/bms/notifications',
        'api/bms/notifications/{id}/read',
        'api/bms/audit/export',
    ];

    public function test_A3_every_bms_route_has_authentication_entitlement_and_permission(): void
    {
        $failures = [];
        foreach (Route::getRoutes() as $route) {
            $uri = $route->uri();
            if (!str_starts_with($uri, 'api/bms')) {
                continue;
            }
            $middleware = $route->gatherMiddleware();
            foreach (['jwt.verify', 'module:bms'] as $required) {
                if (!in_array($required, $middleware, true)) {
                    $failures[] = implode('|', $route->methods())." {$uri}: missing {$required}";
                }
            }
            $hasPermission = (bool) preg_grep('/^bms\.permission:/', $middleware);
            if (!$hasPermission && !in_array($uri, self::AUTH_ONLY_ROUTES, true)) {
                $failures[] = implode('|', $route->methods())." {$uri}: missing BMS permission";
            }
        }
        $this->assertSame([], $failures, implode("\n", $failures));
    }

    public function test_A3_real_jwt_and_module_middleware_protect_bms_routes(): void
    {
        $user = $this->actingAsRole('coordinator');
        $this->getJson('/api/bms/units')->assertStatus(404); // Legacy JWT middleware's missing-token response.
        $this->getBms('units', $user)->assertOk();

        $this->company->modules()->updateExistingPivot(
            \App\Models\Module::where('slug', 'bms')->firstOrFail()->id,
            ['is_enabled' => false]
        );
        \Illuminate\Support\Facades\Cache::flush();
        $this->getBms('units', $user)->assertForbidden();
    }

    public function test_A3_seeded_roles_match_the_brd_permission_boundaries(): void
    {
        $expected = [
            'operations' => ['opportunities.view', 'opportunities.manage', 'opportunities.import', 'leads.view', 'leads.manage', 'leads.convert'],
            'alpha_delta' => ['opportunities.view', 'opportunities.decide'],
            'finance' => ['procurement.view', 'procurement.review'],
            'hr' => ['recruitment.view', 'recruitment.manage', 'onboarding.respond'],
            'it' => ['support.view', 'support.respond', 'onboarding.respond'],
            'pr_marketing' => ['documents.manage', 'directory.manage', 'events.manage', 'procedures.manage', 'procurement.manage'],
        ];
        foreach ($expected as $slug => $abilities) {
            $role = \App\Models\BMS\BmsRole::where('slug', $slug)->firstOrFail();
            foreach ($abilities as $ability) {
                $this->assertContains($ability, $role->abilities, "{$slug} must have {$ability}");
            }
        }

        $operations = \App\Models\BMS\BmsRole::where('slug', 'operations')->firstOrFail();
        $this->assertNotContains('events.manage', $operations->abilities);
        $this->assertContains('leads.manage', $operations->abilities);
        $this->assertContains('leads.convert', $operations->abilities);

        $employee = \App\Models\BMS\BmsRole::where('slug', 'employee')->firstOrFail();
        $this->assertNotContains('support.manage', $employee->abilities);
        $this->assertSame(array_keys(BmsPhaseOneSeeder::ROLES), \App\Models\BMS\BmsRole::orderBy('id')->pluck('slug')->all());
    }
}
