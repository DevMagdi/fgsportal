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
  /**
   * Sidebar group the card belongs to. Mirrors a collapsible sidebar section
   * (CRM, Project Management, Support, HR, Requests, Administration, …).
   * Pages without a section render in a single default group.
   */
  section?: string;
  /** When absent the page is visible to everyone who can open the module. */
  condition?: PageCondition;
}

/** A resolved sidebar section after visibility rules have been applied. */
export interface ModulePageSection {
  title: string;
  pages: ModulePage[];
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
 * The standalone "Requests" sidebar section is shown when the HR or the
 * Administration module is enabled, so it is shared verbatim by both
 * module overviews. Same titles, routes and *ngIf rules as the navbar.
 */
const requestPages = (): ModulePage[] => [
  {
    section: 'Requests',
    title: 'Public requests',
    icon: 'bx bx-paper-plane',
    route: '/manager/publicreqs',
    condition: or(dept(Department.MANAGEMENT), { kind: 'admin' }),
  },
  {
    section: 'Requests',
    title: 'Transportations Requests',
    icon: 'bx bx-car',
    route: '/admin-panel/pendingtransportations',
    condition: or({ kind: 'manager' }, role(AccountRoles.FINANCE)),
  },
  {
    section: 'Requests',
    title: 'Transportation Sheet',
    icon: 'bx bx-file',
    route: '/admin-panel/transportationsheet',
    condition: or({ kind: 'manager' }, role(AccountRoles.FINANCE)),
  },
  {
    section: 'Requests',
    title: 'Incentive Requests',
    icon: 'bx bx-wallet',
    route: '/manager/incentive',
    condition: or({ kind: 'manager' }, role(AccountRoles.FINANCE)),
  },
];

/**
 * Per-module feature catalogue, organised into the SAME collapsible
 * sections as the sidebar. Every entry mirrors a real sidebar link: same
 * section, title, router target and *ngIf visibility condition.
 */
export const MODULE_PAGES: Record<string, ModulePage[]> = {
  // ---- Standalone always-on links (Notes) + the perm-gated Time Sheet ----
  core: [
    {
      section: 'General',
      title: 'Time Sheet',
      icon: 'bx bx-time',
      route: '/my_work',
      condition: perm(12),
    },
    { section: 'General', title: 'Notes', icon: 'bx bx-note', route: '/notes' },
  ],

  // ---- CRM sidebar block (#crmOpened) ----
  crm: [
    { section: 'CRM', title: 'Insights', icon: 'bx bx-trending-up', route: '/CRM/dashboard' },
    {
      section: 'CRM',
      title: 'Reports',
      icon: 'bx bx-file',
      route: '/CRM/reports',
      condition: dept(Department.MANAGEMENT),
    },
    { section: 'CRM', title: 'Organizations', icon: 'bx bx-buildings', route: '/CRM/accounts' },
    { section: 'CRM', title: 'Contacts', icon: 'bx bx-user', route: '/CRM/contacts' },
    { section: 'CRM', title: 'Activities', icon: 'bx bx-calendar-event', route: '/CRM/activities' },
    { section: 'CRM', title: 'Requests', icon: 'bx bx-git-pull-request', route: '/CRM/poc-requests' },
    { section: 'CRM', title: 'Leads', icon: 'bx bx-user-check', route: '/CRM/leads' },
    { section: 'CRM', title: 'Opportunity', icon: 'bx bx-dollar-circle', route: '/CRM/opportunity' },
    { section: 'CRM', title: 'Closed Deal', icon: 'bx bx-shield-x', route: '/CRM/closed' },
    // Business Development workspace (navbar businessDevelopmentModule).
    {
      section: 'CRM',
      title: 'Public requests',
      icon: 'bx bx-paper-plane',
      route: '/CRM/requests',
      condition: dept(Department.Business_Development),
    },
    {
      section: 'CRM',
      title: 'Handle Public requests',
      icon: 'bx bx-check-circle',
      route: '/publicReqsApply',
      condition: perm(11),
    },
  ],

  // ---- Project Management sidebar block (#reports) ----
  projects: [
    {
      section: 'Project Management',
      title: 'Pending Reports',
      icon: 'bx bx-timer',
      route: '/manager/apporval',
      condition: or({ kind: 'manager' }, position(AccountPositions.MANAGER)),
    },
    {
      section: 'Project Management',
      title: 'Projects',
      icon: 'bx bx-briefcase-alt-2',
      route: '/manager/projects',
      condition: or({ kind: 'manager' }, perm(13)),
    },
    {
      section: 'Project Management',
      title: 'Reports',
      icon: 'bx bx-file',
      route: '/manager/reports',
      condition: or({ kind: 'manager' }, perm(4)),
    },
    {
      section: 'Project Management',
      title: 'Project Cost',
      icon: 'bx bx-money',
      route: '/manager/costs',
      condition: and(dept(Department.ADMINSTRATION), perm(3)),
    },
    {
      section: 'Project Management',
      // Spelling kept identical to the sidebar label.
      title: 'Devloper Progress',
      icon: 'bx bx-line-chart',
      route: '/manager/devprog',
      condition: or(dept(Department.MANAGEMENT), perm(19)),
    },
    {
      section: 'Project Management',
      title: 'Available To Work',
      icon: 'bx bx-check-square',
      route: '/manager/available',
      condition: dept(Department.MANAGEMENT),
    },
    {
      section: 'Project Management',
      title: 'Public Reports',
      icon: 'bx bx-file',
      route: '/manager/public_reports',
      condition: or(dept(Department.MANAGEMENT), perm(16)),
    },
    {
      section: 'Project Management',
      title: 'Admin Tasks',
      icon: 'bx bx-task',
      route: '/manager/admin_tasks',
      condition: or(dept(Department.MANAGEMENT), perm(17)),
    },
    {
      section: 'Project Management',
      title: 'Project Manager Reports',
      icon: 'bx bx-file',
      route: '/manager/project-manager-reports',
      condition: or(
        dept(Department.MANAGEMENT),
        and(dept(Department.TECHNICAL_TEAM), position(AccountPositions.MANAGER))
      ),
    },
    { section: 'Project Management', title: 'Rating', icon: 'bx bx-star', route: '/manager/rating' },

    // Technical team workspace (navbar dev block): TECHNICAL_TEAM members
    // who are not the team manager get their own project screens.
    {
      section: 'Technical Team',
      title: 'Team Time Sheet',
      icon: 'bx bx-time',
      route: '/dev/timesheet',
      condition: and(
        dept(Department.TECHNICAL_TEAM),
        { kind: 'not', of: position(AccountPositions.MANAGER) }
      ),
    },
    {
      section: 'Technical Team',
      title: 'Team Notes',
      icon: 'bx bx-note',
      route: '/notes',
      condition: and(
        dept(Department.TECHNICAL_TEAM),
        { kind: 'not', of: position(AccountPositions.MANAGER) }
      ),
    },
    {
      section: 'Technical Team',
      title: 'Reports To Approve',
      icon: 'bx bx-check-circle',
      route: '/dev/reportsToApprove',
      condition: and(
        dept(Department.TECHNICAL_TEAM),
        position(AccountPositions.SENIOR)
      ),
    },
    {
      section: 'Technical Team',
      title: 'My Reports',
      icon: 'bx bx-file',
      route: '/dev/reports',
      condition: and(
        dept(Department.TECHNICAL_TEAM),
        { kind: 'not', of: position(AccountPositions.MANAGER) }
      ),
    },
    {
      section: 'Technical Team',
      title: 'My Requests',
      icon: 'bx bx-paper-plane',
      route: '/dev/requests',
      condition: and(
        dept(Department.TECHNICAL_TEAM),
        { kind: 'not', of: position(AccountPositions.MANAGER) }
      ),
    },
    {
      section: 'Technical Team',
      title: 'My Projects',
      icon: 'bx bx-briefcase-alt-2',
      route: '/dev/myprojects',
      condition: and(
        dept(Department.TECHNICAL_TEAM),
        { kind: 'not', of: position(AccountPositions.MANAGER) }
      ),
    },
    {
      section: 'Technical Team',
      title: 'Users',
      icon: 'bx bx-user',
      route: '/users',
      condition: and(
        dept(Department.TECHNICAL_TEAM),
        { kind: 'not', of: position(AccountPositions.MANAGER) }
      ),
    },
  ],

  // ---- Support sidebar block (#support) + role-gated finance/reports ----
  ticketing: [
    {
      section: 'Support Reports',
      title: 'Support Reports',
      icon: 'bx bx-file',
      route: '/support-reports',
      condition: perm(25),
    },
    {
      section: 'Support',
      title: 'Support Contract',
      icon: 'bx bx-support',
      route: '/manager/client-support',
      condition: or(dept(Department.MANAGEMENT), perm(6)),
    },
    {
      section: 'Support',
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
      section: 'Support',
      title: 'License',
      icon: 'bx bx-book',
      route: '/manager/license',
      condition: or(
        dept(Department.MANAGEMENT),
        and(dept(Department.TECHNICAL_TEAM), position(AccountPositions.MANAGER))
      ),
    },
    {
      section: 'Support',
      title: 'Clients',
      icon: 'bx bx-user',
      route: '/manager/partners',
      condition: or(dept(Department.MANAGEMENT), perm(7)),
    },
    {
      section: 'Finance',
      title: 'Installments',
      icon: 'bx bx-money',
      route: ['/manager/installments', 't'],
      condition: perm(18),
    },
    {
      section: 'Finance',
      title: 'Investment and expenses',
      icon: 'bx bx-wallet',
      route: ['/manager/installments', 'v'],
      condition: perm(18),
    },
  ],

  // ---- HR sidebar block (#hr) + Hiring Process + the shared Requests block ----
  hr: [
    {
      section: 'HR',
      title: 'Salaries',
      icon: 'bx bx-money',
      route: '/manager/salaries',
      condition: or(dept(Department.MANAGEMENT), perm(1)),
    },
    {
      section: 'HR',
      title: 'Vacations',
      icon: 'bx bx-run',
      route: '/admin-panel/vacations',
      condition: or({ kind: 'manager' }, role(AccountRoles.HUMAN_RESOURCE)),
    },
    {
      section: 'HR',
      title: 'Announces',
      icon: 'bx bx-microphone',
      route: '/admin-panel/announces',
      condition: or({ kind: 'manager' }, role(AccountRoles.HUMAN_RESOURCE)),
    },
    {
      section: 'Hiring Process',
      title: 'Candidates',
      icon: 'bx bx-user-plus',
      route: '/hr/hiring-process/candidates',
      condition: perm(34),
    },
    {
      section: 'Hiring Process',
      title: 'Job Profiles',
      icon: 'bx bx-id-card',
      route: '/hr/hiring-process/job-profiles',
      condition: perm(28),
    },
    {
      section: 'Hiring Process',
      title: 'Job Skills',
      icon: 'bx bx-list-check',
      route: '/hr/hiring-process/job-skills',
      condition: perm(31),
    },
    ...requestPages(),
  ],

  // ---- Dashboard + Administration block (#admin) + Requests + Configurations ----
  admin: [
    {
      section: 'Dashboard',
      title: 'Dashboard',
      icon: 'bx bx-home',
      // Navbar gates this link purely on isModuleEnabled('admin').
      route: '/admin-panel/dashboard',
    },
    { section: 'Administration', title: 'Users', icon: 'bx bx-user', route: '/manager/addusers' },
    {
      section: 'Administration',
      title: 'All User Data',
      icon: 'bx bx-user-detail',
      route: '/admin-panel/usersdata',
      condition: or(
        dept(Department.MANAGEMENT),
        and(dept(Department.ADMINSTRATION), role(AccountRoles.HUMAN_RESOURCE))
      ),
    },
    ...requestPages(),
    {
      section: 'Configurations',
      title: 'Configurations',
      icon: 'bx bx-cog',
      route: '/manager/config',
      condition: dept(Department.MANAGEMENT),
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

/**
 * Visible pages grouped by their sidebar section, preserving both the
 * registry's section order and the card order inside each section. Empty
 * sections (every card hidden by permissions) are dropped.
 */
export function visibleSections(
  slug: string,
  ctx: PageVisibilityContext
): ModulePageSection[] {
  const sections: ModulePageSection[] = [];
  const indexByTitle = new Map<string, number>();

  for (const page of visiblePages(slug, ctx)) {
    const title = page.section ?? 'General';
    if (!indexByTitle.has(title)) {
      indexByTitle.set(title, sections.length);
      sections.push({ title, pages: [] });
    }
    sections[indexByTitle.get(title) as number].pages.push(page);
  }

  return sections;
}
