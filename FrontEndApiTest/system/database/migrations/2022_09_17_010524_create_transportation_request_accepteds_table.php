<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTransportationRequestAcceptedsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transportation_request_accepteds', function (Blueprint $table) {
            $table->bigIncrements('id');
            
            $table->bigInteger('request_status_id')->unsigned();
            $table->foreign('request_status_id')->references('id')->on('transportation_request_statuses');

            $table->bigInteger('assign_to_id')->unsigned();
            $table->foreign('assign_to_id')->references('id')->on('users');

            
            $table->bigInteger('request_id')->unsigned();
            $table->foreign('request_id')->references('id')->on('transportation_requests');

          
            
            $table->softDeletes(); // <-- This will add a deleted_at field
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('transportation_request_accepteds');
    }
}
