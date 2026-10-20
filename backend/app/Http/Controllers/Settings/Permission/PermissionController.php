<?php

 
 namespace App\Http\Controllers\Settings\Permission;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use App\Models\Permission;
use App\Models\PermissionGroup;

use App\Models\UserPermissionGroup;
class PermissionController extends Controller
{
    public function DeletePermission(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'permission_id'=>'required|numeric|exists:permissions,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $permission=  Permission::where('id',$request->permission_id)->first();

          if(!empty($permission->id)){

            $permission->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Permission not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    


    public function UpdatePermission(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'permission_name' => 'required|string',
                'token'=>'required|string',
                'permission_id'=>'required|numeric|exists:permissions,id',
                'permission_group_id'=>'numeric|exists:permission_groups,id',

            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $permission=  Permission::where('id',$request->permission_id)->first();

          if(!empty($permission->id)){
            $permission->update([
                'permission_name' =>$request->has('permission_name')?$request->permission_name : $permission->permission_name,
                'description' =>$request->has('description')?$request->description : $permission->description,
                'permission_group_id' =>$request->has('permission_group_id')?$request->permission_group_id : $permission->permission_group_id,

            ]);
           
    
            return ResponseApi::acceptedResponseApi($permission,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Permission not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreatePermission(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'permission_name' => 'required|string',
                'token'=>'required|string',
                'permission_group_id'=>'required|numeric|exists:permission_groups,id',

            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $permission=  Permission::create([
            'description'=>$request->description,
            'permission_name' =>$request->permission_name,
            'permission_group_id'=>$request->permission_group_id
           ]);
         
        
          return ResponseApi::acceptedResponseApi($permission,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllPermission(){
        try{
          $permission = Permission::all();
          if(!empty($permission[0]->id)){
            foreach($permission as $dep){
            $array_reponse[] = [ 
                'id'=>$dep->id,
                'permission_name' =>$dep->permission_name,
                'permission_group_id'=>!empty($dep->permission_group_id_fun)?$dep->permission_group_id:null,
                'permission_group_name'=>!empty($dep->permission_group_id_fun)?$dep->permission_group_id_fun->permission_group_name:null,
                'description'=>$dep->description,
            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Permissions"],"Empty",200);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllUserByPermissionID(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'permission_id' => 'required|string|exists:permissions,id',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $permission = UserPermissionGroup::where('permissions_id',$request->permission_id)->get();
          if(!empty($permission[0]->id)){
            foreach($permission as $dep){
            $array_reponse[] = [ 
                'key' =>$dep->users_id,
                'username'=>!empty($dep->users_id_fun)?$dep->users_id_fun->username:null,
            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Permissions"],"Empty",200);

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
     * @param  \App\Models\Permission  $permission
     * @return \Illuminate\Http\Response
     */
    public function show(Permission $permission)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Permission  $permission
     * @return \Illuminate\Http\Response
     */
    public function edit(Permission $permission)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Permission  $permission
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Permission $permission)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Permission  $permission
     * @return \Illuminate\Http\Response
     */
    public function destroy(Permission $permission)
    {
        //
    }
}
