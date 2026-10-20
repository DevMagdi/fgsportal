<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserSalaryHistoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */

    
    public function up()
    {
        Schema::create('user_salary_histories', function (Blueprint $table) {
            $table->bigIncrements('id');
            
            $table->string('salary',20);

            $table->bigInteger('user_creator_id')->unsigned();
            $table->foreign('user_creator_id')->references('id')->on('users');
 
            $table->bigInteger('salary_id')->unsigned();
            $table->foreign('salary_id')->references('id')->on('user_salaries');
          
            $table->date('start_date',12);
            $table->date('end_date',12);

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
        Schema::dropIfExists('user_salary_histories');
    }
}
