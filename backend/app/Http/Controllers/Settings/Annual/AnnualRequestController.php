<?php

namespace App\Http\Controllers\Settings\Annual;

use App\Http\Controllers\Controller;
  use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
 use App\Models\AnnualStatus;
use App\Models\AnnualRequest;
use App\Models\PermissionBalance;
use App\Models\User;
use App\Models\UserAnnual;
use App\Models\AnnualRequestAttach;
use App\Models\Log; 
use App\Models\Report; 
use App\Models\ReportManagerEdit;
use App\Models\AnnualRequestAction; 
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use DatePeriod;
use App\Models\WorkHoursConfig;
use App\Models\UserSalary;
use App\Models\UserSalaryHistory;
use DateInterval;
use App\Http\Controllers\ApiMessage\MessageController;

class AnnualRequestController extends Controller
{
    public function ApprovalSendNotification(User $user1 , User $user2,AnnualRequest $report){
        $msg = array
             (
               "body"=>  $report->annual_status_id == '2' ||$report->annual_status_id == '3' ? $user1->username . " Has Approved Your Vacation" :$user1->username . " Has Rejected Your Vacation",
               "createdAt"=>$report->updated_at,
               "receverKey"=> $user2->id.'',
               "receverName"=> $user2->username,
               "redirection"=> "/user".'/'.$user2->id,
               "senderKey"=> $user1->id.'',
               "senderName"=> $user1->username,
               "status"=> 0,
               "updatedAt"=>$report->updated_at,
               "title"=>$report->annual_status_id == '2' ||$report->annual_status_id == '3' ? $user1->username."Your Vacation". " Approved" : $user1->username." Your Vacation". " Rejected" ,
               'senderImg'=>$user1->photoURL?'/Attachments/User/'.$user1->id.'/profile'.'/'.$user1->photoURL:null,
             );
       MessageController::notificationSend($msg);
   }
   public function ApprovalSendNotificationReport(User $user1 , User $user2,Report $report){
    $msg = array
         (
           "body"=>  $report->report_status_id == '2' ? $user1->username . " Has Approved Your Vacation" :$user1->username . " Has Rejected Your Vacation",
           "createdAt"=>$report->updated_at,
           "receverKey"=> $user2->id.'',
           "receverName"=> $user2->username,
           "redirection"=> "/user".'/'.$user2->id,
           "senderKey"=> $user1->id.'',
           "senderName"=> $user1->username,
           "status"=> 0,
           "updatedAt"=>$report->updated_at,
           "title"=> $report->report_status_id =='2' ? $user1->username."Your Vacation". " Approved" : $user1->username." Your Vacation". " Rejected" ,
           'senderImg'=>$user1->photoURL?'/Attachments/User/'.$user1->id.'/profile'.'/'.$user1->photoURL:null,
         );

   MessageController::notificationSend($msg);
}

     public function CastArrayRequests(AnnualRequest $var)
    {
        
        $attach = AnnualRequestAttach::where('annual_request_id',$var->id)->first();
        $action_manager = AnnualRequestAction::where('annual_request_id',$var->id)->first();
        $action_hr = AnnualRequestAction::where('annual_request_id',$var->id)->orderBy('created_at','ASC')->first();
        $action_hr = !empty($action_manager->id) && !empty($action_hr->id)?$action_manager->id == $action_hr->id? null : $action_hr:null;
        $array_response = [
            'reason'=>$var->reason,
            'from'=>$var->from,
            'to'=>$var->to,
            'leaveType'=>$var->annual_type_id,
            'leaveType_name'=>$var->annual_type_id?$var->annual_type_id_fun->annual_type:null,
            'finalStatus'=>$var->annual_status_id,
            'finalStatus_name'=>$var->annual_status_id?$var->annual_status_id_fun->annual_status_name:null,
            'manager_approve_id'=>$var->reason,
            'user_id'=>$var->reason,
            'key'=>$var->id.'',
            'empKey'=>$var->user_id,
            'empName'=>$var->user_id?$var->user_id_fun->username:null,
            'empImgUrl'=>$var->photoURL?'/Attachments/User/'.$var->id.'/profile'.'/'.$var->photoURL:null,
            'attach'=>!empty($attach ->id)?'/Attachments/AnnualRequest/'.$attach->annual_request_id_fun->user_id.'/'.$attach->annual_request_id .'/'.$attach ->attach_name:null,
            'attachName'=>!empty($attach ->id)?$attach ->attach_name:null,
            'createdAt'=>$var->created_at,
            'key'=>$var->id.'',
            'managerToApproveKey'=>$var->annual_status_id==2?$var->manager_approve_id:null,
            'managerToApproveName'=>$var->annual_status_id==2?$var->manager_approve_id_fun->username:null,
            'hrToApproveKey'=>$var->annual_status_id==3?$var->manager_approve_id:null,
            'hrToApproveName'=>$var->annual_status_id==3?$var->manager_approve_id_fun->username:null,
            'managerDissision'=>$var->annual_status_id==1||$var->annual_status_id==3?true:$var->annual_status_id==4?false:null,
            'managerDissisionKey'=>$var->annual_status_id==1||$var->annual_status_id==4||$var->annual_status_id==3?(!empty($action_manager->id)?$action_manager->assign_to_id:null):null,
            'managerDissisionName'=>$var->annual_status_id==1||$var->annual_status_id==4||$var->annual_status_id==3?(!empty($action_manager->id)?$action_manager->assign_to_id_fun->username:null):null,
            'managerDissisionComment'=>$var->annual_status_id==1||$var->annual_status_id==4||$var->annual_status_id==3?(!empty($action_manager->id)?$action_manager->comment:null):null,
            'managerDissisionAt'=>$var->annual_status_id==1||$var->annual_status_id==4||$var->annual_status_id==3?(!empty($action_manager->id)?$action_manager->created_at:null):null,
            'hrDissision'=>$var->annual_status_id==1?true:$var->annual_status_id==4?false:null,
            'hrDissisionKey'=>$var->annual_status_id==1||$var->annual_status_id==4?(!empty($action_hr->id)?$action_hr->assign_to_id:null):null,
            'hrDissisionName'=>$var->annual_status_id==1||$var->annual_status_id==4?(!empty($action_hr->id)?$action_hr->assign_to_id_fun->username:null):null,
            'hrDissisionComment'=>$var->annual_status_id==1||$var->annual_status_id==4?(!empty($action_hr->id)?$action_hr->comment:null):null,
            'hrDissisionAt'=>$var->annual_status_id==1||$var->annual_status_id==4?(!empty($action_hr->id)?$action_hr->created_at:null):null,
        ];
        return $array_response;
    }
    public function calDate($start_date , $end_date){
        $start = $start_date;
        $end =  $end_date;
      
        $count=0;
        $interval = $end->diff($start);
        $days = $interval->days;
        $period = new DatePeriod($start, new DateInterval('P1D'), $end);
       // $holidays = array('2012-09-07');
        foreach($period as $dt) {
            $curr = $dt->format('D');
            // substract if Saturday or Sunday
            if ($curr != 'Sat' && $curr != 'Fri') {
                $count++;
            }
            // // (optional) for the updated question
            // elseif (in_array($dt->format('Y-m-d'), $holidays)) {
            //     $days--;
            // }
        }
        return $count;
    }

    public function calDateRamadan($start_date , $end_date){
        $start = $start_date;
        $end =  $end_date;
      
        $count=0;
        $interval = $end->diff($start);
        $days = $interval->days;
        $period = new DatePeriod($start, new DateInterval('P1D'), $end);
       // $holidays = array('2012-09-07');
       $duartion = 0;
        foreach($period as $dt) {
            $curr = $dt->format('D');
            // substract if Saturday or Sunday
            $getDuration = WorkHoursConfig::where('start_date','<=',$dt)->where('end_date','>=',$dt)->first();
            if ($curr != 'Sat' && $curr != 'Fri') {
            if(!empty($getDuration->id)){
                $duartion += $getDuration->config_duration;
            }else{
                $duartion += 8;
            }    
                $count++;
            }
            // // (optional) for the updated question
            // elseif (in_array($dt->format('Y-m-d'), $holidays)) {
            //     $days--;
            // }
        }
        return $duartion;
    }
   
    public function CreateAnnualRequest(Request $request){
    try{
            $validator = Validator::make($request->all(), [
                 'from' => 'required|date',
                'to' => 'required|date|after:from',
                'annual_type_id' => 'required|exists:annual_types,id',
                'annual_status_id' => 'required|exists:annual_statuses,id',
                'manager_approve_id' => 'required|exists:users,id',
                'user_id' => 'required|exists:users,id',
                'duration'=>'required|numeric',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            $start_date = Carbon::create(Carbon::parse($request->from)->format('m/d/Y H:i:s') );
            $end_date = Carbon::create(Carbon::parse($request->to)->format('m/d/Y H:i:s') );
           
            $days_duration = $this->calDate($start_date,$end_date);
             
            //return $days_duration;
            $minute_duration = $start_date->diffInMinutes($end_date);
              if($days_duration == $request->duration ||$minute_duration == $request->duration){
                    $previous = AnnualRequest::where('user_id',$request->user_id)->where('annual_status_id','<>',4)->where('to','>=',$end_date)->where('from','<=',$end_date)->orWhere('user_id',$request->user_id)
                    ->where('from','<=',$start_date)->where('to','>=',$start_date)->where('annual_status_id','<>',4)->first();

                    if(empty($previous->id)){
                        if($request->annual_type_id==2 ||$request->annual_type_id==4){
                            $validator = Validator::make($request->all(), [
                               'attach_file'=>'required'
                           ]);
                           if ($validator->fails()) {
                               return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                           }
                           $annualStatus=  AnnualRequest::create([
                            'reason'=>$request->reason,
                            'from'=>$start_date,
                            'to'=>$end_date,
                            'annual_type_id'=>$request->annual_type_id,
                            'annual_status_id'=>$request->annual_status_id,
                            'manager_approve_id'=>$request->manager_approve_id,
                            'user_id'=>$request->user_id,
                           ]);
                         
                           
                        $employee = AnnualRequest::where('manager_approve_id',$annualStatus->manager_approve_id)
                        ->where('annual_status_id',2)->get()->count();
                        try{
                            $msg = array(
                                'pendingVacationsRequest'=>$employee
                            );
                            MessageController::updatedatafirebase($annualStatus->manager_approve_id,$msg);
                        }catch(\Exception $e){}


                           if ($request->hasFile('attach_file'))  {
                            $image = $request->file('attach_file');
                            $file_name = $image->getClientOriginalName();
                            
                            $attach=  AnnualRequestAttach::create([
                                'attach_name' =>$file_name,
                                'annual_request_id' =>$annualStatus->id,
                                ]);
                            if(!empty($attach->id)){
                                $image->move(('Attachments/AnnualRequest/'.$attach->annual_request_id_fun->user_id.'/'.$attach->annual_request_id), $file_name);
                            }else{
                                return ResponseApi::acceptedResponseApi(['message'=>'Can\'t Move Picture or Attach'],"Server Error",500);
                            }
                        }
                        return ResponseApi::acceptedResponseApi(['message'=>'Inserted Success'],"success",201);
                    }else if($request->annual_type_id==3){

                        $annualStatus=  AnnualRequest::create([
                            'reason'=>$request->reason,
                            'from'=>$start_date,
                            'to'=>$end_date,
                            'annual_type_id'=>$request->annual_type_id,
                            'annual_status_id'=>$request->annual_status_id,
                            'manager_approve_id'=>$request->manager_approve_id,
                            'user_id'=>$request->user_id,
                           ]);

                           $employee = AnnualRequest::where('manager_approve_id',$annualStatus->manager_approve_id)
                           ->where('annual_status_id',2)->get()->count();
                           try{
                               $msg = array(
                                   'pendingVacationsRequest'=>$employee
                               );
                               MessageController::updatedatafirebase($annualStatus->manager_approve_id,$msg);
                           }catch(\Exception $e){}

                        return ResponseApi::acceptedResponseApi(['message'=>'Inserted Success'],"success",201);
   
                    }elseif($request->annual_type_id==1){
                        $UserAnnual = UserAnnual::where('user_id',$request->user_id)->first();
                        $UserAnnual2 = UserAnnual::where('user_id',$request->user_id)->first();
                        if(!empty($UserAnnual->id) ){
                            if($UserAnnual->available_leave_balance>=$days_duration){
                                $annualStatus=  AnnualRequest::create([
                                    'reason'=>$request->reason,
                                    'from'=>$start_date,
                                    'to'=>$end_date,
                                    'annual_type_id'=>$request->annual_type_id,
                                    'annual_status_id'=>$request->annual_status_id,
                                    'manager_approve_id'=>$request->manager_approve_id,
                                    'user_id'=>$request->user_id,
                                   ]);

                                   $employee = AnnualRequest::where('manager_approve_id',$annualStatus->manager_approve_id)
                                   ->where('annual_status_id',2)->get()->count();
                                   try{
                                       $msg = array(
                                           'pendingVacationsRequest'=>$employee
                                       );
                                       MessageController::updatedatafirebase($annualStatus->manager_approve_id,$msg);
                                   }catch(\Exception $e){}

                                   if(!empty($annualStatus->id)){

                                       $UserAnnual->update([
                                           'available_leave_balance'=>$UserAnnual2->available_leave_balance-$days_duration,
                                       ]); 
                                       return ResponseApi::acceptedResponseApi(['message'=>'Inserted Success'],"success",201);
                                   }else{
                                        return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
                                   }
                                }else{
                                    return ResponseApi::acceptedResponseApi(['message'=>'Your Balance is less than your Request'],"Validator Errors",400);
                                }

                            }else{
                                return ResponseApi::acceptedResponseApi(['message'=>'You Have Already Leave / Permission In The Same Date'],"Validator Errors",400);

                            }
                        }elseif($request->annual_type_id==5){
                            $UserAnnual = UserAnnual::where('user_id',$request->user_id)->first();
                            $UserAnnual2 = UserAnnual::where('user_id',$request->user_id)->first();
                            $permission_balance =PermissionBalance::first();
                            if(!empty($UserAnnual->id) ){
                                if($UserAnnual->monthly_balance_spend+$minute_duration<=$permission_balance->monthly_balance*60){
                                    $annualStatus=  AnnualRequest::create([
                                        'reason'=>$request->reason,
                                        'from'=>$start_date,
                                        'to'=>$end_date,
                                        'annual_type_id'=>$request->annual_type_id,
                                        'annual_status_id'=>$request->annual_status_id,
                                        'manager_approve_id'=>$request->manager_approve_id,
                                        'user_id'=>$request->user_id,
                                    ]);

                                    $employee = AnnualRequest::where('manager_approve_id',$annualStatus->manager_approve_id)
                                    ->where('annual_status_id',2)->get()->count();
                                    try{
                                        $msg = array(
                                            'pendingVacationsRequest'=>$employee
                                        );
                                        MessageController::updatedatafirebase($annualStatus->manager_approve_id,$msg);
                                    }catch(\Exception $e){}
                                    if(!empty($annualStatus->id)){
                                        $UserAnnual->update([
                                            'monthly_balance_spend'=>$UserAnnual2->monthly_balance_spend+$minute_duration,
                                        ]);
                                        return ResponseApi::acceptedResponseApi(['message'=>'Inserted Success'],"success",201);
                                }else{
                                    return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
                               }
                            }else{
                                return ResponseApi::acceptedResponseApi(['message'=>'Your Balance is less than your Request'],"Validator Errors",400);
                            }

                        }else{
                            return ResponseApi::acceptedResponseApi(['message'=>'You Have Already Leave / Permission In The Same Date'],"Validator Errors",400);

                        }
                    }elseif($request->annual_type_id==6 ){
                        $UserAnnual = UserAnnual::where('user_id',$request->user_id)->first();
                            $UserAnnual2 = UserAnnual::where('user_id',$request->user_id)->first();
                            $permission_balance =PermissionBalance::first();
                            if(!empty($UserAnnual->id) ){
                                if( $days_duration<=$permission_balance->bereavement){
                                    $annualStatus=  AnnualRequest::create([
                                        'reason'=>$request->reason,
                                        'from'=>$start_date,
                                        'to'=>$end_date,
                                        'annual_type_id'=>$request->annual_type_id,
                                        'annual_status_id'=>$request->annual_status_id,
                                        'manager_approve_id'=>$request->manager_approve_id,
                                        'user_id'=>$request->user_id,
                                    ]);

                                    $employee = AnnualRequest::where('manager_approve_id',$annualStatus->manager_approve_id)
                                    ->where('annual_status_id',2)->get()->count();
                                    try{
                                        $msg = array(
                                            'pendingVacationsRequest'=>$employee
                                        );
                                        MessageController::updatedatafirebase($annualStatus->manager_approve_id,$msg);
                                    }catch(\Exception $e){}
                                    return ResponseApi::acceptedResponseApi(['message'=>'Inserted Success'],"success",201);

                            }else{
                                return ResponseApi::acceptedResponseApi(['message'=>'Your Balance is less than your Request'],"Validator Errors",400);
                            }

                        }else{
                            return ResponseApi::acceptedResponseApi(['message'=>'You Have Already Leave / Permission In The Same Date'],"Validator Errors",400);

                        }
                    
                    }elseif($request->annual_type_id==7){
                        $UserAnnual = UserAnnual::where('user_id',$request->user_id)->first();
                        $UserAnnual2 = UserAnnual::where('user_id',$request->user_id)->first();
                        $permission_balance =PermissionBalance::first();
                        if(!empty($UserAnnual->id) ){
                            if( $days_duration<=$permission_balance->marriage){
                                $annualStatus=  AnnualRequest::create([
                                    'reason'=>$request->reason,
                                    'from'=>$start_date,
                                    'to'=>$end_date,
                                    'annual_type_id'=>$request->annual_type_id,
                                    'annual_status_id'=>$request->annual_status_id,
                                    'manager_approve_id'=>$request->manager_approve_id,
                                    'user_id'=>$request->user_id,
                                ]);

                                $employee = AnnualRequest::where('manager_approve_id',$annualStatus->manager_approve_id)
                                ->where('annual_status_id',2)->get()->count();
                                try{
                                    $msg = array(
                                        'pendingVacationsRequest'=>$employee
                                    );
                                    MessageController::updatedatafirebase($annualStatus->manager_approve_id,$msg);
                                }catch(\Exception $e){}
                                return ResponseApi::acceptedResponseApi(['message'=>'Inserted Success'],"success",201);

                        }else{
                            return ResponseApi::acceptedResponseApi(['message'=>'Your Balance is less than your Request'],"Validator Errors",400);
                        }

                        }else{
                            return ResponseApi::acceptedResponseApi(['message'=>'You Have Already Leave / Permission In The Same Date'],"Validator Errors",400);

                        }
                    }elseif($request->annual_type_id==8){
                        $UserAnnual = UserAnnual::where('user_id',$request->user_id)->first();
                        $UserAnnual2 = UserAnnual::where('user_id',$request->user_id)->first();
                        $permission_balance =PermissionBalance::first();
                        if(!empty($UserAnnual->id) ){
                            if( $days_duration<=$permission_balance->birth){
                                $annualStatus=  AnnualRequest::create([
                                    'reason'=>$request->reason,
                                    'from'=>$start_date,
                                    'to'=>$end_date,
                                    'annual_type_id'=>$request->annual_type_id,
                                    'annual_status_id'=>$request->annual_status_id,
                                    'manager_approve_id'=>$request->manager_approve_id,
                                    'user_id'=>$request->user_id,
                                ]);

                                $employee = AnnualRequest::where('manager_approve_id',$annualStatus->manager_approve_id)
                                ->where('annual_status_id',2)->get()->count();
                                try{
                                    $msg = array(
                                        'pendingVacationsRequest'=>$employee
                                    );
                                    MessageController::updatedatafirebase($annualStatus->manager_approve_id,$msg);
                                }catch(\Exception $e){}
                                return ResponseApi::acceptedResponseApi(['message'=>'Inserted Success'],"success",201);

                        }else{
                            return ResponseApi::acceptedResponseApi(['message'=>'Your Balance is less than your Request'],"Validator Errors",400);
                        }

                        }else{
                            return ResponseApi::acceptedResponseApi(['message'=>'You Have Already Leave / Permission In The Same Date'],"Validator Errors",400);

                        }
                    }
                }else{
                    return ResponseApi::acceptedResponseApi(['message'=>'You Have Already Leave / Permission In The Same Date'],"Validator Errors",400);
                }
                }else{
                    return ResponseApi::acceptedResponseApi(['message'=>'You Have Already Leave / Permission In The Same Date'],"Validator Errors",400);

                }
         
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
                
    }


    public function GetUserRequests(Request $request){
     // try{
        $validator = Validator::make($request->all(), [
           'user_id' => 'required|numeric|exists:users,id',
           'token'=>'required|string'
       ]);
       if ($validator->fails()) {

           return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
       }
       $annual_user =AnnualRequest::where('user_id',$request->user_id)->get();
       $array_response =[];
       if(!empty($annual_user[0])){
        foreach ($annual_user as $key) {
           $array_response[] = $this->CastArrayRequests($key);
        }
        return ResponseApi::acceptedResponseApi($array_response,"success",201);
       }else{
        return ResponseApi::acceptedResponseApi(['message'=>'Empty Requests'],"Empty Requests",200);

       }

        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
    }
    public function GetManagerRequests(Request $request){
           try{
           $validator = Validator::make($request->all(), [
              'token'=>'required|string'
          ]);
          if ($validator->fails()) {
   
              return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
          }
          $annual_user =AnnualRequest::where('manager_approve_id',Auth::guard('user_api')->user()->id)->where('annual_status_id',2)->get();
          $array_response =[];
          if(!empty($annual_user[0])){
           foreach ($annual_user as $key) {
              $array_response[] = $this->CastArrayRequests($key);
           }
           return ResponseApi::acceptedResponseApi($array_response,"success",201);
          }else{
           return ResponseApi::acceptedResponseApi(['message'=>'Empty Requests'],"Empty Requests",200);
   
          }
   
           }catch(\Exception $e){
               return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
   
           }
           
   
       }
       public function GetHRRequests(Request $request){
            try{
           $validator = Validator::make($request->all(), [
              'token'=>'required|string'
          ]);
          if ($validator->fails()) {
   
              return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
          }
          $annual_user =AnnualRequest::where('manager_approve_id',Auth::guard('user_api')->user()->id)->where('annual_status_id',3)->get();
          $array_response =[];
          if(!empty($annual_user[0])){
           foreach ($annual_user as $key) {
              $array_response[] = $this->CastArrayRequests($key);
           }
           return ResponseApi::acceptedResponseApi($array_response,"success",201);
          }else{
           return ResponseApi::acceptedResponseApi(['message'=>'Empty Requests'],"Empty Requests",200);
   
          }
   
           }catch(\Exception $e){
               return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
   
           }
           
   
       }
    //    public function GetApprovedRequests(Request $request){
    //        try{
    //        $validator = Validator::make($request->all(), [
    //           'user_id' => 'required|numeric|exists:users,id',
    //           'token'=>'required|string'
    //       ]);
    //       if ($validator->fails()) {
   
    //           return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
    //       }
    //       $annual_user =AnnualRequest::where('user_id',$request->user_id)->where('annual_status_id',1)->get();
    //       $array_response =[];
    //       if(!empty($annual_user[0])){
    //        foreach ($annual_user as $key) {
    //           $array_response[] = $this->CastArrayRequests($key);
    //        }
    //        return ResponseApi::acceptedResponseApi($array_response,"success",201);
    //       }else{
    //        return ResponseApi::acceptedResponseApi(['message'=>'Empty Requests'],"Empty Requests",200);
   
    //       }
   
    //        }catch(\Exception $e){
    //            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
   
    //        }
           
   
    //    }
    //    public function GetRejectedRequests(Request $request){
    //     //   try{
    //        $validator = Validator::make($request->all(), [
    //           'user_id' => 'required|numeric|exists:users,id',
    //           'token'=>'required|string'
    //       ]);
    //       if ($validator->fails()) {
   
    //           return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
    //       }
    //       $annual_user =AnnualRequest::where('user_id',$request->user_id)->where('annual_status_id',4)->get();
    //       $array_response =[];
    //       if(!empty($annual_user[0])){
    //        foreach ($annual_user as $key) {
    //           $array_response[] = $this->CastArrayRequests($key);
    //        }
    //        return ResponseApi::acceptedResponseApi($array_response,"success",201);
    //       }else{
    //        return ResponseApi::acceptedResponseApi(['message'=>'Empty Requests'],"Empty Requests",200);
   
    //       }
   
    //        // }catch(\Exception $e){
    //        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
   
    //        // }
           
   
    //    }

       public function HRActionRequests(Request $request){
      //      try{
           $validator = Validator::make($request->all(), [
               'token'=>'required|string',
              'annual_request_id'=>'required|numeric|exists:annual_requests,id',
              'annual_status_id' => 'required|numeric|exists:annual_statuses,id',
            ]);
          if ($validator->fails()) {
   
              return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
          }
          if($request->annual_status_id==4){

            $validator = Validator::make($request->all(), [
                'comment'=>'string|required',
               ]);
            if ($validator->fails()) {
     
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
        }
        $annualRequest =AnnualRequest::where('id',$request->annual_request_id)->first();

        $start_date = Carbon::create(Carbon::parse($annualRequest->from)->format('m/d/Y H:i:s') );
        $end_date = Carbon::create(Carbon::parse($annualRequest->to)->format('m/d/Y H:i:s') );
        $days_duration = $this->calDate($start_date,$end_date);
        $minute_duration = $start_date->diffInMinutes($end_date);
      


        $annual_user =AnnualRequest::where('id',$request->annual_request_id)->first();
          if(!empty($annual_user)){
            $annualRequestaction = AnnualRequestAction::create([
                'comment'=>$request->comment?$request->comment:'',
                'annual_request_id'=>$request->annual_request_id,
                'annual_status_id'=>$request->annual_status_id,
                'assign_to_id'=>Auth::guard('user_api')->user()->id,
            ]);
            if(!empty($annualRequestaction->id)){
                if($request->annual_status_id==4){
                   
                    $UserAnnual = UserAnnual::where('user_id',$annual_user->user_id)->first();
                    $UserAnnual2 = UserAnnual::where('user_id',$annual_user->user_id)->first();
                    if($annualRequest->annual_type_id==1){
                        $UserAnnual->update([
                            'available_leave_balance'=>$UserAnnual2->available_leave_balance + $days_duration,
                        ]);
                    }else if($annualRequest->annual_type_id==5){
                        $UserAnnual->update([
                            'monthly_balance_spend'=>$UserAnnual2->monthly_balance_spend - $minute_duration,
                        ]);
                     }
                }
                $annual_user->update([
                    'annual_status_id'=>$request->annual_status_id,
                ]);
                $annual_user =AnnualRequest::where('id',$request->annual_request_id)->first();
                
                $employee = AnnualRequest::where('manager_approve_id',$annual_user->manager_approve_id)
                ->where('annual_status_id',3)->get()->count();
                try{
                    $msg = array(
                        'pendingVacationsRequest'=>$employee
                    );
                    MessageController::updatedatafirebase($annual_user->manager_approve_id,$msg);
                }catch(\Exception $e){}

                if($request->annual_status_id==1){
                    $action_manager =AnnualRequestAction::where('id',$request->annual_request_id)->first();

                if($annual_user->annual_type_id==3){
                    $period = new DatePeriod($start_date, new DateInterval('P1D'), $end_date);
                     foreach($period as $dt) {
                         $curr = $dt->format('D');
                         if ($curr != 'Sat' && $curr != 'Fri') {
                            
                            $report = Report::create([
                              'duration'=>0,
                                'report_type_id'=>7,
                                'report_status_id'=>2,
                                'manager_approve_id'=>$action_manager->assign_to_id,
                                'user_creator_id'=>$annual_user->user_id,
                                'report_details'=>$annual_user->annual_type_id_fun->annual_type,
                                'report_date'=> $start_date,
                                'report_progress'=>0,
                                'process_id'=>15,
                              //  'report_cost'=>$salary,
                             ]);
                             $report2 =$report;
                            $getDuration = WorkHoursConfig::where('start_date','<=',$report->report_date)->where('end_date','>=',$report->report_date)->first();
                            $duartion = 0;
        
                            if(!empty($getDuration->id)){
                                $duartion = $getDuration->config_duration;
                            }else{
                                $duartion = 8;
                            }
                            $user_salary = UserSalary::where('start_date','<=',$report->report_date)->first();
                            $salary =0;
                            if(!empty($user_salary->id)){
                                $date_current =   $start_date;
                                $end = Carbon::create($date_current)->endOfMonth();
                                $start = Carbon::create($date_current)->startOfMonth();
                                $hours = $this->calDateRamadan($start,$end);
                               // $hours = $hours!=0?$hours*$duartion : 1;
                                $salary = (($user_salary->salary)/$hours)*$duartion;
                            }else{
                                $user_salary = UserSalaryHistory::where('start_date','<=',$report->report_date)->where('end_date','>=',$report->report_date)->first();
                                if(!empty($user_salary->id)){
                                    $date_current =  $start_date;
                                    $end = Carbon::create($date_current)->endOfMonth();
                                    $start = Carbon::create($date_current)->startOfMonth();
                                    $hours = $this->calDateRamadan($start,$end);
                                   // $hours = $hours!=0?$hours*$duartion : 1;
                                    $salary = (($user_salary->salary)/$hours)*$duartion;
                                }else{
                                    $salary=0;
                                }
                            }
                            $report ->update([
                                   'duration'=>$duartion,
                                  
                                   'report_cost'=>$salary,
                                 ]);
                             $annual_user =Report::where('id',$report2->id)->first();
                             $user_details = User::where('id',$annual_user->user_creator_id)->first();
                             try{
                                 $this->ApprovalSendNotificationReport(Auth::guard('user_api')->user(),$user_details,$annual_user);
                                 }catch(\Exception $e){
                                     
                                 }
     
                         }
                         $start_date->addDay(1);
                     }
                 
                }elseif($annual_user->annual_type_id==5){
                    $period = new DatePeriod($start_date, new DateInterval('P1D'), $end_date);
                    foreach($period as $dt) {
                        $curr = $dt->format('D');
                        if ($curr != 'Sat' && $curr != 'Fri') {
                            $report = Report::create([
                              'duration'=>(float)(0),
                                'report_type_id'=>6,
                                'report_status_id'=>2,
                                'manager_approve_id'=>$action_manager->assign_to_id,
                                'user_creator_id'=>$annual_user->user_id,
                                'report_details'=>$annual_user->annual_type_id_fun->annual_type,
                                'report_date'=>$start_date,
                                'report_progress'=>0,
                                'process_id'=>15,
                             //   'report_cost'=>$salary,

                            ]);
                            $getDuration = WorkHoursConfig::where('start_date','<=',$report->report_date)->where('end_date','>=',$report->report_date)->first();
                            $duartion = 0;
        
                            if(!empty($getDuration->id)){
                                $duartion = $getDuration->config_duration ;
                            }else{
                                $duartion = 8;
                            }
                            $user_salary = UserSalary::where('start_date','<=',$report->report_date)->first();
                            $salary =0;
                            if(!empty($user_salary->id)){
                                $date_current =  $start_date;
                                $end = Carbon::create($date_current)->endOfMonth();
                                $start = Carbon::create($date_current)->startOfMonth();
                                $hours = $this->calDateRamadan($start,$end);
                               // $hours = $hours!=0?$hours*$duartion: 1;
                                $salary = (($user_salary->salary)/$hours)*($minute_duration);
                            }else{
                                $user_salary = UserSalaryHistory::where('start_date','<=',$report->report_date)->where('end_date','>=',$report->report_date)->first();
                                if(!empty($user_salary->id)){
                                    $date_current =   $start_date;
                                    $end = Carbon::create($date_current)->endOfMonth();
                                    $start = Carbon::create($date_current)->startOfMonth();
                                    $hours = $this->calDateRamadan($start,$end);
                              //      $hours = $hours!=0?$hours*$duartion: 1;
                                    $salary = (($user_salary->salary)/$hours)*$minute_duration;
                                }else{
                                    $salary=0;
                                }
                            }
        
                            $report ->update([
                                'duration'=>(float)($minute_duration/60),
                               
                                'report_cost'=>$salary,

                            ]);
                            $annual_user =Report::where('id',$report->id)->first();
                            $user_details = User::where('id',$annual_user->user_creator_id)->first();
                            try{
                                $this->ApprovalSendNotificationReport(Auth::guard('user_api')->user(),$user_details,$annual_user);
                                }catch(\Exception $e){
                                    
                                }
    
                        }
                        $start_date->addDay(1);

                    }
                }else {
                    $period = new DatePeriod($start_date, new DateInterval('P1D'), $end_date);
                    // return $period;
                    foreach($period as $dt) {
                        $annual_user =AnnualRequest::where('id',$request->annual_request_id)->first();
                        $curr = $dt->format('D');
                        if ($curr != 'Sat' && $curr != 'Fri') {
                            $report = Report::create([
                                'duration'=>0,
                                'report_type_id'=>6,
                                'report_status_id'=>2,
                                'manager_approve_id'=>$action_manager->assign_to_id,
                                'user_creator_id'=>$annual_user->user_id,
                                'report_details'=>$annual_user->annual_type_id_fun->annual_type,
                                'report_date'=> $start_date,
                                'report_progress'=>0,
                                'process_id'=>15,
    
                            ]);
                            $getDuration = WorkHoursConfig::where('start_date','<=',$report->report_date)->where('end_date','>=',$report->report_date)->first();
                            $duartion = 0;
        
                            if(!empty($getDuration->id)){
                                $duartion = $getDuration->config_duration;
                            }else{
                                $duartion = 8;
                            }
                            $report2 = $report;
                        $report2 ->update([
                            'duration'=>$duartion,
                       

                        ]);
                        
                        
                        $user_salary = UserSalary::where('start_date','<=',$report->report_date)->first();
                        $salary =0;
                        if(!empty($user_salary->id)){
                            $date_current = $start_date;
                            $end = Carbon::create($date_current)->endOfMonth();
                            $start = Carbon::create($date_current)->startOfMonth();
                            $hours = $this->calDateRamadan($start,$end);
                          //  $hours = $hours!=0?$hours*$duartion : 1;
                            $salary = (($user_salary->salary)/$hours)*$duartion;
                        }else{
                            
                            $user_salary = UserSalaryHistory::where('start_date','<=',$report->report_date)->where('end_date','>=',$report->report_date)->first();
                            if(!empty($user_salary->id)){
                                $date_current =  $start_date;
                                $end = Carbon::create($date_current)->endOfMonth();
                                $start = Carbon::create($date_current)->startOfMonth();
                                $hours = $this->calDateRamadan($start,$end);
                              //  $hours = $hours!=0?$hours*$duartion : 1;
                                $salary = (($user_salary->salary)/$hours)*$duartion;
                            }else{
                                $salary=0;
                            }
                        }
                      //  return $hours;
                        $report->update([
                         'report_cost'=>$salary,
  
                        ]);
                        $annual_user = Report::where('id',$report2->id)->first();
                        $user_details = User::where('id',$annual_user->user_creator_id)->first();
                        try{
                            $this->ApprovalSendNotificationReport(Auth::guard('user_api')->user(),$user_details,$annual_user);
                            }catch(\Exception $e){
                                
                            }

                        }
                        $start_date->addDay(1);

                    }
                    }
               

                }
                

                return ResponseApi::acceptedResponseApi(['message'=>'Updated Success'],"success",201);
            }else{
                return ResponseApi::acceptedResponseApi(['message'=>'Can\'t Process it'],"Server Error",500);
            }
           
          }else{
           return ResponseApi::acceptedResponseApi(['message'=>'Empty Requests'],"Empty Requests",200);
   
          }
   
        //    }catch(\Exception $e){
        //        return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
   
        //    }
           
   
       }
       public function ManagerActionRequests(Request $request){
        //   try{
           $validator = Validator::make($request->all(), [
             'token'=>'required|string',
              'annual_request_id'=>'required|numeric|exists:annual_requests,id',
               'annual_status_id' => 'required|numeric|exists:annual_statuses,id',
            ]);
          if ($validator->fails()) {
   
              return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            $annual_user =AnnualRequest::where('id',$request->annual_request_id)->first();
          if($request->annual_status_id==4){

              $validator = Validator::make($request->all(), [
                  'comment'=>'string|required',
                 ]);
              if ($validator->fails()) {
       
                  return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
              }
          }else{
            $validator = Validator::make($request->all(), [
                'user_id' => 'required|numeric|exists:users,id',
            ]);
            if ($validator->fails()) {
     
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          }

          if(!empty($annual_user)){
            $annualRequestaction = AnnualRequestAction::create([
                'comment'=>$request->comment?$request->comment:'',
                'annual_request_id'=>$request->annual_request_id,
                'annual_status_id'=>$request->annual_status_id,
                'assign_to_id'=>Auth::guard('user_api')->user()->id,
            ]);

           


           



            if($request->annual_status_id==4){
                $start_date = Carbon::create(Carbon::parse($annual_user->from)->format('m/d/Y H:i:s') );
                $end_date = Carbon::create(Carbon::parse($annual_user->to)->format('m/d/Y H:i:s') );
                $days_duration = $this->calDate($start_date,$end_date);
                $minute_duration = $start_date->diffInMinutes($end_date);
                
 
                $UserAnnual = UserAnnual::where('user_id',$annual_user->user_id)->first();
                $UserAnnual2 = UserAnnual::where('user_id',$annual_user->user_id)->first();
                if($annual_user->annual_type_id==1){
                    $UserAnnual->update([
                        'available_leave_balance'=>$UserAnnual2->available_leave_balance + $days_duration,
                    ]);
                }else if($annual_user->annual_type_id==5){
                    $UserAnnual->update([
                        'monthly_balance_spend'=>$UserAnnual2->monthly_balance_spend - $minute_duration,
                    ]);
                 }
            }
            if(!empty($annualRequestaction->id)){
                $annual_user->update([
                    'annual_status_id'=>$request->annual_status_id,
                    'manager_approve_id'=>$request->user_id?$request->user_id:Auth::guard('user_api')->user()->id,
                ]);
                $annual_user =AnnualRequest::where('id',$request->annual_request_id)->first();
                $user_details = User::where('id',$annual_user->user_id)->first();
                try{
                    $this->ApprovalSendNotification(Auth::guard('user_api')->user(),$user_details,$annual_user);
                    }catch(\Exception $e){
                        
                    }
                    $employee = AnnualRequest::where('manager_approve_id',Auth::guard('user_api')->user()->id)
                    ->where('annual_status_id',2)->get()->count();
                    try{
                        $msg = array(
                            'pendingVacationsRequest'=>$employee
                        );
                        MessageController::updatedatafirebase(Auth::guard('user_api')->user()->id,$msg);
                    }catch(\Exception $e){}
                    
                    $employee = AnnualRequest::where('manager_approve_id',$annual_user->manager_approve_id)
                    ->where('annual_status_id',3)->get()->count();
                    try{
                        $msg = array(
                            'pendingVacationsRequest'=>$employee
                        );
                        MessageController::updatedatafirebase($annual_user->manager_approve_id,$msg);
                    }catch(\Exception $e){}

                return ResponseApi::acceptedResponseApi(['message'=>'Updated Success'],"success",201);
              
            }else{
                // $annual_user =AnnualRequest::where('id',$request->annual_request_id)->first();
                // $user_details = User::where('id',$annual_user->user_id)->first();
                // try{
                //     $this->ApprovalSendNotification(Auth::guard('user_api')->user(),$user_details,$annual_user);
                //     }catch(\Exception $e){
                        
                //     }

                return ResponseApi::acceptedResponseApi(['message'=>'Can\'t Process it'],"Server Error",500);
            }
           
          }else{
           return ResponseApi::acceptedResponseApi(['message'=>'Empty Requests'],"Empty Requests",200);
   
          }
   
           // }catch(\Exception $e){
           //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
   
           // }
           
   
       }
        public function DeleteAnnualRequest(Request $request){
       try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'annual_request_id'=>'required|numeric|exists:annual_requests,id',
                ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

            $annualRequest=  AnnualRequest::where('id',$request->annual_request_id)->first();
            $annualRequest2=  AnnualRequest::where('id',$request->annual_request_id)->first();

            $start_date = Carbon::create(Carbon::parse($annualRequest->from)->format('m/d/Y H:i:s') );
            $end_date = Carbon::create(Carbon::parse($annualRequest->to)->format('m/d/Y H:i:s') );
            $days_duration = $this->calDate($start_date,$end_date);
            $minute_duration = $start_date->diffInMinutes($end_date);
             
          $UserAnnual2 = UserAnnual::where('user_id',Auth::guard('user_api')->user()->id)->first();
            if($annualRequest->annual_status_id==2){
                if($annualRequest->annual_type_id==1){
                    $UserAnnual2->update([
                        'available_leave_balance'=>$UserAnnual2->available_leave_balance + $days_duration,
                    ]);
                    $annualRequest->forceDelete();

 

                    $employee = AnnualRequest::where('manager_approve_id',$annualRequest2->manager_approve_id)
                    ->where('annual_status_id',2)->get()->count();
                    try{
                        $msg = array(
                            'pendingVacationsRequest'=>$employee
                        );
                        MessageController::updatedatafirebase($annualRequest2->manager_approve_id,$msg);
                    }catch(\Exception $e){
                    }

                  



                }else if($annualRequest->annual_type_id==5){
                    $UserAnnual2->update([
                        'monthly_balance_spend'=>$UserAnnual2->monthly_balance_spend - $minute_duration,
                    ]);
                    $annualRequest->forceDelete();
                    $employee = AnnualRequest::where('manager_approve_id',$annualRequest2->manager_approve_id)
                    ->where('annual_status_id',2)->get()->count();
                    try{
                        $msg = array(
                            'pendingVacationsRequest'=>$employee
                        );
                        MessageController::updatedatafirebase($annualRequest2->manager_approve_id,$msg);
                    }catch(\Exception $e){
                    }

                }else{
                    $annualRequest->forceDelete();
                    $employee = AnnualRequest::where('manager_approve_id',$annualRequest2->manager_approve_id)
                    ->where('annual_status_id',2)->get()->count();
                    try{
                        $msg = array(
                            'pendingVacationsRequest'=>$employee
                        );
                        MessageController::updatedatafirebase($annualRequest2->manager_approve_id,$msg);
                    }catch(\Exception $e){
                    }

                }
                return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

            }else{
                return ResponseApi::badMethodErrorResponse(['message'=>'you can\'t delete this request'],"Validator Errors",400);
            }
         
         
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }






    //////here
    public function OfficalVacationHolidays(Request $request){
    //try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                 'start_date'=>'required|date',
                  'end_date' => 'required|date',
                  'report_details'=>'required|string',
               ]);
             if ($validator->fails()) {
      
                 return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }
             
             $all_user = User::where('active','<>',0)->get();

            
           

             foreach ($all_user as $user2) {
            $start_date =Carbon::createFromFormat('m/d/Y', $request-> start_date);
             $end_date = Carbon::createFromFormat('m/d/Y', $request-> end_date);
             $end_date=$end_date->addDay(1);
            $period = new DatePeriod($start_date, new DateInterval('P1D'), $end_date);
            
                    foreach($period as $dt) {
                        $curr = $dt->format('D');
                        if ($curr != 'Sat' && $curr != 'Fri') {
                            $getDuration = WorkHoursConfig::whereDate('start_date','<=',$start_date)->whereDate('end_date','>=',$start_date)
                            ->orWhereDate('start_date','<=',$end_date)->whereDate('end_date','>=',$end_date)->first();
                            $duartion = 0;
                             if(!empty($getDuration->id)){
                                $duartion = $getDuration->config_duration;
                            }else{
                                $duartion = 8;
                            }
                            // $user_salary = UserSalary::where('start_date','<=',$start_date)->first();
                            // $salary =0;
                            // if(!empty($user_salary->id)){
                            //     $date_current =  Carbon::createFromFormat('m/d/Y', $start_date);
                            //     $end = Carbon::create($date_current)->endOfMonth();
                            //     $start = Carbon::create($date_current)->startOfMonth();
                            //     $hours = $this->calDate($start,$end);
                            //     $hours = $hours!=0?$hours : 1;
                            //     $salary = (($user_salary->salary)/$hours)*$duartion;
                            // }else{
                            //     $user_salary = UserSalaryHistory::where('start_date','<=',$start_date)->where('end_date','>=',$start_date)->first();
                            //     if(!empty($user_salary->id)){
                            //         $date_current =  Carbon::createFromFormat('m/d/Y', $start_date);
                            //         $end = Carbon::create($date_current)->endOfMonth();
                            //         $start = Carbon::create($date_current)->startOfMonth();
                            //         $hours = $this->calDate($start,$end);
                            //         $hours = $hours!=0?$hours : 1;
                            //         $salary = (($user_salary->salary)/$hours)*$duration;
                            //     }else{
                            //         $salary=0;
                            //     }
                            // }
                            
        
                            $report = Report::create([
                                'duration'=>$duartion,
                                'report_type_id'=>6,
                                'report_status_id'=>2,
                                'manager_approve_id'=>Auth::guard('user_api')->user()->id,
                                'user_creator_id'=>$user2->id,
                                'report_details'=>$request->report_details,
                                'report_date'=>$start_date,
                                'report_progress'=>0,
                                'process_id'=>15,
                              //  'report_cost'=>$salary,
        
                            ]);
                            $annual_user =Report::where('id',$report->id)->first();
                            $user_details = User::where('id',$user2->id)->first();
                            try{
                                $this->ApprovalSendNotificationReport(Auth::guard('user_api')->user(),$user_details,$annual_user);
                                }catch(\Exception $e){
                                    
                                }
                        }
                        $start_date->addDay(1);

                       
                    }

             
        }
        return ResponseApi::acceptedResponseApi(["message"=>"Success"],"success",201);

    // }catch(\Exception $e){
        
       
    //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

    // }
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
     * @param  \App\Models\AnnualRequest  $annualRequest
     * @return \Illuminate\Http\Response
     */
    public function show(AnnualRequest $annualRequest)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\AnnualRequest  $annualRequest
     * @return \Illuminate\Http\Response
     */
    public function edit(AnnualRequest $annualRequest)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\AnnualRequest  $annualRequest
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, AnnualRequest $annualRequest)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\AnnualRequest  $annualRequest
     * @return \Illuminate\Http\Response
     */
    public function destroy(AnnualRequest $annualRequest)
    {
        //
    }
}
