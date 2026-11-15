import { AlertCircle, Inbox } from 'lucide-react';
import { Button } from './Button';
import { Spinner } from './Spinner';
import { useI18n } from '../../i18n';

export function LoadingState() {
  const { t } = useI18n();
  return (
    <div className="grid min-h-[40vh] place-items-center">
      <Spinner label={t('loading')} />
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  const { t } = useI18n();
  return (
    <div className="grid min-h-[40vh] place-items-center px-6">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-xl bg-rose-50 text-rose-600">
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

export function EmptyState({ title, body }: { title?: string; body?: string }) {
  const { t } = useI18n();
  return (
    <div className="grid place-items-center px-6 py-16 text-center">
      <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-500">
        <Inbox size={18} />
      </div>
      <h3 className="text-sm font-semibold text-slate-800">{title ?? t('emptyTitle')}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{body ?? t('emptyBody')}</p>
    </div>
  );
}
