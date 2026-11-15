import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  AlertTriangle, ArrowUpRight, Calendar, Clock3, ShoppingCart, TriangleAlert, Building2, BriefcaseBusiness, ClipboardCheck, Package, ArrowRight,
} from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import palette from '../brand.json';
import { api } from '../lib/api';
import { useAuth } from '../auth/AuthContext';
import { useI18n, type MsgKey } from '../i18n';
import { formatDate, formatDateTime, formatMoney, formatNumber, timeAgo, cn } from '../lib/utils';
import { stageTone } from '../lib/catalog';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState, ErrorState, LoadingState } from '../components/ui/States';
import { displayName } from '../components/ui/Avatar';

const fade = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 } };

function ChartTip({ active, payload, label }: { active?: boolean; payload?: { value: number; color: string; name: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lift">
    <div className="mb-1 font-medium text-slate-700">{label}</div>
    {payload.map((point) => <div key={point.name} className="flex items-center gap-2 text-slate-500"><span className="h-1.5 w-1.5 rounded-full" style={{ background: point.color }} />{point.name}: <span className="tnum font-medium text-slate-800">{point.value}</span></div>)}
  </div>;
}

export function DashboardPage() {
  const { t, lang } = useI18n();
  const { lookups } = useAuth();
  const [unit, setUnit] = useState('');
  const [product, setProduct] = useState('');
  const params = useMemo(() => ({ business_unit_id: unit || undefined, product_id: product || undefined }), [unit, product]);
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['bms', 'executive-dashboard', params],
    queryFn: () => api.executiveDashboard(params),
  });

  if (isLoading) return <LoadingState />;
  if (isError || !data) return <ErrorState message={(error as Error)?.message} onRetry={() => void refetch()} />;

  const s = data.summary;
  const pipeline = Object.entries(data.opportunities.reduce<Record<string, number>>((acc, opportunity) => {
    acc[opportunity.stage] = (acc[opportunity.stage] ?? 0) + 1;
    return acc;
  }, {})).map(([stage, count]) => ({ stage: t(stage as MsgKey), count, raw: stage }));
  const attention = [
    { label: t('delayedOpps'), value: s.delayed_opportunities, icon: TriangleAlert, tone: 'pink', to: '/opportunities?alert=delayed' },
    { label: t('staleOpps'), value: s.stale_opportunities, icon: Clock3, tone: 'skin', to: '/opportunities?alert=no_update' },
    { label: t('overdueTasks'), value: s.overdue_tasks, icon: AlertTriangle, tone: 'pink', to: '/my-tasks' },
    { label: t('pendingProc'), value: s.pending_procurement, icon: ShoppingCart, tone: 'turquoise', to: '/procurement' },
    { label: t('blockedTasks'), value: s.blocked_tasks, icon: AlertTriangle, tone: 'skin', to: '/plans' },
  ];
  const kpis = [
    { label: t('kpiUnits'), value: formatNumber(s.units, lang), hint: t('units'), icon: Building2, tone: 'bg-brand-50' },
    { label: t('kpiTasks'), value: `${formatNumber(s.achieved, lang)}/${formatNumber(s.tasks, lang)}`, hint: t('achieved'), icon: ClipboardCheck, tone: 'bg-turquoise/40' },
    { label: t('kpiOpps'), value: formatNumber(s.opportunities, lang), hint: `${formatNumber(s.delayed_opportunities, lang)} ${t('delayed')}`, icon: BriefcaseBusiness, tone: 'bg-violet/30' },
    { label: t('kpiProducts'), value: formatNumber(s.products, lang), hint: t('products'), icon: Package, tone: 'bg-skin/35' },
    { label: t('kpiMeetings'), value: formatNumber(s.upcoming_meetings, lang), hint: t('upcomingMeetings'), icon: Calendar, tone: 'bg-cyan/30' },
  ];
  const flagged = data.opportunities.filter((opportunity) => opportunity.is_delayed || opportunity.has_no_update).slice(0, 6);

  return <motion.div {...fade} transition={{ duration: 0.28 }} className="space-y-3.5">
    <PageHeader eyebrow={t('workspaceOverview')} title={t('dashboard')} subtitle={t('dashboardSub')} actions={<>
      <p className="w-full text-xs text-slate-400 sm:w-auto">{t('generated')} {formatDateTime(data.generated_at, lang)}</p>
      <select aria-label={t('unit')} value={unit} onChange={(event) => setUnit(event.target.value)} className="h-9 max-w-[180px] rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700">
        <option value="">{t('allUnits')}</option>{lookups?.units.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select>
      <select aria-label={t('product')} value={product} onChange={(event) => setProduct(event.target.value)} className="h-9 max-w-[180px] rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700">
        <option value="">{t('allProducts')}</option>{lookups?.products.map((item) => <option key={item.id} value={item.id}>{item.product_name}</option>)}
      </select>
    </>} />

    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
      {kpis.map((item) => <Card key={item.label} className="px-4 py-3">
        <div className="flex items-start justify-between gap-2"><span className="text-[11px] font-medium text-slate-500">{item.label}</span><span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-lg text-brand-600', item.tone)}><item.icon size={16} strokeWidth={1.8} /></span></div>
        <div className="tnum -mt-1 text-[23px] font-semibold leading-none tracking-tight text-brand-600">{item.value}</div><div className="mt-1.5 text-[11px] text-slate-400">{item.hint}</div>
      </Card>)}
    </div>

    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-12">
      <div className="relative overflow-hidden rounded-xl bg-brand-600 p-4 text-white shadow-card md:col-span-2 xl:col-span-4">
        <div aria-hidden="true" className="pointer-events-none absolute -end-16 -top-20 h-56 w-56 rounded-full border border-skin/20" />
        <div className="relative flex h-full flex-col">
          <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-skin">{t('liveOverview')}</div>
          <h2 className="mt-2 text-lg font-semibold tracking-tight">{t('workspaceHealth')}</h2>
          <p className="mt-1 text-xs leading-5 text-white/80">{t('overviewSubtitle')}</p>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/15 pt-3">
            <div><div className="text-[10px] text-white/75">{t('opportunities')}</div><div className="tnum mt-0.5 text-lg font-semibold">{formatNumber(s.opportunities, lang)}</div></div>
            <div><div className="text-[10px] text-white/75">{t('achieved')}</div><div className="tnum mt-0.5 text-lg font-semibold">{formatNumber(s.achieved, lang)} <span className="text-xs font-normal text-white/75">/ {formatNumber(s.tasks, lang)}</span></div></div>
            <div><div className="text-[10px] text-white/75">{t('units')}</div><div className="tnum mt-0.5 text-lg font-semibold">{formatNumber(s.units, lang)}</div></div>
          </div>
          <Link to="/opportunities" className="mt-auto inline-flex items-center gap-1.5 pt-3 text-xs font-semibold text-white hover:underline">{t('viewPipeline')} <ArrowRight size={13} className="rtl:rotate-180" /></Link>
        </div>
      </div>
      <Card className="min-w-0 xl:col-span-4">
        <CardHeader title={t('unitProgress')} />
        <div dir="ltr" className="h-[165px] px-2 py-2">
          {data.unit_progress.length === 0 ? <div className="grid h-full place-items-center text-xs text-slate-400">{t('noData')}</div> : <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.unit_progress} layout="vertical" margin={{ left: 2, right: 12, top: 4, bottom: 0 }}>
              <CartesianGrid stroke={palette.skin} strokeOpacity={0.5} horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" width={100} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="progress" name={t('progress')} radius={[0, 5, 5, 0]} barSize={11} fill={palette.indigo} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>}
        </div>
      </Card>
      <Card className="min-w-0 xl:col-span-4">
        <CardHeader title={t('pipeline')} />
        <div dir="ltr" className="h-[165px] px-2 py-2">
          {pipeline.length === 0 ? <div className="grid h-full place-items-center text-xs text-slate-400">{t('noData')}</div> : <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pipeline} margin={{ left: -18, right: 8, top: 4, bottom: 0 }}>
              <CartesianGrid stroke={palette.skin} strokeOpacity={0.5} vertical={false} />
              <XAxis dataKey="stage" tickLine={false} axisLine={false} interval={0} angle={-25} textAnchor="end" height={42} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="count" name={t('opportunities')} radius={[5, 5, 0, 0]} barSize={17} isAnimationActive={false}>
                {pipeline.map((item) => <Cell key={item.raw} fill={item.raw === 'won' ? palette.turquoise : item.raw === 'lost' || item.raw === 'declined' ? palette.pink : palette.violet} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>}
        </div>
      </Card>
    </div>

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-12">
      <Card className="min-w-0 xl:col-span-4"><CardHeader title={t('attention')} />
        <div className="divide-y divide-slate-100">{attention.map((item) => { const Icon = item.icon; return <Link key={item.label} to={item.to} className="group flex items-center gap-2.5 px-4 py-1.5 transition hover:bg-slate-50"><span className={cn('grid h-6 w-6 shrink-0 place-items-center rounded-md text-brand-600', item.tone === 'pink' ? 'bg-pink/30' : item.tone === 'skin' ? 'bg-skin/40' : 'bg-turquoise/40')}><Icon size={13} /></span><span className="min-w-0 flex-1 text-xs font-medium text-slate-600">{item.label}</span><span className="tnum text-xs font-semibold text-brand-600">{formatNumber(item.value, lang)}</span><ArrowUpRight size={13} className="text-slate-400" /></Link>; })}</div>
      </Card>
      <Card className="min-w-0 xl:col-span-2"><CardHeader title={t('tenders')} />
        <div className="grid grid-cols-2 gap-2 p-3">{[
          { label: t('total'), value: data.tenders.total }, { label: t('submitted'), value: data.tenders.submitted },
          { label: t('delayed'), value: data.tenders.delayed }, { label: t('noUpdate'), value: data.tenders.no_update },
        ].map((item) => <div key={item.label} className="rounded-lg bg-slate-50 px-2.5 py-2"><div className="text-[10px] font-medium text-slate-400">{item.label}</div><div className="tnum mt-1 text-lg font-semibold leading-none text-brand-600">{formatNumber(item.value, lang)}</div></div>)}</div>
      </Card>
      <Card className="min-w-0 xl:col-span-3"><CardHeader title={t('upcomingMeetings')} action={<Link to="/meetings" className="shrink-0 text-xs font-semibold text-brand-600 hover:underline">{t('viewAll')}</Link>} />
        <ul className="max-h-40 divide-y divide-slate-100 overflow-y-auto" tabIndex={0} aria-label={t('upcomingMeetings')}>
          {data.meetings.length === 0 && <li className="px-4 py-5 text-xs text-slate-400">{t('noMeetings')}</li>}
          {data.meetings.map((meeting) => <li key={meeting.id} className="flex items-start gap-2 px-4 py-2"><span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md bg-slate-50 text-brand-600"><Calendar size={13} /></span><div className="min-w-0"><div className="truncate text-xs font-semibold text-slate-800">{meeting.title}</div><div className="mt-0.5 text-[11px] leading-4 text-slate-500">{formatDateTime(meeting.starts_at, lang)} · {meeting.unit?.name ?? meeting.location ?? '—'}</div></div></li>)}
        </ul>
      </Card>
      <Card className="min-w-0 xl:col-span-3"><CardHeader title={t('recentActivity')} />
        <ul className="max-h-40 divide-y divide-slate-100 overflow-y-auto" tabIndex={0} aria-label={t('recentActivity')}>
          {data.recent_activity.length === 0 && <li className="px-4 py-5 text-xs text-slate-400">{t('noActivity')}</li>}
          {data.recent_activity.map((activity, index) => <li key={`${activity.type}-${activity.id}-${index}`} className="px-4 py-2"><div className="text-xs font-medium text-slate-800">{activity.event.replace(/\./g, ' · ')}</div><div className="mt-0.5 text-[11px] text-slate-400">{activity.by ?? '—'} · {timeAgo(activity.at, lang)}</div></li>)}
        </ul>
      </Card>
    </div>

    <Card>
      <CardHeader title={t('openAlerts')} action={<Link to="/opportunities" className="text-xs font-semibold text-brand-600 hover:underline">{t('viewAll')}</Link>} />
      {flagged.length === 0 ? <EmptyState title={t('noData')} /> : <div role="region" tabIndex={0} aria-label={t('openAlerts')} className="max-h-[min(45vh,24rem)] overflow-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50"><tr className="border-b border-slate-100 text-start text-[10px] uppercase tracking-wide text-slate-400">
            {[t('reference'), t('opportunities'), t('stage'), t('value'), t('owner'), t('updated')].map((heading) => <th key={heading} className="px-4 py-2.5 text-start font-semibold">{heading}</th>)}
          </tr></thead>
          <tbody>{flagged.map((opportunity) => <tr key={opportunity.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
            <td className="px-4 py-2.5 font-mono text-xs text-slate-500">{opportunity.reference}</td>
            <td className="px-4 py-2.5"><Link to={`/opportunities/${opportunity.id}`} className="font-semibold text-slate-800 hover:underline">{opportunity.title}</Link><div className="text-xs text-slate-400">{opportunity.client_name}</div></td>
            <td className="px-4 py-2.5"><div className="flex flex-wrap gap-1"><Badge tone={stageTone(opportunity.stage)}>{t(opportunity.stage as MsgKey)}</Badge>{opportunity.is_delayed && <Badge tone="danger">{t('delayed')}</Badge>}{opportunity.has_no_update && <Badge tone="warn">{t('noUpdate')}</Badge>}</div></td>
            <td className="tnum whitespace-nowrap px-4 py-2.5">{formatMoney(opportunity.value, opportunity.currency, lang)}</td><td className="px-4 py-2.5 text-slate-600">{displayName(opportunity.owner)}</td><td className="px-4 py-2.5 text-slate-500">{formatDate(opportunity.last_update_at, lang)}</td>
          </tr>)}</tbody>
        </table>
      </div>}
    </Card>
  </motion.div>;
}
