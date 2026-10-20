<?php
$now = new DateTime(); //now
$now->add(new DateInterval('PT2H'));

 
$current_time = $now->format('H:i a'); // 2021-09-11 01:01:55
$sunrise = "9:00 am";
$sunset = "8:00 pm";
$date1 = DateTime::createFromFormat('h:i a', $current_time);
$date2 = DateTime::createFromFormat('h:i a', $sunrise);
$date3 = DateTime::createFromFormat('h:i a', $sunset);
if ($date1 > $date2 && $date1 < $date3)
{
   
     $headers = array
     (
          'Content-Type: application/json',
          'Access-Control-Allow-Origin: *'
     );
$ch = curl_init();
curl_setopt( $ch,CURLOPT_URL, 'https://community.firstgulfsolutions.com/ConnectPortal/FrontEndApi/api/users/Ticketmanagment' );
curl_setopt( $ch,CURLOPT_POST, true );
curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
$result = curl_exec($ch );
curl_close( $ch );


}


        ?>      