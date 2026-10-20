<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateModulesTable extends Migration
{
    /**
     * Catalogue of sellable modules.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('modules')) {
            return;
        }

        Schema::create('modules', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name', 100);
            $table->string('slug', 50)->unique();
            $table->text('description')->nullable();
            $table->boolean('is_core')->default(false);
            $table->boolean('is_active')->default(true); // globally available for selling
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
        Schema::dropIfExists('modules');
    }
}
