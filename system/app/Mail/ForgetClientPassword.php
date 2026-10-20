<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ForgetClientPassword extends Mailable
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
        $this->url = "https://connect.firstgulfsolutions.com/#/forgetpassowrd?token=".$token."&email=". $email;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from("support@firstgulfsolutions.com")->subject('FGS Portal Forget Password')->markdown('emails.forgetpasswordmails');
    }
}
