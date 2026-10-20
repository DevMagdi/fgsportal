<?php

namespace App\Http\Controllers\Project\Tools;
 
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
 use Illuminate\Support\Facades\Auth;
use App\Models\TaskComment;
 
class TaskCommentController extends Controller
{
    public function DeleteTaskComment(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'task_comment_id'=>'required|numeric|exists:task_comments,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $taskComment=  TaskComment::where('id',$request->task_comment_id)->first();

          if(!empty($taskComment->id)){

            $taskComment->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Task Comment not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateTaskComment(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'task_comment_id' => 'required|numeric|exists:task_comments,id',
                'token'=>'required|string',
                'task_comment'=>'required|string|min:4'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $taskComment=  TaskComment::where('id',$request->task_comment_id)->first();

          if(!empty($taskComment->id)){

            $taskComment->update([
                'task_comment' =>$request->task_comment,
            ]);

            $array_reponse = [ 
                'id'=>$taskComment->id,
                'user_creator_id' =>$taskComment->user_creator_id,
                'user_creator_name'=>$taskComment->user_creator_id_fun->username,
                'task_comment'=>$taskComment->task_comment,
                'task_id'=>$taskComment->task_id,
    
            ];
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Task Comment  not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateTaskComment(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'task_id' => 'required|numeric|exists:tasks,id',
                'token'=>'required|string',
                'task_comment'=>'required|string|min:4'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $taskComment=  TaskComment::create([
            'user_creator_id' =>Auth::guard('user_api')->user()->id,
            'task_comment'=>$request->task_comment,
            'task_id'=>$request->task_id,
            ]);
         
           $array_reponse = [ 
            'id'=>$taskComment->id,
            'user_creator_id' =>$taskComment->user_creator_id,
            'user_creator_name'=>$taskComment->user_creator_id_fun->username,
            'task_comment'=>$taskComment->task_comment,
            'task_id'=>$taskComment->task_id,

        ];
          return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetTaskComment(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'task_id' => 'required|numeric|exists:tasks,id',
                'token'=>'required|string',
             ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
          $taskComment = TaskComment::where('task_id',$request->task_id)->get();
          if(!empty($taskComment[0]->id)){
            foreach($taskComment as $dep){
            $array_reponse[] = [ 
                'id'=>$dep->id,
                'user_creator_id' =>$dep->user_creator_id,
                'user_creator_name'=>$dep->user_creator_id_fun->username,
                'task_comment'=>$dep->task_comment,

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Task Comments"],"Empty",200);

          }
             
        }catch(\Exception $e){
          //  return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
          return ResponseApi::badMethodErrorResponse($e,"server Error",500);

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
     * @param  \App\Models\TaskComment  $taskComment
     * @return \Illuminate\Http\Response
     */
    public function show(TaskComment $taskComment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\TaskComment  $taskComment
     * @return \Illuminate\Http\Response
     */
    public function edit(TaskComment $taskComment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\TaskComment  $taskComment
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, TaskComment $taskComment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\TaskComment  $taskComment
     * @return \Illuminate\Http\Response
     */
    public function destroy(TaskComment $taskComment)
    {
        //
    }
}
