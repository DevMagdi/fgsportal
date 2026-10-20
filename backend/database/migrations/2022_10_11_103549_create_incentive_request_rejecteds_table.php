<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateIncentiveRequestRejectedsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('incentive_request_rejecteds', function (Blueprint $table) {
            $table->bigIncrements('id');
            
           
            $table->bigInteger('rejected_by_id')->unsigned();
            $table->foreign('rejected_by_id')->references('id')->on('users');

            $table->text('reject_reason')->nullable();

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
        Schema::dropIfExists('incentive_request_rejecteds');
    }
}
