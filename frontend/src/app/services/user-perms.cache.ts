import { UserPermissions } from '../interfaces/user-permissions';

/**
 * Pure, framework-free permission snapshot store.
 *
 * The portal hides every permission-gated card when GetUserPermission (or the
 * /me call it depends on) fails with a 500 or network error. Keeping the last
 * successful permission set per user in localStorage means a transient backend
 * failure can never blank the module pages while the user stays logged in.
 *
 * This class deliberately has no Angular dependency so the caching contract
 * can be exercised by the Node test harness.
 */
export class UserPermsCache {
  static readonly PREFIX = 'userPerms_';

  /** Per-user localStorage key, or null when no user key is available. */
  static storageKey(userKey?: string | null): string | null {
    return userKey ? `${UserPermsCache.PREFIX}${userKey}` : null;
  }

  /** Normalise the input and persist it; returns the stored array. */
  static save(userKey: string | null | undefined, perms: unknown): UserPermissions[] {
    const key = UserPermsCache.storageKey(userKey);
    // Without an owning user there is nowhere to cache: keep nothing, neither
    // in localStorage nor in the caller's in-memory copy.
    if (!key) {
      return [];
    }
    const safe = Array.isArray(perms) ? (perms as UserPermissions[]) : [];
    localStorage.setItem(key, JSON.stringify(safe));
    return safe;
  }

  /** Reload the snapshot; missing keys and corrupt JSON both yield []. */
  static load(userKey?: string | null): UserPermissions[] {
    const key = UserPermsCache.storageKey(userKey);
    if (!key) {
      return [];
    }
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as UserPermissions[]) : [];
    } catch {
      return [];
    }
  }

  /** Remove the snapshot for the given user (used on logout). */
  static clear(userKey?: string | null): void {
    const key = UserPermsCache.storageKey(userKey);
    if (key) {
      localStorage.removeItem(key);
    }
  }
}
