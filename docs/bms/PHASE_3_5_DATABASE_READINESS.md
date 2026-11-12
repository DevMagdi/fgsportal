# BMS Phase 3.5 — Database, migration and integration readiness

**Starting SHA:** `ae790a960bf52cda08f0047a43de896ea0972145`
**Remediation source SHA:** record the exact tested SHA after candidate CI completes.
**Status:** Source audit and isolated test plan complete; fresh-install/deployed-schema rehearsal **BLOCKED / NOT PASSED**.

## Safety and scope

No production database was accessed. No credentials or production data were requested, copied, printed, or committed. No destructive database command was run: no `migrate:fresh`, `db:wipe`, `DROP`, `TRUNCATE`, rollback, or data deletion. CI SQLite/MySQL services are isolated test environments; they do not establish production schema equivalence.

## Source-level schema inventory (bounded)

| Tables / domain | Schema source | Important relations / evidence | Status |
|---|---|---|---|
| `users`, `user_details`, legacy departments/degrees/branches/products and portal tables | Historical 2022 migrations; notably `2022_08_30_900000_create_users_table.php`, `2022_08_30_256857_create_user_details_table.php`, `2022_08_30_231652_create_products_table.php` | Legacy portal schema predates BMS; `users.company_id` and `users.manager_id` are later additions. | No deployed schema comparison. |
| `companies`, `modules`, `company_modules` | `2026_10_20_000001` through `000013` | Company is connected to users by `users.company_id` and to modules by `company_modules`. | Source-reviewed only. |
| BMS organization, user roles, weekly plans, tasks, opportunities, product-unit pivots/phases | `2026_11_11_000001_create_bms_phase_one_tables.php` | Defines `business_units`, self-referential `parent_id`, `business_unit_user`, `bms_roles`, unit-scoped `bms_role_user`, `product_business_unit`, `weekly_plans`, `unit_tasks`, and other BMS tables. | Source-reviewed; no local schema runtime. |
| Meetings, leads, hiring, procurement, events, documents, KPIs, alerts and social metrics | `2026_11_11_000002_complete_bms_brd_tables.php` plus `000004`–`000011` | Defines meeting attendees and business workflows; subsequent additive migrations extend these tables. | Source-reviewed; deployed drift unknown. |
| Product metadata and employee manager metadata | `2026_11_12_000010_add_bms_admin_metadata.php`, `000011_add_missing_bms_kpi_metadata.php` | Adds nullable metadata used by product controller; manager field migration is present in BMS migration history. | CI test path exists; no full fresh-install rehearsal. |

This is not an exhaustive inventory of all legacy tables, deployed foreign keys, indexes, collations or manual schema changes. `BusinessUnit` has no Company relationship in its model. No checked-in migration creates `business_units.company_id` or a Company-to-BusinessUnit pivot. Employee import nevertheless conditionally filters unit names with that column. The contract document records the evidence and exact owner decisions needed. **No import query, schema or authorization change is made until that ownership contract is confirmed.**

## Isolated database plan

### Required stack

- PHP **8.1** with `mbstring`, `dom`, `curl`, `zip`, `pdo_sqlite`, `pdo_mysql` and Composer dependencies from `backend/composer.lock` (matches `.github/workflows/ci.yml`).
- MySQL **8.0** for engine-specific integration and an in-memory SQLite connection for the SQLite suite.
- Node **20** and npm dependencies from `frontend/package-lock.json` for CI parity. No Angular or dependency upgrade is part of this work.

### Environment variable names (values must remain private)

Read names from `backend/.env.example` and `backend/phpunit.mysql.xml`; do not expose secret values in logs/docs. For an isolated MySQL run, configure `APP_ENV`, `APP_KEY`, `JWT_SECRET`, `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`, `MAIL_MAILER=array`, `QUEUE_CONNECTION=sync`, `CACHE_DRIVER=array`, `SESSION_DRIVER=array`, `MODULES_FAIL_OPEN=false`, and relevant BMS policy variables such as `BMS_ADMIN_SUB_DEPARTMENT_IDS`. For SQLite, use the test connection/database configuration and keep foreign-key constraints enabled. Any credentials must be generated for the disposable environment and scoped to that database only.

### Migrations and seeders

The real application migration rehearsal must account for the full legacy migration chain before BMS migrations; the current feature harness is not a substitute. Inspect `php artisan migrate:status` and the target DB identity first. On a newly provisioned, explicitly disposable empty database only, apply the normal ordered migrations with `php artisan migrate --force`; capture output and post-migration table/column/index/foreign-key inventory. Seed only the required reference catalogue and BMS roles through the approved `DatabaseSeeder` chain (`ModulesTableSeeder`, `CompaniesTableSeeder`, `CompanyModulesTableSeeder`, `BmsPhaseOneSeeder`). Add synthetic test accounts/rows only inside that disposable database and only to exercise permissions. Never seed fixtures into production or a shared database.

### Test actors and permission data

Use isolated fixtures, not real account data: Company A and Company B; a global-scope administrator; a unit director assigned to one unit; an employee assigned to that unit; a second unit with an out-of-scope employee/manager; and explicitly assigned BMS roles/abilities. Verify persisted `company_id`, `business_unit_user` pivots and `bms_role_user.business_unit_id`. Do not bypass foreign keys or authorization to simplify setup.

### Safe validation sequence

1. Provision a new database with a unique, unmistakably disposable name and matching engine/collation. Its DB principal must not have access to production/shared schemas.
2. Before starting Laravel, check connection target and engine/version using `SELECT DATABASE()` and the server version; abort on any mismatch. Confirm `APP_ENV` and database name in process configuration without printing passwords.
3. Record `php artisan migrate:status`; verify target is empty or contains only the newly created schema. Never run `migrate:fresh` against an existing target. Apply the ordered migrations only after reconfirming the database identity.
4. Run approved seeders and focused tests. Capture HTTP status/body shape, DB rows, SQL engine/version, migration list, and user/unit/role setup. Redact secrets and personal data.
5. Exercise the actual Laravel route/middleware with local JWT-authenticated requests for dashboard defaults and filters, allowed unit, denied unit, global role, missing permission, shared Product, and no resolved unit. Compare real API structures/counts to fixtures; do not use intercepted/mock frontend responses as API evidence.
6. Preserve the disposable DB until evidence is reviewed, then destroy it only through the environment's explicit disposable-resource cleanup. Document cleanup separately; no rollback against a persistent DB.

## What CI does and does not validate

The backend PHPUnit feature tests issue requests through Laravel routes/middleware against isolated SQLite and MySQL test connections. They provide real application/database integration evidence for the tests that pass. `BmsTestCase` constructs a legacy-compatible subset schema, applies selected BMS migrations and seeds reference roles; this is **not** a complete empty-install migration rehearsal and is not a deployed-schema comparison. Browser dashboard evidence from prior QA used mocked API responses and is not live integration.

## Local execution result

**Fresh install and local API/database rehearsal: NOT EXECUTED / BLOCKED.** Local environment has no PHP executable, Composer vendor tree/PHPUnit, MySQL service, Docker executable, `.env`, or Chrome binary. `npm ci --legacy-peer-deps --no-audit --no-fund` succeeds; Node tests and production Angular build can run. Karma can compile its browser bundle but cannot start Chrome locally. No DB connection was configured or attempted.

## Gate

**Database and deployed-integration gate: BLOCKED / NOT PASSED.** No fresh install, deployed schema comparison, complete foreign-key/index inventory, or live local API + isolated DB dashboard rehearsal is claimed. Do not invent a Company-to-unit relationship, add a migration, or remove import scoping without the owner contract. CI engine-specific results are recorded in the test report.
