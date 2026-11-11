<?php

namespace Tests\Feature;

use App\Models\BMS\BmsRole;
use App\Models\BMS\BrandDocument;
use App\Services\BMS\BmsAccess;
use App\Services\BMS\SafeFilename;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\BmsTestCase;

class P07SecurityHardeningTest extends BmsTestCase
{
    public function test_P0_7_cors_allow_list_preflight_and_security_headers(): void
    {
        config(['bms.cors_allowed_origins' => ['https://bms.example.test']]);
        $this->options('/api/bms/units', [
            'Origin' => 'https://bms.example.test',
            'Access-Control-Request-Method' => 'GET',
        ])->assertNoContent()
            ->assertHeader('Access-Control-Allow-Origin', 'https://bms.example.test')
            ->assertHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, Accept, X-Requested-With')
            ->assertHeader('X-Content-Type-Options', 'nosniff');

        $this->options('/api/bms/units', [
            'Origin' => 'https://attacker.example', 'Access-Control-Request-Method' => 'GET',
        ])->assertNoContent()->assertHeaderMissing('Access-Control-Allow-Origin');

        $user = $this->actingAsRole('employee');
        $this->getBms('units', $user)
            ->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
            ->assertHeader('X-Content-Type-Options', 'nosniff');
    }

    public function test_P0_7_role_and_unit_writes_are_audited_and_validated(): void
    {
        $admin = $this->actingAsRole('system_admin');
        $target = $this->makeUser();
        $role = BmsRole::where('slug', 'employee')->firstOrFail();
        $payload = ['user_id' => $target->id, 'role_id' => $role->id];

        $this->postBms('roles/assign', $payload, $admin)->assertOk();
        $this->assertDatabaseHas('bms_audit_logs', [
            'event' => 'role.assigned', 'user_id' => $admin->id, 'auditable_id' => $target->id,
        ]);
        $this->postBms('roles/revoke', $payload, $admin)->assertOk();
        $this->assertDatabaseHas('bms_audit_logs', ['event' => 'role.revoked']);
        $this->postBms('roles/assign', ['user_id' => 999999, 'role_id' => $role->id], $admin)
            ->assertStatus(422);

        $employee = $this->actingAsRole('employee');
        $this->postBms('roles/assign', $payload, $employee)->assertForbidden();

        $unit = $this->postBms('units', ['name' => 'Security Test Unit'], $admin)
            ->assertCreated()->json('data');
        $this->assertDatabaseHas('bms_audit_logs', ['event' => 'unit.created', 'auditable_id' => $unit['id']]);
        $this->deleteJson('/api/bms/units/'.$unit['id'], [], $this->jwtHeaders($admin))->assertOk();
        $this->assertDatabaseHas('bms_audit_logs', ['event' => 'unit.deleted', 'auditable_id' => $unit['id']]);
    }

    public function test_P0_7_admin_sub_departments_are_configurable_and_seeding_is_opt_in(): void
    {
        $user = $this->makeUser(['sub_departments_id' => 2]);
        config(['bms.admin_sub_department_ids' => [2]]);
        $this->assertTrue(app(BmsAccess::class)->can('roles.manage', $user));
        config(['bms.admin_sub_department_ids' => [1, 4]]);
        $this->assertFalse(app(BmsAccess::class)->can('roles.manage', $user));

        config(['bms.seed_existing_admins' => false]);
        (new \Database\Seeders\BmsPhaseOneSeeder())->run();
        $this->assertSame(0, $user->fresh()->bmsRoles()->count());
    }

    public function test_P0_7_private_upload_and_safe_download_names(): void
    {
        Storage::fake('local');
        $pr = $this->actingAsRole('pr_marketing');
        $file = UploadedFile::fake()->createWithContent('policy.pdf', '%PDF-1.4 safe');
        $this->postBms('documents', [
            'name' => 'Policy', 'category' => 'Policies', 'file' => $file,
        ], $pr)->assertCreated();
        $document = BrandDocument::firstOrFail();
        Storage::disk('local')->assertExists($document->file_path);
        $this->assertStringStartsWith('bms/documents/', $document->file_path);
        $this->get('/storage/'.$document->file_path)->assertNotFound();

        $this->assertSame('report.pdf', SafeFilename::forDownload("../../report.pdf\r\n"));
        $this->assertSame('download', SafeFilename::forDownload('..'));
        $this->assertDatabaseHas('bms_audit_logs', ['event' => 'document.published']);
    }

    public function test_P0_7_login_is_rate_limited(): void
    {
        for ($attempt = 0; $attempt < 10; $attempt++) {
            $this->postJson('/api/users/login', [])->assertStatus(422);
        }
        $this->postJson('/api/users/login', [])->assertStatus(429);
    }
}
