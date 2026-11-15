import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, clearSession, persistSession, readStoredToken, readStoredUser } from '../lib/api';
import type { AuthUser, Lookups } from '../lib/types';

type AuthValue = {
  token: string | null;
  user: AuthUser | null;
  lookups: Lookups | undefined;
  abilities: string[];
  loading: boolean;
  lookupsError: Error | null;
  reloadLookups: () => void;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(() => readStoredToken());
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());

  const lookupsQuery = useQuery({
    queryKey: ['bms', 'lookups'],
    queryFn: () => api.lookups(),
    enabled: Boolean(token),
    staleTime: 60_000,
    retry: 1,
  });

  const login = useCallback(async (identifier: string, password: string) => {
    const authed = await api.login(identifier.trim(), password);
    const nextToken = authed.token;
    if (!nextToken) throw new Error('Missing token');
    persistSession(authed, nextToken);
    setToken(nextToken);
    setUser(authed);
    await queryClient.invalidateQueries({ queryKey: ['bms'] });
  }, [queryClient]);

  const logout = useCallback(async () => {
    try { await api.logout(); } finally {
      clearSession();
      setToken(null);
      setUser(null);
      queryClient.clear();
    }
  }, [queryClient]);

  const value = useMemo<AuthValue>(() => ({
    token,
    user,
    lookups: lookupsQuery.data,
    abilities: lookupsQuery.data?.can ?? [],
    loading: Boolean(token) && lookupsQuery.isLoading,
    lookupsError: lookupsQuery.error instanceof Error ? lookupsQuery.error : lookupsQuery.error ? new Error('Lookups failed') : null,
    reloadLookups: () => { void lookupsQuery.refetch(); },
    login,
    logout,
  }), [token, user, lookupsQuery.data, lookupsQuery.isLoading, lookupsQuery.error, lookupsQuery.refetch, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
