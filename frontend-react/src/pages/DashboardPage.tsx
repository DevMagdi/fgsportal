import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, type HTMLMotionProps, type Variants } from 'framer-motion';
import {
  AlertTriangle, ArrowRight, ArrowUpRight, BriefcaseBusiness, Building2, Calendar, CalendarCheck,
  CheckCircle2, ClipboardCheck, Clock3, Gift, Package, Pause, Play, ShoppingCart, TriangleAlert, type LucideIcon,
} from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import palette from '../brand.json';
import { api } from '../lib/api';
import { useAuth } from '../auth/AuthContext';
import { useI18n, type MsgKey } from '../i18n';
import { canQuickCreate, dashboardRatios, formatPercentage, percentage, pipelineSegments, type DashboardRatio, type PipelineSegment } from '../lib/dashboard';
import { pipelineDisplayColor, progressInk } from '../lib/dashboardVisuals';
import { attentionPulse, chartEntrance, interactionSpring, rowEntrance } from '../lib/motion';
import { useEntranceValues, useReducedMotionValue } from '../lib/useAccessibleMotion';
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion';
import type { UnitProgress } from '../lib/types';
import { formatDate, formatDateTime, formatMoney, formatNumber, timeAgo, cn } from '../lib/utils';
import { stageTone } from '../lib/catalog';
import { useEntityManager } from '../components/crud/useEntityManager';
import { Card, CardHeader } from '../components/ui/Card';
import { AnimatedValue } from '../components/ui/AnimatedValue';
import { CountUpValue } from '../components/ui/CountUpValue';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { statusLabel } from '../components/ui/DataTable';
import { PageHeader } from '../components/ui/PageHeader';
import { ErrorState } from '../components/ui/States';
import { Skeleton } from '../components/ui/Spinner';
import { displayName } from '../components/ui/Avatar';

const containerMotion: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.065 } } };
const sectionMotion: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: 'easeOut' } },
};
// Rows have their own bounded timeline, independent of a card's hover variants.
const listRowMotion: Variants = {
  hidden: (index: number) => rowEntrance(index, false).initial || { opacity: 1, y: 0 },
  visible: (index: number) => {
    const { animate: target, transition } = rowEntrance(index, false);
    return { ...target, transition };
  },
};

function DashboardSection({ reduced, ...props }: { reduced: boolean } & HTMLMotionProps<'div'>) {
  const values = useEntranceValues(reduced, reduced ? false : { opacity: 0, y: 16 });
  return <motion.div {...props} variants={sectionMotion} animate={reduced ? { opacity: 1, y: 0, transition: { duration: 0 } } : undefined} style={{ ...props.style, ...values }} />;
}

function DashboardLandmark({ reduced, ...props }: { reduced: boolean } & HTMLMotionProps<'section'>) {
  const values = useEntranceValues(reduced, reduced ? false : { opacity: 0, y: 16 });
  return <motion.section {...props} variants={sectionMotion} animate={reduced ? { opacity: 1, y: 0, transition: { duration: 0 } } : undefined} style={{ ...props.style, ...values }} />;
}

function DashboardRow({ as, index, reduced, className, children }: { as: 'div' | 'li' | 'tr'; index: number; reduced: boolean; className: string; children: ReactNode }) {
  const values = useEntranceValues(reduced, rowEntrance(index, reduced).initial);
  const props = { custom: index, variants: listRowMotion, initial: reduced ? false as const : 'hidden', animate: reduced ? { opacity: 1, y: 0, transition: { duration: 0 } } : 'visible', style: values, className, children };
  if (as === 'li') return <motion.li {...props} />;
  if (as === 'tr') return <motion.tr {...props} />;
  return <motion.div {...props} />;
}

function ProgressRing({ value, color }: { value: number | null; color: string }) {
  const reduceMotion = usePrefersReducedMotion();
  const circumference = 2 * Math.PI * 15;
  const fraction = value === null ? 0 : Math.max(0, Math.min(100, value)) / 100;
  const ring = { cx: 20, cy: 20, r: 15, fill: 'none', stroke: progressInk(color), strokeWidth: 3, strokeLinecap: 'round' as const, transform: 'rotate(-90 20 20)', strokeDasharray: circumference };
  return <svg aria-hidden="true" width="44" height="44" viewBox="0 0 40 40" className="shrink-0">
    <circle cx="20" cy="20" r="15" fill="none" stroke={palette.skin} strokeOpacity="0.55" strokeWidth="3" />
    {reduceMotion ? <circle {...ring} strokeDashoffset={circumference * (1 - fraction)} /> :
      <motion.circle {...ring} initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: circumference * (1 - fraction) }} transition={{ duration: 0.55, ease: 'easeOut' }} />}
  </svg>;
}

function FloatingOrbit({ paused, direction, className }: { paused: boolean; direction: 1 | -1; className: string }) {
  return <div aria-hidden="true" className={cn('dashboard-orbit', direction === -1 && 'dashboard-orbit--reverse', paused && 'dashboard-orbit--paused', className)} />;
}

function KpiRatio({ text, attention, reduced }: { text: string; attention: boolean; reduced: boolean }) {
  const scale = useReducedMotionValue(reduced, 1, 1);
  return <motion.span aria-hidden="true" style={{ scale }} initial={reduced || !attention ? false : { scale: 1 }} {...attentionPulse(attention, reduced)} className={cn(
    'tnum shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold leading-none text-brand-600',
    attention ? 'bg-pink/35' : 'bg-turquoise/45',
  )}>{text}</motion.span>;
}

type KpiProps = {
  label: string; value: number; denominator?: number; ratio: DashboardRatio; ratioLabel: string;
  attention?: boolean; icon: LucideIcon; color: string; iconTone?: string;
};

function HeroKpiCard({ label, value, denominator, ratio, ratioLabel, attention, icon: Icon, color, iconTone = 'bg-brand-50' }: KpiProps) {
  const { t, lang } = useI18n();
  const reduceMotion = usePrefersReducedMotion();
  const ratioText = ratio.percent === null ? t('noData') : `${formatNumber(ratio.count, lang)} / ${formatNumber(ratio.total, lang)} ${ratioLabel}`;
  return <motion.div
    variants={{ hover: { y: -5, scale: 1.015 } }}
    whileHover={reduceMotion ? undefined : 'hover'}
    animate={reduceMotion ? { y: 0, scale: 1 } : undefined}
    transition={reduceMotion ? { duration: 0 } : interactionSpring}
    className="h-full min-w-0 rounded-[18px] border border-white/90 bg-white/85 p-3.5 shadow-card sm:p-4"
  >
    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-2 gap-y-1.5 min-[480px]:grid-cols-[auto_minmax(0,1fr)_auto]">
      <motion.span variants={{ hover: { scale: 1.16, rotate: -7 } }} animate={reduceMotion ? { scale: 1, rotate: 0 } : undefined} transition={reduceMotion ? { duration: 0 } : interactionSpring} className={cn('col-start-1 row-start-1 grid h-8 w-8 shrink-0 place-items-center rounded-xl text-brand-600', iconTone)}><Icon size={16} strokeWidth={1.8} /></motion.span>
      {ratio.percent !== null && <div className="col-start-2 row-start-1 justify-self-end min-[480px]:col-start-3"><KpiRatio text={formatPercentage(ratio.percent, lang)} attention={Boolean(attention && ratio.count > 0)} reduced={reduceMotion} /></div>}
      <h3 className="col-span-2 col-start-1 row-start-2 min-w-0 text-xs font-semibold leading-4 text-slate-600 min-[480px]:col-span-1 min-[480px]:col-start-2 min-[480px]:row-start-1">{label}</h3>
    </div>
    <div className="mt-2 flex flex-wrap items-end justify-between gap-1">
      <div className="tnum max-w-full break-words text-[42px] font-semibold leading-none tracking-[-0.05em] text-brand-600 sm:text-[52px]"><CountUpValue value={value} lang={lang} />{denominator !== undefined && <span className="text-base font-medium tracking-normal text-slate-400"> / {formatNumber(denominator, lang)}</span>}</div>
      <ProgressRing value={ratio.percent} color={color} />
    </div>
    <p className="mt-1 text-[11px] leading-4 text-slate-500">{ratioText}{ratio.percent !== null && <span className="sr-only"> ({formatPercentage(ratio.percent, lang)})</span>}</p>
  </motion.div>;
}

function KpiCard({ label, value, denominator, ratio, ratioLabel, attention, icon: Icon, iconTone = 'bg-brand-50' }: KpiProps) {
  const { t, lang } = useI18n();
  const reduceMotion = usePrefersReducedMotion();
  const ratioText = ratio.percent === null ? t('noData') : `${formatNumber(ratio.count, lang)} / ${formatNumber(ratio.total, lang)} ${ratioLabel}`;
  return <motion.div
    variants={{ hover: { y: -4, scale: 1.015 } }}
    whileHover={reduceMotion ? undefined : 'hover'}
    animate={reduceMotion ? { y: 0, scale: 1 } : undefined}
    transition={reduceMotion ? { duration: 0 } : interactionSpring}
    className="h-full min-w-0 rounded-2xl border border-white/80 bg-white/65 px-3 py-2.5"
  >
    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-2 gap-y-1 min-[480px]:grid-cols-[auto_minmax(0,1fr)_auto] xl:max-2xl:gap-x-1.5">
      <motion.span variants={{ hover: { scale: 1.16, rotate: -7 } }} animate={reduceMotion ? { scale: 1, rotate: 0 } : undefined} transition={reduceMotion ? { duration: 0 } : interactionSpring} className={cn('col-start-1 row-start-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg text-brand-600 xl:max-2xl:h-6 xl:max-2xl:w-6', iconTone)}><Icon size={15} strokeWidth={1.8} /></motion.span>
      {ratio.percent !== null && <div className="col-start-2 row-start-1 justify-self-end min-[480px]:col-start-3"><KpiRatio text={formatPercentage(ratio.percent, lang)} attention={Boolean(attention && ratio.count > 0)} reduced={reduceMotion} /></div>}
      <h3 className="col-span-2 col-start-1 row-start-2 min-w-0 text-[11px] font-semibold leading-4 text-slate-600 min-[480px]:col-span-1 min-[480px]:col-start-2 min-[480px]:row-start-1">{label}</h3>
    </div>
    <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2">
      <div className="tnum max-w-full break-words text-[26px] font-semibold leading-none tracking-[-0.03em] text-brand-600"><CountUpValue value={value} lang={lang} />{denominator !== undefined && <span className="text-xs font-medium tracking-normal text-slate-400"> / {formatNumber(denominator, lang)}</span>}</div>
      <p className="min-w-0 flex-1 text-[11px] leading-4 text-slate-500">{ratioText}{ratio.percent !== null && <span className="sr-only"> ({formatPercentage(ratio.percent, lang)})</span>}</p>
    </div>
  </motion.div>;
}

function AttentionCount({ value, index, reduced, tone }: { value: number; index: number; reduced: boolean; tone: string }) {
  const { lang } = useI18n();
  const scale = useReducedMotionValue(reduced, 1, 1);
  return <motion.span style={{ scale }} initial={reduced || value <= 0 ? false : { scale: 1 }} {...attentionPulse(value > 0, reduced, index)} className={cn('tnum inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-1 text-[11px] font-semibold leading-none text-brand-600', value > 0 ? tone : 'bg-white')}><AnimatedValue value={formatNumber(value, lang)} /></motion.span>;
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
    <div className="space-y-2"><Skeleton className="h-3 w-28" /><Skeleton className="h-8 w-60 max-w-full" /><Skeleton className="h-4 w-80 max-w-full" /></div>
    <Skeleton className="h-9 w-96 max-w-full" />
    <div className="grid gap-4 rounded-[24px] border border-slate-200/70 bg-white p-4 shadow-card xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <div className="min-w-0"><Skeleton className="h-4 w-28" /><Skeleton className="mt-3 h-7 w-56 max-w-full" /><Skeleton className="mt-2 h-3 w-72 max-w-full" /><div className="mt-4 grid grid-cols-1 gap-2.5 min-[360px]:grid-cols-2"><Skeleton className="h-36 w-full" /><Skeleton className="h-36 w-full" /></div><div className="mt-2.5 grid grid-cols-3 gap-2.5">{[0, 1, 2].map((item) => <Skeleton key={item} className="h-20 w-full" />)}</div></div>
      <div className="min-w-0 rounded-2xl border border-slate-100 p-4"><Skeleton className="h-4 w-28" /><div className="mt-6 flex items-center gap-4"><Skeleton className="h-36 w-36 shrink-0 rounded-full" /><div className="flex-1 space-y-3"><Skeleton className="h-3 w-full" /><Skeleton className="h-3 w-full" /><Skeleton className="h-3 w-full" /><Skeleton className="h-3 w-full" /></div></div></div>
    </div>
    <Skeleton className="h-14 w-full" /><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[0, 1, 2, 3].map((item) => <Skeleton key={item} className="h-40 w-full" />)}</div><Skeleton className="h-36 w-full" />
    <span className="sr-only">{t('loading')}</span>
  </div>;
}

export function DashboardPage() {
  const { t, lang } = useI18n();
  const { lookups, abilities } = useAuth();
  const reduceMotion = usePrefersReducedMotion();
  const [unit, setUnit] = useState('');
  const [product, setProduct] = useState('');
  const [ambientPaused, setAmbientPaused] = useState(false);
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
  const attention = [
    { label: t('delayedOpps'), value: s.delayed_opportunities, icon: TriangleAlert, tone: 'bg-pink/35', to: '/opportunities?alert=delayed' },
    { label: t('staleOpps'), value: s.stale_opportunities, icon: Clock3, tone: 'bg-skin/45', to: '/opportunities?alert=no_update' },
    { label: t('overdueTasks'), value: s.overdue_tasks, icon: AlertTriangle, tone: 'bg-pink/35', to: '/my-tasks' },
    { label: t('pendingProc'), value: s.pending_procurement, icon: ShoppingCart, tone: 'bg-turquoise/45', to: '/procurement' },
    { label: t('blockedTasks'), value: s.blocked_tasks, icon: AlertTriangle, tone: 'bg-skin/45', to: '/plans' },
  ];
  const primaryKpis: KpiProps[] = [
    { label: t('kpiOpps'), value: s.opportunities, ratio: ratios.opportunities, ratioLabel: t('opportunitiesDelayed'), attention: true, icon: BriefcaseBusiness, color: palette.pink, iconTone: 'bg-pink/25' },
    { label: t('kpiTasks'), value: s.achieved, denominator: s.tasks, ratio: ratios.tasks, ratioLabel: t('tasksCompleted'), icon: ClipboardCheck, color: palette.turquoise, iconTone: 'bg-turquoise/40' },
  ];
  const secondaryKpis: KpiProps[] = [
    { label: t('totalUnits'), value: s.units, ratio: ratios.units, ratioLabel: t('unitsWithTasks'), icon: Building2, color: palette.indigo, iconTone: 'bg-skin/35' },
    { label: t('kpiProducts'), value: s.products, ratio: ratios.products, ratioLabel: t('productsWithPhase'), icon: Package, color: palette.violet, iconTone: 'bg-violet/25' },
    { label: t('upcomingMeetings'), value: s.upcoming_meetings, ratio: ratios.meetings, ratioLabel: t('meetingsWithUnit'), icon: Calendar, color: palette.cyan, iconTone: 'bg-cyan/30' },
  ];
  const quickActions = [
    { key: 'opportunities', label: t('newOpportunity'), icon: BriefcaseBusiness, manager: opportunities, visible: canQuickCreate(abilities, 'opportunities.view', opportunities.canManage) },
    { key: 'plans', label: t('newWeeklyPlan'), icon: CalendarCheck, manager: plans, visible: canQuickCreate(abilities, 'plans.view', plans.canManage) },
    { key: 'bonuses', label: t('addBonus'), icon: Gift, manager: bonuses, visible: canQuickCreate(abilities, 'bonuses.view', bonuses.canManage) },
    { key: 'meetings', label: t('newMeeting'), icon: Calendar, manager: meetings, visible: canQuickCreate(abilities, 'meetings.view', meetings.canManage) },
  ].filter((action) => action.visible);
  const flagged = data.opportunities.filter((opportunity) => opportunity.is_delayed || opportunity.has_no_update).slice(0, 6);
  return <>
    <motion.div data-dashboard className="grid grid-cols-12 gap-2.5" variants={containerMotion} initial={reduceMotion ? false : 'hidden'} animate="visible">
      <DashboardSection reduced={reduceMotion} className="col-span-12">
        <PageHeader eyebrow={t('workspaceOverview')} title={t('dashboard')} subtitle={t('dashboardSub')} actions={<>
          <p className="w-full text-xs text-slate-500 sm:w-auto">{t('generated')} {formatDateTime(data.generated_at, lang)}</p>
          <select aria-label={t('unit')} value={unit} onChange={(event) => setUnit(event.target.value)} className="h-10 w-[calc(50vw-24px)] max-w-[180px] rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 shadow-sm sm:w-auto">
            <option value="">{t('allUnits')}</option>{lookups?.units.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <select aria-label={t('product')} value={product} onChange={(event) => setProduct(event.target.value)} className="h-10 w-[calc(50vw-24px)] max-w-[180px] rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 shadow-sm sm:w-auto">
            <option value="">{t('allProducts')}</option>{lookups?.products.map((item) => <option key={item.id} value={item.id}>{item.product_name}</option>)}
          </select>
        </>} />
      </DashboardSection>

      {quickActions.length > 0 && <DashboardLandmark reduced={reduceMotion} aria-label={t('quickActions')} className="col-span-12 flex min-w-0 items-center gap-3">
        <h2 className="hidden shrink-0 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500 sm:block">{t('quickActions')}</h2>
        <div role="region" aria-label={t('quickActions')} tabIndex={0} className="flex min-w-0 items-center gap-2 overflow-x-auto py-1">
          {quickActions.map((action) => <Button key={action.key} size="sm" variant={action.key === 'opportunities' ? 'primary' : 'secondary'} className="h-9 shrink-0 rounded-xl" onClick={() => action.manager.openCreate()}><action.icon size={14} strokeWidth={1.8} />{action.label}</Button>)}
        </div>
      </DashboardLandmark>}

      <DashboardSection reduced={reduceMotion} className="col-span-12 min-w-0">
        <section className="dashboard-hero relative overflow-hidden rounded-[24px] border border-white/90 p-4 text-brand-600 shadow-card">
          <FloatingOrbit paused={reduceMotion || ambientPaused} direction={1} className="pointer-events-none absolute -top-32 start-[24%] h-72 w-72 rounded-full border border-violet/40" />
          <FloatingOrbit paused={reduceMotion || ambientPaused} direction={-1} className="pointer-events-none absolute -top-20 start-[31%] h-52 w-52 rounded-full border border-violet/40" />
          <div className="relative grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div className="min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-600"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-600" />{api.demo ? t('demoWorkspace') : t('liveOverview')}</span>
                  <h2 className="mt-2 text-[22px] font-semibold leading-tight tracking-[-0.03em] sm:text-[25px]">{t('workspaceHealth')}</h2>
                  <p className="mt-1 max-w-lg text-xs leading-5 text-slate-500 sm:text-[13px]">{t('overviewSubtitle')}</p>
                </div>
                {!reduceMotion && <button type="button" aria-label={t('pauseMotion')} title={ambientPaused ? t('resumeMotion') : t('pauseMotion')} aria-pressed={ambientPaused} onClick={() => setAmbientPaused((paused) => !paused)} className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white bg-white/70 text-brand-600 transition-colors hover:bg-white motion-reduce:transition-none">{ambientPaused ? <Play size={13} /> : <Pause size={13} />}</button>}
              </div>
              <motion.div variants={containerMotion} className="mt-3 grid grid-cols-1 gap-2.5 min-[360px]:grid-cols-2">
                {primaryKpis.map((item) => <DashboardSection key={item.label} reduced={reduceMotion} className="min-w-0"><HeroKpiCard {...item} /></DashboardSection>)}
              </motion.div>
              <motion.div variants={containerMotion} className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {secondaryKpis.map((item, index) => <DashboardSection key={item.label} reduced={reduceMotion} className={cn('min-w-0', index === secondaryKpis.length - 1 && 'col-span-2 sm:col-span-1')}><KpiCard {...item} /></DashboardSection>)}
              </motion.div>
            </div>

            <Card scaleOnHover={false} className="flex h-full min-w-0 flex-col"><CardHeader title={t('pipeline')} subtitle={t('opportunities')} className="px-4 py-3 sm:px-5" action={<Link to="/opportunities" className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline">{t('viewFullPipeline')}<ArrowRight size={14} className="rtl:rotate-180" /></Link>} />
              {pipeline.length === 0 ? <div className="flex min-h-[180px] flex-1 flex-col items-center justify-center gap-2 text-xs text-slate-500"><BriefcaseBusiness size={20} className="text-slate-400" aria-hidden="true" />{t('noData')}</div> :
                <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-3 min-[480px]:flex-row sm:px-5">
                  <div dir="ltr" aria-hidden="true" className="relative h-[170px] w-[170px] shrink-0 sm:h-[190px] sm:w-[190px]">
                    <span className="pointer-events-none absolute inset-[9%] rounded-full border border-slate-100" />
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart accessibilityLayer={false}><Pie data={pipeline} dataKey="count" nameKey="key" rootTabIndex={-1} cx="50%" cy="50%" innerRadius="62%" outerRadius="88%" paddingAngle={pipeline.length > 1 ? 2 : 0} stroke={palette.white} strokeWidth={1} {...chartEntrance(reduceMotion)}>
                        {pipeline.map((segment) => <Cell key={segment.key} fill={pipelineDisplayColor(segment)} />)}
                      </Pie><Tooltip content={<PipelineTooltip />} /></PieChart>
                    </ResponsiveContainer>
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center"><span className="tnum text-[38px] font-semibold leading-none tracking-[-0.05em] text-brand-600"><CountUpValue value={data.opportunities.length} lang={lang} /></span><span className="mt-1 text-[11px] font-medium text-slate-500">{t('total')}</span></div>
                  </div>
                  <span className="sr-only">{t('total')}: {formatNumber(data.opportunities.length, lang)} {t('opportunities')}</span>
                  <ul tabIndex={0} aria-label={t('pipeline')} className="max-h-[190px] w-full min-w-0 flex-1 space-y-1 overflow-y-auto pe-1">
                    {pipeline.map((segment) => {
                      const label = `${statusLabel(segment.stage, t)}${segment.delayed ? ` · ${t('delayed')}` : ''}`;
                      return <li key={segment.key} className="flex min-w-0 items-center gap-2 rounded-lg px-1 py-0.5 text-xs leading-4 text-slate-600"><span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: pipelineDisplayColor(segment) }} /><span className="min-w-0 flex-1 truncate" title={label}>{label}</span><span className="tnum shrink-0 font-semibold text-brand-600">{formatNumber(segment.count, lang)}</span><span dir="auto" className="tnum w-9 shrink-0 text-end text-[11px] text-slate-500">{formatPercentage(segment.percent, lang)}</span><span className="sr-only">{t('ofOpportunities')}</span></li>;
                    })}
                  </ul>
                </div>}
            </Card>
          </div>
        </section>
      </DashboardSection>

      <DashboardSection reduced={reduceMotion} className="col-span-12 min-w-0">
        <Card className="flex min-w-0 flex-col gap-2 px-4 py-2 sm:flex-row sm:items-center sm:gap-4">
          <h2 className="flex shrink-0 items-center gap-2 text-xs font-semibold text-brand-600"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-pink" />{t('attention')}</h2>
          <div role="region" tabIndex={0} aria-label={t('attention')} className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto py-1">
            {attention.map((item, index) => { const Icon = item.icon; return <DashboardRow as="div" key={item.label} index={index} reduced={reduceMotion} className="shrink-0"><Link to={item.to} className="flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50/70 px-2 py-1.5 text-xs text-slate-600 transition-colors hover:border-slate-200 hover:bg-white motion-reduce:transition-none"><span className={cn('grid h-5 w-5 place-items-center rounded-md text-brand-600', item.tone)}><Icon size={12} /></span><span>{item.label}</span><AttentionCount value={item.value} index={index} reduced={reduceMotion} tone={item.tone} /><ArrowUpRight size={12} className="text-slate-400 rtl:-scale-x-100" /></Link></DashboardRow>; })}
          </div>
        </Card>
      </DashboardSection>

      <DashboardSection reduced={reduceMotion} className="col-span-12 min-w-0 sm:col-span-6 xl:col-span-3">
        <Card scaleOnHover={false} className="h-full min-w-0"><CardHeader title={t('unitProgress')} subtitle={t('averageProgress')} className="py-2.5" />
          {data.unit_progress.length === 0 ? <div className="flex h-[100px] flex-col items-center justify-center gap-2 text-xs text-slate-500"><Building2 size={18} className="text-slate-400" aria-hidden="true" />{t('noData')}</div> : <>
            <div dir="ltr" role="region" tabIndex={0} aria-label={t('unitProgress')} className="h-[100px] overflow-x-auto px-2 py-1">
              <div aria-hidden="true" className="h-full" style={{ minWidth: `${Math.max(180, data.unit_progress.length * 68)}px` }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.unit_progress} accessibilityLayer={false} margin={{ left: 4, right: 10, top: 4, bottom: 0 }}>
                    <CartesianGrid stroke={palette.skin} strokeOpacity={0.5} vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} interval={0} height={32} tickFormatter={(name: string) => name.length > 12 ? `${name.slice(0, 11)}…` : name} />
                    <YAxis domain={[0, 100]} tickLine={false} axisLine={false} width={40} tickFormatter={(value: number) => formatPercentage(value, lang)} />
                    <Tooltip content={<UnitTooltip totalTasks={totalUnitTasks} />} cursor={{ fill: palette.skin, opacity: 0.12 }} />
                    <Bar dataKey="progress" name={t('progress')} fill={palette.indigo} radius={[5, 5, 0, 0]} barSize={14} {...chartEntrance(reduceMotion)} />
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
      </DashboardSection>
      <DashboardSection reduced={reduceMotion} className="col-span-12 min-w-0 sm:col-span-6 xl:col-span-3">
        <Card className="h-full"><CardHeader title={t('tenders')} className="py-2.5" />
          <div className="grid grid-cols-2 gap-2 p-2.5">{[
            { label: t('total'), value: data.tenders.total }, { label: t('submitted'), value: data.tenders.submitted },
            { label: t('delayed'), value: data.tenders.delayed }, { label: t('noUpdate'), value: data.tenders.no_update },
          ].map((item) => <div key={item.label} className="rounded-xl bg-slate-50 px-3 py-1.5"><div className="text-[10px] font-medium text-slate-500">{item.label}</div><div className="tnum mt-0.5 text-base font-semibold leading-none text-brand-600">{formatNumber(item.value, lang)}</div></div>)}</div>
        </Card>
      </DashboardSection>
      <DashboardSection reduced={reduceMotion} className="col-span-12 min-w-0 sm:col-span-6 xl:col-span-3">
        <Card className="h-full"><CardHeader title={t('upcomingMeetings')} className="py-2.5" action={<Link to="/meetings" className="shrink-0 text-xs font-semibold text-brand-600 hover:underline">{t('viewAll')}</Link>} />
          <ul className="max-h-[94px] divide-y divide-slate-100 overflow-y-auto" tabIndex={0} aria-label={t('upcomingMeetings')}>
            {data.meetings.length === 0 && <li className="flex flex-wrap items-center gap-2 px-4 py-4 text-xs text-slate-500"><Calendar size={15} className="shrink-0 text-slate-400" aria-hidden="true" /><span>{t('noMeetings')}</span>{quickActions.some((action) => action.key === 'meetings') && <button type="button" onClick={() => meetings.openCreate()} className="font-semibold text-brand-600 hover:underline">{t('newMeeting')}</button>}</li>}
            {data.meetings.map((meeting, index) => <DashboardRow as="li" key={meeting.id} index={index} reduced={reduceMotion} className="flex items-start gap-2 px-4 py-1.5"><span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-turquoise/30 text-brand-600"><Calendar size={12} /></span><div className="min-w-0"><div className="truncate text-xs font-semibold text-slate-800">{meeting.title}</div><div className="mt-0.5 text-[11px] leading-4 text-slate-500">{formatDateTime(meeting.starts_at, lang)} · {meeting.unit?.name ?? meeting.location ?? '—'}</div></div></DashboardRow>)}
          </ul>
        </Card>
      </DashboardSection>
      <DashboardSection reduced={reduceMotion} className="col-span-12 min-w-0 sm:col-span-6 xl:col-span-3">
        <Card className="h-full"><CardHeader title={t('recentActivity')} className="py-2.5" />
          <ul className="max-h-[94px] divide-y divide-slate-100 overflow-y-auto" tabIndex={0} aria-label={t('recentActivity')}>
            {data.recent_activity.length === 0 && <li className="flex items-center gap-2 px-4 py-4 text-xs text-slate-500"><Clock3 size={15} className="shrink-0 text-slate-400" aria-hidden="true" />{t('noActivity')}</li>}
            {data.recent_activity.map((activity, index) => <DashboardRow as="li" key={`${activity.type}-${activity.id}-${index}`} index={index} reduced={reduceMotion} className="px-4 py-1.5"><div className="text-xs font-medium text-slate-800">{activity.event.replace(/\./g, ' · ')}</div><div className="mt-0.5 text-[11px] text-slate-500">{activity.by ?? '—'} · {timeAgo(activity.at, lang)}</div></DashboardRow>)}
          </ul>
        </Card>
      </DashboardSection>

      <DashboardSection reduced={reduceMotion} className="col-span-12 min-w-0">
        <Card><CardHeader title={t('openAlerts')} className="py-2.5" action={<Link to="/opportunities" className="text-xs font-semibold text-brand-600 hover:underline">{t('viewAll')}</Link>} />
          {flagged.length === 0 ? <p className="flex items-center gap-2 px-4 py-4 text-xs text-slate-500"><CheckCircle2 size={15} className="shrink-0 text-brand-600" aria-hidden="true" />{t('noData')}</p> : <div role="region" tabIndex={0} aria-label={t('openAlerts')} className="max-h-[148px] overflow-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50"><tr className="border-b border-slate-100 text-start text-[10px] uppercase tracking-wide text-slate-500">
                {[t('reference'), t('opportunities'), t('stage'), t('value'), t('owner'), t('updated')].map((heading) => <th key={heading} className="px-4 py-2 text-start font-semibold">{heading}</th>)}
              </tr></thead>
              <tbody>{flagged.map((opportunity, index) => <DashboardRow as="tr" key={opportunity.id} index={index} reduced={reduceMotion} className="border-b border-slate-100 last:border-0 transition-colors hover:bg-brand-50/60 focus-within:bg-brand-50/60 motion-reduce:transition-none">
                <td className="px-4 py-2 font-mono text-xs text-slate-500">{opportunity.reference}</td>
                <td className="px-4 py-2"><Link to={`/opportunities/${opportunity.id}`} className="font-semibold text-slate-800 hover:underline">{opportunity.title}</Link><div className="text-xs text-slate-500">{opportunity.client_name}</div></td>
                <td className="px-4 py-2"><div className="flex flex-wrap gap-1"><Badge tone={stageTone(opportunity.stage)}>{t(opportunity.stage as MsgKey)}</Badge>{opportunity.is_delayed && <Badge tone="danger">{t('delayed')}</Badge>}{opportunity.has_no_update && <Badge tone="warn">{t('noUpdate')}</Badge>}</div></td>
                <td className="tnum whitespace-nowrap px-4 py-2">{formatMoney(opportunity.value, opportunity.currency, lang)}</td><td className="px-4 py-2 text-slate-600">{displayName(opportunity.owner)}</td><td className="px-4 py-2 text-slate-500">{formatDate(opportunity.last_update_at, lang)}</td>
              </DashboardRow>)}</tbody>
            </table>
          </div>}
        </Card>
      </DashboardSection>
    </motion.div>
    {opportunities.dialogs}{plans.dialogs}{bonuses.dialogs}{meetings.dialogs}
  </>;
}
