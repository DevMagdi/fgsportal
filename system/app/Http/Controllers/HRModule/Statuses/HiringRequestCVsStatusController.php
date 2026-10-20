<?php

namespace App\Http\Controllers\HRModule\Statuses;

use App\Http\Controllers\Controller;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Str; 
use App\Models\HiringRequestCVsStatus;
 use Illuminate\Http\Request;

class HiringRequestCVsStatusController extends Controller
{

   

    public function DeleteHiringRequestStatusCV(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'id'=>'required|numeric|exists:hiring_request_c_vs_statuses,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus=  HiringRequestCVsStatus::where('id',$request->id)->first();

          if(!empty($reportStatus->id)){

            $reportStatus->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Hiring CV Status not found"],"Validator Errors",400);

          }
         
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateHiringRequestStatusCV(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'hiring_request_cv_status' => 'required|string|unique:hiring_request_c_vs_statuses',
                'token'=>'required|string',
                'id'=>'required|numeric|exists:hiring_request_c_vs_statuses,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus=  HiringRequestCVsStatus::where('id',$request->id)->first();

          if(!empty($reportStatus->id)){

            $reportStatus->update([
                'hiring_request_cv_status' =>$request->hiring_request_cv_status,
            ]);

            return ResponseApi::acceptedResponseApi($reportStatus,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Hiring CV Status not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateHiringRequestStatusCV(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'hiring_request_cv_status' => 'required|string|unique:hiring_request_c_vs_statuses',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus=  HiringRequestCVsStatus::create([

            'hiring_request_cv_status' =>$request->hiring_request_cv_status,
           ]);
         
        
          return ResponseApi::acceptedResponseApi($reportStatus,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllHiringRequestStatusCV(Request $request){
        try{
           $validator = Validator::make($request->all(), [
                    'token'=>'required|string'
                ]);
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
    
            
          $reportStatus = HiringRequestCVsStatus::all();
          if(!empty($reportStatus[0]->id)){
            foreach($reportStatus as $dep){
            $array_reponse[] = [ 
                'hiring_request_cv_status' =>$dep->hiring_request_cv_status,
                'id'=>$dep->id.''

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Hiring CV Status "],"Empty",200);

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
     * @param  \App\Models\HiringRequestCVsStatus  $hiringRequestCVsStatus
     * @return \Illuminate\Http\Response
     */
    public function show(HiringRequestCVsStatus $hiringRequestCVsStatus)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\HiringRequestCVsStatus  $hiringRequestCVsStatus
     * @return \Illuminate\Http\Response
     */
    public function edit(HiringRequestCVsStatus $hiringRequestCVsStatus)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\HiringRequestCVsStatus  $hiringRequestCVsStatus
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, HiringRequestCVsStatus $hiringRequestCVsStatus)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\HiringRequestCVsStatus  $hiringRequestCVsStatus
     * @return \Illuminate\Http\Response
     */
    public function destroy(HiringRequestCVsStatus $hiringRequestCVsStatus)
    {
        //
    }
}
