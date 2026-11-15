import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { animate, motion, type Variants } from 'framer-motion';
import {
  AlertTriangle, ArrowRight, ArrowUpRight, BriefcaseBusiness, Building2, Calendar, CalendarCheck,
  CheckCircle2, ClipboardCheck, Clock3, Gift, Package, Plus, ShoppingCart, TriangleAlert, type LucideIcon,
} from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import palette from '../brand.json';
import { api } from '../lib/api';
import { useAuth } from '../auth/AuthContext';
import { useI18n, type MsgKey } from '../i18n';
import { canQuickCreate, dashboardRatios, formatPercentage, percentage, pipelineSegments, type DashboardRatio, type PipelineSegment } from '../lib/dashboard';
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion';
import type { UnitProgress } from '../lib/types';
import { formatDate, formatDateTime, formatMoney, formatNumber, timeAgo, cn } from '../lib/utils';
import { stageTone } from '../lib/catalog';
import { useEntityManager } from '../components/crud/useEntityManager';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { statusLabel } from '../components/ui/DataTable';
import { PageHeader } from '../components/ui/PageHeader';
import { ErrorState } from '../components/ui/States';
import { Skeleton } from '../components/ui/Spinner';
import { displayName } from '../components/ui/Avatar';

const containerMotion: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } };
const sectionMotion: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } },
};

function CountUp({ value, lang }: { value: number; lang: string }) {
  const reduceMotion = usePrefersReducedMotion();
  const current = useRef(reduceMotion ? value : 0);
  const [display, setDisplay] = useState(current.current);
  useEffect(() => {
    if (reduceMotion) { current.current = value; setDisplay(value); return; }
    const controls = animate(current.current, value, {
      duration: 0.55,
      ease: 'easeOut',
      onUpdate: (next) => {
        const rounded = Math.round(next);
        if (rounded !== current.current) { current.current = rounded; setDisplay(rounded); }
      },
    });
    return () => controls.stop();
  }, [value, reduceMotion]);
  return <><span aria-hidden="true">{formatNumber(display, lang)}</span><span className="sr-only">{formatNumber(value, lang)}</span></>;
}

function ProgressRing({ value, color }: { value: number | null; color: string }) {
  const reduceMotion = usePrefersReducedMotion();
  const circumference = 2 * Math.PI * 15;
  const fraction = value === null ? 0 : Math.max(0, Math.min(100, value)) / 100;
  const ring = { cx: 20, cy: 20, r: 15, fill: 'none', stroke: color, strokeWidth: 3, strokeLinecap: 'round' as const, transform: 'rotate(-90 20 20)', strokeDasharray: circumference };
  return <svg aria-hidden="true" width="40" height="40" viewBox="0 0 40 40" className="shrink-0">
    <circle cx="20" cy="20" r="15" fill="none" stroke={palette.skin} strokeOpacity="0.45" strokeWidth="3" />
    {reduceMotion ? <circle {...ring} strokeDashoffset={circumference * (1 - fraction)} /> :
      <motion.circle {...ring} initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: circumference * (1 - fraction) }} transition={{ duration: 0.55, ease: 'easeOut' }} />}
  </svg>;
}

function KpiCard({ label, value, denominator, ratio, ratioLabel, attention, icon: Icon, color }: {
  label: string; value: number; denominator?: number; ratio: DashboardRatio; ratioLabel: string;
  attention?: boolean; icon: LucideIcon; color: string;
}) {
  const { t, lang } = useI18n();
  const ratioText = ratio.percent === null ? t('noData') : `${formatNumber(ratio.count, lang)} / ${formatNumber(ratio.total, lang)} ${ratioLabel}`;
  return <Card className="h-full min-w-0 px-3.5 py-3">
    <div className="flex min-h-[28px] items-start justify-between gap-2 2xl:min-h-[14px]">
      <div className="flex min-w-0 items-start gap-1.5 text-slate-500"><Icon size={14} strokeWidth={1.8} className="shrink-0 text-brand-600" /><h2 className="text-[11px] font-medium leading-[14px]">{label}</h2></div>
      {ratio.percent !== null && <span aria-hidden="true" className={cn('tnum shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold text-brand-600', attention && ratio.count > 0 ? 'bg-pink/40' : 'bg-turquoise/55')}>
        {formatPercentage(ratio.percent, lang)}
      </span>}
    </div>
    <div className="mt-1.5 flex items-center justify-between gap-2">
      <div className="tnum whitespace-nowrap text-[28px] font-semibold leading-none tracking-tight text-brand-600"><CountUp value={value} lang={lang} />{denominator !== undefined && <span className="text-[15px] font-medium text-slate-400"> / {formatNumber(denominator, lang)}</span>}</div>
      <ProgressRing value={ratio.percent} color={color} />
    </div>
    <p className="text-[10px] leading-4 text-slate-500" title={ratioText}>{ratioText}{ratio.percent !== null && <span className="sr-only"> ({formatPercentage(ratio.percent, lang)})</span>}</p>
  </Card>;
}

type TooltipPayload<T> = { active?: boolean; payload?: { payload?: T }[] };

function UnitTooltip({ active, payload, totalTasks }: TooltipPayload<UnitProgress> & { totalTasks: number }) {
  const { t, lang, dir } = useI18n();
  const item = payload?.[0]?.payload;
  if (!active || !item) return null;
  const share = percentage(item.total, totalTasks);
  return <div dir={dir} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lift">
    <div className="font-semibold text-brand-600">{item.name}</div>
    <div className="mt-1 text-slate-600">{item.total ? `${t('averageProgress')}: ${formatPercentage(item.progress, lang)}` : t('noTasksToMeasure')}</div>
    <div className="mt-0.5 text-slate-500">{formatNumber(item.total, lang)} {t('tasks')}{share !== null && ` · ${formatPercentage(share, lang)} ${t('ofAllTasks')}`}</div>
  </div>;
}

function PipelineTooltip({ active, payload }: TooltipPayload<PipelineSegment>) {
  const { t, lang, dir } = useI18n();
  const item = payload?.[0]?.payload;
  if (!active || !item) return null;
  return <div dir={dir} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lift">
    <div className="font-semibold text-brand-600">{statusLabel(item.stage, t)}{item.delayed ? ` · ${t('delayed')}` : ''}</div>
    <div className="mt-1 text-slate-600">{formatNumber(item.count, lang)} {t('opportunities')}</div>
    <div className="mt-0.5 text-slate-500">{formatPercentage(item.percent, lang)} {t('ofOpportunities')}</div>
  </div>;
}

function DashboardSkeleton() {
  const { t } = useI18n();
  return <div role="status" aria-label={t('loading')} className="space-y-3">
    <div className="space-y-2"><Skeleton className="h-3 w-28" /><Skeleton className="h-7 w-60" /><Skeleton className="h-4 w-80 max-w-full" /></div>
    <Skeleton className="h-8 w-96 max-w-full" />
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">{[0, 1, 2, 3, 4].map((item) => <div key={item} className="rounded-xl border border-slate-200 bg-white p-3"><Skeleton className="h-3 w-24" /><Skeleton className="mt-3 h-7 w-16" /><Skeleton className="mt-3 h-3 w-28" /></div>)}</div>
    <div className="grid gap-3 md:grid-cols-3">{[0, 1, 2].map((item) => <div key={item} className="rounded-xl border border-slate-200 bg-white p-4"><Skeleton className="h-4 w-28" /><Skeleton className="mt-4 h-32 w-full" /></div>)}</div>
    <Skeleton className="h-12 w-full" /><Skeleton className="h-32 w-full" /><span className="sr-only">{t('loading')}</span>
  </div>;
}

export function DashboardPage() {
  const { t, lang, dir } = useI18n();
  const { lookups, abilities } = useAuth();
  const reduceMotion = usePrefersReducedMotion();
  const [unit, setUnit] = useState('');
  const [product, setProduct] = useState('');
  const opportunities = useEntityManager('opportunities');
  const plans = useEntityManager('plans');
  const bonuses = useEntityManager('bonuses');
  const meetings = useEntityManager('meetings');
  const params = useMemo(() => ({ business_unit_id: unit || undefined, product_id: product || undefined }), [unit, product]);
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['bms', 'executive-dashboard', params],
    queryFn: () => api.executiveDashboard(params),
  });

  if (isLoading) return <DashboardSkeleton />;
  if (isError || !data) return <ErrorState message={(error as Error)?.message} onRetry={() => void refetch()} />;

  const s = data.summary;
  const ratios = dashboardRatios(data);
  const pipeline = pipelineSegments(data.opportunities);
  const totalUnitTasks = data.unit_progress.reduce((sum, item) => sum + item.total, 0);
  const completion = ratios.tasks.percent;
  const attention = [
    { label: t('delayedOpps'), value: s.delayed_opportunities, icon: TriangleAlert, tone: 'bg-pink/35', to: '/opportunities?alert=delayed' },
    { label: t('staleOpps'), value: s.stale_opportunities, icon: Clock3, tone: 'bg-skin/45', to: '/opportunities?alert=no_update' },
    { label: t('overdueTasks'), value: s.overdue_tasks, icon: AlertTriangle, tone: 'bg-pink/35', to: '/my-tasks' },
    { label: t('pendingProc'), value: s.pending_procurement, icon: ShoppingCart, tone: 'bg-turquoise/45', to: '/procurement' },
    { label: t('blockedTasks'), value: s.blocked_tasks, icon: AlertTriangle, tone: 'bg-skin/45', to: '/plans' },
  ];
  const kpis = [
    { label: t('totalUnits'), value: s.units, ratio: ratios.units, ratioLabel: t('unitsWithTasks'), icon: Building2, color: palette.indigo },
    { label: t('kpiTasks'), value: s.achieved, denominator: s.tasks, ratio: ratios.tasks, ratioLabel: t('tasksCompleted'), icon: ClipboardCheck, color: palette.turquoise },
    { label: t('kpiOpps'), value: s.opportunities, ratio: ratios.opportunities, ratioLabel: t('opportunitiesDelayed'), attention: true, icon: BriefcaseBusiness, color: palette.pink },
    { label: t('kpiProducts'), value: s.products, ratio: ratios.products, ratioLabel: t('productsWithPhase'), icon: Package, color: palette.violet },
    { label: t('upcomingMeetings'), value: s.upcoming_meetings, ratio: ratios.meetings, ratioLabel: t('meetingsWithUnit'), icon: Calendar, color: palette.cyan },
  ];
  const quickActions = [
    { key: 'opportunities', label: t('newOpportunity'), icon: BriefcaseBusiness, manager: opportunities, visible: canQuickCreate(abilities, 'opportunities.view', opportunities.canManage) },
    { key: 'plans', label: t('newWeeklyPlan'), icon: CalendarCheck, manager: plans, visible: canQuickCreate(abilities, 'plans.view', plans.canManage) },
    { key: 'bonuses', label: t('addBonus'), icon: Gift, manager: bonuses, visible: canQuickCreate(abilities, 'bonuses.view', bonuses.canManage) },
    { key: 'meetings', label: t('newMeeting'), icon: Calendar, manager: meetings, visible: canQuickCreate(abilities, 'meetings.view', meetings.canManage) },
  ].filter((action) => action.visible);
  const flagged = data.opportunities.filter((opportunity) => opportunity.is_delayed || opportunity.has_no_update).slice(0, 6);

  return <>
    <motion.div className="grid grid-cols-12 gap-3" variants={containerMotion} initial={reduceMotion ? false : 'hidden'} animate="visible">
      <motion.div variants={sectionMotion} className="col-span-12">
        <PageHeader eyebrow={t('workspaceOverview')} title={t('dashboard')} subtitle={t('dashboardSub')} actions={<>
          <p className="w-full text-xs text-slate-400 sm:w-auto">{t('generated')} {formatDateTime(data.generated_at, lang)}</p>
          <select aria-label={t('unit')} value={unit} onChange={(event) => setUnit(event.target.value)} className="h-9 max-w-[180px] rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700">
            <option value="">{t('allUnits')}</option>{lookups?.units.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <select aria-label={t('product')} value={product} onChange={(event) => setProduct(event.target.value)} className="h-9 max-w-[180px] rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700">
            <option value="">{t('allProducts')}</option>{lookups?.products.map((item) => <option key={item.id} value={item.id}>{item.product_name}</option>)}
          </select>
        </>} />
      </motion.div>

      {quickActions.length > 0 && <motion.section variants={sectionMotion} aria-label={t('quickActions')} className="col-span-12 flex min-w-0 items-center gap-3">
        <h2 className="hidden shrink-0 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500 sm:block">{t('quickActions')}</h2>
        <div role="region" aria-label={t('quickActions')} tabIndex={0} className="flex min-w-0 items-center gap-2 overflow-x-auto py-1">
          {quickActions.map((action) => <Button key={action.key} size="sm" variant="secondary" className="shrink-0" onClick={() => action.manager.openCreate()}><Plus size={13} /><action.icon size={14} strokeWidth={1.8} />{action.label}</Button>)}
        </div>
      </motion.section>}

      <motion.div variants={containerMotion} className="col-span-12 grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-5">
        {kpis.map((item) => <motion.div key={item.label} variants={sectionMotion} className="min-w-0"><KpiCard {...item} /></motion.div>)}
      </motion.div>

      <motion.div variants={sectionMotion} whileHover={reduceMotion ? undefined : { y: -2 }} transition={{ duration: 0.18, ease: 'easeOut' }} className="relative col-span-12 overflow-hidden rounded-xl bg-brand-600 p-4 text-white shadow-card transition-shadow hover:shadow-lift xl:col-span-4">
        <div aria-hidden="true" className="pointer-events-none absolute -end-12 -top-24 h-56 w-56 rounded-full border border-skin/20" />
        <div aria-hidden="true" className="pointer-events-none absolute -end-4 -top-16 h-40 w-40 rounded-full border border-skin/10" />
        <div className="relative flex h-full flex-col">
          <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-skin">{api.demo ? t('demoWorkspace') : t('liveOverview')}</div>
          <h2 className="mt-1.5 text-lg font-semibold tracking-tight">{t('workspaceHealth')}</h2>
          <div className="mt-2.5 flex flex-wrap gap-x-7 gap-y-2">
            <div><div className="text-[10px] text-white/75">{t('opportunities')}</div><div className="tnum mt-0.5 text-[24px] font-semibold leading-none">{formatNumber(s.opportunities, lang)}</div></div>
            <div><div className="text-[10px] text-white/75">{t('achieved')}</div><div className="tnum mt-0.5 text-[24px] font-semibold leading-none">{formatNumber(s.achieved, lang)} <span className="text-xs font-normal text-white/75">/ {formatNumber(s.tasks, lang)}</span></div></div>
            <div><div className="text-[10px] text-white/75">{t('units')}</div><div className="tnum mt-0.5 text-[24px] font-semibold leading-none">{formatNumber(s.units, lang)}</div></div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[10px] text-white/80"><span className="shrink-0">{t('taskCompletion')}</span><span className="h-1 min-w-6 flex-1 overflow-hidden rounded-full bg-white/20"><span className="block h-full rounded-full bg-skin" style={{ width: `${Math.max(0, Math.min(100, completion ?? 0))}%` }} /></span><span className="tnum">{completion === null ? '—' : formatPercentage(completion, lang)}</span></div>
          <Link to="/opportunities" className="mt-auto inline-flex w-fit items-center gap-1.5 pt-3 text-xs font-semibold text-white hover:underline">{t('viewFullPipeline')} <ArrowRight size={13} className="rtl:rotate-180" /></Link>
        </div>
      </motion.div>

      <motion.div variants={sectionMotion} className="col-span-12 min-w-0 md:col-span-6 xl:col-span-4">
        <Card className="h-full min-w-0"><CardHeader title={t('unitProgress')} className="py-2.5" />
          {data.unit_progress.length === 0 ? <div className="flex h-[145px] flex-col items-center justify-center gap-2 text-xs text-slate-500"><Building2 size={18} className="text-slate-400" aria-hidden="true" />{t('noData')}</div> : <>
            <div dir="ltr" role="region" tabIndex={0} aria-label={t('unitProgress')} className="h-[145px] overflow-x-auto px-1 py-1">
              <div aria-hidden="true" className="h-full" style={{ minWidth: `${Math.max(180, data.unit_progress.length * 68)}px` }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.unit_progress} accessibilityLayer={false} margin={{ left: 4, right: 10, top: 4, bottom: 0 }}>
                    <CartesianGrid stroke={palette.skin} strokeOpacity={0.5} vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} interval={0} height={34} tickFormatter={(name: string) => name.length > 12 ? `${name.slice(0, 11)}…` : name} />
                    <YAxis domain={[0, 100]} tickLine={false} axisLine={false} width={40} tickFormatter={(value: number) => formatPercentage(value, lang)} />
                    <Tooltip content={<UnitTooltip totalTasks={totalUnitTasks} />} cursor={{ fill: palette.skin, opacity: 0.12 }} />
                    <Bar dataKey="progress" name={t('progress')} fill={palette.indigo} radius={[4, 4, 0, 0]} barSize={10} isAnimationActive={!reduceMotion} animationBegin={0} animationDuration={550} animationEasing="ease-out" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <ul className="sr-only">{data.unit_progress.map((item) => {
              const share = percentage(item.total, totalUnitTasks);
              return <li key={item.id}>{item.name}: {item.total ? `${formatPercentage(item.progress, lang)} ${t('averageProgress')}` : t('noTasksToMeasure')}, {formatNumber(item.total, lang)} {t('tasks')}{share !== null && ` · ${formatPercentage(share, lang)} ${t('ofAllTasks')}`}</li>;
            })}</ul>
          </>}
        </Card>
      </motion.div>

      <motion.div variants={sectionMotion} className="col-span-12 min-w-0 md:col-span-6 xl:col-span-4">
        <Card className="h-full min-w-0"><CardHeader title={t('pipeline')} className="py-2.5" />
          {pipeline.length === 0 ? <div className="flex h-[145px] flex-col items-center justify-center gap-2 text-xs text-slate-500"><BriefcaseBusiness size={18} className="text-slate-400" aria-hidden="true" />{t('noData')}</div> :
            <div className="flex h-[145px] items-center gap-2 px-3 py-1">
              <div dir="ltr" aria-hidden="true" className="relative h-[132px] w-[132px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart accessibilityLayer={false}><Pie data={pipeline} dataKey="count" nameKey="key" rootTabIndex={-1} cx="50%" cy="50%" innerRadius={39} outerRadius={57} paddingAngle={pipeline.length > 1 ? 2 : 0} stroke={palette.white} strokeWidth={1} isAnimationActive={!reduceMotion} animationBegin={0} animationDuration={550} animationEasing="ease-out">
                    {pipeline.map((segment) => <Cell key={segment.key} fill={segment.color} />)}
                  </Pie><Tooltip content={<PipelineTooltip />} /></PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center"><span className="tnum text-xl font-semibold leading-none text-brand-600">{formatNumber(data.opportunities.length, lang)}</span><span className="mt-1 text-[9px] text-slate-500">{t('total')}</span></div>
              </div>
              <span className="sr-only">{t('total')}: {formatNumber(data.opportunities.length, lang)} {t('opportunities')}</span>
              <ul tabIndex={0} aria-label={t('pipeline')} className="max-h-[125px] min-w-0 flex-1 space-y-1.5 overflow-y-auto pe-1">
                {pipeline.map((segment) => {
                  const label = `${statusLabel(segment.stage, t)}${segment.delayed ? ` · ${t('delayed')}` : ''}`;
                  return <li key={segment.key} className="flex min-w-0 items-center gap-1.5 text-[11px] text-slate-600"><span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: segment.color }} /><span className="min-w-0 flex-1 truncate" title={label}>{label}</span><span className="tnum shrink-0 font-semibold text-brand-600">{formatNumber(segment.count, lang)}</span><span dir="auto" className="tnum w-8 shrink-0 text-end text-[10px] text-slate-500">{formatPercentage(segment.percent, lang)}</span><span className="sr-only">{t('ofOpportunities')}</span></li>;
                })}
              </ul>
            </div>}
        </Card>
      </motion.div>

      <motion.div variants={sectionMotion} className="col-span-12 min-w-0">
        <Card className="flex min-w-0 items-center gap-3 px-3 py-2">
          <h2 className="hidden shrink-0 text-xs font-semibold text-brand-600 sm:block">{t('attention')}</h2>
          <div role="region" tabIndex={0} aria-label={t('attention')} className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto py-0.5">
            {attention.map((item) => { const Icon = item.icon; return <Link key={item.label} to={item.to} className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-100 bg-slate-50/70 px-2.5 py-1.5 text-xs text-slate-600 transition-colors hover:border-slate-200 hover:bg-white"><span className={cn('grid h-5 w-5 place-items-center rounded-md text-brand-600', item.tone)}><Icon size={12} /></span><span>{item.label}</span><span className="tnum font-semibold text-brand-600">{formatNumber(item.value, lang)}</span><ArrowUpRight size={12} className="text-slate-400" /></Link>; })}
          </div>
        </Card>
      </motion.div>

      <motion.div variants={sectionMotion} className="col-span-12 min-w-0 sm:col-span-6 xl:col-span-3">
        <Card className="h-full"><CardHeader title={t('tenders')} className="py-2.5" />
          <div className="grid grid-cols-2 gap-1.5 p-2.5">{[
            { label: t('total'), value: data.tenders.total }, { label: t('submitted'), value: data.tenders.submitted },
            { label: t('delayed'), value: data.tenders.delayed }, { label: t('noUpdate'), value: data.tenders.no_update },
          ].map((item) => <div key={item.label} className="rounded-lg bg-slate-50 px-2.5 py-1.5"><div className="text-[10px] font-medium text-slate-500">{item.label}</div><div className="tnum mt-0.5 text-base font-semibold leading-none text-brand-600">{formatNumber(item.value, lang)}</div></div>)}</div>
        </Card>
      </motion.div>
      <motion.div variants={sectionMotion} className="col-span-12 min-w-0 sm:col-span-6 xl:col-span-5">
        <Card className="h-full"><CardHeader title={t('upcomingMeetings')} className="py-2.5" action={<Link to="/meetings" className="shrink-0 text-xs font-semibold text-brand-600 hover:underline">{t('viewAll')}</Link>} />
          <ul className="max-h-[106px] divide-y divide-slate-100 overflow-y-auto" tabIndex={0} aria-label={t('upcomingMeetings')}>
            {data.meetings.length === 0 && <li className="flex flex-wrap items-center gap-2 px-4 py-4 text-xs text-slate-500"><Calendar size={15} className="shrink-0 text-slate-400" aria-hidden="true" /><span>{t('noMeetings')}</span>{quickActions.some((action) => action.key === 'meetings') && <button type="button" onClick={() => meetings.openCreate()} className="font-semibold text-brand-600 hover:underline">{t('newMeeting')}</button>}</li>}
            {data.meetings.map((meeting) => <li key={meeting.id} className="flex items-start gap-2 px-4 py-1.5"><span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-slate-50 text-brand-600"><Calendar size={12} /></span><div className="min-w-0"><div className="truncate text-xs font-semibold text-slate-800">{meeting.title}</div><div className="mt-0.5 text-[11px] leading-4 text-slate-500">{formatDateTime(meeting.starts_at, lang)} · {meeting.unit?.name ?? meeting.location ?? '—'}</div></div></li>)}
          </ul>
        </Card>
      </motion.div>
      <motion.div variants={sectionMotion} className="col-span-12 min-w-0 xl:col-span-4">
        <Card className="h-full"><CardHeader title={t('recentActivity')} className="py-2.5" />
          <ul className="max-h-[106px] divide-y divide-slate-100 overflow-y-auto" tabIndex={0} aria-label={t('recentActivity')}>
            {data.recent_activity.length === 0 && <li className="flex items-center gap-2 px-4 py-4 text-xs text-slate-500"><Clock3 size={15} className="shrink-0 text-slate-400" aria-hidden="true" />{t('noActivity')}</li>}
            {data.recent_activity.map((activity, index) => <li key={`${activity.type}-${activity.id}-${index}`} className="px-4 py-1.5"><div className="text-xs font-medium text-slate-800">{activity.event.replace(/\./g, ' · ')}</div><div className="mt-0.5 text-[11px] text-slate-500">{activity.by ?? '—'} · {timeAgo(activity.at, lang)}</div></li>)}
          </ul>
        </Card>
      </motion.div>

      <motion.div variants={sectionMotion} className="col-span-12 min-w-0">
        <Card><CardHeader title={t('openAlerts')} className="py-2.5" action={<Link to="/opportunities" className="text-xs font-semibold text-brand-600 hover:underline">{t('viewAll')}</Link>} />
          {flagged.length === 0 ? <p className="flex items-center gap-2 px-4 py-4 text-xs text-slate-500"><CheckCircle2 size={15} className="shrink-0 text-brand-600" aria-hidden="true" />{t('noData')}</p> : <div role="region" tabIndex={0} aria-label={t('openAlerts')} className="max-h-[148px] overflow-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50"><tr className="border-b border-slate-100 text-start text-[10px] uppercase tracking-wide text-slate-500">
                {[t('reference'), t('opportunities'), t('stage'), t('value'), t('owner'), t('updated')].map((heading) => <th key={heading} className="px-4 py-2 text-start font-semibold">{heading}</th>)}
              </tr></thead>
              <tbody>{flagged.map((opportunity) => <tr key={opportunity.id} className="border-b border-slate-100 last:border-0 transition-colors hover:bg-brand-50/60 focus-within:bg-brand-50/60">
                <td className="px-4 py-2 font-mono text-xs text-slate-500">{opportunity.reference}</td>
                <td className="px-4 py-2"><Link to={`/opportunities/${opportunity.id}`} className="font-semibold text-slate-800 hover:underline">{opportunity.title}</Link><div className="text-xs text-slate-500">{opportunity.client_name}</div></td>
                <td className="px-4 py-2"><div className="flex flex-wrap gap-1"><Badge tone={stageTone(opportunity.stage)}>{t(opportunity.stage as MsgKey)}</Badge>{opportunity.is_delayed && <Badge tone="danger">{t('delayed')}</Badge>}{opportunity.has_no_update && <Badge tone="warn">{t('noUpdate')}</Badge>}</div></td>
                <td className="tnum whitespace-nowrap px-4 py-2">{formatMoney(opportunity.value, opportunity.currency, lang)}</td><td className="px-4 py-2 text-slate-600">{displayName(opportunity.owner)}</td><td className="px-4 py-2 text-slate-500">{formatDate(opportunity.last_update_at, lang)}</td>
              </tr>)}</tbody>
            </table>
          </div>}
        </Card>
      </motion.div>
    </motion.div>
    {opportunities.dialogs}{plans.dialogs}{bonuses.dialogs}{meetings.dialogs}
  </>;
}
