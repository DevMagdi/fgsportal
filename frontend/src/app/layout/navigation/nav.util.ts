import { NavContext, NavCounters, NavGroup, NavItem, VisibleNavGroup } from './nav.model';

/** Strip hash, query string, fragment and trailing slash from a router URL. */
export function normalizeUrl(url: string): string {
  const clean = (url || '').replace(/^#/, '').split('?')[0].split('#')[0].replace(/\/+$/, '');
  return clean || '/';
}

/** Groups with only the items the context may see; empty groups are dropped. */
export function visibleGroups(groups: NavGroup[], context: NavContext): VisibleNavGroup[] {
  return groups
    .map(group => ({ ...group, items: group.items.filter(item => safeVisible(item, context)) }))
    .filter(group => group.items.length > 0);
}

function safeVisible(item: NavItem, context: NavContext): boolean {
  try { return !!item.visible(context); } catch (_error) { return false; }
}

function matches(url: string, route: string): boolean {
  return url === route || url.startsWith(`${route}/`);
}

export interface ActiveNav { group: NavGroup; item: NavItem; }

/**
 * The entry that owns a URL: the longest route that equals the URL or is a
 * path-prefix of it. When several entries share a route (the legacy navbar
 * listed some pages twice under different labels) the first one of `groups`
 * wins, so pass the *visible* groups to resolve what the user actually sees.
 */
export function activeNav(groups: NavGroup[], url: string): ActiveNav | undefined {
  const target = normalizeUrl(url);
  let best: ActiveNav | undefined;
  for (const group of groups) {
    for (const item of group.items) {
      if (matches(target, item.route) && (!best || item.route.length > best.item.route.length)) {
        best = { group, item };
      }
    }
  }
  return best;
}

/** Every distinct route in the registry (used by the route-coverage check). */
export function allRoutes(groups: NavGroup[]): string[] {
  const seen = new Set<string>();
  groups.forEach(group => group.items.forEach(item => seen.add(item.route)));
  return [...seen];
}

/**
 * Navigation counters with the defaults and totals exactly as the retired
 * navbar derived them from `getNavPermsByUserID`:
 *   totalManageCounter   = open_to_work_counter + pendingReport + project_manager_reports
 *   hrCounter            = pendingVacationsRequest
 *   totalRequestsCounter = pendingPublicRequest + pendingTransportationRequest
 *   totalCRMReqsCounter  = myPendingRFPRequest + myPendingPOCRequest
 *   totalReports         = rejectedReport + devPendingReports
 */
export function countersFrom(params: any): NavCounters {
  const n = (value: any): number => value ? value : 0;
  const counters: NavCounters = {
    pendingReport: n(params?.pendingReport),
    devPendingReports: n(params?.devPendingReports),
    rejectedReport: n(params?.rejectedReport),
    pendingVacationsRequest: n(params?.pendingVacationsRequest),
    pendingTransportationRequest: n(params?.pendingTransportationRequest),
    pendingIncentiveRequest: n(params?.pendingIncentiveRequest),
    pendingPublicRequest: n(params?.pendingPublicRequest),
    myPendingPOCRequest: n(params?.myPendingPOCRequest),
    myPendingRFPRequest: n(params?.myPendingRFPRequest),
    open_to_work_counter: n(params?.open_to_work_counter),
    project_manager_reports: n(params?.project_manager_reports),
    totalManageCounter: 0, hrCounter: 0, totalRequestsCounter: 0, totalCRMReqsCounter: 0, totalReports: 0,
  };
  counters.totalManageCounter = counters.open_to_work_counter + counters.pendingReport + counters.project_manager_reports;
  counters.hrCounter = counters.pendingVacationsRequest;
  counters.totalRequestsCounter = counters.pendingPublicRequest + counters.pendingTransportationRequest;
  counters.totalCRMReqsCounter = counters.myPendingRFPRequest + counters.myPendingPOCRequest;
  counters.totalReports = counters.rejectedReport + counters.devPendingReports;
  return counters;
}
