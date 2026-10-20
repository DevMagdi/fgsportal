<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TicketClientOpen extends Mailable
{
    use Queueable, SerializesModels;
    Public $fullname,$ticket_id,$ticket_title;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($fullname,$ticket_id,$ticket_title)
    {
        $this->fullname = $fullname;
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
        return $this->from("support@firstgulfsolutions.com")->bcc('ahassan@firstgulfsolutions.com','Technical')->bcc('ataha@firstgulfsolutions.com','Technical')->subject('FGS Portal')->markdown('emails.ticketopenmain');
    }
}
