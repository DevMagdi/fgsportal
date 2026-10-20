<?php

namespace App\Http\Controllers\Settings\Announce;

use App\Http\Controllers\Controller;
  use Illuminate\Http\Request;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\AnnounceClient;
 
class AnnounceClientController extends Controller
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
     * @param  \App\Models\AnnounceClient  $announceClient
     * @return \Illuminate\Http\Response
     */
    public function show(AnnounceClient $announceClient)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\AnnounceClient  $announceClient
     * @return \Illuminate\Http\Response
     */
    public function edit(AnnounceClient $announceClient)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\AnnounceClient  $announceClient
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, AnnounceClient $announceClient)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\AnnounceClient  $announceClient
     * @return \Illuminate\Http\Response
     */
    public function destroy(AnnounceClient $announceClient)
    {
        //
    }
}
