<?php

namespace App\Http\Controllers\Project\Process;
use App\Models\Project;
use App\Models\ProjectTeam;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use App\Models\Process;
use App\Models\Report;
use App\Models\Log;
use App\Models\Task;
use App\Models\ProcessTeam;
use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
class ProcessController extends Controller
{
     
  public function arrayparseprocessteam(Process $process){
    $inserted = ProcessTeam::where('process_id',$process->id)->withTrashed()->get();
   
    $array_reponse2 =[];
     $array_reponse3 =[];
    $array_reponse4 =[];
    
    $PMID=null;
    $PMName=null;
    $PMPhoto=null;

     $Tech_leadID=null;
     $Tech_leadName=null;
     $LeadPhoto=null;

     if(!empty($inserted[0]->id)){
      foreach($inserted as $dep){
        $trash =1;
        if(empty($dep->deleted_at)){
          $trash=0;
        }
        $dep2 = ProjectTeam::where('id',$dep->project_team_id)->withTrashed()->first();

         if($dep2->project_structure_id==1 &&!empty($dep2->user_team_id)){
            if(empty($dep->deleted_at)){
            $PMID=$dep->project_team_id_fun->user_team_id;
            $PMName=$dep->project_team_id_fun->user_team_id_fun->username;
            $PMPhoto =$dep->project_team_id_fun->user_team_id_fun->photoURL? '/Attachments/User/'.$dep->project_team_id_fun->user_team_id_fun->id.'/profile'.'/'.$dep->project_team_id_fun->user_team_id_fun->photoURL:null;
            }

          }elseif($dep2->project_structure_id==2 &&!empty($dep2->user_team_id)){
          if(empty($dep->deleted_at)){
           $Tech_leadID=$dep->project_team_id_fun->user_team_id;
          $Tech_leadName=$dep->project_team_id_fun->user_team_id_fun->username;
          $LeadPhoto =$dep->project_team_id_fun->user_team_id_fun->photoURL? '/Attachments/User/'.$dep->project_team_id_fun->user_team_id_fun->id.'/profile'.'/'.$dep->project_team_id_fun->user_team_id_fun->photoURL:null;

          }
        
        }else if($dep2->project_structure_id==3&&!empty($dep2->user_team_id)){

          $array_reponse2[] = [ 
               'key'=>$dep2->user_team_id."",
              'username' =>$dep2->user_team_id_fun->username,
              'photoURL' =>$dep2->user_team_id_fun->photoURL? '/Attachments/User/'.$dep2->user_team_id_fun->id.'/profile'.'/'.$dep2->user_team_id_fun->photoURL:null,

              'trash'=>$trash,

          ];
        }else if($dep2->project_structure_id==4&&!empty($dep2->user_team_id)){
          $array_reponse3[] = [ 
              'key'=>$dep2->user_team_id."",
              'username' =>$dep2->user_team_id_fun->username,
              'photoURL' =>$dep2->user_team_id_fun->photoURL? '/Attachments/User/'.$dep2->user_team_id_fun->id.'/profile'.'/'.$dep2->user_team_id_fun->photoURL:null,

              'trash'=>$trash,

          ];
      }else{
        $array_reponse4[] = [ 
          'key'=>$dep2->user_team_id."",
          'username' =>$dep2->user_team_id_fun->username,
          'photoURL' =>$dep2->user_team_id_fun->photoURL? '/Attachments/User/'.$dep2->user_team_id_fun->id.'/profile'.'/'.$dep2->user_team_id_fun->photoURL:null,
          'project_structure_id'=>$dep2->project_structure_id,
          'project_structure_name'=>$dep2->project_structure_id_fun->project_structure_name,
          'trash'=>$trash,
      ];
      }
      }
    }
    $progress= Report::whereHas('process_id_fun',function($q) use ($process){
      $q->where('id',$process->id);
    })->where('report_status_id','=',2)->sum('report_progress');
    $tasks = Task::where('process_id',$process->id)->count();

    $progress = $progress/($tasks>=1? $tasks:1);

    $array_reponse = [ 
        'key'=>$process->id."",
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
        'PMID'=>(string)$PMID,
        'PMPhotoURL'=>(string)$PMPhoto,
        'PMName'=>$PMName,
        'Tech_leadID'=>$Tech_leadID,
        'Tech_leadName'=>$Tech_leadName,
        'tech_leadPhotoURL'=>(string)$LeadPhoto,

        'Devs_mempers'=>$array_reponse3,
        'BAsTeam'=>$array_reponse2,
        'OtherTeam'=>$array_reponse4,

    ];
    return $array_reponse;
}

        public function arrayparseprocess(Process $process){
            $inserted = ProcessTeam::where('process_id',$process->id)->get();
           
    
            $array_reponse = [ 
                'key'=>$process->id,
                'title'=>$process->process_title,
                'progress'=>$process->process_progress,
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
     
            ];
            return $array_reponse;
        }

      public function DeleteProcess(Request $request){
          try{
              $validator = Validator::make($request->all(), [
                   'token'=>'required|string',
                  'process_id'=>'required|numeric',
              ]);
              if ($validator->fails()) {
      
                  return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
              }
  
            $process=  Process::where('id',$request->process_id)->first();
  
            if(!empty($process->id)){
              $task = Task::where('process_id',$process->id)->get();
              foreach($task as $value){
                $value->delete();
              }
  
              $process->delete();
  

              return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);
  
            }else{
              return ResponseApi::badMethodErrorResponse(['message'=>"Process  not found"],"Validator Errors",400);
  
            }
           
          
  
               
          }catch(\Exception $e){
              return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
  
          }
          
      }
      
     
      public function UpdateProcessDescription(Request $request){
          try{
              $validator = Validator::make($request->all(), [
                  'process_id' => 'required|string|exists:processes,id',
                  'token'=>'required|string',
                  'process_description'=>'required|string',
              ]);
              if ($validator->fails()) {
      
                  return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
              }
  
            $process=  Process::where('id',$request->process_id)->first();
  
            if(!empty($process->id)){
  
              $process->update([
                  'process_description' =>$request->process_description,
              ]);
  
              return ResponseApi::acceptedResponseApi($this->arrayparseprocess($process),"success",201);
  
            }else{
              return ResponseApi::badMethodErrorResponse(['message'=>"Process status not found"],"Validator Errors",400);
  
            }
           
          
  
               
          }catch(\Exception $e){
              return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
  
          }
          
      }
     
      public function UpdateProcessStatus(Request $request){
          try{
              $validator = Validator::make($request->all(), [
                  'process_status_id' => 'required|numeric|exists:process_statuses,id',
                  'token'=>'required|string',
                  'process_id'=>'required|numeric|exists:processes,id',
              ]);
              if ($validator->fails()) {
      
                  return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
              }
  
            $process=  Process::where('id',$request->process_id)->first();
  
            if(!empty($process->id)){
              $process->update([
                  'process_status_id' =>$request->process_status_id,
              ]);
  
              return ResponseApi::acceptedResponseApi($this->arrayparseprocess($process),"success",201);
  
            }else{
              return ResponseApi::badMethodErrorResponse(['message'=>"Process not found"],"Validator Errors",400);
  
            }
           
          
  
               
          }catch(\Exception $e){
              return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
  
          }
          
      }
      public function CreateProcess(Request $request){
          try{
          

               $validator = Validator::make($request->all(), [
                  'process_description' => 'required|string',
                  'process_status_id' => 'required|numeric|exists:process_statuses,id',
                  'project_id' => 'required|numeric|exists:projects,id',
                  'process_start_date' => 'required|date',
                  'process_end_date' => 'required|date|after_or_equal:process_start_date',
                  'process_duration' => 'required|numeric',
                  'token'=>'required|string',
                  'process_team'=>'required|array',
                  'process_title' => 'required|string',
              ]);
                  
              if ($validator->fails()) {
        try{
              $log = Log::create([
                    'action'=>Auth::guard('user_api')->user()->username . "try to create ". $request->process_title .$validator->errors(),
                    'actionKeys'=>Auth::guard('user_api')->user()->id,
                    'empKey'=>Auth::guard('user_api')->user()->id,
                    'empName'=>Auth::guard('user_api')->user()->username,
                    'createdAt'=>Carbon::now(),
                    'actionStatus'=>"under try"
                  ]);}catch(\Exception $e){ }
                  return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
              }
              try{
              $log = Log::create([
                    'action'=>Auth::guard('user_api')->user()->username . "try to create ". $request->process_title,
                    'actionKeys'=>$request->project_id,
                    'empKey'=>Auth::guard('user_api')->user()->id,
                    'empName'=>Auth::guard('user_api')->user()->username,
                    'createdAt'=>Carbon::now(),
                    'actionStatus'=>"under try"
                  ]);}catch(\Exception $e){}
              $process_team_array =  $request->process_team ;
  
              foreach($process_team_array as $team){
                $validator = Validator::make((array)$team, [
                    'project_team_id' => 'required|numeric|exists:project_teams,id',
                 ]);
                if ($validator->fails()) {
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
            }
            $process=  Process::create([
              'process_title' =>$request->process_title,
              'process_progress' =>$request->process_progress ?$request->process_progress:0,
              'process_description' =>$request->process_description,
              'process_duration' =>$request->process_duration ?$request->process_duration:0 ,
               'user_creator_id' =>Auth::guard('user_api')->user()->id,
                'process_status_id' =>$request->process_status_id,
              'project_id' =>$request->project_id,
              'process_start_date' => Carbon::createFromFormat('m/d/Y', $request-> process_start_date),
              'process_end_date' => Carbon::createFromFormat('m/d/Y', $request-> process_end_date),
             ]);
             try{
              $log = Log::create([
                    'action'=>Auth::guard('user_api')->user()->username . "try to create ". $request->process_title. Carbon::createFromFormat('m/d/Y', $request-> process_start_date).Carbon::createFromFormat('m/d/Y', $request-> process_end_date),
        'actionKeys'=>$request->project_id,
        'empKey'=>Auth::guard('user_api')->user()->id,
        'empName'=>Auth::guard('user_api')->user()->username,
        'createdAt'=>Carbon::now(),
        'actionStatus'=>"under try"
                  ]);}catch(\Exception $e){}
             foreach($process_team_array as $team){
              $existance = ProcessTeam::where('project_team_id',$team['project_team_id'])
              ->where('process_id',$process->id)->first();
              if(empty($existance->id)){
                 $inserted[] = ProcessTeam::create([
                      'user_creator_id' =>Auth::guard('user_api')->user()->id,
                      'project_team_id'=>$team['project_team_id'],
                      'process_id'=>$process->id,
                   ]);
              }
            }
            
            return ResponseApi::acceptedResponseApi( $this->arrayparseprocess($process),"success",201);
          }catch(\Exception $e){
              return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
              //return ResponseApi::badMethodErrorResponse($e,"server Error",500);
  
          }
          
      }
      
      public function GetAllProcess(){
          try{
            $process = Process::all();
            if(!empty($process[0]->id)){
              foreach($process as $dep){
  
              $array_reponse[] =  $this->arrayparseprocess($dep);
              
          }
              return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
  
            }else{
              return ResponseApi::notFoundResponse(['message'=>"Empty Process"],"Empty",200);
            }
               
          }catch(\Exception $e){
              return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
  
          }
          
      }
      public function GetDeleteProcess(){
          try{
            $process = Process::onlyTrashed()->get();
            if(!empty($process[0]->id)){
              foreach($process as $dep){
              $array_reponse[] =  $this->arrayparseprocess($dep);
          }
              return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
  
            }else{
              return ResponseApi::notFoundResponse(['message'=>"Empty Process"],"Empty",200);
            }
               
          }catch(\Exception $e){
              return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
  
          }
          
      }
     
      public function GetProcessForSpecificStatus(Request $request){
          try{
  
                   $validator = Validator::make($request->all(), [
                      'process_status_id' => 'required|numeric|exists:process_statuses,id',
                      'token'=>'required|string',
                   ]);
  
                  if ($validator->fails()) {
          
                      return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                  }
      
                $process=  Process::where('process_status_id',$request->process_status_id)->get();
      
                   if(!empty($process[0]->id)){
                      foreach($process as $dep){
                      $array_reponse[] =  $this->arrayparseprocess($dep);
                  }
                      return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
          
                    }else{
                      return ResponseApi::notFoundResponse(['message'=>"Empty Process"],"Empty",200);
                    }
                 
          }catch(\Exception $e){
              return ResponseApi::badMethodErrorResponse($e,"server Error",500);
  
          }
          
      }
      public function GetProcessForSpecificProject(Request $request){
          try{

                 $validator = Validator::make($request->all(), [
                    'project_id' => 'required|numeric|exists:projects,id',
                    'token'=>'required|string',
                 ]);

                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
    
              $process=  Process::where('project_id',$request->project_id)->get();
    
                 if(!empty($process[0]->id)){
                    foreach($process as $dep){
                    $array_reponse[] =  $this->arrayparseprocess($dep);
                }
                    return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
        
                  }else{
                    return ResponseApi::notFoundResponse(['message'=>"Empty Processes"],"Empty",200);
                  }
               
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse($e,"server Error",500);

        }
        
    }
    
    
    public function GetSpecificProcess(Request $request){
      try{

             $validator = Validator::make($request->all(), [
                'process_id' => 'required|numeric|exists:processes,id',
                'token'=>'required|string',
             ]);

            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $process=  Process::where('id',$request->process_id)->first();
          if(!empty($process->id)){
          
                return ResponseApi::acceptedResponseApi($this->arrayparseprocessteam($process),"success",201);
    
              }else{
                return ResponseApi::notFoundResponse(['message'=>"Empty Processes"],"Empty",200);
              }
           
    }catch(\Exception $e){
        return ResponseApi::badMethodErrorResponse($e,"server Error",500);

    }
    
}
public function UpdateProcess(Request $request){
  try{
      $validator = Validator::make($request->all(), [
          'process_id' => 'required|string|exists:processes,id',
          'token'=>'required|string',
      ]);
      if ($validator->fails()) {

          return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
      }

    $process=  Process::where('id',$request->process_id)->first();

    if($process->process_status_id != $request->process_status_id && $request->process_status_id==5){
      $task = Task::where('process_id',$process->id)->get();
      foreach ($task as $value) {
        $value->update([
          'task_status_id'=>5,
        ]);
        # code...
      }
      
    }

    if(!empty($process->id)){
      $process->update(
        $request->except(['process_start_date','process_end_date'])
      );
      if(!empty($request->process_start_date)){
        $validator = Validator::make($request->all(), [
          'process_start_date' => 'required|date',
          'token'=>'required|string',
      ]);
      if ($validator->fails()) {

          return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
      }
      $process=  Process::where('id',$request->process_id)->first();
      $process->update([
        'process_start_date'=>Carbon::createFromFormat('m/d/Y', $request-> process_start_date),
      ]);

      }
      if(!empty($request->process_end_date)){
        $validator = Validator::make($request->all(), [
          'process_end_date' => 'required|date',
          'token'=>'required|string',
      ]);
      if ($validator->fails()) {

          return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
      }
      $process=  Process::where('id',$request->process_id)->first();
      $process->update([
        'process_end_date'=>Carbon::createFromFormat('m/d/Y', $request-> process_end_date),
      ]);

      }

      return ResponseApi::acceptedResponseApi($this->arrayparseprocess($process),"success",201);

    }else{
      return ResponseApi::badMethodErrorResponse(['message'=>"Process not found"],"Validator Errors",400);

    }
   
  

       
  }catch(\Exception $e){
      return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

  }
  
}

public function GetUserProcess(Request $request){
   try{
    $validator = Validator::make($request->all(), [
     'user_id' => 'required|numeric|exists:users,id',
     'token'=>'required|string',
   ]);
   if ($validator->fails()) {

       return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
   }

   $pro = ProcessTeam::whereHas('project_team_id_fun', function($q) use($request){
    $q->where('user_team_id',$request->user_id);  
    
  })->get()->unique('process_id');


   $existance=[];
 //  return ResponseApi::acceptedResponseApi($pro,"success",201);

   foreach($pro as $proc){
    $process = Process::where('id',$proc->process_id)->first();
     if(!empty($process->id)){
           $existance[] = [
             'title'=>$process->process_title,
             'key'=>$process->id."",
             'project_key'=>$process->project_id.""
           ];
         
     }
   }

   if(!empty($existance[0])){
     return ResponseApi::acceptedResponseApi($existance,"success",201);
   }else{
     return ResponseApi::acceptedResponseApi(['message'=>"empty Process"],"Empty",200);
   }


         
}catch(\Exception $e){
 return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

}


}
public function GetProjectProcess(Request $request){
  try{
    $validator = Validator::make($request->all(), [
     'project_id' => 'required|numeric|exists:users,id',
     'token'=>'required|string',
   ]);
   if ($validator->fails()) {

       return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
   }

  
   $pro = Process::where('project_id',$request->project_id)->get();

   $existance=[];

   foreach($pro as $proj){
    
     if(!empty($proj->id)){
           $existance[] = [
             'title'=>$proj->process_title,
             'key'=>$proj->id."",
             'project_key'=>$proj->project_id.""

           ];
         
     }
   }

   if(!empty($existance[0])){
     return ResponseApi::acceptedResponseApi($existance,"success",201);
   }else{
     return ResponseApi::acceptedResponseApi(['message'=>"empty Process"],"Empty",200);
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
     * @param  \App\Models\Process  $process
     * @return \Illuminate\Http\Response
     */
    public function show(Process $process)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Process  $process
     * @return \Illuminate\Http\Response
     */
    public function edit(Process $process)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Process  $process
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Process $process)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Process  $process
     * @return \Illuminate\Http\Response
     */
    public function destroy(Process $process)
    {
        //
    }
}
