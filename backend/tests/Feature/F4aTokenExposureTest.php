<?php

namespace Tests\Feature;

use App\Models\UserDetail;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Tests\BmsTestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

/**
 * F4a: stored employee JWTs are private to their owner. The legacy profile
 * endpoint is included because it is a separate user-response serializer.
 */
class F4aTokenExposureTest extends BmsTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Schema::table('users', function (Blueprint $table) {
            $table->text('token')->nullable();
            $table->string('gender')->nullable();
            $table->string('mobileNumber')->nullable();
            $table->boolean('refreshRequired')->default(false);
            $table->boolean('canAddPreviousReports')->default(false);
            $table->dateTime('canAddPreviousReportsDate')->nullable();
            $table->unsignedBigInteger('user_creator_id')->nullable();
        });

        // The shared BMS fixture intentionally has only a compact user_details
        // table. Add the legacy profile fields without changing production code.
        Schema::table('user_details', function (Blueprint $table) {
            $table->date('birthDate')->nullable();
            $table->string('address')->nullable();
            $table->string('maritalStatus')->nullable();
            $table->date('contractStartDate')->nullable();
            $table->date('contractEndDate')->nullable();
            $table->string('emergancyPhoneNumber')->nullable();
            $table->string('emergancyPhoneNumberName')->nullable();
            $table->string('emergancyPhoneNumberRelation')->nullable();
            $table->string('socialSecureityNumber')->nullable();
            $table->integer('need_paper')->default(1);
            $table->integer('full_information')->default(1);
            $table->integer('change_password')->default(1);
        });

        Schema::create('user_salaries', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('assign_to_id')->nullable();
            $table->decimal('salary', 15, 2)->nullable();
            $table->decimal('last_payment', 15, 2)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->integer('question_type_id')->nullable();
            $table->softDeletes();
        });
        Schema::create('ask_for_rates', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_to_rate_id')->nullable();
            $table->softDeletes();
        });
        Schema::create('ratings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('question_id')->nullable();
            $table->unsignedBigInteger('ask_to_rate_id')->nullable();
            $table->decimal('rate', 8, 2)->nullable();
            $table->softDeletes();
        });
    }

    public function test_user_model_hides_token_without_blocking_authentication_writes(): void
    {
        $user = $this->makeUser(['token' => 'stored-jwt-sentinel']);

        $this->assertArrayNotHasKey('token', $user->toArray());
        $this->assertStringNotContainsString('stored-jwt-sentinel', json_encode($user));
        $this->assertSame('stored-jwt-sentinel', $user->token);

        $user->update(['token' => 'replacement-jwt-sentinel']);
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'token' => 'replacement-jwt-sentinel',
        ]);
    }

    public function test_get_all_user_does_not_expose_another_users_token(): void
    {
        $viewer = $this->makeUser(['token' => 'viewer-stored-token']);
        $target = $this->makeUser(['token' => 'target-stored-token']);

        $response = $this->getJson('/api/users/getAllUser?token=viewer-stored-token', $this->jwtHeaders($viewer))
            ->assertStatus(201);

        $row = collect($response->json('data'))->firstWhere('key', (string) $target->id);
        $this->assertNotNull($row);
        $this->assertArrayNotHasKey('token', $row);
        $this->assertStringNotContainsString('target-stored-token', $response->getContent());
        $this->assertDatabaseHas('users', ['id' => $target->id, 'token' => 'target-stored-token']);
    }

    public function test_filter_user_does_not_expose_another_users_token_in_any_filter_branch(): void
    {
        $degreeId = DB::table('work_degrees')->insertGetId(['name' => 'Engineer']);
        $viewer = $this->makeUser(['token' => 'filter-viewer-token', 'work_degrees_id' => $degreeId]);
        $target = $this->makeUser(['token' => 'filter-target-token', 'work_degrees_id' => $degreeId]);

        $filters = [
            ['sub_department_id' => 2, 'work_degrees_id' => $degreeId],
            ['sub_department_id' => 2],
            ['department_id' => 2],
            ['department_id' => 2, 'work_degrees_id' => $degreeId],
            ['work_degrees_id' => $degreeId],
        ];

        foreach ($filters as $filter) {
            $response = $this->postJson('/api/users/FilterUser', $filter + ['token' => 'filter-viewer-token'], $this->jwtHeaders($viewer))
                ->assertStatus(201);

            $row = collect($response->json('data'))->firstWhere('key', (string) $target->id);
            $this->assertNotNull($row);
            $this->assertArrayNotHasKey('token', $row);
            $this->assertStringNotContainsString('filter-target-token', $response->getContent());
        }

        $this->assertDatabaseHas('users', ['id' => $target->id, 'token' => 'filter-target-token']);
    }

    public function test_edit_responses_do_not_return_another_users_stored_token(): void
    {
        // sub-department 4 belongs to departments_id 1 in the shared fixture,
        // matching the established legacy Management authorization check.
        $manager = $this->makeUser(['token' => 'edit-manager-token', 'sub_departments_id' => 4]);
        $target = $this->makeUser(['token' => 'edit-target-token']);

        $response = $this->postJson('/api/users/EditUser', [
            'token' => 'edit-manager-token',
            'user_id' => $target->id,
        ], $this->jwtHeaders($manager))->assertStatus(201);

        $this->assertSame((string) $target->id, $response->json('data.key'));
        $this->assertArrayNotHasKey('token', $response->json('data'));
        $this->assertStringNotContainsString('edit-target-token', $response->getContent());
        $this->assertDatabaseHas('users', ['id' => $target->id, 'token' => 'edit-target-token']);

        $response = $this->postJson('/api/users/EditUser', [
            'token' => 'edit-manager-token',
            'user_id' => $target->id,
            'firstname' => 'Updated',
        ], $this->jwtHeaders($manager))->assertStatus(201);

        $this->assertArrayNotHasKey('token', $response->json('data'));
        $this->assertStringNotContainsString('edit-target-token', $response->getContent());
        $this->assertDatabaseHas('users', [
            'id' => $target->id,
            'firstname' => 'Updated',
            'token' => 'edit-target-token',
        ]);
    }

    public function test_edit_requires_authentication(): void
    {
        $target = $this->makeUser(['firstname' => 'Original']);

        $this->postJson('/api/users/EditUser', [
            'token' => 'untrusted-transport-token',
            'user_id' => $target->id,
            'firstname' => 'Changed',
        ])->assertStatus(402);

        $this->assertDatabaseHas('users', ['id' => $target->id, 'firstname' => 'Original']);
    }

    public function test_regular_user_can_edit_only_own_allowlisted_profile_fields(): void
    {
        $user = $this->makeUser(['firstname' => 'Before', 'token' => 'self-stored-token']);

        $this->postJson('/api/users/EditUser', [
            'token' => 'self-stored-token',
            'user_id' => $user->id,
            'firstname' => 'After',
            'gender' => 'Other',
        ], $this->jwtHeaders($user))->assertStatus(201);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'firstname' => 'After',
            'gender' => 'Other',
            'token' => 'self-stored-token',
        ]);
    }

    public function test_regular_user_cannot_edit_another_users_profile(): void
    {
        $actor = $this->makeUser(['firstname' => 'Actor']);
        $target = $this->makeUser(['firstname' => 'Target', 'token' => 'target-token']);

        $this->postJson('/api/users/EditUser', [
            'token' => 'attacker-supplied-token',
            'user_id' => $target->id,
            'firstname' => 'Compromised',
        ], $this->jwtHeaders($actor))->assertStatus(403);

        $this->assertDatabaseHas('users', [
            'id' => $target->id,
            'firstname' => 'Target',
            'token' => 'target-token',
        ]);
    }

    public function test_edit_rejects_password_status_and_organization_changes_without_writes(): void
    {
        $user = $this->makeUser([
            'firstname' => 'Original',
            'password' => Hash::make('original-password'),
            'token' => 'stored-owner-token',
            'active' => true,
            'company_id' => $this->company->id,
            'sub_departments_id' => 2,
        ]);
        $originalPasswordHash = $user->password;

        foreach ([
            ['password' => 'attacker-password'],
            ['active' => false],
            ['company_id' => $this->company->id + 1],
            ['sub_departments_id' => 4],
            ['branches_id' => 999],
            ['refreshRequired' => true],
            ['canAddPreviousReports' => true],
        ] as $forbiddenChange) {
            $this->postJson('/api/users/EditUser', array_merge([
                'token' => 'attacker-supplied-token',
                'user_id' => $user->id,
            ], $forbiddenChange), $this->jwtHeaders($user))->assertStatus(403);

            $fresh = $user->fresh();
            $this->assertSame('stored-owner-token', $fresh->token);
            $this->assertSame($originalPasswordHash, $fresh->password);
            $this->assertSame('Original', $fresh->firstname);
            $this->assertTrue((bool) $fresh->active);
            $this->assertSame(2, (int) $fresh->sub_departments_id);
            $this->assertSame((int) $this->company->id, (int) $fresh->company_id);
        }
    }

    public function test_edit_rejects_unknown_and_user_detail_fields_without_writes(): void
    {
        $user = $this->makeUser(['firstname' => 'Original']);

        $this->postJson('/api/users/EditUser', [
            'token' => 'self-transport-token',
            'user_id' => $user->id,
            'photoURL' => 'https://example.test/avatar.png',
        ], $this->jwtHeaders($user))->assertStatus(422);

        $this->postJson('/api/users/EditUser', [
            'token' => 'self-transport-token',
            'user_id' => $user->id,
            'address' => 'attacker-controlled address',
        ], $this->jwtHeaders($user))->assertStatus(403);

        $this->assertDatabaseHas('users', ['id' => $user->id, 'firstname' => 'Original']);
    }

    public function test_management_can_update_legacy_account_role_fields(): void
    {
        $manager = $this->makeUser(['sub_departments_id' => 4]);
        $target = $this->makeUser(['sub_departments_id' => 2]);
        $degreeId = DB::table('work_degrees')->insertGetId(['name' => 'Engineer']);

        $response = $this->postJson('/api/users/EditUser', [
            'token' => 'manager-transport-token',
            'user_id' => $target->id,
            'sub_departments_id' => 3,
            'work_degrees_id' => $degreeId,
        ], $this->jwtHeaders($manager))->assertStatus(201);

        $this->assertSame((string) $target->id, $response->json('data.key'));
        $this->assertDatabaseHas('users', [
            'id' => $target->id,
            'sub_departments_id' => 3,
            'work_degrees_id' => $degreeId,
        ]);
    }

    public function test_management_cannot_assign_an_account_role_to_itself(): void
    {
        $manager = $this->makeUser(['sub_departments_id' => 4]);

        $this->postJson('/api/users/EditUser', [
            'token' => 'manager-transport-token',
            'user_id' => $manager->id,
            'sub_departments_id' => 2,
        ], $this->jwtHeaders($manager))->assertStatus(403);

        $this->assertDatabaseHas('users', ['id' => $manager->id, 'sub_departments_id' => 4]);
    }

    public function test_management_still_cannot_change_password_status_or_stored_token_here(): void
    {
        $manager = $this->makeUser(['sub_departments_id' => 4]);
        $target = $this->makeUser([
            'sub_departments_id' => 2,
            'password' => Hash::make('target-password'),
            'token' => 'target-token-sentinel',
            'active' => true,
        ]);
        $passwordHash = $target->password;

        $this->postJson('/api/users/EditUser', [
            'token' => 'submitted-token-must-not-be-written',
            'user_id' => $target->id,
            'password' => 'replacement-password',
            'active' => false,
        ], $this->jwtHeaders($manager))->assertStatus(403);

        $this->assertDatabaseHas('users', [
            'id' => $target->id,
            'password' => $passwordHash,
            'token' => 'target-token-sentinel',
            'active' => true,
            'sub_departments_id' => 2,
        ]);
    }

    public function test_legacy_profile_response_does_not_expose_a_stored_token(): void
    {
        $viewer = $this->makeUser(['token' => 'profile-viewer-token']);
        $details = UserDetail::create([]);
        $target = $this->makeUser([
            'token' => 'profile-target-token',
            'user_details_id' => $details->id,
        ]);

        $response = $this->postJson('/api/users/GetUserProfileData', [
            'token' => 'profile-viewer-token',
            'user_id' => $target->id,
        ], $this->jwtHeaders($viewer))->assertStatus(201);

        $this->assertSame((string) $target->id, $response->json('data.key'));
        $this->assertArrayNotHasKey('token', $response->json('data'));
        $this->assertStringNotContainsString('profile-target-token', $response->getContent());
        $this->assertDatabaseHas('users', ['id' => $target->id, 'token' => 'profile-target-token']);
    }

    public function test_login_returns_the_owners_token_and_me_remains_compatible(): void
    {
        $user = $this->makeUser(['password' => Hash::make('password123')]);

        $login = $this->postJson('/api/users/login', [
            'email' => $user->email,
            'password' => 'password123',
        ])->assertStatus(202)->assertJsonPath('message', 'Accepted');

        $token = $login->json('data.token');
        $this->assertIsString($token);
        $this->assertNotEmpty($token);
        $this->assertSame($token, $user->fresh()->token);
        $this->assertTrue(JWTAuth::setToken($token)->check());
        $this->assertSame($user->id, JWTAuth::setToken($token)->getPayload()->get('sub'));

        $me = $this->getJson('/api/users/me', ['Authorization' => 'Bearer '.$token])
            ->assertStatus(201)
            ->assertJsonPath('message', 'Accepted')
            ->assertJsonPath('data.key', (string) $user->id)
            ->assertJsonPath('data.token', $token);

        $this->assertDatabaseHas('users', ['id' => $user->id, 'token' => $token]);
        $this->assertStringNotContainsString('password123', $me->getContent());
    }
}
