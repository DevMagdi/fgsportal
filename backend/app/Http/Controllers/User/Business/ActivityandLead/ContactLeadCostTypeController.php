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
use App\Models\ContactLeadCostType;
 
class ContactLeadCostTypeController extends Controller
{


    public function DeleteLeadCostType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'lead_cost_type_id'=>'required|numeric|exists:contact_lead_cost_types,id',
                ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }

          $phoneType=  ContactLeadCostType::where('id',$request->lead_cost_type_id)->first();
          if(!empty($phoneType->id)){

            $phoneType->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Type not found"],"Validator Errors",400);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateLeadCostType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'lead_cost_type_id'=>'required|numeric|exists:contact_lead_cost_types,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }
          $phoneType=  ContactLeadCostType::where('id',$request->lead_cost_type_id)->first();
          if(!empty($request->label_name)){
            $validator = Validator::make($request->all(), [
                'lead_cost_type' => 'required|string|unique:contact_lead_cost_types',
            ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }
          }
          if(!empty($phoneType->id)){
            $phoneType->update($request->all());
            return ResponseApi::acceptedResponseApi($phoneType,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Type not found"],"Validator Errors",400);

          }
              
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateLeadCostType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'lead_cost_type' => 'required|string|unique:contact_lead_cost_types',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }
          $phoneType=  ContactLeadCostType::create([
            'lead_cost_type' =>$request->lead_cost_type,
           ]);
        
          return ResponseApi::acceptedResponseApi($phoneType,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllLeadCostType(){
        try{
          $phones = ContactLeadCostType::all();
          if(!empty($phones[0]->id)){
            foreach($phones as $dep){
            $array_reponse[] = [ 
                'lead_cost_type' =>$dep->lead_cost_type,
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
     * @param  \App\Models\ContactLeadCostType  $contactLeadCostType
     * @return \Illuminate\Http\Response
     */
    public function show(ContactLeadCostType $contactLeadCostType)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ContactLeadCostType  $contactLeadCostType
     * @return \Illuminate\Http\Response
     */
    public function edit(ContactLeadCostType $contactLeadCostType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ContactLeadCostType  $contactLeadCostType
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ContactLeadCostType $contactLeadCostType)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ContactLeadCostType  $contactLeadCostType
     * @return \Illuminate\Http\Response
     */
    public function destroy(ContactLeadCostType $contactLeadCostType)
    {
        //
    }
}
