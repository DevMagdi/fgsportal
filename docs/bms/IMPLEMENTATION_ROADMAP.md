# BMS implementation roadmap after Phase 1 audit

This roadmap records evidence-based work and dependencies. Phase 1 audit and Phase 2 shell implementation are authorized and completed in this branch. Phase 3 remains unauthorized; do not begin it until the user gives explicit approval.

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
- Browser-based tests compiled but could not execute because no Chrome/ChromeHeadless binary is installed and `CHROME_BIN` is unset. Responsive screenshots and browser-level RTL/keyboard checks remain **UNVERIFIED**.
- All existing native `confirm()` prompts in BMS were migrated to one shared accessible Material dialog with English/Arabic labels, RTL/LTR direction, focus restoration, explicit cancel behavior, and destructive-action styling. Its Angular component spec is present but was not executed because Karma cannot launch without Chrome.

### Phase 2 verification results
- `npm ci --legacy-peer-deps --no-audit --no-fund`: **passed**, installed 1,481 locked packages; npm emitted existing dependency deprecation notices.
- `npm run test:node`: exit 0; terminal summary **35 passing, 0 failing** (covers exact six-category order/English-Arabic headings, route uniqueness/completeness, permission filtering, expand/collapse, active route, Development route/ability, and guard allow/deny behavior).
- `npm run build -- --configuration development`: exit 0; build completed, hash `107b1daaf5a1a823`.
- `npm run build -- --configuration production`: exit 0; build completed, hash `87adefd09bbb019d`. Existing Autoprefixer (`color-adjust`, `end`), canvg/CommonJS and legacy CSS-selector warnings remain.
- `npm test -- --watch=false --browsers ChromeHeadless`: Karma compiled the browser test bundle, then exited 1 at browser launch with `No binary for ChromeHeadless browser on your platform. Please, set CHROME_BIN env variable.` Therefore browser specs, interactive behavior, visual regression, and screenshots were not executed.
- `npm run lint`: exited 1 with `Cannot find "lint" target for the specified project.` This Angular project has no configured lint target.
- `git diff --check`: exit 0.
- Source review confirms `BmsModule` route definitions are unchanged; `BmsPermissionGuard`, `BmsAccessService`, route URLs, and ability checks are unchanged. The module only adds the dialog/state declarations and Material imports/provider.
- Confirmation review: callers perform no action unless `afterClosed()` maps to literal `true`; Escape/backdrop/cancel return false. Revoke, employee deactivation, unit deletion, and product archival are marked destructive; the dialog initially focuses Cancel and restores focus on close.
- Styling review: the only global stylesheet addition is the `.cdk-overlay-pane.bms-dialog-panel` selector required for the Material overlay; all new shell/page primitives are loaded from BMS component styles. Existing BMS primitive declarations are deliberately overridden by the BMS design-system layer; no legacy module stylesheets were edited. Browser visual regression remains unverified.
- No backend, database, migration, seeder, or business-logic files are in the Phase 2 change set.
- No backend, PHP, DB, or permission-matrix suite was changed or run as part of Phase 2. PHP and `backend/vendor` are absent, and no database connection/dump is available; production schema/data were not validated.
- No screenshots were captured: browser execution is blocked by the missing ChromeHeadless binary.

### Acceptance criteria
- Exactly the six specified top-level group labels; no other top-level categories.
- All existing BMS routes remain reachable for the same authorized users and still deny unauthorized direct navigation.
- Each existing BMS route appears exactly once or is explicitly classified as a utility/unlisted route, with no orphaned workflows.
- Active link and expand/collapse behavior work by keyboard and pointer; visible focus state and accessible navigation names.
- English/Arabic navigation labels exist, with RTL layout and correct direction restoration.
- No changes to backend permissions/data/migrations; focused Angular nav tests pass and no new frontend regressions.
- Inspect diff; only Phase 2 scoped files changed.

## Phase 3 — Executive Dashboard (requires separate explicit approval)

### Scope and preconditions
- Agree desktop viewport and KPI business definitions with stakeholders.
- Validate source tables and aggregates against authorized representative records.
- Review `ExecutiveDashboardController::index` filter behavior and permissions per data domain.
- Add unified filter context and consistent widget semantics; do not add unsupported dates/status/owner filters.
- Build compact KPI cards and charts only from verified values; show freshness, no-data and errors; responsive small-screen layout.

### Acceptance criteria
- Agreed desktop viewport has no vertical dashboard scroll with the agreed representative data fixture.
- Every KPI has documented definition/source/aggregation/filter/permission and test record reconciliation.
- All supported widgets return consistent, explicit filter context; direct API calls respect scope.
- Empty/error/loading states work; smaller screens adapt without horizontal page overflow.
- Dashboard tests pass, including selected unit/product/opportunity/week and unauthorized cross-unit cases.

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

For each approved phase: inspect; checklist; small changes; focused tests; relevant regression; review `git diff`; confirm no unrelated files; update docs; report test output; stop for approval before next phase. Keep all work on the active Arena branch `arena/bce4bcc3-fgsportal`; it cannot be renamed/switched in this session. Do not commit to `BMS` or open a PR from another branch. Current branch restrictions and session instructions take precedence over the pasted request's “target branch BMS / create dedicated branch” text.
