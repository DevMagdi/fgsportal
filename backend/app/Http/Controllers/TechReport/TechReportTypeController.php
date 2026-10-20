<?php

namespace App\Http\Controllers\TechReport;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use App\Models\TechReportType;

class TechReportTypeController extends Controller
{
    
    public function DeleteTechReportType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'report_type_id'=>'required|numeric|exists:tech_report_types,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $techReportType=  TechReportType::where('id',$request->report_type_id)->first();

          if(!empty($techReportType->id)){

            $techReportType->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Report Status not found"],"Validator Errors",400);

          }
         
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateTechReportType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'tech_report_type' => 'required|string|unique:tech_report_types',
                'token'=>'required|string',
                'report_type_id'=>'required|numeric|exists:tech_report_types,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $techReportType=  TechReportType::where('id',$request->report_type_id)->first();

          if(!empty($techReportType->id)){

            $techReportType->update([
                'tech_report_type' =>$request->tech_report_type,
            ]);

            return ResponseApi::acceptedResponseApi($techReportType,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Report Status not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateTechReportType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'tech_report_type' => 'required|string|unique:tech_report_types',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $techReportType=  TechReportType::create([

            'tech_report_type' =>$request->tech_report_type,
           ]);
         
        
          return ResponseApi::acceptedResponseApi($techReportType,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllTechReportType(){
        try{
          $techReportType = TechReportType::all();
          if(!empty($techReportType[0]->id)){
            foreach($techReportType as $dep){
            $array_reponse[] = [ 
                'tech_report_type' =>$dep->tech_report_type,
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
     * @param  \App\Models\TechReportType  $techReportType
     * @return \Illuminate\Http\Response
     */
    public function show(TechReportType $techReportType)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\TechReportType  $techReportType
     * @return \Illuminate\Http\Response
     */
    public function edit(TechReportType $techReportType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\TechReportType  $techReportType
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, TechReportType $techReportType)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\TechReportType  $techReportType
     * @return \Illuminate\Http\Response
     */
    public function destroy(TechReportType $techReportType)
    {
        //
    }
}
