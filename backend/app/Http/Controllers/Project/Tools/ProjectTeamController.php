<?php

 
 namespace App\Http\Controllers\Project\Tools;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use App\Models\ProjectTeam;
use Illuminate\Support\Facades\Auth;
use App\Models\ProcessTeam;
use App\Models\Process;

class ProjectTeamController extends Controller
{
    public function DeleteProjectTeamMember(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'project_team_id'=>'required|numeric|exists:project_teams,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $projectTeam=  ProjectTeam::where('id',$request->project_team_id)->first();
            $processTeam = ProcessTeam::where('project_team_id',$projectTeam->id)->first();
            if(!empty($processTeam->id)){
                $processTeam->delete();
  
            }
          if(!empty($projectTeam->id)){

            $projectTeam->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Project Team Row not found"],"Validator Errors",400);

          }
         
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateProjectTeamMember(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'project_id' => 'required|numeric|exists:projects,id',
                'token'=>'required|string',
                'project_team'=>'required|array'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            $project_team_array = json_decode($request->project_team);
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
                
                $existance = ProjectTeam::where('user_team_id',$team['user_team_id'])
                ->where('project_id',$request->project_id)->first();
 
                if(!empty($existance->id)){
                    
                   $existance->update([
                        'user_creator_id' =>Auth::guard('user_api')->user()->id,
                        'user_team_id'=>$team['user_team_id'],
                         'project_structure_id'=>$team['project_structure_id'],
                    ]);
                }
            }
             
             
                
              return ResponseApi::acceptedResponseApi(["message"=>'updated'],"success",201);
    
             
        }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateProjectTeam(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'project_id' => 'required|numeric|exists:projects,id',
                'token'=>'required|string',
                'project_team'=>'required|array'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
 
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
            $count = ProjectTeam::where('project_id',$request->project_id)->delete();
           $procssess = Process::where('project_id',$request->project_id)->get();
           foreach($procssess as $proc){
            $processTeam = ProcessTeam::where('process_id',$proc->id)->delete();
           }
       //     return ResponseApi::acceptedResponseApi($count,"success",201);

            foreach($project_team_array as $team){
                $existance = ProjectTeam::where('user_team_id',$team['user_team_id'])->where('project_structure_id',$team['project_structure_id'])
                ->where('project_id',$request->project_id)->withTrashed()->first();
             
                if(empty($existance->delete_at)&&empty($existance->id)){
                   $inserted[] = ProjectTeam::create([
                        'user_creator_id' =>Auth::guard('user_api')->user()->id,
                        'user_team_id'=>$team['user_team_id'],
                        'project_id'=>$request->project_id,
                        'project_structure_id'=>$team['project_structure_id'],
                    ]);
                }else{
                    $inserted[]= $existance->restore();
                    $existance = ProjectTeam::where('user_team_id',$team['user_team_id'])->where('project_structure_id',$team['project_structure_id'])
                    ->where('project_id',$request->project_id)->withTrashed()->first();    
                    $processTeam = ProcessTeam::where('project_team_id',$existance->id)->restore();
                   
                }
            }
            if(empty($inserted)){
                 return ResponseApi::badMethodErrorResponse(["message"=>"Dublicated Data"],"Validator Errors",400);

            }
             
                
              return ResponseApi::acceptedResponseApi(["message"=>"success"],"success",201);
    
       
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetProjectTeam(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'project_id' => 'required|numeric|exists:projects,id',
                'token'=>'required|string',
             ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
          $projectTeam = ProjectTeam::where('project_id',$request->project_id)->get();
           if(!empty($projectTeam[0]->id)){
        foreach($projectTeam as $dep){
          
                $array_reponse[] = [ 
                    'id'=>$dep->id.'',
                    'user_team_id'=>$dep->user_team_id.'',
                    'user_team_name' =>$dep->user_team_id_fun->username,
                    'user_creator_name'=>!empty($dep->user_creator_id_fun)?$dep->user_creator_id_fun->username:null,
                    'user_creator_id'=>!empty($dep->user_creator_id)?$dep->user_creator_id.'':null,
                    'project_structure_name'=>$dep->project_structure_id_fun->project_structure_name,
                    'project_structure_id'=>$dep->project_structure_id.'',
                ];
           
           
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Project Team"],"Empty",200);

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
     * @param  \App\Models\ProjectTeam  $projectTeam
     * @return \Illuminate\Http\Response
     */
    public function show(ProjectTeam $projectTeam)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProjectTeam  $projectTeam
     * @return \Illuminate\Http\Response
     */
    public function edit(ProjectTeam $projectTeam)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ProjectTeam  $projectTeam
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ProjectTeam $projectTeam)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProjectTeam  $projectTeam
     * @return \Illuminate\Http\Response
     */
    public function destroy(ProjectTeam $projectTeam)
    {
        //
    }
}
