<?php

namespace Tests\Feature;

use App\Models\Campagin;
use App\Models\ContactLeadCostType;
use App\Models\ContactLeadStatus;
use App\Models\ContactLeadSubStatus;
use App\Models\ContactLeadType;
use App\Models\Department;
use App\Models\OrganizationType;
use App\Models\PartnerIndustry;
use App\Models\SubDepartment;
use App\Models\WorkDegree;
use Database\Seeders\CrmDemoSeeder;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class CrmDemoSeederTest extends TestCase
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
            $table->timestamps();
            $table->softDeletes();
        });

        foreach ([
            '2022_08_30_231432_create_departments_table.php',
            '2022_08_30_231542_create_sub_departments_table.php',
            '2022_08_30_231604_create_work_degrees_table.php',
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
    }

    public function test_seeder_creates_all_required_lookups(): void
    {
        (new CrmDemoSeeder())->run();

        $this->assertSame(8, PartnerIndustry::count());
        $this->assertSame(5, OrganizationType::count());
        $this->assertGreaterThanOrEqual(1, Department::count());
        $this->assertSame(2, SubDepartment::count());
        $this->assertSame(3, WorkDegree::count());
        $this->assertSame(4, ContactLeadStatus::count());
        $this->assertSame(3, ContactLeadSubStatus::count());
        $this->assertSame(5, ContactLeadType::count());
        $this->assertSame(4, ContactLeadCostType::count());
        $this->assertSame(1, Campagin::where('campagin_name', 'Default Campaign')->count());

        // Sub-statuses must be linked to their parent status.
        $this->assertSame(
            ContactLeadStatus::where('contact_status_name', 'New')->first()->id,
            ContactLeadSubStatus::where('contact_sub_status_name', 'Contacted')->first()->contact_status_id
        );
    }

    public function test_seeder_is_idempotent(): void
    {
        (new CrmDemoSeeder())->run();
        (new CrmDemoSeeder())->run();

        $this->assertSame(8, PartnerIndustry::count());
        $this->assertSame(2, SubDepartment::count());
        $this->assertSame(5, ContactLeadType::count());
        $this->assertSame(1, Campagin::where('campagin_name', 'Default Campaign')->count());
    }
}
