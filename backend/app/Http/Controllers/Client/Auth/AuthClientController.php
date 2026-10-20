<?php

namespace App\Http\Controllers\Client\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\ClientAccount;
use App\Models\SubDepartment;
use App\Models\WorkDegree;
use Illuminate\Support\Facades\Hash;
use App\Models\UserViolence;
use App\Models\PasswordReset;
 use Validator;
 use App\Mail\ForgetClientPassword;
 use Carbon\Carbon;
 use Illuminate\Support\Facades\Mail;

use App\Http\Controllers\ResponseTrait\ResponseApi;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Crypt;
use App\Mail\WelcomeMail;

class AuthClientController extends Controller
{


    public function EditClient(Request $request){
        try{
              $validator = Validator::make($request->all(), [
                  'token' => 'required|string',
                  'client_id'=> 'required|numeric|exists:client_accounts,id'
              ]);
              if ($validator->fails()) {
      
                  return ResponseApi::validatorErrorResponseApi($validator->errors()->toArray(),"Validator Errors",400);
              }
              
                $client_details=ClientAccount::where('id',$request->client_id)->first();
                if(!empty($client_details->id)){
                    $client_details->update(
                        $request->all()
                    );
             
                }

                  return ResponseApi::badMethodErrorResponse(["message"=>"Updated Sucess"],"Updated Sucess",201);

              
          }catch(\Exception $e){
              return ResponseApi::badMethodErrorResponse(["message"=>"Server Error"],"server Error",500);
  
          }
      }
    public function ClientRefreshed(Request $request){
        try{
              $validator = Validator::make($request->all(), [
                  'token' => 'required|string',
              ]);
              if ($validator->fails()) {
      
                  return ResponseApi::validatorErrorResponseApi($validator->errors()->toArray(),"Validator Errors",400);
              }

              $get_user=ClientAccount::where('id',Auth::guard('client_api')->user()->id)->first();
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

              $get_user=ClientAccount::all();
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

    public function castClientData(ClientAccount $user){
       $castUser=[
        'key'=>$user->id ."",
        'fullname'=>$user->fullname,
            'email'=>$user->email,
            'partnerPhotoUrl' => $user->partner_id?($user->partner_id_fun->partner_photoURL?"/Attachments/Client/Partner/" .  $user->partner_id . '/' .$user->partner_id_fun->partner_photoURL:null):null,
           'accType'=>"Client",
           'token'=>$user->token,
           'hamada'=>$user->user_creator_id?true:false,
           'primary'=>$user->primary,
           'partner_id'=>$user->partner_id,
           'partner_name'=>$user->partner_id?$user->partner_id_fun->partner_name:null,
        ];
       return $castUser;
   }
   public function NewPasswordClient(Request  $request){
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
                $user = ClientAccount::where('email',$request->email)->first();

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

   public function ForgetPasswordClient(Request  $request){
    // try{
        $validator = Validator::make($request->all(), [
           'email'=>'required|email|exists:client_accounts,email'
        ]);
        if ($validator->fails()) {

            return ResponseApi::validatorErrorResponseApi($validator->errors()->toArray(),"Validator Errors",400);
        }

        $user_details=ClientAccount::where('email',$request->email)->first();

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
                Mail::to($request->email)->send(new ForgetClientPassword($request->email,$tokenrand));
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
   public function getDeactivatedClient(Request $request){
    try{
          $validator = Validator::make($request->all(), [
            'token' => 'required|string',
            'number'=>'required|numeric'
          ]);
          if ($validator->fails()) {
  
              return ResponseApi::validatorErrorResponseApi($validator->errors()->toArray(),"Validator Errors",400);
          }

          $get_user=ClientAccount::where('active',0)->paginate($request->number);

          if(!empty($get_user[0]->id)){
            foreach($get_user as $dep){
                
                $array_reponse[] =$this->castClientData($dep);
            }
              
                return ResponseApi::badMethodErrorResponse($array_reponse,"Sucess",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Client"],"Empty",200);

          }
      }catch(\Exception $e){
          return ResponseApi::badMethodErrorResponse(["message"=>"Server Error"],"server Error",500);

      }
    }
    public function getAllUser(Request $request){
        try{
              $validator = Validator::make($request->all(), [
                'token' => 'required|string',

              ]);
              if ($validator->fails()) {
      
                  return ResponseApi::validatorErrorResponseApi($validator->errors()->toArray(),"Validator Errors",400);
              }

              $get_user=User::where('active',1)->get();

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
    public function DeactivateAccount(Request $request){
      try{
            $validator = Validator::make($request->all(), [
                'token' => 'required|string',
                'user_id' => 'required|numeric|exists:users,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::validatorErrorResponseApi($validator->errors()->toArray(),"Validator Errors",400);
            }
            $get_user=ClientAccount::where('id',$request->user_id)->first();
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
              $get_user=ClientAccount::where('id',$request->user_id)->first();
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
     return ResponseApi::acceptedResponseApi($this->castClientData(Auth::guard('client_api')->user()),"Accepted",201);

    }
    public function login(Request $request){
        
        
            $validator = Validator::make($request->all(), [
                'email' => 'required|email|exists:client_accounts,email',
                'password' => 'required|string|min:8',
            ]);
            if ($validator->fails()) {
 
                return ResponseApi::validatorErrorResponseApi($validator->errors()->toArray(),"Validator Errors",400);
            }

            $user_blocked = ClientAccount::where('active',0)->where('email',$request->email)->first();
            // if(!empty($user_blocked->id)){
            //     $block = UserViolence::where('user_id',$user_blocked->id)->first();
            //     if(!empty($block->id)){
            //         $array_reponse[] = [ 
            //             'user_violence_message' =>$block->user_violence_message,
            //             'user_id'=>$block->user_id,
            //             'user_name'=>$block->user_id_fun->username,
            //             'key'=>$block->id
            //         ];
            //         return ResponseApi::validatorErrorResponseApi($array_reponse,"Your account has been Blocked by the system because there is harm activity, For more information please contact system Administration",400);
            //     }else{
            //         return ResponseApi::validatorErrorResponseApi(["message"=>"user not Active"],"Validator Errors",400);
            //     }
            // }
           
    	
       
        if (! $token = auth()->guard('client_api')->attempt($validator->validated())) {
            return ResponseApi::unauthorizedResponseApi(['error' => 'Credential Error'],"Credential Error",401);
         }
        return $this->createNewToken($token);
    }
    
    public function logout() {
        
        try{
            try{
            $user = ClientAccount::find(Auth::user()->id);
            }catch(\Exception $e){

            }
            if(!empty($user->token)){
                $user->update([
                    'token'=>null,
                ]);
              Auth::guard('client_api')->logout();

                return ResponseApi::logOutapiResponse(['message' => 'Client successfully signed out'],'Accepted',202);
          
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
           
            $user = ClientAccount::find(Auth::guard('client_api')->user()->id);
            
            $user->update([
                'token'=>$token,
            ]);
            $user = ClientAccount::find(Auth::guard('client_api')->user()->id);

        return ResponseApi::acceptedResponseApi(
                   $this-> castClientData($user)
                ,"Login Success",201);
           
           
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
 
                 Mail::to($request->email)->send(new WelcomeMail($request->email,$request->username,$request->password,'Client'));

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


    public function ClientResetPassword(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'old_password' => 'required|string|min:8',
                'password' => 'required|confirmed|min:8',
                'token'=>'required|string',
             ]);
             if ($validator->fails()) {
                return ResponseApi::validatorErrorResponseApi($validator->errors()->toArray(),"Validator Errors",400);
            }
    
            $user = ClientAccount::where('token',$request->token)->first();

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
}
