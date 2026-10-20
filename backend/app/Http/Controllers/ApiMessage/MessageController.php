<?php

namespace App\Http\Controllers\ApiMessage;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Firebase\FirebaseLib;
use  App\Models\PhoneType;
 
class MessageController extends Controller
{

    // public function hello(Request $equest){
    //     $p=PhoneType::create(['phone_type'=>'ahmed']);
    // }

    public function pushnotifcation($to_token,$title,$body){
        $token = config('firebase.server_key');
        $to_token=   str_replace('"', '', $to_token);
              $fields = array
                (
                    "notification"=> array(
                        "title"=> $title,
                        "body"=>$body,
                    ),
                        "to"=>$to_token,
                );
         $headers = array
                (
                    'Authorization: key='.$token,
                     'Content-Type: application/json',
                     'Access-Control-Allow-Origin: *'
                );
        $ch = curl_init();
        curl_setopt( $ch,CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send' );
        curl_setopt( $ch,CURLOPT_POST, true );
       curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
         curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
        curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
        curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) );
        $result = curl_exec($ch );
        curl_close( $ch );
    }

    
    public function getFcm($id,$title,$body){
        $URL = config('firebase.database_url');
        $TOKEN = config('firebase.api_key');
        $PATH = '/fcmTokens';
        $firebase = new FirebaseLib($URL, $TOKEN);
        $val = $firebase->get($PATH. '/'.$id);   // stores data in Firebase
        $res=    MessageController::pushnotifcation($val,$title,$body);
    }
    public function getFcmClient($id,$title,$body){
        $URL = config('firebase.database_url');
        $TOKEN = config('firebase.api_key');
        $PATH = '/clientfcmTokens';
        $firebase = new FirebaseLib($URL, $TOKEN);
        $val = $firebase->get($PATH. '/'.$id);   // stores data in Firebase
        $res=    MessageController::pushnotifcation($val,$title,$body);
    }
    
    public function notificationSend($msg){
        $URL = config('firebase.database_url');
        $TOKEN = config('firebase.api_key');
        $PATH = '/notification';
        $firebase = new FirebaseLib($URL, $TOKEN);
       $firebase->push($PATH, $msg);    
       MessageController::getFcm($msg['receverKey'] ,$msg['title'],$msg['body']);
    }
   
//UserNavParams/user_id

public function updatedatafirebase($id,$msg){
    $URL = config('firebase.database_url');
    $TOKEN = config('firebase.api_key');
    $PATH = '/UserNavParams'.'/'.$id;
    $firebase = new FirebaseLib($URL, $TOKEN);
   $firebase->update($PATH, $msg);    
  // MessageController::getFcm($msg['receverKey'] ,$msg['title'],$msg['body']);
}
public function updatedatafirebaseNote($id,$msg){
      $URL = config('firebase.database_url');
 
    $TOKEN = config('firebase.api_key');

    $PATH = '/Notes'.'/'.$id;
    $firebase = new FirebaseLib($URL, $TOKEN);
   $firebase->update($PATH, $msg);    
  // MessageController::getFcm($msg['receverKey'] ,$msg['title'],$msg['body']);
}
// $msg = array
//     (
//         "rejectedReport"=>9
//     );
// pendingReport?:number;
// devPendingReports?:number;
// rejectedReport?:number;
// pendingVacationsRequest?:number;
// pendingTransportationRequest?:number;
// pendingIncentiveRequest?:number;
// pendingPublicRequest?:number;

    public function notificationSendclient($msg){
        $URL = config('firebase.database_url');
        $TOKEN = config('firebase.api_key');
        $PATH = '/clientnotification';
        $firebase = new FirebaseLib($URL, $TOKEN);
       $firebase->push($PATH, $msg);    
       MessageController::getFcmClient($msg['receverKey'] ,$msg['title'],$msg['body']);
    }
    
   
}
