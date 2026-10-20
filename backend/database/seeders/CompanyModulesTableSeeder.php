<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\CompanyModule;
use App\Models\Module;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class CompanyModulesTableSeeder extends Seeder
{
    /**
     * Provision the default company with every module enabled.
     * This preserves the current "full system" behaviour: when all modules
     * are enabled the product works exactly as before. New clients can then
     * have individual modules disabled through the management API.
     */
    public function run()
    {
        $company = Company::where('slug', 'default')->first();
        if (!$company) {
            return;
        }

        foreach (Module::all() as $module) {
            CompanyModule::updateOrCreate(
                ['company_id' => $company->id, 'module_id' => $module->id],
                [
                    'is_enabled' => true,
                    'enabled_at' => Carbon::now(),
                ]
            );
        }
    }
}
