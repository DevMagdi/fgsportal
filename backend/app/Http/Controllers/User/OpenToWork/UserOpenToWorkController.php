<?php

namespace App\Http\Controllers\User\OpenToWork;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use Carbon\Carbon;

use App\Models\UserOpenToWork;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\ApiMessage\MessageController;

class UserOpenToWorkController extends Controller
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


    public function CreateNewOpenToWork(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'from_date_time' => 'required|date',
                'to_date_time' => 'required|date|after:from',
                'token'=>'required|string',
            ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            $start_date = Carbon::create(Carbon::parse($request->from_date_time)->format('m/d/Y H:i:s') );
            $end_date = Carbon::create(Carbon::parse($request->to_date_time)->format('m/d/Y H:i:s') );

            $activeOpenToWork=  UserOpenToWork::where('user_id',Auth::guard('user_api')->user()->id)->where('active',1)->where('to_date_time','>=',$end_date)->where('from_date_time','<=',$end_date)->
            orWhere('user_id',Auth::guard('user_api')->user()->id)->where('active',1)->where('from_date_time','<=',$start_date)->where('to_date_time','>=',$start_date)->first();
            if(empty($activeOpenToWork->id)){
                $openToWork=  UserOpenToWork::create([
                    'user_id' =>Auth::guard('user_api')->user()->id,
                    'from_date_time'=>$start_date,
                    'to_date_time'=>$end_date,
                    'active'=>1,
                ]);
                
                $user = User::where('sub_departments_id',5)->orWhere('sub_departments_id',6)->get();
                $manager = UserOpenToWork::where('active',1)->get();
                
                try{
                    $msg = array(
                        'open_to_work_counter'=>$manager->count(),
                    );
                    foreach($user as $us){
                        try{
                            $this->OpenToWorkNotification(Auth::guard('user_api')->user(),$us);
                        }catch(\Exception $e){}
                        MessageController::updatedatafirebase($us->id,$msg);
                    }
                }catch(\Exception $e){}

                return ResponseApi::acceptedResponseApi($openToWork,"success",201);
            }else{
                return ResponseApi::badMethodErrorResponse(['message'=>"you already have active open to work for the same period"],"Validator Errors",400);
            }

        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
        }
    }
    
    
    public function UpdateOpenToWork(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'open_to_work_id'=>'required|numeric|exists:user_open_to_work,id',
                'active'=>'required|numeric'
            ]);
            
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            
            $openToWork=  UserOpenToWork::where('id',$request->open_to_work_id)->first();
            if(!empty($openToWork->id)){
                if(Auth::guard('user_api')->user()->id == $openToWork->user_id){
                    $openToWork->update([
                        'active'=>$request->active
                    ]);
                    $user = User::where('sub_departments_id',5)->orWhere('sub_departments_id',6)->get();
                    $manager = UserOpenToWork::where('active',1)->get();
                    
                    try{
                        $msg = array(
                            'open_to_work_counter'=>$manager->count(),
                        );
                        foreach($user as $us){
                            MessageController::updatedatafirebase($us->id,$msg);
                        }
                    }catch(\Exception $e){}
                    return ResponseApi::acceptedResponseApi($openToWork,"success",201);
                }else{
                    return ResponseApi::badMethodErrorResponse(['message'=>"Not Acceptable"],"Validator Errors",406);
                }
                
            
            }else{
                return ResponseApi::badMethodErrorResponse(['message'=>"Open To Work Not found"],"Validator Errors",400);
            
            }
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
        }
    }
    
    public function GetActiveOpenToWork(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
            ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            
            if(Auth::guard('user_api')->user()->sub_departments_id == 5 || Auth::guard('user_api')->user()->sub_departments_id == 6 || Auth::guard('user_api')->user()->sub_departments_id == 8){
                $activeOpenToWork=  UserOpenToWork::where('active',1)->get();
                
            }else{
                $activeOpenToWork=  UserOpenToWork::where('user_id',Auth::guard('user_api')->user()->id)->where('active',1)->get();
            }
            
            $array_response =[];
            if(!empty($activeOpenToWork[0])){
                foreach ($activeOpenToWork as $open) {
                    $user = $open->user_id_fun;
                    $array_response[] = [
                        'id'=>$open->id,
                        'from_date_time'=>$open->from_date_time,
                        'to_date_time'=>$open->to_date_time,
                        'user_id'=>$open->user_id,
                        'username'=>$user->username,
                        'email'=>$user->email,
                        'photoURL'=>$user->photoURL?'/Attachments/User/'.$user->id.'/profile'.'/'.$user->photoURL:null,
                        'gender'=>$user->gender?$user->gender:null,
                    ];
                }
                return ResponseApi::acceptedResponseApi($array_response,"success",201);
            }else{
                return ResponseApi::acceptedResponseApi(['message'=>'Empty Requests'],"Empty Requests",200);
            }


        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
        }
    }
    
    public function DeactivateAllActiveOpenToWork(){
        try{

            $openToWork = UserOpenToWork::where('active',1)->get();
            foreach($openToWork as $open){
                $open->update([
                    'active'=>0,
                ]);
            }
            
            $user = User::where('sub_departments_id',5)->orWhere('sub_departments_id',6)->get();
            try{
                $msg = array(
                    'open_to_work_counter'=>0,
                );
                foreach($user as $us){
                    MessageController::updatedatafirebase($us->id,$msg);
                }
            }catch(\Exception $e){}
            
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
    }

}
