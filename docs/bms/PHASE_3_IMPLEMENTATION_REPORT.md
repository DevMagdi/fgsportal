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

## Verification status and remaining limitations

- A genuine Chromium 153 session now exercised the application at 1440×1000, 768×1024 and 390×844 with intercepted synthetic API responses. It checked populated/empty/loading/error/retry, Arabic RTL, supported filter query construction, restricted-permission visibility, basic landmarks/control semantics and horizontal overflow. Screenshots are in [`phase3-qa/`](phase3-qa/). This is a frontend smoke check with mocked endpoints, not live API authorization/data reconciliation or a comprehensive WCAG audit. External CDN SRI warnings and a placeholder Firebase websocket error were present because external services are unavailable; two 503s were deliberately injected for retry-state coverage.
- Backend feature tests, native PHP lint and live API/database reconciliation remain **unverified**: PHP, `backend/vendor`, `backend/.env` and a database are absent. The temporary PHP parser accepts the edited test syntax but is not native lint. The P22/ProductPhase/procurement and unknown-scope activity regression assertions have not executed.
- The full Angular/Karma suite did execute in Chromium: 211 specs, 76 passing and 135 failing, versus Phase 2's 204/69/135 baseline. Thus seven additional passes and the same raw failure count; the suite remains red because of legacy provider/directive setup failures. Pure Node tests (42/42) and the production Angular build passed after restoring the lockfile dependency tree.
- See [`PHASE_3_TEST_REPORT.md`](PHASE_3_TEST_REPORT.md) for exact commands, baseline comparison, browser harness limitations and screenshot list. The KPI audit's source/permission trace remains based on checked-in code; no production schema/data claims are made.

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
