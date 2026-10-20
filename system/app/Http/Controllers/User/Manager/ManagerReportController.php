<?php

namespace App\Http\Controllers\User\Manager;

 use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use App\Models\ReportStatus;
use App\Models\ReportType;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Models\Report;
use App\Models\Rating;
use App\Models\User;
use App\Models\Task;
use App\Models\Process;
use App\Models\ReportManagerEdit;
use App\Models\ReportReject;
use App\Models\ReportSeniorEdit;
use App\Http\Controllers\ApiMessage\MessageController;
use App\Models\AnnualRequest;
use App\Models\TaskTeam;
use App\Models\UserAnnual;
 use DatePeriod;
use DateInterval;
 
 
class ManagerReportController extends Controller
{

    public function reportparsearray(Report $report){
        $reject_report = ReportReject::where('report_id',$report->id)->orderBy('created_at','desc')->first();
        $edit_manager_report = ReportManagerEdit::where('report_id',$report->id)->orderBy('created_at','desc')->first();
        $edit_senior_report = ReportSeniorEdit::where('report_id',$report->id)->orderBy('created_at','desc')->first();
        $tasks = Task::where('id',$report->task_id)->withTrashed()->first();
        $processes = Process::where('id',$report->process_id)->withTrashed()->first();
        $array_reponse = [ 
            'key'=>$report->id."",
            'devID'=>$report->user_creator_id,
            'devName'=>$report->user_creator_id_fun->username,
            'reportDate'=> Carbon::parse( $report->report_date)->format('m/d/Y') ,
            'durationByHours'=>(float)$report->duration,
            'time_activity'=>$report->report_type_id,
            'time_activity_name'=>$report->report_type_id_fun->report_type,
            'taskID'=>!empty($tasks->id)?(string)$tasks->id:null,
            'taskTitle'=>!empty($tasks->id)?$tasks->task_title : null,
            'projectID'=>!empty($processes->id)?$processes->project_id.'':null,
            'projectName'=>!empty($processes->id)?$processes->project_id_fun->project_title:null,
            'processID'=>!empty($processes->id)? $report->process_id.'':null,
            'processName'=>!empty($processes->id)?$processes->process_title:null,
            'details'=>$report->report_details,
            'progress'=>(float)$report->report_progress,
            'approved'=>$report->report_status_id == 2? true : false,
            'rejected'=>$report->report_status_id == 3? true : false,

            'approvedByKey'=>$report->report_status_id == 2||$report->report_status_id == 3? $report->manager_approve_id : null,
            'approvedByName'=>$report->report_status_id == 2||$report->report_status_id == 3? $report->manager_approve_id_fun->username : null,
        ];
        return $array_reponse;
    }
    public function arrayparsetaskreports(Task $task){
        $inserted = TaskTeam::where('task_id',$task->id)->get();
        $empID =null;
        $empName = null;
      $array_reponse = [];
        if(!empty($inserted[0]->id)){
        foreach($inserted as $dep){
          if(empty($dep->process_team_id_fun->project_team_id_fun)){
            continue;
          }
          if($dep->task_structure_id ==1 ){
            $empID =$dep->process_team_id_fun->project_team_id_fun->user_team_id;
            $empName = $dep->process_team_id_fun->project_team_id_fun->user_team_id_fun->username;
          }else if($dep->task_structure_id ==3){
            $empID =$dep->process_team_id_fun->project_team_id_fun->user_team_id;
            $empName = $dep->process_team_id_fun->project_team_id_fun->user_team_id_fun->username;
          }
        }
        }
        $array_reponse = [ 
            'key'=>$task->id."",
            'title'=>$task->task_title,
            'process_title'=>$task->process_id_fun->process_title,
            'project_title'=>$task->process_id_fun->project_id_fun->project_title,
            'process_key'=>$task->process_id."",
             'project_key'=>$task->process_id_fun->project_id."",
             'type_name'=>!empty($task->task_type_id)?$task->task_type_id_fun->task_type:null,
            'empID'=>$empID,
            'empName'=>$empName,
            'status_name'=>!empty($task->task_status_id_fun) ? $task->task_status_id_fun->task_status_name : null,
            'start_date'=>   Carbon::parse( $task->task_start_date)->format('m/d/Y') ,
            'end_date'=> Carbon::parse( $task->task_end_date)->format('m/d/Y') ,
            ];
        return $array_reponse;
      }


    
    public function calDate($start_date , $end_date){
        $start = $start_date;
        $end =  $end_date->addDay(1);
      
       
        $count=0;
        // $interval = $end->diff($start);
        // $days = $interval->days;
        $period = new DatePeriod($start, new DateInterval('P1D'), $end);
       // $holidays = array('2012-09-07');
        foreach($period as $dt) {
            $curr = $dt->format('D');
            // substract if Saturday or Sunday
            if ($curr != 'Sat' && $curr != 'Fri') {
                $count++;
            }
            
            // // (optional) for the updated question
            // elseif (in_array($dt->format('Y-m-d'), $holidays)) {
            //     $days--;
            // }
        }
        return $count;
    }

    public function DevelopersMonthlyReport(Request $request){
       try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'report_date'=>'required|date',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

            $all_user = User::where('active','<>',0)->whereHas('sub_departments_id_fun', function($q){
                $q->where('departments_id','!=',1);
              })->get();
              $array_reponse =[];
              foreach($all_user as $user_data){
                $actual_working_hours=0;
                $idle_hours=0;
                $offical_vacation=0;
                $unpaid_vacation=0;
                $month = Carbon::createFromFormat('m/d/Y', $request->report_date );
                $all_report =Report::whereHas('user_creator_id_fun', function($q){
                  $q->whereHas('sub_departments_id_fun', function($qa){
                    $qa->where('departments_id','!=',1);
                  });
                })->where('user_creator_id',$user_data->id)->whereMonth('report_date',$month->month)->whereYear('report_date',$month->year)->where('report_status_id',2)->get();
                foreach($all_report as $report){
                    if($report->report_type_id==5){
                        $idle_hours+= $report->duration;
                    }elseif($report->report_type_id==6){
                        $offical_vacation+= $report->duration;

                    }elseif($report->report_type_id==7){
                        $unpaid_vacation+= $report->duration;

                    } else{
                        $actual_working_hours+= $report->duration;

                    }
                }
                $array_reponse [] = [
                    'actual_working_hours'=>(float)$actual_working_hours,
                    'idle_hours'=>(float)$idle_hours,
                    'official_vacations'=>(float)$offical_vacation,
                    'unpaid_vacations'=>(float)$unpaid_vacation,
                    'total'=>(float)$actual_working_hours+$unpaid_vacation+$offical_vacation+$idle_hours,
                    'dev_name'=>$user_data->username,
                    'dev_key'=>$user_data->id.'',
                ];

              }
 

            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          
          

         
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>$e],"server Error",500);

        }
        
    }
    public function DevelopersVacationsReport(Request $request){
        //  try{
              $validator = Validator::make($request->all(), [
                   'token'=>'required|string',
                   ]);
              if ($validator->fails()) {
      
                  return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
              }
  
              $all_user = User::where('active','<>',0)->whereHas('sub_departments_id_fun', function($q){
                  $q->where('departments_id','!=',1);
                })->get();
                $array_reponse =[];
                foreach($all_user as $user_data){
                  $sick=0;
                  $annual_leave=0;
                  $permission=0;
                  $exam_leave=0;
                  $un_paid=0;
                   $all_report =AnnualRequest::where('user_id',$user_data->id)->where('annual_status_id',1)->get();
                   $UserAnnual = UserAnnual::where('user_id',$user_data->id)->first();
                   foreach($all_report as $report){
                       $start_date = Carbon::create(Carbon::parse($report->from)->format('m/d/Y H:i:s') );
                       $end_date = Carbon::create(Carbon::parse($report->to)->format('m/d/Y H:i:s') );
                      if($report->annual_type_id==2){
                          $sick+= $this->calDate($start_date,$end_date);
                      }elseif($report->annual_type_id==1){
                           $annual_leave+= $this->calDate($start_date,$end_date);

                      }elseif($report->annual_type_id==5){
                           $minute_duration = $start_date->diffInMinutes($end_date);
                            $permission +=$minute_duration;
                        }elseif($report->annual_type_id==4){
                            $exam_leave+= $this->calDate($start_date,$end_date);

                    }elseif($report->annual_type_id==3){
                         $un_paid+= $this->calDate($start_date,$end_date);
                    } 
                  }
                  $array_reponse [] = [
                      'SickLeave'=>(float)$sick,
                      'annualLeave'=>(float)$annual_leave,
                      'permission'=>(float)$permission,
                      'examLeave'=>(float)$exam_leave,
                      'unpaid'=>(float)$un_paid,
                      'total'=>(float)$sick+$annual_leave+$exam_leave+$un_paid,
                      'empName'=>$user_data->username,
                      'hiringDate'=>$user_data->user_details_id?$user_data->user_details_id_fun->hiringDate:null,
                      'totalBalance'=>(float)($UserAnnual?$UserAnnual->total_leave_balance:0),
                      'currentBalance'=>(float)($UserAnnual?$UserAnnual->available_leave_balance:0),
                      'empKey'=>$user_data->id.'',
                  ];
  
                }
   
  
              return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
  
            
            
  
           
          // }catch(\Exception $e){
          //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
  
          // }
          
      }
      public function DevelopersRunningTasksReport(Request $request){
         try{
              $validator = Validator::make($request->all(), [
                   'token'=>'required|string',
                   ]);
              if ($validator->fails()) {
      
                  return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
              }
  
              $tasks = Task::where('task_status_id',1) ->orWhere('task_status_id',3) ->get();
                $array_reponse =[];
                foreach($tasks as $task){
                  if(!empty($task->process_id_fun)){
                  $array_reponse [] = $this->arrayparsetaskreports($task);}
  
                }
   
  
              return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
  
            
            
  
           
          }catch(\Exception $e){
              return ResponseApi::badMethodErrorResponse(['message'=>$e],$e,500);
  
          }
          
      }
      public function DevelopersOverDueTasksReport(Request $request){
        //  try{
              $validator = Validator::make($request->all(), [
                   'token'=>'required|string',
                   ]);
              if ($validator->fails()) {
      
                  return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
              }
  
              $tasks = Task::where('task_status_id',1)->where('task_end_date','<=',Carbon::now())
              ->orWhere('task_status_id',3)->where('task_end_date','<=',Carbon::now()) ->get();
                $array_reponse =[];
                foreach($tasks as $task){
                 
                
                if(!empty($task->process_id_fun->project_id_fun)){
                  $array_reponse [] = $this->arrayparsetaskreports($task);
                }
                }
   
  
              return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
  
            
            
  
           
          // }catch(\Exception $e){
          //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
  
          // }
          
      }
      public function DevelopersTasksReport(Request $request){
        //  try{
              $validator = Validator::make($request->all(), [
                   'token'=>'required|string',
                   'end_date'=>'required|date',
                   'user_id'=>'required|numeric|exists:users,id',
                   'start_date'=>'required|date',
                   ]);
              if ($validator->fails()) {
      
                  return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
              }
              $start_date = Carbon::create(Carbon::parse($request->start_date)->format('m/d/Y') );
              $end_date = Carbon::create(Carbon::parse($request->end_date)->format('m/d/Y') );
              if(!empty($request->task_id)){
                $tasks = Report::where('task_id',$request->task_id)->where('report_date','<=',$end_date)->where('report_date','>=',$start_date)->where('user_creator_id',$request->user_id)
                ->orWhere('report_date','>=',$start_date)->where('report_date','<=',$end_date)->where('task_id',$request->task_id)->where('user_creator_id',$request->user_id) ->get();
              }else{
                $tasks = Report::where('report_date','<=',$end_date)->where('report_date','>=',$start_date)->where('user_creator_id',$request->user_id)
                ->orWhere('report_date','>=',$start_date)->where('report_date','<=',$end_date)->where('user_creator_id',$request->user_id) ->get();
              }
             
                $array_reponse =[];
                foreach($tasks as $task){
                
                  $array_reponse [] = $this->reportparsearray($task);
  
                }
   
  
              return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
  
            
            
  
           
          // }catch(\Exception $e){
          //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
  
          // }
          
      }
     

      public function DevelopersProgressReport(Request $request){
         try{
              $validator = Validator::make($request->all(), [
                   'token'=>'required|string',
                   'end_date'=>'required|date',
                   'user_id'=>'required|numeric|exists:users,id',
                   'start_date'=>'required|date',
                   ]);
              if ($validator->fails()) {
      
                  return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
              }
              // total_working_hours
              // idle_hours
              // total_rate
              // tasks sorted by projects and process and tasks

              
              $start_date = Carbon::create(Carbon::parse($request->start_date)->format('m/d/Y') );
              $end_date = Carbon::create(Carbon::parse($request->end_date)->format('m/d/Y') );


              // Get Total Working Hours
              $total_working_hours = Report::where('report_date','<=',$end_date)->where('report_date','>=',$start_date)->where('user_creator_id',$request->user_id)->where('report_type_id','<>','5')->where('report_type_id','<>','6')->where('report_type_id','<>','7')->get()->sum('duration');

              // Get Total Idle Hours
              $idle_hours = Report::where('report_date','<=',$end_date)->where('report_date','>=',$start_date)->where('user_creator_id',$request->user_id)->where('report_type_id','5')->get()->sum('duration');

              // Get Total Offical vacation
              $offical_vacation = Report::where('report_date','<=',$end_date)->where('report_date','>=',$start_date)->where('user_creator_id',$request->user_id)->where('report_type_id','6')->get()->sum('duration');

              // Get Total unpaid vacation
              $unpaid_vacation = Report::where('report_date','<=',$end_date)->where('report_date','>=',$start_date)->where('user_creator_id',$request->user_id)->where('report_type_id','7')->get()->sum('duration');


              // Get Rates
              $total_rate = 0;

              $total_rate = Rating::whereHas('question_id_fun',function($q){
                $q->where('question_type_id',1);
              })->whereHas('ask_to_rate_id_fun',function($q)use($request){
                $q->where('user_to_rate_id',$request->user_id);
              })->get()->sum('rate');
        
              $rate_count = Rating::whereHas('question_id_fun',function($q){
                $q->where('question_type_id',1);
              })->whereHas('ask_to_rate_id_fun',function($q)use($request){
                $q->where('user_to_rate_id',$request->user_id);
              })->get()->count();
              if($rate_count!=0){
                $total_rate =  $total_rate/$rate_count;
              }


              $user = User::where('id', $request->user_id)->first();
              // return $user->username;
              // $photoUrl = $user->photoURL;
              // $username = $user->username;
             
              //  Get Reports
              $reports = Report::where('report_date','<=',$end_date)->where('report_date','>=',$start_date)->where('user_creator_id',$request->user_id)->get();

              
              
              // $projectsArray = [];
              // $processesArray =[];
              // $tasksArr = [];

              // foreach ($reports as $report) {
              //   if(!empty($report->task_id)){
              //     if(empty($tasksArr)){
              //       $tasksArr[] = $report->task_id;
              //       $processesArray[] = $report->process_id;
              //       $projectsArray[] = $report->process_id_fun->project_id;
              //     }else{
              //       if(!in_array($report->task_id,$tasksArr)){
              //         $tasksArr[] = $report->task_id;
              //       }
              //       if(!in_array($report->process_id,$processesArray)){
              //         $processesArray[] = $report->process_id;
              //       }
              //       if(!in_array($report->process_id_fun->project_id,$projectsArray)){
              //         $projectsArray[] = $report->process_id_fun->project_id;
              //         // $arr = [
              //         //   'project_id'=>$report->process_id_fun->project_id,
              //         //   'project_title'=>$report->process_id_fun->project_id_fun->project_title,
              //         //   'total_working_hours'=> $report->duration
              //         // ]
              //       }
              //       // else{

              //       // }
              //     }
              //   }
              // }
              // $array_reponse =[];
              // foreach($projectsArray as $project){
              //   $arr = [
              //     'project_id'=>$project,
              //     'project_title'=>$project,
              //   ];
              //   $array_reponse [] = $this->reportparsearray($report);

              // }

              // return $tasksArr;

              // foreach ($tasksArr as $task) {
              //   if(empty($processesArray)){
              //     $processesArray[] = $task->task_id;
              //   }else{
              //     if(!in_array($report->task_id,$processesArray)){
              //       $tasksArr[] = $report->task_id;
              //     }
              //   }
              // }

              // return $tasksArr;

              // project id 
              // project name 
              // total working hours
              
              // process id 
              // process name 
              // total working hours

              // task id 
              // task name 
              // total working hours

              // foreach($tasksArr as $task){
              //   $projectsArray [] = [
              //     ''
              //   ]
              // }

            // $transformedData = collect($reports)->groupBy('process_id')
            //     ->map(function ($processReports) {
            //         $process = $processReports->first(); // We assume all reports for a process have the same details
            //         return [
            //             'projectID' => $process->process_id_fun->project_id,
            //             'projectName' => $process->process_id_fun->project_id_fun->project_title, // Replace 'name' with the actual project name column
            //             'total_working_hours' => $processReports->sum('duration'),
            //             'processes' => [
            //                 [
            //                     'processID' => $process['process_id'],
            //                     'processName' =>$process->process_id? $process->process_id_fun->process_title :null, // Replace 'process_name' with the actual column name
            //                     'process_working_hours' => $processReports->sum('duration'),
            //                     'tasks' => $processReports->groupBy('task_id')
            //                         ->map(function ($taskReports) {
            //                             $task = $taskReports->first(); // We assume all reports for a task have the same details
            //                             return [
            //                                 'taskID' => $task['task_id'],
            //                                 'taskName' => $task->task_id ? $task->task_id_fun->task_title:null, // Replace 'task_name' with the actual column name
            //                                 'task_working_hours' => $taskReports->sum('duration'),
            //                             ];
            //                         })
            //                         ->values()
            //                         ->all(),
            //                 ],
            //             ],
            //         ];
            //     })
            //     ->values()
            //     ->all();

            

            



              $reports_arr =[];
              foreach($reports as $report){

                $reports_arr [] = $this->reportparsearray($report);

              }



              
            // $transformedData = [];

            
            // $tasks_Arr =[];
            // $processes_Arr =[];
            // $projects_Arr =[];

            
            // $filteredByProject = array_filter($reports_arr, function ($item) {
            //   return $item['projectID'] === $report['projectID'];
            // });


            // $transformedData[] = [
            //   "projectID" =>$report["projectID"],
            //   "projectName" =>$report["projectName"],
            //   "total_working_hours" => $report["total_working_hours"],
            // ]

            // foreach ($reports_arr as $report) {
            //   if(!in_array($report['projectID'],$projects_Arr)){
            //     $projects_Arr[] = $report['projectID'];
            //   }

            //   if(!empty($report['processID'])){
            //     if(!in_array($report['processID'],$processes_Arr)){
            //       $processes_Arr[] = $report['processID'];
            //     }
            //   }

            //   if(!empty($report['taskID'])){
            //     if(!in_array($report['taskID'],$tasks_Arr)){
            //       $tasks_Arr[] = $report['taskID'];
            //     }
            //   }
            // }

            // return [
            //   '$projects_Arr'=>$projects_Arr,
            //   '$processes_Arr'=>$processes_Arr,
            //   '$tasks_Arr'=>$tasks_Arr,
            // ];

            // foreach ($projects_Arr as $p) {
            //   // $filteredByProject = array_filter($reports_arr, function ($item) {
            //   //   return $item['projectID'] === $p['projectID'];
            //   // });
            //   // foreach ($filteredByProject as $r) {
                
            //   // }
            // }

              $array_reponse = [
                'total_working_hours'=>$total_working_hours,
                'idle_hours'=>$idle_hours,
                'offical_vacation'=>$offical_vacation,
                'unpaid_vacation'=>$unpaid_vacation,
                'total_rate'=>$total_rate,
                'username' => $user->username,
                'photoURL' => $user->photoURL ? '/Attachments/User/'.$user->id.'/profile'.'/'.$user->photoURL:null,
                // 'tasks_data'=>$transformedData,
                'accRole_name'=>$user->sub_departments_id_fun->sub_department_name,

                'reports_arr'=>$reports_arr,
              ];

   
  
              return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
  
            
            
  
           
          }catch(\Exception $e){
            return $e;
              return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
  
          }
          
      }

}
