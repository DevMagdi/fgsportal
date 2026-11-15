import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarCheck, CheckCircle2, ClipboardList, Pencil, Plus, Send, Trash2 } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../auth/AuthContext';
import { useI18n } from '../i18n';
import type { UnitTask, WeeklyPlan } from '../lib/types';
import { formatCalendarDate } from '../lib/utils';
import { useEntityManager } from '../components/crud/useEntityManager';
import { displayName } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { DataTable, type Column } from '../components/ui/DataTable';
import { Breadcrumb, MetricCards, SectionTitle, StatusBadge } from '../components/ui/PageParts';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState, ErrorState, LoadingState } from '../components/ui/States';
import { useToast } from '../components/ui/Toast';

export function PlansPage() {
  const { t, lang } = useI18n();
  const query = useQuery({ queryKey: ['bms', 'plans'], queryFn: () => api.weeklyPlans() });
  const manager = useEntityManager('plans');
  if (query.isLoading) return <LoadingState />;
  if (query.isError) return <ErrorState message={(query.error as Error)?.message} onRetry={() => void query.refetch()} />;
  const items = query.data ?? [];
  const columns: Column<WeeklyPlan>[] = [
    { key: 'week', label: t('weekStart'), render: (p) => <div><Link to={`/plans/${p.id}`} className="font-semibold text-slate-800 hover:underline">{t('weekOf')} {formatCalendarDate(p.week_start, lang)}</Link><p className="mt-1 max-w-[250px] truncate text-xs text-slate-400">{p.objectives || '—'}</p></div> },
    { key: 'unit', label: t('unit'), render: (p) => p.unit?.name ?? '—' },
    { key: 'tasks', label: t('tasks'), render: (p) => p.tasks?.length ?? 0 },
    { key: 'status', label: t('status'), render: (p) => <StatusBadge status={p.status} /> },
  ];
  return <div className="space-y-4"><PageHeader eyebrow={t('grpExecution')} title={t('plans')} subtitle={lang === 'ar' ? 'حوّل الأولويات الأسبوعية إلى تقدم ملموس.' : 'Turn weekly priorities into meaningful progress.'} actions={manager.canManage && <Button onClick={() => manager.openCreate()}><Plus size={16} />{t('newPlan')}</Button>} />
    <MetricCards items={[
      { label: t('plans'), value: items.length, hint: t('allTime'), icon: CalendarCheck },
      { label: t('draft'), value: items.filter((p) => p.status === 'draft').length, hint: t('plans'), icon: ClipboardList, tone: 'amber' },
      { label: t('submitted'), value: items.filter((p) => p.status === 'submitted').length, hint: t('plans'), icon: CheckCircle2, tone: 'teal' },
      { label: t('tasks'), value: items.reduce((sum, p) => sum + (p.tasks?.length ?? 0), 0), hint: t('allTime'), icon: ClipboardList },
    ]} />
    <DataTable items={items} columns={columns} title={t('allRecords')} getSearchText={(p) => `${p.week_start} ${p.unit?.name ?? ''} ${p.objectives ?? ''}`} getStatus={(p) => p.status} getUnit={(p) => p.unit?.name} onCreate={manager.canManage ? () => manager.openCreate() : undefined} createLabel={t('newPlan')}
      onEdit={manager.canManage ? manager.openEdit : undefined} canEdit={(p) => p.status === 'draft'} onDelete={manager.canManage ? (p) => manager.openDelete(p, `${t('weekOf')} ${formatCalendarDate(p.week_start, lang)}`) : undefined} onBulkDelete={manager.canManage ? manager.openBulkDelete : undefined} />
    {manager.dialogs}</div>;
}

export function PlanShowPage() {
  const { id } = useParams(); const navigate = useNavigate(); const { t, lang } = useI18n(); const toast = useToast(); const client = useQueryClient();
  const query = useQuery({ queryKey: ['bms', 'plan', id], queryFn: () => api.weeklyPlan(id!), enabled: Boolean(id) });
  const planManager = useEntityManager('plans', { onDeleted: () => navigate('/plans') }); const taskManager = useEntityManager('tasks');
  const submit = useMutation({ mutationFn: (planId: number) => api.submitPlan(planId), onSuccess: () => { toast.success(t('planSubmitted')); void client.invalidateQueries({ queryKey: ['bms'] }); }, onError: (error) => toast.error(error instanceof Error ? error.message : t('saveError')) });
  if (query.isLoading) return <LoadingState />;
  if (query.isError || !query.data) return <ErrorState message={(query.error as Error)?.message} onRetry={() => void query.refetch()} />;
  const p = query.data; const draft = p.status === 'draft';
  const columns: Column<UnitTask>[] = [
    { key: 'title', label: t('tasks'), render: (task) => <div><div className="font-semibold text-slate-800">{task.title}</div><p className="mt-1 max-w-[260px] truncate text-xs text-slate-400">{task.blockers || task.description || '—'}</p></div> },
    { key: 'owner', label: t('owner'), render: (task) => displayName(task.owner) },
    { key: 'due', label: t('dueDate'), render: (task) => formatCalendarDate(task.due_date, lang) },
    { key: 'progress', label: t('progress'), render: (task) => <span className="tnum">{task.progress ?? 0}%</span> },
    { key: 'status', label: t('status'), render: (task) => <StatusBadge status={task.status} /> },
  ];
  return <div className="space-y-5"><Breadcrumb items={[{ label: t('plans'), to: '/plans' }, { label: `${t('weekOf')} ${formatCalendarDate(p.week_start, lang)}` }]} />
    <div className="flex flex-wrap items-start justify-between gap-4"><div><div className="flex items-center gap-3"><h1 className="text-2xl font-semibold tracking-tight text-slate-900">{t('weekOf')} {formatCalendarDate(p.week_start, lang)}</h1><StatusBadge status={p.status} /></div><p className="mt-2 text-sm text-slate-500">{p.unit?.name ?? '—'}</p></div><div className="flex flex-wrap gap-2">{planManager.canManage && draft && <><Button variant="secondary" onClick={() => planManager.openEdit(p)}><Pencil size={15} />{t('edit')}</Button><Button onClick={() => submit.mutate(p.id)} disabled={submit.isPending}><Send size={15} />{t('submitPlan')}</Button></>}{planManager.canManage && <Button variant="secondary" className="text-brand-600" onClick={() => planManager.openDelete(p, `${t('weekOf')} ${formatCalendarDate(p.week_start, lang)}`)}><Trash2 size={15} />{t('remove')}</Button>}</div></div>
    {!draft && <p className="rounded-lg border border-brand-100 bg-brand-50/70 px-4 py-3 text-xs text-brand-700">{t('submittedReadOnly')}</p>}
    <div className="grid gap-4 lg:grid-cols-2"><Card><SectionTitle title={t('objectives')} /><p className="p-5 text-sm leading-6 text-slate-600">{p.objectives || '—'}</p></Card><Card><SectionTitle title={t('nextWeek')} /><p className="p-5 text-sm leading-6 text-slate-600">{p.next_week_plan || '—'}</p></Card></div>
    <DataTable items={p.tasks ?? []} columns={columns} title={t('tasks')} getSearchText={(task) => `${task.title} ${task.description ?? ''} ${displayName(task.owner)}`} getStatus={(task) => task.status} extra={taskManager.canManage && draft && <Button size="sm" onClick={() => taskManager.openCreate({ weekly_plan_id: p.id })}><Plus size={14} />{t('addTask')}</Button>}
      onCreate={taskManager.canManage && draft ? () => taskManager.openCreate({ weekly_plan_id: p.id }) : undefined} createLabel={t('addTask')} onEdit={taskManager.canManage ? taskManager.openEdit : undefined} onDelete={taskManager.canManage ? (task) => taskManager.openDelete(task, task.title) : undefined} onBulkDelete={taskManager.canManage ? taskManager.openBulkDelete : undefined} />
    {(p.supportRequests ?? []).length > 0 && <Card><SectionTitle title={t('support')} /><ul className="divide-y divide-slate-100">{p.supportRequests!.map((s) => <li key={s.id} className="flex justify-between px-5 py-4 text-sm"><span className="font-medium text-slate-700">{s.title}</span><StatusBadge status={s.status} /></li>)}</ul></Card>}
    {planManager.dialogs}{taskManager.dialogs}
  </div>;
}

export function MyTasksPage() {
  const { t, lang } = useI18n(); const { lookups } = useAuth();
  const query = useQuery({ queryKey: ['bms', 'my-tasks'], queryFn: () => api.myTasks() }); const manager = useEntityManager('tasks');
  if (query.isLoading) return <LoadingState />;
  if (query.isError || !query.data) return <ErrorState message={(query.error as Error)?.message} onRetry={() => void query.refetch()} />;
  const tasks = Array.isArray(query.data) ? query.data : query.data.data ?? []; const summary = Array.isArray(query.data) ? null : query.data.summary;
  const columns: Column<UnitTask>[] = [
    { key: 'title', label: t('tasks'), render: (task) => <div><div className="font-semibold text-slate-800">{task.title}</div><p className="mt-1 text-xs text-slate-400">{task.blockers || task.description || '—'}</p></div> },
    { key: 'unit', label: t('unit'), render: (task) => task.unit?.name ?? '—' },
    { key: 'due', label: t('dueDate'), render: (task) => formatCalendarDate(task.due_date, lang) },
    { key: 'progress', label: t('progress'), render: (task) => `${task.progress ?? 0}%` },
    { key: 'status', label: t('status'), render: (task) => <StatusBadge status={task.status} /> },
  ];
  return <div className="space-y-4"><PageHeader eyebrow={t('grpExecution')} title={t('myTasks')} subtitle={lang === 'ar' ? 'ركز على أولوياتك وما يحتاج إلى انتباهك.' : 'Your priorities, progress, and next steps in one place.'} actions={manager.canManage && <Button onClick={() => manager.openCreate()}><Plus size={16} />{t('addTask')}</Button>} />
    {summary && <MetricCards items={[
      { label: t('total'), value: summary.total, hint: t('tasks'), icon: ClipboardList }, { label: t('inProgress'), value: summary.in_progress, hint: t('tasks'), icon: CalendarCheck }, { label: t('achieved'), value: summary.achieved, hint: t('tasks'), icon: CheckCircle2, tone: 'teal' }, { label: t('overdue'), value: summary.overdue, hint: t('tasks'), icon: ClipboardList, tone: 'rose' },
    ]} />}
    <DataTable items={tasks} columns={columns} title={t('allRecords')} getSearchText={(task) => `${task.title} ${task.unit?.name ?? ''}`} getStatus={(task) => task.status} getUnit={(task) => task.unit?.name}
      onEdit={manager.openEdit} canEdit={(task) => manager.canManage || task.owner_id === lookups?.current_user.id} onDelete={manager.canManage ? (task) => manager.openDelete(task, task.title) : undefined} onBulkDelete={manager.canManage ? manager.openBulkDelete : undefined} />{manager.dialogs}
  </div>;
}
