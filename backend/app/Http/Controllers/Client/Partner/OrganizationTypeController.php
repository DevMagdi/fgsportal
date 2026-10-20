<?php

namespace App\Http\Controllers\Client\Partner;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use App\Models\ClientAccount;
use App\Models\TransportationRequest;
use App\Models\Partner;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
 use App\Events\TestNotification;
 use App\Models\ContactLead;
 use App\Models\Contact;
use App\Models\OrganizationType;


class OrganizationTypeController extends Controller
{

    

    public function DeleteOrganizeType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'organize_type_id'=>'required|numeric|exists:organization_types,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $costType=  OrganizationType::where('id',$request->organize_type_id)->first();

          if(!empty($costType->id)){

            $costType->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Organize Type not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateOrganizeType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'organize_type' => 'required|string|unique:organization_types',
                'token'=>'required|string',
                'organize_type_id'=>'required|numeric|exists:organization_types,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $costType=  OrganizationType::where('id',$request->organize_type_id)->first();

          if(!empty($costType->id)){

            $costType->update([
                'organize_type' =>$request->organize_type,
            ]);

            return ResponseApi::acceptedResponseApi($costType,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Organize type not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateOrganizeType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'organize_type' => 'required|string|unique:organization_types',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $costType=  OrganizationType::create([

            'organize_type' =>$request->organize_type,
           ]);
         
        
          return ResponseApi::acceptedResponseApi($costType,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllOrganizeType(){
        try{
            $costType = OrganizationType::all();
           if(!empty($costType[0]->id)){
            foreach($costType as $dep){
            $array_reponse[] = [ 
                'organize_type' =>$dep->organize_type,
                'id'=>$dep->id.''

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Organize Type"],"Empty",200);

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
     * @param  \App\Models\OrganizationType  $organizationType
     * @return \Illuminate\Http\Response
     */
    public function show(OrganizationType $organizationType)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\OrganizationType  $organizationType
     * @return \Illuminate\Http\Response
     */
    public function edit(OrganizationType $organizationType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\OrganizationType  $organizationType
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, OrganizationType $organizationType)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\OrganizationType  $organizationType
     * @return \Illuminate\Http\Response
     */
    public function destroy(OrganizationType $organizationType)
    {
        //
    }
}
