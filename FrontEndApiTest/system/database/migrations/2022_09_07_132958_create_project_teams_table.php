<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProjectTeamsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('project_teams', function (Blueprint $table) {
            $table->bigIncrements('id');
             $table->bigInteger('user_creator_id')->unsigned();
            $table->foreign('user_creator_id')->references('id')->on('users');

            $table->bigInteger('project_id')->unsigned();
            $table->foreign('project_id')->references('id')->on('projects');

            $table->bigInteger('user_team_id')->unsigned();
            $table->foreign('user_team_id')->references('id')->on('users');

            $table->bigInteger('project_structure_id')->unsigned();
            $table->foreign('project_structure_id')->references('id')->on('project_structures');

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
        Schema::dropIfExists('project_teams');
    }
}
