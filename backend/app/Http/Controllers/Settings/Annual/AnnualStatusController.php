<?php

namespace App\Http\Controllers\Settings\Annual;

use App\Http\Controllers\Controller;
  use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
 
 use App\Models\AnnualStatus;
 
class AnnualStatusController extends Controller
{

    
    public function DeleteAnnualStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'annual_status_id'=>'required|numeric|exists:annual_statuses,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $annualStatus=  AnnualStatus::where('id',$request->annual_status_id)->first();

          if(!empty($annualStatus->id)){

            $annualStatus->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Annual Status not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateAnnualStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'annual_status_name' => 'required|string|unique:annual_statuses',
                'token'=>'required|string',
                'annual_status_id'=>'required|numeric|exists:annual_statuses,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $annualStatus=  AnnualStatus::where('id',$request->annual_status_id)->first();

          if(!empty($annualStatus->id)){

            $annualStatus->update([
                'annual_status_name' =>$request->annual_status_name,
            ]);

            return ResponseApi::acceptedResponseApi($annualStatus,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Annual Status not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateAnnualStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'annual_status_name' => 'required|string|unique:annual_statuses',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $annualStatus=  AnnualStatus::create([

            'annual_status_name' =>$request->annual_status_name,
           ]);
         
        
          return ResponseApi::acceptedResponseApi($annualStatus,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllAnnualStatus(){
        try{
          $annualStatus = AnnualStatus::all();
          if(!empty($annualStatus[0]->id)){
            foreach($annualStatus as $dep){
            $array_reponse[] = [ 
                'annual_status_name' =>$dep->annual_status_name,
                'id'=>$dep->id.''
            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Annual Status"],"Empty",200);

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
     * @param  \App\Models\AnnualStatus  $annualStatus
     * @return \Illuminate\Http\Response
     */
    public function show(AnnualStatus $annualStatus)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\AnnualStatus  $annualStatus
     * @return \Illuminate\Http\Response
     */
    public function edit(AnnualStatus $annualStatus)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\AnnualStatus  $annualStatus
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, AnnualStatus $annualStatus)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\AnnualStatus  $annualStatus
     * @return \Illuminate\Http\Response
     */
    public function destroy(AnnualStatus $annualStatus)
    {
        //
    }
}
