# BMS implementation roadmap after Phase 1 audit

This roadmap records evidence-based work and dependencies. Phase 1 audit, Phase 2 shell, Phase 3 dashboard, and a bounded Phase 3.5 stabilization are in the active feature branch. Phase 3.5 fixes two validated persistence defects and a date-only parsing defect; complete CI, database provisioning, shared-unit security policy, and real integration remain open. Phase 4 and later are out of scope and require explicit approval.

## Phase 1 — Complete Product Audit & UX Foundation

**Status:** Phase 1 audit approved; Phase 2 implementation and full diff review are complete on the active feature branch. Phase 2 changes are limited to BMS frontend navigation, shell styles/state and confirmation primitives, localized labels, tests, and this IA/roadmap documentation. No backend/data/auth/permission behavior changed.

### Phase 1 checklist
- [x] Inspect actual frontend/backend architecture, routes, BMS modules, tests, schema assets, migrations, seeders and permission code.
- [x] Trace the requested 20 workflows to source paths and available feature-test definitions; explicitly identify what remains unverified.
- [x] Record the existing navigation and dashboard against the target product structure.
- [x] Run the available frontend pure-TypeScript test suite after installing locked dependencies; record exact results below.
- [x] Create the six Phase 1 audit deliverables below.
- [x] Keep Phase 1 changes documentation-only; no application/data behavior changes.
- [ ] Run PHPUnit, Angular tests/build and live DB validation when required runtimes/schema are provisioned (blocked in this checkout; not reported as passed).

Deliverables:
1. `PRODUCT_AUDIT.md`
2. `INFORMATION_ARCHITECTURE.md`
3. `WORKFLOW_MATRIX.md`
4. `DATABASE_AND_PERMISSIONS_AUDIT.md`
5. `UX_PROBLEMS_AND_RECOMMENDATIONS.md`
6. `IMPLEMENTATION_ROADMAP.md`

## Phase 2 — Design System & Application Shell (implemented; diff reviewed)

### Scope
- Replace current BMS group structure with exactly the six required labels and route mappings.
- Set target categories: Organization (units, employees, recruitment, Team Development), Access Management (access/roles), Execution (weekly plans, tasks), Business Development (leads, opportunities/tenders), Operations (meetings, products, procurement, events, documents), Reports (executive dashboard and reports).
- Preserve `/bms/development` under Organization as Team Development, based on the course/training/certification domain evidence recorded in `INFORMATION_ARCHITECTURE.md`.
- Preserve all existing route paths, server endpoints, authorization ability slugs, route guards, audit behaviors and legacy navigation.
- Add scoped reusable design tokens and shell primitives using existing Angular 13 / installed libraries. No new UI framework.
- Cover English/Arabic, direction switching, responsive navigation, active state, expansion, permissions, all routes and no duplicate/orphan links.

### Phase 2 resolutions and verification limits
- All six category headings are always rendered; only links whose existing abilities are present are rendered. Empty expanded groups show a generic empty message, not unauthorized route names or controls.
- Team Development is placed in Organization with the existing `/bms/development` route and `development.view` ability; rationale is documented in `INFORMATION_ARCHITECTURE.md`.
- Responsive shell breakpoints are 980px and 560px; the dashboard no-scroll requirement was not applied.
- The Angular/Karma browser unit-test target still cannot launch its ChromeHeadless runner in this checkout (`CHROME_BIN` is unset); this limitation is separate from the real Chromium/Puppeteer interaction QA completed below. Backend/DB integration was not exercised.
- All existing native `confirm()` prompts in BMS were migrated to one shared accessible Material dialog with English/Arabic labels, RTL/LTR direction, focus restoration, explicit cancel behavior, and destructive-action styling. Its Angular component spec is present but was not executed because Karma cannot launch without Chrome.

### Phase 2 verification results
- `npm ci --legacy-peer-deps --no-audit --no-fund`: **passed**, installed 1,481 locked packages; npm emitted existing dependency deprecation notices.
- `npm run test:node`: exit 0; terminal summary **35 passing, 0 failing** (covers exact six-category order/English-Arabic headings, route uniqueness/completeness, permission filtering, expand/collapse, active route, Development route/ability, and guard allow/deny behavior).
- `npm run build -- --configuration development`: exit 0; build completed, hash `107b1daaf5a1a823`.
- `npm run build -- --configuration production`: exit 0 after final Phase 2 QA fixes; build completed, hash `bac97c92f38a868c`. Existing Autoprefixer (`end`), canvg/CommonJS and legacy CSS-selector warnings remain.
- `npm test -- --watch=false --browsers ChromeHeadless`: Karma compiled the browser test bundle, then exited 1 at browser launch with `No binary for ChromeHeadless browser on your platform. Please, set CHROME_BIN env variable.` Angular/Karma browser component specs remain unexecuted; the interactive behavior, visual captures and accessibility spot checks were instead executed separately with real Chromium/Puppeteer as documented below.
- `npm run lint`: exited 1 with `Cannot find "lint" target for the specified project.` This Angular project has no configured lint target.
- `git diff --check`: exit 0.
- Source review confirms `BmsModule` route definitions are unchanged; `BmsPermissionGuard`, `BmsAccessService`, route URLs, and ability checks are unchanged. The module only adds the dialog/state declarations and Material imports/provider.
- Confirmation review: callers perform no action unless `afterClosed()` maps to literal `true`; Escape/backdrop/cancel return false. Revoke, employee deactivation, unit deletion, and product archival are marked destructive. Browser QA confirmed modal focus, accessible title and description, cancellation/confirmation behavior, and focus restoration.
- Styling review: the only global stylesheet addition is the `.cdk-overlay-pane.bms-dialog-panel` selector required for the Material overlay; all new shell/page primitives are loaded from BMS component styles. Existing BMS primitive declarations are deliberately overridden by the BMS design-system layer; no legacy module stylesheets were edited. The supported-Chromium visual and interaction evidence is summarized below.
- No backend, database, migration, seeder, or business-logic files are in the Phase 2 change set.
- No backend, PHP, DB, or permission-matrix suite was changed or run as part of Phase 2. PHP and `backend/vendor` are absent, and no database connection/dump is available; production schema/data were not validated.
- Eight viewport-sized English/Arabic desktop/mobile screenshots were captured in `/home/user/phase2-qa/screenshots/`; the Karma runner limitation does not affect these Puppeteer captures.

### Phase 2 real-browser visual and interaction QA — 2026-11-12

Executed supported headless Chromium 153 with Puppeteer Core 25.17.0 against the running Angular app. The browser test intercepts requests and supplies deterministic mock API responses (including signed-in identity and permission sets); external styles/scripts and AOS initialization are stripped for isolation. This verifies frontend flows, not production API/database integration.

- **Viewports/screenshots:** eight PNG captures at the agreed script defaults: desktop 1440×1000 and mobile 390×844. Files: `desktop-en-expanded.png`, `desktop-en-collapsed.png`, `desktop-ar-expanded.png`, `desktop-ar-collapsed.png`, `mobile-en-closed.png`, `mobile-en-open.png`, `mobile-ar-open.png`, `mobile-ar-closed.png` in `/home/user/phase2-qa/screenshots/` (workspace evidence, not committed).
- **Navigation/routes:** all six categories rendered; all 16 allowed BMS links were visited and displayed their route heading without a BMS error state. Active route/`aria-current`, dashboard and units breadcrumbs, category expand/collapse and English↔Arabic language/direction switch passed. With only `units.view`, only the Business units link appeared and a direct `/bms/access` visit redirected to `/bms/units`.
- **Responsive drawer:** mobile drawer opened and closed by toggle, backdrop and Escape in English/Arabic; hidden drawer was `aria-hidden` and inert. Desktop expanded/collapsed and LTR/RTL captures completed.
- **Confirmation dialog:** modal role, `aria-modal`, labelled title and newly explicit description were present; initial focus entered the dialog container; cancel, Escape and backdrop each closed without mutation; confirm issued one mocked assignment request; Cancel restored focus to its invoking button.
- **Accessibility spot checks:** keyboard Tab reached a category toggle with a visible 3px focus outline; 20 visible interactive controls on the Arabic mobile dashboard had accessible names; Arabic navigation label and main landmark were present; sampled navigation text contrast was 10.07:1. These are focused checks, not a full WCAG audit.
- **Runtime/navigation errors:** all 16 routes passed; no uncaught page errors or failed requests occurred. Console errors were limited to Firebase Messaging unsupported-browser messages and a WebSocket attempt to the repository's placeholder `your_firebase_project_id` RTDB host; these are environment/configuration limitations, not BMS route/API failures.
- **Confirmed Phase 2 fixes from browser QA:** `BmsApiService` is root-provided so the root-scoped BMS permission service can inject it; the confirmation dialog now explicitly references its message through `aria-describedby`.
- **Limitations:** all API traffic was mocked; no live backend, database, production permissions or real user data were tested. Karma/ChromeHeadless specs were not run. Existing legacy portal navigation remains visible around the BMS shell, consistent with the Phase 2 legacy-navigation preservation scope; screenshots show that integrated host context. No Phase 3 work was started.

### Acceptance criteria
- Exactly the six specified top-level group labels; no other top-level categories.
- All existing BMS routes remain reachable for the same authorized users and still deny unauthorized direct navigation.
- Each existing BMS route appears exactly once or is explicitly classified as a utility/unlisted route, with no orphaned workflows.
- Active link and expand/collapse behavior work by keyboard and pointer; visible focus state and accessible navigation names.
- English/Arabic navigation labels exist, with RTL layout and correct direction restoration.
- No changes to backend permissions/data/migrations; focused Angular nav tests pass and no new frontend regressions.
- Inspect diff; only Phase 2 scoped files changed.

## Phase 3 — Executive Dashboard (implementation complete; final acceptance gate remains open)

### Scope and evidence
- `PHASE_3_DASHBOARD_DATA_AUDIT.md` documents supported KPI formulas, source fields/API response, filters, permissions and limitations. The deployed schema and representative production data were not live-verified.
- The dashboard reuses the existing executive endpoint and validated unit/product/opportunity/week filters; it invents no unsupported KPI source or filter.
- UI includes permission-conditioned metrics/exports/report-derived history; synchronized filters; loading, empty and retryable error states; English/Arabic locale and LTR/RTL; responsive cards/panels and accessible chart summaries.
- The selected-unit recent-activity backend adjustment preserves route/permission semantics and handles direct unit, shared product and product-phase relationships. Focused P22, P18, P19, P20 and P1.1 regressions all pass in CI.
- Genuine Chromium 153 screenshots and interactions at 1440×1000, 768×1024 and 390×844 are in `phase3-qa/`. API responses were intercepted synthetic fixtures: no live backend or production-data validation is claimed. Latest layout measurements and CI results are recorded in `PHASE_3_TEST_REPORT.md`.

### Acceptance status (final CI run 43297021468; commit `0a756586`)
- [x] Document KPI source/formula, filters, permissions and limitations before implementation.
- [x] Keep metrics tied to existing API aggregates and stored KPI history; do not combine unlike KPI series or currencies.
- [x] Implement supported controls, states, permission visibility, responsive layout, localization and accessible chart summaries.
- [x] Add helper and backend regression coverage. Native PHP syntax check plus focused P22/P18/P19/P20/P1.1 CI regressions pass.
- [x] Run all Node specs: 42/42 pass. Local production Angular build passes (hash `79b2571d10234099`); CI build was skipped after Karma failed.
- [x] Run the complete Angular/Karma suite without exclusions: 211 specs, 76 pass / 135 fail. Phase 2 was 204, 69 / 135. Exact failing labels and normalized primary diagnostics match; the suite remains red. See `phase3-qa/angular-failure-comparison.md`.
- [x] Run unfiltered complete backend suites on SQLite and MySQL. Both run 150 tests and fail (1 error, 6 failures). Compared with the recorded Phase 2 baseline (149 tests, 5 errors, 6 failures), current run has four fewer errors and the same six failure labels/messages; see the test report for exact details and the historical-baseline log limitation.
- [x] Run Chromium visual/interaction QA with mocked API data. At 1440×1000, document `scrollHeight=clientHeight=1000`; at 768×1024, `1151/1024`; at 390×844, `1906/844`. No horizontal overflow, dashboard-block overlaps or clipped descendants were measured. Scenarios include populated/empty/loading/error/retry, RTL/LTR, filters, exports and restricted permissions.
- [ ] Obtain green complete backend and Angular/Karma suites; investigate baseline and current failures without skipping tests or weakening assertions. Local lint has no Angular target; CI lint/analyse are non-gating (`continue-on-error`) and emitted static-type diagnostics.
- [ ] Validate backend authorization/data behavior against a configured live backend/database. Mocked browser requests do not meet this requirement; production data and comprehensive WCAG/assistive-technology behavior remain unverified.

**Phase 3 final gate is NOT PASSED; do not merge PR #26.** Phase 3 remains the stopping boundary. Do not begin Phase 4 or later without explicit user approval.

## Phase 3.5 — Engineering Stabilization (bounded; acceptance pending)

**Starting SHA:** `ae790a960bf52cda08f0047a43de896ea0972145` (verified open PR #26 head). **Candidate source SHA:** `7de9f0479c75269c658bf80772e2ddd343fe29c9`; latest candidate CI run `43300908597` was still in progress at the time the stabilization reports were drafted. The final pushed commit may add report-only documentation after that source validation; outcomes must be updated from the completed run.

- [x] Verify branch, base commit `891851bc85b2d2f274b811c9173d6268c8752795`, PR state/base/head, changed files and review findings; no branch switch, merge or base mutation.
- [x] Reproduce causes by source inspection for product metadata (model mass-assignment allowlist) and manager ID persistence (legacy User fillable list); patch by direct assignment after validation rather than widening global fillable rules.
- [x] Fix double-escaped date-only regex; add regression and run Node specs in `America/Los_Angeles` (43/43 pass).
- [x] Make backend validation steps cancellation-safe (`!cancelled()`); schedule frontend production build after dependency install even if Karma fails.
- [x] Run local production Angular build (hash `dda2defb94f80af4`); `git diff --check` passes.
- [ ] Record candidate CI 43300908597 final native PHP lint, focused tests, complete SQLite/MySQL results, Karma results and CI production build.
- [ ] Resolve or explicitly approve remaining backend module/meeting/import failures. Do not change legacy meeting or core-module semantics as part of dashboard stabilization.
- [ ] Define company-to-business-unit tenant mapping before modifying employee import query/schema; no migration added.
- [ ] Resolve shared Product recent-activity origin-unit policy before changing any audit disclosure behavior.
- [ ] Complete a disposable fresh-install and migration rehearsal; locally blocked (no PHP/vendor/.env/isolated DB). No destructive command has been run.
- [ ] Complete a real API + isolated database dashboard authorization/data check. Saved Chromium evidence is mocked only.

See `PHASE_3_5_ENGINEERING_AUDIT.md`, `PHASE_3_5_BACKEND_STABILIZATION.md`, `PHASE_3_5_FRONTEND_STABILIZATION.md`, `PHASE_3_5_DATABASE_READINESS.md`, `PHASE_3_5_SECURITY_REVIEW.md` and `PHASE_3_5_TEST_REPORT.md` for findings and exact outcomes. **Phase 3.5 is NOT PASSED. Do not merge PR #26 or start Phase 4 without explicit approval.**

## Phase 4 — Organization & Access Management

### Scope and preconditions
- Validate deployed users/user_details/manager and BMS schema against live migration history.
- Clarify how changing director/member affects existing scoped role grants, task ownership and visibility; add tests first.
- Separate system role provisioning from default business-unit/product fixtures; do not assume or delete existing units are demo data.
- Add a safe first-unit flow and employee/reporting-line/unit assignment improvements without duplicate employee entity.
- Keep role assignment policy centralized in `BmsAccess`; test direct API paths and role escalation boundaries.

### Data safety acceptance criteria
- Authorized user can create first unit and employee via UI/API on an empty BMS dataset.
- User can be assigned to unit and role with verified unit scope.
- Unauthorized users cannot read/write cross-unit by manipulating IDs.
- Existing data snapshot remains unchanged except explicitly reviewed additive migration effects.
- Existing business-unit records are never deleted by migration/cleanup; default fresh installations do not receive demo units once approved behavior is delivered.
- Unit archive/delete behavior is relationship-aware, reversible where required and tested. No destructive DB command.

## Phase 5 — Execution & Business Development

### Scope and preconditions
- Decide whether legacy projects/tasks are part of target Execution or separate legacy capability.
- Decide if “Clients” is legacy `Partner`/CRM account or a dedicated BMS concept; map identifiers/data and access rules before coding.
- Keep existing Leads/Opportunity/Tender workflow model unless requirements establish a non-duplicative change.
- Specify forecast definitions before adding forecasting.

### Acceptance criteria
- Plan and task create/assignment/status/progress flows work through Angular → protected API → DB and cover allowed/denied scopes.
- Clients-to-leads/opportunities relationships are explicit, validated, and do not duplicate legacy records.
- Tender/pipeline stages, history, owner and unit associations reconcile with source records.
- Consistent client-side validation, API validation, auditability and focused test pass.

## Phase 6 — Operations & Reports

### Scope
- Verify meetings/invite delivery, products, procurement and documents against actual storage/permissions.
- Reconcile reports against known records and filters; exports must use the same authorized dataset.
- Complete events/procedures/document versioning only where verified existing workflows are incomplete.

### Acceptance criteria
- Each implemented workflow passes creation/update/status/read/download tests through API and UI.
- No unauthorized file access; export cannot broaden visibility beyond report/API query.
- Report outputs equal validated source aggregations for controlled fixtures; no fake fallback values.

## Phase 7 — Production Readiness

### Prerequisites
- Provision actual PHP/Composer and frontend dependencies from lockfiles; establish deployment-like DB engine and browser-capable CI.
- Obtain non-destructive schema/data validation plan and staging credentials through the project’s secure process (not chat).

### Acceptance criteria
- Full backend suite, Angular unit tests and production build pass with recorded exact output.
- API/e2e flows cover each of the six groups, authorized/unauthorized scopes, forms, uploads/downloads and reporting.
- Database integrity checked against approved deployment schema; no unreviewed destructive migration.
- Critical accessibility, security and performance checks pass; no critical findings or broken P0/P1 workflows.
- Deployment, backup and rollback instructions documented and tested.

## Execution controls

For each approved phase: inspect; checklist; small changes; focused tests; relevant regression; review `git diff`; confirm no unrelated files; update docs; report test output; stop for approval before next phase. Keep all work on the active Arena branch `arena/e1389d1e-fgsportal`; do not switch or rename it. Phase 3 is not merged; pull request target is `BMS`.
