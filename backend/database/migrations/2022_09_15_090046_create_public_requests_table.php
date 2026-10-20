<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePublicRequestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('public_requests', function (Blueprint $table) {
            $table->bigIncrements('id');
            
            $table->text('public_request_details')->nullable();
            $table->text('public_request_title')->nullable();
            $table->integer('public_request_amount')->nullable();

            $table->bigInteger('user_creator_id')->unsigned();
            $table->foreign('user_creator_id')->references('id')->on('users');

            $table->bigInteger('sub_departments_id')->unsigned()->nullable();
            $table->foreign('sub_departments_id')->references('id')->on('sub_departments');

            $table->bigInteger('public_request_status_id')->unsigned();
            $table->foreign('public_request_status_id')->references('id')->on('public_request_statuses');

            $table->bigInteger('manager_approve_id')->unsigned();
            $table->foreign('manager_approve_id')->references('id')->on('users');

            
            $table->bigInteger('process_id')->unsigned();
            $table->foreign('process_id')->references('id')->on('processes');

          
            
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
        Schema::dropIfExists('public_requests');
    }
}
