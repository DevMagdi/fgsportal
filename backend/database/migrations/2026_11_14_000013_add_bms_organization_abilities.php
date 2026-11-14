<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Stage B1 — abilities and role for the organization structure.
 *
 * New abilities: teams.view, teams.manage, teams.manage_own,
 * departments.view, departments.manage, projects.view, projects.link.
 * New role: team_lead (unit-scoped; it is deliberately absent from
 * BmsAccess::GLOBAL_SCOPE_ROLE_SLUGS).
 *
 * Abilities are MERGED into each existing role: an ability is appended only
 * when the role does not already hold it, and nothing a role already holds is
 * removed or reordered. Abilities customised on an installation are therefore
 * preserved. A role that does not exist is not created (except team_lead),
 * and a role carrying `*` is left alone because it already implies everything.
 *
 * `teams.manage` and `departments.manage` / `projects.link` at company level
 * are reachable through `*` (System Administrator), as `units.manage` is.
 *
 * Ownership ledger (`bms_ability_migration_grants`): every ability this
 * migration appends, and the team_lead role when this migration creates it, is
 * written to a small ledger table. `down()` reverts ONLY what the ledger lists,
 * so abilities granted by an administrator or by the seeder are never removed
 * by a rollback. The ledger is a single table without foreign keys, so its
 * creation is one atomic statement on MySQL.
 */
class AddBmsOrganizationAbilities extends Migration
{
    /** Role slug => abilities to add when missing. */
    private const GRANTS = [
        'executive' => ['teams.view', 'departments.view', 'projects.view'],
        'coordinator' => ['teams.view', 'departments.view', 'projects.view'],
        'operations' => ['teams.view', 'departments.view', 'projects.view'],
        'unit_director' => ['teams.view', 'teams.manage', 'departments.view', 'projects.view', 'projects.link'],
        'department_manager' => ['teams.view', 'departments.view', 'projects.view'],
        'pr_marketing' => ['teams.view', 'departments.view', 'projects.view'],
        'finance' => ['teams.view', 'departments.view', 'projects.view'],
        'hr' => ['teams.view', 'departments.view'],
        'it' => ['teams.view', 'departments.view', 'projects.view'],
        'employee' => ['teams.view', 'departments.view', 'projects.view'],
    ];

    private const TEAM_LEAD = [
        'slug' => 'team_lead',
        'name' => 'Team Lead',
        'abilities' => [
            'dashboard.view', 'units.view', 'plans.view', 'tasks.update_own', 'support.view', 'products.view',
            'meetings.view', 'documents.view', 'directory.view', 'events.view', 'development.view',
            'teams.view', 'teams.manage_own', 'departments.view', 'projects.view',
        ],
    ];

    public const LEDGER = 'bms_ability_migration_grants';

    public function up(): void
    {
        if (!Schema::hasTable('bms_roles')) return;

        if (!Schema::hasTable(self::LEDGER)) {
            Schema::create(self::LEDGER, function (Blueprint $table) {
                $table->id();
                $table->string('role_slug', 191);
                // The appended ability; NULL means "this migration created the role".
                $table->string('ability', 100)->nullable();
                $table->timestamp('created_at')->nullable();
            });
        }

        // A brand-new installation has no roles yet: the seeder creates the whole
        // matrix (team_lead included) in its canonical order, so there is nothing to merge.
        if (!DB::table('bms_roles')->exists()) return;

        // One transaction: a role's abilities and the ledger rows that describe
        // the change are stored together or not at all.
        DB::transaction(function () {
            foreach (self::GRANTS as $slug => $grants) {
                $role = DB::table('bms_roles')->where('slug', $slug)->lockForUpdate()->first();
                if (!$role) continue;

                $current = $this->decode($role->abilities);
                if (in_array('*', $current, true)) continue;

                $missing = array_values(array_diff($grants, $current));
                if ($missing === []) continue;

                DB::table('bms_roles')->where('id', $role->id)->update([
                    'abilities' => json_encode(array_values(array_merge($current, $missing))),
                    'updated_at' => now(),
                ]);
                foreach ($missing as $ability) {
                    $this->remember($slug, $ability);
                }
            }

            // Created once. An existing team_lead role (for example one an administrator
            // already adjusted) is never overwritten.
            if (!DB::table('bms_roles')->where('slug', self::TEAM_LEAD['slug'])->exists()) {
                DB::table('bms_roles')->insert([
                    'slug' => self::TEAM_LEAD['slug'],
                    'name' => self::TEAM_LEAD['name'],
                    'abilities' => json_encode(self::TEAM_LEAD['abilities']),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                $this->remember(self::TEAM_LEAD['slug'], null);
            }
        });
    }

    /**
     * Reverts only what the ledger says this migration did.
     *
     *  - An ability is removed from a role only when the ledger lists that exact
     *    (role, ability) pair. Abilities added by hand or by the seeder — the same
     *    seven names included — are therefore kept.
     *  - A role that now carries `*` is not touched.
     *  - team_lead is deleted only when this migration created it, nobody holds
     *    it, and its name and abilities are still exactly what was created. A
     *    role that is assigned or was adjusted is kept as it is.
     *  - Without a ledger (nothing recorded) no role is changed at all.
     *
     * Known limit: if an administrator removes an ability this migration added
     * and later grants the same ability again by hand, the ledger still lists it
     * and the rollback removes it. The two cases cannot be told apart.
     */
    public function down(): void
    {
        if (!Schema::hasTable(self::LEDGER)) return;

        if (Schema::hasTable('bms_roles')) {
            DB::transaction(function () {
                $entries = DB::table(self::LEDGER)->orderBy('id')->get();

                foreach ($entries->whereNotNull('ability')->groupBy('role_slug') as $slug => $rows) {
                    $role = DB::table('bms_roles')->where('slug', $slug)->lockForUpdate()->first();
                    if (!$role) continue;

                    $current = $this->decode($role->abilities);
                    if (in_array('*', $current, true)) continue;

                    $kept = array_values(array_diff($current, $rows->pluck('ability')->all()));
                    if ($kept !== $current) {
                        DB::table('bms_roles')->where('id', $role->id)->update(['abilities' => json_encode($kept), 'updated_at' => now()]);
                    }
                }

                if ($entries->where('role_slug', self::TEAM_LEAD['slug'])->whereNull('ability')->isNotEmpty()) {
                    $teamLead = DB::table('bms_roles')->where('slug', self::TEAM_LEAD['slug'])->lockForUpdate()->first();
                    $unchanged = $teamLead
                        && $teamLead->name === self::TEAM_LEAD['name']
                        && $this->decode($teamLead->abilities) === self::TEAM_LEAD['abilities'];
                    $assigned = $teamLead && Schema::hasTable('bms_role_user')
                        && DB::table('bms_role_user')->where('bms_role_id', $teamLead->id)->exists();
                    if ($unchanged && !$assigned) {
                        DB::table('bms_roles')->where('id', $teamLead->id)->delete();
                    }
                }
            });
        }

        Schema::dropIfExists(self::LEDGER);
    }

    private function remember(string $slug, ?string $ability): void
    {
        $exists = DB::table(self::LEDGER)->where('role_slug', $slug)
            ->when($ability === null, fn ($q) => $q->whereNull('ability'), fn ($q) => $q->where('ability', $ability))
            ->exists();
        if (!$exists) {
            DB::table(self::LEDGER)->insert(['role_slug' => $slug, 'ability' => $ability, 'created_at' => now()]);
        }
    }

    /** @return string[] */
    private function decode($abilities): array
    {
        $decoded = is_string($abilities) ? json_decode($abilities, true) : $abilities;

        return is_array($decoded) ? array_values($decoded) : [];
    }
}
