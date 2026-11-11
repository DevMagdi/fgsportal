# BMS implementation decisions

## B1 — dependency provenance

Packagist was not reachable in the previous execution environment. PHP 8.1.34 was executed through PHP-WASM. Composer 2.11.2 installed the project from GitHub distribution archives. Two development tools were pinned explicitly in `composer.json`: `php-cs-fixer/shim` 3.95.30 (GitHub commit `413c9705404163fa3e5f7854208c5e9ae1a4590d`) and `phpstan/phpstan` 2.3.5 (GitHub tag `2.3.5`). Runtime versions recorded were Laravel 8.83.25 and PHPUnit 9.5.25.

`composer.lock` was intentionally committed with the Phase A quality-tool changes; this continuation has not changed it. No dependency version difference can honestly be claimed in this fresh session because `vendor/` is absent. The installed-version comparison is therefore **not verifiable here**, not an assertion that every package matched. CI must run `composer install` from the lock and `composer validate --strict`.

## B2 — BRD operations and employee permissions

The BRD module table says **“M5 Leads and Partnerships”** has primary users **“Alpha Gen, Operations”**. Flow 8 requires an **“Operations user”** to **“Create lead with entity and contact details”** and track it. Accordingly Operations retains/restores `leads.view`, `leads.manage`, and `leads.convert`; conversion is part of that lead workflow.

The M8 primary users are **“PR, all units”**. This does not make every primary user an event manager: section 14 gives event management to Unit Directors and PR & Marketing. Therefore Operations does not receive `events.manage`.

Employee is the task owner and recipient of support, not the unit support manager. Section 14 assigns support management to Coordinator/Unit Director, while Employees update their own tasks. Therefore Employee does not receive `support.manage`.

The permission matrix test now reflects those decisions.

## P0-5 defaults

The no-update threshold uses `BMS_OPPORTUNITY_STALE_DAYS` (7 days), re-notification uses `BMS_ALERT_RENOTIFY_DAYS` (3 days), and scheduling uses `BMS_TIMEZONE` (Asia/Riyadh). No-go sets `declined` by default through `BMS_NO_GO_SETS_DECLINED`.
