<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTaskTeamsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('task_teams', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('user_creator_id')->unsigned();
           $table->foreign('user_creator_id')->references('id')->on('users');

           $table->bigInteger('process_team_id')->unsigned();
           $table->foreign('process_team_id')->references('id')->on('process_teams');
 
           $table->bigInteger('task_id')->unsigned();
           $table->foreign('task_id')->references('id')->on('tasks');

           $table->bigInteger('task_structure_id')->unsigned();
           $table->foreign('task_structure_id')->references('id')->on('task_structures');

 
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
        Schema::dropIfExists('task_teams');
    }
}
