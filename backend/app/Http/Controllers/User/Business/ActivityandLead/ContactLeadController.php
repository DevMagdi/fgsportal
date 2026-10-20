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
use Carbon\Carbon;
use App\Models\Partner;

class ContactLeadController extends Controller
{
    public function castarrayLead(ContactLead $lead)
    {
        $activity = ContactLeadActivity::orderBy('from_date', 'asc')->where('activity_status_id', 2)->where('contact_lead_id', $lead->id)->first();
        $activity_prev = ContactLeadActivity::orderBy('created_at', 'desc')->where('contact_lead_id', $lead->id)->get();

        if(!empty($lead->contact_id_fun->partner_id)){

            $partner = Partner::where('id',$lead->contact_id_fun->partner_id)->withTrashed()->first();
            $partner_id = $partner->id;
            $partner_name = $partner->partner_name;
        }else{
            $partner_id = null;
            $partner_name=null;
        }



        $array_reponse = [
            'id' => $lead->id . '',
            'campagin_id' => $lead->campagin_id,
            'campagin_name' => !empty($lead->campagin_id) ? optional($lead->campagin_id_fun)->campagin_name : null,

            'sales_id' => $lead->sales_id,
            'sales_name' => !empty($lead->sales_id) ? $lead->sales_id_fun->username : null,

            'user_creator_id' => $lead->user_creator_id,
            'user_creator_name' => optional($lead->user_creator_id_fun)->username,

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

            'partner_id' => $partner_id,
            'partner_name' => $partner_name,

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

            // 'cost_details' =>!empty( $lead->cost_details)?$lead->cost_details:null,

            'cost' => $lead->cost,
            'seen' => (boolean) $lead->seen,
            'isLead' => (boolean) $lead->isLead,
            'transfer' => (boolean) $lead->transfer,
            'created_at' => $lead->created_at,
            'next_action' => !empty($activity->comment) ? $activity->comment : null,
            'next_action_date' => !empty($activity->from_date) ? $activity->from_date : null,
            'next_action_type_id' => !empty($activity->activity_type_id) ? $activity->activity_type_id : null,
            'next_action_id' => !empty($activity->id) ? $activity->id . '' : null,

        ];
        return $array_reponse;
    }
    public function DeleteContactLead(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'token' => 'required|string',
                'contact_lead_id' => 'required|numeric|exists:contact_leads,id',
            ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(), "Validator Errors", 400);
            }

            $phoneType = ContactLead::where('id', $request->contact_lead_id)->first();
            if (!empty($phoneType->id)) {
                $activity = ContactLeadActivity::where('contact_lead_id', $phoneType->id)->get();
                foreach ($activity as $value) {
                    $value->delete();
                }
                $phoneType->delete();

                return ResponseApi::acceptedResponseApi(["message" => "Deleted Success"], "success", 201);

            } else {
                return ResponseApi::badMethodErrorResponse(['message' => "Contact Lead not found"], "Validator Errors", 400);

            }
        } catch (\Exception $e) {
            return ResponseApi::badMethodErrorResponse(['message' => "Server Error"], "server Error", 500);

        }

    }


    public function GetContactLeadByPartnerID(Request $request)
    {
        try {
            
            $validator = Validator::make($request->all(), [
            'token' => 'required|string',
            'partner_id' => 'required|string|exists:partners,id',
            ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(), "Validator Errors", 400);
            }
            
            
            $partnerId = $request->partner_id;
            
            if(Auth::guard('user_api')->user()->sub_departments_id==6 ||Auth::guard('user_api')->user()->sub_departments_id==5
            ||Auth::guard('user_api')->user()->sub_departments_id==8 || ((Auth::guard('user_api')->user()->sub_departments_id==2 || Auth::guard('user_api')->user()->sub_departments_id==1) && Auth::guard('user_api')->user()->work_degrees_id ==5)){
                $phones = ContactLead::whereHas('contact_id_fun', function ($query) use ($partnerId) {
                    $query->where('partner_id', $partnerId);
                })->get();
            }else{
                $phones = ContactLead::whereHas('contact_id_fun', function ($query) use ($partnerId) {
                    $query->where('partner_id', $partnerId);
                })->where('sales_id',Auth::guard('user_api')->user()->id)->get();
            }
            
            

            if (!empty($phones[0]->id)) {
                foreach ($phones as $dep) {
                    $array_reponse[] = $this->castarrayLead($dep);
                }
                return ResponseApi::acceptedResponseApi($array_reponse, "success", 201);

            } else {
                return ResponseApi::notFoundResponse(['message' => "Empty Contact Lead"], "Empty", 200);

            }
        } catch (\Exception $e) {
            return $e;
            return ResponseApi::badMethodErrorResponse(['message' => "Server Error"], "server Error", 500);

        }
    }

    public function UpdateContactLead(Request $request)
    {
        //  try{
        $validator = Validator::make($request->all(), [
            'token' => 'required|string',
            'contact_lead_id' => 'required|numeric|exists:contact_leads,id',
        ]);
        if ($validator->fails()) {

            return ResponseApi::badMethodErrorResponse($validator->errors()->all(), "Validator Errors", 400);
        } 


            $phoneType = ContactLead::orderBy('created_at','desc')->where('id', $request->contact_lead_id)->first();
                if (!empty($phoneType->id)) {
                    if (!empty($request->lead_sub_status_id) && $request->lead_sub_status_id != $phoneType->lead_sub_status_id) {
                     //   return "gg";
                     $subStatus = ContactLeadSubStatus::where('id',$request->lead_sub_status_id)->first();
                     $prev = ContactLeadActivity::where('contact_lead_id',$request->contact_lead_id)->get()->count();
                     
                        ContactLeadActivity::create([
                            'sales_id' => Auth::guard('user_api')->user()->id,
                            'contact_lead_id' => $phoneType->id,
                            'lead_sub_status_id' => $request->lead_sub_status_id,
                            'activity_type_id' => 7,
                            'activity_status_id' => 1,
                            'comment' => "Converted From " . $phoneType->lead_sub_status_id_fun->contact_sub_status_name . " To " . $subStatus->contact_sub_status_name,
                            'from_date' => Carbon::now(),
                            'to_date' => Carbon::now(),
                            
                        ]);
                        if($prev == 0){
                            ContactLeadActivity::create([
                                'sales_id' => Auth::guard('user_api')->user()->id,
                                'contact_lead_id' => $phoneType->id,
                                'lead_sub_status_id' => 4,
                                'activity_type_id' => 7,
                                'activity_status_id' => 1,
                                'comment' => "Start Engagement",
                                'from_date' => Carbon::now(),
                                'to_date' => Carbon::now(),
                            ]);
                            
                         }
                    }
                    
                    
                    $phoneType->update(
                        $request->except(['expected_close_date','actual_closing_date'])
                      );

                    $phoneType = ContactLead::where('id', $request->contact_lead_id)->first();

                        if(!empty($request->actual_closing_date)){
                                    $validator = Validator::make($request->all(), [
                                    'actual_closing_date' => 'required|date',
                                    ]);
                                    if ($validator->fails()) {
                                
                                        return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                                    }
                                    $phoneType = ContactLead::where('id', $request->contact_lead_id)->first();
                                    $phoneType->update([
                                        'actual_closing_date'=>Carbon::create( $request->actual_closing_date),
                                    ]);
                        }else{
                              if($request->lead_sub_status_id>=9 && $request->lead_sub_status_id<=12 ){
                   
                         $phoneType->update([
                                        'actual_closing_date'=>Carbon::now()
                                    ]);
                        }
                    }
                      if(!empty($request->expected_close_date)){
                        $validator = Validator::make($request->all(), [
                          'expected_close_date' => 'required|date',
                      ]);
                      if ($validator->fails()) {
                
                          return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                      }
                      $phoneType = ContactLead::where('id', $request->contact_lead_id)->first();
                      $phoneType->update([
                        'expected_close_date'=>Carbon::create( $request->expected_close_date),
                      ]);
                      
                    }


                     return ResponseApi::acceptedResponseApi(['Success'], "success", 201);
                } else {
                    return ResponseApi::badMethodErrorResponse(["Contact Lead not found"], "Validator Errors", 400);
                }
           

        

        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(["Server Error"],"server Error",500);

        // }

    }


    public function CreateContactLead(Request $request)
    {
        try{
        $validator = Validator::make($request->all(), [
            'token' => 'required|string',
            'sales_id' => 'numeric|exists:users,id',
            'lead_sub_status_id' => 'required|numeric|exists:contact_lead_sub_statuses,id',
            'lead_type_id' => 'required|numeric|exists:contact_lead_types,id',
            'product_id' => 'exists:products,id',
            'contact_id' => 'required|numeric|exists:contacts,id',
            'cost' => 'numeric',
            
        ]);
        if ($validator->fails()) {
            return ResponseApi::badMethodErrorResponse($validator->errors()->all(), "Validator Errors", 400);
        }
            $lead = ContactLead::create([
                'campagin_id' => !empty($request->campagin_id)?$request->campagin_id:1,
                'sales_id' => !empty($request->sales_id)?$request->sales_id:null,
                'user_creator_id' => Auth::guard('user_api')->user()->id,
                'lead_sub_status_id' => !empty($request->lead_sub_status_id) ? $request->lead_sub_status_id : null,
                'lead_type_id' => $request->lead_type_id,
                'label' => !empty($request->label) ? $request->label : null,
                'product_id' => !empty($request->product_id) ? $request->product_id : null,
                'title' => $request->title,
                'contact_id'=>$request->contact_id,
                'cost' => $request->cost,
             //   'cost_details' =>!empty( $request->cost_details)?$request->cost_details:null,
                'currency' =>!empty( $request->currency)?$request->currency:null,
                'notes'=>$request->notes,
                'isLead' => !empty($request->isLead) ? 1 : 0,
                'expected_close_date'=>!empty($request->expected_close_date)?Carbon::create( $request->expected_close_date):null,
            ]);
        
        if (!empty($lead->id)) {
            return ResponseApi::acceptedResponseApi($this->castarrayLead($lead), "success", 201);
        } else {
            return ResponseApi::badMethodErrorResponse(['message' => "Server Error"], "server Error", 500);
        }

        }catch(\Exception $e){
           // return $e;
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }

    }

    public function GetSpecificLead(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'token' => 'required|string',
                'contact_lead_id' => 'required|numeric|exists:contact_leads,id',
            ]);
            if ($validator->fails()) {

                return ResponseApi::badMethodErrorResponse($validator->errors()->all(), "Validator Errors", 400);
            }
            $phones = ContactLead::where('id', $request->contact_lead_id)->first();
            if (!empty($phones->id)) {
                $array_reponse = $this->castarrayLead($phones);

                return ResponseApi::acceptedResponseApi($array_reponse, "success", 201);

            } else {
                return ResponseApi::notFoundResponse(['message' => "Empty Contact Lead"], "Empty", 200);

            }
        } catch (\Exception $e) {
            return ResponseApi::badMethodErrorResponse(['message' => "Server Error"], "server Error", 500);

        }

    }
    public function GetMyClosedContactLead()
    {
        try {
            if(Auth::guard('user_api')->user()->sub_departments_id==6 ||Auth::guard('user_api')->user()->sub_departments_id==5
            ||Auth::guard('user_api')->user()->sub_departments_id==8 ||
            ((Auth::guard('user_api')->user()->sub_departments_id==2 || Auth::guard('user_api')->user()->sub_departments_id==1) && Auth::guard('user_api')->user()->work_degrees_id ==5)){
               $phones = ContactLead::whereIn('lead_sub_status_id',[9,10,11,12])->get();
            }else{
                $phones = ContactLead::where('sales_id', Auth::guard('user_api')->user()->id)->whereIn('lead_sub_status_id',[9,10,11,12])->get();
            }
            
            if (!empty($phones[0]->id)) {
                foreach ($phones as $dep) {
                    $array_reponse[] = $this->castarrayLead($dep);
                }
                return ResponseApi::acceptedResponseApi($array_reponse, "success", 201);

            } else {
                return ResponseApi::notFoundResponse(['message' => "Empty Contact Lead"], "Empty", 200);

            }
        } catch (\Exception $e) {
            return ResponseApi::badMethodErrorResponse(['message' => "Server Error"], "server Error", 500);

        }

    }
    public function GetMyContactLead()
    {
        try {
            $phones = ContactLead::where('sales_id', Auth::guard('user_api')->user()->id)
            ->whereNotIn('lead_sub_status_id',[9,11])->where('isLead', false)->get();
            if (!empty($phones[0]->id)) {
                foreach ($phones as $dep) {
                    $array_reponse[] = $this->castarrayLead($dep);
                }
                return ResponseApi::acceptedResponseApi($array_reponse, "success", 201);

            } else {
                return ResponseApi::notFoundResponse(['message' => "Empty Contact Lead"], "Empty", 200);

            }
        } catch (\Exception $e) {
            return ResponseApi::badMethodErrorResponse(['message' => "Server Error"], "server Error", 500);

        }

    }

    public function GetAllContactLead()
    {
        try {
            $phones = ContactLead::where('isLead', false)->whereNotIn('lead_sub_status_id',[9,11])->get();
            if (!empty($phones[0]->id)) {
                foreach ($phones as $dep) {
                    $array_reponse[] = $this->castarrayLead($dep);
                }
                return ResponseApi::acceptedResponseApi($array_reponse, "success", 201);

            } else {
                return ResponseApi::notFoundResponse(['message' => "Empty Contact Lead"], "Empty", 200);

            }
        } catch (\Exception $e) {
            return ResponseApi::badMethodErrorResponse(['message' => "Server Error"], "server Error", 500);

        }

    }

    public function GetMyLead()
    {
        try {
            $phones = ContactLead::where('sales_id', Auth::guard('user_api')->user()->id)
            ->whereNotIn('lead_sub_status_id',[9,11])->where('isLead', true)->get();
            if (!empty($phones[0]->id)) {
                foreach ($phones as $dep) {
                    $array_reponse[] = $this->castarrayLead($dep);
                }
                return ResponseApi::acceptedResponseApi($array_reponse, "success", 201);

            } else {
                return ResponseApi::notFoundResponse(['message' => "Empty  Lead"], "Empty", 200);

            }
        } catch (\Exception $e) {
            return ResponseApi::badMethodErrorResponse(['message' => "Server Error"], "server Error", 500);

        }

    }

    public function GetAllLead()
    {
        //  try{
        $phones = ContactLead::where('isLead', true)->whereNotIn('lead_sub_status_id',[9,11])->get();
        if (!empty($phones[0]->id)) {
            foreach ($phones as $dep) {
                $array_reponse[] = $this->castarrayLead($dep);
            }
            return ResponseApi::acceptedResponseApi($array_reponse, "success", 201);

        } else {
            return ResponseApi::notFoundResponse(['message' => "Empty  Lead"], "Empty", 200);

        }
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }

    }
    public function GetSpecificLeadByStatus(Request $request){
        //  try{
        $validator = Validator::make($request->all(), [
            'token' => 'required|string',
            'lead_sub_status_id' => 'required|numeric|exists:contact_lead_sub_statuses,id',
            'isLead'=>'required'
        ]);
        if ($validator->fails()) {
            return ResponseApi::badMethodErrorResponse($validator->errors()->all(), "Validator Errors", 400);
        }
        
        
        if(Auth::guard('user_api')->user()->sub_departments_id==6 ||Auth::guard('user_api')->user()->sub_departments_id==5
        ||Auth::guard('user_api')->user()->sub_departments_id==8 || (Auth::guard('user_api')->user()->sub_departments_id==2 && Auth::guard('user_api')->user()->work_degrees_id ==5)){
         $phones = ContactLead::where('lead_sub_status_id',$request->lead_sub_status_id)->where('isLead',$request->isLead)->get();

        }else{
            $phones = ContactLead::where('lead_sub_status_id',$request->lead_sub_status_id)->where('isLead',$request->isLead)
            ->where('sales_id',Auth::guard('user_api')->user()->id)->get();

         
        }
        if (!empty($phones[0]->id)) {
            foreach ($phones as $dep) {
                $array_reponse[] = $this->castarrayLead($dep);
            }
            return ResponseApi::acceptedResponseApi($array_reponse, "success", 201);

        } else {
            return ResponseApi::notFoundResponse(['message' => "Empty  Lead"], "Empty", 200);

        }
         // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
    }

    // public function GetTimeSpendLeadStatus(Request $request)
    // {
    //     try {
    //         $validator = Validator::make($request->all(), [
    //             'token' => 'required|string',
    //             'contact_lead_id' => 'required|numeric|exists:contact_leads,id',
    //         ]);
    //         if ($validator->fails()) {
    //             return ResponseApi::badMethodErrorResponse($validator->errors()->all(), "Validator Errors", 400);
    //         }
    //         $activity = ContactLeadActivity::where('contact_lead_id', $request->contact_lead_id)->get();
    //         $activity2 = ContactLeadActivity::where('contact_lead_id', $request->contact_lead_id)->get();
    //         $array_reponse = [];
    //         $array_status = [];
    //         $previous = null;
    //         $subStatus = ContactLeadSubStatus::where('contact_lead_status_id', 3)->get();
    //         $array_status = [];
    //         $counter = 0;

    //         foreach ($subStatus as $key) {
    //             $array_status[] = [
    //                 $key->id
    //             ];
    //             $counter++;
    //         }

    //         if (!empty($activity[0]->id)) {
    //             foreach ($activity as $key) {
    //                 for ($i = 0; $i < $counter; $i++) {
    //                     if ($array_status[$counter] == $activity->contact_lead_sub_status_id) {

    //                     } else {

    //                     }
    //                 }
    //                 $prev = $key;
    //             }
    //         }
    //     } catch (\Exception $e) {
    //         return ResponseApi::badMethodErrorResponse(['message' => "Server Error"], "server Error", 500);

    //     }
    // }

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
     * @param  \App\Models\ContactLead  $contactLead
     * @return \Illuminate\Http\Response
     */
    public function show(ContactLead $contactLead)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ContactLead  $contactLead
     * @return \Illuminate\Http\Response
     */
    public function edit(ContactLead $contactLead)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ContactLead  $contactLead
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ContactLead $contactLead)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ContactLead  $contactLead
     * @return \Illuminate\Http\Response
     */
    public function destroy(ContactLead $contactLead)
    {
        //
    }
}