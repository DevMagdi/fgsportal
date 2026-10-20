<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserSalariesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */

    
    public function up()
    {
        Schema::create('user_salaries', function (Blueprint $table) {
            $table->bigIncrements('id');
            
            $table->string('salary',20);
            $table->string('last_payment',20)->nullable();

            $table->bigInteger('user_creator_id')->unsigned();
            $table->foreign('user_creator_id')->references('id')->on('users');
 
            $table->bigInteger('assign_to_id')->unsigned();
            $table->foreign('assign_to_id')->references('id')->on('users');
          
            $table->date('start_date',12);

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
        Schema::dropIfExists('user_salaries');
    }
}
