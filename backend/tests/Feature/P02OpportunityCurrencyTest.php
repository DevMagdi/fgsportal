<?php

namespace Tests\Feature;

use App\Models\BMS\BusinessUnit;
use App\Models\BMS\Opportunity;
use Tests\BmsTestCase;

class P02OpportunityCurrencyTest extends BmsTestCase
{
    public function test_P0_2_api_and_import_apply_sar_without_rewriting_existing_rows(): void
    {
        $operations = $this->actingAsRole('operations');
        $unit = BusinessUnit::where('slug', 'alpha-x')->firstOrFail();
        $existing = Opportunity::create($this->payload($unit->id, $operations->id) + [
            'reference' => 'LEGACY-EGP', 'currency' => 'EGP', 'created_by' => $operations->id,
            'last_update_at' => now(),
        ]);

        require_once base_path('database/migrations/2026_11_11_000003_use_configured_opportunity_currency_default.php');
        $migration = new \UseConfiguredOpportunityCurrencyDefault();
        $migration->up();
        $this->assertSame('EGP', $existing->fresh()->currency);
        $migration->down();

        $payload = $this->payload($unit->id, $operations->id);
        $this->postBms('opportunities', $payload, $operations)
            ->assertCreated()
            ->assertJsonPath('data.currency', 'SAR');
        $this->assertDatabaseHas('bms_audit_logs', ['event' => 'opportunity.created', 'user_id' => $operations->id]);

        $this->postBms('opportunities/import', ['rows' => [$payload + ['reference' => 'IMPORT-SAR']]], $operations)
            ->assertOk()
            ->assertJsonPath('data.created', 1);
        $this->assertSame('SAR', Opportunity::where('reference', 'IMPORT-SAR')->firstOrFail()->currency);
        $this->assertSame('EGP', $existing->fresh()->currency);
    }

    public function test_P0_2_invalid_currency_permission_and_cross_unit_writes_are_rejected(): void
    {
        $operations = $this->actingAsRole('operations');
        $unit = BusinessUnit::where('slug', 'alpha-gen')->firstOrFail();
        $payload = $this->payload($unit->id, $operations->id) + ['currency' => 'BTC'];
        $this->postBms('opportunities', $payload, $operations)->assertStatus(422);

        $employee = $this->actingAsRole('employee', [$unit->id]);
        $this->postBms('opportunities', $this->payload($unit->id, $employee->id), $employee)->assertForbidden();

        $otherUnit = BusinessUnit::where('slug', 'alpha-delta')->firstOrFail();
        $director = $this->actingAsRole('unit_director', [$otherUnit->id]);
        $scopedEditor = \App\Models\BMS\BmsRole::create([
            'name' => 'Scoped opportunity editor', 'slug' => 'scoped_opportunity_editor',
            'abilities' => ['opportunities.manage', 'opportunities.view'],
        ]);
        $director->bmsRoles()->attach($scopedEditor);
        $this->postBms('opportunities', $this->payload($unit->id, $director->id), $director)->assertForbidden();
    }

    private function payload(int $unitId, int $ownerId): array
    {
        return [
            'title' => 'Data platform', 'client_name' => 'Client', 'type' => 'tender',
            'business_unit_id' => $unitId, 'owner_id' => $ownerId,
            'stage' => 'qualification', 'expected_close_date' => '2026-12-01',
        ];
    }
}
