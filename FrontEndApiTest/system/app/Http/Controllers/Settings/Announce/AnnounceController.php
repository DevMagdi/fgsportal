<?php

namespace App\Http\Controllers\Settings\Announce;

use App\Http\Controllers\Controller;
  use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\AnnounceClient;
use App\Models\AnnounceUser;
use App\Models\Announce;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
class AnnounceController extends Controller
{
    public function DeleteAnnounce(Request $request){
       // try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                 'announce_id'=>'required|numeric|exists:announces,id',
                ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

            $annualType=  Announce::where('id',$request->announce_id)->first();
        

          if(!empty($annualType->id)){
            $annualUser=  AnnounceUser::where('announce_id',$request->announce_id)->delete();
            $annualClient=  AnnounceClient::where('announce_id',$request->announce_id)->delete();
            $annualType->delete();
            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);
          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Announce not found"],"Empty",200);

          }
         
        

             
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
        
    }
    public function UpdateAnnounce(Request $request){
      //  try{
             
            $validator = Validator::make($request->all(), [
               'token'=>'required|string',
               'announce_id'=>'required|numeric|exists:announces,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            $new_ann = null;
            $create_an = Announce::where('id',$request->announce_id)->first();
            $new_ann = $create_an;
            $create_an->update(
                $request->except(['attach'])
              );
             if ($request->hasFile('attach') ) {
                $create_an = Announce::where('id',$request->announce_id)->first();

                  $image_path = '/Attachments/Announce/'.$create_an->id.'/' .$create_an->attach;  // Value is not URL but directory file path
                if(File::exists($image_path)) {
                    File::delete($image_path);
                }
                     $image = $request->file('attach');
                    $file_name = $image->getClientOriginalName();
                    $random = Str::random(10);
                    $file_name = $random;
    
                    $image->move(('Attachments/Announce/'.$create_an->id.'/'), $file_name);
                    $create_an->update([
                        'attach'=>$file_name,
                    ]);
            }
 
            if(!empty($request->user_id)){
                $allannounce = AnnounceUser::where('announce_id',$request->announce_id)->get();
                foreach($allannounce as $all){
                    $all->delete();
                }
                    foreach($request->user_id as $arr){
                        $allannounce = AnnounceUser::where('announce_id',$request->announce_id)->where('user_creator_id',$arr)->withTrashed()->first();
                        if(!empty($allannounce->id)){
                            $allannounce->restore();
                        }else{

                            AnnounceUser::create([
                                'user_creator_id'=>$arr,
                                'announce_id'=>$new_ann!=null?$new_ann->id:null,
                            ]);
                        }
                           
                     }
            }
            if(!empty($request->client_id)){
                $allannounce = AnnounceClient::where('announce_id',$request->announce_id)->get();
                foreach($allannounce as $all){
                    $all->delete();
                }
                    foreach($request->client_id as $arr){
                        $allannounce = AnnounceClient::where('announce_id',$request->announce_id)->where('contact_account_id',$arr)->withTrashed()->first();
                        if(!empty($allannounce->id)){
                            $allannounce->restore();
                        }else{

                            AnnounceUser::create([
                                'contact_account_id'=>$arr,
                                'announce_id'=>$new_ann!=null?$new_ann->id:null,
                            ]);
                        }
                           
                     }
        }
          return ResponseApi::acceptedResponseApi(['message'=>'success'],"success",201);

             
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
        
    }
    public function CreateAnnounce(Request $request){
     //   try{
             
            $validator = Validator::make($request->all(), [
                 'title'=>'required|string',
               'body'=>'required|string',
               'lang'=>'required|string',
               'token'=>'required|string',
              ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
            $new_ann = null;
            $create_an = Announce::create([
                'user_creator_id'=>Auth::guard('user_api')->user()->id,
                'title'=>$request->title,
                'body'=>$request->body,
                'lang'=>$request->lang,
            ]);
          
              if($request->has('user_id') &&!empty($create_an->id) ){
                foreach($request->user_id as $arrs){
                     AnnounceUser::create([
                        'user_creator_id'=>$arrs,
                        'announce_id'=> $create_an ->id,
                    ]);
                       
                }
                }
                if($request->has('client_id') &&!empty($create_an->id)){
                    foreach($request->client_id as $arr){
                        AnnounceClient::create([
                            'contact_account_id'=>$arr,
                            'announce_id'=> $create_an->id,
                        ]);
                        
                    }
            }
            if ($request->hasFile('attach') ) {
                if(!empty($create_an->id)){
                    $image = $request->file('attach');
                    $file_name = $image->getClientOriginalName();
                    $random = Str::random(10);
                    $file_name = $random;
    
                    $image->move(('Attachments/Announce/'.$create_an->id.'/'), $file_name);
                    $create_an->update([
                        'attach'=>$file_name,
                    ]);
                }
              
            }
 
          
          return ResponseApi::acceptedResponseApi(['message'=>'success'],"success",201);

             
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
        
    }

    public function announceToViewUser(Announce $announce){
       $users =  AnnounceUser::where('announce_id',$announce->id)->get();
        $array_reponse = [];

        foreach($users as $dep){
            $array_reponse[]=[
                'key' =>$dep->id.'',
                'empToviewedByKey' =>$dep->user_creator_id.'',
                'empToviewedByName' =>!empty($dep->user_creator_id)?$dep->user_creator_id_fun->username:null,
            ];
        }
        return $array_reponse;
    } 
    public function announceViewUser(Announce $announce){
       $users =  AnnounceUser::where('announce_id',$announce->id)->where('seen',true)->get();
        $array_reponse = [];
        foreach($users as $dep){
            $array_reponse[]=[
                'key' =>$dep->id.'',
                'viewedByKey' =>$dep->user_creator_id.'',
                'viewedByName' =>!empty($dep->user_creator_id)?$dep->user_creator_id_fun->username:null,
                'viewedAt' =>$dep->updated_at,
                'announceKey' =>!empty($dep->announce_id)?$dep->announce_id:null,
            ];
        }
        return $array_reponse;
    } 
    public function announceToViewClient(Announce $announce){
        $users =  AnnounceClient::where('announce_id',$announce->id)->get();
         $array_reponse = [];
 
         foreach($users as $dep){
             $array_reponse[]=[
                 'key' =>$dep->id.'',
                 'empToviewedByKey' =>$dep->user_creator_id.'',
                 'empToviewedByName' =>!empty($dep->user_creator_id)?$dep->user_creator_id_fun->username:null,
             ];
         }
         return $array_reponse;
     } 
     public function announceViewClient(Announce $announce){
        $users =  AnnounceClient::where('announce_id',$announce->id)->where('seen',true)->get();
         $array_reponse = [];
         foreach($users as $dep){
             $array_reponse[]=[
                 'key' =>$dep->id.'',
                 'viewedByKey' =>$dep->user_creator_id.'',
                 'viewedByName' =>!empty($dep->user_creator_id)?$dep->user_creator_id_fun->username:null,
                 'viewedAt' =>$dep->updated_at,
                 'announceKey' =>!empty($dep->announce_id)?$dep->announce_id:null,
             ];
         }
         return $array_reponse;
     } 

    public function GetAllAnnounce(Request $request){
      //  try{
             $validator = Validator::make($request->all(), [
               
               'token'=>'required|string',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }
          $annualType = Announce::all();
          $array_reponse=[];
          if(!empty($annualType[0]->id)){
            foreach($annualType as $dep){
            $array_reponse[] = [ 
                'createdByKey' =>$dep->user_creator_id.'',
                'createdByName' =>!empty($dep->user_creator_id)?$dep->user_creator_id_fun->username:null,
                 'language' =>$dep->lang,
                'assignTo' =>$this->announceToViewUser($dep),
                'viewedBy' =>$this->announceViewUser($dep),
                'assignToClient' =>$this->announceToViewClient($dep),
                'viewedByClient' =>$this->announceViewClient($dep),
                 'imgURL' =>!empty($dep->attach)?('/Attachments/Announce/'.$dep->id.'/' .$dep->attach):null,

                'status' =>$dep->start == false?0:1,
                'body' =>$dep->body,
                'title' =>$dep->title,
                'createdAt' =>$dep->created_at,
                'key'=>$dep->id.''
            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Announce"],"Empty",200);

          }
             
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
        
    }

    public function GetMyAnnounce(Request $request){
       // try{
            $validator = Validator::make($request->all(), [
               
                'token'=>'required|string',
             ]);
             if ($validator->fails()) {
     
                 return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
             }
          $annualType = Announce::where('user_creator_id',Auth::guard('user_api')->user()->id)->get();
          if(!empty($annualType[0]->id)){
            foreach($annualType as $dep){
            $array_reponse[] = [ 
                'createdByKey' =>$dep->user_creator_id.'',
                'createdByName' =>!empty($dep->user_creator_id)?$dep->user_creator_id_fun->username:null,
                 'language' =>$dep->lang,
                'assignTo' =>$this->announceToViewUser($dep),
                'viewedBy' =>$this->announceViewUser($dep),
                'assignToClient' =>$this->announceToViewClient($dep),
                'viewedByClient' =>$this->announceViewClient($dep),
                'imgURL' =>!empty($dep->attach)?('/Attachments/Announce/'.$dep->id.'/' .$dep->attach):null,

                 'status' =>$dep->start == false?0:1,
                'body' =>$dep->body,
                'title' =>$dep->title,
                'createdAt' =>$dep->created_at,
                'key'=>$dep->id.''
            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(['message'=>"Empty Announce"],"Empty",200);

          }
             
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
        
    }

    public function ClientSeenAnnounce(Request $request){
       // try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'announce_id'=>'required|numeric|exists:announces,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $annualType=  AnnounceClient::where('announce_id',$request->announce_id)->first();

          if(!empty($annualType->id)){

            $annualType->update([
                'seen' =>true,
            ]);
            $annualType=  AnnounceClient::where('announce_id',$request->announce_id)->where('seen',0)->get()->count();

            if($annualType == 0){
                $annualType2=  Announce::where('id',$request->announce_id)->first();
                $annualType2->update([
                    'start' =>true,
                ]);
    

            }

            return ResponseApi::acceptedResponseApi($annualType,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Announce not found"],"Empty",200);

          }
         
        

             
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
        
    }
    public function UserSeenAnnounce(Request $request){
     //   try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'announce_id'=>'required|numeric|exists:announces,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $annualType=  AnnounceUser::where('announce_id',$request->announce_id)->first();

          if(!empty($annualType->id)){

            $annualType->update([
                'seen' =>true,
            ]);

            $annualType=  AnnounceUser::where('announce_id',$request->announce_id)->where('seen',0)->get()->count();

            if($annualType == 0){
                $annualType2=  Announce::where('id',$request->announce_id)->first();
                $annualType2->update([
                    'start' =>true,
                ]);
    

            }


            return ResponseApi::acceptedResponseApi($annualType,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Announce not found"],"Empty",200);

          }
         
        

             
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
        
    }
     public function CloseAnnounce(Request $request){
       // try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'announce_id'=>'required|numeric|exists:announces,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $annualType=  Announce::where('id',$request->announce_id)->first();

          if(!empty($annualType->id)){
            $annualType->update([
                'start' =>true,
            ]);

            return ResponseApi::acceptedResponseApi($annualType,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Announce not found"],"Empty",200);

          }
         
             
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
        
    }

    public function ShowMyAnnounceClient(Request $request){
        //try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
             ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

            $annualType=  AnnounceClient::whereHas('announce_id_fun',function($q){
                $q->where('start',false);
          })->where('seen',false)->where('contact_account_id',Auth::guard('client_api')->user()->id)->get();

          if(!empty($annualType[0]->id)){
            foreach($annualType as $dep){
            $array_reponse[] = [ 
                 'language' =>$dep->announce_id_fun->lang,
                  'imgURL' =>!empty($dep->announce_id_fun->attach)?('/Attachments/Announce/'.$dep->announce_id_fun->id.'/' .$dep->announce_id_fun->attach):null,

                 'body' =>$dep->announce_id_fun->body,
                'title' =>$dep->announce_id_fun->title,
                'createdAt' =>$dep->announce_id_fun->created_at,
                'key'=>$dep->id.''
            ];
            }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);


 
          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Announce not found"],"Empty",200);

          }
         
             
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
        
    }
    public function ShowMyAnnounceUser(Request $request){
        // try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
             ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $annualType=  AnnounceUser::whereHas('announce_id_fun',function($q){
                $q->where('start',false);
          })->where('seen',false)->where('user_creator_id',Auth::guard('user_api')->user()->id)->get();

          if(!empty($annualType[0]->id)){
            foreach($annualType as $dep){
            $array_reponse[] = [ 
                 'language' =>$dep->announce_id_fun->lang,
                 'imgURL' =>!empty($dep->announce_id_fun->attach)?('/Attachments/Announce/'.$dep->announce_id_fun->id.'/' .$dep->announce_id_fun->attach):null,
                  'body' =>$dep->announce_id_fun->body,
                'title' =>$dep->announce_id_fun->title,
                'createdAt' =>$dep->announce_id_fun->created_at,
                'key'=>$dep->announce_id.''
            ];
            }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);


 
          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Announce not found"],"Empty",200);

          }
         
             
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
        
    }
    public function SeenMyAnnounceUser(Request $request){
       // try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'announce_id'=>'required|numeric|exists:announces,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $annualType=  AnnounceUser::where('announce_id',$request->announce_id)->where('user_creator_id',Auth::guard('user_api')->user()->id)->first();
            
          if(!empty($annualType->id)){
             $annualType->update([
                'seen'=>true,
             ]);
             $annualType=  AnnounceUser::where('announce_id',$request->announce_id)->first();
             $annualType_count=  AnnounceUser::where('announce_id',$annualType->announce_id)->where('seen',false)->get()->count();

             if($annualType_count == 0 ){
                $annualType_an=  Announce::where('id',$annualType->announce_id)->first();
                $annualType_an->update([

                    'start'=>true
                ]);

             }
            return ResponseApi::acceptedResponseApi($annualType,"success".$annualType_count,201);

 
          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Announce not found"],"Empty",200);

          }
         
             
        // }catch(\Exception $e){
        //     return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        // }
        
    }
    public function SeenMyAnnounceClient(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'token'=>'required|string',
                'announce_id'=>'required|numeric|exists:announces,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $annualType=  AnnounceClient::where('id',$request->announce_id)->first();

          if(!empty($annualType->id)){
             $annualType->update([
                'seen'=>true,
             ]);
             $annualType=  AnnounceClient::where('announce_id',$request->announce_id)->first();
             $annualType_count=  AnnounceClient::where('announce_id',$annualType->announce_id)->where('seen',0)->get()->count();

             if($annualType_count == 0 ){
                $annualType_an=  Announce::where('id',$annualType->announce_id)->first();
                $annualType_an->update([
                    'start'=>true
                ]);

             }
            return ResponseApi::acceptedResponseApi($annualType,"success",201);
 
          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Announce not found"],"Empty",200);

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
     * @param  \App\Models\Announce  $announce
     * @return \Illuminate\Http\Response
     */
    public function show(Announce $announce)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Announce  $announce
     * @return \Illuminate\Http\Response
     */
    public function edit(Announce $announce)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Announce  $announce
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Announce $announce)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Announce  $announce
     * @return \Illuminate\Http\Response
     */
    public function destroy(Announce $announce)
    {
        //
    }
}
