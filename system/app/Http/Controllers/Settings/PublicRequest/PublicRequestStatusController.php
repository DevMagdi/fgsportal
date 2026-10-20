<?php

namespace App\Http\Controllers\Settings\PublicRequest;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use App\Models\PublicRequestStatus;
 
class PublicRequestStatusController extends Controller
{
    public function DeletePublicRequestStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'public_request_status_id'=>'required|numeric|exists:public_request_statuses,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $publicRequestStatus=  PublicRequestStatus::where('id',$request->public_request_status_id)->first();

          if(!empty($publicRequestStatus->id)){

            $publicRequestStatus->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Public Request Type not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdatePublicRequestStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'public_request_status_name' => 'required|string|unique:public_request_statuses',
                'token'=>'required|string',
                'public_request_status_id'=>'required|numeric|exists:public_request_statuses,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $publicRequestStatus=  PublicRequestStatus::where('id',$request->public_request_status_id)->first();

          if(!empty($publicRequestStatus->id)){

            $publicRequestStatus->update([
                'public_request_status_name' =>$request->public_request_status_name,
            ]);

            return ResponseApi::acceptedResponseApi($publicRequestStatus,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Public Request type not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreatePublicRequestStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'public_request_status_name' => 'required|string|unique:public_request_statuses',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $publicRequestStatus=  PublicRequestStatus::create([

            'public_request_status_name' =>$request->public_request_status_name,
           ]);
         
        
          return ResponseApi::acceptedResponseApi($publicRequestStatus,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetPublicRequestStatus(){
        try{
          $publicRequestStatus = PublicRequestStatus::all();
          if(!empty($publicRequestStatus[0]->id)){
            foreach($publicRequestStatus as $dep){
            $array_reponse[] = [ 
                'public_request_status_name' =>$dep->public_request_status_name,
                'key'=>$dep->id

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Public Request Type"],"Empty",200);

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
     * @param  \App\Models\PublicRequestStatus  $publicRequestStatus
     * @return \Illuminate\Http\Response
     */
    public function show(PublicRequestStatus $publicRequestStatus)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\PublicRequestStatus  $publicRequestStatus
     * @return \Illuminate\Http\Response
     */
    public function edit(PublicRequestStatus $publicRequestStatus)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\PublicRequestStatus  $publicRequestStatus
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, PublicRequestStatus $publicRequestStatus)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\PublicRequestStatus  $publicRequestStatus
     * @return \Illuminate\Http\Response
     */
    public function destroy(PublicRequestStatus $publicRequestStatus)
    {
        //
    }
}
