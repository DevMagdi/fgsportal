<?php

namespace App\Services\BMS;

use App\Models\BMS\BmsRole;
use App\Models\User;
use App\Notifications\BmsNotification;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class BmsNotifier
{
    public function notify($recipients, string $event, string $title, string $body, ?string $url = null): void
    {
        if (!config("bms.notifications.events.{$event}", true)) {
            return;
        }
        $users = $this->users($recipients);
        if ($users->isEmpty()) {
            return;
        }

        try {
            Notification::send($users, new BmsNotification($event, $title, $body, $url));
        } catch (\Throwable $exception) {
            // Queued delivery must not roll back the business transaction.
            Log::error('BMS notification dispatch failed', [
                'event' => $event,
                'exception' => get_class($exception),
            ]);
        }
    }

    public function notifyRoles(array $roles, string $event, string $title, string $body, ?string $url = null): void
    {
        $users = User::whereHas('bmsRoles', function ($query) use ($roles) {
            $query->whereIn('bms_roles.slug', $roles);
        })->get();
        $this->notify($users, $event, $title, $body, $url);
    }

    public function notifyAbility(string $ability, string $event, string $title, string $body, ?string $url = null): void
    {
        $roleIds = BmsRole::all()->filter(function (BmsRole $role) use ($ability) {
            $abilities = $role->abilities ?: [];
            return in_array($ability, $abilities, true) || in_array('*', $abilities, true);
        })->pluck('id');
        $users = User::whereHas('bmsRoles', function ($query) use ($roleIds) {
            $query->whereIn('bms_roles.id', $roleIds);
        })->get();
        $this->notify($users, $event, $title, $body, $url);
    }

    public function notifyDepartment(int $departmentId, string $event, string $title, string $body, ?string $url = null): void
    {
        $users = User::whereHas('sub_departments_id_fun', function ($query) use ($departmentId) {
            $query->where('departments_id', $departmentId);
        })->get();
        $this->notify($users, $event, $title, $body, $url);
    }

    private function users($recipients): Collection
    {
        return collect($recipients)->filter(function ($recipient) {
            return $recipient instanceof User && $recipient->email;
        })->unique('id')->values();
    }
}
