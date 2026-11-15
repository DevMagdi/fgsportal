import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useI18n } from '../../i18n';

type Toast = { id: number; message: string; tone: 'success' | 'error' };
type ToastContextValue = { success: (message: string) => void; error: (message: string) => void };
const ToastContext = createContext<ToastContextValue | null>(null);
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const { t } = useI18n();
  const remove = useCallback((id: number) => setItems((prev) => prev.filter((toast) => toast.id !== id)), []);
  const push = useCallback((message: string, tone: Toast['tone']) => {
    const id = Date.now() + Math.random(); setItems((prev) => [...prev.slice(-3), { id, message, tone }]);
    window.setTimeout(() => remove(id), 5000);
  }, [remove]);
  return <ToastContext.Provider value={{ success: (message) => push(message, 'success'), error: (message) => push(message, 'error') }}>
    {children}
    <div className="pointer-events-none fixed bottom-5 end-5 z-[100] flex w-[min(360px,calc(100vw-40px))] flex-col gap-2" aria-live="polite" aria-atomic="false">
      <AnimatePresence>{items.map((toast) => <motion.div key={toast.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} role={toast.tone === 'error' ? 'alert' : 'status'} className="pointer-events-none flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-lift">
        {toast.tone === 'success' ? <CheckCircle2 className="mt-0.5 shrink-0 text-brand-600" size={17} /> : <AlertCircle className="mt-0.5 shrink-0 text-brand-600" size={17} />}
        <span className={cn('flex-1 leading-5', toast.tone === 'error' ? 'text-brand-800' : 'text-slate-700')}>{toast.message}</span>
        <button onClick={() => remove(toast.id)} aria-label={t('dismiss')} className="pointer-events-auto text-slate-400 hover:text-slate-700"><X size={15} /></button>
      </motion.div>)}</AnimatePresence>
    </div>
  </ToastContext.Provider>;
}
export function useToast() { const context = useContext(ToastContext); if (!context) throw new Error('useToast must be used within ToastProvider'); return context; }
