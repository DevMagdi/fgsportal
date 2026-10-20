<?php

namespace App\Http\Controllers\Client\TicketingSystem\Ticket;

use App\Http\Controllers\Controller;
  use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;

use App\Models\TicketType;
class TicketTypeController extends Controller
{
   
    
    public function DeleteTicketType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'ticket_type_id'=>'required|numeric|exists:ticket_types,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $ticketType=  TicketType::where('id',$request->ticket_type_id)->first();

          if(!empty($ticketType->id)){

            $ticketType->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Ticket Type not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateTicketType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'ticket_type' => 'required|string|unique:ticket_types',
                'token'=>'required|string',
                'ticket_type_id'=>'required|numeric|exists:ticket_types,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $ticketType=  TicketType::where('id',$request->ticket_type_id)->first();

          if(!empty($ticketType->id)){

            $ticketType->update([
                'ticket_type' =>$request->ticket_type,
            ]);

            return ResponseApi::acceptedResponseApi($ticketType,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Ticket type not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateTicketType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'ticket_type' => 'required|string|unique:ticket_types',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $ticketType=  TicketType::create([

            'ticket_type' =>$request->ticket_type,
           ]);
         
        
          return ResponseApi::acceptedResponseApi($ticketType,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllTicketType(){
        try{
          $ticketType = TicketType::all();
          if(!empty($ticketType[0]->id)){
            foreach($ticketType as $dep){
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
     * @param  \App\Models\TicketType  $ticketType
     * @return \Illuminate\Http\Response
     */
    public function show(TicketType $ticketType)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\TicketType  $ticketType
     * @return \Illuminate\Http\Response
     */
    public function edit(TicketType $ticketType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\TicketType  $ticketType
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, TicketType $ticketType)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\TicketType  $ticketType
     * @return \Illuminate\Http\Response
     */
    public function destroy(TicketType $ticketType)
    {
        //
    }
}
