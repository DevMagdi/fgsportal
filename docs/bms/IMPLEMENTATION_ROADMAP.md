# BMS implementation roadmap after Phase 1 audit

This roadmap records evidence-based work and dependencies. **Only Phase 1 (audit) was authorized in this turn. No Phase 2 work has been started.** Do not begin a later phase until the user gives explicit approval.

## Phase 1 — Complete Product Audit & UX Foundation

**Status:** audit reports prepared in `docs/bms/`. No application behavior/schema/seed data modified.
**Known verification blocker:** PHP/Composer/vendor and frontend/node_modules are absent. Existing test suites could not run; see `PRODUCT_AUDIT.md` and `WORKFLOW_MATRIX.md`.

### Phase 1 checklist
- [x] Inspect actual frontend/backend architecture, routes, BMS modules, tests, schema assets, migrations, seeders and permission code.
- [x] Trace the requested 20 workflows to source paths and available feature-test definitions; explicitly identify what remains unverified.
- [x] Record the existing navigation and dashboard against the target product structure.
- [x] Attempt the available frontend pure-TypeScript test command; capture its dependency failure without changing dependencies.
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

## Recommended Phase 2 — Design System & Application Shell (pending approval)

### Scope
- Replace current BMS group structure with exactly the six required labels and route mappings.
- Set target categories: Organization (units, employees, recruitment), Access Management (access/roles), Execution (weekly plans, tasks), Business Development (leads, opportunities/tenders), Operations (meetings, products, procurement, events, documents), Reports (executive dashboard and reports).
- Resolve `development` category explicitly before implementation; do not drop or hide it to force taxonomy.
- Preserve all existing route paths, server endpoints, authorization ability slugs, route guards, audit behaviors and legacy navigation.
- Add scoped reusable design tokens and shell primitives using existing Angular 13 / installed libraries. No new UI framework.
- Cover English/Arabic, direction switching, responsive navigation, active state, expansion, permissions, all routes and no duplicate/orphan links.

### Dependencies / decisions
1. Confirm whether permission-empty category headings must still appear so the shell can always represent exactly six categories.
2. Approve placement of Team Development.
3. Set Phase 2 viewport/device breakpoints; do not apply dashboard no-scroll constraint to other pages.
4. Establish browser-capable test runner/dependencies.

### Acceptance criteria
- Exactly the six specified top-level group labels; no other top-level categories.
- All existing BMS routes remain reachable for the same authorized users and still deny unauthorized direct navigation.
- Each existing BMS route appears exactly once or is explicitly classified as a utility/unlisted route, with no orphaned workflows.
- Active link and expand/collapse behavior work by keyboard and pointer; visible focus state and accessible navigation names.
- English/Arabic navigation labels exist, with RTL layout and correct direction restoration.
- No changes to backend permissions/data/migrations; focused Angular nav tests pass and no new frontend regressions.
- Inspect diff; only Phase 2 scoped files changed.

## Phase 3 — Executive Dashboard (pending Phase 2 approval and separate approval)

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
