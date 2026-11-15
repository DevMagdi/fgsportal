import palette from '../brand.json';
import { hasAbility } from './abilities';
import { OPPORTUNITY_STAGES } from './catalog';
import type { ExecutiveDashboard, Opportunity } from './types';

/** A missing denominator is unknown, not a fabricated 0% measurement. */
export function percentage(count: number, total: number): number | null {
  if (!Number.isFinite(count) || !Number.isFinite(total) || total <= 0) return null;
  return Math.round((count / total) * 100);
}

const percentFormatters = {
  en: new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 0 }),
  ar: new Intl.NumberFormat('ar-EG', { style: 'percent', maximumFractionDigits: 0 }),
};
export function formatPercentage(value: number, lang: string): string {
  return percentFormatters[lang === 'ar' ? 'ar' : 'en'].format(value / 100);
}

export type DashboardRatio = { count: number; total: number; percent: number | null };
function ratio(count: number, total: number): DashboardRatio {
  return { count, total, percent: percentage(count, total) };
}

/** Ratios describe the current response, not a comparison with an earlier period. */
export function dashboardRatios(data: ExecutiveDashboard) {
  return {
    units: ratio(data.unit_progress.filter((unit) => unit.total > 0).length, data.unit_progress.length),
    tasks: ratio(data.summary.achieved, data.summary.tasks),
    opportunities: ratio(data.opportunities.filter((opportunity) => opportunity.is_delayed).length, data.opportunities.length),
    products: ratio(data.products.filter((product) => Boolean(product.currentPhase)).length, data.products.length),
    meetings: ratio(data.meetings.filter((meeting) => meeting.business_unit_id != null || meeting.unit != null).length, data.meetings.length),
  };
}

export type PipelineSegment = {
  key: string;
  stage: string;
  delayed: boolean;
  count: number;
  percent: number;
  color: string;
};

/** Preserve stage detail while distinguishing delayed records from the rest of a stage. */
export function pipelineSegments(opportunities: Pick<Opportunity, 'stage' | 'is_delayed'>[]): PipelineSegment[] {
  const groups = new Map<string, Omit<PipelineSegment, 'percent'>>();
  for (const opportunity of opportunities) {
    const stage = opportunity.stage;
    const closed = ['won', 'lost', 'declined', 'closed'].includes(stage);
    const delayed = Boolean(opportunity.is_delayed) && !closed;
    const key = `${stage}:${delayed ? 'delayed' : 'normal'}`;
    const color = stage === 'won' ? palette.turquoise : delayed || stage === 'lost' || stage === 'declined' ? palette.pink : palette.violet;
    const group = groups.get(key);
    if (group) group.count += 1;
    else groups.set(key, { key, stage, delayed, count: 1, color });
  }
  const order = (stage: string) => {
    const index = OPPORTUNITY_STAGES.indexOf(stage as typeof OPPORTUNITY_STAGES[number]);
    return index < 0 ? OPPORTUNITY_STAGES.length : index;
  };
  return [...groups.values()]
    .sort((a, b) => order(a.stage) - order(b.stage) || Number(a.delayed) - Number(b.delayed))
    .map((group) => ({ ...group, percent: percentage(group.count, opportunities.length) ?? 0 }));
}

/** Reuse the manager's create permission and require access to its collection. */
export function canQuickCreate(abilities: readonly string[], viewAbility: string, canManage: boolean): boolean {
  return canManage && hasAbility(abilities, viewAbility);
}
