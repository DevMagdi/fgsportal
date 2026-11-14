import { hasAbility } from '../../components/bms/bms-abilities.util';
import { AccountPositions, AccountRoles, Department } from '../../interfaces/user';
import { BMS_NAVIGATION_GROUPS } from '../../components/bms/bms-navigation';
import { NavContext, NavCounterKey, NavGroup, NavItem, NavRule } from './nav.model';

/*
 * The single source of truth for the global sidebar.
 *
 * LEGACY RULES ARE TRANSCRIBED, NOT REDESIGNED. Each predicate below mirrors
 * one `*ngIf` of the retired `navbar.component.html` and keeps its loose `==`
 * comparisons. In the old template a link lived inside a Bootstrap collapse
 * that could only be opened through its group header, so a link was reachable
 * only when   header rule && collapse-container rule && link rule   held.
 * That effective rule is what every entry encodes; `source` quotes it.
 */

/* ---- atoms: one per expression used by the legacy template --------------- */
/* eslint-disable eqeqeq */
const perm = (c: NavContext, id: number): boolean => c.permissionIds.some(p => p == id);            // checkIfHasPerm(id)
const mod = (c: NavContext, slug: string): boolean => c.moduleEnabled(slug);                         // isModuleEnabled(slug)
const mgmt = (c: NavContext): boolean => c.user.department == Department.MANAGEMENT;
const tech = (c: NavContext): boolean => c.user.department == Department.TECHNICAL_TEAM;
const bizDev = (c: NavContext): boolean => c.user.department == Department.Business_Development;
const adminDept = (c: NavContext): boolean => c.user.department == Department.ADMINSTRATION;
const posManager = (c: NavContext): boolean => c.user.accPosition == AccountPositions.MANAGER;
const posSenior = (c: NavContext): boolean => c.user.accPosition == AccountPositions.SENIOR;
const roleHr = (c: NavContext): boolean => c.user.accRole == AccountRoles.HUMAN_RESOURCE;
const roleFinance = (c: NavContext): boolean => c.user.accRole == AccountRoles.FINANCE;
/* eslint-enable eqeqeq */

/* ---- legacy containers and group headers --------------------------------- */
/** `<div class="managerModule" *ngIf="isManager || isAdmin">` */
const managerModule: NavRule = c => c.isManager || c.isAdmin;
/** `<div class="devModule" *ngIf="isModuleEnabled('projects') && department == TECHNICAL_TEAM && accPosition != MANAGER">` */
const devModule: NavRule = c => mod(c, 'projects') && tech(c) && !posManager(c);
/** `<div class="businessDevelopmentModule" *ngIf="department == Business_Development">` */
const bizDevModule: NavRule = c => bizDev(c);

/** CRM header && `#crmOpened` container. */
const crmGroup: NavRule = c => mod(c, 'crm') && (mgmt(c) || perm(c, 15)) && mod(c, 'crm');
/** "Project Management" header && `#reports` container (inside managerModule). */
const projectsGroup: NavRule = c => managerModule(c) && mod(c, 'projects') && (mgmt(c) || perm(c, 5)) && mod(c, 'projects');
/** "Support" header && `#support` container (inside managerModule). */
const supportGroup: NavRule = c => managerModule(c) && mod(c, 'ticketing') && (mgmt(c) || perm(c, 14)) && mod(c, 'ticketing');
/** "HR" header && `#hr` container (inside managerModule). */
const hrGroup: NavRule = c => managerModule(c) && (mod(c, 'hr') || mod(c, 'admin'));
/** "Hiring Process" header; `#hr-process` container has no rule (inside managerModule). */
const hiringGroup: NavRule = c => managerModule(c) && (perm(c, 34) || perm(c, 28) || perm(c, 31));
/** "Requests" header && `#requests` container (inside managerModule). */
const requestsGroup: NavRule = c => managerModule(c) && (mod(c, 'hr') || mod(c, 'admin'));
/** "Adminstration" header && `#admin` container (inside managerModule). */
const adminGroup: NavRule = c => managerModule(c) && mod(c, 'admin');

/* ---- textual form of the same rules, for the parity matrix --------------- */
const S = {
  managerModule: '(isManager || isAdmin)',
  devModule: "(isModuleEnabled('projects') && department == TECHNICAL_TEAM && accPosition != MANAGER)",
  bizDevModule: '(department == Business_Development)',
  crmGroup: "(isModuleEnabled('crm') && (department == MANAGEMENT || checkIfHasPerm(15)))",
  projectsGroup: "((isManager || isAdmin) && isModuleEnabled('projects') && (department == MANAGEMENT || checkIfHasPerm(5)))",
  supportGroup: "((isManager || isAdmin) && isModuleEnabled('ticketing') && (department == MANAGEMENT || checkIfHasPerm(14)))",
  hrGroup: "((isManager || isAdmin) && (isModuleEnabled('hr') || isModuleEnabled('admin')))",
  hiringGroup: '((isManager || isAdmin) && (checkIfHasPerm(34) || checkIfHasPerm(28) || checkIfHasPerm(31)))',
  requestsGroup: "((isManager || isAdmin) && (isModuleEnabled('hr') || isModuleEnabled('admin')))",
  adminGroup: "((isManager || isAdmin) && isModuleEnabled('admin'))",
};

type Source = [string, NavRule];

/** A legacy link. Several sources mean the old navbar listed the route in several blocks; it is visible when any block showed it. */
function legacy(id: string, route: string, label: string, icon: string, sources: Source[], badge?: NavCounterKey): NavItem {
  return {
    id, route, label, icon, badge,
    visible: context => sources.some(([, rule]) => rule(context)),
    source: sources.map(([text]) => text).join('  OR  '),
  };
}

const and = (...rules: NavRule[]): NavRule => context => rules.every(rule => rule(context));

/** A BMS link: ability, icon and label come from the BMS information architecture. */
function bms(path: string): NavItem {
  for (const group of BMS_NAVIGATION_GROUPS) {
    const link = group.links.find(candidate => candidate.path === path);
    if (link) {
      return {
        id: `bms-${path}`, route: `/bms/${path}`, label: link.label, icon: link.icon,
        visible: context => hasAbility(context.abilities, link.ability),
        source: `BMS ability '${link.ability}' (GET /api/bms/lookups → can[])`,
      };
    }
  }
  throw new Error(`Unknown BMS navigation path: ${path}`);
}

export const NAV_GROUPS: NavGroup[] = [
  /* ===================== Business Management (BMS) ===================== */
  {
    id: 'overview', label: 'grpOverview', icon: 'bx-home-alt', section: 'bms', items: [
      bms('dashboard'),
      legacy('admin-dashboard', '/admin-panel/dashboard', 'navOperationsDashboard', 'bx-grid-alt',
        [["isModuleEnabled('admin')", c => mod(c, 'admin')]]),
    ],
  },
  { id: 'organization', label: 'grpOrganization', icon: 'bx-buildings', section: 'bms', items: [bms('organization'), bms('units'), bms('employees'), bms('recruitment'), bms('development')] },
  { id: 'execution', label: 'grpExecution', icon: 'bx-task', section: 'bms', items: [bms('plans'), bms('my-tasks')] },
  { id: 'business-development', label: 'grpBusinessDev', icon: 'bx-briefcase', section: 'bms', items: [bms('leads'), bms('opportunities')] },
  { id: 'operations', label: 'grpOperations', icon: 'bx-cog', section: 'bms', items: [bms('meetings'), bms('products'), bms('procurement'), bms('events'), bms('documents')] },
  { id: 'reports', label: 'grpReports', icon: 'bx-bar-chart-alt-2', section: 'bms', items: [bms('reports')] },
  { id: 'access-management', label: 'grpAccessManagement', icon: 'bx-shield-quarter', section: 'bms', items: [bms('access')] },

  /* ========================== Legacy workspaces ========================= */
  {
    id: 'my-work', label: 'navMyWork', icon: 'bx-user-pin', section: 'workspace', items: [
      legacy('my-work-sheet', '/my_work', 'navTimeSheet', 'bx-time-five', [['checkIfHasPerm(12)', c => perm(c, 12)]]),
      legacy('dev-timesheet', '/dev/timesheet', 'navDevTimeSheet', 'bx-timer', [[S.devModule, devModule]]),
      legacy('dev-projects', '/dev/myprojects', 'navMyProjects', 'bx-folder', [[S.devModule, devModule]]),
      legacy('dev-reports', '/dev/reports', 'navMyReports', 'bx-file', [[S.devModule, devModule]], 'totalReports'),
      legacy('dev-reports-approve', '/dev/reportsToApprove', 'navReportsToApprove', 'bx-check-double',
        [[`${S.devModule} && accPosition == SENIOR`, and(devModule, posSenior)]], 'pendingReport'),
      legacy('dev-requests', '/dev/requests', 'navMyRequests', 'bx-paper-plane', [[S.devModule, devModule]]),
      legacy('notes', '/notes', 'navNotes', 'bx-note', [[S.managerModule, managerModule], [S.devModule, devModule]]),
      legacy('users-directory', '/users', 'navUsersDirectory', 'bx-group', [[S.devModule, devModule]]),
    ],
  },
  {
    id: 'projects', label: 'navProjectManagement', icon: 'bx-layer', section: 'workspace', badge: 'totalManageCounter', items: [
      legacy('pm-approval', '/manager/apporval', 'navPendingReports', 'bx-time',
        [[`${S.projectsGroup} && (isManager || accPosition == MANAGER)`, and(projectsGroup, c => c.isManager || posManager(c))]], 'pendingReport'),
      legacy('pm-projects', '/manager/projects', 'navProjects', 'bx-folder-open',
        [[`${S.projectsGroup} && (isManager || checkIfHasPerm(13))`, and(projectsGroup, c => c.isManager || perm(c, 13))]]),
      legacy('pm-reports', '/manager/reports', 'navReports', 'bx-file',
        [[`${S.projectsGroup} && (isManager || checkIfHasPerm(4))`, and(projectsGroup, c => c.isManager || perm(c, 4))]]),
      legacy('pm-costs', '/manager/costs', 'navProjectCost', 'bx-dollar-circle',
        [[`${S.projectsGroup} && department == ADMINSTRATION && checkIfHasPerm(3)`, and(projectsGroup, c => adminDept(c) && perm(c, 3))]]),
      legacy('pm-devprog', '/manager/devprog', 'navDeveloperProgress', 'bx-trending-up',
        [[`${S.projectsGroup} && (department == MANAGEMENT || checkIfHasPerm(19))`, and(projectsGroup, c => mgmt(c) || perm(c, 19))]]),
      legacy('pm-available', '/manager/available', 'navAvailableToWork', 'bx-user-check',
        [[`${S.projectsGroup} && department == MANAGEMENT`, and(projectsGroup, mgmt)]], 'open_to_work_counter'),
      legacy('pm-public-reports', '/manager/public_reports', 'navPublicReports', 'bx-spreadsheet',
        [[`${S.projectsGroup} && (department == MANAGEMENT || checkIfHasPerm(16))`, and(projectsGroup, c => mgmt(c) || perm(c, 16))]]),
      legacy('pm-admin-tasks', '/manager/admin_tasks', 'navAdminTasks', 'bx-list-check',
        [[`${S.projectsGroup} && (department == MANAGEMENT || checkIfHasPerm(17))`, and(projectsGroup, c => mgmt(c) || perm(c, 17))]]),
      legacy('pm-report-to-manager', '/manager/project-manager-reports', 'navReportToManager', 'bx-send',
        [[`${S.projectsGroup} && department == TECHNICAL_TEAM && accPosition == MANAGER`, and(projectsGroup, c => tech(c) && posManager(c))]]),
      legacy('pm-manager-reports', '/manager/project-manager-reports', 'navProjectManagerReports', 'bx-clipboard',
        [[`${S.projectsGroup} && department == MANAGEMENT`, and(projectsGroup, mgmt)]], 'project_manager_reports'),
      legacy('pm-rating', '/manager/rating', 'navRating', 'bx-star', [[S.projectsGroup, projectsGroup]]),
    ],
  },
  {
    id: 'crm', label: 'navCrm', icon: 'bx-line-chart', section: 'workspace', badge: 'myPendingPOCRequest', items: [
      legacy('crm-dashboard', '/CRM/dashboard', 'navCrmInsights', 'bx-pie-chart-alt-2', [[S.crmGroup, crmGroup]]),
      legacy('crm-reports', '/CRM/reports', 'navReports', 'bx-file',
        [[`${S.crmGroup} && department == MANAGEMENT`, and(crmGroup, mgmt)]]),
      legacy('crm-accounts', '/CRM/accounts', 'navOrganizations', 'bx-buildings', [[S.crmGroup, crmGroup], [S.bizDevModule, bizDevModule]]),
      legacy('crm-contacts', '/CRM/contacts', 'navContacts', 'bx-id-card', [[S.crmGroup, crmGroup], [S.bizDevModule, bizDevModule]]),
      legacy('crm-activities', '/CRM/activities', 'navActivities', 'bx-pulse', [[S.crmGroup, crmGroup], [S.bizDevModule, bizDevModule]]),
      legacy('crm-poc-requests', '/CRM/poc-requests', 'navCrmRequests', 'bx-message-square-detail',
        [[S.crmGroup, crmGroup], [S.bizDevModule, bizDevModule]], 'totalCRMReqsCounter'),
      legacy('crm-leads', '/CRM/leads', 'navLeads', 'bx-network-chart', [[S.crmGroup, crmGroup], [S.bizDevModule, bizDevModule]]),
      legacy('crm-opportunity', '/CRM/opportunity', 'navOpportunity', 'bx-target-lock', [[S.crmGroup, crmGroup], [S.bizDevModule, bizDevModule]]),
      legacy('crm-closed', '/CRM/closed', 'navClosedDeals', 'bx-badge-check', [[S.crmGroup, crmGroup], [S.bizDevModule, bizDevModule]]),
    ],
  },
  {
    id: 'support', label: 'navSupport', icon: 'bx-support', section: 'workspace', items: [
      legacy('support-reports', '/support-reports', 'navSupportReports', 'bx-bar-chart-square',
        [["checkIfHasPerm(25) && isModuleEnabled('ticketing')", c => perm(c, 25) && mod(c, 'ticketing')]]),
      legacy('support-contracts', '/manager/client-support', 'navSupportContract', 'bx-receipt',
        [[`${S.supportGroup} && (department == MANAGEMENT || checkIfHasPerm(6))`, and(supportGroup, c => mgmt(c) || perm(c, 6))]]),
      legacy('tickets', '/tickets', 'navTickets', 'bx-conversation', [
        [`${S.supportGroup} && (department == MANAGEMENT || (department == TECHNICAL_TEAM && accPosition == MANAGER) || checkIfHasPerm(2))`,
          and(supportGroup, c => mgmt(c) || (tech(c) && posManager(c)) || perm(c, 2))],
        [`${S.devModule} && isModuleEnabled('ticketing')`, and(devModule, c => mod(c, 'ticketing'))],
      ]),
      legacy('support-clients', '/manager/partners', 'navClients', 'bx-group',
        [[`${S.supportGroup} && (department == MANAGEMENT || checkIfHasPerm(7))`, and(supportGroup, c => mgmt(c) || perm(c, 7))]]),
    ],
  },
  {
    id: 'hr', label: 'navHr', icon: 'bx-user-voice', section: 'workspace', badge: 'hrCounter', items: [
      legacy('hr-salaries', '/manager/salaries', 'navSalaries', 'bx-money',
        [[`${S.hrGroup} && (department == MANAGEMENT || checkIfHasPerm(1))`, and(hrGroup, c => mgmt(c) || perm(c, 1))]]),
      legacy('hr-vacations', '/admin-panel/vacations', 'navVacations', 'bx-run',
        [[`${S.hrGroup} && (isManager || accRole == HUMAN_RESOURCE)`, and(hrGroup, c => c.isManager || roleHr(c))]], 'pendingVacationsRequest'),
      legacy('hr-announces', '/admin-panel/announces', 'navAnnouncements', 'bx-microphone',
        [[`${S.hrGroup} && (isManager || accRole == HUMAN_RESOURCE)`, and(hrGroup, c => c.isManager || roleHr(c))]]),
      legacy('hr-candidates', '/hr/hiring-process/candidates', 'navCandidates', 'bx-user-plus',
        [[`${S.hiringGroup} && checkIfHasPerm(34)`, and(hiringGroup, c => perm(c, 34))]]),
      legacy('hr-job-profiles', '/hr/hiring-process/job-profiles', 'navJobProfiles', 'bx-briefcase-alt',
        [[`${S.hiringGroup} && checkIfHasPerm(28)`, and(hiringGroup, c => perm(c, 28))]]),
      legacy('hr-job-skills', '/hr/hiring-process/job-skills', 'navJobSkills', 'bx-medal',
        [[`${S.hiringGroup} && checkIfHasPerm(31)`, and(hiringGroup, c => perm(c, 31))]]),
    ],
  },
  {
    id: 'requests', label: 'navRequests', icon: 'bx-paper-plane', section: 'workspace', badge: 'totalRequestsCounter', items: [
      legacy('req-public', '/manager/publicreqs', 'navPublicRequests', 'bx-envelope',
        [[`${S.requestsGroup} && (department == MANAGEMENT || isAdmin)`, and(requestsGroup, c => mgmt(c) || c.isAdmin)]], 'pendingPublicRequest'),
      legacy('req-transportation', '/admin-panel/pendingtransportations', 'navTransportationRequests', 'bx-car',
        [[`${S.requestsGroup} && (isManager || accRole == FINANCE)`, and(requestsGroup, c => c.isManager || roleFinance(c))]], 'pendingTransportationRequest'),
      legacy('req-transportation-sheet', '/admin-panel/transportationsheet', 'navTransportationSheet', 'bx-table',
        [[`${S.requestsGroup} && (isManager || accRole == FINANCE)`, and(requestsGroup, c => c.isManager || roleFinance(c))]]),
      legacy('req-incentive', '/manager/incentive', 'navIncentiveRequests', 'bx-wallet',
        [[`${S.requestsGroup} && (isManager || accRole == FINANCE)`, and(requestsGroup, c => c.isManager || roleFinance(c))]], 'pendingIncentiveRequest'),
      legacy('req-handle-public', '/publicReqsApply', 'navHandlePublicRequests', 'bx-task',
        [[`${S.bizDevModule} && checkIfHasPerm(11)`, and(bizDevModule, c => perm(c, 11))]], 'pendingPublicRequest'),
      legacy('req-crm-public', '/CRM/requests', 'navMyPublicRequests', 'bx-mail-send', [[S.bizDevModule, bizDevModule]]),
    ],
  },
  {
    id: 'administration', label: 'navAdministration', icon: 'bx-slider', section: 'workspace', items: [
      legacy('admin-users', '/manager/addusers', 'navUsers', 'bx-user', [[S.adminGroup, adminGroup]]),
      legacy('admin-users-data', '/admin-panel/usersdata', 'navAllUserData', 'bx-data',
        [[`${S.adminGroup} && (department == MANAGEMENT || (department == ADMINSTRATION && accRole == HUMAN_RESOURCE))`,
          and(adminGroup, c => mgmt(c) || (adminDept(c) && roleHr(c)))]]),
      legacy('admin-config', '/manager/config', 'navConfigurations', 'bx-cog',
        [[`${S.managerModule} && department == MANAGEMENT`, and(managerModule, mgmt)]]),
    ],
  },
];

/** Titles for authenticated pages that are reachable but are not sidebar entries. */
export const NAV_EXTRA_TITLES: { prefix: string; label: string }[] = [
  { prefix: '/notification', label: 'navNotifications' },
  { prefix: '/user', label: 'navProfile' },
  { prefix: '/logs', label: 'navSystemLogs' },
  { prefix: '/bms/no-access', label: 'noAccessTitle' },
  { prefix: '/module-disabled', label: 'navModuleDisabled' },
];
