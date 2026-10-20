<?php

namespace App\Http\Controllers\Project\Project;
use App\Models\Project;
use App\Models\ProjectTeam;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Models\ClientAccount;
use App\Models\Report;
use App\Models\Process;
use App\Models\Task;
use Illuminate\Support\Facades\DB;
use App\Models\ProcessTeam;
use App\Models\TaskTeam;
use App\Models\User;

class CloneProjectController extends Controller
{
  public function arrayparsetask(Task $task){  
    $array_reponse = [ 
        'key'=>$task->id."",
        'title'=>$task->task_title,
        'progress'=> Report::where('task_id',$task->id)->where('report_status_id','=',2)->sum('report_progress'),
        'desc'=>$task->task_description,
        'ex_duration'=>(float)$task->task_hours,
        'user_creator_id'=>$task->user_creator_id,
        'user_creator_name'=>$task->user_creator_id_fun->username,
        'type'=>(string)$task->task_type_id,
        'type_name'=>$task->task_type_id_fun->task_type,
         'status'=>(string)$task->task_status_id,
        'status_name'=>$task->task_status_id_fun ? $task->task_status_id_fun->task_status_name : null,
         'start_date'=>   Carbon::parse( $task->task_start_date)->format('m/d/Y') ,
        'end_date'=> Carbon::parse( $task->task_end_date)->format('m/d/Y') ,
        

    ];
    return $array_reponse;
}


  public function arrayparseproject(Project $project){
    $array_process = [] ;
    $array_tasks = [];
    $array_reponse = [];
    $project_team = [];
    $proj_team = ProjectTeam::where('project_id',$project->id)->withTrashed()->get();
    foreach ($proj_team as  $dep2) {
        $project_team[] = [ 
            'team_id'=>$dep2->id."",
            'user_team_id'=>$dep2->user_team_id,
            'user_team_name' =>$dep2->user_team_id_fun->username,
            'project_structure_id'=>$dep2->project_structure_id,
            'project_structure_name'=>$dep2->project_structure_id_fun ? $dep2->project_structure_id_fun->project_structure_name : null,
        ];
    }
    $process_all = Process::where('project_id',$project->id)->get();
    foreach ($process_all as  $process) {
        $task = Task::where('process_id',$process->id)->get();
        foreach ($task as  $value2) {
            $array_tasks [] = $this->arrayparsetask($value2);
        }
        $progress= Report::whereHas('process_id_fun',function($q) use ($process){
          $q->where('id',$process->id);
        })->where('report_status_id','=',2)->sum('report_progress');
        $tasks = Task::where('process_id',$process->id)->count();
    
        $progress = $progress/($tasks>=1? $tasks:1);
        $array_process[] =[
            'process_key'=>$process->id."",
            'title'=>$process->process_title,
            'progress'=>$progress,
            'desc'=>$process->process_description,
            'ex_duration'=>$process->process_duration,
            'user_creator_id'=>$process->user_creator_id,
            'user_creator_name'=>$process->user_creator_id_fun->username,
            'status'=>$process->process_status_id,
            'status_name'=>$process->process_status_id_fun ? $process->process_status_id_fun->process_status_name : null,
            'project_key'=>$process->project_id,
            'project_title'=>$process->project_id_fun->project_title,
             'start_date'=>   Carbon::parse( $process->process_start_date)->format('m/d/Y') ,
            'end_date'=> Carbon::parse( $process->process_end_date)->format('m/d/Y') ,
            "process_tasks"=>$array_tasks,

        ] ;
        $array_tasks = [];
    }
    $idle= Report::whereHas('process_id_fun',function($q) use ($project){
      $q->where('project_id',$project->id);
    })->where('report_status_id','=',2)->where('report_type_id',5)->sum('duration');
    
    $array_reponse =[
      'project_key'=>$project->id."",
      'title'=>$project->project_title,
      'idelHoues'=>$idle,
        'duration'=>$project->project_duration,
        'progress'=>$progress,
         'type'=>$project->project_type_id,
        'type_name'=>$project->project_type_id_fun->project_type,
        'project_convert_id'=>$project->project_convert_id,
        'status'=>(string)$project->project_status_id,
        'status_name'=>$project->project_status_id_fun ? $project->project_status_id_fun->project_status_name : null,
        'partner_id'=>!empty($project->partner_id)?$project->partner_id:null,
        'partner_name'=>!empty($project->partner_id_fun)?$project->partner_id_fun->partner_name:null,
        'partner_photoURL' =>!empty($project->partner_id_fun)?($project->partner_id_fun->partner_photoURL?"/Attachments/Client/Partner/" .  $project->partner_id . '/' .$project->partner_id_fun->partner_photoURL:null):null,
        'start_date'=>   Carbon::parse( $project->project_start_date)->format('m/d/Y') ,
        'end_date'=> Carbon::parse( $project->project_end_date)->format('m/d/Y') ,
        "processes"=>$array_process,
        "teams"=>$project_team,
    ];
    return $array_reponse;

  }

  public function GetProjectForClone(Request $request){
    try{
      $validator = Validator::make($request->all(), [
          'project_id' => 'required|numeric|exists:projects,id',
         'token'=>'required|string'
        
      ]);
     if ($validator->fails()) {
         return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
     }
     $project = Project::where('id',$request->project_id)->first();
     if(!empty($project->id)){
           $array_reponse =  $this->arrayparseproject($project);
       
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Project"],"Empty",200);
          }
            
    }catch(\Exception $e){
      return $e;
      return ResponseApi::badMethodErrorResponse(["message"=>"Server Error"],"server Error",500);

    }
  }
   
    public function CloneOldProject(Request $request){
      try{
             $validator = Validator::make($request->all(), [
                'project_title' => 'required|string',
                'project_id' => 'required|numeric|exists:projects,id',
                'project_start_date' => 'date',
                'project_end_date' => 'date|after:project_start_date',
                'project_duration' => 'numeric',
                'token'=>'required|string',
                'project_team'=>'required|array',
                'processes_id'=>'required|array',
                'isConfirmed'=>'required|boolean',
             ]);
             if ($validator->fails()) {
              $test_validation[] =$validator->errors()->all();
            }else{
              $test_validation=[];
            }
            
            // validations
            $team_ids = [];
            if(!empty($request->project_team)){
              $project_team_array = $request->project_team;
              foreach($project_team_array as $team){
                $validator = Validator::make((array)$team, [
                  'user_team_id' => 'required|numeric|exists:users,id',
                  'project_structure_id' => 'required|numeric|exists:project_structures,id',
              ]);
                if ($validator->fails()) {
                 $test_validation[] = $validator->errors()->toArray();
                 }
              
                  $user = User::where('id',$team["user_team_id"])
                  ->first();
                 if(!empty($user)){
                  if($user->active==0){
                    $test_validation[] = "This User ".$user->username." is not active .";
                   }else{
                    $team_ids[]= $user->id;
                   }
                 }else{
                  $user = User::where('id',$team["user_team_id"])
                  ->withTrashed()->first();
                  $test_validation[] = "This User ".$user->username." is not exist .";

                 }
                  
              }
            }


            if(!empty($request->processes_id)){
              $processes_array = $request->processes_id;
              foreach($processes_array as $process){
                $test_process_existance = Process::where('id',$process['process_id'])->where('project_id',$request->project_id)->first();

                if(empty($test_process_existance)){
                  $test_process_existance = Process::where('id',$process['process_id'])->first();
                  if(empty($test_process_existance)){

                    $test_validation[] =["Process ID.".$process['process_id']." Not Exists for mentioned Project ID"];
                  }else{
                    $test_validation[] =["Process ".$test_process_existance->process_title." Not Exists for mentioned Project "];

                  }
 
                  continue;
                }

              $tasks_array = $process['tasks_id'];

              foreach($tasks_array as $task){
                    //check task existance

                    $test_task_existance = Task::where('id',$task)->where('process_id',$test_process_existance->id)->first();
                    if(empty($test_task_existance)){
                      $test_task_existance = Task::where('id',$task)->first();
                      if(empty($test_task_existance)){

                      $test_validation[] =["Task ID.".$task." Not Exists for mentioned Project ID"];
                       }else{
                        $test_validation[] =["Task. ".$test_task_existance->task_title." Not Exists for mentioned Project ID"];
                      }
                      continue;
                    }
                    
                   

              }
            }
          }
          if(!empty( $test_validation)){
            return ResponseApi::badMethodErrorResponse($test_validation,"Validator Errors",400);
          }
          $test_validation=[];
          $warning_message = null;
          if($request->isConfirmed == false){
                  //check TaskTeam Existance
                  
                  foreach($processes_array as $process){
                    $tasks_array = $process['tasks_id'];
                  foreach($tasks_array as $task){
                    $test_task_existance = Task::where('id',$task)->where('process_id',$process['process_id'])->first();
                    if(empty($test_task_existance)){
                      continue;
                    }
        
                    $task_team_existance = TaskTeam::where('task_id',$task)->where('task_structure_id',1)->whereHas('process_team_id_fun',function($q)use($team_ids){
                      $q->whereHas('project_team_id_fun',function($q2)use($team_ids){
                        $q2->whereIn('user_team_id',$team_ids);
                      });
                    })->get();
        
                    if(empty($task_team_existance[0]->id)){
                      $task_team_old_team = TaskTeam::where('task_id',$task)->where('task_structure_id',1)->get();
                      $user_id = null;
                      $username = null;

                      if(!empty($task_team_old_team[0]->id)){
                        foreach ($task_team_old_team as $team_old) {
                          try{
                            $team_user_member = User::where('id',$team_old->process_team_id_fun->project_team_id_fun->user_team_id)->first();
                            if(!empty($team_user_member->id)){
                              $user_id = $team_user_member->id;
                              $username = $team_user_member->username;
                            }
                          }catch(\Exception $e){}


                        }
                      }

                      $test_validation[] =  [
                        "task_id"=>$test_task_existance->id ,
                        "task_title"=>$test_task_existance->task_title ,
                        "user_id"=>$user_id,
                        "username"=>$username
                        ] ;
                        $warning_message = $warning_message . "Task ".$test_task_existance->task_title." No Developer ".$username ." Assign to It. "; 
 
                    }
                  }
                }

            
                  if(!empty( $test_validation)){
                    $return_error_response = [];
                    $return_error_response["error"]=$test_validation;
                    $return_error_response["warning"]=$warning_message;
                      return ResponseApi::badMethodErrorResponse($return_error_response,"Developer Team Not Found",405);
                  }
 
          }

            DB::beginTransaction();
            //select and create project 
                $project = Project::where('id',$request->project_id)->first();
                $clone_project = Project::create([
                  'project_title' =>$request->project_title,
                  'project_progress' =>$request->project_progress ?$request->project_progress:$project->project_progress,
                  'project_description' =>$request->project_description?$request->project_description:$project->project_description,
                  'project_duration' =>$request->project_duration ?$request->project_duration:$project->project_duration ,
                  'project_budget' =>$request->project_budget ? $request->project_budget : $project->project_budget,
                  'user_creator_id' =>Auth::guard('user_api')->user()->id,
                  'project_type_id' =>$request->project_type_id?$request->project_type_id :$project->project_type_id,
                  'project_status_id' =>$request->project_status_id?$request->project_status_id:$project->project_status_id,
                  'partner_id' =>$request->partner_id?$request->partner_id:$project->partner_id,
                  'project_start_date' => $request-> project_start_date? Carbon::createFromFormat('m/d/Y', $request-> project_start_date):$project->project_start_date,
                  'project_end_date' =>  $request-> project_end_date? Carbon::createFromFormat('m/d/Y',$request-> project_end_date):$project->project_end_date,
                  'cloned_id'=>$request->project_id
                ]);
                if(!empty($clone_project->id)){
                  //close old project 
                  $project = $project->update([
                    'project_status_id'=>5
                  ]);

                   //add team on cloned project 
                  if(!empty($request->project_team)){
                    $project_team_array = $request->project_team;
                    
                      foreach($project_team_array as $team){
                        $existance = ProjectTeam::where('user_team_id',$team['user_team_id'])->where('project_structure_id',$team['project_structure_id'])
                        ->where('project_id',$clone_project->id)->first();
                        if(empty($existance->id)){
                          $inserted = ProjectTeam::create([
                                'user_creator_id' =>Auth::guard('user_api')->user()->id,
                                'user_team_id'=>$team['user_team_id'],
                                'project_id'=>$clone_project->id,
                                'project_structure_id'=>$team['project_structure_id'],
                            ]);
                          }
                          if(empty($inserted->id)){
                            $user_name = User::where('id',$team['user_team_id'])->withTrash()->first();
                            throw new \Exception("Unable to insert project team for user".$user_name->username, 1);
                            
                          }
                          $inserted = null;
                        }
                  }

                  //loop and create processes
                  foreach($processes_array as $process){
                    $old_process = Process::where('id',$process['process_id'])->where('project_id',$request->project_id)->first();
                    if(empty($old_process->id)){
                      throw new \Exception("Unable to Find Mentioned process under This Project", 1);

                    }
                   // to didn't create any process without tasks or team 

                    // $flag = false;
                    // $get_tasks_for_process = Task::where('process_id',$old_process->id)->get();
                    // if(!empty($get_tasks_for_process[0]->id)){
                    //   foreach ($get_tasks_for_process as $check_tasks_teams) {
                    //     $task_team_existance = TaskTeam::where('task_id',$check_tasks_teams->id)->where('task_structure_id',1)->whereHas('process_team_id_fun',function($q)use($team_ids){
                    //       $q->whereHas('project_team_id_fun',function($q2)use($team_ids){
                    //         $q2->whereIn('user_team_id',$team_ids);
                    //       });
                    //     })->get();
                    //     if(empty($task_team_existance[0])){
                    //       continue;
                    //     }else{
                    //       $flag = true;
                    //       break;
                    //     }
                       
                    //   }
                    // }
                    // if($flag==false){
                    //   continue;
                    // }

                    $new_process=  Process::create([
                        'process_title' =>$old_process->process_title,
                        'process_progress' =>$old_process->process_progress ?$old_process->process_progress:0,
                        'process_description' =>$old_process->process_description,
                        'process_duration' =>$old_process->process_duration ?$old_process->process_duration:0 ,
                        'user_creator_id' =>Auth::guard('user_api')->user()->id,
                          'process_status_id' =>$old_process->process_status_id,
                        'project_id' =>$clone_project->id,
                        'process_start_date' =>  $old_process-> process_start_date ,
                        'process_end_date' =>  $old_process-> process_end_date,
                      ]);

                     $old_process_team = ProcessTeam::where('process_id',$old_process->id)->whereHas('project_team_id_fun',function($q)use($request){
                      $q->where('project_id',$request->project_id);
                    })->get();

                      foreach ($old_process_team as   $value) {
                        $project_team = ProjectTeam::where('project_id',$clone_project->id)->where('user_team_id',$value->project_team_id_fun->user_team_id)->first();

                        if(empty($project_team->id)){
                          continue;                        
                       //   throw new \Exception("Cant Find Process Team Member on Project for Process Team Number ".$value->id, 1);
                        }
                            $insert_process_team =  ProcessTeam::create([
                            'user_creator_id' =>Auth::guard('user_api')->user()->id,
                            'project_team_id'=>$project_team->id,
                            'process_id'=>$new_process->id,
                         ]);


                      }


                      $tasks_array = $process['tasks_id'];
                      //loop and create tasks 
                  foreach($tasks_array as $task){
                    $old_task = Task::where('id',$task)->where('process_id',$old_process->id)->first();

                    $task_team_existance = TaskTeam::where('task_id',$task)->where('task_structure_id',1)->whereHas('process_team_id_fun',function($q)use($team_ids){
                      $q->whereHas('project_team_id_fun',function($q2)use($team_ids){
                        $q2->whereIn('user_team_id',$team_ids);
                      });
                    })->get();
                    if(empty($task_team_existance[0])){
                      continue;
                    }


                    $new_task=  Task::create([
                      'task_title' =>$old_task->task_title,
                      'task_progress' =>$old_task->task_progress ?$old_task->task_progress:0,
                      'task_description' =>$old_task->task_description,
                      'task_hours' =>$old_task->task_hours ?$old_task->task_hours:0 ,
                       'user_creator_id' =>Auth::guard('user_api')->user()->id,
                       'task_status_id' =>$old_task->task_status_id,
                       'task_type_id' =>$old_task->task_type_id,
                       'process_id' =>$new_process->id,
                       'seniorapprove'=>$old_task->seniorapprove,
                      'task_start_date' => $old_task-> task_start_date,
                      'task_end_date' =>  $old_task-> task_end_date,
                     ]);  

                     $task_Team = TaskTeam::where('task_id',$task)->whereHas('process_team_id_fun',function($q)use($old_process){
                      $q->where('process_id',$old_process->id);
                     })->get();

                     foreach($task_Team as $old_task_team){
                       $new_process_team_id = ProcessTeam::where('process_id',$new_process->id)->whereHas('project_team_id_fun',function($q) use($old_task_team){
                        $q->where('user_team_id',$old_task_team->process_team_id_fun->project_team_id_fun->user_team_id);
                       })->first();

                       if(empty($new_process_team_id->id)){
                        continue;
                     //   throw new \Exception("Cant Find Task Team Member on Project for Task Team Number ".$old_task_team->id, 1);

                      }

                       $inserted = TaskTeam::create([
                        'user_creator_id' =>Auth::guard('user_api')->user()->id,
                        'process_team_id'=>$new_process_team_id->id,
                        'task_structure_id'=>$old_task_team->task_structure_id,
                        'task_id'=>$new_task->id,
                      ]);
                     }

                      

                      //close old task
                     $old_task =  $old_task->update([
                      'task_status_id'=>5
                     ]);
                    
                  }

                    // close process 
                    $old_process = $old_process->update([
                      'process_status_id'=>5
                    ]);


                }

                }



            DB::commit();

          return ResponseApi::acceptedResponseApi( ["message"=>"cloned Successsfully","project_id"=>$clone_project->id.""],"success",201);

             
        }catch(\Exception $e){
 
          try{
            DB::rollBack();
          }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

          }
          //return  $e ;
 
           return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
          // return ResponseApi::badMethodErrorResponse($e,"server Error",500);

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
     * @param  \App\Models\Project  $project
     * @return \Illuminate\Http\Response
     */
    public function show(Project $project)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Project  $project
     * @return \Illuminate\Http\Response
     */
    public function edit(Project $project)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Project  $project
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Project $project)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Project  $project
     * @return \Illuminate\Http\Response
     */
    public function destroy(Project $project)
    {
        //
    }
}
