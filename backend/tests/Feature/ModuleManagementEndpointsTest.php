<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\CompanyModule;
use App\Models\Module;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tests\Modular\CreatesModuleDatabase;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class ModuleManagementEndpointsTest extends TestCase
{
    use CreatesModuleDatabase;

    protected User $admin;
    protected User $staff;
    protected Company $company;

    protected function setUp(): void
    {
        parent::setUp();
        $this->setUpModuleDatabase();

        $this->company = Company::where('slug', 'default')->first();

        $this->admin = User::create([
            'username' => 'admin-user',
            'email' => 'admin@example.com',
            'password' => Hash::make('secret'),
            'sub_departments_id' => 1, // Management
            'company_id' => $this->company->id,
        ]);

        $this->staff = User::create([
            'username' => 'staff-user',
            'email' => 'staff@example.com',
            'password' => Hash::make('secret'),
            'sub_departments_id' => 2, // Technical team
            'company_id' => $this->company->id,
        ]);
    }

    private function headers(User $user): array
    {
        return ['Authorization' => 'Bearer ' . JWTAuth::fromUser($user)];
    }

    public function test_modules_catalogue_lists_all_modules_with_company_status(): void
    {
        $response = $this->get('/api/modules', $this->headers($this->admin));

        $response->assertStatus(200);
        $modules = collect($response->json('data'));
        $this->assertSame(6, $modules->count());
        $this->assertSame(
            ['admin', 'core', 'crm', 'hr', 'projects', 'ticketing'],
            $modules->pluck('slug')->sort()->values()->all()
        );

        // The default company is fully provisioned: every catalogue row carries
        // the is_enabled flag and every module is enabled out of the box.
        foreach ($modules as $module) {
            $this->assertArrayHasKey('is_enabled', $module);
            $this->assertTrue($module['is_enabled'], "{$module['slug']} should be enabled for the default company");
        }
        $this->assertTrue($modules->firstWhere('slug', 'core')['is_core']);
    }

    public function test_catalogue_and_company_list_reflect_a_disabled_module(): void
    {
        $this->post('/api/company/modules/disable', ['module_slug' => 'crm'], $this->headers($this->admin))
            ->assertStatus(200);

        $catalogue = collect($this->get('/api/modules', $this->headers($this->staff))->json('data'));
        $this->assertFalse($catalogue->firstWhere('slug', 'crm')['is_enabled']);
        // Core is unaffected by disabling an optional module.
        $this->assertTrue($catalogue->firstWhere('slug', 'core')['is_enabled']);

        $companySlugs = collect($this->get('/api/company/modules', $this->headers($this->staff))->json('data'))
            ->pluck('slug')->all();
        $this->assertNotContains('crm', $companySlugs);
        $this->assertContains('core', $companySlugs);
    }

    public function test_company_modules_endpoint_returns_only_enabled_modules(): void
    {
        $response = $this->get('/api/company/modules', $this->headers($this->staff));

        $response->assertStatus(200);
        $slugs = collect($response->json('data'))->pluck('slug')->sort()->values()->all();
        $this->assertSame(['admin', 'core', 'crm', 'hr', 'projects', 'ticketing'], $slugs);
    }

    public function test_admin_can_disable_and_enable_a_module(): void
    {
        // Disable CRM
        $this->post('/api/company/modules/disable', ['module_slug' => 'crm'], $this->headers($this->admin))
            ->assertStatus(200);

        $crmPivot = CompanyModule::where('company_id', $this->company->id)
            ->where('module_id', Module::where('slug', 'crm')->first()->id)
            ->first();
        $this->assertFalse((bool) $crmPivot->is_enabled);
        $this->assertNull($crmPivot->enabled_at);

        $companyModules = collect(
            $this->get('/api/company/modules', $this->headers($this->admin))->json('data')
        )->pluck('slug')->all();
        $this->assertNotContains('crm', $companyModules);

        // Re-enable CRM
        $this->post('/api/company/modules/enable', ['module_slug' => 'crm'], $this->headers($this->admin))
            ->assertStatus(200);

        $crmPivot->refresh();
        $this->assertTrue((bool) $crmPivot->is_enabled);
        $this->assertNotNull($crmPivot->enabled_at);
    }

    public function test_non_admin_cannot_change_module_entitlements(): void
    {
        $this->post('/api/company/modules/disable', ['module_slug' => 'crm'], $this->headers($this->staff))
            ->assertStatus(403);

        $this->post('/api/company/modules/enable', ['module_slug' => 'crm'], $this->headers($this->staff))
            ->assertStatus(403);
    }

    public function test_core_module_cannot_be_disabled(): void
    {
        $this->post('/api/company/modules/disable', ['module_slug' => 'core'], $this->headers($this->admin))
            ->assertStatus(422);
    }

    public function test_validation_error_when_slug_missing(): void
    {
        $this->post('/api/company/modules/enable', [], $this->headers($this->admin))
            ->assertStatus(400);
    }

    public function test_endpoints_require_authentication(): void
    {
        $this->get('/api/modules')->assertStatus(404);
        $this->post('/api/company/modules/enable', ['module_slug' => 'crm'])->assertStatus(404);
    }

    public function test_administration_sub_department_can_also_toggle_modules(): void
    {
        $administration = User::create([
            'username' => 'admin-dept-user',
            'email' => 'admin-dept@example.com',
            'password' => Hash::make('secret'),
            'sub_departments_id' => 4, // Administration — also allowed
            'company_id' => $this->company->id,
        ]);

        $this->post(
            '/api/company/modules/disable',
            ['module_slug' => 'hr'],
            $this->headers($administration)
        )->assertStatus(200);

        $this->assertFalse(
            (bool) CompanyModule::where('company_id', $this->company->id)
                ->where('module_id', Module::where('slug', 'hr')->first()->id)
                ->first()->is_enabled
        );
    }

    public function test_toggle_accepts_module_id_instead_of_slug(): void
    {
        $ticketingId = Module::where('slug', 'ticketing')->first()->id;

        $this->post('/api/company/modules/disable', ['module_id' => $ticketingId], $this->headers($this->admin))
            ->assertStatus(200);

        $pivot = CompanyModule::where('company_id', $this->company->id)
            ->where('module_id', $ticketingId)->first();
        $this->assertFalse((bool) $pivot->is_enabled);
    }

    public function test_core_module_rejection_leaves_its_pivot_enabled(): void
    {
        $coreId = Module::where('slug', 'core')->first()->id;

        $this->post('/api/company/modules/disable', ['module_slug' => 'core'], $this->headers($this->admin))
            ->assertStatus(422);

        $corePivot = CompanyModule::where('company_id', $this->company->id)
            ->where('module_id', $coreId)->first();
        $this->assertTrue((bool) $corePivot->is_enabled);
    }

    public function test_unknown_slug_is_rejected_by_validation(): void
    {
        $this->post(
            '/api/company/modules/enable',
            ['module_slug' => 'not-a-real-module'],
            $this->headers($this->admin)
        )->assertStatus(400);
    }
}
