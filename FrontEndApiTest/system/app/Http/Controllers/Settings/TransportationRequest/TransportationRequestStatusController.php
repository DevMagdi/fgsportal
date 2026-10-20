<?php

namespace App\Http\Controllers\Settings\TransportationRequest;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
 use App\Models\TransportationRequestStatus;
 
class TransportationRequestStatusController extends Controller
{
    public function DeleteTransportationRequestStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'transportation_request_status_id'=>'required|numeric|exists:transportation_request_statuses,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $transportationRequestStatus=  TransportationRequestStatus::where('id',$request->transportation_request_status_id)->first();

          if(!empty($transportationRequestStatus->id)){

            $transportationRequestStatus->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Transportation Status not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateTransportationRequestStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'transportation_request_status_name' => 'required|string|unique:transportation_request_statuses',
                'token'=>'required|string',
                'transportation_request_status_id'=>'required|numeric|exists:transportation_request_statuses,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $transportationRequestStatus=  TransportationRequestStatus::where('id',$request->transportation_request_status_id)->first();

          if(!empty($transportationRequestStatus->id)){

            $transportationRequestStatus->update([
                'transportation_request_status_name' =>$request->transportation_request_status_name,
            ]);

            return ResponseApi::acceptedResponseApi($transportationRequestStatus,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Transportation Status not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateTransportationRequestStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'transportation_request_status_name' => 'required|string|unique:transportation_request_statuses',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $transportationRequestStatus=  TransportationRequestStatus::create([

            'transportation_request_status_name' =>$request->transportation_request_status_name,
           ]);
         
        
          return ResponseApi::acceptedResponseApi($transportationRequestStatus,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetTransportationRequestStatus(){
        try{
          $transportationRequestStatus = TransportationRequestStatus::all();
          if(!empty($transportationRequestStatus[0]->id)){
            foreach($transportationRequestStatus as $dep){
            $array_reponse[] = [ 
                'transportation_request_status_name' =>$dep->transportation_request_status_name,
                'key'=>$dep->id

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Transportation Status"],"Empty",200);

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
     * @param  \App\Models\TransportationRequestStatus  $transportationRequestStatus
     * @return \Illuminate\Http\Response
     */
    public function show(TransportationRequestStatus $transportationRequestStatus)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\TransportationRequestStatus  $transportationRequestStatus
     * @return \Illuminate\Http\Response
     */
    public function edit(TransportationRequestStatus $transportationRequestStatus)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\TransportationRequestStatus  $transportationRequestStatus
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, TransportationRequestStatus $transportationRequestStatus)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\TransportationRequestStatus  $transportationRequestStatus
     * @return \Illuminate\Http\Response
     */
    public function destroy(TransportationRequestStatus $transportationRequestStatus)
    {
        //
    }
}
