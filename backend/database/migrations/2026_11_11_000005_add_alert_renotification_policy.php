<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAlertRenotificationPolicy extends Migration
{
    public function up(): void
    {
        Schema::table('bms_alerts', function (Blueprint $table) {
            $table->timestamp('last_notified_at')->nullable()->after('read_at');
            $table->unsignedInteger('occurrences')->default(0)->after('last_notified_at');
            $table->timestamp('resolved_at')->nullable()->after('occurrences');
            $table->index(['user_id', 'read_at'], 'bms_alerts_user_read_index');
        });
    }

    public function down(): void
    {
        Schema::table('bms_alerts', function (Blueprint $table) {
            $table->dropIndex('bms_alerts_user_read_index');
            $table->dropColumn(['last_notified_at', 'occurrences', 'resolved_at']);
        });
    }
}
