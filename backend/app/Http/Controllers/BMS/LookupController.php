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
        $visibleUnits=$this->access->visibleUnitIds();
        $units=\App\Models\BMS\BusinessUnit::when($visibleUnits!==null,fn($q)=>$q->whereIn('id',$visibleUnits))->orderBy('name')->get(['id','name','parent_id']);
        $products=Product::when($visibleUnits!==null,fn($q)=>$q->whereHas('businessUnits',fn($u)=>$u->whereIn('business_units.id',$visibleUnits)))->orderBy('product_name')->get(['id','product_name']);
        $leads=$this->access->can('leads.view')?\App\Models\BMS\Lead::when($visibleUnits!==null,fn($q)=>$q->whereIn('business_unit_id',$visibleUnits))->orderBy('name')->get(['id','name']):collect();
        $opportunities=$this->access->can('opportunities.view')?\App\Models\BMS\Opportunity::when($visibleUnits!==null,fn($q)=>$q->whereIn('business_unit_id',$visibleUnits))->orderBy('title')->get(['id','title','reference']):collect();
        return $this->ok([
            'current_user'=>$this->access->user()->only(['id','username','email']),
            'users'=>User::orderBy('username')->get(['id','username','firstname','lastname','email']),
            'units'=>$units,
            'departments'=>Department::orderBy('department_name')->get(['id','department_name']),
            'products'=>$products,
            'leads'=>$leads,
            'lead_stages'=>\App\Models\BMS\PipelineStage::where('is_active',true)->orderBy('sequence')->get(),
            'opportunities'=>$opportunities,
            'roles'=>BmsRole::orderBy('name')->get(['id','name','slug','abilities']),
            'abilities'=>array_values(array_unique(array_merge(...BmsRole::pluck('abilities')->map(fn($a)=>$a?:[])->all() ?: [[]]))),
            'can'=>$this->currentAbilities(),
        ]);
    }

    public function assignRole(Request $request)
    {
        $data=$request->validate(['user_id'=>'required|exists:users,id','role_id'=>'required|exists:bms_roles,id','business_unit_id'=>'nullable|exists:business_units,id']);
        $target=User::findOrFail($data['user_id']);
        $target->bmsRoles()->syncWithoutDetaching([
            $data['role_id']=>['business_unit_id'=>$data['business_unit_id']??null]
        ]);
        $this->audit->record($target,'role.assigned',[],$data);
        return $this->ok(null,'BMS role assigned');
    }

    public function revokeRole(Request $request)
    {
        $data=$request->validate(['user_id'=>'required|exists:users,id','role_id'=>'required|exists:bms_roles,id','business_unit_id'=>'nullable|exists:business_units,id']);
        $target=User::findOrFail($data['user_id']);
        $relation=$target->bmsRoles();
        if (empty($data['business_unit_id'])) $relation->wherePivotNull('business_unit_id');
        else $relation->wherePivot('business_unit_id',$data['business_unit_id']);
        $relation->detach($data['role_id']);
        $this->audit->record($target,'role.revoked',[],$data);
        return $this->ok(null,'BMS role revoked');
    }

    private function currentAbilities(): array
    {
        $all=BmsRole::pluck('abilities')->flatMap(fn($abilities)=>$abilities?:[])->unique();
        return $all->filter(fn($a)=>$this->access->can($a))->values()->all();
    }
}
