<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TicketUsernoAction extends Mailable
{
    use Queueable, SerializesModels;
    Public $ticket_number,$ticket_id,$ticket_title,$reason;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($ticket_number,$ticket_id,$ticket_title,$reason)
    {
        $this->ticket_number = $ticket_number;
        $this->ticket_id = $ticket_id;
        $this->ticket_title = $ticket_title;
        $this->reason = $reason;
     
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from("support@alphaiota.com.sa")->bcc('ahassan@alphaiota.com.sa','Technical')->bcc('ataha@alphaiota.com.sa','Technical')->subject('Alphaiota Portal')->markdown('emails.ticketnoaction');
    }
}
