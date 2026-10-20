<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReportSeniorEditsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('report_senior_edits', function (Blueprint $table) {
            $table->bigIncrements('id');
            
            $table->bigInteger('report_id')->unsigned();
            $table->foreign('report_id')->references('id')->on('reports');

            $table->bigInteger('senior_edit_id')->unsigned();
            $table->foreign('senior_edit_id')->references('id')->on('users');

          
            $table->text('comment');

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
        Schema::dropIfExists('report_senior_edits');
    }
}
