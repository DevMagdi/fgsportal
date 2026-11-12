# Phase 3 — Test and verification report

**Date:** 2026-11-12 (UTC)
**Branch:** `arena/e1389d1e-fgsportal`
**Scope:** Phase 3 only. No checks were skipped or disabled. Browser API data below is explicitly mocked; it is not backend integration evidence.

## Completed checks

| Command / check | Exit | Result |
|---|---:|---|
| `npm ci --legacy-peer-deps --no-audit --no-fund` (`frontend/`) | 0 | Installed 1,481 lockfile packages. npm reported existing dependency deprecation notices. |
| `npm run test:node` (`frontend/`) | 0 | **42 passing, 0 failing.** Includes dashboard utility, BMS catalogue/navigation, module registry and permission-cache specs. No live API/database. |
| `npm run build -- --configuration production` (`frontend/`) | 0 | Production Angular build passed. Build hash `ba668542072a6657`; existing Autoprefixer, CSS selector and CommonJS/canvg warnings remain. |
| `npm test -- --watch=false --browsers=ChromeHeadless` with temporary Chromium 153 launcher (`frontend/`) | 1 | **211 executed: 76 passed, 135 failed.** All specs ran; none were skipped/filtered. Failure details include missing `HttpClient`, `MatSnackBar`, `Router` and `MessagingService` providers and a missing `formControl` directive in legacy component test modules. These are not reported as passing. |
| `git diff --check` (repository root) | 0 | No whitespace errors at last check. |
| Real Chromium UI smoke/interaction run, using Chromium 153 at 1440×1000, 768×1024, 390×844 | 0 | Dashboard rendered in Chromium with controlled, intercepted API responses. Checked populated, empty, loading, service-error, retry-success, Arabic/RTL, restricted-permission and filter-query states; saved genuine browser screenshots in `phase3-qa/`. No app page exception was observed in the successful run. The test intentionally intercepted API calls and is not live integration or a complete WCAG audit. |

## Phase 2 comparison

- **Angular:** Phase 2 baseline was 204 tests, 135 failures and 69 passes. This full local Phase 3 run executed 211 tests, with the same 135 failures and 76 passes: **seven more passes, no increase in the raw failure count**, and seven more specs executed. The matching 135-failure count is not a green suite; baseline-style provider/test-module errors remain.
- **Backend:** Phase 2 baseline recorded 149 tests, 5 errors and 6 failures. Phase 3 CI previously exposed a PHP parse error in `P17EmployeeManagementTest.php` at line 570. The edited test file parses with a temporary `php-parser`, including the corrected fully-qualified model references; this is only a parser check, not native PHP lint or a PHPUnit result. Current backend counts cannot be compared because no PHP runtime or `backend/vendor` exists locally and no rerun against the edited source has completed.

## Backend checks not run

Native `php -l`, the focused P22 test, relevant dashboard/permission feature tests, and the full backend PHPUnit suite were attempted but could not start: `php` is not installed, `backend/vendor/bin/phpunit` is absent, and there is no configured `backend/.env`/database. The PHP parser syntax result must not be treated as native lint. Backend integration, database behavior and the new authorization regression remain unverified.

## Chromium QA detail and evidence

The temporary Chromium package could be launched after extracting its bundled Amazon Linux 2023 libraries. The Angular dev server compiled successfully. The QA harness supplied a test user and intercepted `/api/bms/*` responses; requests to the configured placeholder backend were not sent to a real server. It exercised the existing dashboard controls and captured the API query `business_unit_id=1&product_id=5&opportunity_id=7&week_start=2026-11-08`.

- At **1440×1000**, **768×1024**, and **390×844**, document/body scroll widths equalled the viewport width (no horizontal overflow observed).
- Arabic switch changed dashboard content to Arabic and its workspace direction to RTL; document root direction remained unchanged.
- Populated and empty states rendered; a simulated 503 rendered the retry control; activating retry then returned populated data. A deliberately stalled dashboard request rendered the loading state.
- With restricted abilities (`dashboard.view`, `plans.view` only), the dashboard showed no unit/product/opportunity filter controls, exports, opportunity/product/report/meeting content; only permitted task summary and recent-activity panel remained.
- Basic landmarks, labeled filter controls, progressbar semantics and button/alert labels were inspected. This is a manual smoke check, not a comprehensive keyboard/screen-reader/WCAG conformance audit.
- Browser console warnings/errors included external CDN integrity failures because external resources were stubbed under the sandbox network constraints, the configured placeholder Firebase websocket failure, and the two deliberate mocked 503 responses. Those harness/environment errors were not hidden or counted as application passes.

Screenshots (genuine browser captures; test data is synthetic/mocked):

- `phase3-qa/populated-desktop.png`
- `phase3-qa/populated-tablet.png`
- `phase3-qa/populated-mobile.png`
- `phase3-qa/arabic-rtl-1440.png`
- `phase3-qa/empty-1440.png`
- `phase3-qa/loading-1440.png`
- `phase3-qa/error-1440.png`
- `phase3-qa/retry-1440.png`
- `phase3-qa/restricted-mobile.png`

## Remaining acceptance work

1. Provide a supported PHP environment and run native lint, the focused P22 test, relevant dashboard/permission tests and full backend PHPUnit without skips; compare full results to Phase 2.
2. Run the edited backend suite against its supported database configuration and validate Product/ProductPhase relationships plus unknown-scope activity behavior under both global and restricted roles.
3. If acceptance requires real backend data, repeat browser/API checks against a configured backend and representative records; current browser screenshots demonstrate only frontend behavior with controlled fixtures.
4. Re-run `git diff --check` after final documentation/source edits. Do not merge PR #26 or begin Phase 4 without explicit approval.
