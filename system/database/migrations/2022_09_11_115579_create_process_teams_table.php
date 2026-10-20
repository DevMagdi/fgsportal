<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProcessTeamsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('process_teams', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('user_creator_id')->unsigned();
           $table->foreign('user_creator_id')->references('id')->on('users');

           $table->bigInteger('project_team_id')->unsigned();
           $table->foreign('project_team_id')->references('id')->on('project_teams');
 
           $table->bigInteger('process_id')->unsigned();
           $table->foreign('process_id')->references('id')->on('processes');
 
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
        Schema::dropIfExists('process_teams');
    }
}
