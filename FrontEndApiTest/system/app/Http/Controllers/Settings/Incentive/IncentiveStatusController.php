<?php


namespace App\Http\Controllers\Settings\Incentive;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use App\Models\IncentiveStatus;

class IncentiveStatusController extends Controller
{

   
    public function DeleteIncentiveStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'incentive_status_id'=>'required|numeric|exists:incentive_statuses,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $incentive=  IncentiveStatus::where('id',$request->incentive_status_id)->first();

          if(!empty($incentive->id)){

            $incentive->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Incentive Request  not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateIncentiveStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'incentive_status_name' => 'required|string|unique:incentive_statuses',
                'token'=>'required|string',
                'incentive_status_id'=>'required|numeric|exists:incentive_statuses,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $incentive=  IncentiveStatus::where('id',$request->incentive_status_id)->first();

          if(!empty($incentive->id)){

            $incentive->update([
                'incentive_status_name' =>$request->incentive_status_name,
            ]);

            return ResponseApi::acceptedResponseApi($incentive,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Incentive Request  not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateIncentiveStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'incentive_status_name' => 'required|string|unique:incentive_statuses',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $incentive=  IncentiveStatus::create([

            'incentive_status_name' =>$request->incentive_status_name,
           ]);
         
        
          return ResponseApi::acceptedResponseApi($incentive,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetIncentiveStatus(){
        try{
          $incentive = IncentiveStatus::all();
          if(!empty($incentive[0]->id)){
            foreach($incentive as $dep){
            $array_reponse[] = [ 
                'incentive_status_name' =>$dep->incentive_status_name,
                'key'=>$dep->id

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Incentive Request Type"],"Empty",200);

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
     * @param  \App\Models\PublicRequestStatus  $publicRequestStatus
     * @return \Illuminate\Http\Response
     */
    public function show(PublicRequestStatus $publicRequestStatus)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\PublicRequestStatus  $publicRequestStatus
     * @return \Illuminate\Http\Response
     */
    public function edit(PublicRequestStatus $publicRequestStatus)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\PublicRequestStatus  $publicRequestStatus
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, PublicRequestStatus $publicRequestStatus)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\PublicRequestStatus  $publicRequestStatus
     * @return \Illuminate\Http\Response
     */
    public function destroy(PublicRequestStatus $publicRequestStatus)
    {
        //
    }
}
