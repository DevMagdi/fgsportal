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


use App\Models\QuestionGroupUser;

class QuestionGroupUserController extends Controller
{



    public function DeleteQuestionGroupUser(Request $request){
         try{
             $validator = Validator::make($request->all(), [
                  'token'=>'required|string',
                  'question_group_id' => 'required|string|exists:question_groups,id',
                ]);
             if ($validator->fails()) {
     
                 return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }
 
             $delete_prev = QuestionGroupUser::where('question_group_id',$request->question_group_id)->get();
             if(!empty($delete_prev[0]->id)){
             foreach ($delete_prev as $value) {
                $value->delete();
             }

 
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
                'question_group_id' => 'required|string|exists:question_groups,id',
                'token'=>'required|string',
                'user_id' => 'required|array',
             ]);
             if ($validator->fails()) {
     
                 return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }

             $delete_prev = QuestionGroupUser::where('question_group_id',$request->question_group_id)->get();
             foreach ($delete_prev as $value) {
                $value->delete();
             }

             foreach ($request->user_id as $value) {
                $exist = QuestionGroupUser::where('user_id',$value)->where('question_group_id',$request->question_group_id)->withTrashed()->first();
                if(!empty($exist->id)){
                    $exist->restore();
                }else{
                    QuestionGroupUser::create([
                        'user_id'=>$value,
                        'user_creator_id'=>Auth::guard('user_api')->user()->id,
                        'question_group_id'=>$request->question_group_id,
                    ]);

                }
             }
 
 
             return ResponseApi::acceptedResponseApi($reportStatus,"success",201);
 
          
          
         
 
              
         }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
         
     }
     public function CreateUserQuestionGroup(Request $request){
         try{
             $validator = Validator::make($request->all(), [
                 'question_group_id' => 'required|string|exists:question_groups,id',
                 'token'=>'required|string',
                 'user_id' => 'required|array',

             ]);
             if ($validator->fails()) {
     
                 return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }


             foreach ($request->user_id as $dep) {
                QuestionGroupUser::create([
                    'user_id'=>$dep,
                    'user_creator_id'=>Auth::guard('user_api')->user()->id,
                    'question_group_id'=>$request->question_group_id,
                ]);
             }
 
           
          
         
           return ResponseApi::acceptedResponseApi(["message"=>"Created Success"],"success",201);
 
              
         }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
         
     }
 
 
     public function GetAllQuestionGroupUser(){
        try{
           $reportStatus = QuestionGroupUser::all();
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
     * @param  \App\Models\QuestionGroupUser  $questionGroupUser
     * @return \Illuminate\Http\Response
     */
    public function show(QuestionGroupUser $questionGroupUser)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\QuestionGroupUser  $questionGroupUser
     * @return \Illuminate\Http\Response
     */
    public function edit(QuestionGroupUser $questionGroupUser)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\QuestionGroupUser  $questionGroupUser
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, QuestionGroupUser $questionGroupUser)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\QuestionGroupUser  $questionGroupUser
     * @return \Illuminate\Http\Response
     */
    public function destroy(QuestionGroupUser $questionGroupUser)
    {
        //
    }
}
