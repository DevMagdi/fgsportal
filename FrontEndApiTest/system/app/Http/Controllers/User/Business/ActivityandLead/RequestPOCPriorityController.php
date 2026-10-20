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
 use App\Models\RequestPOCPriority;
 
class RequestPOCPriorityController extends Controller
{


    public function DeleteRequestPOCPriority(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'request_poc_priority_id'=>'required|numeric|exists:request_p_o_c_priorities,id',
                ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }

          $phoneType=  RequestPOCPriority::where('id',$request->request_poc_priority_id)->first();
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
    public function UpdateRequestPOCPriority(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'request_poc_priority_id'=>'required|numeric|exists:request_p_o_c_priorities,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }
          $phoneType=  RequestPOCPriority::where('id',$request->request_poc_priority_id)->first();
          if(!empty($request->label_name)){
            $validator = Validator::make($request->all(), [
                'reqeust_poc_priority_name' => 'required|string|unique:request_p_o_c_priorities',
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
    public function CreateRequestPOCPriority(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'reqeust_poc_priority_name' => 'required|string|unique:request_p_o_c_priorities',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }
          $phoneType=  RequestPOCPriority::create([
            'reqeust_poc_priority_name' =>$request->reqeust_poc_priority_name,
           ]);
        
          return ResponseApi::acceptedResponseApi($phoneType,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllRequestPOCPriority(){
        try{
          $phones = RequestPOCPriority::all();
          if(!empty($phones[0]->id)){
            foreach($phones as $dep){
            $array_reponse[] = [ 
                'reqeust_poc_priority_name' =>$dep->reqeust_poc_priority_name,
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
     * @param  \App\Models\RequestPOCPriority  $requestPOCPriority
     * @return \Illuminate\Http\Response
     */
    public function show(RequestPOCPriority $requestPOCPriority)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\RequestPOCPriority  $requestPOCPriority
     * @return \Illuminate\Http\Response
     */
    public function edit(RequestPOCPriority $requestPOCPriority)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\RequestPOCPriority  $requestPOCPriority
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, RequestPOCPriority $requestPOCPriority)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\RequestPOCPriority  $requestPOCPriority
     * @return \Illuminate\Http\Response
     */
    public function destroy(RequestPOCPriority $requestPOCPriority)
    {
        //
    }
}
