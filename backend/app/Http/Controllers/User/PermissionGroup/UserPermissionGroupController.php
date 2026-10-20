<?php

namespace App\Http\Controllers\User\PermissionGroup;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use App\Models\Permission;
use App\Models\UserPermissionGroup;
 use App\Models\User;
class UserPermissionGroupController extends Controller
{

     
    public function EditUserPermission(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'users_id'=>'required|numeric|exists:users,id',
                 'permissions_id'=>'required|numeric|exists:permissions,id',
                 'status'=>'required'
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            
          $perm=  UserPermissionGroup::where('permissions_id',$request->permissions_id)->where('users_id',$request->users_id)->first();

          if(!empty($perm->id)){
            if($request->status == 1){
                 
            }else{
                $perm->forceDelete();

            } 

            return ResponseApi::acceptedResponseApi(['message'=>'Success'],"success",201);

          }else{
            if($request->status == 1){
            $perm = UserPermissionGroup::create([
                'permissions_id'=>$request->permissions_id,
                'users_id'=>$request->users_id,
             ]);
             if(!empty($perm->id)){

                 return ResponseApi::acceptedResponseApi(['message'=>'Success'],"success",201);
             }
                else{
                    
                    return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
                }
            }else{

            } 
          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
 



    
    public function GetUserPermission(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'users_id'=>'required|numeric|exists:users,id',
                 ]);
           if ($validator->fails()) {

               return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
           }

           $perm=  UserPermissionGroup::where('users_id',$request->users_id)->get();
           $user=  User::where('id',$request->users_id)->first();
           if(!empty($perm[0]->id) &&!empty($user->id)){
            $arry_response =[];
            foreach ($perm as $key) {
                // A permission row can outlive its lookup entry; skip orphans
                // instead of crashing the whole permission load (which hides
                // every permission-gated card in the UI).
                $permission = $key->permissions_id_fun;
                if (empty($permission->id)) {
                    continue;
                }
                $arry_response []=[
                    'userKey'=>$user->id.'',
                    'username'=>$user->username,
                    'permission_name'=> $permission->permission_name,
                    'permission_id'=>$key->permissions_id.'',
                    'status'=>true
                ];
            }
            if (empty($arry_response)) {
                return ResponseApi::notFoundResponse(null,"Empty",200);
            }
            return ResponseApi::acceptedResponseApi($arry_response,"success",201);

           }else{
            return ResponseApi::notFoundResponse(null,"Empty",200);

           }

        }catch(\Throwable $e){
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
     * @param  \App\Models\UserPermissionGroup  $userPermissionGroup
     * @return \Illuminate\Http\Response
     */
    public function show(UserPermissionGroup $userPermissionGroup)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\UserPermissionGroup  $userPermissionGroup
     * @return \Illuminate\Http\Response
     */
    public function edit(UserPermissionGroup $userPermissionGroup)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\UserPermissionGroup  $userPermissionGroup
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, UserPermissionGroup $userPermissionGroup)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\UserPermissionGroup  $userPermissionGroup
     * @return \Illuminate\Http\Response
     */
    public function destroy(UserPermissionGroup $userPermissionGroup)
    {
        //
    }
}
