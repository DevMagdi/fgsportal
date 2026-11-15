import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api } from '../lib/api';
import { useAuth } from '../auth/AuthContext';
import { useI18n, type MsgKey } from '../i18n';
import { formatNumber, cn } from '../lib/utils';
import { Badge } from '../components/ui/Badge';
import { Card, CardHeader } from '../components/ui/Card';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState, ErrorState, LoadingState } from '../components/ui/States';

type Tab = 'monthly' | 'kpis' | 'social';
const kpiTone: Record<string, string> = { achieved: 'success', on_track: 'accent', behind: 'danger', no_target: 'neutral' };

export function ReportsPage() {
  const { t, lang } = useI18n();
  const { lookups } = useAuth();
  const [tab, setTab] = useState<Tab>('monthly');
  const [unit, setUnit] = useState('');
  const params = { business_unit_id: unit || undefined };

  const monthly = useQuery({ queryKey: ['bms', 'reports', 'monthly', params], queryFn: () => api.monthlyReport(params), enabled: tab === 'monthly' });
  const kpis = useQuery({ queryKey: ['bms', 'reports', 'kpis', params], queryFn: () => api.kpiReport(params), enabled: tab === 'kpis' });
  const social = useQuery({ queryKey: ['bms', 'reports', 'social'], queryFn: () => api.socialReport(), enabled: tab === 'social' });

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <PageHeader title={t('reports')} />
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-lg border border-slate-200 bg-white p-0.5">
          {(['monthly', 'kpis', 'social'] as const).map((id) => (
            <button key={id} onClick={() => setTab(id)} className={cn('rounded-md px-3 py-1.5 text-xs font-medium', tab === id ? 'bg-slate-900 text-white' : 'text-slate-500')}>
              {t(id)}
            </button>
          ))}
        </div>
        {tab !== 'social' && (
          <select value={unit} onChange={(e) => setUnit(e.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm">
            <option value="">{t('allUnits')}</option>
            {lookups?.units.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        )}
      </div>

      {tab === 'monthly' && (
        monthly.isLoading ? <LoadingState /> : monthly.isError ? <ErrorState message={(monthly.error as Error)?.message} onRetry={() => void monthly.refetch()} /> : monthly.data ? (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: t('achievements'), value: monthly.data.summary.achievements },
                { label: t('inProgress'), value: monthly.data.summary.in_progress },
                { label: t('supportRequests'), value: monthly.data.summary.support_requests },
                { label: t('opportunities'), value: monthly.data.summary.opportunities_updated },
              ].map((k) => (
                <Card key={k.label} className="px-5 py-4">
                  <div className="text-[11px] uppercase tracking-wide text-slate-400">{k.label}</div>
                  <div className="tnum mt-1 text-2xl font-semibold">{formatNumber(k.value, lang)}</div>
                </Card>
              ))}
            </div>
            <Card>
              <CardHeader title={t('unitProgress')} subtitle={`${monthly.data.period.start} → ${monthly.data.period.end}`} />
              <div className="h-[280px] px-2 py-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthly.data.units.map((u) => ({ name: u.unit.name, progress: u.average_progress, tasks: u.tasks_total }))}>
                    <CartesianGrid stroke="#eef2f7" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis domain={[0, 100]} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="progress" name={t('progress')} fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={22} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        ) : <EmptyState />
      )}

      {tab === 'kpis' && (
        kpis.isLoading ? <LoadingState /> : kpis.isError ? <ErrorState message={(kpis.error as Error)?.message} onRetry={() => void kpis.refetch()} /> : kpis.data ? (
          <div className="space-y-4">
            {kpis.data.history[0] && (
              <Card>
                <CardHeader title={kpis.data.history[0].name} subtitle={kpis.data.history[0].unit ?? undefined} />
                <div className="h-[220px] px-2 py-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={kpis.data.history[0].points.map((p) => ({ ...p, period: String(p.period_start).slice(0, 7) }))}>
                      <CartesianGrid stroke="#eef2f7" vertical={false} />
                      <XAxis dataKey="period" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="actual" name={t('actual')} stroke="#4f46e5" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="target" name={t('target')} stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            )}
            <Card>
              {kpis.data.kpis.length === 0 ? <EmptyState /> : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-left text-[11px] uppercase tracking-wide text-slate-400">
                      <th className="px-5 py-2.5 font-medium">{t('kpis')}</th>
                      <th className="px-5 py-2.5 font-medium">{t('unit')}</th>
                      <th className="px-5 py-2.5 font-medium">{t('actual')}</th>
                      <th className="px-5 py-2.5 font-medium">{t('target')}</th>
                      <th className="px-5 py-2.5 font-medium">{t('attainment')}</th>
                      <th className="px-5 py-2.5 font-medium">{t('status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kpis.data.kpis.map((k) => (
                      <tr key={k.id} className="border-b border-slate-50 last:border-0">
                        <td className="px-5 py-3 font-medium">{k.name}</td>
                        <td className="px-5 py-3">{k.unit?.name ?? '—'}</td>
                        <td className="px-5 py-3 tnum">{k.actual}{k.unit_label ? ` ${k.unit_label}` : ''}</td>
                        <td className="px-5 py-3 tnum">{k.target ?? '—'}</td>
                        <td className="px-5 py-3 tnum">{k.attainment != null ? `${k.attainment}%` : '—'}</td>
                        <td className="px-5 py-3"><Badge tone={kpiTone[k.status ?? ''] ?? 'neutral'}>{k.status ? t(k.status as MsgKey) : '—'}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Card>
          </div>
        ) : <EmptyState />
      )}

      {tab === 'social' && (
        social.isLoading ? <LoadingState /> : social.isError ? <ErrorState message={(social.error as Error)?.message} onRetry={() => void social.refetch()} /> : social.data ? (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: t('followers'), value: social.data.summary.followers },
                { label: t('posts'), value: social.data.summary.posts },
                { label: t('engagement'), value: social.data.summary.engagement },
              ].map((k) => (
                <Card key={k.label} className="px-5 py-4">
                  <div className="text-[11px] uppercase tracking-wide text-slate-400">{k.label}</div>
                  <div className="tnum mt-1 text-2xl font-semibold">{formatNumber(k.value, lang)}</div>
                </Card>
              ))}
            </div>
            <Card>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-[11px] uppercase tracking-wide text-slate-400">
                    <th className="px-5 py-2.5 font-medium">{t('platform')}</th>
                    <th className="px-5 py-2.5 font-medium">{t('followers')}</th>
                    <th className="px-5 py-2.5 font-medium">{t('posts')}</th>
                    <th className="px-5 py-2.5 font-medium">{t('engagement')}</th>
                  </tr>
                </thead>
                <tbody>
                  {social.data.metrics.map((m, i) => (
                    <tr key={m.id ?? i} className="border-b border-slate-50 last:border-0">
                      <td className="px-5 py-3 font-medium">{m.platform}</td>
                      <td className="px-5 py-3 tnum">{formatNumber(m.followers, lang)}</td>
                      <td className="px-5 py-3 tnum">{formatNumber(m.posts, lang)}</td>
                      <td className="px-5 py-3 tnum">{formatNumber(m.engagement, lang)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        ) : <EmptyState />
      )}
    </motion.div>
  );
}
