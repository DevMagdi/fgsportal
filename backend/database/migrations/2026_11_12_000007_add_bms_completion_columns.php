<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * P1-2 phase progress and P1-12 lead-to-opportunity carry-over.
 * Additive only: no existing row is changed or removed.
 */
class AddBmsCompletionColumns extends Migration
{
    public function up(): void
    {
        Schema::table('product_phases', function (Blueprint $table) {
            $table->unsignedTinyInteger('progress')->default(0)->after('status');
        });
        // Existing completed phases are 100% so reports stay consistent.
        DB::table('product_phases')->where('status', 'completed')->update(['progress' => 100]);

        Schema::table('bms_opportunities', function (Blueprint $table) {
            $table->unsignedBigInteger('bms_lead_id')->nullable()->index('bms_opps_lead_index');
            $table->string('sector')->nullable();
            $table->text('notes')->nullable();
            $table->string('contact_name')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_phone')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('bms_opportunities', function (Blueprint $table) {
            $table->dropIndex('bms_opps_lead_index');
        });
        $this->dropColumns('bms_opportunities', [
            'bms_lead_id', 'sector', 'notes', 'contact_name', 'contact_email', 'contact_phone',
        ]);
        $this->dropColumns('product_phases', ['progress']);
    }

    /** Laravel 8 cannot drop SQLite columns without doctrine/dbal; SQLite 3.35+ can natively. */
    private function dropColumns(string $table, array $columns): void
    {
        if (DB::connection()->getDriverName() === 'sqlite') {
            foreach ($columns as $column) {
                DB::statement('ALTER TABLE '.$table.' DROP COLUMN '.$column);
            }
            return;
        }
        Schema::table($table, function (Blueprint $blueprint) use ($columns) {
            $blueprint->dropColumn($columns);
        });
    }
}
