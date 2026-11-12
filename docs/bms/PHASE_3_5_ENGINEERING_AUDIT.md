# BMS Phase 3.5 — Engineering audit

**Audit base / starting SHA:** `ae790a960bf52cda08f0047a43de896ea0972145`
**Working branch:** `arena/e1389d1e-fgsportal` (session branch; kept in place)
**Base:** `origin/BMS` at `891851bc85b2d2f274b811c9173d6268c8752795`
**PR:** #26, open, base `BMS`; no merge performed.
**Initial fix SHA:** `7de9f0479c75269c658bf80772e2ddd343fe29c9`. **Latest tested SHA:** `054288d2016576721e5169027f0c7ee64d40ad26` (CI 43302623366 failed; see test report).

## Summary / disposition

This is a targeted audit, not a full production certification. The current PR-head history and Phase 3 implementation were verified. The only local base ref was absent at preflight; fetching `BMS` showed the expected base commit. Worktree was clean at start. Review comments and changed files were inspected. No database was connected locally and no destructive database commands were run.

Two concrete correctness issues were fixed without changing permissions: validated product metadata and manager IDs were being silently discarded by Eloquent mass assignment; date-only KPI strings used a double-escaped digit regex and could render one day early west of UTC. CI conditions were made cancellation-safe, and the frontend build is now eligible to run after a failed Karma step. Full release readiness remains **NOT PASSED**: full suites, security boundary review, fresh environment provisioning, complete schema inventory and real API integration remain incomplete or blocked.

## Evidence-based findings

| ID | Severity | Finding / evidence | Disposition |
|---|---|---|---|
| AUD-01 | Medium | `ProductTrackingController` validated description/owner and passed them to `Product::create/update`, but `Product::$fillable` contains only `product_name`; P18 error `Undefined array key "description"` and existing assertions establish expected API contract. | Fixed by assigning only the validated allow-listed attributes directly; no global fillable expansion. Focused P18 tests in CI. |
| AUD-02 | Medium | `EmployeeController::store` validates `manager_id` through `validatedManagerId` and places it in `User::create`, but `User::$fillable` omits `manager_id`. Test expected the validated manager to persist, got null. | Fixed by assigning the validated ID after create, after existing scope/cycle checks; no mass-assignment broadening. Regression still requires final CI confirmation. |
| AUD-03 | Medium | `dateLabel` used `/^\\d.../` in a regex literal, which matches a backslash-d rather than digits; date-only strings fell through to UTC parsing. Confirmed in Gitar PR review. | Fixed to `/^\d.../`; added date-only test and ran Node suite in `America/Los_Angeles`. |
| AUD-04 | Low | CI used `always()` on backend post-setup steps, so cancellation did not stop later full suites; production build was skipped when Karma failed. | Fixed conditions to `!cancelled()` and run build after successful dependency install even if tests fail. Workflow YAML parsed locally; CI confirmation pending. |
| AUD-05 | High / approval needed | `recentActivity` infers a Product's scope from all `businessUnits()`; an audit record has no originating-unit snapshot. A PR review explicitly flags changed disclosure boundaries for products shared across units. Focused P22 test passes, but that alone does not settle intended visibility for an event on a shared product. | **Not changed.** Do not broaden/narrow visibility without a documented contract and explicit approval. Record as security gate blocker. |
| AUD-06 | High / approval needed | `EmployeeController::inspectImportRow` optionally queries `business_units.company_id`; the repository migration/model inventory has no `business_units.company_id` definition, while user company tenancy exists. MySQL run has import 500s and reviewer diagnostics mention unknown `company_id`. Exact failing query must be confirmed from the full server response. | **Not changed.** Company-to-unit mapping is undefined; adding schema or removing the filter risks authorization/data-isolation semantics. Blocked pending schema/business-owner decision. |
| AUD-07 | Medium | Recent activity loads up to 120 audit records and lazy-loads polymorphic `auditable` in the loop; this can create up to one query per distinct audit record. | Static-review performance risk; no refactor without measured query evidence. |
| AUD-08 | Medium | `composer lint` and `composer analyse` are configured `continue-on-error`; their final check conclusions do not enforce a clean gate. Reported annotations include model-property/method findings. | Non-gating diagnostic only; retain as debt until type stubs/configuration and findings are reviewed. |
| AUD-09 | High | `CompleteBmsBrdTables::down()` drops many BMS tables; rollback would destroy table data. | No rollback run. Deployment/rollback must use a reviewed backup/restore plan; fresh install and production schema comparison remain blocked. |

No Critical finding is claimed on available evidence. This audit did not approve or change role matrix behavior, authentication, unit scoping, KPI definitions, or business workflows.

## Technical debt register (prioritized)

| ID | Severity | Area | Evidence / impact | Recommendation | Phase 3.5 status / effort |
|---|---|---|---|---|---|
| TD-01 | High | Shared-product audit scope | No audit origin-unit field; Product can be associated to several units; disclosure boundary ambiguous. | Product owner/security review to define event visibility and data contract, then design a regression before implementation. | Excluded pending explicit approval; medium. |
| TD-02 | High | Employee import tenant mapping | `company_id` predicate on units lacks matching checked-in schema; MySQL import test returns 500. | Verify deployed schema and company/unit ownership contract; only then choose a safe query/schema plan. | Blocked; medium/high. |
| TD-03 | High | Release gates | Backend SQLite/MySQL and full Karma suites are red; frontend lint target absent/non-gating. | Root-cause classified fixes, then full tests/build on a single final SHA. | In progress; high. |
| TD-04 | High | Fresh install/rollback safety | Legacy schema includes duplicated historical create migrations; BMS rollback drops multiple data tables. | Build a disposable migration rehearsal and a backup/restore runbook; never run destructive rollback against live data. | Blocked locally; high. |
| TD-05 | Medium | Dashboard audit query count | Up to 120 logs with lazy polymorphic relation access. | Measure query count; consider `morphTo` eager loading and preserve unresolved-scope suppression. | Not changed; low/medium. |
| TD-06 | Medium | Static analysis | `composer analyse` is non-gating and annotations report undefined properties/methods on legacy models. | Separate valid findings from model/schema typing debt, then establish a gating baseline. | Non-gating; medium/high. |
| TD-07 | Medium | Legacy meeting update | `MeetingController::syncAttendees()` calls unsupported `Collection::intersectKeys`; existing P16 test gets HTTP 500. | Isolate as pre-existing workflow defect; fix only in an explicitly approved scope with behavior tests. | Not changed; low. |
| TD-08 | Medium | Module seeder expectation | `ModulesTableSeederTest` expects `bms` not core, but current seeder marks it core; expected product policy is unclear. | Resolve product/core-module contract before changing seed behavior. | Not changed; low. |
| TD-09 | Low | Incomplete historic test baseline | Phase 2 historical backend logs are truncated; reported aggregate baseline 149/5/6 is available, but not every error label/message. | Preserve full structured PHPUnit output as an artifact in future CI. | CI diagnostics improved; low. |

## Architecture and scope notes

- Reviewed dashboard controller, `BmsAccess`, employee/product controllers/models, relevant migrations and test setup. `BmsAccess` centralizes role abilities and visible-unit scope; no authorization refactor was attempted.
- Dashboard controller currently coordinates validation, scope-filtered aggregates, serialization and activity enrichment; no broad decomposition was justified in this time-box.
- The dashboard browser evidence is mocked. It does not validate API/database integration or production records.
- This is not a complete inventory of every legacy table, index, or deployed schema. See database readiness report for the bounded inventory and blockers.

## Gate result

**Phase 3.5: NOT PASSED.** The two high-severity scope/schema issues above require explicit contract decisions; full suites and a safe fresh-environment rehearsal must be completed before release readiness. PR #26 remains open and unmerged; Phase 4 was not started.
