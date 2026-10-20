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
use App\Models\ContactLeadAttach;
use Illuminate\Support\Facades\File;

class ContactLeadAttachController extends Controller
{

    public function DeleteContactLeadAttach(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'attach_id'=>'required|numeric|exists:contact_lead_attaches,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $partner=  ContactLeadAttach::where('id',$request->attach_id)->first();
          
          if(!empty($partner->id)){
            $image_path='Attachments/ContactLeadAttach/'.$partner->contact_lead_id.'/'.$partner->contact_lead_attach;
            if(File::exists($image_path)) {
                File::delete($image_path);
            }

            $partner->forcedelete();
        
        }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Contact Attach"],"Empty",200);

          }
            

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }


    public function GetContactLeadAttach(Request $request){
         
        try{
            $validator = Validator::make($request->all(), [
                'contact_lead_id' => 'required|string|exists:contact_leads,id',
                'token'=>'required|string',
             ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $partner = ContactLeadAttach::where('contact_lead_id',$request->contact_lead_id)->get();
         
          if(!empty($partner[0]->id)){
            foreach($partner as $dep){
                $b = false;
                if(str_contains($dep->contact_lead_attach, 'png') || str_contains($dep->contact_lead_attach, 'avif')||
                str_contains($dep->contact_lead_attach, 'gif')||str_contains($dep->contact_lead_attach, 'webp')||
                str_contains($dep->contact_lead_attach, 'jpg')||
                str_contains($dep->contact_lead_attach, 'jpeg')||
                str_contains($dep->contact_lead_attach, 'svg')||str_contains($dep->contact_lead_attach, 'PNG') || str_contains($dep->contact_lead_attach, 'AVIF')||
                str_contains($dep->contact_lead_attach, 'GIF')||str_contains($dep->contact_lead_attach, 'WEBP')||
                str_contains($dep->contact_lead_attach, 'JPG')||
                str_contains($dep->contact_lead_attach, 'JPEG')||
                str_contains($dep->contact_lead_attach, 'SVG'))
              {
                $b = true;
              }

            $array_reponse[] = [ 
                'contact_lead_id' =>$dep->contact_lead_id,
                'contact_lead_attach' =>'/Attachments/ContactLeadAttach/'.$dep->contact_lead_id.'/'.$dep->contact_lead_attach,
                'user_creator_id' =>$dep->user_creator_id,
                'user_creator_name' =>$dep->user_creator_id_fun->username,
                'id'=>$dep->id.'',
                'file_name'=>$dep->contact_lead_attach,
                'isImage'=>$b,
                'createdBy'=>$dep->user_creator_id_fun->username,
                'createdAt'=>$dep->created_at

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Contact Attach"],"Empty",200);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
     

    public function CreateContactLeadAttach(Request $request){
     
       // try{
            
            $validator = Validator::make($request->all(), [
                'contact_lead_id' => 'required|string|exists:contact_leads,id',
                'token'=>'required|string',
                'contact_lead_attach'=>'required'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

           
               if ($request->hasFile('contact_lead_attach'))  {


                $partner=  ContactLeadAttach::where('id',$request->contact_lead_id)->get();
                // if(!empty($partner[0]->id)){
                // foreach($partner as $dep)
                // if(!empty($dep->task_id)){
                //     $image_path = 'Attachments/Project/'.$dep->process_id_fun->project_id.'/'.$dep->process_id.'/'.$dep->task_id.'/' .$dep->process_attach ;  // Value is not URL but directory file path
                // }else{
                //     $image_path = 'Attachments/Project/'.$dep->process_id_fun->project_id.'/'.$dep->process_id. '/' .$dep->process_attach ;  // Value is not URL but directory file path

                // }
                //     if(File::exists($image_path)) {
                //         File::delete($image_path);
                //     }
                //     $dep->forcedelete();
                // }

                foreach($request->contact_lead_attach as $dep){
             //   $image = $dep->file('contact_lead_attach');
                $file_name = $dep->getClientOriginalName();
                $partner=  ContactLeadAttach::create([
                    'contact_lead_id' =>$request->contact_lead_id,
                    'user_creator_id' =>Auth::guard('user_api')->user()->id,
                    'contact_lead_attach'=>$file_name,
                    ]);
                    $dep->move(('Attachments/ContactLeadAttach/'.$request->contact_lead_id.'/'), $file_name);
                }
            }else{
                return ResponseApi::badMethodErrorResponse(["message"=>"Attach File Must Be Exist"],"Validator Errors",400);

            }
             
             
           
           
            return ResponseApi::acceptedResponseApi(['message'=>'success'],"success",201);


             
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
     * @param  \App\Models\ContactLeadAttach  $contactLeadAttach
     * @return \Illuminate\Http\Response
     */
    public function show(ContactLeadAttach $contactLeadAttach)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ContactLeadAttach  $contactLeadAttach
     * @return \Illuminate\Http\Response
     */
    public function edit(ContactLeadAttach $contactLeadAttach)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ContactLeadAttach  $contactLeadAttach
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ContactLeadAttach $contactLeadAttach)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ContactLeadAttach  $contactLeadAttach
     * @return \Illuminate\Http\Response
     */
    public function destroy(ContactLeadAttach $contactLeadAttach)
    {
        //
    }
}
