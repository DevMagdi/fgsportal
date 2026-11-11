<?php
namespace App\Http\Controllers\BMS;

use App\Models\BMS\BmsRole;
use App\Models\Department;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

class LookupController extends BmsController
{
    public function index()
    {
        return $this->ok([
            'users'=>User::orderBy('username')->get(['id','username','firstname','lastname','email']),
            'units'=>\App\Models\BMS\BusinessUnit::orderBy('name')->get(['id','name','parent_id']),
            'departments'=>Department::orderBy('department_name')->get(['id','department_name']),
            'products'=>Product::orderBy('product_name')->get(['id','product_name']),
            'roles'=>BmsRole::orderBy('name')->get(['id','name','slug','abilities']),
            'abilities'=>array_values(array_unique(array_merge(...BmsRole::pluck('abilities')->map(fn($a)=>$a?:[])->all() ?: [[]]))),
            'can'=>$this->currentAbilities(),
        ]);
    }

    public function assignRole(Request $request)
    {
        $data=$request->validate(['user_id'=>'required|exists:users,id','role_id'=>'required|exists:bms_roles,id','business_unit_id'=>'nullable|exists:business_units,id']);
        User::findOrFail($data['user_id'])->bmsRoles()->syncWithoutDetaching([
            $data['role_id']=>['business_unit_id'=>$data['business_unit_id']??null]
        ]);
        return $this->ok(null,'BMS role assigned');
    }

    public function revokeRole(Request $request)
    {
        $data=$request->validate(['user_id'=>'required|exists:users,id','role_id'=>'required|exists:bms_roles,id','business_unit_id'=>'nullable|exists:business_units,id']);
        $relation=User::findOrFail($data['user_id'])->bmsRoles();
        if (empty($data['business_unit_id'])) $relation->wherePivotNull('business_unit_id');
        else $relation->wherePivot('business_unit_id',$data['business_unit_id']);
        $relation->detach($data['role_id']);
        return $this->ok(null,'BMS role revoked');
    }

    private function currentAbilities(): array
    {
        $all=['dashboard.view','dashboard.export','units.view','units.manage','plans.view','plans.manage','tasks.manage','tasks.update_own','opportunities.view','opportunities.manage','opportunities.decide','opportunities.import','products.view','products.manage','support.view','support.manage','support.respond','roles.manage'];
        return collect($all)->filter(fn($a)=>$this->access->can($a))->values()->all();
    }
}
