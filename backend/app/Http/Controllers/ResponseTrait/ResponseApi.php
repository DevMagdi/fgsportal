<?php

namespace App\Http\Controllers\ResponseTrait;
use Illuminate\Support\Facades\Crypt;

trait ResponseApi{
 
      public static function acceptedResponseApi($data=null , $message=null,$status=null){
        $array=[
          'data' =>  $data,
          'message'=> $message,
          'status'=>$status
        ];
        return response($array,$status);
    }

    public static function notFoundResponse($data=null , $message=null,$status=null){
      $array=[
        'data' =>  $data,
        'message'=> $message,
        'status'=>$status
      ];
      return response($array,$status);
  }
    public static function validatorErrorResponseApi($data=null , $message=null,$status=null){
      $array=[
        'data' =>  $data,
        'message'=> $message,
        'status'=>$status
      ];
      return response($array,$status);
    }

    public static function unauthorizedResponseApi($data=null , $message=null,$status=null){
      $array=[
        'data' =>  $data,
        'message'=> $message,
        'status'=>$status
      ];
      return response($array,$status);
  }


  public static function badMethodErrorResponse($data=null , $message=null,$status=null){
    $array=[
      'data' =>  $data,
      'message'=> $message,
      'status'=>$status
    ];
    return response($array,$status);

  }

  public static function tokenBadResponse($data=null , $message=null,$status=null){
    $array=[
      'data' =>  $data,
      'message'=> $message,
      'status'=>$status
    ];
    return response($array,$status);

  }

  
   

    public static function logOutapiResponse($data=null , $message=null,$status=null){
      $array=[
        'data' =>  $data,
        'message'=> $message,
        'status'=>$status
      ];
      return response($array,$status);
  }



    public static function unAuthorizedapiResponse($data=null , $message=null,$status=null){
        $array=[
          'data' =>  $data,
          'message'=> $message,
          'status'=>$status
        ];
        return response($array,$status);
    }



    public static function apiResponse($data=null , $message=null,$status=null){
        $array=[
          'data' =>  $data,
          'message'=> $message,
          'status'=>$status
        ];
        return response($array,$status);

    }

    


    public static function validatorApiResponseErrorId($olddata=null , $message=null,$status=null){
      if(!empty($olddata["id"])){
  
        $data = [
          "id"=>implode($olddata["id"]),
        ];
      
    }
      $array=[
        'data' =>  $data,
        'message'=> $message,
        'status'=>$status
      ];
      return response($array,$status);
    }
    
    public static function GetJobAgreementApiResonseCreateAccount($data=null , $message=null,$status=null){
      $array=[
        'data' =>  $data,
        'message'=> $message,
        'status'=>$status
      ];
      return response($array,$status);
    }

    public static function GetJobAgreementApiResonseHR($data=null , $message=null,$status=null){
      $array=[
        'data' =>  $data,
        'message'=> $message,
        'status'=>$status
      ];
      return response($array,$status);
    }
    public static function StoreJobAgreementApiResonse($data=null , $message=null,$status=null){
     
      $array=[
        'data' =>  $data,
        'message'=> $message,
        'status'=>$status
      ];
      return response($array,$status);
    }
    public static function newJobAgreementApiResonse($olddata=null , $message=null,$status=null){
      $data=[
        'token'=>$olddata,
      ];
      $array=[
        'data' =>  $data,
        'message'=> $message,
        'status'=>$status
      ];
      return response($array,$status);
    }
    public static function existApiResonse($olddata=null , $message=null,$status=null){
      $encrypted = Crypt::encryptString($olddata->id);
      $data=[
        'id'=>$encrypted,
        'username'=> $olddata->username,
        'firstname'=>$olddata->firstname  ,
        'lastname'=>$olddata->lastname,
        'attach_file'=>$olddata->attach_file  ,
        "deleted_at"=>$olddata->deleted_at,
        "created_at"=>$olddata->created_at,
       ];
      $array=[
        'data' =>  $data,
        'message'=> $message,
        'status'=>$status
      ];
      return response($array,$status);

    }

    
    public static function validatorApiResponseJobAgreement($olddata=null , $message=null,$status=null){
        if(!empty($olddata["username"])){
  
          $data = [
            "username"=>implode($olddata["username"]),
          ];
        
      }else if(!empty($olddata["lastname"])){
      
          $data = [
            "lastname"=>implode($olddata["lastname"]),
          ];
      
      }elseif(!empty($olddata["firstname"])){
        $data = [
          "firstname"=>implode($olddata["firstname"]),
        ];

        }elseif(!empty($olddata["password"])){
          $data = [
            "password"=>implode($olddata["password"]),
          ];
        
        }elseif(!empty($olddata["email"])){
          $data = [
            "email"=>implode($olddata["email"]),
          ];
        
        }elseif(!empty($olddata["mobileNumber"])){
          $data = [
            "mobileNumber"=>implode($olddata["mobileNumber"]),
          ];
        
        }elseif(!empty($olddata["id"])){
          $data = [
            "id"=>implode($olddata["id"]),
          ];
      }else{
        $data= $olddata;
      }
       $array=[
        'data' =>  $data ,
        'message'=> $message,
        'status'=>$status
      ];
      return response($array,$status);

    }

    public static function validatorApiResponse($olddata=null , $message=null,$status=null){
      
      if(!empty($olddata["email"])){
 
          $data = [
            "email"=>implode($olddata["email"]),
           ];
        
      }else if(!empty($olddata["username"])){
       
          $data = [
            "username"=>implode($olddata["username"]),
           ];
       
      }elseif(!empty($olddata["password"])){
        $data = [
          "password"=>implode($olddata["password"]),
         ];

        }elseif(!empty($olddata["mobileNumber"])){
          $data = [
            "mobileNumber"=>implode($olddata["mobileNumber"]),
           ];
        
      }else{
        $data= $olddata;
      }
      $array=[
        'data' =>  $data ,
        'message'=> $message,
        'status'=>$status
      ];
      return response($array,$status);

  }

}