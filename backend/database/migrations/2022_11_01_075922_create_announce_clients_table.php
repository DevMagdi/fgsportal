<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAnnounceClientsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('announce_clients', function (Blueprint $table) {
            $table->bigIncrements('id');


            $table->bigInteger('contact_account_id')->unsigned()->nullable();
            $table->foreign('contact_account_id')->references('id')->on('client_accounts');

            $table->bigInteger('announce_id')->unsigned()->nullable();
            $table->foreign('announce_id')->references('id')->on('announces');

            $table->boolean('seen')->default(false);
           
 
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
        Schema::dropIfExists('announce_clients');
    }
}
