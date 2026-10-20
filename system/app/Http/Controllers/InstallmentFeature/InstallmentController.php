<?php

namespace App\Http\Controllers\InstallmentFeature;

use App\Http\Controllers\Controller;
  use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use App\Models\InstallmentStatus;
use Illuminate\Support\Facades\Auth;

 use App\Models\InstallmentType;
use Illuminate\Http\Request;
use App\Models\Installment;
use App\Models\InstallmentPeriod;
use App\Models\UserPermissionGroup;

use Carbon\Carbon;
use Illuminate\Support\Str;

class InstallmentController extends Controller
{
 

    public function CastInstallment(Installment $dep){

        $installment_period_details =  []; 
       $value =  InstallmentPeriod::where('installment_id',$dep->id)->where('is_paid',0)->orderBy('incoming_date')->first();
        if(!empty( $value->id)) {
        
        $installment_period_details []= [
            'installment_id'=>$value->installment_id.'',
            'is_paid'=>$value->is_paid,
            'installment_amount'=>(float)$value->installment_amount,
            'incoming_date'=>$value->incoming_date,
            'user_creator_name'=>!empty($value->user_creator_id_fun)?$value->user_creator_id_fun->username:null,
            'installment_description'=>$value->installment_description,
            'id'=>$value->id.'',
            'user_creator'=>$value->user_creator_id.'',
            'rowIndex'=>$value->rowIndex
        ];
       }
 
       $paid = InstallmentPeriod::where('installment_id',$dep->id)->where('is_paid',1)->get()->sum('installment_amount');
        $array_reponse =[
            'user_creator'=>$dep->user_creator_id,
            'user_creator_name'=>!empty($dep->user_creator_id_fun)?$dep->user_creator_id_fun->username:null,
            'title'=>$dep->title,
            'payment_bank'=>$dep->payment_bank,
            'main_description'=>$dep->main_description,
            'installment_status_id'=>$dep->installment_status_id.'',
            'installment_status_name'=>!empty($dep->installment_status_id_fun)?$dep->installment_status_id_fun->installment_status_name:null,
            'installment_type_id'=>$dep->installment_type_id.'',
            'installment_type_name'=>!empty($dep->installment_type_id_fun)?$dep->installment_type_id_fun->installment_type_name:null,
            'total_amount'=>(float)$dep->total_amount,
            'remaining'=>(float)$dep->total_amount - (float)$paid,
            'interest_amount'=>(float)$dep->interest_amount,
            'id'=>$dep->id.'',
            'currency'=>$dep->currency,
            'down_payment_amount'=>$dep->down_payment_amount,
            'installment_period_array'=>$installment_period_details
        ];

        return $array_reponse;
    }

    public function CastInstallmentSpecific (Installment $dep){

        $installment_period_details =  []; 
       $installment_period =  InstallmentPeriod::where('installment_id',$dep->id)->get();
        foreach ($installment_period as  $value) {
        
        $installment_period_details [] = [
            'installment_id'=>$value->installment_id.'',
            'is_paid'=>$value->is_paid,
            'installment_amount'=>(float)$value->installment_amount,
            'incoming_date'=>$value->incoming_date,
            'user_creator_name'=>!empty($value->user_creator_id_fun)?$value->user_creator_id_fun->username:null,
            'installment_description'=>$value->installment_description,
            'id'=>$value->id.'',
            'user_creator'=>$value->user_creator_id.'',
            'rowIndex'=>$value->rowIndex
        ];
       }
       $paid = InstallmentPeriod::where('installment_id',$dep->id)->where('is_paid',1)->get()->sum('installment_amount');

         $array_reponse =[
            'user_creator'=>$dep->user_creator_id,
            'user_creator_name'=>!empty($dep->user_creator_id_fun)?$dep->user_creator_id_fun->username:null,
            'title'=>$dep->title,
            'payment_bank'=>$dep->payment_bank,
            'main_description'=>$dep->main_description,
            'installment_status_id'=>$dep->installment_status_id.'',
            'installment_status_name'=>!empty($dep->installment_status_id_fun)?$dep->installment_status_id_fun->installment_status_name:null,
            'installment_type_id'=>$dep->installment_type_id.'',
            'installment_type_name'=>!empty($dep->installment_type_id_fun)?$dep->installment_type_id_fun->installment_type_name:null,
            'total_amount'=>(float)$dep->total_amount,
            'remaining'=>(float)$dep->total_amount - (float)$paid,
            'interest_amount'=>(float)$dep->interest_amount,
            'id'=>$dep->id.'',
            'currency'=>$dep->currency,
            'down_payment_amount'=>$dep->down_payment_amount,
            'installment_period_array'=>$installment_period_details
        ];

        return $array_reponse;
    }

    public function DeleteInstallmentPeriod(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'installment_period_id'=>'required|numeric|exists:installment_periods,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            
            $user_permission = UserPermissionGroup::where('users_id',Auth::guard('user_api')->user()->id)->where('permissions_id',18)->first();

            if(empty($user_permission->id)){
                return ResponseApi::badMethodErrorResponse(['message'=>'this user doesnt have permission'],"Access Denied",400);
            }

            $reportStatus=  InstallmentPeriod::where('id',$request->installment_period_id)->first();

          if(!empty($reportStatus->id)){
           
                $reportStatus->delete();
          

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Installment  not found"],"Validator Errors",400);

          }
         
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

    public function DeleteInstallment(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'installment_id'=>'required|numeric|exists:installments,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            $user_permission = UserPermissionGroup::where('users_id',Auth::guard('user_api')->user()->id)->where('permissions_id',18)->first();

            if(empty($user_permission->id)){
                return ResponseApi::badMethodErrorResponse(['message'=>'this user doesnt have permission'],"Access Denied",400);
            }

            $reportStatus=  Installment::where('id',$request->installment_id)->first();

          if(!empty($reportStatus->id)){
            $reportStatus2=  InstallmentPeriod::where('installment_id',$request->installment_id)->get();
            foreach ($reportStatus2 as   $value) {
                $value->delete();
            }
            $reportStatus->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Installment  not found"],"Validator Errors",400);

          }
         
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

    public function UpdateInstallmentPeriod(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'installment_period_id'=>'required|numeric|exists:installment_periods,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            $user_permission = UserPermissionGroup::where('users_id',Auth::guard('user_api')->user()->id)->where('permissions_id',18)->first();

            if(empty($user_permission->id)){
                return ResponseApi::badMethodErrorResponse(['message'=>'this user doesnt have permission'],"Access Denied",400);
            }

          $reportStatus=  InstallmentPeriod::where('id',$request->installment_period_id)->first();

          if(!empty($reportStatus->id)){

            $reportStatus->update($request->all());

            return ResponseApi::acceptedResponseApi($reportStatus,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Installment Period not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

    public function UpdateInstallment(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'installment_id'=>'required|numeric|exists:installments,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            $user_permission = UserPermissionGroup::where('users_id',Auth::guard('user_api')->user()->id)->where('permissions_id',18)->first();

            if(empty($user_permission->id)){
                return ResponseApi::badMethodErrorResponse(['message'=>'this user doesnt have permission'],"Access Denied",400);
            }


          $reportStatus=  Installment::where('id',$request->installment_id)->first();

          if(!empty($reportStatus->id)){

            $reportStatus->update($request->all());

            if(!empty($request->installment_period_array)){
                foreach($request->installment_period_array as $per){
                    if(!empty($per['id'])){
                        $period=  InstallmentPeriod::where('id',$per['id'])->first();
                        $period->update([
                            'rowIndex'=>$per['rowIndex']
                        ]);
                    }
                }
            }

            return ResponseApi::acceptedResponseApi($reportStatus,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Installment  not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return $e;
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
  
    public function CreateInstallment(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'title' => 'required|string',
                 'installment_type_id' => 'required|numeric|exists:installment_types,id',
                    'total_amount' => 'required|string',
                'token'=>'required|string'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

            //Permission Check 
            $user_permission = UserPermissionGroup::where('users_id',Auth::guard('user_api')->user()->id)->where('permissions_id',18)->first();

            if(empty($user_permission->id)){
                return ResponseApi::badMethodErrorResponse(['message'=>'this user doesnt have permission'],"Access Denied",400);

            }
          

          $reportStatus=  Installment::create([
            'title'=>$request->title,
            'payment_bank'=>!empty($request->payment_bank)?$request->payment_bank:null,
            'main_description'=>!empty($request->main_description)?$request->main_description:null,
            'installment_status_id'=>1,
            'user_creator_id'=>Auth::guard('user_api')->user()->id,
            'installment_type_id'=>$request->installment_type_id,
            'total_amount'=>!empty($request->total_amount)?$request->total_amount:null,
            'remaining'=>!empty($request->remaining)?$request->remaining:null,
            'interest_amount'=>!empty($request->interest_amount)?$request->interest_amount:null,
            'currency'=>!empty($request->currency)?$request->currency:null,
            'down_payment_amount'=>!empty($request->down_payment_amount)?$request->down_payment_amount:null,
            ]);

            if(!empty($reportStatus->id)){

                if($request->has('installment_period_array')){
                    foreach ($request->installment_period_array as $value) {

                        $reportStatus2=  InstallmentPeriod::create([
                            'installment_id'=>$reportStatus->id,
                            'is_paid'=>!empty($value['is_paid'])?$value['is_paid']:0,
                            'installment_amount'=>!empty($value['installment_amount'])?$value['installment_amount']:null,
                           
                            'incoming_date'=>!empty($value['incoming_date'])?Carbon::createFromFormat('m/d/Y', $value['incoming_date']):null,
                             'user_creator_id'=>Auth::guard('user_api')->user()->id,
                            'installment_description'=>!empty($value['installment_description'])?$value['installment_description']:null,
                            'rowIndex'=>!empty($request->rowIndex)?$request->rowIndex:null,
                            ]);
 
                        
                    }
                } 

                return ResponseApi::acceptedResponseApi($reportStatus,"success",201);

              
                   
            }else{
                return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

            }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

    public function CreateInstallmentPeriod(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'incoming_date' => 'required',
                 'installment_amount' => 'required|string',
                'token'=>'required|string',
                'installment_id'=>'required|numeric|exists:installments,id',

            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

            //Permission Check 
            $user_permission = UserPermissionGroup::where('users_id',Auth::guard('user_api')->user()->id)->where('permissions_id',18)->first();

            if(empty($user_permission->id)){
                return ResponseApi::badMethodErrorResponse(['message'=>'this user doesnt have permission'],"Access Denied",400);

            }

            $reportStatus=  InstallmentPeriod::create([
                'installment_id'=>$request->installment_id,
                'is_paid'=>!empty($request->is_paid)?$request->is_paid:0,
                'installment_amount'=>!empty($request->installment_amount)?$request->installment_amount:null,
                'incoming_date'=>!empty($request->incoming_date)?Carbon::createFromFormat('m/d/Y',$request->incoming_date):null,
                 'user_creator_id'=>Auth::guard('user_api')->user()->id,
                'installment_description'=>!empty($request->installment_description)?$request->installment_description:null,
                'rowIndex'=>!empty($request->rowIndex)?$request->rowIndex:null,
                ]);
            if(!empty($reportStatus->id)){

                
                return ResponseApi::acceptedResponseApi($reportStatus,"success",201);

              
                   
            }else{
                return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

            }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }


    public function GetInstallmentDashboard(Request $request){
        try{
            $validator = Validator::make($request->all(), [
            'token'=>'required|string'
            ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            $array_reponse=[] ;

            // Permission Check 
            $user_permission = UserPermissionGroup::where('users_id',Auth::guard('user_api')->user()->id)->where('permissions_id',18)->first();

            if(empty($user_permission->id)){
                return ResponseApi::badMethodErrorResponse(['message'=>'this user doesnt have permission'],"Access Denied",400);

            }


            $total_amount = 0;
            $paid_amount = 0;
            $pending_amount = 0;
            $insterest_amount = 0;
            
            $total_amount = Installment::all()->sum('total_amount');
            $paid_amount = InstallmentPeriod::where('is_paid',1)->get()->sum('installment_amount');
            $pending_amount = $total_amount - $paid_amount;
            
            $insterest_amount = Installment::all()->sum('interest_amount');
            $array_reponse = [
                'total_amount'=>$total_amount,
                'paid_amount'=>$paid_amount,
                'pending_amount'=>$pending_amount,
                'insterest_amount'=>$insterest_amount
            ];
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
        }

    }


    public function GetInstallmentDashboardForSpecificType(Request $request){
        try{
            $validator = Validator::make($request->all(), [
            'token'=>'required|string',
            'installment_type_id' => 'required|numeric|exists:installment_types,id',
            ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            $array_reponse=[] ;

            // Permission Check 
            $user_permission = UserPermissionGroup::where('users_id',Auth::guard('user_api')->user()->id)->where('permissions_id',18)->first();

            if(empty($user_permission->id)){
                return ResponseApi::badMethodErrorResponse(['message'=>'this user doesnt have permission'],"Access Denied",400);
            }



            // ========================= get exchange rate ==================================
            $currency= Installment::where('installment_type_id',$request->installment_type_id)->where('currency','<>',null)->get()->unique('currency')->groupBy('currency');
            
            $cur=   implode(",", array_keys($currency->toArray()));
            if(!Str::contains($cur, 'EGP')){
                $cur = 'EGP,'.$cur;
            }
            

            $URL =   'https://openexchangerates.org/api/latest.json?app_id=be1c370c0a6f417495febf8727576992&symbols='.$cur;
            $headers = array
            (
                'Content-Type: application/json',
                'Access-Control-Allow-Origin: *'
            );
            $ch = curl_init();
            
            $ch = curl_init();
            curl_setopt( $ch,CURLOPT_URL, $URL);
            curl_setopt( $ch,CURLOPT_POST, false );
            curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
            curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
            curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
            $val = curl_exec($ch );
            $object_json =  json_decode($val,true);
            // return $object_json;

            // ========================= End Of get exchange rate ==================================

            // return $object_json;
            // foreach (array_keys($currency->toArray()) as $c){
            //     return $c;
            // }
            
            $total_amount = 0;
            $paid_amount = 0;
            $pending_amount = 0;
            $insterest_amount = 0;
            
            // ============================= Get total_amount by USD =========================
            
            // $total_amount = Installment::where('installment_type_id',$request->installment_type_id)->get()->sum('total_amount');

            $insts = Installment::where('installment_type_id',$request->installment_type_id)->get();
            foreach ($insts as $in) {
                foreach ($object_json as $key =>$variable) {
                    if($key=='rates'){
                        foreach ($variable as  $value=>$number) {
                            if($value == $in->currency){
                                $total_amount +=(float) ($in->total_amount/$number);
                            }
                        }
                    }
                }
            }

            // $total_amount = round($total_amount,2);


            // ============================= Get insterest_amount =========================

            // $insterest_amount = Installment::where('installment_type_id',$request->installment_type_id)->get()->sum('interest_amount');
            // return $insts;
            foreach ($insts as $in) {
                foreach ($object_json as $key =>$variable) {
                    if($key=='rates'){
                        foreach ($variable as  $value=>$number) {
                            if($value == $in->currency){
                                $insterest_amount +=(float) ($in->interest_amount/$number);
                            }
                        }
                    }
                }
            }

            $total_amount = $total_amount + $insterest_amount;

            // $insterest_amount = round($insterest_amount,2);
            // return $insterest_amount;

            // ============================= Get paid_amount =========================


            // $paid_amount = InstallmentPeriod::whereHas('installment_id_fun',function($query) use ($request){
            //     $query->where('installment_type_id',$request->installment_type_id);
            //   })->where('is_paid',1)->get()->sum('installment_amount');
            $paid_periods = InstallmentPeriod::whereHas('installment_id_fun',function($query) use ($request){
                $query->where('installment_type_id',$request->installment_type_id);
              })->where('is_paid',1)->get();
            
            foreach ($paid_periods as $per) {
                foreach ($object_json as $key =>$variable) {
                    if($key=='rates'){
                        foreach ($variable as  $value=>$number) {
                            $in = Installment::where('id',$per->installment_id)->get()->first();
                            if($value == $in->currency){
                                $paid_amount +=(float) ($per->installment_amount/$number);
                            }
                        }
                    }
                }
            }

            $paid_amount = $paid_amount;
            
            $pending_amount = $total_amount - $paid_amount;
            


            


            $array_reponse = [
                'total_amount'=>$total_amount,
                'paid_amount'=>$paid_amount,
                'pending_amount'=>$pending_amount,
                'insterest_amount'=>$insterest_amount,
                'exchange_rates'=>$object_json['rates']
            ];
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

        }catch(\Exception $e){
            return $e;
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
        }

    }

    public function GetAllInstallment(Request $request){
        try{
           $validator = Validator::make($request->all(), [
                    'token'=>'required|string'
                ]);
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
                $array_reponse=[] ;

            //Permission Check 
            $user_permission = UserPermissionGroup::where('users_id',Auth::guard('user_api')->user()->id)->where('permissions_id',18)->first();

            if(empty($user_permission->id)){
                return ResponseApi::badMethodErrorResponse(['message'=>'this user doesnt have permission'],"Access Denied",400);

            }
          $reportStatus = Installment::all();
          if(!empty($reportStatus[0]->id)){
            foreach($reportStatus as $dep){
                $array_reponse[] = $this->CastInstallment($dep);

        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Installment"],"Empty",200);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

    public function GetAllPendingInstallment(Request $request){
        try{
           $validator = Validator::make($request->all(), [
                    'token'=>'required|string'
                ]);
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
                //Permission Check 
            $user_permission = UserPermissionGroup::where('users_id',Auth::guard('user_api')->user()->id)->where('permissions_id',18)->first();

            if(empty($user_permission->id)){
                return ResponseApi::badMethodErrorResponse(['message'=>'this user doesnt have permission'],"Access Denied",400);

            }
                $array_reponse=[] ;
            $getallPending = InstallmentPeriod::where('is_paid',0)->get()->unique('installment_id');
            if(!empty($getallPending[0]->id)){
                foreach($getallPending as $dep){
                    $reportStatus = Installment::where('id',$dep->installment_id)->first();
                    if(!empty($reportStatus->id)){
                        $array_reponse[] = $this->CastInstallment($reportStatus);

                    }   
                }

                return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Installment"],"Empty",200);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

    public function GetAllPendingInstallmentForSpecificType(Request $request){
        try{
           $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'installment_type_id' => 'required|numeric|exists:installment_types,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            //Permission Check 
            $user_permission = UserPermissionGroup::where('users_id',Auth::guard('user_api')->user()->id)->where('permissions_id',18)->first();

            if(empty($user_permission->id)){
                return ResponseApi::badMethodErrorResponse(['message'=>'this user doesnt have permission'],"Access Denied",400);

            }

            $array_reponse=[] ;
            $getallPending = InstallmentPeriod::whereHas('installment_id_fun',function($query) use ($request){
                $query->where('installment_type_id',$request->installment_type_id);
              })->where('is_paid',0)->get()->unique('installment_id');
            // return $getallPending;
            if(!empty($getallPending[0]->id)){
                foreach($getallPending as $dep){
                    $reportStatus = Installment::where('id',$dep->installment_id)->first();
                    if(!empty($reportStatus->id)){
                        $array_reponse[] = $this->CastInstallment($reportStatus);
                    }   
                }
                return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Installment"],"Empty",200);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    

    public function GetAllInstallmentForSpecificStatus(Request $request){
        try{
           $validator = Validator::make($request->all(), [
                    'token'=>'required|string',
                    'installment_status_id' => 'required|numeric|exists:installment_types,id',

                ]);
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }

                //Permission Check 
            $user_permission = UserPermissionGroup::where('users_id',Auth::guard('user_api')->user()->id)->where('permissions_id',18)->first();

            if(empty($user_permission->id)){
                return ResponseApi::badMethodErrorResponse(['message'=>'this user doesnt have permission'],"Access Denied",400);

            }
                $array_reponse=[] ;

            
                $reportStatus = Installment::where('installment_status_id',$request->installment_status_id)->get();
                if(!empty($reportStatus[0]->id)){
                  foreach($reportStatus as $dep){
                      $array_reponse[] = $this->CastInstallment($dep);
      
              }
                  return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
      
                }else{
                  return ResponseApi::notFoundResponse(['message'=>"Empty Installment"],"Empty",200);
      
                }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetAllInstallmentForSpecificType(Request $request){
        try{
           $validator = Validator::make($request->all(), [
                    'token'=>'required|string',
                    'installment_type_id' => 'required|numeric|exists:installment_types,id',

                ]);
                if ($validator->fails()) {
        
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }

                //Permission Check 
            $user_permission = UserPermissionGroup::where('users_id',Auth::guard('user_api')->user()->id)->where('permissions_id',18)->first();

            if(empty($user_permission->id)){
                return ResponseApi::badMethodErrorResponse(['message'=>'this user doesnt have permission'],"Access Denied",400);

            }
                $array_reponse=[] ;

            
                $reportStatus = Installment::where('installment_type_id',$request->installment_type_id)->get();
                if(!empty($reportStatus[0]->id)){
                  foreach($reportStatus as $dep){
                      $array_reponse[] = $this->CastInstallment($dep);
      
              }
                  return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
      
                }else{
                  return ResponseApi::notFoundResponse(['message'=>"Empty Installment"],"Empty",200);
      
                }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

    public function GetAllNearestInstallment(Request $request){
        try{
           $validator = Validator::make($request->all(), [
                    'token'=>'required|string'

                ]);
                if ($validator->fails()) {
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }

                //Permission Check 
            $user_permission = UserPermissionGroup::where('users_id',Auth::guard('user_api')->user()->id)->where('permissions_id',18)->first();

            if(empty($user_permission->id)){
                return ResponseApi::badMethodErrorResponse(['message'=>'this user doesnt have permission'],"Access Denied",400);

            }

                $array_reponse=[] ;

            $getallPending = InstallmentPeriod::whereDate('incoming_date', '<=', Carbon::now()->addDays(10))->where('is_paid',0)->get()->unique('installment_id');
 
            if(!empty($getallPending[0]->id)){
                foreach($getallPending as $dep){
                    $reportStatus = Installment::where('id',$dep->installment_id)->first();
                    if(!empty($reportStatus->id)){
                        $array_reponse[] = $this->CastInstallment($reportStatus);
                    }   
                }

                return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Installment"],"Empty",200);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }

    public function GetSpecificInstallment(Request $request){
        //try{
           $validator = Validator::make($request->all(), [
                    'token'=>'required|string',
                    'installment_id'=>'required|numeric|exists:installments,id',

                ]);
                if ($validator->fails()) {
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }

                //Permission Check 
            $user_permission = UserPermissionGroup::where('users_id',Auth::guard('user_api')->user()->id)->where('permissions_id',18)->first();

            if(empty($user_permission->id)){
                return ResponseApi::badMethodErrorResponse(['message'=>'this user doesnt have permission'],"Access Denied",400);

            }

                $array_reponse=[] ;
 
                    $reportStatus = Installment::where('id',$request->installment_id)->first();
                    if(!empty($reportStatus->id)){
                        $array_reponse[] = $this->CastInstallmentSpecific($reportStatus);
                        return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

                     

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Installment"],"Empty",200);

          }
             
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
     * @param  \App\Models\Installment  $installment
     * @return \Illuminate\Http\Response
     */
    public function show(Installment $installment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Installment  $installment
     * @return \Illuminate\Http\Response
     */
    public function edit(Installment $installment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Installment  $installment
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Installment $installment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Installment  $installment
     * @return \Illuminate\Http\Response
     */
    public function destroy(Installment $installment)
    {
        //
    }
}
