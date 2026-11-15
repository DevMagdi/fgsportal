import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import { useI18n, type MsgKey } from '../i18n';
import { formatDate } from '../lib/utils';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState, ErrorState, LoadingState } from '../components/ui/States';
import { Avatar, displayName } from '../components/ui/Avatar';

export function UnitsPage() {
  const { t } = useI18n();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['bms', 'units'],
    queryFn: () => api.units(),
  });
  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={(error as Error)?.message} onRetry={() => void refetch()} />;
  const items = data ?? [];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <PageHeader title={t('units')} subtitle={`${items.length}`} />
      {items.length === 0 ? <Card><EmptyState /></Card> : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((u) => (
            <Link key={u.id} to={`/units/${u.id}`}>
              <Card className="h-full p-5 transition hover:shadow-lift">
                <div className="flex items-start justify-between">
                  <h3 className="text-base font-semibold text-slate-900">{u.name}</h3>
                  <Badge tone={u.is_active ? 'success' : 'neutral'}>{u.is_active ? 'Active' : 'Inactive'}</Badge>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-slate-500">{u.description || '—'}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-2">
                    <Avatar name={displayName(u.director)} size="sm" />
                    {displayName(u.director)}
                  </span>
                  <span className="tnum">{u.headcount ?? 0} {t('headcount').toLowerCase()}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export function UnitShowPage() {
  const { id } = useParams();
  const { t, lang } = useI18n();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['bms', 'unit', id],
    queryFn: () => api.unit(id!),
    enabled: Boolean(id),
  });
  if (isLoading) return <LoadingState />;
  if (isError || !data) return <ErrorState message={(error as Error)?.message} onRetry={() => void refetch()} />;
  const u = data;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <PageHeader title={u.name} subtitle={u.description ?? undefined} />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="space-y-3 p-5 text-sm">
          <Row label={t('director')} value={displayName(u.director)} />
          <Row label={t('headcount')} value={String(u.headcount ?? '—')} />
          <Row label={t('services')} value={(u.services ?? []).join(', ') || '—'} />
        </Card>
        <Card className="lg:col-span-2 p-5">
          <h3 className="text-sm font-semibold text-slate-900">{t('members')}</h3>
          <ul className="mt-3 space-y-2">
            {(u.users ?? []).map((m) => (
              <li key={m.id} className="flex items-center gap-2 text-sm">
                <Avatar name={displayName(m)} size="sm" />
                {displayName(m)}
              </li>
            ))}
            {(u.users ?? []).length === 0 && <p className="text-sm text-slate-400">{t('noData')}</p>}
          </ul>
        </Card>
      </div>
      <Card>
        <div className="border-b border-slate-100 px-5 py-4 text-sm font-semibold">{t('plans')}</div>
        <ul className="divide-y divide-slate-100">
          {(u.weeklyPlans ?? []).map((p) => (
            <li key={p.id}>
              <Link to={`/plans/${p.id}`} className="flex items-center justify-between px-5 py-3 text-sm hover:bg-slate-50">
                <span>{t('weekOf')} {formatDate(p.week_start, lang)}</span>
                <Badge tone={p.status === 'submitted' ? 'accent' : 'neutral'}>{t(p.status as MsgKey)}</Badge>
              </Link>
            </li>
          ))}
          {(u.weeklyPlans ?? []).length === 0 && <EmptyState />}
        </ul>
      </Card>
    </motion.div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-800">{value}</span>
    </div>
  );
}
