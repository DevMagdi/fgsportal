import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import { useI18n, type MsgKey } from '../i18n';
import { formatDate } from '../lib/utils';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState, ErrorState, LoadingState } from '../components/ui/States';
import { displayName } from '../components/ui/Avatar';

const hiringTone: Record<string, string> = {
  submitted: 'neutral', with_hr: 'brand', cv_received: 'brand', interviewing: 'accent',
  selected: 'teal', hired: 'success', closed: 'neutral', rejected: 'danger',
};

export function RecruitmentPage() {
  const { t, lang } = useI18n();
  const [status, setStatus] = useState('');
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['bms', 'recruitment', status],
    queryFn: () => api.recruitment({ status: status || undefined }),
  });
  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={(error as Error)?.message} onRetry={() => void refetch()} />;
  const items = data ?? [];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <PageHeader title={t('recruitment')} subtitle={`${items.length}`} />
      <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm">
        <option value="">{t('allStatus')}</option>
        {['submitted', 'with_hr', 'cv_received', 'interviewing', 'selected', 'hired', 'closed', 'rejected'].map((s) => (
          <option key={s} value={s}>{t(s as MsgKey)}</option>
        ))}
      </select>
      {items.length === 0 ? <Card><EmptyState /></Card> : (
        <div className="space-y-3">
          {items.map((h) => (
            <Card key={h.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{h.job_title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{h.specification}</p>
                  <p className="mt-2 text-xs text-slate-400">{h.unit?.name} · {displayName(h.requester)}</p>
                </div>
                <Badge tone={hiringTone[h.status] ?? 'neutral'}>{t(h.status as MsgKey)}</Badge>
              </div>
              {(h.candidates ?? []).length > 0 && (
                <div className="mt-4">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{t('candidates')}</div>
                  <ul className="mt-2 divide-y divide-slate-100 rounded-lg border border-slate-100">
                    {h.candidates!.map((c) => (
                      <li key={c.id} className="flex items-center justify-between px-3 py-2 text-sm">
                        <span>{c.name}<span className="ms-2 text-xs text-slate-400">{c.email}</span></span>
                        <Badge>{c.status?.replace(/_/g, ' ')}</Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {(h.onboarding ?? []).length > 0 && (
                <div className="mt-4">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{t('onboarding')}</div>
                  <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                    {h.onboarding!.map((o) => (
                      <li key={o.id} className="rounded-lg bg-slate-50 px-3 py-2 text-sm">
                        <div className="font-medium text-slate-800">{o.title}</div>
                        <div className="text-xs text-slate-400">{o.department} · {o.status}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {h.first_working_day && <p className="mt-3 text-xs text-slate-400">{t('hiringDate')}: {formatDate(h.first_working_day, lang)}</p>}
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}
