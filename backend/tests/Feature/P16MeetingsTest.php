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

    public function test_P1_6_attendee_diff_adds_only_the_new_attendee(): void
    {
        [$meeting, $director, $a, $b] = $this->createMeeting();
        $c = $this->makeUser(['email' => 'c@example.test']);

        $this->putBms('meetings/'.$meeting->id, ['attendees' => [
            ['user_id' => $a->id], ['user_id' => $b->id],
            ['external_name' => 'Guest', 'external_email' => 'guest@example.test'],
            ['user_id' => $c->id],
        ]], $director)->assertOk();

        $this->assertSame(4, $meeting->attendees()->count());
        $this->assertDatabaseHas('bms_meeting_attendees', ['bms_meeting_id' => $meeting->id, 'user_id' => $c->id]);
        $this->assertSame(1, $this->mailsTo('c@example.test', 'invitation'));
        $this->assertSame(0, $this->mailsTo('a@example.test', 'invitation'));
        $this->assertSame(0, $this->mailsTo('b@example.test', 'invitation'));
        $this->assertSame(0, $this->mailsTo('guest@example.test', 'invitation'));
    }

    public function test_P1_6_attendee_diff_removes_and_cancels_only_the_removed_attendee(): void
    {
        [$meeting, $director, $a, $b] = $this->createMeeting();

        $this->putBms('meetings/'.$meeting->id, ['attendees' => [
            ['user_id' => $a->id],
            ['external_name' => 'Guest', 'external_email' => 'guest@example.test'],
        ]], $director)->assertOk();

        $this->assertSame(2, $meeting->attendees()->count());
        $this->assertDatabaseMissing('bms_meeting_attendees', ['bms_meeting_id' => $meeting->id, 'user_id' => $b->id]);
        $this->assertSame(1, $this->mailsTo('b@example.test', 'cancelled'));
        $this->assertSame(0, $this->mailsTo('a@example.test', 'cancelled'));
        $this->assertSame(0, $this->mailsTo('guest@example.test', 'cancelled'));
    }

    public function test_P1_6_unchanged_attendees_keep_rows_responses_and_timestamps_without_mail(): void
    {
        [$meeting, $director, $a, $b] = $this->createMeeting();
        $attendees = $meeting->attendees()->get();
        $rowIds = $attendees->pluck('id')->all();
        $oldTimestamp = now()->subDay()->startOfSecond();
        foreach ($attendees as $attendee) {
            $attendee->response = $attendee->user_id === $a->id ? 'tentative' : 'pending';
            $attendee->updated_at = $oldTimestamp;
            $attendee->save();
        }

        $this->putBms('meetings/'.$meeting->id, ['attendees' => [
            ['user_id' => $a->id], ['user_id' => $b->id],
            ['external_name' => 'Guest', 'external_email' => 'guest@example.test'],
        ]], $director)->assertOk();

        $this->assertSame($rowIds, $meeting->attendees()->orderBy('id')->pluck('id')->all());
        $this->assertSame('tentative', $meeting->attendees()->where('user_id', $a->id)->value('response'));
        $this->assertSame($oldTimestamp->toDateTimeString(), $meeting->attendees()->where('user_id', $a->id)->value('updated_at'));
        $this->assertSame(0, $this->mailsTo('a@example.test', 'invitation'));
        $this->assertSame(0, $this->mailsTo('b@example.test', 'invitation'));
        $this->assertSame(0, $this->mailsTo('guest@example.test', 'invitation'));
    }

    public function test_P1_6_empty_attendee_list_removes_and_cancels_everyone(): void
    {
        [$meeting, $director, $a, $b] = $this->createMeeting();

        $this->putBms('meetings/'.$meeting->id, ['attendees' => []], $director)->assertOk();

        $this->assertSame(0, $meeting->attendees()->count());
        $this->assertSame(1, $this->mailsTo('a@example.test', 'cancelled'));
        $this->assertSame(1, $this->mailsTo('b@example.test', 'cancelled'));
        $this->assertSame(1, $this->mailsTo('guest@example.test', 'cancelled'));
    }

    public function test_P1_6_duplicate_submitted_attendees_collapse_by_existing_identity_key(): void
    {
        [$meeting, $director] = $this->createMeeting();
        $c = $this->makeUser(['email' => 'c@example.test']);

        // The endpoint has no distinct rule; existing keyBy synchronization
        // treats duplicate identity keys as one attendee, with the last row winning.
        $this->putBms('meetings/'.$meeting->id, ['attendees' => [
            ['user_id' => $c->id], ['user_id' => $c->id],
        ]], $director)->assertOk();

        $this->assertSame(1, $meeting->attendees()->count());
        $this->assertSame(1, $meeting->attendees()->where('user_id', $c->id)->count());
        $this->assertSame(1, $this->mailsTo('c@example.test', 'invitation'));
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
