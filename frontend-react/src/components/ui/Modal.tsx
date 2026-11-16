import { useEffect, useId, useLayoutEffect, useRef, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useIsPresent } from 'framer-motion';
import { X } from 'lucide-react';
import { useI18n } from '../../i18n';
import { focusDialogStart } from '../../lib/dialogFocus';
import { useEntranceValues, useExitMotionPreference, useReducedMotionValue } from '../../lib/useAccessibleMotion';
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion';
import { cn } from '../../lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: 'md' | 'lg';
  drawer?: boolean;
  busy?: boolean;
  /** Use the caller's presence boundary when the entire dialog is conditionally mounted. */
  parentPresence?: boolean;
}

interface ModalLayerProps extends Omit<ModalProps, 'open' | 'parentPresence'> {
  panel: RefObject<HTMLDivElement>;
  titleId: string;
  descriptionId: string;
  dir: 'ltr' | 'rtl';
  closeLabel: string;
}

function ModalLayer({ onClose, title, description, children, size, drawer, busy, panel, titleId, descriptionId, dir, closeLabel }: ModalLayerProps) {
  const reduced = usePrefersReducedMotion();
  const isPresent = useIsPresent();
  const layer = useRef<HTMLDivElement>(null);
  // Do not interrupt an exit that the surrounding presence boundary is awaiting.
  const motionReduced = useExitMotionPreference(reduced, isPresent);
  const snapEntrance = reduced && isPresent;
  const entrance = useEntranceValues(snapEntrance, reduced ? false : { opacity: 0, y: drawer ? 0 : 16 });
  const x = useReducedMotionValue(snapEntrance, reduced || !drawer ? 0 : dir === 'rtl' ? -28 : 28, 0);
  const scale = useReducedMotionValue(snapEntrance, reduced || drawer ? 1 : 0.95, 1);
  const backdropOpacity = useReducedMotionValue(snapEntrance, reduced ? 1 : 0, 1);

  // A visually exiting dialog must no longer capture focus or appear to AT.
  useLayoutEffect(() => {
    const node = layer.current;
    if (!node) return;
    if (!isPresent && node.contains(document.activeElement)) (document.activeElement as HTMLElement).blur();
    node.inert = !isPresent;
    if (isPresent) node.removeAttribute('aria-hidden');
    else node.setAttribute('aria-hidden', 'true');
  }, [isPresent]);

  return <div ref={layer} style={{ pointerEvents: isPresent ? undefined : 'none' }} className={cn('fixed inset-0 z-[80] flex', drawer ? 'justify-end' : 'items-center justify-center p-4')}>
    <motion.div
      className="absolute inset-0 bg-slate-950/50 backdrop-blur-[3px]"
      style={{ opacity: backdropOpacity }}
      initial={motionReduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={motionReduced ? { opacity: 1 } : { opacity: 0 }}
      transition={motionReduced ? { duration: 0 } : { duration: 0.2, ease: 'easeOut' }}
      onClick={() => { if (!busy) onClose(); }}
    />
    <motion.div
      ref={panel} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined} tabIndex={-1}
      style={{ ...entrance, x, scale }}
      initial={motionReduced ? false : drawer ? { opacity: 0, x: dir === 'rtl' ? -28 : 28 } : { opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      exit={motionReduced ? { opacity: 1, x: 0, y: 0, scale: 1 } : drawer ? { opacity: 0, x: dir === 'rtl' ? -24 : 24 } : { opacity: 0, y: 10, scale: 0.97 }}
      transition={motionReduced ? { duration: 0 } : { type: 'spring', stiffness: 340, damping: 30, mass: 0.8 }}
      className={cn('relative flex max-h-[min(90vh,900px)] w-full flex-col overflow-hidden bg-white shadow-2xl outline-none', drawer ? 'h-full max-h-full max-w-[560px] rounded-none' : 'rounded-[24px]', !drawer && (size === 'lg' ? 'max-w-2xl' : 'max-w-lg'))}
    >
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
        <div><h2 id={titleId} className="text-base font-semibold tracking-tight text-slate-900">{title}</h2>{description && <p id={descriptionId} className="mt-1 text-sm text-slate-500">{description}</p>}</div>
        <button type="button" onClick={onClose} disabled={busy} aria-label={closeLabel} className="-me-1 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40"><X size={18} /></button>
      </div>
      {children}
    </motion.div>
  </div>;
}

/** Accessible dialog with focus containment, Escape handling and focus restoration. */
export function Modal({ open, onClose, title, description, children, size = 'md', drawer = false, busy = false, parentPresence = false }: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const panel = useRef<HTMLDivElement>(null);
  const { t, dir } = useI18n();
  const isPresent = useIsPresent();
  const active = open && isPresent;
  const onCloseRef = useRef(onClose);
  const busyRef = useRef(busy);
  onCloseRef.current = onClose; busyRef.current = busy;
  useEffect(() => {
    if (!active) return;
    const previous = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(() => focusDialogStart(panel.current, document.activeElement), 40);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busyRef.current) { event.preventDefault(); onCloseRef.current(); }
      if (event.key !== 'Tab' || !panel.current) return;
      const nodes = Array.from(panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter((node) => node.offsetParent !== null);
      if (!nodes.length) { event.preventDefault(); panel.current.focus(); return; }
      const first = nodes[0]; const last = nodes[nodes.length - 1];
      if (event.shiftKey && (document.activeElement === first || !panel.current.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => { window.clearTimeout(timer); document.removeEventListener('keydown', onKeyDown); document.body.style.overflow = oldOverflow; previous?.focus(); };
  }, [active]);

  const layer = <ModalLayer key="dialog" onClose={onClose} title={title} description={description} size={size} drawer={drawer} busy={busy} panel={panel} titleId={titleId} descriptionId={descriptionId} dir={dir} closeLabel={t('closeDialog')}>{children}</ModalLayer>;
  return createPortal(
    // Conditional callers keep their layer in the existing boundary as it exits.
    // Persistent callers need a separate boundary for changes to `open`.
    parentPresence ? (open ? layer : null) : <AnimatePresence>{active && layer}</AnimatePresence>,
    document.body,
  );
}

export function Drawer(props: Omit<ModalProps, 'drawer'>) { return <Modal {...props} drawer />; }
