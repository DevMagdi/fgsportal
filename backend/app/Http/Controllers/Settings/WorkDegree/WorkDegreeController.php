<?php


namespace App\Http\Controllers\Settings\WorkDegree;
use App\Models\WorkDegree;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
class WorkDegreeController extends Controller
{
    public function DeleteWorkDegree(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'work_degree_id'=>'required|numeric|exists:work_degrees,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $work=  WorkDegree::where('id',$request->work_degree_id)->first();

          if(!empty($work->id)){

            $work->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"WorkDegree not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateWorkDegreeName(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'work_degree_name' => 'required|string|unique:work_degrees',
                'token'=>'required|string',
                'work_degree_id'=>'required|numeric|exists:work_degrees,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $work=  WorkDegree::where('id',$request->work_degree_id)->first();

          if(!empty($work->id)){

            $work->update([
                'work_degree_name' =>$request->work_degree_name,
            ]);

            return ResponseApi::acceptedResponseApi($work,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"WorkDegree not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateWorkDegree(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'work_degree_name' => 'required|string|unique:work_degrees',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $work=  WorkDegree::create([

            'work_degree_name' =>$request->work_degree_name,
           ]);
         
        
          return ResponseApi::acceptedResponseApi($work,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllWorkDegree(){
        try{
          $work = WorkDegree::all();
          if(!empty($work[0]->id)){
            foreach($work as $dep){
            $array_reponse[] = [ 
                'work_degree_name' =>$dep->work_degree_name,
                'id'=>$dep->id.''

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Work Degree "],"Empty",200);

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
     * @param  \App\Models\WorkDegree  $workDegree
     * @return \Illuminate\Http\Response
     */
    public function show(WorkDegree $workDegree)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\WorkDegree  $workDegree
     * @return \Illuminate\Http\Response
     */
    public function edit(WorkDegree $workDegree)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\WorkDegree  $workDegree
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, WorkDegree $workDegree)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\WorkDegree  $workDegree
     * @return \Illuminate\Http\Response
     */
    public function destroy(WorkDegree $workDegree)
    {
        //
    }
}
