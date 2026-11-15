# BMS local authenticated QA: blocker and safe setup

**Current feature branch:** `arena/cde8af1e-fgsportal`
**Status:** authenticated BMS browser QA is blocked. No credentials, local environment files, production services, or permission checks were bypassed or changed during this investigation.

## What authentication actually uses

The sign-in form does **not** authenticate through Firebase Authentication. `AuthApiService.login()` posts the supplied username/email and password to `POST ${environment.newServerApi}/api/users/login`. The Laravel endpoint returns the application's JWT, which is stored by the existing session code. `BmsApiService` sends that JWT as `Authorization: Bearer …` to `${environment.newServerApi}/api/bms/...`. The BMS API and route guards remain permission- and module-gated.

Firebase is initialized globally by AngularFire and its Realtime Database is used by shared legacy services. It is therefore part of a normal app setup, but Firebase is not the source of the BMS user's login or BMS permission grant. The current development `environment.ts` has placeholder Firebase/API values and omits `databaseURL`; the example/prod files also contain placeholders. The previous browser launch consequently showed Firebase connection failures and the sign-in page, not an authenticated BMS route.

## Findings in this checkout/sandbox

- `frontend/src/environments/environment.ts`, `environment.prod.ts`, and `environment.example.ts` are tracked source files. The development and production files contain `YOUR_FIREBASE_*`, `YOUR_BACKEND_API_BASE_URL`, and `YOUR_LEGACY_SERVER_API_URL` placeholders. **Do not put machine-specific QA values into the active feature branch.**
- `frontend/.firebaserc` maps its default Firebase CLI project alias to `fgspmproduction`. `frontend/firebase.json` has hosting/database/storage rules but no emulator configuration. Firebase CLI and Java are absent. Do not run Firebase deploy/hosting commands or point QA at that alias.
- There is no `backend/.env` (only the tracked `.env.example`), no `backend/vendor`, no local SQLite database file, and no frontend/backend Firebase or database environment variables in this process.
- PHP, Composer, Docker/Podman, MySQL/MariaDB and PostgreSQL clients are absent. No backend/database/API ports are listening and no backend process is available. The frontend production build works, but the local development server is not running now.
- No authorized interactive QA account/session or approved non-production BMS data source is present. The credentials in backend unit-test fixtures are not an interactive account and must not be reused as one.
- `backend/routes/api.php` protects BMS APIs with JWT verification and `module:bms`; individual operations also enforce BMS abilities. `backend/app/Http/Middleware/Cors.php` uses `CORS_ALLOWED_ORIGINS` for BMS routes, so a browser origin must be explicitly allowed.

## Minimum safe prerequisites

1. **A non-production backend and isolated database.** Use a local or approved staging Laravel instance, never the production database. It needs the repository's Laravel dependencies, a configured DB with the existing migrations/schema, a generated local `APP_KEY`, and a generated local `JWT_SECRET`. Configure the actual local DB connection in that backend's ignored `.env`. Keep `MODULES_FAIL_OPEN=false`; provision the `bms` module entitlement and role/ability rows through the approved setup rather than weakening guards. Use only an approved non-production test account and data.
2. **Backend browser access/CORS.** Set `CORS_ALLOWED_ORIGINS` to the exact frontend origin used by Chromium (for local dev, typically `http://localhost:4200`). The frontend's `newServerApi` must be the backend origin only (for example, `http://localhost:8000`, without `/api`); the client appends `/api/users/login` and `/api/bms/...`. For a remote browser preview, use an approved HTTPS backend origin reachable from that browser—never put `localhost`/`127.0.0.1` into code used by the remote browser.
3. **Non-production Firebase web configuration.** In a disposable local QA copy, provide that non-production Firebase app's `apiKey`, `authDomain`, `databaseURL`, `projectId`, `storageBucket`, `messagingSenderId`, and `appId` to AngularFire. `databaseURL` must point to the non-production Realtime Database, not the repository's production default. If legacy mail endpoints are in scope, `serverAPI` needs its separate service; it is not the BMS login/API base. FCM server keys and service-account credentials are not needed to authenticate or render core BMS screens; do not expose server keys in frontend code.
4. **A least-privilege QA account.** For read-only coverage of all 19 authenticated route patterns, the account needs the corresponding BMS view abilities: `dashboard.view`, `units.view`, `plans.view`, `opportunities.view`, `products.view`, `meetings.view`, `reports.view`, `roles.manage` for Access, `directory.view`, and the seven collection view abilities (`development.view`, `leads.view`, `recruitment.view`, `procurement.view`, `events.view`, `documents.view`; directory collection shares directory access). Only add narrowly scoped management abilities if write-interaction testing is explicitly approved against an isolated database. Do not grant broad privileges in production.

## Safest manual setup

1. Create a **disposable, private copy** of this working tree for local QA. This avoids changing the tracked `frontend/src/environments/environment.ts` or the active branch. Do not copy real production records or credentials into the copy.
2. In that copy only, configure its frontend development environment with the non-production Firebase web values above and `newServerApi` for the isolated backend. Leave production environment files and `frontend/.firebaserc` alone; do not run Firebase CLI deployment commands.
3. On the isolated backend only, create `backend/.env` from `.env.example` if no local `.env` already exists. Set local DB connection values, generate fresh app/JWT secrets with Laravel's documented artisan generators, set `CORS_ALLOWED_ORIGINS` to the exact browser origin, set `MODULES_FAIL_OPEN=false`, and explicitly set any Firebase Realtime Database URL to the non-production instance. Do not use the example's default MySQL/root settings as-is. Do not run migrations/seeds until the target DB is confirmed disposable and isolated.
4. Have the environment owner provision the BMS module entitlement, an approved non-production account with only the required abilities, and authorized non-production records. Do not send passwords, bearer tokens, Firebase secrets, or service-account files in chat.
5. Start the backend and frontend locally (or expose them through an approved test-only HTTPS route), then confirm `/api/users/login`, `/api/bms/lookups`, and a read-only BMS endpoint work under the account before UI verification. Keep permission denials visible; do not seed a browser token or alter guards.
6. Once that environment is available to the QA browser, capture actual Chromium pages at 1440×1000, 768×1024, and 390×844 in English/LTR and Arabic/RTL. Exercise navigation, filters, empty/populated states, and safe read-only actions first. Test writes only on the isolated DB, inspect API responses and browser console, and record screenshots by route, language, and viewport.

## Coverage counts (implementation and verification are separate)

| Measure | Implementation/source inventory | Authenticated verification |
|---|---:|---:|
| Component-backed BMS route patterns | 20: 19 guarded routes plus `/bms/no-access`; the empty route is a redirect (21 route declarations total) | 0 authenticated page renders; attempted BMS URLs redirected to sign-in |
| Fixed authenticated route templates | 12 have page-specific source/template edits | 0/12 browser-verified |
| Catalog-driven collection variants | 7 route configurations share one modified `BmsCollectionComponent`; not counted as seven independent page redesigns | 0/7 browser-verified |
| BMS HTML component templates | 17 inventoried, including route templates, embedded unit teams, and shared dialog/state templates | 0 authenticated templates visually verified |
| Auth-boundary screenshot | Not a BMS implementation screen | One genuine sign-in redirect capture: `docs/design/bms-auth-blocked-1440x1000.png`; **not** BMS acceptance evidence |

**Disposition:** keep BMS active. The separate implementation/verification matrix is in [`BMS_VISUAL_COVERAGE.md`](BMS_VISUAL_COVERAGE.md). No production configuration change or authenticated screenshot was made as part of this setup investigation. Resume visual QA when a safe non-production backend, Firebase configuration, and authorized account/session are available to the browser without sharing credentials in chat.
