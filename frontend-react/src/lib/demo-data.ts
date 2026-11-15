/**
 * Realistic payloads shaped like Laravel BMS responses.
 * Used only when VITE_DEMO_MODE=true so the UI can be reviewed without a live API.
 */
import type {
  AuthUser,
  BusinessUnit,
  ExecutiveDashboard,
  Lead,
  Lookups,
  Meeting,
  MyTasksResponse,
  Opportunity,
  Product,
  UnitTask,
  WeeklyPlan,
} from './types';

const users = [
  { id: 1, username: 'nora.alharbi', firstname: 'Nora', lastname: 'Alharbi', email: 'nora@alphaiota.local' },
  { id: 2, username: 'omar.fahmy', firstname: 'Omar', lastname: 'Fahmy', email: 'omar@alphaiota.local' },
  { id: 3, username: 'lina.khaled', firstname: 'Lina', lastname: 'Khaled', email: 'lina@alphaiota.local' },
  { id: 4, username: 'hassan.nabil', firstname: 'Hassan', lastname: 'Nabil', email: 'hassan@alphaiota.local' },
];

const units = [
  { id: 1, name: 'Kraken', parent_id: null as number | null },
  { id: 2, name: 'Argus', parent_id: null },
  { id: 3, name: 'Business Development', parent_id: null },
  { id: 4, name: 'Corporate', parent_id: null },
];

const productsLite = [
  { id: 1, product_name: 'Kraken Platform' },
  { id: 2, product_name: 'Argus Intelligence' },
];

export const demoUser: AuthUser = {
  key: '1',
  username: 'nora.alharbi',
  firstname: 'Nora',
  lastname: 'Alharbi',
  email: 'nora@alphaiota.local',
  photoURL: null,
  accType: 'Employee',
  token: 'demo-jwt-token',
};

export const demoLookups: Lookups = {
  current_user: users[0],
  users,
  units,
  departments: [
    { id: 1, department_name: 'Engineering' },
    { id: 2, department_name: 'Finance' },
    { id: 3, department_name: 'Business Development' },
  ],
  meeting_types: ['standup', 'steering', 'client', 'internal'],
  task_statuses: ['achieved', 'in_progress', 'not_done'],
  unit_categories: units,
  opportunity_types: ['opportunity', 'tender', 'project', 'client', 'internal', 'external'],
  work_degrees: [{ id: 1, work_degree_name: 'Director' }, { id: 2, work_degree_name: 'Lead' }],
  products: productsLite,
  leads: [
    { id: 1, name: 'NEOM Digital Twin' },
    { id: 2, name: 'STC Cyber Range' },
  ],
  lead_stages: [
    { id: 1, code: 'identify', name: 'Identify', sequence: 1, is_active: 1 },
    { id: 2, code: 'qualify', name: 'Qualify', sequence: 2, is_active: 1 },
    { id: 3, code: 'engage', name: 'Engage', sequence: 3, is_active: 1 },
  ],
  opportunities: [
    { id: 1, title: 'MOD Command Suite', reference: 'BMS-20261112-A1B2C3' },
    { id: 2, title: 'NEOM City OS', reference: 'BMS-20261108-D4E5F6' },
  ],
  roles: [{ id: 1, name: 'System Administrator', slug: 'system-admin', abilities: ['*'] }],
  abilities: [
    'dashboard.view', 'units.view', 'units.manage', 'plans.view', 'plans.manage',
    'opportunities.view', 'opportunities.manage', 'opportunities.decide',
    'leads.view', 'products.view', 'meetings.view', 'directory.view',
    'recruitment.view', 'development.view', 'procurement.view', 'events.view',
    'documents.view', 'reports.view', 'roles.manage',
  ],
  can: ['*'],
};

export const demoOpportunities: Opportunity[] = [
  {
    id: 1, reference: 'BMS-20261112-A1B2C3', title: 'MOD Command Suite', client_name: 'Ministry of Defense',
    type: 'tender', business_unit_id: 1, product_id: 1, owner_id: 1, created_by: 1,
    stage: 'proposal', value: 18500000, currency: 'SAR', submission_date: '2026-11-28',
    expected_close_date: '2026-12-15', last_update_at: '2026-11-13T09:12:00Z', go_no_go: 'go',
    sector: 'Defence', contact_name: 'Col. Almutairi',
    unit: units[0], product: productsLite[0], owner: users[0],
    is_delayed: false, has_no_update: false,
  },
  {
    id: 2, reference: 'BMS-20261108-D4E5F6', title: 'NEOM City OS', client_name: 'NEOM',
    type: 'opportunity', business_unit_id: 3, product_id: 1, owner_id: 2, created_by: 2,
    stage: 'negotiation', value: 42000000, currency: 'SAR', expected_close_date: '2026-11-04',
    last_update_at: '2026-10-22T14:00:00Z', go_no_go: 'go', sector: 'Smart Cities',
    unit: units[2], product: productsLite[0], owner: users[1],
    is_delayed: true, has_no_update: true,
  },
  {
    id: 3, reference: 'BMS-20261030-G7H8I9', title: 'STC Cyber Range', client_name: 'STC',
    type: 'tender', business_unit_id: 2, product_id: 2, owner_id: 3, created_by: 3,
    stage: 'submitted', value: 9600000, currency: 'SAR', submission_date: '2026-11-02',
    expected_close_date: '2026-11-30', last_update_at: '2026-11-10T11:40:00Z', go_no_go: 'go',
    sector: 'Telecom', unit: units[1], product: productsLite[1], owner: users[2],
    is_delayed: false, has_no_update: false,
  },
  {
    id: 4, reference: 'BMS-20261101-J1K2L3', title: 'SABIC Plant Analytics', client_name: 'SABIC',
    type: 'project', business_unit_id: 2, product_id: 2, owner_id: 4, created_by: 1,
    stage: 'qualification', value: 5400000, currency: 'SAR', expected_close_date: '2026-12-20',
    last_update_at: '2026-11-14T08:05:00Z', go_no_go: 'pending', sector: 'Energy',
    unit: units[1], product: productsLite[1], owner: users[3],
    is_delayed: false, has_no_update: false,
  },
  {
    id: 5, reference: 'BMS-20260918-M4N5O6', title: 'Aramco Field Copilot', client_name: 'Saudi Aramco',
    type: 'opportunity', business_unit_id: 1, product_id: 1, owner_id: 1, created_by: 2,
    stage: 'rfp', value: 27800000, currency: 'SAR', expected_close_date: '2026-11-10',
    last_update_at: '2026-10-18T16:22:00Z', go_no_go: 'go', sector: 'Energy',
    unit: units[0], product: productsLite[0], owner: users[0],
    is_delayed: true, has_no_update: true,
  },
  {
    id: 6, reference: 'BMS-20261111-P7Q8R9', title: 'SDAIA Data Mesh', client_name: 'SDAIA',
    type: 'tender', business_unit_id: 3, product_id: 2, owner_id: 2, created_by: 3,
    stage: 'review', value: 12100000, currency: 'SAR', expected_close_date: '2027-01-15',
    last_update_at: '2026-11-12T10:00:00Z', go_no_go: 'pending', sector: 'Government',
    unit: units[2], product: productsLite[1], owner: users[1],
    is_delayed: false, has_no_update: false,
  },
];

export const demoProducts: Product[] = [
  {
    id: 1, product_name: 'Kraken Platform', description: 'Command-and-control product line.',
    owner_id: 1, owner: users[0], businessUnits: [units[0]],
    currentPhase: { id: 11, name: 'Pilot', progress: 62, status: 'in_progress', sequence: 2 },
    phases: [
      { id: 10, name: 'Discovery', progress: 100, status: 'achieved', sequence: 1 },
      { id: 11, name: 'Pilot', progress: 62, status: 'in_progress', sequence: 2 },
      { id: 12, name: 'Scale', progress: 0, status: 'not_done', sequence: 3 },
    ],
  },
  {
    id: 2, product_name: 'Argus Intelligence', description: 'Analytics and tracking.',
    owner_id: 3, owner: users[2], businessUnits: [units[1]],
    currentPhase: { id: 21, name: 'Build', progress: 44, status: 'in_progress', sequence: 2 },
    phases: [
      { id: 20, name: 'Discovery', progress: 100, status: 'achieved', sequence: 1 },
      { id: 21, name: 'Build', progress: 44, status: 'in_progress', sequence: 2 },
    ],
  },
];

export const demoUnits: BusinessUnit[] = [
  {
    id: 1, name: 'Kraken', description: 'Command systems and mission software.',
    director_id: 1, director: users[0], is_active: 1, headcount: 18, services: ['C2', 'Integration'],
    users: [users[0], users[1]], can_manage_teams: true,
  },
  {
    id: 2, name: 'Argus', description: 'Intelligence products and tracking.',
    director_id: 3, director: users[2], is_active: 1, headcount: 11, services: ['Analytics'],
    users: [users[2], users[3]], can_manage_teams: true,
  },
  {
    id: 3, name: 'Business Development', description: 'Leads, tenders and partnerships.',
    director_id: 2, director: users[1], is_active: 1, headcount: 7, services: ['BD'],
    users: [users[1]], can_manage_teams: true,
  },
  {
    id: 4, name: 'Corporate', description: 'Shared services and governance.',
    director_id: 4, director: users[3], is_active: 1, headcount: 9, services: ['PMO'],
    users: [users[3]], can_manage_teams: false,
  },
];

const tasks: UnitTask[] = [
  { id: 1, weekly_plan_id: 1, business_unit_id: 1, title: 'Ship Kraken pilot build 4', status: 'in_progress', progress: 70, owner_id: 1, owner: users[0], due_date: '2026-11-18', unit: units[0] },
  { id: 2, weekly_plan_id: 1, business_unit_id: 1, title: 'Security review with Cyber', status: 'not_done', progress: 20, owner_id: 2, owner: users[1], due_date: '2026-11-12', blockers: 'Waiting on SOC sign-off', unit: units[0] },
  { id: 3, weekly_plan_id: 2, business_unit_id: 2, title: 'Argus telemetry dashboard', status: 'achieved', progress: 100, owner_id: 3, owner: users[2], due_date: '2026-11-14', completion_date: '2026-11-13', unit: units[1] },
  { id: 4, weekly_plan_id: 2, business_unit_id: 2, title: 'SABIC discovery workshop', status: 'in_progress', progress: 45, owner_id: 4, owner: users[3], due_date: '2026-11-20', unit: units[1] },
  { id: 5, weekly_plan_id: 3, business_unit_id: 3, title: 'NEOM commercial paper', status: 'in_progress', progress: 55, owner_id: 2, owner: users[1], due_date: '2026-11-16', unit: units[2] },
  { id: 6, weekly_plan_id: 3, business_unit_id: 3, title: 'SDAIA RFP intake', status: 'not_done', progress: 10, owner_id: 1, owner: users[0], due_date: '2026-11-11', unit: units[2] },
];

export const demoPlans: WeeklyPlan[] = [
  {
    id: 1, business_unit_id: 1, week_start: '2026-11-09', status: 'submitted',
    objectives: 'Close Kraken pilot gaps and prepare MOD proposal annex.',
    next_week_plan: 'Run red-team rehearsal and freeze scope.',
    unit: units[0], creator: users[0], submitted_at: '2026-11-09T08:00:00Z',
    tasks: tasks.filter((t) => t.weekly_plan_id === 1),
    supportRequests: [{ id: 1, title: 'Legal review of MOD annex', status: 'open', details: 'Need clause 14 wording.' }],
  },
  {
    id: 2, business_unit_id: 2, week_start: '2026-11-09', status: 'submitted',
    objectives: 'Advance Argus telemetry and SABIC discovery.',
    unit: units[1], creator: users[2], submitted_at: '2026-11-09T09:20:00Z',
    tasks: tasks.filter((t) => t.weekly_plan_id === 2),
  },
  {
    id: 3, business_unit_id: 3, week_start: '2026-11-09', status: 'draft',
    objectives: 'NEOM commercial paper and SDAIA intake.',
    unit: units[2], creator: users[1],
    tasks: tasks.filter((t) => t.weekly_plan_id === 3),
  },
];

export const demoMeetings: Meeting[] = [
  { id: 1, title: 'MOD proposal freeze', starts_at: '2026-11-16T09:00:00Z', ends_at: '2026-11-16T10:00:00Z', location: 'Riyadh HQ', status: 'scheduled', business_unit_id: 1, unit: units[0], attendees: [{ id: 1, user_id: 1, user: users[0], response: 'accepted' }] },
  { id: 2, title: 'Argus weekly steering', starts_at: '2026-11-17T12:00:00Z', ends_at: '2026-11-17T12:45:00Z', location: 'Teams', status: 'scheduled', business_unit_id: 2, unit: units[1], attendees: [{ id: 2, user_id: 3, user: users[2], response: 'pending' }] },
  { id: 3, title: 'NEOM commercial review', starts_at: '2026-11-18T07:30:00Z', ends_at: '2026-11-18T08:30:00Z', location: 'NEOM office', status: 'scheduled', business_unit_id: 3, unit: units[2], attendees: [{ id: 3, user_id: 2, user: users[1], response: 'pending' }] },
];

export const demoLeads: Lead[] = [
  { id: 1, name: 'NEOM Digital Twin', entity_type: 'government', sector: 'Smart Cities', stage: 'engage', contact_name: 'Maha Alotaibi', business_unit_id: 3, owner_id: 2, unit: units[2], owner: users[1], last_contacted_at: '2026-11-12T10:00:00Z' },
  { id: 2, name: 'STC Cyber Range', entity_type: 'enterprise', sector: 'Telecom', stage: 'qualify', contact_name: 'Faisal Dane', business_unit_id: 2, owner_id: 3, unit: units[1], owner: users[2], converted_opportunity_id: 3 },
  { id: 3, name: 'Red Sea Global Ops', entity_type: 'enterprise', sector: 'Hospitality', stage: 'identify', contact_status: 'warm', business_unit_id: 3, owner_id: 1, unit: units[2], owner: users[0] },
];

export function demoDashboard(filters: Record<string, string | undefined> = {}): ExecutiveDashboard {
  const unitId = filters.business_unit_id ? Number(filters.business_unit_id) : undefined;
  const productId = filters.product_id ? Number(filters.product_id) : undefined;
  let opps = demoOpportunities;
  let unitList = demoUnits;
  if (unitId) {
    opps = opps.filter((o) => o.business_unit_id === unitId);
    unitList = unitList.filter((u) => u.id === unitId);
  }
  if (productId) opps = opps.filter((o) => o.product_id === productId);

  const unitTasks = unitId ? tasks.filter((t) => t.business_unit_id === unitId) : tasks;
  const unit_progress = unitList.map((u) => {
    const items = unitTasks.filter((t) => t.business_unit_id === u.id);
    const total = items.length;
    const avg = total ? Math.round(items.reduce((s, t) => s + (t.progress ?? 0), 0) / total) : 0;
    return {
      id: u.id, name: u.name, director: u.director ?? null, total,
      achieved: items.filter((t) => t.status === 'achieved').length,
      in_progress: items.filter((t) => t.status === 'in_progress').length,
      not_done: items.filter((t) => t.status === 'not_done').length,
      blocked: items.filter((t) => !!t.blockers).length,
      progress: avg,
    };
  });

  const tenders = opps.filter((o) => o.type === 'tender');
  const meetings = demoMeetings.filter((m) => !unitId || m.business_unit_id === unitId);

  return {
    generated_at: new Date().toISOString(),
    filters,
    unit_progress,
    procurement: { pending: 3 },
    meetings,
    recent_activity: [
      { event: 'opportunity.updated', at: '2026-11-14T08:05:00Z', by: 'hassan.nabil', type: 'Opportunity', id: 4 },
      { event: 'weeklyplan.submitted', at: '2026-11-13T09:20:00Z', by: 'lina.khaled', type: 'WeeklyPlan', id: 2 },
      { event: 'opportunity.updated', at: '2026-11-13T09:12:00Z', by: 'nora.alharbi', type: 'Opportunity', id: 1 },
      { event: 'meeting.created', at: '2026-11-12T16:40:00Z', by: 'omar.fahmy', type: 'Meeting', id: 3 },
      { event: 'product.updated', at: '2026-11-12T11:02:00Z', by: 'lina.khaled', type: 'Product', id: 2 },
    ],
    tenders: {
      total: tenders.length,
      submitted: tenders.filter((o) => o.stage === 'submitted' || o.stage === 'submission').length,
      delayed: tenders.filter((o) => o.is_delayed).length,
      no_update: tenders.filter((o) => o.has_no_update).length,
    },
    employee_tasks: [
      { owner: users[0], total: 3, achieved: 0, in_progress: 2, not_done: 1 },
      { owner: users[1], total: 2, achieved: 0, in_progress: 1, not_done: 1 },
      { owner: users[2], total: 1, achieved: 1, in_progress: 0, not_done: 0 },
    ],
    opportunities: opps,
    products: demoProducts.filter((p) => !productId || p.id === productId),
    summary: {
      units: unitList.length,
      tasks: unitTasks.length,
      achieved: unitTasks.filter((t) => t.status === 'achieved').length,
      blocked_tasks: unitTasks.filter((t) => !!t.blockers).length,
      opportunities: opps.length,
      delayed_opportunities: opps.filter((o) => o.is_delayed).length,
      stale_opportunities: opps.filter((o) => o.has_no_update).length,
      products: demoProducts.length,
      pending_procurement: 3,
      upcoming_meetings: meetings.length,
      overdue_tasks: unitTasks.filter((t) => t.status !== 'achieved' && t.due_date && t.due_date < '2026-11-15').length,
    },
  };
}

export function demoMyTasks(): MyTasksResponse {
  const mine = tasks.filter((t) => t.owner_id === 1);
  return {
    data: mine,
    summary: {
      total: mine.length,
      achieved: mine.filter((t) => t.status === 'achieved').length,
      in_progress: mine.filter((t) => t.status === 'in_progress').length,
      not_done: mine.filter((t) => t.status === 'not_done').length,
      overdue: mine.filter((t) => t.status !== 'achieved' && t.due_date && t.due_date < '2026-11-15').length,
      blocked: mine.filter((t) => !!t.blockers).length,
    },
  };
}

export { tasks as demoTasks, users as demoUsersLite, units as demoUnitsLite };

export const demoDirectory = users.map((u, i) => ({
  id: u.id,
  name: `${u.firstname} ${u.lastname}`,
  username: u.username,
  email: u.email,
  job_title: ['Director', 'Lead', 'Product owner', 'PMO'][i],
  photo_url: null as string | null,
  units: [units[i] ?? units[0]],
  hiring_date: '2022-03-01',
  active: true,
  manager: i === 0 ? null : 'Nora Alharbi',
  certificates: i === 0 ? [{ id: 1, name: 'PMP', issuer: 'PMI', issued_at: '2024-06-01', unit: units[0] }] : [],
  roles: [{ id: 1, name: 'System Administrator', slug: 'system-admin', business_unit_id: null as number | null }],
}));

export const demoTeams = [
  {
    id: 1, business_unit_id: 1, business_unit: { id: 1, name: 'Kraken' }, name: 'Mission software',
    description: 'Kraken core delivery squad.', is_active: true, lead_id: 1, lead: users[0],
    members: [users[0], users[1]], members_count: 2, can_manage: true,
  },
  {
    id: 2, business_unit_id: 2, business_unit: { id: 2, name: 'Argus' }, name: 'Analytics',
    description: 'Argus intelligence build.', is_active: true, lead_id: 3, lead: users[2],
    members: [users[2], users[3]], members_count: 2, can_manage: true,
  },
];

export const demoHiring = [
  {
    id: 1, job_title: 'Frontend engineer', specification: 'React + TypeScript for Kraken consoles.', status: 'interviewing',
    business_unit_id: 1, unit: units[0], requester: users[0], first_working_day: null,
    candidates: [
      { id: 11, name: 'Sara Nasser', email: 'sara@example.com', status: 'interview_scheduled', interview_at: '2026-11-19T10:00:00Z' },
      { id: 12, name: 'Yousef Adel', email: 'yousef@example.com', status: 'cv_received' },
    ],
    onboarding: [],
  },
  {
    id: 2, job_title: 'Data analyst', specification: 'Argus telemetry and reporting.', status: 'hired',
    business_unit_id: 2, unit: units[1], requester: users[2], first_working_day: '2026-12-01',
    candidates: [{ id: 21, name: 'Mona Farid', email: 'mona@example.com', status: 'hired' }],
    onboarding: [
      { id: 31, department: 'IT', title: 'Create official email', status: 'completed' },
      { id: 32, department: 'IT', title: 'Prepare laptop', status: 'in_progress' },
      { id: 33, department: 'HR', title: 'Complete employee records', status: 'pending' },
    ],
  },
];

export const demoProcurement = [
  {
    id: 1, reference: 'PRC-20261112-A1B2C', item: 'Rugged field laptops', quantity: 8, purpose: 'Kraken pilot kit',
    status: 'submitted', business_unit_id: 1, unit: units[0], requester: users[0],
    quotations: [
      { id: 1, vendor: 'Extra', amount: 64000, currency: 'SAR' },
      { id: 2, vendor: 'Jarir', amount: 67200, currency: 'SAR' },
    ],
  },
  {
    id: 2, reference: 'PRC-20261101-D4E5F', item: 'SOC licences', quantity: 12, purpose: 'Argus telemetry',
    status: 'approved', business_unit_id: 2, unit: units[1], requester: users[2], reviewer: users[3],
    budget_confirmed: true, finance_comment: 'Covered under FY26 ops budget.', reviewed_at: '2026-11-08T12:00:00Z',
    quotations: [{ id: 3, vendor: 'Microsoft', amount: 180000, currency: 'SAR' }],
  },
  {
    id: 3, reference: 'PRC-20261110-G7H8I', item: 'Event photography', quantity: 1, purpose: 'NEOM signing',
    status: 'rejected', business_unit_id: 3, unit: units[2], requester: users[1], reviewer: users[3],
    finance_comment: 'Use retained PR vendor.', reviewed_at: '2026-11-11T09:00:00Z', quotations: [],
  },
];

export const demoEvents = [
  {
    id: 1, title: 'MOD annex signing', event_type: 'agreement_signing', event_date: '2026-11-24T07:00:00Z', venue: 'Riyadh HQ',
    status: 'planning', business_unit_id: 1, unit: units[0], requester: users[0],
    checklist: [
      { id: 1, title: 'Photography', status: 'in_progress' },
      { id: 2, title: 'Social media announcement', status: 'pending' },
      { id: 3, title: 'Visitor entry', status: 'pending' },
    ],
  },
  {
    id: 2, title: 'Argus demo day', event_type: 'conference', event_date: '2026-12-03T08:30:00Z', venue: 'KAFD',
    status: 'submitted', business_unit_id: 2, unit: units[1], requester: users[2],
    checklist: [{ id: 4, title: 'Photography', status: 'pending' }],
  },
];

export const demoProcedures = [
  { id: 1, title: 'Visitor protocol', category: 'security', content: 'All guests register 24h in advance and are escorted.', is_published: true, creator: users[3], created_at: '2026-09-01T08:00:00Z' },
  { id: 2, title: 'Brand announcement', category: 'pr', content: 'Press notes cleared by PR 48h before publish.', is_published: true, creator: users[1], created_at: '2026-10-12T08:00:00Z' },
];

export const demoDocuments = [
  { id: 1, name: 'Kraken brand kit', category: 'brand', document_key: 'kraken-brand', version: 3, is_latest: true, is_published: true, original_name: 'kraken-brand.pdf', unit: units[0], uploader: users[0], created_at: '2026-11-01T10:00:00Z' },
  { id: 2, name: 'Company letterhead', category: 'stationery', document_key: 'letterhead', version: 2, is_latest: true, is_published: true, original_name: 'letterhead.docx', unit: units[3], uploader: users[3], created_at: '2026-10-20T10:00:00Z' },
];

export const demoDevelopment = [
  { id: 1, title: 'CDMP exam prep', item_type: 'cdmp', status: 'in_progress', due_date: '2026-12-15', unit: units[1], owner: users[2], business_unit_id: 2 },
  { id: 2, title: 'Secure coding lab', item_type: 'course', status: 'planned', due_date: '2026-11-30', unit: units[0], owner: users[1], business_unit_id: 1 },
  { id: 3, title: 'PMP recertification', item_type: 'certification', status: 'completed', due_date: '2026-10-01', unit: units[3], owner: users[3], business_unit_id: 4 },
];

export const demoMonthly = {
  report_type: 'Monthly performance',
  period: { start: '2026-11-01', end: '2026-11-30' },
  generated_at: new Date().toISOString(),
  units: demoUnits.map((u) => ({
    unit: { id: u.id, name: u.name },
    tasks_total: 4, achievements: [{ id: 1 }], in_progress: 2, not_done: 1, average_progress: 58, support_needs: [],
  })),
  products: demoProducts,
  opportunities: demoOpportunities,
  summary: { achievements: 6, in_progress: 8, support_requests: 2, open_support: 1, products: 2, opportunities_updated: 6 },
};

export const demoKpis = {
  generated_at: new Date().toISOString(),
  kpis: [
    { id: 1, name: 'On-time delivery', target: 90, actual: 84, unit_label: '%', frequency: 'monthly', attainment: 93.3, status: 'on_track', period_start: '2026-11-01', period_end: '2026-11-30', unit: units[0], business_unit_id: 1 },
    { id: 2, name: 'Pipeline coverage', target: 3, actual: 2.1, unit_label: 'x', frequency: 'monthly', attainment: 70, status: 'behind', period_start: '2026-11-01', period_end: '2026-11-30', unit: units[2], business_unit_id: 3 },
    { id: 3, name: 'Product NPS', target: 50, actual: 61, unit_label: 'pts', frequency: 'quarterly', attainment: 122, status: 'achieved', period_start: '2026-10-01', period_end: '2026-12-31', unit: units[1], business_unit_id: 2 },
  ],
  history: [
    { business_unit_id: 1, unit: 'Kraken', name: 'On-time delivery', points: [
      { period_start: '2026-09-01', actual: 78, target: 90 },
      { period_start: '2026-10-01', actual: 81, target: 90 },
      { period_start: '2026-11-01', actual: 84, target: 90 },
    ] },
  ],
};

export const demoSocial = {
  report_type: 'Six-month social media report',
  period: { start: '2026-05-15', end: '2026-11-15' },
  metrics: [
    { id: 1, platform: 'LinkedIn', followers: 12400, posts: 48, engagement: 3100, period_start: '2026-05-15', period_end: '2026-11-15' },
    { id: 2, platform: 'X', followers: 8600, posts: 90, engagement: 1400, period_start: '2026-05-15', period_end: '2026-11-15' },
  ],
  summary: { followers: 21000, posts: 138, engagement: 4500 },
};

export const demoRoleAudit = [
  { id: 1, created_at: '2026-11-10T09:00:00Z', employee: 'Hassan Nabil', event: 'role.assigned', role: 'Unit member', business_unit: 'Corporate', user: 'nora.alharbi' },
  { id: 2, created_at: '2026-10-02T12:40:00Z', employee: 'Omar Fahmy', event: 'role.assigned', role: 'Director', business_unit: 'Business Development', user: 'nora.alharbi' },
];
