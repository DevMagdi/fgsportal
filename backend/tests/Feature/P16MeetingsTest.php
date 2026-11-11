<?php

namespace Tests\Feature;

use App\Models\BMS\Meeting;
use App\Services\BMS\MeetingInvitations;
use Tests\BmsTestCase;

class P16MeetingsTest extends BmsTestCase
{
    private function transport()
    {
        return app('mailer')->getSwiftMailer()->getTransport();
    }

    private function mailsTo(string $email, string $subjectPart): int
    {
        return collect($this->transport()->messages())->filter(fn($m) => array_key_exists($email, (array) $m->getTo())
            && str_contains($m->getSubject(), $subjectPart))->count();
    }

    private function createMeeting(string $title = 'Weekly sync'): array
    {
        $unit = $this->makeUnit();
        $director = $this->actingAsRole('unit_director', [$unit->id], ['email' => 'director@example.test']);
        $a = $this->makeUser(['email' => 'a@example.test']);
        $b = $this->makeUser(['email' => 'b@example.test']);
        $id = $this->postBms('meetings', [
            'title' => $title, 'business_unit_id' => $unit->id,
            'starts_at' => '2026-11-15 09:00:00', 'ends_at' => '2026-11-15 10:00:00', 'location' => 'Room 1',
            'attendees' => [['user_id' => $a->id], ['user_id' => $b->id], ['external_name' => 'Guest', 'external_email' => 'guest@example.test']],
        ], $director)->assertCreated()->json('data.id');
        return [Meeting::find($id), $director, $a, $b];
    }

    public function test_P1_6_ics_has_organizer_attendees_sequence_and_stable_uid(): void
    {
        [$meeting, $director, $a] = $this->createMeeting('اجتماع المتابعة الأسبوعي للوحدة والمنتجات والعملاء والشركاء');
        $meeting->attendees()->where('user_id', $a->id)->update(['response' => 'accepted']);
        $ics = app(MeetingInvitations::class)->ics($meeting->fresh());

        $this->assertStringContainsString('METHOD:REQUEST', $ics);
        $this->assertStringContainsString('UID:bms-meeting-'.$meeting->id.'@alphaiota', $ics);
        $this->assertStringContainsString('SEQUENCE:0', $ics);
        $this->assertStringContainsString('mailto:director@example.test', $ics);
        $this->assertStringContainsString('PARTSTAT=ACCEPTED', $ics);
        $this->assertStringContainsString('mailto:guest@example.test', $ics);
        $this->assertSame(3, substr_count($ics, 'ATTENDEE;'));
        foreach (explode("\r\n", $ics) as $line) {
            $this->assertLessThanOrEqual(75, strlen($line));
            $this->assertTrue(mb_check_encoding($line, 'UTF-8'));
        }
        $this->assertStringContainsString('METHOD:CANCEL', app(MeetingInvitations::class)->ics($meeting, 'CANCEL'));
    }

    public function test_P1_6_reschedule_bumps_sequence_keeps_responses_and_resends_to_everyone(): void
    {
        [$meeting, $director, $a, $b] = $this->createMeeting();
        $row = $meeting->attendees()->where('user_id', $a->id)->first();
        $row->update(['response' => 'accepted']);

        $this->putBms('meetings/'.$meeting->id, ['starts_at' => '2026-11-15 11:00:00', 'ends_at' => '2026-11-15 12:00:00'], $director)->assertOk();

        $this->assertSame(1, (int) $meeting->fresh()->sequence);
        $this->assertSame('accepted', $row->fresh()->response);
        $this->assertSame($row->id, $meeting->attendees()->where('user_id', $a->id)->value('id'));
        $this->assertSame(1, $this->mailsTo('a@example.test', 'invitation'));
        $this->assertSame(1, $this->mailsTo('guest@example.test', 'invitation'));
    }

    public function test_P1_6_attendee_diff_cancels_removed_and_invites_only_added(): void
    {
        [$meeting, $director, $a, $b] = $this->createMeeting();
        $keep = $meeting->attendees()->where('user_id', $a->id)->first();
        $keep->update(['response' => 'tentative']);
        $c = $this->makeUser(['email' => 'c@example.test']);

        $this->putBms('meetings/'.$meeting->id, ['attendees' => [['user_id' => $a->id], ['user_id' => $c->id]]], $director)->assertOk();

        $this->assertSame('tentative', $keep->fresh()->response);
        $this->assertSame(2, $meeting->attendees()->count());
        $this->assertSame(1, $this->mailsTo('b@example.test', 'cancelled'));
        $this->assertSame(1, $this->mailsTo('c@example.test', 'invitation'));
        $this->assertSame(0, $this->mailsTo('a@example.test', 'invitation'));
        $this->assertSame(0, (int) $meeting->fresh()->sequence);
    }

    public function test_P1_6_cancel_notifies_attendees_and_blocks_further_changes(): void
    {
        [$meeting, $director, $a] = $this->createMeeting();
        $this->postBms('meetings/'.$meeting->id.'/cancel', [], $director)->assertOk()->assertJsonPath('data.status', 'cancelled');
        $this->assertSame(1, (int) $meeting->fresh()->sequence);
        $this->assertSame(1, $this->mailsTo('a@example.test', 'cancelled'));
        $this->assertSame(1, $this->mailsTo('guest@example.test', 'cancelled'));
        $this->assertDatabaseHas('bms_audit_logs', ['auditable_id' => $meeting->id, 'event' => 'meeting.cancelled']);

        $this->postBms('meetings/'.$meeting->id.'/cancel', [], $director)->assertStatus(422);
        $this->putBms('meetings/'.$meeting->id, ['title' => 'x'], $director)->assertStatus(422);
        $this->postBms('meetings/'.$meeting->id.'/invite', [], $director)->assertStatus(422);

        $employee = $this->actingAsRole('employee');
        $this->postBms('meetings/'.$meeting->id.'/cancel', [], $employee)->assertForbidden();
    }

    public function test_P1_6_migration_is_reversible(): void
    {
        require_once database_path('migrations/2026_11_12_000008_add_bms_meeting_sequence.php');
        $m = new \AddBmsMeetingSequence();
        $m->down();
        $this->assertFalse(\Schema::hasColumn('bms_meetings', 'sequence'));
        $m->up();
        $this->assertTrue(\Schema::hasColumn('bms_meetings', 'sequence'));
    }
}
