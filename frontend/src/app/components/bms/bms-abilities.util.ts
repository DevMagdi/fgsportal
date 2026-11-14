/**
 * Ability check shared by every BMS screen, guard and navigation rule.
 *
 * The server grants System Administrators the wildcard ability `*`, which
 * means "every ability" (`BmsAccess::can` on the backend). `GET bms/lookups`
 * returns that wildcard in `can` next to the abilities named by some role, so
 * abilities that no role names explicitly (`units.manage`, `roles.manage`)
 * are only reachable through it. Checking plain membership would hide those
 * screens and actions from the one account type allowed to use them.
 */
export const BMS_WILDCARD_ABILITY = '*';

export function hasAbility(abilities: readonly string[] | null | undefined, ability: string): boolean {
  if (!abilities || !ability) return false;
  return abilities.includes(ability) || abilities.includes(BMS_WILDCARD_ABILITY);
}
