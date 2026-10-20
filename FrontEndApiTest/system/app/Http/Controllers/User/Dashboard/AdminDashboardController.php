<?php

namespace App\Http\Controllers\User\Dashboard;
use App\Http\Controllers\Controller;
use App\Models\UserSalary;
use Illuminate\Http\Request;
use App\Models\UserSalaryHistory;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Carbon\Carbon;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use App\Models\UserDetail;
use App\Models\UserViolence;
use Illuminate\Support\Str;
use File;
use App\Models\Rating;
 use App\Models\ContactLead;
use App\Models\ContactLeadActivity;
use App\Models\ContactLeadDublicate;
 use App\Models\ContactLeadStatus;
use App\Models\ContactLeadSubStatus;
use App\Models\ContactLeadType;
use App\Models\Product;
use App\Models\Partner;


use DatePeriod;
use DateInterval;
use DB;
use App\Models\ActivityStatus;
use App\Models\ActivityType;


class AdminDashboardController extends Controller
{
    
    public function castarrayLead(ContactLead $lead)
    {
        $activity = ContactLeadActivity::orderBy('from_date', 'asc')->where('activity_status_id', 2)->where('contact_lead_id', $lead->id)->first();
        $activity_prev = ContactLeadActivity::orderBy('created_at', 'desc')->where('contact_lead_id', $lead->id)->get();
        if(!empty($lead->contact_id_fun->partner_id)){
                $partner = Partner::where('id', $lead->contact_id_fun->partner_id)
                  ->withTrashed()
                  ->first();
                  
                  
        }
        $array_reponse = [
            'id' => $lead->id . '',
            'campagin_id' => $lead->campagin_id,
            'campagin_name' => $lead->campagin_id_fun->campagin_name,

            'sales_id' => $lead->sales_id,
            'sales_name' => !empty($lead->sales_id) ? $lead->sales_id_fun->username : null,

            'user_creator_id' => $lead->user_creator_id,
            'user_creator_name' => $lead->user_creator_id_fun->username,

            'status_id' => !empty($lead->lead_sub_status_id) ? $lead->lead_sub_status_id_fun->contact_status_id : null,
            'status_name' => !empty($lead->lead_sub_status_id) ? (!empty($lead->lead_sub_status_id_fun->contact_status_id) ? $lead->lead_sub_status_id_fun->contact_status_id_fun->contact_status_name : null) : null,

            'lead_sub_status_id' => $lead->lead_sub_status_id,
            'lead_sub_status_name' => !empty($lead->lead_sub_status_id) ? $lead->lead_sub_status_id_fun->contact_sub_status_name : null,

            'lead_type_id' => $lead->lead_type_id,
            'lead_type_name' => !empty($lead->lead_type_id) ? $lead->lead_type_id_fun->lead_type_name : null,

            'product_id' => $lead->product_id,
            'product_name' => !empty($lead->product_id) ? $lead->product_id_fun->product_name : null,

            'label' => $lead->label,
            'prev_lead_sub_status_id'=>!empty($activity_prev[1]->id)?$activity_prev[1]->lead_sub_status_id:null,

            'partner_id' => !empty($partner->id)?$partner->id:null,
            'partner_name' => !empty($partner->id)?$partner->partner_name:null,
            'country' => !empty($partner->id)?$partner->country:null,

            'expected_close_date'=>!empty($lead->expected_close_date)? Carbon::parse( $lead->expected_close_date)->format('m/d/Y'):null ,
            'actual_closing_date'=>!empty($lead->actual_closing_date)? Carbon::parse( $lead->actual_closing_date)->format('m/d/Y'):null ,
            'currency' => $lead->currency,

            'title' => $lead->title,
            'contact_id'=>$lead->contact_id,
            'notes' => $lead->notes,
            'contact_name' => !empty($lead->contact_id)?$lead->contact_id_fun->name:null,
            'email' => !empty($lead->contact_id)?$lead->contact_id_fun->email:null,
            'phone' => !empty($lead->contact_id)?$lead->contact_id_fun->phone:null,
            'address' => !empty($lead->contact_id)?$lead->contact_id_fun->address:null,

            'cost_details' =>!empty( $lead->cost_details)?$lead->cost_details:null,

            'cost' => $lead->cost,
            'seen' => (boolean) $lead->seen,
            'isLead' => (boolean) $lead->isLead,
            'transfer' => (boolean) $lead->transfer,
            'created_at' => $lead->created_at,
            'next_action' => !empty($activity->comment) ? $activity->comment : null,
            'next_action_date' => !empty($activity->from_date) ? $activity->from_date : null,
            'next_action_type_id' => !empty($activity->activity_type_id) ? $activity->activity_type_id : null,
            'next_action_id' => !empty($activity->id) ? $activity->id . '' : null,
            'updated_at' => $lead->updated_at,
        ];
        return $array_reponse;
    }
    public function Exchange($start_date , $end_date){
        $currency= ContactLead::whereBetween('actual_closing_date',[$start_date,$end_date])->where('currency','<>',null)->get()->unique('currency')->groupBy('currency');
        $cur=   implode(",", array_keys($currency->toArray()));
      
        $URL =   'https://openexchangerates.org/api/latest.json?app_id=be1c370c0a6f417495febf8727576992&symbols='.$cur;
        $start = $start_date;
        $end =  $end_date;
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
        // curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) );
        $val = curl_exec($ch );
        $object_json =  json_decode($val,true);
       //rates
       $count=0;
       $interval = $end->diff($start);
       $period = new DatePeriod($start, new DateInterval('P1M'), $end);
      $duartion = [];
      $dataset= [] ;
      $once = false;
        foreach($period as $dt) {
            $curr = $dt->format('M');
            $curr2 = $dt->format('Y');
            if($once == false){

                $duartion [] = $curr.'-'.$curr2;
            }
        }
        $total =[];
        $amount_open= [];
        $amount_won = [];
        $start = $start_date;
        $end =  $end_date;
      
      
        foreach($period as $dt) {

            $open =ContactLead::whereMonth('actual_closing_date',$dt->month)->whereYear('actual_closing_date',$dt->year)->whereHas('lead_sub_status_id_fun',function($q){
                $q->where('contact_status_id',3);
           })->get();
           
           $amountopen = 0.0;
           foreach ($open as $opens) {
                foreach ($object_json as $key =>$variable) {
                    if($key=='rates'){
                        foreach ($variable as  $value=>$number) {
                           if($value == $opens->currency){
                                $amountopen +=(int) ($opens->cost/$number);
                           }
                        }
                    }
                }
           }

           $won =ContactLead::whereMonth('actual_closing_date',$dt->month)->whereYear('actual_closing_date',$dt->year)->where('lead_sub_status_id',9)->get();
           $amountwon = 0.0;
           foreach ($won as $opens) {
                foreach ($object_json as $key =>$variable) {
                    if($key=='rates'){
                        foreach ($variable as  $value=>$number) {
                           if($value == $opens->currency){
                                $amountwon +=(int) ($opens->cost/$number);
                           }
                        }
                    }
                }
           }
           $total[] =  $amountopen  +$amountwon;
           $amount_open[] = $amountopen;
           $amount_won[] = $amountwon;
          
            $once =true;
           
        
        }
        $dataset[]= [
            'label'=>'Total',
            'data'=> $total,
        ];
        $dataset[]= [
            'label'=>'Won',
            'data'=> $amount_won,
        ];
        $dataset[]= [
            'label'=>'Open',
            'data'=> $amount_open,
        ];
        
        //  ==================== Get Total Value Of Won Deals ==============================
        $currentValue = array_sum($amount_won);
        $lastValue = $this->getLastPeriodOfWon($start_date,$end_date,$object_json);
        $upOrDown;

        if($lastValue > $currentValue){
            $upOrDown = 'down';
        }elseif($lastValue < $currentValue){
            $upOrDown = 'up';
        }else{
            $upOrDown = 'eq';
        }
        
        $totalValueOfWonDeals = [
            'currentValue'=>$currentValue,
            'lastValue'=>$lastValue,
            'upOrDown'=>$upOrDown
        ];
        
                
        $totalValueOfWonDeals = [
            'currentValue'=>$currentValue,
            'lastValue'=>$lastValue,
            'upOrDown'=>$upOrDown
        ];
        
        //  ==================== End Total Value Of Won Deals ==============================

        
        //  ==================== Get Revenew Over Product ==============================
        $products= ContactLead::where('product_id','<>',null)->get()->unique('product_id');
        $label =[];
        $data =[];
        foreach($products as $product){
            $label []= $product->product_id_fun->product_name;
            $amountProduct = 0.0;
            foreach($period as $dt) {
                $contactleads = ContactLead::whereMonth('actual_closing_date',$dt->month)->where('product_id',$product->product_id_fun->id)->where('lead_sub_status_id',9)->get();
                foreach ($contactleads as $contactlead) {
                    foreach ($object_json as $key =>$variable) {
                        if($key=='rates'){
                            foreach ($variable as  $value=>$number) {
                               if($value == $contactlead->currency){
                                    $amountProduct +=(int) ($contactlead->cost/$number);
                               }
                            }
                        }
                    }
                }
            }
            $data []=$amountProduct;
        }

        $revenueOverProduct = [
            'labels'=>$label,
            'data'=>$data
        ];

        //  ==================== End Revenew Over Product ==============================
        
        //  ==================== Get Revenew Over Sales ==============================
        $sales = ContactLead::where('sales_id','<>',null)->get()->unique('sales_id');
        $label =[];
        $data =[];
        foreach($sales as $sa){
            $label []= $sa->sales_id_fun->username;
            $amountSales = 0.0;
            foreach($period as $dt) {
                $contactleads = ContactLead::whereMonth('actual_closing_date',$dt->month)->where('sales_id',$sa->sales_id_fun->id)->where('lead_sub_status_id',9)->get();
                foreach ($contactleads as $contactlead) {
                    foreach ($object_json as $key =>$variable) {
                        if($key=='rates'){
                            foreach ($variable as  $value=>$number) {
                               if($value == $contactlead->currency){
                                    $amountSales +=(int) ($contactlead->cost/$number);
                               }
                            }
                        }
                    }
                }
            }
            $data []=$amountSales;
        }

        $revenueOverSales = [
            'labels'=>$label,
            'data'=>$data
        ];

        //  ==================== End Revenew Over Sales ==============================
        

        
        $array_response = [
            'labels'=>$duartion,
            'datasets'=>$dataset,
            'totalValueOfWonDeals'=>$totalValueOfWonDeals,
            'revenueOverProduct'=>$revenueOverProduct,
            'revenueOverSales'=>$revenueOverSales
        ];
        return $array_response;


    }
    
    
    private function getLastPeriodOfWon($start_date,$end_date,$object_json){
        
        $startDate = Carbon::parse($start_date);
        $endDate = Carbon::parse($end_date);
        
        $months = $endDate->diffInMonths($startDate)+1;
        
        $startDate = $startDate->subMonths($months)->addDay();
        $endDate = $endDate->subMonths($months)->addDay();
        
        $start = $startDate;
        $end =  $endDate;
        
        $period = new DatePeriod($start, new DateInterval('P1M'), $end);
        foreach($period as $dt) {
            // return $dt->month.'-'.$dt->year;
           $won =ContactLead::whereMonth('actual_closing_date',$dt->month)->whereYear('actual_closing_date',$dt->year)->where('lead_sub_status_id',9)->get();
           $amountwon = 0.0;
           foreach ($won as $opens) {
                foreach ($object_json as $key =>$variable) {
                    if($key=='rates'){
                        foreach ($variable as  $value=>$number) {
                           if($value == $opens->currency){
                                $amountwon +=(int) ($opens->cost/$number);
                           }
                        }
                    }
                }
           }
           $amount_won[] = $amountwon;
        }
        
       
        return array_sum($amount_won);
    }



    public function calDate($start_date , $end_date){
        $start = $start_date;
        $end =  $end_date;
      
        $count=0;
        $interval = $end->diff($start);
        $period = new DatePeriod($start, new DateInterval('P1M'), $end);
       $duartion = [];
       $dataset= [] ;
       $once = false;
       $substatus = ContactLeadSubStatus::where('contact_status_id',3)->get();
       foreach ($substatus as $key) {
        $data = [];
        foreach($period as $dt) {
            $curr = $dt->format('M');
            $curr2 = $dt->format('Y');
            if($once == false){

                $duartion [] = $curr.'-'.$curr2;
            }

            $data[]=ContactLead::whereMonth('actual_closing_date',$dt->month)->whereYear('actual_closing_date',$dt->year)->where('lead_sub_status_id',$key->id)->count();
            
            }
            $once =true;
            $dataset[]= [
                'label'=>$key->contact_sub_status_name,
                'data'=> $data,
            ];
        }

        $array_response = [
                'labels'=>$duartion,
                'datasets'=>$dataset
            ];
            return $array_response;
        }

        public function SalesDate(){
         
            $sales= ContactLead::where('sales_id','<>',null)->get()->unique('sales_id');
            $managers= ContactLead::where('sales_id',null)->get()->unique('user_creator_id');
            $contact = ContactLead::all();
            $label =[];
            $data =[];
            foreach ($sales as  $value) {
                $label []= $value->sales_id_fun->username;
            }
            foreach ($managers as  $value) {
                $label []= $value->user_creator_id_fun->username;
            }
            
            foreach ($sales as  $value) {
                $data []= ContactLead::where('sales_id',$value->sales_id)->get()->count();
            }
            
            foreach ($managers as  $value) {
                $data []= ContactLead::where('sales_id',null)->where('user_creator_id',$value->user_creator_id)->get()->count();
            }
           
            $array_response = [
                'labels'=>$label,
                'data'=>$data
            ];
            return $array_response;
        }


            public function ActivityData(){

                $activity_status =ActivityStatus::all();
                $labels = [];
                foreach ($activity_status as $key) {
                    $labels [] = $key->activity_status_name;
                }
                $activity_type =ActivityType::all();
                $datasets= [];
                foreach ($activity_type as $key) {
                    $data=[];
                    if($key->id == 7 || $key->id ==8){
                        continue;
                    }
                    foreach ($activity_status as $value) {
                        $data [] = ContactLeadActivity::where('activity_type_id',$key->id)->where('activity_status_id',$value->id)->count();
                    }
                    $datasets [] = [
                        'label'=>$key->activity_type_name,
                        'data'=>$data,
                    ];
                }
              
                $array_response = [
                        'labels'=>$labels,
                        'datasets'=>$datasets
                    ];
                    return $array_response;
                }
    
    public function GetCRMDashboardData(Request $request){
    //    try{
              $validator = Validator::make($request->all(), [
                  'token' => 'required|string',
                  'start_date'=>'required|date',
                  'end_date'=>'required|date|after_or_equal:start_date'   
                ]);
              if ($validator->fails()) {
                  return ResponseApi::validatorErrorResponseApi($validator->errors()->toArray(),"Validator Errors",400);
              }
               $array_response =[
                    'dealProgressData'=>$this->calDate(Carbon::create($request->start_date),Carbon::create($request->end_date)),
                    'revenueforcastData'=>$this->Exchange(Carbon::create($request->start_date),Carbon::create($request->end_date)),
                    'leadsForSalesData'=>$this->SalesDate(),
                    'activitesData'=>$this->ActivityData(),
                 ];
                
                
                 return ResponseApi::badMethodErrorResponse($array_response,"Updated Sucess",201);
              if(Auth::guard('user_api')->user()->work_degrees_id==5){
                if(Auth::guard('user_api')->user()->sub_departments_id_fun->departments_id==1 ||Auth::guard('user_api')->user()->sub_departments_id_fun->departments_id==3){
           

                
                }
              }
             

              
        //   }catch(\Exception $e){
        //       return ResponseApi::badMethodErrorResponse(["message"=>"Server Error"],"server Error",500);
  
        //   }
      }
      
    public function GetrevenueForCastData(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token' => 'required|string',
                'label_date'=>'required|date',
                'label_name'=>'required|string'   
            ]);
            $givin_date =Carbon::create($request->label_date, 'UTC');
            // return $givin_date;
            if ($validator->fails()) {
                return ResponseApi::validatorErrorResponseApi($validator->errors()->toArray(),"Validator Errors",400);
            }
            if($request->label_name == 'Won'){
                $contactData = ContactLead::whereMonth('actual_closing_date',$givin_date->month)->whereYear('actual_closing_date',$givin_date->year)->where('lead_sub_status_id',9)->get();
            }else if($request->label_name == 'Open'){
                $contactData = ContactLead::whereMonth('updated_at',$givin_date->month)->whereYear('updated_at',$givin_date->year)->whereIn('lead_sub_status_id',[4,5,6,7,8,13])->get();
            }else{
                $contactData = ContactLead::whereMonth('updated_at',$givin_date->month)->whereYear('updated_at',$givin_date->year)->whereIn('lead_sub_status_id',[4,5,6,7,8,9,13])->get();
            }
            if (!empty($contactData[0]->id)) {
                foreach ($contactData as $dep) {
                    $array_reponse[] = $this->castarrayLead($dep);
                }
                return ResponseApi::acceptedResponseApi($array_reponse, "success", 201);

            } else {
                return ResponseApi::notFoundResponse(['message' => "Empty Contact Lead"], "Empty", 200);

            }
        }catch(\Exception $e){
          return ResponseApi::badMethodErrorResponse(["message"=>"Server Error"],"server Error",500);
        }
    }
    
    public function GetTotalValueOfWonDealData(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token' => 'required|string',
                'start_date'=>'required|date',
                'end_date'=>'required|string',
                'current'=>'required|numeric'
            ]);
            if ($validator->fails()) {
                return ResponseApi::validatorErrorResponseApi($validator->errors()->toArray(),"Validator Errors",400);
            }
            
            $start_date = Carbon::create(Carbon::parse($request->start_date)->format('m/d/Y H:i:s') );
            $end_date = Carbon::create(Carbon::parse($request->end_date)->format('m/d/Y H:i:s') );
            
            if($request->current == '1'){
                $end_date = $end_date->addDay();
                $contactData=  ContactLead::where('lead_sub_status_id',9)->whereBetween('actual_closing_date', [$start_date, $end_date])->get();
            }else{
                $months = $end_date->diffInMonths($start_date)+1;
                $start_date = $start_date->subMonths($months)->addDay();
                $end_date = $end_date->subMonths($months)->addDay();
                $start = $start_date;
                $end =  $end_date;
                $contactData=  ContactLead::where('lead_sub_status_id',9)->whereBetween('actual_closing_date', [$start_date, $end_date])->get();
            }
            


            if (!empty($contactData[0]->id)) {
                foreach ($contactData as $dep) {
                    $array_reponse[] = $this->castarrayLead($dep);
                }
                return ResponseApi::acceptedResponseApi($array_reponse, "success", 201);

            } else {
                return ResponseApi::notFoundResponse(['message' => "Empty Contact Lead"], "Empty", 200);

            }
        }catch(\Exception $e){
            return $e;
          return ResponseApi::badMethodErrorResponse(["message"=>"Server Error"],"server Error",500);
        }
    }
    
    
    public function GetrevenuePerProductData(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token' => 'required|string',
                'start_date'=>'required|date',
                'end_date'=>'required|string',
                'product_name'=>'required|string|exists:products,product_name'
            ]);
            if ($validator->fails()) {
                return ResponseApi::validatorErrorResponseApi($validator->errors()->toArray(),"Validator Errors",400);
            }
            
            $start_date = Carbon::create(Carbon::parse($request->start_date)->format('m/d/Y H:i:s') );
            $end_date = Carbon::create(Carbon::parse($request->end_date)->format('m/d/Y H:i:s') );
            $end_date = $end_date->addDay();
            
            $product = Product::where('product_name',$request->product_name)->first();
            $contactData=  ContactLead::where('lead_sub_status_id',9)->where('product_id',$product->id)->whereBetween('actual_closing_date', [$start_date, $end_date])->get();
            
            


            if (!empty($contactData[0]->id)) {
                foreach ($contactData as $dep) {
                    $array_reponse[] = $this->castarrayLead($dep);
                }
                return ResponseApi::acceptedResponseApi($array_reponse, "success", 201);

            } else {
                return ResponseApi::notFoundResponse(['message' => "Empty Contact Lead"], "Empty", 200);

            }
        }catch(\Exception $e){
          return ResponseApi::badMethodErrorResponse(["message"=>"Server Error"],"server Error",500);
        }
    }
    
    public function GetrevenuePerSalesData(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token' => 'required|string',
                'start_date'=>'required|date',
                'end_date'=>'required|string',
                'sales_name'=>'required|string|exists:users,username'
            ]);
            if ($validator->fails()) {
                return ResponseApi::validatorErrorResponseApi($validator->errors()->toArray(),"Validator Errors",400);
            }
            
            $start_date = Carbon::create(Carbon::parse($request->start_date)->format('m/d/Y H:i:s') );
            $end_date = Carbon::create(Carbon::parse($request->end_date)->format('m/d/Y H:i:s') );
            $end_date = $end_date->addDay();
            
            $user = User::where('username',$request->sales_name)->first();
            // return $user;
            $contactData=  ContactLead::where('lead_sub_status_id',9)->where('sales_id',$user->id)->whereBetween('actual_closing_date', [$start_date, $end_date])->get();
            
            


            if (!empty($contactData[0]->id)) {
                foreach ($contactData as $dep) {
                    $array_reponse[] = $this->castarrayLead($dep);
                }
                return ResponseApi::acceptedResponseApi($array_reponse, "success", 201);

            } else {
                return ResponseApi::notFoundResponse(['message' => "Empty Contact Lead"], "Empty", 200);

            }
        }catch(\Exception $e){
          return ResponseApi::badMethodErrorResponse(["message"=>"Server Error"],"server Error",500);
        }
    }
    
    public function GetNumberOfLeadsForSalesData(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token' => 'required|string',
                'start_date'=>'required|date',
                'end_date'=>'required|string',
                'sales_name'=>'required|string|exists:users,username'
            ]);
            if ($validator->fails()) {
                return ResponseApi::validatorErrorResponseApi($validator->errors()->toArray(),"Validator Errors",400);
            }
            
            $start_date = Carbon::create(Carbon::parse($request->start_date)->format('m/d/Y H:i:s') );
            $end_date = Carbon::create(Carbon::parse($request->end_date)->format('m/d/Y H:i:s') );
            $end_date = $end_date->addDay();
            
            $user = User::where('username',$request->sales_name)->first();
            if($user->sub_departments_id == '5' || $user->sub_departments_id == '6' || $user->sub_departments_id == '8' || (($user->sub_departments_id == '1' ||$user->sub_departments_id == '2') && $user->work_degrees_id == '5')){
                $contactData=  ContactLead::where('user_creator_id',$user->id)->where('sales_id',null)->whereBetween('updated_at', [$start_date, $end_date])->get();
            }else{
                $contactData=  ContactLead::where('sales_id',$user->id)->whereBetween('updated_at', [$start_date, $end_date])->get();
            }
            
            


            if (!empty($contactData[0]->id)) {
                foreach ($contactData as $dep) {
                    $array_reponse[] = $this->castarrayLead($dep);
                }
                return ResponseApi::acceptedResponseApi($array_reponse, "success", 201);

            } else {
                return ResponseApi::notFoundResponse(['message' => "Empty Contact Lead"], "Empty", 200);

            }
        }catch(\Exception $e){
          return ResponseApi::badMethodErrorResponse(["message"=>"Server Error"],"server Error",500);
        }
    }
    
    
    
    public function GetDealProgressData(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token' => 'required|string',
                'label_date'=>'required|date',
                'label_name'=>'required|string|exists:contact_lead_sub_statuses,contact_sub_status_name'   
            ]);
            $givin_date =Carbon::create($request->label_date, 'UTC');
            if ($validator->fails()) {
                return ResponseApi::validatorErrorResponseApi($validator->errors()->toArray(),"Validator Errors",400);
            }
            $substatus = ContactLeadSubStatus::where('contact_sub_status_name',$request->label_name)->first();
            $contactData = ContactLead::whereMonth('updated_at',$givin_date->month)->whereYear('updated_at',$givin_date->year)->where('lead_sub_status_id',$substatus->id)->get();
            if (!empty($contactData[0]->id)) {
                foreach ($contactData as $dep) {
                    $array_reponse[] = $this->castarrayLead($dep);
                }
                return ResponseApi::acceptedResponseApi($array_reponse, "success", 201);

            } else {
                return ResponseApi::notFoundResponse(['message' => "Empty Contact Lead"], "Empty", 200);

            }
        }catch(\Exception $e){
          return ResponseApi::badMethodErrorResponse(["message"=>"Server Error"],"server Error",500);
        }
    }


    public function FilterContactLead(Request $request){
       try{
          $validator = Validator::make($request->all(), [

                    'lead_sub_status_id' => 'nullable|integer|exists:contact_leads,lead_sub_status_id',

                    'user_creator_id'    => 'nullable|integer|exists:users,id',

                    'product_id'         => 'nullable|integer|exists:products,id',

                    'country'            => 'nullable|string|max:255',

                ]);

                if ($validator->fails()) {
                    return ResponseApi::validatorErrorResponseApi(
                        $validator->errors()->toArray(),
                        "Validator Errors",
                        400
                    );
                }
$all_contactLead = ContactLead::query()

    // Filter by lead_sub_status_id if provided
    ->when($request->lead_sub_status_id, fn($q) =>
        $q->where('lead_sub_status_id', $request->lead_sub_status_id)
    )

    // Filter by user_creator_id if provided
    ->when($request->user_creator_id, fn($q) =>
        $q->where('user_creator_id', $request->user_creator_id)
    )

    // Only filter by date if start_date or end_date is provided
    ->when($request->start_date || $request->end_date, function ($q) use ($request) {
        $start_date = !empty($request->start_date)
            ? Carbon::parse($request->start_date)->startOfDay()
            : Carbon::now()->subYears(100)->startOfDay();

        $end_date = !empty($request->end_date)
            ? Carbon::parse($request->end_date)->endOfDay()
            : Carbon::now()->addYears(100)->endOfDay();

        $q->whereBetween('expected_close_date', [$start_date, $end_date]);
    })

    // Filter by product_id if provided
    ->when($request->product_id, fn($q) =>
        $q->where('product_id', $request->product_id)
    )

    // Filter by country if provided
    ->when($request->country, function ($q) use ($request) {
        $q->whereHas('contact_id_fun.partner_id_fun', function ($q2) use ($request) {
            $q2->where('country', $request->country);
        });
    })

    // Filter by partner_name if provided
    ->when($request->partner_name, function ($q) use ($request) {
        $q->whereHas('contact_id_fun.partner_id_fun', function ($q2) use ($request) {
            $q2->where('partner_name', $request->partner_name);
        });
    })

    ->get();
                $array_reponse=[];
                  foreach ($all_contactLead as $dep) {
                    $array_reponse[] = $this->castarrayLead($dep);
                }
                return ResponseApi::acceptedResponseApi($array_reponse, "success", 201);



                  }catch(\Exception $e){
          return ResponseApi::badMethodErrorResponse(["message"=>"Server Error"],"server Error",500);
        }


    }
}

