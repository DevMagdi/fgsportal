<?php

namespace App\Http\Controllers\User\Business\Settings\ContactLeadStatus;
use App\Http\Controllers\Controller;
use App\Models\ContactLeadStatus;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;

class ContactLeadStatusController extends Controller
{

    
   

    public function DeleteContactStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'contact_status_id'=>'required|numeric|exists:contact_lead_statuses',
                ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }

          $phoneType=  ContactLeadStatus::where('id',$request->contact_status_id)->first();
          if(!empty($phoneType->id)){

            $phoneType->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Contact Status not found"],"Validator Errors",400);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateContactStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'contact_status_id'=>'required|numeric|exists:contact_lead_statuses',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }
          $phoneType=  ContactLeadStatus::where('id',$request->contact_status_id)->first();
          if(!empty($request->label_name)){
            $validator = Validator::make($request->all(), [
                'contact_status_name' => 'required|string|unique:contact_lead_statuses',
            ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }
          }
          if(!empty($phoneType->id)){
            $phoneType->update($request->all());
            return ResponseApi::acceptedResponseApi($phoneType,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Contact Status not found"],"Validator Errors",400);

          }
              
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateContactStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'contact_status_name' => 'required|string|unique:contact_lead_statuses',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }
          $phoneType=  ContactLeadStatus::create([
            'contact_status_name' =>$request->contact_status_name,
           ]);
        
          return ResponseApi::acceptedResponseApi($phoneType,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllContactStatus(){
        try{
          $phones = ContactLeadStatus::all();
          if(!empty($phones[0]->id)){
            foreach($phones as $dep){
            $array_reponse[] = [ 
                'contact_status_name' =>$dep->contact_status_name,
                'id'=>$dep->id.''

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Contact Status"],"Empty",200);

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
     * @param  \App\Models\ContactLeadStatus  $contactLeadStatus
     * @return \Illuminate\Http\Response
     */
    public function show(ContactLeadStatus $contactLeadStatus)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ContactLeadStatus  $contactLeadStatus
     * @return \Illuminate\Http\Response
     */
    public function edit(ContactLeadStatus $contactLeadStatus)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ContactLeadStatus  $contactLeadStatus
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ContactLeadStatus $contactLeadStatus)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ContactLeadStatus  $contactLeadStatus
     * @return \Illuminate\Http\Response
     */
    public function destroy(ContactLeadStatus $contactLeadStatus)
    {
        //
    }
}
