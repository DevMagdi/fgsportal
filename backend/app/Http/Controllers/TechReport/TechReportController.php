<?php


namespace App\Http\Controllers\TechReport;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use App\Models\ReportStatus;
use App\Models\TechReportType;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Models\TechReport;
use App\Models\DailyTaskReport;
use App\Models\ClientMeetingReport;

class TechReportController extends Controller
{
    
    public function CreateTechReport(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'tech_report_type_id'=>'required|numeric|exists:tech_report_types,id',
                 'manager_approve_id'=>'required|numeric|exists:users,id',
                 'tech_report_details'=>'required|string',
                 'tech_report_date' => 'required|date|date_format:m/d/Y',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

            if($request->tech_report_type_id==6||$request->tech_report_type_id==7){
                $duration = 8;
            }else if(empty($request->duration)){
                return ResponseApi::badMethodErrorResponse(['message'=>"Need Duration To fill This Report"],"Validator Errors",400);
            }else{
                $duration =$request->duration;
            }

            if($request->tech_report_type_id==1||$request->tech_report_type_id==4){
                $validator = Validator::make($request->all(), [
                    'task_id'=>'required|numeric|exists:tasks,id',
                    'duration'=>'required|numeric',
                    'progress'=>'required|numeric',
                   ]);
               if ($validator->fails()) {
       
                   return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
               }
                    $report = TechReport::create([
                        'duration'=>$duration,
                        'tech_report_type_id'=>$request->tech_report_type_id,
                        'report_status_id'=>1,
                        'manager_approve_id'=>$request->manager_approve_id,
                        'user_creator_id'=>Auth::guard('user_api')->user()->id,
                        'tech_report_details'=>$request->tech_report_details,
                        'tech_report_date'=>Carbon::createFromFormat('m/d/Y', $request-> tech_report_date),
                    ]);
                    if(!empty($report->id)){
                        $daily_task_report = DailyTaskReport::create([
                            'progress'=>$request->progress? $request->progress : 0 ,
                            'tech_report_id'=>$report->id,
                            'task_id'=>$request->task_id,
                        ]);
                        return ResponseApi::acceptedResponseApi(["message"=>"Created Success"],"success",201);

                    }
            }else if($request->tech_report_type_id==3||$request->tech_report_type_id==5){
                $validator = Validator::make($request->all(), [
                    'process_id'=>'required|numeric|exists:processes,id',
                    'duration'=>'required|numeric',
                   ]);
               if ($validator->fails()) {
       
                   return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
               }
                    $report = TechReport::create([
                        'duration'=>$duration,
                        'tech_report_type_id'=>$request->tech_report_type_id,
                        'report_status_id'=>1,
                        'manager_approve_id'=>$request->manager_approve_id,
                        'user_creator_id'=>Auth::guard('user_api')->user()->id,
                        'tech_report_details'=>$request->tech_report_details,
                        'tech_report_date'=>Carbon::createFromFormat('m/d/Y', $request-> tech_report_date),
                    ]);
                    if(!empty($report->id)){
                        $client_meeting_report = ClientMeetingReport::create([
                            'tech_report_id'=>$report->id,
                            'process_id'=>$request->process_id,
                        ]);
                        return ResponseApi::acceptedResponseApi(["message"=>"Created Success"],"success",201);

                    }
               

            }else{
                $report = TechReport::create([
                    'duration'=>$duration,
                    'tech_report_type_id'=>$request->tech_report_type_id,
                    'report_status_id'=>1,
                    'manager_approve_id'=>$request->manager_approve_id,
                    'user_creator_id'=>Auth::guard('user_api')->user()->id,
                    'tech_report_details'=>$request->tech_report_details,
                    'tech_report_date'=>Carbon::createFromFormat('m/d/Y', $request-> tech_report_date),
                ]);
                return ResponseApi::acceptedResponseApi(["message"=>"Created Success"],"success",201);
            }

        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        

    }

    public function UpdateTechReport(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'tech_report_type_id'=>'required|numeric|exists:tech_report_types,id',
                 'manager_approve_id'=>'required|numeric|exists:users,id',
                 'tech_report_details'=>'required|string',
                 'tech_report_date' => 'required|date|date_format:m/d/Y',
                 'tech_report_id'=>'required|numeric|exists:tech_reports,id'
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

            if($request->tech_report_type_id==6||$request->tech_report_type_id==7){
                $duration = 8;
            }else if(empty($request->duration)){
                return ResponseApi::badMethodErrorResponse(['message'=>"Need Duration To fill This Report"],"Validator Errors",400);
            }else{
                $duration =$request->duration;
            }

            if($request->tech_report_type_id==1||$request->tech_report_type_id==4){
                $validator = Validator::make($request->all(), [
                    'task_id'=>'required|numeric|exists:tasks,id',
                    'duration'=>'required|numeric',
                    'progress'=>'required|numeric',
                   ]);
               if ($validator->fails()) {
       
                   return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
               }
               $report = TechReport::where('id',$request->tech_report_id)->first();
                    $report->update([
                        'duration'=>$duration,
                        'tech_report_type_id'=>$request->tech_report_type_id,
                        'report_status_id'=>1,
                        'manager_approve_id'=>$request->manager_approve_id,
                        'user_creator_id'=>Auth::guard('user_api')->user()->id,
                        'tech_report_details'=>$request->tech_report_details,
                        'tech_report_date'=>Carbon::createFromFormat('m/d/Y', $request-> tech_report_date),
                    ]);
                        $daily_task_report = DailyTaskReport::where('tech_report_id',$request->tech_report_id)->first();
                        $daily_task_report_client = ClientMeetingReport::where('tech_report_id',$request->tech_report_id)->first();
                        if(!empty($daily_task_report_client->id)){
                            $daily_task_report_client->forceDelete();
                        }
                        if(!empty($daily_task_report->id)){
                            $daily_task_report->update([
                                'progress'=>$request->progress,
                                'task_id'=>$request->task_id,
                            ]);
                        }else{
                            DailyTaskReport::create([
                                'progress'=>$request->progress?$request->progress:0,
                                'task_id'=>$request->task_id,
                                'tech_report_id'=>$request->tech_report_id,
                            ]);
                        }
                       
                        return ResponseApi::acceptedResponseApi(["message"=>"Update Success"],"success",201);

                    
                    }else if($request->tech_report_type_id==3||$request->tech_report_type_id==5){
                        $validator = Validator::make($request->all(), [
                    'process_id'=>'required|numeric|exists:processes,id',
                    'duration'=>'required|numeric',
                   ]);
               if ($validator->fails()) {
       
                   return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
               }
               $report = TechReport::where('id',$request->tech_report_id)->first();

                    $report->update([
                        'duration'=>$duration,
                        'tech_report_type_id'=>$request->tech_report_type_id,
                        'report_status_id'=>1,
                        'manager_approve_id'=>$request->manager_approve_id,
                        'user_creator_id'=>Auth::guard('user_api')->user()->id,
                        'tech_report_details'=>$request->tech_report_details,
                        'tech_report_date'=>Carbon::createFromFormat('m/d/Y', $request-> tech_report_date),
                    ]);
                    $daily_task_report = ClientMeetingReport::where('tech_report_id',$request->tech_report_id)->first();
                    $daily_task_report_daily = DailyTaskReport::where('tech_report_id',$request->tech_report_id)->first();
                    if(!empty($daily_task_report_daily->id)){
                        $daily_task_report_daily->forceDelete();
                    }
                    if(!empty($daily_task_report->id)){
                        $daily_task_report->update([
                            'process_id'=>$request->process_id,
                        ]);
                    }else{
                        $client_meeting_report = ClientMeetingReport::create([
                            'tech_report_id'=>$report->id,
                            'process_id'=>$request->process_id,
                        ]);
                    }
                        
                        return ResponseApi::acceptedResponseApi(["message"=>"Updated Success"],"success",201);
            }else{
                $report = TechReport::where('id',$request->tech_report_id)->first();

                $report->update([
                    'duration'=>$duration,
                    'tech_report_type_id'=>$request->tech_report_type_id,
                    'report_status_id'=>1,
                    'manager_approve_id'=>$request->manager_approve_id,
                    'user_creator_id'=>Auth::guard('user_api')->user()->id,
                    'tech_report_details'=>$request->tech_report_details,
                    'tech_report_date'=>Carbon::createFromFormat('m/d/Y', $request-> tech_report_date),
                ]);
                return ResponseApi::acceptedResponseApi(["message"=>"Updated Success"],"success",201);
            }

        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        

    }

    public function DeleteTechReport(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'tech_report_id'=>'required|numeric|exists:tech_reports,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

            $client_meeting_report=  ClientMeetingReport::where('tech_report_id',$request->tech_report_id)->first();
            $daily_task_report=  DailyTaskReport::where('tech_report_id',$request->tech_report_id)->first();
            $techReport=  TechReport::where('id',$request->tech_report_id)->first();


          if(!empty($client_meeting_report->id)){

            $client_meeting_report->forceDelete();


          }

          if(!empty($daily_task_report->id)){

            $daily_task_report->forceDelete();


          }
          if(!empty($techReport->id)){

            $techReport->forceDelete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(["message"=>"Can't Find Report"],"Validator Errors",400);

          }
          

         
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }


    public function ManagerApprove(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'tech_report_id'=>'required|numeric|exists:tech_reports,id'
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

            if($request->tech_report_type_id==6||$request->tech_report_type_id==7){
                $duration = 8;
            }else if(empty($request->duration)){
                return ResponseApi::badMethodErrorResponse(['message'=>"Need Duration To fill This Report"],"Validator Errors",400);
            }else{
                $duration =$request->duration;
            }

            if($request->tech_report_type_id==1||$request->tech_report_type_id==4){
                $validator = Validator::make($request->all(), [
                    'task_id'=>'required|numeric|exists:tasks,id',
                    'duration'=>'required|numeric',
                    'progress'=>'required|numeric',
                   ]);
               if ($validator->fails()) {
       
                   return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
               }
               $report = TechReport::where('id',$request->tech_report_id)->first();
                    $report->update([
                        'duration'=>$duration,
                        'tech_report_type_id'=>$request->tech_report_type_id,
                        'report_status_id'=>1,
                        'manager_approve_id'=>$request->manager_approve_id,
                        'user_creator_id'=>Auth::guard('user_api')->user()->id,
                        'tech_report_details'=>$request->tech_report_details,
                        'tech_report_date'=>Carbon::createFromFormat('m/d/Y', $request-> tech_report_date),
                    ]);
                        $daily_task_report = DailyTaskReport::where('tech_report_id',$request->tech_report_id)->first();
                        $daily_task_report_client = ClientMeetingReport::where('tech_report_id',$request->tech_report_id)->first();
                        if(!empty($daily_task_report_client->id)){
                            $daily_task_report_client->forceDelete();
                        }
                        if(!empty($daily_task_report->id)){
                            $daily_task_report->update([
                                'progress'=>$request->progress,
                                'task_id'=>$request->task_id,
                            ]);
                        }else{
                            DailyTaskReport::create([
                                'progress'=>$request->progress?$request->progress:0,
                                'task_id'=>$request->task_id,
                                'tech_report_id'=>$request->tech_report_id,
                            ]);
                        }
                       
                        return ResponseApi::acceptedResponseApi(["message"=>"Update Success"],"success",201);

                    
                    }else if($request->tech_report_type_id==3||$request->tech_report_type_id==5){
                        $validator = Validator::make($request->all(), [
                    'process_id'=>'required|numeric|exists:processes,id',
                    'duration'=>'required|numeric',
                   ]);
               if ($validator->fails()) {
       
                   return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
               }
               $report = TechReport::where('id',$request->tech_report_id)->first();

                    $report->update([
                        'duration'=>$duration,
                        'tech_report_type_id'=>$request->tech_report_type_id,
                        'report_status_id'=>1,
                        'manager_approve_id'=>$request->manager_approve_id,
                        'user_creator_id'=>Auth::guard('user_api')->user()->id,
                        'tech_report_details'=>$request->tech_report_details,
                        'tech_report_date'=>Carbon::createFromFormat('m/d/Y', $request-> tech_report_date),
                    ]);
                    $daily_task_report = ClientMeetingReport::where('tech_report_id',$request->tech_report_id)->first();
                    $daily_task_report_daily = DailyTaskReport::where('tech_report_id',$request->tech_report_id)->first();
                    if(!empty($daily_task_report_daily->id)){
                        $daily_task_report_daily->forceDelete();
                    }
                    if(!empty($daily_task_report->id)){
                        $daily_task_report->update([
                            'process_id'=>$request->process_id,
                        ]);
                    }else{
                        $client_meeting_report = ClientMeetingReport::create([
                            'tech_report_id'=>$report->id,
                            'process_id'=>$request->process_id,
                        ]);
                    }
                        
                        return ResponseApi::acceptedResponseApi(["message"=>"Updated Success"],"success",201);
            }else{
                $report = TechReport::where('id',$request->tech_report_id)->first();

                $report->update([
                    'duration'=>$duration,
                    'tech_report_type_id'=>$request->tech_report_type_id,
                    'report_status_id'=>1,
                    'manager_approve_id'=>$request->manager_approve_id,
                    'user_creator_id'=>Auth::guard('user_api')->user()->id,
                    'tech_report_details'=>$request->tech_report_details,
                    'tech_report_date'=>Carbon::createFromFormat('m/d/Y', $request-> tech_report_date),
                ]);
                return ResponseApi::acceptedResponseApi(["message"=>"Updated Success"],"success",201);
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
     * @param  \App\Models\TechReport  $techReport
     * @return \Illuminate\Http\Response
     */
    public function show(TechReport $techReport)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\TechReport  $techReport
     * @return \Illuminate\Http\Response
     */
    public function edit(TechReport $techReport)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\TechReport  $techReport
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, TechReport $techReport)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\TechReport  $techReport
     * @return \Illuminate\Http\Response
     */
    public function destroy(TechReport $techReport)
    {
        //
    }
}
