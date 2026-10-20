<?php

namespace App\Http\Controllers\Client\TicketingSystem\Ticket;

use App\Http\Controllers\Controller;
  use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;


use App\Models\TicketTag;

use App\Models\TicketType;
use App\Models\TicketStatus;
use App\Models\TicketAttach;
use App\Models\Ticket;
use App\Models\ClientTicketUpdate;
use App\Models\ClientAccount;
use App\Models\DeveloperTicketAction;
use App\Models\ContractSupport;
use App\Models\UserPermissionGroup;
 use Carbon\Carbon;
 use Illuminate\Support\Facades\File;
 use Illuminate\Support\Str;
 use Illuminate\Support\Facades\Mail;
 use App\Models\User;

 use App\Mail\TicketClientOpen;
 use App\Mail\TicketUserOpen;
 use App\Mail\TicketUsernoAction;
 use App\Models\Log;
 use App\Http\Controllers\ApiMessage\MessageController;

 use Illuminate\Support\Facades\Auth;
class TicketController extends Controller
{
    public function EmployeeSendNotification(ClientAccount $user1 , User $user2,Ticket $report){
        $msg = array
             (
               "body"=>  "Your Ticket Created Successfully",
               "createdAt"=>Carbon::now(),
               "receverKey"=> $user2->id.'',
               "receverName"=> $user2->username,
               "redirection"=> "/tickets" ."/".$report->id,
               "senderKey"=> $user1->id.'',
               "senderName"=> $user1->fullname,
               "status"=> 0,
               "createdAt"=>Carbon::now(),
               "title"=> "New Ticket Open ". $report->title ,
               'senderImg' => $user1->partner_id?($user1->partner_id_fun->partner_photoURL?"Attachments/Client/Partner/" .  $user1->partner_id . '/' .$user1->partner_id_fun->partner_photoURL:null):null,

             );
       MessageController::notificationSend($msg);
   }
   public function ClientSendNotification(ClientAccount $user1 , ClientAccount $user2,Ticket $report){
    $msg = array
         (
            "body"=>  "Your Ticket Created Successfully",
            "createdAt"=>Carbon::now(),
            "receverKey"=> $user2->id.'',
           "receverName"=> $user2->fullname,
           "redirection"=> "/support/tickets/".$report->id,
           "senderKey"=> $user1->id.'',
           "senderName"=> $user1->fullname,
           "status"=> 0,
           "createdAt"=>Carbon::now(),
           "title"=> "New Ticket Open ". $report->title ,
           'senderImg' => $user1->partner_id?($user1->partner_id_fun->partner_photoURL?"Attachments/Client/Partner/" .  $user1->partner_id . '/' .$user1->partner_id_fun->partner_photoURL:null):null,
         );

   MessageController::notificationSendclient($msg);
}

    public function CastArraySpecificTicket(Ticket $ticket){
        $primary_contact = ClientAccount::where('partner_id',$ticket->partner_id)->where('primary',1)->first();
        $ticket_attach = TicketAttach::where('ticket_id',$ticket->id)->get();
        $array_reponse_attaches =[];
        foreach($ticket_attach as $attach){
            $array_reponse_attaches [] = 
            [
                'attach_link'=>'/Attachments/Client/Ticket/'.$ticket->id.'/'.$attach->id.'/'. $attach->ticket_attach,
                'attach_name'=>!empty($attach->attach_name)?$attach->attach_name:$attach->ticket_attach,
                'created_at'=>$attach->created_at,
            ];
        }
         $array_reponse =[
            'key'=>$ticket->id.'',

            'imagesURls'=>$array_reponse_attaches,
            'ticket_number'=>$ticket->ticket_number,
            'title'=>$ticket->title,
             'desc'=>$ticket->notes,
            'priority'=>$ticket->ticket_priority_id?strval($ticket->ticket_priority_id):null,
            'priority_name'=>$ticket->ticket_priority_id?$ticket->ticket_priority_id_fun->ticket_priority:null,
             
            'status'=>$ticket->ticket_status_id?strval($ticket->ticket_status_id):null,
            'status_name'=>$ticket->ticket_status_id?$ticket->ticket_status_id_fun->ticket_status_name:null,
        
            'ticketType'=>$ticket->ticket_type_id?strval($ticket->ticket_type_id):null,
            'ticketType_name'=>$ticket->ticket_type_id?$ticket->ticket_type_id_fun->ticket_type:null,

            'clientKey'=>!empty($ticket->contract_support_id)?$ticket->contract_support_id_fun->partner_id:null,
            'clientName'=>!empty($ticket->contract_support_id)?($ticket->contract_support_id_fun->partner_id_fun?$ticket->contract_support_id_fun->partner_id_fun->partner_name:null):null,
            'clientImgUrl' => !empty($ticket->contract_support_id)?($ticket->contract_support_id_fun->partner_id_fun->partner_photoURL?"Attachments/Client/Partner/" .  $ticket->contract_support_id_fun->partner_id . '/' .$ticket->contract_support_id_fun->partner_id_fun->partner_photoURL:null):null,
    
            'productKey'=>$ticket->contract_support_id?$ticket->contract_support_id_fun->product_id:null,
            'productName'=>$ticket->contract_support_id?($ticket->contract_support_id_fun->product_id?$ticket->contract_support_id_fun->product_id_fun->product_name:null):null,
           
            'createdByKey'=>!empty($ticket->user_creator_id)?$ticket->user_creator_id:$ticket->contact_account_id,
            'createdByName'=>!empty($ticket->user_creator_id)?$ticket->user_creator_id_fun->username:(!empty($ticket->contact_account_id)?$ticket->contact_account_id_fun->fullname:null),
           
            'createdAt'=>$ticket->created_at,
            'updatedAt'=>$ticket->updated_at,

            'startDate'=> Carbon::parse( $ticket->created_at)->format('m/d/Y') , 
            
            'assignedToPMKey'=>!empty($ticket->project_manager_id)?strval($ticket->project_manager_id):null,
            'assignedToPMName'=>!empty($ticket->project_manager_id)?$ticket->project_manager_id_fun->username:null,

            'assignedToDevKey'=>!empty($ticket->developer_id)?strval($ticket->developer_id):null,
            'assignedToDevName'=>!empty($ticket->developer_id)?$ticket->developer_id_fun->username:null,
            
             'primaryContactName'=>!empty($primary_contact->id)?$primary_contact->fullname.'':null,
            'primaryContactPhoneNumber'=>!empty($primary_contact->id)?$primary_contact->phone.'':null,

            'escalated'=>$ticket->escalated==1?true:false,
            'lastEscalat'=>$ticket->escalated==1?$ticket->lastEscalat:null,

            'closureDate'=>$ticket->ticket_status_id==2?$ticket->updated_at:null,
            
            'ticket_tag_id'=>$ticket->ticket_tag_id?$ticket->ticket_tag_id:null,
            'ticket_tag_name'=>$ticket->ticket_tag_id?$ticket->ticket_tag_id_fun->ticket_tag_name:null,
        ];
        
        return $array_reponse;
    }
    
    public function CastArrayTicket(Ticket $ticket){
        $array_reponse =[
            'key'=>$ticket->id.'',
    
            'title'=>$ticket->title,
            'ticket_number'=>$ticket->ticket_number,

            'priority'=>$ticket->ticket_priority_id?$ticket->ticket_priority_id:null,
            'priority_name'=>$ticket->ticket_priority_id?$ticket->ticket_priority_id_fun->ticket_priority:null,
             
            'status'=>$ticket->ticket_status_id?$ticket->ticket_status_id:null,
            'status_name'=>$ticket->ticket_status_id?$ticket->ticket_status_id_fun->ticket_status_name:null,
        
            'startDate'=> Carbon::parse( $ticket->created_at)->format('m/d/Y') , 
            


        ];
        return $array_reponse;
    }
    public function CastArrayTicketClient(Ticket $ticket){
        $array_reponse =[
            'key'=>$ticket->id.'',
    
            'title'=>$ticket->title,
            'ticket_number'=>$ticket->ticket_number,

            'priority'=>$ticket->ticket_priority_id?$ticket->ticket_priority_id:null,
            'priority_name'=>$ticket->ticket_priority_id?$ticket->ticket_priority_id_fun->ticket_priority:null,
             
            'ticketType'=>$ticket->ticket_type_id?$ticket->ticket_type_id:null,
            'ticketType_name'=>$ticket->ticket_type_id?$ticket->ticket_type_id_fun->ticket_type:null,
        
            'createdAt'=> $ticket->created_at, 
             
        ];
        return $array_reponse;
    }
   


    public function DeleteTicket(Request $request){
       
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'ticket_id'=>'required|numeric|exists:tickets,id',
                ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
          $ticket=  Ticket::where('id',$request->ticket_id)->first();
          if(!empty($ticket->id)){
            $client_updates = ClientTicketUpdate::where('ticket_id',$ticket->id)->delete();
            $developer_actions = DeveloperTicketAction::where('ticket_id',$ticket->id)->delete();
            File::deleteDirectory(public_path('Attachments/Client/Ticket/'.$ticket->id));
            $attaches = TicketAttach::where('ticket_id',$ticket->id)->forceDelete();
             $ticket->delete();
            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);
          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Ticket not found"],"Validator Errors",400);
          } 
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    
    public function CreateTicket(Request $request){
      //  try{
            $validator = Validator::make($request->all(), [
                'ticket_type_id' => 'required|numeric|exists:ticket_types,id',
               'ticket_priority_id' => 'required|numeric|exists:ticket_priorities,id',
               'contract_support_id' => 'required|numeric|exists:contract_supports,id',
               'ticket_status_id' => 'required|numeric|exists:ticket_statuses,id',
                'token'=>'required|string',
                'notes'=>'required|string',
                'title'=>'required|string',
                'client'=>'required|string',
                // 'ticket_tag_id'=>'exists:ticket_tags,id'
            ]);
           if ($validator->fails()) {
   
               return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
           }
          
       
           if($request->client=="true"){
            $ran =  random_int(29381021,99999999);

            $ticket_number=  Ticket::where('ticket_number',$ran)->first();
            while (!empty($ticket_number->id)) {
                $ran =  random_int(29381021,99999999);
                $ticket_number=  Ticket::where('ticket_number',$ran)->first();
            }
                if(!empty($request->ticket_tag_id)){
                    $ticketTag = TicketTag::where('id',$request->ticket_tag_id)->first();
                    if(empty($ticketTag)){
                        $ticketTag = TicketTag::where('ticket_tag_name',$request->ticket_tag_id)->first();
                        if(empty($ticketTag)){
                            $TicketTag = TicketTag::create([
                                'ticket_tag_name' =>$request->ticket_tag_id,
                                'partner_id' =>Auth::guard('client_api')->user()->partner_id,
                                'user_creator' =>Auth::guard('client_api')->user()->id,
                            ]);
                            $request->ticket_tag_id =$TicketTag->id;
                        }else{
                            $request->ticket_tag_id = $ticketTag->id;
                        }
                    }
                    
                }
               $ticket=  Ticket::create([
                   'title' =>$request->title,
                   'ticket_type_id' =>$request->ticket_type_id,
                   'ticket_priority_id' =>$request->ticket_priority_id,
                   'contract_support_id' =>$request->contract_support_id,
                   'contact_account_id' =>Auth::guard('client_api')->user()->id,
                   'ticket_status_id' =>$request->ticket_status_id,
                   'notes' => $request-> notes,
                   'ticket_number'=>$ran,
                   'ticket_tag_id'=>$request->ticket_tag_id?$request-> ticket_tag_id:null
                   ]);
                   $action = DeveloperTicketAction::create([
                    'ticket_id'=>$ticket->id,
                    'ticket_status_id' =>$request->ticket_status_id,
                    'title'=>"Ticket Created",
                    'comment'=>"Ticket Opened By:".Auth::guard('client_api')->user()->fullname,
                    'contact_account_id' =>Auth::guard('client_api')->user()->id,
                ]);

            try{
                $this->ClientSendNotification(Auth::guard('client_api')->user(),Auth::guard('client_api')->user(),$ticket);
             Mail::to($ticket->contact_account_id_fun->email)->send(new TicketClientOpen($ticket->contact_account_id_fun->fullname,$ticket->ticket_number,$ticket->title));
            }catch(\Exception $e){
                $log=  Log::create([
                    'action' =>'add ticket comment ',
                    'actionKeys' =>'Error Message in Email'. $e,
                    'empKey' =>1,
                    'empName' =>'super ticket hhhh',
                    'createdAt' =>Carbon::now(),
                    'actionStatus' =>'End',
                ]);
            }



            try{
                $contract = ContractSupport::where('id',$request->contract_support_id)->first();
                if(!empty($contract->id)){
                    $mailtoa = null;
                    $mailtoa = !empty($contract->project_manager_id)?($contract->project_manager_id_fun->email    ) : null;
                    if($mailtoa!=null){
                        $user = User::where('id',$contract->project_manager_id)->first();
                        $this->EmployeeSendNotification(Auth::guard('client_api')->user(), $user,$ticket);
                    }

                    $user_mail=   UserPermissionGroup::where('permissions_id',2)->get();
                    foreach($user_mail as $send_to){
                        $mailtoa = $mailtoa .";".  $send_to->users_id_fun->email ;
                        $user = User::where('id',$send_to->users_id)->first();
                        if($user->id != Auth::guard('user_api')->user()->id){

                        $this->EmployeeSendNotification(Auth::guard('client_api')->user(), $user,$ticket);
                        }

                    }

                  if(!empty($mailtoa)){
                       // $mailtoa = "ataha@firstgulfsolutions.com";
                       $mailtoa = $mailtoa . ";";

                      Mail::to($mailtoa)->send(new TicketUserOpen($ticket->contact_account_id_fun->fullname,$ticket->ticket_number,$ticket->title));
                  }
                 } 
 
               }catch(\Exception $e){
                $log=  Log::create([
                    'action' =>'Create Ticket ',
                    'actionKeys' =>'Error Message in Email'. $e,
                    'empKey' =>1,
                    'empName' =>'super ticket hhhh',
                    'createdAt' =>Carbon::now(),
                    'actionStatus' =>'End',
                ]);
                }

            }else{
               // 'ticket_number'=>$ticket->ticket_number,
               $ran =  random_int(29381021,99999999);

                $ticket_number=  Ticket::where('ticket_number',$ran)->first();
                while (!empty($ticket_number->id)) {
                    $ran =  random_int(29381021,99999999);
                    $ticket_number=  Ticket::where('ticket_number',$ran)->first();
                }
            
            $ticket=  Ticket::create([
                'title' =>$request->title,
                'ticket_type_id' =>$request->ticket_type_id,
                'ticket_priority_id' =>$request->ticket_priority_id,
                'contract_support_id' =>$request->contract_support_id,
                'user_creator_id' =>Auth::guard('user_api')->user()->id,
                'ticket_status_id' =>$request->ticket_status_id,
                'notes' => $request-> notes,
                'ticket_number'=>$ran,
                ]);
                $action = DeveloperTicketAction::create([
                    'ticket_id'=>$ticket->id,
                    'ticket_status_id' =>$request->ticket_status_id,
                    'title'=>"Ticket Created",
                    'comment'=>"Ticket Opened By:".Auth::guard('user_api')->user()->id,
                    'user_creator_id' =>Auth::guard('user_api')->user()->id,
                ]);

                

           }

             
               $attached ;
              
              if (!empty($request->ticket_attach) &&!empty($ticket->id)) {

                foreach($request->ticket_attach as $key){
                    $image = $key;
                    $file_name2 = $image->getClientOriginalName();
                    //  return $request->photoURL;
                    $random = Str::random(10);
                    $file_name = $random;
                    $attached =TicketAttach::create([
                        'ticket_attach' =>$file_name,
                        'ticket_id' =>$ticket->id,
                        'attach_name'=>$file_name2
                    ]);
                   
                    $image->move(('Attachments/Client/Ticket/'.$ticket->id.'/'.$attached->id.'/'), $file_name);
                }
                
              
               
             
           }
           $array_reponse =[
            'title'=>$ticket->title,
            'key'=>$ticket->id.''
           ];
          
           return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

    //    }catch(\Exception $e){
    //        return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

    //    }
        
    }
    public function GetAllTicket(){
        try{
          $ticketStatus = TicketStatus::all();
          if(!empty($ticketStatus[0]->id)){
            foreach($ticketStatus as $dep){
            $array_reponse[] = [ 
                'ticket_type' =>$dep->ticket_type,
                'id'=>$dep->id.''
            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Ticket Type"],"Empty",200);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetMyClosedTicket(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
               ]);
           if ($validator->fails()) {
   
               return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
           }
           if(Auth::guard('client_api')->user()->primary==1){

               $ticket = Ticket::whereHas('contract_support_id_fun',function($q){
                $q->where('partner_id',Auth::guard('client_api')->user()->partner_id);
               })->where('ticket_status_id',2)->get();
           }else{
            $ticket = Ticket::whereHas('contract_support_id_fun',function($q){
                $q->where('partner_id',Auth::guard('client_api')->user()->partner_id);
               })->where('ticket_status_id',2)->where('contact_account_id',Auth::guard('client_api')->user()->id)->get();
           }
          if(!empty($ticket[0]->id)){
            foreach($ticket as $dep){
            $array_reponse[] =$this->CastArrayTicketClient($dep);
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Ticket "],"Empty",200);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
        }
        
    }
    public function GetMyOpenTicket(Request $request){
      //  try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
               ]);
           if ($validator->fails()) {
   
               return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
           }
           if(Auth::guard('client_api')->user()->primary==true){
            $ticket = Ticket::whereHas('contract_support_id_fun',function($q){
                $q->where('partner_id',Auth::guard('client_api')->user()->partner_id);
               })->where('ticket_status_id','<>',2)->get();
               if(!empty($ticket[0]->id)){
                foreach($ticket as $dep){
                    $array_reponse[] =$this->CastArrayTicketClient($dep);
    
                }
                return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
    
              }else{
                return ResponseApi::notFoundResponse(['message'=>"Empty Ticket "],"Empty",200);
    
              }
           }else{
            $ticket = Ticket::whereHas('contract_support_id_fun',function($q){
                $q->where('partner_id',Auth::guard('client_api')->user()->partner_id);
               })->where('ticket_status_id','<>',2)->where('contact_account_id',Auth::guard('client_api')->user()->id)->get();
               

          if(!empty($ticket[0]->id)){
            foreach($ticket as $dep){
                $array_reponse[] =$this->CastArrayTicketClient($dep);

            }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Ticket "],"Empty",200);

          }
           }
             
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
        
    }
    public function GetContractTicket(Request $request){
     //   try{
        
                $validator = Validator::make($request->all(), [
                    'contract_id' => 'required|numeric|exists:contract_supports,id',
                    'token'=>'required|string',
                   
                ]);
               if ($validator->fails()) {
       
                   return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
               }
          $ticketStatus = Ticket::where('contract_support_id',$request->contract_id)->get();
          if(!empty($ticketStatus[0]->id)){
            foreach($ticketStatus as $dep){
            $array_reponse[] = $this->CastArrayTicket($dep);
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Ticket "],"Empty",200);

          }
             
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
        
    }


    public function GetSpecificTicket(Request $request){
        //   try{
           
                   $validator = Validator::make($request->all(), [
                       'ticket_id' => 'required|numeric|exists:tickets,id',
                       'token'=>'required|string',
                      
                   ]);
                  if ($validator->fails()) {
          
                      return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                  }
             $ticketStatus = Ticket::where('id',$request->ticket_id)->first();
             if(!empty($ticketStatus->id)){
                $array_reponse = $this->CastArraySpecificTicket($ticketStatus);
          
               return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
   
             }else{
               return ResponseApi::notFoundResponse(['message'=>"Empty Ticket "],"Empty",200);
   
             }
                
           // }catch(\Exception $e){
           //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
   
           // }
           
       }
       
   public function GetMyTicketInsights(Request $request){
         $validator = Validator::make($request->all(), [
            'token'=>'required|string',
        ]);
        if ($validator->fails()) {
            return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
        }
        try{
                // $openedtickets = Ticket::where('ticket_status_id',1)->count();
                // $closedtickets = Ticket::where('ticket_status_id',2)->count();
                if(Auth::guard('client_api')->user()->primary==1){
                
                    $closedtickets = Ticket::whereHas('contract_support_id_fun',function($q){
                        $q->where('partner_id',Auth::guard('client_api')->user()->partner_id);
                        })->where('ticket_status_id',2)->count();
                        
                    $openedtickets = Ticket::whereHas('contract_support_id_fun',function($q){
                        $q->where('partner_id',Auth::guard('client_api')->user()->partner_id);
                       })->where('ticket_status_id',1)->count();
                       
                }else{
                    $closedtickets = Ticket::whereHas('contract_support_id_fun',function($q){
                        $q->where('partner_id',Auth::guard('client_api')->user()->partner_id);
                        })->where('ticket_status_id',2)->where('contact_account_id',Auth::guard('client_api')->user()->id)->count();
                    $openedtickets = Ticket::whereHas('contract_support_id_fun',function($q){
                        $q->where('partner_id',Auth::guard('client_api')->user()->partner_id);
                       })->where('ticket_status_id',1)->count();
                }

                $array_reponse[] = [ 
                    'openedtickets' =>$openedtickets,
                    'closedtickets'=>$closedtickets,
                ];
                
                return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
            
         
             
        }catch(\Exception $e){
            return $e;
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }


    public function EmployeeRemainderNotification( User $user2,Ticket $report){
        $msg = array
             (
              "body"=> "No Action Taken Yet For ". $report->title ,
              "createdAt"=>Carbon::now(),
               "receverKey"=> $user2->id.'',
               "receverName"=> $user2->username,
               "redirection"=> "/tickets" ."/".$report->id,
               "senderKey"=> 36,
               "senderName"=> "FGS",
               "status"=> 0,
               "createdAt"=>Carbon::now(),
               "title"=> "Ticket Has No Action ". $report->title ,
               'senderImg' =>null,
    
             );
       MessageController::notificationSend($msg);
    }


    //if we have opened ticket and no one response for this ticket with no action we will remindar CEO and CTO and all people in open tickett permission group
    //if we have opened ticket and PM haven't response for this ticket in period of time we will remindar CEO and CTO and project manager
    //if develeoper didn't take any response we will notifiy ceo and cto and pm and developer <2
    //CCCCEEEEEO and CTTTTTTO

    //critical 1 hours 
    //high 8 hours
    //normal 2 days


   

    public function Ticketmanagment(){

        $ticket = Ticket::where('project_manager_id',null)->where('developer_id',null)->where('ticket_status_id',1)->get();
        //notifiy first stage 
        $total = 0;
        if(!empty($ticket[0]->id)){
            foreach($ticket as $tickets){
                $dev =    DeveloperTicketAction::where('ticket_id',$tickets->id)->first(); 
                if(!empty($dev->id)){
                    $start= Carbon::parse($dev->created_at);
                  $total= $start->diffInHours(Carbon::now()) ;
                }
                if($tickets->ticket_priority_id ==1 &&$total>=8  ){
                    $mailtoa = null;
                    $user_mail=   UserPermissionGroup::where('permissions_id',2)->get();
                    foreach($user_mail as $send_to){
                        if(empty($mailtoa)){
                            $mailtoa =   $send_to->users_id_fun->email ;

                        }else{
                            $mailtoa = $mailtoa .";".  $send_to->users_id_fun->email ;

                        }
                        $user = User::where('id',$send_to->users_id)->first();
                        if($user->id != Auth::guard('user_api')->user()->id){
                        $this->EmployeeRemainderNotification( $user,$tickets);
                        }
                    }

                  if(!empty($mailtoa)){
                    $mailtoa = $mailtoa . ";";

                       // $mailtoa = "ataha@firstgulfsolutions.com";

                      Mail::to($mailtoa)->send(new TicketUsernoAction($tickets->ticket_number,$tickets->id,$tickets->title,"No Project Manager Assign to This Ticket Yet."));
                  }
                 
                }else  if($tickets->ticket_priority_id ==2  &&$total>=48){
                    $mailtoa = null;
                    $user_mail=   UserPermissionGroup::where('permissions_id',2)->get();
                    foreach($user_mail as $send_to){
                        if(empty($mailtoa)){
                            $mailtoa =   $send_to->users_id_fun->email ;

                        }else{
                            $mailtoa = $mailtoa .";".  $send_to->users_id_fun->email ;

                        }
                        $user = User::where('id',$send_to->users_id)->first();
                        if($user->id != Auth::guard('user_api')->user()->id){
                        $this->EmployeeRemainderNotification( $user,$tickets);
                        }
                    }

                  if(!empty($mailtoa)){
                       // $mailtoa = "ataha@firstgulfsolutions.com";
                       $mailtoa = $mailtoa . ";";

                      Mail::to($mailtoa)->send(new TicketUsernoAction($tickets->ticket_number,$tickets->id,$tickets->title,"No Project Manager Assign to This Ticket Yet."));
                  }

                }else  if($tickets->ticket_priority_id ==3  &&$total>=1){
                    $mailtoa = null;
                    $user_mail=   UserPermissionGroup::where('permissions_id',2)->get();
                    foreach($user_mail as $send_to){
                        if(empty($mailtoa)){
                            $mailtoa =   $send_to->users_id_fun->email ;

                        }else{
                            $mailtoa = $mailtoa .";".  $send_to->users_id_fun->email ;

                        }
                        $user = User::where('id',$send_to->users_id)->first();
                        if($user->id != Auth::guard('user_api')->user()->id){
                        $this->EmployeeRemainderNotification( $user,$tickets);
                        }
                    }

                  if(!empty($mailtoa)){
                       // $mailtoa = "ataha@firstgulfsolutions.com";
                       $mailtoa = $mailtoa . ";";

                      Mail::to($mailtoa)->send(new TicketUsernoAction($tickets->ticket_number,$tickets->id,$tickets->title,"No Project Manager Assign to This Ticket Yet."));
                  }

                }
            }

        }

        $ticket = Ticket::where('developer_id',null)->where('project_manager_id','<>',null)->where('ticket_status_id',1)->get();
        //notifiy first stage 
        if(!empty($ticket[0]->id)){
            foreach($ticket as $tickets){
                $dev =    DeveloperTicketAction::where('ticket_id',$tickets->id)->first(); 
                if(!empty($dev->id)){
                    $start= Carbon::parse($dev->created_at);
                  $total= $start->diffInHours(Carbon::now()) ;
                }
                if($tickets->ticket_priority_id ==1 &&$total>=8  ){
                    $mailtoa = null;
                    $user_mail=   UserPermissionGroup::where('permissions_id',2)->get();
                    foreach($user_mail as $send_to){
                        if(empty($mailtoa)){
                            $mailtoa =   $send_to->users_id_fun->email ;

                        }else{
                            $mailtoa = $mailtoa .";".  $send_to->users_id_fun->email ;

                        }
                        $user = User::where('id',$send_to->users_id)->first();
                        if($user->id != Auth::guard('user_api')->user()->id){
                        $this->EmployeeRemainderNotification( $user,$tickets);
                        }
                    }

                  if(!empty($mailtoa)){
                       // $mailtoa = "ataha@firstgulfsolutions.com";
                       $mailtoa = $mailtoa . ";";

                      Mail::to($mailtoa)->send(new TicketUsernoAction($tickets->ticket_number,$tickets->id,$tickets->title,"No Developer Assign to This Ticket Yet."));
                  }
                 
                }else  if($tickets->ticket_priority_id ==2  &&$total>=48){
                    $mailtoa = null;
                    $user_mail=   UserPermissionGroup::where('permissions_id',2)->get();
                    foreach($user_mail as $send_to){
                        if(empty($mailtoa)){
                            $mailtoa =   $send_to->users_id_fun->email ;

                        }else{
                            $mailtoa = $mailtoa .";".  $send_to->users_id_fun->email ;

                        }
                        $user = User::where('id',$send_to->users_id)->first();
                        if($user->id != Auth::guard('user_api')->user()->id){
                        $this->EmployeeRemainderNotification( $user,$tickets);
                        }
                    }

                  if(!empty($mailtoa)){
                       // $mailtoa = "ataha@firstgulfsolutions.com";
                       $mailtoa = $mailtoa . ";";

                       Mail::to($mailtoa)->send(new TicketUsernoAction($tickets->ticket_number,$tickets->id,$tickets->title,"No Developer Assign to This Ticket Yet."));
                    }

                }else  if($tickets->ticket_priority_id ==3  &&$total>=1){
                    $mailtoa = null;
                    $user_mail=   UserPermissionGroup::where('permissions_id',2)->get();
                    foreach($user_mail as $send_to){
                        if(empty($mailtoa)){
                            $mailtoa =   $send_to->users_id_fun->email ;

                        }else{
                            $mailtoa = $mailtoa .";".  $send_to->users_id_fun->email ;

                        }
                        $user = User::where('id',$send_to->users_id)->first();
                        if($user->id != Auth::guard('user_api')->user()->id){
                        $this->EmployeeRemainderNotification( $user,$tickets);
                        }
                    }

                  if(!empty($mailtoa)){
                       // $mailtoa = "ataha@firstgulfsolutions.com";
                       $mailtoa = $mailtoa . ";";

                       Mail::to($mailtoa)->send(new TicketUsernoAction($tickets->ticket_number,$tickets->id,$tickets->title,"No Developer Assign to This Ticket Yet."));
                    }

                }
            }

        }

        $ticket = Ticket::where('developer_id','<>',null)->where('project_manager_id','<>',null)->where('ticket_status_id',1)->get();

        //notifiy first stage 
        if(!empty($ticket[0]->id)){
            foreach($ticket as $tickets){
                $dev =    DeveloperTicketAction::where('ticket_id',$tickets->id)->first(); 
                if(!empty($dev->id)){
                    $start= Carbon::parse($dev->created_at);
                  $total= $start->diffInHours(Carbon::now()) ;
                }
                if($tickets->ticket_priority_id ==1 &&$total>=8  ){
                    $mailtoa = null;
                    $user_mail=   UserPermissionGroup::where('permissions_id',2)->get();
                    foreach($user_mail as $send_to){
                        if(empty($mailtoa)){
                            $mailtoa =   $send_to->users_id_fun->email ;

                        }else{
                            $mailtoa = $mailtoa .";".  $send_to->users_id_fun->email ;

                        }
                        $user = User::where('id',$send_to->users_id)->first();
                        if($user->id != Auth::guard('user_api')->user()->id){
                        $this->EmployeeRemainderNotification( $user,$tickets);
                        }
                    }

                  if(!empty($mailtoa)){
                       // $mailtoa = "ataha@firstgulfsolutions.com";
                       $mailtoa = $mailtoa . ";";

                      Mail::to($mailtoa)->send(new TicketUsernoAction($tickets->ticket_number,$tickets->id,$tickets->title,"Ticket Still Open"));
                  }
                 
                }else  if($tickets->ticket_priority_id ==2  &&$total>=48){
                    $mailtoa = null;
                    $user_mail=   UserPermissionGroup::where('permissions_id',2)->get();
                    foreach($user_mail as $send_to){
                        if(empty($mailtoa)){
                            $mailtoa =   $send_to->users_id_fun->email ;

                        }else{
                            $mailtoa = $mailtoa .";".  $send_to->users_id_fun->email ;

                        }
                        $user = User::where('id',$send_to->users_id)->first();
                        if($user->id != Auth::guard('user_api')->user()->id){
                        $this->EmployeeRemainderNotification( $user,$tickets);
                        }
                    }

                  if(!empty($mailtoa)){
                       // $mailtoa = "ataha@firstgulfsolutions.com";
                       $mailtoa = $mailtoa . ";";

                       Mail::to($mailtoa)->send(new TicketUsernoAction($tickets->ticket_number,$tickets->id,$tickets->title,"Ticket Still Open"));
                    }

                }else  if($tickets->ticket_priority_id ==3  &&$total>=1){
                    $mailtoa = null;
                    $user_mail=   UserPermissionGroup::where('permissions_id',2)->get();
                    foreach($user_mail as $send_to){
                        if(empty($mailtoa)){
                            $mailtoa =   $send_to->users_id_fun->email ;

                        }else{
                            $mailtoa = $mailtoa .";".  $send_to->users_id_fun->email ;

                        }
                        $user = User::where('id',$send_to->users_id)->first();
                        if($user->id != Auth::guard('user_api')->user()->id){
                        $this->EmployeeRemainderNotification( $user,$tickets);
                        }
                    }

                  if(!empty($mailtoa)){
                       // $mailtoa = "ataha@firstgulfsolutions.com";
                       $mailtoa = $mailtoa . ";";

                       Mail::to($mailtoa)->send(new TicketUsernoAction($tickets->ticket_number,$tickets->id,$tickets->title,"Ticket Still Open"));
                    }

                }
            }
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
     * @param  \App\Models\Ticket  $ticket
     * @return \Illuminate\Http\Response
     */
    public function show(Ticket $ticket)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Ticket  $ticket
     * @return \Illuminate\Http\Response
     */
    public function edit(Ticket $ticket)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Ticket  $ticket
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Ticket $ticket)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Ticket  $ticket
     * @return \Illuminate\Http\Response
     */
    public function destroy(Ticket $ticket)
    {
        //
    }
}
