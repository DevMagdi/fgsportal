<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCompanyIdToUsersTable extends Migration
{
    /**
     * Link every user to the company (tenant) whose module entitlements apply.
     * Nullable so existing rows keep working; the seeder back-fills the default company.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('users') || Schema::hasColumn('users', 'company_id')) {
            return;
        }

        Schema::table('users', function (Blueprint $table) {
            // Index only (no hard foreign key) to stay portable across the
            // legacy MySQL schema and lightweight SQLite test databases.
            $table->bigInteger('company_id')->unsigned()->nullable()->after('id')->index();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (Schema::hasTable('users') && Schema::hasColumn('users', 'company_id')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('company_id');
            });
        }
    }
}
