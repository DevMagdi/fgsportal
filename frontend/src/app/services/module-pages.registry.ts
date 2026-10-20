import {
  AccountPositions,
  AccountRoles,
  Department,
} from '../interfaces/user';

/**
 * A single feature reachable from inside a module. The route is the exact
 * router target used by the sidebar link it mirrors.
 */
export interface ModulePage {
  title: string;
  icon: string;
  /** Router link: either a path or a router-link array (e.g. ['/manager/installments','t']). */
  route: string | unknown[];
  /** When absent the page is visible to everyone who can open the module. */
  condition?: PageCondition;
}

/**
 * Declarative visibility rules mirroring the *ngIf expressions in the
 * navbar, so the cards expose exactly what the sidebar would.
 */
export type PageCondition =
  | { kind: 'perm'; id: number }
  | { kind: 'dept'; values: Department[] }
  | { kind: 'position'; values: AccountPositions[] }
  | { kind: 'role'; values: AccountRoles[] }
  | { kind: 'manager' }
  | { kind: 'admin' }
  | { kind: 'or'; all: PageCondition[] }
  | { kind: 'and'; all: PageCondition[] }
  | { kind: 'not'; of: PageCondition };

/** Static presentation metadata for the six sellable modules. */
export interface ModuleMeta {
  name: string;
  description: string;
  icon: string;
}

export const MODULE_META: Record<string, ModuleMeta> = {
  core: {
    name: 'Core (Users, Auth & Permissions)',
    description:
      'Authentication, users, roles and permissions. Always required and always enabled.',
    icon: 'bx bx-shield-quarter',
  },
  crm: {
    name: 'CRM',
    description:
      'Leads, contacts, accounts, activities, campaigns, POC and RFP requests.',
    icon: 'bx bx-line-chart',
  },
  ticketing: {
    name: 'Ticketing & Support',
    description:
      'Client tickets, contract support, client accounts, licences, ratings and installments.',
    icon: 'bx bx-support',
  },
  projects: {
    name: 'Projects',
    description:
      'Projects, processes, tasks, timesheets, reports and PM team requests.',
    icon: 'bx bx-briefcase-alt-2',
  },
  hr: {
    name: 'Human Resources',
    description:
      'Recruitment, onboarding, salaries, vacations, incentives, transport requests and policies.',
    icon: 'bx bx-group',
  },
  admin: {
    name: 'Administration',
    description:
      'Organisational settings, departments, products, permissions, logs, announcements and public requests.',
    icon: 'bx bx-cog',
  },
};

export const MODULE_SLUGS = ['core', 'crm', 'ticketing', 'projects', 'hr', 'admin'];

const perm = (id: number): PageCondition => ({ kind: 'perm', id });
const dept = (...values: Department[]): PageCondition => ({ kind: 'dept', values });
const position = (...values: AccountPositions[]): PageCondition => ({ kind: 'position', values });
const role = (...values: AccountRoles[]): PageCondition => ({ kind: 'role', values });
const or = (...all: PageCondition[]): PageCondition => ({ kind: 'or', all });
const and = (...all: PageCondition[]): PageCondition => ({ kind: 'and', all });

/**
 * Per-module feature catalogue. Every entry mirrors a real sidebar link:
 * same title, same router target and same *ngIf visibility condition.
 */
export const MODULE_PAGES: Record<string, ModulePage[]> = {
  core: [
    { title: 'Time Sheet', icon: 'bx bx-time', route: '/my_work', condition: perm(12) },
    { title: 'Notes', icon: 'bx bx-note', route: '/notes' },
  ],

  crm: [
    { title: 'Insights', icon: 'bx bx-trending-up', route: '/CRM/dashboard' },
    {
      title: 'Reports',
      icon: 'bx bx-file',
      route: '/CRM/reports',
      condition: dept(Department.MANAGEMENT),
    },
    { title: 'Organizations', icon: 'bx bx-buildings', route: '/CRM/accounts' },
    { title: 'Contacts', icon: 'bx bx-user', route: '/CRM/contacts' },
    { title: 'Activities', icon: 'bx bx-calendar-event', route: '/CRM/activities' },
    { title: 'Requests', icon: 'bx bx-git-pull-request', route: '/CRM/poc-requests' },
    { title: 'Leads', icon: 'bx bx-user-check', route: '/CRM/leads' },
    { title: 'Opportunity', icon: 'bx bx-dollar-circle', route: '/CRM/opportunity' },
    { title: 'Closed Deal', icon: 'bx bx-shield-x', route: '/CRM/closed' },
    // ---- Business Development workspace (navbar businessDevelopmentModule) ----
    {
      title: 'Public requests',
      icon: 'bx bx-paper-plane',
      route: '/CRM/requests',
      condition: dept(Department.Business_Development),
    },
    {
      title: 'Handle Public requests',
      icon: 'bx bx-check-circle',
      route: '/publicReqsApply',
      condition: perm(11),
    },
  ],

  projects: [
    // ---- Project Management workspace (navbar #reports) ----
    {
      title: 'Pending Reports',
      icon: 'bx bx-timer',
      route: '/manager/apporval',
      condition: or({ kind: 'manager' }, position(AccountPositions.MANAGER)),
    },
    {
      title: 'Projects',
      icon: 'bx bx-briefcase-alt-2',
      route: '/manager/projects',
      condition: or({ kind: 'manager' }, perm(13)),
    },
    {
      title: 'Reports',
      icon: 'bx bx-file',
      route: '/manager/reports',
      condition: or({ kind: 'manager' }, perm(4)),
    },
    {
      title: 'Project Cost',
      icon: 'bx bx-money',
      route: '/manager/costs',
      condition: and(dept(Department.ADMINSTRATION), perm(3)),
    },
    {
      title: 'Developer Progress',
      icon: 'bx bx-line-chart',
      route: '/manager/devprog',
      condition: or(dept(Department.MANAGEMENT), perm(19)),
    },
    {
      title: 'Available To Work',
      icon: 'bx bx-check-square',
      route: '/manager/available',
      condition: dept(Department.MANAGEMENT),
    },
    {
      title: 'Public Reports',
      icon: 'bx bx-file',
      route: '/manager/public_reports',
      condition: or(dept(Department.MANAGEMENT), perm(16)),
    },
    {
      title: 'Admin Tasks',
      icon: 'bx bx-task',
      route: '/manager/admin_tasks',
      condition: or(dept(Department.MANAGEMENT), perm(17)),
    },
    {
      title: 'Project Manager Reports',
      icon: 'bx bx-file',
      route: '/manager/project-manager-reports',
      condition: or(
        dept(Department.MANAGEMENT),
        and(dept(Department.TECHNICAL_TEAM), position(AccountPositions.MANAGER))
      ),
    },
    { title: 'Rating', icon: 'bx bx-star', route: '/manager/rating' },

    // ---- Technical team workspace (navbar dev block): TECHNICAL_TEAM
    // members who are not the team manager get their own project screens ----
    {
      title: 'Team Time Sheet',
      icon: 'bx bx-time',
      route: '/dev/timesheet',
      condition: and(
        dept(Department.TECHNICAL_TEAM),
        { kind: 'not', of: position(AccountPositions.MANAGER) }
      ),
    },
    {
      title: 'Team Notes',
      icon: 'bx bx-note',
      route: '/notes',
      condition: and(
        dept(Department.TECHNICAL_TEAM),
        { kind: 'not', of: position(AccountPositions.MANAGER) }
      ),
    },
    {
      title: 'Reports To Approve',
      icon: 'bx bx-check-circle',
      route: '/dev/reportsToApprove',
      condition: and(
        dept(Department.TECHNICAL_TEAM),
        position(AccountPositions.SENIOR)
      ),
    },
    {
      title: 'My Reports',
      icon: 'bx bx-file',
      route: '/dev/reports',
      condition: and(
        dept(Department.TECHNICAL_TEAM),
        { kind: 'not', of: position(AccountPositions.MANAGER) }
      ),
    },
    {
      title: 'My Requests',
      icon: 'bx bx-paper-plane',
      route: '/dev/requests',
      condition: and(
        dept(Department.TECHNICAL_TEAM),
        { kind: 'not', of: position(AccountPositions.MANAGER) }
      ),
    },
    {
      title: 'My Projects',
      icon: 'bx bx-briefcase-alt-2',
      route: '/dev/myprojects',
      condition: and(
        dept(Department.TECHNICAL_TEAM),
        { kind: 'not', of: position(AccountPositions.MANAGER) }
      ),
    },
    {
      title: 'Users',
      icon: 'bx bx-user',
      route: '/users',
      condition: and(
        dept(Department.TECHNICAL_TEAM),
        { kind: 'not', of: position(AccountPositions.MANAGER) }
      ),
    },
  ],

  ticketing: [
    {
      title: 'Support Reports',
      icon: 'bx bx-file',
      route: '/support-reports',
      condition: perm(25),
    },
    {
      title: 'Support Contract',
      icon: 'bx bx-support',
      route: '/manager/client-support',
      condition: or(dept(Department.MANAGEMENT), perm(6)),
    },
    {
      title: 'Tickets',
      icon: 'bx bx-purchase-tag',
      route: '/tickets',
      condition: or(
        dept(Department.MANAGEMENT),
        and(dept(Department.TECHNICAL_TEAM), position(AccountPositions.MANAGER)),
        perm(2)
      ),
    },
    {
      title: 'License',
      icon: 'bx bx-book',
      route: '/manager/license',
      condition: or(
        dept(Department.MANAGEMENT),
        and(dept(Department.TECHNICAL_TEAM), position(AccountPositions.MANAGER))
      ),
    },
    {
      title: 'Clients',
      icon: 'bx bx-user',
      route: '/manager/partners',
      condition: or(dept(Department.MANAGEMENT), perm(7)),
    },
    {
      title: 'Installments',
      icon: 'bx bx-money',
      route: ['/manager/installments', 't'],
      condition: perm(18),
    },
    {
      title: 'Investment and expenses',
      icon: 'bx bx-wallet',
      route: ['/manager/installments', 'v'],
      condition: perm(18),
    },
  ],

  hr: [
    {
      title: 'Salaries',
      icon: 'bx bx-money',
      route: '/manager/salaries',
      condition: or(dept(Department.MANAGEMENT), perm(1)),
    },
    {
      title: 'Vacations',
      icon: 'bx bx-run',
      route: '/admin-panel/vacations',
      condition: or({ kind: 'manager' }, role(AccountRoles.HUMAN_RESOURCE)),
    },
    {
      title: 'Announces',
      icon: 'bx bx-microphone',
      route: '/admin-panel/announces',
      condition: or({ kind: 'manager' }, role(AccountRoles.HUMAN_RESOURCE)),
    },
    {
      title: 'Candidates',
      icon: 'bx bx-user-plus',
      route: '/hr/hiring-process/candidates',
      condition: perm(34),
    },
    {
      title: 'Job Profiles',
      icon: 'bx bx-id-card',
      route: '/hr/hiring-process/job-profiles',
      condition: perm(28),
    },
    {
      title: 'Job Skills',
      icon: 'bx bx-list-check',
      route: '/hr/hiring-process/job-skills',
      condition: perm(31),
    },
    // ---- Requests section (shown for HR or Administration in the navbar) ----
    {
      title: 'Public Requests',
      icon: 'bx bx-paper-plane',
      route: '/manager/publicreqs',
      condition: or(dept(Department.MANAGEMENT), { kind: 'admin' }),
    },
    {
      title: 'Transportations Requests',
      icon: 'bx bx-car',
      route: '/admin-panel/pendingtransportations',
      condition: or({ kind: 'manager' }, role(AccountRoles.FINANCE)),
    },
    {
      title: 'Transportation Sheet',
      icon: 'bx bx-file',
      route: '/admin-panel/transportationsheet',
      condition: or({ kind: 'manager' }, role(AccountRoles.FINANCE)),
    },
    {
      title: 'Incentive Requests',
      icon: 'bx bx-wallet',
      route: '/manager/incentive',
      condition: or({ kind: 'manager' }, role(AccountRoles.FINANCE)),
    },
  ],

  admin: [
    // Top-of-sidebar dashboard; the navbar link is gated purely on the admin
    // module being enabled (isModuleEnabled('admin')), so no extra condition.
    { title: 'Dashboard', icon: 'bx bx-home', route: '/admin-panel/dashboard' },
    { title: 'Users', icon: 'bx bx-user', route: '/manager/addusers' },
    {
      title: 'All User Data',
      icon: 'bx bx-user-detail',
      route: '/admin-panel/usersdata',
      condition: or(
        dept(Department.MANAGEMENT),
        and(dept(Department.ADMINSTRATION), role(AccountRoles.HUMAN_RESOURCE))
      ),
    },
    {
      title: 'Configurations',
      icon: 'bx bx-cog',
      route: '/manager/config',
      condition: dept(Department.MANAGEMENT),
    },
    // ---- Requests section (shown for HR or Administration in the navbar) ----
    {
      title: 'Public Requests',
      icon: 'bx bx-paper-plane',
      route: '/manager/publicreqs',
      condition: or(dept(Department.MANAGEMENT), { kind: 'admin' }),
    },
    {
      title: 'Transportations Requests',
      icon: 'bx bx-car',
      route: '/admin-panel/pendingtransportations',
      condition: or({ kind: 'manager' }, role(AccountRoles.FINANCE)),
    },
    {
      title: 'Transportation Sheet',
      icon: 'bx bx-file',
      route: '/admin-panel/transportationsheet',
      condition: or({ kind: 'manager' }, role(AccountRoles.FINANCE)),
    },
    {
      title: 'Incentive Requests',
      icon: 'bx bx-wallet',
      route: '/manager/incentive',
      condition: or({ kind: 'manager' }, role(AccountRoles.FINANCE)),
    },
  ],
};

/** Snapshot the evaluator needs — derived from AuthApiService. */
export interface PageVisibilityContext {
  user: { department?: string; accRole?: string; accPosition?: string } | null;
  permissionIds: number[];
  isManager: boolean;
  isAdmin: boolean;
}

/** Pure condition evaluation (unit-testable without Angular). */
export function evaluateCondition(
  condition: PageCondition | undefined,
  ctx: PageVisibilityContext
): boolean {
  if (!condition) {
    return true;
  }

  switch (condition.kind) {
    case 'perm':
      return ctx.permissionIds.includes(condition.id);
    case 'dept':
      return !!ctx.user && condition.values.includes(ctx.user.department as Department);
    case 'position':
      return !!ctx.user && condition.values.includes(ctx.user.accPosition as AccountPositions);
    case 'role':
      return !!ctx.user && condition.values.includes(ctx.user.accRole as AccountRoles);
    case 'manager':
      return ctx.isManager;
    case 'admin':
      return ctx.isAdmin;
    case 'or':
      return condition.all.some((c) => evaluateCondition(c, ctx));
    case 'and':
      return condition.all.every((c) => evaluateCondition(c, ctx));
    case 'not':
      return !evaluateCondition(condition.of, ctx);
    default:
      return true;
  }
}

/** Pages of a module visible for the given context, in registry order. */
export function visiblePages(slug: string, ctx: PageVisibilityContext): ModulePage[] {
  return (MODULE_PAGES[slug] ?? []).filter((page) =>
    evaluateCondition(page.condition, ctx)
  );
}
