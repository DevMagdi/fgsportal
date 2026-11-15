import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { hasAbility } from '../lib/abilities';
import { Spinner } from '../components/ui/Spinner';
import { useI18n } from '../i18n';

export function ProtectedRoute() {
  const { token } = useAuth();
  const location = useLocation();
  if (!token) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

export function AbilityRoute({ ability }: { ability: string }) {
  const { abilities, loading, token, lookupsError, reloadLookups } = useAuth();
  const { t } = useI18n();
  if (!token) return <Navigate to="/login" replace />;
  if (loading) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <Spinner label={t('loading')} />
      </div>
    );
  }
  if (lookupsError) {
    return (
      <div className="grid min-h-[50vh] place-items-center px-6 text-center">
        <div>
          <p className="text-sm font-medium text-slate-800">{t('permissionsLoadError')}</p>
          <p className="mt-1 text-sm text-slate-500">{lookupsError.message}</p>
          <button type="button" onClick={reloadLookups} className="mt-4 text-sm font-medium text-brand-600">
            {t('retry')}
          </button>
        </div>
      </div>
    );
  }
  if (!hasAbility(abilities, ability)) {
    return <Navigate to="/no-access" replace />;
  }
  return <Outlet />;
}
