<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Second version of public_request_accepteds: adds the nullable comment
 * column the App\Models\PublicRequestAccepted model fills. Non-destructive.
 */
class CreatePublicRequestAcceptedsTableV2 extends Migration
{
    public function up()
    {
        if (!Schema::hasTable('public_request_accepteds')) {
            Schema::create('public_request_accepteds', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->bigInteger('public_request_status_id')->unsigned();
                $table->foreign('public_request_status_id')->references('id')->on('public_request_statuses');
                $table->bigInteger('assign_to_id')->unsigned();
                $table->foreign('assign_to_id')->references('id')->on('users');
                $table->bigInteger('public_request_id')->unsigned();
                $table->foreign('public_request_id')->references('id')->on('public_requests');
                $table->text('comment')->nullable();
                $table->softDeletes();
                $table->timestamps();
            });
            return;
        }

        if (!Schema::hasColumn('public_request_accepteds', 'comment')) {
            Schema::table('public_request_accepteds', function (Blueprint $table) {
                $table->text('comment')->nullable();
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('public_request_accepteds');
    }
}
