<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ActivityPending extends Mailable
{
    use Queueable, SerializesModels;
    Public $contact_lead_name,$activity_type_name,$message;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($contact_lead_name,$activity_type_name,$message)
    {
        $this->contact_lead_name = $contact_lead_name;
        $this->message = $message;
        $this->activity_type_name = $activity_type_name;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Alphaiota Portal')->bcc('ahassan@alphaiota.com.sa','Technical')->bcc('ataha@alphaiota.com.sa','Technical')->markdown('emails.activity');
    }
}
