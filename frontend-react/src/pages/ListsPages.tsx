import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import { useI18n } from '../i18n';
import { formatDate, formatDateTime } from '../lib/utils';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState, ErrorState, LoadingState } from '../components/ui/States';
import { displayName } from '../components/ui/Avatar';

export function LeadsPage() {
  const { t, lang } = useI18n();
  const { data, isLoading, isError, error, refetch } = useQuery({ queryKey: ['bms', 'leads'], queryFn: () => api.leads() });
  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={(error as Error)?.message} onRetry={() => void refetch()} />;
  const items = data ?? [];
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <PageHeader title={t('leads')} />
      <Card>
        {items.length === 0 ? <EmptyState /> : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-[11px] uppercase tracking-wide text-slate-400">
                <th className="px-5 py-2.5 font-medium">{t('leads')}</th>
                <th className="px-5 py-2.5 font-medium">{t('stage')}</th>
                <th className="px-5 py-2.5 font-medium">{t('unit')}</th>
                <th className="px-5 py-2.5 font-medium">{t('owner')}</th>
                <th className="px-5 py-2.5 font-medium">{t('lastContact')}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((l) => (
                <tr key={l.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-3">
                    <div className="font-medium text-slate-800">{l.name}</div>
                    <div className="text-xs text-slate-400">{l.sector} · {l.contact_name}</div>
                  </td>
                  <td className="px-5 py-3"><Badge>{l.stage ?? '—'}</Badge></td>
                  <td className="px-5 py-3">{l.unit?.name ?? '—'}</td>
                  <td className="px-5 py-3">{displayName(l.owner)}</td>
                  <td className="px-5 py-3 text-slate-500">{formatDate(l.last_contacted_at, lang)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </motion.div>
  );
}

export function ProductsPage() {
  const { t } = useI18n();
  const { data, isLoading, isError, error, refetch } = useQuery({ queryKey: ['bms', 'products'], queryFn: () => api.products() });
  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={(error as Error)?.message} onRetry={() => void refetch()} />;
  const items = data ?? [];
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <PageHeader title={t('products')} />
      <div className="grid gap-3 md:grid-cols-2">
        {items.map((p) => (
          <Card key={p.id} className="p-5">
            <div className="flex items-start justify-between">
              <h3 className="text-base font-semibold text-slate-900">{p.product_name}</h3>
              {p.currentPhase && <Badge tone="brand">{p.currentPhase.name ?? p.currentPhase.title}</Badge>}
            </div>
            <p className="mt-2 text-sm text-slate-500">{p.description || '—'}</p>
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs text-slate-400">
                <span>{t('phase')}</span>
                <span className="tnum">{p.currentPhase?.progress ?? 0}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full bg-teal-500" style={{ width: `${p.currentPhase?.progress ?? 0}%` }} />
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">{displayName(p.owner)} · {(p.businessUnits ?? []).map((u) => u.name).join(', ')}</p>
          </Card>
        ))}
        {items.length === 0 && <Card><EmptyState /></Card>}
      </div>
    </motion.div>
  );
}

export function MeetingsPage() {
  const { t, lang } = useI18n();
  const { data, isLoading, isError, error, refetch } = useQuery({ queryKey: ['bms', 'meetings'], queryFn: () => api.meetings() });
  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={(error as Error)?.message} onRetry={() => void refetch()} />;
  const items = data ?? [];
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <PageHeader title={t('meetings')} />
      <Card>
        {items.length === 0 ? <EmptyState /> : (
          <ul className="divide-y divide-slate-100">
            {items.map((m) => (
              <li key={m.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <div className="text-sm font-medium text-slate-800">{m.title}</div>
                  <div className="text-xs text-slate-400">{formatDateTime(m.starts_at, lang)} · {m.location} · {m.unit?.name}</div>
                </div>
                <Badge>{m.status ?? '—'}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </motion.div>
  );
}

export function NoAccessPage() {
  const { t } = useI18n();
  return (
    <div className="grid min-h-[50vh] place-items-center">
      <div className="text-center">
        <h1 className="text-lg font-semibold text-slate-900">{t('noAccess')}</h1>
        <p className="mt-1 text-sm text-slate-500">{t('noAccessBody')}</p>
        <a href="/dashboard" className="mt-4 inline-block text-sm font-medium text-brand-600">{t('backHome')}</a>
      </div>
    </div>
  );
}
