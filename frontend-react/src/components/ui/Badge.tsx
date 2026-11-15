import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useReducedMotionValue } from '../../lib/useAccessibleMotion';
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion';
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

function AttentionBadge({ children, className }: { children: React.ReactNode; className: string }) {
  const reduceMotion = usePrefersReducedMotion();
  const opacity = useReducedMotionValue(reduceMotion, reduceMotion ? 1 : 0, 1);
  const scale = useReducedMotionValue(reduceMotion, reduceMotion ? 1 : 0.96, 1);
  return <motion.span
    style={{ opacity, scale }}
    initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={reduceMotion ? { duration: 0 } : { duration: 0.24, ease: 'easeOut' }}
    className={className}
  >{children}</motion.span>;
}

export function Badge({ children, tone = 'neutral', className }: { children: React.ReactNode; tone?: Tone | string; className?: string }) {
  const classes = cn('inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide', tones[tone] ?? tones.neutral, className);
  // Attention is acknowledged once rather than pulsing indefinitely.
  if (tone === 'danger' || tone === 'warn') return <AttentionBadge className={classes}>{children}</AttentionBadge>;
  return <span className={classes}>{children}</span>;
}
