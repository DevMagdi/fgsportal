import { ArrowUpRight, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n, type MsgKey } from '../../i18n';
import { cn } from '../../lib/utils';
import { Badge } from './Badge';
import { statusLabel } from './DataTable';

export function MetricCards({ items }: { items: { label: string; value: string | number; hint?: string; icon: LucideIcon; tone?: 'indigo' | 'teal' | 'amber' | 'rose' }[] }) {
  const tones = { indigo: 'bg-indigo-50 text-indigo-600', teal: 'bg-teal-50 text-teal-600', amber: 'bg-amber-50 text-amber-600', rose: 'bg-rose-50 text-rose-600' };
  return <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">{items.map((item) => <div key={item.label} className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-card">
    <div className="flex items-start justify-between gap-3"><p className="text-[12px] font-medium text-slate-500">{item.label}</p><span className={cn('grid h-9 w-9 place-items-center rounded-lg', tones[item.tone ?? 'indigo'])}><item.icon size={17} strokeWidth={1.8} /></span></div>
    <div className="tnum -mt-1 text-[25px] font-semibold tracking-tight text-slate-900">{item.value}</div>
    {item.hint && <p className="mt-1.5 text-xs text-slate-400">{item.hint}</p>}
  </div>)}</div>;
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
  return <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400">{items.map((item, index) => <span key={`${item.label}-${index}`} className="flex items-center gap-2">{index > 0 && <span className="text-slate-300">/</span>}{item.to ? <Link to={item.to} className="transition hover:text-brand-600">{item.label}</Link> : <span className="text-slate-600">{item.label}</span>}</span>)}</div>;
}

export function DetailField({ label, value }: { label: string; value?: React.ReactNode }) {
  return <div className="min-w-0"><dt className="text-[11px] font-medium text-slate-400">{label}</dt><dd className="mt-1.5 break-words text-sm font-medium text-slate-700">{value === null || value === undefined || value === '' ? '—' : value}</dd></div>;
}

export function SectionTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4"><div><h3 className="text-sm font-semibold text-slate-900">{title}</h3>{subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}</div>{action}</div>;
}
