# FGS Connect — Modularization Plan & Architecture

## 1. Current state analysis

### Repository layout

| Path | Stack | Role |
| --- | --- | --- |
| `frontend/` | Angular 13 (lazy modules, PrimeNG/Material) | Single-page portal (source of truth for all UI code/builds) |
| `backend/` | Laravel 8 + JWT (tymon/jwt-auth) | **Main backend** — all API code, 191 controllers, 178 models, 105 migrations |
| `docs/` | Markdown | Module catalogue and provisioning guides |

> The legacy `FrontEndApiTest/system/`, the partial root `system/` copy and the
> production Angular build dumped at the repository root were removed during the
> repository cleanup; all server code now lives under `backend/`.

### Existing functional modules (before this work)

- **Angular lazy modules**: `crm`, `hr`, `admin`, `dev`, `manager`, `client` (plus root-level ticketing views).
- **Backend controller namespaces** mapped to business domains:
  `User\Business` (CRM), `Client\TicketingSystem` (ticketing), `Project` (projects),
  `HRModule` (HR), `Settings` / `User\PermissionGroup` (administration),
  `User\Auth` / `User\Profile` (core users & auth).
- Authentication is JWT-based. Two protected route groups exist in `routes/api.php`
  (`/api/users/*` and `/api/clients/*`) behind the `jwt.verify` middleware.
- There is **no companies/organizations/tenants table**. The closest grouping is
  `branches`. The existing `licenses` table models software licences sold to
  partners (a CRM domain object), **not** SaaS licensing.

### Key decision: which tenant key?

The brief allowed `company_id`, `organization_id` or `user_id`. Because no
company/organization table existed, the modular system introduces a first-class
**`companies`** table (the sellable client/tenant) and a nullable
`users.company_id`. A seeded **default company** keeps the current single-tenant
deployment 100 % compatible: every legacy user is attached to it and every module
is enabled for it.

## 2. Target architecture

```
                 ┌────────────────────────────┐
                 │ modules (catalogue)        │
                 │ core, crm, ticketing,      │
                 │ projects, hr, admin        │
                 └──────────────┬─────────────┘
                                │ 1..*
                 ┌──────────────▼─────────────┐
                 │ company_modules (entitlement)
                 │ company_id + module_id     │
                 │ is_enabled / enabled_at    │
                 └──────────────┬─────────────┘
                                │ *..1
                 ┌──────────────▼─────────────┐
                 │ companies (tenant/client)  │
                 └──────────────┬─────────────┘
                                │ 1..*
                 ┌──────────────▼─────────────┐
                 │ users.company_id           │
                 └────────────────────────────┘
```

- **Core module** (`core` = Users + Auth + Permissions) is always enabled and
  cannot be disabled.
- A client can buy any combination, e.g. **core + crm only** — every other API
  and UI surface is then blocked/hidden.

## 3. Backend implementation (Laravel 8)

### Database

Migrations (all SQLite/MySQL compatible, guarded with `Schema::hasTable`):

1. `create_companies_table`
2. `add_company_id_to_users_table` (indexed, no hard FK for portability)
3. `create_modules_table`
4. `create_company_modules_table` (unique company/module pair, FKs)

### Models & service

- `App\Models\Company`, `App\Models\Module`, `App\Models\CompanyModule`.
- `User::company()` and `User::hasModule('crm')` helpers.
- `App\Services\ModuleService` — resolves the current company, evaluates
  entitlements (core ⇒ always on), caches results for 5 minutes and supports a
  **fail-open** mode (`MODULES_FAIL_OPEN`) for legacy un-provisioned tenants.

### Middleware

`App\Http\Middleware\CheckModule`, registered as the **`module`** route alias:

- Explicit: `->middleware('module:crm')` (supports several slugs, ANY match wins).
- Bare: `->middleware('module')` resolves the required module from the controller
  handling the route via `config/modules.php → controller_map`.
- Unmapped controllers are Core and always pass.
- Denied requests return HTTP **403** with a clear JSON message.

The two protected route groups in `routes/api.php` now run the bare `module`
middleware, so all **114 non-core controllers** are protected centrally with a
two-line change instead of editing ~1 000 routes. The 12 unmapped controllers
(auth, profile, dashboard, notes, messaging, …) are intentionally Core.

### Module → controller mapping (summary)

| Module | Controller namespaces (prefixes) |
| --- | --- |
| `crm` | `User\Business`, `Client\Partner\OrganizationTypeController` |
| `ticketing` | `Client\TicketingSystem`, `Client\Partner\PartnerController`, `Settings\License`, `Rating`, `InstallmentFeature` |
| `projects` | `Project`, `AdminReport`, `Report`, `TaskTeamController`, `User\Manager\ManagerReportController`, `User\OpenToWork` |
| `hr` | `HRModule`, `User\Salary`, `User\FamilyInformation`, `Settings\Annual`, `Settings\Incentive`, `Settings\TransportationRequest`, `Settings\WorkHours` |
| `admin` | `Settings\{Department,DeveloperDivision,WorkDegree,Permission,Product,Logs,PublicRequest,Announce}`, `User\PermissionGroup`, `User\Dashboard\AdminDashboardController` |
| `core` (unmapped) | `User\Auth`, `User\Profile`, `User\Dashboard\DashboardController`, `Client\Auth`, `ApiMessage`, `Tools`, `ToDo`, `DatabaseConvert*` |

### Management API (JWT + Management/Administration only)

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/modules` | Full catalogue + current company status |
| GET | `/api/company/modules` | Modules enabled for the caller's company |
| POST | `/api/company/modules/enable` | body `{module_slug}` or `{module_id}` |
| POST | `/api/company/modules/disable` | body `{module_slug}` or `{module_id}` |

Core modules cannot be toggled (HTTP 422). Non-administrators receive 403.

### Seeders

`ModulesTableSeeder` (6 modules), `CompaniesTableSeeder` (default company +
back-fill of users), `CompanyModulesTableSeeder` (all modules enabled for the
default company). Wired through `DatabaseSeeder`.

## 4. Frontend implementation (Angular 13)

- `services/module.service.ts` — `BehaviorSubject<string[]>` of enabled slugs,
  mirrored in `localStorage('enabledModules')`, fetched from
  `GET /api/company/modules` after login and on app bootstrap; helpers
  `isModuleEnabled(slug)` / `getEnabledModules()`.
- `services/module.guard.ts` — generic `CanActivate` guard reading
  `route.data.module`; waits for the first entitlement load and redirects to the
  new **Module not enabled** page (`components/module-disabled`).
- `app-routing.module.ts` — guards on every lazy module:
  CRM → `crm`, HR → `hr`, Admin panel → `admin`, Manager/Dev → `projects`,
  Tickets/Support reports → `ticketing`.
- `navbar.component` — every menu section (CRM, Project Management, Support,
  HR, Finance, Requests, Administration, Dev) is rendered only when its module
  is enabled.
- Logout clears cached entitlements.

## 5. Backward compatibility

- The default company is provisioned with **all** modules enabled, so an
  upgraded deployment behaves exactly as before.
- `MODULES_FAIL_OPEN=true` (default) lets legacy companies without entitlement
  rows keep working; set it to `false` for strict commercial enforcement.
- No existing route, controller or model was removed; changes are additive.

## 6. Security cleanup (Phase 0)

- Removed tracked `system/.env` (DB/mail/JWT secrets) and TLS private key/certs.
- FTP host/user/password removed from `frontend/package.json` → environment vars.
- Firebase/FCM/exchange-rate keys replaced with placeholders;
  `environment.example.ts` added.
- Comprehensive root `.gitignore` (`.env`, `vendor`, `node_modules`, certs, builds).

## 7. Testing

- Backend: 19 PHPUnit feature tests (seeder, middleware allow/deny/core/fail-open,
  management endpoints, auth & validation), running on in-memory SQLite.
- Frontend: Karma/Jasmine specs for `ModuleService` and `ModuleGuard`.

## 8. Known pre-existing issue (out of scope)

`routes/api.php` references `PublicRequestTypeController`, a class that does not
exist in the repository. It only affects `artisan route:list` / route caching;
runtime routing is unaffected. It should be removed or implemented in a follow-up.
