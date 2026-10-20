<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDeveloperDivisionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('developer_divisions', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->bigInteger('sub_products_id')->unsigned();
            $table->foreign('sub_products_id')->references('id')->on('sub_products');
            $table->bigInteger('users_id')->unsigned();
            $table->foreign('users_id')->references('id')->on('users');
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
        Schema::dropIfExists('developer_divisions');
    }
}
