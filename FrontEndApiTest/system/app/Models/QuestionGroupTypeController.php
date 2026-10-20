<?php

namespace App\Http\Controllers\Rating;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Models\AskForRate;
use Illuminate\Http\Request;
use App\Http\Controllers\ApiMessage\MessageController;
use App\Models\User;
use App\Models\Question;
use App\Models\QuestionGroup;
use App\Http\Controllers\Controller;
use Validator;
use App\Models\QuestionGroupType;

class QuestionGroupTypeController extends Controller
{
       

    public function DeleteQuestionGroupType(Request $request){
         try{
             $validator = Validator::make($request->all(), [
                  'token'=>'required|string',
                  'group_type_id'=>'required|numeric|exists:question_group_types,id'
                 ]);
             if ($validator->fails()) {
     
                 return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }
 
           $reportStatus=  QuestionGroupType::where('id',$request->group_type_id)->first();
 
           if(!empty($reportStatus->id)){
 
             $reportStatus->delete();
 
             return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);
 
           }else{
             return ResponseApi::badMethodErrorResponse(['message'=>"Question Group Type not found"],"Validator Errors",400);
 
           }
          
         }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
         
     }
     public function UpdateQuestionGroupType(Request $request){
         try{
             $validator = Validator::make($request->all(), [
                 'group_type_name' => 'required|string|unique:question_group_types',
                 'token'=>'required|string',
                 'group_type_id'=>'required|numeric|exists:question_group_types,id'
             ]);
             if ($validator->fails()) {
     
                 return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }
 
           $reportStatus=  QuestionGroupType::where('id',$request->group_type_id)->first();
 
           if(!empty($reportStatus->id)){
 
             $reportStatus->update([
                 'group_type_name' =>$request->group_type_name,
             ]);
 
             return ResponseApi::acceptedResponseApi($reportStatus,"success",201);
 
           }else{
             return ResponseApi::badMethodErrorResponse(['message'=>"Question Group Type not found"],"Validator Errors",400);
 
           }
          
         
 
              
         }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
         
     }
     public function CreateQuestionGroupType(Request $request){
         try{
             $validator = Validator::make($request->all(), [
                 'group_type_name' => 'required|string|unique:question_group_types',
                 'token'=>'required|string'
             ]);
             if ($validator->fails()) {
     
                 return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }
 
           $reportStatus=  QuestionGroupType::create([
             'group_type_name'=>$request->group_type_name,
            ]);
          
         
           return ResponseApi::acceptedResponseApi($reportStatus,"success",201);
 
              
         }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
         
     }
 
 
     public function GetAllQuestionGroupType(){
         try{
           $reportStatus = QuestionGroupType::all();
           if(!empty($reportStatus[0]->id)){
             foreach($reportStatus as $dep){
             $array_reponse[] = [ 
                 'group_type_name' =>$dep->group_type_name,
                 'id'=>$dep->id.'',
            
             ];
 
         }
             return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
 
           }else{
             return ResponseApi::notFoundResponse(['message'=>"Empty Question Group Type"],"Empty",200);
 
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
     * @param  \App\Models\QuestionGroupType  $questionGroupType
     * @return \Illuminate\Http\Response
     */
    public function show(QuestionGroupType $questionGroupType)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\QuestionGroupType  $questionGroupType
     * @return \Illuminate\Http\Response
     */
    public function edit(QuestionGroupType $questionGroupType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\QuestionGroupType  $questionGroupType
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, QuestionGroupType $questionGroupType)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\QuestionGroupType  $questionGroupType
     * @return \Illuminate\Http\Response
     */
    public function destroy(QuestionGroupType $questionGroupType)
    {
        //
    }
}
