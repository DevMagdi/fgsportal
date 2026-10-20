<?php

 namespace App\Http\Controllers\Project\Tools;

use App\Http\Controllers\Controller;
  use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
 
 use App\Models\ProjectStructure;
 
class ProjectStructureController extends Controller
{
    public function DeleteProjectStructure(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'project_structure_id'=>'required|numeric',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $projectStructure=  ProjectStructure::where('id',$request->project_structure_id)->first();

          if(!empty($projectStructure->id)){

            $projectStructure->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Project Structure not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateProjectStructure(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'project_structure_name' => 'required|string|unique:project_structures',
                'token'=>'required|string',
                'project_structure_id'=>'required|numeric',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $projectStructure=  ProjectStructure::where('id',$request->project_structure_id)->first();

          if(!empty($projectStructure->id)){

            $projectStructure->update([
                'project_structure_name' =>$request->project_structure_name,
            ]);

            return ResponseApi::acceptedResponseApi($projectStructure,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Project Structure not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateProjectStructure(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'project_structure_name' => 'required|string|unique:project_structures',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $projectStructure=  ProjectStructure::create([

            'project_structure_name' =>$request->project_structure_name,
           ]);
         
        
          return ResponseApi::acceptedResponseApi($projectStructure,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllProjectStructure(){
        try{
          $projectStructure = ProjectStructure::all();
          if(!empty($projectStructure[0]->id)){
            foreach($projectStructure as $dep){
            $array_reponse[] = [ 
                'project_structure_name' =>$dep->project_structure_name,
                'key'=>$dep->id

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Project Structure"],"Empty",200);

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
     * @param  \App\Models\ProjectStructure  $projectStructure
     * @return \Illuminate\Http\Response
     */
    public function show(ProjectStructure $projectStructure)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProjectStructure  $projectStructure
     * @return \Illuminate\Http\Response
     */
    public function edit(ProjectStructure $projectStructure)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ProjectStructure  $projectStructure
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ProjectStructure $projectStructure)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProjectStructure  $projectStructure
     * @return \Illuminate\Http\Response
     */
    public function destroy(ProjectStructure $projectStructure)
    {
        //
    }
}
