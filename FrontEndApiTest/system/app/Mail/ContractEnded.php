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
        return $this->subject('FGS Portal')->bcc('ahassan@firstgulfsolutions.com','Technical')->bcc('ataha@firstgulfsolutions.com','Technical')->markdown('emails.contract');
    }
}
