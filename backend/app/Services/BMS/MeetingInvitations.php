<?php

namespace App\Services\BMS;

use App\Models\BMS\Meeting;
use App\Models\BMS\MeetingAttendee;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;

/**
 * Builds RFC 5545 invitations and sends them to attendees.
 * One stable UID per meeting; SEQUENCE grows on every reschedule or cancellation.
 */
class MeetingInvitations
{
    public function ics(Meeting $meeting, string $method = 'REQUEST'): string
    {
        $meeting->loadMissing('attendees.user', 'creator');
        $lines = [
            'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Alphaiota//BMS//EN', 'CALSCALE:GREGORIAN',
            'METHOD:' . $method, 'BEGIN:VEVENT',
            'UID:bms-meeting-' . $meeting->id . '@alphaiota',
            'SEQUENCE:' . (int) $meeting->sequence,
            'DTSTAMP:' . now()->utc()->format('Ymd\THis\Z'),
            'DTSTART:' . $meeting->starts_at->copy()->utc()->format('Ymd\THis\Z'),
            'DTEND:' . $meeting->ends_at->copy()->utc()->format('Ymd\THis\Z'),
            'SUMMARY:' . $this->escape($meeting->title),
            'LOCATION:' . $this->escape($meeting->location),
            'STATUS:' . ($method === 'CANCEL' ? 'CANCELLED' : 'CONFIRMED'),
        ];
        $organizer = $meeting->creator;
        if ($organizer && $organizer->email) {
            $lines[] = 'ORGANIZER;CN=' . $this->param($organizer->username) . ':mailto:' . $organizer->email;
        }
        foreach ($meeting->attendees as $attendee) {
            $email = $this->email($attendee);
            if (!$email) {
                continue;
            }
            $lines[] = 'ATTENDEE;CN=' . $this->param($this->name($attendee)) . ';ROLE=REQ-PARTICIPANT;PARTSTAT='
                . $this->partstat($attendee->response) . ';RSVP=TRUE:mailto:' . $email;
        }
        $lines[] = 'END:VEVENT';
        $lines[] = 'END:VCALENDAR';
        return implode("\r\n", array_map([$this, 'fold'], $lines)) . "\r\n";
    }

    /** Send REQUEST (or CANCEL) to the given attendees. Returns [attendeeId => status]. */
    public function send(Meeting $meeting, $attendees, string $method = 'REQUEST'): array
    {
        $meeting->loadMissing('attendees.user', 'creator');
        $ics = $this->ics($meeting, $method);
        $result = [];
        foreach ($attendees as $attendee) {
            $email = $this->email($attendee);
            if (!$email) {
                $attendee->update(['delivery_status' => 'no_email']);
                $result[$attendee->id] = 'no_email';
                continue;
            }
            try {
                if (!$attendee->response_token) {
                    $attendee->response_token = Str::random(64);
                }
                $body = $this->body($meeting, $attendee, $method);
                $subject = ($method === 'CANCEL' ? 'BMS meeting cancelled: ' : 'BMS meeting invitation: ') . $meeting->title;
                Mail::html($body, function ($message) use ($email, $attendee, $subject, $ics, $method) {
                    $message->to($email, $this->name($attendee))->subject($subject)
                        ->attachData($ics, 'meeting.ics', ['mime' => 'text/calendar; charset=utf-8; method=' . $method]);
                });
                $attendee->update(['delivery_status' => $method === 'CANCEL' ? 'cancelled' : 'sent', 'invited_at' => now()]);
            } catch (\Throwable $e) {
                $attendee->update(['delivery_status' => 'failed']);
            }
            $result[$attendee->id] = $attendee->delivery_status;
        }
        return $result;
    }

    private function body(Meeting $meeting, MeetingAttendee $attendee, string $method): string
    {
        $title = htmlspecialchars($meeting->title, ENT_QUOTES, 'UTF-8');
        if ($method === 'CANCEL') {
            return "The meeting {$title} scheduled for {$meeting->starts_at} has been cancelled.";
        }
        $location = htmlspecialchars($meeting->location ?: 'To be confirmed', ENT_QUOTES, 'UTF-8');
        $link = URL::to('/bms/meeting-response/' . $attendee->response_token);
        return "You are invited to {$title}.<br>Start: {$meeting->starts_at}<br>End: {$meeting->ends_at}<br>Location: {$location}"
            . "<br><br><a href=\"{$link}\">Review the invitation and choose your response</a>";
    }

    private function email(MeetingAttendee $attendee): ?string
    {
        return $attendee->external_email ?: ($attendee->user->email ?? null);
    }

    private function name(MeetingAttendee $attendee): string
    {
        return $attendee->external_name ?: ($attendee->user->username ?? 'Attendee');
    }

    private function partstat(?string $response): string
    {
        return ['accepted' => 'ACCEPTED', 'declined' => 'DECLINED', 'tentative' => 'TENTATIVE'][$response] ?? 'NEEDS-ACTION';
    }

    private function escape($value): string
    {
        return str_replace(['\\', ';', ',', "\r\n", "\n"], ['\\\\', '\;', '\,', '\n', '\n'], (string) $value);
    }

    private function param($value): string
    {
        return '"' . str_replace('"', "'", (string) $value) . '"';
    }

    /** Fold at 75 octets without splitting a multibyte (e.g. Arabic) character. */
    private function fold(string $line): string
    {
        if (strlen($line) <= 75) {
            return $line;
        }
        $out = '';
        $current = '';
        foreach (preg_split('//u', $line, -1, PREG_SPLIT_NO_EMPTY) as $char) {
            if (strlen($current) + strlen($char) > 73) {
                $out .= $current . "\r\n ";
                $current = '';
            }
            $current .= $char;
        }
        return $out . $current;
    }
}
