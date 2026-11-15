import { cn } from '../../lib/utils';
import type { stageTone } from '../../lib/catalog';

type Tone = ReturnType<typeof stageTone> | 'teal' | 'amber';

const tones: Record<string, string> = {
  neutral: 'bg-slate-100 text-slate-600',
  brand: 'bg-brand-50 text-brand-700',
  accent: 'bg-teal-50 text-teal-700',
  warn: 'bg-amber-50 text-amber-800',
  danger: 'bg-rose-50 text-rose-700',
  success: 'bg-emerald-50 text-emerald-700',
  teal: 'bg-teal-50 text-teal-700',
  amber: 'bg-amber-50 text-amber-800',
};

export function Badge({ children, tone = 'neutral', className }: { children: React.ReactNode; tone?: Tone | string; className?: string }) {
  return (
    <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide', tones[tone] ?? tones.neutral, className)}>
      {children}
    </span>
  );
}
