<?php

namespace App\Http\Controllers\Client\TicketingSystem\ContractSupport;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use App\Models\ClientAccount;
use App\Models\ContractType;
use App\Models\ContractStatus;
use App\Models\ContractSupport;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use App\Mail\SupportEnded;
use App\Mail\SupportEndClient;
use App\Models\User;
use App\Models\Log;
use App\Models\ContractSupportAttach;
use App\Models\ContractSupportHistory;
use App\Models\ClientAccountContract;



class ContractSupportController extends Controller
{

  



    public function CastArraySupport(ContractSupport $contractSupport){
      $contract_history = ContractSupportHistory::where('contract_support_id',$contractSupport->id)->get();
      $history = [];
      foreach($contract_history as $contract){
        $history [] = [
          'contract_end_date'=>Carbon::parse( $contract->contract_end_date_old)->format('m/d/Y') ,
          'contract_start_date'=>Carbon::parse( $contract->contract_start_date_old)->format('m/d/Y') ,
          'contract_status_name'=>!empty($contract->contract_status_id_old_fun)?$contract->contract_status_id_old_fun->contract_statuses_name:null
        ];
      
      }
        $client_account = ClientAccount::where('client_account_id',null)->where('partner_id',$contractSupport->partner_id)->first();
        
        $array_reponse=[
            'key'=>$contractSupport->id.'',
            'notes'=>$contractSupport->notes,
            'createdByKey'=>$contractSupport->user_creator_id?$contractSupport->user_creator_id:null,
            'createdByName'=>$contractSupport->user_creator_id?$contractSupport->user_creator_id_fun->username:null,
            'PMID'=>$contractSupport->project_manager_id?$contractSupport->project_manager_id:null,
            'PMName'=>$contractSupport->project_manager_id?$contractSupport->project_manager_id_fun->username:null,
            'managerID'=>$contractSupport->manager_id?$contractSupport->manager_id:null,
            'managerName'=>$contractSupport->manager_id?$contractSupport->manager_id_fun->username:null,
            'periority'=>$contractSupport->contract_type_id?$contractSupport->contract_type_id:null,
            'periority_name'=>$contractSupport->contract_type_id?$contractSupport->contract_type_id_fun->contract_type:null,
            'customerKey'=>$contractSupport->partner_id?$contractSupport->partner_id:null,
            'customerName'=>$contractSupport->partner_id?$contractSupport->partner_id_fun->partner_name:null,
            'product_id'=>$contractSupport->product_id?$contractSupport->product_id:null,
            'product_name'=>$contractSupport->product_id?$contractSupport->product_id_fun->product_name:null,
            'status'=>$contractSupport->contract_status_id?$contractSupport->contract_status_id:null,
            'status_name'=>$contractSupport->contract_status_id?$contractSupport->contract_status_id_fun->contract_statuses_name:null,
            'endDate'=>Carbon::parse( $contractSupport->contract_end_date)->format('m/d/Y') ,
            'startDate'=>Carbon::parse( $contractSupport->contract_start_date)->format('m/d/Y') ,
            'createdAt'=>$contractSupport->created_at,
            'updatedAt'=>$contractSupport->updated_at,
            'customerImgUrl' => $contractSupport->partner_id?($contractSupport->partner_id_fun->partner_photoURL?"/Attachments/Client/Partner/" .  $contractSupport->partner_id . '/' .$contractSupport->partner_id_fun->partner_photoURL:null):null,
            'primary_contact_fullname'=> !empty($client_account)?$client_account->fullname:null,
            'primary_contact_email'=> !empty($client_account)?$client_account->email:null,
            'primary_contact_phone'=> !empty($client_account)?$client_account->phone:null,
             'customerAddress'=>$contractSupport->partner_id?$contractSupport->partner_id_fun->partner_address:null,
             'primary_contact_id'=>!empty($client_account)?$client_account->id:null,
             'history'=>$history,

            
        ];
        return $array_reponse;
    }


    public function ExpiredSupport(){
      try{
          $contractSupport = ContractSupport::where('contract_status_id',1)->get();
          foreach ($contractSupport as  $value) {
              $now_date =null;
              $date  =  Carbon::parse( $value->contract_end_date)->format('m/d/Y');
              $now_date = Carbon::today()->addMonths(2);
              $date = Carbon::create($date);
              if($now_date->greaterThanOrEqualTo($date)){
                

                $client_account = ClientAccountContract::where('contract_support_id',$value->id)->get();
                // $user = User::where('id',14)->orWhere('id',16)->get();
                    $clientmailto = [];
                    foreach($client_account as $sen){
                      if(!empty($sen->client_account_id_fun->email)){
                        if($sen->client_account_id_fun->primary =='1'){
                          $clientmailto[]=$sen->client_account_id_fun->email;

                        }
                      }
                    }


                $user = User::where('sub_departments_id',5)->orWhere('sub_departments_id',6)->orWhere('sub_departments_id',9)->get();
            // $user = User::where('id',14)->orWhere('id',16)->get();
                $mailto = [];
                foreach($user as $sen){
                    $mailto[]=$sen->email;
                }
                if(!empty($mailto)){
                  $message  =  Carbon::parse( $value->contract_end_date)->format('m/d/Y');

                //  $mailto = "ataha@firstgulfsolutions.com";
                //  $mailto = ["ataha@firstgulfsolutions.com", 'ahassan@firstgulfsolutions.com'];
             //  return $mailto;
                  try{
                    $log=  Log::create([
                      'action' => "Send Email Contract Support ".$value->partner_id_fun->partner_name .'-' . $value->product_id_fun->product_name,
                      'actionKeys' =>"Send Email To ".implode(",",$mailto) ,
                      'empKey' =>1,
                      'empName' =>"Cron Job",
                      'createdAt' =>Carbon::now(),
                      'actionStatus' =>'Try',
                  ]);

                    Mail::to($mailto)->send(new SupportEnded($value->id,$value->partner_id_fun->partner_name .'-' . $value->product_id_fun->product_name,$message));   
                    $log=  Log::create([
                      'action' => "Send Email Contract Support ".$value->partner_id_fun->partner_name .'-' . $value->product_id_fun->product_name,
                      'actionKeys' =>"Send Email To ".implode(",",$mailto) ,
                      'empKey' =>1,
                      'empName' =>"Cron Job",
                      'createdAt' =>Carbon::now(),
                      'actionStatus' =>'Success',
                  ]); 
                  }catch(\Exception $e){
                    //  return $e;
                    $log=  Log::create([
                      'action' => "Send Email Contract Support ".$value->partner_id_fun->partner_name .'-' . $value->product_id_fun->product_name,
                      'actionKeys' =>"Send Email To ".implode(",",$mailto) ,
                      'empKey' =>1,
                      'empName' =>"Cron Job",
                      'createdAt' =>Carbon::now(),
                      'actionStatus' =>'Failed',
                  ]);
                  }
                }
                if(!empty($clientmailto)){
                  $message  =  Carbon::parse( $value->contract_end_date)->format('m/d/Y');

                //  $mailto = "ataha@firstgulfsolutions.com";
                //  $mailto = ["ataha@firstgulfsolutions.com", 'ahassan@firstgulfsolutions.com'];
             //  return $mailto;
                  try{
                    $log=  Log::create([
                      'action' => "Send Email Contract Support To Client ".$value->partner_id_fun->partner_name .'-' . $value->product_id_fun->product_name,
                      'actionKeys' =>"Send Email To ".implode(",",$clientmailto) ,
                      'empKey' =>1,
                      'empName' =>"Cron Job",
                      'createdAt' =>Carbon::now(),
                      'actionStatus' =>'Try',
                  ]);

                    Mail::to($clientmailto)->send(new SupportEndClient($value->partner_id_fun->partner_name,$value->partner_id_fun->partner_name .'-' . $value->product_id_fun->product_name,$message));   
                    $log=  Log::create([
                      'action' => "Send Email Contract Support  To Client".$value->partner_id_fun->partner_name .'-' . $value->product_id_fun->product_name,
                      'actionKeys' =>"Send Email To ".implode(",",$clientmailto) ,
                      'empKey' =>1,
                      'empName' =>"Cron Job",
                      'createdAt' =>Carbon::now(),
                      'actionStatus' =>'Success',
                  ]); 
                  }catch(\Exception $e){
                    //  return $e;
                    $log=  Log::create([
                      'action' => "Send Email Contract Support To Client".$value->partner_id_fun->partner_name .'-' . $value->product_id_fun->product_name,
                      'actionKeys' =>"Send Email To ".implode(",",$clientmailto) ,
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



  public function RenewContract(Request $request){
  
  //  try{
        $validator = Validator::make($request->all(), [
        
             'contract_start_date' => 'required|date|date_format:m/d/Y',
            'contract_end_date' => 'required|date|date_format:m/d/Y|after:contract_start_date',
             'token'=>'required|string',
             'contract_support_id'=>'required|numeric|exists:contract_supports,id',
            ]);
       if ($validator->fails()) {

           return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
       }
      

       $contractSupport = ContractSupport::where('id',$request->contract_support_id)->first();
       if(!empty($contractSupport->id)){
            $contract_history = ContractSupportHistory::create([
              'contract_status_id_old'=>$contractSupport->contract_status_id,
              'contract_type_id_old'=>$contractSupport->contract_type_id,
              'user_creator_id' =>Auth::guard('user_api')->user()->id,
              'contract_support_id'=>$contractSupport->id,
              'contract_end_date_old'=>$contractSupport->contract_end_date,
              'contract_start_date_old'=>$contractSupport->contract_start_date
            ]);

        }       
            if(!empty($contract_history->id)){
                $contractSupport->update([
                    'contract_start_date' => Carbon::createFromFormat('m/d/Y', $request-> contract_start_date),
                    'contract_end_date' => Carbon::createFromFormat('m/d/Y', $request-> contract_end_date),
                ]);

            $contractSupport = ContractSupport::where('id',$request->contract_support_id)->first();
            $contract_history = ContractSupportHistory::where('contract_support_id',$request->contract_support_id)->get();
             if(!empty($contractSupport->id)){
                 $image_path = null;
                 $array_reponse2=[] ;
                 if(!empty($contract_history[0]->id)){
                 foreach($contract_history as $dep){

                      $array_reponse2[] = [ 
                        'contract_status_id_old_name' =>$dep->contract_status_id_old_fun->contract_statuses_name,
                        'contract_status_id_old' =>$dep->contract_status_id_old,
                        'contract_type_id_old'=>$dep->contract_type_id_old_fun->contract_type,
                        'contract_type_id_old'=>$dep->contract_type_id_old,
                        'user_creator_id' =>$dep->user_creator_id,
                        'user_creator_name' =>$dep->user_creator_id_fun->username,
                        'id'=>$dep->id.'',
                        'contract_start_date_old'=>   Carbon::parse( $dep->contract_start_date_old)->format('m/d/Y') ,
                        'contract_end_date_old'=> Carbon::parse( $dep->contract_end_date_old)->format('m/d/Y') ,    
                 
     
                     ];

                 }
                     
                
            }

           
             return ResponseApi::acceptedResponseApi(['message'=>'Renew Success'],"success",201);
       }else{
        return ResponseApi::badMethodErrorResponse(["message"=>"Empty Contract"],"Validator Errors",400);

       }
      
    }
         
    return ResponseApi::badMethodErrorResponse(["message"=>"Empty Contract"],"Validator Errors",400);

         
       

        
  //  }catch(\Exception $e){
  //   return ResponseApi::badMethodErrorResponse($e,"server Error",500);

  //  }
   
    
}


    public function DeleteContractSupport(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'contract_support_id'=>'required|numeric|exists:contract_supports,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $ContractSupport=  ContractSupport::where('id',$request->contract_support_id)->first();

          if(!empty($ContractSupport->id)){

            $ContractSupport->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Contract Support not found"],"Validator Errors",400);

          }
         
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateContractSupport(Request $request){
       // try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'contract_support_id'=>'required|numeric|exists:contract_supports,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $ContractSupport=  ContractSupport::where('id',$request->contract_support_id)->first();

          if(!empty($ContractSupport->id)){
            $ContractSupport->update(
                $request->except(['contract_start_date','contract_end_date'])
              );

              
              if ($request->hasFile('contract_attach')   ) {
                $fileArray = array('contract_attach' => $request->contract_attach);

          // Tell the validator that this file should be an image
          $rules = array(
            'contract_attach' => 'mimes:jpeg,jpg,png,gif|required|max:20000' // max 10000kb
          );
      
          // Now pass the input and rules into the validator
          $validator = Validator::make($fileArray, $rules);
      
              // Check to see if validation fails or passes
              if ($validator->fails())
              {
                   return ResponseApi::acceptedResponseApi($validator->errors()->all(),"Faild Format",400);

              }

             $image = $request->file('contract_attach');
             $file_name = $image->getClientOriginalName();
              $attached = ContractSupportAttach::where('contract_support_id',$request->contract_support_id)->first();

              if(!empty($attached->id)){

                  $image_path = 'Attachments/Client/ContractSupport/'.$request->contract_support_id.'/'.$attached->id.'/' .$attached->contract_attach ;  // Value is not URL but directory file path

                  if(File::exists($image_path)) {
                      File::delete($image_path);
                  }

                  $attached->update([
                      'contract_attach' =>$file_name,
                       'user_creator_id' =>Auth::guard('user_api')->user()->id,
                  ]);

                  $image->move(('Attachments/Client/ContractSupport/'.$request->contract_support_id.'/'.$attached->id.'/'), $file_name);
                 
      
              }else{
                  $attached =ContractSupportAttach::create([
                      'contract_attach' =>$file_name,
                      'contract_support_id' =>$request->contract_support_id,
                      'user_creator_id' =>Auth::guard('user_api')->user()->id,
                  ]);
   
                  $image->move(('Attachments/Client/ContractSupport/'.$request->contract_support_id.'/'.$attached->id.'/'), $file_name);
                  
              }

            
           

         }

              if(!empty($request->contract_start_date)){
                $validator = Validator::make($request->all(), [
                  'contract_start_date' => 'required|date',
                  'token'=>'required|string',
              ]);
              if ($validator->fails()) {
        
                  return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
              }
              $ContractSupport=  ContractSupport::where('id',$request->contract_support_id)->first();
   
   
              $ContractSupport->update([
                'contract_start_date'=>Carbon::createFromFormat('m/d/Y', $request-> contract_start_date),
              ]);
        
              }
              if(!empty($request->contract_end_date)){
                $validator = Validator::make($request->all(), [
                  'contract_end_date' => 'required|date',
                  'token'=>'required|string',
              ]);
              if ($validator->fails()) {
        
                  return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
              }
              $ContractSupport=  ContractSupport::where('id',$request->contract_support_id)->first();
              $ContractSupport->update([
                'contract_end_date'=>Carbon::createFromFormat('m/d/Y', $request->contract_end_date),
              ]);
        
              }

            return ResponseApi::acceptedResponseApi($ContractSupport,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Contract Support not found"],"Validator Errors",400);

          }

         
        

             
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
        
    }

    
    public function CreateContractSupport(Request $request){
      //  try{
            $validator = Validator::make($request->all(), [
                 'manager_id'=>'required|numeric|exists:users,id',
                'contract_type_id'=>'required|numeric|exists:contract_types,id',
                'partner_id'=>'required|numeric|exists:partners,id',
                'product_id'=>'required|numeric|exists:products,id',
                 'contract_end_date'=>'required|date',
                'contract_start_date'=>'required|date',
                'token'=>'required|string',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

            $attached ;
            if ($request->hasFile('contract_attach')   ) {

           $fileArray = array('contract_attach' => $request->contract_attach);

         // Tell the validator that this file should be an image
         $rules = array(
           'contract_attach' => 'mimes:jpeg,jpg,png,gif|required|max:20000' // max 10000kb
         );
     
         // Now pass the input and rules into the validator
         $validator = Validator::make($fileArray, $rules);
     
             // Check to see if validation fails or passes
             if ($validator->fails())
             {
                  return ResponseApi::acceptedResponseApi($validator->errors()->all(),"Faild Format",400);

             }
             

             $image = $request->file('contract_attach');
             $file_name = $image->getClientOriginalName();

             $ContractSupport=  ContractSupport::create([
              'notes'=>$request->notes,
              'user_creator_id'=>Auth::guard('user_api')->user()->id,
              'project_manager_id'=>$request->project_manager_id?$request->project_manager_id:null,
              'manager_id'=>$request->manager_id,
              'contract_type_id'=>$request->contract_type_id,
              'partner_id' =>$request->partner_id,
              'product_id' =>$request->product_id,
              'contract_status_id' =>1,
              'contract_end_date' => Carbon::createFromFormat('m/d/Y', $request-> contract_end_date),
              'contract_start_date' => Carbon::createFromFormat('m/d/Y', $request-> contract_start_date),
             ]);

             
             $attached =ContractSupportAttach::create([
                 'contract_attach' =>$file_name,
                 'contract_support_id' =>$ContractSupport->id,
                 'user_creator_id' =>Auth::guard('user_api')->user()->id,
             ]);
            

             $image->move(('Attachments/Client/ContractSupport/'.$ContractSupport->id.'/'.$attached->id.'/'), $file_name);
             
           
         }else{

           $ContractSupport=  ContractSupport::create([
             'notes'=>$request->notes,
             'user_creator_id'=>Auth::guard('user_api')->user()->id,
             'project_manager_id'=>$request->project_manager_id?$request->project_manager_id:null,
             'manager_id'=>$request->manager_id,
             'contract_type_id'=>$request->contract_type_id,
             'partner_id' =>$request->partner_id,
             'product_id' =>$request->product_id,
             'contract_status_id' =>1,
             'contract_end_date' => Carbon::createFromFormat('m/d/Y', $request-> contract_end_date),
             'contract_start_date' => Carbon::createFromFormat('m/d/Y', $request-> contract_start_date),
            ]);
         }

         
           if(!empty($ContractSupport->id)){
               return ResponseApi::acceptedResponseApi(['message'=>'Inserted Success'],"success",201);
            }else{
               return ResponseApi::acceptedResponseApi(['message'=>'Can\'t Insert'],"Server Error",500);
           }
         
        

             
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
        
    }





    public function GetAllContractSupport(Request $request){
     //   try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $ContractSupport = ContractSupport::all();
          if(!empty($ContractSupport[0]->id)){
            foreach($ContractSupport as $dep){
            $array_reponse[] = $this->CastArraySupport($dep);
            }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Contract Support"],"Empty",200);

          }
             
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
        
    }
    public function GetSpecificContractSupport(Request $request){
        //   try{
               $validator = Validator::make($request->all(), [
                   'token'=>'required|string',
                   'contract_id'=>'required|numeric|exists:contract_supports,id'
               ]);
               if ($validator->fails()) {
       
                   return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
               }
   
             $ContractSupport = ContractSupport::where('id',$request->contract_id)->first();
             if(!empty($ContractSupport->id)){
                $array_reponse = $this->CastArraySupport($ContractSupport);
               
               return ResponseApi::acceptedResponseApi($array_reponse,"success",201);
   
             }else{
               return ResponseApi::notFoundResponse(['message'=>"Empty Contract Support"],"Empty",200);
   
             }
                
           // }catch(\Exception $e){
           //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
   
           // }
           
       }
       
       public function GetMyContractSupport(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $ContractSupport = ContractSupport::where('project_manager_id',Auth::guard('user_api')->user()->id)->get();
          if(!empty($ContractSupport[0]->id)){
            foreach($ContractSupport as $dep){
              $array_reponse[] = $this->CastArraySupport($dep);
          }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Contract Support"],"Empty",200);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetPartnerContractSupport(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'partner_id'=>'required|numeric|exists:partners,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $ContractSupport = ContractSupport::where('partner_id',$request->partner_id)->get();
          if(!empty($ContractSupport[0]->id)){
            foreach($ContractSupport as $dep){
            $array_reponse[] = [ 
                'ticket_type' =>$dep->ticket_type,
                'id'=>$dep->id.''
            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Contract Support"],"Empty",200);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetPrimaryAccountContractSupport(Request $request){
      try{
          $validator = Validator::make($request->all(), [
              'token'=>'required|string',
          ]);
          if ($validator->fails()) {
  
              return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
          }

        $ContractSupport = ContractSupport::where('partner_id',Auth::guard('client_api')->user()->partner_id)->get();

        if(!empty($ContractSupport[0]->id)){
          foreach($ContractSupport as $dep){
          $array_reponse[] = [ 
            'partner_name' =>$dep->partner_id?$dep->partner_id_fun->partner_name:null,
            'key'=>$dep->id.'',
            'product_id'=>$dep->product_id?$dep->product_id:null,
            'product_name'=>$dep->product_id?$dep->product_id_fun->product_name:null,
          
          ];
      }
          return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

        }else{
          return ResponseApi::notFoundResponse(['message'=>"Empty Contract Support"],"Empty",200);

        }
           
      }catch(\Exception $e){
          return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

      }
      
  }
    public function GetProjectManagerContractSupport(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'project_manager_id'=>'required|numeric|exists:users,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            $ContractSupport = ContractSupport::where('project_manager_id',$request->project_manager_id)->get();
            if(!empty($ContractSupport[0]->id)){
            foreach($ContractSupport as $dep){
            $array_reponse[] = [ 
                'ticket_type' =>$dep->ticket_type,
                'id'=>$dep->id.''
            ];
            }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Contract Support"],"Empty",200);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function GetProductContractSupport(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'product_id'=>'required|numeric|exists:products,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
          $ContractSupport = ContractSupport::where('product_id',$request->product_id)->get();
          if(!empty($ContractSupport[0]->id)){
            foreach($ContractSupport as $dep){
            $array_reponse[] = [ 
                'ticket_type' =>$dep->ticket_type,
                'id'=>$dep->id.''
            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Contract Support"],"Empty",200);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

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
     * @param  \App\Models\ContractSupport  $contractSupport
     * @return \Illuminate\Http\Response
     */
    public function show(ContractSupport $contractSupport)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ContractSupport  $contractSupport
     * @return \Illuminate\Http\Response
     */
    public function edit(ContractSupport $contractSupport)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ContractSupport  $contractSupport
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ContractSupport $contractSupport)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ContractSupport  $contractSupport
     * @return \Illuminate\Http\Response
     */
    public function destroy(ContractSupport $contractSupport)
    {
        //
    }
}
