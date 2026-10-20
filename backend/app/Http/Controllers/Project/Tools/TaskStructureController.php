<?php

namespace App\Http\Controllers\Project\Tools;

use App\Http\Controllers\Controller;
  use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
 
 use App\Models\TaskStructure;
 

class TaskStructureController extends Controller
{
    public function DeleteTaskStructure(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'task_structure_id'=>'required|numeric|exists:task_structures,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $taskStructure=  TaskStructure::where('id',$request->task_structure_id)->first();

          if(!empty($taskStructure->id)){

            $taskStructure->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Task Structure not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateTaskStructure(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'task_structure_name' => 'required|string|unique:task_structures',
                'token'=>'required|string',
                'task_structure_id'=>'required|numeric|exists:task_structures,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $taskStructure=  TaskStructure::where('id',$request->task_structure_id)->first();

          if(!empty($taskStructure->id)){

            $taskStructure->update([
                'task_structure_name' =>$request->task_structure_name,
            ]);

            return ResponseApi::acceptedResponseApi($taskStructure,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Task Structure not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateTaskStructure(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'task_structure_name' => 'required|string|unique:task_structures',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $taskStructure=  TaskStructure::create([

            'task_structure_name' =>$request->task_structure_name,
           ]);
         
        
          return ResponseApi::acceptedResponseApi($taskStructure,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllTaskStructure(){
        try{
          $taskStructure = TaskStructure::all();
          if(!empty($taskStructure[0]->id)){
            foreach($taskStructure as $dep){
            $array_reponse[] = [ 
                'task_structure_name' =>$dep->task_structure_name,
                'id'=>$dep->id

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Task Structure"],"Empty",200);

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
     * @param  \App\Models\TaskStructure  $taskStructure
     * @return \Illuminate\Http\Response
     */
    public function show(TaskStructure $taskStructure)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\TaskStructure  $taskStructure
     * @return \Illuminate\Http\Response
     */
    public function edit(TaskStructure $taskStructure)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\TaskStructure  $taskStructure
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, TaskStructure $taskStructure)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\TaskStructure  $taskStructure
     * @return \Illuminate\Http\Response
     */
    public function destroy(TaskStructure $taskStructure)
    {
        //
    }
}
