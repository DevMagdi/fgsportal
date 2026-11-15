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
} from './types';
import { flattenErrors } from './utils';
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
export const ANGULAR_USER_KEY = 'userData';

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
    const raw = localStorage.getItem(ANGULAR_USER_KEY);
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
  // Stay compatible with the Angular app's storage shape.
  localStorage.setItem(ANGULAR_USER_KEY, JSON.stringify({
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
  localStorage.removeItem(ANGULAR_USER_KEY);
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
  return demoOpportunities.filter((o) => {
    if (params?.business_unit_id && String(o.business_unit_id) !== params.business_unit_id) return false;
    if (params?.product_id && String(o.product_id) !== params.product_id) return false;
    if (params?.stage && o.stage !== params.stage) return false;
    if (params?.go_no_go && o.go_no_go !== params.go_no_go) return false;
    if (params?.alert === 'delayed' && !o.is_delayed) return false;
    if (params?.alert === 'no_update' && !o.has_no_update) return false;
    return true;
  });
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
    if (DEMO) return delay(demoLookups);
    return request<Lookups>({ method: 'GET', url: '/bms/lookups' });
  },

  async executiveDashboard(params: Record<string, string | undefined> = {}): Promise<ExecutiveDashboard> {
    if (DEMO) return delay(demoDashboard(params));
    return request<ExecutiveDashboard>({ method: 'GET', url: '/bms/executive-dashboard', params });
  },

  async opportunities(params: Record<string, string | undefined> = {}): Promise<Opportunity[]> {
    if (DEMO) return delay(filterOpps(params));
    return request<Opportunity[]>({ method: 'GET', url: '/bms/opportunities', params });
  },

  async opportunity(id: string | number): Promise<Opportunity> {
    if (DEMO) {
      const hit = demoOpportunities.find((o) => String(o.id) === String(id));
      if (!hit) throw new ApiError('Opportunity not found', 404);
      return delay({
        ...hit,
        history: [
          { id: 1, from_stage: null, to_stage: 'review', note: 'Registered in BMS', created_at: '2026-10-01T08:00:00Z', user: demoLookups.users[0] },
          { id: 2, from_stage: 'review', to_stage: hit.stage, note: 'Moved forward', created_at: hit.last_update_at ?? undefined, user: hit.owner ?? null },
        ],
      });
    }
    return request<Opportunity>({ method: 'GET', url: `/bms/opportunities/${id}` });
  },

  async units(): Promise<BusinessUnit[]> {
    if (DEMO) return delay(demoUnits);
    return request<BusinessUnit[]>({ method: 'GET', url: '/bms/units' });
  },

  async unit(id: string | number): Promise<BusinessUnit> {
    if (DEMO) {
      const hit = demoUnits.find((u) => String(u.id) === String(id));
      if (!hit) throw new ApiError('Unit not found', 404);
      return delay({ ...hit, weeklyPlans: demoPlans.filter((p) => p.business_unit_id === hit.id) });
    }
    return request<BusinessUnit>({ method: 'GET', url: `/bms/units/${id}` });
  },

  async weeklyPlans(params: Record<string, string | undefined> = {}): Promise<WeeklyPlan[]> {
    if (DEMO) {
      return delay(demoPlans.filter((p) => !params.business_unit_id || String(p.business_unit_id) === params.business_unit_id));
    }
    return request<WeeklyPlan[]>({ method: 'GET', url: '/bms/weekly-plans', params });
  },

  async weeklyPlan(id: string | number): Promise<WeeklyPlan> {
    if (DEMO) {
      const hit = demoPlans.find((p) => String(p.id) === String(id));
      if (!hit) throw new ApiError('Plan not found', 404);
      return delay(hit);
    }
    return request<WeeklyPlan>({ method: 'GET', url: `/bms/weekly-plans/${id}` });
  },

  async myTasks(): Promise<MyTasksResponse> {
    if (DEMO) return delay(demoMyTasks());
    // Laravel WeeklyPlanController@myTasks returns {data, summary} inside the envelope's data.
    return request<MyTasksResponse>({ method: 'GET', url: '/bms/my-tasks' });
  },

  async products(): Promise<Product[]> {
    if (DEMO) return delay(demoProducts);
    return request<Product[]>({ method: 'GET', url: '/bms/products' });
  },

  async leads(params: Record<string, string | undefined> = {}): Promise<Lead[]> {
    if (DEMO) return delay(demoLeads);
    return request<Lead[]>({ method: 'GET', url: '/bms/leads', params });
  },

  async meetings(): Promise<Meeting[]> {
    if (DEMO) return delay(demoMeetings);
    return request<Meeting[]>({ method: 'GET', url: '/bms/meetings' });
  },

  async notifications(): Promise<BmsNotification[]> {
    if (DEMO) {
      return delay([
        { id: 1, title: 'Decision requested', message: 'SABIC Plant Analytics is pending go / no-go.', created_at: '2026-11-14T08:10:00Z' },
        { id: 2, title: 'Stale opportunity', message: 'Aramco Field Copilot has had no update for 14 days.', created_at: '2026-11-13T07:00:00Z' },
      ]);
    }
    const payload = await request<unknown>({ method: 'GET', url: '/bms/notifications' });
    if (Array.isArray(payload)) return payload as BmsNotification[];
    if (payload && typeof payload === 'object' && Array.isArray((payload as { data?: unknown }).data)) {
      return (payload as { data: BmsNotification[] }).data;
    }
    return [];
  },

  async directory(params: Record<string, string | undefined> = {}): Promise<DirectoryPerson[]> {
    if (DEMO) {
      return delay(demoDirectory.filter((p) => {
        if (params.search && !`${p.name} ${p.username} ${p.email}`.toLowerCase().includes(params.search.toLowerCase())) return false;
        if (params.business_unit_id && !p.units?.some((u) => String(u.id) === params.business_unit_id)) return false;
        return true;
      }));
    }
    return request<DirectoryPerson[]>({ method: 'GET', url: '/bms/directory', params });
  },

  async employee(id: string | number): Promise<DirectoryPerson> {
    if (DEMO) {
      const hit = demoDirectory.find((p) => String(p.id) === String(id));
      if (!hit) throw new ApiError('Employee not found', 404);
      return delay(hit);
    }
    return request<DirectoryPerson>({ method: 'GET', url: `/bms/employees/${id}` });
  },

  async teams(params: Record<string, string | undefined> = {}): Promise<Team[]> {
    if (DEMO) {
      return delay(demoTeams.filter((t) => !params.business_unit_id || String(t.business_unit_id) === params.business_unit_id));
    }
    return request<Team[]>({ method: 'GET', url: '/bms/teams', params });
  },

  async recruitment(params: Record<string, string | undefined> = {}): Promise<HiringRequest[]> {
    if (DEMO) {
      return delay(demoHiring.filter((h) => !params.status || h.status === params.status));
    }
    return request<HiringRequest[]>({ method: 'GET', url: '/bms/recruitment', params });
  },

  async development(params: Record<string, string | undefined> = {}): Promise<DevelopmentItem[]> {
    if (DEMO) {
      return delay(demoDevelopment.filter((d) => !params.business_unit_id || String(d.business_unit_id) === params.business_unit_id));
    }
    return request<DevelopmentItem[]>({ method: 'GET', url: '/bms/development-items', params });
  },

  async procurement(): Promise<ProcurementRequest[]> {
    if (DEMO) return delay(demoProcurement);
    return request<ProcurementRequest[]>({ method: 'GET', url: '/bms/procurement' });
  },

  async events(): Promise<PrEvent[]> {
    if (DEMO) return delay(demoEvents);
    return request<PrEvent[]>({ method: 'GET', url: '/bms/events' });
  },

  async procedures(): Promise<Procedure[]> {
    if (DEMO) return delay(demoProcedures);
    return request<Procedure[]>({ method: 'GET', url: '/bms/procedures' });
  },

  async documents(params: Record<string, string | undefined> = {}): Promise<BrandDocument[]> {
    if (DEMO) {
      return delay(demoDocuments.filter((d) => {
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
};
