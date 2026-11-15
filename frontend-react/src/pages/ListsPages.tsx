import { BriefcaseBusiness, CalendarDays, Package } from 'lucide-react';
import { CollectionPage } from '../components/crud/CollectionPage';
import { displayName } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { StatusBadge } from '../components/ui/PageParts';
import { api } from '../lib/api';
import { useI18n } from '../i18n';
import { formatDate, formatDateTime } from '../lib/utils';

export function LeadsPage() {
  const { t, lang } = useI18n();
  return <CollectionPage kind="leads" queryName="leads" queryFn={() => api.leads()} title="leads" eyebrow="grpBusinessDev" icon={BriefcaseBusiness} subtitle={{ en: 'Build relationships and turn promising leads into opportunities.', ar: 'ابنِ علاقات وحوّل العملاء المحتملين إلى فرص.' }} recordName={(l) => l.name} searchText={(l) => `${l.name} ${l.sector ?? ''} ${l.contact_name ?? ''}`} getStatus={(l) => l.stage} getUnit={(l) => l.unit?.name}
    columns={(open) => [
      { key: 'name', label: t('lead'), render: (l) => <div><button onClick={() => open(l)} className="text-start font-semibold text-slate-800 hover:text-brand-600">{l.name}</button><p className="mt-1 text-xs text-slate-400">{[l.sector, l.contact_name].filter(Boolean).join(' · ') || '—'}</p></div> },
      { key: 'stage', label: t('stage'), render: (l) => <StatusBadge status={l.stage} /> },
      { key: 'unit', label: t('unit'), render: (l) => l.unit?.name ?? '—' },
      { key: 'owner', label: t('owner'), render: (l) => displayName(l.owner) },
      { key: 'contact', label: t('lastContact'), render: (l) => formatDate(l.last_contacted_at, lang) },
    ]} />;
}

export function ProductsPage() {
  const { t } = useI18n();
  return <CollectionPage kind="products" queryName="products" queryFn={() => api.products()} title="products" eyebrow="grpOperations" icon={Package} subtitle={{ en: 'Keep your product portfolio and delivery phases in focus.', ar: 'تابع محفظة المنتجات ومراحل تنفيذها.' }} recordName={(p) => p.product_name} searchText={(p) => `${p.product_name} ${p.description ?? ''}`} getStatus={(p) => p.currentPhase?.status} getUnit={(p) => p.businessUnits?.map((u) => u.name)} deleteLabel={api.demo ? t('remove') : t('archiveProduct')}
    columns={(open) => [
      { key: 'name', label: t('product'), render: (p) => <div><button onClick={() => open(p)} className="text-start font-semibold text-slate-800 hover:text-brand-600">{p.product_name}</button><p className="mt-1 max-w-[250px] truncate text-xs text-slate-400">{p.description || t('noDescription')}</p></div> },
      { key: 'unit', label: t('units'), render: (p) => p.businessUnits?.map((u) => u.name).join(', ') || '—' },
      { key: 'phase', label: t('phase'), render: (p) => p.currentPhase ? <Badge tone="brand">{p.currentPhase.name ?? p.currentPhase.title}</Badge> : '—' },
      { key: 'progress', label: t('progress'), render: (p) => <div className="flex items-center gap-2"><span className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100"><span className="block h-full rounded-full bg-teal-500" style={{ width: `${p.currentPhase?.progress ?? 0}%` }} /></span><span className="text-xs">{p.currentPhase?.progress ?? 0}%</span></div> },
      { key: 'owner', label: t('owner'), render: (p) => displayName(p.owner) },
    ]} />;
}

export function MeetingsPage() {
  const { t, lang } = useI18n();
  return <CollectionPage kind="meetings" queryName="meetings" queryFn={() => api.meetings()} title="meetings" eyebrow="grpOperations" icon={CalendarDays} subtitle={{ en: 'Plan conversations and keep everyone on the same page.', ar: 'خطط للاجتماعات واجعل الجميع على اطلاع.' }} recordName={(m) => m.title} searchText={(m) => `${m.title} ${m.location ?? ''} ${m.unit?.name ?? ''}`} getStatus={(m) => m.status} getUnit={(m) => m.unit?.name} canEdit={(m) => api.demo || m.status !== 'cancelled'} canDelete={(m) => api.demo || m.status !== 'cancelled'} deleteLabel={api.demo ? t('remove') : t('cancelMeeting')}
    columns={(open) => [
      { key: 'name', label: t('meetings'), render: (m) => <div><button onClick={() => open(m)} className="text-start font-semibold text-slate-800 hover:text-brand-600">{m.title}</button><p className="mt-1 text-xs text-slate-400">{m.location || '—'}</p></div> },
      { key: 'starts', label: t('starts'), render: (m) => formatDateTime(m.starts_at, lang) },
      { key: 'ends', label: t('endTime'), render: (m) => formatDateTime(m.ends_at, lang) },
      { key: 'unit', label: t('unit'), render: (m) => m.unit?.name ?? '—' },
      { key: 'status', label: t('status'), render: (m) => <StatusBadge status={m.status} /> },
    ]} />;
}

export function NoAccessPage() {
  const { t } = useI18n();
  return <div className="grid min-h-[50vh] place-items-center"><div className="text-center"><h1 className="text-lg font-semibold text-slate-900">{t('noAccess')}</h1><p className="mt-1 text-sm text-slate-500">{t('noAccessBody')}</p><a href="/" className="mt-4 inline-block text-sm font-medium text-brand-600">{t('backHome')}</a></div></div>;
}
