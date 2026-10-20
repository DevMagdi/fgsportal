<?php

namespace App\Http\Controllers\AdminReport;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use App\Models\ReportStatus;
use App\Models\ReportType;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
 use App\Models\User;
use App\Models\AdminTask;
use App\Models\AdminReportManagerEdit;
use App\Models\AdminReportReject;
use App\Http\Controllers\ApiMessage\MessageController;
use App\Models\UserSalary;
use DatePeriod;
use DateInterval;
use App\Models\UserSalaryHistory;
use App\Models\WorkHoursConfig;
use App\Models\AdminReport;

class AdminReportController extends Controller
{
  

    public function ApprovalSendNotification(User $user1 , User $user2,AdminReport $report){
        $msg = array
             (
               "body"=>  $report->report_status_id == '2' ? $user1->username . " Has Approved Your Report" :$user1->username . " Has Rejected Your Report",
               "createdAt"=>$report->updated_at,
               "receverKey"=> $user2->id.'',
               "receverName"=> $user2->username,
               "redirection"=> "/manager/apporval",
               "senderKey"=> $user1->id.'',
               "senderName"=> $user1->username,
               "status"=> 0,
               "updatedAt"=>$report->updated_at,
               "title"=> $report->report_status_id =='2' ? $user1->username."Your Report". " Approved" : $user1->username." Your Report". " Rejected" ,
               'senderImg'=>$user1->photoURL?'/Attachments/User/'.$user1->id.'/profile'.'/'.$user1->photoURL:null,
             );

       MessageController::notificationSend($msg);
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
 
    
   

    public function CreateAdminReport(Request $request){
       try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'report_type_id'=>'required|numeric|exists:report_types,id',
                 'manager_approve_id'=>'required|numeric|exists:users,id',
                 'report_details'=>'required|string',
                 'report_date' => 'required|date',
                //  'report_status_id'=>'required|numeric|exists:report_statuses,id'

                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }


            if($request->report_type_id==1){
                $validator = Validator::make($request->all(), [
                // 'task_id'=>'required|numeric|exists:admin_tasks,id',
                'duration'=>'required|numeric',
                // 'progress'=>'required|numeric',
               ]);
               if ($validator->fails()) {
       
                   return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
               }

               $duration = $request->duration;
               $progress = $request->progress;
               $task_id = $request->task_id;

            }elseif($request->report_type_id==2){
                $validator = Validator::make($request->all(), [
                    'task_id'=>'numeric|exists:admin_tasks,id',
                    'duration'=>'required|numeric',
                   ]);
               if ($validator->fails()) {
       
                   return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
               }

               $duration = $request->duration;
               $progress = 0;
               $task_id = $request->task_id?$request->task_id : null;

            
            }elseif($request->report_type_id==3){
                $validator = Validator::make($request->all(), [
                    'duration'=>'required|numeric',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

            $duration = $request->duration;
            $progress = 0;
            $task_id = null;

            }else if($request->report_type_id==4||$request->report_type_id==5){
                    $validator = Validator::make($request->all(), [
                    'duration'=>'required|numeric',
                   ]);
               if ($validator->fails()) {
       
                   return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
               }
                   
               $duration = $request->duration;
               $progress = 0;
               $task_id = $request->task_id?$request->task_id : null;
       

            }else if($request->report_type_id==6||$request->report_type_id==7){
                
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
                    
                $duration = $request->duration;
                $progress = 0;
                $task_id = $request->task_id?$request->task_id : null;
        

            }else{
                    
                return ResponseApi::acceptedResponseApi(["message"=>"Can't add This Type of  Report"],"Validator Errors",400);
            }

            $report = AdminReport::create([
                'duration'=>$duration,
                'report_type_id'=>$request->report_type_id,
                'report_status_id'=>1,//$request->report_status_id,
                'manager_approve_id'=>$request->manager_approve_id,
                'user_creator_id'=>Auth::guard('user_api')->user()->id,
                'report_details'=>$request->report_details,
                'task_id'=>$task_id,
                'report_progress'=>$progress,
                'report_date'=>Carbon::createFromFormat('m/d/Y', $request->report_date),
            ]);
            if(!empty($report->id)){
                $manager = AdminReport::where('manager_approve_id',$report->manager_approve_id)->where('report_status_id','<>',3)->
                where('report_status_id','<>',2)->get()->count();
                $dev = AdminReport::where('user_creator_id',$report->user_creator_id)->where('report_status_id','<>',3)->
                where('report_status_id','<>',2)->get()->count();
                try{
                    $msg = array(
                        'pendingReport'=>$manager
                    );
                    MessageController::updatedatafirebase($report->manager_approve_id,$msg);
                 }catch(\Exception $e){}

                try{
                    $msg = array(
                        'devPendingReports'=>$dev
                    );
                    MessageController::updatedatafirebase($report->user_creator_id,$msg);
                 }catch(\Exception $e){}
              
                return ResponseApi::acceptedResponseApi(["message"=>"Created Success"],"success",201);

            }else{
                return ResponseApi::acceptedResponseApi(["message"=>"Server Error"],"server Error",500);

            }

        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>$e],"server Error",500);

        }
     

    }

    public function UpdateAdminReport(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'report_type_id'=>'required|numeric|exists:report_types,id',
                 'manager_approve_id'=>'required|numeric|exists:users,id',
                 'report_details'=>'required|string',
                 'report_id'=>'required|numeric|exists:admin_reports,id',
                 'report_date' => 'required|date',
                // 'report_status_id'=>'required|numeric|exists:report_statuses,id'
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            } 

            if($request->report_type_id==1){
                $validator = Validator::make($request->all(), [
                    // 'task_id'=>'required|numeric|exists:admin_tasks,id',
                    'duration'=>'required|numeric',
                    // 'progress'=>'required|numeric',
                   ]);
               if ($validator->fails()) {
       
                   return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
               }

               $duration = $request->duration;
               $progress = $request->progress;
               $task_id = $request->task_id;

            }elseif($request->report_type_id==2){
                $validator = Validator::make($request->all(), [
                    'task_id'=>'numeric|exists:admin_tasks,id',
                    'duration'=>'required|numeric',
                   ]);
               if ($validator->fails()) {
       
                   return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
               }

               $duration = $request->duration;
               $progress = 0;
               $task_id = $request->task_id?$request->task_id : null;

            
            }elseif($request->report_type_id==3){
                $validator = Validator::make($request->all(), [
                    'duration'=>'required|numeric',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

            $duration = $request->duration;
            $progress = 0;
            $task_id = $request->task_id?$request->task_id : null;

            }else if($request->report_type_id==4||$request->report_type_id==5){
                    $validator = Validator::make($request->all(), [
                    'duration'=>'required|numeric',
                   ]);
               if ($validator->fails()) {
       
                   return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
               }
                   
               $duration = $request->duration;
               $progress = 0;
               $task_id = $request->task_id?$request->task_id : null;
       

            }else{
              
                return ResponseApi::acceptedResponseApi(["message"=>"Can't This Type for  Report"],"Validator Errors",400);
            }


            $report = AdminReport::where('id',$request->report_id)->first();
            $report ->update([
                'duration'=>$duration,
                'report_type_id'=>$request->report_type_id,
                // 'report_status_id'=>$request->report_status_id,
                'manager_approve_id'=>$request->manager_approve_id,
                'user_creator_id'=>Auth::guard('user_api')->user()->id,
                'report_details'=>$request->report_details,
                'task_id'=>$task_id,
                'report_progress'=>$progress,
                'report_date'=>Carbon::createFromFormat('m/d/Y', $request->report_date),
            ]);
            $report = AdminReport::where('id',$request->report_id)->first();
            $manager = AdminReport::where('manager_approve_id',$report->manager_approve_id)->where('report_status_id','<>',3)->
            where('report_status_id','<>',2)->get()->count();
            $dev = AdminReport::where('user_creator_id',$report->user_creator_id)->where('report_status_id','<>',3)->
            where('report_status_id','<>',2)->get()->count();
            $dev_r = AdminReport::where('user_creator_id',$report->user_creator_id)->where('report_status_id',3)->get()->count();
            try{
                $msg = array(
                    'pendingReport'=>$manager
                );
                MessageController::updatedatafirebase($report->manager_approve_id,$msg);
             }catch(\Exception $e){}

            try{
                $msg = array(
                    'devPendingReports'=>$dev,
                    'rejectedReport'=>$dev_r
                );
                MessageController::updatedatafirebase($report->user_creator_id,$msg);
             }catch(\Exception $e){}
            if(!empty($report->id)){
                return ResponseApi::acceptedResponseApi(["message"=>"Updated Success"],"success",201);

            }else{
                return ResponseApi::acceptedResponseApi(["message"=>"Server Error"],"server Error",500);

            }

        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        

    }
 

    public function DeleteAdminReport(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'report_id'=>'required|numeric|exists:admin_reports,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            $report=  AdminReport::where('id',$request->report_id)->first();
            if(!empty($report->id)){
              $manager2 = $report->manager_approve_id;
              $dev2 = $report ->user_creator_id;

            if($report->report_status_id==1||$report->report_status_id==4){
                try{
                    $reject_report =   AdminReportReject::where('report_id',$report->id)->first();
                    if(!empty($reject_report->id)){
                      return ResponseApi::acceptedResponseApi(["message"=>"Stop Sheeting You Trying To delete rejected Report"],"success",400);
                    }
                    $report->forceDelete();
                    }catch(\Exception $e){
                    
                    }

                $manager = AdminReport::where('manager_approve_id',$manager2)->where('report_status_id','<>',3)->
                where('report_status_id','<>',2)->get()->count();
                $dev = AdminReport::where('user_creator_id',$dev2)->where('report_status_id','<>',3)->
                where('report_status_id','<>',2)->get()->count();
                try{
                    $msg = array(
                        'pendingReport'=>$manager
                    );
                    MessageController::updatedatafirebase($report->manager_approve_id,$msg);
                 }catch(\Exception $e){
                    
                 }

                try{
                    $msg = array(
                        'devPendingReports'=>$dev
                    );
                    MessageController::updatedatafirebase($report->user_creator_id,$msg);
                }catch(\Exception $e){}


            }else{
                $report->delete();

            }

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(["message"=>"Can't Find Report"],"Validator Errors",400);

          }
          

         
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
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
        return $count*8;
    }

    public function AdminManagerAction(Request $request){
       try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'report_id'=>'required|numeric|exists:admin_reports,id',
                 'approved'=>'required|boolean'
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            $report = AdminReport::where('id',$request->report_id)->first();
            if($request->approved == true){
                if(!empty($request->duration_reason)){
                    $validator = Validator::make($request->all(), [
                        'duration_reason'=>'required|string',
                        'duration'=>'required|numeric',
                       ]);
                   if ($validator->fails()) {
           
                       return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                   }
                  
                   $mangeredit = AdminReportManagerEdit::create([
                    'report_id'=>$request->report_id,
                    'manager_edit_id'=>Auth::guard('user_api')->user()->id,
                    'old_duration'=>$report->duration,
                    'comment'=>$request->duration_reason,
                   ]);
                   if(!empty($mangeredit)){
                    $getDuration = WorkHoursConfig::where('start_date','<=',$report->report_date)->where('end_date','>=',$report->report_date)->first();
                    $duartion = 0;
                    if(!empty($getDuration->id)){
                        $duartion = $getDuration->config_duration;
                    }else{
                        $duartion = 8;
                    }
                    $user_salary = UserSalary:: where('assign_to_id',$report->user_creator_id)->where('start_date','<=',$report->report_date)->first();
                    $salary =0;
                    if(!empty($user_salary->id)){
                        $date_current =  Carbon::createFromFormat('m/d/Y', $report->report_date);
                        $end = Carbon::create($date_current)->endOfMonth();
                        $start = Carbon::create($date_current)->startOfMonth();
                        $hours = $this->calDateRamadan($start,$end);
                        // $hours = $hours!=0?$hours : 1;
                        $salary = (($user_salary->salary)/$hours)*$report->duration;
                    }else{
                        $user_salary = UserSalaryHistory::where('start_date','<=',$report->report_date)->where('end_date','>=',$report->report_date)
                         ->whereHas('salary_id_fun',function($q) use($report){
                            $q->where('assign_to_id',$report->user_creator_id);
                        })->first();;
                        if(!empty($user_salary->id)){
                            $date_current =  Carbon::createFromFormat('m/d/Y', $report->report_date);
                            $end = Carbon::create($date_current)->endOfMonth();
                            $start = Carbon::create($date_current)->startOfMonth();
                            $hours = $this->calDateRamadan($start,$end);
                            // $hours = $hours!=0?$hours : 1;
                            $salary = (($user_salary->salary)/$hours)*$report->duration;
                        }else{
                            $salary=0;
                        }
                    }

                        $report->update([
                            'report_status_id'=>2,
                            'duration'=>$request->duration,
                            'report_cost'=>$salary,
                        ]); 

                    $report = AdminReport::where('id',$request->report_id)->first();
                    $manager = AdminReport::where('manager_approve_id',$report->manager_approve_id)->where('report_status_id','<>',3)->
                    where('report_status_id','<>',2)->get()->count();
                    $dev = AdminReport::where('user_creator_id',$report->user_creator_id)->where('report_status_id','<>',3)->
                    where('report_status_id','<>',2)->get()->count();
                    try{
                        $msg = array(
                            'pendingReport'=>$manager
                        );
                        MessageController::updatedatafirebase($report->manager_approve_id,$msg);
                     }catch(\Exception $e){}
    
                    try{
                        $msg = array(
                            'devPendingReports'=>$dev
                        );
                        MessageController::updatedatafirebase($report->user_creator_id,$msg);
                     }catch(\Exception $e){}

                    $user_details = User::where('id',$report->user_creator_id)->first();
                    try{
                    $this->ApprovalSendNotification(Auth::guard('user_api')->user(),$user_details,$report);
                    }catch(\Exception $e){   
                    }

                    return ResponseApi::acceptedResponseApi(["message"=>"Update Success"],"success",201);
    
                   }else{
                    return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
                   }
                }else{
                    $getDuration = WorkHoursConfig::where('start_date','<=',$report->report_date)->where('end_date','>=',$report->report_date)->first();
                    $duartion = 0;
                    if(!empty($getDuration->id)){
                        $duartion = $getDuration->config_duration;
                    }else{
                        $duartion = 8;
                    }
                    $user_salary = UserSalary:: where('assign_to_id',$report->user_creator_id)->where('start_date','<=',$report->report_date)->first();
                    $salary =0;
                    if(!empty($user_salary->id)){
                        $date_current= Carbon::parse( $report->report_date)->format('m/d/Y');
                        $end = Carbon::create($date_current)->endOfMonth();
                        $start = Carbon::create($date_current)->startOfMonth();
                        $hours = $this->calDateRamadan($start,$end);
                        // $hours = $hours!=0?$hours : 1;
                        $salary = (($user_salary->salary)/$hours)*$report->duration;
                    }else{
                        $user_salary = UserSalaryHistory::where('start_date','<=',$report->report_date)->where('end_date','>=',$report->report_date)->
                        whereHas('salary_id_fun',function($q) use($report){
                            $q->where('assign_to_id',$report->user_creator_id);
                        })->first();;
                        if(!empty($user_salary->id)){
                            $date_current =  Carbon::parse( $report->report_date)->format('m/d/Y');
                            $end = Carbon::create($date_current)->endOfMonth();
                            $start = Carbon::create($date_current)->startOfMonth();
                            $hours = $this->calDateRamadan($start,$end);
                            // $hours = $hours!=0?$hours : 1;
                            $salary = (($user_salary->salary)/$hours)*$report->duration;
                        }else{
                            $salary=0;
                        }
                    }

                    $report->update([
                        'report_status_id'=>2,
                        'report_status_id'=>2,
                        'manager_approve_id'=>$report->manager_approve_id,
                        'report_cost'=>$salary,

                    ]);
                    $report = AdminReport::where('id',$request->report_id)->first();
                    $user_details = User::where('id',$report->user_creator_id)->first();
                    $manager = AdminReport::where('manager_approve_id',$report->manager_approve_id)->where('report_status_id','<>',3)->
                    where('report_status_id','<>',2)->get()->count();
                    $dev = AdminReport::where('user_creator_id',$report->user_creator_id)->where('report_status_id','<>',3)->
                    where('report_status_id','<>',2)->get()->count();
                    try{
                        $msg = array(
                            'pendingReport'=>$manager
                        );
                        MessageController::updatedatafirebase($report->manager_approve_id,$msg);
                     }catch(\Exception $e){}
    
                    try{
                        $msg = array(
                            'devPendingReports'=>$dev
                        );
                        MessageController::updatedatafirebase($report->user_creator_id,$msg);
                     }catch(\Exception $e){}
                    try{
                        $this->ApprovalSendNotification(Auth::guard('user_api')->user(),$user_details,$report);
                        }catch(\Exception $e){
                            
                        }
                        return ResponseApi::acceptedResponseApi(["message"=>"Update Success"],"success",201);
                }
               
            }else{
                if(!empty($request->reject_reason)){
                    $validator = Validator::make($request->all(), [
                        'reject_reason'=>'required|string',
                        'reject_date' => 'required|date',
    
                       ]);
                   if ($validator->fails()) {
           
                       return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                   }
    
                   $reportReject = AdminReportReject::create([
                    'report_id'=>$request->report_id,
                    'manager_reject_id'=>Auth::guard('user_api')->user()->id,
                    'reject_reason'=>$request->reject_reason,
                    'reject_date'=>Carbon::createFromFormat('m/d/Y', $request-> reject_date),
                   ]);
                   if(!empty($reportReject)){
                        $report->update([
                            'report_status_id'=>3,
                    ]);
                    $report = AdminReport::where('id',$request->report_id)->first();
                    $manager = AdminReport::where('manager_approve_id',$report->manager_approve_id)->where('report_status_id','<>',3)->
                    where('report_status_id','<>',2)->get()->count();
                    $dev = AdminReport::where('user_creator_id',$report->user_creator_id)->where('report_status_id','<>',3)->
                    where('report_status_id','<>',2)->get()->count();
                    $dev_r = AdminReport::where('user_creator_id',$report->user_creator_id)->where('report_status_id',3)->get()->count();
                    try{
                        $msg = array(
                            'pendingReport'=>$manager
                        );
                        MessageController::updatedatafirebase($report->manager_approve_id,$msg);
                     }catch(\Exception $e){}
    
                    try{
                        $msg = array(
                            'devPendingReports'=>$dev,
                            'rejectedReport'=>$dev_r
                        );
                        MessageController::updatedatafirebase($report->user_creator_id,$msg);
                     }catch(\Exception $e){}
                    $user_details = User::where('id',$report->user_creator_id)->first();
                    try{
                        $this->ApprovalSendNotification(Auth::guard('user_api')->user(),$user_details,$report);
                        }catch(\Exception $e){
                            
                        }
                        return ResponseApi::acceptedResponseApi(["message"=>"Update Success"],"success",201);
    
                   }else{
                    return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
    
                   }
    
                
                }
            }
            


           
        
            

        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
    }

    
    public function reportparsearray(AdminReport $report){
        $reject_report = AdminReportReject::where('report_id',$report->id)->orderBy('created_at','desc')->first();
        $edit_manager_report = AdminReportManagerEdit::where('report_id',$report->id)->orderBy('created_at','desc')->first();
    //    $edit_senior_report = ReportSeniorEdit::where('report_id',$report->id)->orderBy('created_at','desc')->first();
        $array_reponse = [ 
            'id'=>$report->id."",
            'devID'=>$report->user_creator_id,
            'devName'=>$report->user_creator_id_fun->username,
            'devImgURL'=> $report->user_creator_id_fun->photoURL?'/Attachments/User/'.$report->user_creator_id.'/profile'.'/'.$report->user_creator_id_fun->photoURL:null,
            'report_date'=> Carbon::parse( $report->report_date)->format('m/d/Y') ,
            'duration'=>(float)$report->duration,
            'report_type_id'=>$report->report_type_id,
            'report_type_name'=>$report->report_type_id_fun->report_type,
            'task_id'=>$report->task_id,
            'task_name'=>$report->task_id?$report->task_id_fun->task_title : null,
             'report_details'=>$report->report_details,
            'report_progress'=>(float)$report->report_progress,
            'approved'=>$report->report_status_id == 2? true : false,
            'rejected'=>$report->report_status_id == 3? true : false,

            'approvedByKey'=>$report->report_status_id == 2||$report->report_status_id == 3? $report->manager_approve_id : null,
            'approvedByName'=>$report->report_status_id == 2||$report->report_status_id == 3? $report->manager_approve_id_fun->username : null,
            
            'rejectionReason'=> $reject_report? $reject_report->reject_reason : null,
            'createdAt'=> $report->created_at,
            'updatedAt'=>  $report->updated_at ,
            'preApprovedDuration'=>$edit_manager_report? (float) $edit_manager_report->old_duration : (float)$report->duration,
            'managerChangeDurationComment'=>$edit_manager_report?$edit_manager_report->comment:null,
            'report_status_id'=>$report->report_status_id,
            'report_status_name'=>$report->report_status_id_fun->report_status_name,


            'manager_approve_id'=> $report->report_status_id !=4 ? $report->manager_approve_id : null,
            'manager_approve_name'=> $report->report_status_id !=4 ? $report->manager_approve_id_fun->username : null,
            

            // 'seniorToApproveKey'=>$edit_senior_report? $edit_senior_report->senior_edit_id: ($report->report_status_id ==4 ? $report->manager_approve_id : null),
            // 'seniorToApproveName'=>$edit_senior_report? $edit_senior_report->senior_edit_id_fun->username: ($report->report_status_id ==4 ? $report->manager_approve_id_fun->username : null),
            
            // 'seniorDecision'=>$edit_senior_report? ($report->report_status_id==1?true : ($report->report_status_id==3?false:null)) :null,
            // 'seniorDecisionKey'=>$edit_senior_report? $edit_senior_report->senior_edit_id :null,
            // 'seniorDecisionName'=>$edit_senior_report? $edit_senior_report->senior_edit_id_fun->username :null,
            // 'seniorDecisionAt'=>$edit_senior_report? $edit_senior_report->created_at :null,
            // 'seniorDecisionComment'=>$edit_senior_report? $edit_senior_report->comment :null,
            
  
        ];
        return $array_reponse;
    }
    
    public function GetAdminReport (Request $request){
       try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'user_id'=>'required|numeric|exists:users,id',
                 'start_date'=>'required|date',
                 'end_date'=>'required|date'
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            $start_date = Carbon::createFromFormat('m/d/Y', $request-> start_date);;
            $end_date =Carbon::createFromFormat('m/d/Y', $request-> end_date);;
            
            $techReport=  AdminReport::where('user_creator_id',$request->user_id)->whereDate('report_date','>=',$start_date)->whereDate('report_date','<=',$end_date)->get();


            if(!empty($techReport[0]->id))
            {
            foreach($techReport as $report){
                if(!empty($report->id) ){
                    $array_reponse[] =$this->reportparsearray($report);
                }
            }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
        }else{
            return ResponseApi::badMethodErrorResponse(["message"=>"Empty Report"],"Empty",200);

        }
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
    }
    public function GetManagerAdminReport (Request $request){
        try{
             $validator = Validator::make($request->all(), [
                  'token'=>'required|string',
                  'user_id'=>'required|numeric|exists:users,id',
                  'start_date'=>'required|date',
                  'end_date'=>'required|date'
                 ]);
             if ($validator->fails()) {
     
                 return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }
             $start_date = Carbon::createFromFormat('m/d/Y', $request-> start_date);
             $end_date =Carbon::createFromFormat('m/d/Y', $request-> end_date);
             
             $techReport=  AdminReport::where('user_creator_id',$request->user_id)->whereDate('report_date','>=',$start_date)
             ->where('report_status_id','<>',1)->where('report_status_id','<>',4)->whereDate('report_date','<=',$end_date)->get();
 
 
             if(!empty($techReport[0]->id))
             {
             foreach($techReport as $report){
                 if(!empty($report->id)){
                     $array_reponse[] =$this->reportparsearray($report);
                 }
             }
             return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
         }else{
             return ResponseApi::badMethodErrorResponse(["message"=>"Empty Report"],"Empty",200);
 
           }
        
          
         }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
     }
    public function GetAdminReportPending(Request $request){
        try{
             $validator = Validator::make($request->all(), [
                  'token'=>'required|string',
                 ]);
             if ($validator->fails()) {
     
                 return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }
             
             $techReport=  AdminReport::where('report_status_id',1)->orWhere('report_status_id',4)->get();
 
 
             if(!empty($techReport[0]->id))
             {
             foreach($techReport as $report){
                 if(!empty($report->id)){
                     $array_reponse[] =$this->reportparsearray($report);
                 }
             }
             return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
         }else{
             return ResponseApi::badMethodErrorResponse(["message"=>"Empty Report"],"Empty",200);
 
           }
           
         }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
 
     }


     public function GetMyAdminReportPending(Request $request){
        try{
             $validator = Validator::make($request->all(), [
                  'token'=>'required|string',
                  'user_id'=>'required|numeric|exists:users,id'
                 ]);
             if ($validator->fails()) {
     
                 return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }
             
             $techReport= AdminReport::where('manager_approve_id',$request->user_id)->where('report_status_id',1)->orWhere('report_status_id',4)->where('manager_approve_id',$request->user_id)->get();
 
             if(!empty($techReport[0]->id))
             {
             foreach($techReport as $report){
                 if(!empty($report->id)){
                     $array_reponse[] =$this->reportparsearray($report);
                 }
             }
             return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
         }else{
             return ResponseApi::badMethodErrorResponse(["message"=>"Empty Report"],"Empty",200);
 
           }
           
         }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
 
     }
     public function GetMyReportPendingDev(Request $request){
        try{
             $validator = Validator::make($request->all(), [
                  'token'=>'required|string',
                  'user_id'=>'required|numeric|exists:users,id'
                 ]);
             if ($validator->fails()) {
     
                 return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }
             
             $techReport= AdminReport::where('user_creator_id',$request->user_id)->where('report_status_id',1)->orWhere('report_status_id',4)->where('user_creator_id',$request->user_id)->get();
 
             if(!empty($techReport[0]->id))
             {
             foreach($techReport as $report){
                 if(!empty($report->id)){
                     $array_reponse[] =$this->reportparsearray($report);
                 }
             }
             return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
         }else{
             return ResponseApi::badMethodErrorResponse(["message"=>"Empty Report"],"Empty",200);
 
           }
           
         }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
 
     }
     public function GetMyReportRejectedAdmin(Request $request){
        try{
             $validator = Validator::make($request->all(), [
                  'token'=>'required|string',
                  'user_id'=>'required|numeric|exists:users,id'
                 ]);
             if ($validator->fails()) {
     
                 return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }
             
             $techReport= AdminReport::where('user_creator_id',$request->user_id)->where('report_status_id',3)->get();
 
             if(!empty($techReport[0]->id))
             {
             foreach($techReport as $report){
                 if(!empty($report->id)){
                     $array_reponse[] =$this->reportparsearray($report);
                 }
             }
             return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
         }else{
             return ResponseApi::badMethodErrorResponse(["message"=>"Empty Report"],"Empty",200);
 
           }
           
         }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
 
     }

    //  public function TechSeniorAction(Request $request){
    //    try{
    //         $validator = Validator::make($request->all(), [
    //              'token'=>'required|string',
    //              'report_id'=>'required|numeric|exists:admin_reports,id',
    //              'approved'=>'required|boolean',
    //             ]);
    //         if ($validator->fails()) {
    
    //             return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
    //         }
    //         $report = AdminReport::where('id',$request->report_id)->first();

    //         if($request->approved == true){
    //             if(!empty($request->comment)){
    //                 $validator = Validator::make($request->all(), [
    //                     'comment'=>'string',
    //                     'manager_approve_id'=>'numeric|exists:users,id'
    //                    ]);
    //                if ($validator->fails()) {
           
    //                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
    //                }
    //             }

    //                $mangeredit = ReportSeniorEdit::create([
    //                 'report_id'=>$request->report_id,
    //                 'senior_edit_id'=>Auth::guard('user_api')->user()->id,
    //                 'comment'=>!empty($request->comment)?$request->comment:" ",
    //                ]);

    //                if(!empty($mangeredit)){
    //                     $report->update([
    //                         'report_status_id'=>1,
    //                         'manager_approve_id'=>$request->manager_approve_id,
    //                 ]);
    //                 $report = AdminReport::where('id',$mangeredit->report_id)->first();
    //                 $manager = AdminReport::where('manager_approve_id',$report->manager_approve_id)->where('report_status_id','<>',3)->
    //                 where('report_status_id','<>',2)->get()->count();
    //                 $dev = AdminReport::where('user_creator_id',$report->user_creator_id)->where('report_status_id','<>',3)->
    //                 where('report_status_id','<>',2)->get()->count();
    //                 $senior = AdminReport::where('manager_approve_id',$mangeredit->senior_edit_id)->where('report_status_id','<>',3)->
    //                 where('report_status_id','<>',2)->get()->count();

    //                 try{
    //                     $msg = array(
    //                         'pendingReport'=>$manager
    //                     );
    //                     MessageController::updatedatafirebase($report->manager_approve_id,$msg);
    //                  }catch(\Exception $e){}
    
    //                 try{
    //                     $msg = array(
    //                         'devPendingReports'=>$dev
    //                     );
    //                     MessageController::updatedatafirebase($report->user_creator_id,$msg);
    //                  }catch(\Exception $e){}

                     
    //                  try{
    //                     $msg = array(
    //                         'pendingReport'=>$senior
    //                     );
    //                     MessageController::updatedatafirebase($mangeredit->senior_edit_id,$msg);
    //                  }catch(\Exception $e){}

    //                 return ResponseApi::acceptedResponseApi(["message"=>"Update Success"],"success",201);
    
    //                }else{
    //                 return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
    
    //                }
                
    //         }else{
    //             if(!empty($request->comment)){
    //                 $validator = Validator::make($request->all(), [
    //                     'comment'=>'required|string',
    
    //                    ]);
    //                if ($validator->fails()) {
           
    //                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
    //                }
    
    //                $mangeredit = ReportSeniorEdit::create([
    //                 'report_id'=>$request->report_id,
    //                 'senior_edit_id'=>Auth::guard('user_api')->user()->id,
    //                 'comment'=>$request->comment,
    //                ]);
    //                if(!empty($mangeredit)){
    //                     $report->update([
    //                         'report_status_id'=>3,

    //                 ]);

    //                 $report = AdminReport::where('id',$mangeredit->report_id)->first();
    //                 $manager = AdminReport::where('manager_approve_id',$report->manager_approve_id)->where('report_status_id','<>',3)->
    //                 where('report_status_id','<>',2)->get()->count();
    //                 $dev = AdminReport::where('user_creator_id',$report->user_creator_id)->where('report_status_id','<>',3)->
    //                 where('report_status_id','<>',2)->get()->count();
    //                 $senior = AdminReport::where('manager_approve_id',$mangeredit->senior_edit_id)->where('report_status_id','<>',3)->
    //                 where('report_status_id','<>',2)->get()->count();
    //                 $dev_r = AdminReport::where('user_creator_id',$report->user_creator_id)->where('report_status_id',3)->get()->count();
    //                 try{
    //                     $msg = array(
    //                         'pendingReport'=>$manager
    //                     );
    //                     MessageController::updatedatafirebase($report->manager_approve_id,$msg);
    //                  }catch(\Exception $e){}
    
    //                 try{
    //                     $msg = array(
    //                         'devPendingReports'=>$dev,
    //                         'rejectedReport'=>$dev_r
    //                     );
    //                     MessageController::updatedatafirebase($report->user_creator_id,$msg);
    //                  }catch(\Exception $e){}

    //                  try{
    //                     $msg = array(
    //                         'pendingReport'=>$senior
    //                     );
    //                     MessageController::updatedatafirebase($mangeredit->senior_edit_id,$msg);
    //                  }catch(\Exception $e){}
    //                  $user_details = User::where('id',$report->user_creator_id)->first();
    //                  try{
    //                      $this->ApprovalSendNotification(Auth::guard('user_api')->user(),$user_details,$report);
    //                      }catch(\Exception $e){
                             
    //                      }

    //                 return ResponseApi::acceptedResponseApi(["message"=>"Update Success"],"success",201);
    
    //                }else{
    //                 return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
    
    //                }
    
    //             }else{
    //                 return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
    
    //                }
            
    //         }
            

    //     }catch(\Exception $e){
    //         return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

    //     }
    //  }

    
    
    public function ReturnReportToPending(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'report_id'=>'required|numeric|exists:admin_reports,id',
                  ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            $report = AdminReport::where('id',$request->report_id)->first();
            if(!empty($report->id)){
                $report->update([
                    'report_status_id'=>1,
                    'report_cost'=>null,
                ]);
                $report = AdminReport::where('id',$request->report_id)->first();


                    $manager = AdminReport::where('manager_approve_id',$report->manager_approve_id)->where('report_status_id','<>',3)->
                    where('report_status_id','<>',2)->get()->count();
                    $dev = AdminReport::where('user_creator_id',$report->user_creator_id)->where('report_status_id','<>',3)->
                    where('report_status_id','<>',2)->get()->count();
                    $dev_r = AdminReport::where('user_creator_id',$report->user_creator_id)->where('report_status_id',3)->get()->count();

                    try{
                        $msg = array(
                            'pendingReport'=>$manager
                        );
                        MessageController::updatedatafirebase($report->manager_approve_id,$msg);
                     }catch(\Exception $e){}
    
                    try{
                        $msg = array(
                            'devPendingReports'=>$dev,
                            'rejectedReport'=>$dev_r

                        );
                        MessageController::updatedatafirebase($report->user_creator_id,$msg);
                     }catch(\Exception $e){}




                   
                    return ResponseApi::acceptedResponseApi(["message"=>"Success"],"Success",201);

            }else{
                return ResponseApi::acceptedResponseApi(["message"=>"Empty Report"],"Empty",200);

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
     * @param  \App\Models\AdminReport  $adminReport
     * @return \Illuminate\Http\Response
     */
    public function show(AdminReport $adminReport)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\AdminReport  $adminReport
     * @return \Illuminate\Http\Response
     */
    public function edit(AdminReport $adminReport)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\AdminReport  $adminReport
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, AdminReport $adminReport)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\AdminReport  $adminReport
     * @return \Illuminate\Http\Response
     */
    public function destroy(AdminReport $adminReport)
    {
        //
    }
}
