import { useId, type ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { useI18n } from '../../i18n';
import { AnimatedValue } from './AnimatedValue';

export interface TabItem { id: string; label: string; count?: number; content: ReactNode }
export function Tabs({ items, value, onChange }: { items: TabItem[]; value: string; onChange: (value: string) => void }) {
  const id = useId();
  const { dir, t } = useI18n();
  const selected = items.find((item) => item.id === value) ?? items[0];
  return <div>
    <div role="tablist" className="flex gap-5 overflow-x-auto border-b border-slate-200/80" aria-label={t('sections')}>
      {items.map((item, index) => <button key={item.id} type="button" id={`${id}-${item.id}`} role="tab" aria-selected={selected.id === item.id} aria-controls={`${id}-panel-${item.id}`} tabIndex={selected.id === item.id ? 0 : -1}
        onClick={() => onChange(item.id)}
        onKeyDown={(event) => {
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault();
          let next = index;
          if (event.key === 'Home') next = 0;
          else if (event.key === 'End') next = items.length - 1;
          else next = (index + ((event.key === 'ArrowRight') === (dir === 'ltr') ? 1 : -1) + items.length) % items.length;
          onChange(items[next].id);
          document.getElementById(`${id}-${items[next].id}`)?.focus();
        }}
        className={cn('relative shrink-0 whitespace-nowrap py-2.5 text-[13px] font-medium transition', selected.id === item.id ? 'text-brand-700 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-brand-600' : 'text-slate-500 hover:text-slate-800')}>
        {item.label}{typeof item.count === 'number' && <span className={cn('ms-2 rounded-md px-1.5 py-0.5 text-[10px]', selected.id === item.id ? 'bg-brand-50 text-brand-700' : 'bg-slate-100 text-slate-500')}><AnimatedValue value={item.count} /></span>}
      </button>)}
    </div>
    <div role="tabpanel" id={`${id}-panel-${selected.id}`} aria-labelledby={`${id}-${selected.id}`} className="pt-4">{selected.content}</div>
  </div>;
}
