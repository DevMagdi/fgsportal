import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { cn, initials } from '../../lib/utils';

export function Avatar({ name, src, size = 'md' }: { name?: string | null; src?: string | null; size?: 'sm' | 'md' }) {
  const protectedPhoto = Boolean(src?.startsWith('/api/bms/employees/'));
  const [resolved, setResolved] = useState<string | null>(() => protectedPhoto ? null : src ?? null);
  useEffect(() => {
    if (!src) { setResolved(null); return; }
    if (!protectedPhoto) { setResolved(src); return; }
    let active = true; let objectUrl: string | null = null;
    setResolved(null);
    void api.employeePhoto(src).then((blob) => {
      if (!active) return;
      objectUrl = URL.createObjectURL(blob); setResolved(objectUrl);
    }).catch(() => { if (active) setResolved(null); });
    return () => { active = false; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [src, protectedPhoto]);
  const dim = size === 'sm' ? 'h-7 w-7 text-[10px]' : 'h-8 w-8 text-[11px]';
  if (resolved) return <img src={resolved} alt={name ?? ''} onError={() => setResolved(null)} className={cn('rounded-full object-cover', dim)} />;
  return <span className={cn('grid shrink-0 place-items-center rounded-full bg-brand-50 font-semibold text-brand-700', dim)}>{initials(name)}</span>;
}

export function displayName(user?: { username?: string; firstname?: string | null; lastname?: string | null } | null) {
  if (!user) return '—';
  const full = [user.firstname, user.lastname].filter(Boolean).join(' ');
  return full || user.username || '—';
}
