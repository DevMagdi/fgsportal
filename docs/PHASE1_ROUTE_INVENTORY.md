# Route inventory (before / after) — Phase 1 shell and Phase 2 Stage A

Produced by `node frontend/scripts/route-inventory.js`. Before = commit `884930a` (base, 100 entries), after = working tree with Phase 1 and Phase 2 Stage A (102 entries).

## Diff (before → after)

```diff
31c31
< components/bms/bms.module.ts :: / | component=BmsShellComponent | canActivate=- | redirectTo=- | pathMatch=- | lazy=- | data=-
---
> components/bms/bms.module.ts :: / | component=- | canActivate=- | redirectTo=- | pathMatch=- | lazy=- | data=-
34a35
> components/bms/bms.module.ts :: /organization | component=OrganizationOverviewComponent | canActivate=[BmsPermissionGuard] | redirectTo=- | pathMatch=- | lazy=- | data={ ability: 'units.view' }
35a37
> components/bms/bms.module.ts :: /units/:id | component=UnitDetailComponent | canActivate=[BmsPermissionGuard] | redirectTo=- | pathMatch=- | lazy=- | data={ ability: 'units.view' }
```

Three changes, all inside the lazy BMS module:

1. **Phase 1** — the parent route of the BMS module no longer mounts `BmsShellComponent` (the second sidebar). Its path, children, guards and redirects are unchanged.
2. **Phase 2 Stage A** — new route `/bms/organization` (Organization overview), guarded by `BmsPermissionGuard` with ability `units.view`.
3. **Phase 2 Stage A** — new route `/bms/units/:id` (Business unit details), guarded by `BmsPermissionGuard` with ability `units.view`.

No existing route was removed, renamed or re-guarded. `app-routing.module.ts` is byte-identical.

`node frontend/scripts/check-registry-routes.js` now resolves `/bms/*` module cards against `bms.module.ts` and the `BMS_COLLECTIONS` keys (it previously looked for them in `app-routing.module.ts` and reported all 15 as dead): 62 registry routes validated, 0 dead.

## After

```
app-routing.module.ts :: / | component=- | canActivate=- | redirectTo='/signin' | pathMatch='full' | lazy=- | data=-
app-routing.module.ts :: /signin | component=SigninComponent | canActivate=- | redirectTo=- | pathMatch=- | lazy=- | data=-
app-routing.module.ts :: /logout | component=LogoutComponent | canActivate=- | redirectTo=- | pathMatch=- | lazy=- | data=-
app-routing.module.ts :: /forgetpassowrd | component=ForgetpassowrdComponent | canActivate=- | redirectTo=- | pathMatch=- | lazy=- | data=-
app-routing.module.ts :: /user/:id | component=UserDetailsComponent | canActivate=[AuthGuardService] | redirectTo=- | pathMatch=- | lazy=- | data=-
app-routing.module.ts :: /users | component=PublicUsersPageComponent | canActivate=[AuthGuardService] | redirectTo=- | pathMatch=- | lazy=- | data=-
app-routing.module.ts :: /notification | component=NotificationPageComponent | canActivate=[AuthGuardService] | redirectTo=- | pathMatch=- | lazy=- | data=-
app-routing.module.ts :: /logs | component=SystemLogsComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
app-routing.module.ts :: /notes | component=NotesComponent | canActivate=[AuthGuardService] | redirectTo=- | pathMatch=- | lazy=- | data=-
app-routing.module.ts :: /my_work | component=GlobalTimeSheetComponent | canActivate=[AuthGuardService] | redirectTo=- | pathMatch=- | lazy=- | data=-
app-routing.module.ts :: /publicReqsApply | component=PublicRequestsApprovalComponent | canActivate=[AuthGuardService] | redirectTo=- | pathMatch=- | lazy=- | data=-
app-routing.module.ts :: /module-disabled | component=ModuleDisabledComponent | canActivate=[AuthGuardService] | redirectTo=- | pathMatch=- | lazy=- | data=-
app-routing.module.ts :: /modules | component=- | canActivate=- | redirectTo='/bms/dashboard' | pathMatch='full' | lazy=- | data=-
app-routing.module.ts :: /modules/:slug | component=- | canActivate=- | redirectTo='/bms/dashboard' | pathMatch=- | lazy=- | data=-
app-routing.module.ts :: /tickets | component=FollowClientTicketsComponent | canActivate=[AuthGuardService, ModuleGuard] | redirectTo=- | pathMatch=- | lazy=- | data={ module: 'ticketing' }
app-routing.module.ts :: /tickets/:id | component=FollowClientTicketDetailsComponent | canActivate=[AuthGuardService, ModuleGuard] | redirectTo=- | pathMatch=- | lazy=- | data={ module: 'ticketing' }
app-routing.module.ts :: /support-reports | component=SupportReportsComponent | canActivate=[AuthGuardService, ModuleGuard] | redirectTo=- | pathMatch=- | lazy=- | data={ module: 'ticketing' }
app-routing.module.ts :: /manager | component=ManagerComponent | canActivate=[ManagerGuard, ModuleGuard] | redirectTo=- | pathMatch=- | lazy='./components/manager/manager/manager.module' | data={ module: 'projects' }
app-routing.module.ts :: /dev | component=DevComponent | canActivate=[DevGuard, ModuleGuard] | redirectTo=- | pathMatch=- | lazy='./components/dev/dev/dev.module' | data={ module: 'projects' }
app-routing.module.ts :: /admin-panel | component=AdminPanelComponent | canActivate=[ManagerGuard, ModuleGuard] | redirectTo=- | pathMatch=- | lazy='./components/admin/admin/admin.module' | data={ module: 'admin' }
app-routing.module.ts :: /CRM | component=CrmMainComponent | canActivate=[CRMGuard, ModuleGuard] | redirectTo=- | pathMatch=- | lazy='./components/crm/crm.module' | data={ module: 'crm' }
app-routing.module.ts :: /bms | component=- | canActivate=[AuthGuardService] | redirectTo=- | pathMatch=- | lazy='./components/bms/bms.module' | data=-
app-routing.module.ts :: /hr | component=- | canActivate=[ModuleGuard] | redirectTo=- | pathMatch=- | lazy='./components/hr/hr.module' | data={ module: 'hr' }
app-routing.module.ts :: /** | component=PageNotFoundComponent | canActivate=- | redirectTo=- | pathMatch=- | lazy=- | data=-
components/admin/admin/admin-routing.module.ts :: /dashboard | component=DashBoardComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/admin/admin/admin-routing.module.ts :: /vacations | component=AdminVacationsComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/admin/admin/admin-routing.module.ts :: /pendingtransportations | component=PendingTransportationsComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/admin/admin/admin-routing.module.ts :: /transportationsheet | component=MonthlyTransportationSheetComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/admin/admin/admin-routing.module.ts :: /announces | component=AnnouncementsComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/admin/admin/admin-routing.module.ts :: /usersdata | component=UsersDataComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/bms/bms.module.ts :: / | component=- | canActivate=- | redirectTo=- | pathMatch=- | lazy=- | data=-
components/bms/bms.module.ts :: / | component=- | canActivate=- | redirectTo='dashboard' | pathMatch='full' | lazy=- | data=-
components/bms/bms.module.ts :: /no-access | component=BmsNoAccessComponent | canActivate=- | redirectTo=- | pathMatch=- | lazy=- | data=-
components/bms/bms.module.ts :: /dashboard | component=ExecutiveDashboardComponent | canActivate=[BmsPermissionGuard] | redirectTo=- | pathMatch=- | lazy=- | data={ ability: 'dashboard.view' }
components/bms/bms.module.ts :: /organization | component=OrganizationOverviewComponent | canActivate=[BmsPermissionGuard] | redirectTo=- | pathMatch=- | lazy=- | data={ ability: 'units.view' }
components/bms/bms.module.ts :: /units | component=BusinessUnitsComponent | canActivate=[BmsPermissionGuard] | redirectTo=- | pathMatch=- | lazy=- | data={ ability: 'units.view' }
components/bms/bms.module.ts :: /units/:id | component=UnitDetailComponent | canActivate=[BmsPermissionGuard] | redirectTo=- | pathMatch=- | lazy=- | data={ ability: 'units.view' }
components/bms/bms.module.ts :: /plans | component=WeeklyPlansComponent | canActivate=[BmsPermissionGuard] | redirectTo=- | pathMatch=- | lazy=- | data={ ability: 'plans.view' }
components/bms/bms.module.ts :: /my-tasks | component=MyTasksComponent | canActivate=[BmsPermissionGuard] | redirectTo=- | pathMatch=- | lazy=- | data={ ability: 'plans.view' }
components/bms/bms.module.ts :: /opportunities | component=OpportunitiesComponent | canActivate=[BmsPermissionGuard] | redirectTo=- | pathMatch=- | lazy=- | data={ ability: 'opportunities.view' }
components/bms/bms.module.ts :: /products | component=ProductTrackingComponent | canActivate=[BmsPermissionGuard] | redirectTo=- | pathMatch=- | lazy=- | data={ ability: 'products.view' }
components/bms/bms.module.ts :: /meetings | component=MeetingsComponent | canActivate=[BmsPermissionGuard] | redirectTo=- | pathMatch=- | lazy=- | data={ ability: 'meetings.view' }
components/bms/bms.module.ts :: /reports | component=ReportsComponent | canActivate=[BmsPermissionGuard] | redirectTo=- | pathMatch=- | lazy=- | data={ ability: 'reports.view' }
components/bms/bms.module.ts :: /access | component=AccessComponent | canActivate=[BmsPermissionGuard] | redirectTo=- | pathMatch=- | lazy=- | data={ ability: 'roles.manage' }
components/bms/bms.module.ts :: /employees | component=EmployeeManagementComponent | canActivate=[BmsPermissionGuard] | redirectTo=- | pathMatch=- | lazy=- | data={ ability: 'directory.view' }
components/bms/bms.module.ts :: / + DYNAMIC ...Object.keys(BMS_COLLECTIONS).map(key => ({ path: key, component: BmsCollectionComponent, data: { config: BMS_COLLECTIONS[key], ability: `${BMS_COLLECTIONS[key].manage.replace('.manage', '')}.view` }, canActivate: [BmsPermissionGuard], }))
components/crm/crm-routing.module.ts :: // | component=CrmMainComponent | canActivate=[CRMGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/crm/crm-routing.module.ts :: /leads | component=LeadsComponent | canActivate=[CRMGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/crm/crm-routing.module.ts :: /contacts | component=ContactsComponent | canActivate=[CRMGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/crm/crm-routing.module.ts :: /campaigns | component=CampaignsComponent | canActivate=[CRMGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/crm/crm-routing.module.ts :: /leads/:id | component=AccountDetailsComponent | canActivate=[CRMGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/crm/crm-routing.module.ts :: /activities | component=ActivitiesComponent | canActivate=[CRMGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/crm/crm-routing.module.ts :: /poc-requests | component=PocRequestsComponent | canActivate=[CRMGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/crm/crm-routing.module.ts :: /accounts | component=AccountsComponent | canActivate=[CRMGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/crm/crm-routing.module.ts :: /accounts/:id | component=OrganizationDetailsComponent | canActivate=[CRMGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/crm/crm-routing.module.ts :: /opportunity | component=OpportunityComponent | canActivate=[CRMGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/crm/crm-routing.module.ts :: /closed | component=ClosedLeadsComponent | canActivate=[CRMGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/crm/crm-routing.module.ts :: /dashboard | component=DashboardComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/crm/crm-routing.module.ts :: /requests | component=PublicRequestComponent | canActivate=[CRMGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/crm/crm-routing.module.ts :: /reports | component=CrmReportsComponent | canActivate=[DepartmentGuard] | redirectTo=- | pathMatch=- | lazy=- | data={ allowedDepartments: reportsAllowedDepartments }
components/dev/dev/dev-routing.module.ts :: /myprojects | component=DevProjectsComponent | canActivate=[DevGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/dev/dev/dev-routing.module.ts :: /myprojects/:id | component=ProjectDetailsComponent | canActivate=[DevGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/dev/dev/dev-routing.module.ts :: /myprojects/:id/:subTasks | component=ProjectSubTasksComponent | canActivate=[DevGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/dev/dev/dev-routing.module.ts :: /timesheet | component=TimeSheetComponent | canActivate=[DevGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/dev/dev/dev-routing.module.ts :: /history | component=HistoryComponent | canActivate=[DevGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/dev/dev/dev-routing.module.ts :: /rejected | component=RejectedReportsComponent | canActivate=[DevGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/dev/dev/dev-routing.module.ts :: /pending | component=PendingReportsComponent | canActivate=[DevGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/dev/dev/dev-routing.module.ts :: /reports | component=DevReportsComponent | canActivate=[DevGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/dev/dev/dev-routing.module.ts :: /transportaions | component=TransportaionsComponent | canActivate=[DevGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/dev/dev/dev-routing.module.ts :: /requests | component=RequestsComponent | canActivate=[DevGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/dev/dev/dev-routing.module.ts :: /reportsToApprove | component=SeniorReportApprovalComponent | canActivate=[DevGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/hr/hr-routing.module.ts :: / | component=- | canActivate=- | redirectTo='hiring-process' | pathMatch='full' | lazy=- | data=-
components/hr/hr-routing.module.ts :: /hiring-process | component=- | canActivate=- | redirectTo=- | pathMatch=- | lazy=- | data=-
components/hr/hr-routing.module.ts :: /hiring-process | component=- | canActivate=- | redirectTo='candidates' | pathMatch='full' | lazy=- | data=-
components/hr/hr-routing.module.ts :: /hiring-process/candidates | component=CandidatesComponent | canActivate=- | redirectTo=- | pathMatch=- | lazy=- | data=-
components/hr/hr-routing.module.ts :: /hiring-process/job-profiles | component=JobProfilesComponent | canActivate=- | redirectTo=- | pathMatch=- | lazy=- | data=-
components/hr/hr-routing.module.ts :: /hiring-process/job-skills | component=JobSkillsComponent | canActivate=- | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /projects | component=ProjectsComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /projects/:id | component=ProjectDetailsComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /projects/:id/:subTasks | component=ProjectSubTasksComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /addusers | component=CreateUserComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /reports | component=ReportsComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /public_reports | component=PublicReportsComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /admin_tasks | component=ManageAdminTasksComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /apporval | component=ReportsApprovalComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /salaries | component=SalariesComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /costs | component=ProjectCostComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /incentive | component=IncentiveComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /publicreqs | component=PublicRequestsApprovalComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /config | component=ConfigurationsComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /client-support | component=SupportComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /client-support/:id | component=SupportDetailsComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /partners | component=PartnersComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /partners/:id | component=PartnerDetailsComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /org | component=OrgChartComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /available | component=OpenToWorkComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /rating/config | component=RatingConfigComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /rating | component=RatingComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /rating/:id | component=RateUserComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /devprog | component=DevProgressComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /cloneProject/:id | component=CloneProjectComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /project-manager-reports | component=ProjectManagerReportComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
```

## Before

```
app-routing.module.ts :: / | component=- | canActivate=- | redirectTo='/signin' | pathMatch='full' | lazy=- | data=-
app-routing.module.ts :: /signin | component=SigninComponent | canActivate=- | redirectTo=- | pathMatch=- | lazy=- | data=-
app-routing.module.ts :: /logout | component=LogoutComponent | canActivate=- | redirectTo=- | pathMatch=- | lazy=- | data=-
app-routing.module.ts :: /forgetpassowrd | component=ForgetpassowrdComponent | canActivate=- | redirectTo=- | pathMatch=- | lazy=- | data=-
app-routing.module.ts :: /user/:id | component=UserDetailsComponent | canActivate=[AuthGuardService] | redirectTo=- | pathMatch=- | lazy=- | data=-
app-routing.module.ts :: /users | component=PublicUsersPageComponent | canActivate=[AuthGuardService] | redirectTo=- | pathMatch=- | lazy=- | data=-
app-routing.module.ts :: /notification | component=NotificationPageComponent | canActivate=[AuthGuardService] | redirectTo=- | pathMatch=- | lazy=- | data=-
app-routing.module.ts :: /logs | component=SystemLogsComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
app-routing.module.ts :: /notes | component=NotesComponent | canActivate=[AuthGuardService] | redirectTo=- | pathMatch=- | lazy=- | data=-
app-routing.module.ts :: /my_work | component=GlobalTimeSheetComponent | canActivate=[AuthGuardService] | redirectTo=- | pathMatch=- | lazy=- | data=-
app-routing.module.ts :: /publicReqsApply | component=PublicRequestsApprovalComponent | canActivate=[AuthGuardService] | redirectTo=- | pathMatch=- | lazy=- | data=-
app-routing.module.ts :: /module-disabled | component=ModuleDisabledComponent | canActivate=[AuthGuardService] | redirectTo=- | pathMatch=- | lazy=- | data=-
app-routing.module.ts :: /modules | component=- | canActivate=- | redirectTo='/bms/dashboard' | pathMatch='full' | lazy=- | data=-
app-routing.module.ts :: /modules/:slug | component=- | canActivate=- | redirectTo='/bms/dashboard' | pathMatch=- | lazy=- | data=-
app-routing.module.ts :: /tickets | component=FollowClientTicketsComponent | canActivate=[AuthGuardService, ModuleGuard] | redirectTo=- | pathMatch=- | lazy=- | data={ module: 'ticketing' }
app-routing.module.ts :: /tickets/:id | component=FollowClientTicketDetailsComponent | canActivate=[AuthGuardService, ModuleGuard] | redirectTo=- | pathMatch=- | lazy=- | data={ module: 'ticketing' }
app-routing.module.ts :: /support-reports | component=SupportReportsComponent | canActivate=[AuthGuardService, ModuleGuard] | redirectTo=- | pathMatch=- | lazy=- | data={ module: 'ticketing' }
app-routing.module.ts :: /manager | component=ManagerComponent | canActivate=[ManagerGuard, ModuleGuard] | redirectTo=- | pathMatch=- | lazy='./components/manager/manager/manager.module' | data={ module: 'projects' }
app-routing.module.ts :: /dev | component=DevComponent | canActivate=[DevGuard, ModuleGuard] | redirectTo=- | pathMatch=- | lazy='./components/dev/dev/dev.module' | data={ module: 'projects' }
app-routing.module.ts :: /admin-panel | component=AdminPanelComponent | canActivate=[ManagerGuard, ModuleGuard] | redirectTo=- | pathMatch=- | lazy='./components/admin/admin/admin.module' | data={ module: 'admin' }
app-routing.module.ts :: /CRM | component=CrmMainComponent | canActivate=[CRMGuard, ModuleGuard] | redirectTo=- | pathMatch=- | lazy='./components/crm/crm.module' | data={ module: 'crm' }
app-routing.module.ts :: /bms | component=- | canActivate=[AuthGuardService] | redirectTo=- | pathMatch=- | lazy='./components/bms/bms.module' | data=-
app-routing.module.ts :: /hr | component=- | canActivate=[ModuleGuard] | redirectTo=- | pathMatch=- | lazy='./components/hr/hr.module' | data={ module: 'hr' }
app-routing.module.ts :: /** | component=PageNotFoundComponent | canActivate=- | redirectTo=- | pathMatch=- | lazy=- | data=-
components/admin/admin/admin-routing.module.ts :: /dashboard | component=DashBoardComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/admin/admin/admin-routing.module.ts :: /vacations | component=AdminVacationsComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/admin/admin/admin-routing.module.ts :: /pendingtransportations | component=PendingTransportationsComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/admin/admin/admin-routing.module.ts :: /transportationsheet | component=MonthlyTransportationSheetComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/admin/admin/admin-routing.module.ts :: /announces | component=AnnouncementsComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/admin/admin/admin-routing.module.ts :: /usersdata | component=UsersDataComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/bms/bms.module.ts :: / | component=BmsShellComponent | canActivate=- | redirectTo=- | pathMatch=- | lazy=- | data=-
components/bms/bms.module.ts :: / | component=- | canActivate=- | redirectTo='dashboard' | pathMatch='full' | lazy=- | data=-
components/bms/bms.module.ts :: /no-access | component=BmsNoAccessComponent | canActivate=- | redirectTo=- | pathMatch=- | lazy=- | data=-
components/bms/bms.module.ts :: /dashboard | component=ExecutiveDashboardComponent | canActivate=[BmsPermissionGuard] | redirectTo=- | pathMatch=- | lazy=- | data={ ability: 'dashboard.view' }
components/bms/bms.module.ts :: /units | component=BusinessUnitsComponent | canActivate=[BmsPermissionGuard] | redirectTo=- | pathMatch=- | lazy=- | data={ ability: 'units.view' }
components/bms/bms.module.ts :: /plans | component=WeeklyPlansComponent | canActivate=[BmsPermissionGuard] | redirectTo=- | pathMatch=- | lazy=- | data={ ability: 'plans.view' }
components/bms/bms.module.ts :: /my-tasks | component=MyTasksComponent | canActivate=[BmsPermissionGuard] | redirectTo=- | pathMatch=- | lazy=- | data={ ability: 'plans.view' }
components/bms/bms.module.ts :: /opportunities | component=OpportunitiesComponent | canActivate=[BmsPermissionGuard] | redirectTo=- | pathMatch=- | lazy=- | data={ ability: 'opportunities.view' }
components/bms/bms.module.ts :: /products | component=ProductTrackingComponent | canActivate=[BmsPermissionGuard] | redirectTo=- | pathMatch=- | lazy=- | data={ ability: 'products.view' }
components/bms/bms.module.ts :: /meetings | component=MeetingsComponent | canActivate=[BmsPermissionGuard] | redirectTo=- | pathMatch=- | lazy=- | data={ ability: 'meetings.view' }
components/bms/bms.module.ts :: /reports | component=ReportsComponent | canActivate=[BmsPermissionGuard] | redirectTo=- | pathMatch=- | lazy=- | data={ ability: 'reports.view' }
components/bms/bms.module.ts :: /access | component=AccessComponent | canActivate=[BmsPermissionGuard] | redirectTo=- | pathMatch=- | lazy=- | data={ ability: 'roles.manage' }
components/bms/bms.module.ts :: /employees | component=EmployeeManagementComponent | canActivate=[BmsPermissionGuard] | redirectTo=- | pathMatch=- | lazy=- | data={ ability: 'directory.view' }
components/bms/bms.module.ts :: / + DYNAMIC ...Object.keys(BMS_COLLECTIONS).map(key => ({ path: key, component: BmsCollectionComponent, data: { config: BMS_COLLECTIONS[key], ability: `${BMS_COLLECTIONS[key].manage.replace('.manage', '')}.view` }, canActivate: [BmsPermissionGuard], }))
components/crm/crm-routing.module.ts :: // | component=CrmMainComponent | canActivate=[CRMGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/crm/crm-routing.module.ts :: /leads | component=LeadsComponent | canActivate=[CRMGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/crm/crm-routing.module.ts :: /contacts | component=ContactsComponent | canActivate=[CRMGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/crm/crm-routing.module.ts :: /campaigns | component=CampaignsComponent | canActivate=[CRMGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/crm/crm-routing.module.ts :: /leads/:id | component=AccountDetailsComponent | canActivate=[CRMGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/crm/crm-routing.module.ts :: /activities | component=ActivitiesComponent | canActivate=[CRMGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/crm/crm-routing.module.ts :: /poc-requests | component=PocRequestsComponent | canActivate=[CRMGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/crm/crm-routing.module.ts :: /accounts | component=AccountsComponent | canActivate=[CRMGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/crm/crm-routing.module.ts :: /accounts/:id | component=OrganizationDetailsComponent | canActivate=[CRMGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/crm/crm-routing.module.ts :: /opportunity | component=OpportunityComponent | canActivate=[CRMGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/crm/crm-routing.module.ts :: /closed | component=ClosedLeadsComponent | canActivate=[CRMGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/crm/crm-routing.module.ts :: /dashboard | component=DashboardComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/crm/crm-routing.module.ts :: /requests | component=PublicRequestComponent | canActivate=[CRMGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/crm/crm-routing.module.ts :: /reports | component=CrmReportsComponent | canActivate=[DepartmentGuard] | redirectTo=- | pathMatch=- | lazy=- | data={ allowedDepartments: reportsAllowedDepartments }
components/dev/dev/dev-routing.module.ts :: /myprojects | component=DevProjectsComponent | canActivate=[DevGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/dev/dev/dev-routing.module.ts :: /myprojects/:id | component=ProjectDetailsComponent | canActivate=[DevGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/dev/dev/dev-routing.module.ts :: /myprojects/:id/:subTasks | component=ProjectSubTasksComponent | canActivate=[DevGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/dev/dev/dev-routing.module.ts :: /timesheet | component=TimeSheetComponent | canActivate=[DevGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/dev/dev/dev-routing.module.ts :: /history | component=HistoryComponent | canActivate=[DevGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/dev/dev/dev-routing.module.ts :: /rejected | component=RejectedReportsComponent | canActivate=[DevGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/dev/dev/dev-routing.module.ts :: /pending | component=PendingReportsComponent | canActivate=[DevGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/dev/dev/dev-routing.module.ts :: /reports | component=DevReportsComponent | canActivate=[DevGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/dev/dev/dev-routing.module.ts :: /transportaions | component=TransportaionsComponent | canActivate=[DevGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/dev/dev/dev-routing.module.ts :: /requests | component=RequestsComponent | canActivate=[DevGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/dev/dev/dev-routing.module.ts :: /reportsToApprove | component=SeniorReportApprovalComponent | canActivate=[DevGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/hr/hr-routing.module.ts :: / | component=- | canActivate=- | redirectTo='hiring-process' | pathMatch='full' | lazy=- | data=-
components/hr/hr-routing.module.ts :: /hiring-process | component=- | canActivate=- | redirectTo=- | pathMatch=- | lazy=- | data=-
components/hr/hr-routing.module.ts :: /hiring-process | component=- | canActivate=- | redirectTo='candidates' | pathMatch='full' | lazy=- | data=-
components/hr/hr-routing.module.ts :: /hiring-process/candidates | component=CandidatesComponent | canActivate=- | redirectTo=- | pathMatch=- | lazy=- | data=-
components/hr/hr-routing.module.ts :: /hiring-process/job-profiles | component=JobProfilesComponent | canActivate=- | redirectTo=- | pathMatch=- | lazy=- | data=-
components/hr/hr-routing.module.ts :: /hiring-process/job-skills | component=JobSkillsComponent | canActivate=- | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /projects | component=ProjectsComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /projects/:id | component=ProjectDetailsComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /projects/:id/:subTasks | component=ProjectSubTasksComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /addusers | component=CreateUserComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /reports | component=ReportsComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /public_reports | component=PublicReportsComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /admin_tasks | component=ManageAdminTasksComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /apporval | component=ReportsApprovalComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /salaries | component=SalariesComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /costs | component=ProjectCostComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /incentive | component=IncentiveComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /publicreqs | component=PublicRequestsApprovalComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /config | component=ConfigurationsComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /client-support | component=SupportComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /client-support/:id | component=SupportDetailsComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /partners | component=PartnersComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /partners/:id | component=PartnerDetailsComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /org | component=OrgChartComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /available | component=OpenToWorkComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /rating/config | component=RatingConfigComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /rating | component=RatingComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /rating/:id | component=RateUserComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /devprog | component=DevProgressComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /cloneProject/:id | component=CloneProjectComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
components/manager/manager/manager-routing.module.ts :: /project-manager-reports | component=ProjectManagerReportComponent | canActivate=[ManagerGuard] | redirectTo=- | pathMatch=- | lazy=- | data=-
```
