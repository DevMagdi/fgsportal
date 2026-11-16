import { motion } from 'framer-motion';
import { AlertCircle, Inbox } from 'lucide-react';
import { Button } from './Button';
import { Skeleton } from './Spinner';
import { useI18n } from '../../i18n';
import { useEntranceValues, useReducedMotionValue } from '../../lib/useAccessibleMotion';
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion';

export function LoadingState() {
  const { t } = useI18n();
  return <div className="space-y-5" role="status" aria-label={t('loading')}>
    <div className="space-y-2"><Skeleton className="h-3 w-28" /><Skeleton className="h-8 w-64 max-w-full" /><Skeleton className="h-4 w-80 max-w-full" /></div>
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">{[0, 1, 2, 3].map((i) => <div key={i} className="rounded-[20px] border border-slate-200/70 bg-white p-4 shadow-card"><Skeleton className="h-3 w-24 max-w-full" /><Skeleton className="mt-5 h-8 w-16" /><Skeleton className="mt-3 h-3 w-32 max-w-full" /></div>)}</div>
    <div className="rounded-[20px] border border-slate-200/70 bg-white p-5 shadow-card"><Skeleton className="h-7 w-52 max-w-full" />{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="mt-4 h-11 w-full" />)}</div>
    <span className="sr-only">{t('loading')}</span>
  </div>;
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  const { t } = useI18n();
  return (
    <div className="grid min-h-[40vh] place-items-center px-6">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-xl bg-pink/20 text-brand-600">
          <AlertCircle size={18} />
        </div>
        <h2 className="text-base font-semibold text-slate-900">{t('errorTitle')}</h2>
        <p className="mt-1 text-sm text-slate-500">{message ?? t('noData')}</p>
        {onRetry && (
          <Button className="mt-4" variant="secondary" onClick={onRetry}>{t('retry')}</Button>
        )}
      </div>
    </div>
  );
}

export function EmptyState({ title, body, action }: { title?: string; body?: string; action?: React.ReactNode }) {
  const { t } = useI18n();
  const reduceMotion = usePrefersReducedMotion();
  const values = useEntranceValues(reduceMotion, reduceMotion ? false : { opacity: 0, y: 6 });
  const iconScale = useReducedMotionValue(reduceMotion, reduceMotion ? 1 : 0.94, 1);
  return (
    <motion.div style={values} initial={reduceMotion ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.35, ease: 'easeOut' }} className="grid place-items-center px-6 py-10 text-center">
      <motion.div style={{ scale: iconScale }} initial={reduceMotion ? false : { scale: 0.94 }} animate={{ scale: 1 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.4, ease: 'easeOut' }} className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-[20px] border border-violet/30 bg-gradient-to-br from-violet/25 via-white to-turquoise/30 text-brand-600 shadow-card">
        <Inbox size={21} />
      </motion.div>
      <h3 className="text-sm font-semibold text-slate-800">{title ?? t('emptyTitle')}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{body ?? t('emptyBody')}</p>
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  );
}
