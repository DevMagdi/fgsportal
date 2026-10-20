<?php
 
namespace App\Http\Controllers\Project\Tools;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use App\Models\ProjectComment;
use Illuminate\Support\Facades\Auth;

 class ProjectCommentController extends Controller
{
    public function DeleteProjectComment(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'project_comment_id'=>'required|numeric|exists:project_comments,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $ProjectComment=  ProjectComment::where('id',$request->project_comment_id)->first();

          if(!empty($ProjectComment->id)){

            $ProjectComment->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Project Comment not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateProjectComment(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'project_comment_id' => 'required|numeric|exists:project_comments,id',
                'token'=>'required|string',
                'project_comment'=>'required|string|min:4'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $projectComment=  ProjectComment::where('id',$request->project_comment_id)->first();

          if(!empty($projectComment->id)){

            $projectComment->update([
                'project_comment' =>$request->project_comment,
            ]);

            $array_reponse = [ 
                'id'=>$projectComment->id,
                'user_creator_id' =>$projectComment->user_creator_id,
                'user_creator_name'=>$projectComment->user_creator_id_fun->username,
                'project_comment'=>$projectComment->project_comment,
                'project_id'=>$projectComment->project_id,
    
            ];
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Project  not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateProjectComment(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'project_id' => 'required|numeric|exists:projects,id',
                'token'=>'required|string',
                'project_comment'=>'required|string|min:4'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $projectComment=  ProjectComment::create([
            'user_creator_id' =>Auth::guard('user_api')->user()->id,
            'project_comment'=>$request->project_comment,
            'project_id'=>$request->project_id,
            ]);
         
           $array_reponse = [ 
            'id'=>$projectComment->id,
            'user_creator_id' =>$projectComment->user_creator_id,
            'user_creator_name'=>$projectComment->user_creator_id_fun->username,
            'project_comment'=>$projectComment->project_comment,
            'project_id'=>$projectComment->project_id,

        ];
          return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetProjectComment(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'project_id' => 'required|numeric|exists:projects,id',
                'token'=>'required|string',
             ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
          $projectComment = ProjectComment::where('project_id',$request->project_id)->get();
          if(!empty($projectComment[0]->id)){
            foreach($projectComment as $dep){
            $array_reponse[] = [ 
                'id'=>$dep->id,
                'user_creator_id' =>$dep->user_creator_id,
                'user_creator_name'=>$dep->user_creator_id_fun->username,
                'project_comment'=>$dep->project_comment,

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Project Comments"],"Empty",200);

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
     * @param  \App\Models\ProjectComment  $projectComment
     * @return \Illuminate\Http\Response
     */
    public function show(ProjectComment $projectComment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProjectComment  $projectComment
     * @return \Illuminate\Http\Response
     */
    public function edit(ProjectComment $projectComment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ProjectComment  $projectComment
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ProjectComment $projectComment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProjectComment  $projectComment
     * @return \Illuminate\Http\Response
     */
    public function destroy(ProjectComment $projectComment)
    {
        //
    }
}
