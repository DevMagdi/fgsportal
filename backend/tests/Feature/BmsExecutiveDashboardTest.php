<?php

namespace Tests\Feature;

use App\Models\BMS\BusinessUnit;
use App\Models\Product;
use Carbon\Carbon;
use Tests\BmsTestCase;

class BmsExecutiveDashboardTest extends BmsTestCase
{
    public function test_global_view_uses_seeded_unit_records_and_does_not_double_count_shared_products(): void
    {
        $executive = $this->actingAsRole('executive');
        $unitX = BusinessUnit::where('slug', 'alpha-x')->firstOrFail();
        $unitGen = BusinessUnit::where('slug', 'alpha-gen')->firstOrFail();
        $shared = Product::create(['product_name' => 'Dashboard shared product']);
        $shared->businessUnits()->sync([$unitX->id, $unitGen->id]);

        $response = $this->getBms('executive-dashboard', $executive)->assertOk();
        $units = $response->json('data.unit_progress');
        $names = array_column($units, 'name');

        $this->assertEqualsCanonicalizing(
            ['Alpha Iota', 'Alpha X', 'Alpha Gen', 'Alpha Omega', 'Alpha Delta'],
            $names
        );
        $products = $response->json('data.products');
        $productIds = array_map('intval', array_column($products, 'id'));
        $this->assertSame(count($products), $response->json('data.summary.products'));
        $this->assertCount(count(array_unique($productIds)), $productIds);
        $this->assertSame(1, count(array_filter($products, function ($product) use ($shared) {
            return (int) $product['id'] === (int) $shared->id;
        })));
    }

    public function test_unit_dashboard_filters_to_membership_and_rejects_cross_unit_switches(): void
    {
        $unit = BusinessUnit::where('slug', 'alpha-x')->firstOrFail();
        $otherUnit = BusinessUnit::where('slug', 'alpha-gen')->firstOrFail();
        $director = $this->actingAsRole('unit_director', [$unit->id]);

        $plan = $this->postBms('weekly-plans', [
            'business_unit_id' => $unit->id,
            'week_start' => now()->startOfWeek(Carbon::SUNDAY)->toDateString(),
        ], $director)->assertCreated()->json('data');
        $this->postBms("weekly-plans/{$plan['id']}/tasks", [
            'title' => 'Dashboard scope verification',
            'owner_id' => $director->id,
            'status' => 'achieved',
        ], $director)->assertCreated();

        $lookups = $this->getBms('lookups', $director)->assertOk()->json('data.units');
        $visibleUnitIds = array_map('intval', array_column($lookups, 'id'));
        $this->assertContains((int) $unit->id, $visibleUnitIds);
        $this->assertNotContains((int) $otherUnit->id, $visibleUnitIds);

        $dashboard = $this->getBms('executive-dashboard?business_unit_id='.$unit->id, $director)->assertOk();
        $this->assertSame(1, $dashboard->json('data.summary.tasks'));
        $this->assertSame(1, $dashboard->json('data.summary.achieved'));
        $this->assertSame($unit->id, $dashboard->json('data.unit_progress.0.id'));

        $this->getBms('executive-dashboard?business_unit_id='.$otherUnit->id, $director)->assertForbidden();
    }
}
