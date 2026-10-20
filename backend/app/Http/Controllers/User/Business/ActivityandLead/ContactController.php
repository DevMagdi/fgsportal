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
use App\Models\Contact;
use App\Models\Partner;
class ContactController extends Controller
{
   


    public function castArrayContact(Contact $dep){
        $partner = Partner::where('id',$dep->partner_id)->withTrashed()->first();
        $array_response =[
            'user_creator_id'=>$dep->user_creator_id,
            'user_creator_name'=>!empty($dep->user_creator_id_fun)?$dep->user_creator_id_fun->username:null,
            'partner_id'=>$partner->id.'',
            'partner_name'=>$partner->partner_name,
            'name'=>$dep->name,
            'notes'=>$dep->notes,
            'email'=>$dep->email,
            'phone'=>$dep->phone,
            'address'=>$dep->address,
            'title'=>$dep->title,
            'id'=>$dep->id.''
        ];

        return $array_response;
    }
    public function CreateContact(Request $request)
    {
       try{
        $validator = Validator::make($request->all(), [
            'token' => 'required|string',
            'partner_id' => 'exists:partners,id',
            'name' => 'required|string',
            'notes' => 'string',
            'email' => 'email|unique:contacts',
            'address' => 'string',
        ]);
        if ($validator->fails()) {
            return ResponseApi::badMethodErrorResponse($validator->errors()->all(), "Validator Errors", 400);
        }
        if (empty($request->phone) && empty($request->email)) {
            return ResponseApi::badMethodErrorResponse(['You Can not Create Lead Without Phone or Email'], "Validator Errors", 400);
        }
        if (!empty($request->email)) {
            if (!empty($request->email)) {
                $leads_email = Contact::where('email', $request->email)->get()->count();
                if ($leads_email > 0) {
                    $leads_found = Contact::where('email', $request->email)->first();
                }
            }
        }
        if (!empty($request->phone)) {
            $array_phone = [];
            $counter = 0;
            $counter2 = 0;
            $leads_found = null;
            foreach ($request->phone as $phone) {
                $array_phone[] = [
                    'phone' => $phone['phone'],
                    'type' => $phone['phone_type']
                ];
                $phone = substr($phone['phone'], 3);
                $leads = Contact::where('phone', 'LIKE', '%' . $phone . '%')->get()->count();
                if ($leads > 0) {
                    $leads_found = Contact::where('phone', 'LIKE', '%' . $phone . '%')->first();
                }
            }
        }

        if (!empty($leads_found)) {
            $lead_dublicate = ContactLeadDublicate::create([
                'campagin_id' => !empty($leads_found->campagin_id)?$leads_found->campagin_id:1,
                'contact_id' => $leads_found->id,
                'branches_id' => $request->branches_id ? $request->branches_id : 1,
                'user_creator_id' => Auth::guard('user_api')->user()->id,
                'notes' => $request->notes,
                'partner_id' => $request->partner_id ? $request->partner_id : null,
            ]);

            if (!empty($lead_dublicate->id)) {
                return ResponseApi::acceptedResponseApi(["This Lead Already Exist Please Contact Admin"], "Validator Error", 400);
            } else {
                return ResponseApi::badMethodErrorResponse(['message' => "Server Error"], "server Error", 500);
            }
        } else {
            $lead = Contact::create([
                'user_creator_id' => Auth::guard('user_api')->user()->id,
                'partner_id' => !empty($request->partner_id) ? $request->partner_id : null,
                'name' => $request->name,
                'notes' => $request->notes,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
                'title'=>!empty($request->title)?$request->title:null,
            ]);
        }
        if (!empty($lead->id)) {
            return ResponseApi::acceptedResponseApi($this->castArrayContact($lead), "success", 201);
        } else {
            return ResponseApi::badMethodErrorResponse(['message' => "Server Error"], "server Error", 500);
        }

        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }

    }
    
    public function UpdateContact(Request $request)
    {
        try{
        $validator = Validator::make($request->all(), [
            'token' => 'required|string',
            'contact_id' => 'required|numeric|exists:contacts,id',
        ]);
        if ($validator->fails()) {
            return ResponseApi::badMethodErrorResponse($validator->errors()->all(), "Validator Errors", 400);
        }
        if (!empty($request->phone) || !empty($request->email)) {
            if (!empty($request->email)) {
                if (!empty($request->email)) {
                    $leads_email = Contact::where('email', $request->email)->where('id', '<>', $request->contact_id)->get()->count();
                    if ($leads_email > 0) {
                        $leads_found = Contact::where('email', $request->email)->where('id', '<>', $request->contact_id)->first();
                    }
                }
            } else {
                $array_phone = [];
                $counter = 0;
                $counter2 = 0;
                $leads_found = null;
                foreach ($request->phone as $phone) {
                    $array_phone[] = [
                        'phone' => $phone['phone'],
                        'type' => $phone['phone_type']
                    ];

                    $phone = substr($phone['phone'], 3);

                    $leads = Contact::where('phone', 'LIKE', '%' . $phone . '%')->where('id', '<>', $request->contact_id)->get()->count();

                    if ($leads > 0) {
                        $leads_found = Contact::where('phone', 'LIKE', '%' . $phone . '%')->where('id', '<>', $request->contact_id)->first();
                    }

                }
            }

            if (!empty($leads_found)) {
                $lead_dublicate = ContactLeadDublicate::create([
                    'campagin_id' => !empty($leads_found->campagin_id)?$leads_found->campagin_id:1,
                    'contact_id' => $leads_found->id,
                    'branches_id' => $request->branches_id ? $request->branches_id : 1,
                    'user_creator_id' => Auth::guard('user_api')->user()->id,
                    'notes' => $request->notes,
                    'partner_id' => $request->partner_id ? $request->partner_id : null,
                ]);

                if (!empty($lead_dublicate->id)) {
                    return ResponseApi::acceptedResponseApi(["This Lead Already Exist Please Contact Admin"], "Validator Error", 400);

                } else {
                    return ResponseApi::badMethodErrorResponse(['message' => "Server Error"], "server Error", 500);
                }
            }
                


        }
 
            $phoneType = Contact::where('id', $request->contact_id)->first();
                if (!empty($phoneType->id)) {
                    $phoneType->update($request->all());
                         return ResponseApi::acceptedResponseApi(['Success'], "success", 201);

            } else {
                return ResponseApi::badMethodErrorResponse(["Contact Lead not found"], "Validator Errors", 400);
            }

        
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(["Server Error"],"server Error",500);

        }

    }

    public function DeleteContact(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'token' => 'required|string',
                'contact_id' => 'required|numeric|exists:contacts,id',
            ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(), "Validator Errors", 400);
            }

            $contact = Contact::where('id',$request->contact_id)->first();

            if (!empty($contact->id)) {

            $phoneType = ContactLead::where('contact_id', $request->contact_id)->get();
            foreach($phoneType as $con){
                    $activity = ContactLeadActivity::where('contact_lead_id', $con->id)->get();
                    foreach ($activity as $value) {
                        $value->delete();
                    }
                    $con->delete();
                }
                $contact->delete();
            }
            
                return ResponseApi::acceptedResponseApi(["message" => "Deleted Success"], "success", 201);

          
        } catch (\Exception $e) {
            return ResponseApi::badMethodErrorResponse(['message' => "Server Error"], "server Error", 500);

        }

    }


    public function GetOrgContact(Request $request){
       try {
            $validator = Validator::make($request->all(), [
                'token' => 'required|string',
                'partner_id' => 'required|numeric|exists:partners,id',
            ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(), "Validator Errors", 400);
            }
            $array_response =[];

            $contact = Contact::where('partner_id',$request->partner_id)->get();
            if(!empty($contact[0]->id)){
            foreach ($contact as $dep) {
                $array_response[] = $this->castArrayContact($dep);
                # code...
            }
          
                return ResponseApi::acceptedResponseApi($array_response, "success", 201);

            }else{
                return ResponseApi::notFoundResponse(['message' => "Empty Contact Lead"], "Empty", 200);

            }
        } catch (\Exception $e) {
            return ResponseApi::badMethodErrorResponse(['message' => "Server Error"], "server Error", 500);

        }

    }

    public function GetMyContact(Request $request){
         try {
              $validator = Validator::make($request->all(), [
                  'token' => 'required|string',
              ]);
              if ($validator->fails()) {
                  return ResponseApi::badMethodErrorResponse($validator->errors()->all(), "Validator Errors", 400);
              }
              $array_response =[];
  

//              $all_contact_ids = ContactLead::where('sales_id',Auth::guard('user_api')->user()->id)->get('id');

            $contact = Contact::where('user_creator_id', Auth::guard('user_api')->user()->id)
            ->orWhereHas('partner_id_fun', function ($query) {
                $query->where('sales_id', Auth::guard('user_api')->user()->id);
            })
            ->get();
           // return $contact;
            //  $contact = Contact::where('user_creator_id',Auth::guard('user_api')->user()->id)->get();
              if(!empty($contact[0]->id)){
              foreach ($contact as $dep) {
                  $array_response[] = $this->castArrayContact($dep);
                  # code...
              }
            
                  return ResponseApi::acceptedResponseApi($array_response, "success", 201);
  
              }else{
                  return ResponseApi::notFoundResponse(['message' => "Empty Contact Lead"], "Empty", 200);
  
              }
          } catch (\Exception $e) {
              return ResponseApi::badMethodErrorResponse(['message' => "Server Error"], "server Error", 500);
  
          }
  
      }

      public function GetMyOrgContact(Request $request){
          try {
              $validator = Validator::make($request->all(), [
                  'token' => 'required|string',
                  'partner_id' => 'required|numeric|exists:partners,id',
              ]);
              if ($validator->fails()) {
                  return ResponseApi::badMethodErrorResponse($validator->errors()->all(), "Validator Errors", 400);
              }
              $array_response =[];
  
             
            //   $all_contact_ids = ContactLead::where('sales_id', Auth::guard('user_api')->user()->id)
            //   ->whereHas('contact_id_fun',function($q)use($request){
            //     $q->where('partner_id',$request->partner_id);
            //   })->pluck('contact_id')->toArray();

            //  $all_contact_ids = ContactLead::where(function ($query) use ($request) {
            //     $query->where('sales_id', Auth::guard('user_api')->user()->id)
            //         ->orWhereHas('contact_id_fun', function ($q) use ($request) {
            //             $q->where('partner_id', $request->partner_id)
            //                 ->orWhereHas('partner_id_fun', function ($subQuery) {
            //                     $subQuery->where('sales_id', Auth::guard('user_api')->user()->id);
            //                 });
            //         });
            // })
            // ->pluck('contact_id')
            // ->toArray();
          $meId = Auth::guard('user_api')->id();

            $all_contact_ids = ContactLead::where(function ($query) use ($request, $meId) {
                $query->where('sales_id', $meId)->whereHas('contact_id_fun', function ($q) use ($request) {
                        $q->where('partner_id', $request->partner_id);
                    })
                    ->orWhereHas('contact_id_fun.partner_id_fun', function ($q) use ($meId, $request) {
                        $q->where('sales_id', $meId)
                        ->where('id', $request->partner_id); // ensure it's the same partner_id
                    });
                })
                ->pluck('contact_id')
                ->unique()
                ->values()
                ->toArray();




              //  return $all_contact_ids;
              $contact = Contact::where('partner_id',$request->partner_id)
              ->where('user_creator_id',Auth::guard('user_api')->user()->id)->orWhereIn('id',$all_contact_ids)->get();
              

              if(!empty($contact[0]->id)){
              foreach ($contact as $dep) {
                  $array_response[] = $this->castArrayContact($dep);
                  # code...
              }
            
                  return ResponseApi::acceptedResponseApi($array_response, "success", 201);
  
              }else{
                  return ResponseApi::notFoundResponse(['message' => "Empty Contact Lead"], "Empty", 200);
  
              }
          } catch (\Exception $e) {
            return $e;
              return ResponseApi::badMethodErrorResponse(['message' => "Server Error"], "server Error", 500);
  
          }
  
      }
    
   

    public function GetAllContact(Request $request)
    {
          try {
            $validator = Validator::make($request->all(), [
                'token' => 'required|string',
            ]);
            if ($validator->fails()) {
                return ResponseApi::badMethodErrorResponse($validator->errors()->all(), "Validator Errors", 400);
            }
            $array_response =[];

            $contact = Contact::all();
            if(!empty($contact[0]->id)){
            foreach ($contact as $dep) {
                $array_response[] = $this->castArrayContact($dep);
                # code...
            }
          
                return ResponseApi::acceptedResponseApi($array_response, "success", 201);

            }else{
                return ResponseApi::notFoundResponse(['message' => "Empty Contact "], "Empty", 200);

            }
        } catch (\Exception $e) {
            return ResponseApi::badMethodErrorResponse(['message' => "Server Error"], "server Error", 500);

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
     * @param  \App\Models\Contact  $contact
     * @return \Illuminate\Http\Response
     */
    public function show(Contact $contact)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Contact  $contact
     * @return \Illuminate\Http\Response
     */
    public function edit(Contact $contact)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Contact  $contact
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Contact $contact)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Contact  $contact
     * @return \Illuminate\Http\Response
     */
    public function destroy(Contact $contact)
    {
        //
    }
}
