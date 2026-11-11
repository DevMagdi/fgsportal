<?php
namespace App\Http\Controllers\BMS;

use App\Models\BMS\ProductPhase;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ProductTrackingController extends BmsController
{
    public function index(Request $request)
    {
        $query=Product::with(['businessUnits','phases','currentPhase','minutes.meeting'])->orderBy('product_name');
        $visibleUnits=$this->access->visibleUnitIds();
        if($visibleUnits!==null)$query->whereHas('businessUnits',fn($q)=>$q->whereIn('business_units.id',$visibleUnits));
        if ($request->filled('business_unit_id')) $query->whereHas('businessUnits',fn($q)=>$q->where('business_units.id',$request->business_unit_id));
        if ($request->filled('product_id')) $query->where('id',$request->product_id);
        return $this->ok($query->get());
    }

    public function store(Request $request)
    {
        $data=$request->validate(['product_name'=>'required|string|max:150|unique:products,product_name','business_unit_ids'=>'required|array|min:1','business_unit_ids.*'=>'exists:business_units,id']);
        $this->authorizeUnits($data['business_unit_ids']);
        $product=DB::transaction(function()use($data){
            $product=Product::create(['product_name'=>$data['product_name']]);
            $product->businessUnits()->sync($data['business_unit_ids']);
            $this->audit->record($product,'product.created',[],$product->toArray());
            return $product;
        });
        return $this->ok($product->load(['businessUnits','phases','minutes.meeting']),'Product created',201);
    }

    public function update(Request $request, Product $product)
    {
        $this->authorizeProduct($product);
        $data=$request->validate(['product_name'=>'sometimes|string|max:150|unique:products,product_name,'.$product->id,'business_unit_ids'=>'sometimes|array|min:1','business_unit_ids.*'=>'exists:business_units,id']);
        if(isset($data['business_unit_ids']))$this->authorizeUnits($data['business_unit_ids']);
        if (isset($data['product_name'])) $product->update(['product_name'=>$data['product_name']]);
        if (isset($data['business_unit_ids'])) $product->businessUnits()->sync($data['business_unit_ids']);
        $this->audit->record($product,'product.updated',[],$data);
        return $this->ok($product->load(['businessUnits','phases','currentPhase','minutes.meeting']));
    }

    public function storePhase(Request $request, Product $product)
    {
        $this->authorizeProduct($product);
        $data=$this->normalizeProgress($this->phaseData($request,true,$product->id));
        $phase=$product->phases()->create($data+['updated_by'=>$this->access->user()->id]);
        $this->audit->record($phase,'product_phase.created',[],$phase->toArray());
        return $this->ok($phase,'Product phase created',201);
    }

    public function updatePhase(Request $request, ProductPhase $phase)
    {
        $this->authorizeProduct($phase->product);
        $data=$this->normalizeProgress($this->phaseData($request,false,$phase->product_id,$phase->id),$phase);
        $data['updated_by']=$this->access->user()->id;
        $old=$phase->only(array_keys($data));$phase->update($data);
        $this->audit->record($phase,'product_phase.updated',$old,$phase->only(array_keys($data)));
        return $this->ok($phase);
    }

    public function destroyPhase(ProductPhase $phase)
    {
        $this->authorizeProduct($phase->product);
        $this->audit->record($phase,'product_phase.deleted',$phase->toArray(),[]);
        $phase->delete();return $this->ok(null,'Product phase deleted');
    }

    private function authorizeUnits(array $unitIds):void{foreach($unitIds as $unitId)$this->access->authorizeUnit((int)$unitId);}
    private function authorizeProduct(Product $product):void
    {
        $ids=$this->access->visibleUnitIds();if($ids===null)return;
        abort_unless($product->businessUnits()->whereIn('business_units.id',$ids)->exists(),403,'This product is outside your assigned unit scope.');
    }

    private function phaseData(Request $request,bool $creating=true,?int $productId=null,?int $ignoreId=null): array
    {
        return $request->validate([
            'name'=>($creating?'required':'sometimes').'|string|max:150','sequence'=>[$creating?'required':'sometimes','integer','min:1',Rule::unique('product_phases','sequence')->where('product_id',$productId)->ignore($ignoreId)],
            'status'=>['sometimes',Rule::in(['not_started','in_progress','completed','blocked'])],
            'progress'=>'sometimes|integer|min:0|max:100',
            'blockers'=>'nullable|string','data_needs'=>'nullable|string','support_needs'=>'nullable|string',
            'start_date'=>'nullable|date','end_date'=>'nullable|date|after_or_equal:start_date',
        ]);
    }

    /**
     * P1-2: completed implies 100 and not_started implies 0. A conflicting explicit
     * value is rejected instead of being silently rewritten.
     */
    private function normalizeProgress(array $data,?ProductPhase $phase=null): array
    {
        $status=$data['status']??($phase->status??'not_started');
        $given=array_key_exists('progress',$data);
        if($status==='completed'){
            abort_if($given&&(int)$data['progress']!==100,422,'A completed phase must have progress 100.');
            $data['progress']=100;
        }elseif($status==='not_started'){
            abort_if($given&&(int)$data['progress']!==0,422,'A phase that has not started must have progress 0.');
            if(!$phase||array_key_exists('status',$data))$data['progress']=0;
        }
        return $data;
    }
}
