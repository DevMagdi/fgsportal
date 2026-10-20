<?php

namespace App\Http\Controllers\InstallmentFeature;

use App\Http\Controllers\Controller;
  use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;

 use App\Models\InstallmentType;
use Illuminate\Http\Request;


class InstallmentTypeController extends Controller
{
  
    public function DeleteInstallmentType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'installment_type_id'=>'required|numeric|exists:installment_types,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus=  InstallmentType::where('id',$request->installment_type_id)->first();

          if(!empty($reportStatus->id)){

            $reportStatus->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Installment Type not found"],"Validator Errors",400);

          }
         
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateInstallmentType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'installment_type_name' => 'required|string|unique:installment_types',
                'token'=>'required|string',
                'installment_type_id'=>'required|numeric|exists:installment_types,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus=  InstallmentType::where('id',$request->installment_type_id)->first();

          if(!empty($reportStatus->id)){

            $reportStatus->update([
                'installment_type_name' =>$request->installment_type_name,
            ]);

            return ResponseApi::acceptedResponseApi($reportStatus,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Installment Type not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateInstallmentType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'installment_type_name' => 'required|string|unique:installment_types',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus=  InstallmentType::create([

            'installment_type_name' =>$request->installment_type_name,
           ]);
         
        
          return ResponseApi::acceptedResponseApi($reportStatus,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllInstallmentType(Request $request){
        try{
           $validator = Validator::make($request->all(), [
                    'token'=>'required|string'
                ]);
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
    
            
          $reportStatus = InstallmentType::all();
          if(!empty($reportStatus[0]->id)){
            foreach($reportStatus as $dep){
            $array_reponse[] = [ 
                'installment_type_name' =>$dep->installment_type_name,
                'id'=>$dep->id.''

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Installment Type"],"Empty",200);

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
     * @param  \App\Models\InstallmentType  $installmentType
     * @return \Illuminate\Http\Response
     */
    public function show(InstallmentType $installmentType)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\InstallmentType  $installmentType
     * @return \Illuminate\Http\Response
     */
    public function edit(InstallmentType $installmentType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\InstallmentType  $installmentType
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, InstallmentType $installmentType)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\InstallmentType  $installmentType
     * @return \Illuminate\Http\Response
     */
    public function destroy(InstallmentType $installmentType)
    {
        //
    }
}
