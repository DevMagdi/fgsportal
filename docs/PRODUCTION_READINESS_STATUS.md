# BMS production-readiness delivery status

> **2026-11-12 update 2 (branch `arena/c5fbf220-fgsportal`).** PR #20 review findings fixed:
> the deployed migration `000010` no longer gets extra columns (a new forward-only
> `000011` repairs already-upgraded databases), KPI trends are isolated by unit + name,
> employee import now detects duplicates *inside the uploaded file* and never echoes
> prepared payloads, and the recent-activity cache key is consistent. Verified here:
> 671 PHP files parse, Angular development **and** production builds pass, pure specs
> 28/28. PHPUnit/MySQL/E2E still not executable → decision unchanged: **NO-GO**.
>
> **2026-11-12 update 1 (branch `arena/83fd2d35-fgsportal`).** Three defects found in the
> PR #19 review are fixed (manager validation could never fail, dashboard procurement
> count ignored its unit filter, recent-activity could expose out-of-scope records);
> bulk employee import and a unit KPI register with trend data were added. Verified in
> this environment: all 670 backend PHP files parse, Angular development **and**
> production builds pass, and the pure-spec suite is 28/28. **PHPUnit, MySQL, coverage
> and E2E were still not executable here** (no PHP runtime, no browser), so the decision
> below is unchanged: **NO-GO**. Details: `docs/BMS_FINAL_IMPLEMENTATION_AUDIT.md`.

## Decision

**NO-GO for production.** This is a verified partial delivery, not a claim that the complete BRD hardening checklist is finished. The current branch may be merged to retain tested work.

## Work items and evidence

| Item | Status | Commit | Evidence |
|---|---|---|---|
| Phase A | Foundation delivered; full CI matrix not executed here | `9b66e71` | HTTP/JWT/role/middleware tests, reusable legacy+BMS schema/seeder helpers, quality scripts and CI configuration |
| P0-1 | Delivered | `a36fc54` | Weekly-plan visibility uses `visibleUnitIds`; focused test passed (19 assertions) |
| P0-2 | Delivered | `d1d920d` | Validated configurable SAR default and reversible migration; focused test passed (11 assertions) |
| P0-3 | Delivered | `b845d2b` | Scoped Alpha Delta decision, pending filter, alerts, history/audit and no-go behavior; focused test passed (16 assertions) |
| P0-4 | Delivered | `265d58b` | Read-only invitation GET, explicit throttled POST, expiry/XSS/authorization tests; focused test passed (36 assertions) |
| P0-5 | Alert service and scheduler delivered | `e402cec` | Seven-day no-update and submission-delay rules, three-day re-notification, auto-clearing, Asia/Riyadh 07:00 schedule; focused test passed (17 assertions) |
| Remaining P0 | Incomplete | — | Notification rollout to every event, security hardening, SheetJS replacement, dependency disposition and every-endpoint coverage |
| P1/P2/Phase Z | Not completed | — | No completion claim is made |

## Executed verification

- Full PHPUnit suite on SQLite through PHP-WASM: **68 tests, 369 assertions, green**.
- Runtimes: PHP 8.1.34, Laravel 8.83.25, PHPUnit 9.5.25.
- No MySQL 8, browser/E2E, native-PHP, coverage, PHPStan, Angular build/test, queue worker, scheduler daemon, backup drill or four-persona UAT run is claimed.

## Defaults and behavior decisions

- Currency defaults to configurable `SAR`; existing currencies are preserved.
- Go/no-go defaults to `pending`; no-go transitions to declined only when configured.
- Public meeting invitations expire after 48 hours by default; changes are allowed before the meeting starts unless one-time-use is enabled.
- Opportunity no-update threshold is seven days; re-notification is every three days.
- Scheduler timezone defaults to `Asia/Riyadh`.

## Remaining risks and extra findings

- Queued database+mail infrastructure exists, but rollout to all BMS business events is incomplete and real worker delivery is unverified.
- Full production security, dependency, frontend, performance, coverage, migration rollback and operational acceptance gates remain open.
- MySQL-specific behavior is unverified in this environment.
- Existing P0-5 tests verify command execution and schedule registration, not an always-running production scheduler.
