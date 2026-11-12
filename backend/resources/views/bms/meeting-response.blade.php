<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Alphaiota BMS — Meeting response</title>
</head>
<body style="font-family:sans-serif;background:#F8F6F3;display:grid;place-items:center;min-height:100vh;margin:0">
<main style="background:white;padding:36px;border-radius:16px;color:#45436E;max-width:640px;width:90%">
    @if ($recorded ?? false)
        <h1>Response recorded</h1>
        <p>Your response is <strong>{{ $attendee->response }}</strong>. You may close this page.</p>
    @else
        <h1>{{ $meeting->title }}</h1>
        <p><strong>Starts:</strong> {{ $meeting->starts_at->toDayDateTimeString() }}</p>
        <p><strong>Ends:</strong> {{ $meeting->ends_at->toDayDateTimeString() }}</p>
        <p>{{ $meeting->location }}</p>
        @if ($ready === false)
            <p style="color:#a15c00">Notifications are not configured on this deployment, so the original response link was not delivered by email. Please contact the meeting organiser.</p>
        @else
        <form method="post" action="{{ url('/bms/meeting-response/'.$token) }}">
            @csrf
            <button type="submit" name="response" value="accepted">Accept</button>
            <button type="submit" name="response" value="tentative">Tentative</button>
            <button type="submit" name="response" value="declined">Decline</button>
        </form>
        @endif
    @endif
</main>
</body>
</html>
