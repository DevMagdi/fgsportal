<?php

namespace App\Http\Controllers\Settings\License;

use App\Http\Controllers\Controller;
  use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
 
 use App\Models\LicenseType;
 
class LicenseTypeController extends Controller
{
    public function DeleteLicenseType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'license_type_id'=>'required|numeric|exists:license_types,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $licenceType=  LicenseType::where('id',$request->license_type_id)->first();

          if(!empty($licenceType->id)){

            $licenceType->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"License Type not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateLicenseType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'license_type' => 'required|string|unique:license_types',
                'token'=>'required|string',
                'license_type_id'=>'required|numeric|exists:license_types,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $licenceType=  LicenseType::where('id',$request->license_type_id)->first();

          if(!empty($licenceType->id)){

            $licenceType->update([
                'license_type' =>$request->license_type,
            ]);

            return ResponseApi::acceptedResponseApi($licenceType,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"License type not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateLicenseType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'license_type' => 'required|string|unique:license_types',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $licenceType=  LicenseType::create([

            'license_type' =>$request->license_type,
           ]);
         
        
          return ResponseApi::acceptedResponseApi($licenceType,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllLicenseType(){
        try{
          $licenceType = LicenseType::all();
          if(!empty($licenceType[0]->id)){
            foreach($licenceType as $dep){
            $array_reponse[] = [ 
                'license_type' =>$dep->license_type,
                'id'=>$dep->id.''

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty License Type"],"Empty",200);

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
     * @param  \App\Models\LicenceType  $licenceType
     * @return \Illuminate\Http\Response
     */
    public function show(LicenceType $licenceType)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\LicenceType  $licenceType
     * @return \Illuminate\Http\Response
     */
    public function edit(LicenceType $licenceType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\LicenceType  $licenceType
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, LicenceType $licenceType)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\LicenceType  $licenceType
     * @return \Illuminate\Http\Response
     */
    public function destroy(LicenceType $licenceType)
    {
        //
    }
}
