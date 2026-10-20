<?php

namespace App\Http\Controllers\HRModule\TypesAndPhases;

use App\Http\Controllers\Controller;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\OnboardingRequirement;

class OnboardingRequirementController extends Controller
{

    public function DeleteOnboardingRequirement(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'id'=>'required|numeric|exists:onboarding_requirements,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus=  OnboardingRequirement::where('id',$request->id)->first();

          if(!empty($reportStatus->id)){

            $reportStatus->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Onboarding Requirement Type not found"],"Validator Errors",400);

          }
         
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateOnboardingRequirement(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'onboarding_requirement_type' => 'required|string|unique:onboarding_requirements',
                'token'=>'required|string',
                'id'=>'required|numeric|exists:onboarding_requirements,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus=  OnboardingRequirement::where('id',$request->id)->first();

          if(!empty($reportStatus->id)){

            $reportStatus->update([
                'onboarding_requirement_type' =>$request->onboarding_requirement_type,
            ]);

            return ResponseApi::acceptedResponseApi($reportStatus,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Onboarding Requirement Type not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateOnboardingRequirement(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'onboarding_requirement_type' => 'required|string|unique:onboarding_requirements',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus=  OnboardingRequirement::create([

            'onboarding_requirement_type' =>$request->onboarding_requirement_type,
           ]);
         
        
          return ResponseApi::acceptedResponseApi($reportStatus,"success",201);

             
        }catch(\Exception $e){
            return $e;
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllOnboardingRequirement(Request $request){
        try{
           $validator = Validator::make($request->all(), [
                    'token'=>'required|string'
                ]);
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
    
            
          $reportStatus = OnboardingRequirement::all();
          if(!empty($reportStatus[0]->id)){
            foreach($reportStatus as $dep){
            $array_reponse[] = [ 
                'onboarding_requirement_type' =>$dep->onboarding_requirement_type,
                'id'=>$dep->id.''

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Onboarding Requirement Type "],"Empty",200);

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
     * @param  \App\Models\OnboardingRequirement  $OnboardingRequirement
     * @return \Illuminate\Http\Response
     */
    public function show(OnboardingRequirement $OnboardingRequirement)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\OnboardingRequirement  $OnboardingRequirement
     * @return \Illuminate\Http\Response
     */
    public function edit(OnboardingRequirement $OnboardingRequirement)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\OnboardingRequirement  $OnboardingRequirement
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, OnboardingRequirement $OnboardingRequirement)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\OnboardingRequirement  $OnboardingRequirement
     * @return \Illuminate\Http\Response
     */
    public function destroy(OnboardingRequirement $OnboardingRequirement)
    {
        //
    }
}
