import { AccountPositions, AccountRoles, Department } from '../interfaces/user';
import {
  evaluateCondition,
  MODULE_META,
  MODULE_PAGES,
  MODULE_SLUGS,
  PageVisibilityContext,
  visiblePages,
  visibleSections,
} from './module-pages.registry';

const ctx = (overrides: Partial<PageVisibilityContext> = {}): PageVisibilityContext => ({
  user: {
    department: Department.TECHNICAL_TEAM,
    accRole: AccountRoles.SUPPORT,
    accPosition: AccountPositions.JUNIOR,
  },
  permissionIds: [],
  isManager: false,
  isAdmin: false,
  ...overrides,
});

describe('module-pages registry', () => {
  it('defines pages for every sellable module, with unique valid router targets', () => {
    MODULE_SLUGS.forEach((slug) => {
      const pages = MODULE_PAGES[slug];
      expect(pages.length).toBeGreaterThan(0);
      pages.forEach((page) => {
        expect(page.title.length).toBeGreaterThan(0);
        expect(page.icon).toContain('bx ');
        if (typeof page.route === 'string') {
          expect(page.route.startsWith('/')).toBeTrue();
        } else {
          expect(Array.isArray(page.route)).toBeTrue();
          expect((page.route as unknown[]).length).toBeGreaterThan(0);
        }
      });
    });

    MODULE_SLUGS.forEach((slug) => expect(MODULE_META[slug]).toBeTruthy());
  });

  it('mirrors the nine CRM sidebar sections in order', () => {
    const managementContext = ctx({
      user: {
        department: Department.MANAGEMENT,
        accRole: AccountRoles.CEO,
        accPosition: AccountPositions.MANAGER,
      },
      isManager: true,
    });
    const titles = visiblePages('crm', managementContext).map((p) => p.title);
    expect(titles).toEqual([
      'Insights',
      'Reports',
      'Organizations',
      'Contacts',
      'Activities',
      'Requests',
      'Leads',
      'Opportunity',
      'Closed Deal',
    ]);
  });

  // Every active routerLink declared in navbar.component.html (excluding pure
  // application chrome: brand, the modules dashboard itself, notifications and
  // the current-user profile) must be reachable as a module overview card,
  // and every registry route must be a real sidebar link.
  it('keeps full route parity with the active sidebar links', () => {
    const sidebarRoutes = [
      '/my_work',
      '/notes',
      '/admin-panel/dashboard',
      '/support-reports',
      '/CRM/dashboard',
      '/CRM/reports',
      '/CRM/accounts',
      '/CRM/contacts',
      '/CRM/activities',
      '/CRM/poc-requests',
      '/CRM/leads',
      '/CRM/opportunity',
      '/CRM/closed',
      '/CRM/requests',
      '/publicReqsApply',
      '/manager/apporval',
      '/manager/projects',
      '/manager/reports',
      '/manager/costs',
      '/manager/devprog',
      '/manager/available',
      '/manager/public_reports',
      '/manager/admin_tasks',
      '/manager/project-manager-reports',
      '/manager/rating',
      '/dev/timesheet',
      '/dev/reportsToApprove',
      '/dev/reports',
      '/dev/requests',
      '/dev/myprojects',
      '/users',
      '/manager/client-support',
      '/tickets',
      '/manager/license',
      '/manager/partners',
      ['/manager/installments', 't'].join(' '),
      ['/manager/installments', 'v'].join(' '),
      '/manager/salaries',
      '/admin-panel/vacations',
      '/admin-panel/announces',
      '/hr/hiring-process/candidates',
      '/hr/hiring-process/job-profiles',
      '/hr/hiring-process/job-skills',
      '/manager/publicreqs',
      '/admin-panel/pendingtransportations',
      '/admin-panel/transportationsheet',
      '/manager/incentive',
      '/manager/addusers',
      '/admin-panel/usersdata',
      '/manager/config',
    ];

    const registryRoutes: string[] = [];
    MODULE_SLUGS.forEach((slug) => {
      MODULE_PAGES[slug].forEach((page) => {
        registryRoutes.push(
          Array.isArray(page.route) ? (page.route as string[]).join(' ') : page.route
        );
      });
    });

    sidebarRoutes.forEach((route) => {
      expect(registryRoutes)
        .withContext(`sidebar link ${route} must have a module card`)
        .toContain(route);
    });
    registryRoutes.forEach((route) => {
      expect(sidebarRoutes)
        .withContext(`registry route ${route} must be a real sidebar link`)
        .toContain(route);
    });
  });

  it('gives every module unique titles and unique router targets', () => {
    MODULE_SLUGS.forEach((slug) => {
      const pages = MODULE_PAGES[slug];
      const titles = pages.map((p) => p.title);
      const routes = pages.map((p) =>
        Array.isArray(p.route) ? (p.route as string[]).join(' ') : p.route
      );
      expect(new Set(titles).size)
        .withContext(`${slug} titles must be unique`)
        .toBe(titles.length);
      expect(new Set(routes).size)
        .withContext(`${slug} routes must be unique`)
        .toBe(routes.length);
    });
  });

  it('exposes Dashboard to every admin-module user without extra gating', () => {
    const juniorAdmin = ctx({
      user: {
        department: Department.ADMINSTRATION,
        accRole: AccountRoles.IT,
        accPosition: AccountPositions.JUNIOR,
      },
    });
    const dashboard = visiblePages('admin', juniorAdmin).find((p) => p.title === 'Dashboard');
    expect(dashboard).toBeTruthy();
    expect(dashboard?.route).toBe('/admin-panel/dashboard');
    expect(dashboard?.condition).toBeUndefined();
  });

  it('gates the Business Development CRM extras exactly like the sidebar', () => {
    const bdUser = ctx({
      user: {
        department: Department.Business_Development,
        accRole: AccountRoles.SALES,
        accPosition: AccountPositions.JUNIOR,
      },
      permissionIds: [11],
    });
    const bdPages = visiblePages('crm', bdUser);
    expect(bdPages.some((p) => p.route === '/CRM/requests')).toBeTrue();
    expect(bdPages.some((p) => p.route === '/publicReqsApply')).toBeTrue();
    // 8 ungated CRM cards + the two Business Development extras; Reports is
    // management-only and therefore hidden for this user.
    expect(bdPages.length).toBe(10);

    // A management user without permission 11 keeps the standard nine cards.
    const manager = ctx({
      user: {
        department: Department.MANAGEMENT,
        accRole: AccountRoles.CEO,
        accPosition: AccountPositions.MANAGER,
      },
      isManager: true,
    });
    const managerPages = visiblePages('crm', manager);
    expect(managerPages.some((p) => p.route === '/CRM/requests')).toBeFalse();
    expect(managerPages.some((p) => p.route === '/publicReqsApply')).toBeFalse();
    expect(managerPages.length).toBe(9);

    // Business developer without permission 11 sees public CRM requests but
    // not the approval worklist.
    const bdNoPerm = ctx({
      user: {
        department: Department.Business_Development,
        accRole: AccountRoles.SALES,
        accPosition: AccountPositions.JUNIOR,
      },
    });
    expect(visiblePages('crm', bdNoPerm).some((p) => p.route === '/CRM/requests')).toBeTrue();
    expect(visiblePages('crm', bdNoPerm).some((p) => p.route === '/publicReqsApply')).toBeFalse();
  });

  it('shows the dev-block Users card only to non-manager technical users', () => {
    const juniorDev = ctx({
      user: {
        department: Department.TECHNICAL_TEAM,
        accRole: AccountRoles.SUPPORT,
        accPosition: AccountPositions.JUNIOR,
      },
    });
    expect(visiblePages('projects', juniorDev).some((p) => p.route === '/users')).toBeTrue();

    const teamManager = ctx({
      user: {
        department: Department.TECHNICAL_TEAM,
        accRole: AccountRoles.SUPPORT,
        accPosition: AccountPositions.MANAGER,
      },
      isManager: true,
    });
    expect(visiblePages('projects', teamManager).some((p) => p.route === '/users')).toBeFalse();
  });

  it('hides permission-gated pages when the permission is missing', () => {
    const withoutPerm = visiblePages('ticketing', ctx({ permissionIds: [] }));
    expect(withoutPerm.find((p) => p.title === 'Support Reports')).toBeUndefined();
    expect(withoutPerm.find((p) => p.title === 'Installments')).toBeUndefined();

    const withPerm = visiblePages('ticketing', ctx({ permissionIds: [25, 18] }));
    expect(withPerm.find((p) => p.title === 'Support Reports')).toBeTruthy();
    expect(withPerm.find((p) => p.title === 'Installments')).toBeTruthy();
    expect(withPerm.find((p) => p.title === 'Investment and expenses')).toBeTruthy();
  });

  it('evaluates department, role and position conditions', () => {
    const managementUser = ctx({
      user: {
        department: Department.MANAGEMENT,
        accRole: AccountRoles.CEO,
        accPosition: AccountPositions.MANAGER,
      },
      isManager: true,
    });

    // CRM Reports is management-only.
    expect(visiblePages('crm', managementUser).some((p) => p.title === 'Reports')).toBeTrue();
    expect(visiblePages('crm', ctx()).some((p) => p.title === 'Reports')).toBeFalse();

    // HR Vacations needs manager OR human-resource role.
    const hrUser = ctx({
      user: {
        department: Department.ADMINSTRATION,
        accRole: AccountRoles.HUMAN_RESOURCE,
        accPosition: AccountPositions.JUNIOR,
      },
    });
    expect(visiblePages('hr', hrUser).some((p) => p.title === 'Vacations')).toBeTrue();

    // Hiring candidates needs permission 34.
    expect(visiblePages('hr', ctx({ permissionIds: [34] })).some((p) => p.title === 'Candidates')).toBeTrue();
    expect(visiblePages('hr', ctx()).some((p) => p.title === 'Candidates')).toBeFalse();
  });

  it('shows the technical-team project pages only to non-manager technical users', () => {
    const juniorDev = ctx({
      user: {
        department: Department.TECHNICAL_TEAM,
        accRole: AccountRoles.SUPPORT,
        accPosition: AccountPositions.JUNIOR,
      },
    });
    const teamManager = ctx({
      user: {
        department: Department.TECHNICAL_TEAM,
        accRole: AccountRoles.SUPPORT,
        accPosition: AccountPositions.MANAGER,
      },
      isManager: true,
    });

    expect(visiblePages('projects', juniorDev).some((p) => p.title === 'Team Time Sheet')).toBeTrue();
    expect(visiblePages('projects', teamManager).some((p) => p.title === 'Team Time Sheet')).toBeFalse();

    // "Reports To Approve" additionally requires the SENIOR position.
    expect(visiblePages('projects', juniorDev).some((p) => p.title === 'Reports To Approve')).toBeFalse();
    const seniorDev = ctx({
      user: {
        department: Department.TECHNICAL_TEAM,
        accRole: AccountRoles.SUPPORT,
        accPosition: AccountPositions.SENIOR,
      },
    });
    expect(visiblePages('projects', seniorDev).some((p) => p.title === 'Reports To Approve')).toBeTrue();
  });

  // Snapshot of the exact sidebar catalogue the product owner signed off:
  // a management user (no extra permissions) must see precisely these
  // sections and cards, in sidebar order — including the standalone
  // Dashboard / Notes / Requests / Configurations sections.
  it('matches the signed-off sidebar sections and cards for a manager', () => {
    const manager = ctx({
      user: {
        department: Department.MANAGEMENT,
        accRole: AccountRoles.CEO,
        accPosition: AccountPositions.MANAGER,
      },
      isManager: true,
      permissionIds: [],
    });

    const titlesOf = (slug: string) =>
      visibleSections(slug, manager).map((section) => [
        section.title,
        section.pages.map((page) => page.title),
      ]);

    // Notes is a standalone always-on sidebar link.
    expect(titlesOf('core')).toEqual([['General', ['Notes']]]);

    // CRM block — the nine signed-off entries.
    expect(titlesOf('crm')).toEqual([
      [
        'CRM',
        [
          'Insights',
          'Reports',
          'Organizations',
          'Contacts',
          'Activities',
          'Requests',
          'Leads',
          'Opportunity',
          'Closed Deal',
        ],
      ],
    ]);

    // Project Management block — the nine signed-off entries.
    expect(titlesOf('projects')).toEqual([
      [
        'Project Management',
        [
          'Pending Reports',
          'Projects',
          'Reports',
          'Devloper Progress',
          'Available To Work',
          'Public Reports',
          'Admin Tasks',
          'Project Manager Reports',
          'Rating',
        ],
      ],
    ]);

    // Support block — role-gated Support Reports/Finance sections are dropped.
    expect(titlesOf('ticketing')).toEqual([
      ['Support', ['Support Contract', 'Tickets', 'License', 'Clients']],
    ]);

    // HR block followed by the standalone Requests block.
    expect(titlesOf('hr')).toEqual([
      ['HR', ['Salaries', 'Vacations', 'Announces']],
      [
        'Requests',
        [
          'Public requests',
          'Transportations Requests',
          'Transportation Sheet',
          'Incentive Requests',
        ],
      ],
    ]);

    // Administration area keeps Dashboard and Configurations as their own
    // sections, with Users/All User Data under Administration.
    expect(titlesOf('admin')).toEqual([
      ['Dashboard', ['Dashboard']],
      ['Administration', ['Users', 'All User Data']],
      [
        'Requests',
        [
          'Public requests',
          'Transportations Requests',
          'Transportation Sheet',
          'Incentive Requests',
        ],
      ],
      ['Configurations', ['Configurations']],
    ]);
  });

  it('groups cards into sections and drops sections hidden entirely by permissions', () => {
    // A manager never sees the role-gated Technical Team / Finance / Hiring
    // Process / Support Reports sections.
    const manager = ctx({
      user: {
        department: Department.MANAGEMENT,
        accRole: AccountRoles.CEO,
        accPosition: AccountPositions.MANAGER,
      },
      isManager: true,
    });
    const sectionNames = (slug: string) =>
      visibleSections(slug, manager).map((section) => section.title);

    expect(sectionNames('projects')).not.toContain('Technical Team');
    expect(sectionNames('ticketing')).toEqual(['Support']);
    expect(sectionNames('hr')).toEqual(['HR', 'Requests']);

    // A non-manager technical user gets the Technical Team section.
    const juniorDev = ctx({
      user: {
        department: Department.TECHNICAL_TEAM,
        accRole: AccountRoles.SUPPORT,
        accPosition: AccountPositions.JUNIOR,
      },
    });
    const projectSections = visibleSections('projects', juniorDev).map((s) => s.title);
    expect(projectSections).toContain('Technical Team');
  });

  it('returns an empty list for unknown slugs and treats no condition as visible', () => {
    expect(visiblePages('does-not-exist', ctx())).toEqual([]);
    expect(evaluateCondition(undefined, ctx())).toBeTrue();
  });
});
