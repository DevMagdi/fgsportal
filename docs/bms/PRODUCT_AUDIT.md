# BMS product audit — Phase 1

**Audit date:** 2026-11-12 (repository snapshot)
**Repository:** `DevMagdi/fgsportal`
**Branch / audited commit:** `arena/bce4bcc3-fgsportal` / `11d6b1e3394e4f31aa97340b732a6470382343e7`
**Scope:** inspection and documentation only. No application behavior, schema, seed data, or tests were changed in Phase 1.

## Executive summary

This checkout contains both a substantial legacy FGS Connect portal and a newer, distinct BMS workspace. BMS has Angular screens and Laravel APIs/models/migrations for organizational units, employees, weekly plans/tasks, leads/opportunities/tenders, meetings, products, procurement, recruitment, events, documents, reports, and access-role assignments. Several workflows have dedicated HTTP feature tests. This audit did not execute those suites because runtime dependencies are absent (details below); code presence and test definitions are not represented as a passing test run.

The largest immediately observed product gap is the navigation taxonomy: `BmsShellComponent.groups` currently renders **Overview, Organization, Execution, Business development, Operations, and People**, rather than the required six exact groups. Access is nested under Organization, Reports are inside Overview, and Recruitment is in People. Dashboard maturity is also below the target: it renders many large tables/cards rather than a verified one-screen layout, has no chart component, and its four filters do not apply consistently to all widgets.

The biggest infrastructure risk is the migration baseline. `README.md` explicitly states that many historical feature tables are not created by checked-in migrations and that deployed schema dumps are needed for the full feature set. No live database or dump was available, so production schema state, actual records, FK/index state, data quality, and installed migration history remain **UNVERIFIED**. The BMS seeder also deliberately provisions five named business units and two named products; it is not neutral demo-free setup.

## Repository and technology evidence

| Area | Observed evidence | Finding |
| --- | --- | --- |
| Frontend | `frontend/package.json`, `frontend/angular.json`, `frontend/src/app/app.module.ts` | Angular 13.4-era NgModule application, TypeScript 4.6, Angular Material plus PrimeNG 13, Bootstrap 4/NgBootstrap, several other libraries. App remains a mixed legacy/lazy-module architecture; BMS is a lazy-loaded module. |
| BMS navigation/routes | `frontend/src/app/components/bms/bms.module.ts`, `bms-shell.component.ts/html`, `bms-catalog.ts` | BMS has route-per-workflow components plus one config-driven collection component. Shell visibility is based on `lookups.can`; route guards separately enforce the matching ability. Current nav does not meet requested taxonomy. |
| Backend | `backend/composer.json`, `backend/routes/api.php`, `backend/app/Http/Controllers/BMS/`, `backend/app/Services/BMS/` | Laravel 8.75, JWT auth. BMS API is grouped under `/api/bms`, with route-level `bms.permission` middleware. Most BMS business operations are implemented in controllers directly using Eloquent; a small service layer handles access, audit, alerts, notifications, and related utilities. |
| DB assets | `backend/database/migrations` | 124 migration files; legacy tables and BMS tables are both represented, but the README documents missing historical feature-table migrations. No database connection was available to validate these files against a deployed schema. |
| Tests | `frontend/src/app/**` and `backend/tests` | 145 Angular `*.spec.ts` files and 26 backend `*Test.php` files were found. Test inventory is not equivalent to coverage or green status. BMS-specific tests include `BmsPhaseOneTest`, `BmsRouteSafetyTest`, `P08CoreEndpointCoverageTest`, `P16MeetingsTest`, and `P17EmployeeManagementTest`. |
| Test execution | Environment | `php -v` fails (`php: command not found`), `backend/vendor` absent, and `frontend/node_modules` absent. `cd frontend && npm run test:node` was attempted and failed before test discovery: `Cannot find module 'typescript'`. PHPUnit, Angular/Karma, and production build are **NOT RUN**. |

## Existing product areas

1. **Legacy portal:** authentication, employee/user screens, HR, projects/tasks, ticketing/support, old CRM, admin settings, reports, notifications, modules/tenant entitlements. Route evidence is in `frontend/src/app/app-routing.module.ts` and `backend/routes/api.php`; module access is also routed through `CheckModule` and `config/modules.php`.
2. **BMS workspace:** `/bms` lazy route, shared BMS shell and capability guard; BMS route list is in `frontend/src/app/components/bms/bms.module.ts`. API routes are under `Route::prefix('bms')` in `backend/routes/api.php` (around lines 1348–1462).
3. **Main models:** `backend/app/Models/BMS/` includes `BusinessUnit`, `BmsRole`, `WeeklyPlan`, `UnitTask`, `Lead`, `Opportunity`, `Meeting`, `ProductPhase`, `ProcurementRequest`, `PrEvent`, `BrandDocument`, `HiringRequest`, `Candidate`, `UnitKpi` and supporting entities. Legacy `users`, `products`, and CRM tables are reused in parts of BMS.

This inventory confirms implemented code surfaces, not runtime correctness for every tenant or record.

## High-priority observed findings

### A. Navigation and information architecture do not match the requested six groups
- **Evidence:** `frontend/src/app/components/bms/bms-shell.component.ts`, `groups`: six labels are `grpOverview`, `grpOrganization`, `grpExecution`, `grpBusinessDev`, `grpOperations`, `grpPeople`. Reports and dashboard appear in Overview; Access & Roles is under Organization; Recruitment is under People.
- **Observed behavior:** six top-level groups exist, but names and ownership do not match the specified exact groups. Visibility hides groups when none of their abilities are present. Links are permission-filtered.
- **Correction proposal:** in Phase 2, map every existing route under the six required exact labels, separate Access Management and Reports, move Recruitment to Organization, and preserve existing route URLs/ability guards. Resolve unassigned workflows in the IA document before changing routes.
- **Risk/dependency:** moving UI links is low-risk if route URLs and ability values are unchanged; removing old links or redefining abilities risks inaccessible workflows. The requirement that all six groups always appear versus permission-aware empty groups needs an implementation decision; empty groups are currently hidden.

### B. Dashboard does not meet the executive one-screen/filter requirements
- **Evidence:** `frontend/src/app/components/bms/dashboard/executive-dashboard.component.html` includes filter card, two KPI grids, two-column lists, and three data tables; no chart element/component found in `frontend/src/app/components/bms/`. `ExecutiveDashboardController::index` in `backend/app/Http/Controllers/BMS/ExecutiveDashboardController.php` validates unit/product/opportunity/week filters.
- **Observed behavior:** page content is inherently long and table-heavy. Frontend sends filters on `executive-dashboard`; backend applies filters differently: `week_start` constrains task data, product constrains task units/products, opportunity selects an opportunity and may infer unit/product; procurement and meetings are scoped by unit only; recent activity is scoped by visible units, not selected filter context. There are no date-range, status, or owner filters. `generated_at` is returned and displayed, but is not an explicit freshness/selected-filter summary. Empty states exist for meetings/activity, but all widgets are not demonstrated to share a filter interpretation.
- **KPI business definitions visible in code:** task count/status/progress from `unit_tasks`; tender totals/status/delay from `bms_opportunities`; products from `products` joined to business units; pending procurement is `status='submitted'`; upcoming meetings have `starts_at` from now to +7 days and non-cancelled; overdue tasks are unfinished with `due_date < today`; stale opportunity threshold comes from `bms.opportunity_no_update_days`. These are observed implementation definitions, not independently approved business definitions. No live records were available for reconciliation.
- **Correction proposal:** agree desktop viewport and KPI semantics, unify backend filter scope per widget, show selected filter context and freshness, provide explicit no-data/error states, then build compact chart/table composition with responsive tests in Phase 3. Do not add unsupported filters/KPIs before source semantics are agreed.
- **Risk/dependency:** KPI changes can affect executive decisions; need a representative, authorized test DB and approved definitions before implementation.

### C. Existing data and setup behavior need careful handling
- **Evidence:** `backend/database/seeders/BmsPhaseOneSeeder.php::run()` uses `updateOrCreate` for `Alpha Iota`, `Alpha X`, `Alpha Gen`, `Alpha Omega`, `Alpha Delta`, and `firstOrCreate` for `Kraken`, `Argus`. `backend/database/seeders/DatabaseSeeder.php` calls this seeder. `README.md` states feature tables are missing from migration history and deployed schema imports are needed.
- **Observed behavior:** running the standard seeder inserts/updates these records. Whether a deployment has run it, whether those names are demo or live business data, and the live record relationships are **UNVERIFIED**. No data should be removed or renamed based on names alone.
- **Correction proposal:** Phase 4 to separate reference/role provisioning from any business-unit/product fixture data on new installs, only after explicit policy and migration/seed review; preserve all existing rows and test an existing-data snapshot.
- **Risk/dependency:** seed behavior can mutate names/settings for matching slugs and insert records. A live data snapshot and reversible, reviewed plan are mandatory before changing existing deployments.

## Classification summary

The complete 20-flow classification, exact workflow code paths, evidence/tests, and recommended corrections are in [`WORKFLOW_MATRIX.md`](WORKFLOW_MATRIX.md). Summary: there are covered end-to-end BMS paths, but there are product-structure gaps (notably first-class Clients, configurable permission editing, and one-screen executive dashboard). Tests are present but unrun in this environment.

## Files inspected

Primary inspected code/documentation: `README.md`; `MODULARIZATION_PLAN.md`; `docs/MODULES.md`; `docs/BMS_PHASE1.md`; Angular `package.json`, `angular.json`, `app.module.ts`, `app-routing.module.ts`, `components/bms/bms.module.ts`, `bms-shell.component.ts/html`, `bms-catalog.ts`, `bms-collection.component.ts`, `bms-api.service.ts`, `bms-access.service.ts`, `bms-permission.guard.ts`, `bms-language.service.ts`, `bms-translations.ts`, dashboard, units, employee, access, report, meeting, plans, products, opportunities components and shared styles; Laravel `composer.json`, `routes/api.php`, `config/modules.php`, `config/bms.php`, `config/auth.php`, `Http/Kernel.php`, BMS controllers, `Services/BMS/*`, `Models/BMS/*`, `Models/User.php`, BMS migrations `2026_11_11_*` and `2026_11_12_*`, `DatabaseSeeder.php`, `BmsPhaseOneSeeder.php`, `phpunit.xml`, BMS-focused feature tests and frontend pure catalog spec. The repository file lists were also inventoried.

**Coverage limits:** this is source inspection only. No live DB/dump, production configuration, runtime network/API, browser, PHP runtime, Composer dependencies, or frontend dependencies were available. Any behavior that requires those has been marked **UNVERIFIED** in the related report.
