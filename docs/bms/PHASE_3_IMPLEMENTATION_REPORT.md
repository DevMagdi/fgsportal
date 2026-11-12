# Phase 3 — Executive dashboard implementation report

**Branch:** `arena/e1389d1e-fgsportal`
**Base:** updated `BMS` at `891851bc85b2d2f274b811c9173d6268c8752795`
**Scope:** Phase 3 only. No Phase 4+ work was started.

## Data contract and scope

The pre-implementation evidence and KPI inventory is in [`PHASE_3_DASHBOARD_DATA_AUDIT.md`](PHASE_3_DASHBOARD_DATA_AUDIT.md). The component continues to use the existing `GET /executive-dashboard` contract, `GET /lookups` permission-scoped options, and `GET /reports/kpis` only for users with `reports.view`. It does not invent source fields, endpoints, status/owner/date-range filters, or trend values. The deployed schema and representative production records were not live-verified.

## Delivered

- Replaced the old crowded dashboard layout with compact summary cards, an attention strip, unit-plan progress, current opportunity stage distribution, stored unit-KPI history, upcoming meetings, and recent activity.
- Shows only supported response values. Unit progress omits units with no task records; it never presents the API's no-task `0` as measured progress. KPI time-series points are drawn only from stored actual/target records, grouped and selected per unit and KPI name; no cross-unit sums or currency aggregation are performed.
- Added the existing API's four supported controls (`business_unit_id`, `product_id`, `opportunity_id`, `week_start`), with permission-aware option visibility, clear/apply behavior, and consistent query construction. The helper/API retains the endpoint's semantics: some subdomains such as procurement and meetings are unit-only; recent activity is hidden when product/opportunity/week filters are active because those relations are not a reliable activity filter.
- Added retryable loading/error and explicit empty states. Reports-derived KPI history and exports are hidden unless `reports.view` and `dashboard.export` respectively are present in the existing scoped `lookups.can` ability list.
- Added English/Arabic labels, locale-aware date and number rendering, a root `dir` attribute tied to the language service, responsive layouts, visible focus, reduced-motion handling, progress-bar semantics, and a screen-reader-readable KPI point list.
- Kept existing Excel/PDF export data builders. Export controls now honor the existing `dashboard.export` permission.
- Made one bounded backend change: recent activity now honors the already validated selected unit. Scope resolution handles direct unit relations, shared products and product phases related through their product. Route and permission remain unchanged. Added a feature regression covering two units and a product shared by both.
- Added pure TypeScript helper tests for filters, progress, opportunity stages, per-unit KPI series and chart points, number formatting, and localized dates.

## Limitations / follow-up verification

- Browser screenshots, real-browser interaction/accessibility checks, and the requested visual overflow/no-scroll assessment were **not completed**: no Chrome/Chromium/Firefox binary or Puppeteer/Playwright package is available in this environment. No screenshot was fabricated or committed. Karma also cannot launch without Chrome.
- Backend feature tests and live API/database reconciliation were **not completed**: PHP, `backend/vendor`, `backend/.env`, and a connected database are absent. The added backend regression is source-reviewed but unexecuted.
- Frontend builds and pure Node specs are recorded in [`PHASE_3_TEST_REPORT.md`](PHASE_3_TEST_REPORT.md). The existing browser/compiler warnings and unavailable lint target are also recorded there.
- The KPI audit's documented source/permission trace is based on checked-in controllers, models, migrations, routes, tests and seeders; it is not evidence of production data freshness or production schema parity.

## Files in implementation

- `frontend/src/app/components/bms/dashboard/executive-dashboard.component.{ts,html,scss}`
- `frontend/src/app/components/bms/dashboard/executive-dashboard.util.{ts,spec.ts}`
- `frontend/src/app/components/bms/bms-translations.ts`
- `frontend/scripts/run-node-specs.js`
- `backend/app/Http/Controllers/BMS/ExecutiveDashboardController.php`
- `backend/tests/Feature/P17EmployeeManagementTest.php`
- `docs/bms/PHASE_3_DASHBOARD_DATA_AUDIT.md`
- `docs/bms/PHASE_3_TEST_REPORT.md`
- `docs/bms/IMPLEMENTATION_ROADMAP.md`
