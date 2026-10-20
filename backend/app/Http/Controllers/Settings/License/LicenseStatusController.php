<?php

namespace App\Http\Controllers\Settings\License;

use App\Http\Controllers\Controller;
  use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
 
 use App\Models\LicenseStatus;
 
  
class LicenseStatusController extends Controller
{
    public function DeleteLicenseStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'license_status_id'=>'required|numeric|exists:license_statuses,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $licenceStatus=  LicenseStatus::where('id',$request->license_status_id)->first();

          if(!empty($licenceStatus->id)){

            $licenceStatus->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"License Status not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateLicenseStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'license_status_name' => 'required|string|unique:license_statuses',
                'token'=>'required|string',
                'license_status_id'=>'required|numeric|exists:license_statuses,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $licenceStatus=  LicenseStatus::where('id',$request->license_status_id)->first();

          if(!empty($licenceStatus->id)){

            $licenceStatus->update([
                'license_status_name' =>$request->license_status_name,
            ]);

            return ResponseApi::acceptedResponseApi($licenceStatus,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"License Status not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateLicenseStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'license_status_name' => 'required|string|unique:license_statuses',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $licenceStatus=  LicenseStatus::create([

            'license_status_name' =>$request->license_status_name,
           ]);
         
        
          return ResponseApi::acceptedResponseApi($licenceStatus,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllLicenseStatus(){
        try{
          $licenceStatus = LicenseStatus::all();
          if(!empty($licenceStatus[0]->id)){
            foreach($licenceStatus as $dep){
            $array_reponse[] = [ 
                'license_status_name' =>$dep->license_status_name,
                'id'=>$dep->id.''

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty License Status"],"Empty",200);

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
     * @param  \App\Models\LicenceStatus  $licenceStatus
     * @return \Illuminate\Http\Response
     */
    public function show(LicenceStatus $licenceStatus)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\LicenceStatus  $licenceStatus
     * @return \Illuminate\Http\Response
     */
    public function edit(LicenceStatus $licenceStatus)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\LicenceStatus  $licenceStatus
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, LicenceStatus $licenceStatus)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\LicenceStatus  $licenceStatus
     * @return \Illuminate\Http\Response
     */
    public function destroy(LicenceStatus $licenceStatus)
    {
        //
    }
}
