<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class WelcomeMail extends Mailable
{
    use Queueable, SerializesModels;
    Public $email,$username,$password,$type,$header,$message,$URL;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($email,$username,$password,$type)
    {
        $this->email = $email;
        $this->username = $username;
        $this->password = $password;
        $this->type = $type;

        if($this->type=='Client'){
            $header = 'Dear valued customer,';
            $message = ' We would like to extend a warm welcome to our support center. We are dedicated to providing you with the best possible service and assistance. 
            Whether you have a question about our products or services, or need help troubleshooting an issue, our team is here to help.';
            $URL = 'https://connect.firstgulfsolutions.com';
            
            
        }else{
            $header = 'Dear Employee,';
            $message = 'We would like to extend a warm welcome';
            $URL = 'https://community.firstgulfsolutions.com/';
        }
     
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {

        return $this->subject('FGS Support Portal')->markdown('emails.welcomemail');
    }
}