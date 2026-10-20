<?php

namespace Tests\Modular;

use Database\Seeders\CompaniesTableSeeder;
use Database\Seeders\CompanyModulesTableSeeder;
use Database\Seeders\ModulesTableSeeder;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schema;

/**
 * Boots an isolated in-memory SQLite database containing only the modular
 * system tables (companies, modules, company_modules) plus a minimal users
 * table, so the tests stay independent of the 100+ legacy MySQL migrations.
 */
trait CreatesModuleDatabase
{
    protected function setUpModuleDatabase(): void
    {
        config([
            'database.default' => 'sqlite',
            'database.connections.sqlite' => [
                'driver' => 'sqlite',
                'database' => ':memory:',
                'prefix' => '',
                'foreign_key_constraints' => true,
            ],
        ]);

        Schema::create('users', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('username')->unique();
            $table->string('email')->unique();
            $table->string('password');
            $table->bigInteger('sub_departments_id')->nullable();
            $table->bigInteger('company_id')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        foreach ([
            '2026_10_20_000001_create_companies_table.php',
            '2026_10_20_000002_add_company_id_to_users_table.php',
            '2026_10_20_000003_create_modules_table.php',
            '2026_10_20_000004_create_company_modules_table.php',
        ] as $migrationFile) {
            Artisan::call('migrate', [
                '--path' => database_path('migrations/' . $migrationFile),
                '--realpath' => true,
            ]);
        }

        $this->seed([
            ModulesTableSeeder::class,
            CompaniesTableSeeder::class,
            CompanyModulesTableSeeder::class,
        ]);
    }
}
