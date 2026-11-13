# Angular/Karma failure comparison — Phase 2 vs Phase 3

Both complete, unfiltered Chromium/Karma runs were parsed from saved test logs. ANSI presentation codes and checkout-root prefixes are normalized. Each row gives the failing spec label and its first two diagnostic lines. Duplicate labels are retained as occurrences.

- Phase 2: 204 executed; 69 passed, 135 failed.
- Phase 3: 211 executed; 76 passed, 135 failed.
- Failure occurrence multisets including normalized primary diagnostics: **identical (135 / 135)**; no new or resolved failure labels/messages.
- The additional seven passing specs do not make the full Karma suite green.

| # | Failing spec label | Primary diagnostic (normalized) |
|---:|---|---|
| 1 | `AccountDetailsComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[DatabaseService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 2 | `AccountsComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[DatabaseService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 3 | `ActivitiesComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[DatabaseService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 4 | `ActivityFormComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[DatabaseService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 5 | `AdminVacationsComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 6 | `AnnouncementsComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[DatabaseService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 7 | `AppComponent should create the app` | `NullInjectorError: R3InjectorError(DynamicTestModule)[MessagingService -> MessagingService]:; NullInjectorError: No provider for MessagingService!` |
| 8 | `AppComponent should have as title 'alphaiota'` | `NullInjectorError: R3InjectorError(DynamicTestModule)[MessagingService -> MessagingService]:; NullInjectorError: No provider for MessagingService!` |
| 9 | `AppComponent should render title` | `NullInjectorError: R3InjectorError(DynamicTestModule)[MessagingService -> MessagingService]:; NullInjectorError: No provider for MessagingService!` |
| 10 | `ApprovedSalariesComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 11 | `AuthGuardService should be created` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthGuardService -> Router -> Router]:; NullInjectorError: No provider for Router!` |
| 12 | `AvailableDevComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[DatabaseService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 13 | `CRMGuard should be created` | `NullInjectorError: R3InjectorError(DynamicTestModule)[CRMGuard -> AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 14 | `CandidateDetailsComponent should create` | `TypeError: Cannot read properties of undefined (reading 'first_name'); at CandidateDetailsComponent_Template (ng:///CandidateDetailsComponent.js:106:54)` |
| 15 | `CandidateManagementComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[HrService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 16 | `CandidateSearchComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[HrService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 17 | `CandidatesComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[HrService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 18 | `ClientsAccountsComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 19 | `CloneProjectComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 20 | `ClosedLeadsComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[DatabaseService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 21 | `ClosedProjectsComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[NotificationService -> MatSnackBar -> MatSnackBar]:; NullInjectorError: No provider for MatSnackBar!` |
| 22 | `ConfigurationsComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 23 | `ContactsComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 24 | `ContractSupportCostComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[DatabaseService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 25 | `CreateUserComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 26 | `DashBoardComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[DatabaseService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 27 | `DashboardComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[DatabaseService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 28 | `DatabaseService should be created` | `NullInjectorError: R3InjectorError(DynamicTestModule)[DatabaseService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 29 | `DevComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 30 | `DevGuard should be created` | `NullInjectorError: R3InjectorError(DynamicTestModule)[DevGuard -> AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 31 | `DevProgressComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 32 | `DevProjectsComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[DatabaseService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 33 | `DevReportsComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 34 | `DevReportsComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[NotificationService -> MatSnackBar -> MatSnackBar]:; NullInjectorError: No provider for MatSnackBar!` |
| 35 | `DialogComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[InjectionToken MatDialogData -> InjectionToken MatDialogData]:; NullInjectorError: No provider for InjectionToken MatDialogData!` |
| 36 | `EditSalariesComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 37 | `EmpWeeklyReportsComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[NotificationService -> MatSnackBar -> MatSnackBar]:; NullInjectorError: No provider for MatSnackBar!` |
| 38 | `FinanceService should be created` | `NullInjectorError: R3InjectorError(DynamicTestModule)[FinanceService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 39 | `FollowClientTicketDetailsComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[DatabaseService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 40 | `FollowClientTicketsComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 41 | `ForgetpassowrdComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 42 | `GlobalTimeSheetComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 43 | `HistoryComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 44 | `HrService should be created` | `NullInjectorError: R3InjectorError(DynamicTestModule)[HrService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 45 | `IncentiveApprovedComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[FinanceService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 46 | `IncentiveComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 47 | `IncentiveHistoryComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 48 | `IncentiveRequestsComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[DatabaseService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 49 | `JobProfileManagementComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[HrService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 50 | `JobProfilesComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[HrService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 51 | `JobSkillManangementComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[HrService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 52 | `JobSkillsComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[HrService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 53 | `LeadCostDetailsFormComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 54 | `LeadsComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[DatabaseService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 55 | `LogoutComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 56 | `ManageAdminTasksComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 57 | `ManageReportComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 58 | `ManagerComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[Router -> Router]:; NullInjectorError: No provider for Router!` |
| 59 | `ManagerGuard should be created` | `NullInjectorError: R3InjectorError(DynamicTestModule)[ManagerGuard -> AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 60 | `ManagerReportsComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[NotificationService -> MatSnackBar -> MatSnackBar]:; NullInjectorError: No provider for MatSnackBar!` |
| 61 | `MessagingService should be created` | `NullInjectorError: R3InjectorError(CompilerModule)[MessagingService -> MessagingService]:; NullInjectorError: No provider for MessagingService!` |
| 62 | `ModuleGuard allows navigation when the required module is enabled` | `NullInjectorError: R3InjectorError(DynamicTestModule)[ModuleGuard -> ModuleService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 63 | `ModuleGuard allows routes without a module requirement` | `NullInjectorError: R3InjectorError(DynamicTestModule)[ModuleGuard -> ModuleService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 64 | `ModuleGuard always allows the core module` | `NullInjectorError: R3InjectorError(DynamicTestModule)[ModuleGuard -> ModuleService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 65 | `ModuleGuard redirects to the module-disabled page when the module is disabled` | `NullInjectorError: R3InjectorError(DynamicTestModule)[ModuleGuard -> ModuleService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 66 | `ModuleGuard should be created` | `NullInjectorError: R3InjectorError(DynamicTestModule)[ModuleGuard -> ModuleService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 67 | `ModuleService keeps cached entitlements when the backend call fails` | `Error: Expected one matching request for criteria "Match by function: ", found none. Requests received are: GET YOUR_BACKEND_API_BASE_URL/api/company/modules?token=jwt-token.; at HttpClientTestingBackend.expectOne (<node_modules>/@angular/common/fesm2015/http/testing.mjs:288:19)` |
| 68 | `ModuleService loads enabled module slugs from the backend` | `Error: Expected one matching request for criteria "Match by function: ", found none. Requests received are: GET YOUR_BACKEND_API_BASE_URL/api/company/modules?token=jwt-token.; at HttpClientTestingBackend.expectOne (<node_modules>/@angular/common/fesm2015/http/testing.mjs:288:19)` |
| 69 | `ModuleService loads the full catalogue (including disabled modules) and syncs enabled slugs` | `Error: Expected one matching request for criteria "Match by function: ", found none. Requests received are: GET YOUR_BACKEND_API_BASE_URL/api/modules?token=jwt-token.; at HttpClientTestingBackend.expectOne (<node_modules>/@angular/common/fesm2015/http/testing.mjs:288:19)` |
| 70 | `ModulesCardsComponent builds one card per slug using the shared module metadata` | `Expected $.length = 7 to equal 6.; Expected $[1] = 'bms' to equal 'crm'.` |
| 71 | `ModulesCardsComponent renders one card for every module, with disabled cards dimmed and not hidden` | `Error: Expected 7 to be 6.; at <Jasmine>` |
| 72 | `MonthlySalariesComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 73 | `MonthlyTransportationSheetComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[DatabaseService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 74 | `MyProjectsAndTasksComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[DatabaseService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 75 | `MyRatesComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[DatabaseService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 76 | `NotesComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[DatabaseService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 77 | `NotificationPageComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[MessagingService -> MessagingService]:; NullInjectorError: No provider for MessagingService!` |
| 78 | `NotificationService should be created` | `NullInjectorError: R3InjectorError(DynamicTestModule)[NotificationService -> MatSnackBar -> MatSnackBar]:; NullInjectorError: No provider for MatSnackBar!` |
| 79 | `OfficialVacationsComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[NotificationService -> MatSnackBar -> MatSnackBar]:; NullInjectorError: No provider for MatSnackBar!` |
| 80 | `OpenToWorkComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 81 | `OpportunityComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[DatabaseService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 82 | `OrgChartComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 83 | `OrganizationDetailsComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[DatabaseService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 84 | `OverDueTasksComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[DatabaseService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 85 | `PartnerDetailsComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 86 | `PartnersComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 87 | `PendingReportsComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[DatabaseService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 88 | `PendingTransportationsComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[DatabaseService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 89 | `PendingVacationRequestsComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[NotificationService -> MatSnackBar -> MatSnackBar]:; NullInjectorError: No provider for MatSnackBar!` |
| 90 | `PocRequestsComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 91 | `ProjectCostApiService should be created` | `NullInjectorError: R3InjectorError(DynamicTestModule)[ProjectCostApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 92 | `ProjectCostComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[NotificationService -> MatSnackBar -> MatSnackBar]:; NullInjectorError: No provider for MatSnackBar!` |
| 93 | `ProjectDetailsComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[DatabaseService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 94 | `ProjectManagerReportComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[NotificationService -> MatSnackBar -> MatSnackBar]:; NullInjectorError: No provider for MatSnackBar!` |
| 95 | `ProjectReportComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[DatabaseService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 96 | `ProjectSubTasksComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 97 | `ProjectsComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 98 | `PublicRequestComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 99 | `PublicRequestsApprovalComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 100 | `PublicUsersPageComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 101 | `RamadanConfigComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[NotificationService -> MatSnackBar -> MatSnackBar]:; NullInjectorError: No provider for MatSnackBar!` |
| 102 | `RateMyEmpsComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[DatabaseService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 103 | `RateUserComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[DatabaseService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 104 | `RatingComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 105 | `RatingConfigComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 106 | `RejectedReportsComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[NotificationService -> MatSnackBar -> MatSnackBar]:; NullInjectorError: No provider for MatSnackBar!` |
| 107 | `RelativesComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 108 | `ReportsApprovalComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[DatabaseService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 109 | `ReportsComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[NotificationService -> MatSnackBar -> MatSnackBar]:; NullInjectorError: No provider for MatSnackBar!` |
| 110 | `ReportsTableComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[NotificationService -> MatSnackBar -> MatSnackBar]:; NullInjectorError: No provider for MatSnackBar!` |
| 111 | `RequestsHistoryComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[DatabaseService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 112 | `SalariesComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 113 | `SendEmailService should be created` | `NullInjectorError: R3InjectorError(DynamicTestModule)[SendEmailService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 114 | `SeniorReportApprovalComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 115 | `SigninComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[Router -> Router]:; NullInjectorError: No provider for Router!` |
| 116 | `SnackbarComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[MatSnackBarRef -> MatSnackBarRef]:; NullInjectorError: No provider for MatSnackBarRef!` |
| 117 | `SupportComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[DatabaseService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 118 | `SupportDetailsComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[DatabaseService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 119 | `SupportReportsComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[DatabaseService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 120 | `SystemLogsComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 121 | `TimeSheetComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[DatabaseService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 122 | `TransportaionsComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[DatabaseService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 123 | `UserAnnualLeaveComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[NotificationService -> MatSnackBar -> MatSnackBar]:; NullInjectorError: No provider for MatSnackBar!` |
| 124 | `UserDetailsComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[DatabaseService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 125 | `UserPermissionsComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 126 | `UserPermsCache builds a per-user storage key and null for empty input` | `TypeError: Cannot set property localStorage of [object Window] which has only a getter; at UserContext.<anonymous> (src/app/services/user-perms.cache.spec.ts:14:37)` |
| 127 | `UserPermsCache clear removes only the snapshot of the given user` | `TypeError: Cannot set property localStorage of [object Window] which has only a getter; at UserContext.<anonymous> (src/app/services/user-perms.cache.spec.ts:14:37)` |
| 128 | `UserPermsCache coerces non-array payloads to an empty array` | `TypeError: Cannot set property localStorage of [object Window] which has only a getter; at UserContext.<anonymous> (src/app/services/user-perms.cache.spec.ts:14:37)` |
| 129 | `UserPermsCache falls back to an empty array for corrupt JSON` | `TypeError: Cannot set property localStorage of [object Window] which has only a getter; at UserContext.<anonymous> (src/app/services/user-perms.cache.spec.ts:14:37)` |
| 130 | `UserPermsCache keeps snapshots isolated per user` | `TypeError: Cannot set property localStorage of [object Window] which has only a getter; at UserContext.<anonymous> (src/app/services/user-perms.cache.spec.ts:14:37)` |
| 131 | `UserPermsCache returns an empty array when nothing was cached` | `TypeError: Cannot set property localStorage of [object Window] which has only a getter; at UserContext.<anonymous> (src/app/services/user-perms.cache.spec.ts:14:37)` |
| 132 | `UserPermsCache round-trips permissions through localStorage` | `TypeError: Cannot set property localStorage of [object Window] which has only a getter; at UserContext.<anonymous> (src/app/services/user-perms.cache.spec.ts:14:37)` |
| 133 | `UserPermsCache save and load without a user key never touch storage` | `TypeError: Cannot set property localStorage of [object Window] which has only a getter; at UserContext.<anonymous> (src/app/services/user-perms.cache.spec.ts:14:37)` |
| 134 | `UsersDataComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[AuthApiService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
| 135 | `VacationReportComponent should create` | `NullInjectorError: R3InjectorError(DynamicTestModule)[DatabaseService -> HttpClient -> HttpClient]:; NullInjectorError: No provider for HttpClient!` |
