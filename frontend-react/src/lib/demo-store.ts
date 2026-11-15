/**
 * Mutable, browser-local demo workspace. It is never used for a real API call.
 * Keep the fixtures immutable and persist only serializable business records.
 */
import {
  demoDevelopment, demoDirectory, demoDocuments, demoEvents, demoHiring, demoLeads,
  demoLookups, demoMeetings, demoOpportunities, demoPlans, demoProcedures,
  demoProcurement, demoProducts, demoTeams, demoUnits,
} from './demo-data';
import type { Bonus, DemoActivity, EntityKind, EntityMap, EntityPayload, LookupUser, MeetingAttendee, MeetingAttendeeInput, OpportunityDocument, UnitTask } from './types';

const KEY = 'bms.demo.workspace.v2';
type Store = { [K in EntityKind]: EntityMap[K][] } & {
  activity: DemoActivity[];
  opportunityDocuments: OpportunityDocument[];
  counters: Partial<Record<EntityKind, number>>;
};

const seedBonuses: Bonus[] = [
  { id: 1, title: 'Project delivery award', employee_id: 1, business_unit_id: 1, amount: 8500, currency: 'SAR', awarded_on: '2026-11-01', status: 'approved', notes: 'Recognizing the Kraken pilot milestone.' },
  { id: 2, title: 'Quarterly performance', employee_id: 3, business_unit_id: 2, amount: 6000, currency: 'SAR', awarded_on: '2026-10-25', status: 'paid', notes: 'Outstanding work on Argus delivery.' },
  { id: 3, title: 'Partnership recognition', employee_id: 2, business_unit_id: 3, amount: 4500, currency: 'SAR', awarded_on: '2026-11-10', status: 'draft' },
];

function initial(): Store {
  return JSON.parse(JSON.stringify({
    units: demoUnits, employees: demoDirectory.map((person) => ({ ...person, manager_id: person.manager ? 1 : null, units: demoUnits.filter((unit) => unit.users?.some((user) => user.id === person.id)).map((unit) => ({ id: unit.id, name: unit.name, parent_id: unit.parent_id })) })), opportunities: demoOpportunities,
    bonuses: seedBonuses, teams: demoTeams, plans: demoPlans,
    tasks: demoPlans.flatMap((plan) => plan.tasks ?? []), leads: demoLeads, meetings: demoMeetings,
    products: demoProducts, recruitment: demoHiring, development: demoDevelopment,
    procurement: demoProcurement, events: demoEvents, documents: demoDocuments.map((document) => ({ ...document, business_unit_id: document.unit?.id ?? null })),
    procedures: demoProcedures, activity: [], opportunityDocuments: [], counters: {},
  })) as Store;
}

function read(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Store>;
      return { ...initial(), ...parsed };
    }
  } catch { /* a corrupt demo store falls back to the fixtures */ }
  return initial();
}
function write(store: Store) { localStorage.setItem(KEY, JSON.stringify(store)); }
function nextId(records: { id: number }[]) { return Math.max(0, ...records.map((r) => r.id)) + 1; }
function liteUser(store: Store, id?: number | null): LookupUser | null {
  const person = store.employees.find((p) => p.id === Number(id));
  if (!person) return null;
  const [firstname, ...last] = person.name.split(' ');
  return { id: person.id, username: person.username, firstname, lastname: last.join(' '), email: person.email };
}
function liteUnit(store: Store, id?: number | null) {
  const u = store.units.find((unit) => unit.id === Number(id));
  return u ? { id: u.id, name: u.name, parent_id: u.parent_id } : null;
}
function relationUnitIds(person: EntityMap['employees']): number[] {
  return (person.units ?? person.business_units ?? []).map((u) => u.id);
}

/** Resolve current relationships on every read, so edits are reflected in related pages. */
function enrich<K extends EntityKind>(kind: K, raw: EntityMap[K], store: Store): EntityMap[K] {
  const item = { ...raw } as EntityMap[EntityKind] & Record<string, unknown>;
  const legacyUnit = kind === 'documents' && !('business_unit_id' in item) ? (raw as EntityMap['documents']).unit : null;
  const unitId = typeof item.business_unit_id === 'number' ? item.business_unit_id : legacyUnit?.id;
  if ('business_unit_id' in item || legacyUnit) item.unit = unitId ? liteUnit(store, unitId) : null;
  if ('owner_id' in item) item.owner = liteUser(store, typeof item.owner_id === 'number' ? item.owner_id : null);
  if (kind === 'units') {
    const u = raw as EntityMap['units'];
    item.director = liteUser(store, u.director_id);
    item.parent = liteUnit(store, u.parent_id);
    item.children = store.units.filter((x) => x.parent_id === u.id).map((x) => ({ id: x.id, name: x.name }));
    item.users = store.employees.filter((p) => relationUnitIds(p).includes(u.id)).map((p) => liteUser(store, p.id));
    item.headcount = (item.users as unknown[]).length;
    item.weeklyPlans = store.plans.filter((p) => p.business_unit_id === u.id).map((p) => enrich('plans', p, store));
  }
  if (kind === 'employees') {
    const p = raw as EntityMap['employees'];
    item.units = relationUnitIds(p).map((id) => liteUnit(store, id)).filter(Boolean);
    item.business_units = item.units;
    if ('manager_id' in p) item.manager = p.manager_id ? store.employees.find((m) => m.id === p.manager_id)?.name ?? null : null;
  }
  if (kind === 'opportunities') {
    const o = raw as EntityMap['opportunities'];
    item.product = store.products.find((p) => p.id === o.product_id) ? { id: o.product_id, product_name: store.products.find((p) => p.id === o.product_id)!.product_name } : null;
    item.history = o.history ?? [
      { id: 1, from_stage: null, to_stage: o.stage, note: 'Registered in BMS', created_at: o.last_update_at, user: liteUser(store, o.owner_id) },
    ];
  }
  if (kind === 'bonuses') {
    const b = raw as EntityMap['bonuses'];
    const p = store.employees.find((employee) => employee.id === b.employee_id);
    item.employee = p ? { id: p.id, name: p.name } : null;
  }
  if (kind === 'plans') {
    const p = raw as EntityMap['plans'];
    item.tasks = store.tasks.filter((task) => task.weekly_plan_id === p.id).map((task) => enrich('tasks', task, store));
  }
  if (kind === 'tasks') {
    const task = raw as UnitTask;
    const plan = store.plans.find((p) => p.id === task.weekly_plan_id);
    item.plan = plan ? { id: plan.id, week_start: plan.week_start, status: plan.status } : null;
  }
  if (kind === 'teams') {
    const team = raw as EntityMap['teams'];
    item.business_unit = liteUnit(store, team.business_unit_id);
    item.lead = liteUser(store, team.lead_id);
    item.members = (team.members ?? []).map((m) => liteUser(store, m.id)).filter(Boolean);
    item.members_count = (item.members as unknown[]).length;
  }
  if (kind === 'products') {
    const p = raw as EntityMap['products'];
    item.businessUnits = (p.businessUnits ?? []).map((u) => liteUnit(store, u.id)).filter(Boolean);
  }
  if (kind === 'meetings') {
    const meeting = raw as EntityMap['meetings'];
    item.attendees = (meeting.attendees ?? []).map((attendee) => ({
      ...attendee, user: attendee.user_id ? liteUser(store, attendee.user_id) : null,
    }));
  }
  return item as EntityMap[K];
}

export function demoList<K extends EntityKind>(kind: K): EntityMap[K][] {
  const store = read();
  return (store[kind] as EntityMap[K][]).map((item) => enrich(kind, item, store));
}
export function demoFind<K extends EntityKind>(kind: K, id: string | number): EntityMap[K] | undefined {
  return demoList(kind).find((item) => String(item.id) === String(id));
}
export function demoLookupsCurrent() {
  const store = read();
  return {
    ...demoLookups,
    units: store.units.map((u) => ({ id: u.id, name: u.name, parent_id: u.parent_id })),
    unit_categories: store.units.filter((u) => !u.parent_id).map((u) => ({ id: u.id, name: u.name })),
    users: store.employees.map((p) => liteUser(store, p.id)!).filter(Boolean),
    products: store.products.map((p) => ({ id: p.id, product_name: p.product_name })),
    leads: store.leads.map((l) => ({ id: l.id, name: l.name })),
    opportunities: store.opportunities.map((o) => ({ id: o.id, title: o.title, reference: o.reference })),
  };
}

export function demoSave<K extends EntityKind>(kind: K, payload: EntityPayload, id?: number): EntityMap[K] {
  const store = read();
  const collection = store[kind] as EntityMap[EntityKind][];
  const index = id == null ? -1 : collection.findIndex((r) => r.id === id);
  if (id != null && index < 0) throw new Error('Record not found');
  const old = index >= 0 ? collection[index] : null;
  const nextIdValue = id ?? Math.max(nextId(collection), (store.counters[kind] ?? 0) + 1);
  if (kind === 'units') {
    if (payload.name && store.units.some((unit) => unit.id !== id && unit.name.toLowerCase() === String(payload.name).trim().toLowerCase())) throw new Error('A unit with this name already exists.');
    let parentId = Number(payload.parent_id) || null;
    const visited = new Set<number>();
    while (parentId) {
      if (parentId === nextIdValue || visited.has(parentId)) throw new Error('A unit cannot become a child of itself or one of its descendants.');
      visited.add(parentId);
      parentId = store.units.find((unit) => unit.id === parentId)?.parent_id ?? null;
    }
  }
  if (kind === 'employees') {
    if (payload.username && store.employees.some((person) => person.id !== id && person.username.toLowerCase() === String(payload.username).trim().toLowerCase())) throw new Error('This username is already in use.');
    if (payload.email && store.employees.some((person) => person.id !== id && person.email?.toLowerCase() === String(payload.email).trim().toLowerCase())) throw new Error('This email is already in use.');
    if ('manager_id' in payload) {
      let managerId = Number(payload.manager_id) || null;
      const visited = new Set<number>();
      while (managerId) {
        if (managerId === nextIdValue || visited.has(managerId)) throw new Error('A manager assignment cannot create a reporting cycle.');
        visited.add(managerId);
        const manager = store.employees.find((person) => person.id === managerId);
        if (!manager) throw new Error('The selected manager does not exist.');
        managerId = manager.manager_id ?? null;
      }
    }
  }
  if (kind === 'teams') {
    const existing = old as EntityMap['teams'] | null;
    const unitId = Number(payload.business_unit_id ?? existing?.business_unit_id);
    if (!store.units.some((unit) => unit.id === unitId)) throw new Error('Choose an existing business unit for this team.');
    if (existing && existing.business_unit_id !== unitId) throw new Error('A team cannot be moved to another business unit.');
    const name = String(payload.name ?? existing?.name ?? '').trim().toLowerCase();
    if (store.teams.some((team) => team.id !== id && team.business_unit_id === unitId && team.name.trim().toLowerCase() === name)) throw new Error('This business unit already has a team with this name.');
    const memberIds = Array.isArray(payload.user_ids) ? payload.user_ids.map(Number) : (existing?.members ?? []).map((member) => member.id);
    const leadId = Number(payload.lead_id === undefined ? existing?.lead_id : payload.lead_id) || null;
    if ([...memberIds, ...(leadId ? [leadId] : [])].some((userId) => !store.employees.some((person) => person.id === userId && relationUnitIds(person).includes(unitId)))) {
      throw new Error('Team members and the lead must belong to the team’s business unit.');
    }
    if (existing?.lead_id && existing.lead_id === leadId && Array.isArray(payload.user_ids) && !memberIds.includes(leadId)) {
      throw new Error('Change or remove the team lead before removing them from the team.');
    }
  }
  if (kind === 'plans' && old && (old as EntityMap['plans']).status === 'submitted') throw new Error('A submitted weekly plan is read-only.');
  if (kind === 'tasks' && !old) {
    const plan = store.plans.find((item) => item.id === Number(payload.weekly_plan_id));
    if (!plan) throw new Error('Choose an existing weekly plan.');
    if (plan.status !== 'draft') throw new Error('A submitted weekly plan cannot receive new tasks.');
  }
  if (kind === 'meetings' && !old && (!Array.isArray(payload.attendees) || !payload.attendees.length)) throw new Error('Select at least one internal or external attendee.');
  if (kind === 'products' && payload.product_name && store.products.some((product) => product.id !== id && product.product_name.toLowerCase() === String(payload.product_name).trim().toLowerCase())) throw new Error('A product with this name already exists.');
  // Never retain passwords or file objects in localStorage.
  const data = Object.fromEntries(Object.entries(payload).filter(([key, value]) => key !== 'password' && !(value instanceof File))) as Record<string, unknown>;
  const now = new Date().toISOString();
  const record: Record<string, unknown> = { ...(old ?? {}), ...data, id: nextIdValue };
  if (kind === 'employees') {
    if ('firstname' in data || 'lastname' in data) {
      const previous = old as EntityMap['employees'] | null;
      const [first, ...last] = (previous?.name ?? '').split(' ');
      const name = [data.firstname ?? previous?.firstname ?? first, data.lastname ?? previous?.lastname ?? last.join(' ')].filter(Boolean).join(' ');
      if (name) record.name = name;
    }
    if (Array.isArray(data.business_unit_ids)) {
      const unitIds = data.business_unit_ids.map(Number);
      record.units = unitIds.map((unitId) => liteUnit(store, unitId)).filter(Boolean);
      // Leaving a unit also releases this person's team memberships and lead.
      if (old) store.teams.forEach((team) => {
        if (unitIds.includes(team.business_unit_id)) return;
        team.members = (team.members ?? []).filter((member) => member.id !== nextIdValue);
        if (team.lead_id === nextIdValue) team.lead_id = null;
      });
    }
    if ('work_degrees_id' in data) record.job_title = data.work_degrees_id ? demoLookups.work_degrees.find((degree) => degree.id === Number(data.work_degrees_id))?.work_degree_name ?? null : null;
    if (!old) { record.active = data.active ?? true; record.roles = []; record.certificates = []; }
  }
  if (kind === 'units') {
    if (!old) { record.is_active = data.is_active ?? true; record.headcount = 0; record.users = []; }
    // Laravel automatically adds a unit's director to its membership.
    if (data.director_id) {
      const director = store.employees.find((person) => person.id === Number(data.director_id));
      if (director && !relationUnitIds(director).includes(nextIdValue)) director.units = [...(director.units ?? director.business_units ?? []), { id: nextIdValue, name: String(record.name) }];
    }
  }
  if (kind === 'opportunities') {
    record.reference = old ? (old as EntityMap['opportunities']).reference : `BMS-${new Date().getFullYear()}-${String(nextIdValue).padStart(4, '0')}`;
    record.last_update_at = now;
    record.go_no_go = (old as EntityMap['opportunities'] | null)?.go_no_go ?? 'pending';
    const previous = old as EntityMap['opportunities'] | null;
    if (!old || (data.stage && data.stage !== previous?.stage)) {
      record.history = [...(previous?.history ?? (previous ? [{ id: 1, from_stage: null, to_stage: previous.stage, note: 'Registered in BMS', created_at: previous.last_update_at ?? now, user: liteUser(store, previous.owner_id) }] : [])), { id: Date.now(), from_stage: previous?.stage ?? null, to_stage: data.stage ?? 'review', note: old ? 'Stage updated' : 'Registered in BMS', created_at: now, user: liteUser(store, 1) }];
    }
    record.is_delayed = Boolean(record.expected_close_date && String(record.expected_close_date).slice(0, 10) < now.slice(0, 10) && !['won', 'lost', 'declined'].includes(String(record.stage)));
    record.has_no_update = false;
  }
  if (kind === 'plans' && !old) { record.status = 'draft'; record.tasks = []; record.supportRequests = []; }
  if (kind === 'tasks') {
    const plan = store.plans.find((p) => p.id === Number(record.weekly_plan_id));
    record.business_unit_id = plan?.business_unit_id ?? record.business_unit_id;
  }
  if (kind === 'teams') {
    if (Array.isArray(data.user_ids)) record.members = data.user_ids.map((v) => liteUser(store, Number(v))).filter(Boolean);
    if (!old && !record.members) record.members = [];
    if (data.lead_id && Array.isArray(record.members) && !(record.members as LookupUser[]).some((member) => member.id === Number(data.lead_id))) { const lead = liteUser(store, Number(data.lead_id)); if (lead) (record.members as LookupUser[]).push(lead); }
  }
  if (kind === 'meetings' && Array.isArray(data.attendees)) {
    const previous = ((old as EntityMap['meetings'] | null)?.attendees ?? []);
    record.attendees = (data.attendees as MeetingAttendeeInput[]).map((attendee, index): MeetingAttendee => {
      const existing = previous.find((item) => attendee.user_id ? item.user_id === attendee.user_id : !item.user_id && item.external_email === attendee.external_email);
      return { ...existing, ...attendee, id: existing?.id ?? Date.now() + index, user: attendee.user_id ? liteUser(store, attendee.user_id) : null, response: existing?.response ?? 'pending' };
    });
  }
  if (kind === 'products' && Array.isArray(data.business_unit_ids)) record.businessUnits = data.business_unit_ids.map((v) => liteUnit(store, Number(v))).filter(Boolean);
  if (kind === 'recruitment' && !old) { record.status = 'submitted'; record.candidates = []; record.onboarding = []; record.requester = liteUser(store, 1); }
  if (kind === 'procurement' && !old) { record.status = 'submitted'; record.reference = `PRC-${String(nextIdValue).padStart(4, '0')}`; record.quotations = []; record.requester = liteUser(store, 1); }
  if (kind === 'events' && !old) { record.status = record.status ?? 'submitted'; record.checklist = []; }
  if (kind === 'documents') {
    const file = payload.file;
    if ('business_unit_id' in data) record.unit = data.business_unit_id ? liteUnit(store, Number(data.business_unit_id)) : null;
    if (file instanceof File) { record.original_name = file.name; record.mime_type = file.type; }
    if (!old) { record.created_at = now; record.version = 1; record.is_latest = true; record.is_published = true; record.uploader = liteUser(store, 1); }
  }
  if (kind === 'procedures' && !old) { record.created_at = now; record.creator = liteUser(store, 1); }
  if (index >= 0) collection[index] = record as unknown as EntityMap[EntityKind];
  else collection.unshift(record as unknown as EntityMap[EntityKind]);
  store.counters[kind] = Math.max(store.counters[kind] ?? 0, nextIdValue);
  const title = String(record.name ?? record.title ?? record.job_title ?? record.item ?? record.product_name ?? record.week_start ?? 'Record');
  store.activity.unshift({ id: Date.now(), entity: kind, entity_id: nextIdValue, action: old ? 'updated' : 'created', title, created_at: now });
  store.activity = store.activity.slice(0, 200);
  write(store);
  return enrich(kind, record as unknown as EntityMap[K], store);
}

export function demoDelete(kind: EntityKind, id: number): void {
  const store = read();
  const records = store[kind] as EntityMap[EntityKind][];
  const index = records.findIndex((r) => r.id === id);
  if (index < 0) throw new Error('Record not found');
  const item = records[index] as EntityMap[EntityKind] & Record<string, unknown>;
  if (kind === 'units') {
    const hasDependencies = store.units.some((unit) => unit.parent_id === id) || store.employees.some((person) => relationUnitIds(person).includes(id)) ||
      store.plans.some((plan) => plan.business_unit_id === id) || store.opportunities.some((opportunity) => opportunity.business_unit_id === id) ||
      store.leads.some((lead) => lead.business_unit_id === id) || store.teams.some((team) => team.business_unit_id === id) ||
      store.products.some((product) => product.businessUnits?.some((unit) => unit.id === id)) ||
      store.bonuses.some((bonus) => bonus.business_unit_id === id) || store.development.some((item) => item.business_unit_id === id) ||
      store.procurement.some((item) => item.business_unit_id === id) || store.events.some((event) => event.business_unit_id === id) ||
      store.meetings.some((meeting) => meeting.business_unit_id === id) || store.documents.some((document) => ('business_unit_id' in document ? document.business_unit_id : document.unit?.id) === id);
    if (hasDependencies) throw new Error('This unit still has related records or members. Deactivate it instead of deleting it.');
  }
  if (kind === 'employees' && (
    store.bonuses.some((bonus) => bonus.employee_id === id) || store.units.some((unit) => unit.director_id === id) ||
    store.employees.some((person) => person.manager_id === id) || store.opportunities.some((opportunity) => opportunity.owner_id === id) ||
    store.tasks.some((task) => task.owner_id === id) || store.leads.some((lead) => lead.owner_id === id) ||
    store.products.some((product) => product.owner_id === id) || store.development.some((item) => item.owner_id === id || item.owner?.id === id) ||
    store.meetings.some((meeting) => meeting.attendees?.some((attendee) => attendee.user_id === id)) ||
    store.teams.some((team) => team.lead_id === id || team.members?.some((member) => member.id === id))
  )) {
    throw new Error('This employee still has related records. Remove those assignments or deactivate the employee instead.');
  }
  records.splice(index, 1);
  if (kind === 'plans') store.tasks = store.tasks.filter((t) => t.weekly_plan_id !== id);
  if (kind === 'opportunities') store.opportunityDocuments = store.opportunityDocuments.filter((document) => document.opportunity_id !== id);
  if (kind === 'products') store.opportunities.forEach((opportunity) => { if (opportunity.product_id === id) opportunity.product_id = null; });
  store.activity.unshift({ id: Date.now(), entity: kind, entity_id: id, action: 'deleted', title: String(item.name ?? item.title ?? item.job_title ?? item.item ?? item.product_name ?? 'Record'), created_at: new Date().toISOString() });
  write(store);
}

export function demoActivity(kind: EntityKind, id: number) { return read().activity.filter((a) => a.entity === kind && a.entity_id === id); }
export function demoRecentActivity() { return read().activity.slice(0, 5); }
export function demoOpportunityDocuments(id: number) { return read().opportunityDocuments.filter((d) => d.opportunity_id === id); }
export function demoAddOpportunityDocument(id: number, file: File, documentType: string) {
  const store = read();
  if (!store.opportunities.some((opportunity) => opportunity.id === id)) throw new Error('Opportunity not found.');
  const document: OpportunityDocument = { id: nextId(store.opportunityDocuments), opportunity_id: id, document_type: documentType, original_name: file.name, version: 1, created_at: new Date().toISOString(), uploader: liteUser(store, 1) };
  store.opportunityDocuments.unshift(document); write(store); return document;
}
