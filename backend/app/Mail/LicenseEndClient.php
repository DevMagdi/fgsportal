<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class LicenseEndClient extends Mailable
{
    use Queueable, SerializesModels;
    Public $client_name,$title,$message;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($client_name,$title,$message)
    {
        $this->client_name = $client_name;
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
        return $this->from("support@firstgulfsolutions.com")->subject('FGS Portal')->markdown('emails.licenseclient');

    }
}
