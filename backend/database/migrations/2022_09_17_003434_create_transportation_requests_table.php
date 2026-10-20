<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTransportationRequestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transportation_requests', function (Blueprint $table) {
            $table->bigIncrements('id');
            
            $table->text('transportation_request_comment')->nullable();
            $table->text('transportation_request_from')->nullable();
            $table->text('transportation_request_purpose')->nullable();
            $table->text('transportation_request_to')->nullable();
            $table->integer('transportation_request_amount')->nullable();

            $table->bigInteger('user_creator_id')->unsigned();
            $table->foreign('user_creator_id')->references('id')->on('users');

            $table->bigInteger('transportation_request_status_id')->unsigned();
            $table->foreign('transportation_request_status_id')->references('id')->on('transportation_request_statuses');

            $table->bigInteger('manager_approve_id')->unsigned();
            $table->foreign('manager_approve_id')->references('id')->on('users');

            
            $table->bigInteger('process_id')->unsigned();
            $table->foreign('process_id')->references('id')->on('processes');

            $table->date('transportation_request_date',12);

            
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
        Schema::dropIfExists('transportation_requests');
    }
}
