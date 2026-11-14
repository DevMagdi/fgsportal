# Unified application shell (Phase 1) + Organization foundation (Phase 2 Stage A)

Target branch: `BMS` · Base: `884930ad77e1f463beaddd96feed466dd94c62a1` · Frontend only — no backend, environment or dependency change.

## What this delivers

**Phase 1 — one application shell**
- A single sidebar, header and content outlet for every signed-in page (`frontend/src/app/layout/**`), replacing the legacy navbar and the second BMS sidebar.
- Navigation is data (`layout/navigation/nav.registry.ts`, 65 links) with the same visibility rules as the retired navbar; parity is documented in `docs/PHASE1_NAV_PARITY_MATRIX.md`.
- Removed: `components/navbar/*`, `components/bms/bms-shell.component.*`.

**Phase 2 Stage A — organization foundation (existing APIs only)**
- `/bms/organization` — Organization overview: unit structure, directors, people, products, central departments (only what the API returns).
- `/bms/units` — unit cards with search and status filter; create/edit in a side panel.
- `/bms/units/:id` — unit page: management, people, reporting lines, products, weekly plans.
- `/bms/employees` — pagination, manager column, role scope, links to and from units.

## Correction to wildcard permission handling

This PR corrects how the frontend reads the wildcard ability `*`. It is a fix to behaviour that exists on the base commit, not something introduced by the new screens.

- **Before (base commit `884930a`)**: every frontend ability check was a plain membership test (`can.includes(ability)`). The backend grants System Administrators `*` and treats it as "every ability" (`BmsAccess::can`), and `GET /bms/lookups` returns `*` next to the abilities some role names explicitly. Abilities that no role names (`units.manage`, `roles.manage`) were therefore unreachable in the UI: a System Administrator was redirected away from `/bms/access` and saw no create/edit/delete actions on business units, although the API would have accepted the requests.
- **After**: one shared helper, `hasAbility()` in `components/bms/bms-abilities.util.ts`, returns true when the list contains the ability **or** `*`. It replaces all nine membership checks, in eight files (access service and route guard, BMS base component, navigation rules, sidebar registry, shell request policy, executive dashboard, organization overview, unit page).
- **Who is affected**: only accounts whose `can` list contains `*`. Of the abilities the frontend checks, only `units.manage` and `roles.manage` change outcome for them; every other one was already listed explicitly. Accounts without `*` behave exactly as before (verified in the browser with a unit director: no Access link, no unit actions, `/bms/access` still refused).
- **Security boundary**: unchanged. The backend still authorises every request; this only decides which links and buttons are shown.
- **Tests**: `bms-abilities.util.spec.ts` (Node suite).

## Other behaviour changes to review

1. **Routes**: two added (`/bms/organization`, `/bms/units/:id`); the BMS parent route no longer mounts the BMS shell. Nothing removed or re-guarded (`docs/PHASE1_ROUTE_INVENTORY.md`).
2. **Sign-in / sign-out rendering**: the signed-in shell and the signed-out outlet share one `*ngIf / else` in `app.component.html`, so the landing page renders after sign-in without a reload (covered by `app.component.spec.ts`).
3. **Unit page stops after a refused unit**: no follow-up requests for people or products.
4. `scripts/check-registry-routes.js` now resolves `/bms/*` cards against the BMS module (it reported all 15 as dead on the base commit too).

## Verification

- `npm run test:node`: 69 passing, 0 failing.
- `ng build --configuration production`: exit 0.
- **Karma does not pass, on this branch or on the base commit; both exit with code 1.** This branch: 299 run, 201 passed, 98 failed. Base commit: 212 run, 113 passed, 99 failed. No test fails here that passes on the base. The failure that is gone belonged to the navbar spec, which was deleted together with the navbar; none of the legacy failures was fixed. Details: `docs/PHASE1_KARMA_COMPARISON.md`.
- Browser verification was run in a sandbox against the real Laravel code on **PHP compiled to WebAssembly with SQLite and seeded test data**. This is **not** the documented PHP + Composer + MySQL setup, the data is not production-like, and legacy modules were only partly reachable. Covered there: the four pages, unit create/edit/deactivate/delete, pagination, loading/empty/error states, restricted accounts in the UI and directly against the API, 390/820/1280 px widths, Arabic, sign-in/sign-out without reload. The screenshots from that run are kept locally and are not part of this PR.

## Known limits and risks

- Not yet run on a PHP + MySQL environment with production-like data (see Verification). A staging pass is recommended before merge.
- The Karma suite still fails (98 failures, all in legacy specs with missing providers); fixing them is outside this PR.
- **Overlap with PR #27** (open, also targets `BMS`): both change `frontend/src/app/components/bms/dashboard/executive-dashboard.component.ts`. This PR's change there is two lines (the `hasAbility` import and its use in `can()`). Whichever merges second must resolve that file and keep the `hasAbility` call.
- Existing backend behaviour, unchanged: `GET /bms/products?business_unit_id=` can return a product shared with the caller's own unit; changing a director re-scopes the `unit_director` role and can leave it pointing at a deleted unit; login by `username` fails (email works).
- Not in this delivery (Stage B, backend): teams, development managers per unit, project ↔ unit links, central departments, multiple assignments per employee beyond unit membership, workflows, approvals, audit history.
