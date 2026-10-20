<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserAnnualsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    { 
        Schema::create('user_annuals', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->decimal('pending_balance',5,2);
            $table->decimal('total_leave_balance',5,2);
            $table->decimal('monthly_balance_spend',5,2);
            $table->decimal('available_leave_balance',5,2);
            $table->decimal('discount_from_pending',5,2);

            $table->bigInteger('user_creator_id')->unsigned();
            $table->foreign('user_creator_id')->references('id')->on('users');
 
            $table->bigInteger('user_id')->unsigned();
            $table->foreign('user_id')->references('id')->on('users');
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
        Schema::dropIfExists('user_annuals');
    }
}
