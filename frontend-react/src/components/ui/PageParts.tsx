import { motion } from 'framer-motion';
import { ArrowUpRight, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n, type MsgKey } from '../../i18n';
import { interactionSpring } from '../../lib/motion';
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion';
import { cn } from '../../lib/utils';
import { AnimatedValue } from './AnimatedValue';
import { Badge } from './Badge';
import { Card } from './Card';
import { statusLabel } from './DataTable';

export function MetricCards({ items }: { items: { label: string; value: string | number; hint?: string; icon: LucideIcon; tone?: 'indigo' | 'teal' | 'amber' | 'rose' }[] }) {
  const reduceMotion = usePrefersReducedMotion();
  const tones = { indigo: 'bg-brand-50 text-brand-600', teal: 'bg-turquoise/40 text-brand-600', amber: 'bg-skin/40 text-brand-600', rose: 'bg-pink/20 text-brand-600' };
  return <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">{items.map((item) => <motion.div key={item.label} className="min-w-0" whileHover={reduceMotion ? undefined : 'hover'}>
    <Card className="h-full p-4">
      <div className="flex items-start justify-between gap-3"><p className="text-[12px] font-medium text-slate-500">{item.label}</p><motion.span variants={{ hover: { scale: 1.12, rotate: -5 } }} animate={reduceMotion ? { scale: 1, rotate: 0 } : undefined} transition={reduceMotion ? { duration: 0 } : interactionSpring} className={cn('grid h-10 w-10 place-items-center rounded-xl', tones[item.tone ?? 'indigo'])}><item.icon size={17} strokeWidth={1.8} /></motion.span></div>
      <div className="tnum -mt-1 text-[25px] font-semibold tracking-tight text-slate-900"><AnimatedValue value={item.value} /></div>
      {item.hint && <p className="mt-1.5 text-xs text-slate-400">{item.hint}</p>}
    </Card>
  </motion.div>)}</div>;
}

export function StatusBadge({ status }: { status?: string | boolean | number | null }) {
  const { t } = useI18n();
  const value = typeof status === 'boolean' || typeof status === 'number' ? (status ? 'active' : 'inactive') : status ?? '';
  const tone = ['active', 'approved', 'paid', 'won', 'achieved', 'completed', 'hired', 'ready'].includes(value) ? 'success'
    : ['draft', 'inactive', 'not_done', 'closed', 'scheduled', 'submitted'].includes(value) ? 'neutral'
    : ['rejected', 'lost', 'declined', 'cancelled'].includes(value) ? 'danger'
    : ['pending', 'planning', 'with_hr'].includes(value) ? 'warn' : 'brand';
  return <Badge tone={tone} className="gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-normal"><span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />{value ? statusLabel(value, t) : '—'}</Badge>;
}

export function Breadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400">{items.map((item, index) => <span key={`${item.label}-${index}`} className="flex items-center gap-2">{index > 0 && <span className="text-slate-300">/</span>}{item.to ? <Link to={item.to} className="transition hover:text-brand-600">{item.label}</Link> : <span className="text-slate-600">{item.label}</span>}</span>)}</div>;
}

export function DetailField({ label, value }: { label: string; value?: React.ReactNode }) {
  return <div className="min-w-0"><dt className="text-[11px] font-medium text-slate-400">{label}</dt><dd className="mt-1 break-words text-sm font-medium text-slate-700">{value === null || value === undefined || value === '' ? '—' : value}</dd></div>;
}

export function SectionTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3"><div><h3 className="text-sm font-semibold text-slate-900">{title}</h3>{subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}</div>{action}</div>;
}
