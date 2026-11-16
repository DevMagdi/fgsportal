import { useMutation, useQuery } from '@tanstack/react-query';
import { FileText, Plus } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useI18n } from '../../i18n';
import { hasAbility } from '../../lib/abilities';
import { api } from '../../lib/api';
import type { EntityKind } from '../../lib/types';
import { formatDate, formatDateTime } from '../../lib/utils';
import { BonusTable } from '../../pages/BonusesPage';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { EmptyState } from '../ui/States';
import { SectionTitle } from '../ui/PageParts';
import { useToast } from '../ui/Toast';
import { useEntityManager } from './useEntityManager';

export function ActivityPanel({ kind, id }: { kind: EntityKind; id: number }) {
  const { t, lang } = useI18n();
  const query = useQuery({ queryKey: ['bms', 'activity', kind, id], queryFn: () => api.activity(kind, id) });
  return <Card><SectionTitle title={t('activity')} />{!api.demo ? <EmptyState body={t('activityUnavailable')} /> : !query.data?.length ? <EmptyState body={t('noActivityYet')} /> : <ul className="stagger-list divide-y divide-slate-100">{query.data.map((entry) => <li key={entry.id} className="flex items-start gap-3 px-5 py-4"><span className="mt-1.5 h-2 w-2 rounded-full bg-brand-400" /><div><p className="text-sm text-slate-700"><span className="font-semibold">{entry.title}</span> · {entry.action === 'created' ? t('createdSuccess') : entry.action === 'updated' ? t('updatedSuccess') : t('deletedSuccess')}</p><p className="mt-1 text-xs text-slate-400">{formatDateTime(entry.created_at, lang)}</p></div></li>)}</ul>}</Card>;
}

export function BonusPanel({ unitId, employeeId }: { unitId?: number; employeeId?: number }) {
  const { abilities } = useAuth();
  const { t } = useI18n();
  const allowed = hasAbility(abilities, 'bonuses.view');
  const query = useQuery({ queryKey: ['bms', 'bonuses'], queryFn: () => api.bonuses(), enabled: allowed });
  const manager = useEntityManager('bonuses');
  if (!allowed) return <Card><EmptyState body={t('noAccessBody')} /></Card>;
  if (query.isLoading) return <Card><div className="p-5 text-sm text-slate-400">{t('loading')}</div></Card>;
  if (query.isError) return <Card><EmptyState title={t('errorTitle')} body={(query.error as Error).message} /></Card>;
  const items = (query.data ?? []).filter((b) => (!unitId || b.business_unit_id === unitId) && (!employeeId || b.employee_id === employeeId));
  return <div className="space-y-3"><div className="flex justify-end">{manager.canManage && <Button size="sm" onClick={() => manager.openCreate({ ...(unitId ? { business_unit_id: unitId } : {}), ...(employeeId ? { employee_id: employeeId } : {}) })}><Plus size={14} />{t('addBonus')}</Button>}</div><BonusTable items={items} manager={manager} defaults={{ business_unit_id: unitId, employee_id: employeeId }} />{manager.dialogs}</div>;
}

export function UnitDocumentsPanel({ unitId }: { unitId: number }) {
  const { t, lang } = useI18n();
  const { abilities } = useAuth();
  const allowed = hasAbility(abilities, 'documents.view');
  const toast = useToast();
  const query = useQuery({ queryKey: ['bms', 'documents', { business_unit_id: String(unitId) }], queryFn: () => api.documents({ business_unit_id: String(unitId) }), enabled: allowed });
  const manager = useEntityManager('documents');
  const download = useMutation({ mutationFn: ({ id, filename }: { id: number; filename?: string | null }) => api.downloadDocument(id, filename), onError: (error) => toast.error(error instanceof Error ? error.message : t('errorTitle')) });
  if (!allowed) return <Card><EmptyState body={t('noAccessBody')} /></Card>;
  const items = (query.data ?? []).filter((d) => d.business_unit_id === unitId || d.unit?.id === unitId);
  return <Card><SectionTitle title={t('documents')} action={manager.canManage && <Button size="sm" variant="secondary" onClick={() => manager.openCreate({ business_unit_id: unitId })}><Plus size={14} />{t('addDocument')}</Button>} />
    {query.isLoading ? <div className="p-5 text-sm text-slate-400">{t('loading')}</div> : query.isError ? <EmptyState title={t('errorTitle')} body={(query.error as Error).message} /> : !items.length ? <EmptyState body={t('noDocumentsYet')} /> : <ul className="stagger-list divide-y divide-slate-100">{items.map((doc) => <li key={doc.id} className="flex items-center gap-3 px-5 py-4"><span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600"><FileText size={16} /></span><div className="min-w-0 flex-1"><div className="text-sm font-semibold text-slate-800">{doc.name}</div><div className="mt-1 text-xs text-slate-400">{doc.category} · {formatDate(doc.created_at, lang)}</div></div>{!api.demo && <Button size="sm" variant="secondary" onClick={() => download.mutate({ id: doc.id, filename: doc.original_name || doc.name })} disabled={download.isPending}>{t('download')}</Button>}</li>)}</ul>}
    {manager.dialogs}</Card>;
}
