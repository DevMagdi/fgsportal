# Alphaiota BMS

Alphaiota BMS is a bilingual business-management workspace backed by the existing Laravel API. **`frontend-react/` is the official and only UI source of truth.** It provides the executive dashboard, business-unit and employee views, opportunities, plans, operations and reports, with English and Arabic (RTL), JWT authentication and permission-aware navigation.

## Repository

```text
frontend-react/   React 18, TypeScript, Vite and Tailwind application
backend/          Laravel 8 API, migrations and tests
docs/             Backend documentation and pointers to historical audits
scripts/          Backend test-environment helper
```

## Frontend

Use Node.js 20 or 22 and npm; CI uses Node 20.

```bash
cd frontend-react
npm ci

# Browser-local demo: any username and a password of at least 4 characters
VITE_DEMO_MODE=true npm run dev -- --host 0.0.0.0

# Verify
npm run typecheck
npm test
npm run build
```

For the live API, copy `frontend-react/.env.example` to `.env.local`, keep `VITE_DEMO_MODE=false` and configure `BMS_PROXY_TARGET` for a separately running Laravel server. The Vite proxy is server-side; browser requests use relative `/api` URLs. In production, route `/api` to Laravel with a reverse proxy, or configure a public `VITE_API_BASE_URL` and the corresponding CORS policy. Set `VITE_BMS_SERVER_TIME_ZONE` to Laravel's timezone (`Africa/Cairo` in this checkout) and rebuild when it changes.

The official circular logo is `frontend-react/src/assets/alphaiota-logo.png` and is shared by the sidebar, sign-in screen and favicon. UI colours use Deep Indigo `#45436E`, Skin `#DBCEBF` and White `#FFFFFF`, with Pink `#F498C1`, Lavender `#E7BAED`, Violet `#B5AFF9`, Turquoise `#A9F9ED` and Cyan `#81E2FD` for charts and small highlights. Neutral tints are derived from the primary colours. Graphik is preferred when licensed and installed; self-hosted Inter and IBM Plex Sans Arabic provide fallbacks.

See [`frontend-react/README.md`](frontend-react/README.md) for demo persistence, API configuration, date handling and the current live API limitations. In particular, some write operations, bonuses and generic activity endpoints are not present in this Laravel checkout; the UI reports errors rather than simulating live success.

## Backend

Use PHP and Composer versions compatible with the locked dependencies, and a configured application database. CI uses PHP 8.1 and installs with `--ignore-platform-req=php` because some locked packages declare older PHP constraints; this is not proof of full PHP 8 compatibility.

```bash
cd backend
composer install
cp .env.example .env              # configure DB, JWT, mail and allowed origins
php artisan key:generate
php artisan jwt:secret
php artisan migrate
# Seed only after reviewing the warning below:
php artisan db:seed
php artisan serve

# Tests (configured test database required)
vendor/bin/phpunit
```

**Database and seeding:** historical migrations cover only part of the existing application schema; a fresh database may require a provisioned schema from the target environment. Review migrations and back up data before applying them. Some seeders update existing role abilities and entitlements, so review them and test in staging before running against an established database. Never commit `.env`, credentials, uploads or generated builds.

The frontend test suite uses demo data and mocked HTTP contracts; it does not replace integration tests against a running Laravel service. See [`docs/TESTING.md`](docs/TESTING.md), [`docs/MODULES.md`](docs/MODULES.md) and [`docs/README.md`](docs/README.md) for testing, backend provisioning and historical records.
