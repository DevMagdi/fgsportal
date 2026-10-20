<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Second version of process_attaches: adds the optional task_id relation the
 * App\Models\ProcessAttach model fills. Adds the column only when missing and
 * never drops existing attachments.
 */
class CreateProcessAttachesTableV2 extends Migration
{
    public function up()
    {
        if (!Schema::hasTable('process_attaches')) {
            Schema::create('process_attaches', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->string('process_attach', 50);
                $table->bigInteger('user_creator_id')->unsigned();
                $table->foreign('user_creator_id')->references('id')->on('users');
                $table->bigInteger('process_id')->unsigned();
                $table->foreign('process_id')->references('id')->on('processes');
                $table->bigInteger('task_id')->unsigned()->nullable();
                $table->foreign('task_id')->references('id')->on('tasks');
                $table->softDeletes();
                $table->timestamps();
            });
            return;
        }

        if (!Schema::hasColumn('process_attaches', 'task_id')) {
            Schema::table('process_attaches', function (Blueprint $table) {
                $table->bigInteger('task_id')->unsigned()->nullable();
                $table->foreign('task_id')->references('id')->on('tasks');
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('process_attaches');
    }
}
