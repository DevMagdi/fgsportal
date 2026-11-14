/**
 * Unified application navigation model.
 *
 * Every entry of the single global sidebar is declared once in
 * `nav.registry.ts`. Visibility is a pure function of {@link NavContext}, so
 * the exact legacy rules (permission ids, roles, departments, company modules)
 * and the BMS server abilities can be verified without Angular.
 */

/** The user fields the legacy navbar template compared against its enums. */
export interface NavUser {
  department?: any;
  accRole?: any;
  accPosition?: any;
  accType?: any;
}

/** Counters delivered by `getNavPermsByUserID` plus the totals the navbar derived. */
export interface NavCounters {
  pendingReport: number;
  devPendingReports: number;
  rejectedReport: number;
  pendingVacationsRequest: number;
  pendingTransportationRequest: number;
  pendingIncentiveRequest: number;
  pendingPublicRequest: number;
  myPendingPOCRequest: number;
  myPendingRFPRequest: number;
  open_to_work_counter: number;
  project_manager_reports: number;
  totalManageCounter: number;
  hrCounter: number;
  totalRequestsCounter: number;
  totalCRMReqsCounter: number;
  totalReports: number;
}

export type NavCounterKey = keyof NavCounters;

export const EMPTY_NAV_COUNTERS: NavCounters = {
  pendingReport: 0, devPendingReports: 0, rejectedReport: 0, pendingVacationsRequest: 0,
  pendingTransportationRequest: 0, pendingIncentiveRequest: 0, pendingPublicRequest: 0,
  myPendingPOCRequest: 0, myPendingRFPRequest: 0, open_to_work_counter: 0, project_manager_reports: 0,
  totalManageCounter: 0, hrCounter: 0, totalRequestsCounter: 0, totalCRMReqsCounter: 0, totalReports: 0,
};

export interface NavContext {
  /** `currentUser` of the legacy navbar (refreshed from the server). */
  user: NavUser;
  /** `isManager` exactly as the legacy navbar computed it from the auth user. */
  isManager: boolean;
  /** `isAdmin` exactly as the legacy navbar computed it from the auth user. */
  isAdmin: boolean;
  /** Legacy `permission_id` values held by the user (`checkIfHasPerm`). */
  permissionIds: any[];
  /** `ModuleService.isModuleEnabled`. */
  moduleEnabled: (slug: string) => boolean;
  /** BMS abilities (`can[]` of `GET /api/bms/lookups`). */
  abilities: string[];
}

export type NavRule = (context: NavContext) => boolean;

export interface NavItem {
  id: string;
  /** Absolute application URL (hash routing adds the `#`). */
  route: string;
  /** Translation key (see `shell-translations.ts` / BMS dictionary). */
  label: string;
  icon: string;
  visible: NavRule;
  /**
   * Parity evidence: where the rule comes from. For legacy entries this is the
   * effective expression of the retired navbar template (group header AND
   * collapse container AND item), for BMS entries the server ability.
   */
  source: string;
  badge?: NavCounterKey;
}

export interface NavGroup {
  id: string;
  label: string;
  icon: string;
  section: 'bms' | 'workspace';
  badge?: NavCounterKey;
  items: NavItem[];
}

export interface VisibleNavGroup extends NavGroup {
  items: NavItem[];
}
