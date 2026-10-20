<?php

namespace App\Http\Controllers\Rating;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Models\AskForRate;
use Illuminate\Http\Request;
use App\Http\Controllers\ApiMessage\MessageController;
use App\Models\User;
use App\Http\Controllers\Controller;
use Validator;
use App\Models\Question;
use DB;
use App\Models\QuestionGroup;
class AskForRateController extends Controller
{



    public function DeleteAskforRate(Request $request){
         try{
             $validator = Validator::make($request->all(), [
                  'token'=>'required|string',
                  'ask_for_rate_id'=>'required|numeric|exists:ask_for_rates,id'
                ]);
             if ($validator->fails()) {
     
                 return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }
 
           $reportStatus=  AskForRate::where('id',$request->ask_for_rate_id)->first();
 
           if(!empty($reportStatus->id)){
 
             $reportStatus->delete();
 
             return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);
 
           }else{
             return ResponseApi::badMethodErrorResponse(['message'=>"Ask For Rate not found"],"Validator Errors",400);
 
           }
          
         }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
         
    }
     public function UpdateAskforRate(Request $request){
         try{
             $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'ask_for_rate_id'=>'required|numeric|exists:ask_for_rates,id'
             ]);
             if ($validator->fails()) {
     
                 return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }
 
           $reportStatus=  AskForRate::where('id',$request->ask_for_rate_id)->first();
 
           if(!empty($reportStatus->id)){
 
             $reportStatus->update($request->all());
 
             return ResponseApi::acceptedResponseApi($reportStatus,"success",201);
 
           }else{
             return ResponseApi::badMethodErrorResponse(['message'=>"Ask For Rate not found"],"Validator Errors",400);
 
           }
          
         }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
         
     }

     public function CreateAskforRate(Request $request){
         try{
             $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'question_group_id'=>'numeric|exists:question_groups,id',
                 'user_rate_id'=>'required|array',
                 'user_to_rate_id'=>'required|array',

             ]);
             if ($validator->fails()) {
     
                 return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }
             $reportStatus= [];
             foreach ($request->user_rate_id as $value) {
                foreach($request->user_to_rate_id as $value2){
                  $reportStatus [] =  AskForRate::create([
                    'user_creator_id'=>Auth::guard('user_api')->user()->id,
                    'question_group_id'=>!empty($request->question_group_id)?$request->question_group_id:1,
                    'status'=>0,
                    'user_rate_id'=>$value,
                    'user_to_rate_id'=>$value2,
                   ]);
                }
             }
           
           return ResponseApi::acceptedResponseApi($reportStatus,"success",201);
 
              
         }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
         
     }
 
 
     public function GetAllAskForRate(Request $request){
         try{
        $validator = Validator::make($request->all(), [
            'token'=>'required|string',
            
        ]);
        if ($validator->fails()) {

            return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
        }

           $reportStatus = AskForRate::all();
           if(!empty($reportStatus[0]->id)){
             foreach($reportStatus as $dep){
                $question = Question::where('question_group_id',$dep->question_group_id)->get();
                $array_reponse2 =[];
                foreach ($question as $dep2) {
                    $array_reponse2 []= [
                        'question'=>$dep2->question,
                        'rate'=>$dep2->isRate
                    ];
                }
             $array_reponse[] = [ 
                'user_creator_id'=>$dep->user_creator_id,
                'user_creator_name'=>$dep->user_creator_id_fun->username,
                'question_group_title' =>$dep->question_group_id_fun->question_group_title,
                'question_group_id'=>$dep->question_group_id,
                'status'=>$dep->status,
                'user_rate_id'=>$dep->user_rate_id,
                'user_rate_name'=>$dep->user_rate_id_fun->username,
                'user_to_rate_id'=>$dep->user_to_rate_id,
                'user_to_rate_name'=>$dep->user_to_rate_id_fun->username,
                'id'=>$dep->id.'',
                'question'=>$array_reponse2
 
             ];
 
         }
             return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
 
           }else{
             return ResponseApi::notFoundResponse(['message'=>"Empty Ask for Rate"],"Empty",200);
 
           }
              
         }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
         
     }

     public function GetAskForRateSpecificGroupID(Request $request){
        try{
       $validator = Validator::make($request->all(), [
           'token'=>'required|string',
           'question_group_id'=>'required|numeric|exists:question_groups,id'
           
       ]);
       if ($validator->fails()) {

           return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
       }

          $reportStatus = AskForRate::where('question_group_id',$request->question_group_id)->get();
          if(!empty($reportStatus[0]->id)){
            foreach($reportStatus as $dep){
               $question = Question::where('question_group_id',$dep->question_group_id)->get();
               $array_reponse2 =[];
               foreach ($question as $dep2) {
                   $array_reponse2 []= [
                       'question'=>$dep2->question,
                       'rate'=>$dep2->isRate
                   ];
               }
            $array_reponse[] = [ 
               'user_creator_id'=>$dep->user_creator_id,
               'user_creator_name'=>$dep->user_creator_id_fun->username,
               'question_group_title' =>$dep->question_group_id_fun->question_group_title,
               'question_group_id'=>$dep->question_group_id,
               'status'=>$dep->status,
               'user_rate_id'=>$dep->user_rate_id,
               'user_rate_name'=>$dep->user_rate_id_fun->username,
               'user_to_rate_id'=>$dep->user_to_rate_id,
               'user_to_rate_name'=>$dep->user_to_rate_id_fun->username,
               'id'=>$dep->id.'',
               'question'=>$array_reponse2

            ];

        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Ask for Rate"],"Empty",200);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
     public function GetMyPendingAskForRate(Request $request){
          try{
         $validator = Validator::make($request->all(), [
             'token'=>'required|string',
         ]);
         if ($validator->fails()) {
 
             return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
         }
 
            $reportStatus = AskForRate::where('user_rate_id',Auth::guard('user_api')->user()->id)->where('status',0)->get();
            if(!empty($reportStatus[0]->id)){
              foreach($reportStatus as $dep){
                $question = Question::where('question_group_id',$dep->question_group_id)
                ->get();
                $array_reponse2 =[];
                foreach ($question as $dep2) {
                    $array_reponse2 []= [
                        'question'=>$dep2->question,
                    //    'rate'=>$dep2->isRate,
                        'id'=>$dep2->id.''
                    ];
                }
              $array_reponse[] = [ 
                 'user_creator_id'=>$dep->user_creator_id,
                 'user_creator_name'=>$dep->user_creator_id_fun->username,
                 'question_group_title' =>$dep->question_group_id_fun->question_group_title,
                 'question_group_id'=>$dep->question_group_id,
                 'status'=>$dep->status,
                 'user_rate_id'=>$dep->user_rate_id,
                 'user_rate_name'=>$dep->user_rate_id_fun->username,
                 'user_to_rate_id'=>$dep->user_to_rate_id,
                 'user_to_rate_name'=>$dep->user_to_rate_id_fun->username,
                 'id'=>$dep->id.'',
                 'question'=>$array_reponse2,
                 
  
              ];
  
          }
              return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
  
            }else{
              return ResponseApi::notFoundResponse(['message'=>"Empty Ask for Rate"],"Empty",200);
  
            }
               
          }catch(\Exception $e){
              return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
  
          }
          
      }
 
   



    public function GetUserForRate(Request $request){
      try{
            $validator = Validator::make($request->all(), [
              'token'=>'required|string',
              'question_group_id'=>'numeric|exists:question_groups,id'

          ]);
          if ($validator->fails()) {

              return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
          }
          $question_group = QuestionGroup::where('id',$request->question_group_id)->first();
          if(!empty($question_group->id)){
            $groub_sub_type_id = $question_group->group_sub_type_id;
          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Question Group Not Matched With any Sub Type"],"Validator Errors",400);

          }
          if(Auth::guard('user_api')->user()->sub_departments_id_fun->departments_id==1){
            $users = User::where('work_degrees_id','<>',5)->get();
            foreach ($users as  $value) {
              $response []= [
                'username'=>$value->username,
                'key'=>$value->id.'',
              ];
              # code...
            }
            return ResponseApi::acceptedResponseApi($response,"success",201);

          }

          $response =[];
          if($groub_sub_type_id =="5" ){//monthly
            $askForRate_ids = AskForRate::where('user_rate_id',Auth::guard('user_api')->user()->id)->where('question_group_id',$request->question_group_id)
            ->whereMonth('created_at',Carbon::now())->get()->pluck('user_to_rate_id');

            $users = User::whereNotIn('id',$askForRate_ids)->whereHas('sub_departments_id_fun',function($q){
              $q->where('departments_id',Auth::guard('user_api')->user()->sub_departments_id_fun->departments_id);
              $q->where('work_degrees_id','<>',5);
            })->get();

            foreach ($users as  $value) {
              $response []= [
                'username'=>$value->username,
                'key'=>$value->id.'',
              ];
              # code...
            }

          }else if($groub_sub_type_id == "6"){//quarter
       //     $currentMonth = Carbon::now()
            $askForRate_ids = AskForRate::where('user_rate_id',Auth::guard('user_api')->user()->id)->where('question_group_id',$request->question_group_id)
            ->where(DB::raw('QUARTER(created_at)'),Carbon::now()->quarter)->get()->pluck('user_to_rate_id');

            $users = User::whereNotIn('id',$askForRate_ids)->whereHas('sub_departments_id_fun',function($q){
              $q->where('departments_id',Auth::guard('user_api')->user()->sub_departments_id_fun->departments_id);
              $q->where('work_degrees_id','<>',5);
            })->get();
            foreach ($users as  $value) {
              $response []= [
                'username'=>$value->username,
                'key'=>$value->id.'',
              ];
              # code...
            }


          }else if($groub_sub_type_id == "7"){//mid year
            if(Carbon::now()->month >=1 && Carbon::now()->month <=6){
              $askForRate_ids = AskForRate::where('user_rate_id',Auth::guard('user_api')->user()->id)->where('question_group_id',$request->question_group_id)
              ->where('created_at','>=',Carbon::create(Carbon::now()->year, 1, 1, 0))
              ->where('created_at','<=',Carbon::create(Carbon::now()->year, 6, 31, 0))->get()->pluck('user_to_rate_id');

            }else{
              $askForRate_ids = AskForRate::where('user_rate_id',Auth::guard('user_api')->user()->id)->where('question_group_id',$request->question_group_id)
              ->where('created_at','>=',Carbon::create(Carbon::now()->year, 7, 1, 0))
              ->where('created_at','<=',Carbon::create(Carbon::now()->year, 12, 31, 0))->get()->pluck('user_to_rate_id');

            }
              

                $users = User::whereNotIn('id',$askForRate_ids)->whereHas('sub_departments_id_fun',function($q){
                  $q->where('departments_id',Auth::guard('user_api')->user()->sub_departments_id_fun->departments_id);
                  $q->where('work_degrees_id','<>',5);
                })->get();
                foreach ($users as  $value) {
                  $response []= [
                    'username'=>$value->username,
                    'key'=>$value->id.'',
                  ];
                  # code...
                }

          }else if($groub_sub_type_id == "8"){//yearly

            $askForRate_ids = AskForRate::where('user_rate_id',Auth::guard('user_api')->user()->id)->where('question_group_id',$request->question_group_id)
            ->whereYear('created_at',Carbon::now())->pluck('user_to_rate_id')->get();
            $users = User::whereNotIn('id',$askForRate_ids)->whereHas('sub_departments_id_fun',function($q){
              $q->where('departments_id',Auth::guard('user_api')->user()->sub_departments_id_fun->departments_id);
              $q->where('work_degrees_id','<>',5);
            })->get();
                        
            foreach ($users as  $value) {
              $response []= [
                'user_name'=>$value->username,
                'id'=>$value->id,
              ];
              # code...
            }
          }else{
            $users = User::all();
            foreach ($users as  $value) {
              $response []= [
                'username'=>$value->username,
                'key'=>$value->id.'',
              ];

          }
        }

          return ResponseApi::acceptedResponseApi($response,"success",201);


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
     * @param  \App\Models\AskForRate  $askForRate
     * @return \Illuminate\Http\Response
     */
    public function show(AskForRate $askForRate)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\AskForRate  $askForRate
     * @return \Illuminate\Http\Response
     */
    public function edit(AskForRate $askForRate)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\AskForRate  $askForRate
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, AskForRate $askForRate)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\AskForRate  $askForRate
     * @return \Illuminate\Http\Response
     */
    public function destroy(AskForRate $askForRate)
    {
        //
    }
}
