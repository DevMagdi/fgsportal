<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class RecruitmentMail extends Mailable
{
    use Queueable, SerializesModels;
    Public $attachmentPaths,$email_body,$email_subject,$url,$send_link ;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($attachmentPaths,$email_subject ,$email_body,$email,$token,$send_link )
    {
        $this->attachmentPaths = $attachmentPaths;
        $this->email_body = $email_body;
        $this->email_subject = $email_subject;
        $this->send_link = $send_link;
        
        $this->url = "https://connect.firstgulfsolutions.com/#/uploadattachment?token_id=".$token."&email=". $email;

    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
       $mail =  $this->from("firstgulfsolutionspm@gmail.com")->subject(  $this->email_subject)->markdown('emails.recruitmentMail');
        foreach ($this->attachmentPaths as $attachmentPath) {
            $mail->attach($attachmentPath);
        }
        return $mail;
    }
}
