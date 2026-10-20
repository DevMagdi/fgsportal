<?php

namespace App\Http\Controllers\ToDo;

use App\Http\Controllers\Controller;
use App\Models\PhoneType;
 use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
 
use App\Models\KeepNoteStatus;

 
class KeepNoteStatusController extends Controller
{

   
    public function DeleteKeepNoteStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'keep_note_status_id'=>'required|numeric|exists:keep_note_statuses,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus=  KeepNoteStatus::where('id',$request->keep_note_status_id)->first();

          if(!empty($reportStatus->id)){

            $reportStatus->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Report Status not found"],"Validator Errors",400);

          }
         
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateKeepNoteStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'keep_note_status_name' => 'required|string|unique:keep_note_statuses',
                'token'=>'required|string',
                'keep_note_status_id'=>'required|numeric|exists:keep_note_statuses,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus=  KeepNoteStatus::where('id',$request->keep_note_status_id)->first();

          if(!empty($reportStatus->id)){

            $reportStatus->update([
                'keep_note_status_name' =>$request->keep_note_status_name,
            ]);

            return ResponseApi::acceptedResponseApi($reportStatus,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Report Status not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateKeepNoteStatus(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'keep_note_status_name' => 'required|string|unique:keep_note_statuses',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $reportStatus=  KeepNoteStatus::create([

            'keep_note_status_name' =>$request->keep_note_status_name,
           ]);
         
        
          return ResponseApi::acceptedResponseApi($reportStatus,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllKeepNoteStatus(Request $request){
        try{
           $validator = Validator::make($request->all(), [
                    'token'=>'required|string'
                ]);
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
    
            
          $reportStatus = KeepNoteStatus::all();
          if(!empty($reportStatus[0]->id)){
            foreach($reportStatus as $dep){
            $array_reponse[] = [ 
                'keep_note_status_name' =>$dep->keep_note_status_name,
                'id'=>$dep->id.''

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Report Status"],"Empty",200);

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
     * @param  \App\Models\KeepNoteStatus  $keepNoteStatus
     * @return \Illuminate\Http\Response
     */
    public function show(KeepNoteStatus $keepNoteStatus)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\KeepNoteStatus  $keepNoteStatus
     * @return \Illuminate\Http\Response
     */
    public function edit(KeepNoteStatus $keepNoteStatus)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\KeepNoteStatus  $keepNoteStatus
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, KeepNoteStatus $keepNoteStatus)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\KeepNoteStatus  $keepNoteStatus
     * @return \Illuminate\Http\Response
     */
    public function destroy(KeepNoteStatus $keepNoteStatus)
    {
        //
    }
}
