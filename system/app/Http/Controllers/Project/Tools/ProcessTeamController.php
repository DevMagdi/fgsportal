<?php

 
namespace App\Http\Controllers\Project\Tools;
use App\Models\ProcessTeam;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
 use Illuminate\Support\Facades\Auth;
class ProcessTeamController extends Controller
{
    public function DeleteProcessTeamMember(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'process_team_id'=>'required|numeric|exists:process_teams,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $processTeam=  ProcessTeam::where('id',$request->process_team_id)->first();

          if(!empty($processTeam->id)){

            $processTeam->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Process Team Row not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
  
    

    public function CreateProcessTeam(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'process_id' => 'required|numeric|exists:processes,id',
                'token'=>'required|string',
                'project_team'=>'required|array'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
 
              $project_team_array = $request->project_team;
              foreach($project_team_array as $team){
                $validator = Validator::make((array)$team, [
                      'project_team_id'=>'required|numeric|exists:project_teams,id'
                ]);
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
            }
            $count = ProcessTeam::where('process_id',$request->process_id)->delete();
           
       //     return ResponseApi::acceptedResponseApi($count,"success",201);

            foreach($project_team_array as $team){
                $existance = ProcessTeam::where('project_team_id',$team['project_team_id'])
                ->where('process_id',$request->process_id)->withTrashed()->first();
                if(empty($existance->delete_at)&&empty($existance->id)){
                    
                   $inserted[] = ProcessTeam::create([
                        'user_creator_id' =>Auth::guard('user_api')->user()->id,
                        'project_team_id'=>$team['project_team_id'],
                        'process_id'=>$request->process_id,
                     ]);
                }else{
                    $inserted[]= $existance->restore();
                   
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
    public function GetProcessTeam(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'process_id' => 'required|numeric|exists:processes,id',
                'token'=>'required|string',
             ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
          $processTeam = ProcessTeam::where('process_id',$request->process_id)->get();
           if(!empty($processTeam[0]->id)){
        foreach($processTeam as $dep){
            $array_reponse[] = [ 
                'id'=>$dep->id,
                'project_team_id'=>(string)$dep->project_team_id.'',
                'user_team_id'=>$dep->project_team_id_fun->user_team_id.'',
                'user_team_name' =>$dep->project_team_id_fun->user_team_id_fun->username,
                'user_creator_name'=>$dep->project_team_id_fun->user_creator_id_fun->username,
                'user_creator_id'=>$dep->user_creator_id.'',
                'project_structure_name'=>$dep->project_team_id_fun->project_structure_id_fun->project_structure_name,
                'project_structure_id'=>$dep->project_team_id_fun->project_structure_id.'',

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Process Team"],"Empty",200);

          }
             
        }catch(\Exception $e){
          //  return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
          return ResponseApi::badMethodErrorResponse($e,"server Error",500);

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
     * @param  \App\Models\ProcessTeam  $processTeam
     * @return \Illuminate\Http\Response
     */
    public function show(ProcessTeam $processTeam)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProcessTeam  $processTeam
     * @return \Illuminate\Http\Response
     */
    public function edit(ProcessTeam $processTeam)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ProcessTeam  $processTeam
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ProcessTeam $processTeam)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProcessTeam  $processTeam
     * @return \Illuminate\Http\Response
     */
    public function destroy(ProcessTeam $processTeam)
    {
        //
    }
}
