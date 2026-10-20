<?php

namespace App\Http\Controllers\Client\TicketingSystem\Ticket;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;

use App\Models\TicketTag;
use App\Models\Ticket;
use Illuminate\Support\Facades\Auth;
class TicketTagController extends Controller
{
    public function DeleteTicketTag(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'ticket_tag_id'=>'required|numeric|exists:ticket_tags,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            

          $TicketTag=  TicketTag::where('id',$request->ticket_tag_id)->first();
            

          if(!empty($TicketTag->id)){

            if(Auth::guard('client_api')->user()->partner_id == $TicketTag->partner_id_fun->id){
                $TicketTag->delete();

                return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);
            }else{
                return ResponseApi::badMethodErrorResponse(['message'=>"Permission Denied"],"Validator Errors",400);
            }
           

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Ticket Tag not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return $e;
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateTicketTag(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'ticket_tag_id'=>'required|numeric|exists:ticket_tags,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $TicketTag=  TicketTag::where('id',$request->ticket_tag_id)->first();
        
          if(!empty($TicketTag->id)){

            $TicketTag->update($request->all());

            return ResponseApi::acceptedResponseApi($TicketTag,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Ticket Tag not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateTicketTag(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'ticket_tag_name' => 'required|string|unique:ticket_tags',
                // 'partner_id'=>'required|numeric|exists:partners,id',
                'token'=>'required|string',
            ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            // return Auth::guard('client_api')->user();
          $TicketTag=  TicketTag::create([
            'ticket_tag_name' =>$request->ticket_tag_name,
            'partner_id' =>Auth::guard('client_api')->user()->partner_id,
            'user_creator' =>Auth::guard('client_api')->user()->id,
           ]);
         
        
          return ResponseApi::acceptedResponseApi($TicketTag,"success",201);

             
        }catch(\Exception $e){
            return $e;
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllTicketTag(Request $request){
         $validator = Validator::make($request->all(), [
            'token'=>'required|string',
        ]);
        if ($validator->fails()) {
            return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
        }
        // return Auth::guard('client_api')->user();
        if(!empty(Auth::guard('user_api')->user())){
            try{
              $ticketTag = TicketTag::all();
              if(!empty($ticketTag[0]->id)){
                foreach($ticketTag as $dep){
                $array_reponse[] = [ 
                    
                'ticket_tag_name' =>$dep->ticket_tag_name,
                'partner_id' =>$dep->partner_id,
                'partner_name'=>$dep->partner_id_fun->partner_name,
                'user_creator' =>$dep->user_creator,
                'user_creator_name' =>$dep->user_creator_fun->fullname,
                'id'=>$dep->id.''
                ];
            }
                return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
    
              }else{
                return ResponseApi::notFoundResponse(['message'=>"Empty Ticket Tag"],"Empty",200);
    
              }
                 
            }catch(\Exception $e){
                return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
    
            }
        }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Ticket Tag"],"Empty",200);
        }

        
    }

    public function GetMyTicketTag(Request $request){
         $validator = Validator::make($request->all(), [
            'token'=>'required|string',
        ]);
        if ($validator->fails()) {
            return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
        }
        try{
            if(!empty(Auth::guard('client_api')->user())){
                 $TicketTag = TicketTag::whereHas('partner_id_fun',function($q){
                $q->where('partner_id',Auth::guard('client_api')->user()->partner_id);
               })->get();
              if(!empty($TicketTag[0]->id)){
                foreach($TicketTag as $dep){
                $array_reponse[] = [ 
                    'ticket_tag_name' =>$dep->ticket_tag_name,
                    'partner_id' =>$dep->partner_id,
                    'partner_name'=>$dep->partner_id_fun->partner_name,
                    'user_creator' =>$dep->user_creator,
                    'user_creator_name' =>$dep->user_creator_fun->fullname,
                    'id'=>$dep->id.''
                    ];
                }
                return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

                  }else{
                    return ResponseApi::notFoundResponse(['message'=>"Empty Ticket Tags"],"Empty",200);
                }
            }else{
                 return ResponseApi::notFoundResponse(['message'=>"Empty Ticket Tags"],"Empty",200);
            }
         
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    
    
    public function GetMyTicketTagsInsights(Request $request){
         $validator = Validator::make($request->all(), [
            'token'=>'required|string',
        ]);
        if ($validator->fails()) {
            return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
        }
        try{
            if(!empty(Auth::guard('client_api')->user())){
                 $TicketTag = TicketTag::whereHas('partner_id_fun',function($q){
                $q->where('partner_id',Auth::guard('client_api')->user()->partner_id);
               })->get();
              if(!empty($TicketTag[0]->id)){
                foreach($TicketTag as $dep){
                    $tickets = Ticket::where('ticket_tag_id',$dep->id)->count();
                    $array_reponse[] = [ 
                            'ticket_tag_name' =>$dep->ticket_tag_name,
                            'id'=>$dep->id.'',
                            'number_of_tickets'=>$tickets,
                            'user_creator' =>$dep->user_creator,
                            'user_creator_name' =>$dep->user_creator_fun->fullname,
                            'created_at' =>$dep->created_at,

                        ];
                    }
                    return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

                  }else{
                    return ResponseApi::notFoundResponse(['message'=>"Empty Ticket Tags"],"Empty",200);
                }
            }else{
                 return ResponseApi::notFoundResponse(['message'=>"Empty Ticket Tags"],"Empty",200);
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
     * @param  \App\Models\TicketTag  $ticketTag
     * @return \Illuminate\Http\Response
     */
    public function show(TicketTag $ticketTag)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\TicketTag  $ticketTag
     * @return \Illuminate\Http\Response
     */
    public function edit(TicketTag $ticketTag)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\TicketTag  $ticketTag
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, TicketTag $ticketTag)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\TicketTag  $ticketTag
     * @return \Illuminate\Http\Response
     */
    public function destroy(TicketTag $ticketTag)
    {
        //
    }
}
