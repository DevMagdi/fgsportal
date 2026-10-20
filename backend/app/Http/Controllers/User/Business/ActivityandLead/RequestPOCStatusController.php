<?php

namespace App\Http\Controllers\User\Business\ActivityandLead;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\UserDetail;
use App\Models\ContactLead;
use App\Models\ContactLeadActivity;
use App\Models\ContactLeadDublicate;
use Illuminate\Http\Request;
use App\Models\ContactLeadStatus;
use App\Models\ContactLeadSubStatus;
use App\Models\ContactLeadType;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use App\Models\ContactLeadAttach;
use App\Models\RequestPOCStatus;
 
class RequestPOCStatusController extends Controller
{
    
    


    public function DeleteRequestPOCStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'request_poc_status_id'=>'required|numeric|exists:request_p_o_c_statuses,id',
                ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }

          $phoneType=  RequestPOCStatus::where('id',$request->request_poc_status_id)->first();
          if(!empty($phoneType->id)){

            $phoneType->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Status not found"],"Validator Errors",400);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateRequestPOCStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'request_poc_status_id'=>'required|numeric|exists:request_p_o_c_statuses,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }
          $phoneType=  RequestPOCStatus::where('id',$request->request_poc_status_id)->first();
          if(!empty($request->label_name)){
            $validator = Validator::make($request->all(), [
                'reqeust_poc_status_name' => 'required|string|unique:request_p_o_c_statuses',
            ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }
          }
          if(!empty($phoneType->id)){
            $phoneType->update($request->all());
            return ResponseApi::acceptedResponseApi($phoneType,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Status not found"],"Validator Errors",400);

          }
              
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateRequestPOCStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'reqeust_poc_status_name' => 'required|string|unique:request_p_o_c_statuses',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }
          $phoneType=  RequestPOCStatus::create([
            'reqeust_poc_status_name' =>$request->reqeust_poc_status_name,
           ]);
        
          return ResponseApi::acceptedResponseApi($phoneType,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllRequestPOCStatus(){
        try{
          $phones = RequestPOCStatus::all();
          if(!empty($phones[0]->id)){
            foreach($phones as $dep){
            $array_reponse[] = [ 
                'reqeust_poc_status_name' =>$dep->reqeust_poc_status_name,
                'id'=>$dep->id.''

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Status"],"Empty",200);

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
     * @param  \App\Models\RequestPOCStatus  $requestPOCStatus
     * @return \Illuminate\Http\Response
     */
    public function show(RequestPOCStatus $requestPOCStatus)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\RequestPOCStatus  $requestPOCStatus
     * @return \Illuminate\Http\Response
     */
    public function edit(RequestPOCStatus $requestPOCStatus)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\RequestPOCStatus  $requestPOCStatus
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, RequestPOCStatus $requestPOCStatus)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\RequestPOCStatus  $requestPOCStatus
     * @return \Illuminate\Http\Response
     */
    public function destroy(RequestPOCStatus $requestPOCStatus)
    {
        //
    }
}
