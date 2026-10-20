<?php

namespace App\Http\Controllers\Client\TicketingSystem\Ticket;

use App\Http\Controllers\Controller;
  use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;

use App\Models\TicketPriority;

class TicketPriorityController extends Controller
{
    public function DeleteTicketPriority(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'ticket_priority_id'=>'required|numeric|exists:ticket_priorities,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $TicketPriority=  TicketPriority::where('id',$request->ticket_priority_id)->first();

          if(!empty($TicketPriority->id)){

            $TicketPriority->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Ticket Priority not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateTicketPriority(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'ticket_priority_id'=>'required|numeric|exists:ticket_priorities,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $TicketPriority=  TicketPriority::where('id',$request->ticket_priority_id)->first();

          if(!empty($TicketPriority->id)){

            $TicketPriority->update($request->all());

            return ResponseApi::acceptedResponseApi($TicketPriority,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Ticket Priority not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateTicketPriority(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'ticket_priority' => 'required|string|unique:ticket_priorities',
                'ticket_time'=>'required|numeric',
                'ticket_response_time'=>'required|numeric',
                'ticket_solve_time'=>'required|numeric',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $TicketPriority=  TicketPriority::create([
            
            'ticket_priority' =>$request->ticket_priority,
            'ticket_time' =>$request->ticket_time,
            'ticket_response_time' =>$request->ticket_response_time,
            'ticket_solve_time' =>$request->ticket_solve_time,
           ]);
         
        
          return ResponseApi::acceptedResponseApi($TicketPriority,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllTicketPriority(){
        try{
          $TicketPriority = TicketPriority::all();
          if(!empty($TicketPriority[0]->id)){
            foreach($TicketPriority as $dep){
            $array_reponse[] = [ 
                
            'ticket_priority' =>$dep->ticket_priority,
            'ticket_time' =>$dep->ticket_time,
            'ticket_response_time' =>$dep->ticket_response_time,
            'ticket_solve_time' =>$dep->ticket_solve_time,
            'id'=>$dep->id.''
            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Ticket Priority"],"Empty",200);

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
     * @param  \App\Models\TicketPriority  $ticketPriority
     * @return \Illuminate\Http\Response
     */
    public function show(TicketPriority $ticketPriority)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\TicketPriority  $ticketPriority
     * @return \Illuminate\Http\Response
     */
    public function edit(TicketPriority $ticketPriority)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\TicketPriority  $ticketPriority
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, TicketPriority $ticketPriority)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\TicketPriority  $ticketPriority
     * @return \Illuminate\Http\Response
     */
    public function destroy(TicketPriority $ticketPriority)
    {
        //
    }
}
