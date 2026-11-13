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

    public function test_seeder_creates_the_seven_sellable_modules_with_correct_slugs(): void
    {
        $slugs = Module::orderBy('id')->pluck('slug')->all();

        $this->assertSame(
            ['bms', 'core', 'crm', 'ticketing', 'projects', 'hr', 'admin'],
            $slugs
        );
    }

    public function test_only_the_core_platform_and_bms_product_are_flagged_as_core(): void
    {
        $this->assertTrue((bool) Module::where('slug', 'core')->firstOrFail()->is_core);
        $this->assertTrue((bool) Module::where('slug', 'bms')->firstOrFail()->is_core);

        $nonCore = Module::whereNotIn('slug', ['core', 'bms'])->get();
        $this->assertCount(5, $nonCore);
        foreach ($nonCore as $module) {
            $this->assertFalse((bool) $module->is_core, "{$module->slug} must not be core");
            $this->assertTrue((bool) $module->is_active, "{$module->slug} must be globally active");
        }
    }

    public function test_module_seeder_is_idempotent_and_preserves_unique_catalogue_rows(): void
    {
        $before = Module::orderBy('slug')->pluck('slug')->all();
        $this->seed(\Database\Seeders\ModulesTableSeeder::class);
        $after = Module::orderBy('slug')->pluck('slug')->all();

        $this->assertSame($before, $after);
        $slugs = Module::pluck('slug')->all();
        $this->assertSame(7, count($slugs));
        $this->assertCount(count($slugs), array_unique($slugs));
        $this->assertTrue((bool) Module::where('slug', 'bms')->firstOrFail()->is_core);
    }

    public function test_default_company_is_seeded_with_every_module_enabled(): void
    {
        $company = Company::where('slug', 'default')->first();
        $this->assertNotNull($company);

        $this->assertSame(7, CompanyModule::where('company_id', $company->id)->count());
        $this->assertSame(7, CompanyModule::where('company_id', $company->id)->where('is_enabled', true)->count());
    }
}
