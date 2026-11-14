# Alphaiota executive and business-unit dashboard demo

## Outcome

The BMS executive dashboard now makes the currently applied scope explicit as either the **Alphaiota organization view** or a **business-unit view**. From organization-level unit progress, an authorized viewer can open a unit dashboard directly; the unit filter remains available for every unit returned by the permission-filtered lookup. The unit switch clears incompatible product/opportunity/week filters before reloading.

Dashboard values continue to come from the existing API. No demonstration counts, KPI values, database fixtures, or mock responses were added. Empty/loading/error states, existing RTL/LTR direction handling, and responsive styles remain in place.

## Organization and unit naming / scope

The user confirmed that Alphaiota is the organization and that G, X, and Omega are business units. Repository source and seeders currently store the BMS root as `Alpha Iota` and the child units as `Alpha X`, `Alpha Gen`, `Alpha Omega`, and `Alpha Delta`. The source contains no `Alpha Yotta` or `Alpha G` unit record. The dashboard preserves API-returned unit names rather than rewriting records or inventing aliases; `Alpha Gen` is the seeded name corresponding to the user's shorthand “G”. `Alpha Delta` remains visible because it is also an existing seeded unit and the selected authorization scope includes it.

The organization-level dashboard uses the existing `BmsAccess` global-scope behavior. `companies` and `business_units` have no relationship in the inspected schema, so this demo does **not** prove that all globally visible units belong to an Alphaiota company record. Confirm organization-to-unit ownership before production company-level isolation is required.

## Data, API, and authorization

- `GET /api/bms/lookups` supplies available unit names/IDs and abilities. The existing lookup is filtered by the viewer's `BmsAccess::visibleUnitIds()` scope.
- `GET /api/bms/executive-dashboard` supplies the organization view; `?business_unit_id=<id>` supplies the selected unit view. The existing route requires `dashboard.view`, and the controller calls `authorizeUnit()` for a selected unit.
- `GET /api/bms/reports/kpis?business_unit_id=<id>` continues to supply stored KPI history when the viewer has `reports.view`.
- Summary cards, task completion/blocker/overdue counts, opportunity stage distribution, product list, meetings, recent activity, and the submitted procurement count continue using existing database-backed controller queries. Product rows are returned as distinct product records even when their unit relationship is many-to-many.
- Procurement attention remains the existing submitted-request count; this is not presented as a generic approvals workflow. No project-by-unit metric is added because legacy `projects` has no Business Unit relationship.
- No route, schema, migration, permission, or role semantics were changed. The only backend change is a feature test file.

## Changed files

- `frontend/src/app/components/bms/dashboard/executive-dashboard.component.html` — scope label and functional unit-dashboard drilldown.
- `frontend/src/app/components/bms/dashboard/executive-dashboard.component.scss` — responsive context and drilldown styling.
- `frontend/src/app/components/bms/dashboard/executive-dashboard.component.ts` — applied-scope label and authorized lookup-based unit navigation.
- `frontend/src/app/components/bms/dashboard/executive-dashboard.util.ts` — scope-label helper.
- `frontend/src/app/components/bms/dashboard/executive-dashboard.util.spec.ts` — scope-label cases.
- `frontend/src/app/components/bms/bms-translations.ts` — English and Arabic labels.
- `backend/tests/Feature/BmsExecutiveDashboardTest.php` — organization data/shared-product uniqueness and unit-scope/cross-unit request coverage.

## Verification

- Frontend pure-TypeScript suite: **44 passed, 0 failed** (`npm run test:node`).
- Production frontend build: **passed** (`npm run build -- --configuration production`). Existing dependency/CSS compatibility warnings were emitted; there were no Angular compilation errors.
- `git diff --check`: **passed**.
- Local backend feature tests: **not run** because this workspace has no PHP binary, Composer vendor directory, or backend `.env`. GitHub CI did execute the backend SQLite and MySQL suites (158 tests each); both jobs failed on two existing `P17EmployeeManagementTest` employee-import cases. The focused BMS regression steps, PHP syntax/lint, and static analysis completed successfully. The failure annotations point to the employee-import assertions, not this dashboard test file.
- GitHub CI Angular/Karma: **failed** with 98 failures and 115 passes. The annotated failures are existing non-BMS component specs with missing TestBed providers (for example AngularFire options, `MatDialog`, `MatSnackBar`, or `Router`); no executive-dashboard component spec appears in the reported failures. Production build and local pure-TypeScript tests passed.
- Visual screenshots: **not captured**. The local workspace has no browser/screenshot runtime; CI's headless test browser did not produce dashboard screenshots. No mock screenshot is substituted for a real API-backed screen.
- No local production database was connected or queried. Backend CI uses the repository test harness and does not verify production records.

## Production blockers / decisions

1. Add or document an authoritative company-to-business-unit mapping before treating the global BMS unit scope as a tenant/organization boundary.
2. Confirm whether `Alpha Delta` belongs in the requested Alphaiota unit set and whether `G` is to be displayed as the existing `Alpha Gen` record. This demo preserves the current seed data and does not rename or omit an existing unit.
3. Run the new backend test and full BMS suite in PHP-capable CI; then verify with authorized production-like accounts and actual records.
4. Capture signed-in desktop/mobile and RTL/LTR browser screenshots against a controlled non-production dataset before production sign-off. No screenshot is claimed for this environment.
5. Continue to treat procurement Finance review and opportunity go/no-go as distinct workflows; no generic approval center is implied.
