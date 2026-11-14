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

### Authorized local verification (2026-11-14)

- Installed strictly from the existing frontend lockfile with the repository CI command: `cd frontend && npm ci --legacy-peer-deps`. It completed successfully (1,481 packages); `frontend/package.json` and `frontend/package-lock.json` remain unchanged. npm reported 117 audit findings (12 low, 30 moderate, 64 high, 11 critical); no audit fix/update was run and no dependency versions changed.
- `npm run build -- --configuration production` **passed**. It emitted existing Autoprefixer selector/color warnings and CommonJS optimization warnings (including `canvg`); no build error.
- `npm run test:node` **passed: 71 passing, 0 failing**, including the executive dashboard helper suite.
- `npm test -- --watch=false --browsers=ChromeHeadless` ran under temporary Chromium 153 provisioned outside the repository. Result: **98 failed, 215 passed**. This exactly matches the current CI run's 98 failing entries / 215 passes and the baseline comparison: no newly failing Angular spec; both new utility specs pass. The failure entries match the baseline’s legacy TestBed missing-provider cases; they are not caused by this dashboard change.
- Started the actual Angular application with `npm start -- --host 0.0.0.0 --disable-host-check`; it compiled successfully and is served on port 4200 (the live preview). Headless Chromium loaded the real app and resolved the route to `/#/signin`. No test credentials were supplied or entered.
- **Authenticated dashboard/browser QA is blocked by absent environment services and secrets:** both development and production `environment.ts` files still contain `YOUR_FIREBASE_*`, `YOUR_BACKEND_API_BASE_URL`, and `YOUR_LEGACY_SERVER_API_URL` placeholders. There is no backend `.env`; PHP and Composer are not installed, and no database service/configuration is present. No safe test account or valid Firebase/backend configuration is available. Therefore no authenticated `/bms/dashboard` data, empty/loading response, filters, navigation-permission behavior, or real chart response was accessible. No dashboard screenshots are claimed or attached; static/fixture screenshots were not substituted.
- Sandbox network policy also blocks the external `unpkg.com` AOS script referenced by the existing `frontend/src/index.html`. On the sign-in route Chromium reported `AOS is not defined` and external resource connection failures. This is outside the dashboard implementation and was not altered here. It should be distinguished from the dashboard’s visual/RTL QA, which could not be performed.
- No desktop/tablet/mobile or English/Arabic dashboard visual conclusions can be made without a configured backend/Firebase project and safe test account. Once provisioned, use 1440×1000 desktop, 768×1024 tablet, and 390×844 mobile; verify both LTR and RTL, real dashboard API responses, charts/labels, overflow, navigation, filters, loading and empty states, and capture screenshots for review.

### Re-running checks locally

From `frontend`, use the repository-compatible install command `npm ci --legacy-peer-deps` (no manifest changes), then run `npm run build -- --configuration production`, `npm run test:node`, and `npm test -- --watch=false --browsers=ChromeHeadless`. To exercise the authenticated dashboard, first provide valid local Firebase/backend environment values, a running backend and database, and a safe test account through a secure channel (never commit secrets or include them in screenshots/logs). Start the UI using `npm start -- --host 0.0.0.0` and open `/bms/dashboard` after sign-in.

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
