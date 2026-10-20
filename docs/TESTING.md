# Testing guide

## Backend (`backend/`)

PHPUnit feature tests — in-memory SQLite, no external services required:

```bash
cd backend
php vendor/phpunit/phpunit/phpunit
```

Coverage includes authentication/module entitlements (`LoginTest`), the full
CRM schema and model flow (`CrmSchemaTest`), the demo seeder
(`CrmDemoSeederTest`) and the end-to-end HTTP journey industry → account →
contact → lead through the real JWT + module middleware (`CrmFlowTest`).

A full fresh-install migration can also be verified manually:

```bash
touch /tmp/fresh.sqlite
DB_CONNECTION=sqlite DB_DATABASE=/tmp/fresh.sqlite php artisan migrate --force
DB_CONNECTION=sqlite DB_DATABASE=/tmp/fresh.sqlite php artisan db:seed --class=CrmDemoSeeder --force
```

## Frontend (`frontend/`)

```bash
cd frontend
npm ci --legacy-peer-deps   # Angular 13 peer-dependency tree
```

Three layers, all Chrome-independent except the first:

| Check | Command | What it covers |
| --- | --- | --- |
| Karma/Jasmine (needs Chrome) | `npm test` | Component TestBed specs |
| Pure-logic Node specs | `npm run test:node` | Registry visibility rules, sidebar parity, module structure snapshot |
| Dead-route guard | `node scripts/check-registry-routes.js` | Every module card targets a declared Angular route |
| Full type-check (incl. specs) | `npx tsc --noEmit -p tsconfig.spec.json` | All spec files compile against the real app |
| AOT build | `npx ng build --configuration development` | Whole application compiles |

### Why a Node harness?

CI/sandbox images used for this repository have no Chrome, so Karma cannot
start. `scripts/run-node-specs.js` transpiles the pure-TypeScript specs (the
ones without Angular `TestBed`) with the project's own TypeScript compiler and
runs them on Node with a small Jasmine-compatible API. The allow-list of
runnable specs lives in `PURE_SPECS` inside the script; component specs remain
Karma specs and are still fully type-checked by the `tsc` step.

### Sidebar ↔ module-cards parity

`module-pages.registry.ts` is the single source for the feature cards shown on
`/modules/:slug`. The registry spec asserts that:

- every active `routerLink` in `navbar.component.html` has a matching card, and
  vice versa;
- the signed-off per-module structure (titles and order) matches for a
  management user;
- permission/department/role conditions match the navbar's `*ngIf` rules;
- titles and routes are unique inside each module.
