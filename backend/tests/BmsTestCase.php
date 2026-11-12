<?php

namespace Tests;

use App\Models\BMS\BmsRole;
use App\Models\BMS\BusinessUnit;
use App\Models\Company;
use App\Models\Module;
use App\Models\User;
use Database\Seeders\BmsPhaseOneSeeder;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Tymon\JWTAuth\Facades\JWTAuth;

/**
 * Boots the legacy tables BMS depends on, both BMS migrations and the real
 * authentication/entitlement middleware. All BMS HTTP tests extend this class.
 */
abstract class BmsTestCase extends TestCase
{
    protected Company $company;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'app.key' => 'base64:YWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWE=',
            'database.default' => env('BMS_TEST_DB_CONNECTION', 'sqlite'),
            'database.connections.sqlite.database' => ':memory:',
            'database.connections.sqlite.foreign_key_constraints' => true,
            'modules.fail_open' => false,
            'queue.default' => 'sync',
        ]);
        DB::purge(config('database.default'));
        if (config('database.default') !== 'sqlite') {
            Schema::dropAllTables();
        }
        $this->createLegacySchema();

        foreach ([
            '2026_11_11_000001_create_bms_phase_one_tables.php',
            '2026_11_11_000002_complete_bms_brd_tables.php',
            '2026_11_11_000004_add_meeting_response_timestamps.php',
            '2026_11_11_000005_add_alert_renotification_policy.php',
            '2026_11_11_000006_create_bms_notifications_table.php',
            '2026_11_12_000007_add_bms_completion_columns.php',
            '2026_11_12_000008_add_bms_meeting_sequence.php',
            '2026_11_12_000009_make_bms_a_core_capability.php',
        ] as $filename) {
            require_once base_path('database/migrations/'.$filename);
        }
        (new \CreateBmsPhaseOneTables())->up();
        (new \CompleteBmsBrdTables())->up();
        (new \AddMeetingResponseTimestamps())->up();
        (new \AddAlertRenotificationPolicy())->up();
        (new \CreateBmsNotificationsTable())->up();
        (new \AddBmsCompletionColumns())->up();
        (new \AddBmsMeetingSequence())->up();
        (new \MakeBmsACoreCapability())->up();

        (new BmsPhaseOneSeeder())->run();
        $this->enableBmsModule();
        Storage::fake('local');
    }

    private function createLegacySchema(): void
    {
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->string('department_name');
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('sub_departments', function (Blueprint $table) {
            $table->id();
            $table->string('sub_department_name')->nullable();
            $table->foreignId('departments_id')->constrained('departments')->cascadeOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('work_degrees', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('user_details', function (Blueprint $table) {
            $table->id();
            $table->string('jobTitle')->nullable();
            $table->date('hiringDate')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('username');
            $table->string('email')->nullable();
            $table->string('password');
            $table->string('firstname')->nullable();
            $table->string('lastname')->nullable();
            $table->string('photoURL')->nullable();
            $table->foreignId('sub_departments_id')->nullable()->constrained('sub_departments')->nullOnDelete();
            $table->foreignId('work_degrees_id')->nullable()->constrained('work_degrees')->nullOnDelete();
            $table->foreignId('user_details_id')->nullable()->constrained('user_details')->nullOnDelete();
            $table->foreignId('company_id')->nullable()->constrained('companies')->nullOnDelete();
            $table->boolean('active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('product_name');
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('contact_leads', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('modules', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->boolean('is_core')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
        Schema::create('company_modules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('module_id')->constrained('modules')->cascadeOnDelete();
            $table->boolean('is_enabled')->default(false);
            $table->timestamp('enabled_at')->nullable();
            $table->timestamps();
            $table->unique(['company_id', 'module_id']);
        });

        DB::table('departments')->insert([
            ['id' => 1, 'department_name' => 'Administration'],
            ['id' => 2, 'department_name' => 'HR'],
            ['id' => 3, 'department_name' => 'IT'],
            ['id' => 4, 'department_name' => 'PR'],
            ['id' => 5, 'department_name' => 'Finance'],
        ]);
        DB::table('sub_departments')->insert([
            ['id' => 1, 'departments_id' => 1, 'sub_department_name' => 'Administration'],
            ['id' => 2, 'departments_id' => 2, 'sub_department_name' => 'HR'],
            ['id' => 3, 'departments_id' => 3, 'sub_department_name' => 'IT'],
            ['id' => 4, 'departments_id' => 1, 'sub_department_name' => 'Management'],
            ['id' => 5, 'departments_id' => 4, 'sub_department_name' => 'PR'],
            ['id' => 6, 'departments_id' => 5, 'sub_department_name' => 'Finance'],
        ]);
        $this->company = Company::create(['name' => 'Test Company', 'slug' => 'default']);
    }

    private function enableBmsModule(): void
    {
        // Mirrors the production catalogue after migration 000009: BMS is core.
        $module = Module::updateOrCreate(
            ['slug' => 'bms'],
            ['name' => 'BMS', 'is_active' => true, 'is_core' => true]
        );
        $this->company->modules()->attach($module->id, [
            'is_enabled' => true,
            'enabled_at' => now(),
        ]);
    }

    protected function makeUser(array $attributes = []): User
    {
        static $sequence = 0;
        $sequence++;

        return User::create(array_merge([
            'username' => 'bms-user-'.$sequence,
            'firstname' => 'BMS',
            'lastname' => 'User '.$sequence,
            'email' => 'bms-user-'.$sequence.'@example.test',
            'password' => Hash::make('secret'),
            'sub_departments_id' => 2,
            'company_id' => $this->company->id,
            'active' => true,
        ], $attributes));
    }

    protected function makeUnit(array $attributes = []): BusinessUnit
    {
        static $sequence = 0;
        $sequence++;
        $name = $attributes['name'] ?? 'Test Unit '.$sequence;

        return BusinessUnit::create(array_merge([
            'name' => $name,
            'slug' => \Illuminate\Support\Str::slug($name),
            'services' => [],
            'is_active' => true,
        ], $attributes));
    }

    protected function actingAsRole(string $slug, array $unitIds = [], array $attributes = []): User
    {
        $user = $this->makeUser($attributes);
        $role = BmsRole::where('slug', $slug)->firstOrFail();
        $user->bmsRoles()->attach($role->id, ['business_unit_id' => null]);
        if ($unitIds) {
            $user->businessUnits()->attach($unitIds);
        }
        $this->actingAs($user, 'user_api');

        return $user;
    }

    protected function jwtHeaders(User $user): array
    {
        return ['Authorization' => 'Bearer '.JWTAuth::fromUser($user)];
    }

    protected function getBms(string $uri, User $user)
    {
        return $this->getJson('/api/bms/'.$uri, $this->jwtHeaders($user));
    }

    protected function postBms(string $uri, array $data, User $user)
    {
        return $this->postJson('/api/bms/'.$uri, $data, $this->jwtHeaders($user));
    }

    protected function putBms(string $uri, array $data, User $user)
    {
        return $this->putJson('/api/bms/'.$uri, $data, $this->jwtHeaders($user));
    }

    protected function deleteBms(string $uri, User $user)
    {
        return $this->deleteJson('/api/bms/'.$uri, [], $this->jwtHeaders($user));
    }
}
