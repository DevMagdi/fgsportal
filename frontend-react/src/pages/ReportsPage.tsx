import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import palette from '../brand.json';
import { api } from '../lib/api';
import { useAuth } from '../auth/AuthContext';
import { useI18n, type MsgKey } from '../i18n';
import { chartEntrance } from '../lib/motion';
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion';
import { formatNumber, cn } from '../lib/utils';
import { Badge } from '../components/ui/Badge';
import { AnimatedTableRow } from '../components/ui/AnimatedTableRow';
import { CountUpValue } from '../components/ui/CountUpValue';
import { Card, CardHeader } from '../components/ui/Card';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState, ErrorState, LoadingState } from '../components/ui/States';

type Tab = 'monthly' | 'kpis' | 'social';
const kpiTone: Record<string, string> = { achieved: 'success', on_track: 'accent', behind: 'danger', no_target: 'neutral' };

export function ReportsPage() {
  const { t, lang } = useI18n();
  const reduceMotion = usePrefersReducedMotion();
  const { lookups } = useAuth();
  const [tab, setTab] = useState<Tab>('monthly');
  const [unit, setUnit] = useState('');
  const params = { business_unit_id: unit || undefined };

  const monthly = useQuery({ queryKey: ['bms', 'reports', 'monthly', params], queryFn: () => api.monthlyReport(params), enabled: tab === 'monthly' });
  const kpis = useQuery({ queryKey: ['bms', 'reports', 'kpis', params], queryFn: () => api.kpiReport(params), enabled: tab === 'kpis' });
  const social = useQuery({ queryKey: ['bms', 'reports', 'social'], queryFn: () => api.socialReport(), enabled: tab === 'social' });

  return (
    <div className="space-y-5">
      <PageHeader title={t('reports')} />
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-lg border border-slate-200 bg-white p-0.5">
          {(['monthly', 'kpis', 'social'] as const).map((id) => (
            <button key={id} type="button" aria-pressed={tab === id} onClick={() => setTab(id)} className={cn('rounded-md px-3 py-1.5 text-xs font-medium transition-colors motion-reduce:transition-none', tab === id ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50')}>
              {t(id)}
            </button>
          ))}
        </div>
        {tab !== 'social' && (
          <select aria-label={t('unit')} value={unit} onChange={(e) => setUnit(e.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm">
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
              ].map((k, index) => (
                <Card key={k.label} className={cn('metric-card relative overflow-hidden px-5 py-4', ['metric-card--indigo', 'metric-card--teal', 'metric-card--amber', 'metric-card--rose'][index])}>
                  <div className="relative text-[11px] font-semibold uppercase tracking-wide text-slate-500">{k.label}</div>
                  <div className="tnum relative mt-2 text-[32px] font-semibold tracking-tight text-brand-600">{typeof k.value === 'number' && Number.isFinite(k.value) ? <CountUpValue value={k.value} lang={lang} /> : formatNumber(k.value, lang)}</div>
                </Card>
              ))}
            </div>
            <Card scaleOnHover={false}>
              <CardHeader title={t('unitProgress')} subtitle={`${monthly.data.period.start} → ${monthly.data.period.end}`} />
              <div dir="ltr" className="h-[220px] px-2 py-3">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthly.data.units.map((u) => ({ name: u.unit.name, progress: u.average_progress, tasks: u.tasks_total }))}>
                    <CartesianGrid stroke={palette.skin} strokeOpacity={0.5} vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis domain={[0, 100]} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="progress" name={t('progress')} fill={palette.indigo} radius={[6, 6, 0, 0]} barSize={22} {...chartEntrance(reduceMotion)} />
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
              <Card scaleOnHover={false}>
                <CardHeader title={kpis.data.history[0].name} subtitle={kpis.data.history[0].unit ?? undefined} />
                <div dir="ltr" className="h-[220px] px-2 py-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={kpis.data.history[0].points.map((p) => ({ ...p, period: String(p.period_start).slice(0, 7) }))}>
                      <CartesianGrid stroke={palette.skin} strokeOpacity={0.5} vertical={false} />
                      <XAxis dataKey="period" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="actual" name={t('actual')} stroke={palette.indigo} strokeWidth={2} dot={false} {...chartEntrance(reduceMotion)} />
                      <Line type="monotone" dataKey="target" name={t('target')} stroke={palette.violet} strokeDasharray="4 4" strokeWidth={1.5} dot={false} {...chartEntrance(reduceMotion)} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            )}
            <Card>
              {kpis.data.kpis.length === 0 ? <EmptyState /> : (
                <div role="region" tabIndex={0} aria-label={t('reports')} className="max-h-[min(55vh,32rem)] overflow-auto"><table className="w-full min-w-[650px] text-sm">
                  <thead className="sticky top-0 z-10 bg-slate-50">
                    <tr className="border-b border-slate-100 text-start text-[11px] uppercase tracking-wide text-slate-400">
                      <th className="px-5 py-2.5 text-start font-medium">{t('kpis')}</th>
                      <th className="px-5 py-2.5 text-start font-medium">{t('unit')}</th>
                      <th className="px-5 py-2.5 text-start font-medium">{t('actual')}</th>
                      <th className="px-5 py-2.5 text-start font-medium">{t('target')}</th>
                      <th className="px-5 py-2.5 text-start font-medium">{t('attainment')}</th>
                      <th className="px-5 py-2.5 text-start font-medium">{t('status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kpis.data.kpis.map((k, index) => (
                      <AnimatedTableRow key={k.id} index={index} reduced={reduceMotion} className="border-b border-slate-50 transition-colors last:border-0 hover:bg-brand-50/60 motion-reduce:transition-none">
                        <td className="px-5 py-3 font-medium">{k.name}</td>
                        <td className="px-5 py-3">{k.unit?.name ?? '—'}</td>
                        <td className="px-5 py-3 tnum">{k.actual}{k.unit_label ? ` ${k.unit_label}` : ''}</td>
                        <td className="px-5 py-3 tnum">{k.target ?? '—'}</td>
                        <td className="px-5 py-3 tnum">{k.attainment != null ? `${k.attainment}%` : '—'}</td>
                        <td className="px-5 py-3"><Badge tone={kpiTone[k.status ?? ''] ?? 'neutral'}>{k.status ? t(k.status as MsgKey) : '—'}</Badge></td>
                      </AnimatedTableRow>
                    ))}
                  </tbody>
                </table></div>
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
              ].map((k, index) => (
                <Card key={k.label} className={cn('metric-card relative overflow-hidden px-5 py-4', ['metric-card--indigo', 'metric-card--teal', 'metric-card--amber', 'metric-card--rose'][index])}>
                  <div className="relative text-[11px] font-semibold uppercase tracking-wide text-slate-500">{k.label}</div>
                  <div className="tnum relative mt-2 text-[32px] font-semibold tracking-tight text-brand-600">{typeof k.value === 'number' && Number.isFinite(k.value) ? <CountUpValue value={k.value} lang={lang} /> : formatNumber(k.value, lang)}</div>
                </Card>
              ))}
            </div>
            <Card>
              <div role="region" tabIndex={0} aria-label={t('reports')} className="max-h-[min(55vh,32rem)] overflow-auto"><table className="w-full min-w-[650px] text-sm">
                <thead className="sticky top-0 z-10 bg-slate-50">
                  <tr className="border-b border-slate-100 text-start text-[11px] uppercase tracking-wide text-slate-400">
                    <th className="px-5 py-2.5 text-start font-medium">{t('platform')}</th>
                    <th className="px-5 py-2.5 text-start font-medium">{t('followers')}</th>
                    <th className="px-5 py-2.5 text-start font-medium">{t('posts')}</th>
                    <th className="px-5 py-2.5 text-start font-medium">{t('engagement')}</th>
                  </tr>
                </thead>
                <tbody>
                  {social.data.metrics.map((m, i) => (
                    <AnimatedTableRow key={m.id ?? i} index={i} reduced={reduceMotion} className="border-b border-slate-50 transition-colors last:border-0 hover:bg-brand-50/60 motion-reduce:transition-none">
                      <td className="px-5 py-3 font-medium">{m.platform}</td>
                      <td className="px-5 py-3 tnum">{formatNumber(m.followers, lang)}</td>
                      <td className="px-5 py-3 tnum">{formatNumber(m.posts, lang)}</td>
                      <td className="px-5 py-3 tnum">{formatNumber(m.engagement, lang)}</td>
                    </AnimatedTableRow>
                  ))}
                </tbody>
              </table></div>
            </Card>
          </div>
        ) : <EmptyState />
      )}
    </div>
  );
}
