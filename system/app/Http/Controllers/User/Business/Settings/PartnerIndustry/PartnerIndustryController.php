<?php

namespace App\Http\Controllers\User\Business\Settings\PartnerIndustry;
use App\Http\Controllers\Controller;

use App\Models\LabelColor;
use Illuminate\Http\Request;
use Validator;

use App\Http\Controllers\ResponseTrait\ResponseApi;
use App\Models\PartnerIndustry;
 
class PartnerIndustryController extends Controller
{
           

           
    public function DeletePartnerIndustry(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'partner_industry_id'=>'required|numeric|exists:partner_industries',
                ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }

          $phoneType=  PartnerIndustry::where('id',$request->partner_industry_id)->first();
          if(!empty($phoneType->id)){

            $phoneType->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"partner industries not found"],"Validator Errors",400);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdatePartnerIndustry(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'partner_industry_id'=>'required|numeric|exists:partner_industries',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }
          $phoneType=  PartnerIndustry::where('id',$request->partner_industry_id)->first();
          if(!empty($request->label_name)){
            $validator = Validator::make($request->all(), [
                'partner_industry_name' => 'required|string|unique:partner_industries',
            ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }
          }
          if(!empty($phoneType->id)){
            $phoneType->update($request->all());
            return ResponseApi::acceptedResponseApi($phoneType,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"partner industries not found"],"Validator Errors",400);

          }
              
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreatePartnerIndustry(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'partner_industry_name' => 'required|string|unique:partner_industries',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }
          $phoneType=  PartnerIndustry::create([
            'partner_industry_name' =>$request->partner_industry_name,
           ]);
        
          return ResponseApi::acceptedResponseApi($phoneType,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllPartnerIndustry(){
        try{
          $phones = PartnerIndustry::all();
          if(!empty($phones[0]->id)){
            foreach($phones as $dep){
            $array_reponse[] = [ 
                'partner_industry_name' =>$dep->partner_industry_name,
                'id'=>$dep->id.''

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty partner industries"],"Empty",200);

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
     * @param  \App\Models\PartnerIndustry  $partnerIndustry
     * @return \Illuminate\Http\Response
     */
    public function show(PartnerIndustry $partnerIndustry)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\PartnerIndustry  $partnerIndustry
     * @return \Illuminate\Http\Response
     */
    public function edit(PartnerIndustry $partnerIndustry)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\PartnerIndustry  $partnerIndustry
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, PartnerIndustry $partnerIndustry)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\PartnerIndustry  $partnerIndustry
     * @return \Illuminate\Http\Response
     */
    public function destroy(PartnerIndustry $partnerIndustry)
    {
        //
    }
}
