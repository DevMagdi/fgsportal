# Modules — catalogue & client provisioning

FGS Connect is sold as a **core platform plus optional modules**. Each module is
enabled or disabled per **company** (the client/tenant). The Core module is
always present.

## 1. Module catalogue

| Slug | Module | Core | Contents |
| --- | --- | --- | --- |
| `core` | Core (Users, Auth & Permissions) | ✅ | Authentication, users, roles, permission groups, profile, notifications, notes |
| `crm` | CRM | — | Leads, contacts, accounts, activities, campaigns, POC & RFP requests, partner organisation types |
| `ticketing` | Ticketing & Support | — | Client tickets, contract support, client accounts, partner & licence management, satisfaction ratings, installments/finance |
| `projects` | Projects | — | Projects, processes, tasks, timesheets, reports, PM team requests, open-to-work |
| `hr` | Human Resources | — | Recruitment & onboarding, salaries, vacations/annual requests, incentives, transport requests, work hours, company policies |
| `admin` | Administration | — | Departments, products, permissions, work degrees, public requests, announcements, logs, admin dashboard |

Module metadata lives in the `modules` table; per-client entitlements live in
`company_modules`.

## 2. How enforcement works

- **Backend** — every request to `/api/users/*` or `/api/clients/*` passes
  through the `module` middleware (`App\Http\Middleware\CheckModule`). It maps
  the target controller to a module slug via `config/modules.php` and returns
  **HTTP 403** when the caller's company has not enabled that module. Core
  controllers are not mapped and always pass.
- **Frontend** — after login the app calls `GET /api/company/modules`, stores the
  enabled slugs (memory + `localStorage`) and (a) hides disabled menu sections in
  the navbar and (b) blocks disabled lazy routes with `ModuleGuard`, redirecting to
  the `/module-disabled` page.
- **Modules dashboard (`/modules`)** — the `ModulesCardsComponent` loads the full
  catalogue from `GET /api/modules` and renders **all six modules as cards** (name,
  description, icon, state). Enabled cards are normal and navigate into the module;
  disabled modules are never hidden — they stay visible but are **dimmed/grayed
  with a lock badge**, and clicking one routes to
  `/module-disabled?module=<slug>` instead of entering the module. Deep links to
  disabled lazy routes are still blocked by `ModuleGuard`.
- **Module feature pages (`/modules/:slug`)** — clicking an enabled module opens
  `ModuleDetailsComponent`, which renders **one card per sidebar section** of that
  module (e.g. CRM: Insights, Reports, Organizations, Contacts, Activities,
  Requests, Leads, Opportunity, Closed Deal). The titles, router targets and
  visibility rules mirror the navbar exactly and live in one declarative registry,
  `frontend/src/app/services/module-pages.registry.ts` (permission, department,
  role, position, manager/admin and `or`/`and`/`not` conditions). Each feature
  card navigates to the real route, whose existing guards still apply; users
  without any visible feature get an explicit empty state instead of a blank page.

## 3. Enable a module for a client

### Via API (recommended)

Only users whose `sub_departments_id` is Management (`1`) or Administration (`4`)
can change entitlements.

```bash
# 1. inspect the catalogue and current status
curl -H "Authorization: Bearer $JWT" \
  https://api.example.com/api/modules

# 2. enable CRM for the caller's company
curl -X POST -H "Authorization: Bearer $JWT" -H "Content-Type: application/json" \
  -d '{"module_slug":"crm"}' \
  https://api.example.com/api/company/modules/enable

# 3. disable CRM
curl -X POST -H "Authorization: Bearer $JWT" -H "Content-Type: application/json" \
  -d '{"module_slug":"crm"}' \
  https://api.example.com/api/company/modules/disable
```

`module_id` is accepted instead of `module_slug`. The Core module cannot be
disabled (returns 422).

### Via database / seeder

```php
$company = \App\Models\Company::where('slug', 'client-a')->first();
$module  = \App\Models\Module::where('slug', 'crm')->first();

\App\Models\CompanyModule::updateOrCreate(
    ['company_id' => $company->id, 'module_id' => $module->id],
    ['is_enabled' => true, 'enabled_at' => now()]
);
```

### Onboard a brand-new client

```php
$company = \App\Models\Company::create([
    'name' => 'Client A',
    'slug' => 'client-a',
    'is_active' => true,
]);

// attach the client's users
\App\Models\User::whereIn('id', [...])->update(['company_id' => $company->id]);

// give them Core + CRM only
foreach (['core', 'crm'] as $slug) {
    $module = \App\Models\Module::where('slug', $slug)->first();
    \App\Models\CompanyModule::create([
        'company_id' => $company->id,
        'module_id' => $module->id,
        'is_enabled' => true,
        'enabled_at' => now(),
    ]);
}
```

## 4. Environment variables

| Variable | Default | Effect |
| --- | --- | --- |
| `MODULES_FAIL_OPEN` | `true` | Companies without any `company_modules` row are allowed through (legacy compatibility). Set `false` for strict commercial enforcement. |

Entitlement decisions are cached for 5 minutes per company/module; the enable /
disable endpoints flush the relevant cache entry automatically.

## 5. Adding a new module later

1. Add a row to the `modules` table (via a seeder) with a unique slug.
2. Add the controller namespace → slug mapping in `config/modules.php`.
3. Add a lazy Angular route guarded with `data: { module: '<slug>' }` and a navbar
   section gated by `isModuleEnabled('<slug>')`.
4. Add the slug to `MODULE_SLUGS` / `MODULE_META` and its feature list to
   `MODULE_PAGES` in `services/module-pages.registry.ts` (titles, icons, routes
   and the same visibility conditions as the navbar) so it appears on the modules
   dashboard and gets a feature-cards landing page.
5. Provision the module to companies through the enable endpoint.
