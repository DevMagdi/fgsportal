<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('username',50)->unique();
            $table->string('firstname',20);
            $table->string('lastname',20);
            $table->string('email',50)->unique();
            $table->string('password');
            $table->string('photoURL',30)->nullable();
            $table->bigInteger('user_creator_id')->unsigned()->nullable();
            $table->foreign('user_creator_id')->references('id')->on('users');
            $table->string('gender',10)->nullable();
            $table->text('mobileNumber')->nullable();
            $table->integer('active',2)->default(1);
            $table->integer('canAddPreviousReports',2)->default(0);
            $table->timestamps('canAddPreviousReportsDate');
            $table->string('gender',10)->nullable();
            $table->bigInteger('user_details_id')->unsigned()->nullable();
            $table->foreign('user_details_id')->references('id')->on('user_details');
            $table->text('token')->nullable();
            $table->bigInteger('work_degrees_id')->unsigned()->nullable();
            $table->foreign('work_degrees_id')->references('id')->on('work_degrees');
            $table->bigInteger('sub_departments_id')->unsigned()->nullable();
            $table->foreign('sub_departments_id')->references('id')->on('sub_departments');
            $table->boolean('refreshRequired')->default(0);
            $table->bigInteger('branches_id')->unsigned()->nullable();
            $table->foreign('branches_id')->references('id')->on('branches');
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
        Schema::dropIfExists('users');
    }
}
