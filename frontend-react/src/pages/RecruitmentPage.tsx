import { UserPlus } from 'lucide-react';
import { CollectionPage } from '../components/crud/CollectionPage';
import { displayName } from '../components/ui/Avatar';
import { StatusBadge } from '../components/ui/PageParts';
import { useI18n } from '../i18n';
import { api } from '../lib/api';
import { formatCalendarDate } from '../lib/utils';

export function RecruitmentPage() {
  const { t, lang } = useI18n();
  return <CollectionPage kind="recruitment" queryName="recruitment" queryFn={() => api.recruitment()} title="recruitment" eyebrow="grpOrganization" icon={UserPlus} subtitle={{ en: 'Follow hiring requests, candidates, and onboarding in one place.', ar: 'تابع طلبات التوظيف والمرشحين والتهيئة في مكان واحد.' }} recordName={(h) => h.job_title} searchText={(h) => `${h.job_title} ${h.specification ?? ''} ${h.unit?.name ?? ''}`} getStatus={(h) => h.status} getUnit={(h) => h.unit?.name}
    columns={(open) => [
      { key: 'job', label: t('jobTitle'), render: (h) => <div><button onClick={() => open(h)} className="text-start font-semibold text-slate-800 hover:text-brand-600">{h.job_title}</button><p className="mt-1 max-w-[280px] truncate text-xs text-slate-400">{h.specification}</p></div> },
      { key: 'unit', label: t('unit'), render: (h) => h.unit?.name ?? '—' },
      { key: 'requester', label: t('owner'), render: (h) => displayName(h.requester) },
      { key: 'candidates', label: t('candidates'), render: (h) => h.candidates?.length ?? 0 },
      { key: 'date', label: t('hiringDate'), render: (h) => formatCalendarDate(h.first_working_day, lang) },
      { key: 'status', label: t('status'), render: (h) => <StatusBadge status={h.status} /> },
    ]} />;
}
