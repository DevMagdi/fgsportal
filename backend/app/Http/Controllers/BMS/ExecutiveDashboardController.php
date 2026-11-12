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
        $closedStages=['won','lost','declined','closed'];
        $opportunities=$opportunityQuery->latest('last_update_at')->get()->map(function($item)use($closedStages){
            $item->is_delayed=$item->expected_close_date&&$item->expected_close_date->isBefore(today())&&!in_array($item->stage,$closedStages,true);
            // A record without any update timestamp is stale too, not "fresh".
            $item->has_no_update=($item->last_update_at??$item->created_at)
                && ($item->last_update_at??$item->created_at)->lt(now()->subDays(config('bms.opportunity_no_update_days')));return $item;
        });
        $productQuery=Product::with(['businessUnits','phases','currentPhase'])
            ->when($filters['product_id']??null,fn($q,$v)=>$q->where('id',$v))
            ->when($filters['business_unit_id']??null,fn($q,$v)=>$q->whereHas('businessUnits',fn($p)=>$p->where('business_units.id',$v)))
            ->when($visibleUnits!==null,fn($q)=>$q->whereHas('businessUnits',fn($p)=>$p->whereIn('business_units.id',$visibleUnits)));
        $products=$productQuery->orderBy('product_name')->get();
        // Pending work that needs management attention (BRD §5.1): procurement
        // awaiting the Finance decision and meetings starting within a week.
        $procurementQuery=\App\Models\BMS\ProcurementRequest::query()
            ->when($visibleUnits!==null,fn($q)=>$q->whereIn('business_unit_id',$visibleUnits))
            ->when($filters['business_unit_id']??null,fn($q,$v)=>$q->where('business_unit_id',$v));
        $meetingQuery=\App\Models\BMS\Meeting::with('unit:id,name')
            ->whereBetween('starts_at',[now(),now()->addDays(7)])
            ->where('status','!=','cancelled')
            ->when($visibleUnits!==null,fn($q)=>$q->whereIn('business_unit_id',$visibleUnits))
            ->when($filters['business_unit_id']??null,fn($q,$v)=>$q->where('business_unit_id',$v));
        $procurementPending=$procurementQuery->where('status','submitted')->count();
        $meetings=$meetingQuery->orderBy('starts_at')->limit(10)->get(['id','title','starts_at','ends_at','location','business_unit_id','status']);
        $recent=$this->recentActivity($visibleUnits, isset($filters['business_unit_id']) ? (int) $filters['business_unit_id'] : null);

        return $this->ok([
            'generated_at'=>now(),'filters'=>$filters,'unit_progress'=>$unitProgress,
            'procurement'=>['pending'=>$procurementPending],
            'meetings'=>$meetings,'recent_activity'=>$recent,
            'tenders'=>[
                'total'=>$opportunities->where('type','tender')->count(),
                'submitted'=>$opportunities->where('type','tender')->whereIn('stage',['submission','submitted'])->count(),
                'delayed'=>$opportunities->where('type','tender')->where('is_delayed',true)->count(),
                'no_update'=>$opportunities->where('type','tender')->where('has_no_update',true)->count(),
            ],
            'employee_tasks'=>array_slice((new \App\Services\BMS\EmployeeTaskRollup())->summarize($this->access->canViewTeamTasks()?$tasks:$tasks->where('owner_id',$this->access->user()->id),false),0,10),
            'opportunities'=>$opportunities->values(),'products'=>$products,
            'summary'=>['units'=>$units->count(),'tasks'=>$tasks->count(),'achieved'=>$tasks->where('status','achieved')->count(),
                'blocked_tasks'=>$tasks->filter(fn($t)=>!empty($t->blockers))->count(),
                'opportunities'=>$opportunities->count(),'delayed_opportunities'=>$opportunities->where('is_delayed',true)->count(),
                'stale_opportunities'=>$opportunities->where('has_no_update',true)->count(),'products'=>$products->count(),
                'pending_procurement'=>$procurementPending,'upcoming_meetings'=>$meetings->count(),
                'overdue_tasks'=>$tasks->filter(fn($t)=>$t->status!=='achieved'&&$t->due_date&&$t->due_date->lt(today()))->count()],
        ]);
    }

    /** Latest audited business events inside the viewer's scope (BRD §5.1). */
    private function recentActivity(?array $visibleUnits, ?int $selectedUnitId = null): array
    {
        $allowed = [
            'BusinessUnit', 'UnitTask', 'Opportunity', 'Product', 'Meeting', 'Lead',
            'ProcurementRequest', 'WeeklyPlan', 'SupportRequest', 'Recruitment', 'Event',
            'TeamDocument', 'UnitKpi', 'ProductPhase',
        ];
        $logs = \App\Models\BMS\BmsAuditLog::with('user:id,username')->latest()->limit(120)->get();
        $unitCache = [];
        $rows = [];
        foreach ($logs as $log) {
            $type = class_basename($log->auditable_type);
            // Only business records are listed; user/role/audit noise is excluded so
            // the widget cannot become a directory of other units' staff.
            if (!in_array($type, $allowed, true)) continue;
            // Composite key: ids are only unique inside one model type.
            $cacheKey = $type.':'.$log->auditable_id;
            if (!array_key_exists($cacheKey, $unitCache)) {
                $model = $log->auditable; // may be null when the record was hard-deleted
                $unitIds = [];
                if ($model) {
                    if ($type === 'BusinessUnit') {
                        $unitIds[] = (int) $model->id;
                    } elseif (!empty($model->business_unit_id)) {
                        $unitIds[] = (int) $model->business_unit_id;
                    } elseif (method_exists($model, 'businessUnits')) {
                        $unitIds = $model->businessUnits()->pluck('business_units.id')->map(fn ($id) => (int) $id)->all();
                    } elseif (method_exists($model, 'unit')) {
                        $unitId = optional($model->unit)->id;
                        if ($unitId !== null) $unitIds[] = (int) $unitId;
                    } elseif (method_exists($model, 'product')) {
                        $product = $model->product;
                        if ($product && method_exists($product, 'businessUnits')) {
                            $unitIds = $product->businessUnits()->pluck('business_units.id')->map(fn ($id) => (int) $id)->all();
                        }
                    }
                }
                $unitCache[$cacheKey] = array_values(array_unique($unitIds));
            }
            $unitIds = $unitCache[$cacheKey];
            if ($visibleUnits !== null && !array_intersect($unitIds, $visibleUnits)) {
                // Unknown scope is never disclosed; only records positively inside the scope are shown.
                continue;
            }
            if ($selectedUnitId !== null && !in_array($selectedUnitId, $unitIds, true)) {
                // Keep the recent-activity panel synchronized with the dashboard's unit filter.
                continue;
            }
            $rows[] = [
                'event' => $log->event, 'at' => $log->created_at, 'by' => $log->user->username ?? null,
                'type' => $type, 'id' => $log->auditable_id,
            ];
            if (count($rows) >= 12) break;
        }
        return $rows;
    }
}
