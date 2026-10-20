<?php

namespace App\Http\Controllers\Project\PMTeamRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use App\Models\PMTeamRequestStatus;
use App\Models\PMTeamRequest;
use App\Models\PMTeamRequestProject;
use App\Models\User;
use App\Models\Project;
use App\Models\Process;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Models\UserPermissionGroup;
use App\Http\Controllers\ApiMessage\MessageController;

class PMTeamRequestController extends Controller
{

    public function CreateNewRequestNotification(User $user1 , User $user2,PMTeamRequest $report){
        $msg = array
             (
               "body"=>  $user1->username . " Has Created New Request",
               "createdAt"=>$report->updated_at,
               "receverKey"=> $user2->id.'',
               "receverName"=> $user2->username,
               "redirection"=> "/manager/manager-reports",
               "senderKey"=> $user1->id.'',
               "senderName"=> $user1->username,
               "status"=> 0,
               "updatedAt"=>$report->updated_at,
               "title"=>  $user1->username." Create New Request ".$report->team_request_title ,
               'senderImg'=>$user1->photoURL?'/Attachments/User/'.$user1->id.'/profile'.'/'.$user1->photoURL:null,
             );

       MessageController::notificationSend($msg);
    }

    public function ApprovalSendNotification(User $user1 , User $user2,PMTeamRequest $report){
        $msg = array
             (
               "body"=>  $user1->username . " Has Closed Your Request",
               "createdAt"=>$report->updated_at,
               "receverKey"=> $user2->id.'',
               "receverName"=> $user2->username,
               "redirection"=> "/manager/project-manager-reports",
               "senderKey"=> $user1->id.'',
               "senderName"=> $user1->username,
               "status"=> 0,
               "updatedAt"=>$report->updated_at,
               "title"=>  $user1->username."Your Report ".$report->team_request_title. " Closed"  ,
               'senderImg'=>$user1->photoURL?'/Attachments/User/'.$user1->id.'/profile'.'/'.$user1->photoURL:null,
             );

       MessageController::notificationSend($msg);
    }


    public function castPMTeamRequest(PMTeamRequest $pmteamrequest){
        
          $pm_project_details = PMTeamRequestProject::where('pm_team_request_id',$pmteamrequest->id)->get();
          $users = User::whereIn('id',json_decode($pmteamrequest->developer_team))->withTrashed()->get();

          $developer_team=[];
          $projects = [];

          foreach ($users as $developers) {
                $developer_team [] = [
                    "user_id"=>$developers->id,
                    "username"=>$developers->username
                ];
          }

          foreach ($pm_project_details as $project_details) {
            $project = Project::where('id',$project_details->project_id)->withTrashed()->first();
            $process_array=[];
            $processes = Process::whereIn('id',json_decode($project_details->process_details))->withTrashed()->get();
            foreach ($processes as  $process) {
                $process_array[] = [
                    "process_id"=>$process->id."",
                    "process_title"=>$process->process_title
                ];
                # code...
            }
                $projects [] = [
                    "project_id"=>$project->id."",
                    "project_title"=>$project->project_title,
                    "process_details"=>$process_array
                ];
            }
        $array_reponse = [ 
            'key'=>$pmteamrequest->id."",
            'team_request_title'=>$pmteamrequest->team_request_title,
            'team_request_description'=>$pmteamrequest->team_request_description,
            'team_request_status_id'=>!empty($pmteamrequest->team_request_status_id)?$pmteamrequest->team_request_status_id."":null,
            'team_request_status'=>!empty($pmteamrequest->team_request_status_id_fun)?$pmteamrequest->team_request_status_id_fun->pm_team_request_status:null,
             'user_creator_id'=>!empty($pmteamrequest->user_creator_id)?$pmteamrequest->user_creator_id."":null,
            'user_creator_name'=>!empty($pmteamrequest->user_creator_id_fun)?$pmteamrequest->user_creator_id_fun->username:null,
            'for_date'=>Carbon::parse( $pmteamrequest->for_date)->format('m/d/Y'),
            'manager_approve_id'=>$pmteamrequest->manager_approve_id,
            'manager_approve_name'=>!empty($pmteamrequest->manager_approve_id_fun)?$pmteamrequest->manager_approve_id_fun->username:null,
            'developer_team'=>$developer_team,
            "projects"=>$projects
        ];
        return $array_reponse;
    }

    
    public function UpdatePMTeamRequest(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'team_request_title' => 'required|string',
                'token'=>'required|string',
                'manager_approve_id' => 'required|string|exists:users,id',
                'team_request_description' => 'string',
                'for_date' => 'required|date',
                'developer_team' => 'required|array',
                'projects' => 'required|array',
                'pm_team_request_id' => 'required|string|exists:p_m_team_requests,id',
            ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

            $pm_request_update = PMTeamRequest::where('id',$request->pm_team_request_id)->first();
            if($pm_request_update->pm_team_request_id ==2){
                return ResponseApi::badMethodErrorResponse(["message"=>"Request already closed"],"Validator Errors",400);

            }

            //another Vaildation Step for Developer Team 
            $validation_result["developer_team"] = [];
            if(!empty($request->developer_team)){
                $developer_team = $request->developer_team;
                foreach ($developer_team  as $value) {
                     $user = User::where('id',$value)->first();
                     if(empty($user->id)){
                        $user = User::where('id',$value)->withTrashed()->first();
                        if(empty($user->id)){
                            $validation_result["developer_team"][]= "User ID ".$value." Doesnt Exist";
                        }else{
                            $validation_result["developer_team"][]= "User ".$user->username ." Deleted or Deactivated";
                        }
                     }
                }
            }
            //another Vaildation Step for Project and Its Processes
            $validation_result["projects"] = [];
            if(!empty($request->projects)){
                $projects = $request->projects;
                foreach ($projects  as $value) {
                    $project = Project::where('id',$value["project_id"])->first();
                    if(empty($project->id)){
                        $project = Project::where('id',$value["project_id"])->withTrashed()->first();
                        if(empty($project->id)){
                            $validation_result["projects"][]= "Project ID ".$value." Doesnt Exist";
                        }else{
                            $validation_result["projects"][]= "Project ".$project->project_title." Deleted";
                        }
                        continue;
                    }
                    $processes = $value["process_details"];
                    foreach ($processes as $process_value) {
                        $process = Process::where('project_id',$project->id)->where('id',$process_value)->first();
                        if(empty($process->id)){
                            $process = Process::where('project_id',$project->id)->where('id',$process_value)->withTrashed()->first();
                            if(empty($process->id)){
                                $validation_result["projects"][]= "For Project ".$project->project_title." Process ID".$process_value." Doesnt Exist";
                            }else{
                                $validation_result["projects"][]= "For Project ".$project->project_title." Process ID".$process->process_title." Deleted";
                            }
                        }
                    }
                }
            }
            if(!empty($validation_result["developer_team"])||!empty($validation_result["projects"])){
                return ResponseApi::badMethodErrorResponse($validation_result,"Validator Errors",400);
            }
            DB::beginTransaction();
            $pm_request_update = PMTeamRequest::where('id',$request->pm_team_request_id)->first();
        
            $pm_request_update->update([
                'team_request_title'=>$request->team_request_title,
                'team_request_description'=>!empty($request->team_request_description)?$request->team_request_description:null,
                'team_request_status_id'=>1,
                'user_creator_id'=>Auth::guard('user_api')->user()->id,
                'manager_approve_id'=>$request->manager_approve_id,
                'for_date'=>Carbon::createFromFormat('m/d/Y', $request-> for_date),
                'developer_team'=>json_encode($request->developer_team),
            ]);

            $projects = $request->projects;
            //Delete all Insertion 
            $delete_all = PMTeamRequestProject::where('pm_team_request_id',$request->pm_team_request_id)->get();
            foreach ($delete_all as $object_delete) {
                $object_delete->forceDelete();
                
            }
            foreach ($projects  as $value) {
                $pm_project_details=PMTeamRequestProject::create([
                        'pm_team_request_id'=>$request->pm_team_request_id,
                        'project_id'=>$value["project_id"],
                        'process_details'=>json_encode($value["process_details"]),
                     ]);
                    if(empty($pm_project_details->id)){
                        return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
                    }
            }
            
            DB::commit();
            $users = User::whereHas('sub_departments_id_fun',function($q){
                $q->where('departments_id',1);
            })->get();
            foreach ($users as $value) {
                $manager =  PMTeamRequest::where('manager_approve_id',$value->id)
                ->where('team_request_status_id',1)
                ->get()->count();
                try{
                    $msg = array(
                        'project_manager_reports'=>$manager
                    );
                    MessageController::updatedatafirebase($request->manager_approve_id,$msg);
                }catch(\Exception $e){}
            }
            
            $manager =  PMTeamRequest::where('user_creator_id',Auth::guard('user_api')->user()->id)
            ->where('team_request_status_id',1)
            ->get()->count();
            try{
                $msg = array(
                    'project_manager_reports'=>$manager
                );
                MessageController::updatedatafirebase(Auth::guard('user_api')->user()->id,$msg);
            }catch(\Exception $e){}

          return ResponseApi::acceptedResponseApi(["message"=>"Created Successfully"],"success",201);
             
        }catch(\Exception $e1){
              try{
                DB::rollBack();
              }catch(\Exception $e){
                return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
              }
              return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
   
    public function DeletePMTeamRequest(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'pm_team_request_id' => 'required|string|exists:p_m_team_requests,id',
                ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            DB::beginTransaction();

            $pm_request_deletion_projects = PMTeamRequestProject::where('pm_team_request_id',$request->pm_team_request_id)->get();
            foreach ($pm_request_deletion_projects as  $value) {
                $value->delete();
            }
            $pm_request_deletion = PMTeamRequest::where('id',$request->pm_team_request_id)->get();
            foreach ($pm_request_deletion as  $value) {
                $value->delete();
            }
            DB::commit();

            
          return ResponseApi::acceptedResponseApi(["message"=>"Deleted Successfully"],"success",201);
             
        }catch(\Exception $e1){
             try{
                DB::rollBack();
              }catch(\Exception $e){
                return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
    
              }
              return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
    }

    public function CreatePMTeamRequest(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'team_request_title' => 'required|string',
                'token'=>'required|string',
                'manager_approve_id' => 'required|string|exists:users,id',
                'team_request_description' => 'string',
                'for_date' => 'required|date',
                'developer_team' => 'required|array',
                'projects' => 'required|array',
            ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            //another Vaildation Step for Developer Team 
            $validation_result["developer_team"] = [];
            if(!empty($request->developer_team)){
                $developer_team = $request->developer_team;
                foreach ($developer_team  as $value) {
                     $user = User::where('id',$value)->first();
                     if(empty($user->id)){
                        $user = User::where('id',$value)->withTrashed()->first();
                        if(empty($user->id)){
                            $validation_result["developer_team"][]= "User ID ".$value." Doesnt Exist";
                        }else{
                            $validation_result["developer_team"][]= "User ".$user->username ." Deleted or Deactivated";
                        }
                     }
                }
            }
            //another Vaildation Step for Project and Its Processes
            $validation_result["projects"] = [];
            if(!empty($request->projects)){
                $projects = $request->projects;
                foreach ($projects  as $value) {
                    $project = Project::where('id',$value["project_id"])->first();
                    if(empty($project->id)){
                        $project = Project::where('id',$value["project_id"])->withTrashed()->first();
                        if(empty($project->id)){
                            $validation_result["projects"][]= "Project ID ".$value." Doesnt Exist";
                        }else{
                            $validation_result["projects"][]= "Project ".$project->project_title." Deleted";
                        }
                        continue;
                    }
                    $processes = $value["process_details"];
                    foreach ($processes as $process_value) {
                        $process = Process::where('project_id',$project->id)->where('id',$process_value)->first();
                        if(empty($process->id)){
                            $process = Process::where('project_id',$project->id)->where('id',$process_value)->withTrashed()->first();
                            if(empty($process->id)){
                                $validation_result["projects"][]= "For Project ".$project->project_title." Process ID".$process_value." Doesnt Exist";
                            }else{
                                $validation_result["projects"][]= "For Project ".$project->project_title." Process ID".$process->process_title." Deleted";
                            }
                        }
                    }
                }
            }
            if(!empty($validation_result["developer_team"])||!empty($validation_result["projects"])){
                return ResponseApi::badMethodErrorResponse($validation_result,"Validator Errors",400);
            }
            DB::beginTransaction();
            $pm_request_creation = PMTeamRequest::create([
                'team_request_title'=>$request->team_request_title,
                'team_request_description'=>!empty($request->team_request_description)?$request->team_request_description:null,
                'team_request_status_id'=>1,
                'user_creator_id'=>Auth::guard('user_api')->user()->id,
                'manager_approve_id'=>$request->manager_approve_id,
                'for_date'=>Carbon::createFromFormat('m/d/Y', $request-> for_date),
                'developer_team'=>json_encode($request->developer_team),
            ]);
             if(!empty($pm_request_creation->id)){
                $projects = $request->projects;
            
                foreach ($projects  as $value) {
                    $pm_project_details=PMTeamRequestProject::create([
                        'pm_team_request_id'=>$pm_request_creation->id,
                        'project_id'=>$value["project_id"],
                        'process_details'=>json_encode($value["process_details"]),
                     ]);
                    if(empty($pm_project_details->id)){
                        return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
                    }
                }
            }
            DB::commit();
            $manager =  PMTeamRequest::where('manager_approve_id',$request->manager_approve_id)
            ->where('team_request_status_id',1)
            ->get()->count();
            try{
                $msg = array(
                    'project_manager_reports'=>$manager
                );
                MessageController::updatedatafirebase($request->manager_approve_id,$msg);
             }catch(\Exception $e){}

            try{
                $user_details = User::where('id',$request->manager_approve_id)->first();
                $this->CreateNewRequestNotification(Auth::guard('user_api')->user(),$user_details,$pm_request_creation);
            }catch(\Exception $e){
            }


            $manager =  PMTeamRequest::where('user_creator_id',Auth::guard('user_api')->user()->id)
            ->where('team_request_status_id',1)
            ->get()->count();
            try{
                $msg = array(
                    'project_manager_reports'=>$manager
                );
                MessageController::updatedatafirebase(Auth::guard('user_api')->user()->id,$msg);
            }catch(\Exception $e){}

          return ResponseApi::acceptedResponseApi(["message"=>"Created Successfully"],"success",201);
             
        }catch(\Exception $e1){
             try{
                DB::rollBack();
              }catch(\Exception $e){
                return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
    
              }
              return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

    public function GetAllOpenPMTeamRequest(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            $array_response = [];
            $pm_request = PMTeamRequest::where('team_request_status_id',1)->get();
            if(!empty($pm_request[0]->id)){
                foreach ($pm_request as  $value) {
                    $array_response [] = $this->castPMTeamRequest($value);
                }
                return ResponseApi::acceptedResponseApi($array_response,"success",201);

            }else{
                return ResponseApi::notFoundResponse(['message'=>"Empty Requests"],"Empty",200);

            }
            
             
        }catch(\Exception $e1){
            return $e1;
              return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }

    }

    public function GetAllPMTeamRequestFilter(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'team_request_status_id' => 'string|exists:p_m_team_request_statuses,id',
                 'start_date' => 'date',
                 'end_date' => 'date|date_format:m/d/Y|after:start_date',
                 ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            $array_response = [];
           
            $perm = UserPermissionGroup::where('users_id',Auth::guard('user_api')->user()->id)->where('permissions_id',23)->first();
            if(Auth::guard('user_api')->user()->sub_departments_id_fun->departments_id==1|| !empty($perm->id) )
            {
                $pm_request = PMTeamRequest::where('team_request_status_id',$request->has('team_request_status_id')?'=':'<>',$request->has('team_request_status_id')?$request->team_request_status_id:null)
                ->whereDate('for_date',$request->has('start_date')?'>=':'<>',$request->has('start_date')?Carbon::createFromFormat('m/d/Y',$request->start_date):'')
                ->whereDate('for_date',$request->has('end_date')?'<=':'<>',$request->has('end_date')?Carbon::createFromFormat('m/d/Y',$request->end_date):'')->get();
               
            }else{
                $pm_request = PMTeamRequest::where('team_request_status_id',$request->has('team_request_status_id')?'=':'<>',$request->has('team_request_status_id')?$request->team_request_status_id:null)
                ->whereDate('for_date',$request->has('start_date')?'>=':'<>',$request->has('start_date')?Carbon::createFromFormat('m/d/Y',$request->start_date):'')
                ->whereDate('for_date',$request->has('end_date')?'<=':'<>',$request->has('end_date')?Carbon::createFromFormat('m/d/Y',$request->end_date):'')
                ->where('user_creator_id',Auth::guard('user_api')->user()->id)->get();
             
            }
            if(!empty($pm_request[0]->id)){
                foreach ($pm_request as  $value) {
                    $array_response [] = $this->castPMTeamRequest($value);
                }
                return ResponseApi::acceptedResponseApi($array_response,"success",201);

            }else{
                return ResponseApi::notFoundResponse(['message'=>"Empty Requests"],"Empty",200);

            }
       
             
        }catch(\Exception $e1){
        
              return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }

    }


    public function GetMyPMTeamRequest(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'team_request_status_id' => 'string|exists:p_m_team_request_statuses,id',
                 ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            $array_response = [];
            if($request->has('team_request_status_id')){
                $pm_request = PMTeamRequest::where('team_request_status_id',$request->team_request_status_id)->where('user_creator_id',Auth::guard('user_api')->user()->id)->get();
            }else{
                $pm_request = PMTeamRequest::where('user_creator_id',Auth::guard('user_api')->user()->id)->get();
            }
            if(!empty($pm_request[0]->id)){
                foreach ($pm_request as  $value) {
                    $array_response [] = $this->castPMTeamRequest($value);
                }
                return ResponseApi::acceptedResponseApi($array_response,"success",201);

            }else{
                return ResponseApi::notFoundResponse(['message'=>"Empty Requests"],"Empty",200);

            }
        }catch(\Exception $e1){
            return $e1;
              return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }

    }
  
    public function GetManagerPMTeamRequestProject(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'team_request_status_id' => 'string|exists:p_m_team_request_statuses,id',
                  'start_date' => 'date',
                 'end_date' => 'date|date_format:m/d/Y|after:start_date',
                 ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            $array_response = [];
             $pm_request = PMTeamRequest::where('manager_approve_id',Auth::guard('user_api')->user()->id)
            ->where('team_request_status_id',$request->has('team_request_status_id')?'=':'<>',$request->has('team_request_status_id')?$request->team_request_status_id:null)
            ->whereDate('for_date',$request->has('start_date')?'>=':'<>',$request->has('start_date')?Carbon::createFromFormat('m/d/Y',$request->start_date):'')
            ->whereDate('for_date',$request->has('end_date')?'<=':'<>',$request->has('end_date')?Carbon::createFromFormat('m/d/Y',$request->end_date):'')
            ->get();

            if(!empty($pm_request[0]->id)){
                foreach ($pm_request as  $value) {
                    $array_response [] = $this->castPMTeamRequest($value);
                }
                return ResponseApi::acceptedResponseApi($array_response,"success",201);

            }else{
                return ResponseApi::notFoundResponse(['message'=>"Empty Requests"],"Empty",200);

            }
        }catch(\Exception $e1){
            return $e1;
              return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }

    }

    
    public function ChangePMTeamRequestStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'team_request_status_id' => 'string|exists:p_m_team_request_statuses,id',
                'pm_team_request_id' => 'required|string|exists:p_m_team_requests,id',
            ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            
            DB::beginTransaction();
            $perm = UserPermissionGroup::where('users_id',Auth::guard('user_api')->user()->id)->where('permissions_id','23')->first();
            if(!empty($perm->id) ||Auth::guard('user_api')->user()->sub_departments_id_fun->departments_id==1)
            {
                $pm_request_update = PMTeamRequest::where('id',$request->pm_team_request_id)->first();
                $pm_request_update2 = PMTeamRequest::where('id',$request->pm_team_request_id)->first();

            }else{
                $pm_request_update = PMTeamRequest::where('id',$request->pm_team_request_id)->where('manager_approve_id',Auth::guard('user_api')->user()->id)->first();
                $pm_request_update2 = PMTeamRequest::where('id',$request->pm_team_request_id)->where('manager_approve_id',Auth::guard('user_api')->user()->id)->first();

            }
            if(empty($pm_request_update->id)){
                return ResponseApi::badMethodErrorResponse(["message"=>"you are not assgin as manager on this request to close it"],"Validator Errors",400);

            }else{
                $pm_request_update->update([
                
                    'team_request_status_id'=>$request->team_request_status_id,
                
                ]);
    
            }
            
            DB::commit();

            $users = User::whereHas('sub_departments_id_fun',function($q){
                $q->where('departments_id',1);
            })->get();
            foreach ($users as $value) {
                $manager =  PMTeamRequest::where('manager_approve_id',$value->id)
                ->where('team_request_status_id',1)
                ->get()->count();
                try{
                    $msg = array(
                        'project_manager_reports'=>$manager
                    );
                    MessageController::updatedatafirebase($request->manager_approve_id,$msg);
                }catch(\Exception $e){}
            }
            
            try{
                $user_details = User::where('id',$pm_request_update2->user_creator_id)->first();
                $this->ApprovalSendNotification(Auth::guard('user_api')->user(),$user_details,$pm_request_update2);
            }catch(\Exception $e){
            }

            $manager =  PMTeamRequest::where('user_creator_id',$pm_request_update2->user_creator_id)
            ->where('team_request_status_id',1)
            ->get()->count();
            try{
                $msg = array(
                    'project_manager_reports'=>$manager
                );
                MessageController::updatedatafirebase($pm_request_update2->user_creator_id,$msg);
            }catch(\Exception $e){}




          return ResponseApi::acceptedResponseApi(["message"=>"Changed Successfully"],"success",201);
             
        }catch(\Exception $e1){
            return $e1;
              try{
                DB::rollBack();
              }catch(\Exception $e){
                return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
              }
              return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
   

}
