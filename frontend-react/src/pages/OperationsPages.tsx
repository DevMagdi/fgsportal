import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { CalendarDays, Download, FileText, ShoppingCart, Sparkles } from 'lucide-react';
import { CollectionPage } from '../components/crud/CollectionPage';
import { displayName } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/PageParts';
import { PageHeader } from '../components/ui/PageHeader';
import { Tabs } from '../components/ui/Tabs';
import { useToast } from '../components/ui/Toast';
import { api } from '../lib/api';
import { useI18n } from '../i18n';
import { formatCalendarDate, formatDate, formatDateTime } from '../lib/utils';

export function DevelopmentPage() {
  const { t, lang } = useI18n();
  return <CollectionPage kind="development" queryName="development" queryFn={() => api.development()} title="development" eyebrow="grpOrganization" icon={Sparkles} subtitle={{ en: 'Support growth with a clear view of learning and development.', ar: 'ادعم النمو برؤية واضحة للتعلم والتطوير.' }} recordName={(d) => d.title} searchText={(d) => `${d.title} ${d.item_type ?? ''} ${d.unit?.name ?? ''}`} getStatus={(d) => d.status} getUnit={(d) => d.unit?.name}
    columns={(open) => [
      { key: 'title', label: t('development'), render: (d) => <div><button onClick={() => open(d)} className="text-start font-semibold text-slate-800 hover:underline">{d.title}</button><p className="mt-1 text-xs text-slate-400">{displayName(d.owner)}</p></div> },
      { key: 'type', label: t('itemType'), render: (d) => <Badge>{d.item_type?.replace(/_/g, ' ') || '—'}</Badge> },
      { key: 'unit', label: t('unit'), render: (d) => d.unit?.name ?? '—' },
      { key: 'due', label: t('dueDate'), render: (d) => formatCalendarDate(d.due_date, lang) },
      { key: 'status', label: t('status'), render: (d) => <StatusBadge status={d.status} /> },
    ]} />;
}

export function ProcurementPage() {
  const { t } = useI18n();
  return <CollectionPage kind="procurement" queryName="procurement" queryFn={() => api.procurement()} title="procurement" eyebrow="grpOperations" icon={ShoppingCart} subtitle={{ en: 'Manage requests and keep purchasing decisions moving.', ar: 'أدر الطلبات وتابع قرارات الشراء.' }} recordName={(p) => p.item} searchText={(p) => `${p.item} ${p.reference ?? ''} ${p.purpose ?? ''}`} getStatus={(p) => p.status} getUnit={(p) => p.unit?.name}
    columns={(open) => [
      { key: 'item', label: t('item'), render: (p) => <div><button onClick={() => open(p)} className="text-start font-semibold text-slate-800 hover:underline">{p.item}</button><p className="mt-1 text-xs text-slate-400">{p.reference}</p></div> },
      { key: 'unit', label: t('unit'), render: (p) => p.unit?.name ?? '—' },
      { key: 'quantity', label: t('quantity'), render: (p) => p.quantity },
      { key: 'requester', label: t('owner'), render: (p) => displayName(p.requester) },
      { key: 'quotes', label: t('quotations'), render: (p) => p.quotations?.length ?? 0 },
      { key: 'status', label: t('status'), render: (p) => <StatusBadge status={p.status} /> },
    ]} />;
}

export function EventsPage() {
  const { t, lang } = useI18n(); const [tab, setTab] = useState('events');
  return <div className="space-y-4"><PageHeader eyebrow={t('grpOperations')} title={t('events')} subtitle={lang === 'ar' ? 'نسّق الفعاليات والإجراءات من مكان واحد.' : 'Bring events, checklists, and procedures together.'} />
    <Tabs value={tab} onChange={setTab} items={[
      { id: 'events', label: t('events'), content: tab === 'events' ? <EventsCollection /> : null },
      { id: 'procedures', label: t('procedures'), content: tab === 'procedures' ? <ProceduresCollection /> : null },
    ]} /></div>;
}
function EventsCollection() {
  const { t, lang } = useI18n();
  return <CollectionPage hideHeader kind="events" queryName="events" queryFn={() => api.events()} title="events" eyebrow="grpOperations" icon={CalendarDays} subtitle={{ en: 'Coordinate upcoming events.', ar: 'نسّق الفعاليات القادمة.' }} recordName={(e) => e.title} searchText={(e) => `${e.title} ${e.venue ?? ''}`} getStatus={(e) => e.status} getUnit={(e) => e.unit?.name}
    columns={(open) => [
      { key: 'event', label: t('events'), render: (e) => <div><button onClick={() => open(e)} className="text-start font-semibold text-slate-800 hover:underline">{e.title}</button><p className="mt-1 text-xs text-slate-400">{e.venue || '—'}</p></div> },
      { key: 'date', label: t('eventDate'), render: (e) => formatDateTime(e.event_date, lang) },
      { key: 'unit', label: t('unit'), render: (e) => e.unit?.name ?? '—' },
      { key: 'checklist', label: t('checklist'), render: (e) => e.checklist?.length ?? 0 },
      { key: 'status', label: t('status'), render: (e) => <StatusBadge status={e.status} /> },
    ]} />;
}
function ProceduresCollection() {
  const { t } = useI18n();
  return <CollectionPage hideHeader kind="procedures" queryName="procedures" queryFn={() => api.procedures()} title="procedures" eyebrow="grpOperations" icon={FileText} subtitle={{ en: 'Keep everyone aligned on procedures.', ar: 'اجعل الجميع على اطلاع بالإجراءات.' }} recordName={(p) => p.title} searchText={(p) => `${p.title} ${p.category ?? ''} ${p.content ?? ''}`}
    columns={(open) => [
      { key: 'title', label: t('title'), render: (p) => <div><button onClick={() => open(p)} className="text-start font-semibold text-slate-800 hover:underline">{p.title}</button><p className="mt-1 max-w-[350px] truncate text-xs text-slate-400">{p.content}</p></div> },
      { key: 'category', label: t('category'), render: (p) => p.category || '—' },
      { key: 'creator', label: t('owner'), render: (p) => displayName(p.creator) },
      { key: 'published', label: t('status'), render: (p) => <StatusBadge status={p.is_published ? 'published' : 'draft'} /> },
    ]} />;
}

export function DocumentsPage() {
  const { t, lang } = useI18n(); const toast = useToast();
  const download = useMutation({ mutationFn: ({ id, filename }: { id: number; filename?: string | null }) => api.downloadDocument(id, filename), onError: (error) => toast.error(error instanceof Error ? error.message : t('errorTitle')) });
  return <CollectionPage kind="documents" queryName="documents" queryFn={() => api.documents()} title="documents" eyebrow="grpOperations" icon={FileText} subtitle={{ en: 'A shared home for the documents your teams rely on.', ar: 'مكان مشترك للمستندات التي تعتمد عليها فرقك.' }} recordName={(d) => d.name} searchText={(d) => `${d.name} ${d.category} ${d.original_name ?? ''}`} getStatus={(d) => d.is_published ? 'published' : 'draft'} getUnit={(d) => d.unit?.name}
    columns={(open) => [
      { key: 'document', label: t('documents'), render: (d) => <div className="flex items-center gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600"><FileText size={16} /></span><div><button onClick={() => open(d)} className="text-start font-semibold text-slate-800 hover:underline">{d.name}</button><p className="mt-1 text-xs text-slate-400">{d.original_name} · {displayName(d.uploader)}</p></div></div> },
      { key: 'category', label: t('category'), render: (d) => <Badge>{d.category}</Badge> },
      { key: 'version', label: t('version'), render: (d) => `v${d.version ?? 1}` },
      { key: 'unit', label: t('unit'), render: (d) => d.unit?.name ?? '—' },
      { key: 'updated', label: t('updated'), render: (d) => formatDate(d.created_at, lang) },
      { key: 'download', label: t('download'), render: (d) => !api.demo ? <Button variant="ghost" size="sm" onClick={() => download.mutate({ id: d.id, filename: d.original_name || d.name })} disabled={download.isPending}><Download size={14} />{t('download')}</Button> : <span className="text-xs text-slate-400">—</span> },
    ]} />;
}
