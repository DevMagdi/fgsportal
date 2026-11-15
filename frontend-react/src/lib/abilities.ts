/** Mirrors backend BmsAccess + Angular `hasAbility()`. Wildcard `*` is a system admin. */
export const WILDCARD = '*';

export function hasAbility(abilities: readonly string[] | null | undefined, ability: string): boolean {
  if (!abilities || !ability) return false;
  return abilities.includes(ability) || abilities.includes(WILDCARD);
}

export function firstAllowedPath(abilities: readonly string[] | null | undefined): string {
  const order: { path: string; ability: string }[] = [
    { path: '/dashboard', ability: 'dashboard.view' },
    { path: '/opportunities', ability: 'opportunities.view' },
    { path: '/plans', ability: 'plans.view' },
    { path: '/units', ability: 'units.view' },
    { path: '/leads', ability: 'leads.view' },
    { path: '/meetings', ability: 'meetings.view' },
    { path: '/products', ability: 'products.view' },
    { path: '/employees', ability: 'directory.view' },
    { path: '/reports', ability: 'reports.view' },
  ];
  const hit = order.find((item) => hasAbility(abilities, item.ability));
  return hit?.path ?? '/no-access';
}
