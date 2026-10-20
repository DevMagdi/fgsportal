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

class ProjectController extends Controller
{
   public function arrayparseproject(Project $project){
   // return ["ah"];
    $inserted = ProjectTeam::where('project_id',$project->id)->get();
    $PMID=null;
    $PMName=null;
   

   if(!empty($inserted[0]->id)){
     foreach($inserted as $dep){
       if($dep->project_structure_id==1 &&!empty($dep->user_team_id)){
         $PMID=$dep->user_team_id;
         $PMName=$dep->user_team_id_fun->username;
       } 
     }
   }
   $progress= Report::whereHas('process_id_fun',function($q) use ($project){
    $q->where('project_id',$project->id);
  })->where('report_status_id','=',2)->sum('report_progress');

  $tasks = Task::whereHas('process_id_fun',function($q) use ($project){
    $q->where('project_id',$project->id);
  })->count();

  $progress = $progress/($tasks>=1? $tasks:1);
  $idle= Report::whereHas('process_id_fun',function($q) use ($project){
    $q->where('project_id',$project->id);
  })->where('report_status_id','=',2)->where('report_type_id',5)->sum('duration');
  
        $array_reponse = [ 
          'key'=>$project->id."",
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
            'PMID'=>$PMID,
            'PMName'=>$PMName,
       ];
        return $array_reponse;
    }
    public function arrayparseprojectWithTeam(Project $project){
      $inserted =  ProjectTeam::where('project_id', $project->id)
    ->withTrashed()
    ->with(['user_team_id_fun' => function ($query) {
        $query->withTrashed();
    }])
    ->get();

     // $inserted = ProjectTeam::where('project_id',$project->id)->withTrashed()->get();
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
          $trash=0;
          if(!empty($dep->deleted_at)){
            $trash=1;
          }
          if($dep->project_structure_id==1 &&!empty($dep->user_team_id)){
            if(empty($dep->deleted_at)){
            $PMID=$dep->user_team_id;
            $PMName=$dep->user_team_id_fun->username;
            $PMPhoto =$dep->user_team_id_fun->photoURL? '/Attachments/User/'.$dep->user_team_id_fun->id.'/profile'.'/'.$dep->user_team_id_fun->photoURL:null;
            }
          }elseif($dep->project_structure_id==2 &&!empty($dep->user_team_id)){
            if(empty($dep->deleted_at)){
              $Tech_leadID=$dep->user_team_id;
             $Tech_leadName=$dep->user_team_id_fun->username;
             $LeadPhoto =$dep->user_team_id_fun->photoURL? '/Attachments/User/'.$dep->user_team_id_fun->id.'/profile'.'/'.$dep->user_team_id_fun->photoURL:null;

            }
          }else if($dep->project_structure_id==3&&!empty($dep->user_team_id)){
          
            $array_reponse2[] = [ 
                 'key'=>$dep->user_team_id."",
                'username' =>$dep->user_team_id_fun->username,
                'photoURL' =>$dep->user_team_id_fun->photoURL? '/Attachments/User/'.$dep->user_team_id_fun->id.'/profile'.'/'.$dep->user_team_id_fun->photoURL:null,
                // '/Attachments/User/'.$user_detail->id.'/profile'.'/'.$user_detail->photoURL
                'trash'=>$trash,
            ];
          }else if($dep->project_structure_id==4&&!empty($dep->user_team_id)){
            $array_reponse3[] = [ 
                'key'=>$dep->user_team_id."",
                'username' =>$dep->user_team_id_fun->username,
                'photoURL' =>$dep->user_team_id_fun->photoURL? '/Attachments/User/'.$dep->user_team_id_fun->id.'/profile'.'/'.$dep->user_team_id_fun->photoURL:null,
                'trash'=>$trash,
            ];
        }else{
          $array_reponse4[] = [ 
            'key'=>$dep->user_team_id."",
            'username' =>$dep->user_team_id_fun->username,
            'photoURL' =>$dep->user_team_id_fun->photoURL? '/Attachments/User/'.$dep->user_team_id_fun->id.'/profile'.'/'.$dep->user_team_id_fun->photoURL:null,
            'project_structure_id'=>$dep->project_structure_id,
            'project_structure_name'=>$dep->project_structure_id_fun->project_structure_name,
            'trash'=>$trash,
        ];
        }
        }
      }
      $progress= Report::whereHas('process_id_fun',function($q) use ($project){
        $q->where('project_id',$project->id);
      })->where('report_status_id','=',2)->sum('report_progress');

      $idle= Report::whereHas('process_id_fun',function($q) use ($project){
        $q->where('project_id',$project->id);
      })->where('report_status_id','=',2)->where('report_type_id',5)->sum('duration');
    
      $tasks = Task::whereHas('process_id_fun',function($q) use ($project){
        $q->where('project_id',$project->id);
      })->count();
    
      $progress = $progress/($tasks>=1? $tasks:1);

      $primary_contact = ClientAccount::where('partner_id',$project->partner_id)->where('primary',1)->first();
        $array_reponse = [ 
            'key'=>$project->id."",
            'title'=>$project->project_title,
            'progress'=>$progress,
            'desc'=>$project->project_description,
            'duration'=>$project->project_duration,
            'budget'=>$project->project_budget,
            'managerID'=>(string)$project->user_creator_id,
            'managerName'=>$project->user_creator_id_fun->username,
            'PMID'=>(string)$PMID,
            'PMPhotoURL'=>(string)$PMPhoto,
            'PMName'=>$PMName,
            'idelHoues'=>$idle,
            'Tech_leadID'=>(string)$Tech_leadID,
            'Tech_leadName'=>$Tech_leadName,
            'tech_leadPhotoURL'=>(string)$LeadPhoto,

            'type'=>(string)$project->project_type_id,
            'type_name'=>$project->project_type_id_fun->project_type,
            'project_convert_id'=>$project->project_convert_id,
            'status'=>(string)$project->project_status_id,
            'status_name'=>$project->project_status_id_fun ? $project->project_status_id_fun->project_status_name : null,
            'partner_id'=>!empty($project->partner_id)?$project->partner_id:null,
            'partner_name'=>!empty($project->partner_id)?$project->partner_id_fun->partner_name:null,
            'partner_photoURL' =>!empty($project->partner_id)?($project->partner_id_fun->partner_photoURL?"Attachments/Client/Partner/" .  $project->partner_id . '/' .$project->partner_id_fun->partner_photoURL:null):null,
            'customerKey'=>!empty($primary_contact->id)?$primary_contact->id.'':null,
            'customerName'=>!empty($primary_contact->id)?$primary_contact->fullname.'':null,
            'customerPhone'=>!empty($primary_contact->id)?$primary_contact->phone.'':null,
            'customerEmail'=>!empty($primary_contact->id)?$primary_contact->email.'':null,
             'customerAddress'=>!empty($project->partner_id)?$project->partner_id_fun->partner_address:null,
             'start_date'=>   Carbon::parse( $project->project_start_date)->format('m/d/Y') ,
            'end_date'=> Carbon::parse( $project->project_end_date)->format('m/d/Y') ,
             'Devs_mempers'=>$array_reponse3,
             'BAsTeam'=>$array_reponse2,
             'OtherTeam'=>$array_reponse4,

       ];
        return $array_reponse;
    }
    public function DeleteProject(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'project_id'=>'required|numeric',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $project=  Project::where('id',$request->project_id)->first();

          if(!empty($project->id)){
            $process = Process::where('project_id',$project->id)->get();
            foreach ($process as  $value) {
                $tasks = Task::where('process_id',$value->id)->get();
                foreach ($tasks as $key ) {
                  $key->delete();
                }
                $value->delete();
            }

            $project->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Project  not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    
    public function UpdateProjectBudget(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'project_id' => 'required|string|exists:projects,id',
                'token'=>'required|string',
                'project_budget'=>'required|numeric',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $project=  Project::where('id',$request->project_id)->first();

          if(!empty($project->id)){

            $project->update([
                'project_budget' =>$request->project_budget,
            ]);

            return ResponseApi::acceptedResponseApi($this->arrayparseproject($project),"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Project status not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateProject(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'project_id' => 'required|string|exists:projects,id',
                'token'=>'required|string',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $project=  Project::where('id',$request->project_id)->first();

          if($project->project_status_id!=$request->project_status_id && $request->project_status_id ==5){
            $process = Process::where('project_id',$request->project_id)->get();
              foreach ($process as  $value) {
                 $task = Task::where('process_id',$value->id)->get();
                  foreach ($task as $key ) {
                    $key->update([
                      'task_status_id'=>5,
                    ]);
                  }
                  $value ->update([
                    'process_status_id'=>5,
                  ]);
              }
          }

          if(!empty($project->id)){
            $project->update(
              $request->except(['project_start_date','project_end_date'])
            );
            if(!empty($request->project_start_date)){
              $validator = Validator::make($request->all(), [
                'project_start_date' => 'required|date',
                'token'=>'required|string',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            $project=  Project::where('id',$request->project_id)->first();
            $project->update([
              'project_start_date'=>Carbon::createFromFormat('m/d/Y', $request-> project_start_date),
            ]);

            }
            if(!empty($request->project_end_date)){
              $validator = Validator::make($request->all(), [
                'project_end_date' => 'required|date',
                'token'=>'required|string',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            $project=  Project::where('id',$request->project_id)->first();
            $project->update([
              'project_end_date'=>Carbon::createFromFormat('m/d/Y', $request-> project_end_date),
            ]);

            }

            return ResponseApi::acceptedResponseApi($this->arrayparseproject($project),"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Project  not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
   
    public function UpdateProjectStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'project_status_id' => 'required|numeric|exists:project_statuses,id',
                'token'=>'required|string',
                'project_id'=>'required|numeric|exists:projects,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $project=  Project::where('id',$request->project_id)->first();

          if(!empty($project->id)){
            $project->update([
                'project_status_id' =>$request->project_status_id,
            ]);

            return ResponseApi::acceptedResponseApi($this->arrayparseproject($project),"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Project not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateProject(Request $request){
        try{
             $validator = Validator::make($request->all(), [
                'project_title' => 'required|string',
                'project_type_id' => 'required|numeric|exists:project_types,id',
                'project_status_id' => 'required|numeric|exists:project_statuses,id',
                'partner_id' => 'required|numeric|exists:partners,id',
                'project_start_date' => 'required|date',
                'project_end_date' => 'required|date|after:project_start_date',
                'project_duration' => 'required|numeric',
                'token'=>'required|string',
                'project_team'=>'required|array'

            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            $project=  Project::create([
              'project_title' =>$request->project_title,
              'project_progress' =>$request->project_progress ?$request->project_progress:0,
              'project_description' =>$request->project_description,
              'project_duration' =>$request->project_duration ?$request->project_duration:0 ,
              'project_budget' =>$request->project_budget ? $request->project_budget : 0,
              'user_creator_id' =>Auth::guard('user_api')->user()->id,
              'project_type_id' =>$request->project_type_id,
               'project_status_id' =>$request->project_status_id,
              'partner_id' =>$request->partner_id,
              'project_start_date' => Carbon::createFromFormat('m/d/Y', $request-> project_start_date),
              'project_end_date' => Carbon::createFromFormat('m/d/Y', $request-> project_end_date),
             ]);
           
            if(!empty($request->project_team)){
              $project_team_array = $request->project_team;

              foreach($project_team_array as $team){
                $validator = Validator::make((array)$team, [
                    'user_team_id' => 'required|numeric|exists:users,id',
                     'project_structure_id'=>'required|numeric|exists:project_structures,id'
                ]);
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
            }
            
           
       
           foreach($project_team_array as $team){
            $existance = ProjectTeam::where('user_team_id',$team['user_team_id'])->where('project_structure_id',$team['project_structure_id'])
            ->where('project_id',$project->id)->first();
            if(empty($existance->id)){
               $inserted[] = ProjectTeam::create([
                    'user_creator_id' =>Auth::guard('user_api')->user()->id,
                    'user_team_id'=>$team['user_team_id'],
                    'project_id'=>$project->id,
                    'project_structure_id'=>$team['project_structure_id'],
                ]);
            }
          }
        }
          return ResponseApi::acceptedResponseApi( $this->arrayparseproject($project),"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
            //return ResponseApi::badMethodErrorResponse($e,"server Error",500);

        }
        
    }
    public function ConvertProjectToNormal(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'project_id' => 'required|string|exists:projects,id',
                'token'=>'required|string',
             ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $project=  Project::where('id',$request->project_id)->first();
         
          if(!empty($project->id)){
            if(!empty($project->project_convert_id)){
                return ResponseApi::badMethodErrorResponse(['message'=>"Project Already Converted"],"Validator Errors",400);
              }
              if($project->project_type_id==2){
                return ResponseApi::badMethodErrorResponse(['message'=>"Project Already Normal"],"Validator Errors",400);
              }
              
            $new_project=  Project::create([
                'project_title' =>$project->project_title,
                'project_progress' =>$project->project_progress ?$project->project_progress:0,
                'project_description' =>$project->project_description,
                'project_duration' =>$project->project_duration ?$project->project_duration:0 ,
                'project_budget' =>$project->project_budget ? $project->project_budget : 0,
                'user_creator_id' =>Auth::guard('user_api')->user()->id,
                'project_type_id' =>2,
                 'project_status_id' =>$project->project_status_id,
                'partner_id' =>$project->partner_id,
                'project_start_date'=>   $project->project_start_date,
                'project_end_date'=>  $project->project_end_date ,
                'project_convert_id' =>$project->id,
            ]);
 
            $project->update([
              'project_status_id' =>5,
            ]);

            return ResponseApi::acceptedResponseApi(["old_project"=>$this->arrayparseproject($project) ,"new_project"=>$this->arrayparseproject($new_project)],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Project  not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetSpecificProject(Request $request){
      try{
        $validator = Validator::make($request->all(), [
          'project_id' => 'required|numeric|exists:projects,id',
          'token'=>'required|string',
       ]);

      if ($validator->fails()) {

          return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
      }
        $project = Project::where('id',$request->project_id)->first();
        if(!empty($project->id)){
       
          return ResponseApi::acceptedResponseApi($this->arrayparseprojectWithTeam($project),"success",201);

        }else{
          return ResponseApi::notFoundResponse(['message'=>"Empty Project"],"Empty",200);
        }
           
      }catch(\Exception $e){
        return $e;
          return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

      }
      
  }
  public function GetallProjectWithClosed(){
   // try{
      $project = Project::all();
      if(!empty($project[0]->id)){
        foreach($project as $dep){

        $array_reponse[] =  $this->arrayparseproject($dep);
        
    }
        return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

      }else{
        return ResponseApi::notFoundResponse(['message'=>"Empty Project"],"Empty",200);
      }
         
    // }catch(\Exception $e){
    //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

    // }
    
}
public function GetAllProjectWithPM(Request $request){
  //try{
   
      $validator = Validator::make($request->all(), [
        'user_id' => 'required|numeric|exists:users,id',
        'token'=>'required|string',
     ]);

    if ($validator->fails()) {

        return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
    }
    $project_team = ProjectTeam::where('project_structure_id',1)->where('user_team_id',$request->user_id)->get();
    if(!empty($project_team[0]->id)){
    foreach($project_team as $team){
        $project = Project::where('id',$team->project_id)->first();
  
        if(!empty($project->id)){

          $array_reponse[] =  $this->arrayparseproject($project);
        }
        
     }
      
    }
    if(!empty($array_reponse[0])){
    
      return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

    }else{
      return ResponseApi::notFoundResponse(['message'=>"Empty Project"],"Empty",200);
    }
       
  // }catch(\Exception $e){
  //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

  // }
  
}
    public function GetAllProject(){
        try{
          $project = Project::where('project_status_id','<>',5)->get();
          if(!empty($project[0]->id)){
            foreach($project as $dep){

            $array_reponse[] =  $this->arrayparseproject($dep);
            
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Project"],"Empty",200);
          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetClosedProject(){
      try{
        $project = Project::where('project_status_id',5)->get();
        if(!empty($project[0]->id)){
          foreach($project as $dep){

          $array_reponse[] =  $this->arrayparseproject($dep);
          
      }
          return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

        }else{
          return ResponseApi::notFoundResponse(['message'=>"Empty Project"],"Empty",200);
        }
           
      }catch(\Exception $e){
          return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

      }
      
  }
    public function GetDeleteProject(){
        try{
          $project = Project::onlyTrashed()->get();
          if(!empty($project[0]->id)){
            foreach($project as $dep){
            $array_reponse[] =  $this->arrayparseproject($dep);
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Project"],"Empty",200);
          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetProjectAfterConverted(){
        try{
          $project = Project::join('projects as b','projects.project_convert_id','b.id')->get();
          if(!empty($project[0]->id)){
            foreach($project as $dep){
            $array_reponse[] =  $this->arrayparseproject($dep);
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Project"],"Empty",200);
          }
             
        }catch(\Exception $e){
        //    return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
            return ResponseApi::badMethodErrorResponse($e,"server Error",500);

        }
        
    }
    public function GetConvertedProject(){
        try{
          $project = Project::where('project_convert_id','<>',null)->get();
          if(!empty($project[0]->id)){
            foreach($project as $dep){
            $array_reponse[] =  $this->arrayparseproject($dep);
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Project"],"Empty",200);
          }
             
        }catch(\Exception $e){
         return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
        }
        
    }
    public function GetProjectForSpecificStatus(Request $request){
        try{

                 $validator = Validator::make($request->all(), [
                    'project_status_id' => 'required|numeric|exists:project_statuses,id',
                    'token'=>'required|string',
                 ]);

                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
    
              $project=  Project::where('project_status_id',$request->project_status_id)->get();
    
                 if(!empty($project[0]->id)){
                    foreach($project as $dep){
                    $array_reponse[] =  $this->arrayparseproject($dep);
                }
                    return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
        
                  }else{
                    return ResponseApi::notFoundResponse(['message'=>"Empty Project"],"Empty",200);
                  }
               
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse($e,"server Error",500);

        }
        
    }


    public function GetUserProject(Request $request){
      try{
        $validator = Validator::make($request->all(), [
         'user_id' => 'required|numeric|exists:users,id',
         'token'=>'required|string',
       ]);
       if ($validator->fails()) {
  
           return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
       }
  
      
       $pro = ProjectTeam::where('user_team_id',$request->user_id)->get()->unique('project_id');
  
       $existance=[];
              //return ResponseApi::acceptedResponseApi([$projects],"success",201);
       foreach($pro as $proj){
        
         if(!empty($proj->id)){
          $pro = Project::where('id',$proj->project_id)->where('project_status_id','<>',5)->first();
              if(!empty($pro->id)){

                $existance[] = $this->arrayparseproject($pro);
              }
             
         }
     
  
       
       }
  
       if(!empty($existance[0])){
         return ResponseApi::acceptedResponseApi($existance,"success",201);
       }else{
         return ResponseApi::acceptedResponseApi(['message'=>"empty project"],"Empty",200);
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
