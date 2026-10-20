<?php

namespace App\Http\Controllers\User\Business\Settings\AdsPlatform;
use App\Http\Controllers\Controller;
use App\Models\AdsPlatform;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;

class AdsPlatformController extends Controller
{
    
    public function DeleteAdsPlatform(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'platform_id'=>'required|numeric|exists:ads_platforms',
                ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }

          $phoneType=  AdsPlatform::where('id',$request->platform_id)->first();
          if(!empty($phoneType->id)){

            $phoneType->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Platform not found"],"Validator Errors",400);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateAdsPlatform(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'platform_id'=>'required|numeric|exists:ads_platforms',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }
          $phoneType=  AdsPlatform::where('id',$request->platform_id)->first();
          if(!empty($request->label_name)){
            $validator = Validator::make($request->all(), [
                'ads_platform_name' => 'required|string|unique:ads_platforms',
            ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }
          }
          if(!empty($phoneType->id)){
            $phoneType->update($request->all());
            return ResponseApi::acceptedResponseApi($phoneType,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Platform not found"],"Validator Errors",400);

          }
              
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateAdsPlatform(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'ads_platform_name' => 'required|string|unique:ads_platforms',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }
          $phoneType=  AdsPlatform::create([
            'ads_platform_name' =>$request->ads_platform_name,
           ]);
        
          return ResponseApi::acceptedResponseApi($phoneType,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllAdsPlatform(){
        try{
          $phones = AdsPlatform::all();
          if(!empty($phones[0]->id)){
            foreach($phones as $dep){
            $array_reponse[] = [ 
                'ads_platform_name' =>$dep->ads_platform_name,
                'id'=>$dep->id.''

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Platform"],"Empty",200);

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
     * @param  \App\Models\AdsPlatform  $adsPlatform
     * @return \Illuminate\Http\Response
     */
    public function show(AdsPlatform $adsPlatform)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\AdsPlatform  $adsPlatform
     * @return \Illuminate\Http\Response
     */
    public function edit(AdsPlatform $adsPlatform)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\AdsPlatform  $adsPlatform
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, AdsPlatform $adsPlatform)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\AdsPlatform  $adsPlatform
     * @return \Illuminate\Http\Response
     */
    public function destroy(AdsPlatform $adsPlatform)
    {
        //
    }
}
