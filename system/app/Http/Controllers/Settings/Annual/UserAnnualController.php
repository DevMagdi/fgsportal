<?php

namespace App\Http\Controllers\Settings\Annual;

use App\Http\Controllers\Controller;
  use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
 use Carbon\Carbon;
 use App\Models\UserAnnual;
 use App\Models\PermissionBalance;
use App\Models\User;
use App\Models\Log; 

class UserAnnualController extends Controller
{
    
    public function CastArrayAnnaul(UserAnnual $userAnnual){
        $perrmsion = PermissionBalance::first();
        $array_reponse = [
            'pendingBalance' =>(float) ($userAnnual->pending_balance?$userAnnual->pending_balance:0),
            'annualLeaveBalance' =>(float) ($userAnnual->total_leave_balance?$userAnnual->total_leave_balance:0),
            'currentLeaveBalance' =>(float) ($userAnnual->available_leave_balance?$userAnnual->available_leave_balance:0),
            'annualPermissionBalance' => (float)(!empty($perrmsion->id)?$perrmsion->monthly_balance:0),
            'currentPermissionBalance' => (float) ($userAnnual->monthly_balance_spend?($perrmsion->monthly_balance*60 -$userAnnual->monthly_balance_spend):$perrmsion->monthly_balance*60),
        ];
        return $array_reponse;
    }

            public function yearlyPendingBalance(){
                    try{ 
                        $log=  Log::create([
                                                'action' =>'Start Yearly Pending Balance',
                                                'actionKeys' =>'Automatic Yearly Pending Balance',
                                                'empKey' =>1,
                                                'empName' =>'super henady',
                                                'createdAt' =>Carbon::now(),
                                                'actionStatus' =>'Start',
                                            ]);
            
                                            $all_Users = User::where('active',1)->get();
            
                        foreach($all_Users as $current_user){
                            $userAnnual = UserAnnual::where('user_id',$current_user->id)->first();
                            $userAnnual2 = UserAnnual::where('user_id',$current_user->id)->first();
                            if(!empty($userAnnual->id)){

                                if(!empty($current_user->user_details_id?$current_user->user_details_id_fun->hiringDate:null))
                                {
                                    $annual_balance = 0; 
                                 $data = $current_user->user_details_id_fun->hiringDate;
                                //  $data = Carbon::create('06/01/2021');
                                 $contract_date =Carbon::create( $data);
                                            if($contract_date->day ==1){
                                                $data = $data;
                                             }else{
                                                $data = Carbon::create($contract_date->addMonthsNoOverflow(1)->month.'/01'.'/'.$contract_date->year);
                                            }
                                  $contract_date = Carbon::create($data)->addMonth(6);
                                  if($contract_date <=Carbon::now()){

                                  
                                            $contract_date = Carbon::create($data)->addMonth(12);
                                     if($contract_date <= Carbon::now() ){
 
                                        $annual_balance = 21;
                                    }else{
                                        
                                    $contract_date = Carbon::create($data)->addMonth(12);
                                     if($contract_date->year > Carbon::now()->year){
                                        if($contract_date->month ==1 && $contract_date->year - Carbon::now()->year ==1){
                                            $annual_balance = 15;
                                        }else{
                                            $annual_balance = 0;

                                        }

                                    }else{

                                        $remain = 12 - $contract_date->month +1;
                                        $annual_balance = $remain * 1.75;
                                        if(12-$remain >6){
                                           $remain = 6;
                                        }
                                        $annual_balance += ( 12 - $remain ) * 2.5;
                                        }
                                    }
                                }else{
                                    
                                }
                                     //  return $contract_date;
                                     //1-9 1-9-2022
                                 //  return $annual_balance;
                                    try{

                                        $userAnnual->update([
                                            'pending_balance' => $annual_balance,
                                            'total_leave_balance'=>$userAnnual2->pending_balance !=0?$userAnnual2->available_leave_balance + $userAnnual2->pending_balance - $annual_balance :$userAnnual2->available_leave_balance ,
                                            'available_leave_balance'=>$userAnnual2->pending_balance !=0?$userAnnual2->available_leave_balance + $userAnnual2->pending_balance - $annual_balance :$userAnnual2->available_leave_balance ,
                                        ]);
                                        $log=  Log::create([
                                            'action' => $current_user->id ."Added Pending Balance " . $annual_balance,
                                            'actionKeys' =>$current_user->id ."Added Pending Balance " . $annual_balance,
                                            'empKey' =>$current_user->id,
                                            'empName' =>$current_user->username,
                                            'createdAt' =>Carbon::now(),
                                            'actionStatus' =>'done',
                                           ]);
                                    }catch(\Exception $e){
                                        $log=  Log::create([
                                            'action' => $current_user->id ."Added Pending Balance " . $annual_balance,
                                            'actionKeys' =>$current_user->id ."Added Pending Balance " . $annual_balance,
                                            'empKey' =>$current_user->id,
                                            'empName' =>$current_user->username,
                                            'createdAt' =>Carbon::now(),
                                            'actionStatus' =>'Failed',
                                           ]);
                                    }
                                   
                                } 
                             }
                        }
                          $log=  Log::create([
                                                'action' =>'Start Yearly Balance',
                                                'actionKeys' =>'Automatic Yearly Pending Balance',
                                                'empKey' =>1,
                                                'empName' =>'super henady',
                                                'createdAt' =>Carbon::now(),
                                                'actionStatus' =>'End',
                                            ]);
                    }catch(\Exception $e){
                         $log=  Log::create([
                                                'action' =>'Start Yearly Balance',
                                                'actionKeys' =>'Automatic Yearly Pending Balance',
                                                'empKey' =>1,
                                                'empName' =>'super henady',
                                                'createdAt' =>Carbon::now(),
                                                'actionStatus' =>'Fail',
                                            ]);
                        return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
                    }
                }
                //DiscountFromPending 
                public function DiscountFromPending(){
                    try{
                       
                         $log=  Log::create([
                                                'action' =>'Start DiscountFromPending Balance',
                                                'actionKeys' =>'Automatic DiscountFromPending Pending Balance',
                                                'empKey' =>1,
                                                'empName' =>'super henady',
                                                'createdAt' =>Carbon::now(),
                                                'actionStatus' =>'Start',
                                            ]);
            
                        $all_Users = User::where('active',1)->get();
            
                        foreach($all_Users as $current_user){
                            $userAnnual = UserAnnual::where('user_id',$current_user->id)->first();
                            $userAnnual2 = UserAnnual::where('user_id',$current_user->id)->first();
                            if(!empty($userAnnual->id)){

                                if(!empty($current_user->user_details_id?$current_user->user_details_id_fun->hiringDate:null))
                                {
                                    $annual_balance = 0; 
                                $contract_date =Carbon::create( $current_user->user_details_id_fun->hiringDate)  ;
                                if($contract_date->day ==1){
                                    $contract_date =Carbon::create( $current_user->user_details_id_fun->hiringDate) ->addMonths(12) ;
                                    }else{
                                        $contract_date =Carbon::create( $current_user->user_details_id_fun->hiringDate) ->addMonths(11) ;
                                    }
                                  $for_log_pending = 0;
                                    try{
                                        if(  $userAnnual2->pending_balance != 0){
                    
                                        
                                         if(Carbon::now()->month <=6){
                                              $for_log_pending= 2.5;
                                            if($contract_date >= Carbon::now()){
                                                $userAnnual->update([
                                                    'pending_balance' =>  $userAnnual2->pending_balance -2.5,
                                                    'total_leave_balance' =>  $userAnnual2->total_leave_balance +2.5,
                                                    'available_leave_balance' =>  $userAnnual2->available_leave_balance +2.5,
                                                    'monthly_balance_spend'=>0.0,

                                                ]);
                                            }else{
                                                                                              $for_log_pending= 1.75;

                                                $userAnnual->update([
                                                    'pending_balance' =>  $userAnnual2->pending_balance -1.75,
                                                    'total_leave_balance' =>  $userAnnual2->total_leave_balance +1.75,
                                                    'available_leave_balance' =>  $userAnnual2->available_leave_balance +1.75,
                                                    'monthly_balance_spend'=>0.0,

                                                ]);
                                               
                                            }
                                        }else{
                                            $for_log_pending = $userAnnual2->pending_balance;
                                            $userAnnual->update([
                                                'pending_balance' =>  0.0,
                                                'total_leave_balance' =>  $userAnnual2->total_leave_balance + $userAnnual2->pending_balance,
                                                'available_leave_balance' =>  $userAnnual2->available_leave_balance + $userAnnual2->pending_balance,
                                                    'monthly_balance_spend'=>0.0,
                                            ]);
                                        }
                                       
                                        $log=  Log::create([
                                            'action' => $current_user->username ." Discount Pending Balance " .$for_log_pending ,
                                            'actionKeys' =>$current_user->id ." Discount Pending Balance " . $for_log_pending,
                                            'empKey' =>$current_user->id,
                                            'empName' =>$current_user->username,
                                            'createdAt' =>Carbon::now(),
                                            'actionStatus' =>'done',
                                           ]);
                                        }else{ $userAnnual->update([
                                                    'monthly_balance_spend'=>0.0,
                                            ]);
                                        }
                                    }catch(\Exception $e){
                                        $log=  Log::create([
                                            'action' => $current_user->username . " Discount Pending Balance " . $for_log_pending,
                                            'actionKeys' =>$current_user->id ." Discount Pending Balance " . $for_log_pending,
                                            'empKey' =>$current_user->id,
                                            'empName' =>$current_user->username,
                                            'createdAt' =>Carbon::now(),
                                            'actionStatus' =>'Failed',
                                           ]);
                                    }
                                   
                                } 
                             }
                        }
                          $log=  Log::create([
                                                'action' =>'End DiscountFromPending Balance',
                                                'actionKeys' =>'Automatic DiscountFromPending Pending Balance',
                                                'empKey' =>1,
                                                'empName' =>'super henady',
                                                'createdAt' =>Carbon::now(),
                                                'actionStatus' =>'End',
                                            ]);
            
                    }catch(\Exception $e){
                         $log=  Log::create([
                                                'action' =>'End DiscountFromPending Balance',
                                                'actionKeys' =>'Automatic DiscountFromPending Pending Balance',
                                                'empKey' =>1,
                                                'empName' =>'super henady',
                                                'createdAt' =>Carbon::now(),
                                                'actionStatus' =>'Fail',
                                            ]);
                        return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
                    }
                }
 
            /// done success generateDateRange
            public function CreateResetBalance(){
                   try{
                        $log=  Log::create([
                                                'action' =>'Start Reset Balance',
                                                'actionKeys' =>'Automatic Reset  Balance',
                                                'empKey' =>1,
                                                'empName' =>'super henady',
                                                'createdAt' =>Carbon::now(),
                                                'actionStatus' =>'Start',
                                            ]);
                       
                                            $all_Users = User::where('active',1)->get();
                                    foreach($all_Users as $current_user){
                                        $userAnnual = UserAnnual::where('user_id',$current_user->id)->first();
                                     
                                        
                                        
                                        if(empty($userAnnual->id)){
                                            if(!empty($current_user->user_details_id?$current_user->user_details_id_fun->hiringDate:null))
                                            {
                                                $annual_balance = 0; 
                                                 $data = $current_user->user_details_id_fun->hiringDate;
                                                $contract_date =Carbon::create( $data);
                                            if($contract_date->day ==1){
                                                $data = $data;
                                             }else{
                                                $data = Carbon::create($contract_date->addMonthsNoOverflow(1)->month.'/01'.'/'.$contract_date->year);
                                            }
                                            
                                            $contract_date =Carbon::create( $data)->addMonths(6) ;
                                            if($contract_date <= Carbon::now()){

                                            if(Carbon::now()->year == $contract_date->year){
                                                $contract_date =Carbon::create( $data)->addMonths(12) ;
                                                if(Carbon::now()->year == $contract_date->year){
                                                    $annual_balance = 15;
                                                    $remain = (12 -$contract_date->month  +1 )*1.75;
                                                    $annual_balance+=$remain;
                                                }else{
                                                    $contract_date =Carbon::create( $data)->addMonths(6) ;
                                                    $remain = (12 -$contract_date->month  +1 )*2.5;
                                                    $annual_balance=$remain;
                                
                                                }
                                            }else{
                                                $contract_date =Carbon::create( $data)->addMonths(12) ;
                                                $diff_years = Carbon::now()->year - $contract_date->year;
                                                if($diff_years == 0){
                                                    $annual_balance = 15;
                                                    $contract_date =Carbon::create( $data) ;
                                                            $remain = (12 -$contract_date->addMonths(12)->month  +1 )*1.75;
                                                    
                                                    $annual_balance+=$remain;

                                                }else{
                                                    $annual_balance = 15;
                                                    $contract_date =Carbon::create( $data) ;
                                                        $remain = (12 -$contract_date->addMonths(12)->month +1 )*1.75 +(21*$diff_years);
                                                    
                                                    $annual_balance+=$remain;
                                                }
                                            }
                                            }
                                            try{
                                                $userAnnual = UserAnnual::where('user_id',$current_user->id)->first();
                                                 if($annual_balance != 0){
                                                  
                                                    $userAnnual = UserAnnual::create([
                                                        'pending_balance' => $annual_balance,
                                                        'monthly_balance_spend' => 0.0,
                                                        'discount_from_pending'=>0.0,
                                                        'total_leave_balance'=>0.0,
                                                        'user_creator_id'=>1,
                                                        'user_id'=>$current_user->id,
                                                        'available_leave_balance'=>0.0,
                                                    ]);
                                                }
                                              
                                            $log=  Log::create([
                                                'action' => $current_user->id ."Added Pending Balance " . $annual_balance,
                                                'actionKeys' =>$current_user->id ."Added Pending Balance " . $annual_balance,
                                                'empKey' =>$current_user->id,
                                                'empName' =>$current_user->username,
                                                'createdAt' =>Carbon::now(),
                                                'actionStatus' =>'Failed',
                                            ]);
                                        }catch(\Exception $e){
                                            $log=  Log::create([
                                                'action' => $current_user->id ."Added Pending Balance " . $annual_balance,
                                                'actionKeys' =>$current_user->id ."Added Pending Balance " . $annual_balance,
                                                'empKey' =>$current_user->id,
                                                'empName' =>$current_user->username,
                                                'createdAt' =>Carbon::now(),
                                                'actionStatus' =>'Failed',
                                            ]);
                                        }
                                }
                            
        
                             }
                        }
                          $log=  Log::create([
                                                'action' =>'Start Reset Balance',
                                                'actionKeys' =>'Automatic Reset  Balance',
                                                'empKey' =>1,
                                                'empName' =>'super henady',
                                                'createdAt' =>Carbon::now(),
                                                'actionStatus' =>'End',
                                            ]);
                    }catch(\Exception $e){
                          $log=  Log::create([
                                                'action' =>'Start Reset Balance',
                                                'actionKeys' =>'Automatic Reset  Balance',
                                                'empKey' =>1,
                                                'empName' =>'super henady',
                                                'createdAt' =>Carbon::now(),
                                                'actionStatus' =>'Error',
                                            ]);
                        return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
                    }
                }
      
  
  
  
  
  
  
 public function index()
    {
        //
    }


    public function GetUserAnnual(Request $request){
    try{
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|numeric|exists:users,id',
            'token'=>'required|string'
        ]);
        if ($validator->fails()) {

            return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
        }
            $annualStatus = UserAnnual::where('user_id',$request->user_id)->first();
           
            if(!empty($annualStatus->id)){

                return ResponseApi::acceptedResponseApi($this->CastArrayAnnaul($annualStatus),"success",201);
            
  
            }else{
              return ResponseApi::notFoundResponse(['message'=>"Empty Annual "],"Empty",200);
  
            }
               
          }catch(\Exception $e){
              return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
  
          }
    }

    public function GetAllUserAnnual(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
             $annualStatus = UserAnnual::all();
            $array_reponse=[];
             if(!empty($annualStatus[0])){
                foreach($annualStatus as $annual_user){
                    $array_reponse[]= $this->CastArrayAnnaul($annual_user);
                }
                
                
                return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
   
             }else{
               return ResponseApi::notFoundResponse(['message'=>"Empty Annual  "],"Empty",200);
   
             }
                
           }catch(\Exception $e){
               return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
   
           }
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
     * @param  \App\Models\UserAnnual  $userAnnual
     * @return \Illuminate\Http\Response
     */
    public function show(UserAnnual $userAnnual)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\UserAnnual  $userAnnual
     * @return \Illuminate\Http\Response
     */
    public function edit(UserAnnual $userAnnual)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\UserAnnual  $userAnnual
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, UserAnnual $userAnnual)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\UserAnnual  $userAnnual
     * @return \Illuminate\Http\Response
     */
    public function destroy(UserAnnual $userAnnual)
    {
        //
    }
}
