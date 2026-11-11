<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddMeetingResponseTimestamps extends Migration
{
    public function up(): void
    {
        Schema::table('bms_meeting_attendees', function (Blueprint $table) {
            $table->timestamp('response_recorded_at')->nullable()->after('response_token');
        });
    }

    public function down(): void
    {
        Schema::table('bms_meeting_attendees', function (Blueprint $table) {
            $table->dropColumn('response_recorded_at');
        });
    }
}
