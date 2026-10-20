<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TicketUserOpen extends Mailable
{
    use Queueable, SerializesModels;
    Public $client_name,$ticket_id,$ticket_title;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($client_name,$ticket_id,$ticket_title)
    {
        $this->client_name = $client_name;
        $this->ticket_id = $ticket_id;
        $this->ticket_title = $ticket_title;
     
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from("support@firstgulfsolutions.com")->bcc('ahassan@firstgulfsolutions.com','Technical')->bcc('ataha@firstgulfsolutions.com','Technical')->subject('FGS Portal')->markdown('emails.ticketopenuser');
    }
}
