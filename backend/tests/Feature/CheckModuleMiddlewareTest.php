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
}
