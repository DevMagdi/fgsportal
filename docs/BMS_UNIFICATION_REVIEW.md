# BMS unification review — 2026-11-12

Branch: `arena/3166aee5-fgsportal` (based on `BMS` @ `beffcc0`)
Scope: the completion brief supplied for the unified BMS product.

> Honesty note: no PHP runtime or Composer dependencies exist in this sandbox and
> they cannot be downloaded through the allowed network, so **PHPUnit was NOT
> executed** for this pass. Backend verification is limited to a full PHP syntax
> parse (`php-parser`, 669 files, clean) and careful review against
> `backend/tests/BmsTestCase.php`. Angular **development and production builds
> were executed and passed**, and the Node spec harness (`npm run test:node`)
> ran **28 passing, 0 failing**. Nothing below should be read as a claim that the
> PHPUnit suite is green.

## 1. Requirement-to-implementation matrix (delta of this pass)

Statuses: `C+V` complete and verified · `P` partially implemented · `UI` UI missing ·
`BE` backend missing · `DB` database missing · `SEC` security issue · `NI` not implemented ·
`?` requires business clarification.

| Requirement (brief §) | Before | Now | Frontend | Backend/API | DB | Authz | Tests | Gap / action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| §2 retire `/modules` cards + `modules/:slug` | Cards dashboard + module entry page | Redirects to `/bms/dashboard`; navbar entry removed | Done | n/a | n/a | n/a | build | Legacy route names kept as redirects for bookmarks |
| §2 BMS must not depend on optional entitlement | `/bms` behind `module:bms` (company entitlement) + ModuleGuard | BMS is a **core** module; no route guard, no frontend guard | Done | `ChatModule` middleware still present but passes for core | migration `000009` | — | `P1KernelRegressionTest`, `BmsRouteSafetyTest`, `P08`, module tests updated | Written only — not executed here |
| §2 do not delete legacy CRM/HR/Projects/auth | — | Untouched; only the module *journey* is retired | — | — | — | — | — | Their entitlement middleware is unchanged |
| §3 login → `/bms/dashboard` | Hardcoded department redirects (Admin/CRM/Dev) | Ability-based landing, fallback to first permitted page, else `/bms/no-access` | Done | `GET /bms/lookups` → `can[]` | — | Server still authoritative | build | Forgot-password untouched |
| §3 refresh keeps session & route | — | `AuthGuardService` + hash routing unchanged; abilities cached per session | Done | — | — | — | build | — |
| §3 logout clears cached permissions | Cleared perms + module cache | Also clears BMS language/ability cache | Done | — | — | — | — | — |
| §4 one shell, grouped navigation, breadcrumbs, user chip | Flat tab bar; duplicate navbar BMS block | Sidebar with 6 groups, breadcrumbs, alert bell, user chip, language toggle | Done | — | — | Links rendered only when ability present | build | Global legacy navbar still exists for legacy routes |
| §5 employee list/filters | Directory: names + certificates only | Search + unit + job title + status + role filters, 50/page + total | Done | `GET /bms/employees` | reuses `users`/`user_details` | unit scoped | `P17` (written) | — |
| §5 create employee (unique user/email, hashed pw, transactional, audit) | **Missing** | Full create form + API | Done | `POST /bms/employees` | reuses existing tables | `directory.manage` + unit scope | `P17` | Optional columns written only if they exist |
| §5 edit / activate / deactivate / photo | **Missing** | Edit form, status toggle, photo upload + authorized photo stream | Done | `PUT /bms/employees/{id}`, `POST …/status`, `POST …/photo`, `GET …/photo` | reuses `photoURL` | same | `P17` | Photo stored on `local` disk (not public) |
| §5 role assignment in employee form | Only Access screen | Create form can assign a role (global or unit-scoped) | Done | same | `bms_role_user` | assignment rules enforced | `P17` | — |
| §5 hiring workflow needs existing employee | Forced `employee_id` | New: `POST /candidates/{id}/hire-new-employee` (creates account + onboarding once) **and** existing path kept | Done (option selector + prefill) | Done | — | `recruitment.manage` + unit | `P17` | Onboarding guarded against duplicates |
| §6 unit CRUD | Basic create/edit/delete | + activate/deactivate, dependency-aware delete, hierarchy guards | Done | `POST /bms/units/{id}/status`, stricter `PUT`/`DELETE` | — | unit scope | `P17` | KPI/headcount panels still out of scope |
| §7 product lifecycle | Create/edit phases | + archive (soft delete), hidden from working list, overall progress in UI | Done | `POST /bms/products/{id}/archive` | uses `deleted_at` | unit scope | build | Reordering is still manual (sequence field) |
| §8 My Tasks | **Missing** (only per-plan tasks) | Dedicated screen with KPIs and inline progress/blocker update | Done | `GET /bms/my-tasks` | — | own tasks for employees, unit scope for managers | `P17` | Submitted plans remain read-only |
| §9–§16 opportunities/leads/meetings/recruitment/procurement/events/documents | Previously implemented | Reviewed; not changed except hire flow | unchanged | unchanged | unchanged | unchanged | existing tests | Not re-verified here |
| §17 dashboard/reports | Live DB-driven dashboard | Unchanged (still DB-driven) | unchanged | unchanged | — | — | existing | Not re-verified here |
| §18 `DirectoryController::index()` scope | Unit filter only applied when requested | Always scoped to viewer units (+ self) | Done | Done | — | fixed | `P17` | — |
| §18 `LookupController::index()` users | Returned **all** users | Scoped to units, active accounts only | Done | Done | — | fixed | `P17` | Looks-ups now include `work_degrees` |
| §18 `assignRole`/`revokeRole` target+unit authz | Route permission only | Target scope, unit scope, global-vs-unit, admin-only System Administrator, no self-revoke of global role | Done | Done | — | fixed | `P17` | — |
| §18 role audit view | none | `GET /bms/audit/role-changes` + UI table | Done | Done | `bms_audit_logs` | `roles.manage`, unit filtered | `P17` | — |
| §18 private file downloads re-check authz | Certificates/photo: partial | Certificate download now re-checks the employee's unit; photo stream authorized | Done | Done | — | fixed | `P17` | CV/quotation/document downloads unchanged (already scoped) |
| §19 UX baseline (filters, empty/loading/error, RTL, exports) | Present on most screens | New screens follow it; Arabic + English labels added | Done | — | — | — | build | — |
| §20 migrations safe/reversible | — | `000009` only flips `is_core`, reversible | — | — | Done | — | — | No destructive command run |
| §21 tests | 84 feature tests previously | +12 new tests for this pass | build + Node specs | written | — | — | **not executed** | Needs CI with composer |
| §22 open business questions | Documented | Unchanged | — | — | — | — | — | See §4 below |

## 2. What was fixed

* Department-hardcoded login redirects replaced by one BMS entry point.
* Removed the Modules catalogue from the user journey (routes redirect; navbar entry gone).
* BMS decoupled from optional company-module entitlement (core module + migration).
* Employee creation/editing/activation with unit scope, hashed passwords, audit and photo.
* Recruitment can now create the employee account from a passed candidate (onboarding exactly once).
* Directory + lookup employee lists no longer enumerate the whole company.
* Role assignment hardened (target scope, unit scope, global rules, self-revoke, System Administrator).
* Role-change audit endpoint + UI.
* Unit hierarchy loops rejected; units with business records can only be deactivated.
* Products can be archived instead of deleted.
* "My tasks" screen + API for employees.
* Public meeting-response form no longer renders for attendees that were never invited.

## 3. Files of interest

Backend: `EmployeeController`, `LookupController`, `DirectoryController`,
`BusinessUnitController`, `ProductTrackingController`, `RecruitmentController`,
`WeeklyPlanController`, `PublicMeetingResponseController`,
`migrations/2026_11_12_000009_*`, `routes/api.php`, `tests/Feature/P17EmployeeManagementTest.php`.

Frontend: `bms-access.service.ts`, `bms-permission.guard.ts`, `bms.module.ts`,
`bms-shell.component.*`, `employees/`, `my-tasks/`, `no-access/`, `access/`,
`signin.component.ts`, `app-routing.module.ts`, `navbar.component.*`,
`services/auth-api.service.ts`, `bms-shared.scss`, `bms-translations.ts`.

## 4. Remaining gaps / unresolved business questions

Gaps (unchanged, out of this pass's scope):

1. Opportunity/lead/meeting/procurement/event/document flows were reviewed but not re-tested here.
2. Product phase **reordering** is by numeric sequence only; drag-and-drop was not added.
3. Unit KPI panels, product history panel, and dashboard filter persistence remain as before.
4. Global legacy navbar still exists for legacy module routes; only the BMS journey is unified.
5. PHPUnit/MySQL execution and the full IDOR matrix must run in CI before any release decision.

Business questions still open (from the BRD, not invented here):

* Q4 external calendar provider for meetings.
* Q5 minutes/approval policy.
* Q6 no-update threshold for opportunities (currently configurable, default 7 days).
* Q7 procurement approval limits and chain (currently a single Finance decision).
* Q8 KPI definitions.
* Q9 sharing of the "next week plan".
* Q10 departmental BMS usage.
* Q11 hosting, data residency, backup, and availability targets.

## 5. Production readiness

**NO-GO.** The frontend builds and the pure-spec harness passes, but the backend
test suite could not be executed in this environment, and the remaining gaps above
are product-level, not cosmetic. Re-run `php artisan test` (SQLite + MySQL 8) and
the end-to-end scenarios in a CI environment before changing this decision.
