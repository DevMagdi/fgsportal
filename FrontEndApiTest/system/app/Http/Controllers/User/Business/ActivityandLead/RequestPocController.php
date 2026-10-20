<?php


namespace App\Http\Controllers\User\Business\ActivityandLead;
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
use App\Models\RequestPOCStatus;
use App\Models\RequestPoc;
use App\Models\RequestPocProcess;
use App\Models\ProjectTeam;

use App\Models\RequestPocAction;
use App\Models\RequestPocAttach;
use App\Models\Project;
use App\Models\RequestPocActionAttach;
use App\Http\Controllers\ApiMessage\MessageController;
use Illuminate\Support\Str;
use Carbon\Carbon;
class RequestPocController extends Controller
{



    
    public function UpdatePOCRequest(Request $request)
    {
        //try {
            $validator = Validator::make($request->all(), [
                'token' => 'required|string',
                'request_poc_id'=>'required|numeric|exists:request_pocs,id',
            ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(), "Validator Errors", 400);
            }

            $phoneType = RequestPoc::where('id', $request->request_poc_id)->first();
            if (!empty($phoneType->id)) {
             
                $phoneType->update(
                    $request->all()
                );

                return ResponseApi::acceptedResponseApi(["message" => "Deleted Success"], "success", 201);

            } else {
                return ResponseApi::badMethodErrorResponse(['message' => "Contact Lead not found"], "Validator Errors", 400);

            }

        // } catch (\Exception $e) {
        //     return ResponseApi::badMethodErrorResponse(['message' => "Server Error"], "server Error", 500);

        // }
    }
    
    public function DeletePOCRequest(Request $request)
    {
        //try {
            $validator = Validator::make($request->all(), [
                'token' => 'required|string',
                'request_poc_id'=>'required|numeric|exists:request_pocs,id',
            ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(), "Validator Errors", 400);
            }

            $phoneType = RequestPoc::where('id', $request->request_poc_id)->first();
            $phoneType2 = RequestPocAction::where('request_poc_id', $request->request_poc_id)->first();
            if (!empty($phoneType->id)&&empty($phoneType2->id)) {
             
                $phoneType->delete();

                return ResponseApi::acceptedResponseApi(["message" => "Deleted Success"], "success", 201);

            } else {
                return ResponseApi::badMethodErrorResponse(['message' => "Contact Lead not found"], "Validator Errors", 400);

            }

        // } catch (\Exception $e) {
        //     return ResponseApi::badMethodErrorResponse(['message' => "Server Error"], "server Error", 500);

        // }
    }



    public function ApprovalSendNotification(User $user1 , User $user2,RequestPoc $poc){
        $msg = array
             (
               "body"=>  $user1->username . " Make Poc Request ".$poc->request_poc_title." " . $poc->request_poc_status_id_fun->reqeust_poc_status_name ,
               "createdAt"=>Carbon::now(),
               "receverKey"=> $user2->id.'',
               "receverName"=> $user2->username,
               "redirection"=> "/CRM/leads/".$poc->contact_lead_id."?active=1",
               "senderKey"=> $user1->id.'',
               "senderName"=> $user1->username,
               "status"=> 0,
               "updatedAt"=>$poc->updated_at,
               "title"=> "POC Request",
               'senderImg'=>$user1->photoURL?'/Attachments/User/'.$user1->id.'/profile'.'/'.$user1->photoURL:null,
             );

       MessageController::notificationSend($msg);
    }
    public function CreateSendNotification(User $user1 , User $user2,RequestPoc $poc){
        $msg = array
             (
               "body"=>  $user1->username . " Make Poc Request ".$poc->request_poc_title." " . $poc->request_poc_status_id_fun->reqeust_poc_status_name ,
               "createdAt"=>Carbon::now(),
               "receverKey"=> $user2->id.'',
               "receverName"=> $user2->username,
               "redirection"=> "/CRM/leads/".$poc->contact_lead_id."?active=1",
               "senderKey"=> $user1->id.'',
               "senderName"=> $user1->username,
               "status"=> 0,
               "updatedAt"=>$poc->updated_at,
               "title"=> "POC Request",
               'senderImg'=>$user1->photoURL?'/Attachments/User/'.$user1->id.'/profile'.'/'.$user1->photoURL:null,
             );

       MessageController::notificationSend($msg);
    }
    
      
    public function CastArrayPoc(RequestPoc $dep){
        $attach =   RequestPocAttach::where('request_poc_id',$dep->id)->get();
        $process =   RequestPocProcess::where('request_poc_id',$dep->id)->get();
        $action_history = RequestPocAction::where('request_poc_id',$dep->id)->get();
        $array_reponse_history=[];
        $process_list=[];
        foreach ($process as $key) {
            $process_list[]=[
                'process_title'=>$key->process_title,
                'process_description'=>$key->process_description,
                'process_department'=>$key->process_department,
            ];
        }
        foreach($action_history as $history){
            $array_reponse_attach = [];
            $action_attach = RequestPocActionAttach::where('request_poc_action_id',$history->id)->get();
            foreach($action_attach as $attaches){
                $array_reponse_attach[]=[
                    'request_poc_attach_link'=>'/Attachments/RequestPOC/'.$dep->id.'/action'.'/'.$history->id.'/'.$attaches->request_poc_attach,
                    'request_poc_attach_name'=>$attaches->request_poc_attach,
                    'created_at'=>$attaches->created_at
                ];
              }
              
            $array_reponse_history [] =[
                 'user_creator_id'=>$history->user_creator_id,
                'user_creator_name'=>$history->user_creator_id_fun->username,
                'request_poc_status_id'=>$history->request_poc_status_id,
                'request_poc_status_name'=>!empty($history->request_poc_status_id)?$history->request_poc_status_id_fun->reqeust_poc_status_name:null,
                'request_poc_priority_name'=>!empty($history->request_poc_priority_id)?$history->request_poc_priority_id_fun->reqeust_poc_priority_name:null,
                'request_poc_priority_id'=>$history->request_poc_priority_id,
                'comment'=>$history->comment,
                'poc_action_attach'=>$array_reponse_attach,
                'created_at'=>$history->created_at,
                'user_creator_photo_url'=>!empty($history->user_creator_id_fun->photoURL)?'/Attachments/User/'.$history->user_creator_id.'/profile'.'/'.$history->user_creator_id_fun->photoURL:null,

            ];
        }

      
      $array_reponse_attach = [];
      foreach($attach as $attaches){
        $array_reponse_attach[]=[
            'request_poc_attach_link'=>'/Attachments/RequestPOC/'.$dep->id.'/'.$attaches->request_poc_attach,
            'request_poc_attach_name'=>$attaches->request_poc_attach,
            'user_creator_id'=>$dep->user_creator_id,
            'user_creator_name'=>$dep->user_creator_id_fun->username,
            'created_at'=>$attaches->created_at
        ];
      }
        $array_reponse = [
            'contact_lead_id'=>$dep->contact_lead_id,
            'contact_lead_name'=>$dep->contact_lead_id_fun->title,
            'user_creator_id'=>$dep->user_creator_id,
            'user_creator_name'=>$dep->user_creator_id_fun->username,
            'user_creator_photo_url'=>!empty($dep->user_creator_id_fun->photoURL)?'/Attachments/User/'.$dep->user_creator_id.'/profile'.'/'.$dep->user_creator_id_fun->photoURL:null,
            'created_at'=>$dep->created_at,
            'request_poc_status_id'=>$dep->request_poc_status_id,
            'request_poc_priority_id'=>$dep->request_poc_priority_id,
            'request_poc_status_name'=>!empty($dep->request_poc_status_id)?$dep->request_poc_status_id_fun->reqeust_poc_status_name:null,
            'request_poc_priority_name'=>!empty($dep->request_poc_priority_id)?$dep->request_poc_priority_id_fun->reqeust_poc_priority_name:null,
            'product_id'=>$dep->product_id,
            'product_name'=>!empty($dep->product_id)?$dep->product_id_fun->product_name:null,
            'project_id'=>$dep->project_id,
            'project_name'=>!empty($dep->project_id)?$dep->project_id_fun->project_title:null,
            'description'=>$dep->description,
            'manager_approve_id'=>$dep->manager_approve_id,
            'manager_approve_name'=>!empty($dep->manager_approve_id)?$dep->manager_approve_id_fun->username:null,
            'request_poc_title'=>$dep->request_poc_title,
            'id'=>$dep->id.'',
            'request_poc_attach'=>$array_reponse_attach,
            'history'=>$array_reponse_history,
            'request_poc_process'=>$process_list

        ];
        return $array_reponse;
    }


//done
    public function CreateRequestPOC(Request $request){
       // try{
            $validator = Validator::make($request->all(), [
                'request_poc_title'=>'required|string',
                'token'=>'required|string',
                'contact_lead_id'=>'required|numeric|exists:contact_leads,id',
                'request_poc_status_id'=>'required|numeric|exists:request_p_o_c_statuses,id',
                'request_poc_priority_id'=>'required|numeric|exists:request_p_o_c_priorities,id',
            ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }
          $phoneType=  RequestPoc::create([
            'request_poc_title'=>$request->request_poc_title,
            'contact_lead_id'=>$request->contact_lead_id,
            'user_creator_id'=>Auth::guard('user_api')->user()->id,
            'request_poc_status_id'=>$request->request_poc_status_id,
            'request_poc_priority_id'=>$request->request_poc_priority_id,
            'product_id'=>!empty($request->product_id)?$request->product_id:null,
            'project_id'=>!empty($request->project_id)?$request->project_id:null,
            'description'=>!empty($request->description)?$request->description:null,
            'manager_approve_id'=>!empty($request->manager_approve_id)?$request->manager_approve_id:null,
            
        ]);
        if(!empty($phoneType->id)){
            //add process here
            if(!empty($request->request_poc_process)){
                $validator = Validator::make($request->all(), [
                  //  'request_poc_process'=>'required|array',
                ]);
                if ($validator->fails()) {
                    return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
                }
                

                foreach ($request->request_poc_process as $dep) { 
                    $dep = json_decode($dep, true);

                         RequestPocProcess::create([
                            'process_title'=>$dep['process_title'],
                            'process_department'=>$dep['process_department'],
                            'process_description'=>$dep['process_description'],
                            'request_poc_id'=>$phoneType->id,
                        ]);
                    
                }

            }
            
            if($request->request_poc_status_id==2){
                $users = User::where('sub_departments_id',5)->get();
                $pending = RequestPoc::where('request_poc_status_id',2)->get()->count();
                
                foreach ($users as $key) {
                    try{
                        $this->CreateSendNotification(Auth::guard('user_api')->user(),$key,$phoneType);
                        $msg = array(
                            'myPendingPOCRequest'=>$pending
                        );
                        MessageController::updatedatafirebase($key->id,$msg);
                        }catch(\Exception $e){   
                        }
                }
            }else if($request->request_poc_status_id==3){
                $pending = RequestPoc::where('request_poc_status_id',3)->get()->count();
                $users = User::where('sub_departments_id',6)->get();
                foreach ($users as $key) {
                    try{
                        $this->CreateSendNotification(Auth::guard('user_api')->user(),$key,$phoneType);
                        $msg = array(
                            'myPendingPOCRequest'=>$pending
                        );
                        MessageController::updatedatafirebase($key->id,$msg);
                        }catch(\Exception $e){   
                        }
                }
            }

            if (!empty($request->request_poc_attach) ) {
                

                foreach($request->request_poc_attach as $key){
                    $image = $key;
                    $file_name = $image->getClientOriginalName();
                    //  return $request->photoURL;
                  //  $random = Str::random(10);
                    //$file_name = $random;
                    $attached =RequestPocAttach::create([
                        'request_poc_id'=>$phoneType->id,
                        'request_poc_attach'=>$file_name,
                    ]);
                   
                    $image->move(('Attachments/RequestPOC/'.$phoneType->id.'/'), $file_name);
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

    public function TakeRequestPOCAction(Request $request){
      //  try{
            $validator = Validator::make($request->all(), [
                'request_poc_id'=>'required|numeric|exists:request_pocs,id',
                'token'=>'required|string',
                'request_poc_status_id'=>'required|numeric|exists:request_p_o_c_statuses,id',
                'request_poc_priority_id'=>'required|numeric|exists:request_p_o_c_priorities,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }
          $phoneType=  RequestPocAction::create([
            'request_poc_id'=>$request->request_poc_id,
            'user_creator_id'=>Auth::guard('user_api')->user()->id,
            'request_poc_status_id'=>$request->request_poc_status_id,
            'request_poc_priority_id'=>$request->request_poc_priority_id,
            'comment'=>!empty($request->comment)?$request->comment:null,
         ]);
         $poc_request = RequestPoc::where('id',$request->request_poc_id)->first();
        if(!empty($phoneType->id)){
            $poc_request->update([
                'request_poc_status_id'=>$request->request_poc_status_id,
                'request_poc_priority_id'=>$request->request_poc_priority_id,        
            ]);
            $poc_request = RequestPoc::where('id',$request->request_poc_id)->first();

            if($request->request_poc_status_id==2){
                $users = User::where('sub_departments_id',5)->get();
                $pending = RequestPoc::where('request_poc_status_id',2)->get()->count();
                
                foreach ($users as $key) {
                    try{
                        $this->CreateSendNotification(Auth::guard('user_api')->user(),$key,$poc_request);
                        $msg = array(
                            'myPendingPOCRequest'=>$pending
                        );
                        MessageController::updatedatafirebase($key->id,$msg);
                        }catch(\Exception $e){   
                        }
                }
                $pending = RequestPoc::where('request_poc_status_id',3)->get()->count();
                $users = User::where('sub_departments_id',6)->get();
                foreach ($users as $key) {
                    try{
                        $msg = array(
                            'myPendingPOCRequest'=>$pending
                        );
                        MessageController::updatedatafirebase($key->id,$msg);
                        }catch(\Exception $e){   
                        }
                }
                try{
                    $user_details = User::where('id',$poc_request->user_creator_id)->first();
                    $this->CreateSendNotification(Auth::guard('user_api')->user(),$user_details,$poc_request);
                    
                    }catch(\Exception $e){   
                        

                    }
            }else if($request->request_poc_status_id==4||$request->request_poc_status_id==5){
                $pending = RequestPoc::where('request_poc_status_id',2)->get()->count();
                $users = User::where('sub_departments_id',5)->get();
                foreach ($users as $key) {
                    try{
                        $msg = array(
                            'myPendingPOCRequest'=>$pending
                        );
                        MessageController::updatedatafirebase($key->id,$msg);
                        }catch(\Exception $e){   
                        }
                }
                $pending = RequestPoc::where('request_poc_status_id',3)->get()->count();
                $users = User::where('sub_departments_id',6)->get();
                foreach ($users as $key) {
                    try{
                        $msg = array(
                            'myPendingPOCRequest'=>$pending
                        );
                        MessageController::updatedatafirebase($key->id,$msg);
                        }catch(\Exception $e){   
                        }
                }

                try{
                    $user_details = User::where('id',$poc_request->user_creator_id)->first();
                    $this->CreateSendNotification(Auth::guard('user_api')->user(),$user_details,$poc_request);
                    }catch(\Exception $e){   
                        return "error ".$e;
                    }
                }else if($request->request_poc_status_id==3){
                    $pending = RequestPoc::where('request_poc_status_id',3)->get()->count();
                    $users = User::where('sub_departments_id',6)->get();
                    foreach ($users as $key) {
                        try{
                            $this->CreateSendNotification(Auth::guard('user_api')->user(),$key,$poc_request);
                            $msg = array(
                                'myPendingPOCRequest'=>$pending
                            );
                            MessageController::updatedatafirebase($key->id,$msg);
                            }catch(\Exception $e){   
                            }
                    }
                    $pending = RequestPoc::where('request_poc_status_id',2)->get()->count();
                    $users = User::where('sub_departments_id',5)->get();
                    foreach ($users as $key) {
                        try{
                            $msg = array(
                                'myPendingPOCRequest'=>$pending
                            );
                            MessageController::updatedatafirebase($key->id,$msg);
                            }catch(\Exception $e){   
                            }
                    }
    
                    try{
                        $user_details = User::where('id',$poc_request->user_creator_id)->first();
                        $this->CreateSendNotification(Auth::guard('user_api')->user(),$user_details,$poc_request);
                        
                        }catch(\Exception $e){   
                           
                        }
                        
                }

               
            if (!empty($request->poc_action_attach) ) {
                foreach($request->poc_action_attach as $key){

                    $image = $key;
                    $file_name = $image->getClientOriginalName();
                    //  return $request->photoURL;
                  //  $random = Str::random(10);
                    //$file_name = $random;
                    $id = $phoneType->id;
                    RequestPocActionAttach::create([ 
                        'request_poc_action_id'=>$phoneType->id,
                         'request_poc_attach'=>$file_name,

                    ]);
                    $phoneType->update([
                    ]);
                    $image->move(('Attachments/RequestPOC/'.$request->request_poc_id.'/action'.'/'.$id.'/'), $file_name);  
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
    

    public function GetAllPOCRequest(){
      //  try{
          $ticketStatus = RequestPoc::all();
          if(!empty($ticketStatus[0]->id)){
            foreach($ticketStatus as $dep){
             $array_reponse[] =$this->CastArrayPoc($dep);
            }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty POC Request"],"Empty",200);

          }
             
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
        
    }

    public function GetMyPOCRequest(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
               ]);
           if ($validator->fails()) {
   
               return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
           }
           
          $ticketStatus = RequestPoc::where('user_creator_id',Auth::guard('user_api')->user()->id)->get();
          if(!empty($ticketStatus[0]->id)){
            foreach($ticketStatus as $dep){
                $array_reponse[] =$this->CastArrayPoc($dep);

        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty POC Request"],"Empty",200);

          }
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetSpecificContactLeadRequest(Request $request){
       // try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'contact_lead_id'=>'required|numeric|exists:contact_leads,id'
               ]);
           if ($validator->fails()) {
   
               return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
           }
           
          $ticketStatus = RequestPoc::where('contact_lead_id',$request->contact_lead_id)->get();
          if(!empty($ticketStatus[0]->id)){
            foreach($ticketStatus as $dep){
                $array_reponse[] =$this->CastArrayPoc($dep);

        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty POC Request"],"Empty",200);

          }
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
        
    }

    public function GetMyPendingPocRequest(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
               ]);
           if ($validator->fails()) {
   
               return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
           }

           if(Auth::guard('user_api')->user()->sub_departments_id==5){
                    $ticketStatus = RequestPoc::where('request_poc_status_id',2)->get();
                    if(!empty($ticketStatus[0]->id)){
                    foreach($ticketStatus as $dep){
                        $array_reponse[] =$this->CastArrayPoc($dep);

                        }
                        return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
                    }else{
                        return ResponseApi::notFoundResponse(['message'=>"Empty POC Request"],"Empty",200);

                    }
        
           }elseif(Auth::guard('user_api')->user()->sub_departments_id==6){
            $ticketStatus = RequestPoc::where('request_poc_status_id',3)->get();
            if(!empty($ticketStatus[0]->id)){
            foreach($ticketStatus as $dep){
                $array_reponse[] =$this->CastArrayPoc($dep);

                }
                return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
            }else{
                return ResponseApi::notFoundResponse(['message'=>"Empty POC Request"],"Empty",200);

            }
           }else{
                $ticketStatus = RequestPoc::where('request_poc_status_id',4)->where('user_creator_id',Auth::guard('user_api')->user()->id)->get();
                if(!empty($ticketStatus[0]->id)){
                foreach($ticketStatus as $dep){
                    $array_reponse[] =$this->CastArrayPoc($dep);
                    }
                    return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
                }else{
                    return ResponseApi::notFoundResponse(['message'=>"Empty POC Request"],"Empty",200);

                }
           }
          
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
        }
        
    }
 

   






    public function ApproveRequestPOC(Request $request){
        // try{
         $validator = Validator::make($request->all(), [
             'token'=>'required|string',
             'contact_lead_id'=>'required|numeric|exists:contact_leads,id',
             'project_title' => 'required|string',
             'project_status_id' => 'required|numeric|exists:project_statuses,id',
             'partner_id' => 'required|numeric|exists:partners,id',
             'project_start_date' => 'required|date',
             'project_end_date' => 'required|date|after:project_start_date',
             'project_duration' => 'required|numeric',
           //  'process_details'=>'required',
             'request_poc_id'=>'required|numeric|exists:request_pocs,id',
         ]);
         if ($validator->fails()) {
             return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
         }
         $poc_request = RequestPoc::where('id',$request->request_poc_id)->first();

         $poc_action=  RequestPocAction::create([
            'request_poc_id'=>$request->request_poc_id,
            'user_creator_id'=>Auth::guard('user_api')->user()->id,
            'request_poc_status_id'=>1,//approved?
            'request_poc_priority_id'=>$poc_request->request_poc_priority_id,
            'comment'=>!empty($request->comment)?$request->comment:null,
         ]);

        if(!empty($poc_action->id)){
           
            //create Project
            $project=  Project::create([
                'project_title' =>$request->project_title,
                'project_progress' =>!empty($request->project_progress) ?$request->project_progress:0,
                'project_description' =>!empty($request->project_description)?$request->project_description:null,
                'project_duration' =>!empty($request->project_duration) ?$request->project_duration:0 ,
                'project_budget' =>!empty($request->project_budget) ? $request->project_budget : 0,
                'user_creator_id' =>Auth::guard('user_api')->user()->id,
                'project_type_id' =>1,
                 'project_status_id' =>$request->project_status_id,
                'partner_id' =>$request->partner_id,
                'project_start_date' => Carbon::createFromFormat('m/d/Y', $request-> project_start_date),
                'project_end_date' => Carbon::createFromFormat('m/d/Y', $request-> project_end_date),
               ]);
             if(!empty($project->id)){
                $poc_request->update([
                    'request_poc_status_id'=>$poc_action->request_poc_status_id,
                    'request_poc_priority_id'=>$poc_action->request_poc_priority_id,  
                    'manager_approve_id'=>$poc_action->user_creator_id,
                    'project_id'=>$project->id,
                ]);
                $poc_request = RequestPoc::where('id',$request->request_poc_id)->first();
             

                //pending 

                $pending = RequestPoc::where('request_poc_status_id',2)->get()->count();
                $users = User::where('sub_departments_id',5)->get();
                foreach ($users as $key) {
                    try{
                        $msg = array(
                            'myPendingPOCRequest'=>$pending
                        );
                        MessageController::updatedatafirebase($key->id,$msg);
                        }catch(\Exception $e){   
                        }
                }
                $pending = RequestPoc::where('request_poc_status_id',3)->get()->count();
                $users = User::where('sub_departments_id',6)->get();
                foreach ($users as $key) {
                    try{
                        $msg = array(
                            'myPendingPOCRequest'=>$pending
                        );
                        MessageController::updatedatafirebase($key->id,$msg);
                        }catch(\Exception $e){   
                        }
                }

                try{
                    $user_details = User::where('id',$poc_request->user_creator_id)->first();
                    $this->CreateSendNotification(Auth::guard('user_api')->user(),$user_details,$poc_request);
                    }catch(\Exception $e){   
                        return "error ".$e;
                    }






                    if(!empty($request->project_team)){
                        $project_team_array = $request->project_team;
        
                       // return $project_team_array;
                       $project_team_array = json_decode($project_team_array, true);
                        foreach($project_team_array as $team){

 
                            $validator = Validator::make((array)$team, [
                                'user_team_id' => 'required|numeric|exists:users,id',
                            'project_structure_id'=>'required|numeric|exists:project_structures,id'
                        ]);
                        if ($validator->fails()) {
                            
                            return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                        }
                    }
                    foreach($project_team_array as $team){
                    $existance = ProjectTeam::where('user_team_id',$team['user_team_id'])->where('project_structure_id',$team['project_structure_id'])
                    ->where('project_id',$project->id)->first();
                    if(empty($existance->id)){
                        $inserted[] = ProjectTeam::create([
                            'user_creator_id' =>Auth::guard('user_api')->user()->id,
                            'user_team_id'=>$team['user_team_id'],
                            'project_id'=>$project->id,
                            'project_structure_id'=>$team['project_structure_id'],
                        ]);
                    }
                    }
                }


                // process

                // 'process_description' => 'required|string',
                // 'process_status_id' => 'required|numeric|exists:process_statuses,id',
                // 'process_start_date' => 'required|date',
                // 'process_end_date' => 'required|date|after_or_equal:process_start_date',
                // 'process_duration' => 'required|numeric',
                // 'process_team'=>'required|array',
                // 'process_title' => 'required|string',


            //     foreach ($request->process_details as $dep) { 
            //         $dep = json_decode($dep, true);

            //              RequestPocProcess::create([
            //                 'process_title'=>$dep['process_title'],
            //                 'process_department'=>$dep['process_department'],
            //                 'process_description'=>$dep['process_description'],
            //                 'request_poc_id'=>$phoneType->id,
            //             ]);
                    
                

            //     $process_team_array =  $dep['process_team'] ;
  
            //     foreach($process_team_array as $team){
            //       $validator = Validator::make((array)$team, [
            //           'project_team_id' => 'required|numeric|exists:project_teams,id',
            //        ]);
            //       if ($validator->fails()) {
            //           return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            //       }
            //   }

            //   $process=  Process::create([
            //     'process_title' =>$dep['process_title'],
            //     'process_progress' =>!empty($dep['process_progress']) ?$dep['process_progress']:0,
            //     'process_description' =>$dep['process_description'],
            //     'process_duration' =>!empty($dep['process_duration'] )?$dep['process_duration']:0 ,
            //     'user_creator_id' =>Auth::guard('user_api')->user()->id,
            //     'process_status_id' =>$dep['process_status_id'],
            //     'project_id' =>$project->id,
            //     'process_start_date' => Carbon::createFromFormat('m/d/Y', $dep['process_start_date']),
            //     'process_end_date' => Carbon::createFromFormat('m/d/Y', $dep['process_end_date']),
            //    ]);

            //    foreach($process_team_array as $team){
            //     $existance = ProcessTeam::where('project_team_id',$team['project_team_id'])
            //     ->where('process_id',$process->id)->first();
            //     if(empty($existance->id)){
            //        $inserted[] = ProcessTeam::create([
            //             'user_creator_id' =>Auth::guard('user_api')->user()->id,
            //             'project_team_id'=>$team['project_team_id'],
            //             'process_id'=>$process->id,
            //          ]);
            //     }
            //   }




                }



            // }

/*
            if($request->request_poc_status_id==2){
                $users = User::where('sub_departments_id',5)->get();
                $pending = RequestPoc::where('request_poc_status_id',2)->get()->count();
                
                foreach ($users as $key) {
                    try{
                        $this->CreateSendNotification(Auth::guard('user_api')->user(),$key,$poc_request);
                        $msg = array(
                            'myPendingPOCRequest'=>$pending
                        );
                        MessageController::updatedatafirebase($key->id,$msg);
                        }catch(\Exception $e){   
                        }
                }
                $pending = RequestPoc::where('request_poc_status_id',3)->get()->count();
                $users = User::where('sub_departments_id',6)->get();
                foreach ($users as $key) {
                    try{
                        $msg = array(
                            'myPendingPOCRequest'=>$pending
                        );
                        MessageController::updatedatafirebase($key->id,$msg);
                        }catch(\Exception $e){   
                        }
                }
                try{
                    $user_details = User::where('id',$poc_request->user_creator_id)->first();
                    $this->CreateSendNotification(Auth::guard('user_api')->user(),$user_details,$poc_request);
                    
                    }catch(\Exception $e){   
                    }
            }else if($request->request_poc_status_id==4||$request->request_poc_status_id==5){
                $pending = RequestPoc::where('request_poc_status_id',2)->get()->count();
                $users = User::where('sub_departments_id',5)->get();
                foreach ($users as $key) {
                    try{
                        $msg = array(
                            'myPendingPOCRequest'=>$pending
                        );
                        MessageController::updatedatafirebase($key->id,$msg);
                        }catch(\Exception $e){   
                        }
                }
                $pending = RequestPoc::where('request_poc_status_id',3)->get()->count();
                $users = User::where('sub_departments_id',6)->get();
                foreach ($users as $key) {
                    try{
                        $msg = array(
                            'myPendingPOCRequest'=>$pending
                        );
                        MessageController::updatedatafirebase($key->id,$msg);
                        }catch(\Exception $e){   
                        }
                }

                try{
                    $user_details = User::where('id',$poc_request->user_creator_id)->first();
                    $this->CreateSendNotification(Auth::guard('user_api')->user(),$user_details,$poc_request);
                    
                    }catch(\Exception $e){   
                    }
                }else if($request->request_poc_status_id==3){
                    $pending = RequestPoc::where('request_poc_status_id',3)->get()->count();
                    $users = User::where('sub_departments_id',6)->get();
                    foreach ($users as $key) {
                        try{
                            $this->CreateSendNotification(Auth::guard('user_api')->user(),$key,$poc_request);
                            $msg = array(
                                'myPendingPOCRequest'=>$pending
                            );
                            MessageController::updatedatafirebase($key->id,$msg);
                            }catch(\Exception $e){   
                            }
                    }
                    $pending = RequestPoc::where('request_poc_status_id',2)->get()->count();
                    $users = User::where('sub_departments_id',5)->get();
                    foreach ($users as $key) {
                        try{
                            $msg = array(
                                'myPendingPOCRequest'=>$pending
                            );
                            MessageController::updatedatafirebase($key->id,$msg);
                            }catch(\Exception $e){   
                            }
                    }
    
                    try{
                        $user_details = User::where('id',$poc_request->user_creator_id)->first();
                        $this->CreateSendNotification(Auth::guard('user_api')->user(),$user_details,$poc_request);
                        
                        }catch(\Exception $e){   
                        }
                }


            if (!empty($request->poc_action_attach) ) {
                foreach($request->poc_action_attach as $key){

                    $random = Str::random(10);
                    $file_name = $random;
                    $id = $phoneType->id;
                    $phoneType->update([
                        'poc_action_attach'=>$file_name,
                    ]);
                    $image->move(('Attachments/RequestPOC/'.$request->request_poc_id.'/action'.'/'.$id.'/'), $file_name);  
                }
           }*/
            return ResponseApi::acceptedResponseApi($poc_request,"success",201);
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
     * @param  \App\Models\RequestPoc  $requestPoc
     * @return \Illuminate\Http\Response
     */
    public function show(RequestPoc $requestPoc)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\RequestPoc  $requestPoc
     * @return \Illuminate\Http\Response
     */
    public function edit(RequestPoc $requestPoc)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\RequestPoc  $requestPoc
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, RequestPoc $requestPoc)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\RequestPoc  $requestPoc
     * @return \Illuminate\Http\Response
     */
    public function destroy(RequestPoc $requestPoc)
    {
        //
    }
}
