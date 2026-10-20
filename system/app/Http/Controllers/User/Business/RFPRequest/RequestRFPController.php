<?php

namespace App\Http\Controllers\User\Business\RFPRequest;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\UserDetail;
use App\Models\ContactLead;
use App\Models\ContactLeadActivity;
use App\Models\ContactLeadDublicate;
use Illuminate\Http\Request;
use App\Models\ContactLeadStatus;
use App\Models\ContactLeadSubStatus;
use App\Models\ContactLeadType;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use App\Models\ContactLeadAttach;
use App\Models\RequestRFPStatus;
use App\Models\RequestRFP;
use App\Models\RequestRFPToApprove;
use App\Models\RequestRFPAttach;
use App\Models\RequestRFPAction;
use App\Http\Controllers\ApiMessage\MessageController;
use Illuminate\Support\Str;
use Carbon\Carbon;


class RequestRFPController extends Controller
{
    public function ApprovalSendNotification(User $user1 , User $user2,RequestRFP $requestRFP){
        $msg = array
             (
               "body"=>  $user1->username . " Approved Rfp Request ".$requestRFP->request_rfp_title,
               "createdAt"=>Carbon::now(),
               "receverKey"=> $user2->id.'',
               "receverName"=> $user2->username,
               "redirection"=> "/CRM/leads/".$requestRFP->contact_lead_id."?active=2",
               "senderKey"=> $user1->id.'',
               "senderName"=> $user1->username,
               "status"=> 0,
               "updatedAt"=>$requestRFP->updated_at,
               "title"=> "RFP Request",
               'senderImg'=>$user1->photoURL?'/Attachments/User/'.$user1->id.'/profile'.'/'.$user1->photoURL:null,
             );

       MessageController::notificationSend($msg);
    }

    public function CreateSendNotification(User $user1 , User $user2,RequestRFP $requestRFP){
        $msg = array
             (
                 "body"=>  $user1->username . " Make Rfp Request ".$requestRFP->request_rfp_title,
               "createdAt"=>Carbon::now(),
               "receverKey"=> $user2->id.'',
               "receverName"=> $user2->username,
               "redirection"=> "/CRM/leads/".$requestRFP->contact_lead_id."?active=2",
               "senderKey"=> $user1->id.'',
               "senderName"=> $user1->username,
               "status"=> 0,
               "updatedAt"=>$requestRFP->updated_at,
               "title"=> "RFP Request",
               'senderImg'=>$user1->photoURL?'/Attachments/User/'.$user1->id.'/profile'.'/'.$user1->photoURL:null,
             );

       MessageController::notificationSend($msg);
    }
   

    public function ApproveRFPRequest(Request $request){
        // try{
             $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'request_rfp_id'=>'required|numeric|exists:request_r_f_p_s,id',
                 'request_rfp_status_id'=>'required|numeric|exists:request_r_f_p_statuses,id',

                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            $requestapproveid = RequestRFPToApprove::where('request_rfp_id',$request->request_rfp_id)
            ->where('manager_approve_id',Auth::guard('user_api')->user()->id)->where('status',0)->first();
 
            if(!empty($requestapproveid->id)){
                
            if($request->request_rfp_status_id==2){
                $validator = Validator::make($request->all(), [
                    'approval_ids'=>'required',
                ]);
                  if ($validator->fails()) {
                      return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
                  }
                  $request_rfp =RequestRFPToApprove::where('request_rfp_id',$request->request_rfp_id)->where('status',0)->get();
                  if(!empty($request_rfp[0]->id)){
                      foreach ($request_rfp as  $value) {
                          $value->update([    
                              'status'=>1
                          ]);
                      }
                  }
                  if(!empty($request->approval_ids)){
                    $validator = Validator::make($request->all(), [
                      //  'request_poc_process'=>'required|array',
                    ]);
                    if ($validator->fails()) {
                        return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
                    }
                    $requestRFP = RequestRFP::where('id',$request->request_rfp_id)->first();

                    foreach (explode(',', $request->approval_ids)  as $dep) { 
                        RequestRFPToApprove::create([
                            'request_rfp_id'=>$request->request_rfp_id,
                            'manager_approve_id'=>$dep,
                            'user_creator_id'=>Auth::guard('user_api')->user()->id,
                            'status'=>0,
                             ]);
                             $pending = RequestRFPToApprove::where('manager_approve_id',$dep)->where('status',0)->get()->count();

                             try{
                                $key =User::where('id',$dep)->first();
                                $this->CreateSendNotification(Auth::guard('user_api')->user(),$key,$requestRFP);
                                $msg = array(
                                    'myPendingRFPRequest'=>$pending
                                );
                                MessageController::updatedatafirebase($key->id,$msg);
                                }catch(\Exception $e){   
                                }
                       
                    }
 

                 
    
                }
                  
            }else{
                $request_rfp =RequestRFPToApprove::where('request_rfp_id',$request->request_rfp_id)->where('status',0)->get();

                if(!empty($request_rfp[0]->id)){
                    foreach ($request_rfp as  $value) {
                        $value->update([    
                            'status'=>1
                        ]);
                    }
                }
                foreach($request_rfp as $dep){

                    $pending = RequestRFPToApprove::where('manager_approve_id',$dep->manager_approve_id)->where('status',0)->get()->count();
    
                    try{
                        $key =User::where('id',$dep->manager_approve_id)->first();

                       $this->CreateSendNotification(Auth::guard('user_api')->user(),$key,$requestRFP);
                       $msg = array(
                           'myPendingRFPRequest'=>$pending
                       );
                       MessageController::updatedatafirebase($key->id,$msg);
                       }catch(\Exception $e){   
                       }
                }
                
            }
            
            RequestRFPAction::create([
                'request_rfp_status_id'=>$request->request_rfp_status_id,
                'request_rfp_approve_id'=>$requestapproveid->id,
                'comment'=>!empty($request->comment)?$request->comment:null,
            ]);
           $request_rfp=  RequestRFP::where('id',$request->request_rfp_id)->first();
            $request_rfp->update([
                'request_rfp_status_id'=>$request->request_rfp_status_id
            ]);
            
        }else{
            return ResponseApi::notFoundResponse(['message'=>"Manager Not Found To Approve Request"],"Empty",200);

        }
     
         // }catch(\Exception $e){
         //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
         // }
         
     }

    


    public function GetSpecificContactLeadRequestRFP(Request $request){
        // try{
             $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'contact_lead_id'=>'required|numeric|exists:contact_leads,id'
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            
           $ticketStatus = RequestRFP::where('contact_lead_id',$request->contact_lead_id)->get();
           if(!empty($ticketStatus[0]->id)){
             foreach($ticketStatus as $dep){
                 $array_reponse[] =$this->CastArrayRFP($dep);
 
         }
             return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
 
           }else{
             return ResponseApi::notFoundResponse(['message'=>"Empty RFP Request"],"Empty",200);
 
           }
         // }catch(\Exception $e){
         //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         // }
         
     }


    public function GetMyPendingRFPRequest(Request $request){
       // try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
               ]);
           if ($validator->fails()) {
   
               return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
           }

           $request_rfp =RequestRFPToApprove::where('manager_approve_id',Auth::guard('user_api')->user()->id)->where('status',0)->get();

           if(!empty($request_rfp[0]->id)){
            
                foreach($request_rfp as $dep){
                    $ticketStatus = RequestRFP::where('id',$dep->request_rfp_id)->first();
                    if(!empty($ticketStatus->id))
                    $array_reponse[] =$this->CastArrayRFP($ticketStatus);
                    }
                    return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
                }else{
                    return ResponseApi::notFoundResponse(['message'=>"Empty RFP Request"],"Empty",200);

                }
           
        
          
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
        // }
        
    }


    public function CastArrayRFP(RequestRFP $dep){
        $attach =   RequestRFPAttach::where('request_rfp_id',$dep->id)->get();
        $pending_on = RequestRFPToApprove::where('status',0)->where('request_rfp_id',$dep->id)->get();
        
        $pending =[];
        $pending_name=[];
        foreach($pending_on as $dep2){
            $pending[]=$dep2->manager_approve_id;
            $pending_name[]=!empty($dep2->manager_approve_id)?$dep2->manager_approve_id_fun->username:null;
        }
        $action_history = RequestRFPAction::whereHas('request_rfp_approve_id_fun',function($q) use($dep){
            $q->where('request_rfp_id',$dep->id);
        })->get();
        $array_reponse_history=[];
    
        foreach($action_history as $history){
            $array_reponse_attach = [];
              
            if(!empty($history->request_rfp_approve_id_fun->user_creator_id_fun)&&!empty($history->request_rfp_approve_id_fun->manager_approve_id_fun)){

                $array_reponse_history [] =[
                    'request_rfp_status_id'=>$history->request_rfp_status_id,
                    'request_rfp_status_name'=>!empty($history->request_rfp_status_id)?$history->request_rfp_status_id_fun->request_rfp_status:null,
    
                    'request_rfp_approve_id'=>$history->request_rfp_approve_id,
                    'comment'=>$history->comment,
                    'created_at'=>$history->created_at,
                    'user_creator_id'=>$history->request_rfp_approve_id_fun->user_creator_id,
                    'user_creator_name'=>$history->request_rfp_approve_id_fun->user_creator_id_fun->username,
                    'user_creator_photo_url'=>!empty($history->request_rfp_approve_id_fun->user_creator_id_fun->photoURL)?'/Attachments/User/'.$history->request_rfp_approve_id_fun->user_creator_id.'/profile'.'/'.$history->request_rfp_approve_id_fun->user_creator_id_fun->photoURL:null,
    
                    'manager_approve_id'=>$history->request_rfp_approve_id_fun->manager_approve_id,
                    'manager_approve_name'=>$history->request_rfp_approve_id_fun->manager_approve_id_fun->username,
                    'manager_approve_photo_url'=>!empty($history->request_rfp_approve_id_fun->manager_approve_id_fun->photoURL)?'/Attachments/User/'.$history->request_rfp_approve_id_fun->manager_approve_id.'/profile'.'/'.$history->request_rfp_approve_id_fun->manager_approve_id_fun->photoURL:null,
    
                ];
            }
        }

    
      $array_reponse_attach = [];
      foreach($attach as $attaches){
        $array_reponse_attach[]=[
            'request_rfp_attach_link'=>'/Attachments/RequestRFP/'.$dep->id.'/'.$attaches->request_rfp_attach,

            'request_rfp_attach'=>$attaches->request_rfp_attach,

            'user_creator_id'=>$dep->user_creator_id,
            'user_creator_name'=>$dep->user_creator_id_fun->username,
            'created_at'=>$attaches->created_at
    
        ];
      }
    //   if($dep->request_rfp_status_id==1 || $dep->request_rfp_status_id==4){
    //     $manager = RequestRFPAction::where('request_rfp_approve_id_fun.request_rfp_id',$dep->id)
    //     ->where('request_rfp_approve_id_fun.status',1)->where('request_rfp_status_id',$dep->request_rfp_status_id)->orderBy('desc')->first();
    //   }else{
    //     $manger = RequestRFPAction::where('request_rfp_approve_id_fun.request_rfp_id',$dep->id)
    //     ->where('request_rfp_approve_id_fun.status',1)->where('request_rfp_status_id',$dep->request_rfp_status_id)->orderBy('desc')->first();
    //   }
        $array_reponse = [
            'request_rfp_title'=>$dep->request_rfp_title,
            'contact_lead_id'=>$dep->contact_lead_id,
            'contact_lead_name'=>$dep->contact_lead_id_fun->title,
            'user_creator_id'=>$dep->user_creator_id,
            'user_creator_name'=>$dep->user_creator_id_fun->username,
            'user_creator_photo_url'=>$dep->user_creator_id_fun->photoURL?'/Attachments/User/'.$dep->user_creator_id.'/profile'.'/'.$dep->user_creator_id_fun->photoURL:null,
            'request_rfp_status_id'=>$dep->request_rfp_status_id,
            'request_rfp_status_name'=>!empty($dep->request_rfp_status_id)?$dep->request_rfp_status_id_fun->request_rfp_status:null,
            'comment'=>$dep->comment,
            'created_at'=>$dep->created_at,
            'pending'=>$pending,
            'id'=>$dep->id.'',
            'pending_name'=>$pending_name,
            'product_id'=>!empty($dep->contact_lead_id_fun)?$dep->contact_lead_id_fun->product_id:null,
            'product_name'=>!empty($dep->contact_lead_id_fun->product_id)?$dep->contact_lead_id_fun->product_id_fun->product_name:null,
            'product_id'=>!empty($dep->contact_lead_id_fun)?$dep->contact_lead_id_fun->product_id:null,

         

            'request_rfp_attach'=>$array_reponse_attach,
            'history'=>$array_reponse_history,

        ];
        return $array_reponse;
    }


    
    public function GetAllRFPRequest(){
        //  try{
            $ticketStatus = RequestRFP::all();
            if(!empty($ticketStatus[0]->id)){
              foreach($ticketStatus as $dep){
               $array_reponse[] =$this->CastArrayRFP($dep);
              }
              return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
  
            }else{
              return ResponseApi::notFoundResponse(['message'=>"Empty RFP Request"],"Empty",200);
  
            }
               
          // }catch(\Exception $e){
          //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
  
          // }
          
      }
  

    public function GetMyPendingRFPRequestSales(Request $request){
        //  try{
            $validator = Validator::make($request->all(), [
                'token' => 'required|string',
            ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(), "Validator Errors", 400);
            }

            $ticketStatus = RequestRFP::where('user_creator_id',Auth::guard('user_api')->user()->id)->where('request_rfp_status_id',2)->get();
            if(!empty($ticketStatus[0]->id)){
              foreach($ticketStatus as $dep){
               $array_reponse[] =$this->CastArrayRFP($dep);
              }
              return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
  
            }else{
              return ResponseApi::notFoundResponse(['message'=>"Empty RFP Request"],"Empty",200);
  
            }
               
          // }catch(\Exception $e){
          //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
  
          // }
    }


    public function DeleteRFPRequest(Request $request)
    {
        //try {
            $validator = Validator::make($request->all(), [
                'token' => 'required|string',
                'request_rfp_id'=>'required|numeric|exists:request_r_f_p_s,id',
            ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(), "Validator Errors", 400);
            }

            $phoneType = RequestRFP::where('id', $request->request_rfp_id)->first();
            $phoneType2 = RequestRFPAction::where('request_rfp_approve_id_fun.request_rfp_id', $request->request_rfp_id)->first();
            if (!empty($phoneType->id)&&empty($phoneType2->id)) {
                $phoneType->delete();
                return ResponseApi::acceptedResponseApi(["message" => "Deleted Success"], "success", 201);

            } else {
                return ResponseApi::badMethodErrorResponse(['message' => "RFP Request Can't Delete it "], "Validator Errors", 400);

            }

        // } catch (\Exception $e) {
        //     return ResponseApi::badMethodErrorResponse(['message' => "Server Error"], "server Error", 500);

        // }
    }

    public function UpdateRFPRequest(Request $request)
    {
        //try {
            $validator = Validator::make($request->all(), [
                'token' => 'required|string',
                'request_rfp_id'=>'required|numeric|exists:request_r_f_p_s,id',
            ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(), "Validator Errors", 400);
            }

            $phoneType = RequestRFP::where('id', $request->request_rfp_id)->first();
            if (!empty($phoneType->id)) {
                if(!empty($request->approval_ids)){
                    $validator = Validator::make($request->all(), [
                      //  'request_poc_process'=>'required|array',
                    ]);
                    if ($validator->fails()) {
                        return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
                    }
                    $requestApprove = RequestRFPToApprove::where('request_rfp_id',$request->request_rfp_id)->where('status',0)->get();
                    foreach ($requestApprove as $value) {
                        $value->delete();
                        # code...
                    }
                    

                    foreach (explode(',', $request->approval_ids)  as $dep) { 
                        $requestApprove = RequestRFPToApprove::where('request_rfp_id',$request->request_rfp_id)
                        ->where('manager_approve_id',$dep)->where('status',0)->withTrashed()->first();

                        if(!empty($requestApprove->id)){
                            $requestApprove->restore();
                        }else{
                            
                            RequestRFPToApprove::create([
                                'request_rfp_id'=>$phoneType->id,
                                'manager_approve_id'=>$dep,
                                'user_creator_id'=>Auth::guard('user_api')->user()->id,
                                'status'=>0,
                                 ]);

                                 $pending = RequestRFPToApprove::where('manager_approve_id',$dep)->where('status',0)->get()->count();
            
                           try{
                                $key =User::where('id',$dep)->first();
        
                               $this->CreateSendNotification(Auth::guard('user_api')->user(),$key,$phoneType);
                               $msg = array(
                                   'myPendingRFPRequest'=>$pending
                               );
                               MessageController::updatedatafirebase($key->id,$msg);
                                }catch(\Exception $e){   
                                }
                        }
            
                       
                    }
 
                    

                 
    
                }

                if (!empty($request->request_rfp_attach) ) {

                    foreach($request->request_rfp_attach as $key){
                        $image = $key;
                        $file_name = $image->getClientOriginalName();
                        //  return $request->photoURL;
                      //  $random = Str::random(10);
                        //$file_name = $random;
                        $attached = RequestRFPAttach::where('request_rfp_id',$request->request_rfp_id)->get();
                        if(!empty($attached[0])){
                            foreach ($variable as  $value) {
                                $image_path ='Attachments/RequestRFP/'.$value->request_rfp_id.'/'. $value->request_rfp_attach;
                                if(File::exists($image_path)) {
                                    File::delete($image_path);
                                }
                                $value->delete();
                            }
                        }
                        $attached =RequestRFPAttach::create([
                           'request_rfp_id'=>$phoneType->id,
                           'request_rfp_attach'=>$file_name,
                           'user_creator_id'=>Auth::guard('user_api')->user()->id,
                        ]);
                       
                        $image->move(('Attachments/RequestRFP/'.$phoneType->id.'/'), $file_name);
                    }
               }



                $phoneType->update(
                    $request->all()
                );
                return ResponseApi::acceptedResponseApi(["message" => "Deleted Success"], "success", 201);

            } else {
                return ResponseApi::badMethodErrorResponse(['message' => "Request not found"], "Validator Errors", 400);

            }

        // } catch (\Exception $e) {
        //     return ResponseApi::badMethodErrorResponse(['message' => "Server Error"], "server Error", 500);

        // }
    }

    public function CreateRFPRequest(Request $request){
        // try{
          
             $validator = Validator::make($request->all(), [
                'request_rfp_title'=>'required|string',
                'comment'=>'required|string',
                'token'=>'required|string',
                 'contact_lead_id'=>'required|numeric|exists:contact_leads,id',
           //      'request_rfp_status_id'=>'required|numeric|exists:request_r_f_p_statuses,id',
                 'approval_ids'=>'required',
             ]);
             if ($validator->fails()) {
                 return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
             }
                $phoneType=  RequestRFP::create([
                    'request_rfp_title'=>$request->request_rfp_title,
                    'contact_lead_id'=>$request->contact_lead_id,
                    'user_creator_id'=>Auth::guard('user_api')->user()->id,
                    'request_rfp_status_id'=>2,
                    'comment'=>$request->comment,
                    
                ]);
         if(!empty($phoneType->id)){
             //add process here
             if(!empty($request->approval_ids)){
                 $validator = Validator::make($request->all(), [
                   //  'request_poc_process'=>'required|array',
                 ]);
                 if ($validator->fails()) {
                     return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
                 }
                 
                 foreach (explode(',', $request->approval_ids)  as $dep) { 
            
                     RequestRFPToApprove::create([
                        'request_rfp_id'=>$phoneType->id,
                        'manager_approve_id'=>$dep,
                        'user_creator_id'=>Auth::guard('user_api')->user()->id,
                        'status'=>0,
                         ]);

                            $pending = RequestRFPToApprove::where('manager_approve_id',$dep)->where('status',0)->get()->count();
            
                          //  try{
                                $key =User::where('id',$dep)->first();
        
                               $this->CreateSendNotification(Auth::guard('user_api')->user(),$key,$phoneType);
                               $msg = array(
                                   'myPendingRFPRequest'=>$pending
                               );
                               MessageController::updatedatafirebase($key->id,$msg);
                            //    }catch(\Exception $e){   
                            //    }
                        


                 }
 
             }
             
            //  if($request->request_poc_status_id==2){
            //      $users = User::where('sub_departments_id',5)->get();
            //      $pending = RequestPoc::where('request_poc_status_id',2)->get()->count();
                 
            //      foreach ($users as $key) {
            //          try{
            //              $this->CreateSendNotification(Auth::guard('user_api')->user(),$key,$phoneType);
            //              $msg = array(
            //                  'myPendingPOCRequest'=>$pending
            //              );
            //              MessageController::updatedatafirebase($key->id,$msg);
            //              }catch(\Exception $e){   
            //              }
            //      }
            //  }else if($request->request_poc_status_id==3){
            //      $pending = RequestPoc::where('request_poc_status_id',3)->get()->count();
            //      $users = User::where('sub_departments_id',6)->get();
            //      foreach ($users as $key) {
            //          try{
            //              $this->CreateSendNotification(Auth::guard('user_api')->user(),$key,$phoneType);
            //              $msg = array(
            //                  'myPendingPOCRequest'=>$pending
            //              );
            //              MessageController::updatedatafirebase($key->id,$msg);
            //              }catch(\Exception $e){   
            //              }
            //      }
            //  }
 
             if (!empty($request->request_rfp_attach) ) {
                
 
                 foreach($request->request_rfp_attach as $key){
                     $image = $key;
                     $file_name = $image->getClientOriginalName();
                     //  return $request->photoURL;
                   //  $random = Str::random(10);
                     //$file_name = $random;
                     $attached =RequestRFPAttach::create([
                        'request_rfp_id'=>$phoneType->id,
                        'request_rfp_attach'=>$file_name,
                        'user_creator_id'=>Auth::guard('user_api')->user()->id,
                     ]);
                    
                     $image->move(('Attachments/RequestRFP/'.$phoneType->id.'/'), $file_name);
                 }
            }
             return ResponseApi::acceptedResponseApi($phoneType,"success",201);
         }else{
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
         }
         // }catch(\Exception $e){
         //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         // }
         
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
     * @param  \App\Models\RequestRFP  $requestRFP
     * @return \Illuminate\Http\Response
     */
    public function show(RequestRFP $requestRFP)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\RequestRFP  $requestRFP
     * @return \Illuminate\Http\Response
     */
    public function edit(RequestRFP $requestRFP)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\RequestRFP  $requestRFP
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, RequestRFP $requestRFP)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\RequestRFP  $requestRFP
     * @return \Illuminate\Http\Response
     */
    public function destroy(RequestRFP $requestRFP)
    {
        //
    }
}
