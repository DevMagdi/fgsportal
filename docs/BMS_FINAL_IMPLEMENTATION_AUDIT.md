# BMS final implementation audit — 2026-11-12

Branch `arena/60d3351e-fgsportal` (from `BMS` @ `6a5ab9a`, which already contains PR #18).
This document is written to match what was **actually verified**. Nothing below is
marked verified unless the command was executed here.

## 0. Verification evidence

| Check | Command | Result |
| --- | --- | --- |
| PHP syntax (all backend PHP) | `php-parser` over `backend/**/*.php` (670 files) | **PASS** — `PHP PARSE OK (670 files)` |
| Angular development build | `npx ng build --configuration development` | **PASS** |
| Angular production build | `npx ng build --configuration production` | **PASS** |
| Pure TypeScript spec harness | `npm run test:node` | **PASS** — 28 passing, 0 failing |
| PHPUnit / Laravel feature tests | — | **NOT EXECUTED** — no PHP runtime and no Composer dependencies in this sandbox; they cannot be installed through the allowed network. |
| Karma component tests / E2E | — | **NOT EXECUTED** — no Chrome in the sandbox. |

Consequence: every backend behaviour below is marked `implemented + syntax-checked`,
never `test-verified`. The automated tests that cover them are written and will run in CI.

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
| §10 | Tests | **P** | 15 backend tests for this feature set written (`P17EmployeeManagementTest`), **not executed here**; pure specs 28/28 pass |

## 2. Implemented in this pass

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
6. Tests: 3 new feature tests (manager line, product metadata + reordering,
   dashboard widgets) added to the 12 from the previous pass.

## 3. Remaining gaps

| Gap | Reason | Needed |
| --- | --- | --- |
| Bulk employee Excel import | time; needs a validated import contract | reuse the opportunity-import pattern |
| Editing departments / job titles from the BMS UI | those tables belong to the legacy admin module | decide ownership (BRD Q10) |
| KPI trend chart & unit-KPI admin screen | UI work only, data model exists | next phase |
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
| `2026_11_12_000010_add_bms_admin_metadata` | `users.manager_id`, `products.description`, `products.owner_id`, `bms_unit_kpis.frequency` | yes (`down()` drops exactly those columns) |

No data was deleted or rewritten; no destructive command was executed.

## 6. Production readiness statement

**NO-GO.** Frontend development and production builds pass, the pure-spec suite passes,
and all backend PHP parses, but the backend feature suite and the end-to-end scenarios
were **not executed** in this environment, and the gaps in §3 remain. Treat the items
marked **I** as "code complete, awaiting CI + UAT verification".
