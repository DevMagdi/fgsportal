<?php

namespace App\Http\Controllers\HRModule\TypesAndPhases;

use App\Http\Controllers\Controller;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Str;
use App\Models\JobTitle;
use Illuminate\Http\Request;
use App\Models\JobSkill;

class JobTitleController extends Controller
{

    public function ParseJobTitle(JobTitle $dep){  
        $job_skills =[];
        if(!empty($dep->job_skills_id)){
                     
            foreach ($dep->job_skills_id as  $value) {
                $job_skill = JobSkill::where('id',$value)->withTrashed()->first();
                if(!empty($job_skill->id)){
                    $job_skills[]=[
                        'job_skill_id'=>$job_skill->id,
                        'hr_job_title'=>$job_skill->job_skill,
                        'deleted'=>empty($job_skill->deleted_at)?false:true,
                    ];
                }
               
            }


        }
        
       $array_reponse = [ 
        'hr_job_title' =>$dep->hr_job_title,
        'description'=>$dep->description,
        'job_status'=>$dep->job_status==1?True:False,
        'id'=>$dep->id,
        'job_skills_id'=>$job_skills
       ];
       return $array_reponse;
   }
    public function DeleteJobTitle(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'id'=>'required|numeric|exists:job_titles,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus=  JobTitle::where('id',$request->id)->first();

          if(!empty($reportStatus->id)){

            $reportStatus->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Job Title not found"],"Validator Errors",400);

          }
         
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateJobTitle(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'hr_job_title' => 'string|unique:job_titles',
                'token'=>'required|string',
                'id'=>'required|numeric|exists:job_titles,id',
                'job_skills_id' => 'string',

            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

            $reportStatus=  JobTitle::where('id',$request->id)->first();
            $reportStatus2=  JobTitle::where('id',$request->id)->first();

          if(!empty($reportStatus->id)){
            if($request->has('job_skills_id')){
          
                $jobSkillIdString = $request->input('job_skills_id');
                $jobSkillIds = json_decode($jobSkillIdString, true);

                foreach ($jobSkillIds as $job_skill_id) {
                    $check_existance =JobSkill::where('id',$job_skill_id)->first();
                    if(empty($check_existance->id)){
                        return ResponseApi::badMethodErrorResponse(['message'=>"There is no Job SKILL for ID ".$job_skill_id],"Validator Errors",400);
                    }
                                
                }


                $reportStatus->update([
                    'description'=>!empty($request->description)?$request->description:$reportStatus2->description,
                    'job_status'=>($request->has('job_status'))?($request->job_status==1?$request->job_status:0):1,
                    'hr_job_title'=>!empty($request->hr_job_title)?$request->hr_job_title:$reportStatus2->hr_job_title,
                    'job_skills_id'=>$jobSkillIds
                 ]);
            }else{
                $reportStatus->update([
                    'description'=>!empty($request->description)?$request->description:$reportStatus2->description,
                    'job_status'=>($request->has('job_status'))?($request->job_status==1?$request->job_status:0):1,
                    'hr_job_title'=>!empty($request->hr_job_title)?$request->hr_job_title:$reportStatus2->hr_job_title,
    
                 ]);
            }
           
             
             $reportStatus= $this->ParseJobTitle($reportStatus);

             return ResponseApi::acceptedResponseApi($reportStatus,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Job Title not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return $e;
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateJobTitle(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'hr_job_title' => 'required|string|unique:job_titles',
                'description'=>'string',
                'job_status'=>'numeric',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
                if($request->has('job_skills_id')){
              
                    $jobSkillIdString = $request->input('job_skills_id');
                    $jobSkillIds = json_decode($jobSkillIdString, true);
                    foreach ($jobSkillIds as $job_skill_id) {
                        $check_existance =JobSkill::where('id',$job_skill_id)->first();
                        if(empty($check_existance->id)){
                            return ResponseApi::badMethodErrorResponse(['message'=>"There is no Job SKILL for ID ".$job_skill_id],"Validator Errors",400);
                        }
                                    
                    }

                    $reportStatus=  JobTitle::create([
                        'description'=>$request->description,
                        'job_status'=>($request->has('job_status'))?($request->job_status==1?$request->job_status:0):1,
                        'hr_job_title' =>$request->hr_job_title,
                        'job_skills_id'=>$jobSkillIds
                     ]);
                }else{

                    $reportStatus=  JobTitle::create([
                        'description'=>$request->description,
                        'job_status'=>($request->has('job_status'))?($request->job_status==1?$request->job_status:0):1,
                        'hr_job_title' =>$request->hr_job_title,
                    ]);

                }
           $reportStatus= $this->ParseJobTitle($reportStatus);
       
          return ResponseApi::acceptedResponseApi($reportStatus,"success",201);

             
        }catch(\Exception $e){
            return $e;
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllJobTitle(Request $request){
        try{
           $validator = Validator::make($request->all(), [
                    'token'=>'required|string'
                ]);
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
    
            
          $reportStatus = JobTitle::all();
          if(!empty($reportStatus[0]->id)){
            foreach($reportStatus as $dep){
            $array_reponse[] = $this->ParseJobTitle($dep);
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Job title"],"Empty",200);

          }
             
        }catch(\Exception $e){
            return $e;
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
     * @param  \App\Models\JobTitle  $jobTitle
     * @return \Illuminate\Http\Response
     */
    public function show(JobTitle $jobTitle)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\JobTitle  $jobTitle
     * @return \Illuminate\Http\Response
     */
    public function edit(JobTitle $jobTitle)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\JobTitle  $jobTitle
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, JobTitle $jobTitle)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\JobTitle  $jobTitle
     * @return \Illuminate\Http\Response
     */
    public function destroy(JobTitle $jobTitle)
    {
        //
    }
}
