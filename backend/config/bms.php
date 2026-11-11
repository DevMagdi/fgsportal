<?php
return [
    // BRD Q6: deployers can agree and change the no-update threshold without code changes.
    'opportunity_no_update_days' => env('BMS_OPPORTUNITY_STALE_DAYS', 7),
    'default_currency' => env('BMS_DEFAULT_CURRENCY', 'SAR'),
    'currencies' => ['SAR', 'USD', 'EUR', 'EGP', 'AED', 'KWD', 'OMR'],
];
