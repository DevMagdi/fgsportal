/**
 * Types mirroring the real Laravel BMS payloads.
 * Field names match the backend exactly (snake_case) — see
 * backend/app/Http/Controllers/BMS/* and backend/routes/api.php.
 */

export interface User {
  id: number;
  username: string;
  firstname?: string | null;
  lastname?: string | null;
  email?: string | null;
  photoURL?: string | null;
  active?: number | boolean;
  [key: string]: unknown;
}

export interface AuthUser {
  key: string;
  username: string;
  firstname?: string | null;
  lastname?: string | null;
  email?: string | null;
  photoURL?: string | null;
  token?: string;
  [key: string]: unknown;
}

export interface LookupUser {
  id: number;
  username: string;
  firstname?: string | null;
  lastname?: string | null;
  email?: string | null;
}

export interface LookupUnit {
  id: number;
  name: string;
  parent_id?: number | null;
}

export interface LookupProduct {
  id: number;
  product_name: string;
}

export interface BmsRole {
  id: number;
  name: string;
  slug: string;
  abilities: string[];
}

export interface PipelineStage {
  id: number;
  code: string;
  name?: string | null;
  sequence: number;
  is_active?: boolean | number;
}

export interface Lookups {
  current_user: LookupUser;
  users: LookupUser[];
  units: LookupUnit[];
  departments: { id: number; department_name: string }[];
  meeting_types: string[];
  task_statuses: string[];
  unit_categories: LookupUnit[];
  opportunity_types: string[];
  work_degrees: { id: number; work_degree_name?: string; name?: string }[];
  products: LookupProduct[];
  leads: { id: number; name: string }[];
  lead_stages: PipelineStage[];
  opportunities: { id: number; title: string; reference: string }[];
  roles: BmsRole[];
  abilities: string[];
  /** Abilities granted to the signed-in user. `*` = system administrator. */
  can: string[];
}

export interface UnitProgress {
  id: number;
  name: string;
  director?: LookupUser | null;
  total: number;
  achieved: number;
  in_progress: number;
  not_done: number;
  blocked: number;
  progress: number;
}

export interface DashboardMeeting {
  id: number;
  title: string;
  starts_at: string;
  ends_at?: string | null;
  location?: string | null;
  business_unit_id?: number | null;
  status?: string | null;
  unit?: { id: number; name: string } | null;
}

export interface RecentActivity {
  event: string;
  at: string;
  by?: string | null;
  type: string;
  id: number;
}

export interface DashboardSummary {
  units: number;
  tasks: number;
  achieved: number;
  blocked_tasks: number;
  opportunities: number;
  delayed_opportunities: number;
  stale_opportunities: number;
  products: number;
  pending_procurement: number;
  upcoming_meetings: number;
  overdue_tasks: number;
}

export interface ExecutiveDashboard {
  generated_at: string;
  filters: Record<string, unknown>;
  unit_progress: UnitProgress[];
  procurement: { pending: number };
  meetings: DashboardMeeting[];
  recent_activity: RecentActivity[];
  tenders: { total: number; submitted: number; delayed: number; no_update: number };
  employee_tasks: unknown[];
  opportunities: Opportunity[];
  products: Product[];
  summary: DashboardSummary;
}

export type OpportunityStage =
  | 'review' | 'qualification' | 'rfp' | 'proposal' | 'financial_proposal'
  | 'submission' | 'submitted' | 'negotiation' | 'won' | 'lost' | 'declined';

export interface OpportunityHistory {
  id: number;
  from_stage?: string | null;
  to_stage: string;
  note?: string | null;
  changed_by?: number | null;
  created_at?: string;
  user?: LookupUser | null;
}

export interface Opportunity {
  id: number;
  reference: string;
  title: string;
  client_name: string;
  type: string;
  business_unit_id?: number | null;
  contact_lead_id?: number | null;
  product_id?: number | null;
  owner_id?: number | null;
  created_by?: number | null;
  stage: string;
  value?: number | string | null;
  currency?: string | null;
  submission_date?: string | null;
  expected_close_date?: string | null;
  last_update_at?: string | null;
  go_no_go?: string | null;
  decision_reason?: string | null;
  decided_by?: number | null;
  decided_at?: string | null;
  bms_lead_id?: number | null;
  sector?: string | null;
  notes?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  is_delayed?: boolean;
  has_no_update?: boolean;
  unit?: LookupUnit | null;
  product?: { id: number; product_name: string } | null;
  owner?: LookupUser | null;
  creator?: LookupUser | null;
  decisionMaker?: LookupUser | null;
  history?: OpportunityHistory[];
  minutes?: unknown[];
  [key: string]: unknown;
}

export interface BusinessUnit {
  id: number;
  name: string;
  slug?: string | null;
  parent_id?: number | null;
  description?: string | null;
  key_messages?: string | null;
  services?: string[] | null;
  director_id?: number | null;
  is_active?: boolean | number;
  parent?: LookupUnit | null;
  children?: LookupUnit[];
  director?: LookupUser | null;
  developmentManager?: LookupUser | null;
  users?: LookupUser[];
  headcount?: number;
  can_manage_teams?: boolean;
  weeklyPlans?: WeeklyPlan[];
  [key: string]: unknown;
}

export interface UnitTask {
  id: number;
  weekly_plan_id?: number | null;
  business_unit_id?: number | null;
  title: string;
  description?: string | null;
  owner_id?: number | null;
  status: 'achieved' | 'in_progress' | 'not_done';
  progress?: number | null;
  blockers?: string | null;
  due_date?: string | null;
  completion_date?: string | null;
  owner?: LookupUser | null;
  unit?: LookupUnit | null;
  plan?: { id: number; week_start: string; status: string } | null;
  [key: string]: unknown;
}

export interface SupportRequest {
  id: number;
  title: string;
  details?: string | null;
  status: string;
  department_id?: number | null;
  department?: { id: number; department_name: string } | null;
  requester?: LookupUser | null;
  [key: string]: unknown;
}

export interface WeeklyPlan {
  id: number;
  business_unit_id: number;
  week_start: string;
  objectives?: string | null;
  next_week_plan?: string | null;
  status: 'draft' | 'submitted';
  created_by?: number | null;
  submitted_by?: number | null;
  submitted_at?: string | null;
  unit?: LookupUnit | null;
  creator?: LookupUser | null;
  submitter?: LookupUser | null;
  tasks?: UnitTask[];
  supportRequests?: SupportRequest[];
  [key: string]: unknown;
}

export interface MyTasksResponse {
  data: UnitTask[];
  summary: {
    total: number;
    achieved: number;
    in_progress: number;
    not_done: number;
    overdue: number;
    blocked: number;
  };
}

export interface Product {
  id: number;
  product_name: string;
  description?: string | null;
  owner_id?: number | null;
  deleted_at?: string | null;
  businessUnits?: LookupUnit[];
  owner?: LookupUser | null;
  phases?: ProductPhase[];
  currentPhase?: ProductPhase | null;
  [key: string]: unknown;
}

export interface ProductPhase {
  id: number;
  product_id?: number;
  name?: string | null;
  title?: string | null;
  progress?: number | null;
  status?: string | null;
  sequence?: number | null;
  [key: string]: unknown;
}

export interface Lead {
  id: number;
  name: string;
  entity_type?: string | null;
  sector?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  business_unit_id?: number | null;
  owner_id?: number | null;
  stage?: string | null;
  contact_status?: string | null;
  ecosystem_plan?: string | null;
  lab_scenario?: string | null;
  notes?: string | null;
  last_contacted_at?: string | null;
  converted_opportunity_id?: number | null;
  unit?: LookupUnit | null;
  owner?: LookupUser | null;
  opportunity?: { id: number; reference: string; title: string } | null;
  [key: string]: unknown;
}

export interface Meeting {
  id: number;
  title: string;
  starts_at: string;
  ends_at?: string | null;
  location?: string | null;
  status?: string | null;
  business_unit_id?: number | null;
  unit?: LookupUnit | null;
  attendees?: unknown[];
  [key: string]: unknown;
}

export interface BmsNotification {
  id: string | number;
  title?: string | null;
  message?: string | null;
  read_at?: string | null;
  created_at?: string;
  data?: { title?: string; message?: string; [key: string]: unknown };
  [key: string]: unknown;
}

export interface ApiEnvelope<T> {
  data: T;
  message?: string;
  status?: number;
}

export interface DirectoryPerson {
  id: number;
  name: string;
  username: string;
  email?: string | null;
  job_title?: string | null;
  photo_url?: string | null;
  units?: LookupUnit[];
  business_units?: LookupUnit[];
  hiring_date?: string | null;
  active?: boolean;
  certificates?: Certificate[];
  manager?: string | null;
  manager_id?: number | null;
  roles?: { id: number; name: string; slug: string; business_unit_id?: number | null }[];
  work_degrees_id?: number | null;
  has_photo?: boolean;
  [key: string]: unknown;
}

export interface Certificate {
  id: number;
  name: string;
  issuer?: string | null;
  issued_at?: string | null;
  expires_at?: string | null;
  unit?: LookupUnit | null;
  [key: string]: unknown;
}

export interface Paginated<T> {
  data: T[];
  meta: { current_page: number; last_page: number; per_page: number; total: number };
}

export interface Team {
  id: number;
  business_unit_id: number;
  business_unit?: { id: number; name: string; slug?: string; is_active?: boolean } | null;
  name: string;
  description?: string | null;
  is_active?: boolean;
  lead_id?: number | null;
  lead?: LookupUser | null;
  members?: LookupUser[];
  members_count?: number;
  can_manage?: boolean;
  [key: string]: unknown;
}

export interface Candidate {
  id: number;
  name: string;
  email?: string | null;
  status?: string | null;
  interview_at?: string | null;
  interview_notes?: string | null;
  interview_decision?: string | null;
  [key: string]: unknown;
}

export interface OnboardingItem {
  id: number;
  department?: string | null;
  title: string;
  status?: string | null;
  owner?: LookupUser | null;
  employee?: LookupUser | null;
  notes?: string | null;
  [key: string]: unknown;
}

export interface HiringRequest {
  id: number;
  job_title: string;
  specification?: string | null;
  status: string;
  business_unit_id?: number | null;
  unit?: LookupUnit | null;
  requester?: LookupUser | null;
  candidates?: Candidate[];
  onboarding?: OnboardingItem[];
  first_working_day?: string | null;
  [key: string]: unknown;
}

export interface ProcurementQuotation {
  id: number;
  vendor: string;
  amount: number | string;
  currency?: string | null;
  original_name?: string | null;
  [key: string]: unknown;
}

export interface ProcurementRequest {
  id: number;
  reference?: string | null;
  item: string;
  quantity: number;
  purpose?: string | null;
  status: string;
  business_unit_id?: number | null;
  unit?: LookupUnit | null;
  requester?: LookupUser | null;
  reviewer?: LookupUser | null;
  quotations?: ProcurementQuotation[];
  budget_confirmed?: boolean | number;
  finance_comment?: string | null;
  reviewed_at?: string | null;
  [key: string]: unknown;
}

export interface ChecklistItem {
  id: number;
  title: string;
  status?: string | null;
  owner?: LookupUser | null;
  [key: string]: unknown;
}

export interface PrEvent {
  id: number;
  title: string;
  event_type?: string | null;
  event_date?: string | null;
  venue?: string | null;
  status?: string | null;
  business_unit_id?: number | null;
  unit?: LookupUnit | null;
  requester?: LookupUser | null;
  checklist?: ChecklistItem[];
  announcement_plan?: string | null;
  [key: string]: unknown;
}

export interface Procedure {
  id: number;
  title: string;
  category?: string | null;
  content?: string | null;
  is_published?: boolean | number;
  creator?: LookupUser | null;
  created_at?: string;
  [key: string]: unknown;
}

export interface BrandDocument {
  id: number;
  name: string;
  category: string;
  document_key?: string | null;
  version?: number;
  is_latest?: boolean;
  is_published?: boolean;
  original_name?: string | null;
  mime_type?: string | null;
  business_unit_id?: number | null;
  unit?: LookupUnit | null;
  uploader?: LookupUser | null;
  created_at?: string;
  [key: string]: unknown;
}

export interface DevelopmentItem {
  id: number;
  title: string;
  item_type?: string | null;
  status?: string | null;
  due_date?: string | null;
  notes?: string | null;
  business_unit_id?: number | null;
  unit?: LookupUnit | null;
  owner?: LookupUser | null;
  [key: string]: unknown;
}

export interface UnitKpi {
  id: number;
  name: string;
  target?: number | null;
  actual?: number | null;
  unit_label?: string | null;
  frequency?: string | null;
  attainment?: number | null;
  status?: string | null;
  period_start?: string | null;
  period_end?: string | null;
  unit?: LookupUnit | null;
  business_unit_id?: number;
  [key: string]: unknown;
}

export interface MonthlyReport {
  report_type: string;
  period: { start: string; end: string };
  generated_at: string;
  units: {
    unit: LookupUnit;
    tasks_total: number;
    achievements: unknown[];
    in_progress: number;
    not_done: number;
    average_progress: number;
    support_needs: unknown[];
  }[];
  products: Product[];
  opportunities: Opportunity[];
  summary: {
    achievements: number;
    in_progress: number;
    support_requests: number;
    open_support: number;
    products: number;
    opportunities_updated: number;
  };
}

export interface KpiReport {
  kpis: UnitKpi[];
  history: { business_unit_id: number; unit?: string | null; name: string; points: { period_start: string; actual?: number | null; target?: number | null }[] }[];
  generated_at: string;
}

export interface SocialReport {
  report_type: string;
  period: { start: string; end: string };
  metrics: { id?: number; platform: string; followers: number; posts: number; engagement: number; period_start?: string; period_end?: string }[];
  summary: { followers: number; posts: number; engagement: number };
}

export interface RoleAudit {
  id: number;
  created_at: string;
  employee: string;
  event: string;
  role: string;
  business_unit?: string | null;
  user?: string | null;
}

export interface RoleAssignment {
  role_id: number;
  role?: string | null;
  slug?: string | null;
  business_unit_id?: number | null;
  business_unit?: string | null;
  scope: 'unit' | 'global';
}
