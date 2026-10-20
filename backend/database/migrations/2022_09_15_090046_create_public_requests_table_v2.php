<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Second version of public_requests matching App\Models\PublicRequest:
 * adds public_request_title and the sub_departments_id relation (the earlier
 * public_request_type_id relation points at a table that never shipped, so
 * the model uses sub_departments_id instead). Columns are only added when
 * missing — existing request rows are never touched.
 */
class CreatePublicRequestsTableV2 extends Migration
{
    public function up()
    {
        if (!Schema::hasTable('public_requests')) {
            Schema::create('public_requests', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->text('public_request_details')->nullable();
                $table->integer('public_request_amount')->nullable();
                $table->bigInteger('user_creator_id')->unsigned();
                $table->foreign('user_creator_id')->references('id')->on('users');
                $table->bigInteger('public_request_status_id')->unsigned();
                $table->foreign('public_request_status_id')->references('id')->on('public_request_statuses');
                $table->bigInteger('manager_approve_id')->unsigned()->nullable();
                $table->foreign('manager_approve_id')->references('id')->on('users');
                $table->bigInteger('process_id')->unsigned()->nullable();
                $table->foreign('process_id')->references('id')->on('processes');
                $table->text('public_request_title')->nullable();
                $table->bigInteger('sub_departments_id')->unsigned()->nullable();
                $table->foreign('sub_departments_id')->references('id')->on('sub_departments');
                $table->softDeletes();
                $table->timestamps();
            });
            return;
        }

        Schema::table('public_requests', function (Blueprint $table) {
            if (!Schema::hasColumn('public_requests', 'public_request_title')) {
                $table->text('public_request_title')->nullable();
            }
            if (!Schema::hasColumn('public_requests', 'sub_departments_id')) {
                $table->bigInteger('sub_departments_id')->unsigned()->nullable();
                $table->foreign('sub_departments_id')->references('id')->on('sub_departments');
            }
        });
    }

    public function down()
    {
        Schema::dropIfExists('public_requests');
    }
}
