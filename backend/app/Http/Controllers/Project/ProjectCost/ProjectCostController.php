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
use App\Models\CostType;
use App\Models\Task;
use App\Models\PublicRequest;
use App\Models\ReportManagerEdit;
use App\Models\ReportReject;
use App\Models\ReportSeniorEdit;
use App\Http\Controllers\ApiMessage\MessageController;
use App\Models\AnnualRequest;
use App\Models\TaskTeam;
use App\Models\UserAnnual;
 use DatePeriod;
use DateInterval;
use App\Models\IncentiveRequest;
use App\Models\TransportationRequest;
use App\Models\ProjectCostManual;
use App\Models\ProjectTeam;
use App\Models\IncentiveRequestApproved;
class ProjectCostController extends Controller
{
    public $projectCost=0;
    public function CastCostarrayIncentive(IncentiveRequest $report){
        $costType = CostType::where('id',1)->first();
        $this->projectCost +=(float)($report->incentive_amount?$report->incentive_amount:0);
        $approve = IncentiveRequestApproved::where('incentive_id',$report->id)->where('incentive_status_id',2)->first();
        $array_reponse =[
            'key'=>$report->id.'',
            'projectKey'=>$report->process_id?$report->process_id_fun->project_id:null,
            'projectTitle'=>$report->process_id?$report->process_id_fun->project_id_fun->project_title:null,
            'processKey'=>$report->process_id?$report->process_id:null,
            'processTitle'=>$report->process_id?$report->process_id_fun->process_title:null,

           

            'costType'=>(!empty($costType->id)?$costType->id:null),
            'costType_name'=>(!empty($costType->id)?$costType->cost_type:null),

            'activity_key'=>$report->id.'',

            'notes'=>'Incentive Approved By '.(!empty($approve->assign_to_id)?$approve->assign_to_id_fun->username:null). '=> '.(Carbon::parse( $report->incentive_date)->format('m/d/Y')). ' To Dev '.($report->user_to_id?$report->user_to_id_fun->username:null),

            'costDate'=> Carbon::parse( $report->incentive_date)->format('m/d/Y'),
            'createdAt'=>$report->updated_at,

            'createdByKey'=>$report->user_creator_id,
            'createdByName'=>$report->user_creator_id?$report->user_creator_id_fun->username:null,

            'empKey'=>$report->user_to_id,
            'empName'=>$report->user_to_id?$report->user_to_id_fun->username:null,
            'costAmount'=>(float)($report->incentive_amount?$report->incentive_amount:0),     
            'isManual' =>false,        
       
        ];
        return $array_reponse;
    }
    public function CastCostarrayManualCost(ProjectCostManual $report){
        $this->projectCost +=(float)($report->cost_amount?$report->cost_amount:0);

        $array_reponse =[
            'key'=>$report->id.'',
            'projectKey'=>$report->process_id?$report->process_id_fun->project_id:null,
            'projectTitle'=>$report->process_id?$report->process_id_fun->project_id_fun->project_title:null,
            'processKey'=>$report->process_id?$report->process_id:null,
            'processTitle'=>$report->process_id?$report->process_id_fun->process_title:null,

            'costType'=>(!empty($report->cost_type_id)?intval($report->cost_type_id):null),
            'costType_name'=>(!empty($report->cost_type_id)?$report->cost_type_id_fun->cost_type:null),

            'activity_key'=>$report->id.'',

            'notes'=>'This Cost Created Manually By '.($report->user_creator_id?$report->user_creator_id_fun->username:null). '=> For Emp '.($report->user_id?$report->user_id_fun->username:null) .($report->cost_type_id==8?' As Part Time':''),

            'createdByKey'=>$report->user_creator_id,
            'createdByName'=>$report->user_creator_id?$report->user_creator_id_fun->username:null,

            'costDate'=>Carbon::parse( $report->project_cost_date)->format('m/d/Y'),
            'createdAt'=>$report->updated_at,
            'empKey'=>$report->user_id,
            'empName'=>$report->user_id?$report->user_id_fun->username:null,
            'costAmount'=>(float)($report->cost_amount?$report->cost_amount:0),     
            'isManual' =>true,        
       
        ];
        return $array_reponse;
    }
    public function CastCostarrayTransportation(TransportationRequest $report){
        $costType = CostType::where('id',2)->first();
        $this->projectCost +=(float)($report->transportation_request_amount?$report->transportation_request_amount:0);

        $array_reponse =[
            'key'=>$report->id.'',
            'projectKey'=>$report->process_id?$report->process_id_fun->project_id:null,
            'projectTitle'=>$report->process_id?$report->process_id_fun->project_id_fun->project_title:null,
            'processKey'=>$report->process_id?$report->process_id:null,
            'processTitle'=>$report->process_id?$report->process_id_fun->process_title:null,

            'costType'=>(!empty($costType)?$costType->id:null),
            'costType_name'=>(!empty($costType)?$costType->cost_type:null),

            'activity_key'=>$report->id.'',

            'notes'=>'Transportation Approved By '.($report->manager_approve_id?$report->manager_approve_id_fun->username:null). '=> For Date '.(Carbon::parse( $report->transportation_request_date)->format('m/d/Y')). ' To Dev '.($report->user_creator_id?$report->user_creator_id_fun->username:null),

            'costDate'=> Carbon::parse( $report->transportation_request_date)->format('m/d/Y'),
            'createdAt'=>$report->updated_at,
            'createdByKey'=>$report->manager_approve_id,
            'createdByName'=>$report->manager_approve_id?$report->manager_approve_id_fun->username:null,


            'empKey'=>$report->user_creator_id,
            'empName'=>$report->user_creator_id?$report->user_creator_id_fun->username:null,
            'costAmount'=>(float)($report->transportation_request_amount?$report->transportation_request_amount:0),     
            'isManual' =>false,        
       
        ];
        return $array_reponse;
    }
    public function CastCostarrayPublicReqeust(PublicRequest $report){
        $costType = CostType::where('id',9)->first();
       
        $this->projectCost +=(float)($report->public_request_amount?$report->public_request_amount:0);

        $array_reponse =[
            'key'=>$report->id.'',
            'projectKey'=>$report->process_id?$report->process_id_fun->project_id:null,
            'projectTitle'=>$report->process_id?$report->process_id_fun->project_id_fun->project_title:null,

            'processKey'=>$report->process_id?$report->process_id:null,
            'processTitle'=>$report->process_id?$report->process_id_fun->process_title:null,

            'costType'=>(!empty($costType)?$costType->id:null),
            'costType_name'=>(!empty($costType)?$costType->cost_type:null),

            'activity_key'=>$report->id.'',

            'notes'=>'Public Request Approved By '.($report->manager_approve_id?$report->manager_approve_id_fun->username:null). '=> For Date '.(Carbon::parse( $report->updated_at)->format('m/d/Y')). ' To Dev '.($report->user_creator_id?$report->user_creator_id_fun->username:null),

            'costDate'=> Carbon::parse( $report->updated_at)->format('m/d/Y'),
            'createdAt'=>$report->updated_at,
            'createdByKey'=>$report->manager_approve_id,
            'createdByName'=>$report->manager_approve_id?$report->manager_approve_id_fun->username:null,


            'empKey'=>$report->user_creator_id,
            'empName'=>$report->user_creator_id?$report->user_creator_id_fun->username:null,
            'costAmount'=>(float)($report->public_request_amount?$report->public_request_amount:0),     
            'isManual' =>false,        
       
        ];
        return $array_reponse;
    }
    public function CastCostarrayReport(Report $report){
        $this->projectCost +=(float)($report->report_cost?$report->report_cost:0);

        $costType_salary = CostType::where('id',3)->first();
        $costType_idle = CostType::where('id',5)->first();
        $array_reponse =[
            'key'=>$report->id.'',
            'projectKey'=>$report->process_id?$report->process_id_fun->project_id:null,
            'projectTitle'=>$report->process_id?$report->process_id_fun->project_id_fun->project_title:null,
            'processKey'=>$report->process_id?$report->process_id:null,
            'processTitle'=>$report->process_id?$report->process_id_fun->process_title:null,

           
            'costType'=>$report->report_type_id==5?(float)(!empty($costType_idle)?$costType_idle->id:null):(!empty($costType_salary)?(float)$costType_salary->id:null),
            'costType_name'=>$report->report_type_id==5?(!empty($costType_idle)?$costType_idle->cost_type:null):(!empty($costType_salary)?$costType_salary->cost_type:null),

            'activity_key'=>$report->id.'',

            'notes'=>'Report Approved By '.($report->manager_approve_id?$report->manager_approve_id_fun->username:null). '=> For Report '.($report->report_type_id_fun->report_type). ' to Dev '.($report->user_creator_id?$report->user_creator_id_fun->username:null),

            'costDate'=> Carbon::parse( $report->report_date)->format('m/d/Y'),
            'createdAt'=>$report->updated_at,
            'createdByKey'=>$report->manager_approve_id,
            'createdByName'=>$report->manager_approve_id?$report->manager_approve_id_fun->username:null,

            'empKey'=>$report->user_creator_id,
            'empName'=>$report->user_creator_id?$report->user_creator_id_fun->username:null,
            'costAmount'=>(float)($report->report_cost?$report->report_cost:0),     
            'isManual' =>false,        
       
        ];
        return $array_reponse;
    }
    public function GetProjectCost(Request $request){
      // try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'project_id'=>'required|numeric|exists:projects,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            $array_reponse =[];
            $report = Report::where('report_status_id',2)->where('report_type_id','<>',7)->where('report_type_id','<>',8)->whereHas('process_id_fun',function($q) use ($request){
                $q->where('project_id',$request->project_id);
            })->get();
            foreach($report as $rep){
                $array_reponse[]=$this->CastCostarrayReport($rep);
            }
            
            $transportationRequest = TransportationRequest::where('transportation_request_status_id',3)->whereHas('process_id_fun',function($q) use ($request){
                $q->where('project_id',$request->project_id);
            })->get();
            foreach($transportationRequest as $rep){
                $array_reponse[]=$this->CastCostarrayTransportation($rep);
            }

            $projectCostManual = ProjectCostManual::whereHas('process_id_fun',function($q) use ($request){
                $q->where('project_id',$request->project_id);
            })->get();
            foreach($projectCostManual as $rep){
                $array_reponse[]=$this->CastCostarrayManualCost($rep);
            }

            $incentiveRequest = IncentiveRequest::where('incentive_status_id','<>',1)->where('incentive_status_id','<>',4)->whereHas('process_id_fun',function($q) use ($request){
                $q->where('project_id',$request->project_id);
            })->orWhere('incentive_status_id',2)->whereHas('process_id_fun',function($q) use ($request){
                $q->where('project_id',$request->project_id);
            })->get();
            foreach($incentiveRequest as $rep){
                $array_reponse[]=$this->CastCostarrayIncentive($rep);
            }

            $publicrequest = PublicRequest::where('public_request_status_id','<>',1)->where('public_request_status_id','<>',4)->whereHas('process_id_fun',function($q) use ($request){
                $q->where('project_id',$request->project_id);
            })->get();
            foreach($publicrequest as $rep){
                $array_reponse[]=$this->CastCostarrayPublicReqeust($rep);
            }

 
          if(!empty($array_reponse[0])){
           $project =Project::where('id',$request->project_id)->first();
           $project->update([
            'project_actual_cost'=>$this->projectCost,
           ]);
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Empty Cost"],"Empty Cost",200);

          }
         
        

             
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
    }
    public function CastProjectArray(Project $project){
        $inserted = ProjectTeam::where('project_id',$project->id)->get();
        $PMID=null;
        $PMName=null;
        $userpm =null;
       if(!empty($inserted[0]->id)){
         foreach($inserted as $dep){
           if($dep->project_structure_id==1 &&!empty($dep->user_team_id)){
             $PMID=$dep->user_team_id;
             $PMName=$dep->user_team_id_fun->username;
             $userpm = $dep;
           } 
         }
       }

        $array_reponse =[
        'key'=>$project->id.'',
        'projectKey'=>$project->id.'',
        'projectTitle'=>$project->project_title,
        'projectStartDate'=> Carbon::parse( $project->project_start_date)->format('m/d/Y'),
        'projectExpectedDuration'=>$project->project_duration,
        'projectExpectedEndDate'=>Carbon::parse( $project->project_end_date)->format('m/d/Y'),
        'projectProgress'=>$project->project_progress,
        'pmKey'=>!empty($userpm->user_team_id)?$userpm->user_team_id:null,
        'pmImgUrl'=>!empty($userpm->user_team_id)?'/Attachments/User/'.$userpm->user_team_id.'/profile'.'/'.$userpm->user_team_id_fun->photoURL:null,
        'pmName'=>!empty($userpm->user_team_id)?$userpm->user_team_id_fun->username:null,
         'managerKey'=>$project->user_creator_id,
        'managerName'=>$project->user_creator_id?$project->user_creator_id_fun->username:null,
        'managerImgUrl'=>$project->user_creator_id?($project->user_creator_id_fun->photoURL?'/Attachments/User/'.$project->user_creator_id.'/profile'.'/'.$project->user_creator_id_fun->photoURL:null):null,
        'contractValue'=>0,
        'budgetryCost'=>(float)$project->project_budget,
        'actualCost'=>(float)$project->project_actual_cost,
        //'projectCostKeys'=>$project->,
        ];
        
        return $array_reponse;
    }
    public function ProjectTotalCost (Request $request){
     //   try{
             $validator = Validator::make($request->all(), [
                  'token'=>'required|string',
                 'project_id'=>'required|numeric|exists:projects,id',
             ]);
             if ($validator->fails()) {
     
                 return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }
              $project = Project::where('id',$request->project_id)->first();
 
           if(!empty($project->id)){
            $array_reponse = $this->CastProjectArray($project);

  
             return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
 
           }else{
             return ResponseApi::badMethodErrorResponse(['message'=>"Project not found"],"Validator Errors",400);
 
           }
          
         
 
              
        //  }catch(\Exception $e){
        //      return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
        //  }
     }
}
