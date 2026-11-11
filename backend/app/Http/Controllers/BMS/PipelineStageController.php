<?php
namespace App\Http\Controllers\BMS;
use App\Models\BMS\PipelineStage;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
class PipelineStageController extends BmsController
{
    public function index(){return $this->ok(PipelineStage::orderBy('sequence')->get());}
    public function store(Request $request){$data=$this->data($request);$stage=PipelineStage::create($data);$this->audit->record($stage,'pipeline_stage.created',[],$stage->toArray());return $this->ok($stage,'Pipeline stage created',201);}
    public function update(Request $request,PipelineStage $stage){$data=$this->data($request,false,$stage->id);$old=$stage->only(array_keys($data));$stage->update($data);$this->audit->record($stage,'pipeline_stage.updated',$old,$stage->only(array_keys($data)));return $this->ok($stage);}
    private function data(Request $request,bool $creating=true,?int $id=null):array{return $request->validate(['code'=>($creating?'required':'sometimes').'|string|max:80|alpha_dash|'.Rule::unique('bms_pipeline_stages','code')->ignore($id),'name'=>($creating?'required':'sometimes').'|string|max:120','name_ar'=>'nullable|string|max:120','sequence'=>($creating?'required':'sometimes').'|integer|min:1','is_active'=>'sometimes|boolean']);}
}
