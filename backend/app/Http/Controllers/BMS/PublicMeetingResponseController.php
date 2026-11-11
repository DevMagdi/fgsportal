<?php
namespace App\Http\Controllers\BMS;
use App\Http\Controllers\Controller;
use App\Models\BMS\MeetingAttendee;
class PublicMeetingResponseController extends Controller
{
    public function __invoke(string $token,string $response)
    {
        abort_unless(in_array($response,['accepted','tentative','declined'],true),404);
        $attendee=MeetingAttendee::where('response_token',$token)->firstOrFail();
        $attendee->update(['response'=>$response]);
        return response('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Alphaiota BMS</title><body style="font-family:sans-serif;background:#F8F6F3;display:grid;place-items:center;min-height:100vh;margin:0"><main style="background:white;padding:36px;border-radius:16px;color:#45436E;text-align:center"><h1>Response recorded</h1><p>Your meeting response: <strong>'.htmlspecialchars($response,ENT_QUOTES,'UTF-8').'</strong></p><p>You may close this page.</p></main></body></html>');
    }
}
