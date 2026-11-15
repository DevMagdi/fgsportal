import { useLayoutEffect, useRef } from 'react';
import { useMotionValue } from 'framer-motion';

/**
 * Keep the last committed preference while exiting. Retargeting an exit can
 * cancel the animation completion that its presence boundary is waiting for.
 */
export function useExitMotionPreference(reduced: boolean, isPresent: boolean) {
  const lastPresent = useRef(reduced);
  useLayoutEffect(() => { if (isPresent) lastPresent.current = reduced; }, [isPresent, reduced]);
  return isPresent ? reduced : lastPresent.current;
}

/** Snap a running motion value to its target when the OS preference changes. */
export function useReducedMotionValue(reduced: boolean, initial: number, target: number) {
  const value = useMotionValue(initial);

  useLayoutEffect(() => {
    if (!reduced) return;
    value.stop();
    value.set(target);
  }, [reduced, target, value]);

  return value;
}

/** Stop an in-flight opacity/vertical entrance without remounting its contents. */
export function useEntranceValues(reduced: boolean, initial: { opacity: number; y: number } | false) {
  const opacity = useReducedMotionValue(reduced, initial ? initial.opacity : 1, 1);
  const y = useReducedMotionValue(reduced, initial ? initial.y : 0, 0);
  return { opacity, y };
}
