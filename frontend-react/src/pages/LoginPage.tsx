import { FormEvent, useState, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import logo from '../assets/alphaiota-logo.png';
import { useAuth } from '../auth/AuthContext';
import { useI18n } from '../i18n';
import { api, ApiError } from '../lib/api';
import { firstAllowedPath } from '../lib/abilities';
import { interactionSpring } from '../lib/motion';
import { useEntranceValues } from '../lib/useAccessibleMotion';
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion';
import { Button } from '../components/ui/Button';
import { LoadingState } from '../components/ui/States';

const formMotion: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const fieldMotion: Variants = { hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0, transition: { duration: 0.26, ease: 'easeOut' } } };

function LoginDecoration({ reduced, className, delay = 0 }: { reduced: boolean; className: string; delay?: number }) {
  if (reduced) return <div aria-hidden="true" className={className} />;
  return <motion.div aria-hidden="true" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay, ease: 'easeOut' }} className={className} />;
}

function LoginLogo({ reduced, className, lift = false }: { reduced: boolean; className: string; lift?: boolean }) {
  if (reduced) return <img src={logo} alt="" className={className} />;
  return <motion.img src={logo} alt="" initial={{ opacity: 0, scale: 0.94, y: lift ? 6 : 0 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={interactionSpring} className={className} />;
}

function LoginField({ reduced, as = 'div', className, children }: { reduced: boolean; as?: 'div' | 'p'; className?: string; children: ReactNode }) {
  const values = useEntranceValues(reduced, reduced ? false : { opacity: 0, y: 6 });
  const props = { variants: fieldMotion, animate: reduced ? { opacity: 1, y: 0, transition: { duration: 0 } } : undefined, style: values, className, children };
  return as === 'p' ? <motion.p {...props} /> : <motion.div {...props} />;
}

export function LoginPage() {
  const { t, lang, setLang } = useI18n();
  const reduceMotion = usePrefersReducedMotion();
  const { token, login, abilities, loading, lookupsError } = useAuth();
  const location = useLocation();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (token) {
    if (loading) return <div className="mx-auto max-w-4xl p-8"><LoadingState /></div>;
    const from = (location.state as { from?: string } | null)?.from;
    return <Navigate to={lookupsError ? '/dashboard' : from || firstAllowedPath(abilities)} replace />;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login(identifier, password);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('errorTitle'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-full lg:grid-cols-[46%_54%]">
      <div className="relative hidden overflow-hidden bg-brand-600 text-white lg:flex lg:flex-col lg:items-center lg:justify-center lg:px-12 lg:py-16">
        <LoginDecoration reduced={reduceMotion} className="pointer-events-none absolute -start-40 -top-40 h-[420px] w-[420px] rounded-full border border-skin/20" />
        <LoginDecoration reduced={reduceMotion} delay={0.05} className="pointer-events-none absolute -bottom-52 -end-32 h-[480px] w-[480px] rounded-full border border-skin/20" />
        <div className="relative flex max-w-md flex-col items-center text-center">
          <LoginLogo reduced={reduceMotion} lift className="h-32 w-32 rounded-full object-contain" />
          <p dir="ltr" className="mt-5 text-2xl font-semibold tracking-tight">Alphaiota BMS</p>
          <span aria-hidden="true" className="mt-7 h-px w-12 bg-skin" />
          <h2 className="mt-7 text-[28px] font-semibold leading-snug tracking-tight">
            {lang === 'ar' ? 'وضوح أكبر لكل ما يهمّ العمل.' : 'A clearer view of the work that matters.'}
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/80">
            {lang === 'ar' ? 'مساحة واحدة تجمع الوحدات والفرص والخطط والتنفيذ.' : 'One connected workspace for your units, opportunities, plans and delivery.'}
          </p>
        </div>
        <p className="absolute bottom-8 text-[11px] font-medium tracking-wide text-white/70">Alphaiota BMS · {t('workspace')}</p>
      </div>

      <div className="flex min-h-full flex-col bg-white">
        <div className="flex justify-end px-6 py-5 sm:px-10">
          <button type="button" aria-label={`${t('changeLanguage')}: ${lang === 'en' ? 'العربية' : 'English'}`} className="rounded-md px-2 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-brand-600" onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}>
            {lang === 'en' ? 'العربية' : 'English'}
          </button>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 pb-14 pt-4">
          <motion.form
            onSubmit={onSubmit}
            variants={formMotion}
            initial={reduceMotion ? false : 'hidden'}
            animate="visible"
            className="w-full max-w-[390px]"
          >
            <LoginField reduced={reduceMotion} className="mb-8 flex flex-col items-center gap-2 lg:hidden">
              <LoginLogo reduced={reduceMotion} className="h-[76px] w-[76px] rounded-full object-contain" />
              <p dir="ltr" className="text-base font-semibold text-brand-600">Alphaiota BMS</p>
            </LoginField>
            <LoginField reduced={reduceMotion}>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">{t('workspace')}</p>
              <h1 className="text-[28px] font-semibold tracking-tight text-brand-600">{t('signIn')}</h1>
              <p className="mt-2 text-sm text-slate-500">{t('signInSub')}</p>
            </LoginField>

            <LoginField reduced={reduceMotion} className="mt-8">
              <label htmlFor="login-identifier" className="block text-xs font-semibold text-slate-700">{t('identifier')}</label>
              <input
                id="login-identifier"
                autoFocus
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none ring-brand-600/20 transition focus:border-brand-500 focus:ring-4"
                autoComplete="username"
              />
            </LoginField>

            <LoginField reduced={reduceMotion} className="mt-5">
              <label htmlFor="login-password" className="block text-xs font-semibold text-slate-700">{t('password')}</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none ring-brand-600/20 transition focus:border-brand-500 focus:ring-4"
                autoComplete="current-password"
              />
            </LoginField>

            {error && <p role="alert" className="mt-3 rounded-lg bg-pink/20 px-3 py-2 text-sm text-brand-600">{error}</p>}
            {api.demo && <LoginField as="p" reduced={reduceMotion} className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-500">{t('demoHint')}</LoginField>}

            <LoginField reduced={reduceMotion} className="mt-6">
              <Button type="submit" className="w-full" disabled={busy || !identifier || !password}>
                {busy ? t('signingIn') : t('signIn')}
              </Button>
            </LoginField>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
