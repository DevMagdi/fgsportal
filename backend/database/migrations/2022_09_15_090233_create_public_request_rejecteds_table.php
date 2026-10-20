<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePublicRequestRejectedsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('public_request_rejecteds', function (Blueprint $table) {
            $table->bigIncrements('id');
            
           
            $table->bigInteger('rejected_by_id')->unsigned();
            $table->foreign('rejected_by_id')->references('id')->on('users');

            $table->text('reject_reason')->nullable();

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
        Schema::dropIfExists('public_request_rejecteds');
    }
}
