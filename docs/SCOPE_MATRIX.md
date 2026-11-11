# Scope matrix (branch `BMS`)

Source of truth: `Business_Management_Solutions_BRD.docx` v1.0 (modules M1-M11).
Labels: KEEP, ADAPT (serves a BRD ID), REMOVED (done in this branch), DEFER-REMOVE (not needed by the BRD but coupled to kept code; removal needs a code change, not only deletion), UNKNOWN (purpose unclear, not removed), BUILD-LATER (BRD need with no code).

## 1. Baseline versus now

| Metric | `master` (c83cdc6) | `BMS` |
| --- | --- | --- |
| Tracked files | 1700 | 1401 |
| Controllers | 191 | 180 |
| Models | 181 | 172 |
| Migrations | 118 | 113 |
| `Route::` lines in `routes/api.php` | 769 | 707 |
| Angular `*.component.ts` | 135 | 128 |
| Working tree size (without `.git`) | 341 MB | 31 MB |

## 2. Removed in this branch

| Item | Paths | Reason | Dangling references checked |
| --- | --- | --- | --- |
| Installments (finance) | `Controllers/InstallmentFeature/*`, `Models/Installment*`, frontend `manager/components/installments`, `interfaces/installments.ts`, installment section of `finance.service.ts`, navbar "Finance" block, registry "Finance" entries | Not in BRD | grep over app, routes, config, tests, specs |
| Licences | `Controllers/Settings/License/*`, `Models/License*`, `Mail/LicenseEnd*`, `emails/license*.blade.php`, 5 license migrations, frontend `manager/components/license`, `interfaces/license.ts`, license section of `database.service.ts`, navbar and registry entries | Not in BRD | same |
| Legacy Firebase conversion | `DatabaseConvertController`, `DatabaseConvertSecondController`, `legacy_*` keys in `config/firebase.php`, `.env.example`, README | One-off data migration scripts, not in BRD | same |
| ChatGPT | `components/chat-gpt`, `chatGPTConnection()`, `chatGPT*` keys in `environment*.ts`, module declaration | Unused and not in BRD | same |
| Committed uploads | `backend/public/Attachments/**` (240 files, about 310 MB) | User uploaded files must not live in git; path added to `.gitignore` | Uploads use `UploadedFile::move()` (e.g. `RecruitmentRequestCvController`), which creates the target directory |
| Dead comments | commented imports and routes for community, firebase service, client tickets | Referenced files do not exist | n/a |
| Doc text | README, `docs/MODULES.md`, `MODULARIZATION_PLAN.md` | Described removed code | grep |

## 3. Kept

| Area | Label | BRD ID |
| --- | --- | --- |
| Auth (JWT), users, profile, permission groups, module system (`CheckModule`, `company_modules`) | KEEP | FR roles (Section 14), NFR-01, NFR-06 |
| CRM: `User/Business/*`, organization types, contacts, leads, activities, campaigns, statuses, reports, dashboard | ADAPT | FR-LED-01..07, FR-OPP-01..03 |
| RFP and POC requests (`RequestRFP*`, `RequestPoc*`) | ADAPT | FR-OPP-03, FR-OPP-05, FR-OPP-06 |
| HR recruitment: `HRModule/*` (hiring requests, CVs, interviews, onboarding requirements, job profiles and skills) | ADAPT | FR-HR-01..05 |
| Projects, processes, tasks, timesheets, `Report`, `AdminReport` (weekly and daily reports with approval) | ADAPT | FR-UNT-01..05, FR-PRD-01..03 |
| Products and sub-products | ADAPT | FR-PRD-01 |
| Partners, partner industries, client accounts | KEEP | Used by CRM and Projects (see Section 4) |
| Departments, sub-departments, branches, work degrees, permissions, logs, announcements, public requests | KEEP | FR-DSH, NFR-02, FR-DOC (announcements) |
| Users: org chart, user details, open-to-work | ADAPT | FR-EMP-01, FR-EMP-02 |
| Notes and to-do (`ToDo/*`), push messages (`ApiMessage`) | KEEP | Core |

## 4. DEFER-REMOVE (not in BRD, coupled to kept code)

The numbers are occurrences in kept PHP files outside the cluster, counted by grep.

| Cluster | Kept files that reference it | What a removal needs |
| --- | --- | --- |
| Salaries (`User/Salary`, `Salary*`, `UserSalary*`) | `UserDetailController` (23), `ReportController` (12), `AdminReportController` (6), `AdminDashboardController` (2), `DashboardController` (2) | Edit salary fields out of profile, reports and dashboards |
| Rating and surveys (`Rating/*`, `Question*`) | `UserDetailController` (5), `ManagerReportController` (3), both dashboards (1 each) | Edit out of dashboards, profile, manager report |
| Vacations (`Settings/Annual`, `UserAnnual`, `PermissionBalance`) | `ManagerReportController` (9), `DashboardController` (5) | Edit out of manager report and dashboard |
| Work hours (`WorkHoursConfig`) | `ReportController` (6), `AdminReportController` (4) | Edit out of report calculations |
| Incentives | `DashboardController` (5), `MessageController` (1) | Edit out of dashboard and messaging |
| Transport requests | `DashboardController` (3), `MessageController` (1), `OrganizationTypeController` (1) | Same |
| Ticketing and client portal (`Client/TicketingSystem`, `Client/Auth`, `Ticket*`, `ContractSupport*`, client portal UI) | `ReportController` (4), `DashboardController` (3), `Report` model (1), `config/auth.php` (client guard), emails | Edit out of reports and dashboard, remove client guard |
| Project cost (`Project/ProjectCost`, `ProjectCostManual`) | `ReportController` (1) | One edit |

Reason these were not deleted: removing them needs edits to logic inside controllers that are kept. No way to run the test suite or the build in this environment (no network for `composer` and `npm`), so these edits could not be verified. They are listed so a follow-up can do them with tests running.

## 5. UNKNOWN (kept, owner to decide)

| Item | Why unclear |
| --- | --- |
| `TechReport/*` (`ClientMeetingReport`, `DailyTaskReport`) | Might serve FR-MTG and FR-UNT-02, or be support-team specific |
| `FamilyInformation` | HR personal data, no BRD need |
| `Settings/DeveloperDivision` | Only used by its own controller and routes; purpose not stated in the BRD |
| `Tools/PhoneTypeController` | Small lookup; `PhoneType` model is referenced by `ToDo` and `ApiMessage` code |

## 6. BUILD-LATER (BRD need, no code)

M1 calendar availability, invitations and Minutes of Meeting; M7 procurement; M8 PR events; M9 document and brand hub with latest-version control; unit weekly plan entity and Sunday report; product phases and blockers; unified dashboard with unit filter; Excel tracker import (FR-OPP-07); six-month social media report.

## 7. Known pre-existing issues (present on `master`, not caused by this branch)

- `Settings/Annual/AnnualRequestController.php` line 95 uses an unparenthesised nested ternary, a fatal error on PHP 8.
- `routes/api.php` imports `PublicRequestTypeController` (file missing) and uses `TicketStatusController` without an import in the file header. These routes fail at runtime.
- Migrations cover only part of the schema (documented in README); the tables for installments were never in migrations.
