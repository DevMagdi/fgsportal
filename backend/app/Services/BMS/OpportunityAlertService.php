<?php

namespace App\Services\BMS;

use App\Models\BMS\BmsAlert;
use App\Models\BMS\Opportunity;
use App\Models\User;

class OpportunityAlertService
{
    public function __construct(private BmsNotifier $notifier)
    {
    }

    public function generate(): int
    {
        $notifications = 0;
        $recipients = User::whereHas('bmsRoles', function ($query) {
            $query->whereIn('bms_roles.slug', ['coordinator', 'system_admin']);
        })->get();

        Opportunity::whereNotIn('stage', ['won', 'lost', 'declined'])
            ->orderBy('id')
            ->chunk(200, function ($opportunities) use ($recipients, &$notifications) {
                foreach ($opportunities as $opportunity) {
                    $users = $recipients->concat(User::where('id', $opportunity->owner_id)->get())->unique('id');
                    foreach (['delayed', 'no_update'] as $type) {
                        $active = $this->conditionIsActive($opportunity, $type);
                        $notifications += $this->syncAlerts($opportunity, $users, $type, $active);
                    }
                }
            });

        return $notifications;
    }

    public function conditionIsActive(Opportunity $opportunity, string $type): bool
    {
        if ($type === 'delayed') {
            $expectedClosePassed = $opportunity->expected_close_date
                && $opportunity->expected_close_date->startOfDay()->lessThan(today());
            $submissionPassed = $opportunity->submission_date
                && $opportunity->submission_date->startOfDay()->lessThan(today())
                && array_search($opportunity->stage, OpportunityControllerStages::ORDER, true)
                    < array_search('submission', OpportunityControllerStages::ORDER, true);
            return $expectedClosePassed || $submissionPassed;
        }

        return $opportunity->last_update_at
            && $opportunity->last_update_at->lessThanOrEqualTo(
                now()->subDays((int) config('bms.opportunity_no_update_days'))
            );
    }

    private function syncAlerts(Opportunity $opportunity, $users, string $type, bool $active): int
    {
        $sent = 0;
        foreach ($users as $user) {
            $alert = BmsAlert::firstOrNew([
                'bms_opportunity_id' => $opportunity->id,
                'user_id' => $user->id,
                'alert_type' => $type,
            ]);
            if (!$active) {
                if ($alert->exists && $alert->resolved_at === null) {
                    $alert->update(['resolved_at' => now(), 'read_at' => now()]);
                }
                continue;
            }

            $shouldNotify = !$alert->exists || !$alert->last_notified_at
                || $alert->last_notified_at->lessThanOrEqualTo(
                    now()->subDays((int) config('bms.alert_renotify_days'))
                );
            if (!$shouldNotify) {
                continue;
            }

            $alert->fill([
                'message' => ($type === 'delayed' ? 'Opportunity deadline passed: ' : 'Opportunity requires an update: ').$opportunity->title,
                'read_at' => null,
                'resolved_at' => null,
                'last_notified_at' => now(),
                'occurrences' => ($alert->occurrences ?: 0) + 1,
            ])->save();
            $this->notifier->notify(
                [$user],
                'opportunity.alert',
                'Opportunity follow-up required',
                $alert->message,
                url('/bms/opportunities?alert='.$type)
            );
            $sent++;
        }
        return $sent;
    }
}

/** Stage order shared by the alert rule without coupling the service to HTTP. */
final class OpportunityControllerStages
{
    public const ORDER = [
        'review', 'qualification', 'rfp', 'proposal', 'financial_proposal',
        'submission', 'submitted', 'negotiation', 'won', 'lost', 'declined',
    ];
}
