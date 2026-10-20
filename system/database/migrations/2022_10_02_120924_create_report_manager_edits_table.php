<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReportManagerEditsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('report_manager_edits', function (Blueprint $table) {
            $table->bigIncrements('id');
            
            $table->bigInteger('report_id')->unsigned();
            $table->foreign('report_id')->references('id')->on('reports');

            $table->bigInteger('manager_edit_id')->unsigned();
            $table->foreign('manager_edit_id')->references('id')->on('users');

            $table->decimal('old_duration',5,2);
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
        Schema::dropIfExists('report_manager_edits');
    }
}
