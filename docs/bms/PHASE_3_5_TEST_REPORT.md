# BMS Phase 3.5 — Candidate test report

**Preflight starting SHA:** `ae790a960bf52cda08f0047a43de896ea0972145`  
**Candidate SHA:** `7de9f0479c75269c658bf80772e2ddd343fe29c9`  
**Branch / PR:** `arena/e1389d1e-fgsportal`, PR #26 open, base `BMS`; no merge.  
**Latest CI:** 43300908597; running at report preparation. Final outcomes must be appended before claiming readiness.

## Environment and commands

- Local OS/browser and frontend runtime: Chromium 153; Node v22.22.3, npm 10.9.8.
- Local PHP command `php -v`: **BLOCKED**, `php: command not found`; `backend/vendor/bin/phpunit` absent. Backend native syntax and PHPUnit run on CI PHP 8.1 / SQLite / MySQL 8.
- `TZ=America/Los_Angeles npm run test:node` (`frontend/`): **PASS, 43/43**.
- `npm run build -- --configuration production` (`frontend/`): **PASS**, hash `dda2defb94f80af4`; warning output remains (legacy selectors, Autoprefixer and canvg CommonJS).
- YAML parsed via repository `js-yaml`; `git diff --check`: **PASS** before commit.
- Candidate CI run 43300908597 includes native PHP lint, focused tests, SQLite, MySQL, Karma and a production build conditioned on successful installation but independent of Karma outcome. Outcomes pending at time of writing; update from the actual completed job before delivery.

## Prior baseline evidence (not candidate results)

Prior run 43298475803 on code commit `ae790a9` had native PHP syntax and focused P22/P18/P19/P20/P1.1 checks pass; SQLite and MySQL each had 150 tests, 1 error, 6 failures; Angular failed; Gitar passed. This is historical evidence, **not a pass for `7de9f04`**.

Root causes established from source:

- Product metadata was discarded because `Product::$fillable` only allowed `product_name`; controller validated nullable `description` and `owner_id`. Candidate writes these allow-listed fields directly.
- Employee manager ID was discarded because `User::$fillable` excludes `manager_id`; candidate writes only after `validatedManagerId` checks.
- Date-only regex was double escaped; candidate fixes it and adds a regression spec.
- Existing meeting failure uses unsupported `Collection::intersectKeys`; left unchanged as pre-existing meeting workflow.
- Import tests fail differently by engine; MySQL review diagnostics report unknown `company_id` in a unit query, while the checked-in unit schema has no such column. Tenant mapping remains unresolved; no schema/auth change was made.

Historical backend baseline recorded in previous reports: 149 tests, 5 errors, 6 failures. Historical failure annotations are truncated; count comparison is possible but full exact mapping of all errors is not. Frontend Phase 2 was 204 / 69 pass / 135 fail and Phase 3 was 211 / 76 / 135; saved logs show exact failure-label and normalized primary-diagnostic equality. See the comparison artifact.

## Classification (final candidate outcomes pending)

| Check | Status at report preparation |
|---|---|
| Repository/branch integrity; PR #26 open, base `BMS` | PASS; starting SHA matches remote PR head |
| Native PHP lint, focused backend tests | CI pending on candidate SHA |
| Full SQLite / MySQL | CI pending on candidate SHA; prior run red |
| Node tests | PASS 43/43 |
| Full Angular/Karma | CI pending on candidate SHA; prior run red |
| Production build | PASS locally; candidate CI pending |
| Lint | NOT AVAILABLE locally; CI lint is non-gating |
| Schema/fresh install | BLOCKED locally; no PHP/vendor/.env or disposable DB; no destructive commands run |
| Live backend API/dashboard integration | NOT EXECUTED; browser traffic in saved QA was mocked |
| Security matrix/shared Product scope | BLOCKED/NOT PASSED; shared-audit-unit policy unresolved |
| Desktop/responsive UI | Previous mocked Chromium captures and measurements; not rerun at final candidate |

## Final stop rule

Do not mark Phase 3.5 complete or production ready until CI 43300908597 is complete, all candidate outcomes are recorded, remaining failures are root-caused/classified, and blocked database/security/integration gates are explicitly resolved or accepted by the responsible owners. PR #26 must remain open and unmerged; Phase 4 must not start.