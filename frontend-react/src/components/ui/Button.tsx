import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';
import { interactionSpring } from '../../lib/motion';
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonProps = Omit<HTMLMotionProps<'button'>, 'size'> & { variant?: Variant; size?: 'sm' | 'md' };

const styles: Record<Variant, string> = {
  primary: 'bg-brand-600 text-white shadow-card hover:shadow-lift',
  secondary: 'border border-slate-200 bg-white text-brand-600 shadow-sm hover:border-brand-200 hover:bg-brand-50/50',
  ghost: 'text-slate-600 hover:bg-slate-100',
  danger: 'border border-pink/60 bg-pink/30 text-brand-600 hover:bg-pink/50',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', disabled, ...props }, ref) => {
    const reduceMotion = usePrefersReducedMotion();
    return <motion.button
      {...props}
      ref={ref}
      disabled={disabled}
      animate={reduceMotion ? { y: 0, scale: 1 } : undefined}
      whileHover={reduceMotion || disabled ? undefined : { y: -2 }}
      whileTap={reduceMotion || disabled ? undefined : { scale: 0.95 }}
      transition={reduceMotion ? { duration: 0 } : interactionSpring}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-colors duration-200 focus-visible:ring-4 focus-visible:ring-brand-500/20 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none',
        size === 'sm' ? 'h-8 px-3 text-xs' : 'h-10 px-4 text-sm',
        styles[variant],
        className,
      )}
    />;
  },
);
Button.displayName = 'Button';
