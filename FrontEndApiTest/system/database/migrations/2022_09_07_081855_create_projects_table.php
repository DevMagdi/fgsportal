<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProjectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {      
            Schema::create('projects', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('project_title',100);
            $table->integer('project_progress')->length(10)->default(0);
            $table->text('project_description');
            $table->integer('project_duration')->length(10)->default(0);
            $table->integer('project_budget')->length(10)->default(0);
            $table->integer('project_actual_cost')->length(10)->default(0);
            $table->integer('idelHours')->length(10)->default(0);

            $table->bigInteger('user_creator_id')->unsigned();
            $table->foreign('user_creator_id')->references('id')->on('users');
            
            $table->bigInteger('project_type_id')->unsigned();
            $table->foreign('project_type_id')->references('id')->on('project_types');

            $table->bigInteger('project_convert_id')->unsigned()->nullable();
            $table->foreign('project_convert_id')->references('id')->on('projects');

            $table->bigInteger('project_status_id')->unsigned();
            $table->foreign('project_status_id')->references('id')->on('project_statuses');

            $table->bigInteger('partner_id')->unsigned();
            $table->foreign('partner_id')->references('id')->on('partners');

            $table->date('project_start_date',12);
            $table->date('project_end_date',12);
            
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
        Schema::dropIfExists('projects');
    }
}
