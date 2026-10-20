<?php

namespace App\Http\Controllers\AdminReport;
 use App\Models\TaskTeam;
use App\Models\AdminTaskTeam;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
 use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Models\Task;
use App\Models\AdminReport;
use App\Http\Controllers\ApiMessage\MessageController;
use App\Models\User;
use App\Models\AdminTask;
 

class AdminTaskController extends Controller
{
    public function ApprovalSendNotification(User $user1 , User $user2,AdminTask $report){
        $msg = array
             (
               "body"=> "You Have New Task Assigned To You On" .$report->task_title  ,
               "createdAt"=>$report->updated_at,
               "receverKey"=> $user2->id.'',
               "receverName"=> $user2->username,
               "redirection"=> "/dev/myprojects/".$report->task_title."/".$report->id,
               "senderKey"=> $user1->id.'',
               "senderName"=> $user1->username,
               "status"=> 0,
               "updatedAt"=>$report->updated_at,
               "title"=> "New Task" ,
               'senderImg'=>$user1->photoURL?'/Attachments/User/'.$user1->id.'/profile'.'/'.$user1->photoURL:null,
             );
    
       MessageController::notificationSend($msg);
    }
    
        public function arrayparsetask(AdminTask $task){
    
          $rated_before = '0';
    
            $inserted = AdminTaskTeam::where('task_id',$task->id)->get();
            $array_reponse2 =[];
            $report = AdminReport::where('task_id',$task->id)->sum('duration');
            $empID =null;
            $empName = null;
            if(!empty($inserted[0]->id)){
            foreach($inserted as $dep){
              
                  $array_reponse2[] = [ 
                      'id'=>$dep->id."",
                      'user_id'=>$dep->user_id,
                      'username' =>$dep->user_id_fun->username,
                  ];
                
            }
            }
    
            $array_reponse = [ 
                'id'=>$task->id."",
                'task_title'=>$task->task_title,
                'task_progress'=> AdminReport::where('task_id',$task->id)->where('report_status_id','=',2)->sum('report_progress'),
                'task_description'=>$task->task_description,
                'ex_duration'=>(float)$task->task_hours,
                'user_creator_id'=>$task->user_creator_id,
                'user_creator_name'=>$task->user_creator_id_fun->username,
               
                 'task_status_id'=>(string)$task->task_status_id,
                'task_status_name'=>$task->task_status_id_fun ? $task->task_status_id_fun->task_status_name : null,
                'task_start_date'=>   Carbon::parse( $task->task_start_date)->format('m/d/Y') ,
                'task_end_date'=> Carbon::parse( $task->task_end_date)->format('m/d/Y') ,
                'task_team'=>$array_reponse2,
                'rated_before'=>$rated_before,
                'real_duration'=>$report,
                'task_team'=>$array_reponse2,
    
            ];
            return $array_reponse;
        }
        public function arrayparsetaskreports(AdminTask $task){
          $report = AdminReport::where('task_id',$task->id)->sum('duration');
          $array_reponse = [ 
              'key'=>$task->id."",
              'title'=>$task->task_title,
              
              'ex_duration'=>$task->task_hours,
              'status'=>$task->task_status_id,
              'status_name'=>$task->task_status_id_fun->task_status_name,
              'start_date'=>   Carbon::parse( $task->task_start_date)->format('m/d/Y') ,
              'end_date'=> Carbon::parse( $task->task_end_date)->format('m/d/Y') ,
              'real_duration'=>$report,
     
    
          ];
          return $array_reponse;
        }
        public function arrayparsetaskold(AdminTask $task){
         
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
       

    
        public function DeleteAdminTask(Request $request){
            try{
                $validator = Validator::make($request->all(), [
                     'token'=>'required|string',
                    'task_id'=>'required|numeric|exists:admin_tasks,id',
                ]);
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
    
              $task=  AdminTask::where('id',$request->task_id)->first();
    
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
        
       
        public function UpdateAdminTaskDescription(Request $request){
            try{
                $validator = Validator::make($request->all(), [
                    'task_id' => 'required|string|exists:admin_tasks,id',
                    'token'=>'required|string',
                    'task_description'=>'required|string',
                ]);
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
    
              $task=  AdminTask::where('id',$request->task_id)->first();
    
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
       
        public function UpdateAdminTaskStatus(Request $request){
            try{
                $validator = Validator::make($request->all(), [
                    'task_status_id' => 'required|numeric|exists:task_statuses,id',
                    'token'=>'required|string',
                    'task_id'=>'required|numeric|exists:admin_tasks,id',
                ]);
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
    
              $task=  AdminTask::where('id',$request->task_id)->first();
    
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
        public function UpdateAdminTask(Request $request){
         try{
            
            $validator = Validator::make($request->all(), [
                    'token'=>'required|string',
                    'task_id'=>'required|numeric|exists:admin_tasks,id',
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
                        'user_id' => 'required|numeric|exists:users,id',
                      ]);
                    if ($validator->fails()) {
            
                        return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                    }
                  }
                  $delete_perv = AdminTaskTeam::where('task_id',$request->task_id)->delete();
    
                  foreach($task_team_array as $team){
                    $existance = AdminTaskTeam::where('user_id',$team['user_id'])
                    ->where('task_id',$request->task_id)->withTrashed()->first();
                    if(empty($existance->id)&&empty($existance->delete_at)){
                        $inserted[] = AdminTaskTeam::create([
                            'user_id'=>$team['user_id'],
                            'task_id'=>$request->task_id,
                          ]);
                    }else{
                      $inserted[]= $existance->restore();
                    }
                  }
               
              }
              $task_update=  AdminTask::where('id',$request->task_id)->first();
    
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
                $task_update=  AdminTask::where('id',$request->task_id)->first();
     
     
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
                $task_update=  AdminTask::where('id',$request->task_id)->first();
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
    
        public function CreateAdminTask(Request $request){
           try{
            
                 $validator = Validator::make($request->all(), [
                    'task_status_id' => 'required|numeric|exists:task_statuses,id',
                     'task_start_date' => 'required|date',
                    'task_end_date' => 'required|date',
                    // 'task_hours' => 'required|numeric',
                    'token'=>'required|string',
                    'task_team'=>'required|array',
                    'task_title' => 'required|string',
                ]);
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
                
                $end_date = Carbon::createFromFormat('m/d/Y', $request-> task_end_date);
                // if(!empty($process->id)){
                //   if(!empty($request->force_add)){
                //     if($request->force_add==1){
                     
                //     }elseif($request->extend_duration ==0){
                //       return ResponseApi::badMethodErrorResponse(["message"=>"Need Extand"],"Need Extand",401);
                //     }else{
                //       return ResponseApi::badMethodErrorResponse(["message"=>"Need Extand"],"Need Extand",401);
                //     }
                //   }
                // }else if(!empty($project->id)){
                //   if(!empty($request->force_add)){
                //     if($request->force_add==1){
                      
                //     }elseif($request->force_add ==0){
                //       return ResponseApi::badMethodErrorResponse(["message"=>"Need Extand"],"Need Extand",401);
                //     }
                //   }else{
                //     return ResponseApi::badMethodErrorResponse(["message"=>"Need Extand"],"Need Extand",401);
                //   }
                // }
              
                $task_team_array = $request->task_team;
    
            //     foreach($task_team_array as $team){
            //       $validator = Validator::make((array)$team, [
            //           'process_team_id' => 'required|numeric|exists:process_teams,id',
            //           'task_structure_id'=>'required|numeric|exists:task_structures,id'
    
            //        ]);
            //       if ($validator->fails()) {
          
            //           return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            //       }
            //   }
    
              $task=  AdminTask::create([
                'task_title' =>$request->task_title,
                'task_progress' =>$request->task_progress ?$request->task_progress:0,
                'task_description' =>$request->task_description?$request->task_description:null,
                'task_hours' =>$request->task_hours ?$request->task_hours:0 ,
                 'user_creator_id' =>Auth::guard('user_api')->user()->id,
                 'task_status_id' =>$request->task_status_id,
                 'task_start_date' => Carbon::createFromFormat('m/d/Y', $request-> task_start_date),
                'task_end_date' => Carbon::createFromFormat('m/d/Y', $request-> task_end_date),
               ]);
     
               foreach($task_team_array as $team){
                $existance = AdminTaskTeam::where('user_id',$team['user_id'])
                ->where('task_id',$task->id)->first();
                if(empty($existance->id)){
                   $tema = AdminTaskTeam::create([
                         'user_id'=>$team['user_id'],
                        'task_id'=>$task->id,
                     ]);
                     
                     $user_details = User::where('id',$tema->user_id)->first();
                     try{
                     $this->ApprovalSendNotification(Auth::guard('user_api')->user(),$user_details,$task);
                     }catch(\Exception $e){   
                      return ResponseApi::acceptedResponseApi($e,"success",201);

                     }
                }
              }
             
              return ResponseApi::acceptedResponseApi( $this->arrayparsetask($task),"success",201);
    
                 
            }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
     
            }
            
        }
        
        public function GetAllAdminTask(){
            try{
              $task = AdminTask::all();
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
    
        public function GetAdminDeleteTask(){
            try{
              $task = AdminTask::onlyTrashed()->get();
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
       
        public function GetAdminTaskForSpecificStatus(Request $request){
            try{
    
                     $validator = Validator::make($request->all(), [
                        'task_status_id' => 'required|numeric|exists:task_statuses,id',
                        'token'=>'required|string',
                     ]);
    
                    if ($validator->fails()) {
            
                        return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                    }
        
                  $task=  AdminTask::where('task_status_id',$request->task_status_id)->get();
        
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
     
    
    
      public function GetAdminAllTask(Request $request){
        try{
          $validator = Validator::make($request->all(), [
           'user_id' => 'required|numeric|exists:users,id',
           'token'=>'required|string',
         ]);
         if ($validator->fails()) {
    
             return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
         }
    
        
         $tasks = AdminTaskTeam::where('user_id',$request->user_id)->get();
    
         $existance=[];
                   
         foreach($tasks as $selTasks){
        
     
                $task = AdminTask::where('id',$selTasks->task_id)->first();
               if(!empty($task->id)){
                 $existance[] = $this->arrayparsetaskreports($task);
               }
    
             
           }
       
          // return ResponseApi::acceptedResponseApi([$get_team,$tasks],"success",201);
    
         
    
         if(!empty($existance[0])){
           return ResponseApi::acceptedResponseApi($existance,"success",201);
         }else{
           return ResponseApi::acceptedResponseApi(['message'=>"empty array"],"Empty",200);
         }
    
    
               
     }catch(\Exception $e){
       return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
    
     }
    
      }
    
      public function GetAdminOverDueTasks(Request $request){
        try{
          $validator = Validator::make($request->all(), [
           'user_id' => 'required|numeric|exists:users,id',
           'token'=>'required|string',
         ]);
         if ($validator->fails()) {
    
             return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
         }
        
         $tasks = AdminTaskTeam::whereHas('task_id_fun',function($q){
          $q->whereDate('task_end_date','<',Carbon::now());
         })->where('user_id',$request->user_id)->get();
         $existance=[];
                   
         foreach($tasks as $selTasks){
          
               $task = AdminTask::where('id',$selTasks->task_id)->where('task_status_id','<>',5)->first();
               if(!empty($task->id)){
                 $existance[] = $this->arrayparsetask($task);
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
    
    
    
      public function GetAdminOldTasks(Request $request){
          try{
             $validator = Validator::make($request->all(), [
              'user_id' => 'required|numeric|exists:users,id',
              'token'=>'required|string',
              'task_start_date' => 'required|date',
              'task_end_date' => 'required|date',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
    
            $start_date = Carbon::createFromFormat('m/d/Y', $request-> task_start_date);
            $end_date = Carbon::createFromFormat('m/d/Y', $request-> task_end_date);
            $tasks = AdminTaskTeam:: whereHas('task_id_fun', function($q) use($start_date,$end_date){
              $q->whereDate('task_end_date','>=',$start_date);
              $q->whereDate('task_start_date', '<=', $end_date);
            
            })->where('user_id',$request->user_id)->get();
    
            $existance=[];
                      
            foreach($tasks as $selTasks){
            
                  $task = AdminTask::where('id',$selTasks->task_id)->where('task_status_id','<>',5)->first();
                  if(!empty($task->id)){
                    $existance[] = $this->arrayparsetaskold($task);
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
    
    
    
      public function GetMyAdminRunningTasks(Request $request){
        try{
          $validator = Validator::make($request->all(), [
            'token'=>'required|string',
         ]);
         if ($validator->fails()) {
    
             return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
         }
    
        
         $tasks = AdminTaskTeam::where('user_id',Auth::guard('user_api')->user()->id)->get();
    
         $existance=[];
                   
         foreach($tasks as $selTasks){
           
               $task = AdminTask::where('id',$selTasks->task_id)->where('task_status_id',1) ->first();
               if(!empty($task->id)  ){
                 $existance[] = $this->arrayparsetask($task);
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
    
    
      public function GetAdminTasks(Request $request){
        try{
          $validator = Validator::make($request->all(), [
           'user_id' => 'required|numeric|exists:users,id',
           'token'=>'required|string',
         ]);
         if ($validator->fails()) {
    
             return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
         }
    
        
         $tasks = AdminTaskTeam::where('user_id',$request->user_id)->get();
    
         $existance=[];
                   
         foreach($tasks as $selTasks){
           
               $task = AdminTask::where('id',$selTasks->task_id) ->first();
               if(!empty($task->id)  ){
                 $existance[] = $this->arrayparsetask($task);
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
    
       
        
    
    
    public function GetAdminTaskProgress(Request $request){
    
    
      try{
        $validator = Validator::make($request->all(), [
         'task_id' => 'required|numeric|exists:admin_tasks,id',
         'token'=>'required|string',
       ]);
       if ($validator->fails()) {
    
           return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
       }
    
       $tasks = AdminReport::where('task_id',$request->task_id)->where('report_status_id','<>',3)->sum('report_progress');
       return ResponseApi::acceptedResponseApi((float)$tasks,"success",201);
    
       
             
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
     * @param  \App\Models\AdminTask  $adminTask
     * @return \Illuminate\Http\Response
     */
    public function show(AdminTask $adminTask)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\AdminTask  $adminTask
     * @return \Illuminate\Http\Response
     */
    public function edit(AdminTask $adminTask)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\AdminTask  $adminTask
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, AdminTask $adminTask)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\AdminTask  $adminTask
     * @return \Illuminate\Http\Response
     */
    public function destroy(AdminTask $adminTask)
    {
        //
    }
}
