<?php
namespace App\Http\Controllers\BMS;

use App\Models\BMS\BusinessUnit;
use App\Models\BMS\Opportunity;
use App\Models\BMS\SocialMetric;
use App\Models\BMS\SupportRequest;
use App\Models\BMS\UnitKpi;
use App\Models\BMS\UnitTask;
use App\Models\BMS\WeeklyPlan;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ReportController extends BmsController
{
    public function monthly(Request $request)
    {
        $data=$request->validate(['month'=>'nullable|date_format:Y-m','business_unit_id'=>'nullable|exists:business_units,id']);
        $start=!empty($data['month'])?Carbon::createFromFormat('Y-m',$data['month'])->startOfMonth():now()->startOfMonth();$end=$start->copy()->endOfMonth();
        if(!empty($data['business_unit_id']))$this->access->authorizeUnit((int)$data['business_unit_id']);
        $unitId=$data['business_unit_id']??null;$ids=$this->access->visibleUnitIds();
        $units=BusinessUnit::when($unitId,fn($q)=>$q->where('id',$unitId))->when($ids!==null,fn($q)=>$q->whereIn('id',$ids))->orderBy('name')->get();
        $tasks=UnitTask::with('unit:id,name')->whereBetween('updated_at',[$start,$end])->when($unitId,fn($q)=>$q->where('business_unit_id',$unitId))->when($ids!==null,fn($q)=>$q->whereIn('business_unit_id',$ids))->get();
        $support=SupportRequest::with(['unit:id,name','department'])->whereBetween('created_at',[$start,$end])->when($unitId,fn($q)=>$q->where('business_unit_id',$unitId))->when($ids!==null,fn($q)=>$q->whereIn('business_unit_id',$ids))->get();
        $opportunities=Opportunity::with(['unit:id,name','product:id,product_name'])->whereBetween('last_update_at',[$start,$end])->when($unitId,fn($q)=>$q->where('business_unit_id',$unitId))->when($ids!==null,fn($q)=>$q->whereIn('business_unit_id',$ids))->get();
        $products=Product::with(['businessUnits:id,name','phases','currentPhase'])->when($unitId,fn($q)=>$q->whereHas('businessUnits',fn($u)=>$u->where('business_units.id',$unitId)))->get();
        $unitRows=$units->map(function($unit)use($tasks,$support){$own=$tasks->where('business_unit_id',$unit->id);$needs=$support->where('business_unit_id',$unit->id);return ['unit'=>$unit,'tasks_total'=>$own->count(),'achievements'=>$own->where('status','achieved')->values(),'in_progress'=>$own->where('status','in_progress')->count(),'not_done'=>$own->where('status','not_done')->count(),'average_progress'=>$own->count()?(int)round($own->avg('progress')):0,'support_needs'=>$needs->values()];})->values();
        return $this->ok(['report_type'=>'Monthly performance','period'=>['start'=>$start->toDateString(),'end'=>$end->toDateString()],'generated_at'=>now(),'units'=>$unitRows,'products'=>$products,'opportunities'=>$opportunities->values(),'summary'=>['achievements'=>$tasks->where('status','achieved')->count(),'in_progress'=>$tasks->where('status','in_progress')->count(),'support_requests'=>$support->count(),'open_support'=>$support->where('status','!=','resolved')->count(),'products'=>$products->count(),'opportunities_updated'=>$opportunities->count()]]);
    }
    public function quarterly(Request $request)
    {
        $data=$request->validate(['business_unit_id'=>'nullable|exists:business_units,id','period_start'=>'nullable|date','period_end'=>'nullable|date|after_or_equal:period_start']);
        $unitId=$data['business_unit_id']??BusinessUnit::where('slug','alpha-delta')->value('id');abort_unless($unitId,404,'Alpha Delta is not configured.');$this->access->authorizeUnit((int)$unitId);
        $end=!empty($data['period_end'])?Carbon::parse($data['period_end']):now();$start=!empty($data['period_start'])?Carbon::parse($data['period_start']):$end->copy()->subDays(89);
        $kpis=UnitKpi::with('unit')->where('business_unit_id',$unitId)->whereDate('period_start','>=',$start)->whereDate('period_end','<=',$end)->get()->map(function($kpi){$kpi->attainment=$kpi->target&&$kpi->target>0?round($kpi->actual/$kpi->target*100,1):null;return $kpi;});
        return $this->ok(['report_type'=>'90-day KPI report','unit'=>BusinessUnit::find($unitId),'period'=>['start'=>$start->toDateString(),'end'=>$end->toDateString()],'kpis'=>$kpis]);
    }
    public function saveKpi(Request $request)
    {
        $data=$request->validate(['business_unit_id'=>'required|exists:business_units,id','name'=>'required|string|max:200','target'=>'nullable|numeric','actual'=>'required|numeric','unit_label'=>'nullable|string|max:40','period_start'=>'required|date','period_end'=>'required|date|after_or_equal:period_start','id'=>'nullable|exists:bms_unit_kpis,id']);
        $this->access->authorizeUnit((int)$data['business_unit_id']);$id=$data['id']??null;unset($data['id']);$kpi=UnitKpi::updateOrCreate(['id'=>$id],$data+['updated_by'=>$this->access->user()->id]);
        $this->audit->record($kpi,'unit_kpi.saved',[],$kpi->toArray());return $this->ok($kpi,'KPI saved');
    }
    public function social(Request $request)
    {
        $data=$request->validate(['period_start'=>'nullable|date','period_end'=>'nullable|date|after_or_equal:period_start']);
        $end=!empty($data['period_end'])?Carbon::parse($data['period_end']):now();$start=!empty($data['period_start'])?Carbon::parse($data['period_start']):$end->copy()->subMonths(6);
        $metrics=SocialMetric::whereDate('period_start','>=',$start)->whereDate('period_end','<=',$end)->get();
        return $this->ok(['report_type'=>'Six-month social media report','period'=>['start'=>$start->toDateString(),'end'=>$end->toDateString()],'metrics'=>$metrics,'summary'=>['followers'=>$metrics->sum('followers'),'posts'=>$metrics->sum('posts'),'engagement'=>$metrics->sum('engagement')]]);
    }
    public function saveSocial(Request $request)
    {
        $data=$request->validate(['platform'=>'required|string|max:100','followers'=>'required|integer|min:0','posts'=>'required|integer|min:0','engagement'=>'required|integer|min:0','period_start'=>'required|date','period_end'=>'required|date|after_or_equal:period_start']);
        $metric=SocialMetric::updateOrCreate(['platform'=>$data['platform'],'period_start'=>$data['period_start'],'period_end'=>$data['period_end']],$data+['created_by'=>$this->access->user()->id]);
        $this->audit->record($metric,'social_metric.saved',[],$metric->toArray());return $this->ok($metric,'Social media metrics saved');
    }
}
