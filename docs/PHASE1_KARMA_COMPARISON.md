# Phase 1 — Karma comparison (untouched base vs Phase 1)

Command, run in `frontend/` for both trees (headless Chromium 123):

```
CHROME_BIN=<headless chromium> npx ng test --watch=false --browsers=ChromeHeadless --progress=false
```

**The suite does not pass on either tree: both runs exit with code 1.**

| | Base `884930a` | Phase 1 working tree |
|---|---|---|
| Karma summary | TOTAL: 99 FAILED, 113 SUCCESS | TOTAL: 98 FAILED, 161 SUCCESS |
| Executed | Executed 212 of 212 | Executed 259 of 259 |
| Exit code | 1 | 1 |
| Failed tests | 99 | 98 |
| Distinct failed names | 98 | 97 |

`DevReportsComponent should create` is counted twice in both runs: two different spec files use that name.

Every failure on both trees is a missing provider in a legacy spec (`NullInjectorError` for Router, AngularFireDatabase, MatDialog, MatSnackBar or HttpClient).

## Failed on Phase 1 but not on the base

```
(none)
```

## Failed on the base but not on Phase 1

```
NavbarComponent exposes module entitlement checks for the menu
```

This test lived in `components/navbar/navbar.component.spec.ts`, which was deleted together with the navbar. It was not repaired; it no longer exists. That is the whole difference between 99 and 98.

## Failed on both (identical set, 98 tests)

```
AccountDetailsComponent should create
AccountsComponent should create
ActivitiesComponent should create
ActivityFormComponent should create
AdminVacationsComponent should create
AnnouncementsComponent should create
ApprovedSalariesComponent should create
AuthGuardService should be created
AvailableDevComponent should create
CRMGuard should be created
CandidateSearchComponent should create
CandidatesComponent should create
ClientsAccountsComponent should create
CloneProjectComponent should create
ClosedLeadsComponent should create
ClosedProjectsComponent should create
ConfigurationsComponent should create
ContactsComponent should create
ContractSupportCostComponent should create
CreateUserComponent should create
DashBoardComponent should create
DashboardComponent should create
DatabaseService should be created
DevComponent should create
DevGuard should be created
DevProgressComponent should create
DevProjectsComponent should create
DevReportsComponent should create
DevReportsComponent should create
EditSalariesComponent should create
EmpWeeklyReportsComponent should create
FollowClientTicketsComponent should create
ForgetpassowrdComponent should create
GlobalTimeSheetComponent should create
HistoryComponent should create
IncentiveApprovedComponent should create
IncentiveComponent should create
IncentiveHistoryComponent should create
IncentiveRequestsComponent should create
JobProfileManagementComponent should create
JobProfilesComponent should create
JobSkillManangementComponent should create
JobSkillsComponent should create
LeadCostDetailsFormComponent should create
LeadsComponent should create
LogoutComponent should create
ManageAdminTasksComponent should create
ManageReportComponent should create
ManagerGuard should be created
ManagerReportsComponent should create
MonthlySalariesComponent should create
MonthlyTransportationSheetComponent should create
NotesComponent should create
NotificationService should be created
OfficialVacationsComponent should create
OpenToWorkComponent should create
OpportunityComponent should create
OrgChartComponent should create
OrganizationDetailsComponent should create
PartnerDetailsComponent should create
PartnersComponent should create
PendingReportsComponent should create
PendingTransportationsComponent should create
PendingVacationRequestsComponent should create
ProjectCostApiService should be created
ProjectCostComponent should create
ProjectDetailsComponent should create
ProjectManagerReportComponent should create
ProjectReportComponent should create
ProjectSubTasksComponent should create
ProjectsComponent should create
PublicRequestComponent should create
PublicRequestsApprovalComponent should create
PublicUsersPageComponent should create
RamadanConfigComponent should create
RateMyEmpsComponent should create
RateUserComponent should create
RatingComponent should create
RatingConfigComponent should create
RejectedReportsComponent should create
RelativesComponent should create
ReportsApprovalComponent should create
ReportsComponent should create
RequestsHistoryComponent should create
SalariesComponent should create
SeniorReportApprovalComponent should create
SigninComponent should create
SupportComponent should create
SupportDetailsComponent should create
SupportReportsComponent should create
SystemLogsComponent should create
TimeSheetComponent should create
TransportaionsComponent should create
UserAnnualLeaveComponent should create
UserDetailsComponent should create
UserPermissionsComponent should create
UsersDataComponent should create
VacationReportComponent should create
```
