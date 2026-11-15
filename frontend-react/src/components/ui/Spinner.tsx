import { cn } from '../../lib/utils';
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion';

export function Spinner({ className, label = 'Loading' }: { className?: string; label?: string }) {
  const reduceMotion = usePrefersReducedMotion();
  return (
    <div className={cn('flex items-center gap-3 text-slate-500', className)} role="status">
      <span aria-hidden="true" className={cn('h-4 w-4 rounded-full border-2 border-slate-200 border-t-brand-600', !reduceMotion && 'loading-spinner')} />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  const reduceMotion = usePrefersReducedMotion();
  return <div aria-hidden="true" className={cn('relative overflow-hidden rounded-lg bg-slate-100', !reduceMotion && 'skeleton-shimmer', className)} />;
}
