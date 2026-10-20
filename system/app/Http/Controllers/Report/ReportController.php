<?php

namespace App\Http\Controllers\Report;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use App\Models\ReportStatus;
use App\Models\ReportType;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Models\Report;
use App\Models\User;
use App\Models\Task;
use App\Models\ReportManagerEdit;
use App\Models\ReportReject;
use App\Models\ReportSeniorEdit;
use App\Http\Controllers\ApiMessage\MessageController;
use App\Models\UserSalary;
use DatePeriod;
use DateInterval;
use App\Models\UserSalaryHistory;
use App\Models\WorkHoursConfig;
use App\Models\UserPermissionGroup;
use App\Models\Ticket;


class ReportController extends Controller
{
    public function ApprovalSendNotification(User $user1 , User $user2,Report $report){
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

    public function ReCalculateProjectCost(Request $request){
       // try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'project_id'=>'required|numeric|exists:projects,id',

                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            $reports = Report::whereHas('process_id_fun',function($q) use($request){
                    $q->where('project_id',$request->project_id);
            })->get();
        //    return $reports;
            if(!empty($reports[0]->id)){
                foreach ($reports as $value) {
                  
                    $user_salary = UserSalary:: where('assign_to_id',$value->user_creator_id)->where('start_date','<=',$value->report_date)->first();
                    $salary =0; 

                    if(!empty($user_salary->id)){ 
                        $date_current = Carbon::parse( $value->report_date)->format('m/d/Y');
                        $end = Carbon::create($date_current)->endOfMonth();
                        $start = Carbon::create($date_current)->startOfMonth();
                        $hours = $this->calDateRamadan($start,$end);
                        // $hours = $hours!=0?$hours : 1;
                        $salary = (($user_salary->salary)/$hours)*$value->duration;                   
                    }else{
                        $user_salary = UserSalaryHistory::where('start_date','<=',$value->report_date)->where('end_date','>=',$value->report_date)
                         ->whereHas('salary_id_fun',function($q) use($value){
                            $q->where('assign_to_id',$value->user_creator_id);
                        })->first();                     

                        if(!empty($user_salary->id)){  
                            $date_current = Carbon::parse( $value->report_date)->format('m/d/Y');
                            $end = Carbon::create($date_current)->endOfMonth(); 
                            $start = Carbon::create($date_current)->startOfMonth();
                            $hours = $this->calDateRamadan($start,$end);
                            // $hours = $hours!=0?$hours : 1;
                            $salary = (($user_salary->salary)/$hours)*$value->duration;
                        }else{    
                            $salary=0;
                        }
                    }
                        $value->update([
                            'report_cost'=>$salary,
                        ]); 

                }
            }
            // return ResponseApi::acceptedResponseApi("aa","success",201);
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
    }

    public function CreateTechReport(Request $request){
       try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'report_type_id'=>'required|numeric|exists:report_types,id',
                 'manager_approve_id'=>'required|numeric|exists:users,id',
                 'report_details'=>'required|string',
                 'report_date' => 'required|date',
                 'report_status_id'=>'required|numeric|exists:report_statuses,id'

                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            $ticket_id =null;

            if($request->report_type_id==1){
                $validator = Validator::make($request->all(), [
                    'task_id'=>'required|numeric|exists:tasks,id',
                    'duration'=>'required|numeric',
                    'progress'=>'required|numeric',
                   ]);
               if ($validator->fails()) {
       
                   return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
               }

               $duration = $request->duration;
               $progress = $request->progress;
               $task_id = $request->task_id;
               $process_id = Task::where('id',$request->task_id)->first() ? Task::where('id',$request->task_id)->first()->process_id:15;

            }elseif($request->report_type_id==2){
                $validator = Validator::make($request->all(), [
                    'task_id'=>'numeric|exists:tasks,id',
                    'duration'=>'required|numeric',
                    'process_id'=>'numeric|exists:processes,id',
                   ]);
               if ($validator->fails()) {
       
                   return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
               }

               $duration = $request->duration;
               $progress = 0;
               $task_id = $request->task_id?$request->task_id : null;
               $process_id = $request->process_id?$request->process_id: Task::where('id',$request->task_id)->first()->process_id;

            
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
            $process_id = 15;

            }else if($request->report_type_id==4||$request->report_type_id==5){
                    $validator = Validator::make($request->all(), [
                    'process_id'=>'required|numeric|exists:processes,id',
                    'duration'=>'required|numeric',
                   ]);
               if ($validator->fails()) {
       
                   return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
               }
                   
               $duration = $request->duration;
               $progress = 0;
               $task_id = $request->task_id?$request->task_id : null;
               $process_id = $request->process_id;
       

            }else if($request->report_type_id==6||$request->report_type_id==7){
                
               
                    
                $duration = $request->duration;
                $progress = 0;
                $task_id = $request->task_id?$request->task_id : null;
                $process_id = 15;
        

                }else if($request->report_type_id==8){
                    // assigned ticket id validation with user report
                    $validator = Validator::make($request->all(), [
                        'ticket_id'=>'required|numeric|exists:tickets,id',
                        ]);
                   if ($validator->fails()) {
                       return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                    }
                    $ticket_for_user = Ticket::where('developer_id',Auth::guard('user_api')->user()->id)->where('id',$request->ticket_id)->first();
                    if(empty($ticket_for_user->id)){
                        return ResponseApi::acceptedResponseApi(["message"=>"This Ticket not assigned to you"],"Validator Errors",400);
                    }
                    $ticket_id = $request->ticket_id;
                    $process_id = null;
                    $task_id = null;
                    $progress = 0;
                    $duration = $request->duration;


                }else{
                      return ResponseApi::acceptedResponseApi(["message"=>"Can't add This Type of  Report"],"Validator Errors",400);

                    }

            $report = Report::create([
                'duration'=>$duration,
                'report_type_id'=>$request->report_type_id,
                'report_status_id'=>$request->report_status_id,
                'manager_approve_id'=>$request->manager_approve_id,
                'user_creator_id'=>Auth::guard('user_api')->user()->id,
                'report_details'=>$request->report_details,
                'task_id'=>$task_id,
                'process_id'=>$process_id,
                'report_progress'=>$progress,
                'ticket_id' => $ticket_id,
                'report_date'=>Carbon::createFromFormat('m/d/Y', $request->report_date),
            ]);
            if(!empty($report->id)){
                $manager = Report::where('manager_approve_id',$report->manager_approve_id)->where('report_status_id','<>',3)->
                where('report_status_id','<>',2)->get()->count();
                $dev = Report::where('user_creator_id',$report->user_creator_id)->where('report_status_id','<>',3)->
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
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
     

    }


    public function GetSupportPendingReport(Request $request){
        try{
             $validator = Validator::make($request->all(), [
                  'token'=>'required|string',
                 ]);
             if ($validator->fails()) {
     
                 return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }
             $perm = UserPermissionGroup::where('users_id',Auth::guard('user_api')->user()->id)->where('permissions_id','25')->first();

             if(Auth::guard('user_api')->user()->sub_departments_id_fun->departments_id!=1 && empty($perm->id)){
                return ResponseApi::badMethodErrorResponse(["message"=>"You Dont Have Permssion to access this api"],"Validator Errors",400);
             }
             
             $techReport=  Report::where('report_type_id',8)->whereNotIn('report_status_id',[2,3])->get();
 
 
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



    public function UpdateTechReport(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'report_type_id'=>'required|numeric|exists:report_types,id',
                 'manager_approve_id'=>'required|numeric|exists:users,id',
                 'report_details'=>'required|string',
                 'report_id'=>'required|numeric|exists:reports,id',
                 'report_date' => 'required|date',
                'report_status_id'=>'required|numeric|exists:report_statuses,id'
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            } 

            if($request->report_type_id==1){
                $validator = Validator::make($request->all(), [
                    'task_id'=>'required|numeric|exists:tasks,id',
                    'duration'=>'required|numeric',
                    'progress'=>'required|numeric',
                   ]);
               if ($validator->fails()) {
       
                   return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
               }

               $duration = $request->duration;
               $progress = $request->progress;
               $task_id = $request->task_id;
               $process_id = Task::where('id',$request->task_id)->first() ? Task::where('id',$request->task_id)->first()->process_id:15;

            }elseif($request->report_type_id==2){
                $validator = Validator::make($request->all(), [
                    'task_id'=>'numeric|exists:tasks,id',
                    'duration'=>'required|numeric',
                    'process_id'=>'numeric|exists:processes,id',
                   ]);
               if ($validator->fails()) {
       
                   return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
               }

               $duration = $request->duration;
               $progress = 0;
               $task_id = $request->task_id?$request->task_id : null;
               $process_id = Task::where('id',$request->task_id)->first() ? Task::where('id',$request->task_id)->first()->process_id:15;

            
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
            $process_id = Task::where('id',$request->task_id)->first() ? Task::where('id',$request->task_id)->first()->process_id:15;

            }else if($request->report_type_id==4||$request->report_type_id==5){
                    $validator = Validator::make($request->all(), [
                    'process_id'=>'required|numeric|exists:processes,id',
                    'duration'=>'required|numeric',
                   ]);
               if ($validator->fails()) {
       
                   return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
               }
                   
               $duration = $request->duration;
               $progress = 0;
               $task_id = $request->task_id?$request->task_id : null;
               $process_id = $request->process_id;
       

            }else if($request->report_type_id==8){
                $validator=Validator::make($request->all(),[
                
                    'duration'=>'required|numeric']);
                    if($validator->fails()){
                        return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validation Errors",400);
                    }
                    $duration =$request->duration;
                    $progress=0;
                    $task_id = $request->task_id?$request->task_id: null;
                    $process_id=$request->process_id;
            }
            else{
              
                return ResponseApi::acceptedResponseApi(["message"=>"Can't find this report type"],"Validator Errors",400);
            }


            $report = Report::where('id',$request->report_id)->first();
            $report ->update([
                'duration'=>$duration,
                'report_type_id'=>$request->report_type_id,
                'report_status_id'=>$request->report_status_id,
                'manager_approve_id'=>$request->manager_approve_id,
                'user_creator_id'=>Auth::guard('user_api')->user()->id,
                'report_details'=>$request->report_details,
                'task_id'=>$task_id,
                'process_id'=>$process_id,
                'report_progress'=>$progress,
                'report_date'=>Carbon::createFromFormat('m/d/Y', $request->report_date),
            ]);
            $report = Report::where('id',$request->report_id)->first();
            $manager = Report::where('manager_approve_id',$report->manager_approve_id)->where('report_status_id','<>',3)->
            where('report_status_id','<>',2)->get()->count();
            $dev = Report::where('user_creator_id',$report->user_creator_id)->where('report_status_id','<>',3)->
            where('report_status_id','<>',2)->get()->count();
            $dev_r = Report::where('user_creator_id',$report->user_creator_id)->where('report_status_id',3)->get()->count();
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
 

    public function DeleteTechReport(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'report_id'=>'required|numeric|exists:reports,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            $report=  Report::where('id',$request->report_id)->first();
            if(!empty($report->id)){
              $manager2 = $report->manager_approve_id;
              $dev2 = $report ->user_creator_id;

            if($report->report_status_id==1||$report->report_status_id==4){
                try{
                    $reject_report =   ReportReject::where('report_id',$report->id)->first();
                    if(!empty($reject_report->id)){
                      return ResponseApi::acceptedResponseApi(["message"=>"Stop Sheeting You Trying To delete rejected Report"],"success",400);
                    }
                    $report->forceDelete();
                    }catch(\Exception $e){
                    
                    }

                $manager = Report::where('manager_approve_id',$manager2)->where('report_status_id','<>',3)->
                where('report_status_id','<>',2)->get()->count();
                $dev = Report::where('user_creator_id',$dev2)->where('report_status_id','<>',3)->
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

    
    public function ForceApproveAllPendingReports(Request $request){
        //try{
             $validator = Validator::make($request->all(), [
                  'token'=>'required|string',
                   ]);
                   if ($validator->fails()) {
     
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
                   if(Auth::guard('user_api')->user()->sub_departments_id_fun->departments_id==1){

                    $reports=  Report::whereIn('report_status_id',[1,4])->get();
                
                    foreach ($reports as $report) {
                        try{
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
                        $manager_approve_id = $report->manager_approve_id;
                        $report->update([
                            'report_status_id'=>2,
                            'report_status_id'=>2,
                            'manager_approve_id'=>Auth::guard('user_api')->user()->id,
                            'report_cost'=>$salary,
    
                        ]);
                        $report = Report::where('id',$request->report_id)->first();
                        $user_details = User::where('id',$report->user_creator_id)->first();
                        $manager = Report::where('manager_approve_id',$manager_approve_id)->where('report_status_id','<>',3)->
                        where('report_status_id','<>',2)->get()->count();
                        $dev = Report::where('user_creator_id',$report->user_creator_id)->where('report_status_id','<>',3)->
                        where('report_status_id','<>',2)->get()->count();
                        try{
                            $msg = array(
                                'pendingReport'=>$manager
                            );
                            MessageController::updatedatafirebase($manager_approve_id,$msg);
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
                        }catch(\Exception $e){
                                
                        }
                    }

                    return ResponseApi::acceptedResponseApi(["message"=>"Update Success"],"success",201);

                   }else{
                    return ResponseApi::badMethodErrorResponse(["message"=>"you cant proceed with this action because you are not a manager"],"Validator Errors",400);

                   }
          
 
            
         
             
 
         // }catch(\Exception $e){
         //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         // }
     }


    public function ApproveAllPendingReports(Request $request){
        //try{
             $validator = Validator::make($request->all(), [
                  'token'=>'required|string',
                   ]);
                   if ($validator->fails()) {
     
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
                   if(Auth::guard('user_api')->user()->sub_departments_id!=null &&Auth::guard('user_api')->user()->sub_departments_id_fun->departments_id==1){

                    $reports=  Report::whereIn('report_status_id',[1,4])->where('manager_approve_id',Auth::guard('user_api')->user()->id)->get();
                
                    foreach ($reports as $report) {
                        try{
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
                        $report = Report::where('id',$request->report_id)->first();
                        $user_details = User::where('id',$report->user_creator_id)->first();
                        $manager = Report::where('manager_approve_id',$report->manager_approve_id)->where('report_status_id','<>',3)->
                        where('report_status_id','<>',2)->get()->count();
                        $dev = Report::where('user_creator_id',$report->user_creator_id)->where('report_status_id','<>',3)->
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
                        }catch(\Exception $e){
                                
                        }
                    }

                    return ResponseApi::acceptedResponseApi(["message"=>"Update Success"],"success",201);

                   }else{
                    return ResponseApi::badMethodErrorResponse(["message"=>"you cant proceed with this action because you are not a manager"],"Validator Errors",400);

                   }
          
 
            
         
             
 
         // }catch(\Exception $e){
         //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         // }
     }


    public function TechManagerAction(Request $request){
       //try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'report_id'=>'required|numeric|exists:reports,id',
                 'approved'=>'required|boolean'
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            $perm = UserPermissionGroup::where('users_id',Auth::guard('user_api')->user()->id)->where('permissions_id','25')->first();
            $report = Report::where('id',$request->report_id)->first();

            if(Auth::guard('user_api')->user()->sub_departments_id_fun->departments_id!=1 && empty($perm->id) && $report->manager_approve_id!=Auth::guard('user_api')->user()->id){
               return ResponseApi::badMethodErrorResponse(["message"=>"You Dont Have Permssion to access this api"],"Validator Errors",400);
            }

            
            if($request->approved == true){
                if(!empty($request->duration_reason)){
                    $validator = Validator::make($request->all(), [
                        'duration_reason'=>'required|string',
                        'duration'=>'required|numeric',
                       ]);
                   if ($validator->fails()) {
           
                       return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                   }
                  
                   $mangeredit = ReportManagerEdit::create([
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

                    $report = Report::where('id',$request->report_id)->first();
                    $manager = Report::where('manager_approve_id',$report->manager_approve_id)->where('report_status_id','<>',3)->
                    where('report_status_id','<>',2)->get()->count();
                    $dev = Report::where('user_creator_id',$report->user_creator_id)->where('report_status_id','<>',3)->
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
                    $report = Report::where('id',$request->report_id)->first();
                    $user_details = User::where('id',$report->user_creator_id)->first();
                    $manager = Report::where('manager_approve_id',$report->manager_approve_id)->where('report_status_id','<>',3)->
                    where('report_status_id','<>',2)->get()->count();
                    $dev = Report::where('user_creator_id',$report->user_creator_id)->where('report_status_id','<>',3)->
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
    
                   $reportReject = ReportReject::create([
                    'report_id'=>$request->report_id,
                    'manager_reject_id'=>Auth::guard('user_api')->user()->id,
                    'reject_reason'=>$request->reject_reason,
                    'reject_date'=>Carbon::createFromFormat('m/d/Y', $request-> reject_date),
                   ]);
                   if(!empty($reportReject)){
                        $report->update([
                            'report_status_id'=>3,
                    ]);
                    $report = Report::where('id',$request->report_id)->first();
                    $manager = Report::where('manager_approve_id',$report->manager_approve_id)->where('report_status_id','<>',3)->
                    where('report_status_id','<>',2)->get()->count();
                    $dev = Report::where('user_creator_id',$report->user_creator_id)->where('report_status_id','<>',3)->
                    where('report_status_id','<>',2)->get()->count();
                    $dev_r = Report::where('user_creator_id',$report->user_creator_id)->where('report_status_id',3)->get()->count();
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
            


           
        
            

        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
    }

    
    public function reportparsearray(Report $report){
        $deleted_task =Task::where('id',$report->task_id)->withTrashed()->first();
        $reject_report = ReportReject::where('report_id',$report->id)->orderBy('created_at','desc')->first();
        $edit_manager_report = ReportManagerEdit::where('report_id',$report->id)->orderBy('created_at','desc')->first();
        $edit_senior_report = ReportSeniorEdit::where('report_id',$report->id)->orderBy('created_at','desc')->first();
        $ticket = Ticket::where('id',$report->ticket_id)->first();

        $array_reponse = [ 
            'key'=>$report->id."",
            'devID'=>$report->user_creator_id,
            'devName'=>$report->user_creator_id_fun->username,
            'devImgURL'=> $report->user_creator_id_fun->photoURL?'/Attachments/User/'.$report->user_creator_id.'/profile'.'/'.$report->user_creator_id_fun->photoURL:null,
            'reportDate'=> Carbon::parse( $report->report_date)->format('m/d/Y') ,
            'durationByHours'=>(float)$report->duration,
            'time_activity'=>$report->report_type_id,
            'time_activity_name'=>$report->report_type_id_fun->report_type,
            'taskID'=>$report->task_id,
            'taskTitle'=>!empty($report->task_id_fun)?$report->task_id_fun->task_title : (!empty( $deleted_task)? $deleted_task->task_title."(Deleted Task)":null),
            'projectID'=>!empty($report->process_id_fun->project_id)? $report->process_id_fun->project_id:null,
            'projectName'=>!empty($report->process_id_fun->project_id)? $report->process_id_fun->project_id_fun->project_title:null,
            'processID'=>!empty($report->process_id_fun->project_id)? $report->process_id:null,
            'processName'=>!empty($report->process_id_fun->project_id)? $report->process_id_fun->process_title:null,
            'ticket_id'=>!empty($ticket->id)?$ticket->id : null,
            'ticket_title'=>!empty($ticket->id)?$ticket->ticket_title : null,
            'contract_support_id'=>!empty($ticket->id)?$ticket->contract_support_id : null,
            'partner_id'=>!empty($ticket->id)&&!empty($ticket->contract_support_id_fun)?$ticket->contract_support_id_fun->partner_id : null,
            'partner_name'=>!empty($ticket->id)&&!empty($ticket->contract_support_id_fun)&&!empty($ticket->contract_support_id_fun->partner_id)?$ticket->contract_support_id_fun->partner_id_fun->partner_name : null,
            'ticket_number'=>!empty($ticket->ticket_number)?$ticket->ticket_number : null,
 
            'details'=>$report->report_details,
            'progress'=>(float)$report->report_progress,
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


            'managerApprovalKey'=> $report->report_status_id !=4 ? $report->manager_approve_id : null,
            'managerApprovalname'=> $report->report_status_id !=4 ? $report->manager_approve_id_fun->username : null,
            'seniorToApproveKey'=>$edit_senior_report? $edit_senior_report->senior_edit_id: ($report->report_status_id ==4 ? $report->manager_approve_id : null),
            'seniorToApproveName'=>$edit_senior_report? $edit_senior_report->senior_edit_id_fun->username: ($report->report_status_id ==4 ? $report->manager_approve_id_fun->username : null),
            
            'seniorDecision'=>$edit_senior_report? ($report->report_status_id==1?true : ($report->report_status_id==3?false:null)) :null,
            'seniorDecisionKey'=>$edit_senior_report? $edit_senior_report->senior_edit_id :null,
            'seniorDecisionName'=>$edit_senior_report? $edit_senior_report->senior_edit_id_fun->username :null,
            'seniorDecisionAt'=>$edit_senior_report? $edit_senior_report->created_at :null,
            'seniorDecisionComment'=>$edit_senior_report? $edit_senior_report->comment :null,
            
  
        ];
        return $array_reponse;
    }
    
    public function GetReport (Request $request){
      // try{
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
            
            $techReport=  Report::where('user_creator_id',$request->user_id)
            ->whereDate('report_date','>=',$start_date)->whereDate('report_date','<=',$end_date)->get();

        
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
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
    }
    public function GetManagerDevReport (Request $request){
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
             
             $techReport=  Report::where('user_creator_id',$request->user_id)->whereDate('report_date','>=',$start_date)
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
    public function GetReportPending(Request $request){
        try{
             $validator = Validator::make($request->all(), [
                  'token'=>'required|string',
                 ]);
             if ($validator->fails()) {
     
                 return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }
             
             $techReport=  Report::where('report_status_id',1)->orWhere('report_status_id',4)->get();
 
 
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


     public function GetMyReportPending(Request $request){
        try{
             $validator = Validator::make($request->all(), [
                  'token'=>'required|string',
                  'user_id'=>'required|numeric|exists:users,id'
                 ]);
             if ($validator->fails()) {
     
                 return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }
             
             $techReport= Report::where('manager_approve_id',$request->user_id)
             ->where('report_status_id',1)->orWhere('report_status_id',4)->where('manager_approve_id',$request->user_id)->get();
 
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
             
             $techReport= Report::where('user_creator_id',$request->user_id)
             ->where('report_status_id',1)->orWhere('report_status_id',4)->where('user_creator_id',$request->user_id)->get();
 
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
     public function GetMyReportRejectedDev(Request $request){
        try{
             $validator = Validator::make($request->all(), [
                  'token'=>'required|string',
                  'user_id'=>'required|numeric|exists:users,id'
                 ]);
             if ($validator->fails()) {
     
                 return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }
             
             $techReport= Report::where('user_creator_id',$request->user_id)->where('report_status_id',3)->get();
 
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

     public function TechSeniorAction(Request $request){
     //  try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'report_id'=>'required|numeric|exists:reports,id',
                 'approved'=>'required|boolean',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            $report = Report::where('id',$request->report_id)->first();

            if($request->approved == true){
                if(!empty($request->comment)){
                    $validator = Validator::make($request->all(), [
                        'comment'=>'string',
                        'manager_approve_id'=>'numeric|exists:users,id'
                       ]);
                   if ($validator->fails()) {
           
                       return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                   }
                }

                   $mangeredit = ReportSeniorEdit::create([
                    'report_id'=>$request->report_id,
                    'senior_edit_id'=>Auth::guard('user_api')->user()->id,
                    'comment'=>!empty($request->comment)?$request->comment:" ",
                   ]);

                   if(!empty($mangeredit)){
                        $report->update([
                            'report_status_id'=>1,
                            'manager_approve_id'=>$request->manager_approve_id,
                    ]);
                    $report = Report::where('id',$mangeredit->report_id)->first();
                    $manager = Report::where('manager_approve_id',$report->manager_approve_id)->where('report_status_id','<>',3)->
                    where('report_status_id','<>',2)->get()->count();
                    $dev = Report::where('user_creator_id',$report->user_creator_id)->where('report_status_id','<>',3)->
                    where('report_status_id','<>',2)->get()->count();
                    $senior = Report::where('manager_approve_id',$mangeredit->senior_edit_id)->where('report_status_id','<>',3)->
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
                        $msg = array(
                            'pendingReport'=>$senior
                        );
                        MessageController::updatedatafirebase($mangeredit->senior_edit_id,$msg);
                     }catch(\Exception $e){}

                    return ResponseApi::acceptedResponseApi(["message"=>"Update Success"],"success",201);
    
                   }else{
                    return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
    
                   }
                
            }else{
                if(!empty($request->comment)){
                    $validator = Validator::make($request->all(), [
                        'comment'=>'required|string',
    
                       ]);
                   if ($validator->fails()) {
           
                       return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                   }
    
                   $mangeredit = ReportSeniorEdit::create([
                    'report_id'=>$request->report_id,
                    'senior_edit_id'=>Auth::guard('user_api')->user()->id,
                    'comment'=>$request->comment,
                   ]);
                   if(!empty($mangeredit)){
                        $report->update([
                            'report_status_id'=>3,

                    ]);

                    $report = Report::where('id',$mangeredit->report_id)->first();
                    $manager = Report::where('manager_approve_id',$report->manager_approve_id)->where('report_status_id','<>',3)->
                    where('report_status_id','<>',2)->get()->count();
                    $dev = Report::where('user_creator_id',$report->user_creator_id)->where('report_status_id','<>',3)->
                    where('report_status_id','<>',2)->get()->count();
                    $senior = Report::where('manager_approve_id',$mangeredit->senior_edit_id)->where('report_status_id','<>',3)->
                    where('report_status_id','<>',2)->get()->count();
                    $dev_r = Report::where('user_creator_id',$report->user_creator_id)->where('report_status_id',3)->get()->count();
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

                     try{
                        $msg = array(
                            'pendingReport'=>$senior
                        );
                        MessageController::updatedatafirebase($mangeredit->senior_edit_id,$msg);
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
                    return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
    
                   }
            
            }
            

    //     }catch(\Exception $e){
    //         return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

    //     }
     }

    
    
    public function ReturnReportToPending(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'report_id'=>'required|numeric|exists:reports,id',
                  ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            $report = Report::where('id',$request->report_id)->first();
            if(!empty($report->id)){
                $report->update([
                    'report_status_id'=>1,
                    'report_cost'=>null,
                ]);
                $report = Report::where('id',$request->report_id)->first();


                    $manager = Report::where('manager_approve_id',$report->manager_approve_id)->where('report_status_id','<>',3)->
                    where('report_status_id','<>',2)->get()->count();
                    $dev = Report::where('user_creator_id',$report->user_creator_id)->where('report_status_id','<>',3)->
                    where('report_status_id','<>',2)->get()->count();
                    $dev_r = Report::where('user_creator_id',$report->user_creator_id)->where('report_status_id',3)->get()->count();

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

    public function GetAllReportProject(Request $request){
       // try{
          $validator = Validator::make($request->all(), [
           'project_id' => 'required|numeric|exists:projects,id',
           'token'=>'required|string',
         ]);
         if ($validator->fails()) {
      
             return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
         }
      
         $reports = Report::whereHas('process_id_fun',function($q) use ($request){
          $q->where('project_id',$request->project_id);
         })->get();
         $array_reponse=[];
         if(!empty($reports[0]->id)){
      
           foreach($reports as $dep){
            $array_reponse[]= $this->reportparsearray($dep);
           }
           return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
         }else{
          return ResponseApi::acceptedResponseApi($array_reponse,"empty",200);
      
         }
        
    //   }catch(\Exception $e){
    //    return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
      
    //   }
        
    }

    public function GetAllSupportReport(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
               ]);
           if ($validator->fails()) {
   
               return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
           }
           $perm = UserPermissionGroup::where('users_id',Auth::guard('user_api')->user()->id)->where('permissions_id','25')->first();
       
        //    if(Auth::guard('user_api')->sub_departments_id!=1 && empty($perm->id)){
        //       return ResponseApi::badMethodErrorResponse(["message"=>"You Dont Have Permssion to access this api"],"Validator Errors",400);
        //    }

            if(!empty($perm->id)||Auth::guard('user_api')->user()->sub_departments_id_fun->departments_id=1){
                $reports = Report::where('report_type_id',8)->get();
            }else{
                $reports = Report::where('manager_approve_id',Auth::guard('user_api')->user()->id)
                ->where('report_type_id',8)->get();
            }
   
           $array_reponse=[];
           if(!empty($reports[0]->id)){
        
             foreach($reports as $dep){
              $array_reponse[]= $this->reportparsearray($dep);
             }
             return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
           }else{
            return ResponseApi::acceptedResponseApi($array_reponse,"empty",200);
        
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
     * @param  \App\Models\Report  $report
     * @return \Illuminate\Http\Response
     */
    public function show(Report $report)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Report  $report
     * @return \Illuminate\Http\Response
     */
    public function edit(Report $report)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Report  $report
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Report $report)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Report  $report
     * @return \Illuminate\Http\Response
     */
    public function destroy(Report $report)
    {
        //
    }
}
