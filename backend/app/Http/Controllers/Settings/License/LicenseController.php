<?php


namespace App\Http\Controllers\Settings\License;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use App\Models\Partner;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use App\Models\License;
use App\Models\User;
use App\Models\Log;
use App\Models\LicenseHistory;
use App\Models\LicenseAttach;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;

use App\Mail\LicenseEnded;

class LicenseController extends Controller
{


   public function CastArrayLicense(License $license){
    $attached = LicenseAttach::where('license_id',$license->id)->first();
    $license_history = LicenseHistory::where('license_id',$license->id)->get();
    $array_reponse2=[] ;
    if(!empty($license_history[0]->id)){
        foreach($license_history as $dep){
             $array_reponse2[] = [ 
                 'status_name' =>$dep->license_status_id_old_fun->license_status_name,
                'status' =>$dep->license_status_id_old,
                'createdByKey' =>$dep->user_creator_id,
                'createdAt' =>$dep->created_at,
                'updatedAt' =>$dep->updated_at,
                'startDate'=>   Carbon::parse( $dep->license_start_date_old)->format('m/d/Y') ,
                'endDate'=> Carbon::parse( $dep->license_end_date_old)->format('m/d/Y') ,    
                'createdByName' =>$dep->user_creator_id_fun->username,
                'key'=>$dep->id.'',
                'licenseKey'=>$dep->license_id,
            ];
        } 
   }
    $array_reponse = [ 
        'key'=>$license->id.'',
        'accountName'=>$license->license_number.'',
        'type_name' =>$license->license_type_id_fun->license_type,
        'type' =>$license->license_type_id,
        'clientName' =>!empty($license->partner_id)?$license->partner_id_fun->partner_name:null,
        'clientKey' =>!empty($license->partner_id)?$license->partner_id:null,
        'clientLogo' =>!empty($license->partner_id)?($license->partner_id_fun->partner_photoURL?'/Attachments/Client/Partner'.$license->partner_id.'/'.$license->partner_id_fun->partner_photoURL:null):null,
        'product' =>$license->product_id,
        'product_name' =>$license->product_id_fun->product_name,
        'status' =>$license->license_status_id,
        'status_name' =>$license->license_status_id_fun->license_status_name,
        'startDate'=> Carbon::parse( $license->license_start_date)->format('m/d/Y') ,
        'endDate'=> Carbon::parse( $license->license_end_date)->format('m/d/Y') ,    
        'comment' =>$license->license_comment?$license->license_comment:null,
        'fileURL'=>!empty($attached->license_attach)?'/Attachments/Client/License/'.$license->id.'/'.$attached->id.'/' .$attached->license_attach:null,
        'fileName'=>!empty($attached->license_attach)?$attached->license_attach:null,
        'createdAt'=>$license->created_at,
        'updatedAt'=>$license->updated_at,
        'createdByKey' =>$license->user_creator_id,
        'createdByName' =>$license->user_creator_id_fun->username,
        'license_history'=>$array_reponse2,
    ];
    return $array_reponse;
   }
    public function DeleteLicense(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'license_id'=>'required|numeric|exists:licenses,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $license=  License::where('id',$request->license_id)->first();
          $attached = LicenseAttach::where('license_id',$request->license_id)->first();
          if(!empty($attached->id)){
            $image_path = 'Attachments/Client/License/'.$license->id.'/'.$attached->id.'/' .$attached->license_attach ;  // Value is not URL but directory file path

            if(File::exists($image_path)) {
                File::delete($image_path);
             
            }
            $attached->forceDelete();
        }
        if(!empty($license->id)){
            $license_history = LicenseHistory::where('license_id',$license->id)->get();
            if(!empty($license_history[0]->id)){
                foreach($license_history as $dep){
                    $dep->delete();
                    
                } 
            }
            
            $license->delete();
            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"License not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
  
    
    public function ExpiredLicense(){
        try{
             $licence = License::all();
            foreach ($licence as  $value) {
                $now_date =null;
                $date  =  Carbon::parse( $value->license_end_date)->format('m/d/Y');
                $now_date = Carbon::today()->addMonths(2);

                $date = Carbon::create($date);
                if($now_date->greaterThanOrEqualTo($date)){
                    $user = User::where('sub_departments_id',5)->orWhere('sub_departments_id',6)->get();
                   //             $user = User::where('id',14)->orWhere('id',16)->get();

                    $mailto = [];
                        foreach($user as $sen){
                            $mailto[]=$sen->email;
                        }
                    

                    if(!empty($mailto)){
                      $message  =  Carbon::parse( $value->endDate)->format('m/d/Y');
                      // $mailto = "ataha@firstgulfsolutions.com";
                       if(!empty($value->partner_id)){
                        $partner_name = $value->partner_id_fun->partner_name ;
                       }else{
                        $partner_name = $value->license_number;
                       }
                      try{
                        $log=  Log::create([
                            'action' => "Send Email License ".$partner_name .'-' . $value->product_id_fun->product_name,
                      'actionKeys' =>"Send Email To ".implode(",",$mailto) ,
                            'empKey' =>1,
                            'empName' =>"Cron Job",
                            'createdAt' =>Carbon::now(),
                            'actionStatus' =>'Try',
                        ]);
                        Mail::to($mailto)->send(new LicenseEnded($value->id,$partner_name .'-' . $value->product_id_fun->product_name,$message));  
                        $log=  Log::create([
                            'action' => "Send Email License ".$partner_name .'-' . $value->product_id_fun->product_name,
                      'actionKeys' =>"Send Email To ".implode(",",$mailto) ,
                            'empKey' =>1,
                            'empName' =>"Cron Job",
                            'createdAt' =>Carbon::now(),
                            'actionStatus' =>'Success',
                        ]);  
                      }catch(\Exception $e){
                        $log=  Log::create([
                            'action' => "Send Email License ".$partner_name .'-' . $value->product_id_fun->product_name,
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
        return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

       }
    }


    public function UpdateLicense(Request $request){
     
        try{
            $validator = Validator::make($request->all(), [
                'partner_id' => 'required|numeric|exists:partners,id',
               'product_id' => 'required|numeric|exists:products,id',
               'license_type_id' => 'required|numeric|exists:license_types,id',
               'license_status_id' => 'required|numeric|exists:license_statuses,id',
               'license_start_date' => 'required|date|date_format:m/d/Y',
               'license_end_date' => 'required|date|date_format:m/d/Y|after:license_start_date',
                 'token'=>'required|string',
                 'license_id'=>'required|numeric|exists:licenses,id',
             ]);
           if ($validator->fails()) {
   
               return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
           }
          

          
          
 
           $licence = License::where('id',$request->license_id)->first();
           $update_data= [
            'license_number' =>$request->license_number,
            'partner_id' =>$request->partner_id,
            'product_id' =>$request->product_id,
            'license_type_id' =>$request->license_type_id,
            'license_status_id' =>$request->license_status_id,
            'license_comment' =>$request->license_comment,
            'license_start_date' => Carbon::createFromFormat('m/d/Y', $request-> license_start_date),
            'license_end_date' => Carbon::createFromFormat('m/d/Y', $request-> license_end_date),
            'user_creator_id' =>Auth::guard('user_api')->user()->id,
           ];
           $licence->update($update_data);
 
             

              if ($request->hasFile('license_attach')   ) {
                  $fileArray = array('license_attach' => $request->license_attach);

            // Tell the validator that this file should be an image
            $rules = array(
              'license_attach' => 'mimes:jpeg,jpg,png,gif|required|max:20000' // max 10000kb
            );
        
            // Now pass the input and rules into the validator
            $validator = Validator::make($fileArray, $rules);
        
                // Check to see if validation fails or passes
                if ($validator->fails())
                {
                     return ResponseApi::acceptedResponseApi($validator->errors()->all(),"Faild Format",400);

                }

               $image = $request->file('license_attach');
               $file_name = $image->getClientOriginalName();
                $attached = LicenseAttach::where('license_id',$request->license_id)->first();

                if(!empty($attached->id)){

                    $image_path = 'Attachments/Client/License/'.$request->license_id.'/'.$attached->id.'/' .$attached->license_attach ;  // Value is not URL but directory file path
 
                    if(File::exists($image_path)) {
                        File::delete($image_path);
                    }

                    $attached->update([
                        'license_attach' =>$file_name,
                         'user_creator_id' =>Auth::guard('user_api')->user()->id,
                    ]);

                    $image->move(('Attachments/Client/License/'.$request->license_id.'/'.$attached->id.'/'), $file_name);
                   
        
                }else{
                    $attached =LicenseAttach::create([
                        'license_attach' =>$file_name,
                        'license_id' =>$request->license_id,
                        'user_creator_id' =>Auth::guard('user_api')->user()->id,
                    ]);
     
                    $image->move(('Attachments/Client/License/'.$request->license_id.'/'.$attached->id.'/'), $file_name);
                    
                }

              
             

           }
          
           
           return ResponseApi::acceptedResponseApi(['message'=>'updated Success'],"success",201);

            
       }catch(\Exception $e){
        return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

       }
       
        
    }
 
    public function RenewLicense(Request $request){
     
        try{
            $validator = Validator::make($request->all(), [
                 'license_start_date' => 'required|date|date_format:m/d/Y',
                'license_end_date' => 'required|date|date_format:m/d/Y|after:license_start_date',
                 'token'=>'required|string',
                 'license_id'=>'required|numeric|exists:licenses,id',
             ]);
           if ($validator->fails()) {
   
               return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
           }
          

           $licence = License::where('id',$request->license_id)->first();
           if(!empty($licence->id)){
                $licence_history = LicenseHistory::create([
                    'license_id' =>$licence->id,
                      'license_type_id_old' =>$licence->license_type_id,
                    'license_status_id_old' =>2,
                    'license_start_date_old' =>    $licence->license_start_date  ,
                    'license_end_date_old' =>   $licence->license_end_date  ,
                    'user_creator_id' =>Auth::guard('user_api')->user()->id,
                   
                ]);
 
            }       
                if(!empty($licence_history->id)){
                    $licence->update([
                        'license_start_date' => Carbon::createFromFormat('m/d/Y', $request-> license_start_date),
                        'license_end_date' => Carbon::createFromFormat('m/d/Y', $request-> license_end_date),
                    ]);


               
                $license = License::where('id',$request->license_id)->first();
                $license_history = LicenseHistory::where('license_id',$request->license_id)->get();
                 if(!empty($license->id)){
                     $image_path = null;
                     $array_reponse2=[] ;
                     if(!empty($license_history[0]->id)){
                     foreach($license_history as $dep){

                          $array_reponse2[] = [ 
                                'license_type_id_old_name' =>$dep->license_type_id_old_fun->license_type,
                             'license_type_id_old' =>$dep->license_type_id_old,
                             'license_status_id_old_name' =>$dep->license_status_id_old_fun->license_status_name,
                             'license_status_id_old' =>$dep->license_status_id_old,
                             'user_creator_id' =>$dep->user_creator_id,
                             'license_start_date_old'=>   Carbon::parse( $dep->license_start_date_old)->format('m/d/Y') ,
                             'license_end_date_old'=> Carbon::parse( $dep->license_end_date_old)->format('m/d/Y') ,    
                             'user_creator_name' =>$dep->user_creator_id_fun->username,
                             'id'=>$dep->id
         
                         ];
 
                     }
                         
                    
                }

               
                 return ResponseApi::acceptedResponseApi(['message'=>'Renew Success'],"success",201);
           }else{
            return ResponseApi::badMethodErrorResponse(["message"=>"Empty License"],"Validator Errors",400);

           }
          
        }
             
        return ResponseApi::badMethodErrorResponse(["message"=>"Empty License"],"Validator Errors",400);

             
           

            
       }catch(\Exception $e){
        return ResponseApi::badMethodErrorResponse($e,"server Error",500);

       }
       
        
    }
    public function CreateLicense(Request $request){
     
        try{
             $validator = Validator::make($request->all(), [
                 'partner_id' => 'required|numeric|exists:partners,id',
                'product_id' => 'required|numeric|exists:products,id',
                'license_type_id' => 'required|numeric|exists:license_types,id',
                'license_status_id' => 'required|numeric|exists:license_statuses,id',
                'license_start_date' => 'required|date|date_format:m/d/Y',
                'license_end_date' => 'required|date|date_format:m/d/Y|after:license_start_date',
                  'token'=>'required|string'
              ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

            $license=  License::create([
                'license_number' =>$request->license_number,
                'partner_id' =>$request->partner_id,
                'product_id' =>$request->product_id,
                'license_type_id' =>$request->license_type_id,
                'license_status_id' =>$request->license_status_id,
                'license_comment' =>$request->license_comment,
                'license_start_date' => Carbon::createFromFormat('m/d/Y', $request-> license_start_date),
                'license_end_date' => Carbon::createFromFormat('m/d/Y', $request-> license_end_date),
                'user_creator_id' =>Auth::guard('user_api')->user()->id,
                ]);
              
                $attached ;
               if ($request->hasFile('license_attach')   ) {

   $fileArray = array('license_attach' => $request->license_attach);

            // Tell the validator that this file should be an image
            $rules = array(
              'license_attach' => 'mimes:jpeg,jpg,png,gif|required|max:20000' // max 10000kb
            );
        
            // Now pass the input and rules into the validator
            $validator = Validator::make($fileArray, $rules);
        
                // Check to see if validation fails or passes
                if ($validator->fails())
                {
                     return ResponseApi::acceptedResponseApi($validator->errors()->all(),"Faild Format",400);

                }
                

                $image = $request->file('license_attach');
                $file_name = $image->getClientOriginalName();

                $attached =LicenseAttach::create([
                    'license_attach' =>$file_name,
                    'license_id' =>$license->id,
                    'user_creator_id' =>Auth::guard('user_api')->user()->id,
                ]);
               

                $image->move(('Attachments/Client/License/'.$license->id.'/'.$attached->id.'/'), $file_name);
                
              
            }
           
            return ResponseApi::acceptedResponseApi(['message'=>'created Success'],"success",201);


             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }


    public function GetSpecificLicense(Request $request){
         
        try{
            $validator = Validator::make($request->all(), [
                'license_id' => 'required|numeric|exists:licenses,id',
                 'token'=>'required|string'
             ]);
           if ($validator->fails()) {
   
               return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
           }
           $license = License::where('id',$request->license_id)->first();
             if(!empty($license->id)){
                
           
                $array_reponse =$this->CastArrayLicense($license);
 
            
 
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty license"],"Empty",200);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }



    public function GetAllLicense(){
         
       // try{
          $license = License::all();
          if(!empty($license[0]->id)){
            foreach($license as $dep){
            $array_reponse[] = $this->CastArrayLicense($dep);
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty license"],"Empty",200);

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
     * @param  \App\Models\Licence  $licence
     * @return \Illuminate\Http\Response
     */
    public function show(Licence $licence)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Licence  $licence
     * @return \Illuminate\Http\Response
     */
    public function edit(Licence $licence)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Licence  $licence
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Licence $licence)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Licence  $licence
     * @return \Illuminate\Http\Response
     */
    public function destroy(Licence $licence)
    {
        //
    }
}
