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
 use Illuminate\Support\Facades\Storage;
use File;
use App\Models\JobTitle;
use App\Models\JobSkill;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\HRModule\CV\RecruitmentRequestCvController;
use App\Models\RecruitmentRequestCv;
 use App\Models\HiringRequestCVHistory;

class HiringRequestController extends Controller
{
    public function ParseHiringRequest(HiringRequest $dep){  
        $job_titles =[];
        $cvs = [];
        $jobTitleIdString = $dep->job_title_id;
                   
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
       if(!empty($dep->job_skills_id)){
           $jobSkillIdString = $dep->job_skills_id;
           try{
               $job_skill_ID = json_decode($jobSkillIdString, true);
           }catch(\Exception $e){
    
               $job_skill_ID =  $dep->job_skills_id;
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


       $RequestHistoryarr =[];
       $RequestHistory = HiringRequestHistory::where('hiring_request_id',$dep->id)->get();
    
       foreach ($RequestHistory as $key) {
            $RequestHistoryarr[] =[
                
                'hiring_request_status_id'=>$key->hiring_request_status_id,
                'hiring_request_status_name'=>!empty($key->hiring_request_status_id_fun)?$key->hiring_request_status_id_fun->hiring_request_status:null,
                'user_creator_id'=>!empty($key->user_creator_id)?$key->user_creator_id:null,
                'user_creator_name'=>!empty($key->user_creator_id_fun)?$key->user_creator_id_fun->username:null,
                'note'=>$key->note,
            ];
       }


       //get all cvs 
       $all_CVs = HiringRequestCV::where('hiring_request_id',$dep->id)->get();
       foreach ($all_CVs as $key ) {
        $final_interview_phase_id = !empty($key->interview_phase_id)?$key->interview_phase_id:null;
            $final_interview_phase_name = !empty($key->interview_phase_id_fun)?$key->interview_phase_id_fun->interview_phase:null;
            $cv = RecruitmentRequestCv::where('id',$key->recruitment_request_cv_id)->first();
           $cvs []= [
            'user_creator_id'=>!empty($key->user_creator_id)?$key->user_creator_id:null,
            'user_creator_name'=>!empty($key->user_creator_id_fun)?$key->user_creator_id_fun->username:null,
            'hiring_request_cv_status_id'=>$key->hiring_request_cv_status_id,
            'hiring_request_cv_status_name'=>!empty($key->hiring_request_cv_status_id_fun)?$key->hiring_request_cv_status_id_fun->hiring_request_cv_status:null,
             'note'=>$key->note,
             'interview_phase_id'=>$final_interview_phase_id,
             'interview_phase_name'=>$final_interview_phase_name,
            "cv_info"=>   RecruitmentRequestCvController::ParseRecruitmentRequest($cv),
           ];
       }
       $array_reponse = [ 
           'id'=>$dep->id."",
           'hiring_request_status_id'=>$dep->hiring_request_status_id,
           'hiring_request_status_name'=>!empty($dep->hiring_request_status_id_fun)?$dep->hiring_request_status_id_fun->hiring_request_status:null,
           'user_creator_id'=>!empty($dep->user_creator_id)?$dep->user_creator_id:null,
           'user_creator_name'=>!empty($dep->user_creator_id_fun)?$dep->user_creator_id_fun->username:null,
           'last_action_id'=>!empty($dep->last_action_id)?$dep->last_action_id:null,
           'last_action_name'=>!empty($dep->last_action_id_fun)?$dep->last_action_id_fun->username:null,
           'user_manager_id'=>!empty($dep->user_manager_id)?$dep->user_manager_id:null,
           'user_manager_name'=>!empty($dep->user_manager_id_fun)?$dep->user_manager_id_fun->username:null,
            'job_title_id'=> $job_titles,
            'note'=>$dep->note,
            'title'=>$dep->title,
             'Experience'=>$dep->experience,
             'createdAt'=>$dep->created_at,
            'updatedAt'=>$dep->updated_at,
            'job_skills_id'=>$job_skills,
            'hiring_request_history'=> $RequestHistoryarr,
            'CVs'=>$cvs,
   
       ];
       return $array_reponse;
   }
  
    public function DeleteHiringRequest(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'id'=>'required|exists:hiring_requests,id',
                ]);

            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

            $deleteRequest = HiringRequest::where('id',$request->id)->first();
 
            $RequestHistory = HiringRequestHistory::where('hiring_request_id',$request->id)->get();
            foreach ($RequestHistory as $dep) {
                $dep->delete();
            }
            $cvRequestDelete = HiringRequestCV::where('hiring_request_id',$request->id)->get();
            foreach ($cvRequestDelete as $dep) {
                $dep->delete();
            }


            $deleteRequest->delete();
          return ResponseApi::acceptedResponseApi($deleteRequest,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
 
    public function CreateHiringRequest(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'hiring_request_status_id'=>'exists:hiring_request_statuses,id',
            ]);
 
            if(Auth::guard('user_api')->user()->sub_departments_id_fun->departments_id!=1){
                $validator = Validator::make($request->all(), [
                  'user_manager_id'=>'required|exists:users,id',
                ]);
                 
            }
          
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            if($request->has('job_title_id')){
                // Get the job_title_id from the request
               $jobTitleIdString = $request->input('job_title_id');
               
               // Decode the JSON string to an array
               $jobTitleIds = json_decode($jobTitleIdString, true);

               foreach ($jobTitleIds as $job_title_id) {
                   $check_existance =JobTitle::where('id',$job_title_id)->first();
                   if(empty($check_existance->id)){
                       return ResponseApi::badMethodErrorResponse(['message'=>"There is no Job Title for ID ".$job_title_id],"Validator Errors",400);
                   }
                               
               }
              
           }else{
               return ResponseApi::badMethodErrorResponse(['message'=>"Job Title ID is Required"],"Validator Errors",400);

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
           }else{
               return ResponseApi::badMethodErrorResponse(['message'=>"Job Skills ID is Required"],"Validator Errors",400);

           }

          $reportStatus=  HiringRequest::create([
            'hiring_request_status_id'=>$request->has('hiring_request_status_id')?$request->hiring_request_status_id : ($request->has('user_manager_id')?2: 1),
            'user_creator_id'=>Auth::guard('user_api')->user()->id,
            'last_action_id'=>Auth::guard('user_api')->user()->id,
            'user_manager_id'=>$request->has('user_manager_id')?$request->user_manager_id : Auth::guard('user_api')->user()->id,
            'job_skills_id'=>$request->job_skills_id,
            'job_title_id'=>$request->job_title_id,
            'Experience'=>$request->Experience,
            'note'=>$request->note,
            'title'=>$request->title
            ]);
         
            $reportStatus = $this->ParseHiringRequest($reportStatus);
          return ResponseApi::acceptedResponseApi($reportStatus,"success",201);

             
        }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateHiringRequest(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'id'=>'required|exists:hiring_requests,id',

            ]);

             
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

            if($request->has('job_title_id')){
                // Get the job_title_id from the request
               $jobTitleIdString = $request->input('job_title_id');
               
               // Decode the JSON string to an array
               $jobTitleIds = json_decode($jobTitleIdString, true);

               foreach ($jobTitleIds as $job_title_id) {
                   $check_existance =JobTitle::where('id',$job_title_id)->first();
                   if(empty($check_existance->id)){
                       return ResponseApi::badMethodErrorResponse(['message'=>"There is no Job Title for ID ".$job_title_id],"Validator Errors",400);
                   }
                               
               }
              
           }else{
               return ResponseApi::badMethodErrorResponse(['message'=>"Job Title ID is Required"],"Validator Errors",400);

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
           }else{
               return ResponseApi::badMethodErrorResponse(['message'=>"Job Skills ID is Required"],"Validator Errors",400);

           }
        $old_data = HiringRequest::where('id',$request->id)->first();
           
          $reportStatus=  $old_data->update([
            'hiring_request_status_id'=>$request->has('hiring_request_status_id')?$request->hiring_request_status_id :$old_data->hiring_request_status_id,
             'last_action_id'=>Auth::guard('user_api')->user()->id,
            'user_manager_id'=>$request->has('user_manager_id')?$request->user_manager_id :$old_data->user_manager_id,
            'job_skills_id'=>$request->has('job_skills_id')?$request->job_skills_id:$old_data->job_skills_id,
            'job_title_id'=>$request->has('job_title_id')?$request->job_title_id:$old_data->job_title_id,
            'Experience'=>$request->has('Experience')?$request->Experience:$old_data->Experience,
            'note'=>$request->has('note')?$request->note:$old_data->note,
            'title'=>$request->has('title')?$request->title:$old_data->title,
 
            ]);
            $reportStatus = HiringRequest::where('id',$request->id)->first();

            $reportStatus = $this->ParseHiringRequest($reportStatus);

        
          return ResponseApi::acceptedResponseApi($reportStatus,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }



    public function UpdateHiringRequestStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'id'=>'required|exists:hiring_requests,id',
                'hiring_request_status_id'=>'required|exists:hiring_request_statuses,id',

            ]);

            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            if($request->hiring_request_status_id ==3 && (!$request->has('note')||empty($request->note))){
                return ResponseApi::badMethodErrorResponse(["message"=>"Please add Rejection Reason "],"Validator Errors",400);

            }

            $reportStatus = HiringRequest::where('id',$request->id)->first();
            if(!empty($reportStatus->id)){
                $RequestHistory = HiringRequestHistory::create([
                    'hiring_request_id'=>$reportStatus->id,
                    'hiring_request_status_id'=>$reportStatus->hiring_request_status_id,
                    'user_creator_id'=>!empty($request->last_action_id)?$request->last_action_id: $reportStatus->user_creator_id,
                    'note'=>$reportStatus->note,
                     
                ]);
                $reportStatus->update([
                    'hiring_request_status_id'=>$request->hiring_request_status_id,
                    'note'=>$request->note,
                    'user_manager_id'=>!empty($request->user_manager_id)?$request->user_manager_id: $reportStatus->user_manager_id,
                    'last_action_id'=>Auth::guard('user_api')->user()->id
                ]);
            } 

            $reportStatus = HiringRequest::where('id',$request->id)->first();
            $reportStatus = $this->ParseHiringRequest($reportStatus);

          return ResponseApi::acceptedResponseApi($reportStatus,"success",201);

             
        }catch(\Exception $e){
            return $e;
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetHiringProcessWithStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'hiring_request_status_id'=>'required|exists:hiring_request_statuses,id',

            ]);

            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

            $reportStatus = HiringRequest::where('hiring_request_status_id',$request->hiring_request_status_id)->get();
            
            if(!empty($reportStatus[0]->id)){
                $array_response = [];
                foreach ($reportStatus as $dep) {
                    $array_response[] = $this->ParseHiringRequest($dep);
                }
                
            } else{
                return ResponseApi::acceptedResponseApi(['message'=>"Empty Request"],"Empty",200);

            }


          return ResponseApi::acceptedResponseApi($array_response,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

    public function GetMyPendingHiringRequest(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
            ]);

            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

            $reportStatus = HiringRequest::where('user_manager_id',Auth::guard('user_api')->user()->id)
            ->where('hiring_request_status_id',1)->get();
            
            if(!empty($reportStatus[0]->id)){
                $array_response = [];
                foreach ($reportStatus as $dep) {
                    $array_response[] = $this->ParseHiringRequest($dep);
                }
                
            } else{
                return ResponseApi::acceptedResponseApi(['message'=>"Empty Request"],"Empty",200);
            }
          return ResponseApi::acceptedResponseApi($array_response,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

    
    public function SubmitHiringRequest(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'id'=>'required|exists:hiring_requests,id',
 
            ]);

            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

            if($request->has('cv_list_id')){
     
                $CVListString = $request->input('cv_list_id');
                $cv_List = json_decode($CVListString, true);
 
                foreach ($cv_List as $value) {
                    $check_existance =RecruitmentRequestCv::where('id',$value)->first();
                    if(empty($check_existance->id)){
                        return ResponseApi::badMethodErrorResponse(['message'=>"There is no CV for ID ".$value],"Validator Errors",400);
                    }
                                
                }
            }else{
                return ResponseApi::badMethodErrorResponse(['message'=>"cv_list_id is Required"],"Validator Errors",400);
 
            }

            foreach ($cv_List as $value) {
                $check_existance = HiringRequestCV::where('hiring_request_id',$request->id)->where( 'recruitment_request_cv_id',$value)->first();
                if(!empty($check_existance->id)){
                    $check_existance2 = HiringRequestCV::where('hiring_request_id',$request->id)
                    ->where( 'recruitment_request_cv_id',$value)
                    ->where('hiring_request_cv_status_id',4)
                    ->where('note',$request->note)
                    ->where('interview_phase_id',1)
                    ->first();
                    if(empty($check_existance2->id)){
                        $RequestHistory = HiringRequestCVHistory::create([
                            'hiring_request_c_v_id'=>$check_existance->id,
                            'hiring_request_cv_status_id'=>$check_existance->hiring_request_cv_status_id,
                            'user_creator_id'=>$check_existance->user_creator_id,
                            'note'=>$check_existance->note,
                            'interview_phase_id'=>$check_existance->interview_phase_id                     
                        ]);
                    }
                    
                    $check_existance->update([
                        'hiring_request_id'=>$request->id,
                        'recruitment_request_cv_id'=>$value,
                        'user_creator_id'=>Auth::guard('user_api')->user()->id,
                        'hiring_request_cv_status_id'=>4,
                        'note'=>$request->note,
                        'interview_phase_id'=>1
                    ]);
                }else{
                    $add_Request =  HiringRequestCV::create([
                        'hiring_request_id'=>$request->id,
                        'recruitment_request_cv_id'=>$value,
                        'user_creator_id'=>Auth::guard('user_api')->user()->id,
                        'hiring_request_cv_status_id'=>4,
                        'note'=>$request->note,
                        'interview_phase_id'=>1
                    ]);
                }
               
            }
            $reportStatus = HiringRequest::where('id',$request->id)->first();
            if(!empty($reportStatus->id)){
                $RequestHistory = HiringRequestHistory::create([
                    'hiring_request_id'=>$reportStatus->id,
                    'hiring_request_status_id'=>$reportStatus->hiring_request_status_id,

                     'user_creator_id'=>!empty($request->last_action_id)?$request->last_action_id: $reportStatus->user_creator_id,

                    'note'=>$reportStatus->note,
                     
                ]);
                $reportStatus->update([
                    'hiring_request_status_id'=>6,
                    'note'=>$request->note,
                    'user_manager_id'=>!empty($request->user_manager_id)?$request->user_manager_id: $reportStatus->user_manager_id,
                    'last_action_id'=>Auth::guard('user_api')->user()->id
                ]);
            } 


            
            $reportStatus = HiringRequest::where('id',$request->id)->first();
            $reportStatus = $this->ParseHiringRequest($reportStatus);

          return ResponseApi::acceptedResponseApi($reportStatus,"success",201);

             
        }catch(\Exception $e){
            return $e;
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function SendBackToHR(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'id'=>'required|exists:hiring_requests,id',
 
            ]);

            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

            if($request->has('cv_list_id')){
     
                $CVListString = $request->input('cv_list_id');
                $cv_List = json_decode($CVListString, true);
 
                foreach ($cv_List as $value) {
                    $check_existance =RecruitmentRequestCv::where('id',$value)->first();
                    if(empty($check_existance->id)){
                        return ResponseApi::badMethodErrorResponse(['message'=>"There is no CV for ID ".$value],"Validator Errors",400);
                    }
                                
                }
            }else{
                return ResponseApi::badMethodErrorResponse(['message'=>"cv_list_id is Required"],"Validator Errors",400);
 
            }

           $all_CVs =  HiringRequestCV::where('hiring_request_id',$request->id)->get();
           $error_array = []; 
           foreach ($all_CVs as $key) {
                if($key->hiring_request_cv_status_id ==1){
                    $error_array[] = 
                    ["Please Assign Correct Status for CV .".(!empty($key->recruitment_request_cv_id_fun)?$key->recruitment_request_cv_id_fun->first_name:null)];
                }
            }
            if(!empty($error_array)){
                return ResponseApi::badMethodErrorResponse($error_array,"Validator Errors",400);

            }



            foreach ($cv_List as $value) {
                $check_existance = HiringRequestCV::where('hiring_request_id',$request->id)->where( 'recruitment_request_cv_id',$value)->first();
                if(!empty($check_existance->id)){
                    $check_existance2 = HiringRequestCV::where('hiring_request_id',$request->id)
                    ->where( 'recruitment_request_cv_id',$value)
                    ->where('hiring_request_cv_status_id',1)
                    ->where('note',$request->note)
                    ->where('interview_phase_id',1)
                    ->first();
                    if(empty($check_existance2->id)){
                        $RequestHistory = HiringRequestCVHistory::create([
                            'hiring_request_c_v_id'=>$check_existance->id,
                            'hiring_request_cv_status_id'=>$check_existance->hiring_request_cv_status_id,
                            'user_creator_id'=>$check_existance->user_creator_id,
                            'note'=>$check_existance->note,
                            'interview_phase_id'=>$check_existance->interview_phase_id                     
                        ]);
                    }
                    
                    $check_existance->update([
                        'hiring_request_id'=>$request->id,
                        'recruitment_request_cv_id'=>$value,
                        'user_creator_id'=>Auth::guard('user_api')->user()->id,
                        'hiring_request_cv_status_id'=>1,
                        'note'=>$request->note,
                        'interview_phase_id'=>1
                    ]);
                }else{
                    $add_Request =  HiringRequestCV::create([
                        'hiring_request_id'=>$request->id,
                        'recruitment_request_cv_id'=>$value,
                        'user_creator_id'=>Auth::guard('user_api')->user()->id,
                        'hiring_request_cv_status_id'=>1,
                        'note'=>$request->note,
                        'interview_phase_id'=>1
                    ]);
                }
               
            }
            $reportStatus = HiringRequest::where('id',$request->id)->first();
            if(!empty($reportStatus->id)){
                $RequestHistory = HiringRequestHistory::create([
                    'hiring_request_id'=>$reportStatus->id,
                    'hiring_request_status_id'=>$reportStatus->hiring_request_status_id,

                     'user_creator_id'=>!empty($request->last_action_id)?$request->last_action_id: $reportStatus->user_creator_id,

                    'note'=>$reportStatus->note,
                     
                ]);
                $reportStatus->update([
                    'hiring_request_status_id'=>5,
                    'note'=>$request->note,
                    'user_manager_id'=>!empty($request->user_manager_id)?$request->user_manager_id: $reportStatus->user_manager_id,
                    'last_action_id'=>Auth::guard('user_api')->user()->id
                ]);
            } 


            
            $reportStatus = HiringRequest::where('id',$request->id)->first();
            $reportStatus = $this->ParseHiringRequest($reportStatus);

          return ResponseApi::acceptedResponseApi($reportStatus,"success",201);

             
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
     * @param  \App\Models\HiringRequest  $hiringRequest
     * @return \Illuminate\Http\Response
     */
    public function show(HiringRequest $hiringRequest)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\HiringRequest  $hiringRequest
     * @return \Illuminate\Http\Response
     */
    public function edit(HiringRequest $hiringRequest)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\HiringRequest  $hiringRequest
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, HiringRequest $hiringRequest)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\HiringRequest  $hiringRequest
     * @return \Illuminate\Http\Response
     */
    public function destroy(HiringRequest $hiringRequest)
    {
        //
    }
}
