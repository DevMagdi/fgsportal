/** Mirrors backend BmsAccess. Wildcard `*` is a system admin. */
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
    { path: '/bonuses', ability: 'bonuses.view' },
    { path: '/recruitment', ability: 'recruitment.view' },
    { path: '/development', ability: 'development.view' },
    { path: '/procurement', ability: 'procurement.view' },
    { path: '/events', ability: 'events.view' },
    { path: '/documents', ability: 'documents.view' },
    { path: '/reports', ability: 'reports.view' },
    { path: '/access', ability: 'roles.manage' },
  ];
  const hit = order.find((item) => hasAbility(abilities, item.ability));
  return hit?.path ?? '/no-access';
}
