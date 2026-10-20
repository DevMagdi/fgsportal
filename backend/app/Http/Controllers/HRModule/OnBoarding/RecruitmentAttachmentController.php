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
 

class RecruitmentAttachmentController extends Controller
{

     

    public function CreateRecruitmentAttachment(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'recruitment_request_cv_id'=>'required|numeric|exists:recruitment_request_cvs,id',
                 'token'=>'required|string',
                  'attachment_required'=>'required'
            ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            DB::beginTransaction();

            //add attachment required
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
               
           

                DB::commit();

                return ResponseApi::acceptedResponseApi(['message'=>"Successfully"],"success",201);

                  
                
        }catch(\Exception $e){
            try{
                DB::rollBack();
              }catch(\Exception $e){
                return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
              }
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
     * @param  \App\Models\RecruitmentAttachment  $recruitmentAttachment
     * @return \Illuminate\Http\Response
     */
    public function show(RecruitmentAttachment $recruitmentAttachment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\RecruitmentAttachment  $recruitmentAttachment
     * @return \Illuminate\Http\Response
     */
    public function edit(RecruitmentAttachment $recruitmentAttachment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\RecruitmentAttachment  $recruitmentAttachment
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, RecruitmentAttachment $recruitmentAttachment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\RecruitmentAttachment  $recruitmentAttachment
     * @return \Illuminate\Http\Response
     */
    public function destroy(RecruitmentAttachment $recruitmentAttachment)
    {
        //
    }
}
