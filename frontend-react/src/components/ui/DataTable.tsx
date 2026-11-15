import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Pencil, Search, SlidersHorizontal, Trash2 } from 'lucide-react';
import { useI18n, type MsgKey } from '../../i18n';
import { cn } from '../../lib/utils';
import { Button } from './Button';
import { EmptyState } from './States';

export interface Column<T> { key: string; label: string; render: (row: T) => ReactNode; className?: string }
interface Props<T extends { id: number }> {
  items: T[];
  columns: Column<T>[];
  title?: string;
  getSearchText: (item: T) => string;
  getStatus?: (item: T) => string | null | undefined;
  getUnit?: (item: T) => string | string[] | null | undefined;
  onEdit?: (item: T) => void;
  canEdit?: (item: T) => boolean;
  onDelete?: (item: T) => void;
  canDelete?: (item: T) => boolean;
  deleteLabel?: string;
  onBulkDelete?: (ids: number[]) => void;
  onCreate?: () => void;
  createLabel?: string;
  extra?: ReactNode;
  pageSize?: number;
}

export function statusLabel(status: string, t: (key: MsgKey) => string) {
  const value = t(status as MsgKey);
  return value === status ? status.replace(/_/g, ' ').replace(/^\w/, (letter) => letter.toUpperCase()) : value;
}

export function DataTable<T extends { id: number }>({ items, columns, title, getSearchText, getStatus, getUnit, onEdit, canEdit, onDelete, canDelete, deleteLabel, onBulkDelete, onCreate, createLabel, extra, pageSize = 8 }: Props<T>) {
  const { t, dir } = useI18n();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [unit, setUnit] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);
  const statuses = useMemo(() => Array.from(new Set(items.map((item) => getStatus?.(item)).filter((value): value is string => Boolean(value)))).sort(), [items, getStatus]);
  const units = useMemo(() => Array.from(new Set(items.flatMap((item) => { const value = getUnit?.(item); return Array.isArray(value) ? value : value ? [value] : []; }))).sort(), [items, getUnit]);
  const filtered = useMemo(() => items.filter((item) => {
    if (search && !getSearchText(item).toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())) return false;
    if (status && getStatus?.(item) !== status) return false;
    if (unit) { const value = getUnit?.(item); if (Array.isArray(value) ? !value.includes(unit) : value !== unit) return false; }
    return true;
  }), [items, search, status, unit, getSearchText, getStatus, getUnit]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const selectable = visible.filter((item) => !canDelete || canDelete(item));
  const allVisibleSelected = selectable.length > 0 && selectable.every((item) => selected.includes(item.id));
  useEffect(() => { setPage(1); }, [search, status, unit]);
  useEffect(() => {
    setSelected((prev) => {
      const next = prev.filter((id) => items.some((item) => item.id === id && (!canDelete || canDelete(item))));
      return next.length === prev.length ? prev : next;
    });
  }, [items, canDelete]);
  const hasActions = Boolean(onEdit || onDelete);
  const selectEnabled = Boolean(onBulkDelete);
  return <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-card">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
      <div className="flex items-center gap-2.5"><h2 className="text-sm font-semibold text-slate-900">{title ?? t('allRecords')}</h2><span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">{filtered.length}</span></div>
      {extra}
    </div>
    <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-4 py-3">
      <label className="relative min-w-[190px] flex-1 sm:max-w-[300px]"><span className="sr-only">{t('searchRecords')}</span><Search size={15} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('searchRecords')} className="h-9 w-full rounded-lg border border-slate-200 bg-white pe-3 ps-9 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10" /></label>
      {(getStatus || getUnit) && <span className="hidden text-slate-400 sm:block"><SlidersHorizontal size={15} /></span>}
      {getStatus && <select aria-label={t('filterStatus')} value={status} onChange={(event) => setStatus(event.target.value)} className="h-9 max-w-[170px] rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none focus:border-brand-400"><option value="">{t('allStatuses')}</option>{statuses.map((value) => <option key={value} value={value}>{statusLabel(value, t)}</option>)}</select>}
      {getUnit && <select aria-label={t('unit')} value={unit} onChange={(event) => setUnit(event.target.value)} className="h-9 max-w-[170px] rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none focus:border-brand-400"><option value="">{t('allUnits')}</option>{units.map((value) => <option key={value} value={value}>{value}</option>)}</select>}
      {selected.length > 0 && <div className="ms-auto flex items-center gap-2 text-xs text-slate-500"><span>{selected.length} {t('selectedCount')}</span><button type="button" onClick={() => setSelected([])} className="text-slate-400 hover:text-slate-700">{t('clearSelection')}</button><Button size="sm" variant="secondary" onClick={() => onBulkDelete?.(selected)} className="text-brand-600"><Trash2 size={13} />{t('deleteSelected')}</Button></div>}
    </div>
    {filtered.length === 0 ? <EmptyState title={items.length ? t('noMatching') : undefined} body={items.length ? t('adjustFilters') : t('getStarted')} action={!items.length && onCreate ? <Button onClick={onCreate} size="sm">{createLabel ?? t('create')}</Button> : undefined} /> : <div role="region" aria-label={title ?? t('allRecords')} tabIndex={0} className="max-h-[min(55vh,32rem)] overflow-auto">
      <table className="w-full min-w-[650px] text-sm">
        <thead className="sticky top-0 z-10 bg-slate-50"><tr className="border-b border-slate-100 text-start text-[10px] font-semibold uppercase tracking-[0.09em] text-slate-400">
          {selectEnabled && <th className="w-12 px-4 py-2.5 text-start"><input type="checkbox" aria-label={t('selectAll')} checked={allVisibleSelected} disabled={!selectable.length} onChange={() => setSelected((prev) => allVisibleSelected ? prev.filter((id) => !selectable.some((item) => item.id === id)) : Array.from(new Set([...prev, ...selectable.map((item) => item.id)])))} className="h-3.5 w-3.5 rounded border-slate-300 accent-brand-600 disabled:opacity-35" /></th>}
          {columns.map((column) => <th key={column.key} className={cn('px-4 py-2.5 text-start font-semibold', column.className)}>{column.label}</th>)}
          {hasActions && <th className="px-4 py-2.5 text-end font-semibold">{t('actions')}</th>}
        </tr></thead>
        <tbody>{visible.map((item) => <tr key={item.id} className="group border-b border-slate-100/80 last:border-0 hover:bg-slate-50/70">
          {selectEnabled && <td className="px-4 py-3"><input type="checkbox" aria-label={`${t('selectedCount')} ${getSearchText(item)}`} checked={selected.includes(item.id)} disabled={Boolean(canDelete && !canDelete(item))} onChange={() => setSelected((prev) => prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id])} className="h-3.5 w-3.5 rounded border-slate-300 accent-brand-600 disabled:opacity-35" /></td>}
          {columns.map((column) => <td key={column.key} className={cn('px-4 py-3 align-middle text-[13px] text-slate-600', column.className)}>{column.render(item)}</td>)}
          {hasActions && <td className="px-4 py-2"><div className="flex items-center justify-end gap-1">
            {onEdit && (!canEdit || canEdit(item)) && <button type="button" onClick={() => onEdit(item)} aria-label={`${t('edit')}: ${getSearchText(item)}`} title={t('edit')} className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-brand-600"><Pencil size={15} /></button>}
            {onDelete && (!canDelete || canDelete(item)) && <button type="button" onClick={() => onDelete(item)} aria-label={`${deleteLabel ?? t('remove')}: ${getSearchText(item)}`} title={deleteLabel ?? t('remove')} className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-brand-600"><Trash2 size={15} /></button>}
          </div></td>}
        </tr>)}</tbody>
      </table>
    </div>}
    {filtered.length > 0 && <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-2.5 text-xs text-slate-400"><span>{t('showing')} {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filtered.length)} {t('of')} {filtered.length}</span><div className="flex items-center gap-2"><span className="me-1">{t('page')} {currentPage} / {pages}</span><button type="button" aria-label={t('previous')} disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)} className="rounded-md border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50 disabled:opacity-35">{dir === 'rtl' ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}</button><button type="button" aria-label={t('next')} disabled={currentPage >= pages} onClick={() => setPage(currentPage + 1)} className="rounded-md border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50 disabled:opacity-35">{dir === 'rtl' ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}</button></div></div>}
  </div>;
}
