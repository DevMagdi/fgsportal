import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { interactionSpring } from '../../lib/motion';
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion';

// Responsive chart containers opt out of scaling so their measurements stay stable.
export function Card({ className, children, scaleOnHover = true }: { className?: string; children: React.ReactNode; scaleOnHover?: boolean }) {
  const reduceMotion = usePrefersReducedMotion();
  return (
    <motion.div
      variants={{ hover: { y: -3, scale: scaleOnHover ? 1.005 : 1 } }}
      animate={reduceMotion ? { y: 0, scale: 1 } : undefined}
      whileHover={reduceMotion ? undefined : 'hover'}
      transition={reduceMotion ? { duration: 0 } : interactionSpring}
      className={cn('rounded-2xl border border-slate-200/70 bg-white shadow-card transition-shadow duration-200 hover:shadow-lift motion-reduce:transition-none', className)}
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
