<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AddBmsMeetingSequence extends Migration
{
    public function up()
    {
        if (!Schema::hasColumn('bms_meetings', 'sequence')) {
            Schema::table('bms_meetings', function (Blueprint $table) {
                $table->unsignedInteger('sequence')->default(0);
            });
        }
    }

    public function down()
    {
        if (!Schema::hasColumn('bms_meetings', 'sequence')) {
            return;
        }
        if (DB::getDriverName() === 'sqlite') {
            DB::statement('ALTER TABLE bms_meetings DROP COLUMN sequence');
            return;
        }
        Schema::table('bms_meetings', function (Blueprint $table) {
            $table->dropColumn('sequence');
        });
    }
}
