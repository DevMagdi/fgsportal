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
use App\Models\QuestionGroupUser;
use App\Http\Controllers\Controller;
use Validator;


class QuestionGroupController extends Controller
{
    
     
 
    public function DeleteQuestionGroup(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'question_group_id'=>'required|numeric|exists:question_groups,id'
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus=  QuestionGroup::where('id',$request->question_group_id)->first();

          if(!empty($reportStatus->id)){

            $reportStatus->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Question Group not found"],"Validator Errors",400);

          }
         
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateQuestionGroup(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'question_group_title' => 'required|string',
                'token'=>'required|string',
                'question_group_id'=>'required|numeric|exists:question_groups,id',
                'user_id' => 'array',

            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus=  QuestionGroup::where('id',$request->question_group_id)->first();
          if($request->question_group_title != $reportStatus->question_group_title){
            $validator = Validator::make($request->all(), [
              'question_group_title' => 'required|string|unique:question_groups',
  
          ]);
          if ($validator->fails()) {
  
              return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
          }
          }

          if(!empty($reportStatus->id)){

            $reportStatus->update($request->all());

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

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Question Group not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateQuestionGroup(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'question_group_title' => 'required|string|unique:question_groups',
                'token'=>'required|string',
                'user_id' => 'array',
                'group_sub_type_id'=>'required|numeric|exists:question_group_sub_types,id'


            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus=  QuestionGroup::create([
            'user_creator_id'=>Auth::guard('user_api')->user()->id,
            'question_group_title'=>$request->question_group_title,
            'group_sub_type_id'=>$request->group_sub_type_id,
            'status'=>1 
           ]);

           if(!empty($reportStatus->id)){

             foreach ($request->user_id as $dep) {
              QuestionGroupUser::create([
                  'user_id'=>$dep,
                  'user_creator_id'=>Auth::guard('user_api')->user()->id,
                  'question_group_id'=>$reportStatus->id,
                            ]);
           }
           return ResponseApi::acceptedResponseApi($reportStatus,"success",201);

           }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Can't Create Question group"],"Validator Errors",500);


           }

        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }


    public function GetAllQuestionGroup(Request $request){
        try{

        $validator = Validator::make($request->all(), [
          'token'=>'required|string',


      ]);
      if ($validator->fails()) {

          return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
      }
          $reportStatus = QuestionGroup::all();
          if(!empty($reportStatus[0]->id)){
            foreach($reportStatus as $dep){
              $userss =[];
              $user_id =[];
              $question_user = QuestionGroupUser::where('question_group_id',$dep->id)->get();
              foreach ($question_user as  $value) {
                if(!empty($value->user_id)){

               $user_id[] = $value->user_id;
                  $userss[] = [
                    'user_id'=>$value->user_id,
                    'user_name'=>$value->user_id_fun->username
                  ];
                # code...
              }
              }
            $array_reponse[] = [ 
                'question_group_title' =>$dep->question_group_title,
                'id'=>$dep->id.'',
                'user_creator_id'=>$dep->user_creator_id,
                'user_creator_name'=>$dep->user_creator_id_fun->username,
                'group_type_name'=>!empty($dep->group_sub_type_id_fun->group_type_id_fun)?$dep->group_sub_type_id_fun->group_type_id_fun->group_type_name:null,
                'group_type_id'=>!empty($dep->group_sub_type_id_fun->group_type_id_fun)?$dep->group_sub_type_id_fun->group_type_id:null,
                'group_sub_type_id'=>!empty($dep->group_sub_type_id_fun)?$dep->group_sub_type_id:null,
                'group_sub_type_name'=>!empty($dep->group_sub_type_id_fun)?$dep->group_sub_type_id->group_sub_type:null,
                'user'=>$userss,
                'user_id'=>$user_id,
                'status'=>$dep->status

              
            ];

        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Question Group"],"Empty",200);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

    




    public function GetQuestionGroupByType(Request $request){
        try{
        $validator = Validator::make($request->all(), [
          'token'=>'required|string',
          'group_type_id'=>'required|numeric|exists:question_group_types,id'


      ]);
      if ($validator->fails()) {

          return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
      }
          $reportStatus = QuestionGroup::whereHas('group_sub_type_id_fun',function($q)use ($request){
            $q->where('group_type_id',$request->group_type_id);
          })->get();
          if(!empty($reportStatus[0]->id)){
            foreach($reportStatus as $dep){
              $userss =[];
              $user_id =[];
              $question_user = QuestionGroupUser::where('question_group_id',$dep->id)->get();
              foreach ($question_user as  $value) {
                if(!empty($value->user_id)){

               $user_id[] = $value->user_id;
                  $userss[] = [
                    'user_id'=>$value->user_id,
                    'user_name'=>$value->user_id_fun->username
                  ];
                # code...
              }
              }
            $array_reponse[] = [ 
                'question_group_title' =>$dep->question_group_title,
                'id'=>$dep->id.'',
                'user_creator_id'=>$dep->user_creator_id,
                'user_creator_name'=>$dep->user_creator_id_fun->username,
                'group_type_name'=>!empty($dep->group_sub_type_id_fun->group_type_id_fun)?$dep->group_sub_type_id_fun->group_type_id_fun->group_type_name:null,
                'group_type_id'=>!empty($dep->group_sub_type_id_fun->group_type_id_fun)?$dep->group_sub_type_id_fun->group_type_id:null,
                'group_sub_type_id'=>!empty($dep->group_sub_type_id_fun)?$dep->group_sub_type_id:null,
                'group_sub_type_name'=>!empty($dep->group_sub_type_id_fun)?$dep->group_sub_type_id_fun->group_sub_type:null,
                'user'=>$userss,
                'user_id'=>$user_id,
                'status'=>$dep->status
              
            ];

        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Question Group"],"Empty",200);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetQuestionGroupBySubType(Request $request){
       try{
        $validator = Validator::make($request->all(), [
          'token'=>'required|string',
          'group_sub_type_id'=>'required|numeric|exists:question_group_sub_types,id'


      ]);
      if ($validator->fails()) {

          return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
      }
          $reportStatus = QuestionGroup::whereHas('group_sub_type_id',$request->group_sub_type_id)->get();
          if(!empty($reportStatus[0]->id)){
            foreach($reportStatus as $dep){
              $userss =[];
              $user_id =[];
              $question_user = QuestionGroupUser::where('question_group_id',$dep->id)->get();
              foreach ($question_user as  $value) {
                if(!empty($value->user_id)){

               $user_id[] = $value->user_id;
                  $userss[] = [
                    'user_id'=>$value->user_id,
                    'user_name'=>$value->user_id_fun->username
                  ];
                # code...
              }
              }
            $array_reponse[] = [ 
                'question_group_title' =>$dep->question_group_title,
                'id'=>$dep->id.'',
                'user_creator_id'=>$dep->user_creator_id,
                'user_creator_name'=>$dep->user_creator_id_fun->username,
                'group_type_name'=>!empty($dep->group_sub_type_id_fun->group_type_id_fun)?$dep->group_sub_type_id_fun->group_type_id_fun->group_type_name:null,
                'group_type_id'=>!empty($dep->group_sub_type_id_fun->group_type_id_fun)?$dep->group_sub_type_id_fun->group_type_id:null,
                'group_sub_type_id'=>!empty($dep->group_sub_type_id_fun)?$dep->group_sub_type_id:null,
                'group_sub_type_name'=>!empty($dep->group_sub_type_id_fun)?$dep->group_sub_type_id->group_sub_type:null,
                'user'=>$userss,
                'user_id'=>$user_id,
                'status'=>$dep->status

              
            ];

        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Question Group"],"Empty",200);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

    public function GetActiveGroupsInOnDemand(Request $request){
        try{
        $validator = Validator::make($request->all(), [
          'token'=>'required|string',
 

      ]);
      if ($validator->fails()) {

          return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
      }
      if(Auth::guard('user_api')->user()->sub_departments_id_fun->departments_id!=1){
        $reportStatus = QuestionGroupUser::where('user_id',Auth::guard('user_api')->user()->id)->whereHas('question_group_id_fun',function($q){
          $q->whereIn('group_sub_type_id',[5,6,7,8]);
          $q->where('status',1);
        })->get();

          foreach($reportStatus as $dep){
        
          $array_reponse[] = [ 
              'question_group_title' =>$dep->question_group_id_fun->question_group_title,
              'id'=>$dep->question_group_id_fun->id.'',
        
          ];

      }

      }else{
          $reportStatus = QuestionGroup::whereIn('group_sub_type_id',[5,6,7,8])->where('status',1)->get();
            foreach($reportStatus as $dep){
          
            $array_reponse[] = [ 
                'question_group_title' =>$dep->question_group_title,
                'id'=>$dep->id.'',
          

              
            ];

        }
        }
        if(!empty($array_reponse[0])){
        
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Question Group"],"Empty",200);

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
     * @param  \App\Models\QuestionGroup  $questionGroup
     * @return \Illuminate\Http\Response
     */
    public function show(QuestionGroup $questionGroup)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\QuestionGroup  $questionGroup
     * @return \Illuminate\Http\Response
     */
    public function edit(QuestionGroup $questionGroup)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\QuestionGroup  $questionGroup
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, QuestionGroup $questionGroup)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\QuestionGroup  $questionGroup
     * @return \Illuminate\Http\Response
     */
    public function destroy(QuestionGroup $questionGroup)
    {
        //
    }
}
