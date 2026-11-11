<?php

namespace Tests\Feature;

use App\Models\ContactLead;
use App\Models\Module;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Tests\BmsTestCase;

/**
 * STEP 1: the middleware priority change in Kernel.php affects every route. These tests prove that
 * non-BMS routes with implicit model binding keep working for authorised users and keep the correct
 * token/403/404 order: authentication, then module entitlement, then model binding.
 */
class P1KernelRegressionTest extends BmsTestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Route::middleware(['jwt.verify', 'module:crm', \Illuminate\Routing\Middleware\SubstituteBindings::class])->get('/api/test/crm-lead/{lead}', fn (ContactLead $lead) => response()->json(['name' => $lead->name]));
        Route::middleware(['jwt.verify', \Illuminate\Routing\Middleware\SubstituteBindings::class])->get('/api/test/core-lead/{lead}', fn (ContactLead $lead) => response()->json(['name' => $lead->name]));
    }

    private function legacyLead(string $name): ContactLead
    {
        $id = DB::table('contact_leads')->insertGetId(['name' => $name, 'created_at' => now(), 'updated_at' => now()]);

        return ContactLead::findOrFail($id);
    }

    private function enableCrm(): void
    {
        $module = Module::create(['name' => 'CRM', 'slug' => 'crm', 'is_active' => true]);
        $this->company->modules()->attach($module->id, ['is_enabled' => true, 'enabled_at' => now()]);
    }

    public function test_P1_S1_authorised_user_resolves_implicit_binding_on_a_module_route(): void
    {
        $this->enableCrm();
        $user = $this->makeUser();
        $lead = $this->legacyLead('Legacy lead');

        $this->getJson('/api/test/crm-lead/'.$lead->id, $this->jwtHeaders($user))
            ->assertOk()->assertJsonPath('name', 'Legacy lead');
        $this->getJson('/api/test/core-lead/'.$lead->id, $this->jwtHeaders($user))
            ->assertOk()->assertJsonPath('name', 'Legacy lead');
    }

    public function test_P1_S1_missing_record_is_404_for_entitled_user_and_never_leaks_for_others(): void
    {
        $this->enableCrm();
        $user = $this->makeUser();

        $this->getJson('/api/test/crm-lead/999999', $this->jwtHeaders($user))->assertNotFound();
        $this->getJson('/api/test/core-lead/999999', $this->jwtHeaders($user))->assertNotFound();
        // Legacy JwtMiddleware answers a missing token with HTTP 404 and this message (documented quirk).
        $this->getJson('/api/test/crm-lead/999999')->assertStatus(404)->assertSee('Authorization Token not found');
    }

    public function test_P1_S1_module_entitlement_runs_before_binding(): void
    {
        $module = Module::create(['name' => 'CRM', 'slug' => 'crm', 'is_active' => true]);
        $this->company->modules()->attach($module->id, ['is_enabled' => false]);
        $user = $this->makeUser();
        $lead = $this->legacyLead('Hidden');

        $this->getJson('/api/test/crm-lead/'.$lead->id, $this->jwtHeaders($user))->assertForbidden();
        $this->getJson('/api/test/crm-lead/999999', $this->jwtHeaders($user))->assertForbidden();
    }

    public function test_P1_S1_bms_routes_keep_jwt_then_module_then_permission_then_binding_order(): void
    {
        $unitId = \App\Models\BMS\BusinessUnit::where('slug', 'alpha-x')->value('id');
        $plan = (object) ['id' => DB::table('weekly_plans')->insertGetId([
            'business_unit_id' => $unitId, 'week_start' => '2026-11-08', 'status' => 'draft',
            'created_by' => $this->makeUser()->id, 'created_at' => now(), 'updated_at' => now(),
        ])];
        $employee = $this->actingAsRole('employee', [$unitId]);

        $this->getJson('/api/bms/weekly-plans/'.$plan->id)->assertStatus(404)->assertSee('Authorization Token not found');
        $this->getJson('/api/bms/weekly-plans/999999', $this->jwtHeaders($employee))->assertNotFound();
        $this->putJson('/api/bms/weekly-plans/999999', [], $this->jwtHeaders($employee))->assertForbidden();

        $this->company->modules()->updateExistingPivot(Module::where('slug', 'bms')->value('id'), ['is_enabled' => false]);
        $this->getJson('/api/bms/weekly-plans/999999', $this->jwtHeaders($employee))->assertForbidden();
    }
}
