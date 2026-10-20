<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDeveloperTicketActionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {Schema::dropIfExists('developer_ticket_actions');
        Schema::create('developer_ticket_actions', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->bigInteger('ticket_id')->unsigned()->nullable();
            $table->foreign('ticket_id')->references('id')->on('tickets');
 

            $table->bigInteger('user_creator_id')->unsigned()->nullable();
            $table->foreign('user_creator_id')->references('id')->on('users');

            $table->bigInteger('contact_account_id')->unsigned()->nullable();
            $table->foreign('contact_account_id')->references('id')->on('client_accounts');
 
 

            $table->bigInteger('ticket_status_id')->unsigned();
            $table->foreign('ticket_status_id')->references('id')->on('ticket_statuses');

            $table->text('title')->nullable();
            $table->text('comment')->nullable();
            $table->boolean('visibility')->default(true);
           
 
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
        Schema::dropIfExists('developer_ticket_actions');
    }
}
