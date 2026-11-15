import { useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { Plus, type LucideIcon } from 'lucide-react';
import { useI18n, type MsgKey } from '../../i18n';
import { ENTITY_CONFIG } from '../../lib/entity-config';
import type { EntityKind, EntityMap } from '../../lib/types';
import { formatCalendarDate, formatDate, formatDateTime } from '../../lib/utils';
import { Button } from '../ui/Button';
import { DataTable, statusLabel, type Column } from '../ui/DataTable';
import { Drawer } from '../ui/Modal';
import { PageHeader } from '../ui/PageHeader';
import { ErrorState, LoadingState } from '../ui/States';
import { useEntityManager } from './useEntityManager';

interface CollectionProps<K extends EntityKind> {
  kind: K;
  queryName: string;
  queryFn: () => Promise<EntityMap[K][]>;
  title: MsgKey;
  eyebrow: MsgKey;
  subtitle: { en: string; ar: string };
  icon: LucideIcon;
  columns: (open: (item: EntityMap[K]) => void) => Column<EntityMap[K]>[];
  recordName: (item: EntityMap[K]) => string;
  searchText: (item: EntityMap[K]) => string;
  getStatus?: (item: EntityMap[K]) => string | null | undefined;
  getUnit?: (item: EntityMap[K]) => string | string[] | null | undefined;
  canEdit?: (item: EntityMap[K]) => boolean;
  canDelete?: (item: EntityMap[K]) => boolean;
  deleteLabel?: string;
  hideHeader?: boolean;
  children?: ReactNode;
}

export function CollectionPage<K extends EntityKind>({ kind, queryName, queryFn, title, eyebrow, subtitle, icon: Icon, columns, recordName, searchText, getStatus, getUnit, canEdit, canDelete, deleteLabel, hideHeader, children }: CollectionProps<K>) {
  const { t, lang } = useI18n(); const [detail, setDetail] = useState<EntityMap[K] | null>(null);
  const query = useQuery({ queryKey: ['bms', queryName], queryFn });
  const manager = useEntityManager(kind);
  if (query.isLoading) return <LoadingState />;
  if (query.isError) return <ErrorState message={(query.error as Error)?.message} onRetry={() => void query.refetch()} />;
  const items = query.data ?? [];
  return <div className="space-y-3">
    {!hideHeader && <PageHeader eyebrow={t(eyebrow)} title={t(title)} subtitle={subtitle[lang]} actions={manager.canManage && <Button onClick={() => manager.openCreate()}><Plus size={16} />{t(ENTITY_CONFIG[kind].createLabel)}</Button>} />}
    {!hideHeader && <div className="flex items-center gap-3 rounded-xl border border-brand-100 bg-gradient-to-r from-brand-50/80 via-white to-white px-4 py-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-brand-600 shadow-sm"><Icon size={20} /></span><div><div className="text-sm font-semibold text-slate-800">{items.length} {t('records')}</div><div className="mt-1 text-xs text-slate-400">{subtitle[lang]}</div></div></div>}
    {hideHeader && manager.canManage && <div className="flex justify-end"><Button size="sm" onClick={() => manager.openCreate()}><Plus size={14} />{t(ENTITY_CONFIG[kind].createLabel)}</Button></div>}
    <DataTable items={items} columns={columns(setDetail)} title={t('allRecords')} getSearchText={searchText} getStatus={getStatus} getUnit={getUnit}
      onCreate={manager.canManage ? () => manager.openCreate() : undefined} createLabel={t(ENTITY_CONFIG[kind].createLabel)}
      onEdit={manager.canManage ? manager.openEdit : undefined} canEdit={canEdit} onDelete={manager.canManage ? (item) => manager.openDelete(item, recordName(item)) : undefined} canDelete={canDelete} deleteLabel={deleteLabel} onBulkDelete={manager.canManage ? manager.openBulkDelete : undefined} />
    {children}
    <AnimatePresence mode="wait">
      {detail && <RecordDrawer key={detail.id} record={detail as unknown as Record<string, unknown>} title={recordName(detail)} onClose={() => setDetail(null)} onEdit={manager.canManage && (!canEdit || canEdit(detail)) ? () => { manager.openEdit(detail); setDetail(null); } : undefined} />}
    </AnimatePresence>
    {manager.dialogs}
  </div>;
}

const labels: Record<string, MsgKey> = { name: 'name', title: 'title', item: 'item', product_name: 'product', job_title: 'jobTitle', description: 'description', specification: 'specification', purpose: 'purpose', status: 'status', stage: 'stage', entity_type: 'entityType', sector: 'sector', contact_name: 'contactName', contact_email: 'contactEmail', contact_phone: 'phone', location: 'location', starts_at: 'startTime', ends_at: 'endTime', event_date: 'eventDate', event_type: 'type', venue: 'venue', notes: 'notes', quantity: 'quantity', category: 'category', content: 'content', created_at: 'updated', due_date: 'dueDate', first_working_day: 'hiringDate', finance_comment: 'finance', announcement_plan: 'description', reference: 'reference', candidates: 'candidates', onboarding: 'onboarding', quotations: 'quotations', checklist: 'checklist', phases: 'phase', unit: 'unit', businessUnits: 'units', owner: 'owner', requester: 'owner', currentPhase: 'phase', attendees: 'members', minutes: 'notes', interview_at: 'starts', email: 'email', issuer: 'issuer', amount: 'amount', vendor: 'vendor', department: 'unit', progress: 'progress' };
const hiddenKeys = new Set(['id', 'business_unit_id', 'owner_id', 'created_by', 'lead_id', 'requester_id', 'is_latest', 'is_published', 'deleted_at', 'document_key', 'file_path', 'photo_url', 'can_manage', 'members_count', 'unit_id', 'user_id', 'updated_by']);
function humanize(key: string) { return key.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^\w/, (c) => c.toUpperCase()); }
function valueText(value: unknown, key: string, lang: string, t: (key: MsgKey) => string): string {
  if (value == null || value === '') return '—';
  if (typeof value === 'boolean') return value ? t('active') : t('inactive');
  if (typeof value === 'string') {
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
      if (key === 'event_date') return formatDateTime(value, lang);
      if (key.endsWith('_date') || ['first_working_day', 'week_start', 'awarded_on'].includes(key)) return formatCalendarDate(value, lang);
      if (key.endsWith('_at')) return value.includes('T') ? formatDateTime(value, lang) : formatDate(value, lang);
    }
    if (['status', 'stage', 'event_type', 'entity_type', 'item_type'].includes(key)) return statusLabel(value, t);
    return value;
  }
  if (typeof value === 'number') return String(value);
  if (typeof value === 'object' && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>;
    return String(obj.name ?? obj.title ?? obj.username ?? obj.product_name ?? obj.department_name ?? '—');
  }
  return String(value);
}

function RecordDrawer({ record, title, onClose, onEdit }: { record: Record<string, unknown>; title: string; onClose: () => void; onEdit?: () => void }) {
  const { t, lang } = useI18n();
  const entries = Object.entries(record).filter(([key, value]) => !hiddenKeys.has(key) && !key.endsWith('_id') && value != null && value !== '' && !Array.isArray(value));
  const groups = Object.entries(record).filter(([key, value]) => !hiddenKeys.has(key) && Array.isArray(value) && value.length > 0) as [string, unknown[]][];
  return <Drawer open parentPresence onClose={onClose} title={title} description={t('details')}>
    <div className="flex-1 overflow-y-auto px-6 py-5"><dl className="grid gap-x-5 gap-y-4 sm:grid-cols-2">{entries.map(([key, value]) => <div key={key} className={typeof value === 'string' && value.length > 100 ? 'sm:col-span-2' : ''}><dt className="text-[11px] font-medium text-slate-400">{labels[key] ? t(labels[key]) : humanize(key)}</dt><dd className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-5 text-slate-700">{valueText(value, key, lang, t)}</dd></div>)}</dl>
      {groups.map(([key, rows]) => <section key={key} className="mt-7"><h3 className="mb-3 text-sm font-semibold text-slate-800">{labels[key] ? t(labels[key]) : humanize(key)}</h3><div className="space-y-2">{rows.map((row, index) => <div key={index} className="rounded-lg border border-slate-100 bg-slate-50/70 p-3 text-sm text-slate-600">{row && typeof row === 'object' ? Object.entries(row as Record<string, unknown>).filter(([k, v]) => !hiddenKeys.has(k) && !k.endsWith('_id') && v != null && v !== '' && !Array.isArray(v)).map(([k, v]) => <div key={k} className="flex justify-between gap-4 py-0.5 text-xs"><span className="text-slate-400">{labels[k] ? t(labels[k]) : humanize(k)}</span><span className="text-end font-medium text-slate-700">{valueText(v, k, lang, t)}</span></div>) : String(row)}</div>)}</div></section>)}
    </div><div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50/70 px-6 py-4"><Button variant="secondary" onClick={onClose}>{t('close')}</Button>{onEdit && <Button onClick={onEdit}>{t('edit')}</Button>}</div>
  </Drawer>;
}
