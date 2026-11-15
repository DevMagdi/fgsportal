import { AlertCircle, Inbox } from 'lucide-react';
import { Button } from './Button';
import { Skeleton } from './Spinner';
import { useI18n } from '../../i18n';

export function LoadingState() {
  const { t } = useI18n();
  return <div className="space-y-6" role="status" aria-label={t('loading')}>
    <div className="space-y-2"><Skeleton className="h-3 w-28" /><Skeleton className="h-8 w-64" /><Skeleton className="h-4 w-80 max-w-full" /></div>
    <div className="grid gap-4 sm:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="rounded-xl border border-slate-200 bg-white p-5"><Skeleton className="h-3 w-24" /><Skeleton className="mt-4 h-7 w-16" /><Skeleton className="mt-3 h-3 w-32" /></div>)}</div>
    <div className="rounded-xl border border-slate-200 bg-white p-5"><Skeleton className="h-8 w-52" />{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="mt-4 h-12 w-full" />)}</div>
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
  return (
    <div className="grid place-items-center px-6 py-10 text-center">
      <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-500">
        <Inbox size={18} />
      </div>
      <h3 className="text-sm font-semibold text-slate-800">{title ?? t('emptyTitle')}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{body ?? t('emptyBody')}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
