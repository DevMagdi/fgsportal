<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TicketUpdate extends Mailable
{
    use Queueable, SerializesModels;
    Public $to_username,$username_update,$ticket_id,$ticket_title,$comment,$word_title,$title;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($username_update,$to_username,$ticket_id,$ticket_title,$comment,$word_title,$title)
    {
        $this->to_username = $to_username;
        $this->username_update = $username_update;
        $this->ticket_id = $ticket_id;
        $this->ticket_title = $ticket_title;
        $this->comment = $comment;
        $this->title = $title;
        $this->word_title = $word_title;
        
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from("support@firstgulfsolutions.com")->bcc('ahassan@firstgulfsolutions.com','Technical')->bcc('ataha@firstgulfsolutions.com','Technical')->subject('FGS Portal')->markdown('emails.ticketupdate');
    }
}
