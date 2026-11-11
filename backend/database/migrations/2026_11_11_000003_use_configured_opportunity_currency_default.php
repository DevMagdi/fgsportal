<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class UseConfiguredOpportunityCurrencyDefault extends Migration
{
    public function up(): void
    {
        // SQLite cannot alter a column default without rebuilding user data.
        // The model/controller default covers SQLite; existing rows are untouched.
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE bms_opportunities MODIFY currency VARCHAR(10) NOT NULL DEFAULT 'SAR'");
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE bms_opportunities MODIFY currency VARCHAR(10) NOT NULL DEFAULT 'EGP'");
        }
    }
}
