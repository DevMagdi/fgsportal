import { hasAbility } from './bms-abilities.util';

describe('BMS ability check', () => {
  it('grants an ability that is listed', () => {
    expect(hasAbility(['units.view'], 'units.view')).toBe(true);
  });
  it('refuses an ability that is not listed', () => {
    expect(hasAbility(['units.view'], 'units.manage')).toBe(false);
    expect(hasAbility([], 'units.view')).toBe(false);
    expect(hasAbility(null, 'units.view')).toBe(false);
  });
  it('treats the server wildcard as every ability, as the backend does', () => {
    expect(hasAbility(['*', 'units.view'], 'units.manage')).toBe(true);
    expect(hasAbility(['*'], 'roles.manage')).toBe(true);
  });
  it('never grants an empty ability name', () => {
    expect(hasAbility(['*'], '')).toBe(false);
  });
});
