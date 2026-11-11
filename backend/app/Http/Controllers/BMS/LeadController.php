<?php
namespace App\Http\Controllers\BMS;

use App\Models\BMS\Lead;
use App\Models\BMS\Opportunity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class LeadController extends BmsController
{
    public function index(Request $request)
    {
        $filters=$request->validate(['business_unit_id'=>'nullable|exists:business_units,id','stage'=>'nullable|string','search'=>'nullable|string|max:200','ecosystem_plan'=>'nullable|string']);
        $query=Lead::with(['unit','owner:id,username','interactions.creator:id,username','opportunity:id,reference,title','minutes.meeting','studyItems'])->latest('last_contacted_at')->latest();
        $this->scope($query);
        foreach(['business_unit_id','stage','ecosystem_plan'] as $key)if(!empty($filters[$key]))$query->where($key,$filters[$key]);
        if(!empty($filters['search']))$query->where(function($q)use($filters){$q->where('name','like','%'.$filters['search'].'%')->orWhere('sector','like','%'.$filters['search'].'%')->orWhere('contact_name','like','%'.$filters['search'].'%');});
        return $this->ok($query->get());
    }
    public function store(Request $request)
    {
        $data=$this->data($request);$this->authorizeLeadUnit($data);
        $lead=Lead::create($data);$this->audit->record($lead,'lead.created',[],$lead->toArray());
        return $this->ok($this->load($lead),'Lead created',201);
    }
    public function update(Request $request,Lead $lead)
    {
        $this->authorizeLead($lead);$data=$this->data($request,false);$this->authorizeLeadUnit($data);
        $old=$lead->only(array_keys($data));$lead->update($data);
        $this->audit->record($lead,'lead.updated',$old,$lead->only(array_keys($data)));
        return $this->ok($this->load($lead));
    }
    public function interact(Request $request,Lead $lead)
    {
        $this->authorizeLead($lead);
        $data=$request->validate(['interaction_type'=>['required',Rule::in(['contact','meeting','email','call'])],'happened_at'=>'required|date','outcome'=>'required|string','notes'=>'nullable|string']);
        $interaction=$lead->interactions()->create($data+['created_by'=>$this->access->user()->id]);
        $lead->update(['last_contacted_at'=>$data['happened_at'],'contact_status'=>'contacted']);
        $this->audit->record($interaction,'lead.interaction_recorded',[],$interaction->toArray());
        return $this->ok($this->load($lead->fresh()),'Interaction recorded',201);
    }
    public function addStudyItem(Request $request,Lead $lead)
    {
        $this->authorizeLead($lead);abort_unless($lead->lab_scenario,422,'Select a genetic lab scenario first.');
        $data=$request->validate(['title'=>'required|string|max:200','owner_id'=>'nullable|exists:users,id','status'=>['sometimes',Rule::in(['planned','in_progress','completed','blocked'])],'due_date'=>'nullable|date','notes'=>'nullable|string']);
        $item=$lead->studyItems()->create($data);$this->audit->record($item,'lab_study_item.created',[],$item->toArray());return $this->ok($this->load($lead->fresh()),'Lab study item created',201);
    }
    public function updateStudyItem(Request $request,\App\Models\BMS\LabStudyItem $item)
    {
        $this->authorizeLead($item->lead);$data=$request->validate(['title'=>'sometimes|string|max:200','owner_id'=>'nullable|exists:users,id','status'=>['sometimes',Rule::in(['planned','in_progress','completed','blocked'])],'due_date'=>'nullable|date','notes'=>'nullable|string']);$old=$item->only(array_keys($data));$item->update($data);$this->audit->record($item,'lab_study_item.updated',$old,$item->only(array_keys($data)));return $this->ok($this->load($item->lead));
    }
    public function convert(Lead $lead)
    {
        $this->access->authorize('leads.convert');$this->authorizeLead($lead);
        abort_if($lead->converted_opportunity_id,422,'This lead has already been converted.');
        $userId=$this->access->user()->id;
        $opportunity=DB::transaction(function()use($lead,$userId){
            $opportunity=Opportunity::create([
                'reference'=>'BMS-'.now()->format('Ymd').'-'.strtoupper(Str::random(6)),
                'title'=>$lead->name,'client_name'=>$lead->name,'type'=>'opportunity',
                'business_unit_id'=>$lead->business_unit_id,'owner_id'=>$lead->owner_id,
                'created_by'=>$userId,'stage'=>'qualification','last_update_at'=>now(),'currency'=>config('bms.default_currency','SAR'),
                'bms_lead_id'=>$lead->id,'sector'=>$lead->sector,'notes'=>$lead->notes,
                'contact_name'=>$lead->contact_name,'contact_email'=>$lead->contact_email,'contact_phone'=>$lead->contact_phone,
            ]);
            $opportunity->history()->create(['to_stage'=>'qualification','note'=>'Converted from lead #'.$lead->id,'changed_by'=>$userId]);
            $lead->update(['converted_opportunity_id'=>$opportunity->id,'stage'=>'converted']);
            $lead->interactions()->create([
                'interaction_type'=>'note','happened_at'=>now(),'created_by'=>$userId,
                'outcome'=>'Converted to opportunity '.$opportunity->reference,
            ]);
            $this->audit->record($lead,'lead.converted',[],['opportunity_id'=>$opportunity->id]);
            return $opportunity;
        });
        return $this->ok($this->load($lead->fresh()),'Lead converted to '.$opportunity->reference,201);
    }
    private function data(Request $request,bool $creating=true):array
    {
        return $request->validate(['name'=>($creating?'required':'sometimes').'|string|max:200','entity_type'=>['sometimes',Rule::in(['government','private','individual','partner','collaborator'])],'sector'=>'nullable|string|max:200','contact_name'=>'nullable|string|max:200','contact_email'=>'nullable|email','contact_phone'=>'nullable|string|max:50','business_unit_id'=>'nullable|exists:business_units,id','owner_id'=>'nullable|exists:users,id','stage'=>['sometimes',Rule::exists('bms_pipeline_stages','code')->where('is_active',true)],'contact_status'=>['sometimes',Rule::in(['not_contacted','contacted','follow_up'])],'ecosystem_plan'=>'nullable|string|max:250','lab_scenario'=>['nullable',Rule::in(['university_partnership','build_from_scratch'])],'notes'=>'nullable|string']);
    }
    private function scope($query):void{$ids=$this->access->visibleUnitIds();if($ids!==null)$query->where(function($q)use($ids){$q->whereIn('business_unit_id',$ids)->orWhere('owner_id',$this->access->user()->id);});}
    private function authorizeLead(Lead $lead):void{if($lead->business_unit_id)$this->access->authorizeUnit($lead->business_unit_id);else abort_unless($lead->owner_id===$this->access->user()->id||$this->access->hasGlobalUnitScope(),403);}
    private function authorizeLeadUnit(array $data):void{if(!empty($data['business_unit_id']))$this->access->authorizeUnit((int)$data['business_unit_id']);}
    private function load(Lead $lead):Lead{return $lead->load(['unit','owner:id,username','interactions.creator:id,username','opportunity:id,reference,title','minutes.meeting','studyItems']);}
}
