<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\CompanyModule;
use App\Models\Module;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Tests\Modular\CreatesModuleDatabase;
use Tests\TestCase;

class ModulesTableSeederTest extends TestCase
{
    use CreatesModuleDatabase;
    use WithoutMiddleware;

    protected function setUp(): void
    {
        parent::setUp();
        $this->setUpModuleDatabase();
    }

    public function test_seeder_creates_the_six_sellable_modules_with_correct_slugs(): void
    {
        $slugs = Module::orderBy('id')->pluck('slug')->all();

        $this->assertSame(
            ['core', 'crm', 'ticketing', 'projects', 'hr', 'admin'],
            $slugs
        );
    }

    public function test_only_the_core_module_is_flagged_as_core(): void
    {
        $this->assertTrue(Module::where('slug', 'core')->first()->is_core);

        $nonCore = Module::where('slug', '!=', 'core')->get();
        $this->assertCount(5, $nonCore);
        foreach ($nonCore as $module) {
            $this->assertFalse((bool) $module->is_core, "{$module->slug} must not be core");
            $this->assertTrue((bool) $module->is_active, "{$module->slug} must be globally active");
        }
    }

    public function test_default_company_is_seeded_with_every_module_enabled(): void
    {
        $company = Company::where('slug', 'default')->first();
        $this->assertNotNull($company);

        $this->assertSame(6, CompanyModule::where('company_id', $company->id)->count());
        $this->assertSame(6, CompanyModule::where('company_id', $company->id)->where('is_enabled', true)->count());
    }
}
