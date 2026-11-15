import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import { useAuth } from '../auth/AuthContext';
import { useI18n } from '../i18n';
import { formatDate } from '../lib/utils';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState, ErrorState, LoadingState } from '../components/ui/States';

export function EmployeesPage() {
  const { t } = useI18n();
  const { lookups } = useAuth();
  const [search, setSearch] = useState('');
  const [unit, setUnit] = useState('');
  const params = useMemo(() => ({ search: search || undefined, business_unit_id: unit || undefined }), [search, unit]);
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['bms', 'directory', params],
    queryFn: () => api.directory(params),
  });
  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={(error as Error)?.message} onRetry={() => void refetch()} />;
  const items = data ?? [];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <PageHeader title={t('employees')} subtitle={`${items.length}`} />
      <div className="flex flex-wrap gap-2">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('search')} className="h-9 w-56 rounded-lg border border-slate-200 bg-white px-3 text-sm" />
        <select value={unit} onChange={(e) => setUnit(e.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm">
          <option value="">{t('allUnits')}</option>
          {lookups?.units.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
      </div>
      {items.length === 0 ? <Card><EmptyState /></Card> : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((p) => (
            <Link key={p.id} to={`/employees/${p.id}`}>
              <Card className="flex h-full items-start gap-3 p-4 transition hover:shadow-lift">
                <Avatar name={p.name} src={p.photo_url} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate text-sm font-semibold text-slate-900">{p.name}</h3>
                    <Badge tone={p.active ? 'success' : 'neutral'}>{p.active ? t('active') : t('inactive')}</Badge>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-slate-500">{p.job_title || p.username}</p>
                  <p className="mt-2 truncate text-xs text-slate-400">{(p.units ?? p.business_units ?? []).map((u) => u.name).join(' · ') || '—'}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export function EmployeeShowPage() {
  const { id } = useParams();
  const { t, lang } = useI18n();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['bms', 'employee', id],
    queryFn: () => api.employee(id!),
    enabled: Boolean(id),
  });
  if (isLoading) return <LoadingState />;
  if (isError || !data) return <ErrorState message={(error as Error)?.message} onRetry={() => void refetch()} />;
  const p = data;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <PageHeader
        title={p.name}
        subtitle={p.job_title ?? p.username}
        actions={<Badge tone={p.active ? 'success' : 'neutral'}>{p.active ? t('active') : t('inactive')}</Badge>}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="space-y-3 p-5 text-sm lg:col-span-2">
          <Row label={t('email')} value={p.email ?? '—'} />
          <Row label={t('jobTitle')} value={p.job_title ?? '—'} />
          <Row label={t('manager')} value={typeof p.manager === 'string' ? p.manager : '—'} />
          <Row label={t('hiringDate')} value={formatDate(p.hiring_date, lang)} />
          <Row label={t('units')} value={(p.units ?? p.business_units ?? []).map((u) => u.name).join(', ') || '—'} />
        </Card>
        <Card className="p-5">
          <h3 className="text-sm font-semibold">{t('roles')}</h3>
          <ul className="mt-3 space-y-2">
            {(p.roles ?? []).map((r) => (
              <li key={`${r.id}-${r.business_unit_id}`} className="flex items-center justify-between text-sm">
                <span>{r.name}</span>
                <Badge>{r.business_unit_id ? t('unit') : t('global')}</Badge>
              </li>
            ))}
            {(p.roles ?? []).length === 0 && <p className="text-sm text-slate-400">{t('noData')}</p>}
          </ul>
        </Card>
      </div>
      <Card>
        <div className="border-b border-slate-100 px-5 py-4 text-sm font-semibold">{t('certificates')}</div>
        {(p.certificates ?? []).length === 0 ? <EmptyState /> : (
          <ul className="divide-y divide-slate-100">
            {p.certificates!.map((c) => (
              <li key={c.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <div>
                  <div className="font-medium text-slate-800">{c.name}</div>
                  <div className="text-xs text-slate-400">{c.issuer} · {formatDate(c.issued_at, lang)}</div>
                </div>
                {c.unit && <Badge>{c.unit.name}</Badge>}
              </li>
            ))}
          </ul>
        )}
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
