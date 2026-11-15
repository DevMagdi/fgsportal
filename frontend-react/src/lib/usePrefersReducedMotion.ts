import { useSyncExternalStore } from 'react';

const query = '(prefers-reduced-motion: reduce)';
let media: MediaQueryList | undefined;

function motionPreference() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
  return media ??= window.matchMedia(query);
}

function subscribe(onChange: () => void) {
  const preference = motionPreference();
  if (!preference) return () => {};
  if (preference.addEventListener) {
    preference.addEventListener('change', onChange);
    return () => preference.removeEventListener('change', onChange);
  }
  preference.addListener(onChange);
  return () => preference.removeListener(onChange);
}

/** Unlike a one-time snapshot, this also reacts when the OS preference changes. */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, () => motionPreference()?.matches ?? false, () => false);
}
