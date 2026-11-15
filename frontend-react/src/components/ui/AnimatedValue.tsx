import { AnimatePresence, motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion';

/** A single accessible value, with a small visual transition only when it changes. */
export function AnimatedValue({ value }: { value: string | number }) {
  const reduceMotion = usePrefersReducedMotion();
  if (reduceMotion) return <span>{value}</span>;

  // Anchor the screen-reader copy inside the value, including in horizontal scrollers.
  return <span className="relative inline-grid align-baseline">
    <span className="sr-only">{value}</span>
    <AnimatePresence initial={false}>
      <motion.span
        key={`${typeof value}:${value}`}
        aria-hidden="true"
        style={{ gridArea: '1 / 1' }}
        initial={{ opacity: 0, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -3 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >{value}</motion.span>
    </AnimatePresence>
  </span>;
}
