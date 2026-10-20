<?php

namespace App\Http\Controllers\Settings\WorkHours;
 
use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use App\Models\WorkHoursConfig;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
class WorkHoursConfigController extends Controller
{
    public function DeleteWorkHoursConfig(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'work_config_id'=>'required|numeric|exists:work_hours_configs,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $work=  WorkHoursConfig::where('id',$request->work_config_id)->first();

          if(!empty($work->id)){

            $work->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"WorkHoursConfig not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateWorkHoursConfig(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                
                'token'=>'required|string',
                 'work_config_id'=>'required|numeric|exists:work_hours_configs,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
          $work=  WorkHoursConfig::where('id',$request->work_config_id)->first();

          if(!empty($work->id)){

            $work->update(
                $request->except(['start_date','end_date'])
            );
            if(!empty($request->start_date)){
                $validator = Validator::make($request->all(), [
                  'start_date' => 'required|date',
                  'token'=>'required|string',
              ]);
              if ($validator->fails()) {
        
                  return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
              }
              $work=  WorkHoursConfig::where('id',$request->work_config_id)->first();
   
   
              $work->update([
                'start_date'=>Carbon::createFromFormat('m/d/Y', $request-> start_date),
              ]);
        
              }

              if(!empty($request->end_date)){
                $validator = Validator::make($request->all(), [
                  'end_date' => 'required|date',
                  'token'=>'required|string',
              ]);
              if ($validator->fails()) {
        
                  return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
              }
              $work=  WorkHoursConfig::where('id',$request->work_config_id)->first();
   
   
              $work->update([
                'end_date'=>Carbon::createFromFormat('m/d/Y', $request-> end_date),
              ]);
        
              }
  

            return ResponseApi::acceptedResponseApi($work,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"WorkHoursConfig not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
    }
    public function CreateWorkHoursConfig(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'title' => 'required|string',
                'start_date'=>'required|date',
                'end_date'=>'required|date',
                'config_duration'=>'required|numeric',
                'token'=>'required|string',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $work=  WorkHoursConfig::create([
            'title' =>$request->title,
            'start_date' =>Carbon::createFromFormat('m/d/Y',$request->start_date),
            'end_date' =>Carbon::createFromFormat('m/d/Y',$request->end_date),
             'config_duration' =>$request->config_duration,
            'user_creator_id' =>Auth::guard('user_api')->user()->id,
           ]);
           if(!empty($work->id)){
               return ResponseApi::acceptedResponseApi($work,"success",201);

           }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

           }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllWorkHoursConfig(){
      //  try{
          $work = WorkHoursConfig::all();
          if(!empty($work[0]->id)){
            foreach($work as $dep){
            $array_reponse[] = [ 
                'title' =>$dep->title,
                'start_date' =>  Carbon::parse( $dep->start_date)->format('m/d/Y') ,
                'end_date' => Carbon::parse( $dep->end_date)->format('m/d/Y') ,
                'config_duration' =>(float)$dep->config_duration,
                'user_creator_id' =>$dep->user_creator_id,
                'user_creator_name' =>$dep->user_creator_id_fun->username,
                'id'=>$dep->id.''
             ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Work Config "],"Empty",200);

          }
             
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
        
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
     * @param  \App\Models\WorkHoursConfig  $workHoursConfig
     * @return \Illuminate\Http\Response
     */
    public function show(WorkHoursConfig $workHoursConfig)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\WorkHoursConfig  $workHoursConfig
     * @return \Illuminate\Http\Response
     */
    public function edit(WorkHoursConfig $workHoursConfig)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\WorkHoursConfig  $workHoursConfig
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, WorkHoursConfig $workHoursConfig)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\WorkHoursConfig  $workHoursConfig
     * @return \Illuminate\Http\Response
     */
    public function destroy(WorkHoursConfig $workHoursConfig)
    {
        //
    }
}
