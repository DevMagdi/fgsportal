import { useQuery } from '@tanstack/react-query';
import { Award, Banknote, CheckCircle2, Gift, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import { useI18n } from '../i18n';
import type { Bonus } from '../lib/types';
import { formatCalendarDate, formatMoney } from '../lib/utils';
import { useEntityManager } from '../components/crud/useEntityManager';
import { Button } from '../components/ui/Button';
import { DataTable, type Column } from '../components/ui/DataTable';
import { MetricCards, StatusBadge } from '../components/ui/PageParts';
import { PageHeader } from '../components/ui/PageHeader';
import { ErrorState, LoadingState } from '../components/ui/States';

export function BonusesPage() {
  const { t, lang } = useI18n();
  const query = useQuery({ queryKey: ['bms', 'bonuses'], queryFn: () => api.bonuses() });
  const manager = useEntityManager('bonuses');
  if (query.isLoading) return <LoadingState />;
  if (query.isError) return <ErrorState message={(query.error as Error)?.message} onRetry={() => void query.refetch()} />;
  const items = query.data ?? [];
  const totalSar = items.filter((b) => b.currency === 'SAR').reduce((sum, b) => sum + Number(b.amount || 0), 0);
  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <PageHeader eyebrow={t('grpOrganization')} title={t('bonuses')} subtitle={lang === 'ar' ? 'احتفِ بالإنجازات وتابع المكافآت عبر مؤسستك.' : 'Recognize great work and keep every award in view.'} actions={manager.canManage && <Button onClick={() => manager.openCreate()}><Plus size={16} />{t('addBonus')}</Button>} />
    <MetricCards items={[
      { label: t('totalBonuses'), value: items.length, hint: t('allTime'), icon: Gift },
      { label: t('approvedBonuses'), value: items.filter((b) => b.status === 'approved').length, hint: t('approved'), icon: CheckCircle2, tone: 'teal' },
      { label: t('paid'), value: items.filter((b) => b.status === 'paid').length, hint: t('bonuses'), icon: Award, tone: 'amber' },
      { label: `${t('amount')} · SAR`, value: formatMoney(totalSar, 'SAR', lang), hint: lang === 'ar' ? 'المكافآت بالريال فقط' : 'SAR awards only', icon: Banknote },
    ]} />
    <BonusTable items={items} manager={manager} />
    {manager.dialogs}
  </motion.div>;
}

type BonusManager = ReturnType<typeof useEntityManager<'bonuses'>>;
export function BonusTable({ items, manager, defaults }: { items: Bonus[]; manager: BonusManager; defaults?: { business_unit_id?: number; employee_id?: number } }) {
  const { t, lang } = useI18n();
  const columns: Column<Bonus>[] = [
    { key: 'award', label: t('awardTitle'), render: (b) => <div className="flex items-center gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-amber-50 text-amber-600"><Award size={16} /></span><div><div className="font-semibold text-slate-800">{b.title}</div><div className="mt-1 text-xs text-slate-400">{b.notes || t('bonus')}</div></div></div> },
    { key: 'employee', label: t('employee'), render: (b) => b.employee ? <Link to={`/employees/${b.employee.id}`} className="font-medium text-slate-700 hover:text-brand-600">{b.employee.name}</Link> : '—' },
    { key: 'unit', label: t('unit'), render: (b) => b.unit?.name ?? '—' },
    { key: 'amount', label: t('amount'), render: (b) => <span className="tnum font-semibold text-slate-800">{formatMoney(b.amount, b.currency, lang)}</span> },
    { key: 'date', label: t('awardedOn'), render: (b) => formatCalendarDate(b.awarded_on, lang) },
    { key: 'status', label: t('status'), render: (b) => <StatusBadge status={b.status} /> },
  ];
  return <DataTable items={items} columns={columns} title={t('allRecords')} getSearchText={(b) => `${b.title} ${b.employee?.name ?? ''} ${b.unit?.name ?? ''}`} getStatus={(b) => b.status} getUnit={(b) => b.unit?.name}
    onCreate={manager.canManage ? () => manager.openCreate(defaults) : undefined} createLabel={t('addBonus')}
    onEdit={manager.canManage ? manager.openEdit : undefined} onDelete={manager.canManage ? (b) => manager.openDelete(b, b.title) : undefined} onBulkDelete={manager.canManage ? manager.openBulkDelete : undefined} />;
}
