<?php


namespace App\Http\Controllers\Client\Partner;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use App\Models\ClientAccount;
use App\Models\TransportationRequest;
use App\Models\Partner;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
 use App\Events\TestNotification;
 use App\Models\ContactLead;
 use App\Models\Contact;

class PartnerController extends Controller
{
    public function NotificationTest(){
        // try{
           event(new TestNotification("Hello World"));


            return ResponseApi::badMethodErrorResponse(['message'=>"Hello World"],"Notification Send",201);

             
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
        
    }
    
    public function DeletePartner(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'partner_id'=>'required|numeric|exists:partners,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $partner=  Partner::where('id',$request->partner_id)->first();
          if(!empty($partner->id)){
            $image_path = "Attachments/Client/Partner/" . $partner->id . '/' .$partner->partner_photoURL ;  // Value is not URL but directory file path

            if(File::exists($image_path)) {
                File::delete($image_path);
                $partner->update([
                    'partner_photoURL'=> null,
                ]);
            }

            $partner->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Partner not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }


    public function UpdatePartner(Request $request){
     
     //   try{
            $validator = Validator::make($request->all(), [
                  'partner_id' => 'required|numeric|exists:partners,id',                
                 'token'=>'required|string'
              ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

            $partner = Partner::where('id',$request->partner_id)->first();
            $partner2 = Partner::where('id',$request->partner_id)->first();
               if ($request->hasFile('partner_photoURL') && !empty($partner->id) ) {

                $image = $request->file('partner_photoURL');
                $file_name = $image->getClientOriginalName();
                $file_name = "partner.png";
                $image->move(('Attachments/Client/Partner/'.$partner->id.'/'), $file_name);
                $partner->update($request->except(['partner_photoURL']));
                $partner = Partner::where('id',$request->partner_id)->first();

                $partner->update([
                    'partner_photoURL'=>$file_name,
                  
                    'user_creator_id' =>Auth::guard('user_api')->user()->id,

                 ]);
            }else{
                $partner->update($request->all());
            }
            if(!empty($partner->partner_photoURL)){
                $photo =  "Attachments/Client/Partner/" . $partner->id . '/' .$partner->partner_photoURL;
            }else{
                $photo = null ;
            }
          //  $partner_lead = ContactLead::where('partner_id',$partner->id)->get();
            $partner = Partner::where('id',$request->partner_id)->first();
            $array_reponse[] = [ 
                'partner_name' =>$partner->partner_name,
                'partner_address' =>$partner->partner_address,
                'partner_description' =>$partner->partner_description,
                'partner_photoURL' =>$photo,
                'phone'=>$partner->phone,
                'is_org'=>$partner->is_org,
                'email'=>$partner->email,
                // 'lead'=>$partner_lead->where('isLead',true)->count(),
                // 'contact'=>$partner_lead->where('isLead',false)->count(),
                // 'won'=>$partner_lead->where('lead_sub_status_id',9)->count(),
                // 'lost'=>$partner_lead->where('lead_sub_status_id',10)->count(),
                // 'archive'=>$partner_lead->where('lead_sub_status_id',11)->count(),
                'user_creator_id' =>$partner->user_creator_id,
                'user_creator_name' =>$partner->user_creator_id_fun->username,
                'partner_industry_id'=>$partner->partner_industry_id,
                'organize_type_id'=>$partner->organize_type_id,
                'organize_type_name'=>!empty($partner->organize_type_id)?$partner->organize_type_id_fun->organize_type:null,
                'partner_industry_name'=>!empty($partner->partner_industry_id)?$partner->partner_industry_id_fun->partner_industry_name:null,
                
                'sales_id'=>!empty($partner->sales_id)?$partner->sales_id:null,
                'sales_name'=>!empty($partner->sales_id)?$partner->sales_id_fun->username:null,
                'id'=>$partner->id.''
            ];
           
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);


             
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
        
    }
 

    public function CreatePartner(Request $request){
     
       try{
       
            $validator = Validator::make($request->all(), [
                'partner_name' => 'required|string|unique:partners',
                  'token'=>'required|string'
              ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

            $partner=  Partner::create([
                'partner_name' =>$request->partner_name,
                'partner_address' =>$request->partner_address,
                'partner_description' =>$request->partner_description,
                'phone' =>!empty($request->phone)?$request->phone:null,
                'email' =>!empty($request->email)?$request->email:null,
                'user_creator_id' =>Auth::guard('user_api')->user()->id,
                'partner_industry_id'=>!empty($request->partner_industry_id)?$request->partner_industry_id:null,
                'is_org'=>!empty($request->is_org)?$request->is_org:0,
                'country'=>!empty($request->country)?$request->country:null,
                'website'=>!empty($request->website)?$request->website:null,
                'organize_type_id'=>!empty($request->organize_type_id)?$request->organize_type_id:null,
                'sales_id'=>!empty($request->sales_id)?$request->sales_id:null,
                
                ]);
               if ($request->hasFile('partner_photoURL') && !empty($partner->id) ) {

                $image = $request->file('partner_photoURL');
                $file_name = $image->getClientOriginalName();
                $file_name = "partner.png";
                $image->move(('Attachments/Client/Partner/'.$partner->id.'/'), $file_name);
                $partner->update([
                    'partner_photoURL'=>$file_name,
                ]);
              
 
            }
            if(!empty($partner->partner_photoURL)){
                $photo =  "/Attachments/Client/Partner/" . $partner->id . '/' .$partner->partner_photoURL;
            }else{
                $photo = null ;
            }
 
            $array_reponse = [ 
                'partner_name' =>$partner->partner_name,
                'partner_address' =>$partner->partner_address,
                'partner_description' =>$partner->partner_description,
                'partner_photoURL' =>$photo,
                'user_creator_id' =>$partner->user_creator_id,
                'user_creator_name' =>$partner->user_creator_id_fun->username,
                'id'=>$partner->id.'',
                'phone'=>$partner->phone,
                'email'=>$partner->email,
                'website'=>$request->website,
                'country'=>$request->country,
                'organize_type_id'=>$partner->organize_type_id,
                'organize_type_name'=>!empty($partner->organize_type_id)?$partner->organize_type_id_fun->organize_type:null,
                'partner_industry_name'=>!empty($partner->partner_industry_id)?$partner->partner_industry_id_fun->partner_industry_name:null,
                'sales_id'=>!empty($partner->sales_id)?$partner->sales_id:null,
                'sales_name'=>!empty($partner->sales_id)?$partner->sales_id_fun->username:null,

            ];
        
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);


             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error ". $e],"server Error",500);

        }
        
    }

    public function GetAllPartner(Request $request){
         
      //  try{
        $validator = Validator::make($request->all(), [
              'token'=>'required|string'
          ]);
        if ($validator->fails()) {

            return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
        }
        
          if(($request->is_org==0 || $request->is_org==1)){
              $partner = Partner::where('is_org',$request->is_org)->get();
          }
          if(!$request->has('is_org')){
                $partner = Partner::all();
    
              
          }
          if(!empty($partner[0]->id)){
              foreach($partner as $dep){
                $partner_lead = Contact::where('partner_id',$dep->id)->join('contact_leads','contact_leads.contact_id','=','contacts.id')->get();
            $array_reponse[] = [ 
                'partner_name' =>$dep->partner_name,
                'partner_address' =>$dep->partner_address,
                'partner_description' =>$dep->partner_description,
                'partner_photoURL' => "/Attachments/Client/Partner/" . $dep->id . '/' .$dep->partner_photoURL,
                'user_creator_id' =>$dep->user_creator_id,
                'user_creator_name' =>$dep->user_creator_id_fun->username,
                'id'=>$dep->id.'',
                'phone'=>$dep->phone,
                'email'=>$dep->email,
                'lead'=>$partner_lead->where('isLead',true)->count(),
                'contact'=>$partner_lead->where('isLead',false)->count(),
                'person_contact'=>$partner_lead->count(),
                'won'=>$partner_lead->where('lead_sub_status_id',9)->count(),
                'lost'=>$partner_lead->where('lead_sub_status_id',10)->count(),
                'archive'=>$partner_lead->where('lead_sub_status_id',11)->count(),
                'website'=>$dep->website,
                'is_org'=>$dep->is_org,
                'country'=>$dep->country,
                'organize_type_id'=>$dep->organize_type_id,
                'organize_type_name'=>!empty($dep->organize_type_id)?$dep->organize_type_id_fun->organize_type:null,
                'partner_industry_id'=>$dep->partner_industry_id,
                'partner_industry_name'=>!empty($dep->partner_industry_id)?$dep->partner_industry_id_fun->partner_industry_name:null,
                
                'sales_id'=>!empty($dep->sales_id)?$dep->sales_id:null,
                'sales_name'=>!empty($dep->sales_id)?$dep->sales_id_fun->username:null,
              

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Partner"],"Empty",200);

          }
             
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
        
    }
    public function CastClientAccount(ClientAccount $clientAccount){
        $partner_lead = ContactLead::whereHas('contact_id_fun',function($q)use($clientAccount){
            $q->where('partner_id',$clientAccount->partner_id);
        })->get();

        $array_reponse= [
            'key'=>$clientAccount->id.'',
            'fullname'=>$clientAccount->fullname,
            'email'=>$clientAccount->email,
            'lead'=>$partner_lead->where('isLead',true)->count(),
            'contact'=>$partner_lead->where('isLead',false)->count(),
            'won'=>$partner_lead->where('lead_sub_status_id',9)->count(),
            'lost'=>$partner_lead->where('lead_sub_status_id',10)->count(),
            'archive'=>$partner_lead->where('lead_sub_status_id',11)->count(),
            'phone'=>$clientAccount->phone,
            'refreshRequired'=>$clientAccount->refreshRequired,
            'active'=>$clientAccount->active,
            'hamada'=>$clientAccount->user_creator_id?true:false,
            'primary'=>$clientAccount->primary,
            'partner_id'=>$clientAccount->partner_id,
            'partner_phone'=>!empty($clientAccount->partner_id)?$clientAccount->partner_id_fun->phone:null,
            'partner_email'=>!empty($clientAccount->partner_id)?$clientAccount->partner_id_fun->email:null,
             'partner_name'=>$clientAccount->partner_id?$clientAccount->partner_id_fun->partner_name:null,
            'partnerPhotoUrl' => $clientAccount->partner_id?($clientAccount->partner_id_fun->partner_photoURL?"Attachments/Client/Partner/" .  $clientAccount->partner_id . '/' .$clientAccount->partner_id_fun->partner_photoURL:null):null,
            'user_creator_id'=>$clientAccount->user_creator_id?$clientAccount->user_creator_id:$clientAccount->client_account_id,
            'user_creator_name'=>$clientAccount->user_creator_id?$clientAccount->user_creator_id_fun->username:($clientAccount->client_account_id?$clientAccount->client_account_id_fun->fullname:null),
        ];
        return $array_reponse;
    }
    public function GetSpecifciPartner(Request $request){
         
     
       // try{
           
            $validator = Validator::make($request->all(), [
                'partner_id' => 'required|string|exists:partners,id',
                  'token'=>'required|string'
              ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
          $dep = Partner::where('id',$request->partner_id)->first();
          if(!empty($dep->id)){
            $array_reponse2=[];
            $clientAccount = ClientAccount::where('partner_id',$dep->id)->get();
            foreach($clientAccount as $client){
                $array_reponse2[]=$this->CastClientAccount($client);
            }
          //  $partner_lead = Contact::where('partner_id',$dep->id)->get();

            $array_reponse = [ 
                'partner_name' =>$dep->partner_name,
                'partner_address' =>$dep->partner_address,
                'partner_description' =>$dep->partner_description,
                'partner_photoURL' => "/Attachments/Client/Partner/" . $dep->id . '/' .$dep->partner_photoURL,
                'user_creator_id' =>$dep->user_creator_id.'',
                'user_creator_name' =>$dep->user_creator_id_fun->username,
                'id'=>$dep->id.'',
                'phone'=>$dep->phone,
                'email'=>$dep->email,
                'account'=>$array_reponse2,
                'website'=>$dep->website,
                'country'=>$dep->country,
                // 'lead'=>$partner_lead->where('isLead',true)->count(),
                // 'contact'=>$partner_lead->where('isLead',false)->count(),
                // 'won'=>$partner_lead->where('lead_sub_status_id',9)->count(),
                // 'lost'=>$partner_lead->where('lead_sub_status_id',10)->count(),
                // 'archive'=>$partner_lead->where('lead_sub_status_id',11)->count(),
                'is_org'=>$dep->is_org,
                'organize_type_id'=>$dep->organize_type_id,
                'organize_type_name'=>!empty($dep->organize_type_id)?$dep->organize_type_id_fun->organize_type:null,
                'partner_industry_id'=>$dep->partner_industry_id,
                'partner_industry_name'=>!empty($dep->partner_industry_id)?$dep->partner_industry_id_fun->partner_industry_name:null,
                
                 
                'sales_id'=>!empty($dep->sales_id)?$dep->sales_id.'':null,
                'sales_name'=>!empty($dep->sales_id)?$dep->sales_id_fun->username:null,
              
            ];
    
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Partner"],"Empty",200);

          }
             
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
        
    }
    
    public function GetMyPartner(Request $request){
        try {
          $validator = Validator::make($request->all(), [
              'token' => 'required|string',
          ]);
          if ($validator->fails()) {
              return ResponseApi::badMethodErrorResponse($validator->errors()->all(), "Validator Errors", 400);
          }
          $array_response =[];
          

          $partner = Partner::where('sales_id',Auth::guard('user_api')->user()->id)->get();
          if(!empty($partner[0]->id)){
          foreach ($partner as $dep) {
                 $partner_lead = Contact::where('partner_id',$dep->id)->join('contact_leads','contact_leads.contact_id','=','contacts.id')->get();
            $array_reponse[] = [ 
                'partner_name' =>$dep->partner_name,
                'partner_address' =>$dep->partner_address,
                'partner_description' =>$dep->partner_description,
                'partner_photoURL' => "/Attachments/Client/Partner/" . $dep->id . '/' .$dep->partner_photoURL,
                'user_creator_id' =>$dep->user_creator_id,
                'user_creator_name' =>$dep->user_creator_id_fun->username,
                'id'=>$dep->id.'',
                'phone'=>$dep->phone,
                'email'=>$dep->email,
                'lead'=>$partner_lead->where('isLead',true)->count(),
                'contact'=>$partner_lead->where('isLead',false)->count(),
                'person_contact'=>$partner_lead->count(),
                'won'=>$partner_lead->where('lead_sub_status_id',9)->count(),
                'lost'=>$partner_lead->where('lead_sub_status_id',10)->count(),
                'archive'=>$partner_lead->where('lead_sub_status_id',11)->count(),
                'website'=>$dep->website,
                'is_org'=>$dep->is_org,
                'country'=>$dep->country,
                'organize_type_id'=>$dep->organize_type_id,
                'organize_type_name'=>!empty($dep->organize_type_id)?$dep->organize_type_id_fun->organize_type:null,
                'partner_industry_id'=>$dep->partner_industry_id,
                'partner_industry_name'=>!empty($dep->partner_industry_id)?$dep->partner_industry_id_fun->partner_industry_name:null,
                
                'sales_id'=>!empty($dep->sales_id)?$dep->sales_id:null,
                'sales_name'=>!empty($dep->sales_id)?$dep->sales_id_fun->username:null,
              

            ];
          }
              return ResponseApi::acceptedResponseApi($array_reponse, "success", 201);

          }else{
              return ResponseApi::notFoundResponse(['message' => "Empty Contact Lead"], "Empty", 200);

          }
        } catch (\Exception $e) {
            // return $e;
            return ResponseApi::badMethodErrorResponse(['message' => "Server Error"], "server Error", 500);

        }
  
   }
    
    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
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
     * @param  \App\Models\Partner  $partner
     * @return \Illuminate\Http\Response
     */
    public function show(Partner $partner)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Partner  $partner
     * @return \Illuminate\Http\Response
     */
    public function edit(Partner $partner)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Partner  $partner
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Partner $partner)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Partner  $partner
     * @return \Illuminate\Http\Response
     */
    public function destroy(Partner $partner)
    {
        //
    }
}
