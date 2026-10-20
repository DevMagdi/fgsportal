<?php

namespace App\Http\Controllers\Settings\TransportationRequest;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use App\Models\TransportationRequestStatus;
use App\Models\TransportationRequestRejected;
use App\Models\TransportationRequestAccepted;
 use Illuminate\Support\Facades\Auth;
 use App\Models\TransportationRequest;
 use App\Models\User;
use Carbon\Carbon;
 use App\Models\Process;
 use App\Models\Project;
use App\Http\Controllers\ApiMessage\MessageController;

class TransportationRequestController extends Controller
{
    public function ApprovalSendNotification(User $user1 , User $user2,TransportationRequest $report){
        $msg = array
             (
               "body"=>  $report->transportation_request_status_id == '2' ? $user1->username . " Has Approved Your Transporation" :$user1->username . " Has Rejected Your Transporation",
               "createdAt"=>$report->updated_at,
               "receverKey"=> $user2->id.'',
               "receverName"=> $user2->username,
               "redirection"=> "/manager/apporval",
               "senderKey"=> $user1->id.'',
               "senderName"=> $user1->username,
               "status"=> 0,
               "updatedAt"=>$report->updated_at,
               "title"=> $report->transportation_request_status_id =='2' ? $user1->username."Your Transporation". " Approved" : $user1->username." Your Transporation". " Rejected" ,
               'senderImg'=>$user1->photoURL?'/Attachments/User/'.$user1->id.'/profile'.'/'.$user1->photoURL:null,
             );

       MessageController::notificationSend($msg);
   }
    public function castarrayofrequest(TransportationRequest $dep){
        $array_reponse1 =[];
        $array_reponse2 =[];
        $approve = TransportationRequestAccepted::where('request_id',$dep->id)->get();
        $reject = TransportationRequestRejected::where('request_id',$dep->id)->get();
        if(!empty($approve[0])){
            foreach($approve as $app){
                $array_reponse1[] = [
                    'user_id'=>$app->assign_to_id,
                    'user_name'=>$app->assign_to_id_fun->username,
                    'status_name'=>$app->request_status_id_fun->transportation_request_status_name,
                    'comment'=>$app->comment,
                    'action_date'=>$app->created_at,
                ];
            }
        }
        if(!empty($reject[0])){
            foreach($reject as $app){
                $array_reponse2[] = [
                    'user_id'=>$app->rejected_by_id,
                    'user_name'=>$app->rejected_by_id_fun->username,
                    'status_name'=>'Rejected',
                    'comment'=>$app->comment,
                    'action_date'=>$app->created_at,
                ];
            }
        }
        $result=collect(array_merge($array_reponse1,$array_reponse2))->sortBy('action_date')->toArray();
        $process = Process::where('id',$dep->process_id)->withTrashed()->first();
        if(!empty($process->id)){
            $process_id = $process->id."";
            $process_name = $process->process_title;
            
            
        $project = Project::where('id',$process->project_id)->withTrashed()->first();
        if(!empty($project->id)){
            $project_title = $project->project_title;
            $project_id = $project->id;
        }
        }else{
            $process_id = null;
            $process_name = null;
            $project_id = null;
            $project_title = null;
        }
        $array_reponse = [ 
            'comment' =>$dep->transportation_request_comment,
            'fromLocation' =>$dep->transportation_request_from,
            'purpose' =>$dep->transportation_request_purpose,
            'toLocation' =>$dep->transportation_request_to,
            'amountByEGP' =>$dep->transportation_request_amount,
            'empKey' =>$dep->user_creator_id,
            'empName' =>$dep->user_creator_id_fun->username,
            'empImageUrl'=>$dep->user_creator_id_fun->photoURL,
            'date'=>   Carbon::parse( $dep->transportation_request_date)->format('m/d/Y') ,
            'created_at'=>$dep->created_at,
            'trans_status_id' =>$dep->transportation_request_status_id,
            'trans_status_name' =>$dep->transportation_request_status_id_fun->transportation_request_status_name,
            'manager_approve_id' =>$dep->manager_approve_id,
            'manager_approve_name' =>$dep->manager_approve_id_fun->username,
            'processKey' =>$process_id,
            'processName' =>$process_name,
            'projectKey' =>$project_id,
            'projectName' =>$project_title,
            'key'=>$dep->id,
            'history'=>$result,

        ];
        return $array_reponse;
    }
    
    public function DeleteTransportationRequest(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'request_id'=>'required|numeric|exists:transportation_requests,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

            $transportationRequest=  TransportationRequest::where('id',$request->request_id)->first();
            $transportationRequestAccepted=  TransportationRequestAccepted::where('request_id',$request->request_id)->first();
            $transportationRequestRejected=  TransportationRequestRejected::where('request_id',$request->request_id)->first();

          

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

        
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

  
    

public function RejectTransportationRequest(Request $request){
    try{
        $validator = Validator::make($request->all(), [
            'token'=>'required|string',
            'reject_reason'=>'required|string',
            'request_id'=>'required|numeric|exists:transportation_requests,id',
             'rejected_by_id'=>'required|numeric|exists:users,id',
             ]);
        if ($validator->fails()) {

            return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
        }

        $transportationRequest=  TransportationRequest::where('id',$request->request_id)->first();

        if($transportationRequest){
            $transportationRequestRejected = TransportationRequestRejected::create([
                'rejected_by_id'=>$request->rejected_by_id,
                'reject_reason'=>$request->reject_reason,
                'request_id'=>$request->request_id,
            ]);              
                
              if(!empty($transportationRequestRejected)  ){
                $transportationRequest->update([
                    'transportation_request_status_id' =>4,
                    'manager_approve_id'=>$request->rejected_by_id,
                ]);
                $transportationRequest=  TransportationRequest::where('id',$request->request_id)->first();                    

                $manager = TransportationRequest::where('manager_approve_id',$transportationRequest->manager_approve_id)
                ->where('transportation_request_status_id',1)->get()->count();
                try{
                    $msg = array(
                        'pendingTransportationRequest'=>$manager
                    );
                    MessageController::updatedatafirebase($transportationRequest->manager_approve_id,$msg);
                 }catch(\Exception $e){}

                 $pm = TransportationRequest::where('manager_approve_id',$request->rejected_by_id)
                ->where('transportation_request_status_id',1)->get()->count();
                try{
                    $msg = array(
                        'pendingTransportationRequest'=>$pm
                    );
                    MessageController::updatedatafirebase($request->rejected_by_id,$msg);
                 }catch(\Exception $e){}
            


                $user_details = User::where('id',$transportationRequest->user_creator_id)->first();
              //  try{
                $this->ApprovalSendNotification(Auth::guard('user_api')->user(),$user_details,$transportationRequest);
                // }catch(\Exception $e){   
                // }

                return ResponseApi::acceptedResponseApi($this->castarrayofrequest($transportationRequest),"success",201);

              }else{
                return ResponseApi::badMethodErrorResponse(['message'=>"Transportation Request  Can't Create"],"Validator Errors",400);

              }
               
        

      }else{
        return ResponseApi::badMethodErrorResponse(['message'=>"Transportation Request  Empty"],"Validator Errors",200);

      }
   
    

         
    }catch(\Exception $e){
        return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

    }
    
}
   
    public function AssignTransportationRequest(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'request_id'=>'required|numeric|exists:transportation_requests,id',
                 'assign_to_id'=>'required|numeric|exists:users,id',
                 ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
 
            $transportationRequest=  TransportationRequest::where('id',$request->request_id)->first();

            if($transportationRequest){
                $transportationRequestAccepted = TransportationRequestAccepted::create([
                    'request_status_id'=>2,
                    'assign_to_id'=>$transportationRequest->manager_approve_id,
                    'request_id'=>$request->request_id,
                    'comment'=>$request->comment,
                ]);                    
                    
                  if(!empty($transportationRequestAccepted->id)  ){
                    $transportationRequest->update([
                        'transportation_request_status_id' =>1,
                        'manager_approve_id'=>$request->assign_to_id,
                    ]);
                    $transportationRequest=  TransportationRequest::where('id',$request->request_id)->first();


                    $manager = TransportationRequest::where('manager_approve_id',$transportationRequest->manager_approve_id)
                    ->where('transportation_request_status_id',1)->get()->count();
                    $pm = TransportationRequest::where('manager_approve_id',$transportationRequestAccepted->assign_to_id)
                    ->where('transportation_request_status_id',1)->get()->count();
                 
                    try{
                        $msg = array(
                            'pendingTransportationRequest'=>$manager
                        );
                        MessageController::updatedatafirebase($transportationRequest->manager_approve_id,$msg);
                     }catch(\Exception $e){}
                     try{
                        $msg = array(
                            'pendingTransportationRequest'=>$pm
                        );
                        MessageController::updatedatafirebase($transportationRequestAccepted->assign_to_id,$msg);
                     }catch(\Exception $e){}
                     
                    return ResponseApi::acceptedResponseApi($this->castarrayofrequest($transportationRequest),"success",201);
   
                  }else{
                    return ResponseApi::badMethodErrorResponse(['message'=>"Transportation Request  Can't Create"],"Validator Errors",400);

                  }
                   
            

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Transportation Request  Empty"],"Empty ",200);

          }
       
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function ManagerApproveTransportationRequest(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'request_id'=>'required|numeric|exists:transportation_requests,id',
                 //'assign_to_id'=>'required|numeric|exists:users,id',
                 ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
 
            $transportationRequest=  TransportationRequest::where('id',$request->request_id)->first();

            if($transportationRequest){
                $transportationRequestAccepted = TransportationRequestAccepted::create([
                    'request_status_id'=>2,
                    'assign_to_id'=>$transportationRequest->manager_approve_id,
                    'request_id'=>$request->request_id,
                    'comment'=>$request->comment,
                ]);                    
                    
                  if(!empty($transportationRequestAccepted->id)  ){
                    $transportationRequest->update([
                        'transportation_request_status_id' =>2,
                        'manager_approve_id'=>$transportationRequest->manager_approve_id,
                    ]);
                    $transportationRequest=  TransportationRequest::where('id',$request->request_id)->first();
                    

                    $manager = TransportationRequest::where('manager_approve_id',$transportationRequest->manager_approve_id)
                    ->where('transportation_request_status_id',1)->get()->count();
                    try{
                        $msg = array(
                            'pendingTransportationRequest'=>$manager
                        );
                        MessageController::updatedatafirebase($transportationRequest->manager_approve_id,$msg);
                     }catch(\Exception $e){}
                    
                    $user_details = User::where('id',$transportationRequest->user_creator_id)->first();
                    try{
                    $this->ApprovalSendNotification(Auth::guard('user_api')->user(),$user_details,$transportationRequest);
                    }catch(\Exception $e){   
                    }



                    return ResponseApi::acceptedResponseApi($this->castarrayofrequest($transportationRequest),"success",201);
   
                  }else{
                    return ResponseApi::badMethodErrorResponse(['message'=>"Transportation Request  Can't Create"],"Validator Errors",400);

                  }
                   
            

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Transportation Request  Empty"],"Validator Errors",200);

          }
       
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

    public function UpdateTransportationRequest(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'request_id'=>'required|numeric|exists:transportation_requests,id',
                 ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
 
            $transportationRequest=  TransportationRequest::where('id',$request->request_id)->where('transportation_request_status_id',1)->first();
            $transportationRequestAccepted=  TransportationRequestAccepted::where('request_id',$request->request_id)->first();
            $transportationRequestRejected=  TransportationRequestRejected::where('request_id',$request->request_id)->first();

            if($transportationRequest){
                if(empty($transportationRequestAccepted)&&empty($transportationRequestRejected)){
                    $transportationRequest->update(
                        $request->all()
                    );
                    $transportationRequest=  TransportationRequest::where('id',$request->request_id)->first();

                    return ResponseApi::acceptedResponseApi($this->castarrayofrequest($transportationRequest),"success",201);
   
                }else{
                    return ResponseApi::badMethodErrorResponse(['message'=>"Can't Make Update For This Transportation Request"],"Validator Errors",400);
        
                  }
                  
            

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Transportation Request  Empty"],"Empty",200);

          }
       
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

    public function DoneTransportationRequest(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'request_id'=>'required|numeric|exists:transportation_requests,id',
                 ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
 
            $transportationRequest=  TransportationRequest::where('id',$request->request_id)->first();

            if($transportationRequest){
                $transportationRequestAccepted = TransportationRequestAccepted::create([
                    'request_status_id'=>3,
                    'assign_to_id'=>Auth::guard('user_api')->user()->id,
                    'request_id'=>$request->request_id,
                    'comment'=>$request->comment,
                ]);                    
                    
                  if(!empty($transportationRequestAccepted->id)  ){
                    $transportationRequest->update([
                        'transportation_request_status_id' =>3,
                        'manager_approve_id'=>Auth::guard('user_api')->user()->id,
                    ]);
                    $transportationRequest=  TransportationRequest::where('id',$request->request_id)->first();

                    return ResponseApi::acceptedResponseApi($this->castarrayofrequest($transportationRequest),"success",201);
   
                  }else{
                    return ResponseApi::badMethodErrorResponse(['message'=>"Transportation Request  Can't Create"],"Validator Errors",400);

                  }
                   
            

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Transportation Request  Empty"],"Validator Errors",200);

          }
       
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

    public function CreateTransportationRequest(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'transportation_request_comment'=>'required|string',
                'transportation_request_from'=>'required|string',
                'transportation_request_to'=>'required|string',
                'transportation_request_purpose'=>'required|string',
                'transportation_request_amount'=>'required|numeric',
                'transportation_request_status_id'=>'required|numeric|exists:transportation_request_statuses,id',
                'manager_approve_id'=>'required|numeric|exists:users,id',
                'process_id'=>'required|numeric|exists:processes,id',
                'token'=>'required|string',
                'transportation_request_date' => 'required|date',

            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $transportationRequest=  TransportationRequest::create([
            'transportation_request_comment' =>$request->transportation_request_comment,
            'transportation_request_to' =>$request->transportation_request_to,
            'transportation_request_from' =>$request->transportation_request_from,
            'transportation_request_purpose' =>$request->transportation_request_purpose,
            'transportation_request_amount' =>$request->transportation_request_amount,
            'transportation_request_status_id' =>$request->transportation_request_status_id,
            'manager_approve_id' =>$request->manager_approve_id,
            'process_id' =>$request->process_id,
            'user_creator_id' =>Auth::guard('user_api')->user()->id,
            'transportation_request_date' => Carbon::createFromFormat('m/d/Y', $request-> transportation_request_date),
            ]);
         
            if(!empty($transportationRequest->id)){

                $manager = TransportationRequest::where('manager_approve_id',$transportationRequest->manager_approve_id)
                ->where('transportation_request_status_id',1)->get()->count();
             
                try{
                    $msg = array(
                        'pendingTransportationRequest'=>$manager
                    );
                    MessageController::updatedatafirebase($transportationRequest->manager_approve_id,$msg);
                 }catch(\Exception $e){}
            }

          return ResponseApi::acceptedResponseApi($this->castarrayofrequest($transportationRequest),"success",201);

             
        }catch(\Exception $e){
            //return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
            return ResponseApi::badMethodErrorResponse($e,"server Error",500);

        }
        
    }


    public function GetTransportationRequest(){
        try{
          $transportationRequest = TransportationRequest::all();
          if(!empty($transportationRequest[0]->id)){
            foreach($transportationRequest as $dep){
            $array_reponse[] =  $this->castarrayofrequest($dep);
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Transportation Request"],"Empty",200);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

    public function GetTransportationRequestManager(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                ]);
           if ($validator->fails()) {
   
               return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
           }
          $transportationRequest = TransportationRequest::where('transportation_request_status_id',1)->where('manager_approve_id',Auth::guard('user_api')->user()->id)->get();
          if(!empty($transportationRequest[0]->id)){
            foreach($transportationRequest as $dep){
            $array_reponse[] =  $this->castarrayofrequest($dep);
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Transportation Request"],"Empty",200);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetTransportationRequestUser(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                 ]);
           if ($validator->fails()) {
   
               return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
           }
          $transportationRequest = TransportationRequest::where('user_creator_id',Auth::guard('user_api')->user()->id)->get();
          if(!empty($transportationRequest[0]->id)){
            foreach($transportationRequest as $dep){
            $array_reponse[] =  $this->castarrayofrequest($dep);
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Transportation Request"],"Empty",200);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
   
    public function GetTransportationRequestPending(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                ]);
           if ($validator->fails()) {
   
               return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
           }
          $transportationRequest = TransportationRequest::where('transportation_request_status_id','<>',3)->where('transportation_request_status_id','<>',4)->get();
          if(!empty($transportationRequest[0]->id)){
            foreach($transportationRequest as $dep){
            $array_reponse[] =  $this->castarrayofrequest($dep);
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Transportation Request"],"Empty",200);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function TransportationSheetReport(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'from_date'=>'required|date',
                'to_date'=>'required|date',
                'user_id'=>'required|numeric'
                ]);

           if ($validator->fails()) {
   
               return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
           }
           $from_date = Carbon::createFromFormat('m/d/Y', $request-> from_date);
           $to_date = Carbon::createFromFormat('m/d/Y', $request-> to_date);
        
           if($request->user_id ==0){

            $transportationRequest = TransportationRequest::whereDate('transportation_request_date','>=',$from_date)->
            whereDate('transportation_request_date','<=',$to_date)
            ->where('transportation_request_status_id',2)->orWhere('transportation_request_status_id',3)->whereDate('transportation_request_date','>=',$from_date)->
            whereDate('transportation_request_date','<=',$to_date)->get();

           }else{
            $validator = Validator::make($request->all(), [
                'user_id'=>'required|numeric|exists:users,id',
                ]);
              
           if ($validator->fails()) {
   
               return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
           }
        //   $transportationRequest = TransportationRequest::whereDate('transportation_request_date','>=',$from_date)->
        //   whereDate('transportation_request_date','<=',$to_date)
        //   ->where('transportation_request_status_id',2)->where('user_creator_id',$request->user_id)->get();
            $transportationRequest = TransportationRequest::whereDate('transportation_request_date','>=',$from_date)->
               whereDate('transportation_request_date','<=',$to_date)
               ->where('transportation_request_status_id',2)->where('user_creator_id',$request->user_id)
               ->orWhere('transportation_request_status_id',3)->where('user_creator_id',$request->user_id)
               ->whereDate('transportation_request_date','>=',$from_date)->
               whereDate('transportation_request_date','<=',$to_date)->get();

           }
          if(!empty($transportationRequest[0]->id)){
            foreach($transportationRequest as $dep){
            $array_reponse[] =  $this->castarrayofrequest($dep);
            }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Transportation Request"],"Empty",200);
          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

    public function GetFinanceTransportation(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                ]);

           if ($validator->fails()) {
   
               return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
           }
         
        

            $transportationRequest = TransportationRequest::
            where('transportation_request_status_id',2)->get();

       
           
          if(!empty($transportationRequest[0]->id)){
            foreach($transportationRequest as $dep){
            $array_reponse[] =  $this->castarrayofrequest($dep);
            }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Transportation Request"],"Empty",200);
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
     * @param  \App\Models\TransportationRequest  $transportationRequest
     * @return \Illuminate\Http\Response
     */
    public function show(TransportationRequest $transportationRequest)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\TransportationRequest  $transportationRequest
     * @return \Illuminate\Http\Response
     */
    public function edit(TransportationRequest $transportationRequest)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\TransportationRequest  $transportationRequest
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, TransportationRequest $transportationRequest)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\TransportationRequest  $transportationRequest
     * @return \Illuminate\Http\Response
     */
    public function destroy(TransportationRequest $transportationRequest)
    {
        //
    }
}
