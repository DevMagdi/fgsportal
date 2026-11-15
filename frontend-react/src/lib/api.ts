import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import type {
  ApiEnvelope,
  AuthUser,
  BmsNotification,
  BrandDocument,
  BusinessUnit,
  DevelopmentItem,
  DirectoryPerson,
  ExecutiveDashboard,
  HiringRequest,
  KpiReport,
  Lead,
  Lookups,
  Meeting,
  MonthlyReport,
  MyTasksResponse,
  Opportunity,
  PrEvent,
  Procedure,
  ProcurementRequest,
  Product,
  RoleAudit,
  SocialReport,
  Team,
  WeeklyPlan,
  Bonus, EntityKind, EntityMap, EntityPayload, OpportunityDocument, DemoActivity, LookupUser, LookupUnit, ProductPhase, SupportRequest,
} from './types';
import { flattenErrors } from './utils';
import { demoActivity, demoAddOpportunityDocument, demoDelete, demoFind, demoList, demoLookupsCurrent, demoOpportunityDocuments, demoRecentActivity, demoSave } from './demo-store';
import {
  demoDashboard,
  demoDevelopment,
  demoDirectory,
  demoDocuments,
  demoEvents,
  demoHiring,
  demoKpis,
  demoLeads,
  demoLookups,
  demoMeetings,
  demoMonthly,
  demoMyTasks,
  demoOpportunities,
  demoPlans,
  demoProcedures,
  demoProcurement,
  demoProducts,
  demoRoleAudit,
  demoSocial,
  demoTeams,
  demoUnits,
  demoUser,
} from './demo-data';

export const TOKEN_KEY = 'bms.token';
export const USER_KEY = 'bms.user';
export const LEGACY_USER_KEY = 'userData';

const DEMO = import.meta.env.VITE_DEMO_MODE === 'true';
const BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export class ApiError extends Error {
  status: number;
  payload: unknown;
  constructor(message: string, status = 500, payload?: unknown) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

export function readStoredToken(): string | null {
  const direct = localStorage.getItem(TOKEN_KEY);
  if (direct) return direct;
  try {
    const raw = localStorage.getItem(LEGACY_USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { _token?: string; token?: string };
    return parsed._token || parsed.token || null;
  } catch {
    return null;
  }
}

export function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) return JSON.parse(raw) as AuthUser;
  } catch { /* ignore */ }
  return null;
}

export function persistSession(user: AuthUser, token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify({ ...user, token }));
  // Keep the existing session storage shape for compatibility.
  localStorage.setItem(LEGACY_USER_KEY, JSON.stringify({
    key: user.key,
    email: user.email,
    username: user.username,
    accType: user.accType ?? 'Employee',
    department: user.department ?? null,
    accRole: user.accRole ?? null,
    accPosition: user.accPosition ?? null,
    refreshRequired: user.refreshRequired ?? false,
    photoURL: user.photoURL ?? null,
    _token: token,
  }));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(LEGACY_USER_KEY);
}

const http = axios.create({
  baseURL: `${BASE}/api`,
  timeout: 30000,
  headers: { Accept: 'application/json' },
});

http.interceptors.request.use((config) => {
  const token = readStoredToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function unwrap<T>(payload: ApiEnvelope<T> | T): T {
  if (payload && typeof payload === 'object' && 'data' in (payload as object)) {
    return (payload as ApiEnvelope<T>).data;
  }
  return payload as T;
}

function toApiError(err: unknown): ApiError {
  if (err instanceof ApiError) return err;
  const ax = err as AxiosError<ApiEnvelope<unknown>>;
  const status = ax.response?.status ?? 0;
  const body = ax.response?.data;
  const message = body?.message || ax.message || 'Request failed';
  const details = flattenErrors(body?.data);
  return new ApiError(details[0] ? `${message}: ${details[0]}` : message, status, body);
}

async function request<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const res = await http.request<ApiEnvelope<T> | T>(config);
    return unwrap(res.data);
  } catch (err) {
    const apiErr = toApiError(err);
    if (apiErr.status === 401) {
      clearSession();
      if (!window.location.pathname.startsWith('/login')) {
        window.location.assign('/login');
      }
    }
    throw apiErr;
  }
}

function delay<T>(value: T, ms = 280): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function filterOpps(params?: Record<string, string | undefined>) {
  return demoList('opportunities').filter((o) => {
    if (params?.business_unit_id && String(o.business_unit_id) !== params.business_unit_id) return false;
    if (params?.product_id && String(o.product_id) !== params.product_id) return false;
    if (params?.stage && o.stage !== params.stage) return false;
    if (params?.go_no_go && o.go_no_go !== params.go_no_go) return false;
    if (params?.alert === 'delayed' && !o.is_delayed) return false;
    if (params?.alert === 'no_update' && !o.has_no_update) return false;
    return true;
  });
}

const entityPaths: Record<EntityKind, string> = {
  units: '/bms/units', employees: '/bms/employees', opportunities: '/bms/opportunities', bonuses: '/bms/bonuses',
  teams: '/bms/teams', plans: '/bms/weekly-plans', tasks: '/bms/tasks', leads: '/bms/leads', meetings: '/bms/meetings',
  products: '/bms/products', recruitment: '/bms/recruitment', development: '/bms/development-items', procurement: '/bms/procurement',
  events: '/bms/events', documents: '/bms/documents', procedures: '/bms/procedures',
};

function requestData(data: EntityPayload): EntityPayload | FormData {
  if (!Object.values(data).some((value) => value instanceof File)) return data;
  const form = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value == null) return;
    if (Array.isArray(value)) value.forEach((item, index) => {
      if (typeof item === 'object' && item !== null) {
        Object.entries(item).forEach(([field, part]) => { if (part != null) form.append(`${key}[${index}][${field}]`, String(part)); });
      } else form.append(`${key}[]`, String(item));
    });
    else if (value instanceof File) form.append(key, value);
    else form.append(key, typeof value === 'boolean' ? (value ? '1' : '0') : String(value));
  });
  return form;
}

// Eloquent serializes camelCase relationship names as snake_case. Keep the
// UI's existing camelCase models consistent across Laravel and demo responses.
function normalizePlan(plan: WeeklyPlan): WeeklyPlan {
  const { support_requests, ...rest } = plan as WeeklyPlan & { support_requests?: SupportRequest[] };
  return { ...rest, supportRequests: rest.supportRequests ?? support_requests };
}

function normalizeUnit(unit: BusinessUnit): BusinessUnit {
  const { weekly_plans, development_manager, ...rest } = unit as BusinessUnit & {
    weekly_plans?: WeeklyPlan[]; development_manager?: LookupUser | null;
  };
  const plans = rest.weeklyPlans ?? weekly_plans;
  return { ...rest, weeklyPlans: plans?.map(normalizePlan), developmentManager: rest.developmentManager ?? development_manager };
}

function normalizeProduct(product: Product): Product {
  const { business_units, current_phase, ...rest } = product as Product & {
    business_units?: LookupUnit[]; current_phase?: ProductPhase | null;
  };
  return { ...rest, businessUnits: rest.businessUnits ?? business_units, currentPhase: rest.currentPhase ?? current_phase };
}

function saveDownload(blob: Blob, filename?: string | null) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename?.replace(/[\\/\x00-\x1f\x7f]/g, '_') || 'document';
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const api = {
  demo: DEMO,

  async login(identifier: string, password: string): Promise<AuthUser> {
    if (DEMO) {
      if (password.length < 4) throw new ApiError('Password is too short', 400);
      return delay({ ...demoUser, username: identifier.includes('@') ? demoUser.username : identifier || demoUser.username });
    }
    const body = identifier.includes('@')
      ? { email: identifier, password }
      : { username: identifier, password };
    const user = await request<AuthUser>({ method: 'POST', url: '/users/login', data: body });
    if (!user?.token) throw new ApiError('Login did not return a token', 401, user);
    return user;
  },

  async logout(): Promise<void> {
    if (DEMO) return;
    try { await request({ method: 'POST', url: '/users/logout' }); } catch { /* ignore */ }
  },

  async me(): Promise<AuthUser> {
    if (DEMO) return delay(demoUser);
    return request<AuthUser>({ method: 'GET', url: '/users/me' });
  },

  async lookups(): Promise<Lookups> {
    if (DEMO) return delay(demoLookupsCurrent());
    return request<Lookups>({ method: 'GET', url: '/bms/lookups' });
  },

  async executiveDashboard(params: Record<string, string | undefined> = {}): Promise<ExecutiveDashboard> {
    if (DEMO) {
      const dashboard = demoDashboard(params);
      const unitId = params.business_unit_id ? Number(params.business_unit_id) : null;
      const productId = params.product_id ? Number(params.product_id) : null;
      const allProducts = demoList('products');
      const productUnitIds = productId ? new Set((allProducts.find((p) => p.id === productId)?.businessUnits ?? []).map((u) => u.id)) : null;
      const units = demoList('units').filter((u) => (!unitId || u.id === unitId) && (!productUnitIds || productUnitIds.has(u.id)));
      const tasks = demoList('tasks').filter((task) => (!unitId || task.business_unit_id === unitId) && (!productUnitIds || (task.business_unit_id != null && productUnitIds.has(task.business_unit_id))));
      const opportunities = demoList('opportunities').filter((o) => (!unitId || o.business_unit_id === unitId) && (!productId || o.product_id === productId));
      const products = allProducts.filter((p) => (!productId || p.id === productId) && (!unitId || p.businessUnits?.some((u) => u.id === unitId)));
      const now = Date.now();
      const meetings = demoList('meetings').filter((m) => (!unitId || m.business_unit_id === unitId) && m.status !== 'cancelled' && new Date(m.starts_at).getTime() >= now && new Date(m.starts_at).getTime() <= now + 7 * 86_400_000).sort((a, b) => a.starts_at.localeCompare(b.starts_at)).slice(0, 10);
      const procurement = demoList('procurement').filter((p) => !unitId || p.business_unit_id === unitId);
      const pendingProcurement = procurement.filter((p) => p.status === 'submitted').length;
      const recent = demoRecentActivity().map((entry) => ({ event: `${entry.entity}.${entry.action}`, at: entry.created_at, by: demoLookups.current_user.username, type: entry.entity, id: entry.entity_id }));
      dashboard.recent_activity = [...recent, ...dashboard.recent_activity].slice(0, 6);
      dashboard.opportunities = opportunities;
      dashboard.products = products;
      dashboard.meetings = meetings;
      dashboard.procurement = { pending: pendingProcurement };
      dashboard.unit_progress = units.map((u) => {
        const scoped = tasks.filter((task) => task.business_unit_id === u.id);
        return { id: u.id, name: u.name, director: u.director, total: scoped.length,
          achieved: scoped.filter((t) => t.status === 'achieved').length,
          in_progress: scoped.filter((t) => t.status === 'in_progress').length,
          not_done: scoped.filter((t) => t.status === 'not_done').length,
          blocked: scoped.filter((t) => Boolean(t.blockers)).length,
          progress: scoped.length ? Math.round(scoped.reduce((sum, t) => sum + (t.progress ?? 0), 0) / scoped.length) : 0 };
      });
      const tenders = opportunities.filter((o) => o.type === 'tender');
      dashboard.tenders = { total: tenders.length, submitted: tenders.filter((o) => ['submitted', 'submission'].includes(o.stage)).length, delayed: tenders.filter((o) => o.is_delayed).length, no_update: tenders.filter((o) => o.has_no_update).length };
      dashboard.summary = { units: units.length, tasks: tasks.length, achieved: tasks.filter((t) => t.status === 'achieved').length,
        blocked_tasks: tasks.filter((t) => Boolean(t.blockers)).length, opportunities: opportunities.length,
        delayed_opportunities: opportunities.filter((o) => o.is_delayed).length, stale_opportunities: opportunities.filter((o) => o.has_no_update).length,
        products: products.length, pending_procurement: pendingProcurement,
        upcoming_meetings: meetings.filter((m) => m.status !== 'cancelled').length,
        overdue_tasks: tasks.filter((t) => t.status !== 'achieved' && t.due_date && t.due_date.slice(0, 10) < new Date().toISOString().slice(0, 10)).length };
      return delay(dashboard);
    }
    const dashboard = await request<ExecutiveDashboard>({ method: 'GET', url: '/bms/executive-dashboard', params });
    return { ...dashboard, products: (dashboard.products ?? []).map(normalizeProduct) };
  },

  async opportunities(params: Record<string, string | undefined> = {}): Promise<Opportunity[]> {
    if (DEMO) return delay(filterOpps(params));
    return request<Opportunity[]>({ method: 'GET', url: '/bms/opportunities', params });
  },

  async opportunity(id: string | number): Promise<Opportunity> {
    if (DEMO) {
      const hit = demoFind('opportunities', id);
      if (!hit) throw new ApiError('Opportunity not found', 404);
      return delay(hit);
    }
    return request<Opportunity>({ method: 'GET', url: `/bms/opportunities/${id}` });
  },

  async units(): Promise<BusinessUnit[]> {
    if (DEMO) return delay(demoList('units'));
    return (await request<BusinessUnit[]>({ method: 'GET', url: '/bms/units' })).map(normalizeUnit);
  },

  async unit(id: string | number): Promise<BusinessUnit> {
    if (DEMO) {
      const hit = demoFind('units', id);
      if (!hit) throw new ApiError('Unit not found', 404);
      return delay(hit);
    }
    return normalizeUnit(await request<BusinessUnit>({ method: 'GET', url: `/bms/units/${id}` }));
  },

  async weeklyPlans(params: Record<string, string | undefined> = {}): Promise<WeeklyPlan[]> {
    if (DEMO) {
      return delay(demoList('plans').filter((p) => !params.business_unit_id || String(p.business_unit_id) === params.business_unit_id));
    }
    return (await request<WeeklyPlan[]>({ method: 'GET', url: '/bms/weekly-plans', params })).map(normalizePlan);
  },

  async weeklyPlan(id: string | number): Promise<WeeklyPlan> {
    if (DEMO) {
      const hit = demoFind('plans', id);
      if (!hit) throw new ApiError('Plan not found', 404);
      return delay(hit);
    }
    return normalizePlan(await request<WeeklyPlan>({ method: 'GET', url: `/bms/weekly-plans/${id}` }));
  },

  async myTasks(): Promise<MyTasksResponse> {
    if (DEMO) {
      const tasks = demoList('tasks').filter((t) => t.owner_id === demoLookups.current_user.id);
      return delay({ data: tasks, summary: { total: tasks.length, achieved: tasks.filter((t) => t.status === 'achieved').length,
        in_progress: tasks.filter((t) => t.status === 'in_progress').length, not_done: tasks.filter((t) => t.status === 'not_done').length,
        overdue: tasks.filter((t) => t.status !== 'achieved' && t.due_date && t.due_date.slice(0, 10) < new Date().toISOString().slice(0, 10)).length,
        blocked: tasks.filter((t) => Boolean(t.blockers)).length } });
    }
    // Laravel WeeklyPlanController@myTasks returns {data, summary} inside the envelope's data.
    return request<MyTasksResponse>({ method: 'GET', url: '/bms/my-tasks' });
  },

  async products(): Promise<Product[]> {
    if (DEMO) return delay(demoList('products'));
    return (await request<Product[]>({ method: 'GET', url: '/bms/products' })).map(normalizeProduct);
  },

  async leads(params: Record<string, string | undefined> = {}): Promise<Lead[]> {
    if (DEMO) return delay(demoList('leads'));
    return request<Lead[]>({ method: 'GET', url: '/bms/leads', params });
  },

  async meetings(): Promise<Meeting[]> {
    if (DEMO) return delay(demoList('meetings'));
    return request<Meeting[]>({ method: 'GET', url: '/bms/meetings' });
  },

  async notifications(): Promise<BmsNotification[]> {
    if (DEMO) {
      const readIds = JSON.parse(localStorage.getItem('bms.demo.notifications.read') || '[]') as (string | number)[];
      return delay([
        { id: 1, title: 'Decision requested', message: 'SABIC Plant Analytics is pending go / no-go.', created_at: '2026-11-14T08:10:00Z' },
        { id: 2, title: 'Stale opportunity', message: 'Aramco Field Copilot has had no update for 14 days.', created_at: '2026-11-13T07:00:00Z' },
      ].map((n) => ({ ...n, read_at: readIds.includes(n.id) ? new Date().toISOString() : null })));
    }
    const payload = await request<unknown>({ method: 'GET', url: '/bms/notifications' });
    if (Array.isArray(payload)) return payload as BmsNotification[];
    if (payload && typeof payload === 'object' && Array.isArray((payload as { data?: unknown }).data)) {
      return (payload as { data: BmsNotification[] }).data;
    }
    return [];
  },

  async markNotificationRead(id: string | number): Promise<void> {
    if (DEMO) {
      const ids = JSON.parse(localStorage.getItem('bms.demo.notifications.read') || '[]') as (string | number)[];
      localStorage.setItem('bms.demo.notifications.read', JSON.stringify([...new Set([...ids, id])]));
      return;
    }
    await request({ method: 'PUT', url: `/bms/notifications/${id}/read` });
  },

  async directory(params: Record<string, string | undefined> = {}): Promise<DirectoryPerson[]> {
    if (DEMO) {
      return delay(demoList('employees').filter((p) => {
        if (params.search && !`${p.name} ${p.username} ${p.email}`.toLowerCase().includes(params.search.toLowerCase())) return false;
        if (params.business_unit_id && !p.units?.some((u) => String(u.id) === params.business_unit_id)) return false;
        return true;
      }));
    }
    return request<DirectoryPerson[]>({ method: 'GET', url: '/bms/directory', params });
  },

  async employee(id: string | number): Promise<DirectoryPerson> {
    if (DEMO) {
      const hit = demoFind('employees', id);
      if (!hit) throw new ApiError('Employee not found', 404);
      return delay(hit);
    }
    const person = await request<DirectoryPerson>({ method: 'GET', url: `/bms/employees/${id}` });
    // The directory endpoint carries certificates, whereas employee administration carries roles.
    const directory = await request<DirectoryPerson[]>({ method: 'GET', url: '/bms/directory' }).catch(() => []);
    const directoryPerson = directory.find((item) => String(item.id) === String(id));
    return { ...directoryPerson, ...person, certificates: directoryPerson?.certificates ?? person.certificates ?? [] };

  },

  async teams(params: Record<string, string | undefined> = {}): Promise<Team[]> {
    if (DEMO) {
      return delay(demoList('teams').filter((t) => !params.business_unit_id || String(t.business_unit_id) === params.business_unit_id));
    }
    return request<Team[]>({ method: 'GET', url: '/bms/teams', params });
  },

  async recruitment(params: Record<string, string | undefined> = {}): Promise<HiringRequest[]> {
    if (DEMO) {
      return delay(demoList('recruitment').filter((h) => !params.status || h.status === params.status));
    }
    return request<HiringRequest[]>({ method: 'GET', url: '/bms/recruitment', params });
  },

  async development(params: Record<string, string | undefined> = {}): Promise<DevelopmentItem[]> {
    if (DEMO) {
      return delay(demoList('development').filter((d) => !params.business_unit_id || String(d.business_unit_id) === params.business_unit_id));
    }
    return request<DevelopmentItem[]>({ method: 'GET', url: '/bms/development-items', params });
  },

  async procurement(): Promise<ProcurementRequest[]> {
    if (DEMO) return delay(demoList('procurement'));
    return request<ProcurementRequest[]>({ method: 'GET', url: '/bms/procurement' });
  },

  async events(): Promise<PrEvent[]> {
    if (DEMO) return delay(demoList('events'));
    return request<PrEvent[]>({ method: 'GET', url: '/bms/events' });
  },

  async procedures(): Promise<Procedure[]> {
    if (DEMO) return delay(demoList('procedures'));
    return request<Procedure[]>({ method: 'GET', url: '/bms/procedures' });
  },

  async documents(params: Record<string, string | undefined> = {}): Promise<BrandDocument[]> {
    if (DEMO) {
      return delay(demoList('documents').filter((d) => {
        if (params.business_unit_id && String(d.business_unit_id ?? d.unit?.id ?? '') !== params.business_unit_id) return false;
        if (params.category && d.category !== params.category) return false;
        if (params.search && !d.name.toLowerCase().includes(params.search.toLowerCase())) return false;
        return true;
      }));
    }
    return request<BrandDocument[]>({ method: 'GET', url: '/bms/documents', params });
  },

  documentDownloadUrl(id: string | number): string {
    return `${BASE}/api/bms/documents/${id}/download`;
  },

  async monthlyReport(params: Record<string, string | undefined> = {}): Promise<MonthlyReport> {
    if (DEMO) return delay(demoMonthly);
    return request<MonthlyReport>({ method: 'GET', url: '/bms/reports/monthly', params });
  },

  async kpiReport(params: Record<string, string | undefined> = {}): Promise<KpiReport> {
    if (DEMO) return delay(demoKpis);
    return request<KpiReport>({ method: 'GET', url: '/bms/reports/kpis', params });
  },

  async socialReport(): Promise<SocialReport> {
    if (DEMO) return delay(demoSocial);
    return request<SocialReport>({ method: 'GET', url: '/bms/reports/social' });
  },

  async roleAudit(): Promise<RoleAudit[]> {
    if (DEMO) return delay(demoRoleAudit);
    return request<RoleAudit[]>({ method: 'GET', url: '/bms/audit/role-changes' });
  },

  async bonuses(): Promise<Bonus[]> {
    if (DEMO) return delay(demoList('bonuses'));
    return request<Bonus[]>({ method: 'GET', url: '/bms/bonuses' });
  },

  async activity(kind: EntityKind, id: number): Promise<DemoActivity[]> {
    // The existing BMS does not expose a generic entity audit endpoint.
    if (DEMO) return delay(demoActivity(kind, id));
    return [];
  },

  async opportunityDocuments(id: number): Promise<OpportunityDocument[]> {
    if (DEMO) return delay(demoOpportunityDocuments(id));
    return request<OpportunityDocument[]>({ method: 'GET', url: `/bms/opportunities/${id}/documents` });
  },

  async uploadOpportunityDocument(id: number, file: File, documentType: string): Promise<OpportunityDocument> {
    if (DEMO) return delay(demoAddOpportunityDocument(id, file, documentType));
    const data = new FormData(); data.append('file', file); data.append('document_type', documentType);
    return request<OpportunityDocument>({ method: 'POST', url: `/bms/opportunities/${id}/documents`, data });
  },

  async employeePhoto(path: string): Promise<Blob> {
    // Directory photo URLs are authenticated API paths, not public image URLs.
    const url = path.replace(/^\/api(?=\/)/, '');
    try { return (await http.get<Blob>(url, { responseType: 'blob' })).data; }
    catch (error) { throw toApiError(error); }
  },

  async downloadOpportunityDocument(id: number, filename?: string | null): Promise<void> {
    if (DEMO) throw new ApiError('Demo documents contain metadata only; no file is stored.', 400);
    try {
      const response = await http.get<Blob>(`/bms/opportunity-documents/${id}/download`, { responseType: 'blob' });
      saveDownload(response.data, filename);
    } catch (error) { throw toApiError(error); }
  },

  async downloadDocument(id: number, filename?: string | null): Promise<void> {
    if (DEMO) throw new ApiError('Demo documents contain metadata only; no file is stored.', 400);
    try {
      const response = await http.get<Blob>(`/bms/documents/${id}/download`, { responseType: 'blob' });
      saveDownload(response.data, filename);
    } catch (error) { throw toApiError(error); }
  },

  async create<K extends EntityKind>(kind: K, data: EntityPayload): Promise<EntityMap[K]> {
    if (DEMO) return delay(demoSave(kind, data), 180);
    let url = entityPaths[kind];
    if (kind === 'tasks') {
      if (!data.weekly_plan_id) throw new ApiError('A weekly plan is required', 422);
      url = `/bms/weekly-plans/${data.weekly_plan_id}/tasks`;
      data = { ...data }; delete data.weekly_plan_id;
    }
    return request<EntityMap[K]>({ method: 'POST', url, data: requestData(data) });
  },

  async update<K extends EntityKind>(kind: K, id: number, data: EntityPayload): Promise<EntityMap[K]> {
    if (DEMO) return delay(demoSave(kind, data, id), 180);
    if (kind === 'tasks') { data = { ...data }; delete data.weekly_plan_id; }
    // Submitted plans are immutable on the server; only these fields are accepted.
    if (kind === 'plans') data = { objectives: data.objectives ?? '', next_week_plan: data.next_week_plan ?? '' };
    return request<EntityMap[K]>({ method: 'PUT', url: `${entityPaths[kind]}/${id}`, data: requestData(data) });
  },

  async remove(kind: EntityKind, id: number): Promise<void> {
    if (DEMO) { demoDelete(kind, id); await delay(null, 180); return; }
    if (kind === 'products') { await request({ method: 'POST', url: `/bms/products/${id}/archive` }); return; }
    if (kind === 'meetings') { await request({ method: 'POST', url: `/bms/meetings/${id}/cancel` }); return; }
    if (kind === 'employees') { await request({ method: 'POST', url: `/bms/employees/${id}/status`, data: { active: false } }); return; }
    await request({ method: 'DELETE', url: `${entityPaths[kind]}/${id}` });
  },

  async submitPlan(id: number): Promise<void> {
    if (DEMO) { demoSave('plans', { status: 'submitted' }, id); await delay(null, 180); return; }
    await request({ method: 'POST', url: `/bms/weekly-plans/${id}/submit` });
  },

};
