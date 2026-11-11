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
    'admin_sub_department_ids' => array_filter(array_map('intval', explode(',', env('BMS_ADMIN_SUB_DEPARTMENT_IDS', '1,4')))),
    'seed_existing_admins' => env('BMS_SEED_EXISTING_ADMINS', false),
    'cors_allowed_origins' => array_filter(array_map('trim', explode(',', env('CORS_ALLOWED_ORIGINS', '')))),
    'notifications' => [
        'events' => [
            'opportunity.alert' => env('BMS_NOTIFY_OPPORTUNITY_ALERTS', true),
            'opportunity.decision' => env('BMS_NOTIFY_OPPORTUNITY_DECISION', true),
            'recruitment.created' => env('BMS_NOTIFY_RECRUITMENT', true),
            'onboarding.created' => env('BMS_NOTIFY_ONBOARDING', true),
            'support.created' => env('BMS_NOTIFY_SUPPORT', true),
            'support.responded' => env('BMS_NOTIFY_SUPPORT_RESPONSE', true),
            'procurement.created' => env('BMS_NOTIFY_PROCUREMENT', true),
            'procurement.reviewed' => env('BMS_NOTIFY_PROCUREMENT_REVIEW', true),
            'event.created' => env('BMS_NOTIFY_EVENT', true),
            'event.completed' => env('BMS_NOTIFY_EVENT_COMPLETED', true),
        ],
    ],
];
