<?php

namespace App\Http\Controllers\Settings\PublicRequest;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use App\Models\PublicRequestStatus;
use App\Models\PublicRequestAccepted;
use App\Models\PublicRequestRejected;
use App\Models\PublicRequest;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Http\Controllers\ApiMessage\MessageController;
use App\Models\User;
use App\Models\Process;
use App\Models\Project;
class PublicRequestController extends Controller
{
    public function ApprovalSendNotification(User $user1 , User $user2,PublicRequest $report){
        $msg = array
             (
               "body"=>  $report->public_request_status_id == '2' ? $user1->username . " Has Approved Your Public Request" :($report->public_request_status_id == '3' ?$user1->username . " Has Done Your Public Request":$user1->username . " Has Rejected Your Public Request"),
               "createdAt"=>$report->updated_at,
               "receverKey"=> $user2->id.'',
               "receverName"=> $user2->username,
               "redirection"=> "/dev/requests",
               "senderKey"=> $user1->id.'',
               "senderName"=> $user1->username,
               "status"=> 0,
               "updatedAt"=>$report->updated_at,
               "title"=> $report->public_request_status_id =='2' ? $user1->username."Your Public Reqeust". " Approved" :($report->public_request_status_id == '3' ?$user1->username . " Done Your Public Request": $user1->username." Your Public Request". " Rejected" ),
               'senderImg'=>$user1->photoURL?'/Attachments/User/'.$user1->id.'/profile'.'/'.$user1->photoURL:null,
             );

       MessageController::notificationSend($msg);
   }
   public function ApprovalSendNotification2(User $user1 , User $user2,PublicRequest $report){
    $msg = array
         (
           "body"=>  $user1->username . "Approved New Public Request",
           "createdAt"=>$report->updated_at,
           "receverKey"=> $user2->id.'',
           "receverName"=> $user2->username,
           "redirection"=> "/manager/publicreqs",
           "senderKey"=> $user1->id.'',
           "senderName"=> $user1->username,
           "status"=> 0,
           "updatedAt"=>$report->updated_at,
           "title"=>"You Have New Public Reqeust" ,
           'senderImg'=>$user1->photoURL?'/Attachments/User/'.$user1->id.'/profile'.'/'.$user1->photoURL:null,
         );

   MessageController::notificationSend($msg);
}

    
     public function castarrayofrequest(PublicRequest $dep){
        $publicRequestAccepted = PublicRequestAccepted::where('public_request_id',$dep->id)->first();
        $publicRequestRejected = PublicRequestRejected::where('public_request_id',$dep->id)->first();
        $publicRequestAcceptedDone = PublicRequestAccepted::where('public_request_id',$dep->id)->where('public_request_status_id',3)->first();
        $process = Process::where('id',$dep->process_id)->withTrashed()->first();
        if(!empty($process->id)){
            $project =   Project::where('id',$process->project_id)->withTrashed()->first();

        }
        $array_reponse = [ 
            'details' =>$dep->public_request_details,
            'amountByEGP' =>$dep->public_request_amount,
            'empKey' =>$dep->user_creator_id,
            'empName' =>$dep->user_creator_id_fun->username,
            'empImageUrl'=>$dep->user_creator_id_fun->photoURL,
            'req_status_id' =>$dep->public_request_status_id,
            'req_status_name' =>$dep->public_request_status_id_fun->public_request_status_name,
            'managerToApproveKey' =>$dep->public_request_status_id==1 ? $dep->manager_approve_id:($dep->public_request_status_id==4?$publicRequestRejected->rejected_by_id:$publicRequestAccepted->assign_to_id),
            'managerToApproveName' =>$dep->public_request_status_id==1 ? $dep->manager_approve_id_fun->username:($dep->public_request_status_id==4?$publicRequestRejected->rejected_by_id_fun->username:$publicRequestAccepted->assign_to_id_fun->username),
            'managerDissision'=>$dep->public_request_status_id==2||$dep->public_request_status_id==3?(boolean)true:($dep->public_request_status_id==4?(boolean)false:null),
            'managerDissisionKey'=>$dep->public_request_status_id==2||$dep->public_request_status_id==3?$publicRequestAccepted->assign_to_id:($dep->public_request_status_id==4?$publicRequestRejected->rejected_by_id:null),
            'managerDissisionName'=>$dep->public_request_status_id==2||$dep->public_request_status_id==3?$publicRequestAccepted->assign_to_id_fun->username:($dep->public_request_status_id==4?$publicRequestRejected->rejected_by_id_fun->usernam:null),
            'managerDissisionComment'=>$dep->public_request_status_id==2||$dep->public_request_status_id==3?$publicRequestAccepted->comment:($dep->public_request_status_id==4?$publicRequestRejected->reject_reason:null),
            'managerDissisionAt'=>$dep->public_request_status_id==2||$dep->public_request_status_id==3?$publicRequestAccepted->created_at:($dep->public_request_status_id==4?$publicRequestRejected->created_at:null),
            'empToApplyKey'=>$dep->public_request_status_id==2||$dep->public_request_status_id==3?$dep->manager_approve_id:null,
            'empToApplyName'=>$dep->public_request_status_id==2||$dep->public_request_status_id==3?$dep->manager_approve_id_fun->username:null,
            'empAppliedAt'=>$dep->public_request_status_id==3&&$publicRequestAcceptedDone?$publicRequestAcceptedDone->created_at:null,
            'empAppliedComment'=>$dep->public_request_status_id==3&&$publicRequestAcceptedDone?$publicRequestAcceptedDone->comment:null,
            'process_id' =>$dep->process_id,
            'type'=>$dep->public_request_title,
            'createdAt'=>$dep->created_at,
            'dept'=>$dep->sub_departments_id,
            'dept_name'=>$dep->sub_departments_id_fun->sub_department_name,
            'processKey' =>!empty($process->id)?$process->id.'':null,
            'processName' =>!empty($process->id)?$process->process_title:null,
            'projectKey' =>!empty($project->id)?$project->id.'':null,
            'projectName' =>!empty($project->id)?$project->project_title:null,
            
            'key'=>$dep->id,

        ];
        return $array_reponse;
     }
    
   
    public function DeletePublicRequest(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'public_request_id'=>'required|numeric|exists:public_requests,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

            $publicRequest=  PublicRequest::where('id',$request->public_request_id)->delete();
            $publicRequestRejected=  PublicRequestRejected::where('public_request_id',$request->public_request_id)->delete();
            $publicRequestAccepted=  PublicRequestAccepted::where('public_request_id',$request->public_request_id)->delete();

          
            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

    
   
    public function CreatePublicRequest(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'public_request_details'=>'required|string',
                'public_request_amount'=>'required|numeric',
                'public_request_status_id'=>'required|numeric|exists:public_request_statuses,id',
                'manager_approve_id'=>'required|numeric|exists:users,id',
                'process_id'=>'required|numeric|exists:processes,id',
                'token'=>'required|string',
                'public_request_title'=>'required|string',
                'sub_departments_id'=>'required|numeric|exists:sub_departments,id'
      
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
           
          $publicRequest=  PublicRequest::create([
            'public_request_details' =>$request->public_request_details,
            'public_request_amount' =>$request->public_request_amount,
            'user_creator_id' =>Auth::guard('user_api')->user()->id,
            'public_request_status_id' =>$request->public_request_status_id,
            'manager_approve_id' =>$request->manager_approve_id,
            'process_id' =>$request->process_id,
            'sub_departments_id'=>$request->sub_departments_id,
            'public_request_title'=>$request->public_request_title,
            ]);
         
            $manager = PublicRequest::where('manager_approve_id',$publicRequest->manager_approve_id)
            ->where('public_request_status_id',1)->get()->count();
            try{
                $msg = array(
                    'pendingPublicRequest'=>$manager
                );
                MessageController::updatedatafirebase($publicRequest->manager_approve_id,$msg);
             }catch(\Exception $e){}


          return ResponseApi::acceptedResponseApi($this->castarrayofrequest($publicRequest),"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
   
    public function GetMyRequest(Request $request){
      // try{
            $validator = Validator::make($request->all(), [
            'token'=>'required|string',
            ]);
            if ($validator->fails()) {

            return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

            $publicRequest = PublicRequest::where('user_creator_id',Auth::guard('user_api')->user()->id)->get();
            if(!empty($publicRequest[0]->id)){
                foreach($publicRequest as $dep){
                $array_reponse[] =  $this->castarrayofrequest($dep);
            }
                return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
    
              }else{
                return ResponseApi::notFoundResponse(['message'=>"Empty Public Request"],"Empty",200);
    
              }
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
        
    }
    public function GetManagerPendingRequest(Request $request){
        try{
             $validator = Validator::make($request->all(), [
             'token'=>'required|string',
             ]);
             if ($validator->fails()) {
 
             return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }
 
             $publicRequest = PublicRequest::where('manager_approve_id',Auth::guard('user_api')->user()->id)->where('public_request_status_id',1)->get();
             if(!empty($publicRequest[0]->id)){
                 foreach($publicRequest as $dep){
                 $array_reponse[] =  $this->castarrayofrequest($dep);
             }
                 return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
     
               }else{
                 return ResponseApi::notFoundResponse(['message'=>"Empty Public Request"],"Empty",200);
     
               }
         }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
         
    }
     public function GetApprovedRequest(Request $request){
        try{
             $validator = Validator::make($request->all(), [
             'token'=>'required|string',
             ]);
             if ($validator->fails()) {
 
             return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }
 
             $publicRequest = PublicRequest::where('public_request_status_id',2)->get();
             if(!empty($publicRequest[0]->id)){
                 foreach($publicRequest as $dep){
                 $array_reponse[] =  $this->castarrayofrequest($dep);
             }
                 return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
     
               }else{
                 return ResponseApi::notFoundResponse(['message'=>"Empty Public Request"],"Empty",200);
     
               }
         }catch(\Exception $e){
          
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
         
     }
     public function GetRequestSheet(Request $request){
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


             $publicRequest = PublicRequest::where('user_creator_id',$request->user_id?'=':'<>',$request->user_id?$request->user_id:null)->
             where('sub_departments_id',$request->sub_departments_id?'=':'<>',$request->sub_departments_id?$request->sub_departments_id:null)->
             where('created_at',$request->from_date?'>=':'<>',$request->from_date?$request->from_date:null)->where('created_at',$request->to_date?'<=':'<>',$request->to_date?$request->to_date:null)->get();

 
             if(!empty($publicRequest[0]->id)){
                 foreach($publicRequest as $dep){
                 $array_reponse[] =  $this->castarrayofrequest($dep);
             }
                 return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
     
               }else{
                 return ResponseApi::notFoundResponse(['message'=>"Empty Public Request"],"Empty",200);
     
               }
         }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
         
     }
     public function GetRequestApprovedSubDepartment(Request $request){
        try{
             $validator = Validator::make($request->all(), [
             'token'=>'required|string',
             ]);
             if ($validator->fails()) {
 
             return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }
 
             $publicRequest = PublicRequest::where('manager_approve_id',Auth::guard('user_api')->user()->id)->where('public_request_status_id',2)->get();
             if(!empty($publicRequest[0]->id)){
                 foreach($publicRequest as $dep){
                 $array_reponse[] =  $this->castarrayofrequest($dep);
             }
                 return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
     
               }else{
                 return ResponseApi::notFoundResponse(['message'=>"Empty Public Request"],"Empty",200);
     
               }
         }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
         
     }
     public function ManagerApprovePublicRequest(Request $request){
        try{
             $validator = Validator::make($request->all(), [
             'token'=>'required|string',
             'user_id'=>'required|numeric|exists:users,id',
             'public_request_id'=>'required|numeric|exists:public_requests,id'
             ]);
             if ($validator->fails()) {
 
             return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }
 
             $publicRequest = PublicRequest::where('id',$request->public_request_id)->first();

             $publicRequestAccepted=  PublicRequestAccepted::where('public_request_id',$request->public_request_id)->where('public_request_status_id',2)->first();

                if(empty($publicRequestAccepted->id)){
                if(!empty($publicRequest->id)){
                        $publicRequestAccepted = PublicRequestAccepted::create([
                            'public_request_status_id'=>2,
                            'assign_to_id'=>$publicRequest->manager_approve_id,
                            'public_request_id'=>$request->public_request_id,
                            'comment'=>!empty($request->comment)?$request->comment:null,
                        ]);

                   if(!empty($publicRequestAccepted)){
                    $publicRequest->update([
                        'public_request_status_id' =>2,
                        'manager_approve_id'=>$request->user_id,
                    ]);
                    $publicRequest = PublicRequest::where('id',$request->public_request_id)->first();

                    $manager = PublicRequest::where('manager_approve_id',$publicRequestAccepted->assign_to_id)
                        ->where('public_request_status_id',1)->get()->count();
                        try{
                            $msg = array(
                                'pendingPublicRequest'=>$manager
                            );
                            MessageController::updatedatafirebase($publicRequestAccepted->assign_to_id,$msg);
                        }catch(\Exception $e){}


                        $employee = PublicRequest::where('manager_approve_id',$publicRequest->manager_approve_id)
                        ->where('public_request_status_id',2)->get()->count();
                        try{
                            $msg = array(
                                'pendingPublicRequest'=>$employee
                            );
                            MessageController::updatedatafirebase($publicRequest->manager_approve_id,$msg);
                        }catch(\Exception $e){}


                        $user_details = User::where('id',$publicRequest->user_creator_id)->first();
                        try{
                        $this->ApprovalSendNotification(Auth::guard('user_api')->user(),$user_details,$publicRequest);
                        }catch(\Exception $e){   
                        }

                        $user_details = User::where('id',$publicRequest->manager_approve_id)->first();
                        try{
                        $this->ApprovalSendNotification2(Auth::guard('user_api')->user(),$user_details,$publicRequest);
                        }catch(\Exception $e){   
                        }

                    return ResponseApi::acceptedResponseApi($this->castarrayofrequest($publicRequest),"success",201);

               
                   }else{
                    return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
                   }
                   


                }else{
                    return ResponseApi::badMethodErrorResponse(['message'=>"Public Request  not found"],"Validator Errors",400);

                }
                }else{
                    return ResponseApi::badMethodErrorResponse(['message'=>"Public Request Accepted already Exist"],"Validator Errors",400);

                }
         }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
         
     }

     public function SubDonePublicRequest(Request $request){
        try{
             $validator = Validator::make($request->all(), [
             'token'=>'required|string',
             'public_request_id'=>'required|numeric|exists:public_requests,id',
             'amountByEGP'=>'required|numeric'
             ]);
             if ($validator->fails()) {
 
             return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }
 
             $publicRequest = PublicRequest::where('id',$request->public_request_id)->where('public_request_status_id',2)->first();

            
                if(!empty($publicRequest->id)){
                    if($request->amountByEGP != $publicRequest->public_request_amount){
                        $comment = $request->comment . " There Exist Change of Amount From: " .$publicRequest->public_request_amount ." ,To: ". $request->amountByEGP;
                        $publicRequestAccepted = PublicRequestAccepted::create([
                            'public_request_status_id'=>3,
                            'assign_to_id'=>$publicRequest->manager_approve_id,
                            'public_request_id'=>$request->public_request_id,
                            'comment'=>$comment,
                        ]);
                        if(!empty($publicRequestAccepted)){
                            $publicRequest->update([
                                'public_request_status_id' =>3,
                                'manager_approve_id'=>Auth::guard('user_api')->user()->id,
                                'public_request_amount'=>$request->amountByEGP
                            ]);
                            $publicRequest = PublicRequest::where('id',$request->public_request_id)->where('public_request_status_id',3)->first();
        
                            return ResponseApi::acceptedResponseApi($this->castarrayofrequest($publicRequest),"success",201);
                            
                           }else{
                            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
                           }        

                    }else{
                        $publicRequestAccepted = PublicRequestAccepted::create([
                            'public_request_status_id'=>3,
                            'assign_to_id'=>$publicRequest->manager_approve_id,
                            'public_request_id'=>$request->public_request_id,
                            'comment'=>$request->comment,
                        ]);
                        if(!empty($publicRequestAccepted)){
                            $publicRequest->update([
                                'public_request_status_id' =>3,
                                'manager_approve_id'=>Auth::guard('user_api')->user()->id,
                            ]);
                            $publicRequest = PublicRequest::where('id',$request->public_request_id)->where('public_request_status_id',3)->first();
        
                            
                                $manager = PublicRequest::where('manager_approve_id',$publicRequest->manager_approve_id)
                                ->where('public_request_status_id',2)->get()->count();
                                try{
                                    $msg = array(
                                        'pendingPublicRequest'=>$manager
                                    );
                                    MessageController::updatedatafirebase($publicRequest->manager_approve_id,$msg);
                                }catch(\Exception $e){}


                                

                                $user_details = User::where('id',$publicRequest->user_creator_id)->first();
                                try{
                                $this->ApprovalSendNotification(Auth::guard('user_api')->user(),$user_details,$publicRequest);
                                }catch(\Exception $e){   
                                }

                                

                            return ResponseApi::acceptedResponseApi($this->castarrayofrequest($publicRequest),"success",201);
                            
                           }else{
                            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
                           }        

        
                     }
                        

                   


                }else{
                    return ResponseApi::badMethodErrorResponse(['message'=>"Public Request Even Done or Rejected or Still Pending"],"Validator Errors",400);

                }
                
         }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
         
     }

     public function RejectPublicRequest(Request $request){
        try{
             $validator = Validator::make($request->all(), [
             'token'=>'required|string',
             'public_request_id'=>'required|numeric|exists:public_requests,id',
             'reject_reason'=>'required|string'
             ]);
             if ($validator->fails()) {
 
             return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }
 
             $publicRequest = PublicRequest::where('id',$request->public_request_id)->first();

                if(!empty($publicRequest->id)){
                        $publicRequestRejected = PublicRequestRejected::create([
                            'rejected_by_id'=>Auth::guard('user_api')->user()->id,
                            'public_request_id'=>$request->public_request_id,
                            'reject_reason'=>$request->reject_reason,
                        ]);
                   if(!empty($publicRequestRejected)){
                    $publicRequest->update([
                        'public_request_status_id' =>4,
                        'manager_approve_id'=>Auth::guard('user_api')->user()->id,
                    ]);
                    $publicRequest = PublicRequest::where('id',$request->public_request_id)->where('public_request_status_id',4)->first();

                    return ResponseApi::acceptedResponseApi($this->castarrayofrequest($publicRequest),"success",201);

               
                   }else{
                    return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
                   }
                   


                }else{
                    return ResponseApi::badMethodErrorResponse(['message'=>"Public Request Even Done or Rejected or Still Pending"],"Validator Errors",400);

                }
                
         }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
         
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
     * @param  \App\Models\PublicRequest  $publicRequest
     * @return \Illuminate\Http\Response
     */
    public function show(PublicRequest $publicRequest)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\PublicRequest  $publicRequest
     * @return \Illuminate\Http\Response
     */
    public function edit(PublicRequest $publicRequest)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\PublicRequest  $publicRequest
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, PublicRequest $publicRequest)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\PublicRequest  $publicRequest
     * @return \Illuminate\Http\Response
     */
    public function destroy(PublicRequest $publicRequest)
    {
        //
    }
}
