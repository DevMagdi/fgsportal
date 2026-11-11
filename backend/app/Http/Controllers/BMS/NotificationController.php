<?php

namespace App\Http\Controllers\BMS;

use Illuminate\Http\Request;

class NotificationController extends BmsController
{
    public function index(Request $request)
    {
        $notifications = $this->access->user()->unreadNotifications()->paginate(25);

        return $this->ok($notifications);
    }

    public function read(string $id)
    {
        $notification = $this->access->user()->notifications()->where('id', $id)->firstOrFail();
        $notification->markAsRead();

        return $this->ok(['id' => $notification->id, 'read_at' => $notification->fresh()->read_at]);
    }
}
