<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateManagerTicketUpdatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('manager_ticket_updates', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->bigInteger('ticket_id')->unsigned()->nullable();
            $table->foreign('ticket_id')->references('id')->on('tickets');

            $table->bigInteger('ticket_type_id')->unsigned()->nullable();
            $table->foreign('ticket_type_id')->references('id')->on('ticket_types');

            $table->bigInteger('ticket_priority_id')->unsigned();
            $table->foreign('ticket_priority_id')->references('id')->on('ticket_priorities');

            $table->bigInteger('user_creator_id')->unsigned()->nullable();
            $table->foreign('user_creator_id')->references('id')->on('users');

            $table->bigInteger('project_manager_id')->unsigned()->nullable();
            $table->foreign('project_manager_id')->references('id')->on('users');

            $table->bigInteger('developer_id')->unsigned()->nullable();
            $table->foreign('developer_id')->references('id')->on('users');

            $table->bigInteger('ticket_status_id')->unsigned();
            $table->foreign('ticket_status_id')->references('id')->on('ticket_statuses');

            $table->text('notes');
           
 
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
        Schema::dropIfExists('manager_ticket_updates');
    }
}
