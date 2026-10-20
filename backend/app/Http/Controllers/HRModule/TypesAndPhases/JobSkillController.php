<?php

namespace App\Http\Controllers\HRModule\TypesAndPhases;


use App\Models\JobSkill;
use App\Http\Controllers\Controller;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use Illuminate\Http\Request;
   
 
class JobSkillController extends Controller
{

    


    public function DeleteJobSkill(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'id'=>'required|numeric|exists:job_skills,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $skill=  JobSkill::where('id',$request->id)->first();

          if(!empty($skill->id)){

            $skill->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Job Skill not found"],"Validator Errors",400);

          }
         
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateJobSkill(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'job_skill' => 'required|string|unique:job_skills',
                'token'=>'required|string',
                'id'=>'required|numeric|exists:job_skills,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $skill=  JobSkill::where('id',$request->id)->first();

          if(!empty($skill->id)){

            $skill->update([
                'job_skill' =>$request->job_skill,
            ]);

            return ResponseApi::acceptedResponseApi($skill,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Job Skill not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateJobSkill(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'job_skill' => 'required|string',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            $skill = JobSkill::where('job_skill',$request->job_skill)->withTrashed()->first();
            if(!empty($skill->id)){
                $skill->restore();
            }else{
                        
                $skill=  JobSkill::create([

                    'job_skill' =>$request->job_skill,
                ]);

            }

         
        
          return ResponseApi::acceptedResponseApi($skill,"success",201);

             
        }catch(\Exception $e){
            return $e;
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllJobSkill(Request $request){
        try{
           $validator = Validator::make($request->all(), [
                    'token'=>'required|string'
                ]);
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
    
            
          $skill = JobSkill::all();
          if(!empty($skill[0]->id)){
            foreach($skill as $dep){
            $array_reponse[] = [ 
                'job_skill' =>$dep->job_skill,
                'id'=>$dep->id.''

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Job Skill"],"Empty",200);

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
     * @param  \App\Models\JobSkill  $jobSkill
     * @return \Illuminate\Http\Response
     */
    public function show(JobSkill $jobSkill)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\JobSkill  $jobSkill
     * @return \Illuminate\Http\Response
     */
    public function edit(JobSkill $jobSkill)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\JobSkill  $jobSkill
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, JobSkill $jobSkill)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\JobSkill  $jobSkill
     * @return \Illuminate\Http\Response
     */
    public function destroy(JobSkill $jobSkill)
    {
        //
    }
}
