<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * BRD §4 (frontend administration): the metadata the administration screens
 * need but the legacy tables never carried — employee manager, product
 * description/owner, and auditable KPI metadata.
 *
 * Additive and reversible: no existing column, row or table is touched.
 */
class AddBmsAdminMetadata extends Migration
{
    public function up()
    {
        if (Schema::hasTable('users') && !Schema::hasColumn('users', 'manager_id')) {
            Schema::table('users', function (Blueprint $table) {
                $table->foreignId('manager_id')->nullable()->after('sub_departments_id');
            });
        }
        if (Schema::hasTable('products')) {
            Schema::table('products', function (Blueprint $table) {
                if (!Schema::hasColumn('products', 'description')) {
                    $table->text('description')->nullable()->after('product_name');
                }
                if (!Schema::hasColumn('products', 'owner_id')) {
                    $table->foreignId('owner_id')->nullable()->after('description');
                }
            });
        }
        if (Schema::hasTable('bms_unit_kpis') && !Schema::hasColumn('bms_unit_kpis', 'frequency')) {
            Schema::table('bms_unit_kpis', function (Blueprint $table) {
                $table->string('frequency', 20)->default('monthly')->after('unit_label');
            });
        }
    }

    public function down()
    {
        foreach ([
            ['users', ['manager_id']],
            ['products', ['description', 'owner_id']],
            ['bms_unit_kpis', ['frequency']],
        ] as [$table, $columns]) {
            if (!Schema::hasTable($table)) continue;
            Schema::table($table, function (Blueprint $blueprint) use ($table, $columns) {
                foreach ($columns as $column) {
                    if (Schema::hasColumn($table, $column)) $blueprint->dropColumn($column);
                }
            });
        }
    }
}
