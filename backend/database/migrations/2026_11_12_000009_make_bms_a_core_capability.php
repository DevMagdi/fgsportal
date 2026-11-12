<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * BRD section 2: the old optional-module catalogue is retired from the user
 * journey. BMS is the product itself, so it becomes a core module: no company
 * can be locked out of the workspace by a legacy entitlement row.
 *
 * Non-destructive and reversible: only the `is_core` flag is touched. The
 * catalogue row and every company_modules row are preserved.
 */
class MakeBmsACoreCapability extends Migration
{
    public function up()
    {
        if (Schema::hasTable('modules')) {
            DB::table('modules')->where('slug', 'bms')->update(['is_core' => true]);
        }
    }

    public function down()
    {
        if (Schema::hasTable('modules')) {
            DB::table('modules')->where('slug', 'bms')->update(['is_core' => false]);
        }
    }
}
