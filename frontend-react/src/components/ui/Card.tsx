import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion';

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  const reduceMotion = usePrefersReducedMotion();
  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -2 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={cn('rounded-xl border border-slate-200/80 bg-white shadow-card transition-shadow hover:shadow-lift', className)}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ title, subtitle, action, className }: { title: string; subtitle?: string; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3', className)}>
      <div>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
