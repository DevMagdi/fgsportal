<?php

namespace App\Http\Controllers\HRModule\CV;

use App\Http\Controllers\Controller;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Str;
use App\Models\GlobalStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use File;

use App\Models\RecruitmentRequestCv;

use App\Models\RecruitmentRequestHistory;
class RecruitmentRequestHistoryController extends Controller
{
    public function ParseRecruitmentRequest(RecruitmentRequestCv $dep){  
         $interview_history= [];
        $interview_history_table = RecruitmentRequestHistory::where('recruitment_request_cv_id',$dep->id)->get();
        $final_interview_phase_id = null;
        $final_interview_phase_name = null;
        $final_interview_status_id = null;
        $final_interview_status_name = null;
        
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
            
        ];
        return $array_reponse;
    }

    public function DeleteInterviewRequest(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'id'=>'required|numeric|exists:recruitment_request_histories,id',
                'token'=>'string', 
            ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
           
            $update_interview = RecruitmentRequestHistory::where('id',$request->id)->first();
            if(!empty($update_interview->id)){
               $update_interview->delete();
                 return ResponseApi::acceptedResponseApi($update_interview,"success",201);

             }else{
                return ResponseApi::notFoundResponse(['message'=>"Empty Interview Request"],"Empty",200);
            }

        }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
    }
   
    public function UpdateInterviewRequest(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'id'=>'required|numeric|exists:recruitment_request_histories,id',
                'token'=>'string', 
            ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            if($request->has('interview_date')){
                $updateData = $request->except('interview_date');
                $updateData['interview_date'] = Carbon::create(Carbon::parse($request->interview_date)->format('m/d/Y H:i:s') );
            }
            
            $update_interview = RecruitmentRequestHistory::where('id',$request->id)->first();
            if(!empty($update_interview->id)){
                 $update_interview->update($updateData);
                 return ResponseApi::acceptedResponseApi($update_interview,"success",201);

             }else{
                return ResponseApi::notFoundResponse(['message'=>"Empty Interview Request"],"Empty",200);
            }

        }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
    }


    public function CreateInterviewRequest(Request $request){
        try{

            $validator = Validator::make($request->all(), [
                'manager_interview_id' => 'required|string|exists:users,id',
                'interview_phase_id' => 'required|string|exists:interview_phases,id',
                'interview_status_id' => 'required|string|exists:interview_statuses,id',
                'token'=>'string',
                'comment'=>'string',
                'interview_date'=>'required|date',
                'recruitment_request_cv_id'=>'required|numeric|exists:recruitment_request_cvs,id'
            ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
             $create_interview = RecruitmentRequestHistory::create([
                'recruitment_request_cv_id'=>$request->recruitment_request_cv_id,
                'user_creator_id'=>Auth::guard('user_api')->user()->id,
                'manager_interview_id'=>$request->manager_interview_id,
                'interview_phase_id'=>$request->interview_phase_id,
                'interview_status_id'=>$request->interview_status_id,
                'comment'=>$request->comment,
                'interview_date'=>Carbon::create(Carbon::parse($request->interview_date)->format('m/d/Y H:i:s') )
             ]);
 
                if(!empty($create_interview->id)){
                   
                    return ResponseApi::acceptedResponseApi($create_interview,"success",201);

            }else{
                return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

            }
            
        }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }

    }
    
    public function GetDetailedRecruitmentRequest(Request $request){
        try{
           $validator = Validator::make($request->all(), [
                    'token'=>'required|string'
                ]);
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
    
          $reportStatus = RecruitmentRequestCv::all();
          if(!empty($reportStatus[0]->id)){
            foreach($reportStatus as $dep){
            $array_reponse[] = $this->ParseRecruitmentRequest($dep);
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Recruitment Request"],"Empty",200);

          }
             
        }catch(\Exception $e){
            
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }  

    public function GetInterviewHistorySpecificCV(Request $request){
        try{
           $validator = Validator::make($request->all(), [
                    'token'=>'required|string',
                    'recruitment_request_cv_id'=>'required|numeric|exists:recruitment_request_cvs,id'

                ]);
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
    
          $reportStatus = RecruitmentRequestCv::where('id',$request->recruitment_request_cv_id)->first();
          if(!empty($reportStatus->id)){
             $array_reponse = $this->ParseRecruitmentRequest($reportStatus);
        
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Interview Request"],"Empty",200);

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
     * @param  \App\Models\RecruitmentRequestHistory  $recruitmentRequestHistory
     * @return \Illuminate\Http\Response
     */
    public function show(RecruitmentRequestHistory $recruitmentRequestHistory)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\RecruitmentRequestHistory  $recruitmentRequestHistory
     * @return \Illuminate\Http\Response
     */
    public function edit(RecruitmentRequestHistory $recruitmentRequestHistory)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\RecruitmentRequestHistory  $recruitmentRequestHistory
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, RecruitmentRequestHistory $recruitmentRequestHistory)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\RecruitmentRequestHistory  $recruitmentRequestHistory
     * @return \Illuminate\Http\Response
     */
    public function destroy(RecruitmentRequestHistory $recruitmentRequestHistory)
    {
        //
    }
}
