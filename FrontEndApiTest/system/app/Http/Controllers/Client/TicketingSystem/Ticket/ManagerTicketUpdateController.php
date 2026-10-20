<?php

namespace App\Http\Controllers\Client\TicketingSystem\Ticket;

use App\Http\Controllers\Controller;
  use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;

use App\Models\TicketType;
use App\Models\TicketStatus;
use App\Models\TicketAttach;
use App\Models\Ticket;
use App\Models\ClientTicketUpdate;
use App\Models\ClientAccount;
use App\Models\DeveloperTicketAction;
  use Carbon\Carbon;
 use Illuminate\Support\Facades\File;
 use Illuminate\Support\Str;
 use App\Models\User;
 use App\Models\Log; 

 use Illuminate\Support\Facades\Auth;
 use App\Models\ManagerTicketUpdate;
 use App\Models\UserPermissionGroup;
 use Illuminate\Support\Facades\Mail;
 use App\Mail\TicketUpdate;
 use App\Mail\TicketClose;
 use App\Http\Controllers\ApiMessage\MessageController;

class ManagerTicketUpdateController extends Controller
{
        public function EmployeeSendNotification( User $user1,User $user2 ,Ticket $report){
          $msg = array
              (
                "body"=> $user1->username. "  Updated ". $report->title ,
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
      public function ClientSendNotification(User $user1 , ClientAccount $user2,Ticket $report,$m){
      $msg = array
          (
            "body"=> $user1->username. $m ." ". $report->title ,
            "createdAt"=>Carbon::now(),
              "receverKey"=> $user2->id.'',
            "receverName"=> $user2->fullname,
            "redirection"=> "/support/tickets/".$report->id,
            "senderKey"=> $user1->id.'',
            "senderName"=> $user1->username,
            "status"=> 0,
            "createdAt"=>Carbon::now(),
            "title"=> "Ticket " .$m. $report->title ,
            'senderImg' => $user1->partner_id?($user1->partner_id_fun->partner_photoURL?"Attachments/Client/Partner/" .  $user1->partner_id . '/' .$user1->partner_id_fun->partner_photoURL:null):null,
          );

      MessageController::notificationSendclient($msg);
      }
    public function ManagerUpdateTicket(Request $request){
        //try{
    
            $validator = Validator::make($request->all(), [
               'ticket_priority_id' => 'required|numeric|exists:ticket_priorities,id',
                'ticket_status_id' => 'required|numeric|exists:ticket_statuses,id',
                'token'=>'required|string',
                'ticket_id'=>'required|numeric|exists:tickets,id',
                'comment'=>'required|string',
                'comment_title'=>'required|string',
             ]);
           if ($validator->fails()) {
    
               return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
           }
           $old_ticket = Ticket::where('id',$request->ticket_id)->first();
           if(!empty($old_ticket->id)){
            $client_update = ManagerTicketUpdate::create([
                'title'=>$old_ticket->title,
                'ticket_type_id'=>$old_ticket->ticket_type_id,
                'ticket_priority_id'=>$request->ticket_priority_id,
                'ticket_id'=>$old_ticket->id,
                'user_creator_id'=>Auth::guard('user_api')->user()->id,
                'project_manager_id'=>$request->project_manager_id,
                'developer_id'=>$request->developer_id,
                 'ticket_status_id'=>$request->ticket_status_id,
                'notes'=>$old_ticket->notes,
                ]);
                if(!empty($client_update->id)){
                    $ticket = Ticket::where('id',$request->ticket_id)->first();
                    $ticket->update([
                        'ticket_priority_id' =>$request->ticket_priority_id,
                        'ticket_status_id' =>$request->ticket_status_id,
                        'project_manager_id'=>$request->project_manager_id,
                        'developer_id'=>$request->developer_id
                        ]);
                        $action = DeveloperTicketAction::create([
                            'ticket_id'=>$request->ticket_id,
                            'ticket_status_id' =>$request->ticket_status_id,
                            'title'=>$request->comment_title,
                            'comment'=>$request->comment,
                            'user_creator_id'=>Auth::guard('user_api')->user()->id,
                        ]);

                        try{
                            $ticket = Ticket::where('id',$request->ticket_id)->first();
                           if(!empty($ticket->id)){
                               $mailto = null;
                               $mailto = !empty($ticket->project_manager_id)?$ticket->project_manager_id_fun->email  : null;
                               $mailto  =  $mailto . (!empty($ticket->developer_id)?  ";" . $ticket->developer_id_fun->email  : null);
                            
                               $client = ClientAccount::where('id',$ticket->contact_account_id)->first();
                               if(!empty($ticket->project_manager_id) &&($ticket->developer_id != Auth::guard('user_api')->user()->id)){
                                $user = User::where('id',$ticket->project_manager_id)->first();
                                   $this->EmployeeSendNotification(Auth::guard('user_api')->user(),$user,$ticket);
                               }
                               if(!empty($ticket->developer_id) &&($ticket->developer_id != Auth::guard('user_api')->user()->id)){
                                $user = User::where('id',$ticket->developer_id)->first();
                                $this->EmployeeSendNotification(Auth::guard('user_api')->user(),$user,$ticket);
                              }

                             $user_mail=   UserPermissionGroup::where('permissions_id',2)->get();
                             foreach($user_mail as $send_to){
                               $mailto =  $mailto . ";" . $send_to->users_id_fun->email;
                               $user = User::where('id',$send_to->users_id)->first();
                               if($user->id != Auth::guard('user_api')->user()->id){
                               $this->EmployeeSendNotification(Auth::guard('user_api')->user(),$user,$ticket);
                               }
                             }
                             if(!empty($mailto)){
                              $mailto = $mailto . ";";
                              //  $mailto = "ataha@firstgulfsolutions.com";
                                 Mail::to($mailto)->send(new TicketUpdate(" ",Auth::guard('user_api')->user()->fullname,$ticket->id,$ticket->title,$request->comment,"Updated","Ticket Updated"));
                             }
                            } 
                          }catch(\Exception $e){
                            $log=  Log::create([
                              'action' =>'ManagerUpdateTicket before equal',
                              'actionKeys' =>'Error Message in Email'. $e,
                              'empKey' =>1,
                              'empName' =>'super ticket hhhh',
                              'createdAt' =>Carbon::now(),
                              'actionStatus' =>'End',
                          ]);
                          }
                          if($request->ticket_status_id=="1"){

                              try{
                                $ticket = Ticket::where('id',$request->ticket_id)->first();
                               if(!empty($ticket->contact_account_id)){
                
                                   $mailto = null;
                                   $mailto = !empty($ticket->contact_account_id)?$ticket->contact_account_id_fun->email   : null;
                                   if($mailto !=null){
                                    $client = ClientAccount::where('id',$ticket->contact_account_id)->first();
                                     $this->ClientSendNotification(Auth::guard('user_api')->user(),$client,$ticket,"Updated ");
                                   }

                                 if(!empty($mailto)){
                                  $mailto = $mailto . ";";
                                     Mail::to($mailto)->send(new TicketUpdate($ticket->contact_account_id_fun->fullname,Auth::guard('user_api')->user()->username ,$ticket->id,$ticket->title,$request->comment,"Updated","Ticket Updated"));
                                  }
                                } 
                              }catch(\Exception $e){
                                $log=  Log::create([
                                  'action' =>'ManagerUpdateTicket equql 1',
                                  'actionKeys' =>'Error Message in Email'. $e,
                                  'empKey' =>1,
                                  'empName' =>'super ticket hhhh',
                                  'createdAt' =>Carbon::now(),
                                  'actionStatus' =>'End',
                              ]);
                               }
                          }else{
                            try{
                                $ticket = Ticket::where('id',$request->ticket_id)->first();
                               if(!empty($ticket->contact_account_id)){
                
                                   $mailto = null;
                                   $mailto = !empty($ticket->contact_account_id)?$ticket->contact_account_id_fun->email   : null;
                                   if($mailto !=null){
                                    $client = ClientAccount::where('id',$ticket->contact_account_id)->first();
                                     $this->ClientSendNotification(Auth::guard('user_api')->user(),$client,$ticket,"Close ");
                                   }
                                 if(!empty($mailto)){
                                  $mailto = $mailto . ";";
                                     Mail::to($mailto)->send(new TicketClose($ticket->contact_account_id_fun->fullname,$ticket->id,$ticket->title));
                                  }
                                } 
                              }catch(\Exception $e){
                                $log=  Log::create([
                                  'action' =>'ManagerUpdateTicket ticket status not equal 1',
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
                    return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
                }
           
           }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Ticket"],"Empty",200);
    
           }
          
    //    }catch(\Exception $e){
    //        return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
    
    //    }
            
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
     * @param  \App\Models\ManagerTicketUpdate  $managerTicketUpdate
     * @return \Illuminate\Http\Response
     */
    public function show(ManagerTicketUpdate $managerTicketUpdate)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ManagerTicketUpdate  $managerTicketUpdate
     * @return \Illuminate\Http\Response
     */
    public function edit(ManagerTicketUpdate $managerTicketUpdate)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ManagerTicketUpdate  $managerTicketUpdate
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ManagerTicketUpdate $managerTicketUpdate)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ManagerTicketUpdate  $managerTicketUpdate
     * @return \Illuminate\Http\Response
     */
    public function destroy(ManagerTicketUpdate $managerTicketUpdate)
    {
        //
    }
}
