<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePartnersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {        
           Schema::create('partners', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('partner_name',50)->unique();
            $table->text('partner_address')->nullable();
            $table->text('partner_description')->nullable();
            $table->string('partner_photoURL',30)->nullable();
            $table->bigInteger('user_creator_id')->unsigned()->nullable();
            $table->foreign('user_creator_id')->references('id')->on('users');
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
        Schema::dropIfExists('partners');
    }
}
