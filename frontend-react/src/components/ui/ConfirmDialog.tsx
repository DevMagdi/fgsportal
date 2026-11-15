import { AlertTriangle } from 'lucide-react';
import { useI18n } from '../../i18n';
import { api } from '../../lib/api';
import { Button } from './Button';
import { Modal } from './Modal';

export function ConfirmDialog({ open, onClose, onConfirm, title, name, message, confirmLabel, busy }: { open: boolean; onClose: () => void; onConfirm: () => void; title?: string; name?: string; message?: string; confirmLabel?: string; busy?: boolean }) {
  const { t } = useI18n();
  return <Modal open={open} onClose={onClose} title={title ?? t('deleteConfirm')} busy={busy}>
    <div className="flex gap-3 px-6 py-6 sm:px-7">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-600"><AlertTriangle size={19} /></span>
      <div><p className="text-sm font-medium text-slate-800">{name}</p><p className="mt-1 text-sm leading-6 text-slate-500">{message ?? (api.demo ? t('deleteWarning') : t('deleteLiveWarning'))}</p></div>
    </div>
    <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50/70 px-6 py-4 sm:px-7">
      <Button variant="secondary" onClick={onClose} disabled={busy}>{t('cancel')}</Button>
      <Button variant="danger" onClick={onConfirm} disabled={busy}>{busy ? t('deleting') : confirmLabel ?? t('remove')}</Button>
    </div>
  </Modal>;
}
