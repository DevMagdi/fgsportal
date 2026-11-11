<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContractEnded extends Mailable
{
    use Queueable, SerializesModels;
    Public $message;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($message)
    {
        
        $this->message = $message;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Alphaiota Portal')->bcc('ahassan@alphaiota.com.sa','Technical')->bcc('ataha@alphaiota.com.sa','Technical')->markdown('emails.contract');
    }
}
