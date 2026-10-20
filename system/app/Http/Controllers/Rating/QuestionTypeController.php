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
use App\Models\QuestionType;

class QuestionTypeController extends Controller
{

    public function DeleteQuestionType(Request $request){
         try{
             $validator = Validator::make($request->all(), [
                  'token'=>'required|string',
                  'question_type_id'=>'required|numeric|exists:question_types,id'
                 ]);
             if ($validator->fails()) {
     
                 return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }
 
           $reportStatus=  QuestionType::where('id',$request->question_type_id)->first();
 
           if(!empty($reportStatus->id)){
 
             $reportStatus->delete();
 
             return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);
 
           }else{
             return ResponseApi::badMethodErrorResponse(['message'=>"Question Type not found"],"Validator Errors",400);
 
           }
          
         }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
         
     }
     public function UpdateQuestionType(Request $request){
         try{
             $validator = Validator::make($request->all(), [
                 'question_type_name' => 'required|string|unique:question_types',
                 'token'=>'required|string',
                 'question_type_id'=>'required|numeric|exists:question_types,id'
             ]);
             if ($validator->fails()) {
     
                 return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }
 
           $reportStatus=  QuestionType::where('id',$request->question_type_id)->first();
 
           if(!empty($reportStatus->id)){
 
             $reportStatus->update([
                 'question_type' =>$request->question_type,
             ]);
 
             return ResponseApi::acceptedResponseApi($reportStatus,"success",201);
 
           }else{
             return ResponseApi::badMethodErrorResponse(['message'=>"Question Type not found"],"Validator Errors",400);
 
           }
          
         
 
              
         }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
         
     }
     public function CreateQuestionType(Request $request){
         try{
             $validator = Validator::make($request->all(), [
                 'question_type' => 'required|string|unique:question_types',
                 'token'=>'required|string'
             ]);
             if ($validator->fails()) {
     
                 return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }
 
           $reportStatus=  QuestionType::create([
             'question_type'=>$request->question_type,
            ]);
          
         
           return ResponseApi::acceptedResponseApi($reportStatus,"success",201);
 
              
         }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
         
     }
 
 
     public function GetAllQuestionType(Request $request){
         try{
        $validator = Validator::make($request->all(), [
            'token'=>'required|string',
  
  
        ]);
        if ($validator->fails()) {
  
            return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
        }
           $reportStatus = QuestionType::all();
           if(!empty($reportStatus[0]->id)){
             foreach($reportStatus as $dep){
             $array_reponse[] = [ 
                 'question_type' =>$dep->question_type,
                 'id'=>$dep->id.'',
            
             ];
 
         }
             return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
 
           }else{
             return ResponseApi::notFoundResponse(['message'=>"Empty Question  Type"],"Empty",200);
 
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
     * @param  \App\Models\QuestionType  $questionType
     * @return \Illuminate\Http\Response
     */
    public function show(QuestionType $questionType)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\QuestionType  $questionType
     * @return \Illuminate\Http\Response
     */
    public function edit(QuestionType $questionType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\QuestionType  $questionType
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, QuestionType $questionType)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\QuestionType  $questionType
     * @return \Illuminate\Http\Response
     */
    public function destroy(QuestionType $questionType)
    {
        //
    }
}
