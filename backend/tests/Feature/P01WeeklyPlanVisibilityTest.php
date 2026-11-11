<?php

namespace Tests\Feature;

use App\Models\BMS\BusinessUnit;
use App\Models\BMS\UnitTask;
use App\Models\BMS\WeeklyPlan;
use Tests\BmsTestCase;

class P01WeeklyPlanVisibilityTest extends BmsTestCase
{
    public function test_P0_1_coordinator_executive_director_and_employee_use_visible_unit_scope(): void
    {
        $week = '2026-11-08';
        $units = BusinessUnit::whereNotNull('parent_id')->get();
        foreach ($units as $unit) {
            WeeklyPlan::create([
                'business_unit_id' => $unit->id,
                'week_start' => $week,
                'created_by' => $this->makeUser()->id,
            ]);
        }

        $coordinator = $this->actingAsRole('coordinator');
        $this->getBms('weekly-plans', $coordinator)
            ->assertOk()
            ->assertJsonCount(4, 'data');

        $directorUnit = $units->first();
        $director = $this->actingAsRole('unit_director');
        $directorUnit->update(['director_id' => $director->id]);
        $this->getBms('weekly-plans', $director)
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.business_unit_id', $directorUnit->id);
        $outside = $units->last();
        $this->getBms('weekly-plans/'.$outside->weeklyPlans()->first()->id, $director)
            ->assertForbidden();

        $employeeUnit = $units[1];
        $employee = $this->actingAsRole('employee', [$employeeUnit->id]);
        $this->getBms('weekly-plans', $employee)
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $executive = $this->actingAsRole('executive');
        $this->getBms('weekly-plans', $executive)->assertOk()->assertJsonCount(4, 'data');

        $finance = $this->actingAsRole('finance');
        $this->getBms('weekly-plans', $finance)->assertForbidden();
    }

    public function test_P0_1_plan_validation_locking_and_audit_remain_enforced(): void
    {
        $unit = BusinessUnit::where('slug', 'alpha-gen')->firstOrFail();
        $director = $this->actingAsRole('unit_director', [$unit->id]);
        $response = $this->postBms('weekly-plans', [
            'business_unit_id' => $unit->id,
            'week_start' => '2026-11-09',
        ], $director);
        $response->assertStatus(422);

        $planResponse = $this->postBms('weekly-plans', [
            'business_unit_id' => $unit->id,
            'week_start' => '2026-11-08',
        ], $director)->assertCreated();
        $planId = $planResponse->json('data.id');
        $this->assertDatabaseHas('bms_audit_logs', [
            'auditable_id' => $planId,
            'event' => 'weekly_plan.created',
            'user_id' => $director->id,
        ]);

        $this->postBms('weekly-plans/'.$planId.'/tasks', [
            'title' => 'Task', 'owner_id' => $director->id, 'status' => 'achieved',
        ], $director)->assertCreated();
        $this->assertSame(today()->toDateString(), UnitTask::where('weekly_plan_id', $planId)->firstOrFail()->completion_date->toDateString());

        $this->postBms('weekly-plans/'.$planId.'/submit', [], $director)->assertOk();
        $this->putBms('weekly-plans/'.$planId, ['objectives' => 'Changed'], $director)->assertStatus(422);
        $this->assertNotNull(UnitTask::where('weekly_plan_id', $planId)->first()->completion_date);
    }
}
