<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateIncentiveRequestApprovedsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('incentive_request_approveds', function (Blueprint $table) {
            
            $table->bigIncrements('id');
            
            $table->text('comment')->nullable();

            $table->bigInteger('incentive_status_id')->unsigned();
            $table->foreign('incentive_status_id')->references('id')->on('incentive_statuses');

            $table->bigInteger('assign_to_id')->unsigned();
            $table->foreign('assign_to_id')->references('id')->on('users');

            
            $table->bigInteger('incentive_id')->unsigned();
            $table->foreign('incentive_id')->references('id')->on('incentive_requests');

            
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
        Schema::dropIfExists('incentive_request_approveds');
    }
}
