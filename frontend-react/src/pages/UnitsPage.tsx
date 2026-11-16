import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Building2, CheckCircle2, Network, Pencil, Plus, Trash2, Users } from 'lucide-react';
import { api } from '../lib/api';
import { useI18n } from '../i18n';
import type { BusinessUnit } from '../lib/types';
import { formatCalendarDate } from '../lib/utils';
import { useEntityManager } from '../components/crud/useEntityManager';
import { ActivityPanel, BonusPanel, UnitDocumentsPanel } from '../components/crud/RecordPanels';
import { Avatar, displayName } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { DataTable, type Column } from '../components/ui/DataTable';
import { Breadcrumb, DetailField, MetricCards, SectionTitle, StatusBadge } from '../components/ui/PageParts';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState, ErrorState, LoadingState } from '../components/ui/States';
import { Tabs } from '../components/ui/Tabs';

export function UnitsPage() {
  const { t, lang } = useI18n();
  const query = useQuery({ queryKey: ['bms', 'units'], queryFn: () => api.units() });
  const manager = useEntityManager('units');
  if (query.isLoading) return <LoadingState />;
  if (query.isError) return <ErrorState message={(query.error as Error)?.message} onRetry={() => void query.refetch()} />;
  const items = query.data ?? [];
  const columns: Column<BusinessUnit>[] = [
    { key: 'name', label: t('unit'), render: (u) => <div className="flex items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-brand-100 bg-brand-50 text-brand-600"><Building2 size={17} /></span><div className="min-w-0"><Link to={`/units/${u.id}`} className="font-semibold text-slate-900 hover:underline">{u.name}</Link><p className="mt-1 max-w-[250px] truncate text-xs text-slate-400">{u.description || t('noDescription')}</p></div></div> },
    { key: 'director', label: t('director'), render: (u) => <span className="flex items-center gap-2"><Avatar name={displayName(u.director)} size="sm" /><span className="whitespace-nowrap">{displayName(u.director)}</span></span> },
    { key: 'members', label: t('members'), render: (u) => <span className="tnum">{u.headcount ?? u.users?.length ?? 0} {t('people').toLocaleLowerCase()}</span> },
    { key: 'parent', label: t('parentUnit'), render: (u) => u.parent?.name ?? '—' },
    { key: 'status', label: t('status'), render: (u) => <StatusBadge status={u.is_active ?? true} /> },
  ];
  return <div className="space-y-4">
    <PageHeader eyebrow={t('grpOrganization')} title={t('units')} subtitle={lang === 'ar' ? 'نظّم وحداتك والأشخاص والعمل الذي يربطهم.' : 'A clearer view of the teams and work powering your business.'} actions={manager.canManage && <Button onClick={() => manager.openCreate()}><Plus size={16} />{t('newUnit')}</Button>} />
    <MetricCards items={[
      { label: t('totalUnits'), value: items.length, hint: t('allTime'), icon: Building2 },
      { label: t('activeUnits'), value: items.filter((u) => u.is_active !== false && u.is_active !== 0).length, hint: t('active'), icon: CheckCircle2, tone: 'teal' },
      { label: t('headcount'), value: items.reduce((sum, u) => sum + (u.headcount ?? u.users?.length ?? 0), 0), hint: t('members'), icon: Users, tone: 'amber' },
      { label: t('structure'), value: items.filter((u) => u.parent_id).length, hint: lang === 'ar' ? 'وحدات فرعية' : 'Child units', icon: Network },
    ]} />
    <DataTable items={items} columns={columns} title={t('allUnits')} getSearchText={(u) => `${u.name} ${u.description ?? ''} ${displayName(u.director)}`} getStatus={(u) => u.is_active === false || u.is_active === 0 ? 'inactive' : 'active'}
      onCreate={manager.canManage ? () => manager.openCreate() : undefined} createLabel={t('newUnit')} onEdit={manager.canManage ? manager.openEdit : undefined}
      onDelete={manager.canManage ? (u) => manager.openDelete(u, u.name) : undefined} onBulkDelete={manager.canManage ? manager.openBulkDelete : undefined} />
    {manager.dialogs}
  </div>;
}

export function UnitShowPage() {
  const { id } = useParams(); const navigate = useNavigate();
  const { t, lang } = useI18n(); const [tab, setTab] = useState('overview');
  const query = useQuery({ queryKey: ['bms', 'unit', id], queryFn: () => api.unit(id!), enabled: Boolean(id) });
  const manager = useEntityManager('units', { onDeleted: () => navigate('/units') });
  if (query.isLoading) return <LoadingState />;
  if (query.isError || !query.data) return <ErrorState message={(query.error as Error)?.message} onRetry={() => void query.refetch()} />;
  const u = query.data; const members = u.users ?? []; const plans = u.weeklyPlans ?? [];
  return <div className="space-y-5">
    <Breadcrumb items={[{ label: t('units'), to: '/units' }, { label: u.name }]} />
    <div className="flex flex-wrap items-start justify-between gap-4"><div className="flex items-start gap-4"><span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-100 text-brand-600"><Building2 size={25} /></span><div><div className="flex flex-wrap items-center gap-3"><h1 className="text-2xl font-semibold tracking-tight text-slate-900">{u.name}</h1><StatusBadge status={u.is_active ?? true} /></div><p className="mt-1.5 text-sm text-slate-500">{u.description || t('noDescription')}</p></div></div>
      {manager.canManage && <div className="flex gap-2"><Button variant="secondary" onClick={() => manager.openEdit(u)}><Pencil size={15} />{t('edit')}</Button><Button variant="secondary" onClick={() => manager.openDelete(u, u.name)} className="text-brand-600"><Trash2 size={15} />{t('remove')}</Button></div>}
    </div>
    <Tabs value={tab} onChange={setTab} items={[
      { id: 'overview', label: t('overview'), content: <div className="grid gap-4 lg:grid-cols-3"><Card className="lg:col-span-2"><SectionTitle title={t('generalInformation')} /><dl className="grid gap-4 p-4 sm:grid-cols-2"><DetailField label={t('director')} value={displayName(u.director)} /><DetailField label={t('parentUnit')} value={u.parent?.name} /><DetailField label={t('headcount')} value={String(u.headcount ?? members.length)} /><DetailField label={t('services')} value={(u.services ?? []).join(', ')} /><div className="sm:col-span-2"><DetailField label={t('description')} value={u.description} /></div></dl></Card><Card><SectionTitle title={t('members')} /><div className="space-y-3 p-5">{members.slice(0, 4).map((m) => <div key={m.id} className="flex items-center gap-2.5"><Avatar name={displayName(m)} size="sm" /><span className="text-sm text-slate-700">{displayName(m)}</span></div>)}{!members.length && <p className="text-sm text-slate-400">{t('noData')}</p>}<button onClick={() => setTab('members')} className="pt-2 text-xs font-semibold text-brand-600 hover:text-brand-700">{t('viewAll')} →</button></div></Card></div> },
      { id: 'members', label: t('members'), count: members.length, content: <Card><SectionTitle title={t('members')} />{members.length ? <ul className="stagger-list divide-y divide-slate-100">{members.map((m) => <li key={m.id} className="flex items-center gap-3 px-5 py-4"><Avatar name={displayName(m)} /><div><Link to={`/employees/${m.id}`} className="text-sm font-semibold text-slate-800 hover:underline">{displayName(m)}</Link><p className="mt-0.5 text-xs text-slate-400">{m.email ?? m.username}</p></div></li>)}</ul> : <EmptyState />}</Card> },
      { id: 'plans', label: t('plans'), count: plans.length, content: <Card><SectionTitle title={t('plans')} />{plans.length ? <ul className="stagger-list divide-y divide-slate-100">{plans.map((p) => <li key={p.id}><Link to={`/plans/${p.id}`} className="flex items-center justify-between px-5 py-4 text-sm hover:bg-slate-50"><span className="font-medium text-slate-700">{t('weekOf')} {formatCalendarDate(p.week_start, lang)}</span><StatusBadge status={p.status} /></Link></li>)}</ul> : <EmptyState />}</Card> },
      { id: 'bonuses', label: t('bonuses'), content: tab === 'bonuses' ? <BonusPanel unitId={u.id} /> : null },
      { id: 'documents', label: t('documents'), content: tab === 'documents' ? <UnitDocumentsPanel unitId={u.id} /> : null },
      { id: 'activity', label: t('activity'), content: tab === 'activity' ? <ActivityPanel kind="units" id={u.id} /> : null },
    ]} />
    {manager.dialogs}
  </div>;
}
