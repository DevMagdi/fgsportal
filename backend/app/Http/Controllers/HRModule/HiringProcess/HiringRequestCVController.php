<?php

namespace App\Http\Controllers\HRModule\HiringProcess;

use App\Http\Controllers\Controller;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\HiringRequestStatus; 
use App\Models\HiringRequestCVsStatus; 
use App\Models\HiringRequest;
use App\Models\HiringRequestHistory;
use App\Models\HiringRequestCV;
use App\Models\HiringRequestCVHistory;
 use Illuminate\Support\Facades\Storage;
use File;
use App\Models\JobTitle;
use App\Models\JobSkill;
use Illuminate\Support\Facades\DB;

use App\Models\RecruitmentRequestCv;
use App\Http\Controllers\HRModule\CV\RecruitmentRequestCvController;


class HiringRequestCVController extends Controller
{
    

    public function ParseHiringRequestCV(HiringRequestCV $dep){  
        $job_titles =[];
        $cvs = [];
        $jobTitleIdString = !empty($dep->recruitment_request_cv_id_fun)?$dep->recruitment_request_cv_id_fun->job_title_id:null;
                   
        // Decode the JSON string to an array
        $jobTitleIds = json_decode($jobTitleIdString, true);
       foreach ($jobTitleIds as  $value) {
           $job_title = JobTitle::where('id',$value)->withTrashed()->first();

           $job_titles[]=[
               'job_title_id'=>$job_title->id,
               'hr_job_title'=>$job_title->hr_job_title,
               'description'=>$job_title->description,
               'job_status'=>$job_title->job_status==1?True:False,
               'deleted'=>empty($job_title->deleted_at)?False:True,
           ];
       }


       $job_skills =[];
       if(!empty($dep->recruitment_request_cv_id_fun->job_skills_id)){
           $jobSkillIdString = $dep->recruitment_request_cv_id_fun->job_skills_id;
           try{
               $job_skill_ID = json_decode($jobSkillIdString, true);
           }catch(\Exception $e){
    
               $job_skill_ID =  $dep->recruitment_request_cv_id_fun->job_skills_id;
           }
          
          
           foreach ($job_skill_ID as  $value2) {
               $job_skill = JobSkill::where('id',$value2)->withTrashed()->first();
               $job_skills[]=[
                   'job_skill_id'=>$job_skill->id,
                   'hr_job_title'=>$job_skill->job_skill,
                   'deleted'=>empty($job_skill->deleted_at)?false:true,
               ];
           }
       }


       $RequestHistoryCVarr =[];
       $RequestHistoryCV = HiringRequestCVHistory::where('hiring_request_c_v_id',$dep->id)->get();
    
       foreach ($RequestHistoryCV as $key) {
        $final_interview_phase_id = !empty($key->interview_phase_id)?$key->interview_phase_id:null;
        $final_interview_phase_name = !empty($key->interview_phase_id_fun)?$key->interview_phase_id_fun->interview_phase:null;
            $RequestHistoryCVarr[] =[
                'hiring_request_cv_status_id'=>$key->hiring_request_cv_status_id,
                'hiring_request_cv_status_name'=>!empty($key->hiring_request_cv_status_id_fun)?$key->hiring_request_cv_status_id_fun->hiring_request_cv_status:null,
                'user_creator_id'=>!empty($key->user_creator_id)?$key->user_creator_id:null,
                'user_creator_name'=>!empty($key->user_creator_id_fun)?$key->user_creator_id_fun->username:null,
                'note'=>$key->note,
                'interview_phase_id'=>$final_interview_phase_id,
                'interview_phase_name'=>$final_interview_phase_name,
            ];
       }


       
       $cv = RecruitmentRequestCv::where('id',$dep->recruitment_request_cv_id)->first();

       $array_reponse = [ 
           'id'=>$dep->id."",
           'hiring_request_id'=>!empty($dep->hiring_request_id)?$dep->hiring_request_id:null,

           'user_creator_id'=>!empty($dep->user_creator_id)?$dep->user_creator_id:null,
           'user_creator_name'=>!empty($dep->user_creator_id_fun)?$dep->user_creator_id_fun->username:null,
           'hiring_request_cv_status_id'=>$dep->hiring_request_cv_status_id,
           'hiring_request_cv_status_name'=>!empty($dep->hiring_request_cv_status_id_fun)?$dep->hiring_request_cv_status_id_fun->hiring_request_cv_status:null,
             'interview_phase_id'=>$final_interview_phase_id,
            'interview_phase_name'=>$final_interview_phase_name,

            'job_title_id'=> $job_titles,
            'note'=>$dep->note,
            'title'=>$dep->title,
 
            'createdAt'=>$dep->created_at,
            'updatedAt'=>$dep->updated_at,
            'job_skills_id'=>$job_skills,
            'hiring_request_cv_history'=> $RequestHistoryCVarr,
            'cv_info'=>RecruitmentRequestCvController::ParseRecruitmentRequest($cv),
   
       ];
       return $array_reponse;
   }


    public function UpdateHiringRequestCVStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'id'=>'required|exists:hiring_request_c_v_s,id',
                'hiring_request_cv_status_id'=>'required|exists:hiring_request_c_vs_statuses,id',
                'interview_phase_id' => 'required|string|exists:interview_phases,id',

            ]);

            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            if($request->hiring_request_cv_status_id ==5 && (!$request->has('note')||empty($request->note))){
                return ResponseApi::badMethodErrorResponse(["message"=>"Please add Rejection Reason "],"Validator Errors",400);

            }

            $reportStatus = HiringRequestCV::where('id',$request->id)->first();
           


            if(!empty($reportStatus->id)){
                $RequestHistory = HiringRequestCVHistory::create([
                    'hiring_request_c_v_id'=>$reportStatus->id,
                    'hiring_request_cv_status_id'=>$reportStatus->hiring_request_cv_status_id,
                    'user_creator_id'=>$reportStatus->user_creator_id,
                    'note'=>$reportStatus->note,
                    'interview_phase_id'=>$reportStatus->interview_phase_id                     
                ]);

                $reportStatus->update([
                    'user_creator_id'=>Auth::guard('user_api')->user()->id,
                    'hiring_request_cv_status_id'=>!empty($request->hiring_request_cv_status_id)?$request->hiring_request_cv_status_id:$reportStatus->hiring_request_cv_status_id,
                    'interview_phase_id'=>!empty($request->interview_phase_id)?$request->interview_phase_id:$reportStatus->interview_phase_id,
                    'note'=>$request->note,
               ]);
            } 

            $reportStatus = HiringRequestCV::where('id',$request->id)->first();
            $reportStatus = $this->ParseHiringRequestCV($reportStatus);
          return ResponseApi::acceptedResponseApi($reportStatus,"success",201);
           
        }catch(\Exception $e){
            return $e;
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetCVHiringHistory(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'id'=>'required|exists:hiring_request_c_v_s,id',
                
            ]);

            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            

            $reportStatus = HiringRequestCV::where('id',$request->id)->first();
           


            if(!empty($reportStatus->id)){
                $reportStatus = $this->ParseHiringRequestCV($reportStatus);
                return ResponseApi::acceptedResponseApi($reportStatus,"success",201);
            }else{
                return ResponseApi::acceptedResponseApi(["message"=>"CV Not Found "],"Not Found ",200);

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
     * @param  \App\Models\HiringRequestCV  $hiringRequestCV
     * @return \Illuminate\Http\Response
     */
    public function show(HiringRequestCV $hiringRequestCV)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\HiringRequestCV  $hiringRequestCV
     * @return \Illuminate\Http\Response
     */
    public function edit(HiringRequestCV $hiringRequestCV)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\HiringRequestCV  $hiringRequestCV
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, HiringRequestCV $hiringRequestCV)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\HiringRequestCV  $hiringRequestCV
     * @return \Illuminate\Http\Response
     */
    public function destroy(HiringRequestCV $hiringRequestCV)
    {
        //
    }
}
