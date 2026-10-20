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
use App\Models\QuestionAnswers;
use App\Http\Controllers\Controller;
use Validator;

class QuestionController extends Controller
{

 

    public function DeleteQuestion(Request $request){
         try{
             $validator = Validator::make($request->all(), [
                  'token'=>'required|string',
                  'question_id' => 'required|string|exists:questions,id',
                ]);
             if ($validator->fails()) {
     
                 return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }
 
           $reportStatus=  Question::where('id',$request->question_id)->first();
 
           if(!empty($reportStatus->id)){
                 $reportStatus->delete();
 
             return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);
 
           }else{
             return ResponseApi::badMethodErrorResponse(['message'=>"Question not found"],"Validator Errors",400);
 
           }
          
         }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
         
    }

    public function UpdateQuestion(Request $request){
         try{
             $validator = Validator::make($request->all(), [
                 'question_id' => 'required|string|exists:questions,id',
                 'token'=>'required|string',
             ]);
             if ($validator->fails()) {
     
                 return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }
 
           $reportStatus=  Question::where('id',$request->question_id)->first();
 
           if(!empty($reportStatus->id)){
            $delete_prev = QuestionAnswers::where('question_id',$request->question_id)->get();
            if(!empty($delete_prev[0]->id)){
              foreach($delete_prev as $dep){

                $dep->delete();
              }
            }


            if($request->has('question_type_id')){
              if($request->question_type_id ==2){
                $validator = Validator::make($request->all(), [              
                  'answer'=>'required|array',
              ]);
              if ($validator->fails()) {
      
                  return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
              }
              
              if(!empty($reportStatus->id)){
               $data = $request->answer;

                foreach ($data as $dep) {
                  $exist = null;
                  if(!empty($dep['id'])){

                    $exist = QuestionAnswers::where('id',$dep['id'])->withTrashed()->first();
                  }
                  if(!empty($exist->id)){
                    $exist->update([
                      'answer'=>$dep['answer'],
                    ]);
                    $exist = QuestionAnswers::where('id',$dep['id'])->withTrashed()->first();

                    $exist->restore();
                    
                  }else{
                    QuestionAnswers::create([
                      'user_creator_id'=>Auth::guard('user_api')->user()->id,
                      'question_id'=>$reportStatus->id,
                      'answer'=>$dep['answer'],
                    ]);
                  }
                
              }
            }
              }
            }
             $reportStatus->update($request->all());
 
             return ResponseApi::acceptedResponseApi($reportStatus,"success",201);
 
           }else{
             return ResponseApi::badMethodErrorResponse(['message'=>"Question not found"],"Validator Errors",400);
 
           }
          
         
 
              
         }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
         
    }


     public function CreateQuestion(Request $request){
         try{
             $validator = Validator::make($request->all(), [
                  'token'=>'required|string',
                 'question'=>'required|string',
                 'isMulti'=>'boolean',
                 'question_type_id'=>'numeric|exists:question_types,id',
                 'question_group_id'=>'numeric|exists:question_groups,id'
             ]);
             if ($validator->fails()) {
     
                 return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }
 
             if($request->question_type_id ==1){
                $reportStatus=  Question::create([
                  'user_creator_id'=>Auth::guard('user_api')->user()->id,
                  'question_group_id'=>!empty($request->question_group_id)?$request->question_group_id:1,
                  'question_type_id'=>$request->question_type_id,
                  'question'=>$request->question,
                  'isMulti'=>false,
                ]);
          
             }else if($request->question_type_id ==2){
                $validator = Validator::make($request->all(), [              
                    'answer'=>'required|array',
                ]);
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
                  $reportStatus=  Question::create([
                    'user_creator_id'=>Auth::guard('user_api')->user()->id,
                    'question_group_id'=>!empty($request->question_group_id)?$request->question_group_id:1,
                    'question_type_id'=>$request->question_type_id,
                    'question'=>$request->question,
                    'isMulti'=>$request->isMulti,
                  ]);
                  if(!empty($reportStatus->id)){
                    // $data = json_decode($request->question_answer,false);
                    // return ResponseApi::badMethodErrorResponse($data,"Validator Errors",400);

                     foreach ($request->answer as $dep) {
                    
                    QuestionAnswers::create([
                      'user_creator_id'=>Auth::guard('user_api')->user()->id,
                      'question_id'=>$reportStatus->id,
                      'answer'=>$dep,
                    ]);
                  }
                  }
             }else if($request->question_type_id ==3){
              $reportStatus=  Question::create([
                'user_creator_id'=>Auth::guard('user_api')->user()->id,
                'question_group_id'=>!empty($request->question_group_id)?$request->question_group_id:1,
                'question_type_id'=>$request->question_type_id,
                'question'=>$request->question,
                'isMulti'=>false,
              ]);
             }
              
         
           return ResponseApi::acceptedResponseApi($reportStatus,"success",201);
 
              
         }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
         
     }
 
 
     public function GetSpecificQuestions(Request $request){
         try{
        $validator = Validator::make($request->all(), [
            'token'=>'required|string',
           'question_group_id'=>'numeric|exists:question_groups,id'
       ]);
       if ($validator->fails()) {

           return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
       }
           $reportStatus = Question::where('question_group_id',$request->question_group_id)->get();
           if(!empty($reportStatus[0]->id)){
             foreach($reportStatus as $dep){
              $answers = [];
                if($dep->question_type_id==2){
                  $answers_dep =QuestionAnswers::where('question_id',$dep->id)->get();

                  if(!empty($answers_dep[0]->id)){
                    foreach ($answers_dep as  $value) {
                      # code...
                   
                    $answers [] = [
                      'user_creator_id'=>$value->user_creator_id,
                      'user_creator_name'=>$value->user_creator_id_fun->username,
                      'answer'=>$value->answer,
                      'id'=>$value->id.'',
                      'created_at'=>$value->created_at
                    ];
                  }
               
                }
                $array_reponse[] = [ 
                  'question_group_id'=>$dep->question_group_id,
                  'question_group_title'=>$dep->question_group_id_fun->question_group_title,
                  'isMulti'=>$dep->isMulti,
                   'question' =>$dep->question,
                   'id'=>$dep->id.'',
                   'user_creator_id'=>$dep->user_creator_id,
                   'user_creator_name'=>$dep->user_creator_id_fun->username,
                   'question_type_name'=>!empty($dep->question_type_id)?$dep->question_type_id_fun->question_type:null,
                   'question_type_id'=>$dep->question_type_id,
                   'return_answer'=>$answers,
  
   
               ];
   
                  
                }else if($dep->question_type_id==1){
                  $array_reponse[] = [ 
                    'question_group_id'=>$dep->question_group_id,
                    'question_group_title'=>$dep->question_group_id_fun->question_group_title,
                    'isMulti'=>$dep->isMulti,
                     'question' =>$dep->question,
                     'id'=>$dep->id.'',
                     'user_creator_id'=>$dep->user_creator_id,
                     'user_creator_name'=>$dep->user_creator_id_fun->username,
                     'question_type_name'=>!empty($dep->question_type_id)?$dep->question_type_id_fun->question_type:null,
                     'question_type_id'=>$dep->question_type_id,
                     'return_answer'=>$answers,
      
      
                 ];
      
                    
                  }
             
           
         }
      
     foreach($reportStatus as $dep){
      $answers = [];
        if($dep->question_type_id==3){
        $array_reponse[] = [ 
          'question_group_id'=>$dep->question_group_id,
          'question_group_title'=>$dep->question_group_id_fun->question_group_title,
          'isMulti'=>$dep->isMulti,
           'question' =>$dep->question,
           'id'=>$dep->id.'',
           'user_creator_id'=>$dep->user_creator_id,
           'user_creator_name'=>$dep->user_creator_id_fun->username,
           'question_type_name'=>!empty($dep->question_type_id)?$dep->question_type_id_fun->question_type:null,
           'question_type_id'=>$dep->question_type_id,
           'return_answer'=>$answers,


        ];

          
         }
      }
             return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
 
           }else{
             return ResponseApi::notFoundResponse(['message'=>"Empty Question "],"Empty",200);
 
           }
              
         }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
         
     }

     public function GetAllQuestions(Request $request){
          try{
         $validator = Validator::make($request->all(), [
             'token'=>'required|string',
        ]);
        if ($validator->fails()) {
 
            return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
        }
            $reportStatus = Question::all();
            if(!empty($reportStatus[0]->id)){
              foreach($reportStatus as $dep){
                $answers = [];
                if($dep->question_type_id){
                  $answers_dep =QuestionAnswers::where('question_id',$dep->id)->get();
                  if(!empty($answers_dep[0]->id)){
                    foreach ($answers_dep as  $value) {
                      # code...
                   
                    $answers [] = [
                      'user_creator_id'=>$value->user_creator_id,
                      'user_creator_name'=>$value->user_creator_id_fun->username,
                      'answer'=>$value->answer,
                      'id'=>$value->id.'',
                      'created_at'=>$value->created_at
                    ];
                  }
               
                }
                }
              $array_reponse[] = [ 
                 'question_group_id'=>$dep->question_group_id,
                 'question_group_title'=>$dep->question_group_id_fun->question_group_title,
                 'isMulti'=>$dep->isMulti,
                  'question' =>$dep->question,
                  'id'=>$dep->id.'',
                  'user_creator_id'=>$dep->user_creator_id,
                  'user_creator_name'=>$dep->user_creator_id_fun->username,
                  'question_type_name'=>!empty($dep->question_type_id)?$dep->question_type_id_fun->question_type:null,
                  'question_type_id'=>$dep->question_type_id,
                  'return_answer'=>$answers,
              ];
  
          }
              return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
  
            }else{
              return ResponseApi::notFoundResponse(['message'=>"Empty Question "],"Empty",200);
  
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
     * @param  \App\Models\Question  $question
     * @return \Illuminate\Http\Response
     */
    public function show(Question $question)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Question  $question
     * @return \Illuminate\Http\Response
     */
    public function edit(Question $question)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Question  $question
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Question $question)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Question  $question
     * @return \Illuminate\Http\Response
     */
    public function destroy(Question $question)
    {
        //
    }
}
