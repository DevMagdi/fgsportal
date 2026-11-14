/**
 * Pure helpers behind the organization screens. Everything here is derived
 * from what the existing BMS endpoints return (`units`, `units/{id}`,
 * `employees`, `products`, `executive-dashboard`); nothing is invented.
 */

export interface OrgPerson { id: number; username?: string; firstname?: string; lastname?: string; name?: string; email?: string; }
export interface OrgUnit {
  id: number; name: string; parent_id?: number | null; description?: string | null; services?: string[] | null;
  is_active?: boolean; director_id?: number | null; director?: OrgPerson | null; users?: OrgPerson[]; parent?: { id: number; name: string } | null;
}
export interface OrgUnitNode { unit: OrgUnit; children: OrgUnitNode[]; depth: number; }
export interface OrgProduct { id: number; product_name: string; business_units?: { id: number; name: string }[]; overall_progress?: number | null; current_phase?: { name: string } | null; }
export interface OrgUnitProgress { id: number; total: number; achieved: number; in_progress: number; not_done: number; blocked: number; progress: number; }
/** One row of `GET bms/employees`. */
export interface OrgEmployee {
  id: number; name: string; username?: string; email?: string; job_title?: string | null; manager_id?: number | null; manager?: string | null;
  active?: boolean; business_units?: { id: number; name: string }[]; roles?: { id: number; name: string; slug: string; business_unit_id: number | null }[];
  photo_url?: string | null; has_photo?: boolean;
}
export interface ReportingNode { employee: OrgEmployee; reports: ReportingNode[]; depth: number; }
export interface ReportingLines {
  /** People at the top of a line inside this unit (no manager, or a manager outside the unit) who have at least one report here. */
  lines: ReportingNode[];
  /** Members of the unit with neither a manager in the unit nor a report in the unit. */
  unattached: OrgEmployee[];
  /** Number of members whose manager is also a member of the unit. */
  linked: number;
}

/** "First Last", else username, else a prepared `name`, else a dash. */
export function personName(person: OrgPerson | null | undefined): string {
  if (!person) return '-';
  const full = `${person.firstname || ''} ${person.lastname || ''}`.trim();
  return full || person.name || person.username || '-';
}

export function initials(name: string | null | undefined): string {
  const parts = (name || '').trim().split(/\s+/).filter(part => part && part !== '-');
  if (!parts.length) return '?';
  const first = Array.from(parts[0])[0] || '';
  const last = parts.length > 1 ? Array.from(parts[parts.length - 1])[0] || '' : '';
  return (first + last).toUpperCase();
}

const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name);

/**
 * The unit hierarchy. A unit whose parent is not in the list (the viewer may
 * only see part of the organization) becomes a root, so nothing is dropped.
 */
export function buildUnitTree(units: OrgUnit[]): OrgUnitNode[] {
  const ids = new Set(units.map(unit => unit.id));
  const childrenOf = new Map<number, OrgUnit[]>();
  const roots: OrgUnit[] = [];
  units.forEach(unit => {
    const parentId = unit.parent_id;
    if (parentId != null && parentId !== unit.id && ids.has(parentId)) {
      childrenOf.set(parentId, [...(childrenOf.get(parentId) || []), unit]);
    } else {
      roots.push(unit);
    }
  });
  const visited = new Set<number>();
  const build = (unit: OrgUnit, depth: number): OrgUnitNode => {
    visited.add(unit.id);
    const children = (childrenOf.get(unit.id) || []).filter(child => !visited.has(child.id)).sort(byName);
    return { unit, depth, children: children.map(child => build(child, depth + 1)) };
  };
  const tree = roots.sort(byName).map(root => build(root, 0));
  // Defensive: units trapped in a parent cycle would otherwise disappear.
  units.slice().sort(byName).forEach(unit => { if (!visited.has(unit.id)) tree.push(build(unit, 0)); });
  return tree;
}

export function flattenTree(nodes: OrgUnitNode[]): OrgUnitNode[] {
  return nodes.reduce((all: OrgUnitNode[], node) => all.concat([node], flattenTree(node.children)), []);
}

/**
 * Every assigned person once, with the units they are assigned to.
 * Membership is the unit's `users` list, the same basis as the backend's
 * `headcount`; a director who is not also assigned is shown as director only.
 */
export function distinctPeople(units: OrgUnit[]): { person: OrgPerson; unitIds: number[] }[] {
  const people = new Map<number, { person: OrgPerson; unitIds: number[] }>();
  const add = (person: OrgPerson | null | undefined, unitId: number) => {
    if (!person || person.id == null) return;
    const entry = people.get(person.id) || { person, unitIds: [] };
    if (!entry.unitIds.includes(unitId)) entry.unitIds.push(unitId);
    people.set(person.id, entry);
  };
  units.forEach(unit => {
    (unit.users || []).forEach(user => add(user, unit.id));
  });
  return Array.from(people.values());
}

export function unitHeadcount(unit: OrgUnit): number {
  return new Set((unit.users || []).map(user => user.id)).size;
}

export function productsForUnit<T extends OrgProduct>(products: T[], unitId: number): T[] {
  return products.filter(product => (product.business_units || []).some(unit => unit.id === unitId));
}

export function progressForUnit(progress: OrgUnitProgress[] | null | undefined, unitId: number): OrgUnitProgress | null {
  return (progress || []).find(entry => entry.id === unitId) || null;
}

/**
 * Reporting lines among the members of one unit, from each member's
 * `manager_id`. This is who-reports-to-whom; it is not a team structure.
 * A manager outside the unit is not drawn here (their name stays available on
 * the employee as `manager`).
 */
export function reportingLines(members: OrgEmployee[]): ReportingLines {
  const byId = new Map(members.map(member => [member.id, member]));
  const reportsOf = new Map<number, OrgEmployee[]>();
  let linked = 0;
  members.forEach(member => {
    const managerId = member.manager_id;
    if (managerId != null && managerId !== member.id && byId.has(managerId)) {
      linked++;
      reportsOf.set(managerId, [...(reportsOf.get(managerId) || []), member]);
    }
  });
  const isRoot = (member: OrgEmployee) => member.manager_id == null || member.manager_id === member.id || !byId.has(member.manager_id);
  const visited = new Set<number>();
  const build = (employee: OrgEmployee, depth: number): ReportingNode => {
    visited.add(employee.id);
    const reports = (reportsOf.get(employee.id) || []).filter(report => !visited.has(report.id)).sort(byName);
    return { employee, depth, reports: reports.map(report => build(report, depth + 1)) };
  };
  const lines: ReportingNode[] = [];
  const unattached: OrgEmployee[] = [];
  members.filter(isRoot).sort(byName).forEach(member => {
    if ((reportsOf.get(member.id) || []).length) lines.push(build(member, 0));
    else { visited.add(member.id); unattached.push(member); }
  });
  // A cycle has no root; the backend rejects cycles, but never hide people if one exists.
  members.slice().sort(byName).forEach(member => { if (!visited.has(member.id)) lines.push(build(member, 0)); });
  return { lines, unattached, linked };
}

export function flattenReporting(nodes: ReportingNode[]): ReportingNode[] {
  return nodes.reduce((all: ReportingNode[], node) => all.concat([node], flattenReporting(node.reports)), []);
}

/** Role names an employee holds inside one unit (unit-scoped assignments only). */
export function unitRoleNames(employee: OrgEmployee, unitId: number): string[] {
  return (employee.roles || []).filter(role => role.business_unit_id === unitId).map(role => role.name);
}

export function unitNameById(units: { id: number; name: string }[], id: number | null | undefined): string {
  if (id == null) return '';
  return (units.find(unit => unit.id === id) || { name: `#${id}` }).name;
}
