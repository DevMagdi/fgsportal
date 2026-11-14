import { AccountPositions, AccountRoles, Department } from '../../interfaces/user';
import { BMS_NAVIGATION_GROUPS } from '../../components/bms/bms-navigation';
import { NavContext } from './nav.model';
import { NAV_GROUPS } from './nav.registry';
import { activeNav, allRoutes, countersFrom, normalizeUrl, visibleGroups } from './nav.util';

/*
 * PARITY ORACLE.
 *
 * `legacySidebarRoutes` is a line-by-line port of the *structure* of the
 * retired navbar.component.html: the same nested containers, the same group
 * headers, the same Bootstrap collapses and the same `*ngIf` on every link.
 * It is written independently of nav.registry.ts (nested `if`s instead of
 * flattened rules), so comparing the two over a large sweep of users catches
 * transcription and flattening mistakes in the registry.
 *
 * A link inside `<div class="collapse">` is only reachable when the header
 * that toggles that collapse is rendered, hence `if (header) { ... }`.
 */
function legacySidebarRoutes(c: NavContext): string[] {
  const routes: string[] = [];
  const add = (route: string) => { if (!routes.includes(route)) routes.push(route); };
  const currentUser = c.user;
  const isManager = c.isManager;
  const isAdmin = c.isAdmin;
  const checkIfHasPerm = (id: number) => c.permissionIds.some(p => p == id);
  const isModuleEnabled = (slug: string) => c.moduleEnabled(slug);

  if (checkIfHasPerm(12)) add('/my_work');
  if (isModuleEnabled('admin')) add('/admin-panel/dashboard');
  if (checkIfHasPerm(25) == true && isModuleEnabled('ticketing')) add('/support-reports');

  // CRM header -> #crmOpened
  if (isModuleEnabled('crm') && (currentUser.department == Department.MANAGEMENT || !!checkIfHasPerm(15))) {
    if (isModuleEnabled('crm')) {
      add('/CRM/dashboard');
      if (currentUser.department == Department.MANAGEMENT) add('/CRM/reports');
      add('/CRM/accounts'); add('/CRM/contacts'); add('/CRM/activities'); add('/CRM/poc-requests');
      add('/CRM/leads'); add('/CRM/opportunity'); add('/CRM/closed');
    }
  }

  // <div class="managerModule">
  if (isManager || isAdmin) {
    // Project Management header -> #reports
    if (isModuleEnabled('projects') && (currentUser.department == Department.MANAGEMENT || !!checkIfHasPerm(5))) {
      if (isModuleEnabled('projects')) {
        if (isManager || currentUser.accPosition == AccountPositions.MANAGER) add('/manager/apporval');
        if (isManager || checkIfHasPerm(13) == true) add('/manager/projects');
        if (isManager || checkIfHasPerm(4) == true) add('/manager/reports');
        if (currentUser.department == Department.ADMINSTRATION && !!checkIfHasPerm(3)) add('/manager/costs');
        if (currentUser.department == Department.MANAGEMENT || !!checkIfHasPerm(19)) add('/manager/devprog');
        if (currentUser.department == Department.MANAGEMENT) add('/manager/available');
        if (currentUser.department == Department.MANAGEMENT || checkIfHasPerm(16) == true) add('/manager/public_reports');
        if (currentUser.department == Department.MANAGEMENT || checkIfHasPerm(17) == true) add('/manager/admin_tasks');
        if (currentUser.department == Department.TECHNICAL_TEAM && currentUser.accPosition == AccountPositions.MANAGER) add('/manager/project-manager-reports');
        if (currentUser.department == Department.MANAGEMENT) add('/manager/project-manager-reports');
        add('/manager/rating');
      }
    }
    // Support header -> #support
    if (isModuleEnabled('ticketing') && (currentUser.department == Department.MANAGEMENT || !!checkIfHasPerm(14))) {
      if (isModuleEnabled('ticketing')) {
        if (currentUser.department == Department.MANAGEMENT || !!checkIfHasPerm(6)) add('/manager/client-support');
        if (currentUser.department == Department.MANAGEMENT
          || (currentUser.department == Department.TECHNICAL_TEAM && currentUser.accPosition == AccountPositions.MANAGER)
          || checkIfHasPerm(2)) add('/tickets');
        if (currentUser.department == Department.MANAGEMENT || !!checkIfHasPerm(7)) add('/manager/partners');
      }
    }
    // HR header -> #hr
    if (isModuleEnabled('hr') || isModuleEnabled('admin')) {
      if (isModuleEnabled('hr') || isModuleEnabled('admin')) {
        if (currentUser.department == Department.MANAGEMENT || checkIfHasPerm(1)) add('/manager/salaries');
        if (isManager || currentUser.accRole == AccountRoles.HUMAN_RESOURCE) add('/admin-panel/vacations');
        if (isManager || currentUser.accRole == AccountRoles.HUMAN_RESOURCE) add('/admin-panel/announces');
      }
    }
    // Hiring Process header -> #hr-process
    if (checkIfHasPerm(34) || checkIfHasPerm(28) || checkIfHasPerm(31)) {
      if (checkIfHasPerm(34)) add('/hr/hiring-process/candidates');
      if (checkIfHasPerm(28)) add('/hr/hiring-process/job-profiles');
      if (checkIfHasPerm(31)) add('/hr/hiring-process/job-skills');
    }
    add('/notes');
    // Requests header -> #requests
    if (isModuleEnabled('hr') || isModuleEnabled('admin')) {
      if (isModuleEnabled('hr') || isModuleEnabled('admin')) {
        if (currentUser.department == Department.MANAGEMENT || !!isAdmin) add('/manager/publicreqs');
        if (!!isManager || currentUser.accRole == AccountRoles.FINANCE) add('/admin-panel/pendingtransportations');
        if (!!isManager || currentUser.accRole == AccountRoles.FINANCE) add('/admin-panel/transportationsheet');
        if (!!isManager || currentUser.accRole == AccountRoles.FINANCE) add('/manager/incentive');
      }
    }
    // Adminstration header -> #admin
    if (isModuleEnabled('admin')) {
      if (isModuleEnabled('admin')) {
        add('/manager/addusers');
        if (currentUser.department == Department.MANAGEMENT
          || (currentUser.department == Department.ADMINSTRATION && currentUser.accRole == AccountRoles.HUMAN_RESOURCE)) add('/admin-panel/usersdata');
      }
    }
    if (currentUser.department == Department.MANAGEMENT) add('/manager/config');
  }

  // <div class="devModule">
  if (isModuleEnabled('projects') && currentUser.department == Department.TECHNICAL_TEAM && currentUser.accPosition != AccountPositions.MANAGER) {
    add('/dev/timesheet');
    add('/notes');
    if (currentUser.accPosition == AccountPositions.SENIOR) add('/dev/reportsToApprove');
    add('/dev/reports');
    add('/dev/requests');
    if (isModuleEnabled('ticketing')) add('/tickets');
    add('/dev/myprojects');
    add('/users');
  }

  // <div class="businessDevelopmentModule">
  if (currentUser.department == Department.Business_Development) {
    add('/CRM/accounts'); add('/CRM/contacts'); add('/CRM/activities'); add('/CRM/leads');
    add('/CRM/opportunity'); add('/CRM/closed'); add('/CRM/poc-requests');
    if (checkIfHasPerm(11)) add('/publicReqsApply');
    add('/CRM/requests');
  }
  return routes;
}

const LEGACY_PERMS = [1, 2, 3, 4, 5, 6, 7, 11, 12, 13, 14, 15, 16, 17, 19, 25, 28, 31, 34];
const MODULES = ['crm', 'projects', 'ticketing', 'hr', 'admin'];

/** `isManager` / `isAdmin` exactly as NavbarComponent.ngOnInit derived them. */
function classify(department: any, accPosition: any): { isManager: boolean; isAdmin: boolean } {
  if (department == Department.MANAGEMENT || (department == Department.TECHNICAL_TEAM && accPosition == AccountPositions.MANAGER)) return { isManager: true, isAdmin: false };
  if (department == Department.ADMINSTRATION) return { isManager: false, isAdmin: true };
  return { isManager: false, isAdmin: false };
}

function context(overrides: Partial<NavContext> & { department?: any; accPosition?: any; accRole?: any; modules?: string[] } = {}): NavContext {
  const department = overrides.department;
  const accPosition = overrides.accPosition;
  const modules = overrides.modules || [];
  return {
    user: { department, accPosition, accRole: overrides.accRole },
    ...classify(department, accPosition),
    permissionIds: overrides.permissionIds || [],
    moduleEnabled: slug => slug === 'core' || modules.includes(slug),
    abilities: overrides.abilities || [],
  };
}

const legacyRoutesOf = (c: NavContext): string[] => {
  const seen: string[] = [];
  visibleGroups(NAV_GROUPS, c).forEach(group => group.items.forEach(item => {
    if (!item.route.startsWith('/bms/') && !seen.includes(item.route)) seen.push(item.route);
  }));
  return seen.sort();
};

describe('Unified navigation registry', () => {
  it('shows exactly the legacy links the retired navbar showed, for every swept user', () => {
    const departments = [Department.MANAGEMENT, Department.TECHNICAL_TEAM, Department.Business_Development, Department.ADMINSTRATION, '99', undefined];
    const positions = [AccountPositions.MANAGER, AccountPositions.SENIOR, AccountPositions.JUNIOR, undefined];
    const roles = [AccountRoles.HUMAN_RESOURCE, AccountRoles.FINANCE, AccountRoles.SALES, undefined];
    // Deterministic permission sets: none, all, each single permission, and pseudo-random mixes.
    const permSets: number[][] = [[], LEGACY_PERMS, ...LEGACY_PERMS.map(id => [id])];
    let seed = 20261113;
    const random = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
    for (let i = 0; i < 12; i++) permSets.push(LEGACY_PERMS.filter(() => random() < 0.5));

    let compared = 0;
    const mismatches: string[] = [];
    for (const department of departments) for (const accPosition of positions) for (const accRole of roles) {
      for (let mask = 0; mask < (1 << MODULES.length); mask++) {
        const modules = MODULES.filter((_slug, bit) => mask & (1 << bit));
        for (const permissionIds of permSets) {
          const c = context({ department, accPosition, accRole, modules, permissionIds });
          const expected = legacySidebarRoutes(c).sort();
          const actual = legacyRoutesOf(c);
          compared++;
          if (expected.join('|') !== actual.join('|') && mismatches.length < 5) {
            mismatches.push(JSON.stringify({ department, accPosition, accRole, modules, permissionIds, expected, actual }));
          }
        }
      }
    }
    expect(mismatches).toEqual([]);
    expect(compared).toBe(6 * 4 * 4 * 32 * permSets.length);
  });

  it('treats string permission ids like the legacy loose comparison did', () => {
    const c = context({ permissionIds: ['12'] as any });
    expect(legacyRoutesOf(c)).toEqual(['/my_work']);
  });

  it('gates every BMS link on exactly the ability of the BMS information architecture', () => {
    const links = BMS_NAVIGATION_GROUPS.reduce((all, group) => all.concat(group.links), [] as any[]);
    const bmsItems = NAV_GROUPS.reduce((all, group) => all.concat(group.items), [] as any[]).filter(item => item.route.startsWith('/bms/'));
    expect(bmsItems.map(item => item.route).sort()).toEqual(links.map(link => `/bms/${link.path}`).sort());
    for (const link of links) {
      const item = bmsItems.find(candidate => candidate.route === `/bms/${link.path}`);
      expect(item.visible(context({ abilities: [link.ability] }))).toBe(true);
      expect(item.visible(context({ abilities: links.map(other => other.ability).filter(ability => ability !== link.ability) }))).toBe(false);
      expect(item.visible(context({ department: Department.MANAGEMENT, modules: MODULES, permissionIds: LEGACY_PERMS }))).toBe(false);
    }
  });

  it('renders no group at all for a user without any right', () => {
    expect(visibleGroups(NAV_GROUPS, context())).toEqual([]);
  });

  it('never repeats a route inside what one user sees, except the two differently labelled manager-report entries', () => {
    const everything = context({ department: Department.MANAGEMENT, modules: MODULES, permissionIds: LEGACY_PERMS, abilities: BMS_NAVIGATION_GROUPS.reduce((all, g) => all.concat(g.links.map(l => l.ability)), [] as string[]) });
    const routes = visibleGroups(NAV_GROUPS, everything).reduce((all, group) => all.concat(group.items.map(item => item.route)), [] as string[]);
    expect(routes.length).toBe(new Set(routes).size);
    // "Report to Manager" (technical manager) and "Project Manager Reports" (management) are mutually exclusive.
    const techManager = context({ department: Department.TECHNICAL_TEAM, accPosition: AccountPositions.MANAGER, modules: MODULES, permissionIds: LEGACY_PERMS });
    const techRoutes = visibleGroups(NAV_GROUPS, techManager).reduce((all, group) => all.concat(group.items.map(item => item.route)), [] as string[]);
    expect(techRoutes.length).toBe(new Set(techRoutes).size);
  });

  it('uses unique item and group ids', () => {
    const groupIds = NAV_GROUPS.map(group => group.id);
    const itemIds = NAV_GROUPS.reduce((all, group) => all.concat(group.items.map(item => item.id)), [] as string[]);
    expect(groupIds.length).toBe(new Set(groupIds).size);
    expect(itemIds.length).toBe(new Set(itemIds).size);
  });

  it('documents the source rule of every entry for the parity matrix', () => {
    NAV_GROUPS.forEach(group => group.items.forEach(item => expect(item.source.length > 0).toBe(true)));
  });

  it('resolves the active entry by the longest matching route, ignoring hash and query', () => {
    expect(normalizeUrl('#/bms/plans/?week=1')).toBe('/bms/plans');
    expect(normalizeUrl('')).toBe('/');
    const active = activeNav(NAV_GROUPS, '/bms/development?tab=1');
    expect(active?.group.id).toBe('organization');
    expect(active?.item.label).toBe('development');
    expect(activeNav(NAV_GROUPS, '/manager/projects/42')?.item.id).toBe('pm-projects');
    expect(activeNav(NAV_GROUPS, '/hr/hiring-process/candidates')?.group.id).toBe('hr');
    expect(activeNav(NAV_GROUPS, '/users')?.item.id).toBe('users-directory');
    expect(activeNav(NAV_GROUPS, '/user/7')).toBeUndefined();
    expect(activeNav(NAV_GROUPS, '/signin')).toBeUndefined();
  });

  it('lists each destination once in allRoutes', () => {
    const routes = allRoutes(NAV_GROUPS);
    expect(routes.length).toBe(new Set(routes).size);
    expect(routes).toContain('/bms/dashboard');
    expect(routes).toContain('/CRM/requests');
  });

  it('derives the navigation counters exactly like the retired navbar', () => {
    const counters = countersFrom({ pendingReport: 2, open_to_work_counter: 3, project_manager_reports: 4, pendingVacationsRequest: 5,
      pendingPublicRequest: 6, pendingTransportationRequest: 7, myPendingRFPRequest: 8, myPendingPOCRequest: 9, rejectedReport: 1, devPendingReports: 10 });
    expect(counters.totalManageCounter).toBe(9);
    expect(counters.hrCounter).toBe(5);
    expect(counters.totalRequestsCounter).toBe(13);
    expect(counters.totalCRMReqsCounter).toBe(17);
    expect(counters.totalReports).toBe(11);
    expect(countersFrom(undefined).totalManageCounter).toBe(0);
    expect(countersFrom({}).pendingIncentiveRequest).toBe(0);
  });
});
