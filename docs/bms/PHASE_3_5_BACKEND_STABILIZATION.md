# BMS Phase 3.5 — Backend stabilization

**Starting SHA:** `ae790a960bf52cda08f0047a43de896ea0972145`  
**Candidate SHA:** `7de9f0479c75269c658bf80772e2ddd343fe29c9`  
**Latest CI during preparation:** 43300908597 (in progress at last observation; final result belongs in the test report).

## Confirmed root causes and bounded fixes

### P18 product metadata (previously 1 error)

- Test: `P17EmployeeManagementTest::test_P18_product_metadata_owner_and_phase_reordering`.
- Failure: reading `description` from the product create response raised `Undefined array key "description"`.
- Evidence: controller validates `description`/`owner_id`, and migration `2026_11_12_000010_add_bms_admin_metadata.php` adds nullable product columns. `Product::$fillable` contains only `product_name`, so Eloquent silently discarded the validated optional fields supplied to `Product::create` and `update`.
- Fix: create using only `product_name`, then assign only the validated `description` and `owner_id` directly; update does the same for its validated non-null allow-listed fields. This avoids widening global mass-assignment permissions. Existing assertions cover response metadata and phase reorder. Candidate native PHP lint and focused P18/full-suite results await CI; local PHP is absent.

### P18/P19 manager persistence (previously two null-ID failures)

- Tests: `test_P18_employee_manager_reporting_line_is_stored_and_self_reference_rejected`; `test_P19_manager_assignment_blocks_cycles_cross_company_and_out_of_scope_managers`.
- Failure: expected manager ID 2, received null.
- Evidence: `EmployeeController::store` calls `validatedManagerId` (which rejects self/cycles and checks company/unit visibility) and puts the result into `User::create`; the legacy `User::$fillable` excludes `manager_id`, so the ID was silently discarded. The `manager_id` migration exists and response serialization reads it.
- Fix: after create, assign the validated ID directly only when the column exists in the filtered attribute set; this retains all previous validation and does not add `manager_id` to global `$fillable`. Candidate CI regression results await run 43300908597.

## Remaining backend failures / classification

| Test | Latest known failure | Root cause / Phase relation | Decision |
|---|---|---|---|
| `ModulesTableSeederTest::test_only_the_core_module_is_flagged_as_core` | `bms must not be core` | Seeder currently marks BMS core; test expectation and product's core-module policy conflict. Pre-existing. | Do not change core-module semantics without product approval. |
| `P16MeetingsTest::test_P1_6_attendee_diff_cancels_removed_and_invites_only_added` | HTTP 500; `Collection::intersectKeys` undefined at `MeetingController::syncAttendees` | Concrete legacy API misuse; unrelated to Phase 3 dashboard. | Not changed in this bounded pass; requires focused meeting workflow change/approval. |
| `P17EmployeeManagementTest::test_P19_employee_import_preview_is_read_only_and_reports_duplicates` | SQLite expected valid row count 1, got 0; MySQL HTTP 500 | Import resolves business units conditionally using `business_units.company_id`; no such column appears in repository migrations/model. MySQL annotations identify response 500, reviewer reports unknown column. | High-risk tenant mapping ambiguity. Do not add schema or remove filtering until company-to-unit contract is confirmed. |
| `P17EmployeeManagementTest::test_P20_import_rejects_duplicates_inside_the_uploaded_file` | SQLite expected valid count 1, got 0; MySQL HTTP 500 | Likely shares the import lookup failure; exact SQL for each 500 needs the full MySQL response, not merely the failed assertion. | Not claimed fixed; validate after schema/tenant contract decision. |

The manager persistence failures may be resolved by the candidate change, but only the new CI run can verify. The remaining meeting and module tests predate the dashboard changes and were not modified. Do not treat “pre-existing” as production acceptance.

## Phase 3 regression list

The previous CI run on the pre-fix candidate passed native PHP lint and individual P22, P18 dashboard aggregate, P19 activity authorization, P20 activity missing/deleted, P20 dashboard summary and P1.1 tests. On `7de9f04`, PHP runtime is unavailable locally; these exact steps are running in CI 43300908597. No pass is claimed until that run completes. Relevant test names are specified in `.github/workflows/ci.yml`; no exclusions are used.

## Gate status

Backend gate is **PENDING CI, then NOT PASSED unless all required suites pass**. PHP native validation is not available locally. The import schema/security decision and unrelated legacy failures remain unresolved. No database migration or auth semantic change was made.