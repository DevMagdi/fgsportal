<?php

namespace App\Http\Controllers\User\Business\ActivityandLead;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\UserDetail;
use App\Models\ContactLead;
use App\Models\ContactLeadActivity;
use App\Models\ContactLeadDublicate;
use Illuminate\Http\Request;
use App\Models\ContactLeadStatus;
use App\Models\ContactLeadSubStatus;
use App\Models\ContactLeadType;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
 use App\Models\ActivityStatus;
use App\Models\ActivityType;
use App\Models\Partner;

 use Carbon\Carbon;
use App\Models\Log;
 use App\Mail\ActivityPending;
use Illuminate\Support\Facades\Mail;
use App\Http\Controllers\ApiMessage\MessageController;
use Illuminate\Support\Facades\DB;
class ContactLeadActivityController extends Controller
{
  
public function PendingActivitySendNotification(User $user2, ContactLeadActivity $dep, $comment)
{
    $msg = [
        "body" => 'Kindly take action on this pending activity as it is pending on ' . $comment,
        "createdAt" => $dep->created_at,
        "receverKey" =>  $user2->id.'',
        "receverName" => $user2->username,
        "redirection" => "/manager/approval",
        "senderKey" => '1',
        "senderName" => 'superadmin',
        "status" => 0,
        "updatedAt" => $dep->updated_at,
        "title" => 'Activity for ' . $dep->contact_lead_id_fun->title . ' is ' . $dep->activity_status_id_fun->activity_status_name,
        "senderImg" => $user2->photoURL 
            ? '/Attachments/User/' . $user2->id . '/profile/' . $user2->photoURL 
            : null,
    ];

    
    MessageController::notificationSend($msg);
}

   
    public function CastArrayActivity(ContactLeadActivity $dep){
       if(!empty($dep->contact_lead_id_fun->contact_id_fun->partner_id)){

            $partner = Partner::where('id',$dep->contact_lead_id_fun->contact_id_fun->partner_id)->withTrashed()->first();
            $partner_id = $partner->id;
            $partner_name = $partner->partner_name;
        }else{
            $partner_id = null;
            $partner_name=null;
        }

        $response = [
            'id'=>$dep->id.'',
            'createdBy_id'=>$dep->sales_id,
            'createdBy_name'=>$dep->sales_id_fun->username,
            'contact_lead_id'=>$dep->contact_lead_id,
            'contact_lead_name'=>$dep->contact_lead_id_fun->title,
            'lead_sub_status_id'=>$dep->lead_sub_status_id,
            'lead_sub_status_name'=>!empty($dep->lead_sub_status_id)?$dep->lead_sub_status_id_fun->lead_sub_status_name:null,
            'activity_type_id'=>$dep->activity_type_id,
            'activity_type_name'=>!empty($dep->activity_type_id)?$dep->activity_type_id_fun->activity_type_name:null,
            'activity_status_name'=>!empty($dep->activity_status_id)?$dep->activity_status_id_fun->activity_status_name:null,
            'activity_status_id'=>$dep->activity_status_id,
            'comment'=>$dep->comment,
            'person_contact_id'=>$dep->contact_lead_id_fun->contact_id,
            'person_contact_name'=>!empty($dep->contact_lead_id_fun->contact_id)?$dep->contact_lead_id_fun->contact_id_fun->name:null,



            'partner_id'=>$partner_id,
            'partner_name'=>$partner_name,
            


            'phone'=>!empty($dep->contact_lead_id->contact_id)?$dep->contact_lead_id_fun->contact_id_fun->phone:null,
            'email'=>!empty($dep->contact_lead_id->contact_id)?$dep->contact_lead_id_fun->contact_id_fun->email:null,
            'product_id'=>!empty($dep->contact_lead_id_fun->product_id)?$dep->contact_lead_id_fun->partner_id:null,
            'product_name'=>!empty($dep->contact_lead_id_fun->product_id)?$dep->contact_lead_id_fun->product_id_fun->product_name:null,


            'from_date'=>$dep->from_date,
            'to_date'=>$dep->to_date,

            'activity_start_date'=>$dep->activity_start_date,
            'activity_end_date'=>$dep->activity_end_date,
            'duration'=>$dep->duration,
            'description'=>$dep->description,

            'created_at'=>$dep->created_at
        ];
        return $response;

    }
    public function DeleteActivity(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'activity_id'=>'required|numeric|exists:contact_lead_activities,id',
                ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }

          $phoneType=  ContactLeadActivity::where('id',$request->activity_id)->first();
          if(!empty($phoneType->id)){
            $phoneType->delete();
            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Activity not found"],"Validator Errors",400);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateActivity(Request $request){
      //  try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'activity_id'=>'required|numeric|exists:contact_lead_activities,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }
          $phoneType=  ContactLeadActivity::where('id',$request->activity_id)->first();
        
          if(!empty($phoneType->id)){
              if(!empty($request->lead_sub_status_id)){
                  $a =ContactLead::where('id',$phoneType->contact_lead_id)->first();
                 
                   
                    $a->update([
                        'lead_sub_status_id'=>$request->lead_sub_status_id,
                    ]);
              }
            $phoneType->update($request->except(['from_date','to_date','activity_start_date','activity_end_date']));
            $phoneType=  ContactLeadActivity::where('id',$request->activity_id)->first();

            if(!empty($request->from_date)){
                $phoneType=  ContactLeadActivity::where('id',$request->activity_id)->first();
        $phoneType->update([
              'from_date'=>Carbon::create($request-> from_date)
                        ]);

            }
            if(!empty($request->to_date)){
                $phoneType=  ContactLeadActivity::where('id',$request->activity_id)->first();
                $phoneType->update([
              'to_date'=>Carbon::create( $request-> to_date)
            ]);

            }
            if(!empty($request->activity_start_date)){
                $phoneType=  ContactLeadActivity::where('id',$request->activity_id)->first();
                $phoneType->update([
              'activity_start_date'=>Carbon::create(Carbon::parse($request->activity_start_date)->format('m/d/Y H:i:s') )
            ]);

            }
            if(!empty($request->activity_end_date)){
                $phoneType=  ContactLeadActivity::where('id',$request->activity_id)->first();
                $phoneType->update([
              'activity_end_date'=>Carbon::create(Carbon::parse($request->activity_end_date)->format('m/d/Y H:i:s') )
            ]);

            }
          
            return ResponseApi::acceptedResponseApi($phoneType,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Activity  not found"],"Validator Errors",400);

          }
              
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
        
    }
    public function CreateActivity(Request $request){
      //  try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'contact_lead_id'=>'required|numeric|exists:contact_leads,id',
                'lead_sub_status_id'=>'required|numeric|exists:contact_lead_sub_statuses,id',
                'activity_type_id'=>'required|numeric|exists:activity_types,id',
                'activity_status_id'=>'required|numeric|exists:activity_statuses,id',
                'comment'=>'required|string',
                'from_date'=>'required|date',
                'to_date'=>'required|date|after_or_equal:from_date',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
            }

          $phoneType=  ContactLeadActivity::create([
            'sales_id'=>Auth::guard('user_api')->user()->id,
            'contact_lead_id'=>$request->contact_lead_id,
            'lead_sub_status_id'=>$request->lead_sub_status_id,
            'activity_type_id'=>$request->activity_type_id,
            'activity_status_id'=>$request->activity_status_id,
            'comment'=>$request->comment,
            'from_date'=>Carbon::create($request-> from_date),
            'to_date'=>Carbon::create( $request-> to_date),
            'activity_start_date'=>!empty($request->activity_start_date)?Carbon::create(Carbon::parse($request->activity_start_date)->format('m/d/Y H:i:s') ):null,
            'activity_end_date'=>!empty($request->activity_end_date)?Carbon::create(Carbon::parse($request->activity_end_date)->format('m/d/Y H:i:s') ):null,
            'duration'=>!empty($request->duration)?$request->duration:null,
            'description'=>!empty($request->description)?$request->description:null,
           ]);
           if(!empty($phoneType->id)){
            $a =ContactLead::where('id',$request->contact_lead_id)->first();
            $a->update([
                'lead_sub_status_id'=>$request->lead_sub_status_id,
 
            ]);
           }
        
          return ResponseApi::acceptedResponseApi(["message"=>"Success"],"success",201);

             
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
        // }
    }
    public function getActivityforLead(Request $request){
      //  try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'contact_lead_id'=>'required|numeric|exists:contact_leads,id',
               ]);
           if ($validator->fails()) {
               return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
           }
          $phones = ContactLeadActivity::where('contact_lead_id',$request->contact_lead_id)->orderBy('from_date','desc')->get();
          if(!empty($phones[0]->id)){
            foreach($phones as $dep){
            $array_reponse[] = $this->CastArrayActivity($dep);
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Activity "],"Empty",200);

          }
             
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
        
    }
    public function GetAllPendingActivity(Request $request){
           try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
               ]);
           if ($validator->fails()) {
               return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
           }
           $users = User::where('sub_departments_id',6)->get();
           if(Auth::guard('user_api')->user()->sub_departments_id==6 ||Auth::guard('user_api')->user()->sub_departments_id==5
           ||Auth::guard('user_api')->user()->sub_departments_id==8 || (Auth::guard('user_api')->user()->sub_departments_id==2 && Auth::guard('user_api')->user()->work_degrees_id ==5) ){
            $phones = ContactLeadActivity::where('activity_status_id',2)->orderBy('from_date','desc')->get();

           }else{
            $phones = ContactLeadActivity::where('sales_id',Auth::guard('user_api')->user()->id)->where('activity_status_id',2)->orderBy('from_date','desc')->get();
            
           }
          // $phones = ContactLeadActivity::where('contact_lead_id',$request->contact_lead_id)->orderBy('from_date','desc')->get();
          if(!empty($phones[0]->id)){
            foreach($phones as $dep){
            $array_reponse[] = $this->CastArrayActivity($dep);
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Activity "],"Empty",200);

          }
             
       
          }catch(\Exception $e){
       return $e;
          return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }


    public function ActivityNotification(){
      try{

            $activities = ContactLeadActivity::where('activity_status_id',2)->orderBy('from_date','desc')->get();
            foreach ($activities as  $value) {
                $now_date =null;
                $date = Carbon::parse($value->from_date)->toDateString(); // 'YYYY-MM-DD'
                $now_date = Carbon::today()->toDateString();

                if ($date <= $now_date) {
                  $mailto = [];
                    // do something
                    $user = User::where('id',$value->sales_id)->first();
                    $mailto[]=$user->email;

                 



                    if(!empty($mailto)){
                      $message  =  Carbon::parse( $value->endDate)->format('m/d/Y');
                      // $mailto = "ataha@firstgulfsolutions.com";
                     
                      try{
                      

                        $log=  Log::create([
                            'action' => "Send Email activity ".$value->activity_type_id_fun->activity_type_name .'-' . $value->activity_status_id_fun->activity_status_name. '-'.$value->comment,
                      'actionKeys' =>"Send Email To ".implode(",",$mailto) ,
                            'empKey' =>1,
                            'empName' =>"Cron Job",
                            'createdAt' =>Carbon::now(),
                            'actionStatus' =>'Try',
                        ]);

                      
                       Mail::to($mailto)->send(new ActivityPending($value->contact_lead_id_fun->title,$value->activity_type_id_fun->activity_type_name,$message));  

                        try{
                        //  return $user;
                       $this->PendingActivitySendNotification($user,$value,$message);
                         }catch(\Exception $e){
                         }


                       $log=  Log::create([
                            'action' => "Send Email activity ".$value->activity_type_id_fun->activity_type_name .'-' . $value->activity_status_id_fun->activity_status_name. '-'.$value->comment,
                      'actionKeys' =>"Send Email To ".implode(",",$mailto) ,
                            'empKey' =>1,
                            'empName' =>"Cron Job",
                            'createdAt' =>Carbon::now(),
                            'actionStatus' =>'Success',
                        ]);  
                      }catch(\Exception $e){

                        $log=  Log::create([
                            'action' => "Send Email activity ".$value->activity_type_id_fun->activity_type_name .'-' . $value->activity_status_id_fun->activity_status_name. '-'.$value->comment,
                      'actionKeys' =>"Send Email To ".implode(",",$mailto) ,
                            'empKey' =>1,
                            'empName' =>"Cron Job",
                            'createdAt' =>Carbon::now(),
                            'actionStatus' =>'Failed',
                        ]);
                      }
                    }
                  }
               
              
                
            }
        }catch(\Exception $e){
          return $e;
        return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

       }
    }

    public function GetLeadActivities(Request $request){
         //  try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'partner_id'=>'required|numeric|exists:partners,id'
               ]);
           if ($validator->fails()) {
               return ResponseApi::badMethodErrorResponse($validator->errors()->all(),"Validator Errors",400);
           }
          $phones = ContactLeadActivity::join('contact_leads', 'contact_lead_activities.contact_lead_id', '=', 'contact_leads.id')
                    ->join('contacts', 'contact_leads.contact_id', '=', 'contacts.id')
                    ->where('contacts.partner_id', $request->partner_id)
                    ->where('contact_lead_activities.activity_status_id',2)
                    ->select('contact_lead_activities.*')
                    ->get();

                   // return $phones;
          if(!empty($phones[0]->id)){
            foreach($phones as $dep){
            $array_reponse[] = $this->CastArrayActivity($dep);
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Activity "],"Empty",200);

          }
             
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
        
    }

    public function FilterActivity(Request $request) {
    try {
        $validator = Validator::make($request->all(), [
            'sales_id'            => 'nullable|integer|exists:users,id',
            'contact_lead_id'     => 'nullable|integer|exists:contact_leads,id',
            'lead_sub_status_id'  => 'nullable|integer|exists:contact_leads,lead_sub_status_id',
            'activity_type_id'    => 'nullable|integer|exists:activity_types,id',
            'activity_status_id'  => 'nullable|integer|exists:activity_statuses,id',
            'from_date'           => 'nullable|date',
            'to_date'             => 'nullable|date',
            'activity_start_date' => 'nullable|date',
            'activity_end_date'   => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return ResponseApi::validatorErrorResponseApi(
                $validator->errors()->toArray(),
                "Validator Errors",
                400
            );
        }

        $all_activities = ContactLeadActivity::query()

            // Filter by sales_id
            ->when($request->sales_id, fn($q) =>
                $q->where('sales_id', $request->sales_id)
            )

            // Filter by contact_lead_id
            ->when($request->contact_lead_id, fn($q) =>
                $q->where('contact_lead_id', $request->contact_lead_id)
            )

            // Filter by lead_sub_status_id
            ->when($request->lead_sub_status_id, fn($q) =>
                $q->where('lead_sub_status_id', $request->lead_sub_status_id)
            )

            // Filter by activity_type_id
            ->when($request->activity_type_id, fn($q) =>
                $q->where('activity_type_id', $request->activity_type_id)
            )

            // Filter by activity_status_id
            ->when($request->activity_status_id, fn($q) =>
                $q->where('activity_status_id', $request->activity_status_id)
            )

            // Filter by from_date / to_date (on created_at)
            ->when($request->from_date || $request->to_date, function ($q) use ($request) {
                $from_date = !empty($request->from_date)
                    ? Carbon::parse($request->from_date)->startOfDay()
                    : Carbon::now()->subYears(100)->startOfDay();

                $to_date = !empty($request->to_date)
                    ? Carbon::parse($request->to_date)->endOfDay()
                    : Carbon::now()->addYears(100)->endOfDay();

                $q->whereBetween('created_at', [$from_date, $to_date]);
            })

            // Filter by activity_start_date / activity_end_date
          ->when($request->activity_start_date || $request->activity_end_date, function ($q) use ($request) {
    $activity_start = !empty($request->activity_start_date)
        ? Carbon::parse($request->activity_start_date)->startOfDay()
        : Carbon::now()->subYears(100)->startOfDay();

    $activity_end = !empty($request->activity_end_date)
        ? Carbon::parse($request->activity_end_date)->endOfDay()
        : Carbon::now()->addYears(100)->endOfDay();

    // Filter activities that **overlap** with the requested range
    $q->where(function ($query) use ($activity_start, $activity_end) {
        $query->whereBetween('activity_start_date', [$activity_start, $activity_end])
              ->orWhereBetween('activity_end_date', [$activity_start, $activity_end])
              ->orWhere(function ($q2) use ($activity_start, $activity_end) {
                  // Covers activities that fully enclose the range
                  $q2->where('activity_start_date', '<=', $activity_start)
                     ->where('activity_end_date', '>=', $activity_end);
              });
    });
})

            ->get();

        $array_response = [];
        foreach ($all_activities as $activity) {
            $array_response[] = $this->castArrayActivity($activity);
        }

        return ResponseApi::acceptedResponseApi($array_response, "success", 201);

    } catch (\Exception $e) {
      return $e;
        return ResponseApi::badMethodErrorResponse(["message" => "Server Error"], "Server Error", 500);
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
     * @param  \App\Models\ContactLeadActivity  $contactLeadActivity
     * @return \Illuminate\Http\Response
     */
    public function show(ContactLeadActivity $contactLeadActivity)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ContactLeadActivity  $contactLeadActivity
     * @return \Illuminate\Http\Response
     */
    public function edit(ContactLeadActivity $contactLeadActivity)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ContactLeadActivity  $contactLeadActivity
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ContactLeadActivity $contactLeadActivity)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ContactLeadActivity  $contactLeadActivity
     * @return \Illuminate\Http\Response
     */
    public function destroy(ContactLeadActivity $contactLeadActivity)
    {
        //
    }
}
