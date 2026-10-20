<?php

namespace App\Http\Controllers\ResponseTrait;
use Illuminate\Support\Facades\Crypt;

trait ResponseApi{
 
      public function acceptedResponseApi($data=null , $message=null,$status=null){
        $array=[
          'data' =>  $data,
          'message'=> $message,
          'status'=>$status
        ];
        return response($array,$status);
    }

    public function notFoundResponse($data=null , $message=null,$status=null){
      $array=[
        'data' =>  $data,
        'message'=> $message,
        'status'=>$status
      ];
      return response($array,$status);
  }
    public function validatorErrorResponseApi($data=null , $message=null,$status=null){
      $array=[
        'data' =>  $data,
        'message'=> $message,
        'status'=>$status
      ];
      return response($array,$status);
    }

    public function unauthorizedResponseApi($data=null , $message=null,$status=null){
      $array=[
        'data' =>  $data,
        'message'=> $message,
        'status'=>$status
      ];
      return response($array,$status);
  }


  public function badMethodErrorResponse($data=null , $message=null,$status=null){
    $array=[
      'data' =>  $data,
      'message'=> $message,
      'status'=>$status
    ];
    return response($array,$status);

  }

  public function tokenBadResponse($data=null , $message=null,$status=null){
    $array=[
      'data' =>  $data,
      'message'=> $message,
      'status'=>$status
    ];
    return response($array,$status);

  }

  
   

    public function logOutapiResponse($data=null , $message=null,$status=null){
      $array=[
        'data' =>  $data,
        'message'=> $message,
        'status'=>$status
      ];
      return response($array,$status);
  }



    public function unAuthorizedapiResponse($data=null , $message=null,$status=null){
        $array=[
          'data' =>  $data,
          'message'=> $message,
          'status'=>$status
        ];
        return response($array,$status);
    }



    public function apiResponse($data=null , $message=null,$status=null){
        $array=[
          'data' =>  $data,
          'message'=> $message,
          'status'=>$status
        ];
        return response($array,$status);

    }

    


    public function validatorApiResponseErrorId($olddata=null , $message=null,$status=null){
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
    
    public function GetJobAgreementApiResonseCreateAccount($data=null , $message=null,$status=null){
      $array=[
        'data' =>  $data,
        'message'=> $message,
        'status'=>$status
      ];
      return response($array,$status);
    }

    public function GetJobAgreementApiResonseHR($data=null , $message=null,$status=null){
      $array=[
        'data' =>  $data,
        'message'=> $message,
        'status'=>$status
      ];
      return response($array,$status);
    }
    public function StoreJobAgreementApiResonse($data=null , $message=null,$status=null){
     
      $array=[
        'data' =>  $data,
        'message'=> $message,
        'status'=>$status
      ];
      return response($array,$status);
    }
    public function newJobAgreementApiResonse($olddata=null , $message=null,$status=null){
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
    public function existApiResonse($olddata=null , $message=null,$status=null){
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

    
    public function validatorApiResponseJobAgreement($olddata=null , $message=null,$status=null){
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

    public function validatorApiResponse($olddata=null , $message=null,$status=null){
      
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