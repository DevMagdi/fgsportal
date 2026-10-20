<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateIncentiveRequestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('incentive_requests', function (Blueprint $table) {
            $table->bigIncrements('id');
            
            $table->text('incentive_comment')->nullable();
            $table->integer('incentive_amount')->nullable();

            $table->bigInteger('user_creator_id')->unsigned();
            $table->foreign('user_creator_id')->references('id')->on('users');

            $table->bigInteger('user_to_id')->unsigned();
            $table->foreign('user_to_id')->references('id')->on('users');

            $table->bigInteger('incentive_status_id')->unsigned();
            $table->foreign('incentive_status_id')->references('id')->on('incentive_statuses');

            $table->bigInteger('manager_approve_id')->unsigned();
            $table->foreign('manager_approve_id')->references('id')->on('users');
            
            $table->bigInteger('process_id')->unsigned();
            $table->foreign('process_id')->references('id')->on('processes');

            $table->date('incentive_date',12);

            
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
        Schema::dropIfExists('incentive_requests');
    }
}
