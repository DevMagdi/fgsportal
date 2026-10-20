<?php

namespace App\Http\Controllers\User\FamilyInformation;
use App\Http\Controllers\Controller;
use App\Models\FamilyInformation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
  use Carbon\Carbon;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;

class FamilyInformationController extends Controller
{
     
    public function DeleteFamilyInformation(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                    'family_member_id'=>'required|numeric|exists:family_information,id'
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $familyInformation= FamilyInformation::where('id',$request->family_member_id)->first();

          if(!empty($familyInformation->id)){

            $familyInformation->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"family Information not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateFamilyInformation(Request $request){
         try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'family_member_id'=>'required|numeric|exists:family_information,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $familyInformation=  FamilyInformation::where('id',$request->family_member_id)->first();

          if(!empty($familyInformation->id)){
            $familyInformation->update(
                $request->except(['birth_date'])
              );
              $familyInformation=  FamilyInformation::where('id',$request->family_member_id)->first();
              if(!empty($request->birth_date)){
                $validator = Validator::make($request->all(), [
                   'birth_date' => 'required|date|date_format:m/d/Y',   
                ]);
              if ($validator->fails()) {
     
                  return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
              }
              $familyInformation->update([
                'birth_date'=>Carbon::createFromFormat('m/d/Y', $request-> birth_date),
              ]);
            }

            return ResponseApi::acceptedResponseApi($familyInformation,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"family Information not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateFamilyInformation(Request $request){
          try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'family_name'=>'required|string',
                'relation'=>'required|string',
                'gender'=>'required|string',
                 'birth_date' => 'required|date|date_format:m/d/Y',   
            ]);

            if ($validator->fails()) {
   
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $familyInformation=  FamilyInformation::create([

            'family_name' =>$request->family_name,
            'relation' =>$request->relation,
            'gender' =>$request->gender,
            'birth_date' => Carbon::createFromFormat('m/d/Y', $request-> birth_date),
            'user_id' =>Auth::guard('user_api')->user()->id,
            ]);
         
        
          return ResponseApi::acceptedResponseApi($familyInformation,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    
    public function GetFamilyInformationForUser(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'user_id'=>'required|numeric|exists:users,id'
                ]);
           if ($validator->fails()) {
   
               return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
           }
          $familyInformation = FamilyInformation::where('user_id',$request->user_id)->get();
          if(!empty($familyInformation[0]->id)){
            foreach($familyInformation as $dep){
            $array_reponse[] = [ 
                'name' =>$dep->family_name,
                'relation' =>$dep->relation,
                'gender' =>$dep->gender,
                'birthDate' => Carbon::parse( $dep->birth_date)->format('m/d/Y') ,
               
                 'key'=>$dep->id

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty family Information"],"Empty",200);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }


    public function GetAllFamilyInformation(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                ]);
           if ($validator->fails()) {
   
               return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
           }
          $familyInformation = FamilyInformation::all();
          if(!empty($familyInformation[0]->id)){
            foreach($familyInformation as $dep){
            $array_reponse[] = [ 
                'name' =>$dep->family_name,
                'relation' =>$dep->relation,
                'gender' =>$dep->gender,
                'birthDate' => Carbon::parse( $dep->birth_date)->format('m/d/Y') ,
                'user_id' =>$dep->user_id,
                'user_name' =>$dep->user_id_fun->username,
                 'key'=>$dep->id

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty family Information"],"Empty",200);

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
     * @param  \App\Models\FamilyInformation  $familyInformation
     * @return \Illuminate\Http\Response
     */
    public function show(FamilyInformation $familyInformation)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\FamilyInformation  $familyInformation
     * @return \Illuminate\Http\Response
     */
    public function edit(FamilyInformation $familyInformation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\FamilyInformation  $familyInformation
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, FamilyInformation $familyInformation)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\FamilyInformation  $familyInformation
     * @return \Illuminate\Http\Response
     */
    public function destroy(FamilyInformation $familyInformation)
    {
        //
    }
}
