<?php

namespace Tests\Feature;

use App\Models\BMS\BmsAlert;
use App\Models\BMS\BusinessUnit;
use App\Models\BMS\Opportunity;
use Tests\BmsTestCase;

class P03OpportunityDecisionTest extends BmsTestCase
{
    public function test_P0_3_alpha_delta_decides_across_units_with_history_alerts_and_audit(): void
    {
        $operations = $this->actingAsRole('operations');
        $deltaDirector = $this->makeUser();
        $deltaDirector->bmsRoles()->attach(\App\Models\BMS\BmsRole::where('slug', 'alpha_delta')->firstOrFail());
        $unit = BusinessUnit::where('slug', 'alpha-x')->firstOrFail();
        BusinessUnit::where('slug', 'alpha-delta')->firstOrFail()->users()->attach($deltaDirector);

        $created = $this->postBms('opportunities', $this->payload($unit->id, $operations->id), $operations)
            ->assertCreated()->json('data');
        $this->assertDatabaseHas('bms_alerts', [
            'bms_opportunity_id' => $created['id'], 'user_id' => $deltaDirector->id,
            'alert_type' => 'decision_request',
        ]);

        $this->getBms('opportunities?go_no_go=pending', $deltaDirector)
            ->assertOk()->assertJsonCount(1, 'data');
        $this->getBms('opportunities/'.$created['id'], $deltaDirector)->assertOk();
        $this->putBms('opportunities/'.$created['id'], ['title' => 'Not allowed'], $deltaDirector)
            ->assertForbidden();
        $this->postBms('opportunities/'.$created['id'].'/decision', ['decision' => 'no_go', 'reason' => 'x'], $deltaDirector)
            ->assertStatus(422);

        $this->postBms('opportunities/'.$created['id'].'/decision', [
            'decision' => 'no_go', 'reason' => 'Outside our delivery capability',
        ], $deltaDirector)->assertOk()
            ->assertJsonPath('data.go_no_go', 'no_go')
            ->assertJsonPath('data.stage', 'declined');

        $this->assertDatabaseHas('bms_opportunity_stage_histories', [
            'bms_opportunity_id' => $created['id'], 'to_stage' => 'declined',
            'changed_by' => $deltaDirector->id,
        ]);
        $this->assertDatabaseHas('bms_audit_logs', [
            'auditable_id' => $created['id'], 'event' => 'opportunity.go_no_go',
            'user_id' => $deltaDirector->id,
        ]);
        $this->assertDatabaseHas('bms_alerts', [
            'bms_opportunity_id' => $created['id'], 'user_id' => $operations->id,
            'alert_type' => 'decision',
        ]);

        $this->postBms('opportunities/'.$created['id'].'/decision', [
            'decision' => 'go', 'reason' => 'Changed our mind',
        ], $deltaDirector)->assertStatus(422);
    }

    public function test_P0_3_operations_cannot_decide_and_outsider_cannot_read_unrelated_records(): void
    {
        $operations = $this->actingAsRole('operations');
        $opportunity = Opportunity::create($this->payload(
            BusinessUnit::where('slug', 'alpha-gen')->firstOrFail()->id,
            $operations->id
        ) + ['reference' => 'DECIDE-403', 'created_by' => $operations->id, 'last_update_at' => now()]);
        $this->postBms('opportunities/'.$opportunity->id.'/decision', [
            'decision' => 'go', 'reason' => 'Valid reason',
        ], $operations)->assertForbidden();

        $director = $this->actingAsRole('unit_director', [BusinessUnit::where('slug', 'alpha-x')->firstOrFail()->id]);
        $this->getBms('opportunities/'.$opportunity->id, $director)->assertForbidden();
    }

    public function test_P0_3_no_go_configuration_and_every_closed_stage_are_enforced(): void
    {
        config(['bms.no_go_sets_declined' => false]);
        $operations = $this->actingAsRole('operations');
        $delta = $this->actingAsRole('alpha_delta');
        $unit = BusinessUnit::where('slug', 'alpha-x')->firstOrFail();
        $opportunity = Opportunity::create($this->payload($unit->id, $operations->id) + [
            'reference' => 'CONFIG-NO-GO', 'created_by' => $operations->id, 'last_update_at' => now(),
        ]);
        $this->postBms('opportunities/'.$opportunity->id.'/decision', [
            'decision' => 'no_go', 'reason' => 'Configurable decision',
        ], $delta)->assertOk()->assertJsonPath('data.stage', 'review');

        foreach (['won', 'lost', 'declined'] as $stage) {
            $closed = Opportunity::create($this->payload($unit->id, $operations->id) + [
                'reference' => 'CLOSED-'.$stage, 'stage' => $stage,
                'created_by' => $operations->id, 'last_update_at' => now(),
            ]);
            $closed->update(['stage' => $stage]);
            $this->postBms('opportunities/'.$closed->id.'/decision', [
                'decision' => 'go', 'reason' => 'Closed records are immutable',
            ], $delta)->assertStatus(422);
        }
    }

    private function payload(int $unitId, int $ownerId): array
    {
        return [
            'title' => 'Cross-unit RFP', 'client_name' => 'Government client', 'type' => 'project',
            'business_unit_id' => $unitId, 'owner_id' => $ownerId,
            'stage' => 'review', 'expected_close_date' => '2026-12-20',
        ];
    }
}
