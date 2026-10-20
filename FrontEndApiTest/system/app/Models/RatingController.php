<?php

namespace App\Http\Controllers\Rating;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Models\AskForRate;
use Illuminate\Http\Request;
use App\Http\Controllers\ApiMessage\MessageController;
use App\Models\User;
use App\Models\Rating;
use App\Http\Controllers\Controller;
use Validator;
use App\Models\UserQuestionAnswers;
use App\Models\QuestionAnswersComment;
use App\Models\QuestionAnswers;


class RatingController extends Controller
{
    
    public function CastArrayRateTotal(AskForRate $dep){
            $my_total_rate = 0;
            $reportStatus = Rating::where('ask_to_rate_id',$dep->id)->get();
        
         $question = [];
         foreach($reportStatus as $report){
            $question [] = [
                'question_id'=>$report->question_id,
                'question'=>!empty($report->question_id)?$report->question_id_fun->question:null,
                'question_group_id'=>!empty($report->question_id)?$report->question_id_fun->question_group_id:null,
                'rate'=>!empty($report->rate)?(float)$report->rate:null,
                'comment'=>$report->comment,
                'question_type_id'=>!empty($report->question_id)?$report->question_id_fun->question_type_id:null,

            ];
         }
         $question_answer_join = QuestionAnswers::select('*')
                        ->join('user_question_answers', 'user_question_answers.question_answer_id', '=', 'question_answers.id')
                        ->where('user_question_answers.ask_to_rate_id', $dep->id)
                        ->get()->unique('question_id');

        
        

         foreach($question_answer_join as $report){
            $answer =[];
            $user_answers = UserQuestionAnswers::whereHas('question_answer_id_fun',function($q) use($report){
                $q->where('question_id',$report->question_id);
            })->where('ask_to_rate_id',$dep->id)->get();
            $comment = null;
            if(!empty($user_answers[0]->id)){
            foreach ($user_answers as $value) {
                $answer [] = $value->question_answer_id_fun->answer;
                # code...
            }
            $comment_array = QuestionAnswersComment::where('user_question_answer_id',$user_answers[0]->id)->first();
            if(!empty($comment_array->id)){
                $comment = $comment_array->comment;
            }
            }

            $question [] = [
                'question_id'=>$report->question_id,
                'question'=>!empty($report->question_id_fun)?$report->question_id_fun->question:null,
                'question_group_id'=>!empty($report->question_id_fun)?$report->question_id_fun->question_group_id:null,
                'comment'=>$comment,
                'question_type_id'=>!empty($report->question_id_fun)?$report->question_id_fun->question_type_id:null,
                'answer'=>$answer,
            ];
         }

         

         $rate = Rating::whereHas('ask_to_rate_id_fun', function($q) use ($dep){
            $q->where('user_to_rate_id',$dep->user_to_rate_id);
          })->whereHas('question_id_fun',function($q){
            $q->where('question_type_id',1);
          })->get();

          $my_total_rate = !empty($rate[0]->id)? ($rate->sum('rate')/$rate->count('id')):0;

        $array_reponse = [
            'ask_to_rate_id'=>$dep->id,
            'user_creator_id'=>!empty($dep->user_creator_id)?$dep->user_creator_id:(!empty($dep->client_account_id)?$dep->client_account_id:null),
            'user_creator_name'=>!empty($dep->user_creator_id)?$dep->user_creator_id_fun->username:(!empty($dep->client_account_id)?$dep->client_account_id_fun->fullname:null),
           
            'user_rate_id'=>!empty($dep->user_rate_id)?$dep->user_rate_id:(!empty($dep->client_account_id)?$dep->client_account_id:null),
            'user_rate_name'=>!empty($dep->user_rate_id)?$dep->user_rate_id_fun->username:(!empty($dep->client_account_id)?$dep->client_account_id_fun->fullname:null),
           
             'user_to_rate_id'=>!empty($dep->user_to_rate_id)?$dep->user_to_rate_id:null,
             'user_to_rate_name'=>!empty($dep->user_to_rate_id)?$dep->user_to_rate_id_fun->username:null,
            'total_rate'=>$my_total_rate,
             'status'=>$dep->status,
             'task_id'=>$dep->task_id,
             'task_name'=>!empty($dep->task_id_fun)?$dep->task_id_fun->task_title:null,
             'ticket_id'=>$dep->ticket_id,
             'ticket_name'=>!empty($dep->ticket_id_fun)?$dep->ticket_id_fun->title:null,
             'created_at'=>$dep->updated_at,
             'questions'=>$question,
        ];
        return $array_reponse;
    }

    public function CastArrayRate(Rating $dep){
        $array_reponse = [
            'ask_to_rate_id'=>$dep->ask_to_rate_id,
            'question_id'=>$dep->question_id,
            'question'=>!empty($dep->question_id)?$dep->question_id_fun->question:null,
            'isRate'=>!empty($dep->question_id)?$dep->question_id_fun->rate:null,
            'question_group_id'=>!empty($dep->question_id)?$dep->question_id_fun->question_group_id:null,
            'rate'=>$dep->rate,
            'comment'=>$dep->comment,
            'user_creator_id'=>!empty($dep->ask_to_rate_id)?$dep->ask_to_rate_id_fun->user_creator_id:null,
            'user_creator_name'=>!empty($dep->ask_to_rate_id)?$dep->ask_to_rate_id_fun->user_creator_id_fun->username:null,
             'status'=>!empty($dep->ask_to_rate_id)?$dep->ask_to_rate_id_fun->status:0,
             'user_rate_id'=>!empty($dep->ask_to_rate_id)?$dep->ask_to_rate_id_fun->user_rate_id:null,
             'user_rate_name'=>!empty($dep->ask_to_rate_id)?$dep->ask_to_rate_id_fun->user_rate_id_fun->username:null,
             'user_to_rate_id'=>!empty($dep->ask_to_rate_id)?$dep->ask_to_rate_id_fun->user_to_rate_id:null,
             'user_to_rate_name'=>!empty($dep->ask_to_rate_id)?$dep->ask_to_rate_id_fun->user_to_rate_id_fun->username:null,
        ];
        return $array_reponse;
    }

    
    public function DeleteRating(Request $request){
         try{
             $validator = Validator::make($request->all(), [
                  'token'=>'required|string',
                  'rating_id'=>'required|numeric|exists:ratings,id'
                ]);
             if ($validator->fails()) {
     
                 return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }         
             
             $reportStatus  = Rating::where('id',$request->rating_id)->first();

 
 
           if(!empty($reportStatus->id)){
 
             $reportStatus->delete();
 
             return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);
 
           }else{
             return ResponseApi::badMethodErrorResponse(['message'=>"Rating not found"],"Validator Errors",400);
 
           }
          
         }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
         
    }



     public function UpdateRating(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'rating_id'=>'required|numeric|exists:ratings,id'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

            $rat  = Rating::where('id',$request->rating_id)->first();
            if(!empty($rat->id)){
                $rat->update($request->all());
                return ResponseApi::acceptedResponseApi(['message'=>'added success'],"success",201);

            }else{
                return ResponseApi::notFoundResponse(['message'=>"Empty Rating "],"Empty",200);


            }

              
                     
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

     public function CreateRating(Request $request){
         try{
             $validator = Validator::make($request->all(), [
                  'token'=>'required|string',
                 'questions'=>'required|array',
                 'ask_to_rate_id'=>'numeric|exists:ask_for_rates,id',
                 'question_group_id'=>'required|numeric|exists:question_groups,id',
                 'user_to_rate_id'=>'numeric|exists:users,id'

             ]);
             if ($validator->fails()) {
     
                 return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }

             if(!$request->has('ask_to_rate_id')&& !$request->has('user_to_rate_id')){
                $validator = Validator::make($request->all(), [
                   'ask_to_rate_id'=>'required|numeric|exists:ask_for_rates,id',
                   'user_to_rate_id'=>'required|numeric|exists:users,id'
  
               ]);
               if ($validator->fails()) {
     
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }


             }

             if($request->has('ask_to_rate_id')){
                $ask_to_rate_id = $request->ask_to_rate_id;
             }else{
                $ask_to_rate = AskForRate::create([
                    'user_creator_id'=>Auth::guard('user_api')->user()->id,
                    'question_group_id'=>$request->question_group_id,
                    'status'=>1,
                    'user_rate_id'=>Auth::guard('user_api')->user()->id,
                    'user_to_rate_id'=>$request->user_to_rate_id,
                ]);
                if(!empty($ask_to_rate->id)){
                    $ask_to_rate_id = $ask_to_rate->id;
                }else{
                    return ResponseApi::badMethodErrorResponse(["message"=>'Creation Error'],"Validator Errors",400);

                }
             }
            foreach ($request->questions as $dep) { 
            //    $dep = json_decode($dep, true);

            if($dep['question_type_id']==1 ||$dep['question_type_id']==3){
                Rating::create([
                    'ask_to_rate_id'=>$ask_to_rate_id,
                    'question_id'=>$dep['question_id'],
                    'comment'=>!empty($dep['comment'])?$dep['comment']:null,
                    'rate'=>!empty($dep['rate'])?$dep['rate']:0
                ]);
            }else{
                $flag = true;
                foreach($dep['answer'] as $dep2){
                   $user_question_answers_id = UserQuestionAnswers::create([
                        'question_answer_id'=>$dep2,
                        'ask_to_rate_id'=>$ask_to_rate_id,
                    
                    ]);
                    if(!empty($dep['comment']) && $flag ==true && !empty($user_question_answers_id->id)){
                        QuestionAnswersComment::create([
                            'user_question_answer_id'=>$user_question_answers_id->id,
                            'comment'=>$dep['comment'],
                        ]);
                        $flag = false;
                    }
                }
               
            }
                
            }
            $reportStatus=  AskForRate::where('id',$request->ask_to_rate_id)->first();

            if(!empty($reportStatus->id)){
                $reportStatus->update([
                    'status'=>1,
                ]);
            }
         
           return ResponseApi::acceptedResponseApi(['message'=>'added success'],"success",201);
 
              
         }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
         
     }
 
     public function CreateRatingClient(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'questions'=>'required|array',
                'ask_to_rate_id'=>'numeric|exists:ask_for_rates,id',
                'question_group_id'=>'required|numeric|exists:question_groups,id',
                'user_to_rate_id'=>'required|numeric|exists:users,id'

            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

            if($request->has('ask_to_rate_id')){
               $ask_to_rate_id = $request->ask_to_rate_id;
            }else{
               $ask_to_rate = AskForRate::create([
                   'user_creator_id'=>Auth::guard('user_api')->user()->id,
                   'question_group_id'=>$request->question_group_id,
                   'status'=>1,
                   'user_rate_id'=>Auth::guard('user_api')->user()->id,
                   'user_to_rate_id'=>$request->user_to_rate_id,
               ]);
               if(!empty($ask_to_rate->id)){
                   $ask_to_rate_id = $ask_to_rate->id;
               }else{
                   return ResponseApi::badMethodErrorResponse(["message"=>'Creation Error'],"Validator Errors",400);

               }
            }
           foreach ($request->questions as $dep) { 
           //    $dep = json_decode($dep, true);

           if($dep['question_type_id']==1 ||$dep['question_type_id']==3){
               Rating::create([
                   'ask_to_rate_id'=>$ask_to_rate_id,
                   'question_id'=>$dep['q_id'],
               'comment'=>!empty($dep['q_comment'])?$dep['q_comment']:null,
               'rate'=>!empty($dep['q_rate'])?$dep['q_rate']:0
               ]);
           }else{
               foreach($dep['answer'] as $dep2){
                   if($dep2)
                   UserQuestionAnswers::create([
                       'question_answer_id'=>$dep2,
                       'ask_to_rate_id'=>$ask_to_rate_id,
                   
                   ]);
               }
              
           }
               
           }
           $reportStatus=  AskForRate::where('id',$request->ask_to_rate_id)->first();

           if(!empty($reportStatus->id)){
               $reportStatus->update([
                   'status'=>1,
               ]);
           }
        
          return ResponseApi::acceptedResponseApi(['message'=>'added success'],"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

 
     public function GetAllMyRating(Request $request){
         try{
        $validator = Validator::make($request->all(), [
            'token'=>'required|string',
       ]);
       if ($validator->fails()) {

           return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
       }
           $reportStatus = Rating::where('ask_to_rate_id_fun.user_to_rate_id',Auth::guard('user_api')->user()->id)->get();
           if(!empty($reportStatus[0]->id)){
             foreach($reportStatus as $dep){
             $array_reponse[] = $this->CastArrayRate($dep);
 
         }
             return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
 
           }else{
             return ResponseApi::notFoundResponse(['message'=>"Empty Rating "],"Empty",200);
 
           }
              
         }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
         
     }

     public function GetSpecificRating(Request $request){
          try{
         $validator = Validator::make($request->all(), [
             'token'=>'required|string',
            ///'rating_id'=>'required|numeric|exists:ratings,id'
             'user_id'=>'required|numeric|exists:users,id'

        ]);
        if ($validator->fails()) {
 
            return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
        }

        if((Auth::guard('user_api')->user()->id == $request->id || 
        Auth::guard('user_api')->user()->sub_departments_id_fun->departments_id==1)){

            $reportStatus = AskForRate::where('user_to_rate_id',$request->user_id)->get();
        }
        //    $reportStatus = Rating::where('id',$request->rating_id)->first();
      //  return ResponseApi::acceptedResponseApi($reportStatus,"success",201);

        if(!empty($reportStatus[0]->id)){
        foreach($reportStatus as $report){

              $array_reponse[] =$this->CastArrayRateTotal($report);
            }
           
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
            }else{
              return ResponseApi::notFoundResponse(['message'=>"Empty Rate "],"Empty",200);
  
            }
               
          }catch(\Exception $e){
              return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
  
          }
          
      }
      public function GetMyEmployeeRating(Request $request){
          try{
         $validator = Validator::make($request->all(), [
             'token'=>'required|string',
            ///'rating_id'=>'required|numeric|exists:ratings,id'

        ]);
        if ($validator->fails()) {
 
            return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
        }

       
            $reportStatus = AskForRate::where('user_rate_id',Auth::guard('user_api')->user()->id)->where('status',1)->get();
        
        //    $reportStatus = Rating::where('id',$request->rating_id)->first();
      //  return ResponseApi::acceptedResponseApi($reportStatus,"success",201);

        if(!empty($reportStatus[0]->id)){
        foreach($reportStatus as $report){

              $array_reponse[] =$this->CastArrayRateTotal($report);
            }
           
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
            }else{
              return ResponseApi::notFoundResponse(['message'=>"Empty Rate "],"Empty",200);
  
            }
               
          }catch(\Exception $e){
              return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
  
          }
          
      }


      public function CreateTaskRate(Request $request){
         try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
            ///'rating_id'=>'required|numeric|exists:ratings,id'
            'questions'=>'required|array',
            'question_group_id'=>'required|numeric|exists:question_groups,id',
            'user_to_rate_id'=>'numeric|exists:users,id',
            'task_id'=>'numeric|exists:tasks,id'


        ]);
        if ($validator->fails()) {

            return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
        }

        $exist_before = AskForRate::where('task_id',$request->task_id)->where('user_to_rate_id',$request->user_to_rate_id)->first();

        if(!empty($exist_before->id)){
            $askforRate = $exist_before ;
            Rating::where('ask_to_rate_id',$exist_before->id)->delete();
           $answers = UserQuestionAnswers::where('ask_to_rate_id',$exist_before->id)->get();
           foreach ($answers as  $value) {
            QuestionAnswersComment::where('user_question_answer_id',$value->id)->delete();
            $answers->delete();
           }

        }else{
            $askforRate = AskForRate::create([
                'user_creator_id'=>Auth::guard('user_api')->user()->id,
                'question_group_id'=>$request->question_group_id,
                'status'=>1,
                'user_rate_id'=>Auth::guard('user_api')->user()->id,
                'user_to_rate_id'=>$request->user_to_rate_id,
                'client_account_id'=>null,
                'task_id'=>$request->task_id
            ]);
        }
        if(!empty($askforRate->id)){
            foreach ($request->questions as $dep) { 
                //    $dep = json_decode($dep, true);
    
                if($dep['question_type_id']==1 ||$dep['question_type_id']==3){
                    Rating::create([
                        'ask_to_rate_id'=>$askforRate->id,
                        'question_id'=>$dep['question_id'],
                        'comment'=>!empty($dep['comment'])?$dep['comment']:null,
                        'rate'=>!empty($dep['rate'])?$dep['rate']:0
                    ]);
                }else{
                    $flag = true;
                    foreach($dep['answer'] as $dep2){
                       $user_question_answers_id = UserQuestionAnswers::create([
                            'question_answer_id'=>$dep2,
                            'ask_to_rate_id'=>$askforRate->id,
                        
                        ]);
                        if(!empty($dep['comment']) && $flag ==true && !empty($user_question_answers_id->id)){
                            QuestionAnswersComment::create([
                                'user_question_answer_id'=>$user_question_answers_id->id,
                                'comment'=>$dep['comment'],
                            ]);
                            $flag = false;
                        }
                    }
                   
                }
                    
                }
        }



         }catch(\Exception $e){
              return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
  
          }

      }

      public function CreateTicketRate(Request $request){
        try{
           $validator = Validator::make($request->all(), [
               'token'=>'required|string',
           ///'rating_id'=>'required|numeric|exists:ratings,id'
           'questions'=>'required|array',
           'question_group_id'=>'required|numeric|exists:question_groups,id',
           'user_to_rate_id'=>'numeric|exists:users,id',
           'ticket_id'=>'numeric|exists:tickets,id'


       ]);
       if ($validator->fails()) {

           return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
       }
       $exist_before = AskForRate::where('ticket_id',$request->ticket_id)->where('user_to_rate_id',$request->user_to_rate_id)->first();

       if(!empty($exist_before->id)){
           $askforRate = $exist_before ;
           Rating::where('ask_to_rate_id',$exist_before->id)->delete();
          $answers = UserQuestionAnswers::where('ask_to_rate_id',$exist_before->id)->get();
          foreach ($answers as  $value) {
           QuestionAnswersComment::where('user_question_answer_id',$value->id)->delete();
           $answers->delete();
          }

       }else{
       $askforRate = AskForRate::create([
           'user_creator_id'=>Auth::guard('user_api')->user()->id,
           'question_group_id'=>$request->question_group_id,
           'status'=>1,
           'user_rate_id'=>Auth::guard('user_api')->user()->id,
           'user_to_rate_id'=>$request->user_to_rate_id,
           'client_account_id'=>null,
           'ticket_id'=>$request->ticket_id
       ]);
    }
       if(!empty($askforRate->id)){
           foreach ($request->questions as $dep) { 
               //    $dep = json_decode($dep, true);
   
               if($dep['question_type_id']==1 ||$dep['question_type_id']==3){
                   Rating::create([
                       'ask_to_rate_id'=>$askforRate->id,
                       'question_id'=>$dep['question_id'],
                       'comment'=>!empty($dep['comment'])?$dep['comment']:null,
                       'rate'=>!empty($dep['rate'])?$dep['rate']:0
                   ]);
               }else{
                   $flag = true;
                   foreach($dep['answer'] as $dep2){
                      $user_question_answers_id = UserQuestionAnswers::create([
                           'question_answer_id'=>$dep2,
                           'ask_to_rate_id'=>$askforRate->id,
                       
                       ]);
                       if(!empty($dep['comment']) && $flag ==true && !empty($user_question_answers_id->id)){
                           QuestionAnswersComment::create([
                               'user_question_answer_id'=>$user_question_answers_id->id,
                               'comment'=>$dep['comment'],
                           ]);
                           $flag = false;
                       }
                   }
                  
               }
                   
               }
       }



        }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }

     }
    






   
     public function CreateTicketRateClient(Request $request){
        try{
           $validator = Validator::make($request->all(), [
               'token'=>'required|string',
           ///'rating_id'=>'required|numeric|exists:ratings,id'
           'questions'=>'required|array',
           'question_group_id'=>'required|numeric|exists:question_groups,id',
           'user_to_rate_id'=>'numeric|exists:users,id',
           'ticket_id'=>'numeric|exists:tickets,id'


       ]);
       if ($validator->fails()) {

           return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
       }

       $exist_before = AskForRate::where('ticket_id',$request->ticket_id)->where('user_to_rate_id',$request->user_to_rate_id)->first();

       if(!empty($exist_before->id)){
           $askforRate = $exist_before ;
           Rating::where('ask_to_rate_id',$exist_before->id)->delete();
          $answers = UserQuestionAnswers::where('ask_to_rate_id',$exist_before->id)->get();
          foreach ($answers as  $value) {
           QuestionAnswersComment::where('user_question_answer_id',$value->id)->delete();
           $answers->delete();
          }

       }else{
       $askforRate = AskForRate::create([
           'user_creator_id'=>null,
           'question_group_id'=>$request->question_group_id,
           'status'=>1,
           'user_rate_id'=>null,
           'user_to_rate_id'=>$request->user_to_rate_id,
           'client_account_id'=>Auth::guard('client_api')->user()->id,
           'ticket_id'=>$request->ticket_id
       ]);
    }
       if(!empty($askforRate->id)){
           foreach ($request->questions as $dep) { 
               //    $dep = json_decode($dep, true);
   
               if($dep['question_type_id']==1 ||$dep['question_type_id']==3){
                   Rating::create([
                       'ask_to_rate_id'=>$askforRate->id,
                       'question_id'=>$dep['question_id'],
                       'comment'=>!empty($dep['comment'])?$dep['comment']:null,
                       'rate'=>!empty($dep['rate'])?$dep['rate']:0
                   ]);
               }else{
                   $flag = true;
                   foreach($dep['answer'] as $dep2){
                      $user_question_answers_id = UserQuestionAnswers::create([
                           'question_answer_id'=>$dep2,
                           'ask_to_rate_id'=>$askforRate->id,
                       
                       ]);
                       if(!empty($dep['comment']) && $flag ==true && !empty($user_question_answers_id->id)){
                           QuestionAnswersComment::create([
                               'user_question_answer_id'=>$user_question_answers_id->id,
                               'comment'=>$dep['comment'],
                           ]);
                           $flag = false;
                       }
                   }
                  
               }
                   
               }
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
     * @param  \App\Models\Rating  $rating
     * @return \Illuminate\Http\Response
     */
    public function show(Rating $rating)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Rating  $rating
     * @return \Illuminate\Http\Response
     */
    public function edit(Rating $rating)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Rating  $rating
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Rating $rating)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Rating  $rating
     * @return \Illuminate\Http\Response
     */
    public function destroy(Rating $rating)
    {
        //
    }
}
