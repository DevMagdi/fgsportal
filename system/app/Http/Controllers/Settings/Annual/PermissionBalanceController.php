<?php

namespace App\Http\Controllers\Settings\Annual;

use App\Http\Controllers\Controller;
  use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
 
 use App\Models\PermissionBalance;
 
class PermissionBalanceController extends Controller
{
    
    public function DeletePermissionBalance(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'permission_balance_id'=>'required|numeric|exists:permission_balances,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $permissionBalance=  PermissionBalance::where('id',$request->permission_balance_id)->first();

          if(!empty($permissionBalance->id)){

            $permissionBalance->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Permission Balance not found"],"Validator Errors",400);

          }
         
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdatePermissionBalance(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'monthly_balance' => 'required|numeric',
                'bereavement' => 'required|numeric',
                'marriage' => 'required|numeric',
                'token'=>'required|string',
                'birth' => 'required|numeric',
                'birth_f' => 'required|numeric',

                'permission_balance_id'=>'required|numeric|exists:permission_balances,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $permissionBalance=  PermissionBalance::where('id',$request->permission_balance_id)->first();

          if(!empty($permissionBalance->id)){
            $permissionBalance->update([
                'monthly_balance' =>$request->monthly_balance,
                'bereavement' =>$request->bereavement,
                'marriage' =>$request->marriage,
                'birth' =>$request->birth,
                'birth_f' =>$request->birth_f
            ]);

            return ResponseApi::acceptedResponseApi($permissionBalance,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Permission Balance not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreatePermissionBalance(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'monthly_balance' => 'required|numeric',
                'bereavement' => 'required|numeric',
                'birth' => 'required|numeric',
                'birth_f' => 'required|numeric',
                'marriage' => 'required|numeric',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $permissionBalance=  PermissionBalance::create([
            'monthly_balance' =>$request->monthly_balance,
            'bereavement' =>$request->bereavement,
            'marriage' =>$request->marriage,
            'birth' =>$request->birth,
            'birth_f' =>(float)$dep->birth_f,
        ]);
         
        
          return ResponseApi::acceptedResponseApi($permissionBalance,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllPermissionBalance(){
        try{
          $permissionBalance = PermissionBalance::all();
          $array_reponse=[];
          if(!empty($permissionBalance[0]->id)){
            foreach($permissionBalance as $dep){
            $array_reponse  = [ 
                'monthly_balance' =>(float)$dep->monthly_balance,
                'bereavement' =>(float)$dep->bereavement,
                'marriage' =>(float)$dep->marriage,
                'birth' =>(float)$dep->birth,
                'birth_f' =>(float)$dep->birth_f,
                'key'=>$dep->id.''
            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Permission Balance"],"Empty",200);

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
     * @param  \App\Models\PermissionBalance  $permissionBalance
     * @return \Illuminate\Http\Response
     */
    public function show(PermissionBalance $permissionBalance)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\PermissionBalance  $permissionBalance
     * @return \Illuminate\Http\Response
     */
    public function edit(PermissionBalance $permissionBalance)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\PermissionBalance  $permissionBalance
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, PermissionBalance $permissionBalance)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\PermissionBalance  $permissionBalance
     * @return \Illuminate\Http\Response
     */
    public function destroy(PermissionBalance $permissionBalance)
    {
        //
    }
}
