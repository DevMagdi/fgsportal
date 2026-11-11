# BMS Phase 1 — implementation and test guide

## Provision

From `backend/`:

```bash
composer install
cp .env.example .env # configure the existing application database first
php artisan migrate
php artisan db:seed
```

The seeder is idempotent. It creates Alpha Iota and its four units, the Kraken and Argus products, enables the `bms` module for the default company, and creates the BMS roles. Existing Management users receive `system_admin` once so they can assign narrower roles. Unit directors receive `unit_director` automatically when a unit is saved.

## Role assignment

Open **Business Units → BMS role assignment**. The server-side matrix is in `database/seeders/BmsPhaseOneSeeder.php`; authorization is centralized in `app/Services/BMS/BmsAccess.php` and enforced by `bms.permission` middleware. Unit membership is additionally checked for plans and tasks. Department managers can only respond to support requests addressed to their own department.

| Role | Phase 1 access |
| --- | --- |
| System Administrator | All BMS abilities and role assignment |
| Executive Management | Unified read-only dashboard and exports |
| Operations | Register/update/import opportunities and tenders; dashboard |
| Unit Director | Own-unit plans/tasks/support and product tracking; dashboard |
| Department Manager | View plans/products and answer own-department support |
| Alpha Delta | Record Go/No-Go with a mandatory reason; dashboard/opportunity view |
| Employee | View own-unit plans/products, update own tasks, request support |

## Acceptance paths

1. **Units:** create/edit a unit profile, add services, director and multiple members. Confirm that a member can open only their own-unit plans.
2. **Weekly plans:** create a plan whose week starts Sunday, add tasks and support requests, update achievement/progress/blockers, submit it, and download its system-generated Sunday report. Submitted plans are read-only except task/support progress endpoints.
3. **Opportunities:** as Operations, register an opportunity/tender and move its stage. Confirm each stage appears in history. Import `.xlsx`, `.xls`, or CSV tracker data from the UI; accepted headers include `reference`, `title`/`opportunity_name`, `client_name`/`client`, `type`, `unit`, `product`, `stage`, `value`, `currency`, `submission_date`, `expected_close_date`, and `last_update`. Unit/product names or IDs are accepted. As Alpha Delta, record Go or No-Go and a reason. Verify delayed and seven-day no-update alerts.
4. **Products:** add product phases, mark the current phase, record blockers/data/support needs, and assign multiple owning units. Kraken and Argus are pre-seeded; Argus can be shared.
5. **Executive dashboard:** filter by unit, product, opportunity, and optional week. Review unit progress, submitted/delayed/stale tenders and product status. Export all sections to Excel or PDF.
6. **Audit:** status and decision records are in `bms_audit_logs`; opportunity stage transitions additionally remain in `bms_opportunity_stage_histories`.
7. **Language:** use the language button on any BMS screen. All Phase 1 screen controls switch between English and Arabic, with RTL layout.

## Verification

- `cd frontend && npm ci --legacy-peer-deps && npm run build -- --configuration development`
- `cd frontend && npm run test:node`
- `cd backend && php artisan test --filter=BmsPhaseOneTest`

The sandbox used for implementation does not provide PHP/Composer, so the Laravel test must run in the backend environment. All new/changed PHP files were parsed with a PHP parser during implementation; this is not a substitute for PHPUnit.
