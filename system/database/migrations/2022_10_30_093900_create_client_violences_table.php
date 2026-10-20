<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClientViolencesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('client_violences', function (Blueprint $table) {
            $table->bigIncrements('id');
            
            $table->text('client_violence_message');

            $table->bigInteger('client_id')->unsigned();
            $table->foreign('client_id')->references('id')->on('client_accounts');
 

          
            
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
        Schema::dropIfExists('client_violences');
    }
}
