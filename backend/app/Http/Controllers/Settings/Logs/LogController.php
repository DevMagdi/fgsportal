<?php

namespace App\Http\Controllers\Settings\Logs;

use App\Http\Controllers\Controller;
 use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use Carbon\Carbon;

 use App\Models\Log; 

class LogController extends Controller
{
    public function CreateLogs(Request $request){
        try{
           
            $validator = Validator::make($request->all(), [
                'action' => 'required|string',
                'actionKeys' => 'required|string',
                'empKey' => 'required|string',
                'empName' => 'required|string',
                'createdAt' => 'required|string',
                'actionStatus' => 'required|string',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            
          $log=  Log::create([
            'action' =>$request->action,
            'actionKeys' =>$request->actionKeys,
            'empKey' =>$request->empKey,
            'empName' =>$request->empName,
            'createdAt' =>$request->createdAt,
            'actionStatus' =>$request->actionStatus,
           ]);
         
        
          return ResponseApi::acceptedResponseApi($log,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllLogs(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 
                'number' => 'required|numeric',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
          $log = Log::orderBy('id','desc')->paginate($request->number);
          if(!empty($log[0]->id)){
            foreach($log as $dep){
            $array_reponse[] = [ 
                'action' =>$dep->action,
                'actionKeys' =>$dep->actionKeys,
                'empKey' =>$dep->empKey,
                'empName' =>$dep->empName,
                'createdAt' =>$dep->createdAt,
                'actionStatus' =>$dep->actionStatus,
                 'key'=>$dep->id

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Logs"],"Empty",200);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

    public function GetTimeDate(Request $request){
        date_default_timezone_set('Africa/Cairo');
    //  $timer = Carbon::creatFromFormat('Y-m-d H:i:s','2020-08-10 12:34:56','Africa/Cairo') ;
      $timer =  Carbon::parse(now())->addHour()->addHour();
    return $timer;
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
     * @param  \App\Models\Log  $log
     * @return \Illuminate\Http\Response
     */
    public function show(Log $log)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Log  $log
     * @return \Illuminate\Http\Response
     */
    public function edit(Log $log)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Log  $log
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Log $log)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Log  $log
     * @return \Illuminate\Http\Response
     */
    public function destroy(Log $log)
    {
        //
    }
}
