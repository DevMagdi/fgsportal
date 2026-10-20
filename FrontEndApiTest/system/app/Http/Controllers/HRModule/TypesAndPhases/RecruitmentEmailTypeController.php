<?php

namespace App\Http\Controllers\HRModule\TypesAndPhases;

use App\Http\Controllers\Controller;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\RecruitmentEmailType;

class RecruitmentEmailTypeController extends Controller
{
    public function DeleteRecruitmentEmailType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'id'=>'required|numeric|exists:recruitment_email_types,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus=  RecruitmentEmailType::where('id',$request->id)->first();

          if(!empty($reportStatus->id)){

            $reportStatus->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Email Type not found"],"Validator Errors",400);

          }
         
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateRecruitmentEmailType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'email_type' => 'required|string|unique:recruitment_email_types',
                'token'=>'required|string',
                'id'=>'required|numeric|exists:recruitment_email_types,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus=  RecruitmentEmailType::where('id',$request->id)->first();

          if(!empty($reportStatus->id)){

            $reportStatus->update([
                'email_type' =>$request->email_type,
            ]);

            return ResponseApi::acceptedResponseApi($reportStatus,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Email Type not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateRecruitmentEmailType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'email_type' => 'required|string|unique:recruitment_email_types',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus=  RecruitmentEmailType::create([

            'email_type' =>$request->email_type,
           ]);
         
        
          return ResponseApi::acceptedResponseApi($reportStatus,"success",201);

             
        }catch(\Exception $e){
        
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllRecruitmentEmailType(Request $request){
        try{
           $validator = Validator::make($request->all(), [
                    'token'=>'required|string'
                ]);
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
    
            
          $reportStatus = RecruitmentEmailType::all();
          if(!empty($reportStatus[0]->id)){
            foreach($reportStatus as $dep){
            $array_reponse[] = [ 
                'email_type' =>$dep->email_type,
                'id'=>$dep->id.''

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Email Type "],"Empty",200);

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
     * @param  \App\Models\RecruitmentEmailType  $recruitmentEmailType
     * @return \Illuminate\Http\Response
     */
    public function show(RecruitmentEmailType $recruitmentEmailType)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\RecruitmentEmailType  $recruitmentEmailType
     * @return \Illuminate\Http\Response
     */
    public function edit(RecruitmentEmailType $recruitmentEmailType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\RecruitmentEmailType  $recruitmentEmailType
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, RecruitmentEmailType $recruitmentEmailType)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\RecruitmentEmailType  $recruitmentEmailType
     * @return \Illuminate\Http\Response
     */
    public function destroy(RecruitmentEmailType $recruitmentEmailType)
    {
        //
    }
}
