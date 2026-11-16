<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/** Grant compensation access to HR, without widening directory access in other roles. */
class AddBmsBonusAbilities extends Migration
{
    private const LEDGER = 'bms_bonus_ability_grants';
    private const ABILITIES = ['bonuses.view', 'bonuses.manage'];

    public function up(): void
    {
        if (!Schema::hasTable(self::LEDGER)) {
            Schema::create(self::LEDGER, function (Blueprint $table) {
                $table->unsignedBigInteger('role_id');
                $table->string('ability', 100);
                $table->primary(['role_id', 'ability']);
            });
        }
        if (!Schema::hasTable('bms_roles')) return;

        DB::transaction(function () {
            $role = DB::table('bms_roles')->where('slug', 'hr')->lockForUpdate()->first();
            if (!$role) return;
            $current = $this->decode($role->abilities);
            if (in_array('*', $current, true)) return;

            $missing = array_values(array_diff(self::ABILITIES, $current));
            if ($missing === []) return;
            DB::table('bms_roles')->where('id', $role->id)->update([
                'abilities' => json_encode(array_merge($current, $missing)),
                'updated_at' => now(),
            ]);
            foreach ($missing as $ability) {
                DB::table(self::LEDGER)->insertOrIgnore(['role_id' => $role->id, 'ability' => $ability]);
            }
        });
    }

    public function down(): void
    {
        if (!Schema::hasTable(self::LEDGER)) return;
        if (Schema::hasTable('bms_roles')) {
            DB::transaction(function () {
                foreach (DB::table(self::LEDGER)->get()->groupBy('role_id') as $roleId => $grants) {
                    // Match the original role, not a replacement that later reused its slug.
                    $role = DB::table('bms_roles')->where('id', $roleId)->lockForUpdate()->first();
                    if (!$role) continue;
                    $current = $this->decode($role->abilities);
                    if (in_array('*', $current, true)) continue;
                    $remaining = array_values(array_diff($current, $grants->pluck('ability')->all()));
                    if ($remaining !== $current) {
                        DB::table('bms_roles')->where('id', $role->id)->update([
                            'abilities' => json_encode($remaining),
                            'updated_at' => now(),
                        ]);
                    }
                }
            });
        }
        Schema::dropIfExists(self::LEDGER);
    }

    private function decode($abilities): array
    {
        $decoded = is_string($abilities) ? json_decode($abilities, true) : $abilities;
        return is_array($decoded) ? array_values($decoded) : [];
    }
}
