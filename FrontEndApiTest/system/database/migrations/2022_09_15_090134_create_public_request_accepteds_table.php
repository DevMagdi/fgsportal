<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePublicRequestAcceptedsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {  
        Schema::dropIfExists('public_request_accepteds');
        Schema::create('public_request_accepteds', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->text('comment')->nullable();

            $table->bigInteger('public_request_status_id')->unsigned();
            $table->foreign('public_request_status_id')->references('id')->on('public_request_statuses');

            $table->bigInteger('assign_to_id')->unsigned();
            $table->foreign('assign_to_id')->references('id')->on('users');
            
            $table->bigInteger('public_request_id')->unsigned();
            $table->foreign('public_request_id')->references('id')->on('public_requests');

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
        Schema::dropIfExists('public_request_accepteds');
    }
}
