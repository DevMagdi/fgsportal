<?php

namespace App\Http\Controllers\User\Business\Settings\ContactLeadType;
use App\Http\Controllers\Controller;
use App\Models\ContactLeadType;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;

class ContactLeadTypeController extends Controller
{

    
    public function DeleteContactLeadType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'lead_type_id'=>'required|numeric|exists:contact_lead_types',
                ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }

          $phoneType=  ContactLeadType::where('id',$request->lead_type_id)->first();
          if(!empty($phoneType->id)){

            $phoneType->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Lead Type not found"],"Validator Errors",400);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateContactLeadType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'lead_type_id'=>'required|numeric|exists:contact_lead_types',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }
          $phoneType=  ContactLeadType::where('id',$request->lead_type_id)->first();
          if(!empty($request->label_name)){
            $validator = Validator::make($request->all(), [
                'lead_type_name' => 'required|string|unique:contact_lead_types',
            ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }
          }
          if(!empty($phoneType->id)){
            $phoneType->update($request->all());
            return ResponseApi::acceptedResponseApi($phoneType,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Lead Type not found"],"Validator Errors",400);

          }
              
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateContactLeadType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'lead_type_name' => 'required|string|unique:contact_lead_types',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }
          $phoneType=  ContactLeadType::create([
            'lead_type_name' =>$request->lead_type_name,
           ]);
        
          return ResponseApi::acceptedResponseApi($phoneType,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllContactLeadType(){
        try{
          $phones = ContactLeadType::all();
          if(!empty($phones[0]->id)){
            foreach($phones as $dep){
            $array_reponse[] = [ 
                'lead_type_name' =>$dep->lead_type_name,
                'id'=>$dep->id.''

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Contact Type"],"Empty",200);

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
     * @param  \App\Models\ContactLeadType  $contactLeadType
     * @return \Illuminate\Http\Response
     */
    public function show(ContactLeadType $contactLeadType)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ContactLeadType  $contactLeadType
     * @return \Illuminate\Http\Response
     */
    public function edit(ContactLeadType $contactLeadType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ContactLeadType  $contactLeadType
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ContactLeadType $contactLeadType)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ContactLeadType  $contactLeadType
     * @return \Illuminate\Http\Response
     */
    public function destroy(ContactLeadType $contactLeadType)
    {
        //
    }
}
