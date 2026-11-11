<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SupportEnded extends Mailable
{
    use Queueable, SerializesModels;
    Public $support_id,$title,$message;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($support_id,$title,$message)
    {
        $this->support_id = $support_id;
        $this->title = $title;
        $this->message = $message;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Alphaiota Portal')->bcc('ahassan@alphaiota.com.sa','Technical')->bcc('ataha@alphaiota.com.sa','Technical')->markdown('emails.support');
    }
}
