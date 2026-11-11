# BMS release notes

## Pre-deployment checklist

1. Export `bms_roles`, `bms_role_user`, units and module entitlements before deployment and retain a verified backup.
2. Compare current role abilities with `BmsPhaseOneSeeder::ROLES`. The seeder uses `updateOrCreate`, so it **overwrites abilities on existing roles**.
3. Operations gains `leads.view`, `leads.manage`, and `leads.convert`; Coordinator, Unit Director, Alpha Delta, Employee, HR, Finance, IT and PR & Marketing retain the abilities listed in the seeder. Any local customization to those roles is replaced on seeding.
4. Role assignments are not detached by the seeder. Preserve and verify `bms_role_user`, including unit-scoped assignments.
5. Run migrations, seed twice in staging, then run authorization and notification smoke tests before production.

## Verification status

The seeder idempotency/assignment-preservation test and continuation PHPUnit suite are written but not executed in this session: the fresh workspace has no `vendor/` and Composer release-asset delivery is blocked. This is not a passing-test claim.
