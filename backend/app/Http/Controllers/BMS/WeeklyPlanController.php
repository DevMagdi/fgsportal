<?php
namespace App\Http\Controllers\BMS;

use App\Models\BMS\SupportRequest;
use App\Models\BMS\UnitTask;
use App\Models\BMS\WeeklyPlan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class WeeklyPlanController extends BmsController
{
    public function index(Request $request)
    {
        $request->validate(['business_unit_id'=>'nullable|exists:business_units,id','week_start'=>'nullable|date']);
        $query=WeeklyPlan::with(['unit','creator:id,username','submitter:id,username','tasks.owner:id,username','supportRequests.department']);
        if ($request->business_unit_id) $query->where('business_unit_id',$request->business_unit_id);
        if ($request->week_start) $query->whereDate('week_start',$request->week_start);
        if (!$this->access->roles()->contains(fn($r)=>in_array($r->slug,['system_admin','executive','operations'],true))) {
            $query->whereIn('business_unit_id',$this->access->units());
        }
        return $this->ok($query->latest('week_start')->get());
    }

    public function store(Request $request)
    {
        $data=$request->validate([
            'business_unit_id'=>'required|exists:business_units,id','week_start'=>'required|date',
            'objectives'=>'nullable|string','next_week_plan'=>'nullable|string',
        ]);
        abort_unless(Carbon::parse($data['week_start'])->isSunday(),422,'The week must start on Sunday.');
        $this->access->authorizeUnit((int)$data['business_unit_id']);
        $plan=WeeklyPlan::create($data+['created_by'=>$this->access->user()->id,'status'=>'draft']);
        $this->audit->record($plan,'weekly_plan.created',[],$plan->toArray());
        return $this->ok($plan->load(['unit','tasks','supportRequests']),'Weekly plan created',201);
    }

    public function show(WeeklyPlan $plan)
    {
        $this->access->authorizeUnit($plan->business_unit_id);
        return $this->ok($plan->load(['unit','creator','submitter','tasks.owner','supportRequests.department','supportRequests.requester']));
    }

    public function update(Request $request, WeeklyPlan $plan)
    {
        $this->access->authorizeUnit($plan->business_unit_id);
        abort_if($plan->status==='submitted',422,'A submitted weekly plan is read-only.');
        $data=$request->validate(['objectives'=>'nullable|string','next_week_plan'=>'nullable|string']);
        $old=$plan->only(array_keys($data)); $plan->update($data);
        $this->audit->record($plan,'weekly_plan.updated',$old,$plan->only(array_keys($data)));
        return $this->ok($plan);
    }

    public function submit(WeeklyPlan $plan)
    {
        $this->access->authorizeUnit($plan->business_unit_id);
        abort_if($plan->status==='submitted',422,'This plan has already been submitted.');
        $old=$plan->only('status');
        $plan->update(['status'=>'submitted','submitted_by'=>$this->access->user()->id,'submitted_at'=>now()]);
        $this->audit->record($plan,'weekly_plan.submitted',$old,$plan->only(['status','submitted_by','submitted_at']));
        return $this->ok($this->report($plan)->getData()->data,'Weekly plan submitted');
    }

    public function report(WeeklyPlan $plan)
    {
        $this->access->authorizeUnit($plan->business_unit_id);
        $plan->load(['unit','tasks.owner','supportRequests.department','supportRequests.requester']);
        $tasks=$plan->tasks;
        return $this->ok([
            'report_type'=>'Sunday unit report','generated_at'=>now(),'week_start'=>$plan->week_start,
            'unit'=>$plan->unit,'objectives'=>$plan->objectives,'next_week_plan'=>$plan->next_week_plan,
            'summary'=>[
                'total'=>$tasks->count(),'achieved'=>$tasks->where('status','achieved')->count(),
                'in_progress'=>$tasks->where('status','in_progress')->count(),
                'not_done'=>$tasks->where('status','not_done')->count(),
                'blocked'=>$tasks->whereNotNull('blockers')->where('blockers','!=','')->count(),
                'support_pending'=>$plan->supportRequests->where('status','pending')->count(),
            ],
            'tasks'=>$tasks,'support_requests'=>$plan->supportRequests,
        ]);
    }

    public function storeTask(Request $request, WeeklyPlan $plan)
    {
        $this->access->authorizeUnit($plan->business_unit_id);
        abort_if($plan->status==='submitted',422,'A submitted weekly plan is read-only.');
        $data=$this->taskData($request);
        if(($data['status']??'in_progress')==='achieved'&&empty($data['completion_date']))$data['completion_date']=today();
        $task=$plan->tasks()->create($data+['business_unit_id'=>$plan->business_unit_id,'updated_by'=>$this->access->user()->id]);
        $this->audit->record($task,'task.created',[],$task->toArray());
        return $this->ok($task->load('owner'),'Task created',201);
    }

    public function updateTask(Request $request, UnitTask $task)
    {
        $this->access->authorizeUnit($task->business_unit_id);
        if (!$this->access->can('tasks.manage')) abort_unless($task->owner_id===$this->access->user()->id,403,'You can only update your own tasks.');
        $data=$this->taskData($request,false);
        if(($data['status']??$task->status)==='achieved'&&empty($task->completion_date)&&empty($data['completion_date']))$data['completion_date']=today();
        if(($data['status']??null)&&$data['status']!=='achieved')$data['completion_date']=null;
        $old=$task->only(array_keys($data)); $data['updated_by']=$this->access->user()->id;
        $task->update($data);
        $this->audit->record($task,'task.updated',$old,$task->only(array_keys($data)));
        return $this->ok($task->load('owner'));
    }

    public function storeSupport(Request $request, WeeklyPlan $plan)
    {
        $this->access->authorizeUnit($plan->business_unit_id);
        $data=$request->validate(['department_id'=>'required|exists:departments,id','title'=>'required|string|max:200','details'=>'required|string']);
        $support=$plan->supportRequests()->create($data+['business_unit_id'=>$plan->business_unit_id,'requested_by'=>$this->access->user()->id,'status'=>'pending']);
        $this->audit->record($support,'support.created',[],$support->toArray());
        return $this->ok($support->load(['department','requester']),'Support request created',201);
    }

    public function updateSupport(Request $request, SupportRequest $support)
    {
        $data=$request->validate(['status'=>['required',Rule::in(['pending','in_progress','resolved','rejected'])],'response'=>'nullable|string']);
        if ($this->access->can('support.manage')) {
            $this->access->authorizeUnit($support->business_unit_id);
        } else {
            $this->access->authorize('support.respond');
            $belongsToTargetDepartment=\App\Models\SubDepartment::where('departments_id',$support->department_id)
                ->where('id',$this->access->user()->sub_departments_id)->exists();
            abort_unless($belongsToTargetDepartment,403,'You can only respond to requests addressed to your department.');
        }
        $old=$support->only(array_keys($data));
        if ($data['status']!==$support->status || array_key_exists('response',$data)) {
            $data+=['responded_by'=>$this->access->user()->id,'responded_at'=>now()];
        }
        $support->update($data);
        $this->audit->record($support,'support.status_changed',$old,$support->only(array_keys($data)));
        return $this->ok($support->load(['department','requester','responder']));
    }

    private function taskData(Request $request,bool $creating=true): array
    {
        return $request->validate([
            'title'=>($creating?'required':'sometimes').'|string|max:200','description'=>'nullable|string',
            'owner_id'=>'nullable|exists:users,id','status'=>['sometimes',Rule::in(['achieved','in_progress','not_done'])],
            'progress'=>'sometimes|integer|min:0|max:100','blockers'=>'nullable|string','due_date'=>'nullable|date','completion_date'=>'nullable|date',
        ]);
    }
}
