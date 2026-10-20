<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProjectCostManualsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('project_cost_manuals', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->decimal('cost_amount',10,2);

            $table->bigInteger('process_id')->unsigned()->nullable();
            $table->foreign('process_id')->references('id')->on('processes');

            $table->bigInteger('cost_type_id')->unsigned();
            $table->foreign('cost_type_id')->references('id')->on('cost_types');

            $table->bigInteger('user_id')->unsigned();
            $table->foreign('user_id')->references('id')->on('users');
            
            $table->bigInteger('user_creator_id')->unsigned();
            $table->foreign('user_creator_id')->references('id')->on('users');

            $table->text('comment');

            $table->date('project_cost_date',12);
 
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
        Schema::dropIfExists('project_cost_manuals');
    }
}
