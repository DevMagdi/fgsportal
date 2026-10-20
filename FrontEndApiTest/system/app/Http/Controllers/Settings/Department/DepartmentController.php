<?php


namespace App\Http\Controllers\Settings\Department;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }
    public function DeleteDepartment(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'department_id'=>'required|numeric',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $department=  Department::where('id',$request->department_id)->first();

          if(!empty($department->id)){

            $department->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Department not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateDepartmentName(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'department_name' => 'required|string|unique:departments',
                'token'=>'required|string',
                'department_id'=>'required|numeric',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $department=  Department::where('id',$request->department_id)->first();

          if(!empty($department->id)){

            $department->update([
                'department_name' =>$request->department_name,
            ]);

            return ResponseApi::acceptedResponseApi($department,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Department not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateDepartment(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'department_name' => 'required|string|unique:departments',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $department=  Department::create([

            'department_name' =>$request->department_name,
           ]);
         
        
          return ResponseApi::acceptedResponseApi($department,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllDepartment(){
        try{
          $department = Department::all();
          if(!empty($department[0]->id)){
            foreach($department as $dep){
            $array_reponse[] = [ 
                'department_name' =>$dep->department_name,
                'id' =>$dep->id.''
            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Department"],"Empty",200);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
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
     * @param  \App\Models\Department  $department
     * @return \Illuminate\Http\Response
     */
    public function show(Department $department)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Department  $department
     * @return \Illuminate\Http\Response
     */
    public function edit(Department $department)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Department  $department
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Department $department)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Department  $department
     * @return \Illuminate\Http\Response
     */
    public function destroy(Department $department)
    {
        //
    }
}
