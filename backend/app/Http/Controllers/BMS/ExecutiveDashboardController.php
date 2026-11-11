<?php
namespace App\Http\Controllers\BMS;

use App\Models\BMS\BusinessUnit;
use App\Models\BMS\Opportunity;
use App\Models\BMS\UnitTask;
use App\Models\Product;
use Illuminate\Http\Request;

class ExecutiveDashboardController extends BmsController
{
    public function index(Request $request)
    {
        $filters=$request->validate([
            'business_unit_id'=>'nullable|exists:business_units,id','product_id'=>'nullable|exists:products,id',
            'opportunity_id'=>'nullable|exists:bms_opportunities,id','week_start'=>'nullable|date',
        ]);
        if (!empty($filters['opportunity_id'])) {
            $selected=Opportunity::findOrFail($filters['opportunity_id']);
            if($selected->business_unit_id)$this->access->authorizeUnit((int)$selected->business_unit_id);
            if (empty($filters['business_unit_id']) && $selected->business_unit_id) $filters['business_unit_id']=$selected->business_unit_id;
            if (empty($filters['product_id']) && $selected->product_id) $filters['product_id']=$selected->product_id;
        }
        if (!empty($filters['business_unit_id'])) $this->access->authorizeUnit((int)$filters['business_unit_id']);

        $visibleUnits=$this->access->visibleUnitIds();
        $units=BusinessUnit::with('director:id,username')->when($filters['business_unit_id']??null,fn($q,$v)=>$q->where('id',$v))->when($visibleUnits!==null,fn($q)=>$q->whereIn('id',$visibleUnits))->orderBy('name')->get();
        $taskQuery=UnitTask::query()->when($filters['business_unit_id']??null,fn($q,$v)=>$q->where('business_unit_id',$v))->when($visibleUnits!==null,fn($q)=>$q->whereIn('business_unit_id',$visibleUnits));
        if (!empty($filters['week_start'])) $taskQuery->whereHas('plan',fn($q)=>$q->whereDate('week_start',$filters['week_start']));
        if (!empty($filters['product_id'])) {
            $unitIds=Product::findOrFail($filters['product_id'])->businessUnits()->pluck('business_units.id');
            $taskQuery->whereIn('business_unit_id',$unitIds);$units=$units->whereIn('id',$unitIds);
        }
        $tasks=$taskQuery->with('owner:id,username')->get();
        $unitProgress=$units->map(function($unit)use($tasks){
            $items=$tasks->where('business_unit_id',$unit->id);$total=$items->count();
            return ['id'=>$unit->id,'name'=>$unit->name,'director'=>$unit->director,'total'=>$total,
                'achieved'=>$items->where('status','achieved')->count(),'in_progress'=>$items->where('status','in_progress')->count(),
                'not_done'=>$items->where('status','not_done')->count(),'blocked'=>$items->filter(fn($t)=>!empty($t->blockers))->count(),
                'progress'=>$total?(int)round($items->avg('progress')):0];
        })->values();

        $opportunityQuery=Opportunity::with(['unit','product','owner:id,username'])->filter($filters)->when($visibleUnits!==null,fn($q)=>$q->where(function($scoped)use($visibleUnits){$scoped->whereIn('business_unit_id',$visibleUnits)->orWhere('owner_id',$this->access->user()->id);}));
        $opportunities=$opportunityQuery->latest('last_update_at')->get()->map(function($item){
            $item->is_delayed=$item->expected_close_date&&$item->expected_close_date->isBefore(today())&&!in_array($item->stage,['won','lost','declined'],true);
            $item->has_no_update=$item->last_update_at&&$item->last_update_at->lt(now()->subDays(config('bms.opportunity_no_update_days')));return $item;
        });
        $productQuery=Product::with(['businessUnits','phases','currentPhase'])
            ->when($filters['product_id']??null,fn($q,$v)=>$q->where('id',$v))
            ->when($filters['business_unit_id']??null,fn($q,$v)=>$q->whereHas('businessUnits',fn($p)=>$p->where('business_units.id',$v)))
            ->when($visibleUnits!==null,fn($q)=>$q->whereHas('businessUnits',fn($p)=>$p->whereIn('business_units.id',$visibleUnits)));
        $products=$productQuery->orderBy('product_name')->get();
        return $this->ok([
            'generated_at'=>now(),'filters'=>$filters,'unit_progress'=>$unitProgress,
            'tenders'=>[
                'total'=>$opportunities->where('type','tender')->count(),
                'submitted'=>$opportunities->where('type','tender')->whereIn('stage',['submission','submitted'])->count(),
                'delayed'=>$opportunities->where('type','tender')->where('is_delayed',true)->count(),
                'no_update'=>$opportunities->where('type','tender')->where('has_no_update',true)->count(),
            ],
            'opportunities'=>$opportunities->values(),'products'=>$products,
            'summary'=>['units'=>$units->count(),'tasks'=>$tasks->count(),'achieved'=>$tasks->where('status','achieved')->count(),
                'blocked_tasks'=>$tasks->filter(fn($t)=>!empty($t->blockers))->count(),
                'opportunities'=>$opportunities->count(),'delayed_opportunities'=>$opportunities->where('is_delayed',true)->count(),
                'stale_opportunities'=>$opportunities->where('has_no_update',true)->count(),'products'=>$products->count()],
        ]);
    }
}
