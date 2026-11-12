<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Forward-only repair for installations that already ran 000010 before its
 * later columns were appended (a deployed migration is never re-executed).
 * Every step is guarded, so a fresh install and an already-patched database
 * both end up in exactly the same schema.
 */
class AddMissingBmsKpiMetadata extends Migration
{
    public function up()
    {
        if (!Schema::hasTable('bms_unit_kpis')) {
            return;
        }
        $missing = [];
        foreach (['frequency', 'description', 'owner_id'] as $column) {
            if (!Schema::hasColumn('bms_unit_kpis', $column)) $missing[] = $column;
        }
        if (!$missing) {
            return;
        }
        Schema::table('bms_unit_kpis', function (Blueprint $table) use ($missing) {
            if (in_array('description', $missing, true)) $table->text('description')->nullable()->after('name');
            if (in_array('frequency', $missing, true)) $table->string('frequency', 20)->default('monthly');
            if (in_array('owner_id', $missing, true)) $table->unsignedBigInteger('owner_id')->nullable();
        });
    }

    public function down()
    {
        // Deliberately a no-op: these columns may pre-date this migration on some
        // installations, and dropping them would destroy KPI metadata.
    }
}
