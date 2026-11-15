import { Suspense, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion, useIsPresent } from 'framer-motion';
import { useEntranceValues, useExitMotionPreference } from '../../lib/useAccessibleMotion';
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion';
import { entranceTransition } from '../../lib/motion';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { LoadingState } from '../ui/States';

function RouteContent({ children }: { children: ReactNode }) {
  const reduceMotion = usePrefersReducedMotion();
  const isPresent = useIsPresent();
  const content = useRef<HTMLDivElement>(null);
  // An active entrance can snap to its final state; let an already-running exit
  // finish so the presence boundary can safely advance to the next route.
  const motionReduced = useExitMotionPreference(reduceMotion, isPresent);
  const values = useEntranceValues(reduceMotion && isPresent, reduceMotion ? false : { opacity: 0, y: 8 });
  useLayoutEffect(() => {
    const node = content.current;
    if (!node) return;
    if (!isPresent && node.contains(document.activeElement)) node.closest('main')?.focus({ preventScroll: true });
    node.inert = !isPresent;
    if (isPresent) node.removeAttribute('aria-hidden');
    else node.setAttribute('aria-hidden', 'true');
  }, [isPresent]);
  return <motion.div
    ref={content}
    className="min-w-0"
    style={values}
    initial={motionReduced ? false : { opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={motionReduced ? { opacity: 1, y: 0, transition: { duration: 0 } } : { opacity: 0, y: -6, transition: { duration: 0.2, ease: 'easeOut' } }}
    transition={motionReduced ? { duration: 0 } : entranceTransition}
  >
    <Suspense fallback={<LoadingState />}>{children}</Suspense>
  </motion.div>;
}

export function AppLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  // Capture the matched outlet so the exiting page does not render the new route.
  const outlet = useOutlet();
  return (
    <div className="flex min-h-full bg-surface">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenu={() => setOpen(true)} menuOpen={open} />
        {/* Clip horizontal overflow from transformed route content without creating a vertical scroll container. */}
        <main tabIndex={-1} className="mx-auto w-full max-w-[1600px] flex-1 overflow-x-clip px-4 py-5 sm:px-6 lg:px-7 lg:py-5">
          <AnimatePresence mode="wait">
            <RouteContent key={pathname}>{outlet}</RouteContent>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
