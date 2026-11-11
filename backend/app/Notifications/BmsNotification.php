<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BmsNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private string $event,
        private string $title,
        private string $body,
        private ?string $url = null
    ) {
        $this->afterCommit();
    }

    public function via($notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $message = (new MailMessage())
            ->subject('[BMS] '.$this->title)
            ->line($this->body);
        if ($this->url) {
            $message->action('Open BMS', $this->url);
        }

        return $message;
    }

    public function toArray($notifiable): array
    {
        return [
            'event' => $this->event,
            'title' => $this->title,
            'body' => $this->body,
            'url' => $this->url,
        ];
    }
}
