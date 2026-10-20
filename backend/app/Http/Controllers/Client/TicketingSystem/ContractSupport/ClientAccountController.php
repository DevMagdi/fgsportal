<?php

namespace App\Http\Controllers\Client\TicketingSystem\ContractSupport;

use App\Http\Controllers\Controller;
  use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use App\Models\ContractType;
use App\Models\ContractStatus;
use App\Models\ClientAccount;
  use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\UserDetail;
use App\Models\SubDepartment;
use App\Models\WorkDegree;
use Illuminate\Support\Facades\Hash;
use App\Models\UserViolence;
use App\Models\PasswordReset;
  use App\Mail\ForgetPasswordMail;
 use Carbon\Carbon;
 use Illuminate\Support\Facades\Mail;

 use Illuminate\Support\Str;
use Illuminate\Support\Facades\Crypt;
use App\Mail\WelcomeMail;

 
class ClientAccountController extends Controller
{

    public function CastClientAccount(ClientAccount $clientAccount){
        $array_reponse= [
            'key'=>$clientAccount->id.'',
            'fullname'=>$clientAccount->fullname,
            'email'=>$clientAccount->email,
            'phone'=>$clientAccount->phone,
            'refreshRequired'=>$clientAccount->refreshRequired,
            'active'=>$clientAccount->active,
            'hamada'=>$clientAccount->user_creator_id?true:false,
            'primary'=>$clientAccount->primary,
            'partner_id'=>$clientAccount->partner_id,
            'partner_name'=>$clientAccount->partner_id?$clientAccount->partner_id_fun->partner_name:null,
            'partnerPhotoUrl' => $clientAccount->partner_id?($clientAccount->partner_id_fun->partner_photoURL?"Attachments/Client/Partner/" .  $clientAccount->partner_id . '/' .$clientAccount->partner_id_fun->partner_photoURL:null):null,
            'user_creator_id'=>$clientAccount->user_creator_id?$clientAccount->user_creator_id:$clientAccount->client_account_id,
            'user_creator_name'=>$clientAccount->user_creator_id?$clientAccount->user_creator_id_fun->username:($clientAccount->client_account_id?$clientAccount->client_account_id_fun->fullname:null),
        ];
        return $array_reponse;
    }

    public function DeleteClientAccount(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'client_account_id'=>'required|numeric|exists:client_accounts,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $clientAccount=  ClientAccount::where('id',$request->client_account_id)->first();

          if(!empty($clientAccount->id)){

            $clientAccount->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Client Account not found"],"Validator Errors",400);

          }
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateClientAccount(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'client_account_id'=>'required|numeric|exists:client_accounts,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $clientAccount=  ClientAccount::where('id',$request->client_account_id)->first();

          if(!empty($clientAccount->id)){
            $clientAccount->update(
                $request->except(['password'])
              );
              if(!empty($request->password)){
                $clientAccount=  ClientAccount::where('id',$request->client_account_id)->first();
                $clientAccount->update([
                    'password'=>Hash::make($request->password),
                ]);
              }

            return ResponseApi::acceptedResponseApi($clientAccount,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Client Account not found"],"Validator Errors",400);

          }
         
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateClientAccount(Request $request){
    //    try{
            $validator = Validator::make($request->all(), [
                'email' => 'required|email|unique:client_accounts',
                'fullname'=>'required|string',
                'password' => 'required|min:8',
                'phone'=>'required',
                'partner_id'=>'required|numeric|exists:partners,id',
                'token'=>'required|string',
                'hamada'=>'required|boolean',
                'primary'=>'required|boolean'
             ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

            if($request->hamada==true){
                if(!empty(Auth::guard('user_api')->user()->id)){
                    $clientAccount=  ClientAccount::create([
                        'fullname'=>$request->fullname,
                        'email'=>$request->email,
                        'password'=>Hash::make($request->password),
                        'phone'=>json_encode($request->phone),
                        'refreshRequired'=>0,
                        'active'=>$request->active?$request->active:true,
                        'primary'=>$request->primary,
                        'partner_id'=>$request->partner_id,
                        'user_creator_id'=>Auth::guard('user_api')->user()->id,
                        ]);

                    Mail::to($request->email)->send(new WelcomeMail($request->email,$request->fullname,$request->password));
                          
            
                }else{

                    
                }
            }else{
                $clientAccount=  ClientAccount::create([
                    'fullname'=>$request->fullname,
                    'email'=>$request->email,
                    'password'=>Hash::make($request->password),
                    'phone'=>json_encode($request->phone),
                     'refreshRequired'=>0,
                    'active'=>$request->active?$request->active:true,
                    'primary'=>false,
                    'partner_id'=>$request->partner_id,
                    'client_account_id'=>Auth::guard('client_api')->user()->id,
                    ]);
                    Mail::to($request->email)->send(new WelcomeMail($request->email,$request->fullname,$request->password));

            }

            if(!empty($clientAccount->id)){
                return ResponseApi::acceptedResponseApi($this->CastClientAccount($clientAccount),"success",201);
            }else{
                return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

            }
        

             
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
        
    }
    public function GetAllClientAccount(){
        try{
          $clientAccount = ClientAccount::all();
          if(!empty($clientAccount[0]->id)){
            foreach($clientAccount as $dep){

                $array_reponse[] = [ 
                    'contract_statuses_name' =>$dep->contract_statuses_name,
                    'key'=>$dep->id.'',
                    'fullname'=>$dep->fullname
                ];

            }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Client Account"],"Empty",200);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);
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
     * @param  \App\Models\ClientAccount  $clientAccount
     * @return \Illuminate\Http\Response
     */
    public function show(ClientAccount $clientAccount)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ClientAccount  $clientAccount
     * @return \Illuminate\Http\Response
     */
    public function edit(ClientAccount $clientAccount)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ClientAccount  $clientAccount
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ClientAccount $clientAccount)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ClientAccount  $clientAccount
     * @return \Illuminate\Http\Response
     */
    public function destroy(ClientAccount $clientAccount)
    {
        //
    }
}
