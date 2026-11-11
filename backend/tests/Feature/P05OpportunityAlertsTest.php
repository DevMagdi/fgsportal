<?php

namespace Tests\Feature;

use App\Models\BMS\BmsAlert;
use App\Models\BMS\BusinessUnit;
use App\Models\BMS\Opportunity;
use App\Notifications\BmsNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Notification;
use Tests\BmsTestCase;

class P05OpportunityAlertsTest extends BmsTestCase
{
    protected function tearDown(): void
    {
        Carbon::setTestNow();
        parent::tearDown();
    }

    public function test_P0_5_alert_command_threshold_renotification_resolution_and_schedule(): void
    {
        Notification::fake();
        Carbon::setTestNow('2026-11-11 08:00:00');
        $coordinator = $this->actingAsRole('coordinator');
        $opportunity = $this->opportunity($coordinator->id, now()->copy()->subDays(6));
        $this->getBms('alerts', $coordinator)->assertOk()->assertJsonCount(0, 'data');
        $this->assertSame(0, BmsAlert::count());

        $opportunity->update(['last_update_at' => now()->copy()->subDays(7)]);
        $this->assertSame(0, Artisan::call('bms:generate-alerts'));
        $alert = BmsAlert::where('alert_type', 'no_update')->firstOrFail();
        $this->assertSame(1, $alert->occurrences);

        Artisan::call('bms:generate-alerts');
        $this->assertSame(1, $alert->fresh()->occurrences);
        Carbon::setTestNow(now()->addDays(3));
        Artisan::call('bms:generate-alerts');
        $this->assertSame(2, $alert->fresh()->occurrences);
        Notification::assertSentTo($coordinator, BmsNotification::class, function (BmsNotification $notification) use ($coordinator) {
            return $notification->via($coordinator) === ['database', 'mail']
                && $notification instanceof \Illuminate\Contracts\Queue\ShouldQueue;
        });

        $opportunity->update(['last_update_at' => now()]);
        Artisan::call('bms:generate-alerts');
        $this->assertNotNull($alert->fresh()->resolved_at);

        $event = collect(app(\Illuminate\Console\Scheduling\Schedule::class)->events())
            ->first(fn ($event) => str_contains($event->command, 'bms:generate-alerts'));
        $this->assertNotNull($event);
        $this->assertSame('0 7 * * *', $event->expression);
        $this->assertSame('Asia/Riyadh', $event->timezone);
        $this->assertTrue($event->withoutOverlapping);
    }

    public function test_P0_5_submission_date_delay_rule_and_owner_scoping(): void
    {
        Notification::fake();
        Carbon::setTestNow('2026-11-11 08:00:00');
        $coordinator = $this->actingAsRole('coordinator');
        $opportunity = $this->opportunity($coordinator->id, now());
        $opportunity->update([
            'stage' => 'proposal', 'submission_date' => today()->subDay(),
            'expected_close_date' => today()->addMonth(),
        ]);
        Artisan::call('bms:generate-alerts');
        $this->assertDatabaseHas('bms_alerts', [
            'bms_opportunity_id' => $opportunity->id, 'alert_type' => 'delayed',
        ]);

        $outsider = $this->actingAsRole('coordinator');
        $this->getBms('alerts', $outsider)->assertOk()->assertJsonCount(0, 'data');
        $this->putBms('alerts/'.BmsAlert::firstOrFail()->id.'/read', [], $outsider)->assertForbidden();
    }

    private function opportunity(int $ownerId, Carbon $updatedAt): Opportunity
    {
        return Opportunity::create([
            'reference' => 'ALERT-'.\Illuminate\Support\Str::random(8),
            'title' => 'Follow-up test', 'client_name' => 'Client', 'type' => 'tender',
            'business_unit_id' => BusinessUnit::where('slug', 'alpha-x')->firstOrFail()->id,
            'owner_id' => $ownerId, 'created_by' => $ownerId,
            'stage' => 'qualification', 'expected_close_date' => today()->addMonth(),
            'last_update_at' => $updatedAt,
        ]);
    }
}
