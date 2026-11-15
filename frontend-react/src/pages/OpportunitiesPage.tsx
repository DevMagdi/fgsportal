import { useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BriefcaseBusiness, CircleDollarSign, FileText, LayoutGrid, List, Pencil, Plus, Target, Trash2, TrendingUp, Upload } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../auth/AuthContext';
import { useI18n, type MsgKey } from '../i18n';
import { GO_NO_GO, OPPORTUNITY_STAGES } from '../lib/catalog';
import { formatCalendarDate, formatDate, formatMoney, cn } from '../lib/utils';
import type { Opportunity } from '../lib/types';
import { useEntityManager } from '../components/crud/useEntityManager';
import { Avatar, displayName } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { DataTable, statusLabel, type Column } from '../components/ui/DataTable';
import { FormField, inputClass } from '../components/ui/FormField';
import { Modal } from '../components/ui/Modal';
import { Breadcrumb, DetailField, MetricCards, SectionTitle, StatusBadge } from '../components/ui/PageParts';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState, ErrorState, LoadingState } from '../components/ui/States';
import { Tabs } from '../components/ui/Tabs';
import { useToast } from '../components/ui/Toast';

export function OpportunitiesPage() {
  const { t, lang } = useI18n(); const { lookups } = useAuth();
  const [params, setParams] = useSearchParams(); const [view, setView] = useState<'list' | 'board'>('list');
  const queryParams = useMemo(() => ({ stage: params.get('stage') || undefined, go_no_go: params.get('go_no_go') || undefined, business_unit_id: params.get('business_unit_id') || undefined, alert: params.get('alert') || undefined }), [params]);
  const query = useQuery({ queryKey: ['bms', 'opportunities', queryParams], queryFn: () => api.opportunities(queryParams) });
  const manager = useEntityManager('opportunities');
  function setParam(key: string, value: string) { const next = new URLSearchParams(params); if (value) next.set(key, value); else next.delete(key); setParams(next); }
  if (query.isLoading) return <LoadingState />;
  if (query.isError) return <ErrorState message={(query.error as Error)?.message} onRetry={() => void query.refetch()} />;
  const items = query.data ?? []; const open = items.filter((o) => !['won', 'lost', 'declined'].includes(o.stage));
  const sar = open.filter((o) => (o.currency ?? 'SAR') === 'SAR').reduce((sum, o) => sum + Number(o.value || 0), 0);
  const columns: Column<Opportunity>[] = [
    { key: 'title', label: t('opportunity'), render: (o) => <div className="flex items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600"><BriefcaseBusiness size={17} /></span><div><Link to={`/opportunities/${o.id}`} className="font-semibold text-slate-900 hover:underline">{o.title}</Link><p className="mt-1 text-xs text-slate-400">{o.client_name} · {o.reference}</p></div></div> },
    { key: 'stage', label: t('stage'), render: (o) => <StatusBadge status={o.stage} /> },
    { key: 'unit', label: t('unit'), render: (o) => o.unit?.name ?? '—' },
    { key: 'value', label: t('value'), render: (o) => <span className="tnum whitespace-nowrap font-semibold text-slate-700">{formatMoney(o.value, o.currency, lang)}</span> },
    { key: 'owner', label: t('owner'), render: (o) => <span className="flex items-center gap-2"><Avatar name={displayName(o.owner)} size="sm" /><span className="whitespace-nowrap">{displayName(o.owner)}</span></span> },
    { key: 'close', label: t('expectedClose'), render: (o) => formatCalendarDate(o.expected_close_date, lang) },
  ];
  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
    <PageHeader eyebrow={t('grpBusinessDev')} title={t('opportunities')} subtitle={lang === 'ar' ? 'تابع كل فرصة من الفكرة إلى الفوز.' : 'Move the right opportunities forward, from first look to close.'} actions={manager.canManage && <Button onClick={() => manager.openCreate()}><Plus size={16} />{t('newOpportunity')}</Button>} />
    <MetricCards items={[
      { label: t('openOpportunities'), value: open.length, hint: t('pipeline'), icon: BriefcaseBusiness },
      { label: t('pipelineValue'), value: formatMoney(sar, 'SAR', lang), hint: lang === 'ar' ? 'الفرص المفتوحة بالريال' : 'Open opportunities · SAR only', icon: CircleDollarSign, tone: 'teal' },
      { label: t('won'), value: items.filter((o) => o.stage === 'won').length, hint: t('allTime'), icon: Target, tone: 'amber' },
      { label: t('attention'), value: items.filter((o) => o.is_delayed || o.has_no_update).length, hint: t('openAlerts'), icon: TrendingUp, tone: 'rose' },
    ]} />
    <div className="flex flex-wrap items-center gap-2">
      <select aria-label={t('stage')} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600" value={queryParams.stage ?? ''} onChange={(e) => setParam('stage', e.target.value)}><option value="">{t('allStages')}</option>{OPPORTUNITY_STAGES.map((s) => <option key={s} value={s}>{t(s)}</option>)}</select>
      <select aria-label={t('decision')} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600" value={queryParams.go_no_go ?? ''} onChange={(e) => setParam('go_no_go', e.target.value)}><option value="">{t('allDecisions')}</option>{GO_NO_GO.map((s) => <option key={s} value={s}>{t(s as MsgKey)}</option>)}</select>
      <select aria-label={t('unit')} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600" value={queryParams.business_unit_id ?? ''} onChange={(e) => setParam('business_unit_id', e.target.value)}><option value="">{t('allUnits')}</option>{lookups?.units.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</select>
      <select aria-label={t('alert')} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600" value={queryParams.alert ?? ''} onChange={(e) => setParam('alert', e.target.value)}><option value="">{t('alert')}: {t('none')}</option><option value="delayed">{t('delayed')}</option><option value="no_update">{t('noUpdate')}</option></select>
      <div className="ms-auto flex rounded-lg border border-slate-200 bg-white p-1"><button aria-pressed={view === 'list'} onClick={() => setView('list')} className={cn('flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold', view === 'list' ? 'bg-slate-100 text-slate-800' : 'text-slate-400')}><List size={14} />{t('list')}</button><button aria-pressed={view === 'board'} onClick={() => setView('board')} className={cn('flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold', view === 'board' ? 'bg-slate-100 text-slate-800' : 'text-slate-400')}><LayoutGrid size={14} />{t('board')}</button></div>
    </div>
    {view === 'list' ? <DataTable items={items} columns={columns} title={t('allRecords')} getSearchText={(o) => `${o.title} ${o.client_name} ${o.reference}`} getStatus={(o) => o.stage} getUnit={(o) => o.unit?.name}
      onCreate={manager.canManage ? () => manager.openCreate() : undefined} createLabel={t('newOpportunity')} onEdit={manager.canManage ? manager.openEdit : undefined} onDelete={manager.canManage ? (o) => manager.openDelete(o, o.title) : undefined} onBulkDelete={manager.canManage ? manager.openBulkDelete : undefined} /> : <PipelineBoard items={items} onEdit={manager.canManage ? manager.openEdit : undefined} onDelete={manager.canManage ? (o) => manager.openDelete(o, o.title) : undefined} onCreate={manager.canManage ? () => manager.openCreate() : undefined} />}
    {manager.dialogs}
  </motion.div>;
}

function PipelineBoard({ items, onEdit, onDelete, onCreate }: { items: Opportunity[]; onEdit?: (o: Opportunity) => void; onDelete?: (o: Opportunity) => void; onCreate?: () => void }) {
  const { t, lang } = useI18n();
  if (!items.length) return <Card><EmptyState body={t('getStarted')} action={onCreate && <Button size="sm" onClick={onCreate}><Plus size={14} />{t('newOpportunity')}</Button>} /></Card>;
  const stages = OPPORTUNITY_STAGES.filter((stage) => items.some((o) => o.stage === stage));
  return <div className="flex gap-3 overflow-x-auto pb-4">{stages.map((stage) => { const rows = items.filter((o) => o.stage === stage); return <div key={stage} className="w-[280px] shrink-0 rounded-xl bg-slate-100/80 p-3"><div className="mb-3 flex items-center justify-between px-1"><div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-brand-400" /><span className="text-xs font-semibold text-slate-700">{t(stage)}</span><span className="rounded-md bg-white px-1.5 py-0.5 text-[10px] text-slate-500">{rows.length}</span></div></div><div className="space-y-2.5">{rows.map((o) => <Card key={o.id} className="p-4 transition hover:shadow-lift"><div className="flex justify-between gap-2"><Link to={`/opportunities/${o.id}`} className="text-sm font-semibold leading-5 text-slate-800 hover:text-brand-600">{o.title}</Link>{o.is_delayed && <span className="h-2 w-2 shrink-0 rounded-full bg-pink" title={t('delayed')} />}</div><p className="mt-1 text-xs text-slate-400">{o.client_name}</p><div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3"><span className="text-xs font-semibold text-slate-700">{formatMoney(o.value, o.currency, lang)}</span><Avatar name={displayName(o.owner)} size="sm" /></div>{(onEdit || onDelete) && <div className="mt-2 flex justify-end gap-1"><button onClick={() => onEdit?.(o)} className="rounded p-1 text-slate-400 hover:text-brand-600" aria-label={`${t('edit')} ${o.title}`}><Pencil size={14} /></button><button onClick={() => onDelete?.(o)} className="rounded p-1 text-slate-400 hover:text-brand-600" aria-label={`${t('remove')} ${o.title}`}><Trash2 size={14} /></button></div>}</Card>)}</div></div>; })}</div>;
}

export function OpportunityShowPage() {
  const { id } = useParams(); const navigate = useNavigate(); const { t, lang } = useI18n(); const [tab, setTab] = useState('overview');
  const query = useQuery({ queryKey: ['bms', 'opportunity', id], queryFn: () => api.opportunity(id!), enabled: Boolean(id) });
  const manager = useEntityManager('opportunities', { onDeleted: () => navigate('/opportunities') });
  if (query.isLoading) return <LoadingState />;
  if (query.isError || !query.data) return <ErrorState message={(query.error as Error)?.message} onRetry={() => void query.refetch()} />;
  const o = query.data;
  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
    <Breadcrumb items={[{ label: t('opportunities'), to: '/opportunities' }, { label: o.reference }]} />
    <div className="flex flex-wrap items-start justify-between gap-4"><div className="flex items-start gap-4"><span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-100 text-brand-600"><BriefcaseBusiness size={24} /></span><div><div className="flex flex-wrap items-center gap-3"><h1 className="text-2xl font-semibold tracking-tight text-slate-900">{o.title}</h1><StatusBadge status={o.stage} /></div><p className="mt-1.5 text-sm text-slate-500">{o.client_name} · {o.reference}</p></div></div>{manager.canManage && <div className="flex gap-2"><Button variant="secondary" onClick={() => manager.openEdit(o)}><Pencil size={15} />{t('edit')}</Button><Button variant="secondary" className="text-brand-600" onClick={() => manager.openDelete(o, o.title)}><Trash2 size={15} />{t('remove')}</Button></div>}</div>
    <Tabs value={tab} onChange={setTab} items={[
      { id: 'overview', label: t('overview'), content: <div className="grid gap-4 lg:grid-cols-3"><Card className="lg:col-span-2"><SectionTitle title={t('generalInformation')} /><dl className="grid gap-4 p-4 sm:grid-cols-2"><DetailField label={t('value')} value={formatMoney(o.value, o.currency, lang)} /><DetailField label={t('type')} value={statusLabel(o.type, t)} /><DetailField label={t('unit')} value={o.unit?.name} /><DetailField label={t('owner')} value={displayName(o.owner)} /><DetailField label={t('expectedClose')} value={formatCalendarDate(o.expected_close_date, lang)} /><DetailField label={t('submissionDate')} value={formatCalendarDate(o.submission_date, lang)} /><DetailField label={t('sector')} value={o.sector} /><DetailField label={t('contact')} value={[o.contact_name, o.contact_email].filter(Boolean).join(' · ')} /></dl></Card><Card><SectionTitle title={t('decision')} /><div className="space-y-4 p-5"><StatusBadge status={o.go_no_go} /><p className="text-sm leading-6 text-slate-500">{o.decision_reason || t('noData')}</p><div className="border-t border-slate-100 pt-4"><DetailField label={t('updated')} value={formatDate(o.last_update_at, lang)} /></div></div></Card></div> },
      { id: 'history', label: t('history'), content: <Card><SectionTitle title={t('history')} />{o.history?.length ? <ol className="space-y-5 p-6">{o.history.map((h) => <li key={h.id} className="border-s-2 border-brand-100 ps-4"><div className="text-sm font-semibold text-slate-700">{h.from_stage ? `${statusLabel(h.from_stage, t)} → ${statusLabel(h.to_stage, t)}` : statusLabel(h.to_stage, t)}</div><div className="mt-1 text-xs text-slate-400">{displayName(h.user)} · {formatDate(h.created_at, lang)}</div>{h.note && <p className="mt-2 text-sm text-slate-500">{h.note}</p>}</li>)}</ol> : <EmptyState />}</Card> },
      { id: 'notes', label: t('notes'), content: <Card><SectionTitle title={t('notes')} action={manager.canManage && api.demo ? <Button variant="secondary" size="sm" onClick={() => manager.openEdit(o)}><Pencil size={14} />{t('edit')}</Button> : null} /><p className="whitespace-pre-wrap px-5 py-5 text-sm leading-6 text-slate-600">{o.notes || t('notesEmpty')}</p></Card> },
      { id: 'related', label: t('related'), content: <Card><SectionTitle title={t('linkedRecords')} /><dl className="grid gap-4 p-4 sm:grid-cols-2"><DetailField label={t('unit')} value={o.unit ? <Link to={`/units/${o.unit.id}`} className="text-brand-600 hover:underline">{o.unit.name}</Link> : undefined} /><DetailField label={t('product')} value={o.product?.product_name} /><DetailField label={t('lead')} value={o.bms_lead_id ? `#${o.bms_lead_id}` : undefined} /><DetailField label={t('goNoGo')} value={o.go_no_go ? statusLabel(o.go_no_go, t) : undefined} /></dl></Card> },
      { id: 'documents', label: t('documents'), content: tab === 'documents' ? <OpportunityDocuments id={o.id} canManage={manager.canManage} /> : null },
    ]} />{manager.dialogs}
  </motion.div>;
}

function OpportunityDocuments({ id, canManage }: { id: number; canManage: boolean }) {
  const { t, lang } = useI18n(); const toast = useToast(); const client = useQueryClient(); const [open, setOpen] = useState(false); const [file, setFile] = useState<File | null>(null); const [type, setType] = useState('other'); const [error, setError] = useState('');
  const query = useQuery({ queryKey: ['bms', 'opportunity-documents', id], queryFn: () => api.opportunityDocuments(id) });
  const upload = useMutation({ mutationFn: () => api.uploadOpportunityDocument(id, file!, type), onSuccess: () => { toast.success(t('uploadSuccess')); setOpen(false); setFile(null); void client.invalidateQueries({ queryKey: ['bms', 'opportunity-documents', id] }); }, onError: (err) => { setError(err instanceof Error ? err.message : t('saveError')); } });
  const download = useMutation({ mutationFn: ({ documentId, filename }: { documentId: number; filename: string }) => api.downloadOpportunityDocument(documentId, filename), onError: (err) => toast.error(err instanceof Error ? err.message : t('errorTitle')) });
  function submit(event: FormEvent) { event.preventDefault(); if (!file) { setError(t('requiredField')); return; } upload.mutate(); }
  return <Card><SectionTitle title={t('documents')} action={canManage && <Button variant="secondary" size="sm" onClick={() => setOpen(true)}><Upload size={14} />{t('uploadDocument')}</Button>} />{query.isLoading ? <div className="p-5 text-sm text-slate-400">{t('loading')}</div> : query.isError ? <EmptyState title={t('errorTitle')} body={(query.error as Error).message} /> : !query.data?.length ? <EmptyState body={t('noDocumentsYet')} /> : <ul className="divide-y divide-slate-100">{query.data.map((d) => <li key={d.id} className="flex items-center gap-3 px-5 py-4"><span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600"><FileText size={16} /></span><div className="flex-1"><p className="text-sm font-semibold text-slate-700">{d.original_name}</p><p className="mt-1 text-xs text-slate-400">{statusLabel(d.document_type, t)} · {formatDate(d.created_at, lang)}</p></div>{!api.demo && <Button variant="secondary" size="sm" onClick={() => download.mutate({ documentId: d.id, filename: d.original_name })} disabled={download.isPending}>{t('download')}</Button>}</li>)}</ul>}
    <Modal open={open} onClose={() => setOpen(false)} title={t('uploadDocument')} busy={upload.isPending}><form onSubmit={submit}><div className="space-y-4 px-6 py-6"><FormField htmlFor="opportunity-doc-type" label={t('documentType')}><select id="opportunity-doc-type" value={type} onChange={(e) => setType(e.target.value)} className={cn(inputClass, 'h-10')}>{['rfp', 'financial_proposal', 'appointment', 'training', 'other'].map((v) => <option key={v} value={v}>{statusLabel(v, t)}</option>)}</select></FormField><FormField htmlFor="opportunity-doc-file" label={t('file')} required hint={api.demo ? t('demoFileInfo') : undefined}><input id="opportunity-doc-file" type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className={cn(inputClass, 'py-2')} /></FormField>{error && <p className="text-sm text-brand-600" role="alert">{error}</p>}</div><div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4"><Button type="button" variant="secondary" onClick={() => setOpen(false)}>{t('cancel')}</Button><Button type="submit" disabled={upload.isPending}>{upload.isPending ? t('saving') : t('upload')}</Button></div></form></Modal>
  </Card>;
}
