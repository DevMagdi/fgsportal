<?php

namespace App\Http\Controllers\Project\ProjectCost;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use App\Models\ReportStatus;
use App\Models\ReportType;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Models\Report;
use App\Models\User;
use App\Models\Project;
use App\Models\Process;
use App\Models\Task;
use App\Models\ReportManagerEdit;
use App\Models\ReportReject;
use App\Models\ReportSeniorEdit;
use App\Http\Controllers\ApiMessage\MessageController;
use App\Models\AnnualRequest;
use App\Models\TaskTeam;
use App\Models\UserAnnual;
 use DatePeriod;
use DateInterval;
use App\Models\ProjectCostManual;
 
class ProjectCostManualController extends Controller
{
    
    public function DeleteProjectCostManual(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'manual_project_id'=>'required|numeric|exists:project_cost_manuals,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $projectCostManual=  ProjectCostManual::where('id',$request->manual_project_id)->first();

          if(!empty($projectCostManual->id)){

            $projectCostManual->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Project Cost manual not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    
    public function CreateProjectCostManual(Request $request){
       // try{  
            $validator = Validator::make($request->all(), [
                  'project_cost_date' => 'required|date',
                'user_id' => 'required|numeric|exists:users,id',
                'cost_type_id' => 'required|numeric|exists:cost_types,id',
                'process_id' => 'required|numeric|exists:processes,id',
                'cost_amount' => 'required|numeric',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

            $projectCostManual=  ProjectCostManual::create([
                'cost_amount'=>$request->cost_amount,
                'process_id'=>$request->process_id,
                'cost_type_id'=>$request->cost_type_id,
                'user_creator_id'=>Auth::guard('user_api')->user()->id,
                'comment'=>$request->comment,
                'project_cost_date'=>Carbon::createFromFormat('m/d/Y', $request-> project_cost_date), 
                'user_id'=>$request->user_id,
                ]);
            if(!empty($projectCostManual->id)){
                return ResponseApi::acceptedResponseApi(['message'=>'Inserted Success'],"success",201);

            }else{
                return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

            }
           
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
        
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
     * @param  \App\Models\ProjectCostManual  $projectCostManual
     * @return \Illuminate\Http\Response
     */
    public function show(ProjectCostManual $projectCostManual)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProjectCostManual  $projectCostManual
     * @return \Illuminate\Http\Response
     */
    public function edit(ProjectCostManual $projectCostManual)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ProjectCostManual  $projectCostManual
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ProjectCostManual $projectCostManual)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProjectCostManual  $projectCostManual
     * @return \Illuminate\Http\Response
     */
    public function destroy(ProjectCostManual $projectCostManual)
    {
        //
    }
}
