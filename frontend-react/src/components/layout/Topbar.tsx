import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell, ChevronRight, Command, Menu, Search } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useI18n } from '../../i18n';
import { hasAbility } from '../../lib/abilities';
import { api } from '../../lib/api';
import { NAV_GROUPS } from '../../lib/nav';
import { formatDateTime } from '../../lib/utils';
import { Avatar, displayName } from '../ui/Avatar';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const { t, lang, setLang } = useI18n(); const { user, abilities } = useAuth(); const location = useLocation(); const navigate = useNavigate(); const client = useQueryClient(); const toast = useToast();
  const [palette, setPalette] = useState(false); const [search, setSearch] = useState(''); const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notes = useQuery({ queryKey: ['bms', 'notifications'], queryFn: () => api.notifications(), staleTime: 30_000 });
  const mark = useMutation({ mutationFn: (id: string | number) => api.markNotificationRead(id), onSuccess: () => { void client.invalidateQueries({ queryKey: ['bms', 'notifications'] }); }, onError: (error) => toast.error(error instanceof Error ? error.message : t('errorTitle')) });
  useEffect(() => { const handler = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setPalette((value) => !value); setSearch(''); } }; document.addEventListener('keydown', handler); return () => document.removeEventListener('keydown', handler); }, []);
  const links = NAV_GROUPS.flatMap((g) => g.links).filter((link) => hasAbility(abilities, link.ability));
  const current = links.find((link) => location.pathname === link.path || location.pathname.startsWith(`${link.path}/`));
  const results = links.filter((link) => `${t(link.label)} ${link.path}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
  const unread = notes.data?.filter((n) => !n.read_at).length ?? 0;
  return <>
    <header className="sticky top-0 z-20 flex h-[66px] items-center justify-between gap-3 border-b border-slate-200/75 bg-white/90 px-4 backdrop-blur-xl lg:px-8">
      <div className="flex min-w-0 items-center gap-3"><button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={onMenu} aria-label={t('openMenu')}><Menu size={19} /></button><div className="hidden min-w-0 items-center gap-2 text-xs sm:flex"><span className="text-slate-400">{t('workspace')}</span><ChevronRight size={14} className="text-slate-300 rtl:rotate-180" /><span className="truncate font-semibold text-slate-700">{current ? t(current.label) : t('overview')}</span></div></div>
      <div className="flex items-center gap-2 sm:gap-3"><button type="button" onClick={() => { setSearch(''); setPalette(true); }} className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/60 px-3 text-xs text-slate-400 transition hover:border-slate-300 hover:bg-white"><Search size={15} /><span className="hidden lg:inline">{t('quickSearch')}</span><kbd className="ms-4 hidden rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 lg:inline">⌘ K</kbd></button>
        <button type="button" onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} aria-label={t('changeLanguage')} className="rounded-lg px-2 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100">{lang === 'en' ? 'العربية' : 'EN'}</button>
        <div className="relative"><button type="button" onClick={() => setNotificationsOpen((v) => !v)} aria-expanded={notificationsOpen} aria-label={t('notifications')} className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"><Bell size={17} />{unread > 0 && <span className="absolute end-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-white bg-teal-500" />}</button>
          {notificationsOpen && <div className="absolute end-0 top-11 z-30 w-[min(340px,calc(100vw-32px))] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lift"><div className="flex items-center justify-between border-b border-slate-100 px-4 py-3"><span className="text-sm font-semibold text-slate-800">{t('notifications')}</span><span className="text-xs text-slate-400">{unread}</span></div>{!notes.data?.length ? <p className="p-5 text-sm text-slate-400">{t('notificationsEmpty')}</p> : <ul className="max-h-80 overflow-y-auto divide-y divide-slate-100">{notes.data.map((note) => <li key={note.id}><button className="w-full px-4 py-3 text-start hover:bg-slate-50" onClick={() => { if (!note.read_at) mark.mutate(note.id); }}><span className="flex items-center gap-2 text-xs font-semibold text-slate-700">{!note.read_at && <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />}{note.title ?? note.data?.title}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{note.message ?? note.data?.message}</span><span className="mt-1 block text-[10px] text-slate-400">{formatDateTime(note.created_at, lang)}</span></button></li>)}</ul>}</div>}
        </div><div className="hidden h-6 w-px bg-slate-200 sm:block" /><span className="hidden sm:block"><Avatar name={displayName(user)} src={user?.photoURL as string | undefined} size="sm" /></span></div>
    </header>
    <Modal open={palette} onClose={() => setPalette(false)} title={t('quickSearch')} description={t('commandHint')} size="lg"><div className="px-5 pb-5 pt-4"><label className="relative block"><Search size={17} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('searchPlaceholder')} className="h-11 w-full rounded-lg border border-slate-200 ps-10 pe-3 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10" /></label><div className="mt-3 max-h-[50vh] overflow-y-auto">{results.length ? results.map((link) => { const Icon = link.icon; return <button key={link.path} onClick={() => { setPalette(false); navigate(link.path); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-start text-sm text-slate-700 hover:bg-indigo-50 hover:text-brand-700"><Icon size={16} /><span className="flex-1 font-medium">{t(link.label)}</span><ChevronRight size={14} className="text-slate-300 rtl:rotate-180" /></button>; }) : <p className="py-8 text-center text-sm text-slate-400">{t('noResultsHint')}</p>}</div></div></Modal>
  </>;
}
