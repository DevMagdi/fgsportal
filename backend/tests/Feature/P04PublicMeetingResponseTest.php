<?php

namespace Tests\Feature;

use App\Models\BMS\Meeting;
use App\Models\BMS\MeetingAttendee;
use Tests\BmsTestCase;

class P04PublicMeetingResponseTest extends BmsTestCase
{
    public function test_P0_4_get_never_mutates_post_records_safely_and_expired_tokens_fail(): void
    {
        $attendee = $this->invitation('<script>alert(1)</script>');
        $this->get('/bms/meeting-response/'.$attendee->response_token.'/declined')
            ->assertOk()
            ->assertDontSee('<script>alert(1)</script>', false)
            ->assertSee('&lt;script&gt;alert(1)&lt;/script&gt;', false);
        $this->assertSame('pending', $attendee->fresh()->response);

        $this->post('/bms/meeting-response/'.$attendee->response_token, ['response' => 'accepted'])
            ->assertOk()->assertSee('Response recorded');
        $this->assertSame('accepted', $attendee->fresh()->response);
        $this->assertNotNull($attendee->fresh()->response_recorded_at);
        $this->assertDatabaseHas('bms_audit_logs', [
            'auditable_id' => $attendee->id, 'event' => 'meeting.public_response_recorded',
        ]);

        $this->post('/bms/meeting-response/'.$attendee->response_token, ['response' => 'tentative'])->assertOk();
        $this->assertSame('tentative', $attendee->fresh()->response);
        $this->postJson('/bms/meeting-response/'.$attendee->response_token, ['response' => 'invalid'])->assertStatus(422);
        $this->get('/bms/meeting-response/not-a-token')->assertNotFound();

        $expired = $this->invitation('Expired', true);
        $this->get('/bms/meeting-response/'.$expired->response_token)->assertStatus(410);
    }

    public function test_P0_4_public_endpoint_is_throttled_and_internal_response_is_owner_only(): void
    {
        $attendee = $this->invitation('Throttled');
        for ($attempt = 0; $attempt < 20; $attempt++) {
            $this->get('/bms/meeting-response/'.$attendee->response_token)->assertOk();
        }
        $this->get('/bms/meeting-response/'.$attendee->response_token)->assertStatus(429);

        $other = $this->actingAsRole('employee');
        $this->putBms('meeting-attendees/'.$attendee->id.'/response', ['response' => 'accepted'], $other)
            ->assertForbidden();
    }

    private function invitation(string $title, bool $expired = false): MeetingAttendee
    {
        $owner = $this->makeUser();
        $meeting = Meeting::create([
            'title' => $title,
            'starts_at' => $expired ? now()->subDays(3) : now()->addDay(),
            'ends_at' => $expired ? now()->subDays(3)->addHour() : now()->addDay()->addHour(),
            'created_by' => $owner->id,
            'status' => 'scheduled',
        ]);

        return $meeting->attendees()->create([
            'user_id' => $this->makeUser()->id,
            'response_token' => \Illuminate\Support\Str::random(64),
        ]);
    }
}
