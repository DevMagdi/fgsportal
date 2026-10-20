<?php

namespace App\Http\Controllers\User\Business\Campagin;

use App\Models\Campagin;
use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\UserDetail;
use App\Models\ContactLead;
use App\Models\ContactLeadActivity;
use App\Models\ContactLeadDublicate;
 use App\Models\ContactLeadStatus;
use App\Models\ContactLeadSubStatus;
use App\Models\ContactLeadType;
 use Carbon\Carbon;
use App\Models\Contact;
class CampaginController extends Controller
{

    

    public function GetAllCampagin(Request $request){
        //  try{
        $validator = Validator::make($request->all(), [
            'token' => 'required|string',
    
        ]);
        if ($validator->fails()) {
            return ResponseApi::badMethodErrorResponse($validator->errors()->all(), "Validator Errors", 400);
        }
        
        
        $campagin = Campagin::all();
        if (!empty($campagin[0]->id)) {
            foreach ($campagin as $dep) {
                $array_reponse[] = [
                    'id'=>$dep->id.'',
                    'campagin_name' => $dep->campagin_name,

                ];
            }
            return ResponseApi::acceptedResponseApi($array_reponse, "success", 201);

        } else {
            return ResponseApi::notFoundResponse(['message' => "Empty Campagin"], "Empty", 200);

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
     * @param  \App\Models\Campagin  $campagin
     * @return \Illuminate\Http\Response
     */
    public function show(Campagin $campagin)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Campagin  $campagin
     * @return \Illuminate\Http\Response
     */
    public function edit(Campagin $campagin)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Campagin  $campagin
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Campagin $campagin)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Campagin  $campagin
     * @return \Illuminate\Http\Response
     */
    public function destroy(Campagin $campagin)
    {
        //
    }
}
