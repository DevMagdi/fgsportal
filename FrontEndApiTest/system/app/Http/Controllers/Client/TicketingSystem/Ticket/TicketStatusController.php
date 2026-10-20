<?php

namespace App\Http\Controllers\Client\TicketingSystem\Ticket;

use App\Http\Controllers\Controller;
  use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;

use App\Models\TicketType;
use App\Models\TicketStatus;
 
class TicketStatusController extends Controller
{
    public function DeleteTicketStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'ticket_status_id'=>'required|numeric|exists:ticket_statuses,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $ticketStatus=  TicketStatus::where('id',$request->ticket_status_id)->first();

          if(!empty($ticketStatus->id)){

            $ticketStatus->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Ticket Type not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateTicketStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'ticket_type' => 'required|string|unique:ticket_statuses',
                'token'=>'required|string',
                'ticket_status_id'=>'required|numeric|exists:ticket_statuses,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $ticketStatus=  TicketStatus::where('id',$request->ticket_status_id)->first();

          if(!empty($ticketStatus->id)){

            $ticketStatus->update([
                'ticket_type' =>$request->ticket_type,
            ]);

            return ResponseApi::acceptedResponseApi($ticketStatus,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Ticket type not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateTicketStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'ticket_type' => 'required|string|unique:ticket_statuses',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $ticketStatus=  TicketStatus::create([

            'ticket_type' =>$request->ticket_type,
           ]);
         
        
          return ResponseApi::acceptedResponseApi($ticketStatus,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllTicketStatus(){
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
     * @param  \App\Models\TicketStatus  $ticketStatus
     * @return \Illuminate\Http\Response
     */
    public function show(TicketStatus $ticketStatus)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\TicketStatus  $ticketStatus
     * @return \Illuminate\Http\Response
     */
    public function edit(TicketStatus $ticketStatus)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\TicketStatus  $ticketStatus
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, TicketStatus $ticketStatus)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\TicketStatus  $ticketStatus
     * @return \Illuminate\Http\Response
     */
    public function destroy(TicketStatus $ticketStatus)
    {
        //
    }
}
