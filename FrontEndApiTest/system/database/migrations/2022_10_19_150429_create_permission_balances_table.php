<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePermissionBalancesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {         

        Schema::create('permission_balances', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->decimal('monthly_balance',5,2);
            $table->decimal('bereavement',5,2);
            $table->decimal('marriage',5,2);

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
        Schema::dropIfExists('permission_balances');
    }
}
