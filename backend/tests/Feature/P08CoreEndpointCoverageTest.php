<?php

namespace Tests\Feature;

use App\Models\BMS\BmsRole;
use App\Models\BMS\BrandDocument;
use App\Models\BMS\BusinessUnit;
use App\Models\BMS\Lead;
use App\Models\BMS\PipelineStage;
use App\Models\BMS\UnitTask;
use App\Models\BMS\WeeklyPlan;
use App\Models\Module;
use App\Models\Product;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Tests\BmsTestCase;

class P08CoreEndpointCoverageTest extends BmsTestCase
{
    public function test_P0_8_unit_crud_director_assignment_uniqueness_and_delete_guards(): void
    {
        $admin = $this->actingAsRole('system_admin');
        $director = $this->makeUser();
        $created = $this->postBms('units', [
            'name' => 'P08 Unit', 'director_id' => $director->id,
            'key_messages' => 'Message', 'services' => ['Consulting'],
        ], $admin)->assertCreated()->json('data');
        $this->assertSame('Message', $created['key_messages']);
        $this->assertDatabaseHas('bms_role_user', [
            'user_id' => $director->id,
            'bms_role_id' => BmsRole::where('slug', 'unit_director')->value('id'),
            'business_unit_id' => $created['id'],
        ]);
        $this->postBms('units', ['name' => 'P08 Unit'], $admin)->assertStatus(422);
        $this->postBms('units', ['name' => 'P08 Child', 'parent_id' => $created['id']], $admin)->assertCreated();
        $this->deleteJson('/api/bms/units/'.$created['id'], [], $this->jwtHeaders($admin))->assertStatus(422);

        $outsider = $this->actingAsRole('unit_director', [BusinessUnit::where('slug', 'alpha-x')->value('id')]);
        $this->getBms('units/'.$created['id'], $outsider)->assertForbidden();
        $employee = $this->actingAsRole('employee');
        $this->postBms('units', ['name' => 'Denied'], $employee)->assertForbidden();
    }

    public function test_P0_8_weekly_tasks_support_lifecycle_ownership_and_report(): void
    {
        $unit = BusinessUnit::where('slug', 'alpha-x')->firstOrFail();
        $director = $this->actingAsRole('unit_director', [$unit->id]);
        $plan = $this->postBms('weekly-plans', [
            'business_unit_id' => $unit->id, 'week_start' => '2026-11-08',
        ], $director)->assertCreated()->json('data');
        $task = $this->postBms("weekly-plans/{$plan['id']}/tasks", [
            'title' => 'Own task', 'owner_id' => $director->id, 'status' => 'achieved',
        ], $director)->assertCreated()->json('data');
        $this->assertNotNull(UnitTask::findOrFail($task['id'])->completion_date);
        $this->putBms('tasks/'.$task['id'], ['status' => 'not_done'], $director)->assertOk();
        $this->assertNull(UnitTask::findOrFail($task['id'])->completion_date);

        $employee = $this->actingAsRole('employee', [$unit->id]);
        $this->putBms('tasks/'.$task['id'], ['progress' => 20], $employee)->assertForbidden();
        $support = $this->postBms("weekly-plans/{$plan['id']}/support-requests", [
            'department_id' => 3, 'title' => 'Access', 'details' => 'VPN required',
        ], $director)->assertCreated()->json('data');
        $it = $this->actingAsRole('it', [], ['sub_departments_id' => 3]);
        $this->putBms('support-requests/'.$support['id'], [
            'status' => 'resolved', 'response' => 'Configured',
        ], $it)->assertOk();
        $this->getBms("weekly-plans/{$plan['id']}/sunday-report", $director)
            ->assertOk()->assertJsonPath('data.summary.not_done', 1);
        $this->assertDatabaseHas('bms_audit_logs', ['event' => 'support.status_changed']);
    }

    public function test_P0_8_product_phases_multi_unit_scope_and_lead_conversion(): void
    {
        $unit = BusinessUnit::where('slug', 'alpha-x')->firstOrFail();
        $other = BusinessUnit::where('slug', 'alpha-gen')->firstOrFail();
        $director = $this->actingAsRole('unit_director', [$unit->id]);
        $product = $this->postBms('products', [
            'product_name' => 'P08 Product', 'business_unit_ids' => [$unit->id],
        ], $director)->assertCreated()->json('data');
        $phase = $this->postBms("products/{$product['id']}/phases", [
            'name' => 'Discovery', 'sequence' => 1, 'status' => 'in_progress',
        ], $director)->assertCreated()->json('data');
        $this->postBms("products/{$product['id']}/phases", [
            'name' => 'Duplicate', 'sequence' => 1,
        ], $director)->assertStatus(422);
        $this->getBms('products', $director)->assertOk()->assertJsonCount(1, 'data');
        $this->putBms("products/{$product['id']}", ['business_unit_ids' => [$unit->id]], $director)->assertOk();
        $this->deleteJson('/api/bms/product-phases/'.$phase['id'], [], $this->jwtHeaders($director))->assertOk();

        $lead = $this->postBms('leads', [
            'name' => 'P08 Lead', 'business_unit_id' => $unit->id,
            'owner_id' => $director->id, 'stage' => 'identified',
        ], $director)->assertCreated()->json('data');
        $this->postBms("leads/{$lead['id']}/study-items", ['title' => 'Blocked'], $director)->assertStatus(422);
        $this->postBms("leads/{$lead['id']}/interactions", [
            'interaction_type' => 'call', 'happened_at' => now()->toDateTimeString(), 'outcome' => 'Interested',
        ], $director)->assertCreated();
        $this->assertNotNull(Lead::findOrFail($lead['id'])->last_contacted_at);
        $this->postBms("leads/{$lead['id']}/convert", [], $director)->assertCreated()
            ->assertJsonPath('data.stage', 'converted');
        $this->postBms("leads/{$lead['id']}/convert", [], $director)->assertStatus(422);
        $this->assertDatabaseHas('bms_audit_logs', ['event' => 'lead.converted']);

        $outsider = $this->actingAsRole('unit_director', [$other->id]);
        $this->putBms("products/{$product['id']}", ['product_name' => 'IDOR'], $outsider)->assertForbidden();
        $this->putBms("leads/{$lead['id']}", ['name' => 'IDOR'], $outsider)->assertForbidden();
    }

    public function test_P0_8_document_versions_and_private_published_download(): void
    {
        Storage::fake('local');
        $pr = $this->actingAsRole('pr_marketing');
        foreach ([1, 2] as $version) {
            $this->postBms('documents', [
                'name' => 'Brand', 'category' => 'Guide', 'document_key' => 'p08-brand',
                'file' => UploadedFile::fake()->createWithContent("v{$version}.pdf", '%PDF-1.4'),
            ], $pr)->assertCreated()->assertJsonPath('data.version', $version);
        }
        $this->assertSame(1, BrandDocument::where('document_key', 'p08-brand')->where('is_latest', true)->count());
        $latest = BrandDocument::where('document_key', 'p08-brand')->where('is_latest', true)->firstOrFail();
        $this->getBms('documents?latest_only=1', $pr)->assertOk()->assertJsonCount(1, 'data');
        $this->getBms('documents/'.$latest->id.'/history', $pr)->assertOk()->assertJsonCount(2, 'data');
        $this->getBms('documents/'.$latest->id.'/download', $pr)->assertOk();
        $employee = $this->actingAsRole('employee');
        $this->postBms('documents', ['name' => 'Denied'], $employee)->assertForbidden();
        $latest->update(['is_published' => false]);
        $this->getBms('documents/'.$latest->id.'/download', $employee)->assertNotFound();
    }

    public function test_P0_8_module_entitlement_is_enforced_on_every_bms_route(): void
    {
        $admin = $this->actingAsRole('system_admin');
        $this->company->modules()->updateExistingPivot(Module::where('slug', 'bms')->value('id'), ['is_enabled' => false]);
        Cache::flush();
        $checked = 0;
        foreach (Route::getRoutes() as $route) {
            if (!str_starts_with($route->uri(), 'api/bms')) continue;
            $uri = preg_replace('/\{[^}]+\}/', '1', $route->uri());
            foreach (array_diff($route->methods(), ['HEAD', 'OPTIONS']) as $method) {
                $this->json($method, '/'.$uri, [], $this->jwtHeaders($admin))->assertForbidden();
                $checked++;
            }
        }
        $this->assertGreaterThanOrEqual(80, $checked);
    }
}
