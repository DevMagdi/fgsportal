import { AccountPositions, AccountRoles, Department } from '../interfaces/user';
import {
  evaluateCondition,
  MODULE_META,
  MODULE_PAGES,
  MODULE_SLUGS,
  PageVisibilityContext,
  visiblePages,
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

  it('returns an empty list for unknown slugs and treats no condition as visible', () => {
    expect(visiblePages('does-not-exist', ctx())).toEqual([]);
    expect(evaluateCondition(undefined, ctx())).toBeTrue();
  });
});
