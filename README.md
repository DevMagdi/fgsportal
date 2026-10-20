# FGS Connect — Modular Multi-Client Portal

FGS Connect is a business portal (Angular 13 frontend + Laravel 8 backend)
organised as a **core platform with optional, sellable modules** that can be
enabled or disabled per client company.

- **Core module** — Users, Authentication & Permissions (always enabled).
- Optional modules — **CRM**, **Ticketing & Support**, **Projects**, **HR**,
  **Administration**.

A client may buy any combination, e.g. *Core + CRM* only; every other API and
UI surface is then inaccessible/hidden for that client.

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
   menu entries and guards every lazy route with `ModuleGuard`.
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

Management endpoints (JWT required; Management/Administration only):

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/modules` | Module catalogue with current company status |
| GET | `/api/company/modules` | Modules enabled for the caller's company |
| POST | `/api/company/modules/enable` | Enable `{module_slug}` / `{module_id}` |
| POST | `/api/company/modules/disable` | Disable `{module_slug}` / `{module_id}` |

Run backend tests:

```bash
vendor/bin/phpunit            # 19 feature tests, in-memory SQLite
```

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

## Security

- No secrets are committed: `.env` files, TLS keys, FTP credentials and Firebase
  keys are ignored/sanitised (see root `.gitignore` and the `*.example` templates).
- New deployments must rotate every previously exposed credential (the pre-cleanup
  Git history still contains them).
