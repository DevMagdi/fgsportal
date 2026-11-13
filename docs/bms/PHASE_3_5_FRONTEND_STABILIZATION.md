# BMS Phase 3.5 — Frontend stabilization

**Starting SHA:** `ae790a960bf52cda08f0047a43de896ea0972145`
**Initial fix SHA:** `7de9f0479c75269c658bf80772e2ddd343fe29c9`
**Latest tested source SHA:** `15c8bf295ff3c44a171800b61bb5441ddca979c2`
**Current CI:** [43318197656](https://github.com/DevMagdi/fgsportal/actions/runs/43318197656) — **failure**.

## Confirmed date parsing defect and fix

The date-only branch in `dateLabel` used a double-escaped digit class in a JavaScript regex literal (`/^\\d.../`). A date such as `2026-03-01` did not enter the local calendar-date branch and fell back to `new Date(raw)`, which parses date-only ISO strings as UTC. In time zones west of UTC, formatting can shift to the preceding day/month. This was a concrete PR review finding.

Fixed the regex to `/^\d{4}-\d{2}-\d{2}$/` and added a spec comparing output to the local calendar date. Verified with `TZ=America/Los_Angeles npm run test:node`: **43 passing, 0 failing**. This is local Node validation, not a browser API test.

## Frontend quality gates

| Gate | Candidate evidence | Status |
|---|---|---|
| Node tests | `TZ=America/Los_Angeles npm run test:node` — **43/43 pass** after date regression spec. | PASS |
| Production build | `npm run build -- --configuration production` — exit 0; hash `dda2defb94f80af4`; existing CSS selector, Autoprefixer and CommonJS warnings. | PASS locally |
| Complete Angular/Karma suite | Latest CI 43318197656 on `15c8bf2`: 212 executed, 114 passed / 98 failed. Broad legacy TestBed/provider/fixture failures remain. | FAIL |
| Lint | `npm run lint` calls `ng lint`; this Angular project has no lint target/package. CI lint is `continue-on-error`. | NOT AVAILABLE as a gate; no pass claim |
| Production build in CI | CI 43318197656 production build completed successfully after Karma failure. | PASS |
| TypeScript/compiler | Production build compiles TypeScript; no separate strict typecheck configured. | Build evidence only |
| Changed-file / whitespace | `git diff --check` passed before source commit. | PASS |

## Historical failure comparison

Captured Phase 2 / Phase 3 logs contained 135 failed spec occurrences across 134 unique labels in both runs. All normalized primary diagnostics matched (checkout-root differences normalized); no new or resolved failure labels/messages. Seven additional specs passed in Phase 3. Full comparison is retained at `docs/bms/phase3-qa/angular-failure-comparison.md`. The full suite remained red and is not excused as harmless merely because counts match.

Common failures are legacy TestBed setup omissions (e.g. `HttpClient`, `Router`, `MatSnackBar`, `MessagingService`) and component declarations. No broad changes to unrelated TestBed files were made. Candidate CI must be inspected before declaring whether the added date spec affects full-suite counts.

## Dashboard visual and integration status

Previous genuine Chromium 153 runs reviewed populated/empty/loading/error/retry states, filters, export visibility, restricted permissions, Arabic RTL/English LTR and basic control semantics. API responses were intercepted/mocked. Evidence is not live Laravel/API verification. Latest layout measurements: 1440×1000 `scrollHeight=clientHeight=1000`; tablet 768×1024 `1151/1024`; mobile 390×844 `1906/844`; no horizontal overflow, measured dashboard overlap, or clipped descendants. Those screenshots predate candidate `7de9f04`; only the date utility changed in the UI source since then. No candidate visual re-run was completed.

## Gate status

Frontend gate is **NOT PASSED**: latest CI 43318197656 Karma suite failed (212 executed, 114 passed / 98 failed), despite 43/43 local Node tests and a successful CI production build. Several concrete test-fixture/provider failures were repaired, but broad unrelated setup failures remain; no tests were skipped or globally mocked. Local Karma still cannot launch because Chrome is absent. Lint remains unavailable. Dashboard API integration remains mocked, not real.
