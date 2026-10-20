<?php

namespace App\Http\Controllers\TechReport;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use App\Models\ReportStatus;

class ReportStatusController extends Controller
{
   
    public function DeleteReportStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'report_status_id'=>'required|numeric|exists:report_statuses,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus=  ReportStatus::where('id',$request->report_status_id)->first();

          if(!empty($reportStatus->id)){

            $reportStatus->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Report Status not found"],"Validator Errors",400);

          }
         
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateReportStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'report_status_name' => 'required|string|unique:report_statuses',
                'token'=>'required|string',
                'report_status_id'=>'required|numeric|exists:report_statuses,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus=  ReportStatus::where('id',$request->report_status_id)->first();

          if(!empty($reportStatus->id)){

            $reportStatus->update([
                'report_status_name' =>$request->report_status_name,
            ]);

            return ResponseApi::acceptedResponseApi($reportStatus,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Report Status not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateReportStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'report_status_name' => 'required|string|unique:report_statuses',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus=  ReportStatus::create([

            'report_status_name' =>$request->report_status_name,
           ]);
         
        
          return ResponseApi::acceptedResponseApi($reportStatus,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllReportStatus(){
        try{
          $reportStatus = ReportStatus::all();
          if(!empty($reportStatus[0]->id)){
            foreach($reportStatus as $dep){
            $array_reponse[] = [ 
                'report_status_name' =>$dep->report_status_name,
                'key'=>$dep->id

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Report Status"],"Empty",200);

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
     * @param  \App\Models\ReportStatus  $reportStatus
     * @return \Illuminate\Http\Response
     */
    public function show(ReportStatus $reportStatus)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ReportStatus  $reportStatus
     * @return \Illuminate\Http\Response
     */
    public function edit(ReportStatus $reportStatus)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ReportStatus  $reportStatus
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ReportStatus $reportStatus)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ReportStatus  $reportStatus
     * @return \Illuminate\Http\Response
     */
    public function destroy(ReportStatus $reportStatus)
    {
        //
    }
}
