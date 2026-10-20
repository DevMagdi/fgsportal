<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\SubDepartment;
use App\Models\User;
use App\Models\UserOpenToWork;
use App\Models\WorkDegree;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Tests\Modular\CreatesModuleDatabase;
use Tests\TestCase;

/**
 * Regression tests for the production GET /api/users/me 500 that emptied every
 * permission-gated section of the portal:
 *  - castUserData() dereferenced deleted/nullable work-degree and
 *    sub-department relations without null guards.
 *  - a missing user_open_to_work table crashed the whole response.
 *  - open_to_work leaked the full Eloquent model instead of a scalar flag.
 */
class MeEndpointTest extends TestCase
{
    use CreatesModuleDatabase;

    protected Company $company;

    protected function setUp(): void
    {
        parent::setUp();
        $this->setUpModuleDatabase();

        Schema::table('users', function (Blueprint $table) {
            $table->text('token')->nullable();
            $table->integer('active')->default(1);
            $table->bigInteger('user_details_id')->nullable();
            $table->bigInteger('work_degrees_id')->nullable();
            $table->string('firstname')->nullable();
            $table->string('lastname')->nullable();
            $table->string('photoURL')->nullable();
            $table->string('gender')->nullable();
            $table->integer('canAddPreviousReports')->default(0);
            $table->dateTime('canAddPreviousReportsDate')->nullable();
            $table->integer('refreshRequired')->default(1);
        });

        foreach ([
            '2022_08_30_256857_create_user_details_table.php',
            '2026_10_20_000005_create_user_open_to_work_table.php',
            '2022_08_30_231432_create_departments_table.php',
            '2022_08_30_231542_create_sub_departments_table.php',
            '2022_08_30_231604_create_work_degrees_table.php',
        ] as $migrationFile) {
            Artisan::call('migrate', [
                '--path' => database_path('migrations/' . $migrationFile),
                '--realpath' => true,
            ]);
        }

        $this->company = Company::where('slug', 'default')->firstOrFail();
    }

    private function makeUser(array $attributes = []): User
    {
        return User::create(array_merge([
            'username' => 'me-user-' . uniqid(),
            'email' => 'me-' . uniqid() . '@local.test',
            'password' => Hash::make('12345678'),
            'company_id' => $this->company->id,
            'active' => 1,
            'work_degrees_id' => null,
            'sub_departments_id' => null,
        ], $attributes));
    }

    private function loginToken(User $user): string
    {
        $response = $this->postJson('/api/users/login', [
            'email' => $user->email,
            'password' => '12345678',
        ]);
        $response->assertSuccessful();

        return $response->json('data.token');
    }

    public function test_me_returns_payload_for_fresh_user_with_all_null_relations(): void
    {
        // Reproduce a modular database where user_open_to_work was never created.
        Schema::dropIfExists('user_open_to_work');

        $user = $this->makeUser();
        $token = $this->loginToken($user);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/users/me');

        $response->assertStatus(201)
            ->assertJsonPath('message', 'Accepted')
            ->assertJsonPath('data.key', (string) $user->id)
            ->assertJsonPath('data.open_to_work', 0)
            ->assertJsonPath('data.work_degree_name', null)
            ->assertJsonPath('data.sub_department_name', null)
            ->assertJsonPath('data.department_name', null);

        // The flag must be a scalar 0/1, never the raw model.
        $this->assertIsInt($response->json('data.open_to_work'));
    }

    public function test_me_survives_orphan_work_degree_and_sub_department_foreign_keys(): void
    {
        // The lookup tables exist but contain no matching rows, exactly like a
        // legacy database whose referenced records were hard-deleted.
        $this->assertSame(0, WorkDegree::count());
        $this->assertSame(0, SubDepartment::count());

        $user = $this->makeUser([
            'work_degrees_id' => 999999,
            'sub_departments_id' => 999998,
        ]);
        $token = $this->loginToken($user);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/users/me');

        $response->assertStatus(201)
            ->assertJsonPath('data.work_degree_name', null)
            ->assertJsonPath('data.sub_department_name', null)
            ->assertJsonPath('data.department_name', null)
            ->assertJsonPath('data.accPosition', 999999)
            ->assertJsonPath('data.accRole', 999998);
    }

    public function test_me_keeps_sub_department_name_when_parent_department_is_orphaned(): void
    {
        Schema::disableForeignKeyConstraints();
        $subDepartment = SubDepartment::create([
            'sub_department_name' => 'Orphan Team',
            'departments_id' => 999997,
        ]);
        Schema::enableForeignKeyConstraints();

        $user = $this->makeUser([
            'sub_departments_id' => $subDepartment->id,
        ]);
        $token = $this->loginToken($user);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/users/me');

        $response->assertStatus(201)
            ->assertJsonPath('data.sub_department_name', 'Orphan Team')
            ->assertJsonPath('data.department_name', null)
            // The raw FK value is preserved on the payload; only the resolved
            // name is null because the parent department no longer exists.
            ->assertJsonPath('data.department', 999997);
    }

    public function test_me_reports_scalar_open_to_work_one_for_active_row(): void
    {
        $user = $this->makeUser();
        UserOpenToWork::create([
            'user_id' => $user->id,
            'from_date_time' => now()->subDay()->toDateTimeString(),
            'to_date_time' => now()->addDay()->toDateTimeString(),
            'active' => 1,
        ]);
        $token = $this->loginToken($user);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/users/me');

        $response->assertStatus(201)
            ->assertJsonPath('data.open_to_work', 1);
        $this->assertIsInt($response->json('data.open_to_work'));
    }

    public function test_me_without_token_is_rejected_by_jwt_middleware(): void
    {
        $this->makeUser();

        $this->getJson('/api/users/me')
            ->assertStatus(404);
    }
}
