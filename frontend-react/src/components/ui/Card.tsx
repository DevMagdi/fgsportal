import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { interactionSpring } from '../../lib/motion';
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion';

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  const reduceMotion = usePrefersReducedMotion();
  return (
    <motion.div
      animate={reduceMotion ? { y: 0 } : undefined}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      transition={reduceMotion ? { duration: 0 } : interactionSpring}
      className={cn('rounded-xl border border-slate-200/80 bg-white shadow-card transition-shadow duration-200 hover:shadow-lift motion-reduce:transition-none', className)}
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
