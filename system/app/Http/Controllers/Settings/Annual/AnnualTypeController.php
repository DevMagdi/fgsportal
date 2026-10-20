<?php

namespace App\Http\Controllers\Settings\Annual;

use App\Http\Controllers\Controller;
  use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
 
 use App\Models\AnnualType;
 
class AnnualTypeController extends Controller
{
    

    public function DeleteAnnualType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'annual_type_id'=>'required|numeric|exists:annual_types,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $annualType=  AnnualType::where('id',$request->annual_type_id)->first();

          if(!empty($annualType->id)){

            $annualType->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Annual Type not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateAnnualType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'annual_type' => 'required|string|unique:annual_types',
                'token'=>'required|string',
                'annual_type_id'=>'required|numeric|exists:annual_types,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $annualType=  AnnualType::where('id',$request->annual_type_id)->first();

          if(!empty($annualType->id)){

            $annualType->update([
                'annual_type' =>$request->annual_type,
            ]);

            return ResponseApi::acceptedResponseApi($annualType,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Annual type not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateAnnualType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'annual_type' => 'required|string|unique:annual_types',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $annualType=  AnnualType::create([

            'annual_type' =>$request->annual_type,
           ]);
         
        
          return ResponseApi::acceptedResponseApi($annualType,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllAnnualType(){
        try{
          $annualType = AnnualType::all();
          if(!empty($annualType[0]->id)){
            foreach($annualType as $dep){
            $array_reponse[] = [ 
                'annual_type' =>$dep->annual_type,
                'id'=>$dep->id.''
            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Annual Type"],"Empty",200);

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
     * @param  \App\Models\annualType  $annualType
     * @return \Illuminate\Http\Response
     */
    public function show(LicenceType $annualType)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\LicenceType  $annualType
     * @return \Illuminate\Http\Response
     */
    public function edit(LicenceType $annualType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\LicenceType  $annualType
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, LicenceType $annualType)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\LicenceType  $annualType
     * @return \Illuminate\Http\Response
     */
    public function destroy(LicenceType $annualType)
    {
        //
    }
}
