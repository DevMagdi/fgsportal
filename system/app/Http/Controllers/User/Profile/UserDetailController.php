<?php

namespace App\Http\Controllers\User\Profile;
use App\Http\Controllers\Controller;
use App\Models\UserSalary;
use Illuminate\Http\Request;
use App\Models\UserSalaryHistory;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Carbon\Carbon;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use App\Models\UserDetail;
use App\Models\Log;
use App\Models\UserViolence;
use Illuminate\Support\Str;
use File;
use App\Models\Rating;
use Illuminate\Support\Facades\Mail;

use App\Mail\ContractEnded;


class UserDetailController extends Controller
{
    
    public function ExpiredUserContact(){
        try{
            $message = null;
            $contract_start_date = null;
            
            $near_contract_end =null;
            $contract_ended = null;
            $user_contract  = User::where('active',1)->where('id','<>',1)->get();
            foreach ($user_contract as  $value) {
                $now_date =null;
                if(empty($value->user_details_id_fun->contractEndDate)||empty($value->user_details_id_fun->contractStartDate)){
                    $contract_start_date = $contract_start_date .'<br>'.  $value->username ;
                }else{
                    $date  =  Carbon::parse($value->user_details_id_fun->contractEndDate)->format('m/d/Y');
                    $now_date = Carbon::today()->addMonths(3);
                    $now_date_today = Carbon::today();
                    $date = Carbon::create($date);
                    if($now_date_today->greaterThan($date)){
                        $contract_ended = $contract_ended .'<br>'.  $value->username ;

                    }else if($now_date->greaterThanOrEqualTo($date)){
                        $near_contract_end = $near_contract_end .'<br>'.  $value->username ;

                    }
                }
            }
            if(!empty($contract_start_date)){
                $message = "Kindly be informed that there is no Contract Date for users ".$contract_start_date .'    ';
            
            }
            if(!empty($message)){
                $message = $message.'<br><br><br>';
            }
            if(!empty($near_contract_end)){
                $message = $message."Kindly be informed that Some contracts near to expired ".$near_contract_end .'    ';
            
            }
            if(!empty($message)){
                $message = $message.'<br><br><br>';
            }
            if(!empty($contract_ended)){
                $message = $message."Kindly be informed that Some contracts expired ".$contract_ended .'    ';
            
            }
            

              
                  
  
                  $user = User::where('sub_departments_id',5)->orWhere('sub_departments_id',10)->orWhere('sub_departments_id',9)->get();
                  $mailto = [];
                  foreach($user as $sen){
                      $mailto[]=$sen->email;
                  }
                  if(!empty($mailto)){
                  //  $message  =  Carbon::parse( $value->contract_end_date)->format('m/d/Y');
                    $message =nl2br($message);
                   // $mailto = ["ataha@firstgulfsolutions.com"];
                 
                    try{
                      $log=  Log::create([
                        'action' => "Send Email User Contract ".$message,
                        'actionKeys' =>"Send Email To ".implode(",",$mailto) ,
                        'empKey' =>1,
                        'empName' =>"Cron Job",
                        'createdAt' =>Carbon::now(),
                        'actionStatus' =>'Try',
                    ]);
  
                      Mail::to($mailto)->send(new ContractEnded($message));   
                      $log=  Log::create([
                        'action' => "Send Email User Contract ".$message,
                        'actionKeys' =>"Send Email To ".implode(",",$mailto) ,
                        'empKey' =>1,
                        'empName' =>"Cron Job",
                        'createdAt' =>Carbon::now(),
                        'actionStatus' =>'Success',
                    ]); 
                    }catch(\Exception $e){
                     //   return $e;
                      $log=  Log::create([
                        'action' => "Send Email User Contract ".$message,
                        'actionKeys' =>"Send Email To ".implode(",",$mailto) ,
                        'empKey' =>1,
                        'empName' =>"Cron Job",
                        'createdAt' =>Carbon::now(),
                        'actionStatus' =>'Failed',
                    ]);
                  
                  
  
  
                }
            }
        }catch(\Exception $e){
        return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
  
       }
    }

    public function GetUserProfileData(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'user_id'=>'required|numeric|exists:users,id'
                ]);
           if ($validator->fails()) {
               return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
           }
          $userSalary = UserSalary::where('assign_to_id',$request->user_id)->first();
          $user_detail = User::where('id',$request->user_id)->first();

           $total_rate = Rating::whereHas('question_id_fun',function($q){
            $q->where('question_type_id',1);
           })->whereHas('ask_to_rate_id_fun',function($q)use($request){
            $q->where('user_to_rate_id',$request->user_id);
           })->get()->sum('rate');
    
            $rate_count = Rating::whereHas('question_id_fun',function($q){
            $q->where('question_type_id',1);
           })->whereHas('ask_to_rate_id_fun',function($q)use($request){
            $q->where('user_to_rate_id',$request->user_id);
           })->get()->count();
           if($rate_count!=0){
                 $total_rate =  $total_rate/$rate_count;
           }
          $array_reponse=[
            'key'=>$user_detail->id.'',
            'username'=>$user_detail->username,
            'email'=>$user_detail->email,
            'firstname'=>$user_detail->firstname,
            'lastname'=>$user_detail->lastname,
            'accType'=>"Employee",
            'my_total_rate'=>$total_rate,
            'accRole'=>$user_detail->sub_departments_id,
            'accPosition'=>$user_detail->work_degrees_id,
            'department'=>$user_detail->sub_departments_id_fun->departments_id,
            'department_name'=>$user_detail->sub_departments_id_fun->departments_id_fun->department_name,
            'accRole_name'=>$user_detail->sub_departments_id_fun->sub_department_name,
            'accPosition_name'=>$user_detail->work_degrees_id?$user_detail->work_degrees_id_fun->work_degree_name:null,
            'photoURL'=>$user_detail->photoURL?'/Attachments/User/'.$user_detail->id.'/profile'.'/'.$user_detail->photoURL:null,
            'createdAt'=>$user_detail->created_at,
            'updatedAt'=>$user_detail->updated_at,
            'CreatorID'=>$user_detail->user_creator_id,
            'CreatorName'=>$user_detail->user_creator_id? $user_detail->user_creator_id_fun->username:null,
            'canAddPreviousReports'=>$user_detail->canAddPreviousReports==1 ? (boolean)true :(boolean) false,
            'canAddPreviousReportsDate'=>$user_detail->canAddPreviousReportsDate,
            'gender'=>$user_detail->gender,
            'salary'=>$userSalary?(float)$userSalary->salary:0,
            'myCurrentSalary'=>$userSalary?(float)$userSalary->last_payment:0,
            'birthDate'=>$user_detail->user_details_id_fun->birthDate,
            'mobileNumber'=>$user_detail->mobileNumber?($user_detail->mobileNumber):null,
            'address'=>$user_detail->user_details_id_fun->address,
            'maritalStatus'=>$user_detail->user_details_id_fun->maritalStatus,
            'hiringDate'=>$user_detail->user_details_id_fun->hiringDate,
            'contractStartDate'=>$user_detail->user_details_id_fun->contractStartDate,
            'contractEndDate'=>$user_detail->user_details_id_fun->contractEndDate,
            'emergancyPhoneNumber'=>$user_detail->user_details_id_fun->emergancyPhoneNumber,
            'emergancyPhoneNumberRelation'=>$user_detail->user_details_id_fun->emergancyPhoneNumberRelation,
            'emergancyPhoneNumberName'=>$user_detail->user_details_id_fun->emergancyPhoneNumberName,
            'socialSecureityNumber'=>$user_detail->user_details_id_fun->socialSecureityNumber,
            'refreshRequired'=>$user_detail->refreshRequired,
          ];
          

          return ResponseApi::acceptedResponseApi($array_reponse,"success",201);


         
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse($e,"server Error" +$e,201);

        }
        
    }

public function castUserProfileData(User $user){
        //  $validator = Validator::make($request->all(), [
        //         'token'=>'required|string',
        //         'user_id'=>'required|numeric|exists:users,id'
        //         ]);
        //   if ($validator->fails()) {
        //       return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
        //   }
          $user_id = $user->id;
            // return $user_id;
          $userSalary = UserSalary::where('assign_to_id',$user_id)->first();
          $user_detail = User::where('id',$user_id)->first();

        //   $total_rate = Rating::whereHas('question_id_fun',function($q){
        //     $q->where('question_type_id',1);
        //   })->whereHas('ask_to_rate_id_fun',function($q)use($request){
        //     $q->where('user_to_rate_id',$user_id);
        //   })->get()->sum('rate');
    
        //     $rate_count = Rating::whereHas('question_id_fun',function($q){
        //     $q->where('question_type_id',1);
        //   })->whereHas('ask_to_rate_id_fun',function($q)use($request){
        //     $q->where('user_to_rate_id',$user_id);
        //   })->get()->count();
        //   if($rate_count!=0){
        //          $total_rate =  $total_rate/$rate_count;
        //   }
          $array_reponse=[
            'key'=>$user_detail->id.'',
            'username'=>$user_detail->username,
            'email'=>$user_detail->email,
            'firstname'=>$user_detail->firstname,
            'lastname'=>$user_detail->lastname,
            'accType'=>"Employee",
            // 'my_total_rate'=>$total_rate,
            'accRole'=>$user_detail->sub_departments_id,
            'accPosition'=>$user_detail->work_degrees_id,
            'department'=>$user_detail->sub_departments_id_fun->departments_id,
            'department_name'=>$user_detail->sub_departments_id_fun->departments_id_fun->department_name,
            'accRole_name'=>$user_detail->sub_departments_id_fun->sub_department_name,
            'accPosition_name'=>$user_detail->work_degrees_id?$user_detail->work_degrees_id_fun->work_degree_name:null,
            'photoURL'=>$user_detail->photoURL?'/Attachments/User/'.$user_detail->id.'/profile'.'/'.$user_detail->photoURL:null,
            'createdAt'=>$user_detail->created_at,
            'updatedAt'=>$user_detail->updated_at,
            'CreatorID'=>$user_detail->user_creator_id,
            'CreatorName'=>$user_detail->user_creator_id? $user_detail->user_creator_id_fun->username:null,
            'canAddPreviousReports'=>$user_detail->canAddPreviousReports==1 ? (boolean)true :(boolean) false,
            'canAddPreviousReportsDate'=>$user_detail->canAddPreviousReportsDate,
            'gender'=>$user_detail->gender,
            'salary'=>$userSalary?(float)$userSalary->salary:0,
            'myCurrentSalary'=>$userSalary?(float)$userSalary->last_payment:0,
            'birthDate'=>$user_detail->user_details_id_fun->birthDate,
            'mobileNumber'=>$user_detail->mobileNumber?($user_detail->mobileNumber):null,
            'address'=>$user_detail->user_details_id_fun->address,
            'maritalStatus'=>$user_detail->user_details_id_fun->maritalStatus,
            'hiringDate'=>$user_detail->user_details_id_fun->hiringDate,
            'contractStartDate'=>$user_detail->user_details_id_fun->contractStartDate,
            'contractEndDate'=>$user_detail->user_details_id_fun->contractEndDate,
            'emergancyPhoneNumber'=>$user_detail->user_details_id_fun->emergancyPhoneNumber,
            'emergancyPhoneNumberRelation'=>$user_detail->user_details_id_fun->emergancyPhoneNumberRelation,
            'emergancyPhoneNumberName'=>$user_detail->user_details_id_fun->emergancyPhoneNumberName,
            'socialSecureityNumber'=>$user_detail->user_details_id_fun->socialSecureityNumber,
            'refreshRequired'=>$user_detail->refreshRequired,
          ];
          

          return $array_reponse;
    }
    
    public function getAllUserData(Request $request){
        try{
              $validator = Validator::make($request->all(), [
                'token' => 'required|string',

              ]);
              if ($validator->fails()) {
      
                  return ResponseApi::validatorErrorResponseApi($validator->errors()->toArray(),"Validator Errors",400);
              }

              $get_user=User::where('id','<>',1)->where('active',1)->get();

              if(!empty($get_user[0]->id)){
                foreach($get_user as $dep){
                    
                    $array_reponse[] =$this->castUserProfileData($dep);
                }
                  
                    return ResponseApi::badMethodErrorResponse($array_reponse,"Sucess",201);
  
              }else{
                return ResponseApi::notFoundResponse(['message'=>"Empty User"],"Empty",200);

              }
          }catch(\Exception $e){
              return $e;
              return ResponseApi::badMethodErrorResponse(["message"=>"Server Error"],"server Error",500);
  
          }
      }
    

    public function CanAddPreviousReport(Request $request){
        try{
             $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'user_id'=>'required|numeric|exists:users,id',
                 'canAddPreviousReports'=>'required|boolean',
                 ]);

            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
           $user_detail = User::where('id',$request->user_id)->first();
 
           if($request->canAddPreviousReports == false){
                $user_detail->update([
                    'canAddPreviousReports'=>0,
                ]);
           }else{
                $user_detail->update([
                    'canAddPreviousReports'=>1,
                    'canAddPreviousReportsDate'=>Carbon::now(),
                ]);
           }
           $user_detail = User::where('id',$request->user_id)->first();
           $userSalary = UserSalary::where('assign_to_id',$request->user_id)->first();
           $array_reponse=[
             'key'=>$user_detail->id.'',
             'username'=>$user_detail->username,
             'email'=>$user_detail->email,
             'firstname'=>$user_detail->firstname,
             'lastname'=>$user_detail->lastname,
             'accType'=>"Employee",
             'accRole'=>$user_detail->sub_departments_id,
             'accPosition'=>$user_detail->work_degrees_id,
             'department'=>$user_detail->sub_departments_id_fun->departments_id,
             'department_name'=>$user_detail->sub_departments_id_fun->departments_id_fun->department_name,
             'accRole_name'=>$user_detail->sub_departments_id_fun->sub_department_name,
             'accPosition_name'=>$user_detail->work_degrees_id?$user_detail->work_degrees_id_fun->work_degree_name:null,
             'photoURL'=>$user_detail->photoURL?'/Attachments/User/'.$user_detail->id.'/profile'.'/'.$user_detail->photoURL:null,
             'createdAt'=>$user_detail->created_at,
             'updatedAt'=>$user_detail->updated_at,
             'CreatorID'=>$user_detail->user_creator_id,
             'CreatorName'=>$user_detail->user_creator_id? $user_detail->user_creator_id_fun->username:null,
             'canAddPreviousReports'=>$user_detail->canAddPreviousReports==1?(boolean)true:(boolean)false,
             'canAddPreviousReportsDate'=>$user_detail->canAddPreviousReportsDate,
             'gender'=>$user_detail->gender,
             'salary'=>$userSalary?(float)$userSalary->salary:0,
             'myCurrentSalary'=>$userSalary?(float)$userSalary->last_payment:0,
             'birthDate'=>$user_detail->user_details_id_fun->birthDate,
             'mobileNumber'=>$user_detail->mobileNumber?($user_detail->mobileNumber):null,
             'address'=>$user_detail->user_details_id_fun->address,
             'maritalStatus'=>$user_detail->user_details_id_fun->maritalStatus,
             'hiringDate'=>$user_detail->user_details_id_fun->hiringDate,
             'contractStartDate'=>$user_detail->user_details_id_fun->contractStartDate,
             'contractEndDate'=>$user_detail->user_details_id_fun->contractEndDate,
             'emergancyPhoneNumber'=>$user_detail->user_details_id_fun->emergancyPhoneNumber,
             'emergancyPhoneNumberRelation'=>$user_detail->user_details_id_fun->emergancyPhoneNumberRelation,
             'emergancyPhoneNumberName'=>$user_detail->user_details_id_fun->emergancyPhoneNumberName,
             'socialSecureityNumber'=>$user_detail->user_details_id_fun->socialSecureityNumber,
             'refreshRequired'=>$user_detail->refreshRequired,
           ];
           
 
           return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
 
 
          
              
         }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
         
    }

  
    public function UploadProfileData(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'user_id'=>'required|numeric|exists:users,id'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            $user_data = User::where('id',$request->user_id)->first();
            $user_details = UserDetail::where('id',$user_data->user_details_id)->first();

            if(!empty($user_data->id)){

                $user_data->update(
                    $request->all()
                  );
            }
            if(!empty($user_details->id)){
               
                $user_details->update(
                    $request->except(['birthDate','hiringDate','contractStartDate','contractEndDate'])
                  );
                  //birthdate
                  if(!empty($request->birthDate)){
                    $validator = Validator::make($request->all(), [
                      'birthDate' => 'required|date',
                   ]);
                  if ($validator->fails()) {
                      return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                  }
                  $user_data = User::where('id',$request->user_id)->first();
                  $user_details = UserDetail::where('id',$user_data->user_details_id)->first();
                  $user_details->update([
                    'birthDate'=>Carbon::createFromFormat('m/d/Y', $request->birthDate),
                  ] );              
                 }
                 //hiring date
                 if(!empty($request->hiringDate)){
                    $validator = Validator::make($request->all(), [
                      'hiringDate' => 'required|date',
                   ]);
                  if ($validator->fails()) {
            
                      return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                  }
                  $user_data = User::where('id',$request->user_id)->first();

                  $user_details = UserDetail::where('id',$user_data->user_details_id)->first();
                  $user_details->update([
                    'hiringDate'=>Carbon::createFromFormat('m/d/Y', $request->hiringDate),
                  ] );              
                 }
                 //contract start date
                 if(!empty($request->contractStartDate)){
                    $validator = Validator::make($request->all(), [
                      'contractStartDate' => 'required|date',
                   ]);
                  if ($validator->fails()) {
            
                      return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                  }
                  $user_data = User::where('id',$request->user_id)->first();

                  $user_details = UserDetail::where('id',$user_data->user_details_id)->first();
                  $user_details->update([
                    'contractStartDate'=>Carbon::createFromFormat('m/d/Y', $request->contractStartDate),
                  ] );              
                 }
                 //contract end date
                 if(!empty($request->contractEndDate)){
                    $validator = Validator::make($request->all(), [
                      'contractEndDate' => 'required|date',
                   ]);
                  if ($validator->fails()) {
            
                      return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                  }
                  $user_data = User::where('id',$request->user_id)->first();

                  $user_details = UserDetail::where('id',$user_data->user_details_id)->first();
                  $user_details->update([
                    'contractEndDate'=>Carbon::createFromFormat('m/d/Y', $request->contractEndDate),
                  ] );              
                 }
                 return ResponseApi::acceptedResponseApi(['message'=>'Updated Success'],"success",201);

        }else{
            return ResponseApi::acceptedResponseApi(['message'=>'Empty User'],"Empty",200);

        }
            
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
    }



    public function UploadProfilePhoto(Request $request){

        
        try{
           
            $validator = Validator::make($request->all(), [
                'user_id' => 'required|numeric|exists:users,id',
                'token'=>'required|string',
                'photoURL'=>'required'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

            $fileArray = array('photoURL' => $request->photoURL);

            // Tell the validator that this file should be an image
            $rules = array(
              'photoURL' => 'mimes:jpeg,jpg,png,gif|required|max:1000' // max 10000kb
            );
        
            // Now pass the input and rules into the validator
            $validator = Validator::make($fileArray, $rules);
        
            // Check to see if validation fails or passes
            if ($validator->fails())
            {
                //$user_detail = User::where('id',$request->user_id)->first();
                // $user_detail->update([
                //     'active'=>0,
                // ]);
                // UserViolence::create([
                //     'user_violence_message'=>'you try to upload a file not supported format please contact Admin to reactivate you',
                //     'user_id'=>$request->user_id,
                // ]);
                  // Redirect or return json to frontend with a helpful message to inform the user 
                  // that the provided file was not an adequate type
                  return ResponseApi::acceptedResponseApi($validator->errors()->all(),"Faild Format",400);
                }

               if ($request->hasFile('photoURL'))  {
                $image = $request->file('photoURL');

              //  return $request->photoURL;
              $random = Str::random(10);

                $file_name = $random;
                $user_detail = User::where('id',$request->user_id)->first();
                // $image_path = 'Attachments/User/'.$user_detail->id.'/profile/'.$user_detail->photoURL;  // Value is not URL but directory file path
                // if(File::exists($image_path)) {
                //     File::delete($image_path);
                // }
                $user_detail->update([
                    'photoURL'=>$file_name,
                ]);
                    $user_detail = User::where('id',$request->user_id)->first();

                              
                
                              // return ResponseApi::acceptedResponseApi($user_detail->id,"success",201);
                    $image->move(('Attachments/User/'.$user_detail->id.'/profile/'), $file_name);
               
                    return ResponseApi::acceptedResponseApi(["message"=>'success'],"success",201);

            
 
            }else{
                return ResponseApi::badMethodErrorResponse(["message"=>"Attach File Must Be Exist"],"Validator Errors",400);

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
     * @param  \App\Models\UserDetail  $userDetail
     * @return \Illuminate\Http\Response
     */
    public function show(UserDetail $userDetail)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\UserDetail  $userDetail
     * @return \Illuminate\Http\Response
     */
    public function edit(UserDetail $userDetail)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\UserDetail  $userDetail
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, UserDetail $userDetail)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\UserDetail  $userDetail
     * @return \Illuminate\Http\Response
     */
    public function destroy(UserDetail $userDetail)
    {
        //
    }
}
