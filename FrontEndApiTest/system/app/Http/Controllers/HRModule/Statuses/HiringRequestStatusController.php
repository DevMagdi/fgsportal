<?php

namespace App\Http\Controllers\HRModule\Statuses;

use App\Http\Controllers\Controller;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\HiringRequestStatus;
 
class HiringRequestStatusController extends Controller
{



    public function DeleteHiringRequestStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'id'=>'required|numeric|exists:hiring_request_statuses,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus=  HiringRequestStatus::where('id',$request->id)->first();

          if(!empty($reportStatus->id)){

            $reportStatus->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Hiring Status not found"],"Validator Errors",400);

          }
         
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateHiringRequestStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'hiring_request_status' => 'required|string|unique:hiring_request_statuses',
                'token'=>'required|string',
                'id'=>'required|numeric|exists:hiring_request_statuses,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus=  HiringRequestStatus::where('id',$request->id)->first();

          if(!empty($reportStatus->id)){

            $reportStatus->update([
                'hiring_request_status' =>$request->hiring_request_status,
            ]);

            return ResponseApi::acceptedResponseApi($reportStatus,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Hiring Status not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateHiringRequestStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'hiring_request_status' => 'required|string|unique:hiring_request_statuses',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus=  HiringRequestStatus::create([

            'hiring_request_status' =>$request->hiring_request_status,
           ]);
         
        
          return ResponseApi::acceptedResponseApi($reportStatus,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllHiringRequestStatus(Request $request){
        try{
           $validator = Validator::make($request->all(), [
                    'token'=>'required|string'
                ]);
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
    
            
          $reportStatus = HiringRequestStatus::all();
          if(!empty($reportStatus[0]->id)){
            foreach($reportStatus as $dep){
            $array_reponse[] = [ 
                'hiring_request_status' =>$dep->hiring_request_status,
                'id'=>$dep->id.''

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Hiring Status "],"Empty",200);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }  

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
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
     * @param  \App\Models\HiringRequestStatus  $hiringRequestStatus
     * @return \Illuminate\Http\Response
     */
    public function show(HiringRequestStatus $hiringRequestStatus)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\HiringRequestStatus  $hiringRequestStatus
     * @return \Illuminate\Http\Response
     */
    public function edit(HiringRequestStatus $hiringRequestStatus)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\HiringRequestStatus  $hiringRequestStatus
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, HiringRequestStatus $hiringRequestStatus)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\HiringRequestStatus  $hiringRequestStatus
     * @return \Illuminate\Http\Response
     */
    public function destroy(HiringRequestStatus $hiringRequestStatus)
    {
        //
    }
}
