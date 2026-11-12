# BMS final implementation audit — 2026-11-12

Branch `arena/60d3351e-fgsportal` (from `BMS` @ `6a5ab9a`, which already contains PR #18).
This document is written to match what was **actually verified**. Nothing below is
marked verified unless the command was executed here.

## 0. Verification evidence

| Check | Command | Result |
| --- | --- | --- |
| PHP syntax (all backend PHP) | `php-parser` over `backend/**/*.php` (671 files) | **PASS** — `PHP PARSE OK (671 files)` |
| Angular development build | `npx ng build --configuration development` | **PASS** |
| Angular production build | `npx ng build --configuration production` | **PASS** |
| Pure TypeScript spec harness | `npm run test:node` | **PASS** — 28 passing, 0 failing |
| Monthly report unit scope (PR #22) | `php artisan test --filter=test_P21_monthly_report_products_are_limited_to_the_actors_units` | **EXECUTED 12 Nov — PASS** — `Tests: 1 passed`, PHPUnit `OK (1 test, 17 assertions)` (see §1a) |
| Employee import / KPI register / manager-cycle tests | `php artisan test --filter=P17EmployeeManagementTest` (23 tests) | **EXECUTED 12 Nov — 13 pass, 10 FAIL** (listed in §1a) |
| PHPUnit / Laravel feature tests | `php artisan test` — native PHP 8.1.29, SQLite 3.40.1, PHPUnit 9.5.25 (`docs/TESTING.md`) | **EXECUTED 12 Nov — 126 tests, 917 assertions: 114 pass, 12 FAIL** (5 errors, 7 failures; listed in §1a) |
| Karma component tests / E2E | — | **NOT EXECUTED** — no Chrome in the sandbox. |

Consequence: only the monthly-report unit scope (§1a) is `test-verified`. Every other backend
behaviour below is still marked `implemented + syntax-checked`: the suite was first executed on
12 November and 12 of its tests fail (§1a), so none of those items may be promoted until the
failures are triaged.

## 1. BRD compliance matrix (current state)

Status legend: **V** verified here (build/specs) · **I** implemented, tests written but not
executed here · **P** partially implemented · **G** gap · **?** blocked on a business decision.

| # | Requirement | Status | Evidence / location |
| --- | --- | --- | --- |
| §3 | No module-selection journey; no legacy dashboard redirect | **V** | `/modules` + `/modules/:slug` redirect to `/bms/dashboard`; navbar entry removed (`app-routing.module.ts`, `navbar.component.html`) |
| §3 | Single shell, sidebar, breadcrumbs, logo identity | **V** | `bms-shell.component.*` (6 groups, user chip, alert bell, language toggle) |
| §3 | Login lands on a permitted BMS page; refresh/deep link survive | **V** | `BmsAccessService.firstLanding()` + `BmsPermissionGuard`; `AuthGuardService` untouched |
| §3 | No valid BMS access → clear screen, not a loop | **V** | `/bms/no-access` (`bms-no-access.component.*`) |
| §3 | Logout clears auth + cached permissions | **V** | `auth-api.service.ts` `logout()` |
| §4.1 | Employee create/edit/profile/status/photo/roles/units | **I** | `EmployeeController`, `employees/` screen (§ earlier PR #18) |
| §4.1 | Manager / reporting relationship | **I** | migration `2026_11_12_000010` (`users.manager_id`), `User::manager()/reports()`, employee form + API; self-reference rejected |
| §4.1 | Department & job title on the employee record | **I** | `sub_departments_id`, `work_degrees_id` accepted by the API and form |
| §4.1 | Candidate → employee without duplicate identity | **I** | `POST /bms/candidates/{id}/hire-new-employee`, onboarding created once |
| §4.1 | Bulk Excel import of employees | **G** | not implemented; opportunity import exists as a pattern to reuse |
| §4.2 | Full unit CRUD, activate/deactivate, hierarchy guard | **I** | `BusinessUnitController` (`status`, cycle guard, dependency-aware delete) |
| §4.2 | Unit objectives / key messages / services | **V** | existing unit form |
| §4.2 | Unit KPIs | **P** | `bms_unit_kpis` + `ReportController` quarterly report; no dedicated unit-KPI UI yet |
| §4.3 | Product create/edit, units, description, owner | **I** | `ProductTrackingController::productData`, `Product::owner`, form fields |
| §4.3 | Phases: add/edit/delete/reorder, progress, dates | **I** | `POST /bms/products/{id}/phases/reorder` + ↑/↓ buttons; sequence uniqueness kept |
| §4.3 | Archive product without destroying history | **I** | `POST /bms/products/{id}/archive` |
| §4.4 | Centralised configuration lists | **P** | `GET /bms/lookups` now returns meeting types, task statuses, opportunity types, unit roots, job titles, departments; editing those lists from the UI is **not** done (departments/job titles are owned by the legacy admin module) |
| §5.1 | Dashboard with real DB metrics, scoped | **I** | `ExecutiveDashboardController`: unit progress, tenders, overdue/blocked tasks, pending procurement, upcoming meetings, recent activity (unit-filtered) |
| §5.2 | My workspace / my tasks | **I** | `GET /bms/my-tasks`, `my-tasks/` screen with progress + blockers |
| §5.3 | KPI definition, target/actual, attainment | **P** | `saveKpi`, quarterly attainment; **missing values are reported as null**, never fabricated; no trend chart yet |
| §5.4 | Meetings, minutes, decisions, action items, responses | **I** (pre-existing) | `MeetingController`; not re-verified in this pass |
| §5.5 | Leads & opportunities, stages, history, conversion once | **I** (pre-existing) | `LeadController` (conversion guarded), `OpportunityController`; dashboard staleness now treats “never updated” as stale |
| §5.6 | Recruitment & onboarding | **I** | hire flow + checklist; candidate CVs stay on the private disk |
| §5.7 | Procurement / events / documents / procedures | **I** (pre-existing) | controllers + tests; not re-verified here |
| §6 | UX baseline (filters, empty/loading/error, RTL, exports) | **V** | new screens follow the shared SCSS + Arabic/English labels |
| §7 | Server-side authorization everywhere | **I** | `bms.permission:*` on every route; unit scoping in directory/employees/lookups/certificates/photos/roles |
| §8 | Non-destructive migrations, no destructive commands | **V** | new migrations only add columns/flags; **no** `migrate:fresh` executed |
| §10 | Tests | **P** | `P17EmployeeManagementTest` executed on 12 November: 13 of 23 pass, **10 fail** (§1a); pure specs 28/28 pass |

## 1a. Defect fixed after the PR #21 review (current pass)

| Defect | Fix | Test |
| --- | --- | --- |
| `ReportController::monthly()` returned **every product** of every unit to unit-scoped users: the products query only applied the optional `business_unit_id` filter and never `visibleUnitIds()` | products now require at least one business unit inside the viewer's scope (`whereHas('businessUnits', … whereIn(…$ids))`); the requested unit still narrows the set and is separately authorised by the existing `authorizeUnit()` call, so a request can never widen the scope; `visibleUnitIds() === null` (unrestricted) keeps the previous behaviour | `test_P21_monthly_report_products_are_limited_to_the_actors_units` |

### Verification of the PR #22 fix (executed 12 November 2026)

Runtime: native PHP 8.1.29 (cli), SQLite 3.40.1 in-memory, Laravel 8.83.25, PHPUnit 9.5.25,
Composer 2.8.10 with the locked dependencies (`docs/TESTING.md`). No migration or destructive
database command was run; the tests build their own in-memory schema.

| Step | Command | Actual result |
| --- | --- | --- |
| First execution, `BMS` head unchanged | `php artisan test --filter=test_P21_monthly_report_products_are_limited_to_the_actors_units` | **FAIL** — `Failed asserting that 5 is identical to 3.` at `P17EmployeeManagementTest.php:598` |
| After correcting the test expectation | same command | **PASS** — `Tests: 1 passed`; `vendor/bin/phpunit --filter=…` → `OK (1 test, 17 assertions)` |
| Mutation: scope clause removed from `ReportController::monthly()` | same command | **FAIL** (as required) — `Failed asserting that an array does not contain 'Theirs Only Product'.` |
| Mutation: `authorizeUnit()` guard removed | same command | **FAIL** (as required) — `Expected response status code [403] but received 200.` |

Root cause of the first failure: the test, not the controller. `BmsTestCase::setUp()` runs
`BmsPhaseOneSeeder`, which seeds the catalogue products `Kraken` and `Argus` (no unit link), while
the last assertion hard-coded a catalogue of exactly 3 products. The unrestricted administrator
correctly received all 5. The expectation is now measured from the seeded baseline and tightened:
the administrator must receive exactly `baseline + 3` products, the unit-scoped director exactly
`Mine Only Product` and `Shared Product` (so seeded products without a unit link are not exposed
either), and the shared product must stay visible when the authorised unit is requested. No
assertion was removed or relaxed and `ReportController` is unchanged.

| Scenario | Result |
| --- | --- |
| Restricted user cannot see a product that belongs only to unauthorised units | **PASS** |
| Restricted user sees the products of the authorised units | **PASS** |
| Shared product stays visible when at least one of its units is authorised | **PASS** |
| Requesting an unauthorised unit returns HTTP 403 | **PASS** |
| Unrestricted system administrator still receives every product | **PASS** |

**Suite state on the same runtime** (`php artisan test`): 126 tests, 917 assertions — 114 pass,
**12 fail**. Before the correction it was 113 pass / 13 fail; the only difference is the test above,
so nothing regressed. The 12 failures below are identical on the unmodified `BMS` head, belong to
other features and were deliberately **not** touched in this pass. They are open and must be
triaged (application defect or stale test) before release:

| Test | First error observed |
| --- | --- |
| `ModulesTableSeederTest` › only the core module is flagged as core | `bms must not be core` — `Failed asserting that true is false` |
| `P16MeetingsTest` › p1 6 attendee diff cancels removed and invites only added | HTTP 500 on `PUT meetings/{id}`: `Method Illuminate\Support\Collection::intersectKeys does not exist` |
| `P17EmployeeManagementTest` › p17 global and cross scope role assignments are refused for unit scoped actors | expected 403, received 200 (line 188) |
| `P17EmployeeManagementTest` › p18 employee manager reporting line is stored and self reference rejected | `manager_id` is `null` (line 289) |
| `P17EmployeeManagementTest` › p18 product metadata owner and phase reordering | `Undefined array key "description"` (line 305) |
| `P17EmployeeManagementTest` › p18 dashboard reports pending procurement upcoming meetings and overdue tasks | `NOT NULL constraint failed: bms_procurement_requests.reference` |
| `P17EmployeeManagementTest` › p19 manager assignment blocks cycles cross company and out of scope managers | `manager_id` is `null` (line 365) |
| `P17EmployeeManagementTest` › p19 employee import preview is read only and reports duplicates | `summary.valid` is 0, expected 1 (line 402) |
| `P17EmployeeManagementTest` › p19 recent activity never leaks other units records | `NOT NULL constraint failed: bms_procurement_requests.reference` |
| `P17EmployeeManagementTest` › p20 import rejects duplicates inside the uploaded file | `summary.valid` is 0, expected 1 (line 486) |
| `P17EmployeeManagementTest` › p20 recent activity separates ids shared across model types and handles deleted records | `NOT NULL constraint failed: bms_procurement_requests.reference` |
| `P17EmployeeManagementTest` › p20 dashboard summary matches the widget data under the same filters | `NOT NULL constraint failed: bms_procurement_requests.reference` |

## 1b. Defects fixed after the PR #20 review (previous pass)

| Defect | Fix | Test |
| --- | --- | --- |
| `000010` had been edited *after* deployment to add `bms_unit_kpis.description` / `.owner_id`; installations that already ran it never get those columns | `000010` reverted to its originally shipped column set; new forward-only `2026_11_12_000011_add_missing_bms_kpi_metadata` adds only the missing columns, guarded by `Schema::hasColumn`. Fresh installs and upgraded installs converge to the same schema; `down()` is a deliberate no-op so KPI metadata is never dropped | harness (`BmsTestCase`) applies both in sequence |
| KPI history grouped by **name only**, so identically named KPIs in different units shared one trend line | history is grouped by `business_unit_id` + lower-cased name and returns `{business_unit_id, unit, name, points[]}`; the UI finds the series by the same composite identity and shows a per-point tooltip | `test_P20_kpi_trends_are_isolated_per_unit_even_with_identical_names` (incl. zero target → `null` attainment) |
| Employee import ignored duplicates **inside the uploaded file** | case-insensitive username/email tracking per file, new `duplicate_in_file` status counted separately in the summary, commit re-checks `LOWER(username)/LOWER(email)` inside the transaction, preview never returns prepared attributes (no hashes) | `test_P20_import_rejects_duplicates_inside_the_uploaded_file` |
| `recentActivity()` read the cache with one key shape and wrote it with another, so cached unit resolution never hit | single composite key `Type:id` used for read and write, resolution only on a miss | `test_P20_recent_activity_separates_ids_shared_across_model_types_and_handles_deleted_records` |
| Dashboard summary/widget consistency was unverified | one scoped+filted query per widget, summary values derived from the same queries | `test_P20_dashboard_summary_matches_the_widget_data_under_the_same_filters` |

Security review of this pass (server-side, executed by inspection — no runtime to exploit-test):
file downloads (`DocumentController::download`, `RecruitmentController::downloadCv`) resolve a
stored path on the private `local` disk with `abort_unless(...exists())` and never concatenate
user input, so traversal is not reachable; uploads are MIME/size validated in the same
controllers. All new routes carry `bms.permission:*`; every mutating action re-authorizes the
target record. The remaining unverified item is the suspected unit-scope check in
`LookupController::authorizeAssignment` (see "Unverified" below).

## 2. Defects fixed after PR #19 review (previous pass)

| Defect | Fix | Test |
| --- | --- | --- |
| `abort_if(… && false, 422)` — manager self-reference never enforced on create | `validatedManagerId()` used by both create and update: self-reference, existence, cross-company, out-of-scope manager and reporting-cycle detection; `null` clears the line | `test_P19_manager_assignment_blocks_cycles_cross_company_and_out_of_scope_managers` |
| Dashboard procurement count ignored the `business_unit_id` filter (two different queries) | single scoped+filted query reused for the KPI, the payload and the summary | `test_P18_dashboard_…`, `test_P19_recent_activity_never_leaks_other_units_records` |
| `recentActivity()` could leak other units' records and crashed logic on deleted models; unit lookup typed on the wrong key | whitelisted business model types, explicit null-safe resolution, per-type+id unit cache, scoped actors only see positively-in-scope rows, users/roles never listed | `test_P19_recent_activity_never_leaks_other_units_records` |

## 3. Implemented in this pass

1. Employee reporting line (`manager_id`) end-to-end: migration, model relations,
   create/update validation, self-reference rejection, API output, form field.
2. Product administration: `description` + `owner_id` (migration, model, validation,
   form, list output).
3. Phase reordering endpoint with a strict "exactly this product's phases" check,
   transactional rewrite of `sequence`, audit event, and ↑/↓ controls in the UI.
4. Executive dashboard additions: overdue tasks, pending procurement approvals,
   upcoming meetings (7-day window) and unit-scoped recent activity; the "no update"
   flag no longer ignores records that were never updated.
5. Centralised configuration lookups (meeting types, task statuses, opportunity
   types, unit roots) and the meetings form now reads meeting types from the API.
6. **Bulk employee import** (BRD §4.1): downloadable CSV template, two-phase
   validate-then-commit, per-row errors, duplicate detection by username/email,
   business-unit + manager validation inside the actor's scope, transaction-safe
   writes, audit row per imported employee, `directory.manage` only.
7. **Unit KPI register** (BRD §4.3/§5.3): `GET /bms/reports/kpis` with unit scope,
   frequency filter, attainment (`null` when no target — never a fake 0), status
   (`achieved`/`on_track`/`behind`/`no_target`) and per-KPI history series; new
   "KPI register" tab with target-vs-actual, trend bars, inline edit and Excel export;
   KPI columns `description`, `owner_id`, `frequency` added in the same reversible
   migration.
8. Tests: 6 new feature tests (manager line, product metadata + reordering,
   dashboard widgets, manager cycles/cross-company, import preview + commit,
   recent-activity scope) — 18 in total in `P17EmployeeManagementTest`.

## 3. Remaining gaps

| Gap | Reason | Needed |
| --- | --- | --- |
| Import template is CSV (the existing import convention), not `.xlsx` | no spreadsheet library in `composer.json`; CSV opens in Excel and is validated server-side | add `phpoffice/phpspreadsheet` if true `.xlsx` is required |
| Editing departments / job titles from the BMS UI | those tables belong to the legacy admin module | decide ownership (BRD Q10) |
| KPI annual summary separate from quarterly | register supports `frequency=annual`; no separate annual report endpoint | minor: filter the register |
| Product dependencies / risk register | not defined in the BRD data model | business definition first |
| Full re-verification of meetings / procurement / documents / events | out of scope of this pass | CI + UAT |
| PHPUnit & E2E execution | no runtime/browser in this sandbox | CI with PHP 8.1 + MySQL 8 + Chrome |

## 4. Unresolved business decisions (unchanged, not invented)

Q4 external calendar provider · Q5 minutes/approval policy · Q6 no-update threshold
(configurable, default 7 days) · Q7 procurement approval chain/limits (single Finance
decision today) · Q8 KPI definitions · Q9 next-week-plan sharing · Q10 departmental
BMS usage / ownership of configuration lists · Q11 hosting, residency, backups, SLAs.

## 5. Migration summary

| Migration | Change | Reversible |
| --- | --- | --- |
| `2026_11_12_000009_make_bms_a_core_capability` | `modules.is_core = 1` for `bms` | yes (flag only) |
| `2026_11_12_000010_add_bms_admin_metadata` | `users.manager_id`, `products.description`, `products.owner_id`, `bms_unit_kpis.frequency`, `bms_unit_kpis.description`, `bms_unit_kpis.owner_id` | yes (`down()` drops exactly those columns) |

No data was deleted or rewritten; no destructive command was executed.

## 6. Endpoint authorization summary (new endpoints in this pass)

| Endpoint | Ability | Extra server-side check |
| --- | --- | --- |
| `POST /bms/products/{id}/phases/reorder` | `products.manage` | every phase id must belong to that product; unit-scoped actors must own one of its units |
| `GET /bms/reports/kpis` | `reports.view` | units limited to `visibleUnitIds()` |
| `GET /bms/employees/import/template` | `directory.manage` | — |
| `POST /bms/employees/import` | `directory.manage` | unit + manager scope per row, duplicates never re-created, single transaction |
| `POST /bms/employees` / `PUT /bms/employees/{id}` (manager) | `directory.manage` | manager exists, same company, within actor scope, no reporting cycle |
| `GET /bms/executive-dashboard` (activity/procurement) | `dashboard.view` | unit scope on both the counts and the activity list |

## 7. Production readiness statement

**NO-GO.** Frontend development and production builds pass, the pure-spec suite passes,
and all backend PHP parses. The backend feature suite was executed on 12 November 2026
(native PHP 8.1.29, SQLite): **12 of 126 tests fail** (§1a) and remain open; MySQL and the
end-to-end scenarios were **not executed** in this environment, and the gaps in §3 remain. Treat the items
marked **I** as "code complete, awaiting CI + UAT verification".
