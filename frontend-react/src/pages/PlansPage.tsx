import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import { useI18n, type MsgKey } from '../i18n';
import { formatDate } from '../lib/utils';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState, ErrorState, LoadingState } from '../components/ui/States';
import { displayName } from '../components/ui/Avatar';

const taskTone: Record<string, string> = {
  achieved: 'success',
  in_progress: 'brand',
  not_done: 'neutral',
};

export function PlansPage() {
  const { t, lang } = useI18n();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['bms', 'plans'],
    queryFn: () => api.weeklyPlans(),
  });
  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={(error as Error)?.message} onRetry={() => void refetch()} />;
  const items = data ?? [];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <PageHeader title={t('plans')} />
      <Card>
        {items.length === 0 ? <EmptyState /> : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-[11px] uppercase tracking-wide text-slate-400">
                <th className="px-5 py-2.5 font-medium">{t('weekStart')}</th>
                <th className="px-5 py-2.5 font-medium">{t('unit')}</th>
                <th className="px-5 py-2.5 font-medium">{t('status')}</th>
                <th className="px-5 py-2.5 font-medium">{t('tasks')}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70">
                  <td className="px-5 py-3">
                    <Link to={`/plans/${p.id}`} className="font-medium text-slate-800 hover:text-brand-700">
                      {formatDate(p.week_start, lang)}
                    </Link>
                  </td>
                  <td className="px-5 py-3">{p.unit?.name ?? '—'}</td>
                  <td className="px-5 py-3"><Badge tone={p.status === 'submitted' ? 'accent' : 'neutral'}>{t(p.status as MsgKey)}</Badge></td>
                  <td className="px-5 py-3 tnum">{p.tasks?.length ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </motion.div>
  );
}

export function PlanShowPage() {
  const { id } = useParams();
  const { t, lang } = useI18n();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['bms', 'plan', id],
    queryFn: () => api.weeklyPlan(id!),
    enabled: Boolean(id),
  });
  if (isLoading) return <LoadingState />;
  if (isError || !data) return <ErrorState message={(error as Error)?.message} onRetry={() => void refetch()} />;
  const p = data;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <PageHeader
        eyebrow={p.unit?.name}
        title={`${t('weekOf')} ${formatDate(p.week_start, lang)}`}
        actions={<Badge tone={p.status === 'submitted' ? 'accent' : 'neutral'}>{t(p.status as MsgKey)}</Badge>}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="text-sm font-semibold">{t('objectives')}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{p.objectives || '—'}</p>
        </Card>
        <Card className="p-5">
          <h3 className="text-sm font-semibold">{t('nextWeek')}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{p.next_week_plan || '—'}</p>
        </Card>
      </div>
      <Card>
        <div className="border-b border-slate-100 px-5 py-4 text-sm font-semibold">{t('tasks')}</div>
        <ul className="divide-y divide-slate-100">
          {(p.tasks ?? []).map((task) => (
            <li key={task.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
              <div>
                <div className="text-sm font-medium text-slate-800">{task.title}</div>
                <div className="text-xs text-slate-400">{displayName(task.owner)} · {t('due')} {formatDate(task.due_date, lang)}</div>
                {task.blockers && <div className="mt-1 text-xs text-amber-700">{task.blockers}</div>}
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full bg-brand-600" style={{ width: `${task.progress ?? 0}%` }} />
                </div>
                <Badge tone={taskTone[task.status] ?? 'neutral'}>{t(task.status as MsgKey)}</Badge>
              </div>
            </li>
          ))}
        </ul>
      </Card>
      {(p.supportRequests ?? []).length > 0 && (
        <Card className="p-5">
          <h3 className="text-sm font-semibold">{t('support')}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {p.supportRequests!.map((s) => (
              <li key={s.id} className="flex justify-between">
                <span>{s.title}</span>
                <Badge>{s.status}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </motion.div>
  );
}

export function MyTasksPage() {
  const { t, lang } = useI18n();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['bms', 'my-tasks'],
    queryFn: () => api.myTasks(),
  });
  if (isLoading) return <LoadingState />;
  if (isError || !data) return <ErrorState message={(error as Error)?.message} onRetry={() => void refetch()} />;
  const tasks = Array.isArray(data) ? data : data.data ?? [];
  const summary = Array.isArray(data) ? null : data.summary;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <PageHeader title={t('myTasks')} />
      {summary && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
          {(['total', 'achieved', 'inProgress', 'notDone', 'overdue', 'blocked'] as const).map((k) => {
            const keyMap = { total: summary.total, achieved: summary.achieved, inProgress: summary.in_progress, notDone: summary.not_done, overdue: summary.overdue, blocked: summary.blocked };
            return (
              <Card key={k} className="px-4 py-3">
                <div className="text-[11px] uppercase tracking-wide text-slate-400">{t(k)}</div>
                <div className="tnum mt-1 text-xl font-semibold">{keyMap[k]}</div>
              </Card>
            );
          })}
        </div>
      )}
      <Card>
        {tasks.length === 0 ? <EmptyState /> : (
          <ul className="divide-y divide-slate-100">
            {tasks.map((task) => (
              <li key={task.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                <div>
                  <div className="text-sm font-medium text-slate-800">{task.title}</div>
                  <div className="text-xs text-slate-400">{task.unit?.name} · {t('due')} {formatDate(task.due_date, lang)}</div>
                </div>
                <Badge tone={taskTone[task.status] ?? 'neutral'}>{t(task.status as MsgKey)}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </motion.div>
  );
}
