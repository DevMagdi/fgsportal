<?php

namespace App\Mail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ForgetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;
    Public $email,$token,$url;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($email,$token)
    {
        $this->email = $email;
        $this->token = $token;
        $this->url = "https://community.alphaiota.com.sa/#/forgetpassowrd?token=".$token."&email=". $email;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return  $this->from("support@alphaiota.com.sa")->subject('Alphaiota Portal Forget Password')->markdown('emails.forgetpasswordmails');
    }
}
