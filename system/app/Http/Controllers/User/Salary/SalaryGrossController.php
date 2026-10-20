<?php

namespace App\Http\Controllers\User\Salary;
use App\Http\Controllers\Controller;
use App\Models\UserSalary;
use Illuminate\Http\Request;
use App\Models\UserSalaryHistory;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
  use Carbon\Carbon;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use DatePeriod;
use DateInterval;
use App\Models\Report;
use App\Models\SalaryReport;
use App\Models\SalaryType;
use App\Models\SalaryGross;
use Illuminate\Support\Facades\Crypt;

class SalaryGrossController extends Controller
{
       
    public function DeleteSalaryGross(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'salary_gross_id'=>'required|numeric|exists:salary_grosses,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

            $reportStatus=  SalaryGross::where('id',$request->salary_type_id)->first();

          if(!empty($reportStatus->id)){
             
            $reportStatus->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);
      
          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"salary Type not found"],"Validator Errors",400);

          }
         
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

    public function UpdateSalaryGross(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'salary_gross_id'=>'required|numeric|exists:salary_grosses,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus=  SalaryGross::where('id',$request->salary_type_id)->first();

          if(!empty($reportStatus->id)){

            $reportStatus->update($request->all());

            return ResponseApi::acceptedResponseApi($reportStatus,"success",201);
          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Salary  not found"],"Validator Errors",400);
          }
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateSalaryGross(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'salary_type_id' => 'required|string|exists:salary_types,id',
                'salary_id' => 'required|string|exists:user_salaries,id',
                'status' => 'required',
                'cost' => 'required|string',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            $salary_gross =SalaryGross::where('salary_id',$request->salary_id)->where('salary_type_id',$request->salary_type_id)->
            where('status',1)->first();
            if(!empty($salary_gross->id)){
                $salary_gross->update([
                    'status'=>0
                ]);
            }

          $reportStatus=  SalaryGross::create([
            'user_creator_id'=>Auth::guard('user_api')->user()->id,
            'salary_id'=>$request->salary_id,
            'salary_type_id'=>$request->salary_type_id,
            'status'=>$request->status,
            'cost'=> Crypt::encryptString($request->cost)
          ]);
          return ResponseApi::acceptedResponseApi($reportStatus,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetMySalaryGross(Request $request){
        try{
           $validator = Validator::make($request->all(), [
                    'token'=>'required|string'
                ]);
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
    
            
          $reportStatus = SalaryGross::whereHas('salary_id_fun',function ($q){
            $q->where('assign_to_id',Auth::guard('user_api')->user()->id);
          })->get();
          if(!empty($reportStatus[0]->id)){
            foreach($reportStatus as $dep){
            $array_reponse[] = [ 
                'user_creator_id'=>$dep->user_creator_id,
                'user_creator_name'=>!empty($dep->user_creator_id_fun)?$dep->user_creator_id_fun->username:null,
                'salary_id'=>$dep->salary_id,
                'salary'=>!empty($dep->salary_id_fun)?Crypt::decryptString($dep->salary_id_fun->salary):null,
                'salary_type'=>!empty($dep->salary_type_id_fun)?$dep->salary_type_id_fun->salary_type:null,
                'salary_type_id'=>!empty($dep->salary_type_id_fun)?$dep->salary_type_id:null,
                'status'=>$dep->status,
                'cost'=>Crypt::decryptString($dep->cost),
                'id'=>$dep->id.'',
            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Salary Types"],"Empty",200);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

    public function GetUserSalaryGross(Request $request){
        try{
           $validator = Validator::make($request->all(), [
                    'token'=>'required|string',
                    'user_id'=>'required|string|exists:users,id'
                ]);
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
    
            
          $reportStatus = SalaryGross::whereHas('salary_id_fun',function ($q)use($request){
            $q->where('assign_to_id',$request->user_id);
          })->get();
          if(!empty($reportStatus[0]->id)){
            foreach($reportStatus as $dep){
            $array_reponse[] = [ 
                'user_creator_id'=>$dep->user_creator_id,
                'user_creator_name'=>!empty($dep->user_creator_id_fun)?$dep->user_creator_id_fun->username:null,
                'salary_id'=>$dep->salary_id,
                'salary'=>!empty($dep->salary_id_fun)?Crypt::decryptString($dep->salary_id_fun->salary):null,
                'salary_type'=>!empty($dep->salary_type_id_fun)?$dep->salary_type_id_fun->salary_type:null,
                'salary_type_id'=>!empty($dep->salary_type_id_fun)?$dep->salary_type_id:null,
                'status'=>$dep->status,
                'cost'=>Crypt::decryptString($dep->cost),
                'id'=>$dep->id.'',
            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Salary Types"],"Empty",200);

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
     * @param  \App\Models\SalaryGross  $salaryGross
     * @return \Illuminate\Http\Response
     */
    public function show(SalaryGross $salaryGross)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\SalaryGross  $salaryGross
     * @return \Illuminate\Http\Response
     */
    public function edit(SalaryGross $salaryGross)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\SalaryGross  $salaryGross
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, SalaryGross $salaryGross)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\SalaryGross  $salaryGross
     * @return \Illuminate\Http\Response
     */
    public function destroy(SalaryGross $salaryGross)
    {
        //
    }
}
