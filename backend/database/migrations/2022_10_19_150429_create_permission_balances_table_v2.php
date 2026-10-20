<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Second version of permission_balances: adds the leave-balance columns the
 * App\Models\PermissionBalance model fills (bereavement, marriage, birth,
 * birth_f). Non-destructive — columns are only added when missing, and the
 * table is only created when the earlier migration did not run.
 */
class CreatePermissionBalancesTableV2 extends Migration
{
    public function up()
    {
        if (!Schema::hasTable('permission_balances')) {
            Schema::create('permission_balances', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->decimal('monthly_balance', 5, 2);
                $table->decimal('bereavement', 5, 2)->nullable();
                $table->decimal('marriage', 5, 2)->nullable();
                $table->decimal('birth', 5, 2)->nullable();
                $table->decimal('birth_f', 5, 2)->nullable();
                $table->softDeletes();
                $table->timestamps();
            });
            return;
        }

        Schema::table('permission_balances', function (Blueprint $table) {
            if (!Schema::hasColumn('permission_balances', 'bereavement')) {
                $table->decimal('bereavement', 5, 2)->nullable();
            }
            if (!Schema::hasColumn('permission_balances', 'marriage')) {
                $table->decimal('marriage', 5, 2)->nullable();
            }
            if (!Schema::hasColumn('permission_balances', 'birth')) {
                $table->decimal('birth', 5, 2)->nullable();
            }
            if (!Schema::hasColumn('permission_balances', 'birth_f')) {
                $table->decimal('birth_f', 5, 2)->nullable();
            }
        });
    }

    public function down()
    {
        Schema::dropIfExists('permission_balances');
    }
}
