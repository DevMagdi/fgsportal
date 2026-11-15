import { Bell, Menu } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../auth/AuthContext';
import { useI18n } from '../../i18n';
import { api } from '../../lib/api';
import { Button } from '../ui/Button';

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const { t, lang, setLang } = useI18n();
  const { user } = useAuth();
  const { data: notes } = useQuery({
    queryKey: ['bms', 'notifications'],
    queryFn: () => api.notifications(),
    staleTime: 30_000,
  });
  const unread = notes?.filter((n) => !n.read_at).length ?? 0;

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-slate-200/80 bg-white/85 px-4 backdrop-blur lg:px-8">
      <div className="flex items-center gap-3">
        <button className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={onMenu} aria-label="Menu">
          <Menu size={18} />
        </button>
        <p className="hidden text-sm text-slate-500 sm:block">
          {t('greeting')}, <span className="font-medium text-slate-800">{user?.firstname || user?.username}</span>
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
        >
          {lang === 'en' ? 'العربية' : 'English'}
        </Button>
        <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label={t('notifications')}>
          <Bell size={16} />
          {unread > 0 && (
            <span className="absolute end-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-teal-500" />
          )}
        </button>
      </div>
    </header>
  );
}
