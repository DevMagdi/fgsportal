import { FormEvent, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../auth/AuthContext';
import { useI18n } from '../i18n';
import { api, ApiError } from '../lib/api';
import { firstAllowedPath } from '../lib/abilities';
import { Button } from '../components/ui/Button';

export function LoginPage() {
  const { t, lang, setLang } = useI18n();
  const { token, login, abilities } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (token) {
    const from = (location.state as { from?: string } | null)?.from;
    return <Navigate to={from || firstAllowedPath(abilities)} replace />;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login(identifier, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('errorTitle'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-full lg:grid-cols-[1.05fr_1fr]">
      <div className="relative hidden overflow-hidden bg-ink-950 text-slate-200 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, #4f46e5 0, transparent 32%), radial-gradient(circle at 80% 80%, #0d9488 0, transparent 28%)' }} />
        <div className="relative">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-600 text-xs font-bold text-white">BMS</span>
            <span className="text-sm font-semibold tracking-wide text-white">{t('appFull')}</span>
          </div>
          <h2 className="mt-16 max-w-md text-3xl font-semibold leading-snug tracking-tight text-white">
            A calm operating system for units, pipeline and delivery.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
            Executive visibility without the noise. One workspace for opportunities, weekly plans and the work that actually moves.
          </p>
        </div>
        <p className="relative text-xs text-slate-500">FGS · Business Management Solutions</p>
      </div>

      <div className="flex flex-col bg-white">
        <div className="flex justify-end p-5">
          <button className="text-xs font-medium text-slate-500 hover:text-slate-800" onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}>
            {lang === 'en' ? 'العربية' : 'English'}
          </button>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 pb-16">
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-[380px]"
          >
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{t('signIn')}</h1>
            <p className="mt-1.5 text-sm text-slate-500">{t('signInSub')}</p>

            <label className="mt-8 block text-xs font-medium text-slate-600">{t('identifier')}</label>
            <input
              autoFocus
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none ring-brand-600/20 transition focus:border-brand-500 focus:ring-4"
              autoComplete="username"
            />

            <label className="mt-4 block text-xs font-medium text-slate-600">{t('password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none ring-brand-600/20 transition focus:border-brand-500 focus:ring-4"
              autoComplete="current-password"
            />

            {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
            {api.demo && <p className="mt-3 text-xs leading-5 text-slate-400">{t('demoHint')}</p>}

            <Button type="submit" className="mt-6 w-full" disabled={busy || !identifier || !password}>
              {busy ? t('signingIn') : t('signIn')}
            </Button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
