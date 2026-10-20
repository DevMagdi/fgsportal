<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAnnualRequestActionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('annual_request_actions', function (Blueprint $table) {
            $table->bigIncrements('id');
        
            $table->text('comment');
        
            $table->bigInteger('annual_request_id')->unsigned();
            $table->foreign('annual_request_id')->references('id')->on('annual_requests');
            
            $table->bigInteger('annual_status_id')->unsigned();
            $table->foreign('annual_status_id')->references('id')->on('annual_statuses');
            
 
            $table->bigInteger('assign_to_id')->unsigned();
            $table->foreign('assign_to_id')->references('id')->on('users');
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
        Schema::dropIfExists('annual_request_actions');
    }
}
