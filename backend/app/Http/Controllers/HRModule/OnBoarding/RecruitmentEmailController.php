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
use App\Models\RecruitmentEmail;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Mail;
use App\Mail\RecruitmentMail;
use App\Models\Log;
use App\Models\RecruitmentAttachment;

class RecruitmentEmailController extends Controller
{

    public function castEmailRecruitment(RecruitmentEmail $value){
      
        $dep= RecruitmentRequestCv::where('id',$value->recruitment_request_cv_id)->first();
        $request_onboarding  =  [
            'id'=>$value->id.'',
            'user_creator_name'=>!empty($value->user_creator_id_fun)?$value->user_creator_id_fun->username:null,
            'user_creator_id'=>!empty($value->user_creator_id)?$value->user_creator_id:null,
            'email_type'=>!empty($value->email_type_id_fun)?$value->email_type_id_fun->email_type:null,
            'email_type_id'=>!empty($value->email_type_id)?$value->email_type_id:null,
            'comment'=>$value->comment,
            'email_body'=>$value->email_body,
            'email_attachments'=>$value->email_attachments,
            'email_subject'=>$value->email_subject,

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

    public function DeleteRecruitmentEmail(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'id'=>'required|numeric|exists:recruitment_emails,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus=  RecruitmentEmail::where('id',$request->id)->first();

          if(!empty($reportStatus->id)){

            $reportStatus->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Recruitment Email not found"],"Validator Errors",400);

          }
         
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

    public function CreateRecruitmentEmail(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'recruitment_request_cv_id'=>'required|numeric|exists:recruitment_request_cvs,id',
                'email_type_id'=>'required|numeric|exists:recruitment_email_types,id',
                'token'=>'required|string',
                'email_body'=>'required|string',
                'email_subject'=>'required|string',
                'send_link'=>'required|boolean'
            ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            DB::beginTransaction();

            //add attachment required
            if($request->has('attachment_required')){
                foreach ($request->attachment_required as $value) {
                    $validator = Validator::make($value->all(), [
                         'global_status_id'=>'required|numeric|exists:global_statuses,id',
                        'attachment_type_id'=>'required|numeric|exists:attachment_types,id',
                       // 'file'=>'required',
                    ]);
                    if ($validator->fails()) {
                        return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                    }

                   $exists_before = RecruitmentAttachment::where('recruitment_request_cv_id',$request->recruitment_request_cv_id)->
                    where('attachment_type_id',$value['attachment_type_id'])->first();
                    if(empty($exists_before->id)){
                        $create_attach = RecruitmentAttachment::create([
                            'recruitment_request_cv_id'=>$request->recruitment_request_cv_id,
                            'user_creator_id'=>Auth::guard('user_api')->user()->id,
                            'global_status_id'=>$value['global_status_id'],
                            'attachment_type_id'=>$value['attachment_type_id'],
                        ]);
                    }else{
                        $exists_before->update([
                            'recruitment_request_cv_id'=>$request->recruitment_request_cv_id,
                            'user_creator_id'=>Auth::guard('user_api')->user()->id,
                            'global_status_id'=>$value['global_status_id'],
                            'attachment_type_id'=>$value['attachment_type_id'],
                        ]);
                    }

                }
               
            }

            $reportStatus=  RecruitmentEmail::create([
                'user_creator_id' =>Auth::guard('user_api')->user()->id,
                'email_type_id' =>$request->email_type_id,
                'comment' =>$request->comment,
                'recruitment_request_cv_id' =>$request->recruitment_request_cv_id,
                'email_body'=>$request->email_body,
                'email_subject'=>$request->email_subject,
            ]);
            
             //here we will send email to user with email
            if (!empty($request->attachments) && !empty($reportStatus->id)){
                $attached = null ;
                $attach = [];
                $attachPaths = [];
                // $key =$request->attachments;
                // $image = $key;
                // $file_name2 = $image->getClientOriginalName();
                // //  return $request->photoURL;
                 
                // $attach[]=[
                //     $file_name2
                // ];
                // $tokenrand = Crypt::encryptString($file_name2);
                // $idencrypt = Crypt::encryptString($request->recruitment_request_cv_id);

                // $image->move(('Attachments/Recruitment/'.$idencrypt .'/'.$tokenrand.'/'), $file_name2);
                // $attachPaths[] = public_path('Attachments\Recruitment\\'.$idencrypt .'\\'.$tokenrand.'\\'.$file_name2);
 
                foreach($request->attachments as $key){
                    $image = $key;
                    $file_name2 = $image->getClientOriginalName();
                    //  return $request->photoURL;
                     
                    $attach[]=[
                        $file_name2
                    ];
                    $tokenrand = Crypt::encryptString($file_name2);
                    $idencrypt = Crypt::encryptString($request->recruitment_request_cv_id);

                    $image->move(('Attachments/Recruitment/'.$idencrypt .'/'.$tokenrand.'/'), $file_name2);
                   $attachPaths[] = public_path('Attachments\Recruitment\\'.$idencrypt .'\\'.$tokenrand.'\\'.$file_name2);

                }
                 $reportStatus->update([
                    'email_attachments'=>$attach
                ]);
                 try{
                     $email ='ahmedtaha@creator-groupeg.com';
                    $tokenrand = Crypt::encryptString($request->recruitment_request_cv_id);
                  Mail::to($email)->send(new RecruitmentMail($attachPaths,$request->email_subject,$request->email_body,$email,$tokenrand,$request->send_link));
                }catch(\Exception $e){
                     $log=  Log::create([
                        'action' =>'Email Sent to Recruitment id.'.$request->recruitment_request_cv_id,
                        'actionKeys' =>'Error Message in Email'. $e,
                        'empKey' =>1,
                        'empName' =>'super Mail Recruitment',
                        'createdAt' =>Carbon::now(),
                        'actionStatus' =>'End',
                    ]);
                }

                DB::commit();

                return ResponseApi::acceptedResponseApi($reportStatus,"success",201);

            }else if(!empty($reportStatus->id)){
                DB::commit();

                return ResponseApi::acceptedResponseApi($reportStatus,"success",201);

            }else{
                DB::commit();

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
    

    public function GetAllRecruitmentEmail(Request $request){
        try{
           $validator = Validator::make($request->all(), [
                    'token'=>'required|string'
                ]);
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
    
            
          $reportStatus = RecruitmentEmail::all();
           if(!empty($reportStatus[0]->id)){
            foreach($reportStatus as $dep){
            $array_reponse[] = $this->castEmailRecruitment($dep);
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Recruitment Email "],"Empty",200);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }  

    public function GetMyRecruitmentEmail(Request $request){
        try{
           $validator = Validator::make($request->all(), [
                    'token'=>'required|string'
                ]);
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
    
            
          $reportStatus = RecruitmentEmail::where('user_creator_id',Auth::guard('user_api')->user()->id)->get();
           if(!empty($reportStatus[0]->id)){
            foreach($reportStatus as $dep){
            $array_reponse[] = $this->castEmailRecruitment($dep);
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Recruitment Email "],"Empty",200);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }  

    public function GetSpecificRecruitmentEmail(Request $request){
        try{
           $validator = Validator::make($request->all(), [
                    'token'=>'required|string',
                    'recruitment_request_cv_id'=>'required|numeric|exists:recruitment_request_cvs,id',

                ]);
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
    
            
          $reportStatus = RecruitmentEmail::where('recruitment_request_cv_id',$request->recruitment_request_cv_id)->get();
           if(!empty($reportStatus[0]->id)){
            foreach($reportStatus as $dep){
            $array_reponse[] = $this->castEmailRecruitment($dep);
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Recruitment Email "],"Empty",200);

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
     * @param  \App\Models\RecruitmentEmail  $recruitmentEmail
     * @return \Illuminate\Http\Response
     */
    public function show(RecruitmentEmail $recruitmentEmail)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\RecruitmentEmail  $recruitmentEmail
     * @return \Illuminate\Http\Response
     */
    public function edit(RecruitmentEmail $recruitmentEmail)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\RecruitmentEmail  $recruitmentEmail
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, RecruitmentEmail $recruitmentEmail)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\RecruitmentEmail  $recruitmentEmail
     * @return \Illuminate\Http\Response
     */
    public function destroy(RecruitmentEmail $recruitmentEmail)
    {
        //
    }
}
