<?php
namespace App\Http\Controllers\BMS;
use App\Models\BMS\DevelopmentItem;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
class DevelopmentController extends BmsController
{
    public function index(Request $request){$q=DevelopmentItem::with(['unit','owner:id,username'])->latest();$ids=$this->access->visibleUnitIds();if($ids!==null)$q->whereIn('business_unit_id',$ids);if($request->filled('business_unit_id'))$q->where('business_unit_id',$request->business_unit_id);return $this->ok($q->get());}
    public function store(Request $request){$data=$this->data($request);$this->access->authorizeUnit((int)$data['business_unit_id']);$item=DevelopmentItem::create($data);$this->audit->record($item,'development.created',[],$item->toArray());return $this->ok($item->load(['unit','owner']),'Development item created',201);}
    public function update(Request $request,DevelopmentItem $item){$this->access->authorizeUnit($item->business_unit_id);$data=$this->data($request,false);$old=$item->only(array_keys($data));$item->update($data);$this->audit->record($item,'development.updated',$old,$item->only(array_keys($data)));return $this->ok($item->load(['unit','owner']));}
    private function data(Request $request,bool $creating=true):array{return $request->validate(['business_unit_id'=>($creating?'required':'sometimes').'|exists:business_units,id','owner_id'=>'nullable|exists:users,id','title'=>($creating?'required':'sometimes').'|string|max:200','item_type'=>['sometimes',Rule::in(['course','training_plan','awareness','cdmp','certification'])],'status'=>['sometimes',Rule::in(['planned','in_progress','completed','cancelled'])],'due_date'=>'nullable|date','notes'=>'nullable|string']);}
}
