# Database, authentication, and authorization audit

**Audit basis:** source at `11d6b1e3394e4f31aa97340b732a6470382343e7`, branch `arena/bce4bcc3-fgsportal`. No database connection, dump, production environment, or runtime dependencies were available. Statements about live schema/records are therefore explicitly **UNVERIFIED**.

## 1. Database evidence and limits

### Migrations and authoritative schema assets

There are 124 files under `backend/database/migrations`. BMS schema is introduced principally by:

- `backend/database/migrations/2026_11_11_000001_create_bms_phase_one_tables.php`
- `backend/database/migrations/2026_11_11_000002_complete_bms_brd_tables.php`
- `backend/database/migrations/2026_11_11_000003_use_configured_opportunity_currency_default.php`
- `backend/database/migrations/2026_11_11_000004_add_meeting_response_timestamps.php`
- `backend/database/migrations/2026_11_11_000005_add_alert_renotification_policy.php`
- `backend/database/migrations/2026_11_11_000006_create_bms_notifications_table.php`
- `backend/database/migrations/2026_11_12_000007_add_bms_completion_columns.php`
- `backend/database/migrations/2026_11_12_000008_add_bms_meeting_sequence.php`
- `backend/database/migrations/2026_11_12_000009_make_bms_a_core_capability.php`
- `backend/database/migrations/2026_11_12_000010_add_bms_admin_metadata.php`
- `backend/database/migrations/2026_11_12_000011_add_missing_bms_kpi_metadata.php`

Core BMS tables represented in these migrations include `business_units`, `business_unit_user`, `bms_roles`, `bms_role_user`, `weekly_plans`, `unit_tasks`, `support_requests`, `bms_opportunities`, `bms_opportunity_stage_histories`, `product_business_unit`, `product_phases`, `bms_audit_logs`, meetings/attendees/minutes, leads/interactions/study items, hiring/candidates/onboarding, procurement/quotations, events/checklists/procedures, documents, certificates, KPIs, social metrics, alerts and notifications. Legacy `users`, `products`, `departments`, CRM and old project/HR entities are also referenced.

**Migration completeness risk:** root `README.md` explicitly says the historical codebase contains migrations for only part of the schema, that many feature tables were created directly in deployed DBs, and that a schema dump from an existing environment is needed for full feature support. Thus a clean migration cannot be assumed to reproduce a deployed database. Production migration list, constraints, indexes, engine/version, and installed data are **UNVERIFIED**.

### Relationships and constraints actually visible in BMS migrations

- `business_units.parent_id` self-FK, nullable/null-on-delete; `director_id` references `users` and nulls on delete. Names and slugs are unique. Soft deletes and `is_active` are present.
- `business_unit_user` uniquely constrains `(business_unit_id,user_id)` and cascades on hard deletion of either endpoint.
- `bms_role_user` links user/role/optional unit with unique composite key and cascade FKs. Nullable `business_unit_id` means global assignment.
- `weekly_plans` belongs to a unit and is unique per `(business_unit_id,week_start)`; `unit_tasks` link to plan, unit and optional owner; support requests reference unit, department and requesting user.
- `bms_opportunities` has unique reference, optional unit/product/owner/lead, soft deletes, stage/update index; stage history cascades with opportunity. A later migration adds nullable `bms_lead_id` and index but no FK is declared in that migration.
- Meeting start/end index, invitation token unique constraint, one minutes record per meeting, product phase sequence uniqueness, document version index, KPI period index and alert recipient uniqueness are visible in the schema files.

These are source definitions only. Actual foreign-key enforcement/indexes on existing databases are **UNVERIFIED**.

### Data deletion and seeding

- `BusinessUnitController::destroy` uses soft deletion (`BusinessUnit` has `SoftDeletes`) and checks children, weekly plans, tasks, opportunities, leads, product assignments, meetings, membership, certificates. It returns 422 with “Deactivate it instead” when those enumerated dependencies exist.
- Several BMS FKs use cascade on hard delete. Direct database deletion or a later hard-delete path would therefore be destructive; preserve soft-delete/deactivation and verify all references before deletion. Dependency enumeration can become stale if a new relation is added.
- `DatabaseSeeder` calls `BmsPhaseOneSeeder`. That seeder `updateOrCreate`s Alpha Iota and four child units, creates/updates role definitions and pipeline stages, and `firstOrCreate`s Kraken/Argus products. These are observed seeded fixtures/business records. Whether deployed copies are demo records is **UNVERIFIED**; never clean up by name.
- No `migrate:fresh`, `db:wipe`, `DROP`, `TRUNCATE`, or broad data deletion was performed.

## 2. Authentication and entitlement path

1. Angular `AuthApiService` authenticates against `/api/users/login` and persists the returned user/token state; JWT handling is in `backend/config/auth.php` and `JwtMiddleware` (`backend/app/Http/Middleware/JwtMiddleware.php`).
2. BMS lazy entry is `/bms` in `frontend/src/app/app-routing.module.ts`, guarded by `AuthGuardService`. `bms.module.ts` individual routes add `BmsPermissionGuard` with ability metadata.
3. BMS HTTP requests are built by `frontend/src/app/components/bms/bms-api.service.ts` as `${environment.newServerApi}/api/bms/...` with bearer JWT from local storage.
4. Laravel `backend/routes/api.php` groups `/bms` under `cors`, `jwt.verify`, and `module:bms`. Each business route adds `bms.permission:<ability>`, except explicitly enumerated auth-only routes in `BmsRouteSafetyTest`.
5. `BmsPermission` calls `BmsAccess::authorize`; `BmsAccess::can` checks seeded role ability arrays, with a legacy Administration/Management special rule for `roles.manage`.

`BmsRouteSafetyTest::test_A3_every_bms_route_has_authentication_entitlement_and_permission` asserts middleware presence on every BMS route. The test exists but was not executed here.

## 3. BMS permission model and unit scope

- Roles: `bms_roles` rows define `slug` and JSON `abilities`; assignments live in `bms_role_user` with optional unit ID. `BmsPhaseOneSeeder::ROLES` defines the role matrix, including `system_admin` (`*`), executive, coordinator, operations, unit_director, department_manager, alpha_delta, PR/Marketing, Finance, HR, IT, Employee.
- `BmsAccess::visibleUnitIds()` returns `null` for configured global-scope roles and otherwise combines unit membership with units where user is director. `authorizeUnit` blocks access to out-of-scope unit IDs.
- Global-scope role slugs are hard-coded in `BmsAccess::GLOBAL_SCOPE_ROLE_SLUGS` (system_admin, executive, coordinator, operations, pr_marketing, hr, finance, it). Unit director is not in this list and obtains scope from unit membership/directorship. A user holding any global-scope role sees all units regardless of a unit-valued pivot; adding a role to this list materially widens data visibility.
- `LookupController` scopes units, users, products, leads and opportunities based on `visibleUnitIds`, with role-gated data. `EmployeeController` scopes directory reads and employee mutation. Plan, task, opportunity and dashboard controllers repeat resource-level unit checks/filters; this is important because UI guards alone are not authorization.
- Role grant/revoke rules in `BmsAccess::authorizeRoleChange`: require role-management capability; only Administration may grant/revoke `system_admin`; restricted managers cannot grant global-scope or role-management roles; unit assignments must be inside actor scope; target must belong to assigned unit; restricted revocations require target scope. `LookupController::assignRole/revokeRole` audits changes, and assignment/audit reads are scoped.
- `BmsAudit` persists auditable event records in `bms_audit_logs`; the role audit endpoint is `GET /bms/audit/role-changes`.

### Permission risks / unverified points

1. **Legacy/global unit scope is role-slug based:** any role in `GLOBAL_SCOPE_ROLE_SLUGS` yields company-wide unit scope. Changes to seeded abilities/slugs or this constant must be security-reviewed and regression-tested.
2. **Admin meaning relies on numeric sub-department IDs:** `config/bms.php` defaults `admin_sub_department_ids` to `[1,4]`. Whether deployed IDs refer to the expected Management/Administration teams is **UNVERIFIED** and must be checked against the real DB. Avoid relying on integer labels without deployment validation.
3. **Role definitions are static in UI:** assignments are implemented; arbitrary ability/role editing is not evidenced. Do not conflate “assign roles” with “edit permissions.”
4. **Membership/director synchronization:** unit save synchronizes the users pivot; assigning a director adds membership and a unit-scoped director role. The inspected method does not visibly remove the previous director’s old role or membership when director changes, nor revoke role assignments when a member is removed. Confirm intended lifecycle and test before changing.
5. **Some lookups use legacy tables:** `LookupController` reads departments/work degrees/products and `EmployeeController` reads `users`/`user_details`. The deployed schema varies; unavailable tables or renamed columns can break BMS. The test harness builds synthetic legacy tables and is not a production schema check.
6. **Request-by-request direct API bypass:** route protection is extensively declared and route-safety tests exist, but an actual test run/security test against a populated multi-unit DB was unavailable. Specific sensitive file-download and public meeting response paths must remain covered.
7. **Company tenancy vs BMS units:** legacy module entitlement uses `users.company_id`, but BMS unit records do not visibly carry company_id in the core unit migration. Whether multiple companies share the same BMS database and how BMS unit ownership is partitioned is **UNVERIFIED**. Do not assume tenant boundaries are enforced by BMS unit scoping.

## 4. API / controller / service conventions

BMS controllers inherit `BmsController` for common `ok(...)` response envelope, authorization/audit dependencies; `BmsApiService` extracts `response.data`. `BmsAccess` centralizes abilities and unit scope. Most domain validation and persistence is in controller methods; dedicated BMS services are `BmsAudit`, `BmsNotifier`, `MeetingInvitations`, `OpportunityAlertService`, `EmployeeTaskRollup`, `SafeFilename`. There is not a pervasive dedicated service/repository layer for each workflow. Laravel validation generally uses `$request->validate`; test coverage includes validation/error cases. `backend/app/Exceptions/Handler.php` and `ResponseApi` should be reviewed in later API-wide standardization; this audit did not observe all non-BMS error responses at runtime.

## 5. Verification needed before changes that touch DB or permissions

1. Provision PHP/Composer and install locked dependencies; run migrations in a disposable database with the actual target engine/version, then run the backend suite.
2. Obtain a schema-only dump and migration history from the intended deployment; compare every BMS model query, relationship and migration. Do not use production data for a destructive test.
3. For data validation, use an authorized, privacy-safe snapshot and explicit expected records; reconcile counts and representative unit/role associations.
4. Confirm deployed department/sub-department IDs and company tenancy assumptions.
5. Add regression coverage before any role, unit-membership, archival, or migration change. Test authorized and unauthorized API calls, including cross-unit IDs and file downloads.
