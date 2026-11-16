<?php
namespace App\Http\Controllers\BMS;

use App\Models\BMS\ProcurementQuotation;
use App\Models\BMS\ProcurementRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProcurementController extends BmsController
{
    public function index()
    {
        $query=ProcurementRequest::with(['unit','requester:id,username','reviewer:id,username','quotations'])->latest();
        if(!$this->access->can('procurement.review')&&!$this->access->hasGlobalUnitScope())$query->where('requested_by',$this->access->user()->id);
        return $this->ok($query->get());
    }
    public function store(Request $request)
    {
        $data=$request->validate(['item'=>'required|string|max:200','quantity'=>'required|integer|min:1','purpose'=>'required|string','business_unit_id'=>'nullable|exists:business_units,id']);
        if(!empty($data['business_unit_id']))$this->access->authorizeUnit((int)$data['business_unit_id']);
        $data['reference']='PRC-'.now()->format('Ymd').'-'.strtoupper(Str::random(5));$data['requested_by']=$this->access->user()->id;
        $item=ProcurementRequest::create($data);$this->audit->record($item,'procurement.submitted',[],$item->toArray());
        app(\App\Services\BMS\BmsNotifier::class)->notifyRoles(['finance'],'procurement.created','New procurement request',$item->item);
        app(\App\Services\BMS\BmsNotifier::class)->notifyRoles(['finance'],'procurement.created','New procurement request',$item->item);
        return $this->ok($this->load($item),'Procurement request submitted to Finance',201);
    }
    public function update(Request $request, ProcurementRequest $procurement)
    {
        $this->authorizeRequest($procurement);
        $data = $request->validate([
            'item' => 'sometimes|required|string|max:200',
            'quantity' => 'sometimes|required|integer|min:1|max:4294967295',
            'purpose' => 'sometimes|required|string',
            'business_unit_id' => ['nullable', 'integer', Rule::exists('business_units', 'id')->whereNull('deleted_at')],
        ]);
        if (!empty($data['business_unit_id'])) $this->access->authorizeUnit((int) $data['business_unit_id']);
        $procurement = DB::transaction(function () use ($procurement, $data) {
            $procurement = ProcurementRequest::whereKey($procurement->id)->lockForUpdate()->firstOrFail();
            $this->authorizeRequest($procurement);
            abort_unless($procurement->status === 'submitted', 422, 'A procurement request cannot be edited after Finance review.');
            $old = $procurement->only(array_keys($data));
            $procurement->update($data);
            $this->audit->record($procurement, 'procurement.updated', $old, $procurement->only(array_keys($data)));
            return $procurement;
        });
        return $this->ok($this->load($procurement));
    }
    public function destroy(ProcurementRequest $procurement)
    {
        $this->authorizeRequest($procurement);
        $paths = $procurement->quotations()->whereNotNull('file_path')->pluck('file_path');
        DB::transaction(function () use ($procurement) {
            $old = $procurement->toArray();
            $procurement->delete();
            $this->audit->record($procurement, 'procurement.deleted', $old, []);
        });
        foreach ($paths as $path) {
            if (!ProcurementQuotation::where('file_path', $path)->exists()) Storage::disk('local')->delete($path);
        }
        return $this->ok(null, 'Procurement request deleted');
    }
    public function quote(Request $request,ProcurementRequest $procurement)
    {
        abort_unless($this->access->hasGlobalUnitScope()||$procurement->requested_by===$this->access->user()->id,403);
        abort_unless($procurement->status==='submitted',422,'Quotations cannot be added after Finance review.');
        $data=$request->validate(['vendor'=>'required|string|max:200','amount'=>'required|numeric|min:0','currency'=>'sometimes|string|max:10','quotation'=>'nullable|file|mimes:pdf,png,jpg,jpeg|max:10240']);
        if($request->hasFile('quotation')){$file=$request->file('quotation');$data['original_name']=$file->getClientOriginalName();$data['file_path']=$file->store('bms/quotations','local');}
        unset($data['quotation']);$quote=$procurement->quotations()->create($data);
        $this->audit->record($quote,'procurement.quotation_added',[],$quote->toArray());
        return $this->ok($this->load($procurement),'Vendor quotation added',201);
    }
    public function review(Request $request,ProcurementRequest $procurement)
    {
        $data=$request->validate(['decision'=>['required',Rule::in(['approved','rejected'])],'budget_confirmed'=>'required|boolean','finance_comment'=>'required|string|min:3']);
        abort_if($data['decision']==='approved'&&!$data['budget_confirmed'],422,'Budget must be confirmed before approval.');
        $old=$procurement->only(['status','budget_confirmed','finance_comment']);
        $procurement->update(['status'=>$data['decision'],'budget_confirmed'=>$data['budget_confirmed'],'finance_comment'=>$data['finance_comment'],'reviewed_by'=>$this->access->user()->id,'reviewed_at'=>now()]);
        $this->audit->record($procurement,'procurement.finance_reviewed',$old,$procurement->only(['status','budget_confirmed','finance_comment','reviewed_by','reviewed_at']),$data['finance_comment']);
        app(\App\Services\BMS\BmsNotifier::class)->notify([$procurement->requester],'procurement.reviewed','Procurement '.$procurement->status,$procurement->item);
        app(\App\Services\BMS\BmsNotifier::class)->notify([$procurement->requester],'procurement.reviewed','Procurement '.$procurement->status,$procurement->item);
        return $this->ok($this->load($procurement),'Finance decision recorded');
    }
    public function quotation(ProcurementQuotation $quotation)
    {
        $this->access->authorize('procurement.view');
        abort_unless($this->access->hasGlobalUnitScope()||$quotation->request->requested_by===$this->access->user()->id,403);
        abort_unless($quotation->file_path&&Storage::disk('local')->exists($quotation->file_path),404);
        return Storage::disk('local')->download($quotation->file_path,\App\Services\BMS\SafeFilename::forDownload($quotation->original_name));
    }
    private function authorizeRequest(ProcurementRequest $item): void
    {
        if ($item->business_unit_id) $this->access->authorizeUnit((int) $item->business_unit_id);
        abort_unless($this->access->hasGlobalUnitScope() || (int) $item->requested_by === (int) $this->access->user()->id, 403);
    }
    private function load(ProcurementRequest $item):ProcurementRequest{return $item->load(['unit','requester:id,username','reviewer:id,username','quotations']);}
}
