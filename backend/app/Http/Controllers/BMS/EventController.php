<?php
namespace App\Http\Controllers\BMS;

use App\Models\BMS\EventChecklistItem;
use App\Models\BMS\PrEvent;
use App\Models\BMS\Procedure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class EventController extends BmsController
{
    public function index()
    {
        $query=PrEvent::with(['unit','requester:id,username','checklist.owner:id,username'])->latest('event_date');
        $ids=$this->access->visibleUnitIds();if($ids!==null)$query->where(function($q)use($ids){$q->whereIn('business_unit_id',$ids)->orWhere('requested_by',$this->access->user()->id);});
        return $this->ok($query->get());
    }
    public function store(Request $request)
    {
        $data=$this->data($request);if(!empty($data['business_unit_id']))$this->access->authorizeUnit((int)$data['business_unit_id']);
        $event=PrEvent::create($data+['requested_by'=>$this->access->user()->id]);
        foreach(['Photography','Social media announcement','Visitor entry','Parking','Visitor exit'] as $title)$event->checklist()->create(['title'=>$title]);
        $this->audit->record($event,'event.requested',[],$event->toArray());
        app(\App\Services\BMS\BmsNotifier::class)->notifyRoles(['pr_marketing'],'event.created','New event request',$event->title);
        app(\App\Services\BMS\BmsNotifier::class)->notifyRoles(['pr_marketing'],'event.created','New event request',$event->title);
        return $this->ok($this->load($event),'Event routed to PR',201);
    }
    public function update(Request $request,PrEvent $event)
    {
        $this->authorizeEvent($event);
        $data=$this->data($request,false);$old=$event->only(array_keys($data));$event->update($data);
        $this->audit->record($event,'event.updated',$old,$event->only(array_keys($data)));
        if(($data['status']??null)==='completed')app(\App\Services\BMS\BmsNotifier::class)->notify([$event->requester],'event.completed','Event completed',$event->title);
        if(($data['status']??null)==='completed')app(\App\Services\BMS\BmsNotifier::class)->notify([$event->requester],'event.completed','Event completed',$event->title);
        return $this->ok($this->load($event));
    }
    public function destroy(PrEvent $event)
    {
        $this->authorizeEvent($event);
        DB::transaction(function () use ($event) {
            $old = $event->toArray();
            $event->delete();
            $this->audit->record($event, 'event.deleted', $old, []);
        });
        return $this->ok(null, 'Event deleted');
    }
    public function checklist(Request $request,EventChecklistItem $item)
    {
        $this->authorizeEvent($item->event);
        $data=$request->validate(['status'=>['required',Rule::in(['pending','in_progress','completed'])],'owner_id'=>'nullable|exists:users,id']);
        $old=$item->only(array_keys($data));$item->update($data);$this->audit->record($item,'event.checklist_updated',$old,$data);
        return $this->ok($this->load($item->event));
    }
    public function procedures()
    {
        return $this->ok(Procedure::with('creator:id,username')->where('is_published',true)->latest()->get());
    }
    public function storeProcedure(Request $request)
    {
        $data=$request->validate(['title'=>'required|string|max:200','category'=>'sometimes|string|max:100','content'=>'required|string','is_published'=>'sometimes|boolean']);
        $procedure=Procedure::create($data+['created_by'=>$this->access->user()->id]);$this->audit->record($procedure,'procedure.published',[],$procedure->toArray());
        return $this->ok($procedure,'Procedure published',201);
    }
    public function updateProcedure(Request $request, Procedure $procedure)
    {
        $data = $request->validate([
            'title' => 'sometimes|required|string|max:200',
            'category' => 'sometimes|nullable|string|max:100',
            'content' => 'sometimes|required|string',
            'is_published' => 'sometimes|boolean',
        ]);
        if (array_key_exists('category', $data) && $data['category'] === null) $data['category'] = 'pr_protocol';
        DB::transaction(function () use ($procedure, $data) {
            $old = $procedure->only(array_keys($data));
            $procedure->update($data);
            $this->audit->record($procedure, 'procedure.updated', $old, $procedure->only(array_keys($data)));
        });
        return $this->ok($procedure->load('creator:id,username'));
    }
    public function destroyProcedure(Procedure $procedure)
    {
        DB::transaction(function () use ($procedure) {
            $old = $procedure->toArray();
            $procedure->delete();
            $this->audit->record($procedure, 'procedure.deleted', $old, []);
        });
        return $this->ok(null, 'Procedure deleted');
    }
    private function data(Request $request,bool $creating=true):array
    {
        return $request->validate(['title'=>($creating?'required':'sometimes').'|string|max:200','event_type'=>['sometimes',Rule::in(['agreement_signing','conference','visit','campaign','other'])],'event_date'=>($creating?'required':'sometimes').'|date','venue'=>'nullable|string|max:250','business_unit_id'=>'nullable|exists:business_units,id','status'=>['sometimes',Rule::in(['submitted','planning','ready','completed','cancelled'])],'announcement_plan'=>'nullable|string','visitor_protocol'=>'nullable|string']);
    }
    private function authorizeEvent(PrEvent $event):void
    {
        if($this->access->hasGlobalUnitScope())return;
        if($event->business_unit_id)$this->access->authorizeUnit((int)$event->business_unit_id);
        else abort_unless($event->requested_by===$this->access->user()->id,403);
    }
    private function load(PrEvent $event):PrEvent{return $event->load(['unit','requester:id,username','checklist.owner:id,username']);}
}
