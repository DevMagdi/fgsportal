<?php

namespace App\Http\Controllers\Report;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use App\Models\ReportType;
class ReportTypeController extends Controller
{
    
    public function DeleteReportType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'report_type_id'=>'required|numeric|exists:report_types,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $ReportType=  ReportType::where('id',$request->report_type_id)->first();

          if(!empty($ReportType->id)){

            $ReportType->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Report Status not found"],"Validator Errors",400);

          }
         
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateReportType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'report_type' => 'required|string|unique:report_types',
                'token'=>'required|string',
                'report_type_id'=>'required|numeric|exists:report_types,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $ReportType=  ReportType::where('id',$request->report_type_id)->first();

          if(!empty($ReportType->id)){

            $ReportType->update([
                'report_type' =>$request->report_type,
            ]);

            return ResponseApi::acceptedResponseApi($ReportType,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Report Status not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateReportType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'report_type' => 'required|string|unique:report_types',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $ReportType=  ReportType::create([

            'report_type' =>$request->report_type,
           ]);
         
        
          return ResponseApi::acceptedResponseApi($ReportType,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetTechReportType(Request $request){
      try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {

                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            $ReportType = ReportType::all();
            if(!empty($ReportType[0]->id)){
              foreach($ReportType as $dep){
              $array_reponse[] = [ 
                  'report_type' =>$dep->report_type,
                  'key'=>$dep->id.''
  
              ];
          }
              return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
  
            }else{
              return ResponseApi::notFoundResponse(['message'=>"Empty Report Status"],"Empty",200);
  
            }
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
    }
    public function GetAllReportType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
          $ReportType = ReportType::all();
          if(!empty($ReportType[0]->id)){
            foreach($ReportType as $dep){
            $array_reponse[] = [ 
                'report_type' =>$dep->report_type,
                'key'=>$dep->id

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Report Status"],"Empty",200);

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
     * @param  \App\Models\ReportType  $ReportType
     * @return \Illuminate\Http\Response
     */
    public function show(ReportType $ReportType)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ReportType  $ReportType
     * @return \Illuminate\Http\Response
     */
    public function edit(ReportType $ReportType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ReportType  $ReportType
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ReportType $ReportType)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ReportType  $ReportType
     * @return \Illuminate\Http\Response
     */
    public function destroy(ReportType $ReportType)
    {
        //
    }
}
