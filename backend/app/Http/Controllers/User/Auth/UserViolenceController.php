<?php

namespace App\Http\Controllers\User\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\UserDetail;
use App\Models\SubDepartment;
use App\Models\WorkDegree;
use Illuminate\Support\Facades\Hash;

 use Validator;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use App\Models\UserViolence;

class UserViolenceController extends Controller
{
     
    public function BlockAccountViolence(Request $request){
        try{
              $validator = Validator::make($request->all(), [
                'token' => 'required|string',
                'user_violence_message' => 'required|string',
                'user_id' => 'required|numeric|exists:users,id',
              ]);
              if ($validator->fails()) {
      
                  return ResponseApi::validatorErrorResponseApi($validator->errors()->toArray(),"Validator Errors",400);
              }
              $get_user=User::where('id',$request->user_id)->first();
              if(!empty($get_user->id)){
                  $get_user->update([
                      'active'=>0,
                  ]);
                  $userViolence = UserViolence::create([
                        'user_violence_message'=>$request->user_violence_message,
                        'user_id'=>$request->user_id
                  ]);
                  if(!empty($userViolence->id)){
                    return ResponseApi::badMethodErrorResponse(["message"=>"Blocked Sucess"],"Blocked Sucess",201);

                  }else{
                    return ResponseApi::badMethodErrorResponse(["message"=>"Deactivate and not blocked Sucess"],"Deactivate and not blocked Sucess",201);
                  }
  
              }
          }catch(\Exception $e){
              return ResponseApi::badMethodErrorResponse(["message"=>"Server Error"],"server Error",500);
  
          }
      }

      public function GetBlockAccountViolence(Request $request){
        try{
              $validator = Validator::make($request->all(), [
                'token' => 'required|string',
              ]);
              if ($validator->fails()) {
      
                  return ResponseApi::validatorErrorResponseApi($validator->errors()->toArray(),"Validator Errors",400);
              }
              $get_user=UserViolence::all();
              if(!empty($get_user[0]->id)){
                foreach($get_user as $dep){
                    $array_reponse[] = [ 
                        'user_violence_message' =>$dep->user_violence_message,
                        'user_id'=>$dep->user_id,
                        'user_name'=>$dep->user_id_fun->username,
                        'key'=>$dep->id
        
                    ];
                }
                  
                    return ResponseApi::badMethodErrorResponse($array_reponse,"Sucess",201);
  
              }else{
                return ResponseApi::notFoundResponse(['message'=>"Empty Blocked"],"Empty",200);

              }
          }catch(\Exception $e){
              return ResponseApi::badMethodErrorResponse(["message"=>"Server Error"],"server Error",500);
  
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
     * @param  \App\Models\UserViolence  $userViolence
     * @return \Illuminate\Http\Response
     */
    public function show(UserViolence $userViolence)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\UserViolence  $userViolence
     * @return \Illuminate\Http\Response
     */
    public function edit(UserViolence $userViolence)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\UserViolence  $userViolence
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, UserViolence $userViolence)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\UserViolence  $userViolence
     * @return \Illuminate\Http\Response
     */
    public function destroy(UserViolence $userViolence)
    {
        //
    }
}
