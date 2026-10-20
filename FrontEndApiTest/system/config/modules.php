<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Fail open for un-provisioned companies
    |--------------------------------------------------------------------------
    |
    | When a company has no row in company_modules at all (legacy tenants
    | created before the modular system), the middleware allows every request
    | instead of locking users out. Newly seeded companies are provisioned
    | explicitly by the seeders, so this only affects legacy data.
    */
    'fail_open' => env('MODULES_FAIL_OPEN', true),

    /*
    |--------------------------------------------------------------------------
    | Default tenant
    |--------------------------------------------------------------------------
    |
    | Users without a company_id are treated as members of this company.
    */
    'default_company_slug' => 'default',

    /*
    |--------------------------------------------------------------------------
    | Sub-departments allowed to enable/disable modules for a company
    |--------------------------------------------------------------------------
    | 1 = Management, 4 = Administration (see frontend Department enum).
    */
    'admin_sub_departments' => [1, 4],

    /*
    |--------------------------------------------------------------------------
    | Controller namespace prefix => module slug
    |--------------------------------------------------------------------------
    |
    | The CheckModule middleware resolves the controller handling the current
    | route and walks this ordered list of namespace prefixes. Anything not
    | matched belongs to the Core module (Users + Auth + Permissions) and is
    | always allowed. Explicit `module:slug` middleware on a route takes
    | precedence over this map.
    |
    */
    'controller_map' => [

        // ===== CRM: sales, leads, contacts, campaigns, POC/RFP, partners =====
        'App\\Http\\Controllers\\User\\Business' => 'crm',
        'App\\Http\\Controllers\\Client\\Partner\\OrganizationTypeController' => 'crm',

        // ===== Ticketing: support portal, tickets, contracts, client accounts,
        // partner/licence management, satisfaction ratings, installments =====
        'App\\Http\\Controllers\\Client\\TicketingSystem' => 'ticketing',
        'App\\Http\\Controllers\\Client\\Partner\\PartnerController' => 'ticketing',
        'App\\Http\\Controllers\\Settings\\License' => 'ticketing',
        'App\\Http\\Controllers\\Rating' => 'ticketing',
        'App\\Http\\Controllers\\InstallmentFeature' => 'ticketing',

        // ===== Projects: projects, processes, tasks, reports, PM team =====
        'App\\Http\\Controllers\\Project' => 'projects',
        'App\\Http\\Controllers\\AdminReport' => 'projects',
        'App\\Http\\Controllers\\Report' => 'projects',
        'App\\Http\\Controllers\\TaskTeamController' => 'projects',
        'App\\Http\\Controllers\\User\\Manager\\ManagerReportController' => 'projects',
        'App\\Http\\Controllers\\User\\OpenToWork' => 'projects',

        // ===== HR: recruitment, salaries, vacations, incentives, transport =====
        'App\\Http\\Controllers\\HRModule' => 'hr',
        'App\\Http\\Controllers\\User\\Salary' => 'hr',
        'App\\Http\\Controllers\\User\\FamilyInformation' => 'hr',
        'App\\Http\\Controllers\\Settings\\Annual' => 'hr',
        'App\\Http\\Controllers\\Settings\\Incentive' => 'hr',
        'App\\Http\\Controllers\\Settings\\TransportationRequest' => 'hr',
        'App\\Http\\Controllers\\Settings\\WorkHours' => 'hr',

        // ===== Admin: organisational settings, permissions, logs, announcements =====
        'App\\Http\\Controllers\\Settings\\Department' => 'admin',
        'App\\Http\\Controllers\\Settings\\DeveloperDivision' => 'admin',
        'App\\Http\\Controllers\\Settings\\WorkDegree' => 'admin',
        'App\\Http\\Controllers\\Settings\\Permission' => 'admin',
        'App\\Http\\Controllers\\Settings\\Product' => 'admin',
        'App\\Http\\Controllers\\Settings\\Logs' => 'admin',
        'App\\Http\\Controllers\\Settings\\PublicRequest' => 'admin',
        'App\\Http\\Controllers\\Settings\\Announce' => 'admin',
        'App\\Http\\Controllers\\User\\PermissionGroup' => 'admin',
        'App\\Http\\Controllers\\User\\Dashboard\\AdminDashboardController' => 'admin',

        // ===== Core (unmapped => always allowed) =====
        // User\Auth, User\Profile, User\Dashboard\DashboardController,
        // Client\Auth, ApiMessage, Tools, ToDo, DatabaseConvert* ...
    ],

];
