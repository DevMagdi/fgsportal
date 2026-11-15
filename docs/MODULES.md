# Backend modules and client provisioning

The Laravel API maintains a module catalogue in `modules` and per-company entitlements in `company_modules`. The seed catalogue contains the core `bms` and `core` entries and the optional `crm`, `ticketing`, `projects`, `hr` and `admin` entries. BMS role abilities and business-unit scope remain separate from module entitlements.

`App\Http\Middleware\CheckModule` checks explicit module slugs or resolves controller namespaces through `backend/config/modules.php`; mapped requests for disabled modules receive HTTP 403. Unmapped controllers pass this middleware. The React BMS navigation is filtered by BMS abilities and does not provide an optional-module catalogue or provisioning screen. The backend remains authoritative for all access decisions.

## Management API

The following routes require a JWT; the backend restricts entitlement changes to its authorized management/administration users:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/modules` | Catalogue with company status |
| GET | `/api/company/modules` | Enabled modules for the caller's company |
| POST | `/api/company/modules/enable` | Enable by `module_slug` or `module_id` |
| POST | `/api/company/modules/disable` | Disable by `module_slug` or `module_id` |

Core modules cannot be disabled. Entitlements are cached for five minutes; management endpoints clear the relevant cache. `MODULES_FAIL_OPEN=true` allows requests when a company or the relevant module entitlement row is missing; set it to `false` only after verifying provisioning and the desired policy.

Before running seeders, back up and review the target database: seeders can update existing role abilities and module metadata. For setup and test commands see [`../README.md`](../README.md) and [`TESTING.md`](TESTING.md). The [previous module guide](https://github.com/DevMagdi/fgsportal/blob/72953827d23608af32201d03065ef85f08fc5b85/docs/MODULES.md) remains available as historical context.
