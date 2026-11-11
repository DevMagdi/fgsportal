<?php
namespace App\Http\Controllers\BMS;

use App\Models\BMS\Opportunity;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class OpportunityController extends BmsController
{
    public const STAGES=['review','qualification','rfp','proposal','financial_proposal','submission','submitted','negotiation','won','lost','declined'];

    public function index(Request $request)
    {
        $query=Opportunity::with(['unit','product','owner:id,username','creator:id,username','decisionMaker:id,username','history.user:id,username','minutes.meeting'])->latest('last_update_at');
        $query->filter($request->only(['business_unit_id','product_id']));
        $visibleUnits=$this->access->visibleUnitIds();
        if($visibleUnits!==null)$query->where(function($q)use($visibleUnits){$q->whereIn('business_unit_id',$visibleUnits)->orWhere('owner_id',$this->access->user()->id);});
        if ($request->filled('stage')) $query->where('stage',$request->stage);
        if ($request->filled('alert')) {
            if ($request->alert==='no_update') $query->where('last_update_at','<',now()->subDays(config('bms.opportunity_no_update_days')));
            if ($request->alert==='delayed') $query->whereDate('expected_close_date','<',today())->whereNotIn('stage',['won','lost','declined']);
        }
        return $this->ok($query->get()->map(fn($item)=>$this->present($item))->values());
    }

    public function store(Request $request)
    {
        $data=$this->validateData($request);
        $this->authorizeData($data,true);
        $data['currency'] = strtoupper($data['currency'] ?? config('bms.default_currency'));
        $data['reference']=$data['reference']??$this->reference();
        $data['created_by']=$this->access->user()->id;
        $data['last_update_at']=now();
        $opportunity=DB::transaction(function()use($data){
            $item=Opportunity::create($data);
            $item->history()->create(['from_stage'=>null,'to_stage'=>$item->stage,'note'=>'Registered in BMS','changed_by'=>$this->access->user()->id]);
            $this->audit->record($item,'opportunity.created',[],$item->toArray());
            return $item;
        });
        return $this->ok($this->present($opportunity->load(['unit','product','owner','history.user','minutes.meeting'])),'Opportunity registered',201);
    }

    public function show(Opportunity $opportunity)
    {
        $this->authorizeOpportunity($opportunity);
        return $this->ok($this->present($opportunity->load(['unit','product','owner','creator','decisionMaker','history.user','minutes.meeting'])));
    }

    public function update(Request $request, Opportunity $opportunity)
    {
        $this->authorizeOpportunity($opportunity);
        $data=$this->validateData($request,$opportunity->id);
        $this->authorizeData($data);
        $old=$opportunity->only(array_keys($data));
        DB::transaction(function()use($opportunity,$data,$old,$request){
            $oldStage=$opportunity->stage;
            $opportunity->update($data+['last_update_at'=>now()]);
            if (array_key_exists('stage',$data) && $data['stage']!==$oldStage) {
                $opportunity->history()->create(['from_stage'=>$oldStage,'to_stage'=>$data['stage'],'note'=>$request->input('stage_note'),'changed_by'=>$this->access->user()->id]);
            }
            $this->audit->record($opportunity,'opportunity.updated',$old,$opportunity->only(array_keys($data)));
        });
        return $this->ok($this->present($opportunity->fresh()->load(['unit','product','owner','history.user','minutes.meeting'])));
    }

    public function decide(Request $request, Opportunity $opportunity)
    {
        $this->authorizeOpportunity($opportunity);
        $data=$request->validate(['decision'=>['required',Rule::in(['go','no_go'])],'reason'=>'required|string|min:3']);
        $old=$opportunity->only(['go_no_go','decision_reason','decided_by','decided_at']);
        $opportunity->update(['go_no_go'=>$data['decision'],'decision_reason'=>$data['reason'],'decided_by'=>$this->access->user()->id,'decided_at'=>now(),'last_update_at'=>now()]);
        $recipients=\App\Models\User::whereHas('bmsRoles',fn($q)=>$q->whereIn('slug',['operations','coordinator','system_admin']))->pluck('users.id')->merge([$opportunity->created_by,$opportunity->owner_id])->filter()->unique();
        foreach($recipients as $userId)\App\Models\BMS\BmsAlert::updateOrCreate(['bms_opportunity_id'=>$opportunity->id,'user_id'=>$userId,'alert_type'=>'decision'],['message'=>'Alpha Delta decision '.$data['decision'].': '.$opportunity->title,'read_at'=>null]);
        $this->audit->record($opportunity,'opportunity.go_no_go',$old,$opportunity->only(['go_no_go','decision_reason','decided_by','decided_at']),$data['reason']);
        return $this->ok($this->present($opportunity->load(['unit','product','owner','decisionMaker','history.user','minutes.meeting'])),'Decision recorded');
    }

    public function uploadDocument(Request $request,Opportunity $opportunity)
    {
        $this->authorizeOpportunity($opportunity);
        $data=$request->validate(['document_type'=>['required',Rule::in(['rfp','financial_proposal','appointment','training','other'])],'file'=>'required|file|mimes:pdf,doc,docx,xls,xlsx,ppt,pptx|max:20480']);
        $file=$request->file('file');$version=($opportunity->documents()->where('document_type',$data['document_type'])->max('version')?:0)+1;
        $document=$opportunity->documents()->create(['document_type'=>$data['document_type'],'version'=>$version,'original_name'=>$file->getClientOriginalName(),'file_path'=>$file->store('bms/opportunities','local'),'uploaded_by'=>$this->access->user()->id]);
        $opportunity->update(['last_update_at'=>now()]);$this->audit->record($document,'opportunity.document_added',[],$document->toArray());
        return $this->ok($document->load('uploader:id,username'),'Opportunity document version added',201);
    }

    public function documents(Opportunity $opportunity)
    {
        $this->authorizeOpportunity($opportunity);return $this->ok($opportunity->documents()->with('uploader:id,username')->latest()->get());
    }

    public function downloadDocument(\App\Models\BMS\OpportunityDocument $document)
    {
        $this->authorizeOpportunity($document->opportunity);abort_unless(\Illuminate\Support\Facades\Storage::disk('local')->exists($document->file_path),404);
        return \Illuminate\Support\Facades\Storage::disk('local')->download($document->file_path,$document->original_name);
    }

    public function alerts()
    {
        $this->generateAlerts();
        return $this->ok(\App\Models\BMS\BmsAlert::with('opportunity:id,reference,title,stage,owner_id')->where('user_id',$this->access->user()->id)->whereNull('read_at')->latest()->get());
    }

    public function readAlert(\App\Models\BMS\BmsAlert $alert)
    {
        abort_unless($alert->user_id===$this->access->user()->id,403);$alert->update(['read_at'=>now()]);return $this->ok(null,'Alert marked as read');
    }

    public function import(Request $request)
    {
        if ($request->hasFile('file')) {
            $request->validate(['file'=>'required|file|mimes:csv,txt|max:5120']);
            $rows=$this->csvRows($request->file('file')->getRealPath());
        } else {
            $request->validate(['rows'=>'required|array|min:1|max:1000']); $rows=$request->input('rows');
        }
        $created=0;$updated=0;$errors=[];
        foreach ($rows as $index=>$row) {
            try {
                $normalized=$this->normalizeRow($row);
                $validator=validator($normalized,$this->rules(null,false));
                if ($validator->fails()) throw new \InvalidArgumentException(implode(' ',$validator->errors()->all()));
                $data=$validator->validated();
                $data['currency'] = strtoupper($data['currency'] ?? config('bms.default_currency'));
                $this->authorizeData($data);
                $reference=$data['reference']??null;
                unset($data['reference']);
                $item=$reference?Opportunity::withTrashed()->where('reference',$reference)->first():null;
                if ($item) {
                    $this->authorizeOpportunity($item);
                    if ($item->trashed()) $item->restore();
                    $oldStage=$item->stage;$item->update($data+['last_update_at'=>now()]);
                    if ($oldStage!==$item->stage) $item->history()->create(['from_stage'=>$oldStage,'to_stage'=>$item->stage,'note'=>'Excel tracker import','changed_by'=>$this->access->user()->id]);
                    $updated++;
                } else {
                    $data['reference']=$reference?:$this->reference();$data['created_by']=$this->access->user()->id;$data['last_update_at']=now();
                    $item=Opportunity::create($data);
                    $item->history()->create(['to_stage'=>$item->stage,'note'=>'Excel tracker import','changed_by'=>$this->access->user()->id]);$created++;
                }
                $this->audit->record($item,'opportunity.imported',[],$item->toArray());
            } catch (\Throwable $e) { $errors[]=['row'=>$index+2,'message'=>$e->getMessage()]; }
        }
        return $this->ok(compact('created','updated','errors'),'Tracker import completed',count($errors)?207:200);
    }

    private function validateData(Request $request,?int $id=null): array
    {
        $data=$request->validate($this->rules($id));
        if(!$id) $request->validate(['business_unit_id'=>'required|exists:business_units,id','owner_id'=>'required|exists:users,id','expected_close_date'=>'required|date','stage'=>'required|string']);
        return $data;
    }

    private function rules(?int $id=null,bool $withReference=true): array
    {
        $rules=[
            'title'=>'required|string|max:200','client_name'=>'required|string|max:200',
            'type'=>['sometimes',Rule::in(['opportunity','tender','project','client','internal','external'])],
            'business_unit_id'=>'nullable|exists:business_units,id','contact_lead_id'=>'nullable|exists:contact_leads,id',
            'product_id'=>'nullable|exists:products,id','owner_id'=>'nullable|exists:users,id',
            'stage'=>['sometimes',Rule::in(self::STAGES)],'value'=>'nullable|numeric|min:0','currency'=>['sometimes','string',Rule::in(config('bms.currencies'))],
            'submission_date'=>'nullable|date','expected_close_date'=>'nullable|date','last_update_at'=>'nullable|date','stage_note'=>'nullable|string',
        ];
        if ($withReference) $rules['reference']=['nullable','string','max:80',Rule::unique('bms_opportunities','reference')->ignore($id)];
        else $rules['reference']='nullable|string|max:80';
        return $rules;
    }

    private function normalizeRow(array $row): array
    {
        $normalized=[];
        foreach ($row as $key=>$value) $normalized[Str::snake(strtolower(trim((string)$key)))]=is_string($value)?trim($value):$value;
        $aliases=['client'=>'client_name','customer'=>'client_name','opportunity'=>'title','opportunity_name'=>'title','tender_name'=>'title','unit'=>'business_unit_id','business_unit'=>'business_unit_id','product'=>'product_id','product_name'=>'product_id','submission'=>'submission_date','tender_submission_date'=>'submission_date','close_date'=>'expected_close_date','expected_closing_date'=>'expected_close_date','last_update'=>'last_update_at','amount'=>'value'];
        foreach ($aliases as $from=>$to) if (isset($normalized[$from])&&!isset($normalized[$to])) $normalized[$to]=$normalized[$from];
        $normalized=array_filter($normalized,fn($v)=>$v!==null&&$v!=='');
        if (isset($normalized['business_unit_id'])&&!is_numeric($normalized['business_unit_id'])) {
            $normalized['business_unit_id']=\App\Models\BMS\BusinessUnit::where('name',$normalized['business_unit_id'])->value('id');
        }
        if (isset($normalized['product_id'])&&!is_numeric($normalized['product_id'])) {
            $normalized['product_id']=\App\Models\Product::where('product_name',$normalized['product_id'])->value('id');
        }
        if (isset($normalized['stage'])) $normalized['stage']=Str::snake(strtolower($normalized['stage']));
        if (isset($normalized['type'])) $normalized['type']=strtolower($normalized['type']);
        return $normalized;
    }

    private function csvRows(string $path): array
    {
        $handle=fopen($path,'r');$headers=fgetcsv($handle);$rows=[];
        if(!$headers||count(array_filter($headers))===0){fclose($handle);return [['__invalid_row'=>'Missing CSV header row']];}
        while (($values=fgetcsv($handle))!==false) {
            if(count($values)!==count($headers))$rows[]=['__invalid_row'=>'Column count does not match the header'];
            else $rows[]=array_combine($headers,$values);
        }
        fclose($handle);return $rows;
    }

    private function authorizeData(array $data,bool $creating=false):void
    {
        if(!empty($data['business_unit_id']))$this->access->authorizeUnit((int)$data['business_unit_id']);
        if($creating)abort_unless($this->access->can('opportunities.manage'),403);
    }
    private function authorizeOpportunity(Opportunity $opportunity):void
    {
        if($opportunity->business_unit_id)$this->access->authorizeUnit((int)$opportunity->business_unit_id);
        else abort_unless($opportunity->owner_id===$this->access->user()->id||$this->access->hasGlobalUnitScope(),403);
    }
    private function generateAlerts():void
    {
        $stale=Opportunity::whereNotIn('stage',['won','lost','declined'])->where(function($q){$q->where('last_update_at','<',now()->subDays(config('bms.opportunity_no_update_days')))->orWhereDate('expected_close_date','<',today());})->get();
        $coordinators=\App\Models\User::whereHas('bmsRoles',fn($q)=>$q->whereIn('slug',['coordinator','system_admin']))->pluck('users.id');
        foreach($stale as $opportunity){
            $type=$opportunity->expected_close_date&&$opportunity->expected_close_date->isBefore(today())?'delayed':'no_update';
            $message=$type==='delayed'?'Opportunity deadline passed: '.$opportunity->title:'No opportunity update for '.config('bms.opportunity_no_update_days').' days: '.$opportunity->title;
            foreach($coordinators->merge([$opportunity->owner_id])->filter()->unique() as $userId)\App\Models\BMS\BmsAlert::firstOrCreate(['bms_opportunity_id'=>$opportunity->id,'user_id'=>$userId,'alert_type'=>$type],['message'=>$message]);
        }
    }
    private function reference(): string { return 'BMS-'.now()->format('Ymd').'-'.strtoupper(Str::random(6)); }

    private function present(Opportunity $item): array
    {
        $data=$item->toArray();
        $data['is_delayed']=$item->expected_close_date&&$item->expected_close_date->isBefore(today())&&!in_array($item->stage,['won','lost','declined'],true);
        $data['has_no_update']=$item->last_update_at&&$item->last_update_at->lt(now()->subDays(config('bms.opportunity_no_update_days')));
        return $data;
    }
}
