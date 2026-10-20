<?php

namespace App\Http\Controllers\Project\Task;
use App\Models\Project;
use App\Models\TaskTeam;
use App\Models\ProjectTeam;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use App\Models\Process;
use App\Models\ProcessTeam;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Models\Task;
use App\Models\Report;
use App\Models\ProcessAttach;
use App\Http\Controllers\ApiMessage\MessageController;
use App\Models\User;
class TaskController extends Controller
{
  public function ApprovalSendNotification(User $user1 , User $user2,Task $report){
    $msg = array
         (
           "body"=> "You Have New Task Assigned To You On" .$report->process_id_fun->project_id_fun->project_title .'/' . $report->process_id_fun->process_title  ,
           "createdAt"=>$report->updated_at,
           "receverKey"=> $user2->id.'',
           "receverName"=> $user2->username,
           "redirection"=> "/dev/myprojects/".$report->process_id_fun->project_id."/".$report->process_id,
           "senderKey"=> $user1->id.'',
           "senderName"=> $user1->username,
           "status"=> 0,
           "updatedAt"=>$report->updated_at,
           "title"=> "New Task" ,
           'senderImg'=>$user1->photoURL?'/Attachments/User/'.$user1->id.'/profile'.'/'.$user1->photoURL:null,
         );

   MessageController::notificationSend($msg);
}

    public function arrayparsetask(Task $task){
        $inserted = TaskTeam::where('task_id',$task->id)->get();
        $array_reponse2 =[];
        $report = Report::where('task_id',$task->id)->sum('duration');
        $empID =null;
        $empName = null;
        $supportID=null;
        $supportName = null;
        $image_path = null;
        $image_name = null;
        $partner = ProcessAttach::where('task_id',$task->id)->first();
        if(!empty($partner->id)){
          $image_path = '/Attachments/Project/'.$partner->process_id_fun->project_id.'/'.$partner->process_id.'/'.$partner->task_id.'/' .$partner->process_attach ;  // Value is not URL but directory file path
          $image_name = $partner->process_attach;
        }
 

        if(!empty($inserted[0]->id)){
        foreach($inserted as $dep){
          if( !empty($dep->process_team_id_fun->project_team_id_fun)){
          if($dep->task_structure_id ==1  ){
            $empID =$dep->process_team_id_fun->project_team_id_fun->user_team_id;
            $empName = $dep->process_team_id_fun->project_team_id_fun->user_team_id_fun->username;
          }elseif($dep->task_structure_id ==2){
            $supportID =$dep->process_team_id_fun->project_team_id_fun->user_team_id;
            $supportName = $dep->process_team_id_fun->project_team_id_fun->user_team_id_fun->username;
          }else if($dep->task_structure_id ==3){
            $empID =$dep->process_team_id_fun->project_team_id_fun->user_team_id;
            $empName = $dep->process_team_id_fun->project_team_id_fun->user_team_id_fun->username;
          }else{
            $array_reponse2[] = [ 
                'key'=>$dep->id."",
                'user_team_id'=>$dep->process_team_id_fun->project_team_id_fun->user_team_id,
                'user_team_name' =>$dep->process_team_id_fun->project_team_id_fun->user_team_id_fun->username,
                'task_structure_id'=>$dep->task_structure_id,
                'task_structure_name'=>$dep->task_structure_id_fun ? $dep->task_structure_id_fun->task_structure_name : null,
                'trash'=>0,
            ];
          }
        }else{
          $dep3 = ProcessTeam::where('id',$dep->process_team_id)->withTrashed()->first();
          if(empty($dep3)){
            continue;
          }
          $dep2 = ProjectTeam::where('id',$dep3->project_team_id)->withTrashed()->first();
          if(!empty($dep2)){
            if($dep->task_structure_id ==1  ){
              $empID =$dep2->user_team_id;
              $empName = $dep2->user_team_id_fun->username;
            }elseif($dep->task_structure_id ==2){
              $supportID =$dep2->user_team_id;
              $supportName = $dep2->user_team_id_fun->username;
            }else if($dep->task_structure_id ==3){
              $empID =$dep2->user_team_id;
              $empName = $dep->user_team_id_fun->username;
            }else{
              $array_reponse2[] = [ 
                  'key'=>$dep->id."",
                  'user_team_id'=>$dep2->user_team_id,
                  'user_team_name' =>$dep2->user_team_id_fun->username,
                  'task_structure_id'=>$dep->task_structure_id,
                  'task_structure_name'=>$dep->task_structure_id_fun ? $dep->task_structure_id_fun->task_structure_name : null,
                  'trash'=>1,

              ];
            }
          }
        }
        }
        }

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
            'process_key'=>$task->process_id,
            'process_title'=>$task->process_id_fun->process_title,
            'project_key'=>$task->process_id_fun->project_id,
            'project_title'=>$task->process_id_fun->project_id_fun->project_title,
             'start_date'=>   Carbon::parse( $task->task_start_date)->format('m/d/Y') ,
            'end_date'=> Carbon::parse( $task->task_end_date)->format('m/d/Y') ,
            'task_team'=>$array_reponse2,
            'empID'=>$empID,
            'empName'=>$empName,
            'supportID'=>$supportID,
            'supportName'=>$supportName,
            'pddURL'=>$image_path,
            'pddName'=>$image_name,
            'real_duration'=>$report,
            'seniorapprove'=>$task->seniorapprove,

        ];
        return $array_reponse;
    }
    public function arrayparsetaskreports(Task $task){
      $report = Report::where('task_id',$task->id)->sum('duration');
      $array_reponse = [ 
          'key'=>$task->id."",
          'title'=>$task->task_title,
          'process_title'=>$task->process_id_fun->process_title,
          'project_title'=>$task->process_id_fun->project_id_fun->project_title,
          'process_key'=>$task->process_id."",
          'project_key'=>$task->process_id_fun->project_id."",
          'ex_duration'=>$task->task_hours,
          'status'=>$task->task_status_id,
          'status_name'=>$task->task_status_id_fun->task_status_name,
          'start_date'=>   Carbon::parse( $task->task_start_date)->format('m/d/Y') ,
          'end_date'=> Carbon::parse( $task->task_end_date)->format('m/d/Y') ,
          'real_duration'=>$report,
          'seniorapprove'=>$task->seniorapprove,
          'task_type_id'=>$task->task_type_id


      ];
      return $array_reponse;
    }
    public function arrayparsetaskold(Task $task){
     
      $array_reponse = [ 
          'key'=>$task->id."",
          'title'=>$task->task_title,
          'ex_duration'=>$task->task_hours,
          'start_date'=> Carbon::parse( $task->task_start_date)->format('m/d/Y') ,
          'end_date'=> Carbon::parse( $task->task_end_date)->format('m/d/Y') ,
          'seniorapprove'=>$task->seniorapprove,

      ];
      return $array_reponse;
    }

    public function DeleteTask(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'task_id'=>'required|numeric|exists:tasks,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $task=  Task::where('id',$request->task_id)->first();

          if(!empty($task->id)){

            $task->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Task not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    
   
    public function UpdateTaskDescription(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'task_id' => 'required|string|exists:tasks,id',
                'token'=>'required|string',
                'task_description'=>'required|string',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $task=  Task::where('id',$request->task_id)->first();

          if(!empty($task->id)){

            $task->update([
                'task_description' =>$request->task_description,
            ]);

            return ResponseApi::acceptedResponseApi($this->arrayparsetask($task),"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Task  not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
   
    public function UpdateTaskStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'task_status_id' => 'required|numeric|exists:task_statuses,id',
                'token'=>'required|string',
                'task_id'=>'required|numeric|exists:tasks,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $task=  Task::where('id',$request->task_id)->first();

          if(!empty($task->id)){
            $task->update([
                'task_status_id' =>$request->task_status_id,
            ]);

            return ResponseApi::acceptedResponseApi($this->arrayparsetask($task),"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Task not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateTask(Request $request){
     try{
        
        $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'task_id'=>'required|numeric|exists:tasks,id',
            ]);
            if ($validator->fails()) {

                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            if(!empty($request->task_team)){
              $validator = Validator::make($request->all(), [
                'task_team'=>'required|array',
            ]);
            if ($validator->fails()) {

                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
              $task_team_array = $request->task_team;
              foreach($task_team_array as $team){
                $validator = Validator::make((array)$team, [
                    'process_team_id' => 'required|numeric|exists:process_teams,id',
                    'task_structure_id'=>'required|numeric|exists:task_structures,id',
                  ]);
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
              }
              $delete_perv = TaskTeam::where('task_id',$request->task_id)->delete();

              foreach($task_team_array as $team){
                $existance = TaskTeam::where('process_team_id',$team['process_team_id'])->where('task_structure_id',$team['task_structure_id'])
                ->where('task_id',$request->task_id)->withTrashed()->first();
                if(empty($existance->id)&&empty($existance->delete_at)){
                    $inserted[] = TaskTeam::create([
                        'user_creator_id' =>Auth::guard('user_api')->user()->id,
                        'process_team_id'=>$team['process_team_id'],
                        'task_structure_id'=>$team['task_structure_id'],
                        'task_id'=>$request->task_id,
                      ]);
                }else{
                  $inserted[]= $existance->restore();
                }
              }
           
          }
          $task_update=  Task::where('id',$request->task_id)->first();

          if(!empty($task_update->id)){
            $task_update->update(
              $request->except(['task_start_date','task_end_date'])
            );
            if(!empty($request->task_start_date)){
              $validator = Validator::make($request->all(), [
                'task_start_date' => 'required|date',
                'token'=>'required|string',
            ]);
            if ($validator->fails()) {
      
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            $task_update=  Task::where('id',$request->task_id)->first();
 
 
            $task_update->update([
              'task_start_date'=>Carbon::createFromFormat('m/d/Y', $request-> task_start_date),
            ]);
      
            }
            if(!empty($request->task_end_date)){
              $validator = Validator::make($request->all(), [
                'task_end_date' => 'required|date',
                'token'=>'required|string',
            ]);
            if ($validator->fails()) {
      
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            $task_update=  Task::where('id',$request->task_id)->first();
            $task_update->update([
              'task_end_date'=>Carbon::createFromFormat('m/d/Y', $request->task_end_date),
            ]);
      
            }

          return ResponseApi::acceptedResponseApi( ["message"=>"success"],"success",201);

          }else{
            return ResponseApi::acceptedResponseApi( ["message"=>"Empty"],"Empty",200);


          }
        }catch(\Exception $e){
          return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        

    }

    public function CreateTask(Request $request){
        try{
        
             $validator = Validator::make($request->all(), [
                'task_status_id' => 'required|numeric|exists:task_statuses,id',
                'task_type_id' => 'required|numeric|exists:task_types,id',
                'process_id' => 'required|numeric|exists:processes,id',
                'task_start_date' => 'required|date',
                'task_end_date' => 'required|date',
                'task_hours' => 'required|numeric',
                'token'=>'required|string',
                'task_team'=>'required|array',
                'task_title' => 'required|string',
                'force_add'=>'numeric',
                'seniorapprove'=>'required|numeric'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            
            $end_date = Carbon::createFromFormat('m/d/Y', $request-> task_end_date);
            $main_process = Process::where('id',$request->process_id)->first();
            $process = Process::where('id',$request->process_id)->whereDate('process_end_date','>=',$end_date)->first();
            $project = Project::where('id',$main_process->project_id)->whereDate('project_end_date','>=',$end_date)->first();
            if(!empty($process->id)){
              if(!empty($request->force_add)){
                if($request->force_add==1){
                 
                }elseif($request->extend_duration ==0){
                  return ResponseApi::badMethodErrorResponse(["message"=>"Need Extand"],"Need Extand",401);
                }else{
                  return ResponseApi::badMethodErrorResponse(["message"=>"Need Extand"],"Need Extand",401);
                }
              }
            }else if(!empty($project->id)){
              if(!empty($request->force_add)){
                if($request->force_add==1){
                  
                }elseif($request->force_add ==0){
                  return ResponseApi::badMethodErrorResponse(["message"=>"Need Extand"],"Need Extand",401);
                }
              }else{
                return ResponseApi::badMethodErrorResponse(["message"=>"Need Extand"],"Need Extand",401);
              }
            }
          
            $task_team_array = $request->task_team;

            foreach($task_team_array as $team){
              $validator = Validator::make((array)$team, [
                  'process_team_id' => 'required|numeric|exists:process_teams,id',
                  'task_structure_id'=>'required|numeric|exists:task_structures,id'

               ]);
              if ($validator->fails()) {
      
                  return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
              }
          }

          $task=  Task::create([
            'task_title' =>$request->task_title,
            'task_progress' =>$request->task_progress ?$request->task_progress:0,
            'task_description' =>$request->task_description,
            'task_hours' =>$request->task_hours ?$request->task_hours:0 ,
             'user_creator_id' =>Auth::guard('user_api')->user()->id,
             'task_status_id' =>$request->task_status_id,
             'task_type_id' =>$request->task_type_id,
             'process_id' =>$request->process_id,
             'seniorapprove'=>$request->seniorapprove,
            'task_start_date' => Carbon::createFromFormat('m/d/Y', $request-> task_start_date),
            'task_end_date' => Carbon::createFromFormat('m/d/Y', $request-> task_end_date),
           ]);
 
           foreach($task_team_array as $team){
            $existance = TaskTeam::where('process_team_id',$team['process_team_id'])
            ->where('task_id',$task->id)->first();
            if(empty($existance->id)){
               $tema = TaskTeam::create([
                    'user_creator_id' =>Auth::guard('user_api')->user()->id,
                    'process_team_id'=>$team['process_team_id'],
                    'task_structure_id'=>$team['task_structure_id'],
                    'task_id'=>$task->id,
                 ]);
                 
                 $user_details = User::where('id',$tema->process_team_id_fun->project_team_id_fun->user_team_id)->first();
                 try{
                 $this->ApprovalSendNotification(Auth::guard('user_api')->user(),$user_details,$task);
                 }catch(\Exception $e){   
                 }
            }
          }
         
          return ResponseApi::acceptedResponseApi( $this->arrayparsetask($task),"success",201);

             
        }catch(\Exception $e){
         return ResponseApi::badMethodErrorResponse(['message'=>"Server Error" , $e],"server Error",500);
 
        }
        
    }
    
    public function GetAllTask(){
        try{
          $task = Task::all();
          if(!empty($task[0]->id)){
            foreach($task as $dep){

            $array_reponse[] =  $this->arrayparsetask($dep);
            
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Task"],"Empty",200);
          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

    public function GetDeleteTask(){
        try{
          $task = Task::onlyTrashed()->get();
          if(!empty($task[0]->id)){
            foreach($task as $dep){
            $array_reponse[] =  $this->arrayparsetask($dep);
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Task"],"Empty",200);
          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
   
    public function GetTaskForSpecificStatus(Request $request){
        try{

                 $validator = Validator::make($request->all(), [
                    'task_status_id' => 'required|numeric|exists:task_statuses,id',
                    'token'=>'required|string',
                 ]);

                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
    
              $task=  Task::where('task_status_id',$request->task_status_id)->get();
    
                 if(!empty($task[0]->id)){
                    foreach($task as $dep){
                    $array_reponse[] =  $this->arrayparsetask($dep);
                }
                    return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
        
                  }else{
                    return ResponseApi::notFoundResponse(['message'=>"Empty Task"],"Empty",200);
                  }
               
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(["message"=>"server error"],"server Error",500);

        }
        
    }
    public function GetTasksForSpecificProcess(Request $request){
      try{

               $validator = Validator::make($request->all(), [
                  'process_id' => 'required|numeric|exists:processes,id',
                  'token'=>'required|string',
               ]);

              if ($validator->fails()) {
      
                  return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
              }
  
            $task=  Task::where('process_id',$request->process_id)->get();
  
               if(!empty($task[0]->id)){
                  foreach($task as $dep){
                  $array_reponse[] =  $this->arrayparsetask($dep);
              }
                  return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
      
                }else{
                  return ResponseApi::notFoundResponse(['message'=>"Empty Tasks"],"Empty",200);
                }
             
      }catch(\Exception $e){
        return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error".$e,500);

      }
      
  }



  public function GetDeveloperAllTask(Request $request){
    try{
      $validator = Validator::make($request->all(), [
       'user_id' => 'required|numeric|exists:users,id',
       'token'=>'required|string',
     ]);
     if ($validator->fails()) {

         return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
     }

    
     $tasks = TaskTeam::all();

     $existance=[];
               
     foreach($tasks as $selTasks){
       $get_team = ProcessTeam::where('id',$selTasks->process_team_id)->whereHas('project_team_id_fun', function($q) use($request){
         $q->where('user_team_id',$request->user_id);
       })->first();


       if(!empty($get_team->id)){
         if($get_team->id == $selTasks->process_team_id){
           $task = Task::where('id',$selTasks->task_id)->first();
           if(!empty($task->id)){
             $existance[] = $this->arrayparsetaskreports($task);
           }

         }
       }
   
      // return ResponseApi::acceptedResponseApi([$get_team,$tasks],"success",201);

     
     }

     if(!empty($existance[0])){
       return ResponseApi::acceptedResponseApi($existance,"success",201);
     }else{
       return ResponseApi::acceptedResponseApi(['message'=>"empty array"],"Empty",200);
     }


           
 }catch(\Exception $e){
   return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

 }

  }

  public function GetDeveloperOverDueTasks(Request $request){
    try{
      $validator = Validator::make($request->all(), [
       'user_id' => 'required|numeric|exists:users,id',
       'token'=>'required|string',
     ]);
     if ($validator->fails()) {

         return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
     }
    
     $tasks = TaskTeam::whereHas('task_id_fun',function($q){
      $q->whereDate('task_end_date','<',Carbon::now());
     })->get();
     $existance=[];
               
     foreach($tasks as $selTasks){
       $get_team = ProcessTeam::where('id',$selTasks->process_team_id)->whereHas('project_team_id_fun', function($q) use($request){
         $q->where('user_team_id',$request->user_id);
       })->first();


       if(!empty($get_team->id)){
         if($get_team->id == $selTasks->process_team_id){
           $task = Task::where('id',$selTasks->task_id)->where('task_status_id','<>',5)->first();
           if(!empty($task->id)){
             $existance[] = $this->arrayparsetaskreports($task);
           }

         }
       }
   
      // return ResponseApi::acceptedResponseApi([$get_team,$tasks],"success",201);

     
     }

     if(!empty($existance[0])){
       return ResponseApi::acceptedResponseApi($existance,"success",201);
     }else{
       return ResponseApi::acceptedResponseApi(['message'=>"empty array"],"Empty",200);
     }


           
 }catch(\Exception $e){
   return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

 }

  }



  public function GetDeveloperOldTasks(Request $request){
      try{
        if($request->has('user_id')&& $request->user_id!=0){
          $validator = Validator::make($request->all(), [
            'user_id' => 'required|numeric|exists:users,id',
            'token'=>'required|string',
            'task_start_date' => 'required|date',
            'task_end_date' => 'required|date',
          ]);
        }else{
          $validator = Validator::make($request->all(), [
            'user_id' => 'required|numeric',
            'token'=>'required|string',
            'task_start_date' => 'required|date',
            'task_end_date' => 'required|date',
          ]);
        }
        
        if ($validator->fails()) {

            return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
        }

        $start_date = Carbon::createFromFormat('m/d/Y', $request-> task_start_date);
        $end_date = Carbon::createFromFormat('m/d/Y', $request-> task_end_date);
        $tasks = TaskTeam::where('task_structure_id','<>',2)->whereHas('task_id_fun', function($q) use($start_date,$end_date){
          $q->whereDate('task_end_date','>=',$start_date);
          $q->whereDate('task_start_date', '<=', $end_date);
        
        })->get();
        $existance=[];
                  
        foreach($tasks as $selTasks){
          if($request->user_id ==0 || $request->user_id==1){
            $get_team2 = ProcessTeam::where('id',$selTasks->process_team_id)->get();
 
            if(!empty($get_team2[0]->id)){
              foreach ($get_team2 as $get_team) {             
              if($get_team->id == $selTasks->process_team_id){
                $task = Task::where('id',$selTasks->task_id)->where('task_status_id','<>',5)->first();
                if(!empty($task->id)){
                  $existance[] = $this->arrayparsetaskold($task);
                }
              }
            }
          }
          }else{
            $get_team = ProcessTeam::where('id',$selTasks->process_team_id)->whereHas('project_team_id_fun', function($q) use($request){
              $q->where('user_team_id',$request->user_id);
            })->first();
            if(!empty($get_team->id)){
              if($get_team->id == $selTasks->process_team_id){
                $task = Task::where('id',$selTasks->task_id)->where('task_status_id','<>',5)->first();
                if(!empty($task->id)){
                  $existance[] = $this->arrayparsetaskold($task);
                }
              }
            }
          }
         


          
         // return ResponseApi::acceptedResponseApi([$get_team,$tasks],"success",201);
        }

        if(!empty($existance[0])){
          return ResponseApi::acceptedResponseApi($existance,"success",201);
        }else{
          return ResponseApi::acceptedResponseApi(['message'=>"empty array"],"Empty",200);
        }


              
    }catch(\Exception $e){
      return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

    }

  }






  public function GetDeveloperTasks(Request $request){
  //  try{
      $validator = Validator::make($request->all(), [
       'user_id' => 'required|numeric|exists:users,id',
       'token'=>'required|string',
     ]);
     if ($validator->fails()) {

         return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
     }

    
     $tasks = TaskTeam::where('task_structure_id','<>',2)->get();

     $existance=[];
               
     foreach($tasks as $selTasks){
       $get_team = ProcessTeam::where('id',$selTasks->process_team_id)->whereHas('project_team_id_fun', function($q) use($request){
         $q->where('user_team_id',$request->user_id);
       })->first();

       if(!empty($get_team->id)){
         if($get_team->id == $selTasks->process_team_id ) {
          //->where('task_status_id','<>',2)->where('task_status_id','<>',4)->
           $task = Task::where('id',$selTasks->task_id)->where('task_status_id','=',1)->whereHas('process_id_fun',function($q){
            $q->where('process_status_id','<>',5);
           })->first();
           if(!empty($task->id) && !empty($task->process_id_fun->project_id)){
             $existance[] = $this->arrayparsetaskreports($task);
           }

         }
       }
   
      // return ResponseApi::acceptedResponseApi([$get_team,$tasks],"success",201);

     
     }

     if(!empty($existance[0])){
       return ResponseApi::acceptedResponseApi($existance,"success",201);
     }else{
       return ResponseApi::acceptedResponseApi(['message'=>"empty array"],"Empty",200);
     }


           
//  }catch(\Exception $e){
//    return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

//  }

  }

  public function GetSupportTasks(Request $request){
    try{
      $validator = Validator::make($request->all(), [
       'user_id' => 'required|numeric|exists:users,id',
       'token'=>'required|string',
     ]);
     if ($validator->fails()) {

         return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
     }

    
     $tasks = TaskTeam::where('task_structure_id',2)->get();

     $existance=[];
               
     foreach($tasks as $selTasks){
       $get_team = ProcessTeam::where('id',$selTasks->process_team_id)->whereHas('project_team_id_fun', function($q) use($request){
         $q->where('user_team_id',$request->user_id);
       })->first();


       if(!empty($get_team->id)){
         if($get_team->id == $selTasks->process_team_id){
           $task = Task::where('id',$selTasks->task_id)->where('task_status_id','<>',5)->first();
           if(!empty($task->id)){
             $existance[] = $this->arrayparsetaskreports($task);
           }

         }
       }
   
      // return ResponseApi::acceptedResponseApi([$get_team,$tasks],"success",201);

     
     }

     if(!empty($existance[0])){
       return ResponseApi::acceptedResponseApi($existance,"success",201);
     }else{
       return ResponseApi::acceptedResponseApi(['message'=>"empty array"],"Empty",200);
     }


           
 }catch(\Exception $e){
   return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

 }
} 



public function GetTaskProgress(Request $request){


  try{
    $validator = Validator::make($request->all(), [
     'task_id' => 'required|numeric|exists:tasks,id',
     'token'=>'required|string',
   ]);
   if ($validator->fails()) {

       return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
   }

   $tasks = Report::where('task_id',$request->task_id)->where('report_status_id','<>',3)->sum('report_progress');
   return ResponseApi::acceptedResponseApi((float)$tasks,"success",201);

   
         
}catch(\Exception $e){
 return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

}
  
}


public function GetAllTasksWithProjectID(Request $request){


  try{
    $validator = Validator::make($request->all(), [
     'project_id' => 'required|numeric|exists:projects,id',
     'token'=>'required|string',
   ]);
   if ($validator->fails()) {

       return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
   }

   $tasks = Task::whereHas('process_id_fun',function($q) use ($request){
    $q->where('project_id',$request->project_id);
   })->get();
   $array_reponse=[];
   if(!empty($tasks[0]->id)){

     foreach($tasks as $task){
      $array_reponse[]= $this->arrayparsetask($task);
     }
     return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
   }else{
    return ResponseApi::acceptedResponseApi($array_reponse,"empty",200);

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
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function show(Task $task)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function edit(Task $task)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Task $task)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function destroy(Task $task)
    {
        //
    }
}
