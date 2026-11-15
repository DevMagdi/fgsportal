import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BriefcaseBusiness, CheckCircle2, Pencil, Plus, ShieldCheck, Trash2, Users } from 'lucide-react';
import { api } from '../lib/api';
import { useI18n } from '../i18n';
import type { DirectoryPerson } from '../lib/types';
import { formatCalendarDate } from '../lib/utils';
import { useEntityManager } from '../components/crud/useEntityManager';
import { useAuth } from '../auth/AuthContext';
import { ActivityPanel, BonusPanel } from '../components/crud/RecordPanels';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { DataTable, type Column } from '../components/ui/DataTable';
import { Breadcrumb, DetailField, MetricCards, SectionTitle, StatusBadge } from '../components/ui/PageParts';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState, ErrorState, LoadingState } from '../components/ui/States';
import { Tabs } from '../components/ui/Tabs';

export function EmployeesPage() {
  const { t, lang } = useI18n();
  const { lookups } = useAuth();
  const query = useQuery({ queryKey: ['bms', 'directory'], queryFn: () => api.directory() });
  const manager = useEntityManager('employees');
  if (query.isLoading) return <LoadingState />;
  if (query.isError) return <ErrorState message={(query.error as Error)?.message} onRetry={() => void query.refetch()} />;
  const items = query.data ?? [];
  const columns: Column<DirectoryPerson>[] = [
    { key: 'person', label: t('employee'), render: (p) => <div className="flex items-center gap-3"><Avatar name={p.name} src={p.photo_url} /><div className="min-w-0"><Link to={`/employees/${p.id}`} className="font-semibold text-slate-900 hover:underline">{p.name}</Link><p className="mt-1 truncate text-xs text-slate-400">{p.email || p.username}</p></div></div> },
    { key: 'job', label: t('jobTitle'), render: (p) => p.job_title || '—' },
    { key: 'unit', label: t('unit'), render: (p) => (p.units ?? p.business_units ?? []).map((u) => u.name).join(', ') || '—' },
    { key: 'date', label: t('hiringDate'), render: (p) => formatCalendarDate(p.hiring_date, lang) },
    { key: 'status', label: t('status'), render: (p) => <StatusBadge status={p.active ?? true} /> },
  ];
  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
    <PageHeader eyebrow={t('grpOrganization')} title={t('employees')} subtitle={lang === 'ar' ? 'كل الأشخاص الذين يقفون خلف العمل الرائع.' : 'Get to know the people behind the work, all in one place.'} actions={manager.canManage && <Button onClick={() => manager.openCreate()}><Plus size={16} />{t('addEmployee')}</Button>} />
    <MetricCards items={[
      { label: t('totalPeople'), value: items.length, hint: t('employees'), icon: Users },
      { label: t('activePeople'), value: items.filter((p) => p.active !== false).length, hint: t('active'), icon: CheckCircle2, tone: 'teal' },
      { label: t('units'), value: new Set(items.flatMap((p) => (p.units ?? p.business_units ?? []).map((u) => u.id))).size, hint: lang === 'ar' ? 'وحدات ممثّلة' : 'Units represented', icon: BriefcaseBusiness, tone: 'amber' },
      { label: t('certificates'), value: items.reduce((sum, p) => sum + (p.certificates?.length ?? 0), 0), hint: lang === 'ar' ? 'في النطاق' : 'In your scope', icon: ShieldCheck },
    ]} />
    <DataTable items={items} columns={columns} title={t('allRecords')} getSearchText={(p) => `${p.name} ${p.username} ${p.email ?? ''} ${p.job_title ?? ''}`} getStatus={(p) => p.active === false ? 'inactive' : 'active'} getUnit={(p) => (p.units ?? p.business_units ?? []).map((u) => u.name)}
      onCreate={manager.canManage ? () => manager.openCreate() : undefined} createLabel={t('addEmployee')} onEdit={manager.canManage ? manager.openEdit : undefined} onDelete={manager.canManage ? (p) => manager.openDelete(p, p.name) : undefined} canDelete={(p) => api.demo || (p.active !== false && p.id !== lookups?.current_user.id)} deleteLabel={api.demo ? t('remove') : t('deactivateEmployee')} onBulkDelete={manager.canManage ? manager.openBulkDelete : undefined} />
    {manager.dialogs}
  </motion.div>;
}

export function EmployeeShowPage() {
  const { id } = useParams(); const navigate = useNavigate(); const { t, lang } = useI18n(); const { lookups } = useAuth(); const [tab, setTab] = useState('overview');
  const query = useQuery({ queryKey: ['bms', 'employee', id], queryFn: () => api.employee(id!), enabled: Boolean(id) });
  const manager = useEntityManager('employees', { onDeleted: () => navigate('/employees') });
  if (query.isLoading) return <LoadingState />;
  if (query.isError || !query.data) return <ErrorState message={(query.error as Error)?.message} onRetry={() => void query.refetch()} />;
  const p = query.data; const units = p.units ?? p.business_units ?? []; const roles = p.roles ?? []; const certs = p.certificates ?? [];
  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
    <Breadcrumb items={[{ label: t('employees'), to: '/employees' }, { label: p.name }]} />
    <div className="flex flex-wrap items-start justify-between gap-4"><div className="flex items-center gap-4"><span className="[&>span]:h-14 [&>span]:w-14 [&>span]:text-base [&>img]:h-14 [&>img]:w-14"><Avatar name={p.name} src={p.photo_url} /></span><div><div className="flex flex-wrap items-center gap-3"><h1 className="text-2xl font-semibold tracking-tight text-slate-900">{p.name}</h1><StatusBadge status={p.active ?? true} /></div><p className="mt-1.5 text-sm text-slate-500">{p.job_title || p.username}{units.length ? ` · ${units.map((u) => u.name).join(', ')}` : ''}</p></div></div>
      {manager.canManage && <div className="flex gap-2"><Button variant="secondary" onClick={() => manager.openEdit(p)}><Pencil size={15} />{t('edit')}</Button>{(api.demo || (p.active !== false && p.id !== lookups?.current_user.id)) && <Button variant="secondary" className="text-brand-600" onClick={() => manager.openDelete(p, p.name)}><Trash2 size={15} />{api.demo ? t('remove') : t('deactivateEmployee')}</Button>}</div>}
    </div>
    <Tabs value={tab} onChange={setTab} items={[
      { id: 'overview', label: t('overview'), content: <div className="grid gap-4 lg:grid-cols-3"><Card className="lg:col-span-2"><SectionTitle title={t('personalInformation')} /><dl className="grid gap-4 p-4 sm:grid-cols-2"><DetailField label={t('email')} value={p.email} /><DetailField label={t('username')} value={p.username} /><DetailField label={t('jobTitle')} value={p.job_title} /><DetailField label={t('manager')} value={typeof p.manager === 'string' ? p.manager : undefined} /><DetailField label={t('hiringDate')} value={formatCalendarDate(p.hiring_date, lang)} /><DetailField label={t('units')} value={units.map((u) => u.name).join(', ')} /></dl></Card><Card><SectionTitle title={t('roles')} /><div className="space-y-3 p-5">{roles.slice(0, 3).map((r) => <div key={`${r.id}-${r.business_unit_id}`} className="flex justify-between gap-3 text-sm"><span className="font-medium text-slate-700">{r.name}</span><Badge>{r.business_unit_id ? t('unit') : t('global')}</Badge></div>)}{!roles.length && <p className="text-sm text-slate-400">{t('noData')}</p>}<button onClick={() => setTab('roles')} className="pt-2 text-xs font-semibold text-brand-600">{t('viewAll')} →</button></div></Card></div> },
      { id: 'roles', label: t('roles'), count: roles.length, content: <Card><SectionTitle title={t('roles')} />{roles.length ? <ul className="divide-y divide-slate-100">{roles.map((r) => <li key={`${r.id}-${r.business_unit_id}`} className="flex items-center justify-between px-5 py-4 text-sm"><span className="font-medium text-slate-700">{r.name}</span><Badge>{r.business_unit_id ? t('unit') : t('global')}</Badge></li>)}</ul> : <EmptyState />}</Card> },
      { id: 'certificates', label: t('certificates'), count: certs.length, content: <Card><SectionTitle title={t('certificates')} />{certs.length ? <ul className="divide-y divide-slate-100">{certs.map((c) => <li key={c.id} className="flex items-center justify-between px-5 py-4 text-sm"><div><div className="font-semibold text-slate-800">{c.name}</div><div className="mt-1 text-xs text-slate-400">{c.issuer} · {formatCalendarDate(c.issued_at, lang)}</div></div>{c.unit && <Badge>{c.unit.name}</Badge>}</li>)}</ul> : <EmptyState />}</Card> },
      { id: 'bonuses', label: t('bonuses'), content: tab === 'bonuses' ? <BonusPanel employeeId={p.id} /> : null },
      { id: 'activity', label: t('activity'), content: tab === 'activity' ? <ActivityPanel kind="employees" id={p.id} /> : null },
    ]} />
    {manager.dialogs}
  </motion.div>;
}
