# Phase 4 — Stage 1: Modern Enterprise Light

**Branch:** `arena/f93c3d81-fgsportal`
**Base / PR target:** `BMS` at `92c83cb0d25433c63dccf72f08719c8ab69eda9d`
**Scope:** Frontend design tokens, shared BMS state styling, unified shell presentation, and executive dashboard visual treatment. No API, backend, authorization, schema, migration, business-logic, route, or dependency changes.

## Delivered

- Established reusable application/BMS tokens in `frontend/src/styles/_shell-tokens.scss`: indigo primary `#45436E`, restrained teal `#247A70`, pink, cyan, sky, lavender and periwinkle accents, semantic colors, surface/border/radius/shadow/spacing/motion scales, and focus color. Accent use is limited to decorative/semantic treatments; text colors remain dark enough for readability on light surfaces.
- Refined the existing single app shell, sticky header, breadcrumb chrome, role-derived sidebar, active navigation states and mobile drawer through scoped stylesheet overrides. Existing route registrations, permission-derived navigation, role visibility, menu handlers, notification/profile interactions, and mobile state wiring were not changed.
- Reworked existing executive dashboard presentation for readable responsive KPI cards, filters, attention indicators, progress and pipeline charts, KPI trend, operations panels, empty/error/loading states, and small screens. No dashboard data or request logic was changed.
- Updated the shared BMS loading/error/success/empty state presentation to use shared tokens and accessible contrast/focus treatments. Added reduced-motion handling in the token layer and affected motion styles.
- Preserved Arabic/English behavior: the shell's existing `lang`/`dir` and BMS direction binding are untouched; dashboard layout uses logical inline spacing and existing localized labels/formatters.
- The official asset `frontend/src/assets/img/alphaiota-logo.png` was not changed or re-encoded. Its checked-in PNG header confirms 400×400 RGB (opaque) dimensions. Existing display remains contained within a square image element; no CSS masking, cropping, recoloring, filtering, or redraw was introduced.

## Dashboard visualization data and permission sources

All existing API contracts, view permissions and filters were retained. The redesign changes styling only and does not add computed business metrics or fixture values.

| UI element | Existing source / derivation | Existing access and filter behavior |
|---|---|---|
| Summary cards (units, tasks, achieved, opportunities, products, tender count/submitted) | `GET /api/bms/executive-dashboard`: `summary.*`, `tenders.*` | Endpoint remains gated by `dashboard.view`; unit/task, opportunity, and product visibility continues to follow existing `lookups.can` abilities. Uses the API counts as provided; no money totals are rendered. |
| Attention indicators (overdue/blocked tasks, delayed/stale opportunities, delayed/no-update tenders, pending procurement, upcoming meetings) | Same endpoint's `summary.*` and `tenders.*` | Each indicator remains conditionally visible under existing task/opportunity/procurement/meeting permission checks. |
| Unit plan progress bars | `unit_progress[]` from executive dashboard; existing helper sorts units with tasks and clamps only the displayed bar width | Unit/task permission checks; existing business-unit, product-linked-unit, and exact plan-week filters as supported by the endpoint. Displayed percentage remains API-reported. |
| Opportunity stage distribution | `opportunities[]` grouped by each returned record's current `stage` using existing `opportunityStages` helper | `opportunities.view`; existing unit/product/opportunity filters and endpoint scope. This is a record count, not a value/forecast sum. |
| KPI history line and target segments | `GET /api/bms/reports/kpis` → stored `history[].points[]` actual/target/period records; existing chart helper orders and plots returned points | Requested only when existing `reports.view` ability is present; unit selection forwarded. Series stay separate; insufficient/missing real points produce existing empty state. No values synthesized. |
| Upcoming meetings list | `meetings[]` from executive dashboard response | `meetings.view`; endpoint's supported meeting/unit scope and rolling seven-day response. |
| Recent activity list | `recent_activity[]` from executive dashboard response | Existing feed visibility behavior is preserved; it is hidden under existing non-unit filters where the endpoint cannot accurately apply those filters. |
| Filter options | `GET /api/bms/lookups` permission-filtered `units`, `products`, and `opportunities` | Existing visibility gates, ability checks, filter names and endpoint semantics retained. |
| Excel/PDF export | Existing export service and dashboard response builders | Existing `dashboard.export` permission gate retained. |

The API contracts remain the authoritative data definition. The existing Phase 3 audit documents detailed filter/domain limitations in `PHASE_3_DASHBOARD_DATA_AUDIT.md`; this visual Stage 1 does not broaden or reinterpret them.

## Exact changed files

1. `frontend/src/styles/_shell-tokens.scss` — shared palette, semantic colors, spacing, surface, motion, and typography tokens.
2. `frontend/src/app/layout/app-shell.component.scss` — shell surface and responsive content spacing refinements.
3. `frontend/src/app/layout/header/app-header.component.scss` — refined header/breadcrumb/control surfaces and compact/mobile treatment.
4. `frontend/src/app/layout/sidebar/app-sidebar.component.scss` — refined nav hierarchy and selected/current state styling.
5. `frontend/src/app/components/bms/dashboard/executive-dashboard.component.scss` — responsive dashboard cards, indicators, panels, charts, controls, and reduced-motion behavior.
6. `frontend/src/app/components/bms/bms-state.component.scss` — shared loading, error, success, empty and retry styles.
7. `docs/bms/PHASE_4_STAGE_1_IMPLEMENTATION.md` — implementation, data-source, verification and limitation record.

No TypeScript, template, translation, package manifest/lockfile, backend, API, database, authorization, or test files were changed.

## Verification and screenshots

- `git diff --check` passed for the tracked source patch. The new report was scanned separately and has no trailing whitespace.
- Local frontend build and Node tests could not be run in this checkout because `frontend/node_modules` is absent (`ng: not found`; Node-spec runner cannot resolve `typescript`). Dependencies were not installed and package versions were not changed.
- The most recent known GitHub Actions run before these edits (`43613515199`) was failed: frontend lint and production build passed, Angular tests failed; backend targeted regressions/lint/analysis passed, with full SQLite coverage and MySQL 8 tests failing. Failed-log retrieval returned EOF, so unavailable test diagnostics are not asserted here. This pre-change CI run is not validation of this Stage 1 patch.
- No running browser preview or screenshot capture was available in this environment; no screenshot is claimed. A visual smoke pass should be completed with installed frontend dependencies and real browser access before merge.

## Separate unresolved security finding — not changed in Stage 1

`backend/app/Http/Controllers/User/Auth/AuthController.php::EditUser` has an unresolved Management organizational-scope finding. The Management check is based on the actor's department (`sub_departments_id_fun.departments_id === 1`); the endpoint permits certain edits to another user's profile/account-role fields without an explicit company/branch/business-unit relationship check. Existing F4a field-restriction coverage does not establish organizational ownership boundaries. Track and remediate separately after policy owners define intended scope. This Stage 1 makes no authorization or backend change and does not infer a tenant/unit ownership rule.

## Known limitations / remaining technical debt

- No local compile, unit test, Angular/Karma run, screenshot, or browser/RTL visual verification for this patch due missing dependencies/browser setup. Existing failed CI remains visible and must be reconciled with a fresh CI run.
- Production API/data quality and the deployed schema were not live-verified in this environment. Existing endpoint filter semantics remain mixed across dashboard domains; do not imply every filter applies to every panel.
- The dashboard's existing chart implementation is native SVG/CSS and was not replaced with a chart dependency. Full accessibility/WCAG review remains outstanding.
- Existing legacy-wide theme styles and old design-system artifacts were intentionally not removed: their usage was not proven obsolete, and Phase 4 Stage 1 must not disrupt legacy modules.
- Security finding above requires separate explicit organizational-scope policy and remediation.

## Review status

Implementation is isolated on the current branch. Create a reviewable pull request targeting `BMS` only after final branch review and fresh validation; do not merge automatically.
