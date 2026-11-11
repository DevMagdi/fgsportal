<?php

namespace Tests\Feature;

use App\Models\BMS\BusinessUnit;
use App\Models\BMS\Lead;
use App\Models\BMS\Opportunity;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\BmsTestCase;

/** P1-1 employee rollup, P1-2 phase progress, P1-12 lead conversion, and the migration that backs them. */
class P1Batch1Test extends BmsTestCase
{
    protected function tearDown(): void
    {
        Carbon::setTestNow();
        parent::tearDown();
    }

    private function unit(string $slug): BusinessUnit
    {
        return BusinessUnit::where('slug', $slug)->firstOrFail();
    }

    private function planWithTasks(BusinessUnit $unit, $director, $first, $second): int
    {
        $plan = $this->postBms('weekly-plans', [
            'business_unit_id' => $unit->id, 'week_start' => '2026-11-08',
        ], $director)->assertCreated()->json('data');
        $this->postBms("weekly-plans/{$plan['id']}/tasks", [
            'title' => 'Done', 'owner_id' => $first->id, 'status' => 'achieved', 'progress' => 100, 'due_date' => '2026-11-12',
        ], $director)->assertCreated();
        $this->postBms("weekly-plans/{$plan['id']}/tasks", [
            'title' => 'Late', 'owner_id' => $first->id, 'status' => 'in_progress', 'progress' => 40,
            'due_date' => '2026-11-01', 'blockers' => 'Waiting for access',
        ], $director)->assertCreated();
        $this->postBms("weekly-plans/{$plan['id']}/tasks", [
            'title' => 'Open', 'owner_id' => $second->id, 'status' => 'not_done', 'progress' => 0,
        ], $director)->assertCreated();

        return $plan['id'];
    }

    public function test_P1_1_rollup_counts_per_employee_and_employee_sees_only_own_row(): void
    {
        Carbon::setTestNow('2026-11-11 10:00:00');
        $unit = $this->unit('alpha-x');
        $director = $this->actingAsRole('unit_director', [$unit->id]);
        $one = $this->actingAsRole('employee', [$unit->id]);
        $two = $this->actingAsRole('employee', [$unit->id]);
        $this->planWithTasks($unit, $director, $one, $two);

        $rows = $this->getBms('employee-tasks?business_unit_id='.$unit->id.'&week_start=2026-11-08', $director)
            ->assertOk()->json('data');
        $this->assertCount(2, $rows);
        $this->assertSame($one->id, $rows[0]['employee']['id'], 'Employee with overdue work is listed first.');
        $this->assertSame(2, $rows[0]['total']);
        $this->assertSame(1, $rows[0]['achieved']);
        $this->assertSame(1, $rows[0]['in_progress']);
        $this->assertSame(1, $rows[0]['overdue']);
        $this->assertSame(1, $rows[0]['blocked']);
        $this->assertSame(70, $rows[0]['average_progress']);
        $this->assertCount(2, $rows[0]['tasks']);
        $this->assertSame(1, $rows[1]['not_done']);
        $this->assertSame(0, $rows[1]['overdue']);

        $own = $this->getBms('employee-tasks', $one)->assertOk()->json('data');
        $this->assertCount(1, $own);
        $this->assertSame($one->id, $own[0]['employee']['id']);
    }

    public function test_P1_1_rollup_filters_by_period_and_rejects_bad_input_and_other_units(): void
    {
        Carbon::setTestNow('2026-11-11 10:00:00');
        $unit = $this->unit('alpha-x');
        $other = $this->unit('alpha-gen');
        $director = $this->actingAsRole('unit_director', [$unit->id]);
        $one = $this->actingAsRole('employee', [$unit->id]);
        $this->planWithTasks($unit, $director, $one, $one);

        $this->assertCount(1, $this->getBms('employee-tasks?from=2026-11-01&to=2026-11-30', $director)->json('data'));
        $this->assertCount(0, $this->getBms('employee-tasks?from=2026-12-01&to=2026-12-31', $director)->json('data'));
        $this->getBms('employee-tasks?from=2026-12-01&to=2026-11-01', $director)->assertStatus(422);
        $this->getBms('employee-tasks?business_unit_id=999999', $director)->assertStatus(422);
        $this->getBms('employee-tasks?business_unit_id='.$other->id, $director)->assertForbidden();

        $outsider = $this->actingAsRole('unit_director', [$other->id]);
        $this->assertSame([], $this->getBms('employee-tasks', $outsider)->assertOk()->json('data'));
        $alpha = $this->actingAsRole('alpha_delta');
        $this->getBms('employee-tasks', $alpha)->assertForbidden();
    }

    public function test_P1_1_dashboard_card_lists_employees_without_task_bodies(): void
    {
        Carbon::setTestNow('2026-11-11 10:00:00');
        $unit = $this->unit('alpha-x');
        $director = $this->actingAsRole('unit_director', [$unit->id]);
        $one = $this->actingAsRole('employee', [$unit->id]);
        $this->planWithTasks($unit, $director, $one, $one);

        $card = $this->getBms('executive-dashboard', $director)->assertOk()->json('data.employee_tasks');
        $this->assertCount(1, $card);
        $this->assertSame(3, $card[0]['total']);
        $this->assertArrayNotHasKey('tasks', $card[0]);
    }

    private function product(BusinessUnit $unit, $director): array
    {
        return $this->postBms('products', [
            'product_name' => 'P12 Product '.uniqid(), 'business_unit_ids' => [$unit->id],
        ], $director)->assertCreated()->json('data');
    }

    public function test_P1_2_phase_progress_rules_and_overall_progress(): void
    {
        $unit = $this->unit('alpha-x');
        $director = $this->actingAsRole('unit_director', [$unit->id]);
        $product = $this->product($unit, $director);

        $first = $this->postBms("products/{$product['id']}/phases", [
            'name' => 'Design', 'sequence' => 1, 'status' => 'completed',
        ], $director)->assertCreated()->json('data');
        $this->assertSame(100, $first['progress']);
        $second = $this->postBms("products/{$product['id']}/phases", [
            'name' => 'Build', 'sequence' => 2, 'status' => 'in_progress', 'progress' => 35,
        ], $director)->assertCreated()->json('data');
        $this->assertSame(35, $second['progress']);
        $third = $this->postBms("products/{$product['id']}/phases", [
            'name' => 'Launch', 'sequence' => 3,
        ], $director)->assertCreated()->json('data');
        $this->assertSame(0, $third['progress']);

        $listed = collect($this->getBms('products', $director)->assertOk()->json('data'))->firstWhere('id', $product['id']);
        $this->assertSame(33, $listed['overall_progress'], 'One of three phases is completed.');

        $this->putBms('product-phases/'.$second['id'], ['status' => 'completed'], $director)->assertOk()
            ->assertJsonPath('data.progress', 100);
        $this->putBms('product-phases/'.$second['id'], ['status' => 'not_started'], $director)->assertOk()
            ->assertJsonPath('data.progress', 0);
        $this->putBms('product-phases/'.$second['id'], ['status' => 'in_progress', 'progress' => 60], $director)->assertOk()
            ->assertJsonPath('data.progress', 60);

        $dashboard = collect($this->getBms('executive-dashboard', $director)->json('data.products'))->firstWhere('id', $product['id']);
        $this->assertSame(33, $dashboard['overall_progress']);
        $month = collect($this->getBms('reports/monthly', $director)->json('data.products'))->firstWhere('id', $product['id']);
        $this->assertSame(33, $month['overall_progress']);
    }

    public function test_P1_2_conflicting_or_out_of_range_progress_is_rejected(): void
    {
        $unit = $this->unit('alpha-x');
        $director = $this->actingAsRole('unit_director', [$unit->id]);
        $product = $this->product($unit, $director);
        $url = "products/{$product['id']}/phases";

        $this->postBms($url, ['name' => 'A', 'sequence' => 1, 'status' => 'completed', 'progress' => 90], $director)->assertStatus(422);
        $this->postBms($url, ['name' => 'B', 'sequence' => 2, 'status' => 'not_started', 'progress' => 10], $director)->assertStatus(422);
        $this->postBms($url, ['name' => 'C', 'sequence' => 3, 'progress' => 101], $director)->assertStatus(422);
        $this->postBms($url, ['name' => 'D', 'sequence' => 4, 'progress' => -1], $director)->assertStatus(422);
        $this->assertSame(0, DB::table('product_phases')->where('product_id', $product['id'])->count());

        $phase = $this->postBms($url, ['name' => 'E', 'sequence' => 5, 'status' => 'in_progress', 'progress' => 20], $director)->json('data');
        $this->putBms('product-phases/'.$phase['id'], ['status' => 'completed', 'progress' => 50], $director)->assertStatus(422);

        $employee = $this->actingAsRole('employee', [$unit->id]);
        $this->putBms('product-phases/'.$phase['id'], ['progress' => 30], $employee)->assertForbidden();
        $outsider = $this->actingAsRole('unit_director', [$this->unit('alpha-gen')->id]);
        $this->putBms('product-phases/'.$phase['id'], ['progress' => 30], $outsider)->assertForbidden();
        $this->assertDatabaseHas('bms_audit_logs', ['event' => 'product_phase.created']);
    }

    public function test_P1_12_conversion_carries_lead_data_links_both_ways_and_writes_history(): void
    {
        $unit = $this->unit('alpha-gen');
        $director = $this->actingAsRole('unit_director', [$unit->id]);
        $lead = $this->postBms('leads', [
            'name' => 'Genome Hospital', 'entity_type' => 'government', 'sector' => 'Healthcare',
            'contact_name' => 'Dr Sara', 'contact_email' => 'sara@example.test', 'contact_phone' => '+966500000000',
            'business_unit_id' => $unit->id, 'owner_id' => $director->id, 'notes' => 'Wants a pilot',
        ], $director)->assertCreated()->json('data');

        $response = $this->postBms("leads/{$lead['id']}/convert", [], $director)->assertCreated();
        $converted = $response->json('data');
        $this->assertSame('converted', $converted['stage']);
        $opportunity = Opportunity::findOrFail($converted['converted_opportunity_id']);
        $this->assertSame($lead['id'], $opportunity->bms_lead_id);
        $this->assertSame('Healthcare', $opportunity->sector);
        $this->assertSame('Wants a pilot', $opportunity->notes);
        $this->assertSame('Dr Sara', $opportunity->contact_name);
        $this->assertSame('sara@example.test', $opportunity->contact_email);
        $this->assertSame('+966500000000', $opportunity->contact_phone);
        $this->assertSame($unit->id, $opportunity->business_unit_id);
        $this->assertSame($director->id, $opportunity->owner_id);
        $this->assertSame($lead['id'], $opportunity->sourceLead->id);
        $this->assertDatabaseHas('bms_lead_interactions', ['bms_lead_id' => $lead['id'], 'interaction_type' => 'note']);
        $this->assertDatabaseHas('bms_opportunity_stage_histories', ['bms_opportunity_id' => $opportunity->id, 'to_stage' => 'qualification']);
        $this->assertDatabaseHas('bms_audit_logs', ['event' => 'lead.converted']);
    }

    public function test_P1_12_conversion_is_one_time_and_permission_and_scope_checked(): void
    {
        $unit = $this->unit('alpha-gen');
        $coordinator = $this->actingAsRole('unit_director', [$unit->id]);
        $lead = Lead::create(['name' => 'Once', 'entity_type' => 'private', 'business_unit_id' => $unit->id]);
        $this->postBms("leads/{$lead->id}/convert", [], $coordinator)->assertCreated();
        $this->postBms("leads/{$lead->id}/convert", [], $coordinator)->assertStatus(422);
        $this->assertSame(1, Opportunity::where('bms_lead_id', $lead->id)->count());

        $fresh = Lead::create(['name' => 'Twice', 'entity_type' => 'private', 'business_unit_id' => $unit->id]);
        $employee = $this->actingAsRole('employee', [$unit->id]);
        $this->postBms("leads/{$fresh->id}/convert", [], $employee)->assertForbidden();
        $outsider = $this->actingAsRole('unit_director', [$this->unit('alpha-x')->id]);
        $this->postBms("leads/{$fresh->id}/convert", [], $outsider)->assertForbidden();
        $this->assertNull($fresh->fresh()->converted_opportunity_id);
    }

    public function test_P1_2_P1_12_migration_is_reversible_and_does_not_destroy_rows(): void
    {
        $unit = $this->unit('alpha-x');
        $director = $this->actingAsRole('unit_director', [$unit->id]);
        $product = $this->product($unit, $director);
        $phase = $this->postBms("products/{$product['id']}/phases", ['name' => 'Done', 'sequence' => 1, 'status' => 'completed'], $director)->json('data');
        $this->assertSame(100, $phase['progress']);

        $migration = new \AddBmsCompletionColumns();
        $migration->down();
        $this->assertFalse(Schema::hasColumn('product_phases', 'progress'));
        $this->assertFalse(Schema::hasColumn('bms_opportunities', 'bms_lead_id'));
        $this->assertFalse(Schema::hasColumn('bms_opportunities', 'sector'));
        $this->assertSame(1, DB::table('product_phases')->count(), 'Rows survive down().');

        $migration->up();
        $this->assertTrue(Schema::hasColumn('product_phases', 'progress'));
        $this->assertTrue(Schema::hasColumn('bms_opportunities', 'contact_email'));
        $this->assertSame(100, (int) DB::table('product_phases')->value('progress'), 'Completed phases are backfilled to 100.');
        $this->assertInstanceOf(Product::class, Product::find($product['id']));
    }
}
