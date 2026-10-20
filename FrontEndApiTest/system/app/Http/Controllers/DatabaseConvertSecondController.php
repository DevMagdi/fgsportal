<?php

namespace App\Http\Controllers;

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
use App\Models\UserDetail;
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
use Firebase\FirebaseLib;
use  App\Models\PhoneType;
use Illuminate\Support\Facades\Hash;

use App\Jobs\ClientEmail;

use App\Models\AnnounceUser;
use App\Models\Announce;
use App\Models\ProjectCostManual;
use App\Models\FamilyInformation;
use App\Models\Log;
use App\Models\UserAnnual;
use App\Models\ClientAccount;
use App\Models\Partner;
use App\Models\PermissionBalance;
use App\Models\AnnualRequest;
use App\Models\AnnualRequestAction;
use Storage;
use Illuminate\Support\Facades\File;
use Response;
use Illuminate\Support\Str;
use App\Models\AnnualRequestAttach;
use App\Models\Project;
use App\Models\ProjectTeam;
use App\Models\Process;
use App\Models\ProcessTeam;
use App\Models\TaskTeam;
use App\Models\ProcessAttach;
use App\Models\SalaryReport;
use App\Models\IncentiveStatus;
use App\Models\IncentiveRequestApproved;
use App\Models\IncentiveRequestRejected;
use App\Models\IncentiveRequest;
use App\Models\TransportationRequest;
use App\Models\TransportationRequestAccepted;
use App\Models\TransportationRequestRejected;

use App\Models\PublicRequest;
use App\Models\PublicRequestAccepted;
use App\Models\PublicRequestRejected;
use App\Models\LicenseHistory;
use App\Models\License;
use App\Models\Ticket;
use App\Models\ManagerTicketUpdate;
use App\Models\DeveloperTicketAction;
use App\Models\ContractSupport;




class DatabaseConvertSecondController extends Controller
{
    
    public function getSalary(){
        $URL =   'https://fgspmproduction-default-rtdb.firebaseio.com/amounts/.json?auth=TJIGzwSVyk9DSUWohfTHMu8tcRUp2VaIaZMXKFBD&key=AIzaSyBC14ua20Sa6zS_ZcfYYnj8ih1hDRE1Wq8';

        $TOKEN = 'AIzaSyBC14ua20Sa6zS_ZcfYYnj8ih1hDRE1Wq8';
        $headers = array
        (
            'Authorization: key='.$TOKEN,
            'Content-Type: application/json',
            'Access-Control-Allow-Origin: *'
        );
        $ch = curl_init();
        curl_setopt( $ch,CURLOPT_URL, $URL);
        curl_setopt( $ch,CURLOPT_POST, false );
        curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
        curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
        curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
        // curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) );
        $val = curl_exec($ch );
        $object_json =  json_decode($val,true);
   //   return $object_json;
     foreach ($object_json as $key => $value) {
        $salary_key=$key;
        $empKey = null;
        $salary = null;
        $applyfrom = null;
        $endedAt = null;
        $isActive = null;
        $createdAt = null;
        $createdByKey = null;
      
        if(array_key_exists('salary_key',$value)){
            $salary_key =$value['salary_key'];
        }
        if(array_key_exists('empKey',$value)){
            $empKey = $value['empKey'];
        }
        if(array_key_exists('salary',$value)){
            $salary =$value['salary'];
        }
        if(array_key_exists('applyfrom',$value)){
            $applyfrom =$value['applyfrom'];
         }
       
         if(array_key_exists('endedAt',$value)){
            $endedAt =$value['endedAt'];
         }
         if(array_key_exists('isActive',$value)){
            $isActive =$value['isActive'];
         }
         if(array_key_exists('createdAt',$value)){
             $createdAt =$value['createdAt'];
         }
         if(array_key_exists('createdByKey',$value)){
            $createdByKey =$value['createdByKey'];
         }
         
         
         $applyfrom=   str_replace('-', '/', $applyfrom);
         $endedAt=   str_replace('-', '/', $endedAt);
         $createdAt=   str_replace('-', '/', $createdAt);
         
         

         $user_id = User::where('firebasekey',$empKey)->first();
         $user_creator = User::where('firebasekey',$createdByKey)->first();

         
         try{
            $createdAt = Carbon::create($createdAt);
            
        }catch(\Exception $e){
            $c= explode('/', $createdAt);
            $ti = $c[1] .'/'.$c[0].'/'.$c[2];
            $createdAt = Carbon::create($ti);
        }
        
        try{
            $endedAt = Carbon::create($endedAt);

        }catch(\Exception $e){
            $c= explode('/', $endedAt);
            $ti = $c[1] .'/'.$c[0].'/'.$c[2];
            $endedAt = Carbon::create($ti);
        }
        try{
            $applyfrom = Carbon::create($applyfrom);
            
        }catch(\Exception $e){
            $c= explode('/', $applyfrom);
            $ti = $c[1] .'/'.$c[0].'/'.$c[2];
           $applyfrom = Carbon::create($ti);
        }
       
       // return $customerKey;
       if($isActive==true) {
        $salary_user = UserSalary::create([
            'salary'=>$salary,
            'user_creator_id'=>$user_creator->id,
            'assign_to_id'=>$user_id->id,
            'start_date'=>$applyfrom,
            'firebasekey'=>$salary_key,
            'created_at'=>$createdAt
        ]);
            
    }

    
           
}
foreach ($object_json as $key => $value) {
    $salary_key=$key;
    $empKey = null;
    $salary = null;
    $applyfrom = null;
    $endedAt = null;
    $isActive = null;
    $createdAt = null;
    $createdByKey = null;
  
    if(array_key_exists('salary_key',$value)){
        $salary_key =$value['salary_key'];
    }
    if(array_key_exists('empKey',$value)){
        $empKey = $value['empKey'];
    }
    if(array_key_exists('salary',$value)){
        $salary =$value['salary'];
    }
    if(array_key_exists('applyfrom',$value)){
        $applyfrom =$value['applyfrom'];
     }
   
     if(array_key_exists('endedAt',$value)){
        $endedAt =$value['endedAt'];
     }
     if(array_key_exists('isActive',$value)){
        $isActive =$value['isActive'];
     }
     if(array_key_exists('createdAt',$value)){
         $createdAt =$value['createdAt'];
     }
     if(array_key_exists('createdByKey',$value)){
        $createdByKey =$value['createdByKey'];
     }
     
     
     $applyfrom=   str_replace('-', '/', $applyfrom);
     $endedAt=   str_replace('-', '/', $endedAt);
     $createdAt=   str_replace('-', '/', $createdAt);
     
     

     $user_id = User::where('firebasekey',$empKey)->first();
     $user_creator = User::where('firebasekey',$createdByKey)->first();

     
     try{
        $createdAt = Carbon::create($createdAt);
        
    }catch(\Exception $e){
        $c= explode('/', $createdAt);
        $ti = $c[1] .'/'.$c[0].'/'.$c[2];
        $createdAt = Carbon::create($ti);
    }
    
    try{
        $endedAt = Carbon::create($endedAt);

    }catch(\Exception $e){
        $c= explode('/', $endedAt);
        $ti = $c[1] .'/'.$c[0].'/'.$c[2];
        $endedAt = Carbon::create($ti);
    }
    try{
        $applyfrom = Carbon::create($applyfrom);
        
    }catch(\Exception $e){
        $c= explode('/', $applyfrom);
        $ti = $c[1] .'/'.$c[0].'/'.$c[2];
       $applyfrom = Carbon::create($ti);
    }
   
   // return $customerKey;
   if($isActive==false){
   // return  $key;
   
    $salary_user = UserSalary::where('assign_to_id',$user_id->id)->first();
    if(!empty($salary_user->id)){
       
        $user_salary =   UserSalaryHistory::create([
            'salary'=>$salary,
            'user_creator_id'=>$user_creator->id,
            'salary_id'=>$salary_user->id,
            'start_date'=>$applyfrom,
            'end_date'=>$endedAt,
        ]);
       
        
    }
    
}
}



}

public function getpendingamountmonthly(){
    $URL =   'https://fgspmproduction-default-rtdb.firebaseio.com/monthlyAmounts/2022.json?auth=TJIGzwSVyk9DSUWohfTHMu8tcRUp2VaIaZMXKFBD&key=AIzaSyBC14ua20Sa6zS_ZcfYYnj8ih1hDRE1Wq8';

    $TOKEN = 'AIzaSyBC14ua20Sa6zS_ZcfYYnj8ih1hDRE1Wq8';
    $headers = array
    (
        'Authorization: key='.$TOKEN,
        'Content-Type: application/json',
        'Access-Control-Allow-Origin: *'
    );
    $ch = curl_init();
    curl_setopt( $ch,CURLOPT_URL, $URL);
    curl_setopt( $ch,CURLOPT_POST, false );
    curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
    curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
    curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
    // curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) );
    $val = curl_exec($ch );
    $object_json =  json_decode($val,true);
    
  // return $object_json;
    foreach ($object_json as $key => $value) {
        if($key==null){
            continue;
        }else{
            if($value == null){
                continue;
            }
            foreach($value as $key2=>$value2){
                $finance_key = "RYART21ZBRTC4GWxFVrqmjwdqKZ2";
                $report_key=$key;
                $empKey = null;
                $ActualWorkingHours = null;
                $IdealHours = null;
                $OfficalVacations = null;
                $UnpaidVacations = null;
                $Total = null;
                $totalInHours = null;
                $thisMonthWorkingHours = null;
                $date = null;
                $createdAt = null;
                $createdByKey = null;
                $managerToApproveKey = null;
                $managerDissision = null;
                $managerDissisionKey = null;
                $managerDissisionAt = null;
                $monthSalaryApprovalCycle = null;
                $MonthSalaryFinalStatus = null;

                if(array_key_exists('empKey',$value2)){
                    $empKey =$value2['empKey'];
                }
                if(array_key_exists('ActualWorkingHours',$value2)){
                    $ActualWorkingHours =$value2['ActualWorkingHours'];
                }
                if(array_key_exists('UnpaidVacations',$value2)){
                    $UnpaidVacations =$value2['UnpaidVacations'];
                }
                if(array_key_exists('IdealHours',$value2)){
                    $IdealHours =$value2['IdealHours'];
                }
                if(array_key_exists('OfficalVacations',$value2)){
                    $OfficalVacations =$value2['OfficalVacations'];
                }
                if(array_key_exists('Total',$value2)){
                    $Total =$value2['Total'];
                }
                if(array_key_exists('totalInHours',$value2)){
                    $totalInHours =$value2['totalInHours'];
                }
                if(array_key_exists('thisMonthWorkingHours',$value2)){
                    $thisMonthWorkingHours =$value2['thisMonthWorkingHours'];
                }
                if(array_key_exists('date',$value2)){
                    $date =$value2['date'];
                }
                if(array_key_exists('createdAt',$value2)){
                    $createdAt =$value2['createdAt'];
                }
                if(array_key_exists('createdByKey',$value2)){
                    $createdByKey =$value2['createdByKey'];
                }
                if(array_key_exists('managerToApproveKey',$value2)){
                    $managerToApproveKey =$value2['managerToApproveKey'];
                }
                if(array_key_exists('managerDissision',$value2)){
                    $managerDissision =$value2['managerDissision'];
                }
                if(array_key_exists('managerDissisionKey',$value2)){
                    $managerDissisionKey =$value2['managerDissisionKey'];
                }
                if(array_key_exists('managerDissisionAt',$value2)){
                    $managerDissisionAt =$value2['managerDissisionAt'];
                }
                if(array_key_exists('monthSalaryApprovalCycle',$value2)){
                    $monthSalaryApprovalCycle =$value2['monthSalaryApprovalCycle'];
                }
                if(array_key_exists('MonthSalaryFinalStatus',$value2)){
                    $MonthSalaryFinalStatus =$value2['MonthSalaryFinalStatus'];
                }

                $date = $date .'/1';
                $managerDissisionAt=   str_replace('-', '/', $managerDissisionAt);
                $date=   str_replace('-', '/', $date);
                $createdAt=   str_replace('-', '/', $createdAt);
                $date = Carbon::create($date);
                $finance = User::where('firebasekey',$finance_key)->first();
                $user_creator = User::where('firebasekey',$createdByKey)->first();
                $manager_approve = User::where('firebasekey',$managerToApproveKey)->first();
                $manager_dission = User::where('firebasekey',$managerDissisionKey)->first();
                $employee = User::where('firebasekey',$empKey)->first();
                if(empty($employee->id)){
continue;           }
                try{
                    $createdAt = Carbon::create($createdAt);
                    
                }catch(\Exception $e){
                    $c= explode('/', $createdAt);
                    $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                    $createdAt = Carbon::create($ti);
                }

                try{
                    $managerDissisionAt = Carbon::create($managerDissisionAt);
            
                }catch(\Exception $e){
                    $c= explode('/', $managerDissisionAt);
                    $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                    $managerDissisionAt = Carbon::create($ti);
                }
 
                $report = SalaryReport::create([
                    'unpaidVacations'=>(float)$UnpaidVacations,
                    'officalVacations'=>(float)$OfficalVacations,
                    'idleHoursCost'=>(float)$IdealHours,
                    'actualWorkingCost'=>(float)$ActualWorkingHours,
                    'monthWorkingHours'=>(float)$thisMonthWorkingHours,
                    'totalByHours'=>(float)$totalInHours,
                    'totalInEGP'=>(float)$Total,
                    'user_creator_id'=>$user_creator->id,
                    'user_to_id'=>$employee->id,
                    'salary_status_id'=>($monthSalaryApprovalCycle=='0'?2:1 ),
                    'manager_approve_id'=>$manager_approve->id,
                    'last_user_action_id'=>null,
                    'salary_report_date'=>$date,
                    'created_at'=>$createdAt,
                    'updated_at'=>$managerDissisionAt
                ]);

 
            }
        }  
}

}


public function type($time_activity){
    if($time_activity=='daily_task'){
        $time_activity= 1;
    }else if($time_activity=='training'){
        $time_activity= 3;

    }else if($time_activity=='ideal_hours'){
        $time_activity= 5;

    }else if($time_activity=='c_meeting'){

        $time_activity= 4;
    }else if($time_activity=='support'){
        $time_activity= 2;

    }else if($time_activity=='official_vacation'){
        $time_activity= 6;

    }else if($time_activity=='unpaid_vacation'){
        $time_activity= 7;
    }
    return $time_activity;
}

public function getReportDev(){
   //devdailyreport
   //rejectedReports
   //pendingReports
   $URL =   'https://fgspmproduction-default-rtdb.firebaseio.com/pendingReports/.json?auth=TJIGzwSVyk9DSUWohfTHMu8tcRUp2VaIaZMXKFBD&key=AIzaSyBC14ua20Sa6zS_ZcfYYnj8ih1hDRE1Wq8';

    $TOKEN = 'AIzaSyBC14ua20Sa6zS_ZcfYYnj8ih1hDRE1Wq8';
    $headers = array
    (
        'Authorization: key='.$TOKEN,
        'Content-Type: application/json',
        'Access-Control-Allow-Origin: *'
    );
    $ch = curl_init();
    curl_setopt( $ch,CURLOPT_URL, $URL);
    curl_setopt( $ch,CURLOPT_POST, false );
    curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
    curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
    curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
    // curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) );
    $val = curl_exec($ch );
    $object_json =  json_decode($val,true);
   // $c = 0 ;
 // return $object_json;
    foreach ($object_json as $key => $value) {
        
                $report_key=$key;
                $devID = null;
                $reportDate = null;
                $durationByHours = null;
                $time_activity = null;
                $taskID = null;
                $projectID = null;
                $processID = null;
                $details = null;
                $progress = null;
                $approved = null;
                $rejected = null;
                $rejectionReason = null;
                $createdAt = null;
                $updatedAt = null;
                $approvedByKey = null;
                $managerApprovalKey = null;
                $preApprovedDuration = null;
                $managerChangeDurationComment = null;
                $seniorToApproveKey = null;
                $seniorDecision = null;
                $seniorDecisionKey = null;
                $seniorDecisionAt = null;
                $seniorDecisionComment = null;


               
               

                if(array_key_exists('devID',$value)){
                    $devID =$value['devID'];
                }
                if(array_key_exists('reportDate',$value)){
                    $reportDate =$value['reportDate'];
                }
                if(array_key_exists('durationByHours',$value)){
                    $durationByHours =$value['durationByHours'];
                }
                if(array_key_exists('time_activity',$value)){
                    $time_activity =$value['time_activity'];
                }
                if(array_key_exists('taskID',$value)){
                    $taskID =$value['taskID'];
                }
                if(array_key_exists('projectID',$value)){
                    $projectID =$value['projectID'];
                }
                if(array_key_exists('processID',$value)){
                    $processID =$value['processID'];
                }
                if(array_key_exists('details',$value)){
                    $details =$value['details'];
                }
                if(array_key_exists('progress',$value)){
                    $progress =$value['progress'];
                }
                if(array_key_exists('approved',$value)){
                    $approved =$value['approved'];
                }
                if(array_key_exists('rejected',$value)){
                    $rejected =$value['rejected'];
                }
            
                if(array_key_exists('approvedByKey',$value)){
                    $approvedByKey =$value['approvedByKey'];
                }
                if(array_key_exists('managerApprovalKey',$value)){
                    $managerApprovalKey =$value['managerApprovalKey'];
                }
                if(array_key_exists('rejectionReason',$value)){
                    $rejectionReason =$value['rejectionReason'];
                }
                if(array_key_exists('createdAt',$value)){
                    $createdAt =$value['createdAt'];
                }
                if(array_key_exists('updatedAt',$value)){
                    $updatedAt =$value['updatedAt'];
                }
                if(array_key_exists('preApprovedDuration',$value)){
                    $preApprovedDuration =$value['preApprovedDuration'];
                }
                if(array_key_exists('managerChangeDurationComment',$value)){
                    $managerChangeDurationComment =$value['managerChangeDurationComment'];
                }
                if(array_key_exists('seniorToApproveKey',$value)){
                    $seniorToApproveKey =$value['seniorToApproveKey'];
                }
                if(array_key_exists('seniorDecision',$value)){
                    $seniorDecision =$value['seniorDecision'];
                }
                if(array_key_exists('seniorDecisionKey',$value)){
                    $seniorDecisionKey =$value['seniorDecisionKey'];
                }
                if(array_key_exists('seniorDecisionAt',$value)){
                    $seniorDecisionAt =$value['seniorDecisionAt'];
                }
                if(array_key_exists('seniorDecisionComment',$value)){
                    $seniorDecisionComment =$value['seniorDecisionComment'];
                }
             

                $seniorDecisionAt=   str_replace('-', '/', $seniorDecisionAt);
                $createdAt=   str_replace('-', '/', $createdAt);
                $updatedAt=   str_replace('-', '/', $updatedAt);
                $reportDate=   str_replace('-', '/', $reportDate);
        

                $user_creator = User::where('firebasekey',$devID)->first();

                    $process = Process::where('firebasekey',$processID)->first();
            
                $process_one = Process::where('firebasekey',"-MdJS7mYaHM8lyiCdUQ6")->first();
                $task = Task::where('firebasekey',$taskID)->first();
                $project = Project::where('firebasekey',$projectID)->first();

                $manager_approve = User::where('firebasekey',$managerApprovalKey)->first();
 
                $manager_approved = User::where('firebasekey',$approvedByKey)->first();
                
                $fgs = User::where('firebasekey',"jjuyajnYK6clqnD7PIMEuQesyiy2")->first();
                $senior_approve = null;
                $senior_approved = null;
                
                if($seniorToApproveKey!=''){
                
                $senior_approve = User::where('firebasekey',$seniorToApproveKey)->first();
                $senior_approved = User::where('firebasekey',$seniorDecisionKey)->first();
            }    
              
                if(empty($user_creator->id)){
                continue;           
                }
                try{
                 $createdAt = Carbon::create($createdAt);
                    
                }catch(\Exception $e){
                    try{
                        $c= explode('/', $createdAt);
                        $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                        $createdAt = Carbon::create($ti);                           
                       }catch(\Exception $e){
                        try{
                            $createdAt = Carbon::create($reportDate);
                               
                           }catch(\Exception $e){
                               $c= explode('/', $reportDate);
                               $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                               $createdAt = Carbon::create($ti);
                           }
                   
                       }
                }
                try{
                    $seniorDecisionAt = Carbon::create($seniorDecisionAt);
                       
                   }catch(\Exception $e){
                       $c= explode('/', $seniorDecisionAt);
                       $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                       $seniorDecisionAt = Carbon::create($ti);
                   }
                   try{
                    $reportDate = Carbon::create($reportDate);
                       
                   }catch(\Exception $e){
                       $c= explode('/', $reportDate);
                       $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                       $reportDate = Carbon::create($ti);
                   }

                   try{
                    $updatedAt = Carbon::create($updatedAt);
                       
                   }catch(\Exception $e){
                       $c= explode('/', $updatedAt);
                       $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                       $updatedAt = Carbon::create($ti);
                   }

              
// 1 pending manager
//2 approve
//3 reject
//4 senior

// if(empty($manager_approve->id)){
//     return $senior_approve;
// }else{ continue;
// }
// if(empty($senior_approve->id)&&empty($manager_approve->id)&&empty($manager_approved->id)){
//     return $key;
// }else{
//     continue;
// }
                $report = Report::create([
                    'duration'=>$durationByHours,
                    'report_type_id'=>$this->type($time_activity),
                 'report_status_id'=>!empty($seniorToApproveKey)&&!empty($seniorDecision)?4:1,//apprvoed // rejected
               //    'report_status_id'=>3,//apprvoed // rejected
                  'manager_approve_id'=>!empty($senior_approve->id)?$senior_approve->id:(!empty($manager_approve->id)?$manager_approve->id:(!empty($manager_approved->id)?$manager_approved->id:$fgs->id)),
                    'user_creator_id'=>$user_creator->id,
                    'report_details'=>!empty($details)?$details: " ",
                    'report_date'=>$reportDate,
                    'report_progress'=>!empty($progress)?$progress :0,
                    'process_id'=>!empty($process->id)?$process->id:$process_one->id,
                    'task_id'=>!empty($task->id)?$task->id:null,
                    //'report_cost',
                    'created_at'=>$createdAt,
                    'updated_at'=>$updatedAt
                ]);
                // if(!empty($report->id)){
                //     if(($preApprovedDuration !=null) && ($preApprovedDuration != $durationByHours)){
                //         if(empty($manager_approve->id)&&empty($senior_approve->id)){
                //             return $value;
                //         }
                //         $report_manager_edit =  ReportManagerEdit::create([
                //                 'report_id'=>$report->id,
                //                 'manager_edit_id'=>(!empty($manager_approve->id)?$manager_approve->id:(!empty($manager_approved->id)?$manager_approved->id:$fgs->id)),
                //                 'old_duration'=>$preApprovedDuration,
                //                 'comment'=>!empty($managerChangeDurationComment)?$managerChangeDurationComment:" ",
                //         ]);
                //     }
                //     if($rejected==true || (!empty($seniorDecisionKey) && $seniorDecision==false)){

                //          $report_rejected =  ReportReject::create([
                //         'report_id'=>$report->id,
                //         'manager_reject_id'=>!empty($senior_approve->id)?$senior_approve->id:(!empty($manager_approve->id)?$manager_approve->id:(!empty($manager_approved->id)?$manager_approved->id:$fgs->id)),
                //         'reject_reason'=>$rejectionReason,
                //         'reject_date'=>$updatedAt,
                //         ]);
                //     }
                //     if(!empty($seniorToApproveKey) ){
                //         if($seniorDecision==true){

                //             $seniorEdit = ReportSeniorEdit::create([
                //                 'report_id'=>$report->id,
                //                 'senior_edit_id'=>$senior_approved->id,
                //                 'comment'=>!empty($seniorDecisionComment)?$seniorDecisionComment:" ",
                //             ]);
                //         }

                //     }
                //     $getDuration = WorkHoursConfig::where('start_date','<=',$report->report_date)->where('end_date','>=',$report->report_date)->first();
                //     $duartion = 0;
                //     if(!empty($getDuration->id)){
                //         $duartion = $getDuration->config_duration;
                //     }else{
                //         $duartion = 8;
                //     }
                //     $user_salary = UserSalary::where('assign_to_id',$user_creator->id)->where('start_date','<=',$report->report_date)->first();
                //     $salary =0;
                //     if(!empty($user_salary->id)){
                //         $date_current =   Carbon::parse( $report->report_date)->format('m/d/Y');
                //         $end = Carbon::create($date_current)->endOfMonth();
                //         $start = Carbon::create($date_current)->startOfMonth();
                //         $hours = $this->calDateRamadan($start,$end);
                //         // $hours = $hours!=0?$hours : 1;
                //         $salary = (($user_salary->salary)/$hours)*$report->duration;
                //     }else{
                //         $user_salary = UserSalaryHistory::where('start_date','<=',$report->report_date)->where('end_date','>=',$report->report_date)->
                //         whereHas('salary_id_fun',function($q) use($user_creator){
                //             $q->where('assign_to_id',$user_creator->id);
                //         })->first();
                //         if(!empty($user_salary->id)){
                //             $date_current =  Carbon::parse( $report->report_date)->format('m/d/Y');
                //             $end = Carbon::create($date_current)->endOfMonth();
                //             $start = Carbon::create($date_current)->startOfMonth();
                //             $hours = $this->calDateRamadan($start,$end);
                //             // $hours = $hours!=0?$hours : 1;
                //             $salary = (($user_salary->salary)/$hours)*$report->duration;
                //         }else{
                //             $salary=0;
                //         }
                //     }
                //     // $report ->update([

                //     //     'report_cost'=>$salary,
                //     // ]);

                // }
                


       
}

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


public function getApprovedamountmonthly(){
    $URL =   'https://fgspmproduction-default-rtdb.firebaseio.com/approvedMonthlyAmounts/2022.json?auth=TJIGzwSVyk9DSUWohfTHMu8tcRUp2VaIaZMXKFBD&key=AIzaSyBC14ua20Sa6zS_ZcfYYnj8ih1hDRE1Wq8';

    $TOKEN = 'AIzaSyBC14ua20Sa6zS_ZcfYYnj8ih1hDRE1Wq8';
    $headers = array
    (
        'Authorization: key='.$TOKEN,
        'Content-Type: application/json',
        'Access-Control-Allow-Origin: *'
    );
    $ch = curl_init();
    curl_setopt( $ch,CURLOPT_URL, $URL);
    curl_setopt( $ch,CURLOPT_POST, false );
    curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
    curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
    curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
    // curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) );
    $val = curl_exec($ch );
    $object_json =  json_decode($val,true);
    
  //  return $object_json;
    foreach ($object_json as $key => $value) {
        if($key==null){
            continue;
        }else{
            if($value == null){
                continue;
            }
            foreach($value as $key2=>$value2){
                $finance_key = "RYART21ZBRTC4GWxFVrqmjwdqKZ2";
                $report_key=$key;
                $empKey = null;
                $ActualWorkingHours = null;
                $IdealHours = null;
                $OfficalVacations = null;
                $UnpaidVacations = null;
                $Total = null;
                $totalInHours = null;
                $thisMonthWorkingHours = null;
                $date = null;
                $createdAt = null;
                $createdByKey = null;
                $managerToApproveKey = null;
                $managerDissision = null;
                $managerDissisionKey = null;
                $managerDissisionAt = null;
                $monthSalaryApprovalCycle = null;
                $MonthSalaryFinalStatus = null;

                if(array_key_exists('empKey',$value2)){
                    $empKey =$value2['empKey'];
                }
                if(array_key_exists('ActualWorkingHours',$value2)){
                    $ActualWorkingHours =$value2['ActualWorkingHours'];
                }
                if(array_key_exists('UnpaidVacations',$value2)){
                    $UnpaidVacations =$value2['UnpaidVacations'];
                }
                if(array_key_exists('IdealHours',$value2)){
                    $IdealHours =$value2['IdealHours'];
                }
                if(array_key_exists('OfficalVacations',$value2)){
                    $OfficalVacations =$value2['OfficalVacations'];
                }
                if(array_key_exists('Total',$value2)){
                    $Total =$value2['Total'];
                }
                if(array_key_exists('totalInHours',$value2)){
                    $totalInHours =$value2['totalInHours'];
                }
                if(array_key_exists('thisMonthWorkingHours',$value2)){
                    $thisMonthWorkingHours =$value2['thisMonthWorkingHours'];
                }
                if(array_key_exists('date',$value2)){
                    $date =$value2['date'];
                }
                if(array_key_exists('createdAt',$value2)){
                    $createdAt =$value2['createdAt'];
                }
                if(array_key_exists('createdByKey',$value2)){
                    $createdByKey =$value2['createdByKey'];
                }
                if(array_key_exists('managerToApproveKey',$value2)){
                    $managerToApproveKey =$value2['managerToApproveKey'];
                }
                if(array_key_exists('managerDissision',$value2)){
                    $managerDissision =$value2['managerDissision'];
                }
                if(array_key_exists('managerDissisionKey',$value2)){
                    $managerDissisionKey =$value2['managerDissisionKey'];
                }
                if(array_key_exists('managerDissisionAt',$value2)){
                    $managerDissisionAt =$value2['managerDissisionAt'];
                }
                if(array_key_exists('monthSalaryApprovalCycle',$value2)){
                    $monthSalaryApprovalCycle =$value2['monthSalaryApprovalCycle'];
                }
                if(array_key_exists('MonthSalaryFinalStatus',$value2)){
                    $MonthSalaryFinalStatus =$value2['MonthSalaryFinalStatus'];
                }

                $date = $date .'/1';
                $managerDissisionAt=   str_replace('-', '/', $managerDissisionAt);
                $date=   str_replace('-', '/', $date);
                $createdAt=   str_replace('-', '/', $createdAt);
                $date = Carbon::create($date);
                $finance = User::where('firebasekey',$finance_key)->first();
                $user_creator = User::where('firebasekey',$createdByKey)->first();
                $manager_approve = User::where('firebasekey',$managerToApproveKey)->first();
                $manager_dission = User::where('firebasekey',$managerDissisionKey)->first();
                $employee = User::where('firebasekey',$empKey)->first();
                if(empty($employee->id)){
continue;           }
                try{
                    $createdAt = Carbon::create($createdAt);
                    
                }catch(\Exception $e){
                    $c= explode('/', $createdAt);
                    $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                    $createdAt = Carbon::create($ti);
                }

                try{
                    $managerDissisionAt = Carbon::create($managerDissisionAt);
            
                }catch(\Exception $e){
                    $c= explode('/', $managerDissisionAt);
                    $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                    $managerDissisionAt = Carbon::create($ti);
                }
 
                $report = SalaryReport::create([
                    'unpaidVacations'=>(float)$UnpaidVacations,
                    'officalVacations'=>(float)$OfficalVacations,
                    'idleHoursCost'=>(float)$IdealHours,
                    'actualWorkingCost'=>(float)$ActualWorkingHours,
                    'monthWorkingHours'=>(float)$thisMonthWorkingHours,
                    'totalByHours'=>(float)$totalInHours,
                    'totalInEGP'=>(float)$Total,
                    'user_creator_id'=>$user_creator->id,
                    'user_to_id'=>$employee->id,
                    'salary_status_id'=>($MonthSalaryFinalStatus=='0'?4:($MonthSalaryFinalStatus=='2'?3:5) ),
                    'manager_approve_id'=>$manager_approve->id,
                    'last_user_action_id'=>!empty($finance->id)?$finance->id:null,
                    'salary_report_date'=>$date,
                    'created_at'=>$createdAt,
                    'updated_at'=>$managerDissisionAt
                ]);

 
            }
        }





       
}

}



public function projectstatus($status){
    if($status=='scheduled'){
        $status =3;
        }else if($status=='running'){
            $status =1;

        }elseif($status=='closed'){
            $status =5;
            
        }elseif($status=='On_Hold'){
            $status =2;
            
        }elseif($status=='Customer Pending'){
            $status =4;
            
        }
        return $status;
    }




    
public function getLog(){
    $URL =   'https://fgspmproduction-default-rtdb.firebaseio.com/systemlogs/.json?auth=TJIGzwSVyk9DSUWohfTHMu8tcRUp2VaIaZMXKFBD&key=AIzaSyBC14ua20Sa6zS_ZcfYYnj8ih1hDRE1Wq8';

    $TOKEN = 'AIzaSyBC14ua20Sa6zS_ZcfYYnj8ih1hDRE1Wq8';
    $headers = array
    (
        'Authorization: key='.$TOKEN,
        'Content-Type: application/json',
        'Access-Control-Allow-Origin: *'
    );
    $ch = curl_init();
    curl_setopt( $ch,CURLOPT_URL, $URL);
    curl_setopt( $ch,CURLOPT_POST, false );
    curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
    curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
    curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
    // curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) );
    $val = curl_exec($ch );
    $object_json =  json_decode($val,true);
    
   //return $object_json;
    foreach ($object_json as $key => $value2) {
      
         

                $log_key=$key;
                $action = null;
                $actionKeys = null;
                $empKey = null;
                $empName = null;
                $createdAt = null;
                $actionStatus = null;


                if(array_key_exists('action',$value2)){
                    $action =$value2['action'];
                }
                if(array_key_exists('actionKeys',$value2)){
                    $actionKeys =$value2['actionKeys'];
                }
                if(array_key_exists('empKey',$value2)){
                    $empKey =$value2['empKey'];
                }
                if(array_key_exists('empName',$value2)){
                    $empName =$value2['empName'];
                }
                if(array_key_exists('createdAt',$value2)){
                    $createdAt =$value2['createdAt'];
                }
                if(array_key_exists('actionStatus',$value2)){
                    $actionStatus =$value2['actionStatus'];
                }
            

             
                $createdAt=   str_replace('-', '/', $createdAt);


                $employee = User::where('firebasekey',$empKey)->first();
                if(empty($employee->id)){
                continue;           }
                try{
                    $createdAt = Carbon::create($createdAt);
                    
                }catch(\Exception $e){
                    try{
                        $c= explode('/', $createdAt);
                        $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                        $createdAt = Carbon::create($ti);                        
                    }catch(\Exception $e){
                        $createdAt = Carbon::now();

                    }
                   
                }

                
 
                $report = Log::create([
                    'action'=>$action,
                    'actionKeys'=>$actionKeys,
                    'empKey'=>$employee->id,
                    'empName'=>$employee->username,
                    'createdAt'=>$createdAt,
                    'actionStatus'=>$actionStatus
                ]);
            
 



       
}

}

public function getSingleUnit(){
    $URL =   'https://fgspmproduction-default-rtdb.firebaseio.com/singleProjectCost/.json?auth=TJIGzwSVyk9DSUWohfTHMu8tcRUp2VaIaZMXKFBD&key=AIzaSyBC14ua20Sa6zS_ZcfYYnj8ih1hDRE1Wq8';

    $TOKEN = 'AIzaSyBC14ua20Sa6zS_ZcfYYnj8ih1hDRE1Wq8';
    $headers = array
    (
        'Authorization: key='.$TOKEN,
        'Content-Type: application/json',
        'Access-Control-Allow-Origin: *'
    );
    $ch = curl_init();
    curl_setopt( $ch,CURLOPT_URL, $URL);
    curl_setopt( $ch,CURLOPT_POST, false );
    curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
    curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
    curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
    // curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) );
    $val = curl_exec($ch );
    $object_json =  json_decode($val,true);
    
   
 //  return $object_json;
    foreach ($object_json as $key => $value2) {
    

                $unit_key=$key;
              
                $processKey = null;
              
                $empKey = null;

                $costType = null;

                $notes = null;

                $costDate = null;
                $createdAt = null;
                $createdByKey = null;
                 $costAmount = null;


                if(array_key_exists('processKey',$value2)){
                    $processKey =$value2['processKey'];
                }
                if(array_key_exists('costType',$value2)){
                    $costType =$value2['costType'];
                    $costType = $this->gettypesingle($costType);
                }
                if(array_key_exists('empKey',$value2)){
                    $empKey =$value2['empKey'];
                }
                if(array_key_exists('costDate',$value2)){
                    $costDate =$value2['costDate'];
                }
                if(array_key_exists('createdAt',$value2)){
                    $createdAt =$value2['createdAt'];
                }
                if(array_key_exists('costAmount',$value2)){
                    $costAmount =$value2['costAmount'];
                }
                if(array_key_exists('createdByKey',$value2)){
                    $createdByKey =$value2['createdByKey'];
                }
                if(array_key_exists('notes',$value2)){
                    $notes =$value2['notes'];
                }
                if(!str_contains($notes,'Manually')){
                    continue;
                }
                
             
                $createdAt=   str_replace('-', '/', $createdAt);
                $costDate=   str_replace('-', '/', $costDate);


                $employee = User::where('firebasekey',$empKey)->first();
                $creator = User::where('firebasekey',$createdByKey)->first();
                $process = Process::where('firebasekey',$processKey)->first();
                
                if(empty($creator->id)){
                    return $value2;
                }
                if(empty($employee->id)||empty($process->id)){
                continue;           }
                try{
                    $costDate = Carbon::create($costDate);
                    
                }catch(\Exception $e){
                    try{
                        $c= explode('/', $costDate);
                        $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                        $costDate = Carbon::create($ti);                        
                    }catch(\Exception $e){
                        try{
                            $costDate = Carbon::create($createdAt);
                            
                        }catch(\Exception $e){
                            try{
                                $c= explode('/', $createdAt);
                                $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                                $costDate = Carbon::create($ti);                        
                            }catch(\Exception $e){
                                $costDate = Carbon::now();
        
                            }
                           
                        }
                    }
                   
                }
               
                try{
                    $createdAt = Carbon::create($createdAt);
                    
                }catch(\Exception $e){
                    try{
                        $c= explode('/', $createdAt);
                        $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                        $createdAt = Carbon::create($ti);                        
                    }catch(\Exception $e){
                        try{
                            $createdAt = Carbon::create($costDate);
                            
                        }catch(\Exception $e){
                            try{
                                $c= explode('/', $costDate);
                                $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                                $createdAt = Carbon::create($ti);                        
                            }catch(\Exception $e){
                                $createdAt = Carbon::now();
        
                            }
                           
                        }

                    }
                   
                }

                
 
                $report = ProjectCostManual::create([
                    'cost_amount'=>$costAmount,
                    'process_id'=>$process->id,
                    'cost_type_id'=>$costType,
                    'user_creator_id'=>$creator->id,
                    'comment'=>$notes,
                    'project_cost_date'=>$costDate,
                    'user_id'=>$employee->id,
                ]);
            
 



       
}

}
public function gettypesingle($type){
    if($type == "0"){
        $type =1;
    }elseif($type == "1"){
        $type =2;

    }elseif($type == "2"){
        $type =3;

    }elseif($type == "3"){
        $type =4;
    }elseif($type == "4"){
        $type =5;

    }elseif($type == "5"){
        $type =6;

    }elseif($type == "6"){
        $type =7;

    }else{
        $type =7;

    }
    return $type;
}
 



public function getIncentive(){
    //approved incentive
    //pending   pendingIncentive
    //pending   pendingIncentive
    $URL =   'https://fgspmproduction-default-rtdb.firebaseio.com/incentive/.json?auth=TJIGzwSVyk9DSUWohfTHMu8tcRUp2VaIaZMXKFBD&key=AIzaSyBC14ua20Sa6zS_ZcfYYnj8ih1hDRE1Wq8';

    $TOKEN = 'AIzaSyBC14ua20Sa6zS_ZcfYYnj8ih1hDRE1Wq8';
    $headers = array
    (
        'Authorization: key='.$TOKEN,
        'Content-Type: application/json',
        'Access-Control-Allow-Origin: *'
    );
    $ch = curl_init();
    curl_setopt( $ch,CURLOPT_URL, $URL);
    curl_setopt( $ch,CURLOPT_POST, false );
    curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
    curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
    curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
    // curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) );
    $val = curl_exec($ch );
    $object_json =  json_decode($val,true);
    
   
//  return $object_json;
    foreach ($object_json as $key => $value2) {
      
                $processKey = null; 
                $empKey = null;
                $incentiveAmount = null;
                $date = null;
                $createdByKey = null;
                $comment = null;
                $projectKey=null;
                $createdAt = null;
                $managerToApproveKey = null;
                $managerDissision = null;
                 $managerDissisionKey = null;
                 $managerDissisionComment = null;
                 $managerDissisionAt = null;
                 $financeToApproveKey = null;
                 $financeDissision = null;
                 $financeDissisionKey = null;
                 $financeDissisionComment = null;
                 $financeDissisionAt = null;
                 $finalStatus = null;
                 $approvalCycle = null;


                
                 if(array_key_exists('processKey',$value2)){
                    $processKey =$value2['processKey'];
                }
                if(array_key_exists('projectKey',$value2)){
                    $projectKey =$value2['projectKey'];
                }
                if(array_key_exists('empKey',$value2)){
                    $empKey =$value2['empKey'];
                }
                if(array_key_exists('finalStatus',$value2)){
                    $finalStatus =$value2['finalStatus'];
                    $finalStatus = $this->incentivestatus($finalStatus);
                }
                if(array_key_exists('incentiveAmount',$value2)){
                    $incentiveAmount =$value2['incentiveAmount'];
                }
                if(array_key_exists('createdAt',$value2)){
                    $createdAt =$value2['createdAt'];
                }
                if(array_key_exists('date',$value2)){
                    $date =$value2['date'];
                }
                if(array_key_exists('createdByKey',$value2)){
                    $createdByKey =$value2['createdByKey'];
                }
                if(array_key_exists('comment',$value2)){
                    $comment =$value2['comment'];
                }
                if(array_key_exists('managerToApproveKey',$value2)){
                    $managerToApproveKey =$value2['managerToApproveKey'];
                }
                if(array_key_exists('managerDissision',$value2)){
                    $managerDissision =$value2['managerDissision'];
                }
                if(array_key_exists('managerDissisionKey',$value2)){
                    $managerDissisionKey =$value2['managerDissisionKey'];
                }
                if(array_key_exists('managerDissisionComment',$value2)){
                    $managerDissisionComment =$value2['managerDissisionComment'];
                }
                if(array_key_exists('managerDissisionAt',$value2)){
                    $managerDissisionAt =$value2['managerDissisionAt'];
                }
                if(array_key_exists('financeToApproveKey',$value2)){
                    $financeToApproveKey =$value2['financeToApproveKey'];
                }
                if(array_key_exists('financeDissision',$value2)){
                    $financeDissision =$value2['financeDissision'];
                }
                if(array_key_exists('financeDissisionKey',$value2)){
                    $financeDissisionKey =$value2['financeDissisionKey'];
                }
                if(array_key_exists('financeDissisionComment',$value2)){
                    $financeDissisionComment =$value2['financeDissisionComment'];
                }
                if(array_key_exists('financeDissisionAt',$value2)){
                    $financeDissisionAt =$value2['financeDissisionAt'];
                }
                if(array_key_exists('approvalCycle',$value2)){
                    $approvalCycle =$value2['approvalCycle'];
                }

                
             
                $createdAt=   str_replace('-', '/', $createdAt);
                $financeDissisionAt=   str_replace('-', '/', $financeDissisionAt);
                $date=   str_replace('-', '/', $date);
             

                $finance = User::where('firebasekey',$financeToApproveKey)->first();
                $manager = User::where('firebasekey',$managerToApproveKey)->first();
                $user_creator = User::where('firebasekey',$createdByKey)->first();
                $employee = User::where('firebasekey',$empKey)->first();
                $process = Process::where('firebasekey',$processKey)->first();
                
                if(empty($process->id)){
                    $process = Process::whereHas('project_id_fun',function($q) use ($projectKey){
                        $q->where('firebasekey',$projectKey);
                    })->where('process_title','Process One')->first();
                 //   return 'a';
                 if(empty($process->id)){
                    $process = Process::whereHas('project_id_fun',function($q) use ($projectKey){
                        $q->where('firebasekey',$projectKey);
                    })->first();
                 //   return 'a';
                 }
                 // return $process;
                }
                
                
                try{
                    $createdAt = Carbon::create($createdAt);
                    
                }catch(\Exception $e){
                    $c= explode('/', $createdAt);
                    $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                    $createdAt = Carbon::create($ti);                        
                
                }
                try{
                    $financeDissisionAt = Carbon::create($financeDissisionAt);
                    
                }catch(\Exception $e){
                    $c= explode('/', $financeDissisionAt);
                    $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                    $financeDissisionAt = Carbon::create($ti);                        
                
                }
                try{
                    $date = Carbon::create($date);
                }catch(\Exception $e){
                    $c= explode('/', $date);
                    $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                    $date = Carbon::create($ti);                        
                }
               
                $report = IncentiveRequest::create([
                    'incentive_comment'=>$comment,
                    'incentive_amount'=>$incentiveAmount,
                    'user_creator_id'=>$user_creator->id,
                    'user_to_id'=>$employee->id,
                    'manager_approve_id'=>$finalStatus==2? $manager->id : (!empty($finance->id)?$finance->id:null),
                    'process_id'=>$process->id,
                    'incentive_status_id'=>$finalStatus,
                    'incentive_date'=>$date
                ]);
            
                if(!empty($report)){
                    if($finalStatus ==2 ){
                     $approved =   IncentiveRequestApproved::create([
                            'incentive_status_id'=>2,
                            'assign_to_id'=>$manager->id,
                            'incentive_id'=>$report->id,
                            'comment'=>$managerDissisionComment
                        ]);
                    }
                    if($finalStatus ==3 ){
                        $approved =   IncentiveRequestApproved::create([
                            'incentive_status_id'=>2,
                            'assign_to_id'=>$manager->id,
                            'incentive_id'=>$report->id,
                            'comment'=>$managerDissisionComment
                        ]);
                        $approved2 =   IncentiveRequestApproved::create([
                            'incentive_status_id'=>3,
                            'assign_to_id'=>$finance->id,
                            'incentive_id'=>$report->id,
                            'comment'=>$financeDissisionComment
                        ]);

                    }
                    if($finalStatus ==4 ){
                        $approved =   IncentiveRequestRejected::create([
                            'rejected_by_id'=>$managerDissision==false?$manager->id : ($financeDissision==false?$finance->id:$manager->id),
                            'reject_reason'=>$managerDissision==false?$managerDissisionComment : ($financeDissision==false?$financeDissisionComment:$managerDissisionComment),
                            'incentive_id'=>$report->id,  
                               
                           ]);
                       }
                }
            
       
}

}

 

public function getBudgetProject(){
    
    

    $URL =   'https://fgspmproduction-default-rtdb.firebaseio.com/ProjectTotalCost/.json?auth=TJIGzwSVyk9DSUWohfTHMu8tcRUp2VaIaZMXKFBD&key=AIzaSyBC14ua20Sa6zS_ZcfYYnj8ih1hDRE1Wq8';

    $TOKEN = 'AIzaSyBC14ua20Sa6zS_ZcfYYnj8ih1hDRE1Wq8';
    $headers = array
    (
        'Authorization: key='.$TOKEN,
        'Content-Type: application/json',
        'Access-Control-Allow-Origin: *'
    );
    $ch = curl_init();
    curl_setopt( $ch,CURLOPT_URL, $URL);
    curl_setopt( $ch,CURLOPT_POST, false );
    curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
    curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
    curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
    // curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) );
    $val = curl_exec($ch );
    $object_json =  json_decode($val,true);
    
   
    //return $object_json;
    foreach ($object_json as $key => $value2) {
      
              
                $projectKey=null;
             
                 $approvalCycle = null;


                
                
                if(array_key_exists('projectKey',$value2)){
                    $projectKey =$value2['projectKey'];
                }
              
                if(array_key_exists('budgetryCost',$value2)){
                    $budgetryCost =$value2['budgetryCost'];
                }

            
                $project = Project::where('firebasekey',$projectKey)->first();
                
                if(empty($project->id)){
                 // return $value2;
                  continue;
                }
                
                
                $project->update([
                    'project_budget'=>$budgetryCost,
                ]);
               
            
            
                
            
       
}

}


public function getTransportation(){
    //Transportaions
    //pendingtransportations
    $URL =   'https://fgspmproduction-default-rtdb.firebaseio.com/Transportaions/.json?auth=TJIGzwSVyk9DSUWohfTHMu8tcRUp2VaIaZMXKFBD&key=AIzaSyBC14ua20Sa6zS_ZcfYYnj8ih1hDRE1Wq8';

    $TOKEN = 'AIzaSyBC14ua20Sa6zS_ZcfYYnj8ih1hDRE1Wq8';
    $headers = array
    (
        'Authorization: key='.$TOKEN,
        'Content-Type: application/json',
        'Access-Control-Allow-Origin: *'
    );
    $ch = curl_init();
    curl_setopt( $ch,CURLOPT_URL, $URL);
    curl_setopt( $ch,CURLOPT_POST, false );
    curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
    curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
    curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
    // curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) );
    $val = curl_exec($ch );
    $object_json =  json_decode($val,true);
    
   
   // return $object_json;
    foreach ($object_json as $key => $value2) {
        $empKey=null;
        $fromLocation=null;
        $toLocation=null;
        $purpose=null;
        $date=null;
        $amountByEGP=null;
        $comment=null;
        $createdAt=null;
        $projectKey=null;
        $processKey=null;
        $pmToApproveKey=null;
        $pmDissision=null;
        $pmDissisionKey=null;
        $pmDissisionComment=null;
        $pmDissisionAt=null;
        $financeToApproveKey=null;
        $financeDissision=null;
        $financeDissisionKey=null;
        $financeDissisionComment=null;
        $financeDissisionAt=null;
        $managerToApproveKey=null;
        $managerDissision=null;
        $managerDissisionKey=null;
        $managerDissisionComment=null;
        $managerDissisionAt=null;
        $finalStatus=null;

                
                
                if(array_key_exists('empKey',$value2)){
                    $empKey =$value2['empKey'];
                }
                if(array_key_exists('fromLocation',$value2)){
                    $fromLocation =$value2['fromLocation'];
                }
                if(array_key_exists('toLocation',$value2)){
                    $toLocation =$value2['toLocation'];
                }
                if(array_key_exists('purpose',$value2)){
                    $purpose =$value2['purpose'];
                }
                if(array_key_exists('date',$value2)){
                    $date =$value2['date'];
                }
                if(array_key_exists('amountByEGP',$value2)){
                    $amountByEGP =$value2['amountByEGP'];
                }
                if(array_key_exists('comment',$value2)){
                    $comment =$value2['comment'];
                }
                if(array_key_exists('createdAt',$value2)){
                    $createdAt =$value2['createdAt'];
                }
                if(array_key_exists('projectKey',$value2)){
                    $projectKey =$value2['projectKey'];
                }
                if(array_key_exists('processKey',$value2)){
                    $processKey =$value2['processKey'];
                }
                if(array_key_exists('financeDissisionComment',$value2)){
                    $financeDissisionComment =$value2['financeDissisionComment'];
                }
                if(array_key_exists('financeDissisionAt',$value2)){
                    $financeDissisionAt =$value2['financeDissisionAt'];
                }
                if(array_key_exists('managerToApproveKey',$value2)){
                    $managerToApproveKey =$value2['managerToApproveKey'];
                }
                if(array_key_exists('managerDissision',$value2)){
                    $managerDissision =$value2['managerDissision'];
                }
                if(array_key_exists('managerDissisionKey',$value2)){
                    $managerDissisionKey =$value2['managerDissisionKey'];
                }

                if(array_key_exists('managerDissisionComment',$value2)){
                    $managerDissisionComment =$value2['managerDissisionComment'];
                }
                if(array_key_exists('managerDissisionAt',$value2)){
                    $managerDissisionAt =$value2['managerDissisionAt'];
                }
                if(array_key_exists('finalStatus',$value2)){
                    $finalStatus =$value2['finalStatus'];
                    $finalStatus = $this->transStatus($finalStatus);
                }
                

                if(array_key_exists('pmToApproveKey',$value2)){
                    $pmToApproveKey =$value2['pmToApproveKey'];
                }
                if(array_key_exists('pmDissision',$value2)){
                    $pmDissision =$value2['pmDissision'];
                }
                if(array_key_exists('pmDissisionKey',$value2)){
                    $pmDissisionKey =$value2['pmDissisionKey'];
                }
                if(array_key_exists('pmDissisionComment',$value2)){
                    $pmDissisionComment =$value2['pmDissisionComment'];
                }
                if(array_key_exists('pmDissisionAt',$value2)){
                    $pmDissisionAt =$value2['pmDissisionAt'];
                }
                if(array_key_exists('financeToApproveKey',$value2)){
                    $financeToApproveKey =$value2['financeToApproveKey'];
                }
                if(array_key_exists('financeDissision',$value2)){
                    $financeDissision =$value2['financeDissision'];
                }
                if(array_key_exists('financeDissisionKey',$value2)){
                    $financeDissisionKey =$value2['financeDissisionKey'];
                }


            
                $project = Project::where('firebasekey',$projectKey)->first();
                $process = Process::where('firebasekey',$processKey)->first();

                $pmDissisionAt=   str_replace('-', '/', $pmDissisionAt);
                $financeDissisionAt=   str_replace('-', '/', $financeDissisionAt);
                $managerDissisionAt=   str_replace('-', '/', $managerDissisionAt);
                $createdAt=   str_replace('-', '/', $createdAt);
                
                $creator_id = User::where('firebasekey',$empKey)->first();
                $manager = User::where('firebasekey',$managerToApproveKey)->first();
                $manager = User::where('firebasekey',$managerDissisionKey)->first();
                

                try{
                    $pmDissisionAt = Carbon::create($pmDissisionAt);
                }catch(\Exception $e){
                    $c= explode('/', $pmDissisionAt);
                    $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                    $pmDissisionAt = Carbon::create($ti);                        
                }
                try{
                    $financeDissisionAt = Carbon::create($financeDissisionAt);
                }catch(\Exception $e){
                    $c= explode('/', $financeDissisionAt);
                    $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                    $financeDissisionAt = Carbon::create($ti);                        
                }
                try{
                    $managerDissisionAt = Carbon::create($managerDissisionAt);
                }catch(\Exception $e){
                    $c= explode('/', $managerDissisionAt);
                    $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                    $managerDissisionAt = Carbon::create($ti);                        
                }
                try{
                    $createdAt = Carbon::create($createdAt);
                }catch(\Exception $e){
                    try{ 
                    $c= explode('/', $createdAt);
                    $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                    $createdAt = Carbon::create($ti);   
                }catch(\Exception $e){
                    try{
                        $createdAt = Carbon::create($pmDissisionAt);
                    }catch(\Exception $e){
                        $c= explode('/', $pmDissisionAt);
                        $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                        $createdAt = Carbon::create($ti);                        
                    }
                }                     
                }
              
                

                if(empty($process->id)){
                    $process = Process::whereHas('project_id_fun',function($q) use ($projectKey){
                        $q->where('firebasekey',$projectKey);
                    })->where('process_title','Process One')->first();
                 //   return 'a';
                 if(empty($process->id)){
                    $process = Process::whereHas('project_id_fun',function($q) use ($projectKey){
                        $q->where('firebasekey',$projectKey);
                    })->first();
                 //   return 'a';
                 }
                 // return $process;
                }
                
                if(empty($process->id)){
                    $process = Process::where('firebasekey','-MdJS7mYaHM8lyiCdUQ6')->first();
                    //return $value2;
                }
                
                $transport = TransportationRequest::create([
                    'transportation_request_comment'=>$comment,
                    'transportation_request_from'=>$fromLocation,
                    'transportation_request_purpose'=>$purpose,
                    'transportation_request_to'=>$toLocation,
                    'transportation_request_amount'=>$amountByEGP,
                    'user_creator_id'=>$creator_id->id,
                    'transportation_request_status_id'=>$finalStatus,
                    'manager_approve_id'=>$creator_id->id,
                    'process_id'=>$process->id,
                    'transportation_request_date'=>$date,
                    'created_at'=>$createdAt,
                ]);
                if(!empty($transport->id)){
                   $gettrans = TransportationRequest::where('id',$transport->id)->first();
                if($finalStatus ==2){
                    $pm =null;
                    if(!empty($pmDissision)){
                        $pm = User::where('firebasekey',$pmDissisionKey)->first();
                        if(!empty($pm->id)){
                            
                            $approve1= TransportationRequestAccepted::create([
                                'request_status_id'=>$finalStatus,
                                'assign_to_id'=>$pm->id,
                                'request_id'=>$transport->id,
                                'comment'=>$pmDissisionComment,
                                'created_at'=>$pmDissisionAt
                            ]);
                            $gettrans2 = TransportationRequest::where('id',$gettrans->id)->first();
                            $gettrans2->update([
                                'manager_approve_id'=>$pm->id,
                                'transportation_request_status_id'=>3,

                            ]);
                            
                        }
                    }
                    if(!empty($managerDissision)){
                        $pm = User::where('firebasekey',$managerDissisionKey)->first();
                        if(!empty($pm->id)){

                            $approve1= TransportationRequestAccepted::create([
                                'request_status_id'=>$finalStatus,
                                'assign_to_id'=>$pm->id,
                                'request_id'=>$transport->id,
                                'comment'=>$managerDissisionComment,
                                'created_at'=>$managerDissisionAt

                            ]);
                            $gettrans2 = TransportationRequest::where('id',$gettrans->id)->first();
                            $gettrans2->update([
                                'manager_approve_id'=>$pm->id,

                            ]);
                        }
                    }
                   
                   
                    if(!empty($financeDissision)){
                        $pm = User::where('firebasekey',$financeDissisionKey)->first();
                        if(!empty($pm->id)){

                            $approve1= TransportationRequestAccepted::create([
                                'request_status_id'=>$finalStatus,
                                'assign_to_id'=>$pm->id,
                                'request_id'=>$transport->id,
                                'comment'=>$financeDissisionComment,
                                'created_at'=>$financeDissisionAt

                            ]);
                            $gettrans2 = TransportationRequest::where('id',$gettrans->id)->first();
                            $gettrans2->update([
                                'manager_approve_id'=>$pm->id,

                            ]);
                            
                        }
                    }
                     
                    
                }else if($finalStatus==4){
                    $pm =null;

                    if(!empty($pmDissision)||$pmDissision==false){
                        $pm = User::where('firebasekey',$pmDissisionKey)->first();
                        if(!empty($pm->id)){

                            $approve1= TransportationRequestRejected::create([
                                'reject_reason'=>$pmDissisionComment,
                                'rejected_by_id'=>$pm->id,
                                'request_id'=>$transport->id,
                                'created_at'=>$pmDissisionAt

                             
                            ]);
                            $gettrans2 = TransportationRequest::where('id',$gettrans->id)->first();
                            $gettrans2->update([
                                'manager_approve_id'=>$pm->id,

                            ]);
                        }
                    }
                   
                    if(!empty($managerDissision)||$pmDissision==false){
                        $pm = User::where('firebasekey',$managerDissisionKey)->first();
                        if(!empty($pm->id)){

                            $approve1= TransportationRequestRejected::create([
                                'reject_reason'=>$managerDissisionComment,
                                'rejected_by_id'=>$pm->id,
                                'request_id'=>$transport->id,

                                'created_at'=>$managerDissisionAt

                            ]);
                            $gettrans2 = TransportationRequest::where('id',$gettrans->id)->first();
                            $gettrans2->update([
                                'manager_approve_id'=>$pm->id,

                            ]);
                        }
                    }
                    if(!empty($financeDissision)||$pmDissision==false){
                        $pm = User::where('firebasekey',$financeDissisionKey)->first();
                        if(!empty($pm->id)){

                            $approve1= TransportationRequestRejected::create([
                                'reject_reason'=>$financeDissisionComment,
                                'rejected_by_id'=>$pm->id,
                                'request_id'=>$transport->id,

                                'created_at'=>$financeDissisionAt

                            ]);
                            $gettrans2 = TransportationRequest::where('id',$gettrans->id)->first();
                            $gettrans2->update([
                                'manager_approve_id'=>$pm->id,

                            ]);
                        }
                    }
                   

                }
               }
         
                
            
       
}

}

public function publicrequeststatus($status){
    if($status == 0){
        $status =4 ;
    }elseif($status == 1){
        $status = 1;
    }elseif($status == 2){
        $status = 2;
    }elseif($status == 3){
        $status =3 ;
    }
    return $status;
}
public function subdepartment($dep){
    if($dep == 1){
        $dep =11;
    }else{
        $dep=9;
    }
    return $dep;
}
public function getPublicReqeust(){
    
    $URL =   'https://fgspmproduction-default-rtdb.firebaseio.com/approvedPublicRequests/.json?auth=TJIGzwSVyk9DSUWohfTHMu8tcRUp2VaIaZMXKFBD&key=AIzaSyBC14ua20Sa6zS_ZcfYYnj8ih1hDRE1Wq8';

    $TOKEN = 'AIzaSyBC14ua20Sa6zS_ZcfYYnj8ih1hDRE1Wq8';
    $headers = array
    (
        'Authorization: key='.$TOKEN,
        'Content-Type: application/json',
        'Access-Control-Allow-Origin: *'
    );
    $ch = curl_init();
    curl_setopt( $ch,CURLOPT_URL, $URL);
    curl_setopt( $ch,CURLOPT_POST, false );
    curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
    curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
    curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
    // curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) );
    $val = curl_exec($ch );
    $object_json =  json_decode($val,true);
    
   
    //return $object_json;
    
      
    foreach ($object_json as $key => $value2) {
        $empKey=null;
        $dept=null;
        $type=null;
        $details=null;
        $amountByEGP=null;
        $createdAt=null;
        $projectKey=null;
        $processKey=null;
        $managerToApproveKey=null;
        $managerDissision=null;
        $managerDissisionKey=null;
        $managerDissisionComment=null;
        $managerDissisionAt=null;
        $empToApplyKey=null;
        $empAppliedComment=null;
        $empAppliedAt=null;
        $finalStatus=null;

                
                if(array_key_exists('empKey',$value2)){
                    $empKey =$value2['empKey'];
                }
                if(array_key_exists('dept',$value2)){
                    $dept =$value2['dept'];
                    $dept = $this->subdepartment($dept);
                }
                if(array_key_exists('type',$value2)){
                    $type =$value2['type'];
                }
                if(array_key_exists('details',$value2)){
                    $details =$value2['details'];
                }
              
                if(array_key_exists('amountByEGP',$value2)){
                    $amountByEGP =$value2['amountByEGP'];
                }
                if(array_key_exists('createdAt',$value2)){
                    $createdAt =$value2['createdAt'];
                }

                if(array_key_exists('projectKey',$value2)){
                    $projectKey =$value2['projectKey'];
                }
                if(array_key_exists('processKey',$value2)){
                    $processKey =$value2['processKey'];
                }
               
                if(array_key_exists('managerToApproveKey',$value2)){
                    $managerToApproveKey =$value2['managerToApproveKey'];
                }
                if(array_key_exists('managerDissision',$value2)){
                    $managerDissision =$value2['managerDissision'];
                }
                if(array_key_exists('managerDissisionKey',$value2)){
                    $managerDissisionKey =$value2['managerDissisionKey'];
                }
                if(array_key_exists('managerDissisionComment',$value2)){
                    $managerDissisionComment =$value2['managerDissisionComment'];
                }
                if(array_key_exists('managerDissisionAt',$value2)){
                    $managerDissisionAt =$value2['managerDissisionAt'];
                }
                if(array_key_exists('finalStatus',$value2)){
                    $finalStatus =$value2['finalStatus'];
                    $finalStatus = $this->publicrequeststatus($finalStatus);
                }
                
                if(array_key_exists('empToApplyKey',$value2)){
                    $empToApplyKey =$value2['empToApplyKey'];
                }
                if(array_key_exists('empAppliedComment',$value2)){
                    $empAppliedComment =$value2['empAppliedComment'];
                }
                if(array_key_exists('empAppliedAt',$value2)){
                    $empAppliedAt =$value2['empAppliedAt'];
                }
             


            
                $project = Project::where('firebasekey',$projectKey)->first();
                $process = Process::where('firebasekey',$processKey)->first();

                 $empAppliedAt=   str_replace('-', '/', $empAppliedAt);
                $managerDissisionAt=   str_replace('-', '/', $managerDissisionAt);
                $createdAt=   str_replace('-', '/', $createdAt);
                
                $creator_id = User::where('firebasekey',$empKey)->first();
               $employee = User::where('firebasekey',$empToApplyKey)->first();
                $manager = User::where('firebasekey',$managerDissisionKey)->first();
                

                try{
                    $empAppliedAt = Carbon::create($empAppliedAt);
                }catch(\Exception $e){
                    $c= explode('/', $empAppliedAt);
                    $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                    $empAppliedAt = Carbon::create($ti);                        
                }
               
                try{
                    $managerDissisionAt = Carbon::create($managerDissisionAt);
                }catch(\Exception $e){
                    $c= explode('/', $managerDissisionAt);
                    $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                    $managerDissisionAt = Carbon::create($ti);                        
                }
                try{
                    $createdAt = Carbon::create($createdAt);
                }catch(\Exception $e){
                    try{ 
                    $c= explode('/', $createdAt);
                    $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                    $createdAt = Carbon::create($ti);   
                }catch(\Exception $e){
                    try{
                        $createdAt = Carbon::create($managerDissisionAt);
                    }catch(\Exception $e){
                        $c= explode('/', $managerDissisionAt);
                        $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                        $createdAt = Carbon::create($ti);                        
                    }
                }                     
                }
              
                

                if(empty($process->id)){
                    $process = Process::whereHas('project_id_fun',function($q) use ($projectKey){
                        $q->where('firebasekey',$projectKey);
                    })->where('process_title','Process One')->first();
                 //   return 'a';
                 if(empty($process->id)){
                    $process = Process::whereHas('project_id_fun',function($q) use ($projectKey){
                        $q->where('firebasekey',$projectKey);
                    })->first();
                 //   return 'a';
                 }
                 // return $process;
                }
                
                if(empty($process->id)){
                    $process = Process::where('firebasekey','-MdJS7mYaHM8lyiCdUQ6')->first();
                    //return $value2;
                }
                
                $transport = PublicRequest::create([
                    'public_request_details'=>$details,
                    'public_request_amount'=>$amountByEGP,
                    'user_creator_id'=>$creator_id->id,
                    'public_request_status_id'=>$finalStatus,
                    'manager_approve_id'=>$manager->id,
                    'process_id'=>$process->id,
                     'public_request_title'=>$type,
                     'sub_departments_id'=>$dept,
                    'created_at'=>$createdAt,
                ]);
                if(!empty($transport->id)){
                   $gettrans = PublicRequest::where('id',$transport->id)->first();
                if($finalStatus ==2){
                    $pm =null;
                    if(!empty($managerDissision)){
                        $pm = User::where('firebasekey',$managerDissisionKey)->first();
                        if(!empty($pm->id)){
                            
                            $approve1= PublicRequestAccepted::create([
                                'public_request_status_id'=>$finalStatus,
                                'assign_to_id'=>$manager->id,
                                'public_request_id'=>$transport->id,
                                'comment'=>$managerDissisionComment

                            ]);
                            $gettrans2 = PublicRequest::where('id',$gettrans->id)->first();
                            $empTo = User::where('firebasekey',$empToApplyKey)->first();
                            $gettrans2->update([
                                'manager_approve_id'=>$empTo->id,

                            ]);
                            
                        }
                    }
                }
                if($finalStatus ==3){
                    if(!empty($empToApplyKey)){
                    
                        $pm = User::where('firebasekey',$empToApplyKey)->first();
                        if(!empty($pm->id)){
                            $pm2 = User::where('firebasekey',$managerDissisionKey)->first();

                            $approve1= PublicRequestAccepted::create([
                                'public_request_status_id'=>2,
                                'assign_to_id'=>$pm2->id,
                                'public_request_id'=>$transport->id,
                                'comment'=>$managerDissisionComment

                            ]);
                            $gettrans2 = PublicRequest::where('id',$gettrans->id)->first();
                            $gettrans2->update([
                                'manager_approve_id'=>$pm2->id,

                            ]);

                            $approve1= PublicRequestAccepted::create([
                                'public_request_status_id'=>3,
                                'assign_to_id'=>$employee->id,
                                'public_request_id'=>$transport->id,
                                'comment'=>$empAppliedComment

                            ]);
                            $gettrans2 = PublicRequest::where('id',$gettrans->id)->first();
                            $gettrans2->update([
                                'manager_approve_id'=>$pm->id,

                            ]);
                        }
                    }
                    if($finalStatus ==4){
                        if(!empty($empToApplyKey)){
                        
                            

                                $pm = User::where('firebasekey',$managerDissisionKey)->first();
                            
                            if(!empty($pm->id)){
                                $approve1= PublicRequestRejected::create([
                                    'rejected_by_id'=>$pm->id,
                                    'reject_reason'=>$managerDissisionComment,
                                    'public_request_id'=>$transport->id,
    
                                ]);
                                $gettrans2 = PublicRequest::where('id',$gettrans->id)->first();
                                $gettrans2->update([
                                    'manager_approve_id'=>$pm->id,
    
                                ]);
                            }
                        }
                    }

                   
                 
                   

                }
               }
         
                
            
       
}

}







public function transStatus($status){
    if($status == 0 ){
        $status =4;
    }elseif($status == 1 ){
        $status= 1;
    }elseif($status == 2 ){
        $status = 2;
    }
    return $status;
}


 

public function incentivestatus($status){
    if($status ==0){
        $status = 4;
    }elseif($status ==1){
        $status = 1;

    }elseif($status ==2){
        $status = 2;

    }elseif($status ==3){
        $status = 3;

    }
    return $status; 
}



public function getlicense(){
    
    

    $URL =   'https://fgspmproduction-default-rtdb.firebaseio.com/license/.json?auth=TJIGzwSVyk9DSUWohfTHMu8tcRUp2VaIaZMXKFBD&key=AIzaSyBC14ua20Sa6zS_ZcfYYnj8ih1hDRE1Wq8';

    $TOKEN = 'AIzaSyBC14ua20Sa6zS_ZcfYYnj8ih1hDRE1Wq8';
    $headers = array
    (
        'Authorization: key='.$TOKEN,
        'Content-Type: application/json',
        'Access-Control-Allow-Origin: *'
    );
    $ch = curl_init();
    curl_setopt( $ch,CURLOPT_URL, $URL);
    curl_setopt( $ch,CURLOPT_POST, false );
    curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
    curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
    curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
    // curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) );
    $val = curl_exec($ch );
    $object_json =  json_decode($val,true);
    
   
    //return $object_json;
    foreach ($object_json as $key => $value2) {
        $l_key = $key;
        $clientKey=null;
        $type=null;
        $product=null;
        $startDate=null;
        $endDate=null;
        $status=null;
        $comment=null;
        $createdAt=null;
        $updatedAt=null;
        $createdByKey=null;  

        $accountName =null;
        if(array_key_exists('product',$value2)){
            $product =$value2['product'];
            $product = $this->li_product($product);
        }
        if(array_key_exists('startDate',$value2)){
            $startDate =$value2['startDate'];
        }
        if(array_key_exists('accountName',$value2)){
            $accountName =$value2['accountName'];
        }
        if(array_key_exists('endDate',$value2)){
            $endDate =$value2['endDate'];
        }

        if(array_key_exists('status',$value2)){
            $status =$value2['status'];
            $status = $this->li_status($status);
        }
        if(array_key_exists('comment',$value2)){
            $comment =$value2['comment'];
        }
        if(array_key_exists('createdAt',$value2)){
            $createdAt =$value2['createdAt'];
        }
        if(array_key_exists('updatedAt',$value2)){
            $updatedAt =$value2['updatedAt'];
        }
        if(array_key_exists('createdByKey',$value2)){
            $createdByKey =$value2['createdByKey'];
        }
                
                if(array_key_exists('clientKey',$value2)){
                    $clientKey =$value2['clientKey'];
                }
              
                if(array_key_exists('type',$value2)){
                    $type =$value2['type'];
                    $type = $this->li_type($type);
                }

                $client = ClientAccount::where('firebasekey',$clientKey)->first();
                $creator_id = User::where('firebasekey',$createdByKey)->first();
              
                if(empty($client)){
                    $client = ClientAccount::where('fullname',$accountName)->first();
                 //   return $client;
                }
                $startDate=   str_replace('-', '/', $startDate);
                $endDate=   str_replace('-', '/', $endDate);
                $createdAt=   str_replace('-', '/', $createdAt);
                try{
                    $startDate = Carbon::create($startDate);
                }catch(\Exception $e){
                    $c= explode('/', $startDate);
                    $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                    $startDate = Carbon::create($ti);                        
                }
                try{
                    $endDate = Carbon::create($endDate);
                }catch(\Exception $e){
                    $c= explode('/', $endDate);
                    $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                    $endDate = Carbon::create($ti);                        
                }
                try{
                    $createdAt = Carbon::create($createdAt);
                }catch(\Exception $e){
                    $c= explode('/', $createdAt);
                    $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                    $createdAt = Carbon::create($ti);                        
                }


              ///  if(!empty($client->id)){
                    $license = License::create([
                        'license_comment'=>$comment,
                        'user_creator_id'=>$creator_id->id,
                        'license_type_id'=>$type,
                        'license_status_id'=>1,
                        //'partner_id'=>$client->partner_id,
                        'product_id'=>$product,
                        'license_start_date'=>$startDate,
                        'license_end_date'=>$endDate,
                        'firebasekey'=>$l_key,
                        'license_number'=>$accountName
                    ]);
                // }else{
                //       return $value2;
                // }
                
            
            
                
            
       
}

}


public function getlicensehistory(){
    
    

    $URL =   'https://fgspmproduction-default-rtdb.firebaseio.com/licenseUpdates/.json?auth=TJIGzwSVyk9DSUWohfTHMu8tcRUp2VaIaZMXKFBD&key=AIzaSyBC14ua20Sa6zS_ZcfYYnj8ih1hDRE1Wq8';

    $TOKEN = 'AIzaSyBC14ua20Sa6zS_ZcfYYnj8ih1hDRE1Wq8';
    $headers = array
    (
        'Authorization: key='.$TOKEN,
        'Content-Type: application/json',
        'Access-Control-Allow-Origin: *'
    );
    $ch = curl_init();
    curl_setopt( $ch,CURLOPT_URL, $URL);
    curl_setopt( $ch,CURLOPT_POST, false );
    curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
    curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
    curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
    // curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) );
    $val = curl_exec($ch );
    $object_json =  json_decode($val,true);
    
   
   // return $object_json;
    foreach ($object_json as $key => $value2) {
        $l_key = $key;
        $clientKey=null;
        $type=null;
        $product=null;
        $startDate=null;
        $endDate=null;
        $status=null;
        $comment=null;
        $createdAt=null;
        $updatedAt=null;
        $createdByKey=null;  
        $licenseKey =null;
        $accountName =null;
        if(array_key_exists('product',$value2)){
            $product =$value2['product'];
            $product = $this->li_product($product);
        }
        if(array_key_exists('startDate',$value2)){
            $startDate =$value2['startDate'];
        }
        if(array_key_exists('licenseKey',$value2)){
            $licenseKey =$value2['licenseKey'];
        }
        if(array_key_exists('accountName',$value2)){
            $accountName =$value2['accountName'];
        }
        if(array_key_exists('endDate',$value2)){
            $endDate =$value2['endDate'];
        }

        if(array_key_exists('status',$value2)){
            $status =$value2['status'];
            $status = $this->li_status($status);
        }
        if(array_key_exists('comment',$value2)){
            $comment =$value2['comment'];
        }
        if(array_key_exists('createdAt',$value2)){
            $createdAt =$value2['createdAt'];
        }
        if(array_key_exists('updatedAt',$value2)){
            $updatedAt =$value2['updatedAt'];
        }
        if(array_key_exists('createdByKey',$value2)){
            $createdByKey =$value2['createdByKey'];
        }
                
                if(array_key_exists('clientKey',$value2)){
                    $clientKey =$value2['clientKey'];
                }
              
                if(array_key_exists('type',$value2)){
                    $type =$value2['type'];
                    $type = $this->li_type($type);
                }

                $client = ClientAccount::where('firebasekey',$clientKey)->first();
                $creator_id = User::where('firebasekey',$createdByKey)->first();
              
                if(empty($client)){
                    $client = ClientAccount::where('fullname',$accountName)->first();
                 //   return $client;
                }
                $startDate=   str_replace('-', '/', $startDate);
                $endDate=   str_replace('-', '/', $endDate);
                $createdAt=   str_replace('-', '/', $createdAt);
                try{
                    $startDate = Carbon::create($startDate);
                }catch(\Exception $e){
                    $c= explode('/', $startDate);
                    $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                    $startDate = Carbon::create($ti);                        
                }
                try{
                    $endDate = Carbon::create($endDate);
                }catch(\Exception $e){
                    $c= explode('/', $endDate);
                    $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                    $endDate = Carbon::create($ti);                        
                }
                try{
                    $createdAt = Carbon::create($createdAt);
                }catch(\Exception $e){
                    $c= explode('/', $createdAt);
                    $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                    $createdAt = Carbon::create($ti);                        
                }


              ///  if(!empty($client->id)){
          
                    $li = License::where('firebasekey',$licenseKey)->first();

                if($status ==2){
                    $license = LicenseHistory::create([
                        'user_creator_id'=>$creator_id->id,
                        'license_type_id_old'=>$li->license_type_id,
                        'license_status_id_old'=>2,
                        'license_start_date_old'=>$startDate,
                        'license_end_date_old'=>$endDate,
                        'license_id'=>$li->id
                    ]);
                   
                } else{
                    $new_type = !empty($type)? $type : $li->license_type_id;
                    $li->update([
                        'license_start_date'=>$startDate,
                        'license_end_date'=>$endDate,
                        'license_type_id'=>$new_type
                    ]);
                }
                    
                // }else{
                //       return $value2;
                // }
                
            
            
                
            
       
}

}

public function li_type($type){
    if($type == '0'){
        $type =2;
    }else{
        $type = 1;
    }
    return $type;
}
public function li_product($type){
    if($type == '0'){
        $type =3;
    }else{
        $type = 2;
    }
    return $type;
}

public function li_status($type){
    if($type == '0'){
        $type =1;
    }else{
        $type = 2;
    }
    return $type;
}




public function getclientticket(){
    
    

    $URL =   'https://fgspmproduction-default-rtdb.firebaseio.com/client_tickets/.json?auth=TJIGzwSVyk9DSUWohfTHMu8tcRUp2VaIaZMXKFBD&key=AIzaSyBC14ua20Sa6zS_ZcfYYnj8ih1hDRE1Wq8';

    $TOKEN = 'AIzaSyBC14ua20Sa6zS_ZcfYYnj8ih1hDRE1Wq8';
    $headers = array
    (
        'Authorization: key='.$TOKEN,
        'Content-Type: application/json',
        'Access-Control-Allow-Origin: *'
    );
    $ch = curl_init();
    curl_setopt( $ch,CURLOPT_URL, $URL);
    curl_setopt( $ch,CURLOPT_POST, false );
    curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
    curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
    curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
    // curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) );
    $val = curl_exec($ch );
    $object_json =  json_decode($val,true);
    
   
   // return $object_json;
    foreach ($object_json as $key => $value2) {
        $ticket_key = $key;
        $title=null;
        $desc=null;
        $priority=null;
        $ticketType=null;
        $clientKey=null;
        $projectKey=null;
        $processKey=null;
        $createdAt=null;
        $updatedAt=null;
        $status=null;  
        $startDate =null;
        $closureDate =null;
        $assignedToPMKey =null;
        $assignedToDevKey =null;
        $escalated =null;
        $lastEscalat =null;
 
        if(array_key_exists('title',$value2)){
            $title =$value2['title'];
        }
        if(array_key_exists('desc',$value2)){
            $desc =$value2['desc'];
        }
        if(array_key_exists('priority',$value2)){
            $priority =$value2['priority'];
            $priority = $this->supportticketp($priority);
        }
        if(array_key_exists('ticketType',$value2)){
            $ticketType =$value2['ticketType'];
            $ticketType = $this->supporttickettype($ticketType);
        }
        if(array_key_exists('clientKey',$value2)){
            $clientKey =$value2['clientKey'];
        }
        if(array_key_exists('status',$value2)){
            $status =$value2['status'];
            $status = $this->supports($status);
        }
        if(array_key_exists('projectKey',$value2)){
            $projectKey =$value2['projectKey'];
        }
        if(array_key_exists('processKey',$value2)){
            $processKey =$value2['processKey'];
        }
        if(array_key_exists('createdAt',$value2)){
            $createdAt =$value2['createdAt'];
        }
        if(array_key_exists('updatedAt',$value2)){
            $updatedAt =$value2['updatedAt'];
        }
        if(array_key_exists('startDate',$value2)){
            $startDate =$value2['startDate'];
        }
        if(array_key_exists('closureDate',$value2)){
            $closureDate =$value2['closureDate'];
        }
        if(array_key_exists('assignedToPMKey',$value2)){
            $assignedToPMKey =$value2['assignedToPMKey'];
        }
        if(array_key_exists('assignedToDevKey',$value2)){
            $assignedToDevKey =$value2['assignedToDevKey'];
        }
        if(array_key_exists('escalated',$value2)){
            $escalated =$value2['escalated'];
        }
        if(array_key_exists('lastEscalat',$value2)){
            $lastEscalat =$value2['lastEscalat'];
        }
     
       
                $client = ClientAccount::where('firebasekey',$clientKey)->first();
                $pm = User::where('firebasekey',$assignedToPMKey)->first();
                $dev = User::where('firebasekey',$assignedToDevKey)->first();
              

                if(empty($client)){
                    // $client = ClientAccount::where('fullname',$accountName)->first();
                    return $value2;
                }
                 
                $updatedAt=   str_replace('-', '/', $updatedAt);
                $startDate=   str_replace('-', '/', $startDate);
                $closureDate=   str_replace('-', '/', $closureDate);
                $createdAt=   str_replace('-', '/', $createdAt);
                $lastEscalat=   str_replace('-', '/', $lastEscalat);

                try{
                    $lastEscalat = Carbon::create($lastEscalat);
                }catch(\Exception $e){
                    $c= explode('/', $lastEscalat);
                    $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                    $lastEscalat = Carbon::create($ti);                        
                }
                try{
                    $updatedAt = Carbon::create($updatedAt);
                }catch(\Exception $e){
                    $c= explode('/', $updatedAt);
                    $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                    $updatedAt = Carbon::create($ti);                        
                }
                try{
                    $closureDate = Carbon::create($closureDate);
                }catch(\Exception $e){
                    $c= explode('/', $closureDate);
                    $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                    $closureDate = Carbon::create($ti);                        
                }
                try{
                    $createdAt = Carbon::create($createdAt);
                }catch(\Exception $e){
                    $c= explode('/', $createdAt);
                    $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                    $createdAt = Carbon::create($ti);                        
                }
                try{
                    $startDate = Carbon::create($startDate);
                }catch(\Exception $e){
                    $c= explode('/', $startDate);
                    $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                    $startDate = Carbon::create($ti);                        
                }

               
                $contract = ContractSupport::where('partner_id',$client->partner_id)->first();
          
                    $license = Ticket::create([
                        'title'=>$title,
                        'ticket_type_id'=>$ticketType,
                        'ticket_priority_id'=>$priority,
                        'contract_support_id'=>$contract->id,
                        'contact_account_id'=>$client->id,
                        'user_creator_id',
                        'project_manager_id'=>!empty($pm->id)?$pm->id:null,
                        'developer_id'=>!empty($dev->id)?$dev->id:null,
                        'ticket_status_id'=>$status,
                        'notes'=>$desc,
                        'escalated'=>!empty($escalated)?$escalated :false ,
                        'lastEscalat'=>$lastEscalat,
                        'updated_at'=>$updatedAt,
                        'created_at'=>$createdAt,
                        'firebasekey'=>$ticket_key
                    ]);
           
                    
                // }else{
                //       return $value2;
                // }
                
            
            
                
            
       
}


}

public function getclienttickettimeline(){
    
    

    $URL =   'https://fgspmproduction-default-rtdb.firebaseio.com/client_ticket_timeline/.json?auth=TJIGzwSVyk9DSUWohfTHMu8tcRUp2VaIaZMXKFBD&key=AIzaSyBC14ua20Sa6zS_ZcfYYnj8ih1hDRE1Wq8';

    $TOKEN = 'AIzaSyBC14ua20Sa6zS_ZcfYYnj8ih1hDRE1Wq8';
    $headers = array
    (
        'Authorization: key='.$TOKEN,
        'Content-Type: application/json',
        'Access-Control-Allow-Origin: *'
    );
    $ch = curl_init();
    curl_setopt( $ch,CURLOPT_URL, $URL);
    curl_setopt( $ch,CURLOPT_POST, false );
    curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
    curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
    curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
    // curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) );
    $val = curl_exec($ch );
    $object_json =  json_decode($val,true);
    
   
   // return $object_json;
    foreach ($object_json as $key => $value2) {

         $action=null;
        $actionComment=null;
        $actionByKey=null;
        $ticketKey=null;
         $createdAt=null;
        $showForClient=null;
        
        if(array_key_exists('action',$value2)){
            $action =$value2['action'];
        }
        if(array_key_exists('actionComment',$value2)){
            $actionComment =$value2['actionComment'];
        }
 
        if(array_key_exists('actionByKey',$value2)){
            $actionByKey =$value2['actionByKey'];
        }
  
        if(array_key_exists('ticketKey',$value2)){
            $ticketKey =$value2['ticketKey'];
        }
       
        if(array_key_exists('createdAt',$value2)){
            $createdAt =$value2['createdAt'];
        }
        if(array_key_exists('showForClient',$value2)){
            $showForClient =$value2['showForClient'];
        }
       
     
       
            $ticket = Ticket::where('firebasekey',$ticketKey)->first();
            $emp = User::where('firebasekey',$actionByKey)->first();
            $client = ClientAccount::where('firebasekey',$actionByKey)->first();

        if(empty($ticket)){
            return $value2;
        }

                if(empty($client)&&empty($emp)){
                    // $client = ClientAccount::where('fullname',$accountName)->first();
                    return $value2;
                }
             
                $createdAt=   str_replace('-', '/', $createdAt);

               
                try{
                    $createdAt = Carbon::create($createdAt);
                }catch(\Exception $e){
                    $c= explode('/', $createdAt);
                    $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                    $createdAt = Carbon::create($ti);                        
                }
                    $license = DeveloperTicketAction::create([
                        'ticket_id'=>$ticket->id,
                        'user_creator_id'=>!empty($emp->id)?$emp->id:null,
                         'ticket_status_id'=>$ticket->ticket_status_id,
                         'title'=>$action,
                         'comment'=>$actionComment,
                         'visibility'=>!empty($showForClient)?$showForClient:true,
                         'contact_account_id'=>!empty($client->id)?$client->id:null,
                         'created_at'=>$createdAt
                    ]);
           
                    
                // }else{
                //       return $value2;
                // }
                
            
            
                
            
       
}

}
public function getAnnounces(){
    
    

    $URL =   'https://fgspmproduction-default-rtdb.firebaseio.com/announces/.json?auth=TJIGzwSVyk9DSUWohfTHMu8tcRUp2VaIaZMXKFBD&key=AIzaSyBC14ua20Sa6zS_ZcfYYnj8ih1hDRE1Wq8';

    $TOKEN = 'AIzaSyBC14ua20Sa6zS_ZcfYYnj8ih1hDRE1Wq8';
    $headers = array
    (
        'Authorization: key='.$TOKEN,
        'Content-Type: application/json',
        'Access-Control-Allow-Origin: *'
    );
    $ch = curl_init();
    curl_setopt( $ch,CURLOPT_URL, $URL);
    curl_setopt( $ch,CURLOPT_POST, false );
    curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
    curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
    curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
    // curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) );
    $val = curl_exec($ch );
    $object_json =  json_decode($val,true);
    
   
   // return $object_json;
    foreach ($object_json as $key => $value2) {
         $title=null;
        $body=null;
        $imgURL=null;
        $assignTo=[];
         $viewedBy=[];
         $status=null;
         $language=null;
         $createdByKey=null;
         $createdAt=null;

         $empToviewedByKey = null;
         $viewedByKey = null;
         $viewedAt = null;
        
        if(array_key_exists('title',$value2)){
            $title =$value2['title'];
        }
        if(array_key_exists('body',$value2)){
            $body =$value2['body'];
        }
 
        if(array_key_exists('imgURL',$value2)){
            $imgURL =$value2['imgURL'];
        }
  
        if(array_key_exists('assignTo',$value2)){
            $assignTo =$value2['assignTo'];
        }
       
        if(array_key_exists('viewedBy',$value2)){
            $viewedBy =$value2['viewedBy'];
        }
        if(array_key_exists('status',$value2)){
            $status =$value2['status'];
        }
        if(array_key_exists('language',$value2)){
            $language =$value2['language'];
        }
        if(array_key_exists('createdByKey',$value2)){
            $createdByKey =$value2['createdByKey'];
        }
        if(array_key_exists('createdAt',$value2)){
            $createdAt =$value2['createdAt'];
        }
       
     
        
             $emp = User::where('firebasekey',$createdByKey)->first();
 
       
               
             $viewedAt=   str_replace('-', '/', $viewedAt);
             $createdAt=   str_replace('-', '/', $createdAt);
             try{
                $viewedAt = Carbon::create($viewedAt);
            }catch(\Exception $e){
                $c= explode('/', $viewedAt);
                $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                $viewedAt = Carbon::create($ti);                        
            }
                try{
                    $createdAt = Carbon::create($createdAt);
                }catch(\Exception $e){
                    $c= explode('/', $createdAt);
                    $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                    $createdAt = Carbon::create($ti);                        
                }
                    

             $ann =Announce::create([
                'user_creator_id'=>$emp->id,
                'title'=>$title,
                'body'=>$body,
                'lang'=>$language,
                'user'=>true,
                 'start'=>1,
             ]);
             if(!empty($ann)){
                foreach($assignTo as $key3=>$value3){
                    if(array_key_exists('empToviewedByKey',$value3)){
                        $empToviewedByKey =$value3['empToviewedByKey'];
                    }
                    $emp2 = User::where('firebasekey',$empToviewedByKey)->first();

                    $anuser=   AnnounceUser::create([
                          'user_creator_id'=>$emp2->id,
                          'announce_id'=>$ann->id,
                      ]);
                }
                foreach($viewedBy as $key4=>$value4){
                    if(array_key_exists('viewedByKey',$value4)){
                        $viewedByKey =$value4['viewedByKey'];
                    }
                    $emp3 = User::where('firebasekey',$viewedByKey)->first();
                    $anuser=   AnnounceUser::where('user_creator_id',$emp3->id)->where('announce_id',$ann->id)->first();
                    if(!empty($anuser->id)){
                        $anuser->update([
                            'seen'=>true,
                        ]);
                    }
                }
                if(!empty($imgURL)){

                    $this->uploadannounce($ann,$imgURL);
                }
             }
            
            
       
}



}


public function uploadannounce( Announce  $project,$url){
    //   $url = "https://firebasestorage.googleapis.com/v0/b/fgspmproduction.appspot.com/o/users%2FI0floz9FABWULfqKnuYFuTvH0vM2%2FWhatsApp_Image_2022-07-25_at_7.29.38_PM__2_-removebg-preview.png?alt=media&token=e7a0fbf9-66e8-4345-945a-6eabcb528b0c";
    $contents = file_get_contents($url);
       $name = Str::random(10);
       $path = 'Attachments';
       if (! File::exists($path)) {
           File::makeDirectory($path);
        }
        $path =$path.'/Announce';
       if (! File::exists($path)) {
           File::makeDirectory($path);
       }
       $path = $path.'/'.$project->id;
       if (! File::exists($path)) {
           File::makeDirectory($path);
       }
     
      $done = file_put_contents($path.'/'.$name, $contents);
      
      $project->update([
        'attach'=>$name,
      ]);
   
      return true;
   }



public function supportp($type){
    if($type == '1'){
$type = 1;
    }else{
        $type =2;
    }
    return $type;
}
 
public function supports($type){
    if($type == '0'){
$type = 1;
    }else{
        $type =2;
    }
    return $type;
}
public function supporttickettype($type){
    if($type == '1'){
$type = 1;
    }elseif($type == '2'){
        $type = 2;
            }else{
        $type =3;
    }
    return $type;
}

public function supportticketp($type){
    if($type == '1'){
$type = 1;
    }elseif($type == '2'){
        $type = 2;
            }else{
        $type =3;
    }
    return $type;
}


}

 


