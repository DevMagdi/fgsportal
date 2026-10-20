<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTicketsTableV2 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('tickets')) {
            return;
        }

        Schema::create('tickets', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->string('title');

            $table->bigInteger('ticket_type_id')->unsigned()->nullable();
            $table->foreign('ticket_type_id')->references('id')->on('ticket_types');

            $table->bigInteger('ticket_priority_id')->unsigned();
            $table->foreign('ticket_priority_id')->references('id')->on('ticket_priorities');

            $table->bigInteger('contract_support_id')->unsigned();
            $table->foreign('contract_support_id')->references('id')->on('contract_supports');

            $table->bigInteger('contact_account_id')->unsigned()->nullable();
            $table->foreign('contact_account_id')->references('id')->on('client_accounts');
            
            $table->bigInteger('user_creator_id')->unsigned()->nullable();
            $table->foreign('user_creator_id')->references('id')->on('users');

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
        Schema::dropIfExists('tickets');
    }
}
