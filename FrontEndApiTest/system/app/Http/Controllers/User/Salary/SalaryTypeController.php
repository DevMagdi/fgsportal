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
class SalaryTypeController extends Controller
{
   
      
    public function DeleteSalaryType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'salary_type_id'=>'required|numeric|exists:salary_types,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus=  SalaryType::where('id',$request->salary_type_id)->first();

          if(!empty($reportStatus->id)){
           $salary_gross = SalaryGross::where('salary_type_id',$reportStatus->id)->first();
            if(!empty($salary_gross->id)){
                return ResponseApi::acceptedResponseApi(["message"=>"You Cannt Delete this Type Because it's assigned to Salary"],"Validator Errors",400);

            }else{
            $reportStatus->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);
        }
          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"salary Type not found"],"Validator Errors",400);

          }
         
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

    public function UpdateSalaryType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'salary_type' => 'required|string|unique:salary_types',
                'token'=>'required|string',
                'salary_type_id'=>'required|numeric|exists:salary_types,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus=  SalaryType::where('id',$request->salary_type_id)->first();

          if(!empty($reportStatus->id)){

            $reportStatus->update([
                'salary_type' =>$request->salary_type,
                'user_creator_id'=>Auth::guard('user_api')->user()->id
            ]);

            return ResponseApi::acceptedResponseApi($reportStatus,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Salary Report not found"],"Validator Errors",400);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateSalaryType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'salary_type' => 'required|string|unique:salary_types',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus=  SalaryType::create([

            'salary_type' =>$request->salary_type,
            'user_creator_id'=>Auth::guard('user_api')->user()->id

           ]);
         
        
          return ResponseApi::acceptedResponseApi($reportStatus,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllSalaryType(Request $request){
        try{
           $validator = Validator::make($request->all(), [
                    'token'=>'required|string'
                ]);
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
    
            
          $reportStatus = SalaryType::all();
          if(!empty($reportStatus[0]->id)){
            foreach($reportStatus as $dep){
            $array_reponse[] = [ 
                'salary_type' =>$dep->salary_type,
                'id'=>$dep->id.'',
                'user_creator_id'=>$dep->user_creator_id,
                'user_creator_name'=>!empty($dep->user_creator_id_fun)?$dep->user_creator_id_fun->username:null

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
     * @param  \App\Models\SalaryType  $salaryType
     * @return \Illuminate\Http\Response
     */
    public function show(SalaryType $salaryType)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\SalaryType  $salaryType
     * @return \Illuminate\Http\Response
     */
    public function edit(SalaryType $salaryType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\SalaryType  $salaryType
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, SalaryType $salaryType)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\SalaryType  $salaryType
     * @return \Illuminate\Http\Response
     */
    public function destroy(SalaryType $salaryType)
    {
        //
    }
}
