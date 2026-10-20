<?php

namespace App\Http\Controllers\Client\TicketingSystem\Ticket;

use App\Http\Controllers\Controller;
  use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\TicketUpdate;
use App\Models\TicketType;
use App\Models\TicketStatus;
use App\Models\TicketAttach;
use App\Models\Ticket;
use App\Models\ClientTicketUpdate;
use App\Models\ClientAccount;
use App\Models\User;
use App\Models\DeveloperTicketAction;
use App\Models\UserPermissionGroup;
  use Carbon\Carbon;
 use Illuminate\Support\Facades\File;
 use Illuminate\Support\Str;
use App\Models\Log;
 use Illuminate\Support\Facades\Auth;
 use App\Http\Controllers\ApiMessage\MessageController;

 
class DeveloperTicketActionController extends Controller
{
  public function EmployeeSendNotification(User $user1 , User $user2,Ticket $report){
    $msg = array
         (
          "body"=> $user1->username . "  Updated ". $report->title ,
          "createdAt"=>Carbon::now(),
           "receverKey"=> $user2->id.'',
           "receverName"=> $user2->username,
           "redirection"=> "/tickets" ."/".$report->id,
           "senderKey"=> $user1->id.'',
           "senderName"=> $user1->username,
           "status"=> 0,
           "createdAt"=>Carbon::now(),
           "title"=> "Ticket Updated ". $report->title ,
           'senderImg' => $user1->partner_id?($user1->partner_id_fun->partner_photoURL?"Attachments/Client/Partner/" .  $user1->partner_id . '/' .$user1->partner_id_fun->partner_photoURL:null):null,

         );
   MessageController::notificationSend($msg);
}
public function EmployeeSendNotificationClient(User $user2 , ClientAccount $user1,Ticket $report,$m){
  $msg = array
       (
         "body"=> $user1->fullname. "  " . $m ." ". $report->title ,
         "createdAt"=>Carbon::now(),
         "receverKey"=> $user2->id.'',
         "receverName"=> $user2->username,
         "redirection"=> "/tickets" ."/".$report->id,
         "senderKey"=> $user1->id.'',
         "senderName"=> $user1->fullname,
         "status"=> 0,
         "createdAt"=>Carbon::now(),
         "title"=> "Ticket ".$m. $report->title ,
         'senderImg' => $user1->partner_id?($user1->partner_id_fun->partner_photoURL?"Attachments/Client/Partner/" .  $user1->partner_id . '/' .$user1->partner_id_fun->partner_photoURL:null):null,

       );
 MessageController::notificationSend($msg);
}
public function ClientSendNotification(User $user1 , ClientAccount $user2,Ticket $report){
$msg = array
     (
      "body"=> $user1->username. "  Updated ". $report->title ,
      "createdAt"=>Carbon::now(),
        "receverKey"=> $user2->id.'',
       "receverName"=> $user2->fullname,
       "redirection"=> "/support/tickets/".$report->id,
       "senderKey"=> $user1->id.'',
       "senderName"=> $user1->username,
       "status"=> 0,
       "createdAt"=>Carbon::now(),
       "title"=> "Ticket Updated ". $report->title ,
       'senderImg' => $user1->partner_id?($user1->partner_id_fun->partner_photoURL?"Attachments/Client/Partner/" .  $user1->partner_id . '/' .$user1->partner_id_fun->partner_photoURL:null):null,
     );

MessageController::notificationSendclient($msg);
}
    public function AddTicketComment(Request $request){
    //try{

        $validator = Validator::make($request->all(), [
            'token'=>'required|string',
            'comment'=>'required|string',
            'title'=>'required|string',
            'ticket_id'=>'required|numeric|exists:tickets,id',
         ]);
       if ($validator->fails()) {

           return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
       }
       $ticket = Ticket::where('id',$request->ticket_id)->first();
      
       if(!empty($ticket->id)){
        if ($request->has('showForClient')){
            $action = DeveloperTicketAction::create([
                'ticket_id'=>$ticket->id,
                'ticket_status_id' =>$ticket->ticket_status_id,
                'title'=>$request->title,
                'comment'=>$request->comment,
                'visibility'=>$request->showForClient,
                'user_creator_id' =>Auth::guard('user_api')->user()->id,
            ]);
           //send user update ticket for users and clients
           if($request->showForClient == true){
            try{
                $ticket = Ticket::where('id',$request->ticket_id)->first();
               if(!empty($ticket->contact_account_id)){
                $client = ClientAccount::where('id',$ticket->contact_account_id)->first();

                   $mailto = null;
                   $mailto = !empty($ticket->contact_account_id)?$ticket->contact_account_id_fun->email   : null;
                   $this->ClientSendNotification(Auth::guard('user_api')->user(),$client,$ticket);
                   
                 if(!empty($mailto)){
                     Mail::to($mailto)->send(new TicketUpdate(Auth::guard('user_api')->user()->username,$ticket->contact_account_id_fun->fullname ,$ticket->id,$ticket->title,$request->comment,"Updated",$request->title));
                    // return $mailto;
                 }
                } 
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
           } 
           try{
            $ticket = Ticket::where('id',$request->ticket_id)->first();
           if(!empty($ticket->id)){
               $mailto = null;
               $mailto = !empty($ticket->project_manager_id)?$ticket->project_manager_id_fun->email   : null;
               $client = ClientAccount::where('id',$ticket->contact_account_id)->first();
               if(!empty($ticket->project_manager_id)&&($ticket->project_manager_id != Auth::guard('user_api')->user()->id)){
                $user = User::where('id',$ticket->project_manager_id)->first();
                   $this->EmployeeSendNotification(Auth::guard('user_api')->user(), $user,$ticket);
               }
               if(!empty($ticket->developer_id)&&($ticket->developer_id != Auth::guard('user_api')->user()->id)){
                $user = User::where('id',$ticket->developer_id)->first();
                   $this->EmployeeSendNotification(Auth::guard('user_api')->user(), $user,$ticket);
               }

              $user_mail=   UserPermissionGroup::where('permissions_id',2)->get();
             foreach($user_mail as $send_to){
              if(!empty($mailto)){
               $mailto =  $mailto .";". $send_to->users_id_fun->email ;
              }else{
                $mailto = $send_to->users_id_fun->email ;
              }
               $user = User::where('id',$send_to->users_id)->first();
               if($user->id != Auth::guard('user_api')->user()->id){

                 $this->EmployeeSendNotification(Auth::guard('user_api')->user(), $user,$ticket);

               }
              }
             if(!empty($mailto)){
              $mailto = $mailto . ";";

             //   $mailto = "ataha@firstgulfsolutions.com";
               Mail::to($mailto)->send(new TicketUpdate(" ",$ticket->contact_account_id_fun->fullname ,$ticket->id,$ticket->title,$request->comment,"Updated",$request->title));
             }
            } 
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




        }else{
            $action = DeveloperTicketAction::create([
                'ticket_id'=>$ticket->id,
                'ticket_status_id' =>$ticket->ticket_status_id,
                'title'=>$request->title,
                'comment'=>$request->comment,
                'contact_account_id' =>Auth::guard('client_api')->user()->id,
            ]);
            //send client update ticket for users
            try{
                 $ticket = Ticket::where('id',$request->ticket_id)->first();
                if(!empty($ticket->id)){
                    $mailto = null;
                    $mailto = !empty($ticket->project_manager_id)?$ticket->project_manager_id_fun->email . ";" : null;
                    $mailto  =  $mailto . (!empty($ticket->developer_id)?$ticket->developer_id_fun->email  .";": null);
                    $client = ClientAccount::where('id',$ticket->contact_account_id)->first();

                    if(!empty($ticket->project_manager_id) ){
                      $user = User::where('id',$ticket->project_manager_id)->first();
                         $this->EmployeeSendNotificationClient($user,$client,$ticket,"Updated ");
                     }
                     if(!empty($ticket->developer_id) ){
                      $user = User::where('id',$ticket->developer_id)->first();
                      $this->EmployeeSendNotificationClient($user,$client,$ticket,"Updated ");
                    }

                  $user_mail=   UserPermissionGroup::where('permissions_id',2)->get();
                  foreach($user_mail as $send_to){
                    if(!empty($mailto)){
                      $mailto =  $mailto . $send_to->users_id_fun->email .";";
                     }else{
                       $mailto = $send_to->users_id_fun->email  . ";";
                     }
                    $user = User::where('id',$send_to->users_id)->first();
                    if($user->id != Auth::guard('user_api')->user()->id){

                    $this->EmployeeSendNotificationClient($user,$client,$ticket,"Updated ");
                    }
                  }
                  if(!empty($mailto)){
                 //   $mailto = "ataha@firstgulfsolutions.com";

                     Mail::to($mailto)->send(new TicketUpdate(" ",Auth::guard('client_api')->user()->fullname,$ticket->id,$ticket->title,$request->comment,"Updated",$request->title));
                  }
                 } 
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

 
        }

        return ResponseApi::acceptedResponseApi(['message'=>'success'],"success",201);

       
       }else{
        return ResponseApi::notFoundResponse(['message'=>"Empty Ticket"],"Empty",200);

       }
      
//    }catch(\Exception $e){
//        return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

//    }
        
    }
    public function EscalateTicket(Request $request){
        //try{
    
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'ticket_id'=>'required|numeric|exists:tickets,id',
             ]);
           if ($validator->fails()) {
    
               return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
           }
           $ticket = Ticket::where('id',$request->ticket_id)->first();
          
           if(!empty($ticket->id)){
       
                $action = DeveloperTicketAction::create([
                    'ticket_id'=>$ticket->id,
                    'ticket_status_id' =>$ticket->ticket_status_id,
                    'title'=>"Ticket Escalated",
                    'comment'=>"Ticket Escalated By: ".Auth::guard('client_api')->user()->fullname,
                    'contact_account_id' =>Auth::guard('client_api')->user()->id,
                ]);
    
                $ticket->update([
                    'escalated'=>true,
                    'lastEscalat'=>Carbon::now()
                ]);
           
                try{
                    $ticket = Ticket::where('id',$request->ticket_id)->first();
                   if(!empty($ticket->id)){
                       $mailto = null;
                       $mailto = !empty($ticket->project_manager_id)?$ticket->project_manager_id_fun->email  : null;
                       $mailto  =  $mailto . (!empty($ticket->developer_id)?  ";" . $ticket->developer_id_fun->email  : null);
                       $client = ClientAccount::where('id',$ticket->contact_account_id)->first();

                       if(!empty($ticket->project_manager_id)){
                         $user = User::where('id',$ticket->project_manager_id)->first();
                            $this->EmployeeSendNotificationClient($user,$client,$ticket,"Esclated ");
                        }
                        if(!empty($ticket->developer_id)){
                         $user = User::where('id',$ticket->developer_id)->first();
                         $this->EmployeeSendNotificationClient($user,$client,$ticket,"Esclated ");
                       }

                     $user_mail=   UserPermissionGroup::where('permissions_id',2)->get();
                     foreach($user_mail as $send_to){
                       $mailto =  $mailto .";" . $send_to->users_id_fun->email;
                       $user = User::where('id',$send_to->users_id)->first();
 
                       $this->EmployeeSendNotificationClient($user,$client,$ticket,"Esclated ");
                      
                     }
                     if(!empty($mailto)){
                      // $mailto = "ataha@firstgulfsolutions.com";
                        $mailto = $mailto .";";
                        Mail::to($mailto)->send(new TicketUpdate(" ",Auth::guard('client_api')->user()->fullname,$ticket->id,$ticket->title,$request->comment,"Escalated","Ticket Esclated"));
                     }
                    } 
                  }catch(\Exception $e){
                    $log=  Log::create([
                      'action' =>'Esclate ticket  ',
                      'actionKeys' =>'Error Message in Email'. $e,
                      'empKey' =>1,
                      'empName' =>'super ticket hhhh',
                      'createdAt' =>Carbon::now(),
                      'actionStatus' =>'End',
                  ]);
                  }


            return ResponseApi::acceptedResponseApi(['message'=>'success'],"success",201);
    
           
           }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Ticket"],"Empty",200);
    
           }
          
    //    }catch(\Exception $e){
    //        return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
    
    //    }
            
        }
    




        public function getMyTicketAll(Request $request){
  //try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
             ]);
           if ($validator->fails()) {
    
               return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
           }

           $ticketStatus = Ticket::all();
           if(!empty($ticketStatus[0]->id)){
             foreach($ticketStatus as $dep){
 
                 $array_reponse[] = $this->CastArrayTicket($dep);
             }
        
             return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
 
           }else{
             return ResponseApi::notFoundResponse(['message'=>"Empty Ticket "],"Empty",200);
 
           }
      

            //    }catch(\Exception $e){
    //        return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
    
    //    }

        }


        public function getMyTicketDev(Request $request){
              //try{
              $validator = Validator::make($request->all(), [
                'token'=>'required|string',
             ]);
           if ($validator->fails()) {
    
               return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
           }

           $ticketStatus = Ticket::where('project_manager_id',Auth::guard('user_api')->user()->id)
           ->orWhere('developer_id',Auth::guard('user_api')->user()->id)->get();
           if(!empty($ticketStatus[0]->id)){
             foreach($ticketStatus as $dep){
 
                 $array_reponse[] = $this->CastArrayTicket($dep);
             }
        
             return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
 
           }else{
             return ResponseApi::notFoundResponse(['message'=>"Empty Ticket "],"Empty",200);
 
           }
      

            //    }catch(\Exception $e){
    //        return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
    
    //    }
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
            
            'createdAt'=> $ticket->created_at, 
            'ticket_number'=>$ticket->ticket_number,
            'clientKey'=>!empty($ticket->contract_support_id)?$ticket->contract_support_id_fun->partner_id:null,
            'clientName'=>!empty($ticket->contract_support_id)?($ticket->contract_support_id_fun->partner_id_fun?$ticket->contract_support_id_fun->partner_id_fun->partner_name:null):null,
            'clientImgUrl' => !empty($ticket->contract_support_id)?($ticket->contract_support_id_fun->partner_id_fun->partner_photoURL?"Attachments/Client/Partner/" .  $ticket->contract_support_id_fun->partner_id . '/' .$ticket->contract_support_id_fun->partner_id_fun->partner_photoURL:null):null,
    

        ];
        return $array_reponse;
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
     * @param  \App\Models\DeveloperTicketAction  $developerTicketAction
     * @return \Illuminate\Http\Response
     */
    public function show(DeveloperTicketAction $developerTicketAction)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\DeveloperTicketAction  $developerTicketAction
     * @return \Illuminate\Http\Response
     */
    public function edit(DeveloperTicketAction $developerTicketAction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\DeveloperTicketAction  $developerTicketAction
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, DeveloperTicketAction $developerTicketAction)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\DeveloperTicketAction  $developerTicketAction
     * @return \Illuminate\Http\Response
     */
    public function destroy(DeveloperTicketAction $developerTicketAction)
    {
        //
    }
}
