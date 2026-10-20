<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLicensesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {  
        Schema::create('licenses', function (Blueprint $table) {
            $table->bigIncrements('id');
            
            $table->text('license_comment')->nullable();
            $table->text('license_number')->nullable();
            $table->bigInteger('user_creator_id')->unsigned();
            $table->foreign('user_creator_id')->references('id')->on('users');

            $table->bigInteger('license_type_id')->unsigned();
            $table->foreign('license_type_id')->references('id')->on('license_types');

            $table->bigInteger('license_status_id')->unsigned();
            $table->foreign('license_status_id')->references('id')->on('license_statuses');

            $table->bigInteger('partner_id')->unsigned();
            $table->foreign('partner_id')->references('id')->on('partners');

            $table->bigInteger('product_id')->unsigned();
            $table->foreign('product_id')->references('id')->on('products');


            $table->date('license_start_date',12);
            $table->date('license_end_date',12);
            
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
        Schema::dropIfExists('licenses');
    }
}
