<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClientAccountContractsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    { 
        Schema::create('client_account_contracts', function (Blueprint $table) {
            $table->bigIncrements('id');
             
            $table->bigInteger('client_account_id')->unsigned();
            $table->foreign('client_account_id')->references('id')->on('client_accounts');
   
            $table->bigInteger('contract_support_id')->unsigned();
            $table->foreign('contract_support_id')->references('id')->on('contract_supports');

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
        Schema::dropIfExists('client_account_contracts');
    }
}
