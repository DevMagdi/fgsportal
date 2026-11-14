<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Stage B1 — enterprise organization structure (schema only).
 *
 * Adds, without touching any existing row:
 *  - teams inside a business unit, their lead and their members;
 *  - central departments (HR, Finance, ...) with a head and members, kept in
 *    their own tables: the legacy `departments` / `sub_departments` tables and
 *    everything that depends on them are left exactly as they are;
 *  - a development manager on each business unit;
 *  - the link between legacy projects and business units (many to many);
 *  - the employee's primary organizational assignment (two nullable columns
 *    on `users`: a unit or a central department, never both).
 *
 * `users.manager_id` is not involved: it stays the administrative reporting
 * line. Team membership, department membership and project assignment are
 * separate relationships on the same single user record.
 *
 * Every step is guarded so the migration can be re-run on an installation
 * where part of it already exists, and `down()` removes only what `up()` adds.
 */
class CreateBmsOrganizationStructure extends Migration
{
    /**
     * Every foreign key this migration owns: [table, column, referenced table, on delete].
     * Used on MySQL to repair a partially applied run (see ensureMysqlConstraints).
     */
    public const FOREIGN_KEYS = [
        ['bms_teams', 'business_unit_id', 'business_units', 'restrict'],
        ['bms_teams', 'lead_id', 'users', 'set null'],
        ['bms_team_user', 'team_id', 'bms_teams', 'cascade'],
        ['bms_team_user', 'user_id', 'users', 'cascade'],
        ['bms_central_departments', 'head_id', 'users', 'set null'],
        ['bms_central_departments', 'legacy_department_id', 'departments', 'set null'],
        ['bms_central_department_user', 'central_department_id', 'bms_central_departments', 'cascade'],
        ['bms_central_department_user', 'user_id', 'users', 'cascade'],
        ['bms_project_business_unit', 'project_id', 'projects', 'cascade'],
        ['bms_project_business_unit', 'business_unit_id', 'business_units', 'restrict'],
        ['business_units', 'development_manager_id', 'users', 'set null'],
        ['users', 'primary_business_unit_id', 'business_units', 'set null'],
        ['users', 'primary_central_department_id', 'bms_central_departments', 'set null'],
    ];

    /** Every unique index this migration owns: [table, columns, index name]. */
    public const UNIQUE_INDEXES = [
        ['bms_teams', ['business_unit_id', 'name'], 'bms_teams_unit_name_unique'],
        ['bms_team_user', ['team_id', 'user_id'], 'bms_team_user_unique'],
        ['bms_central_departments', ['code'], 'bms_central_departments_code_unique'],
        ['bms_central_departments', ['name'], 'bms_central_departments_name_unique'],
        ['bms_central_department_user', ['central_department_id', 'user_id'], 'bms_central_department_user_unique'],
        ['bms_project_business_unit', ['project_id', 'business_unit_id'], 'bms_project_business_unit_unique'],
    ];

    public function up(): void
    {
        if (!Schema::hasTable('bms_teams')) {
            Schema::create('bms_teams', function (Blueprint $table) {
                $table->id();
                // A unit that still owns teams cannot be hard-deleted from under them.
                $table->foreignId('business_unit_id')->constrained('business_units')->restrictOnDelete();
                $table->string('name', 150);
                $table->text('description')->nullable();
                // Team lead: an assignment on the team, independent of users.manager_id.
                $table->foreignId('lead_id')->nullable()->constrained('users')->nullOnDelete();
                $table->boolean('is_active')->default(true);
                $table->timestamps();
                $table->unique(['business_unit_id', 'name'], 'bms_teams_unit_name_unique');
            });
        }

        if (!Schema::hasTable('bms_team_user')) {
            Schema::create('bms_team_user', function (Blueprint $table) {
                $table->id();
                $table->foreignId('team_id')->constrained('bms_teams')->cascadeOnDelete();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->timestamps();
                $table->unique(['team_id', 'user_id'], 'bms_team_user_unique');
            });
        }

        if (!Schema::hasTable('bms_central_departments')) {
            Schema::create('bms_central_departments', function (Blueprint $table) {
                $table->id();
                $table->string('code', 50)->unique();
                $table->string('name', 150)->unique();
                $table->string('name_ar', 150)->nullable();
                $table->text('description')->nullable();
                $table->foreignId('head_id')->nullable()->constrained('users')->nullOnDelete();
                // Optional, administrator-set pointer to the legacy department that
                // receives this department's support requests today. Never set automatically.
                $table->foreignId('legacy_department_id')->nullable()->constrained('departments')->nullOnDelete();
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('bms_central_department_user')) {
            Schema::create('bms_central_department_user', function (Blueprint $table) {
                $table->id();
                $table->foreignId('central_department_id')->constrained('bms_central_departments')->cascadeOnDelete();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->timestamps();
                $table->unique(['central_department_id', 'user_id'], 'bms_central_department_user_unique');
            });
        }

        if (!Schema::hasTable('bms_project_business_unit')) {
            Schema::create('bms_project_business_unit', function (Blueprint $table) {
                $table->id();
                // The legacy `projects` table itself is not altered.
                $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
                $table->foreignId('business_unit_id')->constrained('business_units')->restrictOnDelete();
                $table->boolean('is_lead')->default(false);
                $table->timestamps();
                $table->unique(['project_id', 'business_unit_id'], 'bms_project_business_unit_unique');
            });
        }

        if (!Schema::hasColumn('business_units', 'development_manager_id')) {
            Schema::table('business_units', function (Blueprint $table) {
                $table->foreignId('development_manager_id')->nullable()->after('director_id')
                    ->constrained('users')->nullOnDelete();
            });
        }

        if (!Schema::hasColumn('users', 'primary_business_unit_id')) {
            Schema::table('users', function (Blueprint $table) {
                $table->foreignId('primary_business_unit_id')->nullable()
                    ->constrained('business_units')->nullOnDelete();
            });
        }
        if (!Schema::hasColumn('users', 'primary_central_department_id')) {
            Schema::table('users', function (Blueprint $table) {
                $table->foreignId('primary_central_department_id')->nullable()
                    ->constrained('bms_central_departments')->nullOnDelete();
            });
        }

        $this->ensureMysqlConstraints();
    }

    /**
     * MySQL does not run DDL in a transaction, and Laravel issues CREATE TABLE /
     * ADD COLUMN, each ADD CONSTRAINT and each ADD UNIQUE as separate statements.
     * A run that failed half-way can therefore leave a table or a column without
     * some of its constraints, and the hasTable/hasColumn guards above would skip
     * it on the next attempt. This step closes that gap: it looks up what really
     * exists in information_schema and adds only what is missing, so a retry ends
     * in the complete schema and never creates a duplicate constraint.
     *
     * Nothing is swallowed: if a constraint cannot be added (incompatible column
     * type or engine, rows that violate it), the statement fails and the
     * migration stops with the database error.
     *
     * SQLite builds constraints inside CREATE TABLE, so it has nothing to repair.
     */
    private function ensureMysqlConstraints(): void
    {
        if (!$this->isMysql()) return;

        foreach (self::UNIQUE_INDEXES as [$table, $columns, $name]) {
            if (!Schema::hasTable($table)) continue;

            $indexes = $this->mysqlIndexes($table);
            $equivalent = array_filter($indexes, fn ($index) => $index['unique'] && $index['columns'] === $columns);
            if ($equivalent !== []) continue; // the rule is already enforced, under whatever name

            if (isset($indexes[$name])) {
                throw new RuntimeException(sprintf(
                    'Index `%s` on `%s` exists but is not the expected unique index on (%s). Resolve it manually, then re-run the migration.',
                    $name, $table, implode(', ', $columns)
                ));
            }
            Schema::table($table, function (Blueprint $blueprint) use ($columns, $name) {
                $blueprint->unique($columns, $name);
            });
        }

        foreach (self::FOREIGN_KEYS as [$table, $column, $references, $onDelete]) {
            if (!Schema::hasTable($table) || !Schema::hasColumn($table, $column)) continue;

            $satisfied = false;
            foreach ($this->mysqlForeignKeys($table, $column) as $key) {
                // Only a single-column key from this column to `<references>`.`id`
                // counts. A key to another table, or a composite key that merely
                // includes this column, is unrelated and is ignored.
                if ($key['columns'] !== 1 || $key['table'] !== $references || $key['column'] !== 'id') continue;

                // InnoDB treats NO ACTION and RESTRICT identically.
                $actual = $key['on_delete'] === 'NO ACTION' ? 'RESTRICT' : $key['on_delete'];
                if ($actual !== strtoupper($onDelete)) {
                    throw new RuntimeException(sprintf(
                        'Foreign key `%s` on `%s`.`%s` exists with ON DELETE %s; this migration requires ON DELETE %s. Resolve it manually, then re-run the migration.',
                        $key['name'], $table, $column, $key['on_delete'], strtoupper($onDelete)
                    ));
                }
                $satisfied = true;
            }
            if ($satisfied) continue;

            Schema::table($table, function (Blueprint $blueprint) use ($column, $references, $onDelete) {
                $blueprint->foreign($column)->references('id')->on($references)->onDelete($onDelete);
            });
        }
    }

    private function isMysql(): bool
    {
        return DB::connection()->getDriverName() === 'mysql';
    }

    /**
     * Foreign keys that really exist and involve $table.$column, read from
     * information_schema.
     *
     * @return array<int, array{name: string, table: string, column: string, on_delete: string, columns: int}>
     */
    private function mysqlForeignKeys(string $table, string $column): array
    {
        $prefix = DB::connection()->getTablePrefix();
        $rows = DB::select(
            'SELECT k.CONSTRAINT_NAME AS name, k.REFERENCED_TABLE_NAME AS ref_table, k.REFERENCED_COLUMN_NAME AS ref_column,
                    r.DELETE_RULE AS delete_rule,
                    (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE c
                      WHERE c.CONSTRAINT_SCHEMA = k.CONSTRAINT_SCHEMA AND c.TABLE_NAME = k.TABLE_NAME
                        AND c.CONSTRAINT_NAME = k.CONSTRAINT_NAME) AS column_count
               FROM information_schema.KEY_COLUMN_USAGE k
               JOIN information_schema.REFERENTIAL_CONSTRAINTS r
                 ON r.CONSTRAINT_SCHEMA = k.CONSTRAINT_SCHEMA AND r.TABLE_NAME = k.TABLE_NAME AND r.CONSTRAINT_NAME = k.CONSTRAINT_NAME
              WHERE k.TABLE_SCHEMA = ? AND k.TABLE_NAME = ? AND k.COLUMN_NAME = ? AND k.REFERENCED_TABLE_NAME IS NOT NULL
              ORDER BY k.CONSTRAINT_NAME',
            [DB::connection()->getDatabaseName(), $prefix.$table, $column]
        );

        return array_map(function ($row) use ($prefix) {
            $referenced = (string) $row->ref_table;
            if ($prefix !== '' && strpos($referenced, $prefix) === 0) $referenced = substr($referenced, strlen($prefix));

            return [
                'name' => (string) $row->name,
                'table' => $referenced,
                'column' => (string) $row->ref_column,
                'on_delete' => strtoupper((string) $row->delete_rule),
                'columns' => (int) $row->column_count,
            ];
        }, $rows);
    }

    /**
     * Indexes of $table keyed by name, with their columns in index order.
     *
     * @return array<string, array{unique: bool, columns: string[]}>
     */
    private function mysqlIndexes(string $table): array
    {
        $rows = DB::select(
            'SELECT INDEX_NAME AS name, NON_UNIQUE AS non_unique, COLUMN_NAME AS column_name
               FROM information_schema.STATISTICS
              WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
              ORDER BY INDEX_NAME, SEQ_IN_INDEX',
            [DB::connection()->getDatabaseName(), DB::connection()->getTablePrefix().$table]
        );

        $indexes = [];
        foreach ($rows as $row) {
            $indexes[$row->name]['unique'] = ((int) $row->non_unique) === 0;
            $indexes[$row->name]['columns'][] = (string) $row->column_name;
        }

        return $indexes;
    }

    public function down(): void
    {
        $this->dropForeignColumn('users', 'primary_central_department_id');
        $this->dropForeignColumn('users', 'primary_business_unit_id');
        $this->dropForeignColumn('business_units', 'development_manager_id');

        Schema::dropIfExists('bms_project_business_unit');
        Schema::dropIfExists('bms_central_department_user');
        Schema::dropIfExists('bms_central_departments');
        Schema::dropIfExists('bms_team_user');
        Schema::dropIfExists('bms_teams');
    }

    /**
     * Drops a column this migration added, together with its foreign key.
     *
     *  - SQLite: Laravel 8 cannot drop columns without doctrine/dbal, and SQLite
     *    never created the foreign key for a column added to an existing table;
     *    SQLite 3.35+ drops the column natively.
     *  - MySQL: the foreign key is looked up in information_schema and dropped by
     *    its real name only when it exists, so a rollback also works on a column
     *    that was left without its constraint by a partially failed run.
     *  - Other drivers: constraint (default name) first, then the column.
     */
    private function dropForeignColumn(string $table, string $column): void
    {
        if (!Schema::hasTable($table) || !Schema::hasColumn($table, $column)) return;

        if (DB::connection()->getDriverName() === 'sqlite') {
            DB::statement('ALTER TABLE '.$table.' DROP COLUMN '.$column);
            return;
        }

        if ($this->isMysql()) {
            // The column is ours, so every single-column key on it is ours too and
            // has to go before the column can be dropped; none may exist at all
            // after a partially failed run. A composite key that includes the
            // column was not created here: MySQL then refuses DROP COLUMN and the
            // rollback stops with that error instead of destroying a foreign constraint.
            foreach ($this->mysqlForeignKeys($table, $column) as $key) {
                if ($key['columns'] !== 1) continue;
                Schema::table($table, function (Blueprint $blueprint) use ($key) {
                    $blueprint->dropForeign($key['name']);
                });
            }
            Schema::table($table, function (Blueprint $blueprint) use ($column) {
                $blueprint->dropColumn($column);
            });
            return;
        }

        Schema::table($table, function (Blueprint $blueprint) use ($column) {
            $blueprint->dropForeign([$column]);
            $blueprint->dropColumn($column);
        });
    }
}
