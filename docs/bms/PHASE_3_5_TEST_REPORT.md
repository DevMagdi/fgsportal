# BMS Phase 3.5 — Candidate test report

**Preflight starting SHA:** `ae790a960bf52cda08f0047a43de896ea0972145`
**Initial fix SHA:** `7de9f0479c75269c658bf80772e2ddd343fe29c9`
**Latest tested source SHA:** `15c8bf295ff3c44a171800b61bb5441ddca979c2`
**Branch / PR:** `arena/e1389d1e-fgsportal`, PR #26 open, base `BMS`; no merge.
**Latest CI:** [43318197656](https://github.com/DevMagdi/fgsportal/actions/runs/43318197656), completed **failure** on `15c8bf2`. PR #26 remains open and unmerged.

## Environment and commands

- Local OS/browser and frontend runtime: Chromium 153; Node v22.22.3, npm 10.9.8.
- Local PHP command `php -v`: **BLOCKED**, `php: command not found`; `backend/vendor/bin/phpunit` absent. Backend native syntax and PHPUnit run on CI PHP 8.1 / SQLite / MySQL 8.
- `TZ=America/Los_Angeles npm run test:node` (`frontend/`): **PASS, 43/43**.
- `npm run build -- --configuration production` (`frontend/`): **PASS**, hash `dda2defb94f80af4`; warning output remains (legacy selectors, Autoprefixer and canvg CommonJS).
- YAML parsed via repository `js-yaml`; `git diff --check`: **PASS** before commit.
- CI 43302623366: native PHP syntax, focused P22/P18/P19/P20/P1.1 checks, PHP lint and PHP analysis passed. SQLite and MySQL full suites failed (each 150 tests, 1 error and 4 failures). Angular/Karma failed (212 executed, 77 passed / 135 failed). Frontend lint and production build passed. CI workflow logs/check annotations were reviewed.

## Prior baseline evidence (not candidate results)

Prior run 43298475803 on code commit `ae790a9` had native PHP syntax and focused P22/P18/P19/P20/P1.1 checks pass; SQLite and MySQL each had 150 tests, 1 error, 6 failures; Angular failed; Gitar passed. This is historical evidence, **not a pass for `7de9f04`**.

Root causes established from source:

- Product metadata was discarded because `Product::$fillable` only allowed `product_name`; controller validated nullable `description` and `owner_id`. Candidate writes these allow-listed fields directly.
- Employee manager ID was discarded because `User::$fillable` excludes `manager_id`; candidate writes only after `validatedManagerId` checks.
- Date-only regex was double escaped; candidate fixes it and adds a regression spec.
- Existing meeting failure uses unsupported `Collection::intersectKeys`; left unchanged as pre-existing meeting workflow.
- Import tests fail differently by engine; MySQL review diagnostics report unknown `company_id` in a unit query, while the checked-in unit schema has no such column. Tenant mapping remains unresolved; no schema/auth change was made.

Historical backend baseline recorded in previous reports: 149 tests, 5 errors, 6 failures. Historical failure annotations are truncated; count comparison is possible but full exact mapping of all errors is not. Frontend Phase 2 was 204 / 69 pass / 135 fail and Phase 3 was 211 / 76 / 135; saved logs show exact failure-label and normalized primary-diagnostic equality. See the comparison artifact.

## Earlier candidate outcome (CI 43302623366; SHA `054288d`)

SQLite: 150 tests, 1101 assertions, 1 error, 4 failures. MySQL: 150 tests, 1098 assertions, 1 error, 4 failures. Both engines reported the same categories: core-module expectation (`bms must not be core`), meeting attendee update HTTP 500 (`Collection::intersectKeys` is undefined), and two employee import assertions/HTTP 500s. The manager cross-company test errors before the endpoint assertion: its fixture inserts a user with nonexistent `company_id=999`, violating the FK on both engines; that test therefore does not validate the out-of-company rejection. Do not claim manager-update behavior fully verified by this run. The product phase reorder and focused backend regressions pass, but the full backend gate remains red.

Angular/Karma: 212 executed, 77 passed / 135 failed. The observed failures are the existing broad TestBed setup failures (missing providers such as `MatSnackBar`, `HttpClient`, and `MessagingService`); the suite remains red. CI native PHP syntax, focused backend tests, PHP lint/analysis, frontend lint, and production build passed. The frontend production build ran despite the Karma failure.

## Historical classification (CI 43302623366)

| Check | Result |
|---|---|
| Repository/branch integrity; PR #26 open, base `BMS` | PASS; starting SHA matches remote PR head |
| Native PHP lint, focused backend tests | Historical PASS on CI 43302623366; see latest candidate section below |
| Full SQLite / MySQL | Historical FAIL on CI 43302623366; see latest candidate section below |
| Node tests | PASS 43/43 |
| Full Angular/Karma | Historical FAIL on CI 43302623366; latest outcome below |
| Production build | PASS locally and in CI; latest CI 43318197656 |
| Lint | NOT AVAILABLE locally; CI lint is non-gating |
| Schema/fresh install | BLOCKED locally; no PHP/vendor/.env or disposable DB; no destructive commands run |
| Live backend API/dashboard integration | NOT EXECUTED; browser traffic in saved QA was mocked |
| Security matrix/shared Product scope | BLOCKED/NOT PASSED; shared-audit-unit policy unresolved |
| Desktop/responsive UI | Previous mocked Chromium captures and measurements; not rerun at final candidate |

## Follow-up candidate outcome (CI 43318197656; source SHA `15c8bf295ff3c44a171800b61bb5441ddca979c2`)

- Focused CI checks passed: P16 attendee synchronization; persisted cross-company manager regression; BMS-core module catalogue contract; plus the existing focused P18/P19/P20/P22/P1.1 regressions.
- SQLite full suite: 156 tests, 1161 assertions, 2 failures. MySQL 8: 156 tests, 1158 assertions, 2 failures. Both remaining failures are the employee import preview/duplicate cases: SQLite expected one valid row but got zero; MySQL requests returned 500. Company-to-BusinessUnit tenant mapping is unresolved; no query/schema/auth change was made.
- Angular/Karma: 212 executed, 114 passed / 98 failed. The workflow now emits diagnostic chunks. Evidence-based setup corrections were made for specific component specs; remaining failures are spread across legacy TestBed/provider/fixture setups, so no global mocks, skips or assertion weakening were introduced.
- Frontend lint and production build passed in CI; backend PHP lint/static analysis passed. Local `npm run build -- --configuration production` passed, local Node tests passed 43/43, `git diff --check` passed. Local Karma bundled/compiled specs but could not launch because no Chrome binary is installed; no local browser-suite pass is claimed.
- Security/shared-Product event visibility and Company–BusinessUnit ownership remain unresolved. Local fresh database/API rehearsal remains blocked and was not attempted. This is not live integration or production-readiness evidence.

## Final stop rule

Do not mark Phase 3.5 complete or production ready: latest CI 43318197656 is complete and red; Angular and employee-import failures remain, and database/security/integration gates remain blocked. Obtain the relevant owner decisions and continue targeted, evidence-backed work. PR #26 must remain open and unmerged; Phase 4 must not start.
