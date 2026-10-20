<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClientTicketUpdatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    { 
        Schema::create('client_ticket_updates', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->string('title');

            $table->bigInteger('ticket_type_id')->unsigned()->nullable();
            $table->foreign('ticket_type_id')->references('id')->on('ticket_types');

            $table->bigInteger('ticket_priority_id')->unsigned();
            $table->foreign('ticket_priority_id')->references('id')->on('ticket_priorities');

             
            $table->bigInteger('contact_account_id')->unsigned()->nullable();
            $table->foreign('contact_account_id')->references('id')->on('client_accounts');
            
            $table->bigInteger('ticket_id')->unsigned()->nullable();
            $table->foreign('ticket_id')->references('id')->on('tickets');
           
            $table->bigInteger('ticket_status_id')->unsigned();
            $table->foreign('ticket_status_id')->references('id')->on('ticket_statuses');

            $table->text('notes');
            $table->text('attach_ticket_array')->nullable();
            
 
            $table->softDeletes(); // <-- This will add a deleted_at field
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    
    protected $casts=[
        'attach_ticket_array'=>'array',
     ];
    public function down()
    {
        Schema::dropIfExists('client_ticket_updates');
    }
}
