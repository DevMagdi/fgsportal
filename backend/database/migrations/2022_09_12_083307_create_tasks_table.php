<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTasksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('task_title',100);
            $table->integer('task_progress')->length(10)->default(0);
            $table->text('task_description');
            $table->integer('task_hours')->length(10)->default(0);
          
            $table->bigInteger('user_creator_id')->unsigned();
            $table->foreign('user_creator_id')->references('id')->on('users');

            $table->bigInteger('task_status_id')->unsigned();
            $table->foreign('task_status_id')->references('id')->on('task_statuses');

            $table->bigInteger('task_type_id')->unsigned();
            $table->foreign('task_type_id')->references('id')->on('task_types');

            $table->bigInteger('process_id')->unsigned();
            $table->foreign('process_id')->references('id')->on('processes');

            $table->date('task_start_date',12);
            $table->date('task_end_date',12);
            
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
        Schema::dropIfExists('tasks');
    }
}
