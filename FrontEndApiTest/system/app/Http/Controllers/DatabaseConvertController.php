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

use App\Models\FamilyInformation;
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




class DatabaseConvertController extends Controller
{
    

    public function getUser(){
        $URL =   config('firebase.legacy_database_url').'/users/.json?auth='.config('firebase.legacy_db_auth_token').'&key='.config('firebase.api_key');
        
        //  $URL = config('firebase.legacy_database_url'); // legacy URL with embedded secrets removed; use FIREBASE_* env vars
        $TOKEN = config('firebase.api_key');
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
     foreach ($object_json as $key => $value) {
        $user_key=$key;
        $username = null;
        $email = null;
        $firstname = null;
        $lastname = null;
        $subdepartment = null;
        $workdegree = null;
        $mobilearray =[];
        $creator_id = null;
        $canAddPreviousReports = false;
        $canAddPreviousReportsDate = null;
        $gender = null;
        $birthDate = null;
        $mobileNumber = [];
        $address = null;
        $maritalStatus = null;
        $hiringDate = null;
        $photoURL = null;
        $contractStartDate = null;
        $contractEndDate = null;
        $emergancyPhoneNumber = null;
        $password = null;
        $emergancyPhoneNumberRelation = null;
        $emergancyPhoneNumberName = null;
        $socialSecureityNumber = null;
        $contractEndDate = null;
        if(array_key_exists('photoURL',$value)){
            $photoURL =$value['photoURL'];
        }
        if(array_key_exists('password',$value)){
            $password =$value['password'];
        }
         if(array_key_exists('username',$value)){
             $username =$value['username'];
            }
        if(array_key_exists('accRole',$value)){
            $subdepartment = $value['accRole'];
         }
         if(array_key_exists('accPosition',$value)){
            $workdegree =$value['accPosition'];
         }
         if(array_key_exists('CreatorID',$value)){
            $creator_id =$value['CreatorID'];
         }
         if(array_key_exists('mobileNumber',$value)){
            $mobilearray =[];
            if(array_key_exists('secondMobileNumber',$value)){
                $mobilearray[] = ["phone"=>$value['secondMobileNumber'],"phone_type"=>"work"];
                $mobilearray[] = ["phone"=>$value['mobileNumber'],"phone_type"=>"work"];
            }else{
                $mobilearray[] = ["phone"=>$value['mobileNumber'],"phone_type"=>"work"];
            }
        
            $mobileNumber = $mobilearray;
            }elseif(array_key_exists('secondMobileNumber',$value)){
            $mobilearray[] = ["phone"=>$value['secondMobileNumber'],"phone_type"=>"work"];
            $mobileNumber = $mobilearray;
            
        }
        if(array_key_exists('firstname',$value)){
            $firstname =$value['firstname'];
         }
         if(array_key_exists('lastname',$value)){
            $lastname =$value['lastname'];
        }
         if(array_key_exists('email',$value)){
             $email =$value['email'];
            }
            if(array_key_exists('canAddPreviousReports',$value)){
            $canAddPreviousReports =$value['canAddPreviousReports'];
         }
         if(array_key_exists('canAddPreviousReportsDate',$value)){
            $canAddPreviousReportsDate =$value['canAddPreviousReportsDate'];
         }
         if(array_key_exists('gender',$value)){
             $gender =$value['gender'];
         }
         if(array_key_exists('birthDate',$value)){
             $birthDate =$value['birthDate'];
            }
            if(array_key_exists('address',$value)){
            $address =$value['address'];
         }
         if(array_key_exists('maritalStatus',$value)){
             $maritalStatus =$value['maritalStatus'];
         }
         if(array_key_exists('hiringDate',$value)){
            $hiringDate =$value['hiringDate'];
         }
         if(array_key_exists('contractStartDate',$value)){
            $contractStartDate =$value['contractStartDate'];
         }
         if(array_key_exists('contractEndDate',$value)){
            $contractEndDate =$value['contractEndDate'];
         }
         if(array_key_exists('emergancyPhoneNumber',$value)){
            $emergancyPhoneNumber =$value['emergancyPhoneNumber'];
         }
         if(array_key_exists('emergancyPhoneNumberRelation',$value)){
            $emergancyPhoneNumberRelation =$value['emergancyPhoneNumberRelation'];
        }
         if(array_key_exists('emergancyPhoneNumberName',$value)){
             $emergancyPhoneNumberName =$value['emergancyPhoneNumberName'];
            }
            if(array_key_exists('socialSecureityNumber',$value)){
            $socialSecureityNumber =$value['socialSecureityNumber'];
        }
         if(array_key_exists('contractEndDate',$value)){
            $contractEndDate =$value['contractEndDate'];
         }

       
         $birthDate=   str_replace('-', '/', $birthDate);
         $hiringDate=   str_replace('-', '/', $hiringDate);
         $contractStartDate=   str_replace('-', '/', $contractStartDate);
         $contractEndDate=   str_replace('-', '/', $contractEndDate);
         $canAddPreviousReportsDate=   str_replace('-', '/', $canAddPreviousReportsDate);
         $mobileNumber = json_encode($mobileNumber); 
         
         if($subdepartment != '10'){
             $workdegree = $this->reassignWorkdegree($workdegree);
             $subdepartment= $this->reassignSubDepartment($subdepartment);
             $user_details = UserDetail::create([
                 'emergancyPhoneNumber'=>$emergancyPhoneNumber,
                 'emergancyPhoneNumberName'=>$emergancyPhoneNumberName,
                 'emergancyPhoneNumberRelation'=>$emergancyPhoneNumberRelation,
                 'socialSecureityNumber'=>$socialSecureityNumber,
                 'address'=>$address,
                 'birthDate' => !empty($birthDate) ? Carbon::createFromFormat('m/d/Y',  Carbon::parse( $birthDate)->format('m/d/Y')) :null,
                 'hiringDate' => !empty($hiringDate) ? Carbon::createFromFormat('m/d/Y', Carbon::parse( $hiringDate)->format('m/d/Y')):null,
                 'contractStartDate' => !empty($contractStartDate) ? Carbon::createFromFormat('m/d/Y', Carbon::parse( $contractStartDate)->format('m/d/Y')):null,
                 'contractEndDate' => !empty($contractEndDate) ? Carbon::createFromFormat('m/d/Y', Carbon::parse( $contractEndDate)->format('m/d/Y')):null,
                 'maritalStatus'=>$maritalStatus,
             ]);
             if(!empty($user_details->id)){
                 $user = User::create([
                     'firebasekey'=>$user_key,
                     'username'=>$username,
                     'firstname'=>$firstname,
                     'lastname'=>$lastname,
                     'email'=>$email,
                     'password'=>!empty($password)?Hash::make($password):Hash::make("test1234"),
                   //  'user_creator_id'=>$creator_id,
                     'gender'=>$gender,
                     'mobileNumber'=>$mobileNumber,
                     'user_details_id'=>$user_details->id,
                     'work_degrees_id'=>$workdegree,
                     'branches_id'=>1,
                     'sub_departments_id'=>$subdepartment,
                     'canAddPreviousReports'=>$canAddPreviousReports,
                     'canAddPreviousReportsDate' => !empty($canAddPreviousReportsDate) ? Carbon::createFromFormat('m/d/Y', Carbon::parse( $canAddPreviousReportsDate)->format('m/d/Y')):null,
                    ]);
                    if(!empty($user->id)){
                    if(array_key_exists('relatives',$value)){
                        foreach($value['relatives'] as $key=>$values){

                            $gender = $values['gender'];
                            $birthDate = $values['birthDate'];
                            $name = $values['name'];
                            $relation = $values['relation'];
                            
                            $family_user =  FamilyInformation::create([
                                'birth_date' => !empty($birthDate) ? Carbon::createFromFormat('m/d/Y', Carbon::parse( $birthDate)->format('m/d/Y')):null,
                                'family_name'=>$name,
                                'relation'=>$relation,
                                'gender'=>$gender,
                                'user_id'=>$user->id,
                            ]);
                            // return $values;
                            // "birthDate": "2021-09-21",
                            // "gender": "male",
                            // "name": "test1",
                            // "relation": "child"
                        }
                    }
                        $currentPermissionBalance =null;
                        $currentLeaveBalance = null;
                        $pendingBalance =null;
                          $annualLeaveBalance = null;
                        if(array_key_exists('currentPermissionBalance',$value)||array_key_exists('currentLeaveBalance',$value)){
                            if(array_key_exists('currentPermissionBalance',$value)){

                                $currentPermissionBalance = $value['currentPermissionBalance'];
                            }
                            if(array_key_exists('currentLeaveBalance',$value)){

                            $currentLeaveBalance = $value['currentLeaveBalance'];
                        }
                            if(array_key_exists('pendingBalance',$value)){
                                
                            $pendingBalance = $value['pendingBalance'];
                            }                 
                               if(array_key_exists('annualLeaveBalance',$value)){

                              $annualLeaveBalance = $value['annualLeaveBalance'];
                            }
                            $perm = PermissionBalance::first();
                          $user_annual =   UserAnnual::create([
                            'pending_balance'=>!empty($pendingBalance)?$pendingBalance:0,
                            'monthly_balance_spend'=>!empty($currentPermissionBalance)?($perm->monthly_balance*60 -$currentPermissionBalance):0,
                            'discount_from_pending'=>0,
                            'total_leave_balance'=>!empty($annualLeaveBalance)?$annualLeaveBalance:0,
                            'pending_balance'=>!empty($pendingBalance)?$pendingBalance:0,
                            'available_leave_balance'=>!empty($currentLeaveBalance)?$currentLeaveBalance:0,
                            'user_creator_id'=>1,
                            'user_id'=>$user->id,
                            
                          ]);

                          if(!empty($photoURL)){
                             // try{
                              $done =   $this->imageconvert($user,$photoURL);
                              //}catch(\Exception $e){}
                          }
                         
                          
                        }
                        
                    // else{
                    //     continue;
                    // }
                 }
             }
            }else{
                $partner = Partner::create([
                'partner_name'=>$username,
                'user_creator_id'=>1,
                'firebasekey'=>$user_key,
                
            ]);
            if(!empty($photoURL)){
                // try{
                 $done =   $this->imageconvertpartner($partner,$photoURL);
                 //}catch(\Exception $e){}
             }
            if(!empty($partner->id)){
                $client_account = ClientAccount::create([
                    'firebasekey'=>$user_key,
                    'fullname'=>$username,
                    'email'=>$email,
                    'password'=>Hash::make("test1234"),
                    'primary'=>true,
                    'partner_id'=>$partner->id,
                    'user_creator_id'=>1,
                ]);
            }
         }
        
         
    }
   //  curl_close( $ch );


    }
    

    public function reassignSubDepartment($subdepartment){

        if($subdepartment == '0'){
            $subdepartment= 8;

        }else if($subdepartment == '1'){
            $subdepartment= 4;

        }else if($subdepartment == '2'){
            $subdepartment= 3;

        }else if($subdepartment == '3'){
            $subdepartment= 3;

        }else if($subdepartment == '4'){
            $subdepartment= 3;
            
        }else if($subdepartment == '5'){
            $subdepartment= 9;
            
        }else if($subdepartment == '6'){
            $subdepartment= 11;
            
        }else if($subdepartment == '7'){
            $subdepartment= 10;
            
        }else if($subdepartment == '8'){
            $subdepartment= 1;

        }else if($subdepartment == '9'){
            $subdepartment= 2;
        }
        return $subdepartment;
    }
    public function reassignWorkdegree($workdegree){

        if($workdegree == '0'){
            $workdegree= 1;
        }else if($workdegree == '2'){
            $workdegree= 3;

        }else if($workdegree == '3'){
            $workdegree= 4;
            
        }else if($workdegree == '4'){
            $workdegree= 6;

        }else if($workdegree == '5'){
            $workdegree= 5;
        }
        return $workdegree;
    }
   
    public function tasktype($type){
        if($type == 'task'){
            $type= 1;
        }else if($type == 'business_analysis'){
            $type= 2;

        }else if($type == 'testing'){
            $type=3;
            
        }else if($type == 'Presales'){
            $type= 4;

        }else if($type == 'Others'){
            $type= 5;
        }
        return $type;
    }




    public function gettask(){
        $URL =   config('firebase.legacy_database_url').'/tasks/.json?auth='.config('firebase.legacy_db_auth_token').'&key='.config('firebase.api_key');
      //  $URL =   config('firebase.legacy_database_url').'/devdailyreport/.json?auth='.config('firebase.legacy_db_auth_token').'&key='.config('firebase.api_key');
        
        $TOKEN = config('firebase.api_key');
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
        $task_key=$key;
        $title = null;
        $desc = null;
        $empID = null;
        $supportID = null;
        $start_date = null;
        $end_date = null;
        $ex_duration = null;
        $real_duration = null;
        $project_key = null;
        $status = null;
        $type = null;
        $pddURL = null;
        $pddName = null;
        $process_key = null;
        $order =null;
        $createdAT = null;
        $progress=null;

        $seniorToApproveID = null;
        $seniorIsMandatory = null;
       
        if(array_key_exists('progress',$value)){
            $progress =$value['progress'];
        }
        if(array_key_exists('empID',$value)){
            $empID =$value['empID'];
        }
        if(array_key_exists('supportID',$value)){
            $supportID =$value['supportID'];
        }
        if(array_key_exists('start_date',$value)){
            $start_date =$value['start_date'];
        }
        if(array_key_exists('end_date',$value)){
            $end_date =$value['end_date'];
        }
        if(array_key_exists('real_duration',$value)){
            $real_duration =$value['real_duration'];
        }
        if(array_key_exists('project_key',$value)){
            $project_key =$value['project_key'];
        }
        if(array_key_exists('status',$value)){
            $status =$value['status'];
            $status = $this->projectstatus($status);
        }
        if(array_key_exists('type',$value)){
            $type =$value['type'];
            $type = $this->tasktype($type);
        }

        if(array_key_exists('title',$value)){
            $title =$value['title'];
        }
        if(array_key_exists('desc',$value)){
            $desc = $value['desc'];
         }
         if(array_key_exists('ex_duration',$value)){
             $ex_duration =$value['ex_duration'];
         }
        
        if(array_key_exists('pddURL',$value)){
                $pddURL =$value['pddURL'];
         }
          
        if(array_key_exists('seniorToApproveID',$value)){
                $seniorToApproveID =$value['seniorToApproveID'];
        }
        if(array_key_exists('seniorIsMandatory',$value)){
            $seniorIsMandatory =$value['seniorIsMandatory'];
        }

         if(array_key_exists('pddName',$value)){
             $pddName =$value['pddName'];
         }
         if(array_key_exists('process_key',$value)){
            $process_key =$value['process_key'];
         }
         if(array_key_exists('order',$value)){
            $order =$value['order'];
         }
        if(array_key_exists('createdAT',$value)){
            $createdAT =$value['createdAT'];
        }
        
       
        $createdAT=   str_replace('-', '/', $createdAT);
        $start_date=   str_replace('-', '/', $start_date);
        $end_date=   str_replace('-', '/', $end_date);
       

            if($createdAT == "Invalid Date"){
                $createdAT = Carbon::now();
            }
            if($start_date == "Invalid Date"){
                $start_date = Carbon::now();

            }
            if($end_date == "Invalid Date"){
                $end_date = Carbon::now();

            }
            
        try{
            $createdAT = Carbon::create($createdAT);

        }catch(\Exception $e){
            try{
                $c= explode('/', $createdAT);
                $ti = $c[1] .'/'.$c[0].'/'.$c[2];
               $createdAT = Carbon::create($ti);
            }catch(\Exception $e){
                try{
                    $createdAt = Carbon::create($start_date);
        
                }catch(\Exception $e){

                    $c= explode('/', $start_date);
                    $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                   $createdAt = Carbon::create($ti);
                }
            }
        }

        try{
            $start_date = Carbon::create($start_date);

        }catch(\Exception $e){

            $c= explode('/', $start_date);
            $ti = $c[1] .'/'.$c[0].'/'.$c[2];
           $start_date = Carbon::create($ti);
        }
        try{
            $end_date = Carbon::create($end_date);
        }catch(\Exception $e){
            try{
                $c= explode('/', $end_date);
                $ti = $c[1] .'/'.$c[0].'/'.$c[2];
               $end_date = Carbon::create($ti);
    
            }catch(\Exception $e){
              
        try{
            $end_date = Carbon::create($start_date);

        }catch(\Exception $e){

            $c= explode('/', $start_date);
            $ti = $c[1] .'/'.$c[0].'/'.$c[2];
           $end_date = Carbon::create($ti);
        }
            }
          
        }
    
       if(empty($title)){
       // return  $key;
       }else{
        $project = Project::where('firebasekey',$project_key)->first();
        $process = Process::where('firebasekey',$process_key)->first();
           if(empty($process->id)){
            continue;
            }
        //    $process_team = ProcessTeam::where('process_id',$process->id)->whereHas('project_team_id_fun',function($q){
        //     $q->where('project_structure_id',1);
        //    })->first();
            $task =Task::create([
                'task_title'=>$title,
                'task_progress'=>!empty($progress)?$progress:0,
                'task_description'=>$desc,
                'task_hours'=>$ex_duration,
                 'task_status_id'=>$status,
                'task_type_id'=>$type,
                'process_id'=>$process->id,
                'task_start_date'=>$start_date,
                'task_end_date'=>$end_date,
                'seniorapprove'=>!empty($seniorIsMandatory)?$seniorIsMandatory:0,
                'user_creator_id'=>!empty($process->user_creator_id)?$process->user_creator_id:$project->user_creator_id,
                'created_at'=>$createdAT,
                'firebasekey'=>$task_key,
            ]);
        


        if(!empty($task->id)){                       
            if(!empty($empID)){
                $user_id = User::where('firebasekey',$empID)->first();
                if(!empty($user_id->id)){
                    $process_team = ProcessTeam::where('process_id',$process->id)->whereHas('project_team_id_fun',function($q) use($user_id){
                        $q->where('user_team_id',$user_id->id);
                    })->first();
                    if(!empty($process_team->id)){
                        if(!empty($pddURL)){
                            $done = $this->pddprocessattach($process , $pddURL , $project , $pddName ,$user_id->id);
                        }

                        $task_team = TaskTeam::create([
                            'process_team_id'=>$process_team->id,
                            'user_creator_id'=>!empty($process->user_creator_id)?$process->user_creator_id:$project->user_creator_id,
                            'task_id'=>$task->id,
                            'task_structure_id'=>$type==2?3:1,
                        ]);
                    }
                }
            }
            if(!empty($supportID)){
                $support_id = User::where('firebasekey',$supportID)->first();
                if(!empty($support_id->id)){
                    $process_team = ProcessTeam::where('process_id',$process->id)->whereHas('project_team_id_fun',function($q) use($support_id){
                        $q->where('user_team_id',$support_id->id);
                    })->first();
                    if(!empty($process_team->id)){

                        $task_team = TaskTeam::create([
                            'process_team_id'=>$process_team->id,
                            'user_creator_id'=>!empty($process->user_creator_id)?$process->user_creator_id:$project->user_creator_id,
                            'task_id'=>$task->id,
                            'task_structure_id'=>2,
                        ]);
                    }
                }
            }
            if(!empty($seniorToApproveID)){
                $senior_id = User::where('firebasekey',$seniorToApproveID)->first();
                if(!empty($senior_id->id)){
                    $process_team = ProcessTeam::where('process_id',$process->id)->whereHas('project_team_id_fun',function($q) use($senior_id){
                        $q->where('user_team_id',$senior_id->id);
                    })->first();
                    if(!empty($process_team->id)){

                        $task_team = TaskTeam::create([
                            'process_team_id'=>$process_team->id,
                            'user_creator_id'=>!empty($process->user_creator_id)?$process->user_creator_id:$project->user_creator_id,
                            'task_id'=>$task->id,
                            'task_structure_id'=>4,
                        ]);
                    }
                }
            }
            
        
    }

}
           
    }
   
    

}
    
    
    
    
    public function getprocess(){
        $URL =   config('firebase.legacy_database_url').'/Subtasks/.json?auth='.config('firebase.legacy_db_auth_token').'&key='.config('firebase.api_key');
        
        $TOKEN = config('firebase.api_key');
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
     foreach ($object_json as $key => $value) {
        $process_key=$key;
        $project_key = null;
        $ex_duration = null;
        $start_date = null;
        $end_date = null;
        $title = null;
        $desc = null;
        $BAsTeam = [];
        $Tech_leadID = null;
        $Devs_mempers =[];
        $createdAt = null;
        $status = null;
      
        if(array_key_exists('title',$value)){
            $title =$value['title'];
        }
        if(array_key_exists('desc',$value)){
            $desc = $value['desc'];
         }
         if(array_key_exists('ex_duration',$value)){
             $ex_duration =$value['ex_duration'];
         }
         if(array_key_exists('start_date',$value)){
             $start_date =$value['start_date'];
            }
            
            if(array_key_exists('end_date',$value)){
            $end_date =$value['end_date'];
         }
         if(array_key_exists('project_key',$value)){
             $project_key =$value['project_key'];
            }
            
            if(array_key_exists('BAsTeam',$value)){
                $BAsTeam =$value['BAsTeam'];
         }
         if(array_key_exists('Tech_leadID',$value)){
             $Tech_leadID =$value['Tech_leadID'];
         }
         if(array_key_exists('Devs_mempers',$value)){
            $Devs_mempers =$value['Devs_mempers'];
         //   return $Devs_mempers;
         }
         
         if(array_key_exists('createdAt',$value)){
            $createdAt =$value['createdAt'];
        }
        if(array_key_exists('updatedAt',$value)){
            $updatedAt =$value['updatedAt'];
        }
         if(array_key_exists('status',$value)){
             $status =$value['status'];
            }
        
            
            $createdAt=   str_replace('-', '/', $createdAt);
            
            
            $status = $this->projectstatus($status);

         $project = Project::where('firebasekey',$project_key)->first();

         try{
            $createdAt = Carbon::create($createdAt);

        }catch(\Exception $e){
            try{
                $c= explode('/', $createdAt);
                $ti = $c[1] .'/'.$c[0].'/'.$c[2];
               $createdAt = Carbon::create($ti);
            }catch(\Exception $e){
                try{
                    $createdAt = Carbon::create($start_date);
        
                }catch(\Exception $e){
                    $c= explode('/', $start_date);
                    $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                   $createdAt = Carbon::create($ti);
                }
            }
        }

       
        try{
            $start_date = Carbon::create($start_date);

        }catch(\Exception $e){
            $c= explode('/', $start_date);
            $ti = $c[1] .'/'.$c[0].'/'.$c[2];
           $start_date = Carbon::create($ti);
        }
        try{
            $end_date = Carbon::create($end_date);

        }catch(\Exception $e){
            $c= explode('/', $end_date);
            $ti = $c[1] .'/'.$c[0].'/'.$c[2];
           $end_date = Carbon::create($ti);
        }
       // return $customerKey;
       if(empty($title)){
       // return  $key;
       }else{
           $project = Project::where('firebasekey',$project_key)->first();
           if(empty($project->id)){
           // return $project_key;
            continue;
        }
           $project_team = ProjectTeam::where('project_id',$project->id)->where('project_structure_id',1)->first();
           $process =Process::create([
               'process_title'=>$title,
            'process_progress'=>0,
            'process_description'=>$desc,
            'process_status_id'=>$status,
            'project_id'=>$project->id,
            'process_duration'=>$ex_duration,
            'process_end_date'=>$end_date,
            'process_start_date'=>$start_date,
            'firebasekey'=>$process_key,
            'created_at'=>$createdAt,
            'user_creator_id'=>!empty($project_team->user_team_id)?$project_team->user_team_id:$project->user_creator_id,
        ]);
        
        if(!empty($process->id)){
            // return 'hi';
            
            if(!empty($Tech_leadID)){
                $tech_lead = User::where('firebasekey',$Tech_leadID)->first();
                if(!empty($tech_lead->id)){
                    $project_teams = ProjectTeam::where('project_id',$project->id)->whereHas('user_team_id_fun',function($q) use($Tech_leadID){
                        $q->where('firebasekey',$Tech_leadID);
                    })->first();
                    if(!empty($project_teams->id)){

                        $process_team = ProcessTeam::create([
                            'user_creator_id'=>!empty($project_team->user_team_id)?$project_team->user_team_id:$project->user_creator_id,
                            'project_team_id'=>$project_teams->id,
                            'process_id'=>$process->id,
                        ]);
                    }
                }
                
            }
            if(!empty($BAsTeam)){
                foreach($BAsTeam as $bteam=>$value){
                    $bateam = User::where('firebasekey',$bteam)->first();

                     if(!empty($bateam->id)){
                         $project_teams = ProjectTeam::where('project_id',$project->id)->whereHas('user_team_id_fun',function($q) use($bteam){
                            $q->where('firebasekey',$bteam);
                        })->first();
                        if(!empty($project_teams->id)){
                            $process_team = ProcessTeam::create([
                            'user_creator_id'=>!empty($project_team->user_team_id)?$project_team->user_team_id:$project->user_creator_id,
                            'project_team_id'=>$project_teams->id,
                            'process_id'=>$process->id,
                        ]);
                    }
                    }
                }
            }
            if(!empty($Devs_mempers)){
                foreach($Devs_mempers as $dteam=>$val){
                    $dateam = User::where('firebasekey',$dteam)->first();
                    if(!empty($dateam->id)){
                            $project_teams = ProjectTeam::where('project_id',$project->id)->whereHas('user_team_id_fun',function($q) use($dteam){
                                $q->where('firebasekey',$dteam);
                            })->first();
                            if(!empty($project_teams->id)){
                            $process_team = ProcessTeam::create([
                                'user_creator_id'=>!empty($project_team->user_team_id)?$project_team->user_team_id:$project->user_creator_id,
                                'project_team_id'=>$project_teams->id,
                                'process_id'=>$process->id,
                            ]);
                        }
                        
                    }
                }
                
            }
            
        
    }

}
           
    }
   
    

}

    public function getProject(){
        $URL =   config('firebase.legacy_database_url').'/projects/.json?auth='.config('firebase.legacy_db_auth_token').'&key='.config('firebase.api_key');

        $TOKEN = config('firebase.api_key');
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
     foreach ($object_json as $key => $value) {
        $project_key=$key;
        $title = null;
        $desc = null;
        $duration = null;
        $start_date = null;
        $end_date = null;
        $budget = null;
        $managerID = null;
        $PMID = null;
        $BAsTeam = [];
        $Tech_leadID = null;
        $Devs_mempers =[];
        $type = null;
        $createdAt = null;
        $updatedAt = null;
        $status = null;
        $creatorID = null;
        $progress = null;
        $idelHoues = null;
        $customerKey = null;
        if(array_key_exists('title',$value)){
            $title =$value['title'];
        }
        if(array_key_exists('desc',$value)){
            $desc = $value['desc'];
        }
        if(array_key_exists('duration',$value)){
            $duration =$value['duration'];
        }
        if(array_key_exists('start_date',$value)){
            $start_date =$value['start_date'];
         }
       
         if(array_key_exists('end_date',$value)){
            $end_date =$value['end_date'];
         }
         if(array_key_exists('budget',$value)){
            $budget =$value['budget'];
         }
         if(array_key_exists('managerID',$value)){
             $managerID =$value['managerID'];
         }
         if(array_key_exists('PMID',$value)){
            $PMID =$value['PMID'];
         }
         if(array_key_exists('BAsTeam',$value)){
            $BAsTeam =$value['BAsTeam'];
         }
         if(array_key_exists('Tech_leadID',$value)){
            $Tech_leadID =$value['Tech_leadID'];
        }
        if(array_key_exists('Devs_mempers',$value)){
            $Devs_mempers =$value['Devs_mempers'];
            //   return $Devs_mempers;
         }
         if(array_key_exists('type',$value)){
             $type =$value['type'];
            }
         if(array_key_exists('createdAt',$value)){
            $createdAt =$value['createdAt'];
        }
         if(array_key_exists('updatedAt',$value)){
            $updatedAt =$value['updatedAt'];
         }
         if(array_key_exists('status',$value)){
            $status =$value['status'];
        }
        if(array_key_exists('creatorID',$value)){
            $creatorID =$value['creatorID'];
        }
         if(array_key_exists('progress',$value)){
            $progress =$value['progress'];
        }
         if(array_key_exists('idelHoues',$value)){
            $idelHoues =$value['idelHoues'];
        }
        if(array_key_exists('customerKey',$value)){
            $customerKey =$value['customerKey'];
         }
         
         $updatedAt=   str_replace('-', '/', $updatedAt);
         $createdAt=   str_replace('-', '/', $createdAt);
         
         
         $status = $this->projectstatus($status);
         $type = ($type =='poc'?1:2);

         $user_creator = User::where('firebasekey',$creatorID)->first();
         $partner = Partner::where('firebasekey',$customerKey)->first();
         
         try{
            $createdAt = Carbon::create($createdAt);
            
        }catch(\Exception $e){
            $c= explode('/', $createdAt);
            $ti = $c[1] .'/'.$c[0].'/'.$c[2];
            $createdAt = Carbon::create($ti);
        }
        
        try{
            $updatedAt = Carbon::create($updatedAt);

        }catch(\Exception $e){
            $c= explode('/', $updatedAt);
            $ti = $c[1] .'/'.$c[0].'/'.$c[2];
            $updatedAt = Carbon::create($ti);
        }
        try{
            $start_date = Carbon::create($start_date);
            
        }catch(\Exception $e){
            $c= explode('/', $start_date);
            $ti = $c[1] .'/'.$c[0].'/'.$c[2];
           $start_date = Carbon::create($ti);
        }
        try{
            $end_date = Carbon::create($end_date);
            
        }catch(\Exception $e){
            $c= explode('/', $end_date);
            $ti = $c[1] .'/'.$c[0].'/'.$c[2];
            $end_date = Carbon::create($ti);
        }
       // return $customerKey;
       if(empty($title)){
       // return  $key;
       }else{
           $project =Project::create([
               'project_title'=>$title,
               'project_progress'=>$progress,
            'project_description'=>$desc,
            'project_duration'=>$duration,
            'project_budget'=>$budget,
            'user_creator_id'=>$user_creator->id,
            'project_type_id'=>$type,
            'project_status_id'=>$status,
            'partner_id'=>!empty($partner->id)?$partner->id:null,
            'project_start_date'=>$start_date,
            'project_end_date'=>$end_date,
            'project_actual_cost'=>$budget,
            'idelHours'=>$idelHoues,
            'firebasekey'=>$project_key,
            'created_at'=>$createdAt
        ]);

        if(!empty($project->id)){
           // return 'hi';
           
           if(!empty($PMID)){
                $manager = User::where('firebasekey',$PMID)->first();
                if(!empty($manager->id)){
                    $project_team = ProjectTeam::create([
                        'user_team_id'=>$manager->id,
                        'user_creator_id'=>$user_creator->id,
                        'project_id'=>$project->id,
                        'project_structure_id'=>1,
                    ]);
                }
                
            }
            if(!empty($Tech_leadID)){
                $tech_lead = User::where('firebasekey',$Tech_leadID)->first();
                if(!empty($tech_lead->id)){
                    $project_team = ProjectTeam::create([
                        'user_team_id'=>$tech_lead->id,
                        'user_creator_id'=>$user_creator->id,
                        'project_id'=>$project->id,
                        'project_structure_id'=>2,
                    ]);
                }
                
            }
            if(!empty($BAsTeam)){
                foreach($BAsTeam as $bteam=>$value){
                    
                    $bateam = User::where('firebasekey',$bteam)->first();
                    if(!empty($bateam->id)){
                        $project_team = ProjectTeam::create([
                            'user_team_id'=>$bateam->id,
                            'user_creator_id'=>$user_creator->id,
                            'project_id'=>$project->id,
                            'project_structure_id'=>3,
                        ]);
                    }
                }
            }
            if(!empty($Devs_mempers)){
                foreach($Devs_mempers as $dteam=>$val){
                    $dateam = User::where('firebasekey',$dteam)->first();
                    if(!empty($dateam->id)){
                        $project_team = ProjectTeam::create([
                            'user_team_id'=>$dateam->id,
                            'user_creator_id'=>$user_creator->id,
                            'project_id'=>$project->id,
                            'project_structure_id'=>4,
                        ]);
                    }
                }
                
            }
            
        
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
    
    public function getUserDeactivate(){
        
        $URL =   config('firebase.legacy_database_url').'/disable-users/.json?auth='.config('firebase.legacy_db_auth_token').'&key='.config('firebase.api_key');
      //  $URL = config('firebase.legacy_database_url'); // legacy URL with embedded secrets removed; use FIREBASE_* env vars
      $TOKEN = config('firebase.api_key');
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
     foreach ($object_json as $key => $value) {
        $user_key=$key;
        $username = null;
        $email = null;
        $firstname = null;
        $lastname = null;
        $subdepartment = null;
        $workdegree = null;
        $creator_id = null;
        $canAddPreviousReports = false;
        $canAddPreviousReportsDate = null;
        $gender = null;
        $birthDate = null;
        $mobileNumber = [];
        $address = null;
        $maritalStatus = null;
        $hiringDate = null;
        $contractStartDate = null;
        $contractEndDate = null;
        $emergancyPhoneNumber = null;
        $emergancyPhoneNumberRelation = null;
        $emergancyPhoneNumberName = null;
        $socialSecureityNumber = null;
        $contractEndDate = null;
        $mobilearray =[];
        $password = null;
        
        if(array_key_exists('username',$value)){
            $username =$value['username'];
        }
        if(array_key_exists('accRole',$value)){
            $subdepartment = $value['accRole'];
        }
        if(array_key_exists('accPosition',$value)){
            $workdegree =$value['accPosition'];
        }
         if(array_key_exists('CreatorID',$value)){
            $creator_id =$value['CreatorID'];
         }
         if(array_key_exists('mobileNumber',$value)){
            if(array_key_exists('secondMobileNumber',$value)){
                $mobilearray[] = ["phone"=>$value['secondMobileNumber'],"phone_type"=>"work"];
                $mobilearray[] = ["phone"=>$value['mobileNumber'],"phone_type"=>"work"];
            }else{
                $mobilearray[] = ["phone"=>$value['mobileNumber'],"phone_type"=>"work"];
            }
            $mobileNumber = $mobilearray;
        }elseif(array_key_exists('secondMobileNumber',$value)){
            $mobilearray[] = ["phone"=>$value['secondMobileNumber'],"phone_type"=>"work"];
            $mobileNumber = $mobilearray;

        }
       
         if(array_key_exists('firstname',$value)){
             $firstname =$value['firstname'];
         }
         if(array_key_exists('password',$value)){
            $password =$value['password'];
         }
         if(array_key_exists('lastname',$value)){
            $lastname =$value['lastname'];
         }
         if(array_key_exists('email',$value)){
            $email =$value['email'];
        }
         if(array_key_exists('canAddPreviousReports',$value)){
            $canAddPreviousReports =$value['canAddPreviousReports'];
        }
        if(array_key_exists('canAddPreviousReportsDate',$value)){
            $canAddPreviousReportsDate =$value['canAddPreviousReportsDate'];
        }
         if(array_key_exists('gender',$value)){
             $gender =$value['gender'];
         }
         if(array_key_exists('birthDate',$value)){
            $birthDate =$value['birthDate'];
         }
         if(array_key_exists('address',$value)){
             $address =$value['address'];
         }
         if(array_key_exists('maritalStatus',$value)){
            $maritalStatus =$value['maritalStatus'];
        }
        if(array_key_exists('hiringDate',$value)){
            $hiringDate =$value['hiringDate'];
         }
         if(array_key_exists('contractStartDate',$value)){
             $contractStartDate =$value['contractStartDate'];
         }
         if(array_key_exists('contractEndDate',$value)){
            $contractEndDate =$value['contractEndDate'];
         }
         if(array_key_exists('emergancyPhoneNumber',$value)){
             $emergancyPhoneNumber =$value['emergancyPhoneNumber'];
            }
         if(array_key_exists('emergancyPhoneNumberRelation',$value)){
             $emergancyPhoneNumberRelation =$value['emergancyPhoneNumberRelation'];
         }
         if(array_key_exists('emergancyPhoneNumberName',$value)){
            $emergancyPhoneNumberName =$value['emergancyPhoneNumberName'];
        }
         if(array_key_exists('socialSecureityNumber',$value)){
            $socialSecureityNumber =$value['socialSecureityNumber'];
         }
         if(array_key_exists('contractEndDate',$value)){
             $contractEndDate =$value['contractEndDate'];
         }

         
         $birthDate=   str_replace('-', '/', $birthDate);
         $hiringDate=   str_replace('-', '/', $hiringDate);
         $contractStartDate=   str_replace('-', '/', $contractStartDate);
         $contractEndDate=   str_replace('-', '/', $contractEndDate);
         $canAddPreviousReportsDate=   str_replace('-', '/', $canAddPreviousReportsDate);
         $mobileNumber = json_encode($mobileNumber); 
         
         if($subdepartment != '10'){
            $workdegree = $this->reassignWorkdegree($workdegree);
            $subdepartment= $this->reassignSubDepartment($subdepartment);
            $user_details = UserDetail::create([
                 'emergancyPhoneNumber'=>$emergancyPhoneNumber,
                 'emergancyPhoneNumberName'=>$emergancyPhoneNumberName,
                 'emergancyPhoneNumberRelation'=>$emergancyPhoneNumberRelation,
                 'socialSecureityNumber'=>$socialSecureityNumber,
                 'address'=>$address,
                 'birthDate' => !empty($birthDate) ? Carbon::createFromFormat('m/d/Y',  Carbon::parse( $birthDate)->format('m/d/Y')) :null,
                 'hiringDate' => !empty($hiringDate) ? Carbon::createFromFormat('m/d/Y', Carbon::parse( $hiringDate)->format('m/d/Y')):null,
                 'contractStartDate' => !empty($contractStartDate) ? Carbon::createFromFormat('m/d/Y', Carbon::parse( $contractStartDate)->format('m/d/Y')):null,
                 'contractEndDate' => !empty($contractEndDate) ? Carbon::createFromFormat('m/d/Y', Carbon::parse( $contractEndDate)->format('m/d/Y')):null,
                 'maritalStatus'=>$maritalStatus,
             ]);
             if(!empty($user_details->id)){

                 $user = User::create([
                     'firebasekey'=>$user_key,
                     'username'=>!empty($username)?$username : ($firstname.$lastname.'2022'),
                     'firstname'=>$firstname,
                     'lastname'=>$lastname,
                     'email'=>$email,
                     'password'=>!empty($password)?Hash::make($password):Hash::make("test1234"),
                   //  'user_creator_id'=>$creator_id,
                     'gender'=>$gender,
                     'mobileNumber'=>$mobileNumber,
                     'user_details_id'=>$user_details->id,
                     'work_degrees_id'=>$workdegree,
                     'branches_id'=>1,
                     'active'=>0,
                     'sub_departments_id'=>$subdepartment,
                     'canAddPreviousReports'=>$canAddPreviousReports,
                     'canAddPreviousReportsDate' => !empty($canAddPreviousReportsDate) ? Carbon::createFromFormat('m/d/Y', Carbon::parse( $canAddPreviousReportsDate)->format('m/d/Y')):null,
                 ]);
                 if(!empty($user->id)){
                    if(array_key_exists('relatives',$value)){
                        foreach($value['relatives'] as $key=>$values){

                            $gender = $values['gender'];
                            $birthDate = $values['birthDate'];
                            $name = $values['name'];
                            $relation = $values['relation'];
                            
                            $family_user =  FamilyInformation::create([
                                'birth_date' => !empty($birthDate) ? Carbon::createFromFormat('m/d/Y', Carbon::parse( $birthDate)->format('m/d/Y')):null,
                                'family_name'=>$name,
                                'relation'=>$relation,
                                'gender'=>$gender,
                                'user_id'=>$user->id,
                            ]);
                            // return $values;
                            // "birthDate": "2021-09-21",
                            // "gender": "male",
                            // "name": "test1",
                            // "relation": "child"
                        }
                    }
                        $currentPermissionBalance =null;
                        $currentLeaveBalance = null;
                        $pendingBalance =null;
                          $annualLeaveBalance = null;
                        if(array_key_exists('currentPermissionBalance',$value)||array_key_exists('currentLeaveBalance',$value)){
                            if(array_key_exists('currentPermissionBalance',$value)){

                            $currentPermissionBalance = $value['currentPermissionBalance'];
                            }
                            if(array_key_exists('currentLeaveBalance',$value)){

                            $currentLeaveBalance = $value['currentLeaveBalance'];
                            }
                            if(array_key_exists('pendingBalance',$value)){

                            $pendingBalance = $value['pendingBalance'];
                            }                 
                               if(array_key_exists('annualLeaveBalance',$value)){

                              $annualLeaveBalance = $value['annualLeaveBalance'];
                            }
                            $perm = PermissionBalance::first();
                          $user_annual =   UserAnnual::create([
                            'pending_balance'=>!empty($pendingBalance)?$pendingBalance:0,
                            'monthly_balance_spend'=>!empty($currentPermissionBalance)?($perm->monthly_balance*60 -$currentPermissionBalance):0,
                            'discount_from_pending'=>0,
                            'total_leave_balance'=>!empty($annualLeaveBalance)?$annualLeaveBalance:0,
                            'pending_balance'=>!empty($pendingBalance)?$pendingBalance:0,
                            'available_leave_balance'=>!empty($currentLeaveBalance)?$currentLeaveBalance:0,
                            'user_creator_id'=>1,
                            'user_id'=>$user->id,
                            
                          ]);
                        }
                    
                    // else{
                    //     continue;
                    // }
                 }
             }
            }else{
            $partner = Partner::create([
                'partner_name'=>$username,
                'user_creator_id'=>1,
                'firebasekey'=>$user_key,
                
            ]);
            if(!empty($partner->id)){
                $client_account = ClientAccount::create([
                    'firebasekey'=>$user_key,
                    'fullname'=>$username,
                    'email'=>$email,
                    'password'=>Hash::make("test1234"),
                    'primary'=>true,
                    'partner_id'=>$partner->id,
                    'user_creator_id'=>1,
                    'active'=>0,
                ]);
            }
        }
        
        
    }
   //  curl_close( $ch );
   
   

    }
    

    

    public function annualrequest(){
        
        
        $URL =   config('firebase.legacy_database_url').'/annualLeave/.json?auth='.config('firebase.legacy_db_auth_token').'&key='.config('firebase.api_key');

        //    $URL = config('firebase.legacy_database_url'); // legacy URL with embedded secrets removed; use FIREBASE_* env vars
        $TOKEN = config('firebase.api_key');
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
        $leave_key=$key;
        $empKey = null;
        $from = null;
        $to = null;
        $leaveType = null;
         //$attach = null;
        $reason = null;
        $managerToApproveKey = null;
        $hrToApproveKey = false;
        $approvalCycle = null;

        $managerDissisionComment = null;
        $managerDissision = null;
        $managerDissisionKey = null;
        $managerDissisionAt = null;

        $hrDissision = null;
        $hrDissisionComment = null;
        $hrDissisionKey = null;
        $hrDissisionAt = null;
        
        $finalStatus = null;
        $createdAt = null;
        $attach = null;
        if(array_key_exists('attach',$value)){
            $attach =$value['attach'];
        }
        if(array_key_exists('empKey',$value)){
            $empKey =$value['empKey'];
        }
        if(array_key_exists('from',$value)){
            $from = $value['from'];
        }
        if(array_key_exists('to',$value)){
            $to =$value['to'];
        }
         if(array_key_exists('leaveType',$value)){
             $leaveType =$value['leaveType'];
            $leaveType = $this->leavetype_id($leaveType);
        }
         if(array_key_exists('reason',$value)){
             $reason =$value['reason'];
         }
         if(array_key_exists('managerToApproveKey',$value)){
            $managerToApproveKey =$value['managerToApproveKey'];
        }
        if(array_key_exists('hrToApproveKey',$value)){
            $hrToApproveKey =$value['hrToApproveKey'];
         }
         if(array_key_exists('approvalCycle',$value)){
             $approvalCycle =$value['approvalCycle'];
         }
         if(array_key_exists('managerDissisionComment',$value)){
            $managerDissisionComment =$value['managerDissisionComment'];
         }
         if(array_key_exists('managerDissision',$value)){
             $managerDissision =$value['managerDissision'];
         }
         if(array_key_exists('managerDissisionKey',$value)){
             $managerDissisionKey =$value['managerDissisionKey'];
            }
         if(array_key_exists('managerDissisionAt',$value)){
             $managerDissisionAt =$value['managerDissisionAt'];
         }
         if(array_key_exists('hrDissision',$value)){
            $hrDissision =$value['hrDissision'];
         }
         if(array_key_exists('hrDissisionComment',$value)){
             $hrDissisionComment =$value['hrDissisionComment'];
            }
         if(array_key_exists('hrDissisionKey',$value)){
            $hrDissisionKey =$value['hrDissisionKey'];
        }
        if(array_key_exists('hrDissisionAt',$value)){
            $hrDissisionAt =$value['hrDissisionAt'];
        }
        if(array_key_exists('finalStatus',$value)){
            $finalStatus =$value['finalStatus'];
         }
         if(array_key_exists('createdAt',$value)){
             $createdAt =$value['createdAt'];
            }
       
         $managerDissisionAt=   str_replace('-', '/', $managerDissisionAt);
         $hrDissisionAt=   str_replace('-', '/', $hrDissisionAt);
         $createdAt=   str_replace('-', '/', $createdAt);

         
         //0 reject 4
         //2 approved 1 
         $get_user_manager = User::where('firebasekey', $managerToApproveKey)->first();
       //  return $get_user_manager;
         $get_user = User::where('firebasekey', $empKey)->first();
         try{
            $createdAt = Carbon::create($createdAt);

        }catch(\Exception $e){
            $c= explode('/', $createdAt);
            $ti = $c[1] .'/'.$c[0].'/'.$c[2];
           $createdAt = Carbon::create($ti);
          //  $createdAt = Carbon::createFromFormat('d/m/Y', $createdAt)->format('d/m/Y');
        }
        $annualRequest = AnnualRequest::create([
            'reason'=>$reason,
            'from' => !empty($from) ? Carbon::create($from) :null,
            'to' => !empty($to) ? Carbon::create( $to):null,
            'annual_type_id'=>$leaveType,
            'annual_status_id'=>$finalStatus ==0 ? 4 : 1,
            'manager_approve_id'=>$get_user_manager->id,
            'user_id'=>$get_user->id,
            'created_at'=>$createdAt,
        ]);
        if(!empty($annualRequest->id)){
            
            try{
                $managerDissisionAt = Carbon::create($managerDissisionAt);

            }catch(\Exception $e){
               // $managerDissisionAt = '27/03/2022, 20:43:37';
                $c= explode('/', $managerDissisionAt);
                $ti = $c[1] .'/'.$c[0].'/'.$c[2];
               $managerDissisionAt = Carbon::create($ti);
              //  $managerDissisionAt = Carbon::createFromFormat('d/m/Y', $managerDissisionAt)->format('d/m/Y');

            }
            try{
                $hrDissisionAt = Carbon::create($hrDissisionAt);

            }catch(\Exception $e){
             //   $hrDissisionAt = Carbon::createFromFormat('d/m/Y', $hrDissisionAt)->format('d/m/Y');
             //  $hrDissisionAt = '27/03/2022, 20:43:37';
                $c= explode('/', $hrDissisionAt);
                $ti = $c[1] .'/'.$c[0].'/'.$c[2];
               $hrDissisionAt = Carbon::create($ti);
            }
            $annual_action = AnnualRequestAction::create([
                'comment'=>$managerDissisionComment,
                'annual_request_id'=>$annualRequest->id,
                'annual_status_id'=>$managerDissision==false?4:1,
                'assign_to_id'=>$get_user_manager->id,
                'created_at'=>$managerDissisionAt,

            ]);
            $get_user_hr = User::where('firebasekey', $hrToApproveKey)->first();
            if(!empty($annual_action) && !empty($hrToApproveKey)){
                $annual_action = AnnualRequestAction::create([
                    'comment'=>$hrDissisionComment,
                    'annual_request_id'=>$annualRequest->id,
                    'annual_status_id'=>$hrDissision==false?4:1,
                    'assign_to_id'=>$get_user_hr->id,
                    'created_at'=>$hrDissisionAt,
                ]);
            }
            try{
                if(!empty($attach)){
                    $annualRequest2 =AnnualRequest::where('id',$annualRequest->id)->first();
                   $this-> imageconvertannual($get_user,$attach,$annualRequest2);
                }

            }catch(\Exception $e){}
            $annualRequest->update([
                'manager_approve_id'=>!empty($get_user_hr->id)?$get_user_hr->id:$get_user_manager->id,
                'annual_status_id'=>$hrDissision==false?4:1,
                'updated_at'=>!empty($hrDissisionAt)?$hrDissisionAt:$managerDissisionAt,
            ]);
        }
     }
   //  curl_close( $ch );


    }
    public function leavetype_id($leaveType){
        if($leaveType == 'AnnualLeave'){
            $leaveType =1;
        }elseif($leaveType == 'sickLeave'){
            $leaveType =2;

        }elseif($leaveType == 'unpaid'){
            $leaveType =3;

        }elseif($leaveType == 'examLeave'){
            $leaveType =4;
            
        }elseif($leaveType == 'permission'){
            $leaveType =5;
            
        } 
        return $leaveType;
    }

    
    public function pendingannualrequest(){
      

        $URL =   config('firebase.legacy_database_url').'/pendingAnnualLeave/.json?auth='.config('firebase.legacy_db_auth_token').'&key='.config('firebase.api_key');

    //    $URL = config('firebase.legacy_database_url'); // legacy URL with embedded secrets removed; use FIREBASE_* env vars
    $TOKEN = config('firebase.api_key');
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
         $leave_key=$key;
         $empKey = null;
         $from = null;
         $to = null;
         $leaveType = null;
         //$attach = null;
        $reason = null;
        $managerToApproveKey = null;
        $hrToApproveKey = false;
        $approvalCycle = null;

        $managerDissisionComment = null;
        $managerDissision = null;
        $managerDissisionKey = null;
        $managerDissisionAt = null;
        
        $hrDissision = null;
        $hrDissisionComment = null;
        $hrDissisionKey = null;
        $hrDissisionAt = null;
        
        $finalStatus = null;
        $createdAt = null;
        $attach = null;
        if(array_key_exists('attach',$value)){
            $attach =$value['attach'];
        }
        if(array_key_exists('empKey',$value)){
            $empKey =$value['empKey'];
        }
        if(array_key_exists('from',$value)){
            $from = $value['from'];
         }
         if(array_key_exists('to',$value)){
            $to =$value['to'];
         }
         if(array_key_exists('leaveType',$value)){
             $leaveType =$value['leaveType'];
            $leaveType = $this->leavetype_id($leaveType);
         }
         if(array_key_exists('reason',$value)){
             $reason =$value['reason'];
            }
         if(array_key_exists('managerToApproveKey',$value)){
             $managerToApproveKey =$value['managerToApproveKey'];
            }
         if(array_key_exists('hrToApproveKey',$value)){
             $hrToApproveKey =$value['hrToApproveKey'];
            }
         if(array_key_exists('approvalCycle',$value)){
             $approvalCycle =$value['approvalCycle'];
            }
         if(array_key_exists('managerDissisionComment',$value)){
             $managerDissisionComment =$value['managerDissisionComment'];
            }
         if(array_key_exists('managerDissision',$value)){
            $managerDissision =$value['managerDissision'];
         }
         if(array_key_exists('managerDissisionKey',$value)){
            $managerDissisionKey =$value['managerDissisionKey'];
         }
         if(array_key_exists('managerDissisionAt',$value)){
            $managerDissisionAt =$value['managerDissisionAt'];
        }
        if(array_key_exists('hrDissision',$value)){
            $hrDissision =$value['hrDissision'];
        }
         if(array_key_exists('hrDissisionComment',$value)){
             $hrDissisionComment =$value['hrDissisionComment'];
            }
         if(array_key_exists('hrDissisionKey',$value)){
            $hrDissisionKey =$value['hrDissisionKey'];
        }
        if(array_key_exists('hrDissisionAt',$value)){
            $hrDissisionAt =$value['hrDissisionAt'];
        }
         if(array_key_exists('finalStatus',$value)){
            $finalStatus =$value['finalStatus'];
         }
         if(array_key_exists('createdAt',$value)){
             $createdAt =$value['createdAt'];
         }
       
         $managerDissisionAt=   str_replace('-', '/', $managerDissisionAt);
         $hrDissisionAt=   str_replace('-', '/', $hrDissisionAt);
         $createdAt=   str_replace('-', '/', $createdAt);


         //0 manager 2
         //1 hr 3
         $get_user_manager = User::where('firebasekey', $managerToApproveKey)->first();
         $get_user = User::where('firebasekey', $empKey)->first();
         try{
            $createdAt = Carbon::create($createdAt);

        }catch(\Exception $e){
            $c= explode('/', $createdAt);
            $ti = $c[1] .'/'.$c[0].'/'.$c[2];
           $createdAt = Carbon::create($ti);
        }
         if($approvalCycle == 0){
            $annualRequest = AnnualRequest::create([
                'reason'=>$reason,
                'from' => !empty($from) ? Carbon::create($from) :null,
                'to' => !empty($to) ? Carbon::create( $to):null,
                'annual_type_id'=>$leaveType,
                'annual_status_id'=>2,
                'manager_approve_id'=>$get_user_manager->id,
                'user_id'=>$get_user->id,
                'created_at'=>$createdAt,
            ]);
         }else if($approvalCycle ==1){
            $annualRequest = AnnualRequest::create([
                'reason'=>$reason,
                'from' => !empty($from) ? Carbon::create($from) :null,
                'to' => !empty($to) ? Carbon::create( $to):null,
                'annual_type_id'=>$leaveType,
                'annual_status_id'=>3,
                'manager_approve_id'=>$get_user_manager->id,
                'user_id'=>$get_user->id,
                'created_at'=>$createdAt,
            ]);
            if(!empty($annualRequest->id)){
                try{
                    $managerDissisionAt = Carbon::create($managerDissisionAt);
    
                }catch(\Exception $e){
                    $c= explode('/', $managerDissisionAt);
                    $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                    $managerDissisionAt = Carbon::create($ti);
    
                }
                try{
                    $hrDissisionAt = Carbon::create($hrDissisionAt);
                    
                }catch(\Exception $e){
                
                    $c= explode('/', $hrDissisionAt);
                    $ti = $c[1] .'/'.$c[0].'/'.$c[2];
                   $hrDissisionAt = Carbon::create($ti);
                }
                $get_user_hr = User::where('firebasekey', $hrToApproveKey)->first();
                
                $annual_action = AnnualRequestAction::create([
                    'comment'=>$managerDissisionComment,
                    'annual_request_id'=>$annualRequest->id,
                    'annual_status_id'=>3,
                    'assign_to_id'=>$get_user_manager->id,
                    'created_at'=>$managerDissisionAt,
    
                ]);
                try{
                    if(!empty($attach)){
                        $annualRequest2 =$annualRequest;
                       $this-> imageconvertannual($get_user,$attach,$annualRequest2);
                    }
                    
                }catch(\Exception $e){}
                $annualRequest->update([
                    'manager_approve_id'=>!empty($get_user_hr->id)?$get_user_hr->id:$get_user_manager->id,
                    'annual_status_id'=>3,
                    'updated_at'=>!empty($hrDissisionAt)?$hrDissisionAt:$managerDissisionAt,
                ]);
            }

         }
         
        
     }
   //  curl_close( $ch );
   
   
}
public function imageconvertpartner(Partner $user , $url){
    //   $url = "https://firebasestorage.googleapis.com/v0/b/fgspmproduction.appspot.com/o/users%2FI0floz9FABWULfqKnuYFuTvH0vM2%2FWhatsApp_Image_2022-07-25_at_7.29.38_PM__2_-removebg-preview.png?alt=media&token=e7a0fbf9-66e8-4345-945a-6eabcb528b0c";
    $contents = file_get_contents($url);
    $name = Str::random(10);
       $path = 'Attachments';
       if (! File::exists($path)) {
           File::makeDirectory($path);
       }
       $path =$path.'/Client';
       if (! File::exists($path)) {
           File::makeDirectory($path);
       }
       $path =$path.'/Partner';
       if (! File::exists($path)) {
           File::makeDirectory($path);
       }
       $path = $path.'/'.$user->id;
       if (! File::exists($path)) {
           File::makeDirectory($path);
       }else {
           File::deleteDirectory($path);
           if (! File::exists($path)) {
               File::makeDirectory($path);
           }
       }
       $done = file_put_contents($path.'/'.$name, $contents);
       $user->update([
           'partner_photoURL'=>$name
     ]);
     return true;
   }

public function imageconvert(User $user , $url){
     //   $url = "https://firebasestorage.googleapis.com/v0/b/fgspmproduction.appspot.com/o/users%2FI0floz9FABWULfqKnuYFuTvH0vM2%2FWhatsApp_Image_2022-07-25_at_7.29.38_PM__2_-removebg-preview.png?alt=media&token=e7a0fbf9-66e8-4345-945a-6eabcb528b0c";
     $contents = file_get_contents($url);
     $name = Str::random(10);
        $path = 'Attachments';
        if (! File::exists($path)) {
            File::makeDirectory($path);
        }
        $path =$path.'/User';
        if (! File::exists($path)) {
            File::makeDirectory($path);
        }
        $path = $path.'/'.$user->id;
        if (! File::exists($path)) {
            File::makeDirectory($path);
        }
        $path = $path.'/profile';
        if (! File::exists($path)) {
            File::makeDirectory($path);
        }else {
            File::deleteDirectory($path);
            if (! File::exists($path)) {
                File::makeDirectory($path);
            }
        }
        $done = file_put_contents($path.'/'.$name, $contents);
        $user->update([
            'photoURL'=>$name
      ]);
      return true;
    }

    public function imageconvertannual(User $user , $url, $annualRequest){
        //   $url = "https://firebasestorage.googleapis.com/v0/b/fgspmproduction.appspot.com/o/users%2FI0floz9FABWULfqKnuYFuTvH0vM2%2FWhatsApp_Image_2022-07-25_at_7.29.38_PM__2_-removebg-preview.png?alt=media&token=e7a0fbf9-66e8-4345-945a-6eabcb528b0c";
        $contents = file_get_contents($url);
           $name = Str::random(10);
           $path = 'Attachments';
           if (! File::exists($path)) {
               File::makeDirectory($path);
            }
            $path =$path.'/AnnualRequest';
           if (! File::exists($path)) {
               File::makeDirectory($path);
           }
           $path = $path.'/'.$user->id;
           if (! File::exists($path)) {
               File::makeDirectory($path);
           }
           $path = $path.'/'.$annualRequest->id;
           if (! File::exists($path)) {
               File::makeDirectory($path);
           }else {
               File::deleteDirectory($path);
               if (! File::exists($path)) {
                   File::makeDirectory($path);
                }
            }
          $done = file_put_contents($path.'/'.$name, $contents);
          
          $annual=AnnualRequestAttach::create([
            'attach_name'=>$name,
            'annual_request_id'=>$annualRequest->id,
        ]);
       
          return true;
       }
    
    public function pddprocessattach( $process , $url, $project,$pddname,$user_id){
        //   $url = "https://firebasestorage.googleapis.com/v0/b/fgspmproduction.appspot.com/o/users%2FI0floz9FABWULfqKnuYFuTvH0vM2%2FWhatsApp_Image_2022-07-25_at_7.29.38_PM__2_-removebg-preview.png?alt=media&token=e7a0fbf9-66e8-4345-945a-6eabcb528b0c";
        $contents = file_get_contents($url);
           $name = Str::random(10);
           $path = 'Attachments';
           if (! File::exists($path)) {
               File::makeDirectory($path);
            }
            $path =$path.'/Project';
           if (! File::exists($path)) {
               File::makeDirectory($path);
           }
           $path = $path.'/'.$project->id;
           if (! File::exists($path)) {
               File::makeDirectory($path);
           }
           $path = $path.'/'.$process->id;
           if (! File::exists($path)) {
               File::makeDirectory($path);
           }else {
               File::deleteDirectory($path);
               if (! File::exists($path)) {
                   File::makeDirectory($path);
                }
            }
          $done = file_put_contents($path.'/'.$name, $contents);
          
          $annual=ProcessAttach::create([
            'process_attach'=>!empty($pddname)?$pddname:$name,
            'process_id'=>$process->id,
            'user_creator_id'=>$user_id,
        ]);
       
          return true;
       }
    }

    // $sendEmailJob = (new ClientEmail("ataha@firstgulfsolutions.com","asdasdads"))->delay(10); // seconds
     // $sendEmailJob2 = (new ClientEmail("ataha@firstgulfsolutions.com","asdasdads"))->delay(10); // seconds
     
     // $this->dispatch($sendEmailJob);
      // $this->dispatch($sendEmailJob2);