<?php

namespace Database\Seeders;

use App\Models\Campagin;
use App\Models\ContactLeadCostType;
use App\Models\ContactLeadStatus;
use App\Models\ContactLeadSubStatus;
use App\Models\ContactLeadType;
use App\Models\Department;
use App\Models\OrganizationType;
use App\Models\PartnerIndustry;
use App\Models\Product;
use App\Models\SubDepartment;
use App\Models\WorkDegree;
use Illuminate\Database\Seeder;

/**
 * Lookup data required to start using the CRM on a fresh database:
 * industries and organisation types for accounts, lead statuses / types /
 * cost types for leads, departments / sub-departments / work degrees needed
 * when creating users, and a default campaign (the lead API defaults
 * campagin_id to 1). Everything uses firstOrCreate so the seeder is safe to
 * re-run and never duplicates rows.
 */
class CrmDemoSeeder extends Seeder
{
    public function run(): void
    {
        // --- Account lookups -------------------------------------------------

        foreach (['Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Real Estate', 'Manufacturing', 'Services'] as $name) {
            PartnerIndustry::firstOrCreate(['partner_industry_name' => $name]);
        }

        foreach (['LLC', 'Joint Stock', 'Sole Proprietorship', 'NGO', 'Multinational'] as $name) {
            OrganizationType::firstOrCreate(['organize_type' => $name]);
        }

        // --- User creation lookups ------------------------------------------

        $salesDepartment = Department::firstOrCreate(['department_name' => 'Sales']);
        SubDepartment::firstOrCreate([
            'sub_department_name' => 'Sales Team',
            'departments_id' => $salesDepartment->id,
        ]);
        SubDepartment::firstOrCreate([
            'sub_department_name' => 'Marketing',
            'departments_id' => $salesDepartment->id,
        ]);

        foreach (['Sales Representative', 'Sales Manager', 'Account Manager'] as $name) {
            WorkDegree::firstOrCreate(['work_degree_name' => $name]);
        }

        // --- Lead lookups ----------------------------------------------------

        $new = ContactLeadStatus::firstOrCreate(['contact_status_name' => 'New']);
        foreach (['Contacted', 'Qualified'] as $name) {
            ContactLeadSubStatus::firstOrCreate([
                'contact_sub_status_name' => $name,
                'contact_status_id' => $new->id,
            ]);
        }

        $inProgress = ContactLeadStatus::firstOrCreate(['contact_status_name' => 'In Progress']);
        ContactLeadSubStatus::firstOrCreate([
            'contact_sub_status_name' => 'Negotiation',
            'contact_status_id' => $inProgress->id,
        ]);

        ContactLeadStatus::firstOrCreate(['contact_status_name' => 'Won']);
        ContactLeadStatus::firstOrCreate(['contact_status_name' => 'Lost']);

        foreach (['Outbound', 'Inbound', 'Referral', 'Website', 'Cold Call'] as $name) {
            ContactLeadType::firstOrCreate(['lead_type_name' => $name]);
        }

        foreach (['Travel', 'Ads', 'Communication', 'Other'] as $name) {
            ContactLeadCostType::firstOrCreate(['lead_cost_type' => $name, 'type' => 'expense']);
        }

        // --- Default campaign (contact_leads.campagin_id defaults to 1) -----

        $product = Product::firstOrCreate(['product_name' => 'Default Product']);
        Campagin::firstOrCreate(
            ['campagin_name' => 'Default Campaign'],
            [
                'product_id' => $product->id,
                'campagin_title' => 'System default campaign',
                'campagin_description' => 'Created automatically so leads without an explicit campaign still resolve.',
                'start_date' => now()->toDateString(),
                'end_date' => now()->addYear()->toDateString(),
            ]
        );
    }
}
