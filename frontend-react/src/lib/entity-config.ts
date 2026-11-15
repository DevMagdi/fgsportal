import type { MsgKey } from '../i18n';
import type { EntityKind } from './types';

export type FieldType = 'text' | 'textarea' | 'number' | 'email' | 'password' | 'date' | 'datetime-local' | 'select' | 'multiselect' | 'file';
export type FieldSource = 'units' | 'users' | 'products' | 'plans' | 'leadStages' | 'degrees';
export interface FieldSpec {
  name: string;
  label: MsgKey;
  type?: FieldType;
  source?: FieldSource;
  options?: string[];
  required?: boolean;
  step?: number;
  defaultValue?: string;
  createOnly?: boolean;
  editOnly?: boolean;
  demoOnly?: boolean;
  disabledOnEdit?: boolean;
  full?: boolean;
  min?: number;
  max?: number;
  hint?: MsgKey;
}
export interface EntityConfig { singular: MsgKey; createLabel: MsgKey; permission: string; fields: FieldSpec[]; steps?: boolean }
const unit: FieldSpec = { name: 'business_unit_id', label: 'unit', type: 'select', source: 'units' };
const owner: FieldSpec = { name: 'owner_id', label: 'owner', type: 'select', source: 'users' };
const status = (options: string[], defaultValue?: string): FieldSpec => ({ name: 'status', label: 'status', type: 'select', options, defaultValue });
const text = (name: string, label: MsgKey, required = false): FieldSpec => ({ name, label, required });
const textarea = (name: string, label: MsgKey, required = false): FieldSpec => ({ name, label, type: 'textarea', required, full: true });
const active = (name = 'is_active'): FieldSpec => ({ name, label: 'activeStatus', type: 'select', options: ['active', 'inactive'], defaultValue: 'active' });

export const ENTITY_CONFIG: Record<EntityKind, EntityConfig> = {
  units: { singular: 'unit', createLabel: 'newUnit', permission: 'units.manage', fields: [
    text('name', 'unitName', true), { name: 'parent_id', label: 'parentUnit', type: 'select', source: 'units' },
    { name: 'director_id', label: 'director', type: 'select', source: 'users' }, active(),
    textarea('description', 'description'), { name: 'services', label: 'services', full: true, hint: 'servicesHint' },
  ] },
  employees: { singular: 'employee', createLabel: 'addEmployee', permission: 'directory.manage', steps: true, fields: [
    { ...text('firstname', 'firstName', true), step: 1 }, { ...text('lastname', 'lastName', true), step: 1 },
    { ...text('username', 'username', true), step: 1 }, { name: 'email', label: 'email', type: 'email', required: true, step: 1 },
    { name: 'password', label: 'password', type: 'password', required: true, createOnly: true, step: 1, full: true },
    { name: 'business_unit_ids', label: 'units', type: 'multiselect', source: 'units', required: true, step: 2, full: true },
    { name: 'work_degrees_id', label: 'jobTitle', type: 'select', source: 'degrees', step: 2 },
    { name: 'manager_id', label: 'manager', type: 'select', source: 'users', step: 2 },
    { name: 'hiring_date', label: 'hiringDate', type: 'date', step: 2 }, { ...active('active'), step: 2 },
  ] },
  opportunities: { singular: 'opportunity', createLabel: 'newOpportunity', permission: 'opportunities.manage', steps: true, fields: [
    { ...text('title', 'title', true), step: 1, full: true }, { ...text('client_name', 'client', true), step: 1 },
    { name: 'type', label: 'type', type: 'select', options: ['opportunity', 'tender', 'project', 'client', 'internal', 'external'], defaultValue: 'opportunity', required: true, step: 1 },
    { ...unit, required: true, step: 1 }, { ...owner, required: true, step: 1 },
    { name: 'stage', label: 'stage', type: 'select', options: ['review', 'qualification', 'rfp', 'proposal', 'financial_proposal', 'submission', 'submitted', 'negotiation', 'won', 'lost', 'declined'], defaultValue: 'review', required: true, step: 2 },
    { name: 'product_id', label: 'product', type: 'select', source: 'products', step: 2 },
    { name: 'value', label: 'value', type: 'number', min: 0, step: 2 }, { name: 'currency', label: 'currency', type: 'select', options: ['SAR', 'USD', 'EUR'], defaultValue: 'SAR', step: 2 },
    { name: 'expected_close_date', label: 'expectedClose', type: 'date', required: true, step: 2 }, { name: 'submission_date', label: 'submissionDate', type: 'date', step: 2 },
    { ...textarea('notes', 'notes'), demoOnly: true, step: 2 },
  ] },
  bonuses: { singular: 'bonus', createLabel: 'addBonus', permission: 'bonuses.manage', fields: [
    { ...text('title', 'awardTitle', true), full: true }, { name: 'employee_id', label: 'employee', type: 'select', source: 'users', required: true },
    { ...unit, required: true }, { name: 'amount', label: 'amount', type: 'number', min: 0, required: true },
    { name: 'currency', label: 'currency', type: 'select', options: ['SAR', 'USD', 'EUR'], defaultValue: 'SAR', required: true },
    { name: 'awarded_on', label: 'awardedOn', type: 'date', required: true }, status(['draft', 'approved', 'paid'], 'draft'), textarea('notes', 'notes'),
  ] },
  teams: { singular: 'teams', createLabel: 'newTeam', permission: 'teams.manage', fields: [
    text('name', 'name', true), { ...unit, required: true, disabledOnEdit: true },
    { name: 'lead_id', label: 'teamLead', type: 'select', source: 'users' }, active(), textarea('description', 'description'),
    { name: 'user_ids', label: 'teamMembers', type: 'multiselect', source: 'users', full: true, hint: 'teamMembersHint' },
  ] },
  plans: { singular: 'plans', createLabel: 'newPlan', permission: 'plans.manage', fields: [
    { ...unit, required: true, disabledOnEdit: true }, { name: 'week_start', label: 'weekStart', type: 'date', required: true, disabledOnEdit: true, hint: 'weekStartsSunday' },
    textarea('objectives', 'objectives'), textarea('next_week_plan', 'nextWeek'),
  ] },
  tasks: { singular: 'tasks', createLabel: 'addTask', permission: 'tasks.manage', fields: [
    { ...text('title', 'title', true), full: true }, { name: 'weekly_plan_id', label: 'selectPlan', type: 'select', source: 'plans', required: true, disabledOnEdit: true }, owner,
    status(['not_done', 'in_progress', 'achieved'], 'not_done'), { name: 'progress', label: 'progressPercent', type: 'number', min: 0, max: 100, defaultValue: '0' },
    { name: 'due_date', label: 'dueDate', type: 'date' }, textarea('description', 'description'), textarea('blockers', 'blockers'),
  ] },
  leads: { singular: 'lead', createLabel: 'newLead', permission: 'leads.manage', fields: [
    text('name', 'name', true), { name: 'entity_type', label: 'entityType', type: 'select', options: ['government', 'private', 'individual', 'partner', 'collaborator'], defaultValue: 'private' },
    unit, owner, { name: 'stage', label: 'stage', type: 'select', source: 'leadStages' }, text('sector', 'sector'),
    text('contact_name', 'contactName'), { name: 'contact_email', label: 'contactEmail', type: 'email' }, text('contact_phone', 'phone'), textarea('notes', 'notes'),
  ] },
  meetings: { singular: 'meetings', createLabel: 'newMeeting', permission: 'meetings.manage', fields: [
    { ...text('title', 'title', true), full: true }, unit, { name: 'meeting_type', label: 'meetingType', type: 'select', options: ['internal', 'external'], defaultValue: 'internal' },
    { name: 'starts_at', label: 'startTime', type: 'datetime-local', required: true, hint: 'meetingLocalTime' }, { name: 'ends_at', label: 'endTime', type: 'datetime-local', required: true }, text('location', 'location'), status(['scheduled', 'completed', 'cancelled'], 'scheduled'),
    { name: 'attendee_user_ids', label: 'internalAttendees', type: 'multiselect', source: 'users', full: true, hint: 'meetingAttendeesHint' },
  ] },
  products: { singular: 'product', createLabel: 'newProduct', permission: 'products.manage', fields: [
    { ...text('product_name', 'name', true), full: true }, owner,
    { name: 'business_unit_ids', label: 'units', type: 'multiselect', source: 'units', required: true, full: true }, textarea('description', 'description'),
  ] },
  recruitment: { singular: 'recruitment', createLabel: 'newHiring', permission: 'recruitment.manage', fields: [
    { ...text('job_title', 'jobTitle', true), full: true }, { ...unit, required: true, disabledOnEdit: true },
    { ...status(['submitted', 'with_hr', 'cv_received', 'interviewing', 'selected', 'closed', 'rejected']), editOnly: true, hint: 'hiringWorkflowHint' },
    textarea('specification', 'specification', true), { name: 'first_working_day', label: 'hiringDate', type: 'date', editOnly: true },
  ] },
  development: { singular: 'development', createLabel: 'newDevelopment', permission: 'development.manage', fields: [
    { ...text('title', 'title', true), full: true }, { ...unit, required: true }, owner,
    { name: 'item_type', label: 'itemType', type: 'select', options: ['course', 'training_plan', 'awareness', 'cdmp', 'certification'], defaultValue: 'course' },
    status(['planned', 'in_progress', 'completed', 'cancelled'], 'planned'), { name: 'due_date', label: 'dueDate', type: 'date' }, textarea('notes', 'notes'),
  ] },
  procurement: { singular: 'procurement', createLabel: 'newProcurement', permission: 'procurement.manage', fields: [
    text('item', 'item', true), { name: 'quantity', label: 'quantity', type: 'number', min: 1, required: true, defaultValue: '1' }, unit,
    { ...status(['submitted', 'approved', 'rejected']), editOnly: true, demoOnly: true }, textarea('purpose', 'purpose', true),
  ] },
  events: { singular: 'events', createLabel: 'newEvent', permission: 'events.manage', fields: [
    { ...text('title', 'title', true), full: true }, { name: 'event_type', label: 'type', type: 'select', options: ['agreement_signing', 'conference', 'visit', 'campaign', 'other'], defaultValue: 'other' },
    { name: 'event_date', label: 'eventDate', type: 'datetime-local', required: true, hint: 'eventLocalTime' }, text('venue', 'venue'), unit,
    status(['submitted', 'planning', 'ready', 'completed', 'cancelled'], 'submitted'), textarea('announcement_plan', 'description'),
  ] },
  documents: { singular: 'documents', createLabel: 'addDocument', permission: 'documents.manage', fields: [
    text('name', 'name', true), text('category', 'category', true), unit,
    { name: 'file', label: 'file', type: 'file', createOnly: true, required: true, full: true, hint: 'demoFileInfo' },
  ] },
  procedures: { singular: 'procedures', createLabel: 'newProcedure', permission: 'procedures.manage', fields: [
    text('title', 'title', true), text('category', 'category'), textarea('content', 'content', true),
  ] },
};
