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
use App\Models\UserViolence;
use App\Models\PasswordReset;
use App\Models\UserOpenToWork;
 use Validator;
 use App\Mail\ForgetPasswordMail;
 use Carbon\Carbon;
 use Illuminate\Support\Facades\Mail;
 use App\Http\Controllers\ApiMessage\MessageController;

use App\Http\Controllers\ResponseTrait\ResponseApi;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Crypt;
use App\Mail\WelcomeMail;

class AuthController extends Controller
{
    public function OpenToWorkNotification(User $user1 , User $user2){
        $msg = array
             (
               "body"=> $user1->username . " Ready for Work now",
               "createdAt"=>Carbon::now(),
               "receverKey"=> $user2->id.'',
               "receverName"=> $user2->username,
               "redirection"=> "/manager/available",
               "senderKey"=> $user1->id.'',
               "senderName"=> $user1->username,
               "status"=> 0,
               "updatedAt"=>Carbon::now(),
               "title"=>"Open To Work",
               'senderImg'=>$user1->photoURL?'/Attachments/User/'.$user1->id.'/profile'.'/'.$user1->photoURL:null,
             );

       MessageController::notificationSend($msg);
    }

    public function ClosePreviousReport(){
        try{

            $users = User::where('canAddPreviousReports',1)->get();
            foreach($users as $us){
                $us->update([
                    'canAddPreviousReports'=>0,
                ]);
            }
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
    }
    public function FilterUser(Request $request){
         try{
              $validator = Validator::make($request->all(), [
                'token' => 'required|string',
              ]);
              if ($validator->fails()) {
      
                  return ResponseApi::validatorErrorResponseApi($validator->errors()->toArray(),"Validator Errors",400);
              }
    
              if(!empty($request->sub_department_id)&&!empty($request->work_degrees_id)){
                    $get_user=User::where('sub_departments_id',$request->sub_department_id)->where('active','<>',0)->where('work_degrees_id',$request->work_degrees_id)->get();
                    if(!empty($get_user[0]->id)){
                        foreach($get_user as $dep){
                            
                            $array_reponse[] =$this->castUserData($dep);
                        }
                          
                            return ResponseApi::badMethodErrorResponse($array_reponse,"Success",201);
                    }
              }else if(!empty($request->sub_department_id)&&empty($request->work_degrees_id)){
                $get_user=User::where('sub_departments_id',$request->sub_department_id)->get();
                if(!empty($get_user[0]->id)){
                    foreach($get_user as $dep){
                        
                        $array_reponse[] =$this->castUserData($dep);
                    }
                      
                        return ResponseApi::badMethodErrorResponse($array_reponse,"Success",201);
                }

              }else if(!empty($request->department_id)&&empty($request->work_degrees_id)&&empty($request->sub_department_id)){
 
                $get_user=User::where('active','<>',0)->join('sub_departments','sub_departments.id','sub_departments_id')->where('sub_departments.departments_id',$request->department_id)->get(['users.*']);
                if(!empty($get_user[0]->id)){
                    foreach($get_user as $dep){
                        
                        $array_reponse[] =$this->castUserData($dep);
                    }
                      
                        return ResponseApi::badMethodErrorResponse($array_reponse,"Success",201);
                }

              }else if(!empty($request->department_id)&&!empty($request->work_degrees_id)&&empty($request->sub_department_id)){
 
                $get_user=User::where('users.work_degrees_id',$request->work_degrees_id)->where('users.active','<>',0)->join('sub_departments','sub_departments.id','users.sub_departments_id')
                ->where('sub_departments.departments_id',$request->department_id)->get(['users.*']);
               // return ResponseApi::badMethodErrorResponse($get_user,"Success",201);

                if(!empty($get_user[0]->id)){
                    foreach($get_user as $dep){
                        
                        $array_reponse[] =$this->castUserData($dep);
                    }
                      
                        return ResponseApi::badMethodErrorResponse($array_reponse,"Success",201);
                }

              }else if(empty($request->sub_department_id)&&!empty($request->work_degrees_id)&&empty($request->department_id)){
                $get_user=User::where('work_degrees_id',$request->work_degrees_id)->where('active','<>',0)->get();
                if(!empty($get_user[0]->id)){
                    foreach($get_user as $dep){
                        
                        $array_reponse[] =$this->castUserData($dep);
                    }
                      
                        return ResponseApi::badMethodErrorResponse($array_reponse,"Success",201);
                }

              }else{

                return ResponseApi::notFoundResponse(['message'=>"Empty User"],"Empty",200);
    
              }
              return ResponseApi::notFoundResponse(['message'=>"Empty User"],"Empty",200);

          }catch(\Exception $e){
              return ResponseApi::badMethodErrorResponse(["message"=>"Server Error"],"server Error",500);
    
          }
        }

    
    public function EditUser(Request $request){
        try{
              $validator = Validator::make($request->all(), [
                  'token' => 'required|string',
                  'user_id'=> 'required|numeric|exists:users,id'
              ]);
              if ($validator->fails()) {
      
                  return ResponseApi::validatorErrorResponseApi($validator->errors()->toArray(),"Validator Errors",400);
              }
              if(!empty($request->username)||!empty($request->firstname)||!empty($request->lastname)||!empty($request->email)||
              !empty($request->gender)||!empty($request->mobileNumber)||!empty($request->active)||!empty($request->work_degrees_id)||
              !empty($request->refreshRequired)||!empty($request->branches_id)||!empty($request->sub_departments_id)){
                $get_user=User::where('id',$request->user_id)->first();
                if(!empty($get_user->id)){
                    $get_user->update(
                        $request->all()
                    );
                }
              }
              if(!empty($request->emergancyPhoneNumber)||!empty($request->emergancyPhoneNumberName)||!empty($request->emergancyPhoneNumberRelation)
              ||!empty($request->socialSecureityNumber)||!empty($request->graduation_year)||!empty($request->university)||!empty($request->need_paper)
              ||!empty($request->full_information)||
              !empty($request->address)||!empty($request->birthDate)||!empty($request->hiringDate)||!empty($request->contractStartDate)||
              !empty($request->contractEndDate)||!empty($request->maritalStatus)||!empty($request->certificate)){
                $get_user_data=User::where('id',$request->user_id)->first();
                $get_user_details=UserDetail::where('id',$get_user_data->user_details_id)->first();
                if(!empty($get_user_details->id)){
                    $get_user_details->update(
                        $request->all()
                    );
                }
              }
              $get_user_data=User::where('id',$request->user_id)->first();

              $array_reponse = $this->castUserData($get_user_data);
              
                  return ResponseApi::badMethodErrorResponse($array_reponse,"Updated Sucess",201);

              
          }catch(\Exception $e){
              return ResponseApi::badMethodErrorResponse(["message"=>"Server Error"],"server Error",500);
  
          }
      }
    public function UserRefreshed(Request $request){
        try{
              $validator = Validator::make($request->all(), [
                  'token' => 'required|string',
              ]);
              if ($validator->fails()) {
      
                  return ResponseApi::validatorErrorResponseApi($validator->errors()->toArray(),"Validator Errors",400);
              }

              $get_user=User::where('id',Auth::guard('user_api')->user()->id)->first();
              if(!empty($get_user->id)){
                $get_user->update([
                    'refreshRequired'=>0,
                ]);
              
                  return ResponseApi::badMethodErrorResponse(["message"=>"Updated Sucess"],"Updated Sucess",201);

              }
          }catch(\Exception $e){
              return ResponseApi::badMethodErrorResponse(["message"=>"Server Error"],"server Error",500);
  
          }
      }

    public function RefreshAll(Request $request){
        try{
              $validator = Validator::make($request->all(), [
                  'token' => 'required|string',
              ]);
              if ($validator->fails()) {
      
                  return ResponseApi::validatorErrorResponseApi($validator->errors()->toArray(),"Validator Errors",400);
              }

              $get_user=User::all();
              if(!empty($get_user[0]->id)){

                foreach($get_user as $dep){
                  $dep->update([
                      'refreshRequired'=>1,
                  ]);
                }
                  return ResponseApi::badMethodErrorResponse(["message"=>"Refresh Sucess"],"Refresh Sucess",201);

              }
          }catch(\Exception $e){
              return ResponseApi::badMethodErrorResponse(["message"=>"Server Error"],"server Error",500);
  
          }
      }
    public function castUserData(User $user){
        $department_id= null;
        if(empty( $user->work_degrees_id)){
           $work_degree=null;
       }else{
           $work_degree = $user->work_degrees_id_fun->work_degree_name;
       }
       if(empty( $user->sub_departments_id)){
        $sub_department=null;
        $department =null;
        }else{
            $sub_department =$user->sub_departments_id_fun->sub_department_name;
            $department =$user->sub_departments_id_fun->departments_id_fun->department_name;
            $department_id = $user->sub_departments_id_fun->departments_id;

       }
       
       $allOpenToWork = UserOpenToWork::where('user_id',$user->id)->where('active',1)->first();
       if(empty($allOpenToWork->id)){
           $openToWork = 0;
       }else{
           $openToWork = 1;
       }
       
       
       $castUser=[
        'canAddPreviousReports'=>$user->canAddPreviousReports==1?true:false,
            'canAddPreviousReportsDate'=>$user->canAddPreviousReportsDate,
        'key'=>$user->id ."",
        'username'=>$user->username,
        'firstname'=>$user->firstname,
           'lastname'=>$user->lastname,
           'email'=>$user->email,
           'photoURL'=>$user->photoURL?'/Attachments/User/'.$user->id.'/profile'.'/'.$user->photoURL:null,
           'gender'=>$user->gender,
           'active'=>$user->active,
           'work_degree_name'=>$work_degree,
           'sub_department_name'=>$sub_department,
           'department_name'=>$department,
           'accType'=>"Employee",
           'open_to_work'=>$allOpenToWork,
           'accRole'=>$user->sub_departments_id,
           'accPosition'=>$user->work_degrees_id,
           'department'=>$department_id,
           'refreshRequired'=>(int)$user->refreshRequired,
           'token'=>$user->token,
           'need_paper'=>(int) optional($user->user_details_id_fun)->need_paper,
           'full_information'=>(int) optional($user->user_details_id_fun)->full_information,
           'change_password'=>(int) optional($user->user_details_id_fun)->change_password,
       ];
       return $castUser;
   }
   public function NewPasswordUser(Request  $request){
    try{
            $validator = Validator::make($request->all(), [
                'email'=>'required|email|exists:password_resets,email',
                'token'=>'required|string|exists:password_resets,token',
                'password' => 'required|confirmed|min:8',

            ]);
            if ($validator->fails()) {

                return ResponseApi::validatorErrorResponseApi($validator->errors()->toArray(),"Validator Errors",400);
            }
            $get_reset_password = PasswordReset::where('email',$request->email)->where('token',$request->token)->first();
            if(!empty($get_reset_password->id)){
            $send_time =  Carbon::parse($get_reset_password->created_at);
            $press_time = Carbon::parse(Carbon::now()->toDateTimeString()) ;
            $diff= $press_time->diffInSeconds($send_time);
            if($diff >3600){
                return ResponseApi::badMethodErrorResponse(['message'=>"Reset Email Time Expired"],"Validator Errors",400);
            }else{
                $user = User::where('email',$request->email)->first();

                if(!empty($user->id)){
                        $user->update([
                            'password'=>Hash::make($request->password),
                        ]);
                        $get_reset_password->delete();
                      
                            return ResponseApi::acceptedResponseApi(["message"=>"Password Changed Success"],"Updated Successfull",201); 
                         
                }else{
                    return ResponseApi::badMethodErrorResponse(['message'=>"Can't Update Account not Found"],"Validator Errors",400);

                }
            }
            }else{
                return ResponseApi::badMethodErrorResponse(['message'=>"Can't Update Account not Found"],"Validator Errors",400);

            }
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(["message"=>"Server Error"],"server Error",500);

        }
   }

   public function ForgetPasswordUser(Request  $request){
    // try{
        $validator = Validator::make($request->all(), [
           'email'=>'required|email|exists:users,email'
        ]);
        if ($validator->fails()) {

            return ResponseApi::validatorErrorResponseApi($validator->errors()->toArray(),"Validator Errors",400);
        }

        $user_details=User::where('email',$request->email)->first();

        if(!empty($user_details->id)){
            $password_reset_exist = PasswordReset::where('email',$request->email)->first();

            if(!empty($password_reset_exist->id)){
                $password_reset_exist->delete();
            }

            $rand_str = Str::random(10);

            $tokenrand = Crypt::encryptString($rand_str);

           $password_reset =  PasswordReset::create([
                'email'=>$request->email,
                'token'=>$tokenrand,
                'created_at'=>Carbon::now()->toDateTimeString(),
           ]);

           if(!empty($password_reset->email)){
               $message = "aa";
               $email = "ataha@firstgulfsolutions.com";
               $name = "Ahmed Taha";
               
                // Mail::raw($message, function ($message) use ($email, $name) {
                //         $message->to($email, $name)
                //                 ->subject('Welcome to our website!');
                //     });
    
    
                Mail::to($request->email)->send(new ForgetPasswordMail($request->email,$tokenrand));
           
                return ResponseApi::badMethodErrorResponse(['message'=>"Reset Email Send Success"],"Sucess",201);
           }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error Can't Send Email,Try Again Later"],"Error",500);

           }

        }else{
            return ResponseApi::notFoundResponse(['message'=>"This Email not Exist"],"Validator Errors",400);
        }

        
    // }catch(\Exception $e){
    //    // return ResponseApi::badMethodErrorResponse($e,"server Error",500);
    //       return ResponseApi::badMethodErrorResponse(["message"=>"Server Error"],"server Error",500);

    // }

   }
   public function getDeactivatedUser(Request $request){
    try{
          $validator = Validator::make($request->all(), [
            'token' => 'required|string',
            'number'=>'required|numeric'
          ]);
          if ($validator->fails()) {
  
              return ResponseApi::validatorErrorResponseApi($validator->errors()->toArray(),"Validator Errors",400);
          }

          $get_user=User::where('active',0)->paginate($request->number);

          if(!empty($get_user[0]->id)){
            foreach($get_user as $dep){
                
                $array_reponse[] =$this->castUserData($dep);
            }
              
                return ResponseApi::badMethodErrorResponse($array_reponse,"Sucess",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty User"],"Empty",200);

          }
      }catch(\Exception $e){
          return ResponseApi::badMethodErrorResponse(["message"=>"Server Error"],"server Error",500);

      }
    }
    public function getAllUser(Request $request){
       // try{
              $validator = Validator::make($request->all(), [
                'token' => 'required|string',

              ]);
              if ($validator->fails()) {
      
                  return ResponseApi::validatorErrorResponseApi($validator->errors()->toArray(),"Validator Errors",400);
              }

              $get_user=User::where('id','<>',1)->where('active',1)->get();

              if(!empty($get_user[0]->id)){
                foreach($get_user as $dep){
                    
                    $array_reponse[] =$this->castUserData($dep);
                }
                  
                    return ResponseApi::badMethodErrorResponse($array_reponse,"Sucess",201);
  
              }else{
                return ResponseApi::notFoundResponse(['message'=>"Empty User"],"Empty",200);

              }
        //   }catch(\Exception $e){
        //       return ResponseApi::badMethodErrorResponse(["message"=>"Server Error"],"server Error",500);
  
        //   }
      }
    public function DeactivateAccount(Request $request){
      try{
            $validator = Validator::make($request->all(), [
                'token' => 'required|string',
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
                return ResponseApi::badMethodErrorResponse(["message"=>"Deactivate Sucess"],"Deactivate Sucess",201);

            }
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(["message"=>"Server Error"],"server Error",500);

        }
    }
    public function ActivateAccount(Request $request){
        try{
              $validator = Validator::make($request->all(), [
                  'token' => 'required|string',
                  'user_id' => 'required|numeric|exists:users,id',
              ]);
              if ($validator->fails()) {
      
                  return ResponseApi::validatorErrorResponseApi($validator->errors()->toArray(),"Validator Errors",400);
              }
              $get_user=User::where('id',$request->user_id)->first();
              if(!empty($get_user->id)){
                  $get_user->update([
                      'active'=>1,
                  ]);
                  $block = UserViolence::where('user_id',$request->user_id)->get();
                 foreach($block as $account_blocked ){
                    $account_blocked->delete();
                 }
                  return ResponseApi::badMethodErrorResponse(["message"=>"Activate Sucess"],"Activate Sucess",201);
  
              }
          }catch(\Exception $e){
              return ResponseApi::badMethodErrorResponse(["message"=>"Server Error"],"server Error",500);
  
          }
      }
    public function me()
    {
     return ResponseApi::acceptedResponseApi($this->castUserData(Auth::guard('user_api')->user()),"Accepted",201);

    }
    public function login(Request $request){
        
        if($request->has('username')){
            $validator = Validator::make($request->all(), [
                'username' => 'required|string|exists:users,username',
                'password' => 'required|string|min:8',
            ]);
            if ($validator->fails()) {
 
                return ResponseApi::validatorErrorResponseApi($validator->errors()->toArray(),"Validator Errors",400);
            }
            return ResponseApi::validatorErrorResponseApi($user_blocked,"Validator Errors",400);

            if(!empty($user_blocked->id)){
                $block = UserViolence::where('user_id',$user_blocked->id)->first();
                if(!empty($block->id)){
                    $array_reponse[] = [ 
                        'user_violence_message' =>$block->user_violence_message,
                        'user_id'=>$block->user_id,
                        'user_name'=>$block->user_id_fun->username,
                        'key'=>$block->id
                    ];
                    return ResponseApi::validatorErrorResponseApi($array_reponse,"Your account has been Blocked by the system because there is harm activity, For more information please contact system Administration",400);
                }else{
                    return ResponseApi::validatorErrorResponseApi(["message"=>"user not Active"],"Validator Errors",400);
                }
            }
        }else if($request->has('email')){
            $validator = Validator::make($request->all(), [
                'email' => 'required|email|exists:users,email',
                'password' => 'required|string|min:8',
            ]);
            if ($validator->fails()) {
 
                return ResponseApi::validatorErrorResponseApi($validator->errors()->toArray(),"Validator Errors",400);
            }
            $user_blocked = User::where('active',0)->where('email',$request->email)->first();
            if(!empty($user_blocked->id)){
                $block = UserViolence::where('user_id',$user_blocked->id)->first();
                if(!empty($block->id)){
                    $array_reponse[] = [ 
                        'user_violence_message' =>$block->user_violence_message,
                        'user_id'=>$block->user_id,
                        'user_name'=>$block->user_id_fun->username,
                        'key'=>$block->id
                    ];
                    return ResponseApi::validatorErrorResponseApi($array_reponse,"Your account has been Blocked by the system because there is harm activity, For more information please contact system Administration",400);
                }else{
                    return ResponseApi::validatorErrorResponseApi(["message"=>"user not Active"],"Validator Errors",400);
                }
            }
        }else{
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required|string|min:8',
            ]);
            if ($validator->fails()) {
 
                return ResponseApi::validatorErrorResponseApi($validator->errors()->toArray(),"Validator Errors",400);
            }
        }
    	
       
        if (! $token = auth()->guard('user_api')->attempt($validator->validated())) {
            return ResponseApi::unauthorizedResponseApi(['error' => 'Credential Error'],"Credential Error",401);
         }
        return $this->createNewToken($token);
    }
    
    public function logout() {
        
        try{
            try{
            $user = User::find(Auth::user()->id);
            }catch(\Exception $e){

            }
            if(!empty($user->token)){
                $user->update([
                    'token'=>null,
                ]);
              Auth::guard('user_api')->logout();

                return ResponseApi::logOutapiResponse(['message' => 'User successfully signed out'],'Accepted',202);
          
            }else{

                return ResponseApi::logOutapiResponse(['message' => 'Token Invalid'],'Token Invalid',402);

            }
               
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(["message"=>"Server Error"],"server Error",500);

        }

     }
     /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh() {
        return $this->createNewToken(auth()->refresh());
    }

    protected function createNewToken($token){

        try{

            $user = User::find(Auth::guard('user_api')->user()->id);

            $user->update([
                'token'=>$token,
            ]);

            // A freshly provisioned user may not have a user_details row yet.
            // Treat a missing row as "no pending info" instead of crashing.
            $userDetails = $user->user_details_id_fun;

            if($userDetails && ($userDetails->need_paper==0 || $userDetails->full_information==0 ||
            $userDetails->change_password==0)){

                return ResponseApi::acceptedResponseApi(
                   $this-> castUserData($user)
                ,"Need Info",202);
            }else{
                return ResponseApi::acceptedResponseApi(
                    $this-> castUserData($user)
              ,"Accepted",202);
            }

        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse($e,"server Error",500);


        }

    }

    public function store(Request $request){
        try{

        //permission of create user check
                $validator = Validator::make($request->all(), [
                   'username' => 'required|string|min:6|unique:users',
                   'lastname' => 'required|string|min:3',
                   'firstname' => 'required|string|min:3',
                   'email' => 'required|email|unique:users',
                   'password' => 'required|string|min:8',
                   'token'=>'required|string',
                   'accRole'=>'required|numeric',
                   'accPosition'=>'required|numeric',
                ]);
                if($request->token != Auth::guard('user_api')->user()->token){
                    return ResponseApi::validatorErrorResponseApi(['message'=>'invalid Token'],"Validator Errors",400);
                }
               if ($validator->fails()) {
   
                   return ResponseApi::validatorErrorResponseApi($validator->errors()->toArray(),"Validator Errors",400);
               }
               $sub_dept= SubDepartment::where('id',$request->accRole)->first();
               if(empty($sub_dept->id)){
                return ResponseApi::validatorErrorResponseApi(['message'=>'Sub Department ID not Found'],"Validator Errors",400);
               }
               $work_degree= WorkDegree::where('id',$request->accPosition)->first();
 
               if(empty($work_degree->id)){
                return ResponseApi::validatorErrorResponseApi(['message'=>'Work Degree not Found'],"Validator Errors",400);
               }
               
               $account_details = UserDetail::create([
                'hiringDate'=>$request->hiringDate,
                'contractStartDate'=>$request->contractStartDate,
                'contractEndDate'=>$request->contractEndDate,
                
             ]);
             
             if(!empty($account_details->id)){
                
                $creator = User::where('token',$request->token)->first();

                $account = User::create([
                    'username'=>$request->username,
                    'lastname'=>$request->lastname,
                    'firstname'=>$request->firstname,
                    'email'=>$request->email,
                    'password'=>Hash::make($request->password),
                    'mobileNumber'=>$request->mobileNumber,
                    'user_details_id'=>$account_details->id,
                    'gender'=>$request->gender,
                    'user_creator_id' => $creator->id,
                    'sub_departments_id'=>$request->accRole,
                    'work_degrees_id' =>$request->accPosition,
                 ]);
                 if($request->notify =='1' && !empty($request->notify)){
                     Mail::to($request->email)->send(new WelcomeMail($request->email,$request->username,$request->password,'User'));

                 }

 
                //  if(!empty($account->id)){
                //     $change_password = ChangePassword::create([
                //         'users_id'=>$account->id
                //     ]);
                  
                //  }
                // try{
                //     $user = JobAgreement::where('mobileNumber',$request->mobileNumber)->first();

                //     if(!empty($user)){
                //         $user->update([
                //             'job_agreement_statuses_id'=>3, 
                //          ]);
                //        // check with amr  $user->delete();
                    
                //     // add token for manger to create account 
     
                //      $file_name="JobRequest.pdf";
                //      \File::move(
                //          ('Attachments/User/JobAgreement/'.$request->id.'/') ,                 // old file
                //          ('Attachments/User/WorkPapers/'. $account->id .'/' )   // new file
                //      );
                //      }
                // }catch(\Exception $e){

                // }
               
                return ResponseApi::acceptedResponseApi($this->castUserData($account),"Created Successfull",201);

            }else{
                return ResponseApi::badMethodErrorResponse($e,"Server Error",500);


            }
       }catch(\Exception $e){

           return ResponseApi::badMethodErrorResponse($e,"Server Error",500);

       }
    }


    public function UserResetPassword(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'old_password' => 'required|string|min:8',
                'password' => 'required|confirmed|min:8',
                'token'=>'required|string',
             ]);
             if ($validator->fails()) {
                return ResponseApi::validatorErrorResponseApi($validator->errors()->toArray(),"Validator Errors",400);
            }
    
            $user = User::where('token',$request->token)->first();

            if(!empty($user->id)){
                if(Hash::check($request->old_password, $user->password)){
                    $user->update([
                        'password'=>Hash::make($request->password),
                    ]);
                    return ResponseApi::acceptedResponseApi($user,"Updated Successfull",201);
    
                }else{
                    return ResponseApi::badMethodErrorResponse(['message'=>"Password not Match Old password"],"Validator Errors",400);
    
                }
            }else{
                return ResponseApi::badMethodErrorResponse(['message'=>"Can't Update Account not Found"],"Validator Errors",400);

            }
            

        }catch(\Exception $e){

            return ResponseApi::badMethodErrorResponse($e,"Server Error",500);
 
        }
    }
    

    public function OpentoWork(Request $request){

      //  try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'open_to_work'=>'required|numeric'
             ]);
             if ($validator->fails()) {
                return ResponseApi::validatorErrorResponseApi($validator->errors()->toArray(),"Validator Errors",400);
            }
    
            $user = User::where('id',Auth::guard('user_api')->user()->id)->first();

            if(!empty($user->id)){
                
                    $user->update([
                        'open_to_work'=>$request->open_to_work,
                    ]);
                   
                    $user = User::where('sub_departments_id',5)->orWhere('sub_departments_id',6)->get();
                    $manager = User::where('open_to_work',1)->get();
                    
                    try{
                        $msg = array(
                            'open_to_work_counter'=>$manager->count(),
                        );
                        foreach($user as $us){
                            if($request->open_to_work ==1){
                            try{
                                $this->OpenToWorkNotification(Auth::guard('user_api')->user(),$us);
                                }catch(\Exception $e){   
                                }
                            }
                            MessageController::updatedatafirebase($us->id,$msg);
                    }
                     }catch(\Exception $e){}

                     

                    return ResponseApi::acceptedResponseApi(['message'=>'Success'],"Updated Successfull",201);

            }else{
                return ResponseApi::badMethodErrorResponse(['message'=>"Account not Found"],"Validator Errors",400);

            }
            

        // }catch(\Exception $e){

        //     return ResponseApi::badMethodErrorResponse($e,"Server Error",500);
 
        // }
    }
    public function GetAllOpentoWork(Request $request){
        
        //  try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
            ]);
            if ($validator->fails()) {
                return ResponseApi::validatorErrorResponseApi($validator->errors()->toArray(),"Validator Errors",400);
            }

            $user = User::where('open_to_work',1)->get();
            if(!empty($user[0]->id)){
                $array_reponse =[];
            foreach ($user as $dep) {
               $array_reponse []=  $this->castUserData($dep);
            }
                    return ResponseApi::acceptedResponseApi($array_reponse,"Success",201);

            }else{
                return ResponseApi::badMethodErrorResponse(['message'=>"Account not Found"],"Validator Errors",200);

            }
            

        // }catch(\Exception $e){

        //     return ResponseApi::badMethodErrorResponse($e,"Server Error",500);

        // }

    }
}
