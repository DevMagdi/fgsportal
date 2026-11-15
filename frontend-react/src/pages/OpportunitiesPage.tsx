import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { LayoutGrid, List } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../auth/AuthContext';
import { useI18n, type MsgKey } from '../i18n';
import { GO_NO_GO, OPEN_STAGES, OPPORTUNITY_STAGES, stageTone } from '../lib/catalog';
import { formatDate, formatMoney, cn } from '../lib/utils';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState, ErrorState, LoadingState } from '../components/ui/States';
import { displayName } from '../components/ui/Avatar';
import type { Opportunity } from '../lib/types';

export function OpportunitiesPage() {
  const { t, lang } = useI18n();
  const { lookups } = useAuth();
  const [params, setParams] = useSearchParams();
  const [view, setView] = useState<'list' | 'board'>('board');

  const query = useMemo(() => ({
    stage: params.get('stage') || undefined,
    go_no_go: params.get('go_no_go') || undefined,
    business_unit_id: params.get('business_unit_id') || undefined,
    alert: params.get('alert') || undefined,
  }), [params]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['bms', 'opportunities', query],
    queryFn: () => api.opportunities(query),
  });

  function set(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next);
  }

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={(error as Error)?.message} onRetry={() => void refetch()} />;
  const items = data ?? [];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <PageHeader
        title={t('opportunities')}
        subtitle={`${items.length} · ${t('pipeline')}`}
        actions={
          <div className="flex rounded-lg border border-slate-200 bg-white p-0.5">
            <button onClick={() => setView('board')} className={cn('rounded-md px-2.5 py-1.5 text-xs font-medium', view === 'board' ? 'bg-slate-900 text-white' : 'text-slate-500')}>
              <LayoutGrid size={14} className="inline me-1" />{t('board')}
            </button>
            <button onClick={() => setView('list')} className={cn('rounded-md px-2.5 py-1.5 text-xs font-medium', view === 'list' ? 'bg-slate-900 text-white' : 'text-slate-500')}>
              <List size={14} className="inline me-1" />{t('list')}
            </button>
          </div>
        }
      />

      <div className="flex flex-wrap gap-2">
        <select className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm" value={query.stage ?? ''} onChange={(e) => set('stage', e.target.value)}>
          <option value="">{t('allStages')}</option>
          {OPPORTUNITY_STAGES.map((s) => <option key={s} value={s}>{t(s)}</option>)}
        </select>
        <select className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm" value={query.go_no_go ?? ''} onChange={(e) => set('go_no_go', e.target.value)}>
          <option value="">{t('allDecisions')}</option>
          {GO_NO_GO.map((s) => <option key={s} value={s}>{t(s as MsgKey)}</option>)}
        </select>
        <select className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm" value={query.business_unit_id ?? ''} onChange={(e) => set('business_unit_id', e.target.value)}>
          <option value="">{t('allUnits')}</option>
          {lookups?.units.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
        <select className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm" value={query.alert ?? ''} onChange={(e) => set('alert', e.target.value)}>
          <option value="">{t('alert')}: {t('none')}</option>
          <option value="delayed">{t('delayed')}</option>
          <option value="no_update">{t('noUpdate')}</option>
        </select>
      </div>

      {items.length === 0 ? <Card><EmptyState /></Card> : view === 'board' ? (
        <PipelineBoard items={items} />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-[11px] uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-2.5 font-medium">{t('reference')}</th>
                  <th className="px-5 py-2.5 font-medium">{t('opportunities')}</th>
                  <th className="px-5 py-2.5 font-medium">{t('type')}</th>
                  <th className="px-5 py-2.5 font-medium">{t('stage')}</th>
                  <th className="px-5 py-2.5 font-medium">{t('value')}</th>
                  <th className="px-5 py-2.5 font-medium">{t('owner')}</th>
                  <th className="px-5 py-2.5 font-medium">{t('close')}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((o) => (
                  <tr key={o.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70">
                    <td className="px-5 py-3 font-mono text-xs text-slate-500">{o.reference}</td>
                    <td className="px-5 py-3">
                      <Link to={`/opportunities/${o.id}`} className="font-medium text-slate-800 hover:text-brand-700">{o.title}</Link>
                      <div className="text-xs text-slate-400">{o.client_name} · {o.unit?.name ?? '—'}</div>
                    </td>
                    <td className="px-5 py-3"><Badge>{t(o.type as MsgKey)}</Badge></td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        <Badge tone={stageTone(o.stage)}>{t(o.stage as MsgKey)}</Badge>
                        {o.is_delayed && <Badge tone="danger">{t('delayed')}</Badge>}
                      </div>
                    </td>
                    <td className="px-5 py-3 tnum">{formatMoney(o.value, o.currency, lang)}</td>
                    <td className="px-5 py-3">{displayName(o.owner)}</td>
                    <td className="px-5 py-3 text-slate-500">{formatDate(o.expected_close_date, lang)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </motion.div>
  );
}

function PipelineBoard({ items }: { items: Opportunity[] }) {
  const { t, lang } = useI18n();
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {OPEN_STAGES.map((stage) => {
        const col = items.filter((o) => o.stage === stage);
        return (
          <div key={stage} className="w-[260px] shrink-0">
            <div className="mb-2 flex items-center justify-between px-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t(stage)}</span>
              <span className="tnum text-xs text-slate-400">{col.length}</span>
            </div>
            <div className="space-y-2">
              {col.map((o) => (
                <Link key={o.id} to={`/opportunities/${o.id}`}>
                  <Card className="p-3.5 transition hover:shadow-lift">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-snug text-slate-800">{o.title}</p>
                      {o.is_delayed && <Badge tone="danger">{t('delayed')}</Badge>}
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{o.client_name}</p>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{o.unit?.name ?? '—'}</span>
                      <span className="tnum text-slate-700">{formatMoney(o.value, o.currency, lang)}</span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function OpportunityShowPage() {
  const { id } = useParams();
  const { t, lang } = useI18n();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['bms', 'opportunity', id],
    queryFn: () => api.opportunity(id!),
    enabled: Boolean(id),
  });
  if (isLoading) return <LoadingState />;
  if (isError || !data) return <ErrorState message={(error as Error)?.message} onRetry={() => void refetch()} />;
  const o = data;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <PageHeader
        eyebrow={o.reference}
        title={o.title}
        subtitle={o.client_name}
        actions={<Button variant="secondary" size="sm" onClick={() => history.back()}>{t('close')}</Button>}
      />
      <div className="flex flex-wrap gap-2">
        <Badge tone={stageTone(o.stage)}>{t(o.stage as MsgKey)}</Badge>
        <Badge>{t(o.type as MsgKey)}</Badge>
        {o.go_no_go && <Badge tone={o.go_no_go === 'go' ? 'success' : o.go_no_go === 'no_go' ? 'danger' : 'warn'}>{t(o.go_no_go as MsgKey)}</Badge>}
        {o.is_delayed && <Badge tone="danger">{t('delayed')}</Badge>}
        {o.has_no_update && <Badge tone="warn">{t('noUpdate')}</Badge>}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 space-y-4 p-5">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <Field label={t('value')} value={formatMoney(o.value, o.currency, lang)} />
            <Field label={t('unit')} value={o.unit?.name} />
            <Field label={t('product')} value={o.product?.product_name} />
            <Field label={t('owner')} value={displayName(o.owner)} />
            <Field label={t('close')} value={formatDate(o.expected_close_date, lang)} />
            <Field label={t('updated')} value={formatDate(o.last_update_at, lang)} />
            <Field label={t('sector')} value={o.sector} />
            <Field label={t('contact')} value={[o.contact_name, o.contact_email].filter(Boolean).join(' · ')} />
          </dl>
          {o.notes && <p className="text-sm leading-6 text-slate-600">{o.notes}</p>}
        </Card>
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-900">{t('history')}</h3>
          <ol className="mt-4 space-y-3">
            {(o.history ?? []).map((h) => (
              <li key={h.id} className="border-s-2 border-slate-200 ps-3 text-sm">
                <div className="font-medium text-slate-800">{h.from_stage ? `${t(h.from_stage as MsgKey)} → ${t(h.to_stage as MsgKey)}` : t(h.to_stage as MsgKey)}</div>
                <div className="text-xs text-slate-400">{displayName(h.user)} · {formatDate(h.created_at, lang)}</div>
                {h.note && <p className="mt-1 text-xs text-slate-500">{h.note}</p>}
              </li>
            ))}
            {(o.history ?? []).length === 0 && <p className="text-sm text-slate-400">{t('noData')}</p>}
          </ol>
        </Card>
      </div>
    </motion.div>
  );
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-1 text-slate-800">{value || '—'}</dd>
    </div>
  );
}
