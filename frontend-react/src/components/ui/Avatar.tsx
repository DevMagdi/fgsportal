import { cn, initials } from '../../lib/utils';

export function Avatar({ name, src, size = 'md' }: { name?: string | null; src?: string | null; size?: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 'h-7 w-7 text-[10px]' : 'h-8 w-8 text-[11px]';
  if (src) {
    return <img src={src} alt={name ?? ''} className={cn('rounded-full object-cover', dim)} />;
  }
  return (
    <span className={cn('grid place-items-center rounded-full bg-brand-50 font-semibold text-brand-700', dim)}>
      {initials(name)}
    </span>
  );
}

export function displayName(user?: { username?: string; firstname?: string | null; lastname?: string | null } | null) {
  if (!user) return '—';
  const full = [user.firstname, user.lastname].filter(Boolean).join(' ');
  return full || user.username || '—';
}
