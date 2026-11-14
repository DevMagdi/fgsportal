# Phase 4 — Stage 1: Modern Enterprise Light

**Branch:** `arena/f93c3d81-fgsportal`
**Base / PR target:** `BMS` at `92c83cb0d25433c63dccf72f08719c8ab69eda9d`
**Scope:** Shared front-end design system, unified shell, and executive dashboard. No backend/API/schema/migration/authorization/business-logic changes and no package/version changes.

## Implementation

- Added a shared light palette/token scale in `frontend/src/styles/_shell-tokens.scss`: indigo `#45436E`, restrained teal `#247A70`, supporting pink/cyan/sky/lavender/periwinkle accents, semantic states, surfaces, borders, radii, shadows, spacing, focus and motion tokens.
- Refined the existing single application shell, responsive content spacing, header/breadcrumbs, role-derived sidebar, and BMS loading/error/empty states. Consolidated the shell styling into its base rules rather than layering redundant override blocks. Navigation routes, permission-derived visibility, notification/profile controls, menu events and mobile drawer state are unchanged.
- Reworked the executive dashboard structure into an overview (existing API summary/attention data), analytics grid and operations panels. KPI hierarchy and chart/legend layout are now explicit and responsive across desktop/tablet/mobile.
- Added Angular feature-module use of the already-installed PrimeNG `ChartModule`/Chart.js dependency. No dependency was added or upgraded. Language changes rebuild chart labels/options; chart configuration supports RTL tooltip text and reverse horizontal/time axes where appropriate.
- Added task-status distribution and KPI attainment presentation using actual API response data and a helper test suite. No hardcoded values or fabricated visualization records were introduced.
- Kept the original Alphaiota PNG byte-for-byte untouched. Its checked-in dimensions are 400×400 RGB (opaque); the image remains an unmasked, contained square asset.

## Dashboard elements and actual data sources

| Dashboard element | Actual source and calculation | Access/filter behavior |
|---|---|---|
| Summary KPI cards | `GET /api/bms/executive-dashboard` response `summary.*` and `tenders.*` | `dashboard.view` endpoint; existing `lookups.can` gates for task/unit/opportunity/product panels. No currency totals. |
| Attention indicators | Same response: overdue/blocked task counts, delayed/stale opportunity counts, tender counts, pending procurement and upcoming meetings | Existing ability gates retained. Values are server-provided counts. |
| Unit performance bars | Response `unit_progress[]`: API-reported average `progress`, `total`; existing helper excludes zero-task units and clamps only the visual fill | Requires existing `plans.view` and `units.view` display gates. Existing business unit/product/plan-week query behavior retained. |
| Task-status doughnut + legend | Response `unit_progress[]`: sums of `total`, `achieved`, `in_progress`, and `not_done`. Any difference between total and these known statuses is surfaced as “Other” (not silently dropped), using actual response counts. | Same task/unit visibility gates; unit/product/plan-week scope comes from the existing dashboard response. This is derived from the returned rollups, not a new endpoint. |
| Opportunity pipeline horizontal bars | Response `opportunities[]`, grouped by current `stage`; count and share are derived from those returned records. | Existing `opportunities.view` gate and existing API unit/product/opportunity filters. No opportunity value/forecast totals. |
| KPI latest achievement indicator | Latest actual/target point in selected `reports/kpis` history series. Attainment is actual ÷ target × 100 only for a positive stored target; display fill alone is capped at 100%. | Requested only with `reports.view`; API request remains filtered by the existing selected business unit. Missing/zero target produces no attainment meter. |
| KPI actual/target trend line | `GET /api/bms/reports/kpis` → stored `history[].points[]` actual/target/period data. Null target points remain gaps. | `reports.view` only; series remain distinct by unit and KPI; existing insufficient-history and retry states retained. |
| Upcoming meetings | Response `meetings[]` | Existing `meetings.view` gate and endpoint rolling seven-day/unit behavior. |
| Recent activity | Response `recent_activity[]` | Existing visibility behavior retained; omitted under non-unit filters where the endpoint cannot accurately apply them. |
| Filter options and exports | `GET /api/bms/lookups`; existing BMS export service/data builders | Existing abilities (`units.view`, `products.view`, `opportunities.view`, `plans.view`, `dashboard.export`) and supported filters unchanged. |

No new business metric or API contract has been introduced. The Phase 3 dashboard audit remains the detailed reference for filter semantics and endpoint limitations.

## Exact changed files in this PR

1. `frontend/src/styles/_shell-tokens.scss` — shared design tokens.
2. `frontend/src/app/layout/app-shell.component.scss` — consolidated shell/responsive styles.
3. `frontend/src/app/layout/header/app-header.component.scss` — consolidated header/breadcrumb styles.
4. `frontend/src/app/layout/sidebar/app-sidebar.component.scss` — consolidated sidebar/nav styles.
5. `frontend/src/app/components/bms/bms-state.component.scss` — shared state component presentation.
6. `frontend/src/app/components/bms/bms.module.ts` — imports existing PrimeNG chart module into the lazy BMS module.
7. `frontend/src/app/components/bms/dashboard/executive-dashboard.component.html` — dashboard hierarchy, charts, status legend, KPI achievement, accessibility descriptions.
8. `frontend/src/app/components/bms/dashboard/executive-dashboard.component.ts` — data-to-chart bindings, RTL/locale options, language updates and subscription cleanup.
9. `frontend/src/app/components/bms/dashboard/executive-dashboard.component.scss` — page/dashboard grid, charts, responsive layouts and reduced-motion styling.
10. `frontend/src/app/components/bms/dashboard/executive-dashboard.util.ts` — status distribution and guarded KPI-attainment helpers.
11. `frontend/src/app/components/bms/dashboard/executive-dashboard.util.spec.ts` — helper coverage for status rollups and attainment edge cases.
12. `frontend/src/app/components/bms/bms-translations.ts` — English/Arabic task-status chart title.
13. `docs/bms/PHASE_4_STAGE_1_IMPLEMENTATION.md` — this implementation, data-source and verification record.

No backend source, API, database, authorization, dependency manifest, or lockfile changed.

## Verification, screenshots, and local instructions

- `git diff --check` passed; Angular template tag structure is balanced; the implementation report has no trailing whitespace.
- Local build attempt: `cd frontend && npm run build -- --configuration production` → blocked before compilation: `ng: not found`.
- Local node-spec attempt: `cd frontend && npm run test:node` → blocked because `typescript` cannot be resolved. The new utility specs therefore remain unexecuted locally.
- Fresh PR CI run `43633746527` on commit `ca9fb6f51a9bca46ee0fc294d849d210acd752ec`: frontend lint and production build **passed**; Angular tests **failed**. Backend targeted regressions, lint and analysis **passed**; full SQLite coverage and MySQL 8 **failed**. GitHub Actions failed-log retrieval returned EOF for both jobs, so exact failure diagnostics and whether the new specs are among the Angular failures could not be confirmed. CI is red; do not treat it as acceptance.
- The checkout has no `frontend/node_modules`, globally available Angular CLI/TypeScript, or Chromium/Chrome executable. Dependencies were not installed; no browser screenshots are claimed.
- **Local/browser verification when repository-approved dependencies and a browser are available:** from `frontend`, run `npm run build -- --configuration production`, `npm run test:node`, then `npm test -- --watch=false --browsers=ChromeHeadless`. Run with `npm start -- --host 0.0.0.0`, sign in with a test account that has `dashboard.view` plus relevant unit/task/opportunity/report/meeting abilities, and open `/bms/dashboard`. Verify actual data, filters, permission-limited panels, and no-data/error states at 1440×1000 desktop, 768×1024 tablet, and 390×844 mobile. Validate English LTR and Arabic RTL charts/legends; capture populated, empty, and RTL screenshots for review. Do not use generated fixtures as proof of production data correctness.

## Separate unresolved security finding — unchanged

`backend/app/Http/Controllers/User/Auth/AuthController.php::EditUser` has an unresolved Management organizational-scope finding. Management status is based on the actor department (`sub_departments_id_fun.departments_id === 1`); the endpoint permits certain edits to another user profile/account-role fields without an explicit company/branch/business-unit relationship check. Existing F4a field-restriction coverage does not establish ownership boundaries. Track and remediate separately after policy owners define intended organizational scope. No authorization change or ownership rule was introduced here.

## Remaining limitations

- Local compilation and Angular/node spec execution were unavailable; CI production build passed but Angular tests failed. No in-browser layout/RTL test, screenshot, or live API verification was possible. Fresh green CI and browser review are required before acceptance/merge.
- Chart axis direction, font rendering, mobile canvas sizing, tooltips and resize behavior are implemented in configuration/styles but remain visually unverified here.
- Full WCAG review remains outstanding. Existing endpoint filter semantics continue to vary across dashboard domains; filter scope disclosures and existing behavior are preserved.
- Legacy-wide styles were not removed because safe non-use could not be established.
- Management organizational-scope finding requires separate policy and remediation.

## PR status

The existing PR #30 targets `BMS` and has been updated with the implementation. It remains unmerged; do not create a second PR or merge automatically.
