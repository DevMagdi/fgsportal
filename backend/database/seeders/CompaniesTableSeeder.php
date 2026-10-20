<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class CompaniesTableSeeder extends Seeder
{
    /**
     * Create the default tenant and attach every legacy user to it so the
     * existing single-tenant deployment keeps working unchanged.
     */
    public function run()
    {
        $company = Company::updateOrCreate(
            ['slug' => 'default'],
            [
                'name' => 'First Gulf Solutions',
                'description' => 'Default company for legacy users and the main FGS Connect tenant.',
                'is_active' => true,
            ]
        );

        if (Schema::hasTable('users') && Schema::hasColumn('users', 'company_id')) {
            User::whereNull('company_id')->update(['company_id' => $company->id]);
        }

        return $company;
    }
}
