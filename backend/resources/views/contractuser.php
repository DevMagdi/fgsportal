<?php
         $headers = array
                (
                     'Content-Type: application/json',
                     'Access-Control-Allow-Origin: *'
                );
        $ch = curl_init();
        curl_setopt( $ch,CURLOPT_URL, 'https://community.firstgulfsolutions.com/ConnectPortal/FrontEndApi/api/users/ExpiredUserContact' );
        curl_setopt( $ch,CURLOPT_POST, true );
       curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
         curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
        curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
        $result = curl_exec($ch );
        curl_close( $ch );
        ?>      