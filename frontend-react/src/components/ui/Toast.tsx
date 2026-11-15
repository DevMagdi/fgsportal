import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useIsPresent } from 'framer-motion';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useEntranceValues, useExitMotionPreference } from '../../lib/useAccessibleMotion';
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion';
import { useI18n } from '../../i18n';

type Toast = { id: number; message: string; tone: 'success' | 'error' };
type ToastContextValue = { success: (message: string) => void; error: (message: string) => void };
const ToastContext = createContext<ToastContextValue | null>(null);

function ToastItem({ toast, reduced, dismissLabel, onDismiss }: { toast: Toast; reduced: boolean; dismissLabel: string; onDismiss: () => void }) {
  const isPresent = useIsPresent();
  // An already-running exit must finish before AnimatePresence can remove it.
  const motionReduced = useExitMotionPreference(reduced, isPresent);
  const values = useEntranceValues(reduced && isPresent, reduced ? false : { opacity: 0, y: 6 });
  return <motion.div style={values} initial={motionReduced ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={motionReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }} transition={motionReduced ? { duration: 0 } : { duration: 0.22, ease: 'easeOut' }} role={toast.tone === 'error' ? 'alert' : 'status'} className="pointer-events-none flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-lift">
    {toast.tone === 'success' ? <CheckCircle2 className="mt-0.5 shrink-0 text-brand-600" size={17} /> : <AlertCircle className="mt-0.5 shrink-0 text-brand-600" size={17} />}
    <span className={cn('flex-1 leading-5', toast.tone === 'error' ? 'text-brand-800' : 'text-slate-700')}>{toast.message}</span>
    <button onClick={onDismiss} aria-label={dismissLabel} className="pointer-events-auto text-slate-400 hover:text-slate-700"><X size={15} /></button>
  </motion.div>;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const { t } = useI18n();
  const reduceMotion = usePrefersReducedMotion();
  const remove = useCallback((id: number) => setItems((prev) => prev.filter((toast) => toast.id !== id)), []);
  const push = useCallback((message: string, tone: Toast['tone']) => {
    const id = Date.now() + Math.random(); setItems((prev) => [...prev.slice(-3), { id, message, tone }]);
    window.setTimeout(() => remove(id), 5000);
  }, [remove]);
  return <ToastContext.Provider value={{ success: (message) => push(message, 'success'), error: (message) => push(message, 'error') }}>
    {children}
    <div className="pointer-events-none fixed bottom-5 end-5 z-[100] flex w-[min(360px,calc(100vw-40px))] flex-col gap-2" aria-live="polite" aria-atomic="false">
      <AnimatePresence>{items.map((toast) => <ToastItem key={toast.id} toast={toast} reduced={reduceMotion} dismissLabel={t('dismiss')} onDismiss={() => remove(toast.id)} />)}</AnimatePresence>
    </div>
  </ToastContext.Provider>;
}
export function useToast() { const context = useContext(ToastContext); if (!context) throw new Error('useToast must be used within ToastProvider'); return context; }
