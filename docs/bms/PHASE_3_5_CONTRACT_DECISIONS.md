# BMS Phase 3.5 — Contract resolutions and owner decisions

**Branch:** `arena/e1389d1e-fgsportal`; PR #26 remains open against `BMS`.  
**Latest tested source SHA:** `15c8bf295ff3c44a171800b61bb5441ddca979c2`; latest CI [43318197656](https://github.com/DevMagdi/fgsportal/actions/runs/43318197656) failed.
**Scope:** evidence-backed resolution only; no Phase 4 work.

## Confirmed contracts

### 1. Company, user and business-unit relationships

```text
Company 1 ─────── 0..N User
   │                 │
   │                 └──── M:N ──── BusinessUnit
   │                         business_unit_user
   │
   └──── M:N ──── Module
        company_modules

BusinessUnit 1 ─── 0..N child BusinessUnit (parent_id)
Product M:N BusinessUnit (product_business_unit)
BmsRole M:N User, optionally scoped to a BusinessUnit (bms_role_user.business_unit_id)
```

Evidence:

- `backend/app/Models/Company.php`: `Company::users()` uses `users.company_id`; module entitlements use `company_modules`.
- `backend/app/Models/User.php`: `company()` belongs to Company; `businessUnits()` is many-to-many through Laravel's `business_unit_user` pivot.
- `backend/app/Models/BMS/BusinessUnit.php`: self-referential parent/children, director and user pivot; it defines no Company relation.
- `backend/database/migrations/2026_10_20_000001_create_companies_table.php` creates Company; `2026_10_20_000002_add_company_id_to_users_table.php` adds nullable `users.company_id` (index, deliberately no FK in this legacy migration); `2026_10_20_000004_create_company_modules_table.php` links companies and modules.
- `backend/database/migrations/2026_11_11_000001_create_bms_phase_one_tables.php` creates `business_units`, its self-FK `parent_id`, `business_unit_user`, and `product_business_unit`. It does not define `business_units.company_id` or a Company-to-BusinessUnit pivot. No later checked-in migration adds either.

**Confirmed:** Company is the tenant for users and module entitlement. BMS unit access is resolved through user-unit assignments/directorship and BMS roles. **Not established:** a Company-to-BusinessUnit ownership relation.

Employee import currently filters the unit-name lookup by `business_units.company_id` when the importing user has a `company_id`, then applies `EmployeeController::authorizeUnits()`. On a successful write it sets the new User's `company_id` from the actor. The first predicate assumes an ownership relation absent from the checked-in model/schema; removing it would also be a tenant/access-policy change. Therefore the import query/schema/auth behavior is **left unchanged and blocked**.

`BmsAccess::visibleUnitIds()` returns `null` for the configured global-scope roles in `BmsAccess::GLOBAL_SCOPE_ROLE_SLUGS` (`system_admin`, `executive`, `coordinator`, `operations`, `pr_marketing`, `hr`, `finance`, `it`); other users are scoped to assigned units and units they direct. `authorizeUnits()` rejects any requested unit outside this set. This is BMS unit authorization, separate from the Company module-entitlement relationship.

**Minimum owner input needed to unblock import:**

1. A statement of whether a Company owns one/many Business Units, units may be shared by Companies, or Company has no ownership relationship to units.
2. The authoritative source for that mapping (including any deployed-only table/column and its cardinality/foreign keys), if one exists. Provide a sanitized schema excerpt; do not send data or secrets.
3. Rules for legacy users with null `company_id`, global-scope importers, and existing employees whose Company differs from the importer's.
4. The required treatment of a unit name that exists in another company or is shared across companies (reject, permit by unit authorization, or another explicit rule).

Consequences: if Company owns units, a verified mapping is needed before import can securely filter. If units are shared/global, a Company predicate is invalid and a different approved import rule is needed. If Company is only a module-entitlement tenant, import can only scope units by BMS authorization—but removing the current predicate still requires owner approval because it changes tenant isolation semantics.

### 2. Manager assignment

`EmployeeController::validatedManagerId()` rejects self-reference, cross-company assignment when both company IDs are populated, managers outside a restricted actor's visible units, and cycles. Same-company visible assignment and explicit `null` clearing are supported. The manager ID is persisted after validation because `User::$fillable` intentionally excludes it. The corrected regression fixture creates two persisted Company rows and reaches the endpoint for a Company A employee and Company B manager; authorization behavior is not changed.

### 3. Core module flags

The product contract represented in code is that both the platform `core` module and BMS product capability are core. `ModulesTableSeeder` documents BMS as the product itself; migration `2026_11_12_000009_make_bms_a_core_capability.php` marks existing BMS catalogue rows core; `ModuleService` treats all `is_core` modules as always enabled; `ModuleManagementEndpointsTest` expects BMS to be core. The stale `ModulesTableSeederTest` expectation that BMS must not be core contradicted these definitions. The test is corrected to assert both core flags and that all other catalogue modules remain non-core/active; an idempotency/duplicate-catalogue regression is added. Seeder behavior and production data are not changed.

### 4. Meeting attendee update contract

`MeetingController::attendees()` validates an optional array (up to 100), existing internal `user_id`s and optional external name/email. It has no `distinct` validation rule. During update, identity is the internal user ID or case-folded external email; `keyBy` already represented duplicate identities as one item (last row wins). Empty attendee arrays are accepted and mean remove all; omitting the `attendees` key leaves the attendee set unchanged.

The established synchronization behavior is retained: keep rows and attendee responses for identities that remain, remove missing identities and send them `CANCEL`, add new identities and send them `REQUEST`; when a meeting is rescheduled, existing attendees receive the existing reschedule request. Unchanged identities are no longer written just to refresh timestamps. Meeting fields, attendee diff and audit record now commit together; email delivery is performed only after commit so a database failure cannot send invitations for rolled-back state. Invitation delivery failures retain the existing per-recipient handling in `MeetingInvitations`.

Duplicate submissions are accepted by the current validation contract and collapse by the existing identity key; they are not newly rejected. Regression tests cover add, remove, unchanged, mixed operations, empty list and duplicate identity submissions.

## Unresolved security/business contract: shared Product activity

A Product may be associated with multiple Business Units through `product_business_unit`. The audit record stores `auditable_type`, `auditable_id`, event and user, but does not store the originating unit. `ExecutiveDashboardController::recentActivity()` resolves a Product's current unit associations; restricted viewers see it when an associated unit intersects their allowed units and selected-unit filters; a global-scope viewer sees all records whose unit scope can be resolved. Unitless/unresolvable events are omitted (fail closed). Product association changes can therefore change the unit set used to classify older Product events.

No new visibility policy is implemented. Keep the existing behavior pending the product/security owner's explicit choice:

| Option | Confidentiality and dashboard impact | Existing/global behavior | Data/query impact | Required regressions |
|---|---|---|---|---|
| **A. Product event visible to every unit currently associated with that Product** | Convenient for shared work; every associated unit learns the event, potentially exposing another unit's activity. | This is closest to current behavior for restricted users. Global users continue to see all in-scope/resolvable activity. Historical scope follows current associations. | No required schema change; document dynamic historical semantics and retain relation-based query. | Shared-product actor event visible to each associated unit; absent to unrelated unit; selected-unit filter; association add/remove behavior; global viewer; unitless fail-closed. |
| **B. Visible only to the originating unit** | Strongest unit confidentiality and stable attribution. Other associated units do not see the event. | Not implemented; global-role behavior would still be an explicit policy (typically all units). | Requires an immutable origin-unit snapshot on the audit event or equivalent link; query must use that snapshot, not current Product associations. Migration/data backfill is a separate decision. | Origin unit sees; other associated and unrelated units do not; association change does not retarget history; global and selected-unit filters. |
| **C. Visibility by event type or explicit event access scope** | Can match different confidentiality requirements, but policy is more complex and easier to misconfigure. | Not implemented; global access and default scope need explicit definition. | Requires event-level scope metadata or an event-to-unit access relation, policy mapping, and query enforcement. | Matrix by event type and unit role; shared/unrelated units; missing/unknown scope fail-closed; selected-unit/global behavior; migration/backfill. |

**Owner decision required:** choose A, B or C; define the global-user rule; define behavior when product-unit associations change; and identify event categories that may disclose confidential data. Until then, no change to audit disclosure queries or schema.

## Local integration and environment decision

Repository CI specifies PHP 8.1, MySQL 8.0, SQLite, Node 20 and locked Composer/npm dependencies. The local checkout has no PHP, Composer vendor tree, MySQL service, Docker executable or Chrome binary. The frontend production build and Node suite can run after `npm ci`; Karma browser execution is blocked locally by absent Chrome. No fresh install or real local API/database rehearsal was attempted. See `PHASE_3_5_DATABASE_READINESS.md` for the isolated test plan and exact blocker status.

**Current disposition:** contract decisions above are evidence-resolved where stated; Company-to-BusinessUnit and Product-event visibility remain blocked for owner input. CI 43318197656 still shows two import failures on both engines; focused meeting/manager/module regressions pass, but these results do not approve a tenant policy. Phase 3.5 remains **NOT PASSED** until required tests and integration/security gates are accepted or resolved. PR #26 stays open; Phase 4 does not start.
