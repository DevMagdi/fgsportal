# Phase 3 — Test and verification report

**Date:** 2026-11-12 (UTC)
**Branch / PR:** `arena/e1389d1e-fgsportal` / [#26](https://github.com/DevMagdi/fgsportal/pull/26), base `BMS`
**Validated commit:** `0a756586624079905544a458607462a74fdc11b7`
**Scope:** Phase 3 only. No checks were skipped or disabled. Browser API responses are intercepted synthetic fixtures, not live backend data.

## Final CI run — 43297021468

Run URL: https://github.com/DevMagdi/fgsportal/actions/runs/43297021468. Run conclusion: **failure**. The worktree changes were not merged; PR #26 remains open.

| Check | Result | Evidence / details |
|---|---|---|
| Native PHP syntax check for every Phase 3 PHP change | **PASS** | CI step `Native syntax check for Phase 3 PHP changes` succeeded. |
| Focused P22 selected-unit regression | **PASS** | CI step succeeded. |
| P18 dashboard aggregate, P19 activity authorization, P20 deleted/missing model and dashboard-filter, P1.1 dashboard-card regressions | **PASS** | Each individual CI regression step succeeded. P18/P19 fixture changes now create and assert the intended audit events, including cross-unit non-leakage. |
| Full backend PHPUnit, SQLite | **FAIL** | 150 tests, 1 error, 6 failures (1085 assertions). No tests were excluded. The lone error is `P17EmployeeManagementTest::test_P18_product_metadata_owner_and_phase_reordering` — `ErrorException: Undefined array key "description"`. Six failing test names and assertion/error text are compared with Phase 2 below. |
| Full backend PHPUnit, MySQL 8 | **FAIL** | 150 tests, 1 error, 6 failures (1082 assertions). Same six failing test names as the SQLite run; see details below. The same P18 product-metadata error remains. |
| Backend `composer lint` / `composer analyse` workflow steps | **Reported success by CI**, but both are configured `continue-on-error` | The check annotations include exit-code diagnostics and static-type findings on `BusinessUnitController` (`BusinessUnit::find/create` and `$id`). Their non-blocking step conclusion is not treated as proof those diagnostics are clean. Native PHP syntax validation above did pass. |
| Frontend Karma / Angular suite | **FAIL** | CI test step failed; local full run executed 211 specs: 76 passed, 135 failed. Phase 2 and Phase 3 failure-label multisets are identical: 135 occurrences / 134 unique labels; no newly failing or resolved labels. |
| Frontend Node tests | **PASS locally** | `npm run test:node`: 42/42 pass. |
| Frontend production build | **PASS locally; CI build skipped** | `npm run build -- --configuration production` succeeded locally, hash `79b2571d10234099`. CI's production build step was skipped because Karma failed first. Existing Autoprefixer/CommonJS warnings remain. |
| Frontend lint | **UNAVAILABLE locally / non-gating in CI** | Local `npm run lint` reports no Angular `lint` target. CI marks its lint step `continue-on-error`; no passing lint gate is claimed. |
| `git diff --check` | **PASS** | Passed before the final workflow diagnostics commit. |

### Backend comparison with the Phase 2 baseline

The recorded Phase 2 baseline is **149 tests, 5 errors, 6 failures**. The final CI suite runs 150 tests (one additional test in the current source). Against the Phase 2 result, the current SQLite run has **four fewer errors** (one remains) and the **same six failures**. The same remaining error is `test_P18_product_metadata_owner_and_phase_reordering`, with the same `Undefined array key "description"` message.

The pre-final full-suite comparator (run 43289133463) exposed named fixture/setup errors for `test_P18_dashboard_reports_pending_procurement_upcoming_meetings_and_overdue_tasks`, `test_P19_recent_activity_never_leaks_other_units_records`, and `test_P20_recent_activity_separates_ids_shared_across_model_types_and_handles_deleted_records`; those no longer occur after the procurement/activity fixture fixes. The recorded Phase 2 count delta is five errors to one, but its retained test-log annotation is truncated during the error section, so it does not preserve all five error labels. We therefore report the exact count reduction and named resolved cases visible in the retained evidence without inventing a complete one-to-one list. The remaining product-metadata error is identical by test name and message.

The six remaining failure names are unchanged from the Phase 2 baseline:

1. `ModulesTableSeederTest::test_only_the_core_module_is_flagged_as_core` — `bms must not be core` (assertion: true is false).
2. `P16MeetingsTest::test_P1_6_attendee_diff_cancels_removed_and_invites_only_added` — expected HTTP 200, received 500; `Collection::intersectKeys` is undefined.
3. `P17EmployeeManagementTest::test_P18_employee_manager_reporting_line_is_stored_and_self_reference_rejected` — expected manager id 2, got null.
4. `P17EmployeeManagementTest::test_P19_manager_assignment_blocks_cycles_cross_company_and_out_of_scope_managers` — expected manager id 2, got null.
5. `P17EmployeeManagementTest::test_P19_employee_import_preview_is_read_only_and_reports_duplicates` — SQLite: expected 1, got 0; MySQL: expected HTTP 200, received 500.
6. `P17EmployeeManagementTest::test_P20_import_rejects_duplicates_inside_the_uploaded_file` — SQLite: expected 1, got 0; MySQL: expected HTTP 200, received 500.

The individual labels and assertion/error messages above were compared with the Phase 2 CI baseline annotations. The final workflow now emits test-name diagnostics and engine summaries so SQLite/MySQL output is independently reviewable. These failures are not hidden or treated as passes.

### Frontend Phase 2 comparison

Phase 2: 204 Karma specs, 69 pass / 135 fail. Phase 3: 211 specs, 76 pass / 135 fail. The failure occurrence multisets including normalized primary diagnostic messages match exactly across saved test logs, with no new/resolved failures (134 distinct labels; `DevReportsComponent should create` occurs twice). Seven additional specs pass, but the full suite remains red. See [`phase3-qa/angular-failure-comparison.md`](phase3-qa/angular-failure-comparison.md) for every exact failing label and primary diagnostic.

## Chromium visual/interaction evidence

A genuine Chromium 153 session exercised the dashboard with **intercepted mocked API responses**. It checked populated, empty, loading, service-error, retry-success, Arabic RTL / English LTR, filters, export controls, restricted-permission visibility, basic landmark/control semantics and responsive layout. This does **not** demonstrate live API/backend integration or production-data correctness.

Latest measured viewport results:

| Viewport | Document `scrollHeight` | `clientHeight` | Horizontal overflow | Overlap / clipped dashboard descendants |
|---|---:|---:|---|---|
| 1440×1000 | 1000 | 1000 | None | None detected |
| 768×1024 | 1151 | 1024 | None | None detected |
| 390×844 | 1906 | 844 | None | None detected |

Thus the desktop viewport has no document vertical scroll; tablet/mobile have expected vertical page scrolling and no horizontal overflow. Evidence files (all synthetic fixture data):

- `phase3-qa/desktop-1440x1000-validation.png`
- `phase3-qa/tablet-768x1024-validation.png`
- `phase3-qa/mobile-390x844-validation.png`
- `phase3-qa/populated-desktop.png`, `populated-tablet.png`, `populated-mobile.png`
- `phase3-qa/arabic-rtl-1440.png`, `empty-1440.png`, `loading-1440.png`, `error-1440.png`, `retry-1440.png`, `restricted-mobile.png`

The UI smoke run used a test user and intercepted `/api/bms/*`; no request to a real backend/database was validated. Arabic switching changed content to RTL; a restricted `dashboard.view`/`plans.view` user did not see unauthorized filters, exports, report-derived KPI history, or unrelated panels. These are frontend observations, not a comprehensive WCAG audit. External CDN integrity and placeholder Firebase websocket warnings are environmental; two mocked 503 responses were intentional.

## Gate status and remaining limits

**Phase 3 final acceptance gate: NOT PASSED. Do not recommend merge.** Focused checks and syntax validation pass, but both complete backend engines and the complete Angular/Karma suite are red. Local production build and Node tests pass; lint is unavailable/non-gating. CI PHP static-analysis annotations also need review. Live integration, production-data reconciliation, keyboard/screen-reader coverage, and full WCAG conformance remain unverified. PR #26 remains open and unmerged; Phase 4 has not started.
