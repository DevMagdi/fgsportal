<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\User;
use App\Models\UserDetail;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Tests\Modular\CreatesModuleDatabase;
use Tests\TestCase;

/**
 * Regression tests for the fresh-install login failures:
 *  - users without a user_details row crashed createNewToken() with a 500
 *  - the user_open_to_work table had no migration and did not exist on clean
 *    databases, so castUserData() crashed with "Table ... doesn't exist".
 */
class LoginTest extends TestCase
{
    use CreatesModuleDatabase;

    protected Company $company;

    protected function setUp(): void
    {
        parent::setUp();
        $this->setUpModuleDatabase();

        // The compact in-memory users table only carries the modular columns;
        // the login flow also writes/reads these.
        Schema::table('users', function (Blueprint $table) {
            $table->text('token')->nullable();
            $table->integer('active')->default(1);
            $table->bigInteger('user_details_id')->nullable();
        });

        // Tables read during login that historically had no migration.
        Artisan::call('migrate', [
            '--path' => database_path('migrations/2022_08_30_256857_create_user_details_table.php'),
            '--realpath' => true,
        ]);
        Artisan::call('migrate', [
            '--path' => database_path('migrations/2026_10_20_000005_create_user_open_to_work_table.php'),
            '--realpath' => true,
        ]);

        $this->company = Company::where('slug', 'default')->firstOrFail();
    }

    private function makeUser(array $attributes = []): User
    {
        return User::create(array_merge([
            'username' => 'login-user-' . uniqid(),
            'email' => 'login-' . uniqid() . '@local.test',
            'password' => Hash::make('12345678'),
            'company_id' => $this->company->id,
            'active' => 1,
        ], $attributes));
    }

    public function test_fresh_user_without_user_details_row_can_login(): void
    {
        // Exactly the tinker-provisioned user shape that returned 500 before:
        // no user_details row, no open-to-work rows.
        $user = $this->makeUser();
        $this->assertNull($user->user_details_id);

        $response = $this->postJson('/api/users/login', [
            'email' => $user->email,
            'password' => '12345678',
        ]);

        $response->assertStatus(202)
            ->assertJsonPath('message', 'Accepted');
        $this->assertNotEmpty($response->json('data.token'));

        // The token is persisted on the user for later revocation/logout.
        $this->assertSame($response->json('data.token'), $user->fresh()->token);
    }

    public function test_login_succeeds_when_user_details_row_exists(): void
    {
        $user = $this->makeUser();
        $details = UserDetail::create([]);
        $user->update(['user_details_id' => $details->id]);

        $this->postJson('/api/users/login', [
            'email' => $user->email,
            'password' => '12345678',
        ])
            ->assertStatus(202)
            ->assertJsonPath('data.need_paper', 1)
            ->assertJsonPath('data.full_information', 1)
            ->assertJsonPath('data.change_password', 1);
    }

    public function test_wrong_password_is_rejected_with_401(): void
    {
        $user = $this->makeUser();

        $this->postJson('/api/users/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ])->assertStatus(401);
    }

    public function test_unknown_email_fails_validation(): void
    {
        $this->postJson('/api/users/login', [
            'email' => 'nobody@local.test',
            'password' => '12345678',
        ])->assertStatus(400);
    }

    public function test_short_password_fails_validation(): void
    {
        $user = $this->makeUser();

        $this->postJson('/api/users/login', [
            'email' => $user->email,
            'password' => 'short',
        ])->assertStatus(400);
    }
}
