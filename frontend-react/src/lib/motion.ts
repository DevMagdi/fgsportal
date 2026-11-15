import type { Transition } from 'framer-motion';

/** Shared, restrained interaction motion; no layout measurements are animated. */
export const interactionSpring: Transition = { type: 'spring', stiffness: 440, damping: 32, mass: 0.7 };
export const entranceTransition: Transition = { duration: 0.28, ease: 'easeOut' };

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
