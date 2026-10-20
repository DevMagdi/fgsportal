<?php

namespace App\Http\Controllers\Settings\Incentive;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use App\Models\User;
use App\Models\IncentiveStatus;
use App\Models\IncentiveRequestApproved;
use App\Models\IncentiveRequestRejected;
use App\Models\IncentiveRequest;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Http\Controllers\ApiMessage\MessageController;


class IncentiveRequestController extends Controller
{
    
    public function ApprovalSendNotification(User $user1 , User $user2,IncentiveRequest $report,$redirection){
        $msg = array
             (
               "body"=>  $report->incentive_status_id == '2'? $user1->username . " Has Approved Your Incentive Request" :( $report->incentive_status_id == '3'? $user1->username . " Has Done Your Incentive Request": $user1->username . " Has Rejected Your Incentive Request"),
               "createdAt"=>$report->updated_at,
               "receverKey"=> $user2->id.'',
               "receverName"=> $user2->username,
               "redirection"=> $redirection,
               "senderKey"=> $user1->id.'',
               "senderName"=> $user1->username,
               "status"=> 0,
               "updatedAt"=>$report->updated_at,
               "title"=> $report->incentive_status_id == '2'? $user1->username . " Approved Incentive " :( $report->incentive_status_id == '3'? $user1->username . " Done Incentive ": $user1->username . " Rejected Incentive"),
               'senderImg'=>$user1->photoURL?'/Attachments/User/'.$user1->id.'/profile'.'/'.$user1->photoURL:null,
             );
       MessageController::notificationSend($msg);
   }
   
   public function ApprovalSendNotificationPending(User $user1 , User $user2,IncentiveRequest $report){
    $msg = array
         (
           "body"=> "New Incentive Request From ". $user1->username,
           "createdAt"=>$report->updated_at,
           "receverKey"=> $user2->id.'',
           "receverName"=> $user2->username,
           "redirection"=> "/manager/incentive",
           "senderKey"=> $user1->id.'',
           "senderName"=> $user1->username,
           "status"=> 0,
           "updatedAt"=>$report->updated_at,
           "title"=> "Incentive Request",
           'senderImg'=>$user1->photoURL?'/Attachments/User/'.$user1->id.'/profile'.'/'.$user1->photoURL:null,
         );
   MessageController::notificationSend($msg);
}

    public function castarrayofrequest(IncentiveRequest $dep){
        $incentiveRequestApproved = IncentiveRequestApproved::where('incentive_id',$dep->id)->first();
        $incentiveRequestReject = IncentiveRequestRejected::where('incentive_id',$dep->id)->first();
        $incentiveRequestAcceptedDone = IncentiveRequestApproved::where('incentive_id',$dep->id)->where('incentive_status_id',3)->first();
        $array_reponse = [ 
            'comment' =>$dep->incentive_comment,
            'incentiveAmount' =>$dep->incentive_amount,
            'createdByKey' =>$dep->user_creator_id,
            'createdByName' =>$dep->user_creator_id_fun->username,
            'empKey' =>$dep->user_to_id,
            'empName' =>$dep->user_to_id_fun->username,
            'incentive_status_id' =>$dep->incentive_status_id,
            'incentive_status_name' =>$dep->incentive_status_id_fun->incentive_status_name,
            'managerToApproveKey' =>$dep->incentive_status_id==1 ? $dep->manager_approve_id:($incentiveRequestReject ||$incentiveRequestApproved? ($dep->incentive_status_id==4?$incentiveRequestReject->rejected_by_id:$incentiveRequestApproved->assign_to_id):null),
            'managerToApproveName' =>$dep->incentive_status_id==1 &&$dep->manager_approve_id!=null? $dep->manager_approve_id_fun->username:($dep->incentive_status_id==4 &&$incentiveRequestReject->rejected_by_id!=null?$incentiveRequestReject->rejected_by_id_fun->username:
            ($incentiveRequestApproved?$incentiveRequestApproved->assign_to_id_fun->username:null)),
            'managerDissision'=>$dep->incentive_status_id==2||$dep->incentive_status_id==3?(boolean)true:($dep->incentive_status_id==4?(boolean)false:null),
            'managerDissisionKey'=>$dep->incentive_status_id==2||$dep->incentive_status_id==3?$incentiveRequestApproved->assign_to_id:($dep->incentive_status_id==4?$incentiveRequestReject->rejected_by_id:null),
            'managerDissisionName'=>(($dep->incentive_status_id==2||$dep->incentive_status_id==3) &&$incentiveRequestApproved!=null)?$incentiveRequestApproved->assign_to_id_fun->username:($dep->incentive_status_id==4?$incentiveRequestReject->rejected_by_id_fun->usernam:null),
            'managerDissisionComment'=>($dep->incentive_status_id==2||$dep->incentive_status_id==3)?$incentiveRequestApproved->comment:($dep->incentive_status_id==4?$incentiveRequestReject->reject_reason:null),
            'managerDissisionAt'=>$dep->incentive_status_id==2||$dep->incentive_status_id==3?$incentiveRequestApproved->created_at:($dep->incentive_status_id==4?$incentiveRequestReject->created_at:null),
            'empAppliedKey'=>$dep->incentive_status_id==2||$dep->incentive_status_id==3?$dep->manager_approve_id:null,
            'empAppliedName'=>(($dep->incentive_status_id==2||$dep->incentive_status_id==3)&&$dep->manager_approve_id!=null)?$dep->manager_approve_id_fun->username:null,
            'empAppliedAt'=>($dep->incentive_status_id==2||$dep->incentive_status_id==3)&&$incentiveRequestAcceptedDone?$incentiveRequestAcceptedDone->created_at:null,
            'empAppliedComment'=>($dep->incentive_status_id==2||$dep->incentive_status_id==3)&&$incentiveRequestAcceptedDone?$incentiveRequestAcceptedDone->comment:null,
            'createdAt'=>$dep->created_at,
            'processKey' =>$dep->process_id,
            'processName' =>$dep->process_id_fun->process_title,
            'projectKey' =>$dep->process_id_fun->project_id,
            'projectName' =>$dep->process_id_fun->project_id_fun->project_title,
            'date'=>$dep->incentive_date,
            'key'=>$dep->id,
        ];
        return $array_reponse;
     }
    
    public function DeleteIncentiveRequest(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'incentive_id'=>'required|numeric|exists:incentive_requests,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

            $incentiveRequest=  IncentiveRequest::where('id',$request->incentive_id)->delete();
            $incentiveRequestReject=  IncentiveRequestRejected::where('incentive_id',$request->incentive_id)->delete();
            $incentiveRequestApproved=  IncentiveRequestApproved::where('incentive_id',$request->incentive_id)->delete();
            $incentiveRequest=  IncentiveRequest::where('id',$request->incentive_id)->withTrashed()->first();

            $employee = IncentiveRequest::where('manager_approve_id',$incentiveRequest->manager_approve_id)->
            where('incentive_status_id',1)->get()->count();
            try{
                $msg = array(
                    'pendingIncentiveRequest'=>$employee
                );
                MessageController::updatedatafirebase($incentiveRequest->manager_approve_id,$msg);
            }catch(\Exception $e){}
            
            $employee = IncentiveRequest::where('incentive_status_id',2)->get()->count();
            $users = User::where('sub_departments_id',9)->get();
            foreach($users as $u){
                try{
                    $msg = array(
                        'pendingIncentiveRequest'=>$employee
                    );
                    MessageController::updatedatafirebase($u->id,$msg);
                }catch(\Exception $e){}
            }

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

    
   
    public function CreateIncentiveRequest(Request $request){
       try{
            $validator = Validator::make($request->all(), [
                 'incentive_comment'=>'required|string',
                'incentive_amount'=>'required|numeric',
                'incentive_status_id'=>'required|numeric|exists:incentive_statuses,id',
                'user_to_id'=>'required|numeric|exists:users,id',
                'process_id'=>'required|numeric|exists:processes,id',
                'token'=>'required|string',
                'incentive_date'=>'required|date', 
            ]);

            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
           if($request->incentive_status_id==2){
            $incentiveRequest=  IncentiveRequest::create([
                'incentive_comment' =>$request->incentive_comment,
                'incentive_amount' =>$request->incentive_amount,
                'user_creator_id' =>Auth::guard('user_api')->user()->id,
                'incentive_status_id' =>2,
                'user_to_id' =>$request->user_to_id,
                'manager_approve_id' =>Auth::guard('user_api')->user()->id,
                'process_id' =>$request->process_id,
                'incentive_date'=>Carbon::createFromFormat('m/d/Y', $request-> incentive_date),
                ]);
           }else{
            $validator = Validator::make($request->all(), [
                'manager_approve_id'=>'required|numeric|exists:users,id' 
           ]);

           if ($validator->fails()) {
   
               return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
           }
               $incentiveRequest=  IncentiveRequest::create([
                 'incentive_comment' =>$request->incentive_comment,
                 'incentive_amount' =>$request->incentive_amount,
                 'user_creator_id' =>Auth::guard('user_api')->user()->id,
                 'incentive_status_id' =>$request->incentive_status_id,
                 'user_to_id' =>$request->user_to_id,
                 'manager_approve_id' =>$request->manager_approve_id,
                 'process_id' =>$request->process_id,
                 'incentive_date'=>Carbon::createFromFormat('m/d/Y', $request-> incentive_date),
                 ]);
                 $employee = IncentiveRequest::where('manager_approve_id', $incentiveRequest->manager_approve_id)->
                 where('incentive_status_id',1)->get()->count();
                 try{
                     $msg = array(
                         'pendingIncentiveRequest'=>$employee
                     );
                     MessageController::updatedatafirebase($incentiveRequest->manager_approve_id,$msg);
                 }catch(\Exception $e){}

                 try{
                    $user_details = User::where('id',$incentiveRequest->manager_approve_id)->first();
                    $this->ApprovalSendNotificationPending(Auth::guard('user_api')->user(),$user_details,$incentiveRequest);
                    }catch(\Exception $e){
                        
                    }
                    
           }
           if($request->incentive_status_id==2){
            $incentiveRequestApproved = IncentiveRequestApproved::create([
                    'incentive_status_id'=>2,
                    'assign_to_id'=>Auth::guard('user_api')->user()->id,
                    'incentive_id'=>$incentiveRequest->id,
                ]);

                $employee = IncentiveRequest::where('incentive_status_id',2)->get()->count();
                $users = User::where('sub_departments_id',9)->get();
                foreach($users as $u){
                    try{
                        $msg = array(
                            'pendingIncentiveRequest'=>$employee
                        );
                        MessageController::updatedatafirebase($u->id,$msg);
                    }catch(\Exception $e){}
                    
                 try{
                    $user_details = User::where('id',$u->id)->first();
                    $this->ApprovalSendNotificationPending(Auth::guard('user_api')->user(),$user_details,$incentiveRequest);
                    }catch(\Exception $e){
                        
                    }
                }
               

            }
          
          return ResponseApi::acceptedResponseApi($this->castarrayofrequest($incentiveRequest),"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateIncentiveRequest(Request $request){
       try{
             $validator = Validator::make($request->all(), [
                  'incentive_comment'=>'required|string',
                 'incentive_amount'=>'required|numeric',
                 'incentive_status_id'=>'required|numeric|exists:incentive_statuses,id',
                 'user_to_id'=>'required|numeric|exists:users,id',
                 'process_id'=>'required|numeric|exists:processes,id',
                 'token'=>'required|string',
                 'incentive_date'=>'required|date',      
                 'incentive_request_id'=>'required|numeric|exists:incentive_requests,id',
                 'manager_approve_id'=>'required|numeric|exists:users,id'     

             ]);
 
             if ($validator->fails()) {
     
                 return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }
             $incentiveRequest= IncentiveRequest::where('id',$request->incentive_request_id)->first();

           $incentiveRequest->update([
             'incentive_comment' =>$request->incentive_comment,
             'incentive_amount' =>$request->incentive_amount,
             'user_creator_id' =>Auth::guard('user_api')->user()->id,
             'incentive_status_id' =>$request->incentive_status_id,
             'user_to_id' =>$request->user_to_id,
             'manager_approve_id' =>$request->manager_approve_id,
             'process_id' =>$request->process_id,
             'incentive_date'=>Carbon::createFromFormat('m/d/Y', $request-> incentive_date),
             ]);
             if(empty($request->manager_approve_id)){
                $incentiveRequestApproved= IncentiveRequestApproved::where('id',$request->incentive_request_id)->first();

                 $incentiveRequestApproved ->update([
                     'incentive_status_id'=>2,
                     'assign_to_id'=>Auth::guard('user_api')->user()->id,
                     'incentive_id'=>$incentiveRequest->id,
                 ]);

             }
           
           return ResponseApi::acceptedResponseApi($this->castarrayofrequest($incentiveRequest),"success",201);
 
              
         }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
         
     }
   
    
    public function GetMyIncentiveRequest(Request $request){
      // try{
            $validator = Validator::make($request->all(), [
            'token'=>'required|string',
            ]);
            if ($validator->fails()) {

            return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

            $incentiveRequest = IncentiveRequest::where('user_creator_id',Auth::guard('user_api')->user()->id)->where('incentive_status_id',1)->orWhere('incentive_status_id',2)->where('user_creator_id',Auth::guard('user_api')->user()->id)->get();
            if(!empty($incentiveRequest[0]->id)){
                foreach($incentiveRequest as $dep){
                $array_reponse[] =  $this->castarrayofrequest($dep);
            }
                return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
    
              }else{
                return ResponseApi::notFoundResponse(['message'=>"Empty Incentive Request"],"Empty",200);
    
              }
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
        
    }
    public function GetManagerPendingIncentive(Request $request){
        try{
             $validator = Validator::make($request->all(), [
             'token'=>'required|string',
             ]);
             if ($validator->fails()) {
 
             return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }
 
             $incentiveRequest = IncentiveRequest::where('manager_approve_id',Auth::guard('user_api')->user()->id)->where('incentive_status_id',1)->get();
             if(!empty($incentiveRequest[0]->id)){
                 foreach($incentiveRequest as $dep){
                 $array_reponse[] =  $this->castarrayofrequest($dep);
             }
                 return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
     
               }else{
                 return ResponseApi::notFoundResponse(['message'=>"Empty Incentive Request"],"Empty",200);
     
               }
         }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
         
    }
     public function GetApprovedIncentiveRequest(Request $request){
        try{
             $validator = Validator::make($request->all(), [
             'token'=>'required|string',
             ]);
             if ($validator->fails()) {
 
             return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }
 
             $incentiveRequest = IncentiveRequest::where('incentive_status_id',2)->get();
             if(!empty($incentiveRequest[0]->id)){
                 foreach($incentiveRequest as $dep){
                 $array_reponse[] =  $this->castarrayofrequest($dep);
             }
                 return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
     
               }else{
                 return ResponseApi::notFoundResponse(['message'=>"Empty Incentive Request"],"Empty",200);
     
               }
         }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
         
     }
     public function GetIncentiveRequestSheet(Request $request){
       try{
             $validator = Validator::make($request->all(), [
             'token'=>'required|string',
             ]);

             $from_date = null;
             $to_date = null;

             if(!empty($request->from_date)){
                $from_date =  $request-> from_date;
             }
             if(!empty($request->to_date)){
                $from_date =$request-> from_date;
             }
             if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }


             $incentiveRequest = IncentiveRequest::where('user_to_id',$request->user_id?'=':'<>',$request->user_id?$request->user_id:null)->
             whereHas('process_id_fun', function($q) use($request){
                $q->where('project_id',$request->project_id?'=':'<>',$request->project_id?$request->project_id:null);
            })->where('incentive_date',$request->from_date?'>=':'<>',$request->from_date?$request->from_date:null)
            ->where('incentive_date',$request->to_date?'<=':'<>',$request->to_date?$request->to_date:null)
            ->where('incentive_status_id',$request->incentive_status_id?'=':'<>',$request->incentive_status_id?$request->incentive_status_id:null)->get();

 
             if(!empty($incentiveRequest[0]->id)){
                 foreach($incentiveRequest as $dep){
                 $array_reponse[] =  $this->castarrayofrequest($dep);
             }
                 return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
     
               }else{
                 return ResponseApi::notFoundResponse(['message'=>"Empty Incentive Request"],"Empty",200);
     
               }
         }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
         
     }
     public function GetIncentiveRequestApproved(Request $request){
        try{
             $validator = Validator::make($request->all(), [
             'token'=>'required|string',
             ]);
             if ($validator->fails()) {
 
             return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }
 
             $incentiveRequest = IncentiveRequest::where('manager_approve_id',Auth::guard('user_api')->user()->id)->where('incentive_status_id',2)->get();
             if(!empty($incentiveRequest[0]->id)){
                 foreach($incentiveRequest as $dep){
                 $array_reponse[] =  $this->castarrayofrequest($dep);
             }
                 return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
     
               }else{
                 return ResponseApi::notFoundResponse(['message'=>"Empty Incentive Request"],"Empty",200);
     
               }
         }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
         
     }
     public function ManagerApproveIncentiveRequest(Request $request){
        //try{
             $validator = Validator::make($request->all(), [
             'token'=>'required|string',
             'incentive_id'=>'required|numeric|exists:incentive_requests,id'
             ]);
             if ($validator->fails()) {
 
             return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }
 
             $incentiveRequest = IncentiveRequest::where('id',$request->incentive_id)->first();

             $incentiveRequestApproved=  IncentiveRequestApproved::where('incentive_id',$request->incentive_id)->where('incentive_status_id',2)->first();

                if(empty($incentiveRequestApproved->id)){
                if(!empty($incentiveRequest->id)){
                        $incentiveRequestApproved = IncentiveRequestApproved::create([
                            'incentive_status_id'=>2,
                            'assign_to_id'=>$incentiveRequest->manager_approve_id,
                            'incentive_id'=>$request->incentive_id,
                            'comment'=>$request->comment,
                        ]);

                   if(!empty($incentiveRequestApproved)){
                    $incentiveRequest->update([
                        'incentive_status_id' =>2,
                        'manager_approve_id'=>null,
                    ]);
                    $incentiveRequest = IncentiveRequest::where('id',$request->incentive_id)->first();


                    $employee = IncentiveRequest::where('incentive_status_id',1)->where('manager_approve_id',$incentiveRequestApproved->assign_to_id)->get()->count();

                    try{
                        $msg = array(
                            'pendingIncentiveRequest'=>$employee
                        );
                        MessageController::updatedatafirebase($incentiveRequestApproved->assign_to_id,$msg);
                    }catch(\Exception $e){}


                    $employee = IncentiveRequest::where('incentive_status_id',2)->get()->count();
                    $users = User::where('sub_departments_id',9)->get();

                    foreach($users as $u){
                        try{
                            $msg = array(
                                'pendingIncentiveRequest'=>$employee
                            );
                            MessageController::updatedatafirebase($u->id,$msg);
                        }catch(\Exception $e){}

                        try{
                            $user_details = User::where('id',$u->id)->first();
                            $this->ApprovalSendNotificationPending(Auth::guard('user_api')->user(),$user_details,$incentiveRequest);
                            }catch(\Exception $e){
                                
                            }
                    }




                    return ResponseApi::acceptedResponseApi($this->castarrayofrequest($incentiveRequest),"success",201);

               
                   }else{
                    return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
                   }
                   


                }else{
                    return ResponseApi::badMethodErrorResponse(['message'=>"Incentive Request  not found"],"Validator Errors",400);

                }
                }else{
                    return ResponseApi::badMethodErrorResponse(['message'=>"Incentive Request Accepted already Exist"],"Validator Errors",400);

                }
        //  }catch(\Exception $e){
        //      return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
        //  }
         
     }

     public function SubDoneIncentiveRequest(Request $request){
       try{
             $validator = Validator::make($request->all(), [
             'token'=>'required|string',
             'incentive_id'=>'required|numeric|exists:incentive_requests,id',
             ]);
             if ($validator->fails()) {
 
             return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }
 
             $incentiveRequest = IncentiveRequest::where('id',$request->incentive_id)->where('incentive_status_id',2)->first();

            
                if(!empty($incentiveRequest->id)){
                  
                        $incentiveRequestApproved = IncentiveRequestApproved::create([
                            'incentive_status_id'=>3,
                            'assign_to_id'=>Auth::guard('user_api')->user()->id,
                            'incentive_id'=>$request->incentive_id,
                            'comment'=>$request->comment,
                        ]);
                        if(!empty($incentiveRequestApproved)){
                            $incentiveRequest->update([
                                'incentive_status_id' =>3,
                                'manager_approve_id'=>Auth::guard('user_api')->user()->id,
                            ]);
                            $incentiveRequest = IncentiveRequest::where('id',$request->incentive_id)->where('incentive_status_id',3)->first();
        
                            try{
                                $user_details = User::where('id',$incentiveRequest->user_to_id)->first();
                                $this->ApprovalSendNotification(Auth::guard('user_api')->user(),$user_details,$incentiveRequest,"/");
                                }catch(\Exception $e){
                                }

                            $employee = IncentiveRequest::where('incentive_status_id',2)->get()->count();
                            $users = User::where('sub_departments_id',9)->get();
                            foreach($users as $u){
                                try{
                                    $msg = array(
                                        'pendingIncentiveRequest'=>$employee
                                    );
                                    MessageController::updatedatafirebase($u->id,$msg);
                                }catch(\Exception $e){}
                            }


                            return ResponseApi::acceptedResponseApi($this->castarrayofrequest($incentiveRequest),"success",201);
                            
                           }else{
                            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
                           }        

                }else{
                    return ResponseApi::badMethodErrorResponse(['message'=>"Incentive Request Even Done or Rejected or Still Pending"],"Validator Errors",400);

                }
                
         }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
         
     }

     public function RejectIncentiveRequest(Request $request){
     //   try{
             $validator = Validator::make($request->all(), [
             'token'=>'required|string',
             'incentive_id'=>'required|numeric|exists:incentive_requests,id',
             'reject_reason'=>'required|string'
             ]);
             if ($validator->fails()) {
 
             return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }
 
             $incentiveRequest = IncentiveRequest::where('id',$request->incentive_id)->first();

                if(!empty($incentiveRequest->id)){
                        $incentiveRequestReject = IncentiveRequestRejected::create([
                            'rejected_by_id'=>Auth::guard('user_api')->user()->id,
                            'incentive_id'=>$request->incentive_id,
                            'reject_reason'=>$request->reject_reason,
                        ]);

                        $employee = IncentiveRequest::where('manager_approve_id',Auth::guard('user_api')->user()->id)->where('incentive_status_id',1)->get()->count();
                        $users = User::where('sub_departments_id',9)->get();

                        foreach($users as $u){
                            try{
                                $msg = array(
                                    'pendingIncentiveRequest'=>$employee
                                );
                                MessageController::updatedatafirebase($Auth::guard('user_api')->user()->id,$msg);
                            }catch(\Exception $e){}
                        }

                   if(!empty($incentiveRequestReject)){
                    $incentiveRequest->update([
                        'incentive_status_id' =>4,
                        'manager_approve_id'=>Auth::guard('user_api')->user()->id,
                    ]);
                    $incentiveRequest = IncentiveRequest::where('id',$request->incentive_id)->where('incentive_status_id',4)->first();

                    try{
                        $user_details = User::where('id',$incentiveRequest->user_creator_id)->first();
                        $this->ApprovalSendNotification(Auth::guard('user_api')->user(),$user_details,$incentiveRequest,"/manager/incentive");
                        }catch(\Exception $e){
                        }




                    return ResponseApi::acceptedResponseApi($this->castarrayofrequest($incentiveRequest),"success",201);

               
                   }else{
                    return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
                   }
                   


                }else{
                    return ResponseApi::badMethodErrorResponse(['message'=>"Incentive Request Even Done or Rejected or Still Pending"],"Validator Errors",400);

                }
                
        //  }catch(\Exception $e){
        //      return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
        //  }
         
     }



    


















    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\IncentiveRequest  $incentiveRequest
     * @return \Illuminate\Http\Response
     */
    public function show(IncentiveRequest $incentiveRequest)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\IncentiveRequest  $incentiveRequest
     * @return \Illuminate\Http\Response
     */
    public function edit(IncentiveRequest $incentiveRequest)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\IncentiveRequest  $incentiveRequest
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, IncentiveRequest $incentiveRequest)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\IncentiveRequest  $incentiveRequest
     * @return \Illuminate\Http\Response
     */
    public function destroy(IncentiveRequest $incentiveRequest)
    {
        //
    }
}
