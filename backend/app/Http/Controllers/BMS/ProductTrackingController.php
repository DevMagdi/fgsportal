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
        $query=Product::with(['businessUnits','phases','currentPhase'])->orderBy('product_name');
        if ($request->filled('business_unit_id')) $query->whereHas('businessUnits',fn($q)=>$q->where('business_units.id',$request->business_unit_id));
        if ($request->filled('product_id')) $query->where('id',$request->product_id);
        return $this->ok($query->get());
    }

    public function store(Request $request)
    {
        $data=$request->validate(['product_name'=>'required|string|max:150|unique:products,product_name','business_unit_ids'=>'required|array|min:1','business_unit_ids.*'=>'exists:business_units,id']);
        $product=DB::transaction(function()use($data){
            $product=Product::create(['product_name'=>$data['product_name']]);
            $product->businessUnits()->sync($data['business_unit_ids']);
            return $product;
        });
        return $this->ok($product->load(['businessUnits','phases']),'Product created',201);
    }

    public function update(Request $request, Product $product)
    {
        $data=$request->validate(['product_name'=>'sometimes|string|max:150|unique:products,product_name,'.$product->id,'business_unit_ids'=>'sometimes|array|min:1','business_unit_ids.*'=>'exists:business_units,id']);
        if (isset($data['product_name'])) $product->update(['product_name'=>$data['product_name']]);
        if (isset($data['business_unit_ids'])) $product->businessUnits()->sync($data['business_unit_ids']);
        return $this->ok($product->load(['businessUnits','phases','currentPhase']));
    }

    public function storePhase(Request $request, Product $product)
    {
        $data=$this->phaseData($request);
        $phase=$product->phases()->create($data+['updated_by'=>$this->access->user()->id]);
        return $this->ok($phase,'Product phase created',201);
    }

    public function updatePhase(Request $request, ProductPhase $phase)
    {
        $data=$this->phaseData($request,false);
        $data['updated_by']=$this->access->user()->id;
        $phase->update($data);
        return $this->ok($phase);
    }

    public function destroyPhase(ProductPhase $phase)
    {
        $phase->delete();return $this->ok(null,'Product phase deleted');
    }

    private function phaseData(Request $request,bool $creating=true): array
    {
        return $request->validate([
            'name'=>($creating?'required':'sometimes').'|string|max:150','sequence'=>($creating?'required':'sometimes').'|integer|min:1',
            'status'=>['sometimes',Rule::in(['not_started','in_progress','completed','blocked'])],
            'blockers'=>'nullable|string','data_needs'=>'nullable|string','support_needs'=>'nullable|string',
            'start_date'=>'nullable|date','end_date'=>'nullable|date|after_or_equal:start_date',
        ]);
    }
}
