import { UserPermsCache } from './user-perms.cache';
import { UserPermissions } from '../interfaces/user-permissions';

/**
 * Node-runnable spec (no Angular TestBed): the permission cache must survive
 * transient GetUserPermission / /me failures so permission-gated module cards
 * never disappear while a user remains logged in.
 */
describe('UserPermsCache', () => {
  let store: Record<string, string>;

  beforeEach(() => {
    store = {};
    (globalThis as any).localStorage = {
      getItem: (key: string) => (key in store ? store[key] : null),
      setItem: (key: string, value: string) => {
        store[key] = String(value);
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  });

  const perms = (userKey: string): UserPermissions[] => [
    {
      userKey,
      username: 'tester',
      permission_id: 1,
      permission_name: 'view_salaries',
      status: 1 as any,
      permission_group_id: 7,
      permission_group_name: 'HR',
    },
  ];

  it('builds a per-user storage key and null for empty input', () => {
    expect(UserPermsCache.storageKey('42')).toBe('userPerms_42');
    expect(UserPermsCache.storageKey('')).toBeNull();
    expect(UserPermsCache.storageKey(undefined)).toBeNull();
    expect(UserPermsCache.storageKey(null)).toBeNull();
  });

  it('round-trips permissions through localStorage', () => {
    const saved = UserPermsCache.save('42', perms('42'));
    expect(saved.length).toBe(1);
    expect(store['userPerms_42']).toContain('view_salaries');
    expect(UserPermsCache.load('42')).toEqual(perms('42'));
  });

  it('keeps snapshots isolated per user', () => {
    UserPermsCache.save('42', perms('42'));
    UserPermsCache.save('99', [
      { ...perms('99')[0], permission_id: 2, permission_name: 'follow_ticket' },
    ]);

    const first = UserPermsCache.load('42');
    const second = UserPermsCache.load('99');
    expect(first[0].permission_name).toBe('view_salaries');
    expect(second[0].permission_name).toBe('follow_ticket');
  });

  it('coerces non-array payloads to an empty array', () => {
    const saved = UserPermsCache.save('42', { nope: true } as any);
    expect(saved).toEqual([]);
    expect(UserPermsCache.load('42')).toEqual([]);
  });

  it('returns an empty array when nothing was cached', () => {
    expect(UserPermsCache.load('missing')).toEqual([]);
    expect(UserPermsCache.load(undefined)).toEqual([]);
    expect(UserPermsCache.load(null)).toEqual([]);
  });

  it('falls back to an empty array for corrupt JSON', () => {
    store['userPerms_42'] = '{not-valid-json';
    expect(UserPermsCache.load('42')).toEqual([]);
  });

  it('save and load without a user key never touch storage', () => {
    expect(UserPermsCache.save(undefined, perms('42'))).toEqual([]);
    expect(Object.keys(store).length).toBe(0);
  });

  it('clear removes only the snapshot of the given user', () => {
    UserPermsCache.save('42', perms('42'));
    UserPermsCache.save('99', perms('99'));

    UserPermsCache.clear('42');

    expect(UserPermsCache.load('42')).toEqual([]);
    expect(UserPermsCache.load('99').length).toBe(1);
  });
});
