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
use App\Models\QuestionGroupSubType;

class QuestionGroupSubTypeController extends Controller
{

        

    public function DeleteGroupSubType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'group_sub_type_id'=>'required|numeric|exists:question_group_sub_types,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }

          $department=  QuestionGroupSubType::where('id',$request->group_sub_type_id)->first();

          if(!empty($department->id)){

            $department->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Sub Status not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    
    public function UpdateGroupSubType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'group_sub_type' => 'unique:question_group_sub_types',
                'token'=>'required|string',
                'group_type_id'=>'exists:question_group_types,id',
                'group_sub_type_id'=>'required|numeric|exists:question_group_sub_types,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }

          $department=  QuestionGroupSubType::where('id',$request->group_sub_type_id)->first();

          if(!empty($department->id)){
            
            $department->update($request->all());

            return ResponseApi::acceptedResponseApi($department,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Sub Status not found"],"Validator Errors",400);

          }
         
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

  
    public function CreateGroupSubType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'group_sub_type' => 'required|string|unique:question_group_sub_types',
                'token'=>'required|string',
                'group_type_id'=>'required|numeric|exists:question_group_types,id'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }
          $sub_department=  QuestionGroupSubType::create([
            'group_sub_type' =>$request->group_sub_type,
            'group_type_id' =>$request->group_type_id,
           ]);
         
    
          return ResponseApi::acceptedResponseApi($sub_department,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }




    public function GetAllGroupSubType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }
          $subdepartment = QuestionGroupSubType::all();
          if(!empty($subdepartment[0]->id)){
            foreach($subdepartment as $dep){
            $array_reponse[] = [ 
                'group_sub_type' =>$dep->group_sub_type,
                'group_type_name' =>$dep->group_type_id_fun->group_type_name,
                'id' =>$dep->id.''
            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(null,"Empty",204);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(null,"server Error",500);

        }
        
    }
    public function GetGroupForSpecificType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'group_type_id'=>'required|numeric|exists:question_group_types,id'

            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }
          $subdepartment = QuestionGroupSubType::where('group_type_id',$request->group_type_id)->get();
          if(!empty($subdepartment[0]->id)){
            foreach($subdepartment as $dep){
            $array_reponse[] = [ 
                'group_sub_type' =>$dep->group_sub_type,
                'group_type_name' =>$dep->group_type_id_fun->group_type_name,
                'id' =>$dep->id.''
            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(null,"Empty",204);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(null,"server Error",500);

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
     * @param  \App\Models\QuestionGroupSubType  $questionGroupSubType
     * @return \Illuminate\Http\Response
     */
    public function show(QuestionGroupSubType $questionGroupSubType)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\QuestionGroupSubType  $questionGroupSubType
     * @return \Illuminate\Http\Response
     */
    public function edit(QuestionGroupSubType $questionGroupSubType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\QuestionGroupSubType  $questionGroupSubType
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, QuestionGroupSubType $questionGroupSubType)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\QuestionGroupSubType  $questionGroupSubType
     * @return \Illuminate\Http\Response
     */
    public function destroy(QuestionGroupSubType $questionGroupSubType)
    {
        //
    }
}
