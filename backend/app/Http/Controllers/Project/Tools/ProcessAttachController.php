<?php

namespace App\Http\Controllers\Project\Tools;

use App\Http\Controllers\Controller;
  use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;

 use App\Models\ProcessAttach;
 
class ProcessAttachController extends Controller
{
   
    public function DeleteProcessAttach(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'process_attach_id'=>'required|numeric|exists:process_attaches,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $partner=  ProcessAttach::where('id',$request->process_attach_id)->first();
          
          if(!empty($partner->task_id)){
            $image_path = 'Attachments/Project/'.$partner->process_id_fun->project_id.'/'.$partner->process_id.'/'.$partner->task_id.'/' .$partner->process_attach ;  // Value is not URL but directory file path
          }else{
            $image_path = 'Attachments/Project/'.$partner->process_id_fun->project_id.'/'.$partner->process_id. '/' .$partner->process_attach ;  // Value is not URL but directory file path

          }
            if(File::exists($image_path)) {
                File::delete($image_path);
            }

            $partner->forcedelete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

    public function GetProcessAttaches(Request $request){
         
        try{
            $validator = Validator::make($request->all(), [
                'process_id' => 'required|string|exists:processes,id',
                'token'=>'required|string',
             ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $partner = ProcessAttach::where('process_id',$request->process_id)->get();
         
          if(!empty($partner[0]->id)){
            foreach($partner as $dep){
                if(!empty($dep->task_id)){
                    $image_path = 'Attachments/Project/'.$dep->process_id_fun->project_id.'/'.$dep->process_id.'/'.$dep->task_id.'/' .$dep->process_attach ;  // Value is not URL but directory file path
                    $task_title = $dep->task_id_fun->task_title;
                }else{
                    $image_path = 'Attachments/Project/'.$dep->process_id_fun->project_id.'/'.$dep->process_id. '/' .$dep->process_attach ;  // Value is not URL but directory file path
                    $task_title= null;
                }
                 
               
            $array_reponse[] = [ 
                'process_id' =>$dep->process_id,
                'process_title' =>$dep->process_id_fun->process_title,
                'task_id' =>$dep->task_id,
                'task_title' =>$task_title,
                 'process_attach' => $image_path,
                'user_creator_id' =>$dep->user_creator_id,
                'user_creator_name' =>$dep->user_creator_id_fun->username,
                'id'=>$dep->id

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Process Attach"],"Empty",200);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
     
    public function GetTaskAttaches(Request $request){
         
        try{
            $validator = Validator::make($request->all(), [
                'task_id' => 'required|string|exists:tasks,id',
                'token'=>'required|string',
             ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $partner = ProcessAttach::where('task_id',$request->task_id)->get();
         
          if(!empty($partner[0]->id)){
            foreach($partner as $dep){
                if(!empty($dep->task_id)){
                    $image_path = 'Attachments/Project/'.$dep->process_id_fun->project_id.'/'.$dep->process_id.'/'.$dep->task_id.'/' .$dep->process_attach ;  // Value is not URL but directory file path
                    $task_title = $dep->task_id_fun->task_title;
                }else{
                    $image_path = 'Attachments/Project/'.$dep->process_id_fun->project_id.'/'.$dep->process_id. '/' .$dep->process_attach ;  // Value is not URL but directory file path
                    $task_title= null;
                }
                 
               
            $array_reponse[] = [ 
                'process_id' =>$dep->process_id,
                'process_title' =>$dep->process_id_fun->process_title,
                'task_id' =>$dep->task_id,
                'task_title' =>$task_title,
                 'process_attach' => $image_path,
                'user_creator_id' =>$dep->user_creator_id,
                'user_creator_name' =>$dep->user_creator_id_fun->username,
                'id'=>$dep->id

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Task Attach"],"Empty",200);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
     

    public function CreateProcessAttach(Request $request){
     
        try{
           
            $validator = Validator::make($request->all(), [
                'process_id' => 'required|string|exists:processes,id',
                'token'=>'required|string',
                'process_attach'=>'required'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

           
               if ($request->hasFile('process_attach'))  {


                $partner=  ProcessAttach::where('process_id',$request->process_id)->get();
                if(!empty($partner[0]->id)){
                foreach($partner as $dep)
                if(!empty($dep->task_id)){
                    $image_path = 'Attachments/Project/'.$dep->process_id_fun->project_id.'/'.$dep->process_id.'/'.$dep->task_id.'/' .$dep->process_attach ;  // Value is not URL but directory file path
                }else{
                    $image_path = 'Attachments/Project/'.$dep->process_id_fun->project_id.'/'.$dep->process_id. '/' .$dep->process_attach ;  // Value is not URL but directory file path

                }
                    if(File::exists($image_path)) {
                        File::delete($image_path);
                    }
                    $dep->forcedelete();
                }


                $image = $request->file('process_attach');
                $file_name = $image->getClientOriginalName();
                $partner=  ProcessAttach::create([
                    'process_id' =>$request->process_id,
                    'task_id' =>$request->task_id,
                    'user_creator_id' =>Auth::guard('user_api')->user()->id,
                    'process_attach'=>$file_name,
                    ]);
                if(!empty($partner->task_id)){
                    $image->move(('Attachments/Project/'.$partner->process_id_fun->project_id.'/'.$partner->process_id.'/'.$partner->task_id.'/'), $file_name);

                }else{
                    $image->move(('Attachments/Project/'.$partner->process_id_fun->project_id.'/'.$partner->process_id.'/'), $file_name);

                }

 
            }else{
                return ResponseApi::badMethodErrorResponse(["message"=>"Attach File Must Be Exist"],"Validator Errors",400);

            }
             
             
           
           
            return ResponseApi::acceptedResponseApi(['message'=>'success'],"success",201);


             
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
     * @param  \App\Models\ProcessAttach  $processAttach
     * @return \Illuminate\Http\Response
     */
    public function show(ProcessAttach $processAttach)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProcessAttach  $processAttach
     * @return \Illuminate\Http\Response
     */
    public function edit(ProcessAttach $processAttach)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ProcessAttach  $processAttach
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ProcessAttach $processAttach)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProcessAttach  $processAttach
     * @return \Illuminate\Http\Response
     */
    public function destroy(ProcessAttach $processAttach)
    {
        //
    }
}
