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
        'executive' => ['Executive Management', ['dashboard.view','dashboard.export','units.view','plans.view','opportunities.view','products.view','support.view']],
        'operations' => ['Operations', ['dashboard.view','dashboard.export','units.view','plans.view','opportunities.view','opportunities.manage','opportunities.import','products.view','support.view']],
        'unit_director' => ['Unit Director', ['dashboard.view','dashboard.export','units.view','plans.view','plans.manage','tasks.manage','opportunities.view','products.view','products.manage','support.view','support.manage']],
        'department_manager' => ['Department Manager', ['dashboard.view','units.view','plans.view','products.view','support.view','support.respond']],
        'alpha_delta' => ['Alpha Delta Decision Maker', ['dashboard.view','opportunities.view','opportunities.decide']],
        'employee' => ['Employee', ['units.view','plans.view','tasks.update_own','support.view','support.manage','products.view']],
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

        // Preserve access for existing Management users on the first deployment;
        // they can subsequently assign the narrower BRD roles from the API.
        $admin=BmsRole::where('slug','system_admin')->first();
        foreach (\App\Models\User::where('sub_departments_id',1)->get() as $user) {
            $user->bmsRoles()->syncWithoutDetaching([$admin->id=>['business_unit_id'=>null]]);
        }
    }
}
