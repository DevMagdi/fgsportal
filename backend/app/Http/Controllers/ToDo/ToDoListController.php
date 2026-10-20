<?php

namespace App\Http\Controllers\ToDo;

use App\Http\Controllers\Controller;
use App\Models\PhoneType;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use App\Models\KeepNoteStatus;
use App\Models\KeepNote;
use App\Models\KeepNoteUser;
use App\Models\ToDoList;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\ApiMessage\MessageController;

class ToDoListController extends Controller
{
    public function DeleteToDo(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'to_do_id' => 'required|string|exists:to_do_lists,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus=  ToDoList::where('id',$request->to_do_id)
          ->where('user_creator_id',Auth::guard('user_api')->user()->id)->first();

          if(!empty($reportStatus->id)){
            $reportStatus->delete();
            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);
          }else{
            $reportStatus=  ToDoList::where('id',$request->to_do_id)
          ->whereHas('keep_note_id_fun',function($q){

          $q->where('user_creator_id',Auth::guard('user_api')->user()->id);
        })->first();
        if(!empty($reportStatus->id)){
            $reportStatus->delete();
            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);


          }else{
                 return ResponseApi::notFoundResponse(['message'=>"To Do not Found"],"Empty",200);

          }
        }
         
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateToDo(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'to_do_id' => 'required|string|exists:to_do_lists,id',
                'token'=>'required|string',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus=  ToDoList::where('id',$request->to_do_id)->first();
          $creat =  KeepNoteUser::where( 'keep_note_id',$reportStatus->keep_note_id)->where('user_id',Auth::guard('user_api')->user()->id)->first();

          if(!empty($reportStatus->id)&&!empty($creat->id)){


            $reportStatus->update($request->all());
            $reportStatus=  ToDoList::where('id',$request->to_do_id)->first();

            $users_note =    KeepNoteUser::where( 'keep_note_id',$reportStatus->keep_note_id)->get();
            $user_object =[];
            foreach ($users_note as $value) {
                $usea = User::where('id',$value)->first();
                if(!empty($usea->id)){
                    $user_object = [
                        $value.''=>$usea->username
                    ];
                }
               
            }
            try{
                $msg = array(
                    'users_id'=>$user_object,
                    'note_id'=>$reportStatus->keep_note_id,
                    'refresh_required'=>true
                );
                MessageController::updatedatafirebaseNote($reportStatus->keep_note_id,$msg);
             }catch(\Exception $e){}

            return ResponseApi::acceptedResponseApi($reportStatus,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"To Do Item not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

    public function CreateToDo(Request $request){
     //   try{
            $validator = Validator::make($request->all(), [
                'keep_note_id' => 'required|string|exists:keep_notes,id',
                'to_do'=>'required|string',
              //  'status'=>'required',
                'token'=>'required|string',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus=  ToDoList::create([
            'keep_note_id'=>$request->keep_note_id,
            'to_do'=>$request->to_do,
            'status'=>0,
            'user_creator_id'=>Auth::guard('user_api')->user()->id,
    
           ]);
           if(!empty($reportStatus->id)){
               
            
            return ResponseApi::acceptedResponseApi($reportStatus,"success",201);

           }else{

            return ResponseApi::acceptedResponseApi($reportStatus,"Server Error",500);


           }
         
        

             
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
        
    }

    // public function GetSpecificToDoforNot(Request $request){
    //     try{
    //        $validator = Validator::make($request->all(), [
    //                 'token'=>'required|string'
    //             ]);
    //             if ($validator->fails()) {
        
    //                 return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
    //             }
    
            
    //       $reportStatus = KeepNote::all();
    //       if(!empty($reportStatus[0]->id)){
    //         foreach($reportStatus as $dep){
    //         $array_reponse[] = $this->CastKeepNoteData($dep);
    //     }
    //         return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

    //       }else{
    //         return ResponseApi::notFoundResponse(['message'=>"Empty Keep Note"],"Empty",200);

    //       }
             
    //     }catch(\Exception $e){
    //         return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

    //     }
        
    // }

  

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
     * @param  \App\Models\ToDoList  $toDoList
     * @return \Illuminate\Http\Response
     */
    public function show(ToDoList $toDoList)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ToDoList  $toDoList
     * @return \Illuminate\Http\Response
     */
    public function edit(ToDoList $toDoList)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ToDoList  $toDoList
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ToDoList $toDoList)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ToDoList  $toDoList
     * @return \Illuminate\Http\Response
     */
    public function destroy(ToDoList $toDoList)
    {
        //
    }
}
