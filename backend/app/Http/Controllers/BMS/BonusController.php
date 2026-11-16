<?php

namespace App\Http\Controllers\BMS;

use App\Models\BMS\Bonus;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class BonusController extends BmsController
{
    public function index()
    {
        $visible = $this->access->visibleUnitIds();
        $bonuses = Bonus::with(['employee:id,username,firstname,lastname', 'unit:id,name'])
            ->when($visible !== null, fn ($query) => $query->whereIn('business_unit_id', $visible))
            ->latest('awarded_on')->latest('id')->get();

        return $this->ok($bonuses->map(fn (Bonus $bonus) => $this->present($bonus))->values());
    }

    public function store(Request $request)
    {
        $data = $this->validateData($request);
        $this->authorizeAssignment((int) $data['business_unit_id'], (int) $data['employee_id']);
        $data['currency'] = strtoupper($data['currency']);
        $data['status'] = $data['status'] ?? 'draft';

        $bonus = DB::transaction(function () use ($data) {
            $bonus = Bonus::create($data);
            $this->audit->record($bonus, 'bonus.created', [], $bonus->toArray());
            return $bonus;
        });

        return $this->ok($this->present($bonus->load(['employee:id,username,firstname,lastname', 'unit:id,name'])), 'Bonus created', 201);
    }

    public function update(Request $request, Bonus $bonus)
    {
        $this->access->authorizeUnit((int) $bonus->business_unit_id);
        $data = $this->validateData($request, false);
        $unitId = (int) ($data['business_unit_id'] ?? $bonus->business_unit_id);
        $employeeId = (int) ($data['employee_id'] ?? $bonus->employee_id);
        $this->access->authorizeUnit($unitId);
        // A historical award remains editable if an employee has since moved;
        // a new assignment, however, must be to an employee of the chosen unit.
        if ($unitId !== (int) $bonus->business_unit_id || $employeeId !== (int) $bonus->employee_id) {
            $this->authorizeAssignment($unitId, $employeeId);
        }
        if (isset($data['currency'])) $data['currency'] = strtoupper($data['currency']);

        DB::transaction(function () use ($bonus, $data) {
            $old = $bonus->only(array_keys($data));
            $bonus->update($data);
            $this->audit->record($bonus, 'bonus.updated', $old, $bonus->only(array_keys($data)));
        });

        return $this->ok($this->present($bonus->fresh()->load(['employee:id,username,firstname,lastname', 'unit:id,name'])));
    }

    public function destroy(Bonus $bonus)
    {
        $this->access->authorizeUnit((int) $bonus->business_unit_id);
        DB::transaction(function () use ($bonus) {
            $old = $bonus->toArray();
            $bonus->delete();
            $this->audit->record($bonus, 'bonus.deleted', $old, []);
        });

        return $this->ok(null, 'Bonus deleted');
    }

    private function validateData(Request $request, bool $creating = true): array
    {
        $required = $creating ? 'required' : 'sometimes|required';
        $presence = $creating ? ['required'] : ['sometimes', 'required'];
        return $request->validate([
            'employee_id' => array_merge($presence, ['integer', Rule::exists('users', 'id')->whereNull('deleted_at')]),
            'business_unit_id' => array_merge($presence, ['integer', Rule::exists('business_units', 'id')->whereNull('deleted_at')]),
            'title' => $required.'|string|max:200',
            'amount' => array_merge($presence, ['numeric', 'min:0', 'max:9999999999999.99', 'regex:/^\d{1,13}(\.\d{1,2})?$/']),
            'currency' => $required.'|string|max:10',
            'awarded_on' => $required.'|date',
            'status' => ['sometimes', 'required', Rule::in(['draft', 'approved', 'paid'])],
            'notes' => 'nullable|string',
        ]);
    }

    private function authorizeAssignment(int $unitId, int $employeeId): void
    {
        $this->access->authorizeUnit($unitId);
        $visible = $this->access->visibleUnitIds();
        if ($visible !== null) {
            $inScope = User::whereKey($employeeId)
                ->whereHas('businessUnits', fn ($query) => $query->whereIn('business_units.id', $visible))
                ->exists();
            abort_unless($inScope || $employeeId === (int) $this->access->user()->id, 403, 'This employee is outside your assigned unit scope.');
        }
        $belongs = User::whereKey($employeeId)
            ->whereHas('businessUnits', fn ($query) => $query->where('business_units.id', $unitId))
            ->exists();
        abort_unless($belongs, 422, 'The employee must belong to the selected business unit.');
    }

    private function present(Bonus $bonus): array
    {
        $data = $bonus->toArray();
        $employee = $bonus->employee;
        $data['employee'] = $employee ? [
            'id' => $employee->id,
            'name' => trim($employee->firstname.' '.$employee->lastname) ?: $employee->username,
        ] : null;
        return $data;
    }
}
