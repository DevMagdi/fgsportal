# FGS Connect — Modular Multi-Client Portal

FGS Connect is a business portal (Angular 13 frontend + Laravel 8 backend)
organised as a **core platform with optional, sellable modules** that can be
enabled or disabled per client company.

- **Core module** — Users, Authentication & Permissions (always enabled).
- Optional modules — **CRM**, **Ticketing & Support**, **Projects**, **HR**,
  **Administration**.

A client may buy any combination, e.g. *Core + CRM* only; every other API
surface is then inaccessible for that client, and on the modules dashboard the
unpurchased modules remain visible as dimmed, locked cards rather than being
removed.

## Repository structure

```
fgsportal/
├── backend/                      # Laravel 8 API (all server code)
├── frontend/                     # Angular 13 application (source of truth for the UI)
├── docs/MODULES.md               # Module catalogue & provisioning guide
├── MODULARIZATION_PLAN.md        # Architecture decisions & analysis
└── README.md
```

Committed production Angular bundles, the legacy `FrontEndApiTest/` hosting
folder and the partial root `system/` copy have been removed; build output is
generated locally or by CI and is never committed.

## How the module system works

1. The `modules` table is the catalogue; `company_modules` stores each company's
   entitlements; `users.company_id` links users to their company.
2. The backend `module` middleware (`App\Http\Middleware\CheckModule`) blocks
   requests to controllers belonging to disabled modules with **HTTP 403**.
   Controller → module mapping lives in `config/modules.php`.
3. After login the frontend fetches `GET /api/company/modules`, hides disabled
   menu entries and guards every lazy route with `ModuleGuard`. The **Modules
   dashboard** at `/modules` additionally renders all six modules as cards:
   enabled modules open normally, while disabled modules stay visible but are
   dimmed with a lock badge and route to `/module-disabled?module=<slug>` when
   clicked — they are never fully hidden.
4. The default/legacy company is seeded with **all** modules enabled, so existing
   deployments keep working unchanged.

See [`docs/MODULES.md`](docs/MODULES.md) for the full module list and client
provisioning steps, and [`MODULARIZATION_PLAN.md`](MODULARIZATION_PLAN.md) for
the architecture analysis.

## Backend setup (Laravel 8, `backend`)

Requirements: PHP >= 7.4 (tested up to 8.x), Composer, MySQL 5.7+/8 (SQLite is
used by the test suite).

```bash
cd backend
composer install
cp .env.example .env            # fill DB / JWT / mail values
php artisan key:generate
php artisan jwt:secret          # sets JWT_SECRET
php artisan migrate
php artisan db:seed             # modules + default company + entitlements
php artisan serve
```

> **Fresh-database note:** the historical codebase only ships migrations for
> part of its schema — many feature tables (CRM, HR, ticketing, recruitment, …)
> were created directly in deployed databases. A clean `migrate` + `seed` is
> enough to run authentication and the modules dashboard. For the full feature
> set, import a `mysqldump` from an existing environment into an empty database
> instead, then run `php artisan db:seed` if that dump predates the modular
> system (modules/companies/company_modules tables).

Management endpoints (JWT required; Management/Administration only):

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/modules` | Module catalogue with current company status |
| GET | `/api/company/modules` | Modules enabled for the caller's company |
| POST | `/api/company/modules/enable` | Enable `{module_slug}` / `{module_id}` |
| POST | `/api/company/modules/disable` | Disable `{module_slug}` / `{module_id}` |

Run backend tests:

```bash
vendor/bin/phpunit            # 28 feature tests, in-memory SQLite (83 assertions)
```

The suite covers the core/403/200 middleware paths, explicit and config-mapped
module resolution, fail-open legacy tenants, the management enable/disable API,
end-to-end entitlement cache invalidation and the module seeders.

## Frontend setup (Angular 13, `frontend`)

```bash
cd frontend
cp src/environments/environment.example.ts src/environments/environment.ts
# edit environment.ts with your Firebase/API values (never commit real secrets)
npm install
npm start                     # ng serve
npm test                      # Karma/Jasmine unit tests
npm run build
```

FTP deployment credentials are no longer stored in `package.json`. Export them
before running the deploy scripts:

```bash
export FTP_HOST=... FTP_PORT=21 FTP_USERNAME=... FTP_PASSWORD=...
npm run deploy-test
```

### Firebase / push configuration (backend)

The Firebase keys that used to be hardcoded in the messaging/database controllers
are now read from `backend/config/firebase.php` via environment variables — copy
them into `backend/.env` (never commit real values):

| Variable | Purpose |
| --- | --- |
| `FIREBASE_SERVER_KEY` | FCM legacy server key for push notifications |
| `FIREBASE_API_KEY` | Firebase Web API key |
| `FIREBASE_DATABASE_URL` | Realtime Database base URL (current project) |
| `FIREBASE_LEGACY_DATABASE_URL` | Legacy project Realtime Database URL |
| `FIREBASE_LEGACY_DB_AUTH_TOKEN` | Legacy database access token |

Service-account JSON files (`*firebase-adminsdk*.json`) are git-ignored and must
be provisioned on the server out of band. The frontend keeps `YOUR_*` placeholders
in `src/environments/environment.example.ts`.

## Security

- No secrets are committed: `.env` files, TLS keys, FTP credentials, Firebase
  service-account JSON and Firebase keys are ignored/sanitised (see root
  `.gitignore` and the `*.example` templates).
- Production Angular bundles and source maps are build output only and are never
  committed; `frontend/` is the single source of truth for the UI.
- New deployments must rotate every previously exposed credential (the pre-cleanup
  Git history still contains them).
