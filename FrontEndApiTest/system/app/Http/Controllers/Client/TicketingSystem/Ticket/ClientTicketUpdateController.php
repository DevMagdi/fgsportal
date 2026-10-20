<?php

namespace App\Http\Controllers\Client\TicketingSystem\Ticket;

use App\Http\Controllers\Controller;
  use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;

use App\Models\TicketTag;

use App\Models\UserPermissionGroup;
use App\Models\TicketType;
use App\Models\TicketStatus;
use App\Models\TicketAttach;
use App\Models\ClientAccount;
use App\Models\Ticket;
use App\Models\ClientTicketUpdate;
use App\Models\DeveloperTicketAction;
  use Carbon\Carbon;
 use Illuminate\Support\Facades\File;
 use Illuminate\Support\Str;
 use Illuminate\Support\Facades\Mail;
 use App\Mail\TicketUpdate;
 use App\Models\User;
use App\Models\Log;
 use Illuminate\Support\Facades\Auth;
 use App\Http\Controllers\ApiMessage\MessageController;

class ClientTicketUpdateController extends Controller
{
    public function EmployeeSendNotification(ClientAccount $user1 , User $user2,Ticket $report){
        $msg = array
             (
                "body"=> $user1->fullname. "  Updated ". $report->title ,
                "createdAt"=>Carbon::now(),
               "receverKey"=> $user2->id.'',
               "receverName"=> $user2->username,
               "redirection"=> "/tickets" ."/".$report->id,
               "senderKey"=> $user1->id.'',
               "senderName"=> $user1->fullname,
               "status"=> 0,
               "createdAt"=>Carbon::now(),
               "title"=> "Ticket Updated ". $report->title ,
               'senderImg' => $user1->partner_id?($user1->partner_id_fun->partner_photoURL?"Attachments/Client/Partner/" .  $user1->partner_id . '/' .$user1->partner_id_fun->partner_photoURL:null):null,

             );
       MessageController::notificationSend($msg);
   }
   public function ClientSendNotification(ClientAccount $user1 , ClientAccount $user2,Ticket $report){
    $msg = array
         (
            "body"=> $user1->fullname. " Updated"." ". $report->title ,
            "createdAt"=>Carbon::now(),
            "receverKey"=> $user2->id.'',
           "receverName"=> $user2->fullname,
           "redirection"=> "/support/tickets/".$report->id,
           "senderKey"=> $user1->id.'',
           "senderName"=> $user1->fullname,
           "status"=> 0,
           "createdAt"=>Carbon::now(),
           "title"=> "Ticket Updated ". $report->title ,
           'senderImg' => $user1->partner_id?($user1->partner_id_fun->partner_photoURL?"Attachments/Client/Partner/" .  $user1->partner_id . '/' .$user1->partner_id_fun->partner_photoURL:null):null,
         );

   MessageController::notificationSendclient($msg);
}
    
    public function ClientUpdateTicket(Request $request){
    //try{

        $validator = Validator::make($request->all(), [
            'ticket_type_id' => 'required|numeric|exists:ticket_types,id',
           'ticket_priority_id' => 'required|numeric|exists:ticket_priorities,id',
            'ticket_status_id' => 'required|numeric|exists:ticket_statuses,id',
            'token'=>'required|string',
            'notes'=>'required|string',
            'comment'=>'required|string',
            'title'=>'required|string',
            'comment_title'=>'required|string',
             'ticket_id'=>'required|numeric|exists:tickets,id',
         ]);
       if ($validator->fails()) {

           return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
       }
       $old_ticket = Ticket::where('id',$request->ticket_id)->first();
       
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

       if(!empty($old_ticket->id)){
        $attach =[];
        if(!empty($request->deleted_images)){
          $attach = TicketAttach::where('ticket_id',$request->ticket_id)->get();
            foreach($attach as $ticket_attach){
                foreach($request->deleted_images as $arr){
                    if($ticket_attach->ticket_attach == $arr){
                        $attach[]=[
                            'old'=>$ticket_attach->id
                        ];
                        $ticket_attach->delete();
                    }
                }
           }
        }

        if (!empty($request->ticket_attach)){

         
            $attached = null ;

            foreach($request->ticket_attach as $key){
                $image = $key;
                $file_name2 = $image->getClientOriginalName();
                //  return $request->photoURL;
                $random = Str::random(10);
                $file_name = $random;
                
                $attached =TicketAttach::create([
                    'ticket_attach' =>$file_name,
                    'ticket_id' =>$request->ticket_id,
                    'attach_name'=>$file_name2

                ]);
                $attach[]=[
                    'new'=>$attached->id
                ];
                $image->move(('Attachments/Client/Ticket/'.$request->ticket_id.'/'.$attached->id.'/'), $file_name);
            }

        }
        $client_update = ClientTicketUpdate::create([
            'title'=>$old_ticket->title,
            'ticket_type_id'=>$old_ticket->ticket_type_id,
            'ticket_priority_id'=>$old_ticket->ticket_priority_id,
            'contact_account_id' =>Auth::guard('client_api')->user()->id,
            'ticket_id'=>$old_ticket->id,
             'ticket_status_id'=>$old_ticket->ticket_status_id,
            'attach_ticket_array'=> $attach ,
            'notes'=>$old_ticket->notes,
            ]);
            if(!empty($client_update->id)){
 
                $old_ticket->update([
                    'title' =>$request->title,
                    'ticket_type_id' =>$request->ticket_type_id,
                    'ticket_priority_id' =>$request->ticket_priority_id,
                    'contact_account_id'=>$old_ticket->contact_account_id,
                    'ticket_status_id' =>$request->ticket_status_id,
                    'notes' => $request-> notes,
                    'ticket_tag_id'=>$request->ticket_tag_id
                    ]);
                    $action = DeveloperTicketAction::create([
                        'ticket_id'=>$request->ticket_id,
                        'ticket_status_id' =>$request->ticket_status_id,
                        'title'=>$request->comment_title,
                        'comment'=>$request->comment,
                        'contact_account_id' =>Auth::guard('client_api')->user()->id,
                    ]);


                    try{
                        $ticket = Ticket::where('id',$request->ticket_id)->first();
                       if(!empty($ticket->id)){
                           $mailto = null;
                           $mailto = !empty($ticket->project_manager_id)?$ticket->project_manager_id_fun->email  : null;
                           $mailto  =  $mailto . (!empty($ticket->developer_id)?  ";" . $ticket->developer_id_fun->email  : null);
                           if(!empty($ticket->project_manager_id) ){
                            $user = User::where('id',$ticket->project_manager_id)->first();

                               $this->EmployeeSendNotification(Auth::guard('client_api')->user(), $user,$ticket);
                           }
                           if(!empty($ticket->developer_id) ){
                            $user = User::where('id',$ticket->developer_id)->first();
                            $this->EmployeeSendNotification(Auth::guard('client_api')->user(), $user,$ticket);
                        }

                         $user_mail=   UserPermissionGroup::where('permissions_id',2)->get();
                         foreach($user_mail as $send_to){
                           $mailto =  $mailto .";" . $send_to->users_id_fun->email;
                           $user = User::where('id',$send_to->users_id)->first();

                               $this->EmployeeSendNotification(Auth::guard('client_api')->user(), $user,$ticket);
                           

                         }
                         if(!empty($mailto)){
                         ///  $mailto = "ataha@firstgulfsolutions.com";
                         $mailto = $mailto.";";
                             Mail::to($mailto)->send(new TicketUpdate(" ",Auth::guard('client_api')->user()->fullname,$ticket->id,$ticket->title,$request->comment,"Updated","Ticket Updated"));
                         }
                        } 
                      }catch(\Exception $e){
                        $log=  Log::create([
                            'action' =>'Client Update ticket ',
                            'actionKeys' =>'Error Message in Email'. $e,
                            'empKey' =>1,
                            'empName' =>'super ticket hhhh',
                            'createdAt' =>Carbon::now(),
                            'actionStatus' =>'End',
                        ]);
                      }


                    //   try{
                    //     $ticket = Ticket::where('id',$request->ticket_id)->first();
                    //    if(!empty($ticket->contact_account_id)){
        
                    //        $mailto = null;
                    //        $mailto = !empty($ticket->contact_account_id)?$ticket->contact_account_id_fun->email   : null;
                           
                    //      if(!empty($mailto)){
                    //         $this->ClientSendNotification(Auth::guard('client_api')->user(),Auth::guard('client_api')->user(),$ticket);
                    //          Mail::to($mailto)->send(new TicketUpdate(Auth::guard('user_api')->user()->username,$ticket->contact_account_id_fun->fullname ,$ticket->id,$ticket->title,$request->comment,"Updated","Ticket Updated"));
                    //       }
                    //     } 
                    //   }catch(\Exception $e){
                    //    }


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
    



    public function CastArrayTimeline(DeveloperTicketAction $ticket){


        $array_response = [
            'key' =>$ticket->ticket_id,

            'showForClient' =>$ticket->visibility==1?true:false,

            'ticketKey' =>$ticket->ticket_id,
            'ticketTitle' =>!empty($ticket->ticket_id)?$ticket->ticket_id_fun->title:null,

            'createdAt' =>$ticket->created_at,
            'action' =>$ticket->title,
            'actionComment' =>$ticket->comment,

            'actionByKey' =>!empty($ticket->contact_account_id)?$ticket->contact_account_id:$ticket->user_creator_id,
            'actionByName' =>!empty($ticket->contact_account_id)?$ticket->contact_account_id_fun->fullname:$ticket->user_creator_id_fun->username,
 
        ];
        return $array_response;
    }








    public function GetTicketTimeline(Request $request){
          //try{

            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                 'ticket_id'=>'required|numeric|exists:tickets,id',
             ]);
           if ($validator->fails()) {
    
               return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
           }

          $ticketStatus = DeveloperTicketAction::where('ticket_id',$request->ticket_id)->get();
          if(!empty($ticketStatus[0]->id)){
            foreach($ticketStatus as $dep){

                $array_reponse[] = $this->CastArrayTimeline($dep);
            }
       
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Ticket "],"Empty",200);

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
     * @param  \App\Models\ClientTicketUpdate  $clientTicketUpdate
     * @return \Illuminate\Http\Response
     */
    public function show(ClientTicketUpdate $clientTicketUpdate)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ClientTicketUpdate  $clientTicketUpdate
     * @return \Illuminate\Http\Response
     */
    public function edit(ClientTicketUpdate $clientTicketUpdate)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ClientTicketUpdate  $clientTicketUpdate
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ClientTicketUpdate $clientTicketUpdate)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ClientTicketUpdate  $clientTicketUpdate
     * @return \Illuminate\Http\Response
     */
    public function destroy(ClientTicketUpdate $clientTicketUpdate)
    {
        //
    }
}
