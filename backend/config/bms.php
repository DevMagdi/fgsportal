<?php
return [
    // BRD Q6: deployers can agree and change the no-update threshold without code changes.
    'opportunity_no_update_days' => env('BMS_OPPORTUNITY_STALE_DAYS', 7),
    'default_currency' => env('BMS_DEFAULT_CURRENCY', 'SAR'),
    'currencies' => ['SAR', 'USD', 'EUR', 'EGP', 'AED', 'KWD', 'OMR'],
    'no_go_sets_declined' => env('BMS_NO_GO_SETS_DECLINED', true),
    'meeting_response_expiry_hours' => env('BMS_MEETING_RESPONSE_EXPIRY_HOURS', 24),
    'meeting_response_changes_until_start' => env('BMS_MEETING_RESPONSE_CHANGES_UNTIL_START', true),
    'meeting_response_one_time' => env('BMS_MEETING_RESPONSE_ONE_TIME', false),
    'timezone' => env('BMS_TIMEZONE', 'Asia/Riyadh'),
    'alert_renotify_days' => env('BMS_ALERT_RENOTIFY_DAYS', 3),
    'notifications' => [
        'events' => [
            'opportunity.alert' => env('BMS_NOTIFY_OPPORTUNITY_ALERTS', true),
        ],
    ],
];
