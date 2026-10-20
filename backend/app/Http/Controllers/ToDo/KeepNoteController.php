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
use App\Http\Controllers\ApiMessage\MessageController;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Models\KeepNoteReplay;
class KeepNoteController extends Controller
{

    public function CastKeepNoteData(KeepNote $dep){

        $keep_note_user = [];
        $to_do_list =[];
       $to_do =  ToDoList::where('keep_note_id',$dep->id)->get();
       $note_user = KeepNoteUser::where('keep_note_id',$dep->id)->get();
       foreach ($note_user as  $value) {
        $user_detail = User::where('id',$value->user_id)->first();
        
        $keep_note_user [] = [
            'id'=>$value->user_id,
            'user_id'=>!empty($value->user_id_fun)?$value->user_id_fun->id:null,
            'username'=>!empty($value->user_id_fun)?$value->user_id_fun->username:null,
            'avatar'=>$user_detail->photoURL?'/Attachments/User/'.$user_detail->id.'/profile'.'/'.$user_detail->photoURL:null,
            'can_write'=>$value->can_write,
            'id'=>$value->id.''
        ];
       }

       foreach ($to_do as  $value) {
        $to_do_list [] = [
            'user_creator_id'=>$value->user_creator_id,
            'user_creator_name'=>!empty($value->user_creator_id_fun)?$value->user_creator_id_fun->username:null,
            'to_do'=>$value->to_do,
            'status'=>$value->status,
            'created_at'=>$value->created_at,
            'id'=>$value->id.''
        ];
       }

        $array_reponse =[
            'user_creator'=>$dep->user_creator_id,
            'user_creator_name'=>!empty($dep->user_creator_id_fun)?$dep->user_creator_id_fun->username:null,
            'project_id'=>$dep->project_id,
            'project_name'=>!empty($dep->project_id_fun)?$dep->project_id_fun->project_title:null,
            'keep_note_status_id'=>!empty($dep->keep_note_status_id)?$dep->keep_note_status_id:null,
            'keep_note_status_name'=>!empty($dep->keep_note_status_id_fun)?$dep->keep_note_status_id_fun->keep_note_status_name:null,
            'note'=>$dep->note,
            'note_date'=>$dep->note_date,
            'updated_at'=>$dep->updated_at,
            'to_do_list'=>$to_do_list,
            'user_id'=>$keep_note_user,
            'noteBackgroundColor'=>$dep->noteBackgroundColor,
            'id'=>$dep->id.''


        ];

        return $array_reponse;
    }

    public function DeleteKeepNote(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'keep_note_id' => 'required|string|exists:keep_notes,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus=  KeepNote::where('id',$request->keep_note_id)->where('user_creator_id',Auth::guard('user_api')->user()->id)->first();

          if(!empty($reportStatus->id)){
            $users_note = KeepNoteUser::where('keep_note_id',$request->keep_note_id)->get();
            foreach ($users_note as $key) {
                $replays = KeepNoteReplay::where('keep_note_user_id',$key->user_id)->get();
                foreach ($replays as $value) {
                   $value->delete();
                }
                $key->delete();
                # code...
            }
            $to_do = ToDoList::where('keep_note_id',$request->keep_note_id)->get();
            foreach($to_do as $to_do_item){
                $to_do_item->delete();
            }
            $reportStatus->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Note not found"],"Validator Errors",400);

          }
         
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateKeepNote(Request $request){
   try{
            $validator = Validator::make($request->all(), [
                'keep_note_id' => 'required|string|exists:keep_notes,id',
                'token'=>'required|string',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus=  KeepNote::where('id',$request->keep_note_id)->where('user_creator_id',Auth::guard('user_api')->user()->id)->first();

          if(!empty($reportStatus->id)){

            $reportStatus->update($request->all());

            $reportStatus=  KeepNote::where('id',$request->keep_note_id)->first();
            if($request->has('user_id')){
                
              $user_exist = KeepNoteUser::where( 'keep_note_id',$reportStatus->id)->get();
                    foreach($user_exist as $value2){

                        $value2->delete();
                    }
                    $user_object =[];
                    foreach ($user_exist as $value) {
                        $usea = User::where('id',$value->user_id)->first();
                        $user_object [ $usea->id.'']= [
                           
                                'note_id'=>$request->keep_note_id,
                                'refresh_required'=>true
                            
                        ];
                       
                    }
    
                    try{
                        $msg =   $user_object ;
     
                        MessageController::updatedatafirebaseNote($request->keep_note_id,$msg);
                     }catch(\Exception $e){
     
     
                     } 
             

                foreach ($request->user_id as $value) {
                    $user_exist =    KeepNoteUser::where('user_id',$value['user_id'])->where( 'keep_note_id',$reportStatus->id)->withTrashed()->first();
                    if(!empty($user_exist->user_id)){
                        $user_exist->restore();
                        $user_exist =    KeepNoteUser::where('user_id',$value['user_id'])->where( 'keep_note_id',$reportStatus->id)->first();
                        $user_exist->update([
                            'can_write'=>$value['can_write']
                        ]);
                    }else{
                        KeepNoteUser::create([
                            'user_id'=>$value['user_id'],
                            'keep_note_id'=>$reportStatus->id,
                            'can_write'=>$value['can_write']
                        ]);
                    }
                   
                }

                $users_note =    KeepNoteUser::where( 'keep_note_id',$request->keep_note_id)->get();
                $user_object =[];
                foreach ($users_note as $value) {
                    $usea = User::where('id',$value->user_id)->first();
                    $user_object [ $usea->id.'']= [
                       
                            'note_id'=>$request->keep_note_id,
                            'refresh_required'=>true
                        
                    ];
                   
                }

                try{
                    $msg =   $user_object ;
 
                    MessageController::updatedatafirebaseNote($request->keep_note_id,$msg);
                 }catch(\Exception $e){
 
 
                 }
                  
 
                
            } 
            return ResponseApi::acceptedResponseApi(["message"=>"success"],"success",201);

          }else{
            $users_note =    KeepNoteUser::where( 'keep_note_id',$request->keep_note_id)->get();
            $user_object =[];
            foreach ($users_note as $value) {
                $usea = User::where('id',$value->user_id)->first();
                $user_object [ $usea->id.'']= [
                    'note_id'=>$request->keep_note_id,
                    'refresh_required'=>true
                ];
               
            }
            
            $reportStatus=  KeepNote::where('id',$request->keep_note_id)->first();
            $usea = User::where('id',$reportStatus->user_creator_id)->first();
            $user_object [ $usea->id.'']= [
                'note_id'=>$request->keep_note_id,
                'refresh_required'=>true
            ];
            
    
            try{
                $msg =   $user_object ;
                MessageController::updatedatafirebaseNote($request->keep_note_id,$msg);
            }catch(\Exception $e){}

            $keepNote=  KeepNote::where('id',$request->keep_note_id)->first();
            $keep_note_user = KeepNoteUser::where('keep_note_id',$request->keep_note_id)->
            where('user_id',Auth::guard('user_api')->user()->id)->where('can_write',1)->first();
           if(!empty($keep_note_user->id)){
            if($request->has('note')){

                $keepNote->update([
                    'note'=>$request->note
                ]);
            }

           }

           return ResponseApi::acceptedResponseApi(["message"=>"success"],"success",201);
        }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error".$e,500);

        }
        
    }

    public function CreateKeepNote(Request $request){
               //     return ResponseApi::acceptedResponseApi($request->all(),"success",201);

     //   try{
            $validator = Validator::make($request->all(), [
               // 'keep_note_status_id' => 'required|string|exists:keep_note_statuses,id',
                // 'note'=>'required|string',
                'project_id'=>'numeric|exists:projects,id',
                'note_date'=>'date',
                'token'=>'required|string',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            if($request->has('user_id')){
                foreach ($request->user_id as $value) {
                    $user_exist = User::where('id',$value['id'])->first();
                    if(empty($user_exist)){
                        return ResponseApi::badMethodErrorResponse(['message'=>'Validator Error for User id '.$value['id']],"Validator Errors",400);
                    }
                }
            }

          $reportStatus=  KeepNote::create([
            'user_creator_id'=>Auth::guard('user_api')->user()->id,
            'project_id'=>!empty($request->project_id)?$request->project_id:null,
            'keep_note_status_id'=>1,
            'note'=>!empty($request->note)?$request->note:null,
            'note_date'=>!empty($request->note_date)?Carbon::createFromFormat('m/d/Y', $request->note_date):null,
            'noteBackgroundColor'=>!empty($request->noteBackgroundColor)?$request->noteBackgroundColor:null
           ]);
           if(!empty($reportStatus->id)){
                if($request->has('user_id')){
                    foreach ($request->user_id as $value) {
                        KeepNoteUser::create([
                            'user_id'=>$value['id'],
                            'keep_note_id'=>$reportStatus->id,
                            'can_write'=>$value['can_write']
                        ]);
                    }
                }
                // if($request->has('to_do_list')){
                //     foreach ($request->to_do_list as $value) {
                //         ToDoList::create([
                //             'status'=>0,
                //             'user_creator_id'=>Auth::guard('user_api')->user()->id,
                //             'to_do'=>$value['to_do'],
                //             'keep_note_id'=>$reportStatus->id,
                //         ]);
                //     }
                // }
            
            return ResponseApi::acceptedResponseApi($reportStatus,"success",201);

           }else{

            return ResponseApi::acceptedResponseApi($reportStatus,"Server Error",500);


           }
         
        

             
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
        
    }

    public function GetAllKeepNote(Request $request){
        try{
           $validator = Validator::make($request->all(), [
                    'token'=>'required|string'
                ]);
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
    
            
          $reportStatus = KeepNote::all();
          if(!empty($reportStatus[0]->id)){
            foreach($reportStatus as $dep){
            $array_reponse[] = $this->CastKeepNoteData($dep);
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Keep Note"],"Empty",200);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

    public function GetSpecificKeepNote(Request $request){
        try{
           $validator = Validator::make($request->all(), [
                    'token'=>'required|string',
                    'keep_note_id' => 'required|string|exists:keep_notes,id',

                ]);
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
    
           

          $reportStatus = KeepNote::where('id',$request->keep_note_id)->first();
           if(!empty($reportStatus->id)){
             $array_reponse[] = $this->CastKeepNoteData($reportStatus);
       
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Keep Note"],"Empty",200);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

    public function GetMyKeepNote(Request $request){
       // try{
           $validator = Validator::make($request->all(), [
                    'token'=>'required|string'
                ]);
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
    
        $my_note = KeepNoteUser::where('user_id',Auth::guard('user_api')->user()->id)->get();
        $creator = KeepNote::where('user_creator_id',Auth::guard('user_api')->user()->id)->where('keep_note_status_id',1)->get();

        if(!empty($my_note[0]->id)||!empty($creator[0]->id)){
            foreach ($my_note as  $value) {
            $reportStatus = KeepNote::where('id',$value->keep_note_id)->where('keep_note_status_id',1)->get();
            if(!empty($reportStatus[0]->id)){
                foreach($reportStatus as $dep){
                $array_reponse[] = $this->CastKeepNoteData($dep);
            }

            }
        }
        foreach ($creator as  $value) {
            $array_reponse[] = $this->CastKeepNoteData($value);

        }


          
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Keep Note"],"Empty",200);

          }
             
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
        
    }
    public function GetMyKeepNoteArchive(Request $request){
   //     try{
           $validator = Validator::make($request->all(), [
                    'token'=>'required|string'
                ]);
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
    
        $my_note = KeepNoteUser::where('user_id',Auth::guard('user_api')->user()->id)->get();
        $creator = KeepNote::where('user_creator_id',Auth::guard('user_api')->user()->id)->where('keep_note_status_id',2)->get();

        if(!empty($my_note[0]->id)||!empty($creator[0]->id)){
            foreach ($my_note as  $value) {
            $reportStatus = KeepNote::where('id',$value->keep_note_id)->where('keep_note_status_id',2)->get();
            if(!empty($reportStatus[0]->id)){
                foreach($reportStatus as $dep){
                $array_reponse[] = $this->CastKeepNoteData($dep);
            }

            }
        }
        foreach ($creator as  $value) {
            $array_reponse[] = $this->CastKeepNoteData($value);

        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Keep Note"],"Empty",200);

          }
             
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
        
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
     * @param  \App\Models\KeepNote  $keepNote
     * @return \Illuminate\Http\Response
     */
    public function show(KeepNote $keepNote)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\KeepNote  $keepNote
     * @return \Illuminate\Http\Response
     */
    public function edit(KeepNote $keepNote)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\KeepNote  $keepNote
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, KeepNote $keepNote)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\KeepNote  $keepNote
     * @return \Illuminate\Http\Response
     */
    public function destroy(KeepNote $keepNote)
    {
        //
    }
}
