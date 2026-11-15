import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import { useAuth } from '../auth/AuthContext';
import { useI18n, type MsgKey } from '../i18n';
import { formatDate, formatMoney } from '../lib/utils';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState, ErrorState, LoadingState } from '../components/ui/States';
import { displayName } from '../components/ui/Avatar';

const procTone: Record<string, string> = { submitted: 'warn', approved: 'success', rejected: 'danger' };
const eventTone: Record<string, string> = { submitted: 'neutral', planning: 'brand', ready: 'accent', completed: 'success', cancelled: 'danger' };

export function DevelopmentPage() {
  const { t, lang } = useI18n();
  const { lookups } = useAuth();
  const [unit, setUnit] = useState('');
  const params = useMemo(() => ({ business_unit_id: unit || undefined }), [unit]);
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['bms', 'development', params],
    queryFn: () => api.development(params),
  });
  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={(error as Error)?.message} onRetry={() => void refetch()} />;
  const items = data ?? [];
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <PageHeader title={t('development')} />
      <select value={unit} onChange={(e) => setUnit(e.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm">
        <option value="">{t('allUnits')}</option>
        {lookups?.units.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
      </select>
      <Card>
        {items.length === 0 ? <EmptyState /> : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-[11px] uppercase tracking-wide text-slate-400">
                <th className="px-5 py-2.5 font-medium">{t('development')}</th>
                <th className="px-5 py-2.5 font-medium">{t('itemType')}</th>
                <th className="px-5 py-2.5 font-medium">{t('unit')}</th>
                <th className="px-5 py-2.5 font-medium">{t('status')}</th>
                <th className="px-5 py-2.5 font-medium">{t('dueDate')}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((d) => (
                <tr key={d.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-3">
                    <div className="font-medium text-slate-800">{d.title}</div>
                    <div className="text-xs text-slate-400">{displayName(d.owner)}</div>
                  </td>
                  <td className="px-5 py-3"><Badge>{d.item_type ? t(d.item_type as MsgKey) : '—'}</Badge></td>
                  <td className="px-5 py-3">{d.unit?.name ?? '—'}</td>
                  <td className="px-5 py-3"><Badge tone={d.status === 'completed' ? 'success' : d.status === 'cancelled' ? 'danger' : 'brand'}>{d.status ? t(d.status as MsgKey) : '—'}</Badge></td>
                  <td className="px-5 py-3 text-slate-500">{formatDate(d.due_date, lang)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </motion.div>
  );
}

export function ProcurementPage() {
  const { t, lang } = useI18n();
  const { data, isLoading, isError, error, refetch } = useQuery({ queryKey: ['bms', 'procurement'], queryFn: () => api.procurement() });
  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={(error as Error)?.message} onRetry={() => void refetch()} />;
  const items = data ?? [];
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <PageHeader title={t('procurement')} subtitle={`${items.length}`} />
      {items.length === 0 ? <Card><EmptyState /></Card> : (
        <div className="space-y-3">
          {items.map((p) => (
            <Card key={p.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-mono text-[11px] text-slate-400">{p.reference}</div>
                  <h3 className="text-base font-semibold text-slate-900">{p.item}</h3>
                  <p className="mt-1 text-sm text-slate-500">{p.purpose}</p>
                  <p className="mt-2 text-xs text-slate-400">{p.unit?.name} · {t('quantity')} {p.quantity} · {displayName(p.requester)}</p>
                </div>
                <Badge tone={procTone[p.status] ?? 'neutral'}>{t(p.status as MsgKey)}</Badge>
              </div>
              {(p.quotations ?? []).length > 0 && (
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {p.quotations!.map((q) => (
                    <li key={q.id} className="rounded-lg bg-slate-50 px-3 py-2 text-sm">
                      <div className="font-medium">{q.vendor}</div>
                      <div className="tnum text-xs text-slate-500">{formatMoney(q.amount, q.currency, lang)}</div>
                    </li>
                  ))}
                </ul>
              )}
              {p.finance_comment && <p className="mt-3 text-xs text-slate-500">{t('finance')}: {p.finance_comment}</p>}
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export function EventsPage() {
  const { t, lang } = useI18n();
  const eventsQ = useQuery({ queryKey: ['bms', 'events'], queryFn: () => api.events() });
  const procQ = useQuery({ queryKey: ['bms', 'procedures'], queryFn: () => api.procedures() });
  if (eventsQ.isLoading) return <LoadingState />;
  if (eventsQ.isError) return <ErrorState message={(eventsQ.error as Error)?.message} onRetry={() => void eventsQ.refetch()} />;
  const items = eventsQ.data ?? [];
  const procedures = procQ.data ?? [];
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <PageHeader title={t('events')} />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {items.length === 0 ? <Card><EmptyState /></Card> : items.map((e) => (
            <Card key={e.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{e.title}</h3>
                  <p className="mt-1 text-xs text-slate-400">{formatDate(e.event_date, lang)} · {e.venue} · {e.unit?.name}</p>
                </div>
                <Badge tone={eventTone[e.status ?? ''] ?? 'neutral'}>{e.status ? t(e.status as MsgKey) : '—'}</Badge>
              </div>
              {(e.checklist ?? []).length > 0 && (
                <ul className="mt-4 grid gap-1 sm:grid-cols-2">
                  {e.checklist!.map((c) => (
                    <li key={c.id} className="flex items-center justify-between rounded-md bg-slate-50 px-2.5 py-1.5 text-xs">
                      <span>{c.title}</span>
                      <span className="text-slate-400">{c.status}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          ))}
        </div>
        <Card>
          <div className="border-b border-slate-100 px-5 py-4 text-sm font-semibold">{t('procedures')}</div>
          <ul className="divide-y divide-slate-100">
            {procedures.map((p) => (
              <li key={p.id} className="px-5 py-3">
                <div className="text-sm font-medium text-slate-800">{p.title}</div>
                <p className="mt-1 text-xs leading-5 text-slate-500">{p.content}</p>
              </li>
            ))}
            {procedures.length === 0 && <EmptyState />}
          </ul>
        </Card>
      </div>
    </motion.div>
  );
}

export function DocumentsPage() {
  const { t, lang } = useI18n();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const params = useMemo(() => ({ search: search || undefined, category: category || undefined }), [search, category]);
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['bms', 'documents', params],
    queryFn: () => api.documents(params),
  });
  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={(error as Error)?.message} onRetry={() => void refetch()} />;
  const items = data ?? [];
  const cats = Array.from(new Set(items.map((d) => d.category))).filter(Boolean);
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <PageHeader title={t('documents')} />
      <div className="flex flex-wrap gap-2">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('search')} className="h-9 w-56 rounded-lg border border-slate-200 px-3 text-sm" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm">
          <option value="">{t('category')}</option>
          {cats.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <Card>
        {items.length === 0 ? <EmptyState /> : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-[11px] uppercase tracking-wide text-slate-400">
                <th className="px-5 py-2.5 font-medium">{t('documents')}</th>
                <th className="px-5 py-2.5 font-medium">{t('category')}</th>
                <th className="px-5 py-2.5 font-medium">{t('version')}</th>
                <th className="px-5 py-2.5 font-medium">{t('unit')}</th>
                <th className="px-5 py-2.5 font-medium">{t('updated')}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((d) => (
                <tr key={d.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-3">
                    {api.demo ? (
                      <span className="font-medium text-slate-800">{d.name}</span>
                    ) : (
                      <a href={api.documentDownloadUrl(d.id)} className="font-medium text-brand-700 hover:underline">{d.name}</a>
                    )}
                    <div className="text-xs text-slate-400">{d.original_name} · {displayName(d.uploader)}</div>
                  </td>
                  <td className="px-5 py-3"><Badge>{d.category}</Badge></td>
                  <td className="px-5 py-3 tnum">v{d.version}</td>
                  <td className="px-5 py-3">{d.unit?.name ?? '—'}</td>
                  <td className="px-5 py-3 text-slate-500">{formatDate(d.created_at, lang)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </motion.div>
  );
}
