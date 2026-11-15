import { NavLink } from 'react-router-dom';
import { Boxes, ChevronDown, LogOut, X } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useI18n } from '../../i18n';
import { api } from '../../lib/api';
import { hasAbility } from '../../lib/abilities';
import { NAV_GROUPS } from '../../lib/nav';
import { cn } from '../../lib/utils';
import { Avatar, displayName } from '../ui/Avatar';

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n(); const { abilities, user, logout } = useAuth();
  return <>
    <div className={cn('fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-[2px] lg:hidden', open ? 'block' : 'hidden')} onClick={onClose} />
    <aside className={cn('fixed inset-y-0 start-0 z-40 flex w-[248px] shrink-0 flex-col border-e border-white/[0.05] bg-[#111426] text-slate-300 transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0', open ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full lg:rtl:translate-x-0')}>
      <div className="flex h-[76px] shrink-0 items-center justify-between px-5">
        <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-700 text-white shadow-[0_5px_14px_rgba(79,70,229,.32)]"><Boxes size={20} strokeWidth={1.8} /></span><div><div className="text-[15px] font-bold tracking-tight text-white">FGS <span className="font-medium text-indigo-300">/</span> BMS</div><div className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">{t('appFull')}</div></div></div>
        <button className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 lg:hidden" onClick={onClose} aria-label={t('closeDialog')}><X size={17} /></button>
      </div>
      <div className="mx-3 mb-3 flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.04] px-3 py-2.5"><span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-400/15 text-xs font-bold text-indigo-200">F</span><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-slate-200">FGS {t('workspace')}</p><p className="mt-0.5 text-[10px] text-slate-500">{api.demo ? t('demoWorkspace') : t('appFull')}</p></div><span className="h-1.5 w-1.5 rounded-full bg-teal-400" /></div>
      <nav className="flex-1 overflow-y-auto px-3 pb-4" aria-label={t('workspace')}>
        {NAV_GROUPS.map((group) => {
          const links = group.links.filter((link) => hasAbility(abilities, link.ability));
          if (!links.length) return null;
          return <div key={group.id} className="mb-3"><div className="px-3 pb-1.5 pt-3 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500">{t(group.label)}</div><ul className="space-y-0.5">{links.map((link) => { const Icon = link.icon; return <li key={link.path}><NavLink to={link.path} onClick={onClose} className={({ isActive }) => cn('relative flex min-h-[36px] items-center gap-3 rounded-lg px-3 py-2 text-[12px] font-medium transition', isActive ? 'bg-indigo-500/20 text-white shadow-[inset_0_0_0_1px_rgba(129,140,248,.12)]' : 'text-slate-400 hover:bg-white/[0.05] hover:text-slate-100')}><Icon size={16} strokeWidth={1.7} /><span className="truncate">{t(link.label)}</span></NavLink></li>; })}</ul></div>;
        })}
      </nav>
      <div className="shrink-0 border-t border-white/[0.07] p-3"><div className="flex items-center gap-2.5 rounded-xl px-2 py-2"><Avatar name={displayName(user)} src={user?.photoURL as string | undefined} /><div className="min-w-0 flex-1"><div className="truncate text-xs font-semibold text-white">{displayName(user)}</div><div className="mt-0.5 truncate text-[10px] text-slate-500">{user?.email ?? user?.username}</div></div><button onClick={() => void logout()} className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-slate-200" title={t('logout')} aria-label={t('logout')}><LogOut size={15} /></button></div></div>
    </aside>
  </>;
}
