<?php

namespace App\Http\Controllers\User\Business\Settings\ContactLeadSubStatus;
use App\Http\Controllers\Controller;
use App\Models\ContactLeadSubStatus;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;

class ContactLeadSubStatusController extends Controller
{
    public function DeleteContactSubStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'contact_sub_status_id'=>'required|numeric|exists:contact_lead_sub_statuses,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }

          $department=  ContactLeadSubStatus::where('id',$request->contact_sub_status_id)->first();

          if(!empty($department->id)){

            $department->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Sub Status not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    
    public function UpdateContactSubStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'contact_sub_status_name' => 'unique:contact_lead_sub_statuses',
                'token'=>'required|string',
                'contact_status_id'=>'exists:contact_lead_statuses,id',
                'contact_sub_status_id'=>'required|numeric|exists:contact_lead_sub_statuses,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }

          $department=  ContactLeadSubStatus::where('id',$request->contact_sub_status_id)->first();

          if(!empty($department->id)){
            
            $department->update($request->all());

            return ResponseApi::acceptedResponseApi($department,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Sub Status not found"],"Validator Errors",400);

          }
         
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

  
    public function CreateContactSubStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'contact_sub_status_name' => 'required|string|unique:contact_lead_sub_statuses',
                'token'=>'required|string',
                'contact_status_id'=>'required|numeric|exists:contact_lead_statuses,id'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }
          $sub_department=  ContactLeadSubStatus::create([
            'contact_sub_status_name' =>$request->contact_sub_status_name,
            'contact_status_id' =>$request->contact_status_id,
           ]);
         
    
          return ResponseApi::acceptedResponseApi($sub_department,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }






    
    public function GetContactSubStatusForContactStatus(Request $request){
        try{
  
                $validator = Validator::make($request->all(), [
                    'token'=>'required|string',
                    'contact_status_id'=>'required|numeric|exists:contact_lead_statuses,id'
                    
                ]);
                if ($validator->fails()) {
    
                    return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
                }
                $department = ContactLeadSubStatus::where('contact_status_id',$request->contact_status_id)->get();
                
           
                if(!empty($department[0]->id)){
                    foreach($department as $dep){
                    $array_reponse[] = [ 
                        'contact_sub_status_name' =>$dep->contact_sub_status_name,
                        'id'=>$dep->id.''
                    ];
                }
                    return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

                }else{
                    return ResponseApi::notFoundResponse([],"Empty",200);

                }
            
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse($e,"server Error",500);

        }
        
    }

    

    public function GetAllContactSubStatus(){
        try{
          $subdepartment = ContactLeadSubStatus::all();
          if(!empty($subdepartment[0]->id)){
            foreach($subdepartment as $dep){
            $array_reponse[] = [ 
                'contact_sub_status_name' =>$dep->contact_sub_status_name,
                'contact_status_name' =>$dep->contact_status_id_fun->contact_status_name,
                'id' =>$dep->id.''
            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(null,"Empty",204);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(null,"server Error",500);

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
     * @param  \App\Models\ContactLeadSubStatus  $contactLeadSubStatus
     * @return \Illuminate\Http\Response
     */
    public function show(ContactLeadSubStatus $contactLeadSubStatus)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ContactLeadSubStatus  $contactLeadSubStatus
     * @return \Illuminate\Http\Response
     */
    public function edit(ContactLeadSubStatus $contactLeadSubStatus)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ContactLeadSubStatus  $contactLeadSubStatus
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ContactLeadSubStatus $contactLeadSubStatus)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ContactLeadSubStatus  $contactLeadSubStatus
     * @return \Illuminate\Http\Response
     */
    public function destroy(ContactLeadSubStatus $contactLeadSubStatus)
    {
        //
    }
}
