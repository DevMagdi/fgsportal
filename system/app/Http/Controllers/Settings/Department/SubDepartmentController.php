<?php

 
namespace App\Http\Controllers\Settings\Department;


use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\SubDepartment;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
class SubDepartmentController extends Controller
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

    public function DeleteSubDepartment(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'sub_department_id'=>'required|numeric',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $department=  SubDepartment::where('id',$request->sub_department_id)->first();

          if(!empty($department->id)){

            $department->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Sub Department not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateSubDepartmentName(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'sub_department_name' => 'required|string|unique:sub_departments',
                'token'=>'required|string',
                'sub_department_id'=>'required|numeric',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $department=  SubDepartment::where('id',$request->sub_department_id)->first();

          if(!empty($department->id)){
            
            $department->update([
                'sub_department_name' =>$request->sub_department_name,
            ]);

            return ResponseApi::acceptedResponseApi($department,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Sub Department not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }


    public function CreateSubDepartment(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'sub_department_name' => 'required|string|unique:sub_departments',
                'token'=>'required|string',
                'departments_id'=>'required|numeric'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $sub_department=  SubDepartment::create([

            'sub_department_name' =>$request->sub_department_name,
            'departments_id' =>$request->departments_id,
           ]);
         
        
          return ResponseApi::acceptedResponseApi($sub_department,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }





    
    public function GetSubDepartmentForSpecificDepartment(Request $request){
        try{
 
             if($request->has('department_name')){
                $validator = Validator::make($request->all(), [
                    'department_name' => 'required|string',
                    
                ]);
                if ($validator->fails()) {
    
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
                $department = Department::where('department_name','=',$request->department_name)->first();
                if(!empty($department)){

                    $subdepartment = Department::join('sub_departments', 'sub_departments.departments_id', '=', 'departments.id')
                    ->where('departments.department_name','=',$request->department_name)->get();
    
                }else{
                    return ResponseApi::badMethodErrorResponse(['message'=>"department name not found"],"Empty",200);

                }

                 
 

            }else if($request->has('department_id')){
                $validator = Validator::make($request->all(), [
                    'department_id' => 'required|integer',
                    
                ]);
                if ($validator->fails()) {
    
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
                $department = Department::where('id',$request->department_id)->first();
                if(!empty($department->id)){
                        $subdepartment = Department::join('sub_departments', 'sub_departments.departments_id', '=', 'departments.id')
                        ->where('departments.id','=',$request->department_id)->get();
                    }else{
                        return ResponseApi::badMethodErrorResponse(['message'=>"department id not found"],"Empty",200);
    
                    }
          
            }else{
                return ResponseApi::notFoundResponse(null,"Empty",200);
            }


                if(!empty($subdepartment[0]->id)){
                    foreach($subdepartment as $dep){
                    $array_reponse[] = [ 
                        'sub_department_name' =>$dep->sub_department_name,
                        'id'=>$dep->id.''
                    ];
                }
                    return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

                }else{
                    return ResponseApi::notFoundResponse(null,"Empty",200);

                }
            
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse($e,"server Error",500);

        }
        
    }



    public function GetSubDepartmentWithDepartment(){
        try{
          $subdepartment = SubDepartment::all();
          if(!empty($subdepartment[0]->id)){
            foreach($subdepartment as $dep){
            $array_reponse[] = [ 
                'sub_department_name' =>$dep->sub_department_name,
                'department_name' =>$dep->departments_id_fun->department_name,
             ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(null,"Empty",204);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(null,"server Error",500);

        }
        
    }

    public function GetAllSubDepartment(){
        try{
          $subdepartment = SubDepartment::all();
          if(!empty($subdepartment[0]->id)){
            foreach($subdepartment as $dep){
            $array_reponse[] = [ 
                'sub_department_name' =>$dep->sub_department_name,
                'id' =>$dep->id.''
            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(null,"Empty",204);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(null,"server Error",500);

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
     * @param  \App\Models\SubDepartment  $subDepartment
     * @return \Illuminate\Http\Response
     */
    public function show(SubDepartment $subDepartment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\SubDepartment  $subDepartment
     * @return \Illuminate\Http\Response
     */
    public function edit(SubDepartment $subDepartment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\SubDepartment  $subDepartment
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, SubDepartment $subDepartment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\SubDepartment  $subDepartment
     * @return \Illuminate\Http\Response
     */
    public function destroy(SubDepartment $subDepartment)
    {
        //
    }
}
