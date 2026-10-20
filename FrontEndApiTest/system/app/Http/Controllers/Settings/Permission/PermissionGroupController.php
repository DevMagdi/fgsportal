<?php

namespace App\Http\Controllers\Settings\Permission;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use App\Models\Permission;
use App\Models\PermissionGroup;

use App\Models\UserPermissionGroup;

class PermissionGroupController extends Controller
{
   
    public function GetAllPermissionGroups(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $permission = PermissionGroup::get();
          if(!empty($permission[0]->id)){
            foreach($permission as $dep){
                $array_reponse[] = [ 
                    'id'=>$dep->id,
                    'permission_group_name'=>$dep->permission_group_name,
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


    public function UpdatePermissionGroup(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'permission_group_id'=>'numeric|exists:permission_groups,id',
                'permission_group_name' => 'required|string|unique:permission_groups',

            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $permission=  PermissionGroup::where('id',$request->permission_group_id)->first();

          if(!empty($permission->id)){
            $permission->update([
                'permission_group_name' =>$request->permission_group_name,
               
            ]);
           
    
            return ResponseApi::acceptedResponseApi($permission,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Permission Group not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

    public function CreatePermissionGroup(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'permission_group_name' => 'required|string|unique:permission_groups',

            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

           $permission=  PermissionGroup::create([
            'permission_group_name'=>$request->permission_group_name,
           ]);
         
        
          return ResponseApi::acceptedResponseApi($permission,"success",201);
        

             
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
     * @param  \App\Models\PermissionGroup  $permissionGroup
     * @return \Illuminate\Http\Response
     */
    public function show(PermissionGroup $permissionGroup)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\PermissionGroup  $permissionGroup
     * @return \Illuminate\Http\Response
     */
    public function edit(PermissionGroup $permissionGroup)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\PermissionGroup  $permissionGroup
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, PermissionGroup $permissionGroup)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\PermissionGroup  $permissionGroup
     * @return \Illuminate\Http\Response
     */
    public function destroy(PermissionGroup $permissionGroup)
    {
        //
    }
}
