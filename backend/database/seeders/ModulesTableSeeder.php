<?php

namespace Database\Seeders;

use App\Models\Module;
use Illuminate\Database\Seeder;

class ModulesTableSeeder extends Seeder
{
    /**
     * Catalogue of sellable modules. The Core module (users/auth/permissions)
     * is always required and always enabled.
     */
    public function run()
    {
        $modules = [
            [
                'name' => 'Core (Users, Auth & Permissions)',
                'slug' => 'core',
                'description' => 'Authentication, users, roles and permissions. Always required and always enabled.',
                'is_core' => true,
            ],
            [
                'name' => 'CRM',
                'slug' => 'crm',
                'description' => 'Leads, contacts, accounts, activities, campaigns, POC and RFP requests.',
                'is_core' => false,
            ],
            [
                'name' => 'Ticketing & Support',
                'slug' => 'ticketing',
                'description' => 'Client tickets, contract support, client accounts, licences, ratings and installments.',
                'is_core' => false,
            ],
            [
                'name' => 'Projects',
                'slug' => 'projects',
                'description' => 'Projects, processes, tasks, timesheets, reports and PM team requests.',
                'is_core' => false,
            ],
            [
                'name' => 'Human Resources',
                'slug' => 'hr',
                'description' => 'Recruitment, onboarding, salaries, vacations, incentives, transport requests and policies.',
                'is_core' => false,
            ],
            [
                'name' => 'Administration',
                'slug' => 'admin',
                'description' => 'Organisational settings, departments, products, permissions, logs, announcements and public requests.',
                'is_core' => false,
            ],
        ];

        foreach ($modules as $module) {
            Module::updateOrCreate(['slug' => $module['slug']], array_merge($module, ['is_active' => true]));
        }
    }
}
