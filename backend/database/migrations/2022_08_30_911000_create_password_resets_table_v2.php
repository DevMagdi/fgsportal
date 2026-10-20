<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Duplicate of 2022_08_30_910000_create_password_resets_table.php with an
 * auto-increment id. The earlier migration already creates the table on a
 * fresh install, so this migration only creates it when missing (e.g. partial
 * legacy databases) and never drops an existing table — password reset
 * tokens would otherwise be destroyed.
 */
class CreatePasswordResetsTableV2 extends Migration
{
    public function up()
    {
        if (Schema::hasTable('password_resets')) {
            return;
        }

        Schema::create('password_resets', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('email')->index();
            $table->string('token');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('password_resets');
    }
}
