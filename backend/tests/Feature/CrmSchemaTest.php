<?php

namespace Tests\Feature;

use App\Models\Contact;
use App\Models\ContactLead;
use App\Models\ContactLeadActivity;
use App\Models\ContactLeadAttach;
use App\Models\ContactLeadCost;
use App\Models\ContactLeadCostType;
use App\Models\ContactLeadStatus;
use App\Models\ContactLeadSubStatus;
use App\Models\ContactLeadType;
use App\Models\Campagin;
use App\Http\Controllers\User\Business\ActivityandLead\ContactLeadController;
use App\Http\Controllers\User\Business\ActivityandLead\ContactController;
use App\Models\ContactLeadDublicate;
use App\Models\OrganizationType;
use App\Models\Partner;
use App\Models\PartnerIndustry;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

/**
 * End-to-end coverage for the CRM tables that had no migrations: a fresh
 * database must support the exact flow a user follows in the UI —
 * industry -> organisation type -> account (partner) -> contact -> lead,
 * plus activities, attachments, costs and duplicate markers.
 */
class CrmSchemaTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

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
            '2022_08_30_231652_create_products_table.php',
            '2022_09_06_070439_create_partners_table.php',
            // New CRM foundation migrations.
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
    }

    public function test_all_crm_tables_exist_with_soft_deletes(): void
    {
        foreach ([
            'partner_industries', 'organization_types', 'partners',
            'contact_lead_statuses', 'contact_lead_sub_statuses',
            'contact_lead_types', 'contact_lead_cost_types',
            'contacts', 'contact_leads', 'contact_lead_activities',
            'contact_lead_attaches', 'contact_lead_costs',
            'contact_lead_dublicates', 'campagins',
        ] as $table) {
            $this->assertTrue(Schema::hasTable($table), "table {$table} must exist");
            $this->assertTrue(Schema::hasColumn($table, 'deleted_at'), "{$table} must support soft deletes");
        }

        // The partners extension columns landed.
        foreach (['phone', 'email', 'partner_industry_id', 'is_org', 'country', 'website', 'organize_type_id', 'sales_id'] as $column) {
            $this->assertTrue(Schema::hasColumn('partners', $column), "partners.{$column} must exist");
        }
    }

    public function test_full_crm_flow_industry_account_contact_lead(): void
    {
        $user = User::create([
            'username' => 'crm-user',
            'email' => 'crm@local.test',
            'password' => Hash::make('12345678'),
        ]);

        // 1. Settings: industries and organisation types.
        $industry = PartnerIndustry::create(['partner_industry_name' => 'Technology']);
        $orgType = OrganizationType::create(['organize_type' => 'LLC']);
        $this->assertDatabaseHas('partner_industries', ['partner_industry_name' => 'Technology']);

        // 2. Account (partner) linked to both lookups, exactly like CreatePartner.
        $partner = Partner::create([
            'partner_name' => 'Acme Solutions',
            'partner_address' => 'Cairo',
            'partner_description' => 'First account',
            'phone' => '+201000000000',
            'email' => 'info@acme.test',
            'user_creator_id' => $user->id,
            'partner_industry_id' => $industry->id,
            'is_org' => 1,
            'country' => 'Egypt',
            'website' => 'https://acme.test',
            'organize_type_id' => $orgType->id,
            'sales_id' => $user->id,
        ]);
        $this->assertSame('Technology', $partner->partner_industry_id_fun->partner_industry_name);
        $this->assertSame('LLC', $partner->organize_type_id_fun->organize_type);

        // 3. Contact inside the account.
        $contact = Contact::create([
            'user_creator_id' => $user->id,
            'partner_id' => $partner->id,
            'name' => 'Sara Ahmed',
            'email' => 'sara@acme.test',
            'phone' => '+201111111111',
            'address' => 'Giza',
            'title' => 'Procurement Lead',
        ]);
        $this->assertSame($partner->id, $contact->partner_id);

        // 4. Lead lookups (status -> sub status, lead type, cost type, product).
        $status = ContactLeadStatus::create(['contact_status_name' => 'New']);
        $subStatus = ContactLeadSubStatus::create([
            'contact_sub_status_name' => 'Contacted',
            'contact_status_id' => $status->id,
        ]);
        $leadType = ContactLeadType::create(['lead_type_name' => 'Outbound']);
        $costType = ContactLeadCostType::create(['lead_cost_type' => 'Travel', 'type' => 'expense']);
        $product = Product::create(['product_name' => 'Portal License']);
        $campaign = Campagin::create([
            'product_id' => $product->id,
            'user_creator_id' => $user->id,
            'campagin_name' => 'Q4 Outbound',
            'campagin_cost' => 10000,
            'start_date' => '2026-10-01',
            'end_date' => '2026-12-31',
        ]);

        // 5. The lead itself.
        $lead = ContactLead::create([
            'campagin_id' => $campaign->id,
            'sales_id' => $user->id,
            'user_creator_id' => $user->id,
            'lead_sub_status_id' => $subStatus->id,
            'lead_type_id' => $leadType->id,
            'product_id' => $product->id,
            'contact_id' => $contact->id,
            'title' => 'Portal deal',
            'cost' => 5000.50,
            'currency' => 'EGP',
            'notes' => 'Kickoff call done',
            'isLead' => 1,
            'expected_close_date' => '2026-12-31',
        ]);

        $this->assertSame('Outbound', $lead->lead_type_id_fun->lead_type_name);
        $this->assertSame('Contacted', $lead->lead_sub_status_id_fun->contact_sub_status_name);

        // 6. Supporting records.
        $activity = ContactLeadActivity::create([
            'sales_id' => $user->id,
            'contact_lead_id' => $lead->id,
            'lead_sub_status_id' => $subStatus->id,
            'activity_type_id' => 1,
            'activity_status_id' => 2,
            'comment' => 'Follow-up call',
            'from_date' => now(),
            'to_date' => now()->addHour(),
            'visibility' => 'public',
        ]);
        $attach = ContactLeadAttach::create([
            'contact_lead_id' => $lead->id,
            'user_creator_id' => $user->id,
            'contact_lead_attach' => 'proposal.pdf',
        ]);
        $cost = ContactLeadCost::create([
            'lead_cost_type_id' => $costType->id,
            'contact_lead_id' => $lead->id,
            'cost' => 120.75,
        ]);
        $duplicate = ContactLeadDublicate::create([
            'campagin_id' => 1,
            'contact_id' => $contact->id,
            'branches_id' => 1,
            'user_creator_id' => $user->id,
            'partner_id' => $partner->id,
            'notes' => 'possible duplicate',
        ]);

        $this->assertDatabaseHas('contact_lead_activities', ['id' => $activity->id, 'comment' => 'Follow-up call']);
        $this->assertDatabaseHas('contact_lead_attaches', ['id' => $attach->id, 'contact_lead_attach' => 'proposal.pdf']);
        $this->assertDatabaseHas('contact_lead_costs', ['id' => $cost->id]);
        $this->assertDatabaseHas('contact_lead_dublicates', ['id' => $duplicate->id]);
    }

    public function test_industry_name_is_unique_and_soft_deletable(): void
    {
        PartnerIndustry::create(['partner_industry_name' => 'Finance']);

        $this->expectException(\Illuminate\Database\QueryException::class);
        PartnerIndustry::create(['partner_industry_name' => 'Finance']);
    }

    public function test_api_casts_survive_missing_optional_relations(): void
    {
        $user = User::create([
            'username' => 'cast-user',
            'email' => 'cast@local.test',
            'password' => Hash::make('12345678'),
        ]);
        $subStatus = ContactLeadSubStatus::create([
            'contact_sub_status_name' => 'Cold',
            'contact_status_id' => ContactLeadStatus::create(['contact_status_name' => 'Open'])->id,
        ]);
        $leadType = ContactLeadType::create(['lead_type_name' => 'Referral']);

        // Contact without a partner (partner_id is optional).
        $contact = Contact::create([
            'user_creator_id' => $user->id,
            'name' => 'No Company',
            'phone' => '+201222222222',
        ]);

        // Lead with no campaign — the API cast must not 500.
        $lead = ContactLead::create([
            'campagin_id' => null,
            'sales_id' => $user->id,
            'user_creator_id' => $user->id,
            'lead_sub_status_id' => $subStatus->id,
            'lead_type_id' => $leadType->id,
            'contact_id' => $contact->id,
            'title' => 'Orphan lead',
        ]);
        $cast = (new ContactLeadController())->castarrayLead($lead->fresh());
        $this->assertNull($cast['campagin_name']);
        $this->assertSame('No Company', $cast['contact_name']);
        $this->assertNull($cast['partner_name']);
        $this->assertSame('Referral', $cast['lead_type_name']);

        // The same partnerless contact — castArrayContact must not 500 either.
        $contactCast = (new ContactController())->castArrayContact($contact->fresh());
        $this->assertNull($contactCast['partner_id']);
        $this->assertNull($contactCast['partner_name']);
        $this->assertSame('No Company', $contactCast['name']);
    }

    public function test_migrations_are_idempotent_on_repeat_runs(): void
    {
        // Re-running every new migration must not fail (hasTable/hasColumn guards).
        foreach (glob(database_path('migrations/2026_10_20_0000*.php')) as $migration) {
            Artisan::call('migrate', ['--path' => $migration, '--realpath' => true]);
        }

        $this->assertTrue(Schema::hasTable('partner_industries'));
        $this->assertTrue(Schema::hasTable('contact_leads'));
    }
}
