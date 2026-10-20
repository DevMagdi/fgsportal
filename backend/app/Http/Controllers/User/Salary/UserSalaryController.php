<?php
namespace App\Http\Controllers\User\Salary;
use App\Http\Controllers\Controller;
use App\Models\UserSalary;
use Illuminate\Http\Request;
use App\Models\UserSalaryHistory;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
  use Carbon\Carbon;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use DatePeriod;
use DateInterval;
use App\Models\Report;
use App\Models\SalaryReport;

class UserSalaryController extends Controller
{
  
    public function castarraysalary(UserSalary $userSalary){
        $userSalaryHistory = UserSalaryHistory::where('salary_id',$userSalary->id)->get();
        $response[]=[
            'key'=>$userSalary->id,
            'salary' =>(float)$userSalary->salary,
            'applyfrom' => Carbon::parse( $userSalary->start_date)->format('m/d/Y') ,
            'empKey' =>$userSalary->assign_to_id,
            'empName' =>$userSalary->assign_to_id_fun->username,
            'endedAt'=>null,
            'isActive'=>true,
            'createdAt'=>$userSalary->created_at,
            'createdByKey'=>$userSalary->user_creator_id,
            'createdByName'=>$userSalary->user_creator_id_fun->username,
        ];
        foreach($userSalaryHistory as $dep){
            $response[]=[
                'key'=>$dep->id,
                'isActive'=>false,
                'createdAt'=>$dep->created_at,
                'empKey' =>$dep->salary_id_fun->assign_to_id,
                'empName' =>$dep->salary_id_fun->assign_to_id_fun->username,
                'salary'=>$dep->salary,
                'createdByKey'=>$dep->user_creator_id,
                'createdByName'=>$dep->user_creator_id_fun->username,
                'applyfrom' =>Carbon::parse( $dep->start_date)->format('m/d/Y') ,
                'endedAt' => Carbon::parse( $dep->end_date)->format('m/d/Y') ,
            ];
        }
      
        return $response;
    }
    
    public function DeleteUserSalary(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                    'salary_id'=>'required|numeric|exists:user_salaries,id'
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $userSalary= UserSalary::where('id',$request->salary_id)->first();

          if(!empty($userSalary->id)){

            $userSalary->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"User Salary not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

    // public function GetReportUserSalary(Request $request){
    //     try{
    //         $validator = Validator::make($request->all(), [
    //             'token'=>'required|string',
    //             ]);
    //       if ($validator->fails()) {
   
    //           return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
    //       }
    //       $userSalary = UserSalary::whereHas('assign_to_id_fun',function($q){
    //         $q->where('active',1);
    //       })->get();
    //       if(!empty($userSalary[0]->id)){
    //         foreach($userSalary as $dep){
                
    //         $array_reponse[] = [
    //             'key'=>$dep->id,
    //             'salary' =>(float)$dep->salary,
    //             'applyfrom' => Carbon::parse( $dep->start_date)->format('m/d/Y') ,
    //             'empKey' =>$dep->assign_to_id,
    //             'empName' =>$dep->assign_to_id_fun->username,
    //             'endedAt'=>null,
    //             'isActive'=>true,
    //             'createdAt'=>$dep->created_at,
    //             'createdByKey'=>$dep->user_creator_id,
    //             'createdByName'=>$dep->user_creator_id_fun->username,
    //         ];
    //     }
    //         return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

    //       }else{
    //         return ResponseApi::notFoundResponse(['message'=>"Empty User Salary"],"Empty",200);

    //       }
             
    //     }catch(\Exception $e){
    //         return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

    //     }

    // }
    
    public function GetReportUserSalary(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                ]);
           if ($validator->fails()) {
   
               return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
           }
        //   $userSalary = UserSalary::whereHas('assign_to_id_fun',function($q){
        //     $q->where('active',1);
        //   })->get();
        $users = User::where('active',1)->where('sub_departments_id','!=',8)->get();
        if(!empty($users[0]->id)){
            foreach($users as $user){
               $userSalary = UserSalary::where('assign_to_id' , $user->id)->get();
               if(!empty($userSalary[0]->id)){
                   foreach($userSalary as $dep){
                   $array_reponse[] = [
                        'key'=>$dep->id,
                        'salary' =>(float)$dep->salary,
                        'applyfrom' => Carbon::parse( $dep->start_date)->format('m/d/Y') ,
                        'empKey' =>$dep->assign_to_id,
                        'empName' =>$dep->assign_to_id_fun->username,
                        'endedAt'=>null,
                        'isActive'=>true,
                        'createdAt'=>$dep->created_at,
                        'createdByKey'=>$dep->user_creator_id,
                        'createdByName'=>$dep->user_creator_id_fun->username,
                    ];
               }
               }else{
                   $array_reponse[] = [
                        'key'=>$user->id,
                        'salary' =>0,
                        'applyfrom' => null,
                        'empKey' =>$user->id,
                        'empName' =>$user->username,
                        'endedAt'=>null,
                        'isActive'=>null,
                        'createdAt'=>null,
                        'createdByKey'=>null,
                        'createdByName'=>null,
                    ];
               }
            }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
        }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty User Salary"],"Empty",200);
        }
             
        }catch(\Exception $e){
            return $e;
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }

    }

    public function UpdateUserSalary(Request $request){
          try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'salary_id'=>'required|numeric|exists:user_salaries,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $userSalary=  UserSalary::where('id',$request->salary_id)->first();

          if(!empty($userSalary->id)){
          
            $userSalary->update(
                $request->except(['start_date'])
            );
            if(!empty($request->start_date)){
                $userSalary->update([
                    'start_date' => Carbon::createFromFormat('m/d/Y', $request-> start_date),
                    ] );
            }
            $userSalary=  UserSalary::where('id',$request->salary_id)->first();

            return ResponseApi::acceptedResponseApi($this->castarraysalary($userSalary),"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"User Salary not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

    public function CreateUserSalary(Request $request){
          try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'salary'=>'required|numeric',
                'assign_to_id'=>'required|numeric|exists:users,id',
                'start_date' => 'required|date',   
            ]);

            if ($validator->fails()) {
   
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            $exists = UserSalary::where('assign_to_id',$request->assign_to_id)->first();
            if(empty($exists->id)){
                $userSalary=  UserSalary::create([
                    'salary' =>$request->salary,
                      'start_date' => Carbon::createFromFormat('m/d/Y', $request-> start_date),
                     'assign_to_id' =>$request->assign_to_id,
                     'user_creator_id' =>Auth::guard('user_api')->user()->id,
                    ]);
                    
                  return ResponseApi::acceptedResponseApi($this->castarraysalary($userSalary),"success",201);
            }else{
                $userSalaryHistory = UserSalaryHistory::create([
                    'salary'=>$exists->salary,
                    'user_creator_id'=>$exists->user_creator_id,
                    'salary_id'=>$exists->id,
                      'start_date' =>    $exists->start_date  ,
                    'end_date' =>    Carbon::createFromFormat('m/d/Y', $request-> start_date)->subDays(1) ,
 
                ]);
                $exists->update([
                    'salary' =>$request->salary,
                    'user_creator_id' =>Auth::guard('user_api')->user()->id,
                    'start_date' => Carbon::createFromFormat('m/d/Y', $request-> start_date),
                ]);
                $get_exist = UserSalary::where('assign_to_id',$request->assign_to_id)->first();
                
                return ResponseApi::acceptedResponseApi($this->castarraysalary($get_exist),"success",201);
            }
         

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    
    public function GetSalaryForUser(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'user_id'=>'required|numeric|exists:users,id'
                ]);
           if ($validator->fails()) {
   
               return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
           }
          $userSalary = UserSalary::where('assign_to_id',$request->user_id)->first();
          if(!empty($userSalary->id)){
            
            return ResponseApi::acceptedResponseApi($this->castarraysalary($userSalary),"success",201);

        

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty User Salary"],"Empty",200);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    
    public function GetAllUserSalary(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                ]);
           if ($validator->fails()) {
   
               return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
           }
          $userSalary = UserSalary::all();
          if(!empty($userSalary[0]->id)){
            foreach($userSalary as $dep){
            $array_reponse[] = $this->castarraysalary($dep);
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty User Salary"],"Empty",200);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }


    public function calculatemonthWorkDays($start,$end){
       
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

    public function idleHoursCost($user_idle,$user_cost,$workdays){
        $user_salary_per_hour = ($user_cost / $workdays );

        $idlecost = $user_salary_per_hour *$user_idle;
        return $idlecost;

    }
 
    public function actualWorkingCost($user_work_hours,$user_cost, $workdays ){
        $user_salary_per_hour = ($user_cost / $workdays );

        $user_actual = $user_salary_per_hour *$user_work_hours;
        return $user_actual;

    }
    public function officalVacations($user_offical_vacation,$user_cost,$workdays){
        $user_salary_per_hour = ($user_cost /  $workdays  );

        $user_offical_vacation = $user_salary_per_hour *$user_offical_vacation;
        return $user_offical_vacation;
    }
    public function unpaidVacations($user_unpaid_vacations,$user_cost, $workdays ){
        $user_salary_per_hour = ($user_cost /  $workdays  );

        $user_unpaid_vacations = $user_salary_per_hour *$user_unpaid_vacations;
        return $user_unpaid_vacations;
    }

    public function CreateSalaryMonthlyReport(Request $request){
       try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'report_date'=>'required|date',
                'salary_status_id'=>'required|numeric|exists:salary_report_statuses,id'
                ]);
           if ($validator->fails()) {
   
               return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
           }
           
       $date_current =  Carbon::createFromFormat('m/d/Y', $request-> report_date);
       $end = Carbon::create($date_current)->endOfMonth();
       $start = Carbon::create($date_current)->startOfMonth();
      // $start_month = Carbon::parse($start)->format('m/d/Y');
           $user_data = User::where('active',1)->where('work_degrees_id','<>',5)->whereHas('sub_departments_id_fun', function($q) {
            $q->where('departments_id',2);          
          })->get();
       //   return $start_month;
          $array_reponse=[];
          $old_report = SalaryReport::whereDate('salary_report_date',$date_current)->where('salary_status_id','<>',5)->where('salary_status_id','<>',3)->get();
          
        if(!empty($old_report[0])){
            $old_report = SalaryReport::whereDate('salary_report_date',$date_current)->delete();
        }
            foreach($user_data as $user_details){
              $unpaidVacations= 0;
              $officalVacations= 0;
              $idleHoursCost= 0;
              $actualWorkingCost= 0;
              $totalHours = 0;
              $totalInEGP = 0;
              $monthlyWorkingHours = $this->calculatemonthWorkDays($start,$end)*8;
              $userSalary = UserSalary::where('assign_to_id',$user_details->id)->first();
              if(!empty($userSalary)){
                  $reports = Report::where('user_creator_id',$user_details->id)->where('report_status_id',2)->
                  where('report_date','>=',$start)
                  ->where('report_date','<=',$end)->get();
                  foreach($reports as $report){
                      if($report->report_type_id == 1 ||$report->report_type_id == 2 ||$report->report_type_id == 3 ||$report->report_type_id == 4){
                          $actualWorkingCost = $actualWorkingCost +$this->actualWorkingCost($report->duration ,(float) $userSalary->salary,$monthlyWorkingHours);
                          $totalHours = $report->duration +$totalHours;
                       }else if($report->report_type_id == 5){
                          $totalHours = $report->duration +$totalHours;
                          $idleHoursCost = $idleHoursCost +$this->idleHoursCost($report->duration ,(float) $userSalary->salary,$monthlyWorkingHours);
                      }else if($report->report_type_id == 6){
                          $totalHours = $report->duration +$totalHours;
                          $officalVacations = $officalVacations +$this->officalVacations($report->duration ,(float) $userSalary->salary,$monthlyWorkingHours);
                      }else if($report->report_type_id == 7){
                          $totalHours = $report->duration +$totalHours;
                          $unpaidVacations = $unpaidVacations +$this->unpaidVacations($report->duration ,(float) $userSalary->salary,$monthlyWorkingHours);
                      }
                  }
               

                  $totalInEGP = $actualWorkingCost + $idleHoursCost + $officalVacations;
                  if($totalInEGP >= $userSalary->salary){
                       $totalInEGP =  $userSalary->salary;
                  }
                  $salary_report =SalaryReport::create([
                      'unpaidVacations'=>$unpaidVacations,
                      'officalVacations'=>$officalVacations,
                      'idleHoursCost'=>$idleHoursCost,
                      'actualWorkingCost'=>$actualWorkingCost,
                      'monthWorkingHours'=>$monthlyWorkingHours,
                      'totalByHours'=>$totalHours,
                      'totalInEGP'=>$totalInEGP,
                      'user_creator_id'=>Auth::guard('user_api')->user()->id,
                      'user_to_id'=>$user_details->id,
                      'salary_status_id'=>$request->salary_status_id?$request->salary_status_id:null,
                      'manager_approve_id'=>$request->manager_id,
                      'last_user_action_id'=>null,
                      'salary_report_date'=>$date_current,
                  ]);
                  $array_reponse []= $this->castarraysalaryreport($salary_report);
              
              }else{
                  $salary_report =SalaryReport::create([
                      'unpaidVacations'=>$unpaidVacations,
                      'officalVacations'=>$officalVacations,
                      'idleHoursCost'=>$idleHoursCost,
                      'actualWorkingCost'=>$actualWorkingCost,
                      'monthWorkingHours'=>$monthlyWorkingHours,
                      'totalByHours'=>$totalHours,
                      'totalInEGP'=>$totalInEGP,
                      'user_creator_id'=>Auth::guard('user_api')->user()->id,
                      'user_to_id'=>$user_details->id,
                      'salary_status_id'=>$request->salary_status_id?$request->salary_status_id:null,
                      'manager_approve_id'=>$request->manager_id,
                      'last_user_action_id'=>null,
                      'salary_report_date'=>$date_current,
                  ]);
                  $array_reponse []= $this->castarraysalaryreport($salary_report);
              }
            }
       
              // $start_month = Carbon::parse($start)->format('m/d/Y');
           $user_data = User::where('active',1)->whereHas('sub_departments_id_fun', function($q) {
            $q->where('departments_id','<>',2);          
          })->where('sub_departments_id','<>',8)->get();
       //   return $start_month;
          

            foreach($user_data as $user_details){
                $unpaidVacations= 0;
                $officalVacations= 0;
                $idleHoursCost= 0;
                $actualWorkingCost= 0;
                $totalHours = 0;
                $totalInEGP = 0;
                $monthlyWorkingHours = $this->calculatemonthWorkDays($start,$end)*8;
                $userSalary = UserSalary::where('assign_to_id',$user_details->id)->first();
                if(!empty($userSalary)){
                    $reports = Report::where('user_creator_id',$user_details->id)->where('report_status_id',2)->
                    where('report_date','>=',$start)
                    ->where('report_date','<=',$end)->get();
                    foreach($reports as $report){
                        if($report->report_type_id == 1 ||$report->report_type_id == 2 ||$report->report_type_id == 3 ||$report->report_type_id == 4){
                            $actualWorkingCost = $actualWorkingCost +$this->actualWorkingCost($report->duration ,(float) $userSalary->salary,$monthlyWorkingHours);
                            $totalHours = $report->duration +$totalHours;
                         }else if($report->report_type_id == 5){
                            $totalHours = $report->duration +$totalHours;
                            $idleHoursCost = $idleHoursCost +$this->idleHoursCost($report->duration ,(float) $userSalary->salary,$monthlyWorkingHours);
                        }else if($report->report_type_id == 6){
                            $totalHours = $report->duration +$totalHours;
                            $officalVacations = $officalVacations +$this->officalVacations($report->duration ,(float) $userSalary->salary,$monthlyWorkingHours);
                        }else if($report->report_type_id == 7){
                            $totalHours = $report->duration +$totalHours;
                            $unpaidVacations = $unpaidVacations +$this->unpaidVacations($report->duration ,(float) $userSalary->salary,$monthlyWorkingHours);
                        }
                    }
                 
  
                    $totalInEGP = $actualWorkingCost + $idleHoursCost + $officalVacations;
                    if($totalInEGP >= $userSalary->salary){
                         $totalInEGP =  $userSalary->salary;
                    }else{
                        $totalInEGP =  $userSalary->salary - $unpaidVacations;
                    }
                    $salary_report =SalaryReport::create([
                        'unpaidVacations'=>$unpaidVacations,
                        'officalVacations'=>$officalVacations,
                        'idleHoursCost'=>$idleHoursCost,
                        'actualWorkingCost'=>$actualWorkingCost,
                        'monthWorkingHours'=>$monthlyWorkingHours,
                        'totalByHours'=>$totalHours,
                        'totalInEGP'=>$totalInEGP,
                        'user_creator_id'=>Auth::guard('user_api')->user()->id,
                        'user_to_id'=>$user_details->id,
                        'salary_status_id'=>$request->salary_status_id?$request->salary_status_id:null,
                        'manager_approve_id'=>$request->manager_id,
                        'last_user_action_id'=>null,
                        'salary_report_date'=>$date_current,
                    ]);
                    $array_reponse []= $this->castarraysalaryreport($salary_report);
                
                }else{
                    $salary_report =SalaryReport::create([
                        'unpaidVacations'=>$unpaidVacations,
                        'officalVacations'=>$officalVacations,
                        'idleHoursCost'=>$idleHoursCost,
                        'actualWorkingCost'=>$actualWorkingCost,
                        'monthWorkingHours'=>$monthlyWorkingHours,
                        'totalByHours'=>$totalHours,
                        'totalInEGP'=>$totalInEGP,
                        'user_creator_id'=>Auth::guard('user_api')->user()->id,
                        'user_to_id'=>$user_details->id,
                        'salary_status_id'=>$request->salary_status_id?$request->salary_status_id:null,
                        'manager_approve_id'=>$request->manager_id,
                        'last_user_action_id'=>null,
                        'salary_report_date'=>$date_current,
                    ]);
                    $array_reponse []= $this->castarraysalaryreport($salary_report);
                }
            }

                    // $start_month = Carbon::parse($start)->format('m/d/Y');
                    $user_data = User::where('active',1)->where('work_degrees_id',5)->whereHas('sub_departments_id_fun', function($q) {
                        $q->where('departments_id',2);          
                      })->get();
       //   return $start_month;
          

            foreach($user_data as $user_details){
                $unpaidVacations= 0;
                $officalVacations= 0;
                $idleHoursCost= 0;
                $actualWorkingCost= 0;
                $totalHours = 0;
                $totalInEGP = 0;
                $monthlyWorkingHours = $this->calculatemonthWorkDays($start,$end)*8;
                $userSalary = UserSalary::where('assign_to_id',$user_details->id)->first();
                if(!empty($userSalary)){
                    $reports = Report::where('user_creator_id',$user_details->id)->where('report_status_id',2)->
                    where('report_date','>=',$start)
                    ->where('report_date','<=',$end)->get();
                    foreach($reports as $report){
                        if($report->report_type_id == 1 ||$report->report_type_id == 2 ||$report->report_type_id == 3 ||$report->report_type_id == 4){
                            $actualWorkingCost = $actualWorkingCost +$this->actualWorkingCost($report->duration ,(float) $userSalary->salary,$monthlyWorkingHours);
                            $totalHours = $report->duration +$totalHours;
                         }else if($report->report_type_id == 5){
                            $totalHours = $report->duration +$totalHours;
                            $idleHoursCost = $idleHoursCost +$this->idleHoursCost($report->duration ,(float) $userSalary->salary,$monthlyWorkingHours);
                        }else if($report->report_type_id == 6){
                            $totalHours = $report->duration +$totalHours;
                            $officalVacations = $officalVacations +$this->officalVacations($report->duration ,(float) $userSalary->salary,$monthlyWorkingHours);
                        }else if($report->report_type_id == 7){
                            $totalHours = $report->duration +$totalHours;
                            $unpaidVacations = $unpaidVacations +$this->unpaidVacations($report->duration ,(float) $userSalary->salary,$monthlyWorkingHours);
                        }
                    }
                 
  
                    $totalInEGP = $actualWorkingCost + $idleHoursCost + $officalVacations;
                    if($totalInEGP >= $userSalary->salary){
                         $totalInEGP =  $userSalary->salary;
                    }else{
                        $totalInEGP =  $userSalary->salary - $unpaidVacations;
                    }
                    $salary_report =SalaryReport::create([
                        'unpaidVacations'=>$unpaidVacations,
                        'officalVacations'=>$officalVacations,
                        'idleHoursCost'=>$idleHoursCost,
                        'actualWorkingCost'=>$actualWorkingCost,
                        'monthWorkingHours'=>$monthlyWorkingHours,
                        'totalByHours'=>$totalHours,
                        'totalInEGP'=>$totalInEGP,
                        'user_creator_id'=>Auth::guard('user_api')->user()->id,
                        'user_to_id'=>$user_details->id,
                        'salary_status_id'=>$request->salary_status_id?$request->salary_status_id:null,
                        'manager_approve_id'=>$request->manager_id,
                        'last_user_action_id'=>null,
                        'salary_report_date'=>$date_current,
                    ]);
                    $array_reponse []= $this->castarraysalaryreport($salary_report);
                
                }else{
                    $salary_report =SalaryReport::create([
                        'unpaidVacations'=>$unpaidVacations,
                        'officalVacations'=>$officalVacations,
                        'idleHoursCost'=>$idleHoursCost,
                        'actualWorkingCost'=>$actualWorkingCost,
                        'monthWorkingHours'=>$monthlyWorkingHours,
                        'totalByHours'=>$totalHours,
                        'totalInEGP'=>$totalInEGP,
                        'user_creator_id'=>Auth::guard('user_api')->user()->id,
                        'user_to_id'=>$user_details->id,
                        'salary_status_id'=>$request->salary_status_id?$request->salary_status_id:null,
                        'manager_approve_id'=>$request->manager_id,
                        'last_user_action_id'=>null,
                        'salary_report_date'=>$date_current,
                    ]);
                    $array_reponse []= $this->castarraysalaryreport($salary_report);
                }
            }
         
           
         
         
         
         
         
         
         
         
              return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

       
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
    }


    public function getSalaryMonthlyReport(Request $request){
         try{
             $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'report_date'=>'required|date',
                 ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            
        $date_current =  Carbon::createFromFormat('m/d/Y', $request-> report_date);
       
           $array_reponse=[];
           $old_report = SalaryReport::whereDate('salary_report_date',$date_current)->get();
           if(!empty($old_report[0])){
               foreach($old_report as $report){
                $array_reponse []= $this->castarraysalaryreport($report);
                }
            
               
                
                 return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

           }else{
            return ResponseApi::acceptedResponseApi($array_reponse,"Empty",200);

           }
              
         }catch(\Exception $e){
             return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
 
         }
     }
     public function getSalaryMonthlyReportApproved(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'report_date'=>'required|date',
                ]);
           if ($validator->fails()) {
   
               return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
           }
           
       $date_current =  Carbon::createFromFormat('m/d/Y', $request-> report_date);
      
          $array_reponse=[];
          $old_report = SalaryReport::whereDate('salary_report_date',$date_current)->where('salary_status_id',3)
          ->orWhere('salary_status_id',5)->whereDate('salary_report_date',$date_current)->get();
          if(!empty($old_report[0])){
              foreach($old_report as $report){
               $array_reponse []= $this->castarraysalaryreport($report);
               }
           
              
               
                return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
           return ResponseApi::acceptedResponseApi($array_reponse,"Empty",200);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
    }

     public function ManagerApproveSalaryReport(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'report_date'=>'required|date',
                ]);
           if ($validator->fails()) {
   
               return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
           }
           
       $date_current =  Carbon::createFromFormat('m/d/Y', $request-> report_date);
      
          $array_reponse=[];
          $old_report = SalaryReport::whereDate('salary_report_date',$date_current)->get();
          if(!empty($old_report[0])){
              foreach($old_report as $report){
                $report->update([
                    'salary_status_id'=>3,
                ]);
            }
           
              
               
                return ResponseApi::acceptedResponseApi(['message'=>'updated Success '],"success",201);

          }else{
           return ResponseApi::acceptedResponseApi(['message'=>'Empty'],"Empty",200);

          }

       
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
    }
    public function HRApprovedSalaryReport(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'report_date'=>'required|date',
                'manager_approve_id'=>'required|string|exists:users,id'     

                ]);
           if ($validator->fails()) {
               return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
           }
           
       $date_current =  Carbon::createFromFormat('m/d/Y', $request-> report_date);
      
       $array_reponse=[];
       $old_report = SalaryReport::whereDate('salary_report_date',$date_current)->get();
       if(!empty($old_report[0])){
           foreach($old_report as $report){
             $report->update([
                 'salary_status_id'=>1,
                 'manager_approve_id'=>$request->manager_approve_id
             ]);
         }
        
           
            
             return ResponseApi::acceptedResponseApi(['message'=>'updated Success '],"success",201);

       }else{
        return ResponseApi::acceptedResponseApi(['message'=>'Empty'],"Empty",200);

       }

     
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
    }
    public function FinancePaidSalaryReport(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'report_date'=>'required|date',
                'user_id'=>'required|numeric'
                ]);
           if ($validator->fails()) {
               return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
           }
           
       $date_current =  Carbon::createFromFormat('m/d/Y', $request-> report_date);
      
          $array_reponse=[];
          if($request->user_id==0){
            $old_report = SalaryReport::whereDate('salary_report_date',$date_current)->get();

            if(!empty($old_report[0])){
                foreach($old_report as $report){
                  $report->update([
                      'salary_status_id'=>5,
                  ]);
              }
              return ResponseApi::acceptedResponseApi(['message'=>'updated Success '],"success",201);
            }else{
                return ResponseApi::acceptedResponseApi(['message'=>'Empty'],"Empty",200);
            }
            }else{
            $old_report = SalaryReport::whereDate('salary_report_date',$date_current)->where('user_to_id',$request->user_id)->first();
                  $old_report->update([
                      'salary_status_id'=>5,
                  ]);
            }
     
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
    }
    public function castarraysalaryreport(SalaryReport $salary_report){
        $response=[
            'key'=>$salary_report->id,
            'UnpaidVacations'=>$salary_report->unpaidVacations,
            'OfficalVacations'=>$salary_report->officalVacations,
            'IdealHours'=>$salary_report->idleHoursCost,
            'ActualWorkingHours'=>$salary_report->actualWorkingCost,
            'thisMonthWorkingHours'=>$salary_report->monthWorkingHours,
            'totalInHours'=>$salary_report->totalByHours,
            'Total'=>$salary_report->totalInEGP,
            'createdByKey'=>$salary_report->user_creator_id,
            'createdByName'=>$salary_report->user_creator_id_fun->username,
            'empKey'=>$salary_report->user_to_id,
            'createdAt'=>$salary_report->created_at,
            'empName'=>$salary_report->user_to_id_fun->username,
            'salary_status_id'=>$salary_report->salary_status_id,
            'salary_status_name'=>$salary_report->salary_status_id?$salary_report->salary_status_id_fun->salary_status_name:null,
            'managerToApproveKey'=>$salary_report->manager_approve_id,
            'managerToApproveName'=>$salary_report->manager_approve_id?$salary_report->manager_approve_id_fun->username:null,
            'paidByKey'=>$salary_report->last_user_action_id,
            'paidByName'=>$salary_report->last_user_action_id?$salary_report->last_user_action_id_fun->username:null,
            'paidByAt'=>$salary_report->last_user_action_id?$salary_report->updated_at:null,
            'date'=>Carbon::parse($salary_report->salary_report_date)->format('m/d/Y') ,
        ];
        return $response;
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
     * @param  \App\Models\UserSalary  $userSalary
     * @return \Illuminate\Http\Response
     */
    public function show(UserSalary $userSalary)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\UserSalary  $userSalary
     * @return \Illuminate\Http\Response
     */
    public function edit(UserSalary $userSalary)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\UserSalary  $userSalary
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, UserSalary $userSalary)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\UserSalary  $userSalary
     * @return \Illuminate\Http\Response
     */
    public function destroy(UserSalary $userSalary)
    {
        //
    }
}
