<?php

namespace App\Http\Controllers\BMS;

use App\Models\BMS\UnitTask;
use App\Services\BMS\BmsAccess;
use App\Services\BMS\BmsAudit;
use App\Services\BMS\EmployeeTaskRollup;
use Illuminate\Http\Request;

class EmployeeTaskController extends BmsController
{
    private EmployeeTaskRollup $rollup;

    public function __construct(BmsAccess $access, BmsAudit $audit, EmployeeTaskRollup $rollup)
    {
        parent::__construct($access, $audit);
        $this->rollup = $rollup;
    }

    /**
     * Rollup of tasks per employee. `from`/`to` filter on the week_start of the owning weekly plan.
     * Users who cannot view team tasks (employees) only ever receive their own row.
     */
    public function index(Request $request)
    {
        $filters = $request->validate([
            'business_unit_id' => 'nullable|exists:business_units,id',
            'week_start' => 'nullable|date',
            'from' => 'nullable|date',
            'to' => 'nullable|date|after_or_equal:from',
        ]);
        if (!empty($filters['business_unit_id'])) {
            $this->access->authorizeUnit((int) $filters['business_unit_id']);
        }
        $visibleUnits = $this->access->visibleUnitIds();
        $query = UnitTask::with('owner:id,username')
            ->when($filters['business_unit_id'] ?? null, fn ($q, $v) => $q->where('business_unit_id', $v))
            ->when($visibleUnits !== null, fn ($q) => $q->whereIn('business_unit_id', $visibleUnits))
            ->when($filters['week_start'] ?? null, fn ($q, $v) => $q->whereHas('plan', fn ($p) => $p->whereDate('week_start', $v)))
            ->when($filters['from'] ?? null, fn ($q, $v) => $q->whereHas('plan', fn ($p) => $p->whereDate('week_start', '>=', $v)))
            ->when($filters['to'] ?? null, fn ($q, $v) => $q->whereHas('plan', fn ($p) => $p->whereDate('week_start', '<=', $v)));
        if (!$this->access->canViewTeamTasks()) {
            $query->where('owner_id', $this->access->user()->id);
        }

        return $this->ok($this->rollup->summarize($query->get()));
    }
}
