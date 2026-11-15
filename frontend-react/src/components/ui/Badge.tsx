import { cn } from '../../lib/utils';
import type { stageTone } from '../../lib/catalog';

type Tone = ReturnType<typeof stageTone> | 'teal' | 'amber';

// Secondary brand colours are reserved for small status highlights.
const tones: Record<string, string> = {
  neutral: 'bg-slate-100 text-brand-600',
  brand: 'bg-brand-50 text-brand-700',
  accent: 'bg-cyan/35 text-brand-600',
  warn: 'bg-skin/50 text-brand-600',
  danger: 'bg-pink/35 text-brand-600',
  success: 'bg-turquoise/55 text-brand-600',
  teal: 'bg-turquoise/55 text-brand-600',
  amber: 'bg-skin/50 text-brand-600',
};

export function Badge({ children, tone = 'neutral', className }: { children: React.ReactNode; tone?: Tone | string; className?: string }) {
  return (
    <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide', tones[tone] ?? tones.neutral, className)}>
      {children}
    </span>
  );
}
