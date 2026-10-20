<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserOpenToWorkTable extends Migration
{
    /**
     * The UserOpenToWork model (table user_open_to_work) predates the tracked
     * migrations and only existed in deployed databases, so fresh local
     * installs failed at login with "Table ... doesn't exist". This migration
     * recreates the table from the columns used by the model and
     * UserOpenToWorkController.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('user_open_to_work')) {
            return;
        }

        Schema::create('user_open_to_work', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->bigInteger('user_id')->unsigned();
            $table->foreign('user_id')->references('id')->on('users');

            $table->dateTime('from_date_time');
            $table->dateTime('to_date_time');
            $table->integer('active')->default(1);

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
        Schema::dropIfExists('user_open_to_work');
    }
}
