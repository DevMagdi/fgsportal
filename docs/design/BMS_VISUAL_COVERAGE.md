# BMS redesign coverage matrix

**Branch:** `arena/cde8af1e-fgsportal`
**Base:** `BMS@6439897864ddccd1baff880486594200289a9f21`
**Status:** implementation is in review; authenticated visual acceptance is blocked.

## Inventory

Source of truth: `frontend/src/app/components/bms/bms.module.ts` and `bms-catalog.ts`.

- **21 route declarations:** 20 component-backed patterns plus the empty-path redirect.
- **20 component-backed patterns:** 19 permission-guarded routes and `/bms/no-access`.
- **17 component templates:** 12 fixed guarded route templates, one collection template reused by seven catalog routes, the embedded unit-teams view, and two shared state/confirmation templates.
- Collection configurations: `development`, `leads`, `recruitment`, `procurement`, `events`, `documents`, `directory`.

## Implementation and verification counts (reported independently)

| Screen family | Route patterns | Implementation/source status | Browser verification status |
|---|---:|---|---|
| Executive dashboard | 1 | Page-level template/style updates; retains real API-derived summaries and existing permission gates. | 0/1 authenticated renders |
| Organization overview | 1 | Page-specific hierarchy composition and responsive styling. | 0/1 authenticated renders |
| Business units | 1 | Page-specific list/filter/header composition and responsive styling. | 0/1 authenticated renders |
| Unit detail | 1 | Page-specific detail header and hierarchy/member/product styling; embedded unit-teams view inventoried. | 0/1 authenticated renders |
| Weekly plans | 1 | Page-specific plan/task composition and labels. | 0/1 authenticated renders |
| My tasks | 1 | Page-specific task summary/list composition. | 0/1 authenticated renders |
| Opportunities | 1 | Page-specific pipeline/list/editor composition; stage counts derive only from currently loaded API records. | 0/1 authenticated renders |
| Products | 1 | Page-specific product/phase composition; progress uses existing product data. | 0/1 authenticated renders |
| Meetings | 1 | Page-specific agenda/list composition; selection, meeting detail and minutes actions retained. | 0/1 authenticated renders |
| Reports | 1 | Page-specific report/KPI hierarchy and progress presentation from report values. | 0/1 authenticated renders |
| Access & roles | 1 | Page-specific assignment, matrix and audit sections; permission checks and API actions retained. | 0/1 authenticated renders |
| Employees | 1 | Responsive employee directory cards and filters/editor/profile actions. | 0/1 authenticated renders |
| Catalog-driven collection workflows | 7 | One modified kind-aware `BmsCollectionComponent` serves seven configurations; stage/status summaries derive only from returned records. This is one shared implementation, **not seven independently completed redesigns**. | 0/7 authenticated renders |
| No-access state | 1 | Page-specific access-denied composition. | Not signed-in BMS page QA; no authorized-account render |

The template count, implementation count, and rendered-verification count are distinct. Page styling inheritance is not counted as page-specific redesign, and source implementation is not counted as browser verification.

## Verification results and limits

- Production Angular build: **passed**; component Sass styles were split into two files to remain below the existing component-style budget. Existing Autoprefixer and CommonJS warnings remain.
- Node test suite: **71 passed, 0 failed**.
- Karma/Jasmine: latest attempt could not launch; ChromeHeadless binary/`CHROME_BIN` is unavailable. Earlier recorded Karma failures are baseline, not presented as passing.
- `git diff --check`: clean at last validation.
- Browser route attempt: all 20 component-backed paths redirected to `#/signin`; no authenticated BMS route rendered.
- Genuine screenshot of the route/auth boundary only: `bms-auth-blocked-1440x1000.png`. It shows the sign-in page after redirection and is **not** a BMS screenshot or visual acceptance evidence.
- Local Firebase/API values are placeholders; the backend, database runtime and safe authorized test account are unavailable. Arabic RTL, populated states, role-dependent content, interactions, and the required desktop/tablet/mobile BMS screenshots remain unverified.

See [`BMS_LOCAL_QA_BLOCKER.md`](BMS_LOCAL_QA_BLOCKER.md) for the inspected authentication architecture, exact missing local services/configuration, and safe manual setup steps. BMS remains active; no CRM redesign has started.
