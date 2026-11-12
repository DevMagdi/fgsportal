# BMS Phase 3.5 — Database and migration readiness

**Starting SHA:** `ae790a960bf52cda08f0047a43de896ea0972145`  
**Candidate SHA:** `7de9f0479c75269c658bf80772e2ddd343fe29c9`  
**Status:** Partial source audit; fresh-environment readiness **BLOCKED / NOT PASSED**.

## Safety

No production database was accessed. No credentials were requested, copied, or printed. No destructive database command was run: no `migrate:fresh`, `db:wipe`, `DROP`, `TRUNCATE`, or rollback. CI uses isolated SQLite and MySQL test services; those are not production verification.

## Source-level schema inventory (bounded)

| Tables / domain | Schema source | Important relations / evidence | Status |
|---|---|---|---|
| `users`, `user_details`, legacy departments/degrees/branches/products and portal tables | Numerous 2022 migrations; notably `2022_08_30_900000_create_users_table.php`, `2022_08_30_256857_create_user_details_table.php`, `2022_08_30_231652_create_products_table.php` | Legacy portal data/schema predates BMS; `users.company_id` and `users.manager_id` are later additions. | No deployed schema comparison. |
| `companies`, `modules`, `company_modules`, partner/CRM tables | `2026_10_20_000001` through `000013` | Company module entitlements reference companies/modules; company_id is added to users. | Source-reviewed only. |
| BMS organization, weekly plans, tasks, support requests, opportunities, roles, product-unit pivots/phases | `2026_11_11_000001_create_bms_phase_one_tables.php` | Includes `business_units`, `business_unit_user`, `bms_roles`, `bms_role_user`, `weekly_plans`, `unit_tasks`, `support_requests`, `bms_opportunities`, `product_business_unit`, `product_phases`. | Source-reviewed; no local schema runtime. |
| Meetings, leads, hiring, procurement, events, docs, KPI/alerts/social | `2026_11_11_000002_complete_bms_brd_tables.php` plus `000004`–`000011` | Adds meeting attendee/response metadata, procurement and KPI tables; subsequent additive migrations modify these tables. | Source-reviewed; exact deployed drift unknown. |
| Dashboard product metadata and employee manager metadata | `2026_11_12_000010_add_bms_admin_metadata.php`, `000011_add_missing_bms_kpi_metadata.php` | Metadata migrations contain schema-existence guards; controller relies on product `description`/`owner_id` and user `manager_id`. | CI migration/test path exists; no fresh-install rehearsal here. |

This inventory is not exhaustive for all historical portal tables or deployed indexes/constraints. `BusinessUnit` model has no `company_id` in its fillable definition, and no migration found in the checked-in migration set adds `business_units.company_id`. Employee import conditionally filters units by that column when the authenticated user's company_id is truthy. MySQL diagnostics identify import 500s and Gitar reports an unknown `company_id` column; the full query must be captured to prove the path. **Do not add a migration or remove tenant filtering until the intended company-to-unit ownership contract is confirmed.**

## Migration safety findings

- Historical migration filenames show duplicate create variants (`password_resets`, public requests, tickets, etc.) and assumptions about legacy tables. A clean rebuild may depend on ordering and conditional migration behavior; this was not exercised.
- `2026_11_11_000002_complete_bms_brd_tables.php::down()` removes columns from existing tables and drops many BMS tables. That rollback is data-destructive. Do not execute it against a live or valuable database; deployment needs an approved backup/restore plan and migration-specific rollback review.
- `2026_11_12_000010_add_bms_admin_metadata.php::down()` drops metadata columns; it can destroy values written since deployment. No rollback was attempted.
- Some metadata additions are guarded with `Schema::hasColumn`; this can tolerate certain drift, but does not prove schema equivalence or safe rollback.
- No migration was introduced in this stabilization change.

## Fresh environment result

**NOT EXECUTED locally / BLOCKED.** Local checkout has no PHP executable, no `backend/vendor/bin/phpunit`, and no `backend/.env` (only `.env.example`). No disposable local MySQL service or schema snapshot was supplied. CI exercises isolated framework tests on SQLite and MySQL 8, but it is not a fresh deployment rehearsal and does not establish that all legacy production tables can be recreated. No production credentials were requested.

Required safe follow-up: provision an explicitly disposable database, confirm no production connection string is present, then follow a documented install process with reversible, non-destructive provisioning. Capture engine versions, migration/seeder output, resulting table/column/index list, and differences. Stop if legacy tables or manual steps are undocumented; never substitute `migrate:fresh` on a non-disposable database.

## Gate

**Database gate: BLOCKED / NOT PASSED.** No verified fresh deployment, deployed-schema comparison, full table/foreign-key/index inventory, or tenant mapping for business units. Data-destroying rollback risk is documented; no destructive operation was run.