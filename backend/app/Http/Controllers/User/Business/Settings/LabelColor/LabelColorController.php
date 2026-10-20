<?php

namespace App\Http\Controllers\User\Business\Settings\LabelColor;
use App\Http\Controllers\Controller;

use App\Models\LabelColor;
use Illuminate\Http\Request;
use Validator;

use App\Http\Controllers\ResponseTrait\ResponseApi;

class LabelColorController extends Controller
{

    public function DeleteLabelColor(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'label_id'=>'required|numeric|exists:label_colors',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }

          $phoneType=  LabelColor::where('id',$request->label_id)->first();

          if(!empty($phoneType->id)){

            $phoneType->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Label not found"],"Validator Errors",400);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateLabelColor(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'label_id'=>'required|numeric|exists:label_colors',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }
          $phoneType=  LabelColor::where('id',$request->label_id)->first();
          if(!empty($request->label_name)){
            $validator = Validator::make($request->all(), [
                'label_name' => 'required|string|unique:label_colors',
            ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }
          }
          if(!empty($phoneType->id)){
            $phoneType->update($request->all());
            return ResponseApi::acceptedResponseApi($phoneType,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Label not found"],"Validator Errors",400);

          }
         


             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateLabelColor(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'label_name' => 'required|string|unique:label_colors',
                'label_color' => 'required|string',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }

          $phoneType=  LabelColor::create([

            'label_name' =>$request->label_name,
            'label_color' =>$request->label_color,
           ]);
        
          return ResponseApi::acceptedResponseApi($phoneType,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllLabelColor(){
        try{
          $phones = LabelColor::all();
          if(!empty($phones[0]->id)){
            foreach($phones as $dep){
            $array_reponse[] = [ 
                'label_name' =>$dep->label_name,
                'label_color' =>$dep->label_color,
                'id'=>$dep->id.''

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Label Color"],"Empty",200);

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
     * @param  \App\Models\LabelColor  $labelColor
     * @return \Illuminate\Http\Response
     */
    public function show(LabelColor $labelColor)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\LabelColor  $labelColor
     * @return \Illuminate\Http\Response
     */
    public function edit(LabelColor $labelColor)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\LabelColor  $labelColor
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, LabelColor $labelColor)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\LabelColor  $labelColor
     * @return \Illuminate\Http\Response
     */
    public function destroy(LabelColor $labelColor)
    {
        //
    }
}
