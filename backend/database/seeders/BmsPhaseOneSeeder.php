<?php
namespace Database\Seeders;

use App\Models\BMS\BmsRole;
use App\Models\BMS\BusinessUnit;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BmsPhaseOneSeeder extends Seeder
{
    public const ROLES = [
        'system_admin' => ['System Administrator', ['*']],
        'executive' => ['Executive Management', ['dashboard.view','dashboard.export','units.view','plans.view','opportunities.view','products.view','support.view','meetings.view','leads.view','development.view','reports.view','documents.view','directory.view','events.view']],
        'coordinator' => ['Business Unit Coordinator', ['dashboard.view','dashboard.export','units.view','plans.view','plans.manage','tasks.manage','opportunities.view','opportunities.manage','opportunities.import','products.view','support.view','support.manage','meetings.view','meetings.manage','leads.view','development.view','development.manage','recruitment.view','recruitment.manage','reports.view','reports.manage','documents.view','directory.view','events.view','events.manage','procurement.view']],
        'operations' => ['Operations', ['dashboard.view','dashboard.export','units.view','opportunities.view','opportunities.manage','opportunities.import','products.view','meetings.view','leads.view','leads.manage','leads.convert','documents.view','directory.view']],
        'unit_director' => ['Unit Director', ['dashboard.view','dashboard.export','units.view','plans.view','plans.manage','tasks.manage','opportunities.view','products.view','products.manage','support.view','support.manage','meetings.view','meetings.manage','leads.view','leads.manage','leads.convert','development.view','development.manage','recruitment.view','recruitment.manage','reports.view','reports.manage','documents.view','directory.view','directory.manage','events.view','events.manage','procurement.view','procurement.manage']],
        'department_manager' => ['Department Manager', ['dashboard.view','units.view','plans.view','products.view','support.view','support.respond','meetings.view','documents.view','directory.view','events.view']],
        'alpha_delta' => ['Alpha Delta Decision Maker', ['dashboard.view','opportunities.view','opportunities.decide','meetings.view','reports.view','reports.manage','documents.view','directory.view']],
        'pr_marketing' => ['PR & Marketing', ['dashboard.view','units.view','meetings.view','documents.view','documents.manage','directory.view','directory.manage','events.view','events.manage','procedures.manage','procurement.view','procurement.manage','recruitment.view','onboarding.respond','reports.view','reports.manage','social.manage']],
        'finance' => ['Finance', ['dashboard.view','units.view','procurement.view','procurement.review','documents.view','directory.view','meetings.view']],
        'hr' => ['Human Resources', ['dashboard.view','units.view','recruitment.view','recruitment.manage','onboarding.respond','directory.view','directory.manage','documents.view','meetings.view']],
        'it' => ['IT', ['dashboard.view','units.view','recruitment.view','onboarding.respond','support.view','support.respond','documents.view','directory.view','meetings.view']],
        'employee' => ['Employee', ['dashboard.view','units.view','plans.view','tasks.update_own','support.view','products.view','meetings.view','documents.view','directory.view','events.view','development.view']],
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
            BmsRole::updateOrCreate(['slug'=>$slug],['name'=>$role[0],'abilities'=>$role[1]]);
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
}
