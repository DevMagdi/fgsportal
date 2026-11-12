# BMS target information architecture — repository mapping

**Audit basis:** source at `11d6b1e3394e4f31aa97340b732a6470382343e7`, branch `arena/bce4bcc3-fgsportal`. This maps observed routes/features; it does not authorize new features or changes.

## Required top-level groups

These are the only allowed top-level BMS sidebar groups and the exact intended names:

1. Organization
2. Access Management
3. Execution
4. Business Development
5. Operations
6. Reports

## Current navigation vs required structure

`frontend/src/app/components/bms/bms-shell.component.ts` declares six permission-aware groups, but currently labels them Overview, Organization, Execution, Business development, Operations, and People. It does not satisfy the exact names/ownership. `bms-shell.component.html` renders each visible group and its links; groups are omitted if the user has none of that group's abilities.

| Current top-level group | Current BMS route links | Correct target location | Notes |
| --- | --- | --- | --- |
| Overview | `dashboard`, `reports` | Reports | Dashboard is an item within Reports (Executive Dashboard); reports stays here. |
| Organization | `units`, `employees`, `access` | Organization: `units`, `employees`, `recruitment`; Access Management: `access` | Access roles is currently incorrectly nested with organization. |
| Execution | `plans`, `my-tasks`, `development`, `products` | Execution: `plans`, `my-tasks`; Operations: `products`; no target placement decided for `development` | Product tracking currently appears as execution although target names it under Operations. Team development has no explicit target label; confirm whether it is Organization/recruitment, Execution, or an unassigned workflow before moving it. |
| Business development | `leads`, `opportunities` | Business Development: `leads`, `opportunities` | Tender is a type of opportunity in the BMS model/UI, not a distinct route. Pipeline stages are configured from the leads view. |
| Operations | `meetings`, `procurement`, `events`, `documents` | Operations | Procedures are accessible from Events collection; certificates are managed from Employees or Directory. |
| People | `recruitment` | Organization: Recruitment | Extra top-level category is not allowed. |

The `groups` list links the six current groups, not all exact target groups. `bms-shell.component.ts::can/any` checks capability arrays supplied by the `lookups` API. `BmsPermissionGuard` guards routes. Keep both mechanisms and existing ability semantics when reclassifying navigation.

## Existing BMS routes and actual surfaces

From `frontend/src/app/components/bms/bms.module.ts` (lazy root `/bms`):

| Existing route | Component/surface | Existing ability gate | Proposed category |
| --- | --- | --- | --- |
| `/bms/dashboard` | `ExecutiveDashboardComponent` | `dashboard.view` | Reports |
| `/bms/reports` | `ReportsComponent` | `reports.view` | Reports |
| `/bms/units` | `BusinessUnitsComponent` | `units.view` | Organization |
| `/bms/employees` | `EmployeeManagementComponent` | `directory.view` | Organization |
| `/bms/recruitment` | `BmsCollectionComponent` config `recruitment` | `recruitment.view` | Organization |
| `/bms/access` | `AccessComponent` | `roles.manage` | Access Management |
| `/bms/plans`, `/bms/my-tasks` | `WeeklyPlansComponent`, `MyTasksComponent` | `plans.view` | Execution |
| `/bms/leads` | `BmsCollectionComponent` config `leads` | `leads.view` | Business Development |
| `/bms/opportunities` | `OpportunitiesComponent` | `opportunities.view` | Business Development |
| `/bms/products` | `ProductTrackingComponent` | `products.view` | Operations |
| `/bms/meetings` | `MeetingsComponent` | `meetings.view` | Operations |
| `/bms/procurement`, `/bms/events`, `/bms/documents` | `BmsCollectionComponent` configurations | matching `.view` ability | Operations |
| `/bms/development` | `BmsCollectionComponent` config `development` | `development.view` | **Unassigned in target list; decide before implementation** |
| `/bms/no-access` | `BmsNoAccessComponent` | no workflow ability route gate | Utility/error state; not a top-level item |

The BMS module expands `Object.keys(BMS_COLLECTIONS)` into real collection routes and maps `config.manage` to its `.view` ability (see `bms.module.ts`). Do not confuse these real routes with legacy global routes.

## Target capability mapping and gaps

| Target workflow | Existing mapped capability | Status / evidence |
| --- | --- | --- |
| Organization: Business Units, organizational structure, employees, recruitment, reporting lines | `/units`, hierarchical `parent_id`; `/employees`; `/recruitment`; user `manager_id` and manager relation | Unit hierarchy, employee directory and recruitment exist in BMS code. Reporting-line fields are migration/controller-level code; live schema remains unverified. |
| Access Management: users, roles, permissions, assignments, unit access, audit | `/employees`, `/access`, `/audit/role-changes`; BMS role/ability table and unit pivot | Assign/revoke is implemented and audited; role abilities are seeded role definitions and displayed read-only. No evidence of a UI to create/update custom role permissions. Legacy permission groups also exist, distinct from BMS roles. |
| Execution: strategic plans, weekly plans, tasks, milestones, progress, ownership | BMS includes weekly plans/tasks/progress/owners; legacy project modules include project/process/task structures | Weekly plans and task ownership/progress exist. No BMS strategic-plan or named milestone workflow/table was found; not to be invented. Legacy project plans are a separate workflow and need deliberate mapping. |
| Business Development: clients, leads, opportunities, tenders, pipeline, forecasting | BMS leads, opportunities, pipeline stages; tender is opportunity `type`; older CRM `Partner`, `Contact`, `ContactLead`, campaigns | Lead/opportunity/tender records exist. Dedicated first-class BMS Clients screen/API absent. Client identity on opportunities is a `client_name` field; old CRM data exists separately. Forecast report is not evidenced as a distinct deliverable. |
| Operations: meetings, products, procurement, events, documents | BMS routes/models/API for all listed items | Code surfaces exist; exact workflow status/testing appears in `WORKFLOW_MATRIX.md`. |
| Reports: executive dashboard, organizational/execution/BD/operations/KPI reports | `/dashboard`, `/reports`; API monthly, quarterly, KPI, social reports | Monthly/quarterly/KPI/social report endpoints exist; distinct report-category screens or an agreed Executive dashboard presentation are not present. Dashboard filters are inconsistent across widgets. |

## Route preservation and non-goals for Phase 2

- Preserve `/bms/...` URLs, all legacy routes in `frontend/src/app/app-routing.module.ts`, backend API URLs, and current ability slugs.
- BMS uses hash routing (`RouterModule.forRoot(..., {useHash:true})`) and `AuthGuardService` on `/bms`; individual BMS route ability guards are separate.
- The BMS frontend client composes API paths as `${environment.newServerApi}/api/bms/${path}` in `bms-api.service.ts`; changing endpoints is outside Phase 2.
- The IA reclassification does not authorize deleting any route or workflow. The unresolved team-development placement should be explicitly decided before coding.
- Permission-aware groups and links currently disappear when unavailable. Requirement wording calls for exactly six categories and also permission-aware visibility; acceptance should state whether six group headings remain visible to every authenticated BMS user, or whether group visibility remains filtered while no additional group is ever introduced.

## Dependencies and risks

Navigation relabeling/reordering is independent of DB shape but must preserve direct links and permission guards. Combining legacy CRM with BMS clients or merging project plans with BMS weekly plans would cross data models and permissions and needs a separate approved workflow/data mapping, not a sidebar-only change.
