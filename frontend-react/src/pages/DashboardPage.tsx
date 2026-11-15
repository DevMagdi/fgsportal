import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  AlertTriangle, ArrowUpRight, Calendar, Clock3, ShoppingCart, TriangleAlert, Building2, BriefcaseBusiness, ClipboardCheck, Package, Sparkles, ArrowRight,
} from 'lucide-react';
import {
  Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
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
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lift">
      <div className="mb-1 font-medium text-slate-700">{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.color }} />
          {p.name}: <span className="tnum font-medium text-slate-800">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export function DashboardPage() {
  const { t, lang } = useI18n();
  const { lookups } = useAuth();
  const [unit, setUnit] = useState('');
  const [product, setProduct] = useState('');
  const params = useMemo(() => ({
    business_unit_id: unit || undefined,
    product_id: product || undefined,
  }), [unit, product]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['bms', 'executive-dashboard', params],
    queryFn: () => api.executiveDashboard(params),
  });

  if (isLoading) return <LoadingState />;
  if (isError || !data) return <ErrorState message={(error as Error)?.message} onRetry={() => void refetch()} />;

  const s = data.summary;
  const pipeline = Object.entries(
    data.opportunities.reduce<Record<string, number>>((acc, o) => {
      acc[o.stage] = (acc[o.stage] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([stage, count]) => ({ stage: t(stage as MsgKey), count, raw: stage }));

  const attention = [
    { label: t('delayedOpps'), value: s.delayed_opportunities, icon: TriangleAlert, tone: 'rose', to: '/opportunities?alert=delayed' },
    { label: t('staleOpps'), value: s.stale_opportunities, icon: Clock3, tone: 'amber', to: '/opportunities?alert=no_update' },
    { label: t('overdueTasks'), value: s.overdue_tasks, icon: AlertTriangle, tone: 'rose', to: '/my-tasks' },
    { label: t('pendingProc'), value: s.pending_procurement, icon: ShoppingCart, tone: 'teal', to: '/procurement' },
    { label: t('blockedTasks'), value: s.blocked_tasks, icon: AlertTriangle, tone: 'amber', to: '/plans' },
  ];

  const kpis = [
    { label: t('kpiUnits'), value: formatNumber(s.units, lang), hint: t('units'), icon: Building2, tone: 'indigo' },
    { label: t('kpiTasks'), value: `${formatNumber(s.achieved, lang)}/${formatNumber(s.tasks, lang)}`, hint: t('achieved'), icon: ClipboardCheck, tone: 'teal' },
    { label: t('kpiOpps'), value: formatNumber(s.opportunities, lang), hint: `${s.delayed_opportunities} ${t('delayed')}`, icon: BriefcaseBusiness, tone: 'indigo' },
    { label: t('kpiProducts'), value: formatNumber(s.products, lang), hint: t('products'), icon: Package, tone: 'amber' },
    { label: t('kpiMeetings'), value: formatNumber(s.upcoming_meetings, lang), hint: t('upcomingMeetings'), icon: Calendar, tone: 'teal' },
  ];

  const flagged = data.opportunities.filter((o) => o.is_delayed || o.has_no_update).slice(0, 6);

  return (
    <motion.div {...fade} transition={{ duration: 0.28 }} className="space-y-6">
      <PageHeader
        eyebrow={t('workspaceOverview')}
        title={t('dashboard')}
        subtitle={t('dashboardSub')}
        actions={
          <p className="text-xs text-slate-400">
            {t('generated')} {formatDateTime(data.generated_at, lang)}
          </p>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <select aria-label={t('unit')} value={unit} onChange={(e) => setUnit(e.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700">
          <option value="">{t('allUnits')}</option>
          {lookups?.units.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
        <select aria-label={t('product')} value={product} onChange={(e) => setProduct(e.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700">
          <option value="">{t('allProducts')}</option>
          {lookups?.products.map((p) => <option key={p.id} value={p.id}>{p.product_name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        {kpis.map((k) => <Card key={k.label} className="group px-5 py-4 transition hover:-translate-y-0.5 hover:shadow-lift">
          <div className="flex items-start justify-between gap-2"><span className="text-[11px] font-medium text-slate-500">{k.label}</span><span className={cn('grid h-9 w-9 place-items-center rounded-lg', k.tone === 'indigo' ? 'bg-indigo-50 text-indigo-600' : k.tone === 'teal' ? 'bg-teal-50 text-teal-600' : 'bg-amber-50 text-amber-600')}><k.icon size={17} strokeWidth={1.8} /></span></div>
          <div className="tnum -mt-1 text-[25px] font-semibold tracking-tight text-slate-900">{k.value}</div><div className="mt-1.5 text-xs text-slate-400">{k.hint}</div>
        </Card>)}
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#3f3ab6] via-[#4f46e5] to-[#6661df] p-6 text-white shadow-[0_8px_24px_-10px_rgba(79,70,229,.4)] sm:p-7 xl:col-span-3">
          <div className="pointer-events-none absolute -end-12 -top-28 h-72 w-72 rounded-full border border-white/10" /><div className="pointer-events-none absolute -end-2 -top-20 h-56 w-56 rounded-full border border-white/10" /><div className="pointer-events-none absolute end-10 top-1 h-36 w-36 rounded-full bg-white/[0.04]" />
          <div className="relative"><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-200"><Sparkles size={14} />{t('liveOverview')}</div><h2 className="mt-4 max-w-md text-[23px] font-semibold tracking-tight sm:text-[26px]">{t('workspaceHealth')}</h2><p className="mt-2 max-w-md text-sm leading-6 text-indigo-100/80">{t('overviewSubtitle')}</p>
            <div className="mt-7 flex flex-wrap gap-x-9 gap-y-4 border-t border-white/15 pt-5"><div><div className="text-[10px] font-medium uppercase tracking-wider text-indigo-200">{t('opportunities')}</div><div className="tnum mt-1 text-xl font-semibold">{formatNumber(s.opportunities, lang)}</div></div><div><div className="text-[10px] font-medium uppercase tracking-wider text-indigo-200">{t('achieved')}</div><div className="tnum mt-1 text-xl font-semibold">{formatNumber(s.achieved, lang)} <span className="text-xs font-normal text-indigo-200">/ {formatNumber(s.tasks, lang)}</span></div></div><div><div className="text-[10px] font-medium uppercase tracking-wider text-indigo-200">{t('units')}</div><div className="tnum mt-1 text-xl font-semibold">{formatNumber(s.units, lang)}</div></div></div>
            <Link to="/opportunities" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-white hover:text-indigo-100">{t('viewPipeline')} <ArrowRight size={14} className="rtl:rotate-180" /></Link>
          </div>
        </div>
        <Card className="xl:col-span-2"><CardHeader title={t('attention')} subtitle={lang === 'ar' ? 'الأولويات التي تحتاج إلى متابعة.' : 'The things that could use a closer look.'} />
          <div className="divide-y divide-slate-100">{attention.map((item) => { const Icon = item.icon; return <Link key={item.label} to={item.to} className="group flex items-center gap-3 px-5 py-2.5 transition hover:bg-slate-50"><span className={cn('grid h-8 w-8 place-items-center rounded-lg', item.tone === 'rose' ? 'bg-rose-50 text-rose-500' : item.tone === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-teal-50 text-teal-600')}><Icon size={15} /></span><span className="flex-1 text-xs font-medium text-slate-600">{item.label}</span><span className="tnum text-sm font-semibold text-slate-800">{formatNumber(item.value, lang)}</span><ArrowUpRight size={14} className="text-slate-300 group-hover:text-brand-600" /></Link>; })}</div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader title={t('unitProgress')} />
          <div className="h-[280px] px-2 py-4">
            {data.unit_progress.length === 0 ? <EmptyState /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.unit_progress} layout="vertical" margin={{ left: 16, right: 16, top: 8, bottom: 8 }}>
                  <CartesianGrid stroke="#eef2f7" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" width={110} tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTip />} />
                  <Bar dataKey="progress" name={t('progress')} radius={[0, 6, 6, 0]} barSize={14} fill="#4f46e5" isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader title={t('pipeline')} />
          <div className="h-[280px] px-2 py-4">
            {pipeline.length === 0 ? <EmptyState /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipeline} margin={{ left: 8, right: 8, top: 8, bottom: 24 }}>
                  <CartesianGrid stroke="#eef2f7" vertical={false} />
                  <XAxis dataKey="stage" tickLine={false} axisLine={false} interval={0} angle={-28} textAnchor="end" height={50} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTip />} />
                  <Bar dataKey="count" name={t('opportunities')} radius={[6, 6, 0, 0]} barSize={18} isAnimationActive={false}>
                    {pipeline.map((p) => (
                      <Cell key={p.raw} fill={p.raw === 'won' ? '#14b8a6' : p.raw === 'lost' || p.raw === 'declined' ? '#fb7185' : '#6366f1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader title={t('tenders')} subtitle={t('tendersSub')} />
          <div className="grid grid-cols-2 gap-3 p-5">
            {[
              { label: t('total'), value: data.tenders.total },
              { label: t('submitted'), value: data.tenders.submitted },
              { label: t('delayed'), value: data.tenders.delayed },
              { label: t('noUpdate'), value: data.tenders.no_update },
            ].map((item) => (
              <div key={item.label} className="rounded-lg bg-slate-50 px-3 py-3">
                <div className="text-[11px] uppercase tracking-wide text-slate-400">{item.label}</div>
                <div className="tnum mt-1 text-xl font-semibold text-slate-900">{formatNumber(item.value, lang)}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title={t('upcomingMeetings')} action={<Link to="/meetings" className="text-xs font-medium text-brand-600">{t('viewAll')}</Link>} />
          <ul className="divide-y divide-slate-100">
            {data.meetings.length === 0 && <li className="px-5 py-8 text-sm text-slate-400">{t('noMeetings')}</li>}
            {data.meetings.map((m) => (
              <li key={m.id} className="flex items-start gap-3 px-5 py-3">
                <span className="mt-0.5 grid h-8 w-8 place-items-center rounded-lg bg-slate-50 text-slate-500"><Calendar size={14} /></span>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-slate-800">{m.title}</div>
                  <div className="text-xs text-slate-500">{formatDateTime(m.starts_at, lang)} · {m.unit?.name ?? m.location ?? '—'}</div>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title={t('recentActivity')} />
          <ul className="divide-y divide-slate-100">
            {data.recent_activity.length === 0 && <li className="px-5 py-8 text-sm text-slate-400">{t('noActivity')}</li>}
            {data.recent_activity.map((a, i) => (
              <li key={`${a.type}-${a.id}-${i}`} className="px-5 py-3">
                <div className="text-sm text-slate-800">{a.event.replace(/\./g, ' · ')}</div>
                <div className="text-xs text-slate-400">{a.by ?? '—'} · {timeAgo(a.at, lang)}</div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <CardHeader
          title={t('openAlerts')}
          action={<Link to="/opportunities" className="text-xs font-medium text-brand-600">{t('viewAll')}</Link>}
        />
        {flagged.length === 0 ? <EmptyState title={t('noData')} /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-start text-[11px] uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-2.5 font-medium">{t('reference')}</th>
                  <th className="px-5 py-2.5 font-medium">{t('opportunities')}</th>
                  <th className="px-5 py-2.5 font-medium">{t('stage')}</th>
                  <th className="px-5 py-2.5 font-medium">{t('value')}</th>
                  <th className="px-5 py-2.5 font-medium">{t('owner')}</th>
                  <th className="px-5 py-2.5 font-medium">{t('updated')}</th>
                </tr>
              </thead>
              <tbody>
                {flagged.map((o) => (
                  <tr key={o.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70">
                    <td className="px-5 py-3 font-mono text-xs text-slate-500">{o.reference}</td>
                    <td className="px-5 py-3">
                      <Link to={`/opportunities/${o.id}`} className="font-medium text-slate-800 hover:text-brand-700">{o.title}</Link>
                      <div className="text-xs text-slate-400">{o.client_name}</div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        <Badge tone={stageTone(o.stage)}>{t(o.stage as MsgKey)}</Badge>
                        {o.is_delayed && <Badge tone="danger">{t('delayed')}</Badge>}
                        {o.has_no_update && <Badge tone="warn">{t('noUpdate')}</Badge>}
                      </div>
                    </td>
                    <td className="px-5 py-3 tnum">{formatMoney(o.value, o.currency, lang)}</td>
                    <td className="px-5 py-3 text-slate-600">{displayName(o.owner)}</td>
                    <td className="px-5 py-3 text-slate-500">{formatDate(o.last_update_at, lang)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
