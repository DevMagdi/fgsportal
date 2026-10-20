<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAnnualRequestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('annual_requests', function (Blueprint $table) {
            $table->bigIncrements('id');
        
            $table->text('reason');
            $table->dateTime('from');
            $table->dateTime('to');
            $table->bigInteger('annual_type_id')->unsigned();
            $table->foreign('annual_type_id')->references('id')->on('annual_types');

            $table->bigInteger('annual_status_id')->unsigned();
            $table->foreign('annual_status_id')->references('id')->on('annual_statuses');
            
            $table->bigInteger('manager_approve_id')->unsigned();
            $table->foreign('manager_approve_id')->references('id')->on('users');
 
            $table->bigInteger('user_id')->unsigned();
            $table->foreign('user_id')->references('id')->on('users');
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
        Schema::dropIfExists('annual_requests');
    }
}
