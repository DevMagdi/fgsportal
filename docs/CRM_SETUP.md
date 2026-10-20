# CRM setup — users, industries, accounts, contacts and leads

This guide covers the data the CRM module needs before a team can create
**leads**, and the exact commands/endpoints used to create them. All backend
work lives under `backend/`.

## 1. What the CRM needs

A lead cannot be created until these lookup rows exist (validated by
`ContactLeadController::CreateContactLead`):

| Required row | Table | Seeder |
| --- | --- | --- |
| At least one lead sub-status (with parent status) | `contact_lead_sub_statuses` → `contact_lead_statuses` | ✅ |
| At least one lead type | `contact_lead_types` | ✅ |
| At least one contact (belongs to an account) | `contacts` → `partners` | — created per client |
| A campaign (the API defaults `campagin_id` to `1`) | `campagins` | ✅ `Default Campaign` |

Accounts (`partners`) additionally reference **industries**
(`partner_industries`) and **organisation types** (`organization_types`).
Users reference `sub_departments` (role) and `work_degrees` (position).

## 2. One-time setup on a fresh database

```bash
cd backend
php artisan migrate
php artisan db:seed --class=CrmDemoSeeder
```

`CrmDemoSeeder` is idempotent (`firstOrCreate`) — re-running it never
duplicates rows. It creates:

- 8 partner industries and 5 organisation types
- a **Sales** department with **Sales Team** / **Marketing** sub-departments
- 3 work degrees (Sales Representative, Sales Manager, Account Manager)
- 4 lead statuses with 3 linked sub-statuses, 5 lead types, 4 cost types
- a `Default Product` and `Default Campaign` (so the fallback `campagin_id = 1`
  always resolves and lead responses never 500)

## 3. Creating users

There is no public self-registration: `POST /api/users/createAccount` requires
an already-authenticated user (valid `token`) plus a valid `accRole`
(sub-department id) and `accPosition` (work-degree id). On an empty database the
**first** user is therefore bootstrapped with tinker:

```bash
php artisan tinker
```

```php
$details = App\Models\UserDetail::create([
    'hiringDate'        => now()->toDateString(),
    'contractStartDate' => now()->toDateString(),
    'contractEndDate'   => now()->addYear()->toDateString(),
]);

App\Models\User::create([
    'username'           => 'salesuser01',          // min 6 chars, unique
    'firstname'          => 'Sara',
    'lastname'           => 'Ahmed',
    'email'              => 'sara@example.com',     // unique
    'password'           => Illuminate\Support\Facades\Hash::make('change-me-123'),
    'mobileNumber'       => '+201000000000',
    'gender'             => 'female',
    'active'             => 1,
    'user_details_id'    => $details->id,
    'sub_departments_id' => App\Models\SubDepartment::first()->id,
    'work_degrees_id'    => App\Models\WorkDegree::first()->id,
    'token'              => Illuminate\Support\Str::random(60),
]);
```

After that, every additional user can be created from the UI (the user
management screen calls `POST /api/users/createAccount`) or by repeating the
snippet. Login is `POST /api/users/login` with `email` + `password`.

## 4. Creating industries

**UI / API** — the Settings → Industries screen calls:

```
POST /api/users/CreatePartnerIndustry
Authorization: Bearer <jwt>
{ "token": "<user token>", "partner_industry_name": "Technology" }
```

The name must be unique; duplicates return HTTP 400.

**Tinker equivalent:**

```php
App\Models\PartnerIndustry::firstOrCreate(['partner_industry_name' => 'Logistics']);
App\Models\OrganizationType::firstOrCreate(['organize_type' => 'Branch']);
```

## 5. The lead journey (end to end)

1. **Account** — `POST /api/users/CreatePartner` with `partner_name` (unique),
   optional `partner_industry_id`, `organize_type_id`, phone/email/website.
2. **Contact** — `POST /api/users/CreateContact` with the account's
   `partner_id`, `name`, and either `email` or `phone`. Note `phone` is an
   **array of typed numbers** (the model casts it to JSON):
   `"phone": [{"phone": "+201111111111", "phone_type": "mobile"}]`.
3. **Lead** — `POST /api/users/CreateContactLead` with `contact_id`,
   `lead_sub_status_id`, `lead_type_id` (all required and must exist), optional
   `product_id`, `sales_id`, `cost`, `currency`, `notes`. `campagin_id`
   defaults to the seeded `Default Campaign`.

The same journey is covered end-to-end over HTTP by
`tests/Feature/CrmFlowTest.php`, and at the schema/model level by
`tests/Feature/CrmSchemaTest.php` and `tests/Feature/CrmDemoSeederTest.php`.

## 6. Migration notes

- All new CRM migrations are guarded (`Schema::hasTable` / `hasColumn`) so they
  are no-ops on legacy databases that already contain these tables.
- Eight legacy migration pairs declared the same PHP class and made a full
  `php artisan migrate` fatal. The later file of each pair is now suffixed
  `_v2` (matching the framework's filename-derived class names) and only adds
  missing columns/tables — it never drops production data.
- `2022_08_30_900000_create_users_table.php` misused `integer($column, 2)`
  (the second argument is `$autoIncrement`, creating extra primary keys) and
  declared the `gender` column twice; both are corrected.
