import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useI18n } from '../../i18n';
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
}

/** Accessible dialog with focus containment, Escape handling and focus restoration. */
export function Modal({ open, onClose, title, description, children, size = 'md', drawer = false, busy = false }: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const panel = useRef<HTMLDivElement>(null);
  const { t, dir } = useI18n();
  const onCloseRef = useRef(onClose);
  const busyRef = useRef(busy);
  onCloseRef.current = onClose; busyRef.current = busy;
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(() => {
      const first = panel.current?.querySelector<HTMLElement>('input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])');
      (first ?? panel.current)?.focus();
    }, 40);
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
  }, [open]);

  return createPortal(
    <AnimatePresence>
      {open && <div className={cn('fixed inset-0 z-[80] flex', drawer ? 'justify-end' : 'items-center justify-center p-4')}>
        <motion.div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[3px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { if (!busy) onClose(); }} />
        <motion.div
          ref={panel} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined} tabIndex={-1}
          initial={drawer ? { opacity: 0, x: dir === 'rtl' ? -36 : 36 } : { opacity: 0, y: 14, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          exit={drawer ? { opacity: 0, x: dir === 'rtl' ? -30 : 30 } : { opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.18 }}
          className={cn('relative flex max-h-[min(90vh,900px)] w-full flex-col overflow-hidden bg-white shadow-2xl outline-none', drawer ? 'h-full max-h-full max-w-[560px] rounded-none' : 'rounded-2xl', !drawer && (size === 'lg' ? 'max-w-2xl' : 'max-w-lg'))}
        >
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
            <div><h2 id={titleId} className="text-base font-semibold tracking-tight text-slate-900">{title}</h2>{description && <p id={descriptionId} className="mt-1 text-sm text-slate-500">{description}</p>}</div>
            <button type="button" onClick={onClose} disabled={busy} aria-label={t('closeDialog')} className="-me-1 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40"><X size={18} /></button>
          </div>
          {children}
        </motion.div>
      </div>}
    </AnimatePresence>, document.body,
  );
}

export function Drawer(props: Omit<ModalProps, 'drawer'>) { return <Modal {...props} drawer />; }
