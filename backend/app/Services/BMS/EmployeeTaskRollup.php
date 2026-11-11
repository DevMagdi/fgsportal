<?php

namespace App\Services\BMS;

use Illuminate\Support\Collection;

/** P1-1: per-employee task counters for unit directors and the executive dashboard. */
class EmployeeTaskRollup
{
    /**
     * @param Collection $tasks UnitTask models with the owner relation loaded
     */
    public function summarize(Collection $tasks, bool $withTasks = true): array
    {
        $today = today();
        $rows = $tasks->whereNotNull('owner_id')->groupBy('owner_id')->map(function (Collection $items) use ($today, $withTasks) {
            $owner = $items->first()->owner;
            $row = [
                'employee' => $owner ? ['id' => $owner->id, 'username' => $owner->username] : ['id' => $items->first()->owner_id, 'username' => null],
                'total' => $items->count(),
                'achieved' => $items->where('status', 'achieved')->count(),
                'in_progress' => $items->where('status', 'in_progress')->count(),
                'not_done' => $items->where('status', 'not_done')->count(),
                'overdue' => $items->filter(fn ($task) => $task->status !== 'achieved'
                    && $task->due_date !== null && $task->due_date->lt($today))->count(),
                'average_progress' => (int) round($items->avg('progress')),
                'blocked' => $items->filter(fn ($task) => !empty($task->blockers))->count(),
            ];
            if ($withTasks) {
                $row['tasks'] = $items->values();
            }
            return $row;
        });

        return $rows->sortByDesc('overdue')->values()->all();
    }
}
