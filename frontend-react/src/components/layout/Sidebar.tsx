import { NavLink } from 'react-router-dom';
import { LogOut, X } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useI18n } from '../../i18n';
import { hasAbility } from '../../lib/abilities';
import { NAV_GROUPS } from '../../lib/nav';
import { cn } from '../../lib/utils';
import { Avatar, displayName } from '../ui/Avatar';

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n();
  const { abilities, user, logout } = useAuth();

  return (
    <>
      <div
        className={cn('fixed inset-0 z-30 bg-ink-950/40 backdrop-blur-[2px] lg:hidden', open ? 'block' : 'hidden')}
        onClick={onClose}
      />
      <aside
        className={cn(
          'fixed inset-y-0 z-40 flex w-[260px] flex-col bg-ink-950 text-slate-300 transition-transform lg:static lg:translate-x-0',
          'start-0',
          open ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full lg:rtl:translate-x-0',
        )}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-[11px] font-bold tracking-tight text-white">
              BMS
            </span>
            <div>
              <div className="text-[13px] font-semibold text-white">{t('appName')}</div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">{t('appFull')}</div>
            </div>
          </div>
          <button className="lg:hidden text-slate-400" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          {NAV_GROUPS.map((group) => {
            const links = group.links.filter((l) => hasAbility(abilities, l.ability) || abilities.length === 0);
            if (!links.length) return null;
            return (
              <div key={group.id} className="mb-4">
                <div className="px-3 pb-1.5 pt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {t(group.label)}
                </div>
                <ul className="space-y-0.5">
                  {links.map((link) => {
                    const Icon = link.icon;
                    return (
                      <li key={link.path}>
                        <NavLink
                          to={link.path}
                          onClick={onClose}
                          className={({ isActive }) =>
                            cn(
                              'flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition',
                              isActive
                                ? 'bg-white/10 text-white'
                                : 'text-slate-400 hover:bg-white/5 hover:text-slate-100',
                            )
                          }
                        >
                          <Icon size={16} strokeWidth={1.75} />
                          <span className="truncate">{t(link.label)}</span>
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        <div className="border-t border-white/5 p-3">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
            <Avatar name={displayName(user)} src={user?.photoURL as string | undefined} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-medium text-white">{displayName(user)}</div>
              <div className="truncate text-[11px] text-slate-500">{user?.email ?? user?.username}</div>
            </div>
            <button
              onClick={() => void logout()}
              className="rounded-md p-1.5 text-slate-500 hover:bg-white/5 hover:text-slate-200"
              title={t('logout')}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
