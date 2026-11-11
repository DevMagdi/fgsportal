<?php
namespace App\Http\Controllers\BMS;

use App\Models\BMS\BusinessUnit;
use App\Models\BMS\BmsRole;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class BusinessUnitController extends BmsController
{
    public function index()
    {
        $query = BusinessUnit::with(['parent','director:id,username,firstname,lastname,email','users:id,username,firstname,lastname,email','minutes.meeting']);
        $visibleUnits=$this->access->visibleUnitIds();
        if($visibleUnits!==null)$query->whereIn('id',$visibleUnits);
        return $this->ok($query->orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $data=$this->validateData($request);
        $data['slug']=Str::slug($data['name']);
        $unit=BusinessUnit::create($data);
        $unit->users()->sync($request->input('user_ids',[]));
        $this->syncDirectorRole($unit);
        $this->audit->record($unit,'unit.created',[],$unit->toArray());
        return $this->ok($unit->load(['parent','director','users']),'Business unit created',201);
    }

    public function show(BusinessUnit $unit)
    {
        $this->access->authorizeUnit($unit->id);
        return $this->ok($unit->load(['parent','children','director','users','weeklyPlans.tasks','minutes.meeting']));
    }

    public function update(Request $request, BusinessUnit $unit)
    {
        $data=$this->validateData($request,$unit->id);
        $data['slug']=Str::slug($data['name']);
        $old=$unit->only(array_keys($data));
        $unit->update($data);
        if ($request->has('user_ids')) $unit->users()->sync($request->input('user_ids',[]));
        $this->syncDirectorRole($unit);
        $this->audit->record($unit,'unit.updated',$old,$unit->only(array_keys($data)));
        return $this->ok($unit->load(['parent','director','users']));
    }

    public function destroy(BusinessUnit $unit)
    {
        abort_if($unit->children()->exists() || $unit->weeklyPlans()->exists(),422,'A unit with children or weekly plans cannot be deleted.');
        $snapshot=$unit->toArray();
        $unit->delete();
        $this->audit->record($unit,'unit.deleted',$snapshot,[]);
        return $this->ok(null,'Business unit deleted');
    }

    private function validateData(Request $request, ?int $id=null): array
    {
        return $request->validate([
            'parent_id'=>'nullable|exists:business_units,id',
            'name'=>['required','string','max:150',Rule::unique('business_units','name')->ignore($id)],
            'description'=>'nullable|string','key_messages'=>'nullable|string','services'=>'nullable|array','services.*'=>'string|max:255',
            'director_id'=>'nullable|exists:users,id','is_active'=>'sometimes|boolean',
            'user_ids'=>'sometimes|array','user_ids.*'=>'exists:users,id',
        ]);
    }

    private function syncDirectorRole(BusinessUnit $unit): void
    {
        if (!$unit->director_id) return;
        $role=BmsRole::where('slug','unit_director')->first();
        if ($role) $unit->director->bmsRoles()->syncWithoutDetaching([$role->id=>['business_unit_id'=>$unit->id]]);
        $unit->users()->syncWithoutDetaching([$unit->director_id]);
    }
}
