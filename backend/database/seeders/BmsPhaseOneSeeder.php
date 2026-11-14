<?php
namespace Database\Seeders;

use App\Models\BMS\BmsRole;
use App\Models\BMS\BusinessUnit;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BmsPhaseOneSeeder extends Seeder
{
    /**
     * Canonical role matrix. Stage B1 added the organization abilities
     * (teams.*, departments.*, projects.*) and the team_lead role; migration
     * 2026_11_14_000013 merges the same abilities into existing installations
     * without replacing what a role already holds, and the two must stay in step.
     */
    public const ROLES = [
        'system_admin' => ['System Administrator', ['*']],
        'executive' => ['Executive Management', ['dashboard.view','dashboard.export','units.view','plans.view','opportunities.view','products.view','support.view','meetings.view','leads.view','development.view','reports.view','documents.view','directory.view','events.view','teams.view','departments.view','projects.view']],
        'coordinator' => ['Business Unit Coordinator', ['dashboard.view','dashboard.export','units.view','plans.view','plans.manage','tasks.manage','opportunities.view','opportunities.manage','opportunities.import','products.view','support.view','support.manage','meetings.view','meetings.manage','leads.view','development.view','development.manage','recruitment.view','recruitment.manage','reports.view','reports.manage','documents.view','directory.view','events.view','events.manage','procurement.view','teams.view','departments.view','projects.view']],
        'operations' => ['Operations', ['dashboard.view','dashboard.export','units.view','opportunities.view','opportunities.manage','opportunities.import','products.view','meetings.view','leads.view','leads.manage','leads.convert','documents.view','directory.view','teams.view','departments.view','projects.view']],
        'unit_director' => ['Unit Director', ['dashboard.view','dashboard.export','units.view','plans.view','plans.manage','tasks.manage','opportunities.view','products.view','products.manage','support.view','support.manage','meetings.view','meetings.manage','leads.view','leads.manage','leads.convert','development.view','development.manage','recruitment.view','recruitment.manage','reports.view','reports.manage','documents.view','directory.view','directory.manage','events.view','events.manage','procurement.view','procurement.manage','teams.view','teams.manage','departments.view','projects.view','projects.link']],
        'department_manager' => ['Department Manager', ['dashboard.view','units.view','plans.view','products.view','support.view','support.respond','meetings.view','documents.view','directory.view','events.view','teams.view','departments.view','projects.view']],
        'alpha_delta' => ['Alpha Delta Decision Maker', ['dashboard.view','opportunities.view','opportunities.decide','meetings.view','reports.view','reports.manage','documents.view','directory.view']],
        'pr_marketing' => ['PR & Marketing', ['dashboard.view','units.view','meetings.view','documents.view','documents.manage','directory.view','directory.manage','events.view','events.manage','procedures.manage','procurement.view','procurement.manage','recruitment.view','onboarding.respond','reports.view','reports.manage','social.manage','teams.view','departments.view','projects.view']],
        'finance' => ['Finance', ['dashboard.view','units.view','procurement.view','procurement.review','documents.view','directory.view','meetings.view','teams.view','departments.view','projects.view']],
        'hr' => ['Human Resources', ['dashboard.view','units.view','recruitment.view','recruitment.manage','onboarding.respond','directory.view','directory.manage','documents.view','meetings.view','teams.view','departments.view']],
        'it' => ['IT', ['dashboard.view','units.view','recruitment.view','onboarding.respond','support.view','support.respond','documents.view','directory.view','meetings.view','teams.view','departments.view','projects.view']],
        'employee' => ['Employee', ['dashboard.view','units.view','plans.view','tasks.update_own','support.view','products.view','meetings.view','documents.view','directory.view','events.view','development.view','teams.view','departments.view','projects.view']],
        // Stage B1: unit-scoped lead of one or more teams (not a global-scope role).
        'team_lead' => ['Team Lead', ['dashboard.view','units.view','plans.view','tasks.update_own','support.view','products.view','meetings.view','documents.view','directory.view','events.view','development.view','teams.view','teams.manage_own','departments.view','projects.view']],
    ];

    public function run(): void
    {
        $parent = BusinessUnit::updateOrCreate(['slug'=>'alpha-iota'],[
            'name'=>'Alpha Iota','description'=>'Parent business group','services'=>[],'is_active'=>true,
        ]);
        foreach (['Alpha X','Alpha Gen','Alpha Omega','Alpha Delta'] as $name) {
            BusinessUnit::updateOrCreate(['slug'=>Str::slug($name)],[
                'parent_id'=>$parent->id,'name'=>$name,'is_active'=>true,'services'=>[],
            ]);
        }
        foreach (self::ROLES as $slug => $role) {
            $this->seedRole($slug, $role[0], $role[1]);
        }
        foreach (['Kraken','Argus'] as $name) Product::firstOrCreate(['product_name'=>$name]);
        $stages=[['identified','Identified','محددة'],['qualified','Qualified','مؤهلة'],['contacted','Contacted','تم التواصل'],['meeting','Meeting','اجتماع'],['collaboration','Collaboration','تعاون'],['converted','Converted','تم التحويل'],['closed','Closed','مغلق']];
        foreach($stages as $index=>$stage)\App\Models\BMS\PipelineStage::updateOrCreate(['code'=>$stage[0]],['name'=>$stage[1],'name_ar'=>$stage[2],'sequence'=>$index+1,'is_active'=>true]);

        // Preserve access for existing Management users on the first deployment;
        // they can subsequently assign the narrower BRD roles from the API.
        if (config('bms.seed_existing_admins')) {
            $admin=BmsRole::where('slug','system_admin')->first();
            $ids=config('bms.admin_sub_department_ids', [1, 4]);
            foreach (\App\Models\User::whereIn('sub_departments_id',$ids)->get() as $user) {
                $user->bmsRoles()->syncWithoutDetaching([$admin->id=>['business_unit_id'=>null]]);
            }
        }
    }

    /**
     * Non-destructive role seeding. Re-running the seeder on an installation
     * must never undo what an administrator configured:
     *  - a role that does not exist is created with the default name and abilities;
     *  - an existing role keeps its name, all its abilities and their order;
     *  - only default abilities the role does not hold yet are appended;
     *  - a role carrying `*` is never modified (it already implies everything).
     * The same rule applies to every role, team_lead included.
     */
    private function seedRole(string $slug, string $name, array $defaults): void
    {
        $role = BmsRole::where('slug', $slug)->first();
        if (!$role) {
            BmsRole::create(['slug' => $slug, 'name' => $name, 'abilities' => $defaults]);
            return;
        }

        $current = array_values(is_array($role->abilities) ? $role->abilities : []);
        if (in_array('*', $current, true)) return;

        $missing = array_values(array_diff($defaults, $current));
        if ($missing === []) return;

        $role->abilities = array_merge($current, $missing);
        $role->save();
    }
}
