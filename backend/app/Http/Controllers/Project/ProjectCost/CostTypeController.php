<?php

namespace App\Http\Controllers\Project\ProjectCost;

use App\Models\CostType;
use App\Http\Controllers\Controller;
  use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;


class CostTypeController extends Controller
{
     


    public function DeleteCostType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'cost_type_id'=>'required|numeric|exists:cost_types,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $costType=  CostType::where('id',$request->cost_type_id)->first();

          if(!empty($costType->id)){

            $costType->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Cost Type not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateCostType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'cost_type' => 'required|string|unique:cost_types',
                'token'=>'required|string',
                'cost_type_id'=>'required|numeric|exists:cost_types,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $costType=  CostType::where('id',$request->cost_type_id)->first();

          if(!empty($costType->id)){

            $costType->update([
                'cost_type' =>$request->cost_type,
            ]);

            return ResponseApi::acceptedResponseApi($costType,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Cost type not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateCostType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'cost_type' => 'required|string|unique:cost_types',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $costType=  CostType::create([

            'cost_type' =>$request->cost_type,
           ]);
         
        
          return ResponseApi::acceptedResponseApi($costType,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllCostType(){
        try{
            $costType = CostType::where('id',3)->orWhere('id',4)->orWhere('id',6)->orWhere('id',7)->orWhere('id',8)->get();
           if(!empty($costType[0]->id)){
            foreach($costType as $dep){
            $array_reponse[] = [ 
                'cost_type' =>$dep->cost_type,
                'id'=>$dep->id.''

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Cost Type"],"Empty",200);

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
     * @param  \App\Models\LicenceType  $licenceType
     * @return \Illuminate\Http\Response
     */
    public function show(LicenceType $licenceType)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\LicenceType  $licenceType
     * @return \Illuminate\Http\Response
     */
    public function edit(LicenceType $licenceType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\LicenceType  $licenceType
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, LicenceType $licenceType)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\LicenceType  $licenceType
     * @return \Illuminate\Http\Response
     */
    public function destroy(LicenceType $licenceType)
    {
        //
    }
}
