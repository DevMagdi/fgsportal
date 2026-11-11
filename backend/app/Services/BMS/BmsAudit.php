<?php
namespace App\Services\BMS;

use App\Models\BMS\BmsAuditLog;
use Illuminate\Database\Eloquent\Model;

class BmsAudit
{
    public function record(Model $model, string $event, array $old = [], array $new = [], ?string $reason = null): BmsAuditLog
    {
        return BmsAuditLog::create([
            'auditable_type' => get_class($model),
            'auditable_id' => $model->getKey(),
            'event' => $event,
            'old_values' => $old ?: null,
            'new_values' => $new ?: null,
            'reason' => $reason,
            'user_id' => app(BmsAccess::class)->user()->id ?? null,
        ]);
    }
}
