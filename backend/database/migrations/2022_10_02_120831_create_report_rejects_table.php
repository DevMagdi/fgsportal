<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReportRejectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    { 
        Schema::create('report_rejects', function (Blueprint $table) {
            $table->bigIncrements('id');
            
            $table->bigInteger('report_id')->unsigned();
            $table->foreign('report_id')->references('id')->on('reports');

            $table->bigInteger('manager_reject_id')->unsigned();
            $table->foreign('manager_reject_id')->references('id')->on('users');

            $table->text('reject_reason');
            $table->date('reject_date',12);

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
        Schema::dropIfExists('report_rejects');
    }
}
