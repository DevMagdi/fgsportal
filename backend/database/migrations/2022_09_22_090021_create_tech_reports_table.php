<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTechReportsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    { 
        Schema::create('tech_reports', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->decimal('duration',5,2);
            
            $table->bigInteger('tech_report_type_id')->unsigned();
            $table->foreign('tech_report_type_id')->references('id')->on('tech_report_types');

            $table->bigInteger('report_status_id')->unsigned();
            $table->foreign('report_status_id')->references('id')->on('report_statuses');

            $table->bigInteger('manager_approve_id')->unsigned();
            $table->foreign('manager_approve_id')->references('id')->on('users');
            
            $table->bigInteger('user_creator_id')->unsigned();
            $table->foreign('user_creator_id')->references('id')->on('users');

            $table->text('tech_report_details');
            $table->date('tech_report_date',12);

            
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
        Schema::dropIfExists('tech_reports');
    }
}
