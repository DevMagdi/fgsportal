<?php

namespace Tests\Feature;

use App\Models\BMS\BusinessUnit;
use App\Models\BMS\HiringRequest;
use App\Models\BMS\WeeklyPlan;
use App\Notifications\BmsNotification;
use App\Services\BMS\BmsNotifier;
use Illuminate\Support\Facades\Notification;
use Tests\BmsTestCase;

class P06NotificationRoutingTest extends BmsTestCase
{
    public function test_P0_6_recruitment_and_support_route_to_correct_recipients_with_audit(): void
    {
        Notification::fake();
        $coordinator = $this->actingAsRole('coordinator');
        $director = $this->actingAsRole('unit_director');
        $unit = BusinessUnit::where('slug', 'alpha-x')->firstOrFail();
        $director->businessUnits()->attach($unit->id);
        $outsider = $this->actingAsRole('employee');
        $itUser = $this->actingAsRole('it', [], ['sub_departments_id' => 3]);

        $this->postBms('recruitment', [
            'business_unit_id' => $unit->id, 'job_title' => 'Engineer', 'specification' => 'Required',
        ], $director)->assertCreated();
        Notification::assertSentTo($coordinator, BmsNotification::class);
        Notification::assertNotSentTo($outsider, BmsNotification::class);
        $this->assertDatabaseHas('bms_audit_logs', ['event' => 'hiring.submitted']);

        $plan = WeeklyPlan::create([
            'business_unit_id' => $unit->id, 'week_start' => '2026-11-08',
            'created_by' => $director->id, 'status' => 'draft',
        ]);
        $this->postBms("weekly-plans/{$plan->id}/support-requests", [
            'department_id' => 3, 'title' => 'Laptop', 'details' => 'Required',
        ], $director)->assertCreated();
        Notification::assertSentTo($itUser, BmsNotification::class);
    }

    public function test_P0_6_notifications_are_unread_paginated_and_owner_only(): void
    {
        Notification::fake();
        $user = $this->actingAsRole('employee');
        $other = $this->actingAsRole('employee');
        app(BmsNotifier::class)->notify([$user], 'support.responded', 'Update', 'Response ready');
        $notification = $user->notifications()->firstOrFail();
        $this->assertSame(['database', 'mail'], $notification->via($user));
        $this->assertTrue($notification instanceof \Illuminate\Contracts\Queue\ShouldQueue);

        $this->getBms('notifications', $user)->assertOk()->assertJsonPath('data.total', 1);
        $this->putBms("notifications/{$notification->id}/read", [], $other)->assertNotFound();
        $this->putBms("notifications/{$notification->id}/read", [], $user)->assertOk();
        $this->assertNotNull($notification->fresh()->read_at);
    }

    public function test_P0_6_dispatch_failure_does_not_break_business_http_request(): void
    {
        $director = $this->actingAsRole('unit_director');
        $unit = BusinessUnit::where('slug', 'alpha-x')->firstOrFail();
        $director->businessUnits()->attach($unit->id);
        Notification::shouldReceive('send')->andThrow(new \RuntimeException('Mail unavailable'));

        $this->postBms('recruitment', [
            'business_unit_id' => $unit->id, 'job_title' => 'Engineer', 'specification' => 'Required',
        ], $director)->assertCreated();
        $this->assertDatabaseHas('bms_hiring_requests', ['job_title' => 'Engineer']);
    }
}
