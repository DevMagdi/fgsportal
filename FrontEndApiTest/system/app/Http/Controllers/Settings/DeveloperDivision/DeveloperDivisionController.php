<?php

 
namespace App\Http\Controllers\Settings\DeveloperDivision;

use App\Http\Controllers\Controller;
 use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use App\Models\DeveloperDivision;

use App\Models\Product;
class DeveloperDivisionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function DeleteDivision(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'sub_products_id' => 'required|numeric|exists:sub_products,id',
                    'users_id' => 'required|numeric|exists:users,id',
                    'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

           $division = DeveloperDivision::where('users_id',$request->users_id)->where('sub_products_id',$request->sub_products_id)->first();

          if(!empty($division->id)){

            $division->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Division not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateDivisionUser(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'old_users_id' => 'required|string|exists:users,id',
                'token'=>'required|string',
                'new_users_id'=>'required|string|exists:users,id',
                'sub_products_id' => 'required|numeric|exists:sub_products,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            
            $division = DeveloperDivision::where('users_id',$request->old_users_id)->where('sub_products_id',$request->sub_products_id)->first();
            if(empty($division->id)){
                return ResponseApi::badMethodErrorResponse(["message"=>" Users id Not Found"],"Validator Errors",400);

            }
 
          if(!empty($division->id)){

            $division->update([
                'users_id' =>$request->new_users_id,
            ]);

            return ResponseApi::acceptedResponseApi($division,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"User Id  not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateDivisionSubProduct(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'old_sub_products_id' => 'required|string|exists:sub_products,id',
                'token'=>'required|string',
                'new_sub_products_id'=>'required|string|exists:sub_products,id',
                'users_id' => 'required|numeric|exists:users,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            
            $division = DeveloperDivision::where('users_id',$request->users_id)->where('sub_products_id',$request->old_sub_products_id)->first();
            if(empty($division->id)){
                return ResponseApi::badMethodErrorResponse(["message"=>" sub product id Not Found"],"Validator Errors",400);

            }
 
          if(!empty($division->id)){

            $division->update([
                'sub_products_id' =>$request->new_sub_products_id,
            ]);

            return ResponseApi::acceptedResponseApi($division,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"SubProduct Id  not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }


      public function CreateDivision(Request $request){
            try{
                $validator = Validator::make($request->all(), [
                    'sub_products_id' => 'required|numeric|exists:sub_products,id',
                    'users_id' => 'required|numeric|exists:users,id',
                    'token'=>'required|string'
                ]);
 
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
                $exist = DeveloperDivision::where('users_id',$request->users_id)->where('sub_products_id',$request->sub_products_id)->first();
                if(!empty($exist->id)){
                    return ResponseApi::badMethodErrorResponse(["message"=>"user id and sub product id already exists"],"Validator Errors",400);

                }
              $division=  DeveloperDivision::create([
                'sub_products_id'=>$request->sub_products_id,
                'users_id' =>$request->users_id,
               ]);
             
            
              return ResponseApi::acceptedResponseApi($division,"success",201);
    
                 
            }catch(\Exception $e){
                return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
    
            }
            
        }
    public function GetAllDivision(){
        try{
          $division = DeveloperDivision::all();
          if(!empty($division[0]->id)){
            foreach($division as $dep){
            $array_reponse[] = [ 
                'sub_products_id' =>$dep->sub_products_id,
                'sub_product_name' =>$dep->sub_products_id_fun->sub_product_name,
                'users_id' =>$dep->users_id,
                'user_name' =>$dep->users_id_fun->username,
                'id'=>$dep->id
            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Divisions"],"Empty",200);

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
     * @param  \App\Models\DeveloperDivision  $developerDivision
     * @return \Illuminate\Http\Response
     */
    public function show(DeveloperDivision $developerDivision)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\DeveloperDivision  $developerDivision
     * @return \Illuminate\Http\Response
     */
    public function edit(DeveloperDivision $developerDivision)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\DeveloperDivision  $developerDivision
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, DeveloperDivision $developerDivision)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\DeveloperDivision  $developerDivision
     * @return \Illuminate\Http\Response
     */
    public function destroy(DeveloperDivision $developerDivision)
    {
        //
    }
}
