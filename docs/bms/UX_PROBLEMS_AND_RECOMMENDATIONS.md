# UX problems and evidence-based recommendations

**Audit scope:** BMS screens and shared shell at commit `11d6b1e3394e4f31aa97340b732a6470382343e7`. Recommendations only; no UI changes were made. Visual/accessibility claims not measurable from source are marked **UNVERIFIED**.

## P0 — Navigation does not express the required product model

**Evidence:** `frontend/src/app/components/bms/bms-shell.component.ts::groups` uses Overview, Organization, Execution, Business development, Operations, People. Reports and dashboard are grouped under Overview, Access is grouped under Organization, Recruitment is grouped under People, and Products/Development are in Execution. `bms-shell.component.html` conditionally renders groups and links by ability.

**Observed impact:** top-level groups are not the six exact names/ownership; Access Management is not distinct; Reports is not its own group; People is an extra conceptual grouping. Permission filtering may result in absent group headings.

**Recommendation (Phase 2):** create one declarative route-to-category registry with exactly the six required categories; classify existing paths without changing URL/ability semantics. Put Recruitment in Organization, Users/roles in Access Management, Executive Dashboard and report routes in Reports, Products in Operations. Resolve team Development placement rather than silently dropping it. Add component tests for exact category set, link uniqueness, active state, permission visibility, expansion and route targets.

**Risk/dependency:** route visibility and existing permissions must be preserved. Decide if all six headings are always visible or if empty permission-gated headings are hidden.

## P1 — Executive dashboard is not one-screen and has no chart visualization

**Evidence:** `dashboard/executive-dashboard.component.html` stacks filter card, six-item KPI grid, another KPI grid, meetings/activity panels and three tables. Search of BMS source found no chart component/template/canvas; charts are used elsewhere in the legacy app. `bms-api.service.ts` returns live backend envelopes. Dashboard shows `generated_at` but does not show a dedicated, explicit applied-filter context.

**Observed impact:** content height necessarily exceeds a compact one-screen layout on common desktop sizes, especially with result rows; current design is data-dense but table-first. Exact current pixel height is **UNVERIFIED** because no browser run/viewport screenshot was available. No chart comparison is visible in the template.

**Recommendation (Phase 3, not Phase 2):** agree target viewport; establish verified KPI definitions/permission scope; unify filter handling in the API; use compact KPI cards and only meaningful charts based on actual data; put secondary detail in constrained panels; add responsive mode for smaller widths; show explicit filter context, freshness, empty and error states; test actual scroll height at the agreed viewport.

**Risk/dependency:** charting library is installed (Chart.js and PrimeNG ChartModule), but availability does not prove correct metrics. Avoid statistics or unsupported values. Filter semantics need product-owner approval and data reconciliation first.

## P1 — Filter state is not semantically unified

**Evidence:** `ExecutiveDashboardComponent` sends `business_unit_id`, `product_id`, `opportunity_id`, `week_start`. `ExecutiveDashboardController::index` applies week to tasks, product to task-associated units and products, opportunity can infer unit/product, procurement/meetings only use unit, and recent activity only uses viewer-visible units. The UI does not offer date range/status/owner filters.

**Observed impact:** a user can select a filter and receive widgets that reflect different subsets/period definitions without a clear per-widget scope. No common filter date range exists. Filter response consistency has a dedicated test method in `P17EmployeeManagementTest`, but the suite did not run here and the code still has domains not naturally scoped to week.

**Recommendation:** define filter applicability by data domain; encode it once in a request/query contract and return applied filters; either apply the common supported filters consistently or label widgets whose source is unfiltered. Do not expose unsupported filters.

**Risk/dependency:** cross-domain query changes may alter counts and report meaning; protect with fixtures that assert expected rows per widget and cross-unit denial.

## P1 — Business Development lacks a first-class BMS Clients workflow

**Evidence:** BMS `OpportunityController` holds `client_name`; no `clients` route/config/component/table under BMS. Legacy CRM has Partner/Contact/ContactLead and tested account/contact/lead flow in `backend/tests/Feature/CrmFlowTest.php`.

**Observed impact:** target Information Architecture lists Clients, but current BMS surface does not have a separate Clients page. Legacy Partner may be account-like, but identity and mapping rules are not interchangeable by assumption.

**Recommendation:** identify the intended source of truth (legacy Partner vs new entity) and relationship/permissions before any implementation; Phase 5 can implement only after approved mapping and tests. Avoid a second duplicate client catalogue.

**Risk/dependency:** migration/integration/data-cleanup risks and inconsistent cross-module visibility.

## P2 — Existing reusable patterns are inconsistent across BMS screens

**Evidence:** reusable `BmsCollectionComponent` + `BMS_COLLECTIONS` drives development, leads, recruitment, procurement, events, documents and directory; units, employees, plans, opportunities, products, meetings and dashboard have dedicated templates. `bms-shared.scss` is linked from BMS components, while global `styles.scss` imports Angular Material, Bootstrap, and project styles. `app.module.ts` imports Angular Material and PrimeNG modules; Angular config globally loads PrimeNG Lara Indigo and PrimeIcons.

**Observed impact:** a mix of generic data-driven forms/tables and standalone screens. Exact visual inconsistencies are **UNVERIFIED** without browser review; source confirms multiple UI library/style systems and divergent component structures.

**Recommendation (Phase 2):** define tokens for typography, spacing, color, states, focus, surfaces, controls and table density in the existing framework; reuse existing Angular Material/PrimeNG/Bootstrap only where the app already uses them; avoid introducing a framework. Add components/test coverage for shell, form validation, empty/loading/error/success, focus states and table responsiveness. Remove styles only after usage search and visual regression.

**Risk/dependency:** global CSS changes can affect legacy modules. Scope initial tokens to BMS and avoid unrelated style cleanup.

## P2 — Arabic/RTL support exists but requires consistency testing

**Evidence:** `BmsLanguageService` toggles English/Arabic, shell sets `dir` on BMS workspace and document element, translations are in `bms-translations.ts`, and shared BMS styles are imported. It resets document `dir` to LTR when shell is destroyed.

**Observed behavior:** UI supports a manual language toggle and RTL container. Translation fallback is the key itself (`t(key)`), so missing labels can appear as untranslated keys. Source styles contain CSS layout rules but a browser-based bidi/responsive review was unavailable.

**Recommendation:** add automated translation completeness checks for every used label and visual tests/screenshots at desktop/mobile; use logical CSS properties (`margin-inline`, etc.) and ensure sort/order/icon alignment. Verify direction restoration when navigating into/out of BMS.

**Risk/dependency:** global `documentElement.dir` affects legacy route on exit; test that exact boundary before changing behavior.

## P2 — Table, loading, empty, error and accessibility quality is uneven/unknown

**Evidence:** `BmsBaseComponent` tracks common `loading/error/success`; the dashboard and several collections show error or no-data states. BMS templates use ordinary HTML tables/forms, with some responsive wrappers. No BMS-specific accessibility audit or visual integration suite was identified.

**Observed impact:** source has some state handling, but keyboard navigation, focus management, screen-reader semantics, color contrast, reflow, sticky header behavior and 200% zoom compliance are **UNVERIFIED**. Some collection required-field checks return without a visible field-level error (`BmsCollectionComponent::save`), and alerts swallow errors in shell (`load` error callbacks are empty).

**Recommendation:** use shared inline validation and field-level messages; add alert fetch error/refresh states; ensure controls have labels and keyboard support; review status color contrast and non-color cues; check small viewport and 200% zoom. Do not claim WCAG compliance until measured.

**Risk/dependency:** accessibility changes should retain established form submission/validation and not hide server-side 422 details.

## P2 — Status actions and destructive wording need clear user context

**Evidence:** unit UI exposes a `remove` confirmation and separately `toggleStatus`; backend soft-deletes and refuses deletion where dependencies exist, recommending deactivation. Employee status change confirms access loss; product archive is separate. `BmsAccess` and controller scope are authoritative.

**Observed impact:** button labels/confirmation and actual soft-delete/archive semantics must be clear so users do not infer irreversible deletion. Current implementation is safer than hard-delete in UI path, but live retention policy is **UNVERIFIED**.

**Recommendation:** distinguish archive/deactivate from delete, state consequences and affected records, show API dependency errors plainly, and audit all admin changes. Do not change cascade/deletion semantics without database review.

## Phase-based recommendations (no authorization implied)

- **Phase 2:** only shell/IA, scoped design tokens/components, RTL/responsive, accessible navigation and navigation tests. Preserve URLs and permission abilities.
- **Phase 3:** executive dashboard layout and unified filter/query contract only after KPIs are defined and validated on real data.
- **Phase 4:** Organization/Access workflows, including director/member lifecycle and safe unit setup after DB/dependency review.
- **Phase 5:** Clients mapping, execution/BD workflow completeness and forecast definitions.
- **Phase 6:** operations/report reconciliation and export permission validation.
- **Phase 7:** full production, security, accessibility, performance and rollback verification.
