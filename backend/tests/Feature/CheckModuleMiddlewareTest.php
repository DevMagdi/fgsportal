<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\CompanyModule;
use App\Models\Module;
use App\Models\User;
use App\Services\ModuleService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Tests\Modular\CreatesModuleDatabase;
use Tests\Modular\Stubs\CrmStubController;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class CheckModuleMiddlewareTest extends TestCase
{
    use CreatesModuleDatabase;

    protected User $user;
    protected Company $company;

    protected function setUp(): void
    {
        parent::setUp();
        $this->setUpModuleDatabase();

        $this->company = Company::where('slug', 'default')->first();
        $this->user = User::create([
            'username' => 'module-user',
            'email' => 'module-user@example.com',
            'password' => Hash::make('secret'),
            'sub_departments_id' => 2,
            'company_id' => $this->company->id,
        ]);

        Route::middleware('jwt.verify')->group(function () {
            Route::get('/test/core-ping', fn () => response()->json(['ok' => 'core']));
            Route::get('/test/crm-explicit', fn () => response()->json(['ok' => 'crm']))
                ->middleware('module:crm');
            Route::get('/test/crm-mapped', [CrmStubController::class, 'index'])
                ->middleware('module');
            Route::get('/test/multi-module', fn () => response()->json(['ok' => 'multi']))
                ->middleware('module:ticketing,crm');
            Route::get('/test/unknown-module', fn () => response()->json(['ok' => 'unknown']))
                ->middleware('module:does-not-exist');
        });
    }

    private function authHeader(): array
    {
        return ['Authorization' => 'Bearer ' . JWTAuth::fromUser($this->user)];
    }

    private function setCrmEnabled(bool $enabled): void
    {
        $crm = Module::where('slug', 'crm')->firstOrFail();
        CompanyModule::where('company_id', $this->company->id)
            ->where('module_id', $crm->id)
            ->update(['is_enabled' => $enabled, 'enabled_at' => $enabled ? now() : null]);

        app(ModuleService::class)->forgetCache($this->company->id, 'crm');
    }

    public function test_core_module_is_always_accessible_even_when_others_disabled(): void
    {
        $this->setCrmEnabled(false);

        $response = $this->get('/test/core-ping', $this->authHeader());

        $response->assertStatus(200);
    }

    public function test_disabled_module_returns_403(): void
    {
        $this->setCrmEnabled(false);

        $response = $this->get('/test/crm-explicit', $this->authHeader());

        $response->assertStatus(403);
        $this->assertStringContainsString('crm', $response->json('message'));
    }

    public function test_enabled_module_is_allowed(): void
    {
        $this->setCrmEnabled(true);

        $response = $this->get('/test/crm-explicit', $this->authHeader());

        $response->assertStatus(200);
    }

    public function test_bare_middleware_resolves_module_from_controller_map(): void
    {
        config(['modules.controller_map' => [
            CrmStubController::class => 'crm',
        ]]);

        $this->setCrmEnabled(false);
        $this->get('/test/crm-mapped', $this->authHeader())->assertStatus(403);

        $this->setCrmEnabled(true);
        $this->get('/test/crm-mapped', $this->authHeader())->assertStatus(200);
    }

    public function test_unmapped_controller_is_treated_as_core_and_allowed(): void
    {
        // No map entry for the closure route -> Core -> always allowed.
        $this->setCrmEnabled(false);

        $this->get('/test/core-ping', $this->authHeader())->assertStatus(200);
    }

    public function test_unprovisioned_company_follows_fail_open_configuration(): void
    {
        config(['modules.fail_open' => true]);
        $company = Company::create([
            'name' => 'New Client',
            'slug' => 'new-client',
            'is_active' => true,
        ]);
        $this->user->update(['company_id' => $company->id]);
        app(ModuleService::class)->forgetCache($company->id, 'crm');

        $this->get('/test/crm-explicit', $this->authHeader())->assertStatus(200);

        config(['modules.fail_open' => false]);
        app(ModuleService::class)->forgetCache($company->id, 'crm');
        $this->get('/test/crm-explicit', $this->authHeader())->assertStatus(403);
    }

    public function test_request_without_token_is_rejected_by_jwt(): void
    {
        $this->get('/test/crm-explicit')->assertStatus(404);
    }

    public function test_management_flip_invalidates_the_cache_without_manual_cache_clear(): void
    {
        $admin = User::create([
            'username' => 'module-admin',
            'email' => 'module-admin@example.com',
            'password' => Hash::make('secret'),
            'sub_departments_id' => 1, // Management — allowed to toggle modules
            'company_id' => $this->company->id,
        ]);
        $adminHeaders = ['Authorization' => 'Bearer ' . JWTAuth::fromUser($admin)];

        // Baseline: the default company has CRM enabled and the route works.
        $this->get('/test/crm-explicit', $this->authHeader())->assertStatus(200);

        // Disable through the real management endpoint, which must forget the
        // cached entitlement. No manual Cache::forget happens in this test.
        $this->post('/api/company/modules/disable', ['module_slug' => 'crm'], $adminHeaders)
            ->assertStatus(200);

        $this->get('/test/crm-explicit', $this->authHeader())
            ->assertStatus(403)
            ->assertJsonPath('data.required_modules', ['crm']);

        // Re-enabling must likewise invalidate the previously cached "denied" state.
        $this->post('/api/company/modules/enable', ['module_slug' => 'crm'], $adminHeaders)
            ->assertStatus(200);

        $this->get('/test/crm-explicit', $this->authHeader())->assertStatus(200);
    }

    public function test_globally_inactive_module_is_denied_even_when_the_pivot_is_enabled(): void
    {
        Module::where('slug', 'crm')->update(['is_active' => false]);
        app(ModuleService::class)->forgetCache($this->company->id, 'crm');

        // The default company still has an enabled pivot row for CRM.
        $this->get('/test/crm-explicit', $this->authHeader())->assertStatus(403);
    }

    public function test_unknown_module_slug_is_not_blocked(): void
    {
        // Unmapped/unknown features must never lock users out (fail-open for
        // routes whose slug does not exist in the catalogue).
        $this->get('/test/unknown-module', $this->authHeader())->assertStatus(200);
    }

    public function test_multi_slug_middleware_passes_when_any_required_module_is_enabled(): void
    {
        $ticketing = Module::where('slug', 'ticketing')->firstOrFail();
        $crm = Module::where('slug', 'crm')->firstOrFail();

        // Both enabled initially -> allowed.
        $this->get('/test/multi-module', $this->authHeader())->assertStatus(200);

        // Disable CRM but keep Ticketing -> still allowed (any-of semantics).
        CompanyModule::where('company_id', $this->company->id)
            ->where('module_id', $crm->id)
            ->update(['is_enabled' => false]);
        app(ModuleService::class)->forgetCache($this->company->id, 'crm');

        $this->get('/test/multi-module', $this->authHeader())->assertStatus(200);

        // Disable Ticketing as well -> both required modules missing -> denied,
        // and the message names both slugs.
        CompanyModule::where('company_id', $this->company->id)
            ->where('module_id', $ticketing->id)
            ->update(['is_enabled' => false]);
        app(ModuleService::class)->forgetCache($this->company->id, 'ticketing');

        $this->get('/test/multi-module', $this->authHeader())
            ->assertStatus(403)
            ->assertJsonPath('data.required_modules', ['ticketing', 'crm']);
    }
}
