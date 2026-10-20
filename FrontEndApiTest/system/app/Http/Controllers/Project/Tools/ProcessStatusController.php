<?php

namespace App\Http\Controllers\Project\Tools;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
 
use App\Models\ProcessStatus;
class ProcessStatusController extends Controller
{
    public function DeleteProcessStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'process_status_id'=>'required|numeric|exists:process_statuses,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $processStatus=  ProcessStatus::where('id',$request->process_status_id)->first();

          if(!empty($processStatus->id)){

            $processStatus->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Process Status not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateProcessStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'process_status_name' => 'required|string|unique:process_statuses',
                'token'=>'required|string',
                'process_status_id'=>'required|numeric',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $processStatus=  ProcessStatus::where('id',$request->process_status_id)->first();

          if(!empty($processStatus->id)){

            $processStatus->update([
                'process_status_name' =>$request->process_status_name,
            ]);

            return ResponseApi::acceptedResponseApi($processStatus,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Process status not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateProcessStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'process_status_name' => 'required|string|unique:process_statuses',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $processStatus=  ProcessStatus::create([

            'process_status_name' =>$request->process_status_name,
           ]);
         
        
          return ResponseApi::acceptedResponseApi($processStatus,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllProcessStatus(){
        try{
          $processStatus = ProcessStatus::all();
          if(!empty($processStatus[0]->id)){
            foreach($processStatus as $dep){
            $array_reponse[] = [ 
                'process_status_name' =>$dep->process_status_name,
                'id'=>$dep->id

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Process Status"],"Empty",200);

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
     * @param  \App\Models\ProcessStatus  $processStatus
     * @return \Illuminate\Http\Response
     */
    public function show(ProcessStatus $processStatus)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProcessStatus  $processStatus
     * @return \Illuminate\Http\Response
     */
    public function edit(ProcessStatus $processStatus)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ProcessStatus  $processStatus
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ProcessStatus $processStatus)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProcessStatus  $processStatus
     * @return \Illuminate\Http\Response
     */
    public function destroy(ProcessStatus $processStatus)
    {
        //
    }
}
