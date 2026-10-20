<?php

namespace App\Http\Controllers\Client\TicketingSystem\ContractSupport;

use App\Http\Controllers\Controller;
  use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;

use App\Models\ContractType;

class ContractTypeController extends Controller
{
    public function DeleteContractType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'contract_type_id'=>'required|numeric|exists:contract_types,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $ContractType=  ContractType::where('id',$request->contract_type_id)->first();

          if(!empty($ContractType->id)){

            $ContractType->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"ContractType not found"],"Validator Errors",400);

          }
         
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateContractType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'contract_type_id'=>'required|numeric|exists:contract_types,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $ContractType=  ContractType::where('id',$request->contract_type_id)->first();

          if(!empty($ContractType->id)){

            $ContractType->update($request->all());

            return ResponseApi::acceptedResponseApi($ContractType,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Contracttype not found"],"Validator Errors",400);

          }
         
    
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateContractType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'contract_type' => 'required|string|unique:contract_types',
                'contract_type_hours' => 'required|numeric',
                'contract_type_day' => 'required|numeric',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $ContractType=  ContractType::create([
            'contract_type_hours'=>$request->contract_type,
            'contract_type_day'=>$request->contract_type,
            'contract_type' =>$request->contract_type,
           ]);
         
        
          return ResponseApi::acceptedResponseApi($ContractType,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllContractType(){
        try{
          $ContractType = ContractType::all();
          if(!empty($ContractType[0]->id)){
            foreach($ContractType as $dep){
            $array_reponse[] = [ 
                'contract_type' =>$dep->contract_type,
                'contract_type_day' =>$dep->contract_type_day,
                'contract_type_hours' =>$dep->contract_type_hours,
                'id'=>$dep->id.''
            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty ContractType"],"Empty",200);

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
     * @param  \App\Models\ContractType  $contractType
     * @return \Illuminate\Http\Response
     */
    public function show(ContractType $contractType)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ContractType  $contractType
     * @return \Illuminate\Http\Response
     */
    public function edit(ContractType $contractType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ContractType  $contractType
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ContractType $contractType)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ContractType  $contractType
     * @return \Illuminate\Http\Response
     */
    public function destroy(ContractType $contractType)
    {
        //
    }
}
