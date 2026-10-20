<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Permission;
use App\Models\User;
use App\Models\UserPermissionGroup;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Tests\Modular\CreatesModuleDatabase;
use Tests\TestCase;

/**
 * Regression tests for GetUserPermission:
 *  - orphan user_permission_groups rows (permissions_id pointing at a deleted
 *    permission) crashed the endpoint with a 500, which left the portal with
 *    no permissions and therefore hid every module card.
 *  - rows whose permission lookup has gone must simply be skipped.
 */
class UserPermissionEndpointTest extends TestCase
{
    use CreatesModuleDatabase;

    protected Company $company;
    protected User $actor;
    protected string $jwt;

    protected function setUp(): void
    {
        parent::setUp();
        $this->setUpModuleDatabase();

        Schema::table('users', function (Blueprint $table) {
            $table->text('token')->nullable();
            $table->integer('active')->default(1);
            $table->bigInteger('user_details_id')->nullable();
        });

        Artisan::call('migrate', [
            '--path' => database_path('migrations/2022_08_30_256857_create_user_details_table.php'),
            '--realpath' => true,
        ]);
        Artisan::call('migrate', [
            '--path' => database_path('migrations/2022_08_30_231635_create_permissions_table.php'),
            '--realpath' => true,
        ]);
        Artisan::call('migrate', [
            '--path' => database_path('migrations/2022_08_30_901939_create_user_permission_groups_table.php'),
            '--realpath' => true,
        ]);

        $this->company = Company::where('slug', 'default')->firstOrFail();
        $this->actor = User::create([
            'username' => 'perm-user-' . uniqid(),
            'email' => 'perm-' . uniqid() . '@local.test',
            'password' => Hash::make('12345678'),
            'company_id' => $this->company->id,
            'active' => 1,
        ]);

        $login = $this->postJson('/api/users/login', [
            'email' => $this->actor->email,
            'password' => '12345678',
        ]);
        $login->assertSuccessful();
        $this->jwt = $login->json('data.token');
    }

    private function callEndpoint(?int $userId = null)
    {
        return $this->withHeader('Authorization', 'Bearer ' . $this->jwt)
            ->postJson('/api/users/GetUserPermission', [
                'token' => $this->jwt,
                'users_id' => $userId ?? $this->actor->id,
            ]);
    }

    public function test_valid_permission_rows_are_returned(): void
    {
        $permission = Permission::create(['permission_name' => 'view_salaries']);
        UserPermissionGroup::create([
            'users_id' => $this->actor->id,
            'permissions_id' => $permission->id,
        ]);

        $this->callEndpoint()
            ->assertStatus(201)
            ->assertJsonPath('message', 'success')
            ->assertJsonPath('data.0.userKey', (string) $this->actor->id)
            ->assertJsonPath('data.0.permission_name', 'view_salaries')
            ->assertJsonPath('data.0.permission_id', (string) $permission->id)
            ->assertJsonPath('data.0.status', true);
    }

    public function test_orphan_permission_rows_are_skipped_not_500(): void
    {
        $permission = Permission::create(['permission_name' => 'follow_ticket']);
        UserPermissionGroup::create([
            'users_id' => $this->actor->id,
            'permissions_id' => $permission->id,
        ]);

        // Legacy rows can outlive their permission lookup when foreign keys
        // were not enforced on the old MySQL databases.
        Schema::disableForeignKeyConstraints();
        UserPermissionGroup::create([
            'users_id' => $this->actor->id,
            'permissions_id' => 999999,
        ]);
        Schema::enableForeignKeyConstraints();

        $response = $this->callEndpoint();

        $response->assertStatus(201)
            ->assertJsonPath('message', 'success');
        $this->assertCount(1, $response->json('data'));
        $this->assertSame('follow_ticket', $response->json('data.0.permission_name'));
    }

    public function test_all_orphan_rows_return_empty_200_instead_of_500(): void
    {
        Schema::disableForeignKeyConstraints();
        UserPermissionGroup::create([
            'users_id' => $this->actor->id,
            'permissions_id' => 999998,
        ]);
        UserPermissionGroup::create([
            'users_id' => $this->actor->id,
            'permissions_id' => 999997,
        ]);
        Schema::enableForeignKeyConstraints();

        $this->callEndpoint()
            ->assertStatus(200)
            ->assertJsonPath('message', 'Empty')
            ->assertJsonPath('data', null);
    }

    public function test_user_without_permission_rows_gets_empty_200(): void
    {
        $this->callEndpoint()
            ->assertStatus(200)
            ->assertJsonPath('message', 'Empty');
    }

    public function test_validation_rejects_missing_users_id(): void
    {
        $this->withHeader('Authorization', 'Bearer ' . $this->jwt)
            ->postJson('/api/users/GetUserPermission', [
                'token' => $this->jwt,
            ])
            ->assertStatus(400);
    }
}
