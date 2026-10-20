<?php


namespace App\Http\Controllers\Project\Tools;
use App\Models\ProcessComment;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
 use Illuminate\Support\Facades\Auth;
class ProcessCommentController extends Controller
{
    public function DeleteProcessComment(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'process_comment_id'=>'required|numeric|exists:process_comments,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $processComment=  ProcessComment::where('id',$request->process_comment_id)->first();

          if(!empty($processComment->id)){

            $processComment->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Process Comment not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateProcessComment(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'process_comment_id' => 'required|numeric|exists:process_comments,id',
                'token'=>'required|string',
                'process_comment'=>'required|string|min:4'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $processComment=  ProcessComment::where('id',$request->process_comment_id)->first();

          if(!empty($processComment->id)){

            $processComment->update([
                'process_comment' =>$request->process_comment,
            ]);

            $array_reponse = [ 
                'id'=>$processComment->id,
                'user_creator_id' =>$processComment->user_creator_id,
                'user_creator_name'=>$processComment->user_creator_id_fun->username,
                'process_comment'=>$processComment->process_comment,
                'process_id'=>$processComment->process_id,
    
            ];
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Process Comment  not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateProcessComment(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'process_id' => 'required|numeric|exists:processes,id',
                'token'=>'required|string',
                'process_comment'=>'required|string|min:4'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $processComment=  ProcessComment::create([
            'user_creator_id' =>Auth::guard('user_api')->user()->id,
            'process_comment'=>$request->process_comment,
            'process_id'=>$request->process_id,
            ]);
         
           $array_reponse = [ 
            'id'=>$processComment->id,
            'user_creator_id' =>$processComment->user_creator_id,
            'user_creator_name'=>$processComment->user_creator_id_fun->username,
            'process_comment'=>$processComment->process_comment,
            'process_id'=>$processComment->process_id,

        ];
          return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetProcessComment(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'process_id' => 'required|numeric|exists:processes,id',
                'token'=>'required|string',
             ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
          $processComment = ProcessComment::where('process_id',$request->process_id)->get();
          if(!empty($processComment[0]->id)){
            foreach($processComment as $dep){
            $array_reponse[] = [ 
                'id'=>$dep->id,
                'user_creator_id' =>$dep->user_creator_id,
                'user_creator_name'=>$dep->user_creator_id_fun->username,
                'process_comment'=>$dep->process_comment,

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Process Comments"],"Empty",200);

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
     * @param  \App\Models\ProcessComment  $processComment
     * @return \Illuminate\Http\Response
     */
    public function show(ProcessComment $processComment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProcessComment  $processComment
     * @return \Illuminate\Http\Response
     */
    public function edit(ProcessComment $processComment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ProcessComment  $processComment
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ProcessComment $processComment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProcessComment  $processComment
     * @return \Illuminate\Http\Response
     */
    public function destroy(ProcessComment $processComment)
    {
        //
    }
}
