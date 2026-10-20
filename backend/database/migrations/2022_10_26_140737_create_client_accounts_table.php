<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClientAccountsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('client_accounts', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('fullname',50)->unique();
           
            $table->string('email',50)->unique();
            $table->string('password');

            
            $table->text('phone')->nullable();

            
            $table->text('token')->nullable();
         
            $table->boolean('refreshRequired')->default(0);
            $table->boolean('active')->default(1);
            $table->boolean('primary')->default(0);

            $table->bigInteger('user_creator_id')->unsigned()->nullable();
            $table->foreign('user_creator_id')->references('id')->on('users');

            $table->bigInteger('client_account_id')->unsigned()->nullable();
            $table->foreign('client_account_id')->references('id')->on('client_accounts');

            $table->bigInteger('partner_id')->unsigned();
            $table->foreign('partner_id')->references('id')->on('partners');

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
        Schema::dropIfExists('client_accounts');
    }
}
