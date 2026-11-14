# Phase 2 – Stage B1 and B2 (organization structure backend, teams)

## B1 – database foundation

Additive migrations (`backend/database/migrations/2026_11_14_0000{12,13,14}_*`):

| Object | Purpose |
|---|---|
| `bms_teams`, `bms_team_user` | Teams of a business unit and their members; `bms_teams.lead_id` is the team lead |
| `bms_central_departments`, `bms_central_department_user` | Central departments, independent of the legacy `departments` tables |
| `bms_project_business_unit` | Project ↔ business unit links (no endpoint yet) |
| `business_units.development_manager_id` | Development manager of a unit (nullable) |
| `users.primary_business_unit_id`, `users.primary_central_department_id` | Primary assignment; must reference an actual membership |
| `bms_ability_migration_grants` | Ledger of the abilities migration `000013` granted, so its rollback removes only those |

Abilities: `teams.view`, `teams.manage`, `teams.manage_own`, `departments.view`, `departments.manage`,
`projects.view`, `projects.link`. Role `team_lead` (unit scoped). Roles holding `*` are never modified and
customized role abilities are kept: new abilities are appended only.

`App\Services\BMS\PrimaryAssignment` is the only writer of the primary assignment columns. `manager_id`
remains the administrative reporting line and is not used for any of the above.

## B2 – teams and development manager

No schema change. All rules live in `App\Services\BMS\TeamStructure`.

| Route (prefix `api/bms`) | Ability |
|---|---|
| `GET teams` (`business_unit_id`, `active`), `GET teams/{team}` | `teams.view` |
| `POST teams`, `PUT teams/{team}`, `DELETE teams/{team}`, `PUT teams/{team}/lead` | `teams.manage` |
| `PUT teams/{team}/members` | `teams.manage`, or `teams.manage_own` for the lead of that team |
| `PUT units/{unit}/development-manager` | `teams.manage` |

Rules:

- The route ability is not sufficient: the role that grants it must be unscoped or scoped to the team's
  unit, and the unit must be inside the account's unit scope. `GET units/{unit}` reports this as
  `can_manage_teams`; each team reports `can_manage` and `can_manage_members`.
- Team members, the team lead and the development manager must be current members of the unit (422).
  Team operations never add unit membership and never touch the primary assignment or `manager_id`.
- A team never moves to another unit. Team names are unique inside a unit.
- The lead is always a member of the team. A former lead stays a member.
- The unit-scoped `team_lead` role is granted while a person leads at least one team of the unit and
  revoked when they lead none.
- When a person leaves a unit, their primary assignment to it is cleared (B1) and they leave its teams,
  stop leading them and stop being its development manager. Nobody is promoted in their place.
- A unit that still has teams cannot be deleted (422).
- Audit events: `team.created`, `team.updated`, `team.members_updated`, `team.lead_assigned`,
  `team.lead_removed`, `team.deleted`, `unit.development_manager_assigned`,
  `unit.development_manager_removed`, `role.assigned`, `role.revoked`.

Frontend: the business unit page shows a Teams section (`app-unit-teams`) for accounts with `teams.view`.

## Verification status

- Backend suite on SQLite (in-memory): 203 tests, 2 failures, both pre-existing in
  `P17EmployeeManagementTest` (import preview P19, P20).
- **MySQL 8 has not been run.** Not exercised: the `information_schema` checks and constraint repair in
  `000012`, conditional drops in `down()`, row locks and deadlock retry, the ledger DDL, the JSON ability
  merge, the B2 locking queries. Run `vendor/bin/phpunit -c phpunit.mysql.xml` and
  `migrate` → `migrate:rollback` → `migrate` on a MySQL 8 copy before production.

## Known limits

- Orphan cleanup (`clearOrphans`, `releaseOrphans`) runs after the membership change is committed in
  `BusinessUnitController::update`; a concurrent request can observe the intermediate state.
- `EmployeeController::update` lock order may deadlock on InnoDB (the transaction rolls back).
- Rolling back `000013` also removes a ledgered ability that an administrator later re-granted by hand.
- Not built yet: central departments API and UI, primary assignment endpoints, project ↔ unit links.
