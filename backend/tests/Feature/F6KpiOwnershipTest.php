<?php

namespace Tests\Feature;

use App\Models\BMS\BmsAuditLog;
use App\Models\BMS\BusinessUnit;
use App\Models\BMS\UnitKpi;
use App\Models\User;
use Tests\BmsTestCase;

/** F6: an existing KPI is authorized by its persisted unit, not only the payload. */
class F6KpiOwnershipTest extends BmsTestCase
{
    public function test_unit_director_cannot_update_another_units_kpi_or_move_a_kpi_out_of_scope(): void
    {
        $unitA = $this->makeUnit(['name' => 'F6 Unit A']);
        $unitB = $this->makeUnit(['name' => 'F6 Unit B']);
        $director = $this->actingAsRole('unit_director', [$unitA->id]);
        $unitA->update(['director_id' => $director->id]);
        $owner = $this->makeUser();

        $foreignKpi = $this->makeKpi($unitB, $owner);
        $ownKpi = $this->makeKpi($unitA, $owner);
        $foreignBefore = $foreignKpi->fresh()->getAttributes();
        $ownBefore = $ownKpi->fresh()->getAttributes();
        $auditCount = BmsAuditLog::count();

        // The payload names the director's own unit, but the ID belongs to B.
        $this->postBms('reports/kpis', $this->payload($foreignKpi, $unitA->id), $director)
            ->assertForbidden();
        $this->assertSame($foreignBefore, $foreignKpi->fresh()->getAttributes());

        // The reverse attempt must also remain blocked by destination scope.
        $this->postBms('reports/kpis', $this->payload($ownKpi, $unitB->id), $director)
            ->assertForbidden();
        $this->assertSame($ownBefore, $ownKpi->fresh()->getAttributes());

        $this->assertSame($auditCount, BmsAuditLog::count());
        $this->assertDatabaseHas('bms_unit_kpis', [
            'id' => $foreignKpi->id,
            'business_unit_id' => $unitB->id,
            'name' => 'Original KPI',
            'actual' => 25,
        ]);
        $this->assertDatabaseHas('bms_unit_kpis', [
            'id' => $ownKpi->id,
            'business_unit_id' => $unitA->id,
            'name' => 'Original KPI',
            'actual' => 25,
        ]);
    }

    public function test_unit_director_can_update_a_kpi_in_their_own_unit(): void
    {
        $unit = $this->makeUnit();
        $director = $this->actingAsRole('unit_director', [$unit->id]);
        $unit->update(['director_id' => $director->id]);
        $kpi = $this->makeKpi($unit, $director);

        $this->postBms('reports/kpis', $this->payload($kpi, $unit->id), $director)
            ->assertOk()
            ->assertJsonPath('data.id', $kpi->id);

        $this->assertDatabaseHas('bms_unit_kpis', [
            'id' => $kpi->id,
            'business_unit_id' => $unit->id,
            'name' => 'Updated KPI',
            'actual' => 75,
            'updated_by' => $director->id,
        ]);
        $this->assertSame(1, UnitKpi::count());
        $this->assertDatabaseHas('bms_audit_logs', [
            'event' => 'unit_kpi.saved',
            'auditable_id' => $kpi->id,
            'user_id' => $director->id,
        ]);
    }

    /** @dataProvider authorizedGlobalRoles */
    public function test_authorized_global_roles_retain_cross_unit_kpi_behavior(string $role): void
    {
        $unitA = $this->makeUnit();
        $unitB = $this->makeUnit();
        $globalUser = $this->actingAsRole($role);
        $owner = $this->makeUser();
        $kpi = $this->makeKpi($unitB, $owner);

        $this->postBms('reports/kpis', $this->payload($kpi, $unitA->id), $globalUser)
            ->assertOk()
            ->assertJsonPath('data.id', $kpi->id);

        $this->assertDatabaseHas('bms_unit_kpis', [
            'id' => $kpi->id,
            'business_unit_id' => $unitA->id,
            'name' => 'Updated KPI',
            'actual' => 75,
            'updated_by' => $globalUser->id,
        ]);
        $this->assertSame(1, UnitKpi::count());
    }

    public function test_unit_director_can_still_create_kpis_with_absent_or_null_id(): void
    {
        $unit = $this->makeUnit();
        $director = $this->actingAsRole('unit_director', [$unit->id]);
        $owner = $this->makeUser();
        $template = $this->makeKpi($unit, $owner);

        $payload = $this->payload($template, $unit->id);
        unset($payload['id']);
        $first = $this->postBms('reports/kpis', $payload + ['name' => 'Created without ID'], $director)
            ->assertOk()->json('data.id');

        $second = $this->postBms('reports/kpis', array_merge($payload, [
            'id' => null,
            'name' => 'Created with null ID',
        ]), $director)->assertOk()->json('data.id');

        foreach ([$first, $second] as $id) {
            $this->assertDatabaseHas('bms_unit_kpis', [
                'id' => $id,
                'business_unit_id' => $unit->id,
                'actual' => 75,
                'updated_by' => $director->id,
            ]);
        }
        $this->assertSame(3, UnitKpi::count());
        $this->assertSame(2, BmsAuditLog::where('event', 'unit_kpi.saved')->count());
    }

    public function authorizedGlobalRoles(): array
    {
        return [
            'system administrator' => ['system_admin'],
            'coordinator' => ['coordinator'],
            'PR and marketing' => ['pr_marketing'],
        ];
    }

    private function makeKpi(BusinessUnit $unit, User $owner): UnitKpi
    {
        return UnitKpi::create([
            'business_unit_id' => $unit->id,
            'name' => 'Original KPI',
            'target' => 100,
            'actual' => 25,
            'unit_label' => '%',
            'frequency' => 'monthly',
            'description' => 'Original description',
            'owner_id' => $owner->id,
            'period_start' => '2026-11-01',
            'period_end' => '2026-11-30',
            'updated_by' => $owner->id,
        ]);
    }

    private function payload(UnitKpi $kpi, int $unitId): array
    {
        return [
            'id' => $kpi->id,
            'business_unit_id' => $unitId,
            'name' => 'Updated KPI',
            'target' => 200,
            'actual' => 75,
            'unit_label' => '%',
            'frequency' => 'quarterly',
            'description' => 'Updated description',
            'owner_id' => $kpi->owner_id,
            'period_start' => '2026-11-01',
            'period_end' => '2026-12-31',
        ];
    }
}
