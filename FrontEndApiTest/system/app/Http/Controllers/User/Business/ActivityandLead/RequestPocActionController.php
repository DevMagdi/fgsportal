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
use App\Models\RequestPOCStatus;
use App\Models\RequestPoc;
use App\Models\RequestPocAction;
 
class RequestPocActionController extends Controller
{
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
     * @param  \App\Models\RequestPocAction  $requestPocAction
     * @return \Illuminate\Http\Response
     */
    public function show(RequestPocAction $requestPocAction)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\RequestPocAction  $requestPocAction
     * @return \Illuminate\Http\Response
     */
    public function edit(RequestPocAction $requestPocAction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\RequestPocAction  $requestPocAction
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, RequestPocAction $requestPocAction)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\RequestPocAction  $requestPocAction
     * @return \Illuminate\Http\Response
     */
    public function destroy(RequestPocAction $requestPocAction)
    {
        //
    }
}
