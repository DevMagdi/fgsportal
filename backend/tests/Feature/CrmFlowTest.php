<?php

namespace Tests\Feature;

use App\Models\Campagin;
use App\Models\Company;
use App\Models\ContactLeadStatus;
use App\Models\ContactLeadSubStatus;
use App\Models\ContactLeadType;
use App\Models\Contact;
use App\Models\OrganizationType;
use App\Models\Partner;
use App\Models\PartnerIndustry;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Schema;
use Tests\Modular\CreatesModuleDatabase;
use Tests\TestCase;

/**
 * Drives the exact journey the user asked for through the real HTTP stack
 * (jwt.verify + module middleware + controllers + validation):
 * login-provisioned user -> industry -> organisation type -> account
 * (partner) -> contact -> lead.
 */
class CrmFlowTest extends TestCase
{
    use CreatesModuleDatabase;

    protected Company $company;
    protected User $user;
    protected string $jwt;

    protected function setUp(): void
    {
        parent::setUp();
        $this->setUpModuleDatabase();

        Schema::table('users', function (Blueprint $table) {
            $table->text('token')->nullable();
            $table->boolean('active')->default(1);
            $table->string('firstname')->nullable();
            $table->string('lastname')->nullable();
        });

        foreach ([
            '2022_08_30_231652_create_products_table.php',
            '2022_09_06_070439_create_partners_table.php',
            '2026_10_20_000006_create_partner_industries_table.php',
            '2026_10_20_000007_create_organization_types_table.php',
            '2026_10_20_000008_extend_partners_table_with_crm_columns.php',
            '2026_10_20_000009_create_contact_lead_lookup_tables.php',
            '2026_10_20_000010_create_contacts_table.php',
            '2026_10_20_000011_create_contact_leads_table.php',
            '2026_10_20_000012_create_contact_lead_supporting_tables.php',
            '2026_10_20_000013_create_campagins_table.php',
        ] as $migrationFile) {
            Artisan::call('migrate', [
                '--path' => database_path('migrations/' . $migrationFile),
                '--realpath' => true,
            ]);
        }

        $this->company = Company::where('slug', 'default')->firstOrFail();

        $this->user = User::create([
            'username' => 'crm-flow-user',
            'firstname' => 'Sara',
            'lastname' => 'Ahmed',
            'email' => 'flow@local.test',
            'password' => Hash::make('12345678'),
            'active' => 1,
            'company_id' => $this->company->id,
        ]);

        // The JWT is persisted on users.token by the login flow; protected
        // controllers compare the request "token" field against it.
        $this->jwt = JWTAuth::fromUser($this->user);
        $this->user->update(['token' => $this->jwt]);
    }

    private function authPost(string $uri, array $payload): \Illuminate\Testing\TestResponse
    {
        return $this->withToken($this->jwt)->postJson($uri, $payload + ['token' => $this->jwt]);
    }

    public function test_industry_to_lead_journey_over_http(): void
    {
        // 1. Industry (Settings screen).
        $industryResponse = $this->authPost('/api/users/CreatePartnerIndustry', [
            'partner_industry_name' => 'Technology',
        ]);
        $industryResponse->assertStatus(201);
        $this->assertDatabaseHas('partner_industries', ['partner_industry_name' => 'Technology']);

        // Duplicate industry name is rejected by validation, not a 500.
        $this->authPost('/api/users/CreatePartnerIndustry', [
            'partner_industry_name' => 'Technology',
        ])->assertStatus(400);

        // 2. Organisation type.
        $orgType = OrganizationType::create(['organize_type' => 'LLC']);

        // 3. Account (partner).
        $partnerResponse = $this->authPost('/api/users/CreatePartner', [
            'partner_name' => 'Acme Solutions',
            'partner_address' => 'Cairo',
            'partner_description' => 'First account',
            'phone' => '+201000000000',
            'email' => 'info@acme.test',
            'partner_industry_id' => PartnerIndustry::firstOrFail()->id,
            'is_org' => 1,
            'country' => 'Egypt',
            'website' => 'https://acme.test',
            'organize_type_id' => $orgType->id,
            'sales_id' => $this->user->id,
        ]);
        $partnerResponse->assertStatus(201);
        $partner = Partner::where('partner_name', 'Acme Solutions')->firstOrFail();
        $this->assertSame($this->user->id, $partner->user_creator_id);

        // 4. Contact inside the account.
        $contactResponse = $this->authPost('/api/users/CreateContact', [
            'partner_id' => $partner->id,
            'name' => 'Nour Ali',
            'email' => 'nour@acme.test',
            // The controller casts phone to an array of typed numbers.
            'phone' => [['phone' => '+201111111111', 'phone_type' => 'mobile']],
            'title' => 'Buyer',
        ]);
        $contactResponse->assertStatus(201);
        $contact = Contact::where('email', 'nour@acme.test')->firstOrFail();

        // 5. Lead lookups and the default campaign the API falls back to.
        $status = ContactLeadStatus::create(['contact_status_name' => 'New']);
        $subStatus = ContactLeadSubStatus::create([
            'contact_sub_status_name' => 'Contacted',
            'contact_status_id' => $status->id,
        ]);
        $leadType = ContactLeadType::create(['lead_type_name' => 'Outbound']);
        $product = Product::create(['product_name' => 'Portal License']);
        Campagin::create([
            'product_id' => $product->id,
            'campagin_name' => 'Default Campaign',
            'start_date' => now()->toDateString(),
        ]);

        // 6. The lead itself.
        $leadResponse = $this->authPost('/api/users/CreateContactLead', [
            'sales_id' => $this->user->id,
            'lead_sub_status_id' => $subStatus->id,
            'lead_type_id' => $leadType->id,
            'product_id' => $product->id,
            'contact_id' => $contact->id,
            'title' => 'Portal deal',
            'cost' => 5000.5,
            'currency' => 'EGP',
            'notes' => 'Kickoff done',
            'isLead' => 1,
        ]);
        $leadResponse->assertStatus(201)
            ->assertJsonPath('data.contact_name', 'Nour Ali')
            ->assertJsonPath('data.partner_name', 'Acme Solutions')
            ->assertJsonPath('data.lead_type_name', 'Outbound')
            ->assertJsonPath('data.campagin_name', 'Default Campaign');

        $this->assertDatabaseHas('contact_leads', [
            'contact_id' => $contact->id,
            'campagin_id' => 1,
            'isLead' => 1,
        ]);
    }

    public function test_requests_without_token_are_rejected(): void
    {
        $this->postJson('/api/users/CreatePartnerIndustry', [
            'partner_industry_name' => 'Blocked',
        ])->assertStatus(404); // JwtMiddleware: Authorization Token not found
    }
}
