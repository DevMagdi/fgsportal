<?php

namespace App\Http\Controllers\BMS;

use App\Http\Controllers\Controller;
use App\Models\BMS\MeetingAttendee;
use App\Services\BMS\BmsAudit;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PublicMeetingResponseController extends Controller
{
    public function show(string $token)
    {
        $attendee = $this->validAttendee($token);

        return response()->view('bms.meeting-response', [
            'attendee' => $attendee,
            'meeting' => $attendee->meeting,
            'token' => $token,
            // Not-yet-invited attendees have no usable token: do not expose a
            // response form that silently fails or, worse, invites guessing.
            'ready' => (bool) $attendee->invited_at,
        ]);
    }

    public function store(Request $request, string $token, BmsAudit $audit)
    {
        $attendee = $this->validAttendee($token);
        $data = $request->validate([
            'response' => ['required', Rule::in(['accepted', 'tentative', 'declined'])],
        ]);

        abort_if(
            config('bms.meeting_response_one_time') && $attendee->response_recorded_at !== null,
            410,
            'This response link has already been used.'
        );
        abort_if(
            config('bms.meeting_response_changes_until_start') && now()->greaterThanOrEqualTo($attendee->meeting->starts_at),
            410,
            'Responses closed when the meeting started.'
        );

        $old = $attendee->only(['response', 'response_recorded_at']);
        $attendee->update([
            'response' => $data['response'],
            'response_recorded_at' => now(),
        ]);
        $audit->record($attendee, 'meeting.public_response_recorded', $old, $attendee->only([
            'response', 'response_recorded_at',
        ]));

        return response()->view('bms.meeting-response', [
            'attendee' => $attendee,
            'meeting' => $attendee->meeting,
            'token' => $token,
            'recorded' => true,
        ]);
    }

    private function validAttendee(string $token): MeetingAttendee
    {
        $attendee = MeetingAttendee::with('meeting')->where('response_token', $token)->firstOrFail();
        $expiresAt = $attendee->meeting->ends_at->copy()->addHours((int) config('bms.meeting_response_expiry_hours'));
        abort_if(now()->greaterThan($expiresAt), 410, 'This response link has expired.');

        return $attendee;
    }
}
