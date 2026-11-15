import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import { useAuth } from '../auth/AuthContext';
import { useI18n } from '../i18n';
import { formatDateTime } from '../lib/utils';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState, ErrorState, LoadingState } from '../components/ui/States';

export function AccessPage() {
  const { t, lang } = useI18n();
  const { lookups } = useAuth();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['bms', 'role-audit'],
    queryFn: () => api.roleAudit(),
  });

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <PageHeader title={t('accessRoles')} subtitle={t('audit')} />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {(lookups?.roles ?? []).map((r) => (
          <Card key={r.id} className="p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">{r.name}</h3>
                <p className="mt-0.5 font-mono text-[11px] text-slate-400">{r.slug}</p>
              </div>
              <Badge>{r.abilities.includes('*') ? '*' : r.abilities.length}</Badge>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {(r.abilities.includes('*') ? ['*'] : r.abilities.slice(0, 8)).map((a) => (
                <span key={a} className="rounded-md bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">{a}</span>
              ))}
              {r.abilities.length > 8 && !r.abilities.includes('*') && (
                <span className="text-[10px] text-slate-400">+{r.abilities.length - 8}</span>
              )}
            </div>
          </Card>
        ))}
      </div>
      <Card>
        <div className="border-b border-slate-100 px-5 py-4 text-sm font-semibold">{t('audit')}</div>
        {isLoading ? <LoadingState /> : isError ? <ErrorState message={(error as Error)?.message} onRetry={() => void refetch()} /> : (data ?? []).length === 0 ? <EmptyState /> : (
          <div role="region" tabIndex={0} aria-label={t('audit')} className="max-h-[min(55vh,32rem)] overflow-auto"><table className="w-full min-w-[650px] text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50">
              <tr className="border-b border-slate-100 text-start text-[11px] uppercase tracking-wide text-slate-400">
                <th className="px-5 py-2.5 text-start font-medium">{t('employees')}</th>
                <th className="px-5 py-2.5 text-start font-medium">{t('roles')}</th>
                <th className="px-5 py-2.5 text-start font-medium">{t('unit')}</th>
                <th className="px-5 py-2.5 text-start font-medium">{t('status')}</th>
                <th className="px-5 py-2.5 text-start font-medium">{t('updated')}</th>
              </tr>
            </thead>
            <tbody>
              {(data ?? []).map((row) => (
                <tr key={row.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-3">{row.employee}</td>
                  <td className="px-5 py-3">{row.role}</td>
                  <td className="px-5 py-3">{row.business_unit || t('global')}</td>
                  <td className="px-5 py-3">
                    <Badge tone={row.event.includes('revoke') ? 'danger' : 'success'}>
                      {row.event.includes('revoke') ? t('revoked') : t('assigned')}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-slate-500">{formatDateTime(row.created_at, lang)} · {row.user}</td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )}
      </Card>
    </motion.div>
  );
}
