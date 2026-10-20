<?php

namespace App\Http\Controllers\HRModule\OnBoarding;

use App\Http\Controllers\Controller;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Str;
use App\Models\GlobalStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

use App\Models\RequestOnboarding;
use App\Models\RecruitmentRequestHistory;
use App\Models\RecruitmentRequestCv;
class RequestOnboardingController extends Controller
{

    
    public function SmallCastOnboardingRequest(RequestOnboarding $value){
        $dep= RecruitmentRequestCv::where('id',$value->recruitment_request_cv_id)->first();
        $request_onboarding  =  [
            'id'=>$value->id.'',
            'user_creator_name'=>!empty($value->user_creator_id_fun)?$value->user_creator_id_fun->username:null,
            'user_creator_id'=>!empty($value->user_creator_id)?$value->user_creator_id:null,
            'user_manager_name'=>!empty($value->user_manager_id_fun)?$value->user_manager_id_fun->username:null,
            'user_manager_id'=>!empty($value->user_manager_id)?$value->user_manager_id:null,
            'onboarding_requirement_id'=>!empty($value->onboarding_requirement_id)?$value->onboarding_requirement_id:null,
            'onboarding_requirement_type'=>!empty($value->onboarding_requirement_id_fun)?$value->onboarding_requirement_id_fun->onboarding_requirement_type:null,
            'global_status_id'=>!empty($value->global_status_id)?$value->global_status_id:null,
            'global_status_name'=>!empty($value->global_status_id_fun)?$value->global_status_id_fun->hr_global_status:null,
            'comment'=>$value->comment,
            'createdAt'=>$value->created_at,
            'updatedAt'=>$value->updated_at,

            'first_name'=>$dep->first_name,
            'last_name'=>$dep->last_name,
            'phone_number'=>$dep->phone_number,
            'email'=>$dep->email,
            'file_name'=>$dep->file_name,
            'file_path' =>'/Attachments/CV/'.$dep->id.'/CV'.'/'.$dep->file_name,
            'Job_title_id'=>$dep->Job_title_id,
            'Job_title_name'=>!empty($dep->Job_title_id_fun)?$dep->Job_title_id_fun->hr_job_title : null,
            'uploaded_by_id'=>$dep->uploaded_by_id,
            'uploaded_by_name'=>!empty($dep->uploaded_by_id_fun)?$dep->uploaded_by_id_fun->username:null,
            'uploaded_photoURL' =>$dep->uploaded_by_id_fun->photoURL? '/Attachments/User/'.$dep->uploaded_by_id_fun->id.'/profile'.'/'.$dep->uploaded_by_id_fun->photoURL:null,
           
            ];
            return $request_onboarding;
    }
    public function FullCastOnboardingRequest(RequestOnboarding $request){
        
        $interview_history= [];
        $request_onboarding = [] ;
        
        $dep= RecruitmentRequestCv::where('id',$request->recruitment_request_cv_id)->first();
        $request = RequestOnboarding::where('recruitment_request_cv_id',$request->recruitment_request_cv_id)->get();
        $interview_history_table = RecruitmentRequestHistory::where('recruitment_request_cv_id',$dep->id)->get();
        $final_interview_phase_id = null;
        $final_interview_phase_name = null;
        $final_interview_status_id = null;
        $final_interview_status_name = null;

        foreach ($request as  $value) {
            $request_onboarding [] = [
                'id'=>$value->id.'',
            'user_creator_name'=>!empty($value->user_creator_id_fun)?$value->user_creator_id_fun->username:null,
            'user_creator_id'=>!empty($value->user_creator_id)?$value->user_creator_id:null,
            'user_manager_name'=>!empty($value->user_manager_id_fun)?$value->user_manager_id_fun->username:null,
            'user_manager_id'=>!empty($value->user_manager_id)?$value->user_manager_id:null,
            'onboarding_requirement_id'=>!empty($value->onboarding_requirement_id)?$value->onboarding_requirement_id:null,
            'onboarding_requirement_type'=>!empty($value->onboarding_requirement_id_fun)?$value->onboarding_requirement_id_fun->onboarding_requirement_type:null,
            'global_status_id'=>!empty($value->global_status_id)?$value->global_status_id:null,
            'global_status_name'=>!empty($value->global_status_id_fun)?$value->global_status_id_fun->hr_global_status:null,
            'comment'=>$value->comment,
            'createdAt'=>$value->created_at,
            'updatedAt'=>$value->updated_at,

            ];
        }
        
        foreach ($interview_history_table as  $value) {
            $final_interview_phase_id = !empty($value->interview_phase_id)?$value->interview_phase_id:null;
            $final_interview_phase_name = !empty($value->interview_phase_id_fun)?$value->interview_phase_id_fun->interview_phase:null;
            $final_interview_status_id = !empty($value->interview_status_id)?$value->interview_status_id:null;
            $final_interview_status_name = !empty($value->interview_status_id_fun)?$value->interview_status_id_fun->interview_status_name:null;

            $interview_history[] = [
                'id'=>$value->id.'',
                'user_creator_name'=>!empty($value->user_creator_id_fun)?$value->user_creator_id_fun->username:null,
                'user_creator_id'=>!empty($value->user_creator_id)?$value->user_creator_id:null,
                'manager_interview_name'=>!empty($value->manager_interview_id_fun)?$value->manager_interview_id_fun->username:null,
                'manager_interview_id'=>!empty($value->manager_interview_id)?$value->manager_interview_id:null,
                'interview_phase_id'=>$final_interview_phase_id,
                'interview_phase_name'=>$final_interview_phase_name,
                'interview_status_id'=>$final_interview_status_id,
                'interview_status_name'=>$final_interview_status_name,
                'comment'=>$value->comment,
                'interview_date'=>$value->interview_date,
                'interviewer_comment'=>$value->interviewer_comment
            ];
        }
        $array_reponse = [ 
            'id'=>$dep->id."",
            'first_name'=>$dep->first_name,
            'last_name'=>$dep->last_name,
            'phone_number'=>$dep->phone_number,
            'email'=>$dep->email,
            'file_name'=>$dep->file_name,
            'file_path' =>'/Attachments/CV/'.$dep->id.'/CV'.'/'.$dep->file_name,
            'Job_title_id'=>$dep->Job_title_id,
            'Job_title_name'=>!empty($dep->Job_title_id_fun)?$dep->Job_title_id_fun->hr_job_title : null,
            'uploaded_by_id'=>$dep->uploaded_by_id,
            'uploaded_by_name'=>!empty($dep->uploaded_by_id_fun)?$dep->uploaded_by_id_fun->username:null,
            'uploaded_photoURL' =>$dep->uploaded_by_id_fun->photoURL? '/Attachments/User/'.$dep->uploaded_by_id_fun->id.'/profile'.'/'.$dep->uploaded_by_id_fun->photoURL:null,
            'comment'=>$dep->comment,
            'createdAt'=>$dep->created_at,
            'updatedAt'=>$dep->updated_at,
            'final_interview_phase_id'=>$final_interview_phase_id,
            'final_interview_phase_name'=>$final_interview_phase_name,
            'final_interview_status_id'=>$final_interview_status_id,
            'final_interview_status_name'=>$final_interview_status_name,
            'interview_history'=>$interview_history,
            'request_onboarding'=>$request_onboarding,
            
        ];
        return $array_reponse;
    }

    public function DeleteRequestOnboarding(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'id'=>'required|numeric|exists:request_onboardings,id',
                
             ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus=  RequestOnboarding::where('id',$request->id)->first();

          if(!empty($reportStatus->id)){

            $reportStatus->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Request Onboarding not found"],"Validator Errors",400);

          }
         
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    
    public function CreateRequestOnboarding(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'recruitment_request_cv_id'=>'required|numeric|exists:recruitment_request_cvs,id',
              ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            if ($request->has('onboarding_request_details')){
                $array_reponse= [];
                DB::beginTransaction();
                foreach($request->onboarding_request_details as $value){
                    $validator = Validator::make($value, [
                        'user_manager_id'=>'required|numeric|exists:users,id',
                        'onboarding_requirement_id'=>'required|numeric|exists:onboarding_requirements,id',
                        'global_status_id'=>'required|numeric|exists:global_statuses,id',
                   ]);
                   if ($validator->fails()) {
                       return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                   }
                    $reportStatus=   RequestOnboarding::create([
                        'recruitment_request_cv_id'=>$request->recruitment_request_cv_id,
                        'user_creator_id'=>Auth::guard('user_api')->user()->id,
                        'user_manager_id'=>$value['user_manager_id'],
                        'onboarding_requirement_id'=>$value['onboarding_requirement_id'],
                        'global_status_id'=>$value['global_status_id'],
                        'comment'=>!empty($request->comment)?$request->comment:null,
                        ]);
                    if(!empty($reportStatus->id)){
                        $array_reponse []= $reportStatus;
                        $reportStatus = null;
                    }    else{
                        throw new Exception("Unable to create Onboarding", 1);
                    }
                }
                DB::commit();
                return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
            }

        
            if(!empty($reportStatus->id)){

            }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

            }
        

             
        }catch(\Exception $e){
            try{
                DB::rollBack();
              }catch(\Exception $e){
                return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
              }
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

    public function GetStatusRequestOnboarding(Request $request){
        try{
           $validator = Validator::make($request->all(), [
                    'token'=>'required|string',
                    'fulldetails'=>'boolean',
                    'global_status_id'=>'required|numeric|exists:global_statuses,id',

                ]);
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
    
                if($request->fulldetails == "true" ){
                    $reportStatus = RequestOnboarding::where('global_status_id',$request->global_status_id)->where('user_manager_id',Auth::guard('user_api')->user()->id)
                    ->orWhere('global_status_id',$request->global_status_id)->where('user_creator_id',Auth::guard('user_api')->user()->id)->get()->unique('recruitment_request_cv_id');
                }else{
                    $reportStatus = RequestOnboarding::where('global_status_id',$request->global_status_id)->where('user_manager_id',Auth::guard('user_api')->user()->id)
                    ->orWhere('global_status_id',$request->global_status_id)->where('user_creator_id',Auth::guard('user_api')->user()->id)->get();                    
                }
          if(!empty($reportStatus[0]->id)){
            foreach($reportStatus as $dep){
                if($request->has('fulldetails') ){
                    if($request->fulldetails == "true" ){
                        $array_reponse[] =      $this->FullCastOnboardingRequest($dep);

                    }else{
                    $array_reponse[] =      $this->SmallCastOnboardingRequest($dep);

                    }
                }else{
                    $array_reponse[] =      $this->SmallCastOnboardingRequest($dep);

                }
            }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Request Details "],"Empty",200);

          }
             
        }catch(\Exception $e){
            return $e;
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }  

    public function UpdateRequestOnboarding(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'id'=>'required|numeric|exists:request_onboardings,id',
                 'recruitment_request_cv_id'=>'numeric|exists:recruitment_request_cvs,id',
                 'user_manager_id'=>'numeric|exists:users,id',
                 'onboarding_requirement_id'=>'numeric|exists:onboarding_requirements,id',
                 'global_status_id'=>'numeric|exists:global_statuses,id',
              ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

            $to_be_update = RequestOnboarding::where('id',$request->id)->first();
            if(!empty($to_be_update->id)){
                $to_be_update->update($request->all());
                // check if it final onboarding details 
               $check_complete =  RequestOnboarding::where('recruitment_request_cv_id',$to_be_update->recruitment_request_cv_id)->where('global_status_id','<>',2)->get();
                if(empty($check_complete[0]->id)){
    
                    $history_request= RecruitmentRequestHistory::where('recruitment_request_cv_id',$to_be_update->recruitment_request_cv_id)->where('interview_phase_id',9)->first();
                    if(!empty($history_request->id)){
                        $history_request->update([
                            'interview_status_id'=>2,
                        ]);

                    }
                }
                return ResponseApi::acceptedResponseApi($to_be_update,"success",201);
            }else{
                return ResponseApi::notFoundResponse(['message'=>"Empty Onboarding Request"],"Empty",200);

            }
        
      }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

    public function GetSpecificRequestOnboarding(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                     'token'=>'required|string',
                     'fulldetails'=>'boolean',
                     'id'=>'required|numeric|exists:request_onboardings,id',
                 ]);
                 if ($validator->fails()) {
         
                     return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                 }
     
                      $reportStatus = RequestOnboarding::where('id',$request->id)->first();
                 
           if(!empty($reportStatus->id)){
                  if($request->has('fulldetails') ){
                     if($request->fulldetails == "true" ){
                         $array_reponse =      $this->FullCastOnboardingRequest($reportStatus);
 
                     }else{
                     $array_reponse =      $this->SmallCastOnboardingRequest($reportStatus);
 
                     }
                 }else{
                     $array_reponse =      $this->SmallCastOnboardingRequest($reportStatus);
 
                 }
            
             return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
 
           }else{
             return ResponseApi::notFoundResponse(['message'=>"Empty Request Details "],"Empty",200);
 
           }
              
         }catch(\Exception $e){
             return $e;
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
         
    }

    public function GetAllRequestOnboarding(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                     'token'=>'required|string',
                     'fulldetails'=>'boolean',

                 ]);
                 if ($validator->fails()) {
         
                     return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                 }
     
                 if($request->fulldetails == "true" ){
                     $reportStatus = RequestOnboarding::where('user_creator_id',Auth::guard('user_api')->user()->id)->get()->unique('recruitment_request_cv_id');
                 }else{
                     $reportStatus = RequestOnboarding::where('user_creator_id',Auth::guard('user_api')->user()->id)->get();
                     
                 }
           if(!empty($reportStatus[0]->id)){
             foreach($reportStatus as $dep){
                 if($request->has('fulldetails') ){
                     if($request->fulldetails == "true" ){
                         $array_reponse[] =      $this->FullCastOnboardingRequest($dep);
 
                     }else{
                     $array_reponse[] =      $this->SmallCastOnboardingRequest($dep);
 
                     }
                 }else{
                     $array_reponse[] =      $this->SmallCastOnboardingRequest($dep);
 
                 }
             }
             return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
 
           }else{
             return ResponseApi::notFoundResponse(['message'=>"Empty Request Details "],"Empty",200);
 
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
     * @param  \App\Models\RequestOnboardingRequirement  $requestOnboardingRequirement
     * @return \Illuminate\Http\Response
     */
    public function show(RequestOnboardingRequirement $requestOnboardingRequirement)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\RequestOnboardingRequirement  $requestOnboardingRequirement
     * @return \Illuminate\Http\Response
     */
    public function edit(RequestOnboardingRequirement $requestOnboardingRequirement)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\RequestOnboardingRequirement  $requestOnboardingRequirement
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, RequestOnboardingRequirement $requestOnboardingRequirement)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\RequestOnboardingRequirement  $requestOnboardingRequirement
     * @return \Illuminate\Http\Response
     */
    public function destroy(RequestOnboardingRequirement $requestOnboardingRequirement)
    {
        //
    }
}
