<?php

namespace App\Http\Controllers\Client\TicketingSystem\ContractSupport;

use App\Http\Controllers\Controller;
  use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;

use App\Models\ContractType;
use App\Models\ContractStatus;

class ContractStatusController extends Controller
{
    public function DeleteContractStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'contract_status_id'=>'required|numeric|exists:contract_statuses,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $ContractStatus=  ContractStatus::where('id',$request->contract_status_id)->first();

          if(!empty($ContractStatus->id)){

            $ContractStatus->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Contract Status not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateContractStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'contract_statuses_name' => 'required|string|unique:contract_statuses',
                'token'=>'required|string',
                'contract_status_id'=>'required|numeric|exists:contract_statuses,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $ContractStatus=  ContractStatus::where('id',$request->contract_status_id)->first();

          if(!empty($ContractStatus->id)){

            $ContractStatus->update([
                'contract_statuses_name' =>$request->contract_statuses_name,
            ]);

            return ResponseApi::acceptedResponseApi($ContractStatus,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Contract Status not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateContractStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'contract_statuses_name' => 'required|string|unique:contract_statuses',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $ContractStatus=  ContractStatus::create([

            'contract_statuses_name' =>$request->contract_statuses_name,
           ]);
         
        
          return ResponseApi::acceptedResponseApi($ContractStatus,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllContractStatus(){
        try{
          $ContractStatus = ContractStatus::all();
          if(!empty($ContractStatus[0]->id)){
            foreach($ContractStatus as $dep){
            $array_reponse[] = [ 
                'contract_statuses_name' =>$dep->contract_statuses_name,
                'id'=>$dep->id.''
            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Contract Status"],"Empty",200);

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
     * @param  \App\Models\ContractStatus  $contractStatus
     * @return \Illuminate\Http\Response
     */
    public function show(ContractStatus $contractStatus)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ContractStatus  $contractStatus
     * @return \Illuminate\Http\Response
     */
    public function edit(ContractStatus $contractStatus)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ContractStatus  $contractStatus
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ContractStatus $contractStatus)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ContractStatus  $contractStatus
     * @return \Illuminate\Http\Response
     */
    public function destroy(ContractStatus $contractStatus)
    {
        //
    }
}
