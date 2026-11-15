import type { Transition } from 'framer-motion';

/** Shared, restrained interaction motion; no layout measurements are animated. */
export const interactionSpring: Transition = { type: 'spring', stiffness: 440, damping: 32, mass: 0.7 };
export const entranceTransition: Transition = { duration: 0.28, ease: 'easeOut' };

/** A quiet, bounded transform-only drift for the decorative dashboard orbits. */
export function heroFloat(reduced: boolean, direction: 1 | -1 = 1) {
  return reduced
    ? { animate: { y: 0 }, transition: { duration: 0 } }
    : { animate: { y: [0, -4 * direction, 0] }, transition: { duration: 0.6, ease: 'easeInOut' as const, repeat: 1, repeatDelay: 0.4 } };
}

/** A bounded acknowledgement, used only for attention counts greater than zero. */
export function attentionPulse(active: boolean, reduced: boolean, index = 0) {
  return active && !reduced
    ? { animate: { scale: [1, 1.08, 1] }, transition: { duration: 0.6, ease: 'easeInOut' as const, repeat: 1, repeatDelay: 0.7, delay: Math.min(Math.max(index, 0), 4) * 0.06 } }
    : { animate: { scale: 1 }, transition: { duration: 0 } };
}

// Recharts animates independently of Framer Motion and needs its own preference gate.
export function chartEntrance(reduced: boolean) {
  return { isAnimationActive: !reduced, animationBegin: 0, animationDuration: 550, animationEasing: 'ease-out' as const };
}

// Keep even unusually large tables/lists from starting an unbounded animation chain.
export const MAX_STAGGERED_ROWS = 8;
export const ROW_STAGGER_SECONDS = 0.035;

export function rowEntrance(index: number, reduced: boolean) {
  const animated = !reduced && index >= 0 && index < MAX_STAGGERED_ROWS;
  return {
    initial: animated ? { opacity: 0, y: 6 } : false as const,
    animate: { opacity: 1, y: 0 },
    transition: animated
      ? { duration: 0.24, ease: 'easeOut' as const, delay: index * ROW_STAGGER_SECONDS }
      : { duration: 0 },
  };
}
