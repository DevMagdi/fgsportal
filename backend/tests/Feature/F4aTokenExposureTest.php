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
        $viewer = $this->makeUser(['token' => 'edit-viewer-token']);
        $target = $this->makeUser(['token' => 'edit-target-token']);

        // A read-only edit isolates response exposure from the separately
        // reported, still-unapproved mass-assignment behavior of EditUser.
        $response = $this->postJson('/api/users/EditUser', [
            'token' => 'edit-viewer-token',
            'user_id' => $target->id,
        ], $this->jwtHeaders($viewer))->assertStatus(201);

        $this->assertSame((string) $target->id, $response->json('data.key'));
        $this->assertArrayNotHasKey('token', $response->json('data'));
        $this->assertStringNotContainsString('edit-target-token', $response->getContent());
        $this->assertDatabaseHas('users', ['id' => $target->id, 'token' => 'edit-target-token']);

        $response = $this->postJson('/api/users/EditUser', [
            'token' => 'edit-viewer-token',
            'user_id' => $target->id,
            'firstname' => 'Updated',
        ], $this->jwtHeaders($viewer))->assertStatus(201);

        $this->assertArrayNotHasKey('token', $response->json('data'));
        $this->assertDatabaseHas('users', ['id' => $target->id, 'firstname' => 'Updated']);
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
