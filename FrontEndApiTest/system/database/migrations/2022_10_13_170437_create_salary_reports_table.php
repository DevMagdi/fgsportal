<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSalaryReportsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('salary_reports', function (Blueprint $table) {
            $table->bigIncrements('id');
          
            $table->decimal('unpaidVacations',5,2);
            $table->decimal('officalVacations',5,2);
            $table->decimal('idleHoursCost',5,2);
            $table->decimal('actualWorkingCost',5,2);
            $table->decimal('monthWorkingHours',5,2);
            $table->decimal('totalByHours',5,2);
            $table->decimal('totalInEGP',5,2);
            
            $table->bigInteger('user_creator_id')->unsigned();
            $table->foreign('user_creator_id')->references('id')->on('users');
 
            $table->bigInteger('user_to_id')->unsigned();
            $table->foreign('user_to_id')->references('id')->on('users');
            
            $table->bigInteger('salary_status_id')->unsigned()->nullable();
            $table->foreign('salary_status_id')->references('id')->on('salary_report_statuses');

            $table->bigInteger('manager_approve_id')->unsigned()->nullable();
            $table->foreign('manager_approve_id')->references('id')->on('users');

            $table->bigInteger('last_user_action_id')->unsigned()->nullable();
            $table->foreign('last_user_action_id')->references('id')->on('users');
            
            $table->date('salary_report_date',12);

          
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
        Schema::dropIfExists('salary_reports');
    }
}
