import { hasAbility } from '../components/bms/bms-abilities.util';
/**
 * Decides which BMS endpoints the global shell may call. The shell is mounted on
 * every signed-in page, so nothing BMS-specific is requested unless the user is
 * entitled to it or is actually inside the BMS workspace.
 *
 * Server rules these mirror (backend/routes/api.php, `bms` group):
 *   every route      -> middleware `module:bms`
 *   GET alerts       -> `bms.permission:opportunities.view`
 *   GET notifications -> no further permission
 */
export interface BmsRequestContext {
  /** The current URL is `/bms` or below. */
  inBms: boolean;
  /** The company owns the `bms` module (ModuleService). */
  moduleEnabled: boolean;
  /** Abilities of the last `GET bms/lookups` answer; `null` when none arrived yet. */
  abilities: string[] | null;
  /** The last `GET bms/lookups` request failed. */
  failed: boolean;
}

export const BMS_ALERTS_ABILITY = 'opportunities.view';

/** `GET bms/lookups`: only for companies that own BMS, or on a BMS page (where the retired BMS shell always asked). */
export function shouldLoadBmsAbilities(context: Pick<BmsRequestContext, 'inBms' | 'moduleEnabled'>): boolean {
  return context.inBms || context.moduleEnabled;
}

/** Abilities are confirmed by a successful server answer. */
function confirmed(context: BmsRequestContext): context is BmsRequestContext & { abilities: string[] } {
  return context.abilities !== null && !context.failed && shouldLoadBmsAbilities(context);
}

/** `GET bms/alerts`: exactly the ability the endpoint itself demands. */
export function shouldLoadBmsAlerts(context: BmsRequestContext): boolean {
  return confirmed(context) && hasAbility(context.abilities, BMS_ALERTS_ABILITY);
}

/** `GET bms/notifications`: for users holding at least one BMS ability, or on a BMS page. */
export function shouldLoadBmsNotifications(context: BmsRequestContext): boolean {
  return confirmed(context) && (context.inBms || context.abilities.length > 0);
}
