<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLicenseHistoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('license_histories', function (Blueprint $table) {
            $table->bigIncrements('id');
            
            $table->bigInteger('user_creator_id')->unsigned();
            $table->foreign('user_creator_id')->references('id')->on('users');

            $table->bigInteger('license_type_id_old')->unsigned();
            $table->foreign('license_type_id_old')->references('id')->on('license_types');

            $table->bigInteger('license_status_id_old')->unsigned();
            $table->foreign('license_status_id_old')->references('id')->on('license_statuses');

             
            $table->bigInteger('license_id')->unsigned();
            $table->foreign('license_id')->references('id')->on('licenses');


            $table->date('license_start_date_old',12);
            $table->date('license_end_date_old',12);
            
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
        Schema::dropIfExists('license_histories');
    }
}
