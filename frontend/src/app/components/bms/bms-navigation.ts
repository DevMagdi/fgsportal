export interface BmsNavigationLink {
  path: string;
  label: string;
  ability: string;
  icon: string;
}

export interface BmsNavigationGroup {
  id: string;
  label: string;
  icon: string;
  links: BmsNavigationLink[];
}

/**
 * BMS-only information architecture. Every BMS workflow route is assigned once;
 * visibility of individual links is filtered by the server-provided abilities.
 */
export const BMS_NAVIGATION_GROUPS: BmsNavigationGroup[] = [
  {
    id: 'organization', label: 'grpOrganization', icon: 'bx-buildings', links: [
      { path: 'units', label: 'units', ability: 'units.view', icon: 'bx-buildings' },
      { path: 'employees', label: 'employees', ability: 'directory.view', icon: 'bx-id-card' },
      { path: 'recruitment', label: 'recruitment', ability: 'recruitment.view', icon: 'bx-user-plus' },
      // Workforce training/certification stays on its existing route and ability.
      { path: 'development', label: 'development', ability: 'development.view', icon: 'bx-trending-up' },
    ],
  },
  {
    id: 'access-management', label: 'grpAccessManagement', icon: 'bx-shield-quarter', links: [
      { path: 'access', label: 'accessRoles', ability: 'roles.manage', icon: 'bx-shield-quarter' },
    ],
  },
  {
    id: 'execution', label: 'grpExecution', icon: 'bx-task', links: [
      { path: 'plans', label: 'plans', ability: 'plans.view', icon: 'bx-calendar-check' },
      { path: 'my-tasks', label: 'myTasks', ability: 'plans.view', icon: 'bx-task' },
    ],
  },
  {
    id: 'business-development', label: 'grpBusinessDev', icon: 'bx-briefcase', links: [
      { path: 'leads', label: 'leads', ability: 'leads.view', icon: 'bx-network-chart' },
      { path: 'opportunities', label: 'opportunities', ability: 'opportunities.view', icon: 'bx-briefcase' },
    ],
  },
  {
    id: 'operations', label: 'grpOperations', icon: 'bx-cog', links: [
      { path: 'meetings', label: 'meetings', ability: 'meetings.view', icon: 'bx-calendar' },
      { path: 'products', label: 'products', ability: 'products.view', icon: 'bx-package' },
      { path: 'procurement', label: 'procurement', ability: 'procurement.view', icon: 'bx-cart' },
      { path: 'events', label: 'events', ability: 'events.view', icon: 'bx-calendar-star' },
      { path: 'documents', label: 'documents', ability: 'documents.view', icon: 'bx-folder-open' },
    ],
  },
  {
    id: 'reports', label: 'grpReports', icon: 'bx-bar-chart-alt-2', links: [
      { path: 'dashboard', label: 'dashboard', ability: 'dashboard.view', icon: 'bx-bar-chart-alt-2' },
      { path: 'reports', label: 'reports', ability: 'reports.view', icon: 'bx-file' },
    ],
  },
];

/** Pure navigation helpers keep IA and permission filtering easy to verify. */
export class BmsNavigationState {
  expandedGroupId = 'reports';

  toggle(groupId: string): void {
    this.expandedGroupId = this.expandedGroupId === groupId ? '' : groupId;
  }

  expandForPath(url: string): void {
    const group = this.groupForPath(url);
    if (group) this.expandedGroupId = group.id;
  }

  isExpanded(groupId: string): boolean {
    return this.expandedGroupId === groupId;
  }

  groupForPath(url: string): BmsNavigationGroup | undefined {
    return BMS_NAVIGATION_GROUPS.find(group => group.links.some(link => this.matches(url, link.path)));
  }

  linkForPath(url: string): BmsNavigationLink | undefined {
    for (const group of BMS_NAVIGATION_GROUPS) {
      const link = group.links.find(item => this.matches(url, item.path));
      if (link) return link;
    }
    return undefined;
  }

  visibleLinks(group: BmsNavigationGroup, abilities: string[]): BmsNavigationLink[] {
    return group.links.filter(link => abilities.includes(link.ability));
  }

  private matches(url: string, path: string): boolean {
    const normalized = url.split('?')[0].replace(/^#/, '').replace(/\/$/, '');
    const target = `/bms/${path}`;
    return normalized === target || normalized.startsWith(`${target}/`);
  }
}
