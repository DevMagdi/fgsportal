# BMS Phase 3.5 — Frontend stabilization

**Starting SHA:** `ae790a960bf52cda08f0047a43de896ea0972145`  
**Candidate SHA:** `7de9f0479c75269c658bf80772e2ddd343fe29c9`  
**Current CI:** 43300908597 (candidate Karma/build still running at last observation).

## Confirmed date parsing defect and fix

The date-only branch in `dateLabel` used a double-escaped digit class in a JavaScript regex literal (`/^\\d.../`). A date such as `2026-03-01` did not enter the local calendar-date branch and fell back to `new Date(raw)`, which parses date-only ISO strings as UTC. In time zones west of UTC, formatting can shift to the preceding day/month. This was a concrete PR review finding.

Fixed the regex to `/^\d{4}-\d{2}-\d{2}$/` and added a spec comparing output to the local calendar date. Verified with `TZ=America/Los_Angeles npm run test:node`: **43 passing, 0 failing**. This is local Node validation, not a browser API test.

## Frontend quality gates

| Gate | Candidate evidence | Status |
|---|---|---|
| Node tests | `TZ=America/Los_Angeles npm run test:node` — **43/43 pass** after date regression spec. | PASS |
| Production build | `npm run build -- --configuration production` — exit 0; hash `dda2defb94f80af4`; existing CSS selector, Autoprefixer and CommonJS warnings. | PASS locally |
| Complete Angular/Karma suite | Candidate CI run 43300908597 is running at last observation. Previous Phase 3 run: 211 specs, 76 passed / 135 failed. | BLOCKED pending candidate CI |
| Lint | `npm run lint` calls `ng lint`; this Angular project has no lint target/package. CI lint is `continue-on-error`. | NOT AVAILABLE as a gate; no pass claim |
| Production build in CI | CI workflow now runs production build after dependency install even if Karma fails, unless cancelled. | PENDING candidate run |
| TypeScript/compiler | Production build compiles TypeScript; no separate strict typecheck configured. | Build evidence only |
| Changed-file / whitespace | `git diff --check` passed before source commit. | PASS |

## Historical failure comparison

Captured Phase 2 / Phase 3 logs contained 135 failed spec occurrences across 134 unique labels in both runs. All normalized primary diagnostics matched (checkout-root differences normalized); no new or resolved failure labels/messages. Seven additional specs passed in Phase 3. Full comparison is retained at `docs/bms/phase3-qa/angular-failure-comparison.md`. The full suite remained red and is not excused as harmless merely because counts match.

Common failures are legacy TestBed setup omissions (e.g. `HttpClient`, `Router`, `MatSnackBar`, `MessagingService`) and component declarations. No broad changes to unrelated TestBed files were made. Candidate CI must be inspected before declaring whether the added date spec affects full-suite counts.

## Dashboard visual and integration status

Previous genuine Chromium 153 runs reviewed populated/empty/loading/error/retry states, filters, export visibility, restricted permissions, Arabic RTL/English LTR and basic control semantics. API responses were intercepted/mocked. Evidence is not live Laravel/API verification. Latest layout measurements: 1440×1000 `scrollHeight=clientHeight=1000`; tablet 768×1024 `1151/1024`; mobile 390×844 `1906/844`; no horizontal overflow, measured dashboard overlap, or clipped descendants. Those screenshots predate candidate `7de9f04`; only the date utility changed in the UI source since then. No candidate visual re-run was completed.

## Gate status

Frontend gate is **NOT PASSED pending candidate Karma/CI build**, despite passing Node tests and production build locally. Lint remains unavailable. Dashboard API integration remains mocked, not real.