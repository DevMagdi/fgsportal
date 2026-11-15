import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut, X } from 'lucide-react';
import logo from '../../assets/alphaiota-logo.png';
import { useAuth } from '../../auth/AuthContext';
import { useI18n } from '../../i18n';
import { api } from '../../lib/api';
import { hasAbility } from '../../lib/abilities';
import { NAV_GROUPS } from '../../lib/nav';
import { cn } from '../../lib/utils';
import { Avatar, displayName } from '../ui/Avatar';

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n();
  const { abilities, user, logout } = useAuth();

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', dismiss);
    return () => document.removeEventListener('keydown', dismiss);
  }, [open, onClose]);

  return <>
    <div aria-hidden="true" className={cn('fixed inset-0 z-30 bg-brand-900/50 backdrop-blur-[2px] lg:hidden', open ? 'block' : 'hidden')} onClick={onClose} />
    <aside id="workspace-navigation" className={cn(
      'brand-sidebar fixed inset-y-0 start-0 z-40 flex w-[236px] shrink-0 flex-col bg-brand-600 text-white transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0',
      open ? 'visible translate-x-0' : 'invisible -translate-x-full rtl:translate-x-full lg:visible lg:rtl:translate-x-0',
    )}>
      <div className="relative flex shrink-0 flex-col items-center gap-1 border-b border-white/10 px-4 pb-2.5 pt-3">
        <img src={logo} alt="" className="h-[42px] w-[42px] rounded-full object-contain" />
        <span dir="ltr" className="text-[13px] font-semibold tracking-[0.01em] text-white">Alphaiota BMS</span>
        <button type="button" className="absolute end-3 top-3 rounded-md p-1.5 text-white/80 hover:bg-white/10 lg:hidden" onClick={onClose} aria-label={t('closeDialog')}><X size={17} /></button>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-2.5 py-1" aria-label={t('workspace')}>
        {NAV_GROUPS.map((group) => {
          const links = group.links.filter((link) => hasAbility(abilities, link.ability));
          if (!links.length) return null;
          return <div key={group.id} className="nav-group mb-1">
            <div className="nav-group-label px-3 pb-1 pt-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-skin">{t(group.label)}</div>
            <ul>{links.map((link) => {
              const Icon = link.icon;
              return <li key={link.path}>
                <NavLink to={link.path} onClick={onClose} className={({ isActive }) => cn(
                  'relative flex min-h-[26px] items-center gap-2.5 rounded-md px-3 py-1 text-[12px] font-medium leading-[18px] transition-colors',
                  isActive ? 'bg-white/15 text-white before:absolute before:inset-y-1 before:start-0 before:w-0.5 before:rounded-full before:bg-skin' : 'text-white/80 hover:bg-white/10 hover:text-white',
                )}>
                  <Icon size={15} strokeWidth={1.7} className="shrink-0" /><span className="truncate">{t(link.label)}</span>
                </NavLink>
              </li>;
            })}</ul>
          </div>;
        })}
      </nav>

      <div className="shrink-0 border-t border-white/10 p-2.5">
        <div className="flex items-center gap-2.5 rounded-lg px-1.5 py-1">
          <Avatar name={displayName(user)} src={user?.photoURL as string | undefined} />
          <div className="min-w-0 flex-1"><div className="truncate text-xs font-semibold text-white">{displayName(user)}</div><div className="mt-0.5 truncate text-[10px] text-white/75">{api.demo ? t('demoWorkspace') : user?.email ?? user?.username}</div></div>
          <button type="button" onClick={() => void logout()} className="rounded-md p-2 text-white/75 transition hover:bg-white/10 hover:text-white" title={t('logout')} aria-label={t('logout')}><LogOut size={15} /></button>
        </div>
      </div>
    </aside>
  </>;
}
