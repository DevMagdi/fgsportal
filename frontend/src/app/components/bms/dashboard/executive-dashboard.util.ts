export interface DashboardFilterValues {
  business_unit_id?: string | number | null;
  product_id?: string | number | null;
  opportunity_id?: string | number | null;
  week_start?: string | null;
}

export interface UnitProgressRow {
  id: number | string;
  name: string;
  total: number;
  progress: number;
  barWidth: number;
}

export interface OpportunityStageRow {
  key: string;
  label: string;
  count: number;
  percent: number;
}

export interface KpiHistoryPoint {
  period_start: string;
  period_end?: string;
  actual: number | string | null;
  target: number | string | null;
}

export interface TrendChartPoint extends KpiHistoryPoint {
  x: number;
  actualY: number;
  targetY: number | null;
  label: string;
}

export interface DashboardScope {
  kind: 'organization' | 'unit';
  label: string;
}

/** Describes the currently applied, server-authorized organization/unit view. */
export function dashboardScope(
  unitId: string | number | null | undefined,
  units: Array<{ id: string | number; name: string }> = [],
  organizationLabel = 'Alphaiota',
): DashboardScope {
  if (unitId === null || unitId === undefined || String(unitId).trim() === '') {
    return { kind: 'organization', label: organizationLabel };
  }
  const selected = units.find(unit => String(unit.id) === String(unitId));
  return { kind: 'unit', label: selected?.name || '' };
}

export function dashboardQuery(filters: DashboardFilterValues): Record<string, string | number> {
  const result: Record<string, string | number> = {};
  (['business_unit_id', 'product_id', 'opportunity_id', 'week_start'] as const).forEach(key => {
    const value = filters[key];
    if (value !== null && value !== undefined && String(value).trim() !== '') result[key] = value;
  });
  return result;
}

export function hasDashboardFilters(filters: DashboardFilterValues): boolean {
  return Object.keys(dashboardQuery(filters)).length > 0;
}

export function hasNonUnitDashboardFilters(filters: DashboardFilterValues): boolean {
  const { business_unit_id: _unit, ...other } = filters;
  return hasDashboardFilters(other);
}

export function unitProgressRows(rows: any[] = []): UnitProgressRow[] {
  return rows
    .filter(row => Number(row?.total) > 0 && Number.isFinite(Number(row?.progress)))
    .map(row => ({
      id: row.id,
      name: String(row.name || ''),
      total: Number(row.total),
      progress: Number(row.progress),
      barWidth: Math.max(0, Math.min(100, Number(row.progress))),
    }))
    .sort((a, b) => a.progress - b.progress || a.name.localeCompare(b.name));
}

export function opportunityStages(opportunities: any[] = [], translate: (key: string) => string = key => key): OpportunityStageRow[] {
  const counts = new Map<string, number>();
  opportunities.forEach(opportunity => {
    const key = String(opportunity?.stage || '').trim();
    if (!key) return;
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  const total = [...counts.values()].reduce((sum, count) => sum + count, 0);
  return [...counts.entries()].map(([key, count]) => ({
    key,
    label: translate(key) || key,
    count,
    percent: total ? Math.round(count / total * 100) : 0,
  }));
}

export function kpiSeriesKey(series: any): string {
  return `${series?.business_unit_id ?? ''}::${String(series?.name || '').trim().toLocaleLowerCase()}`;
}

export function latestKpiSeriesKey(series: any[] = []): string {
  const latest = series.reduce((winner, candidate) => {
    if (!winner) return candidate;
    const winnerDate = winner.points?.[winner.points.length - 1]?.period_start || '';
    const candidateDate = candidate.points?.[candidate.points.length - 1]?.period_start || '';
    return candidateDate > winnerDate ? candidate : winner;
  }, null as any);
  return latest ? kpiSeriesKey(latest) : '';
}

export function kpiSeriesLabel(series: any): string {
  const name = String(series?.name || '');
  return series?.unit ? `${name} · ${series.unit}` : name;
}

export function trendChartPoints(points: KpiHistoryPoint[] = [], width = 360, height = 136, maxPoints = 6): TrendChartPoint[] {
  const ordered = points
    .filter(point => point && typeof point.period_start === 'string' && point.period_start.length > 0 && finite(point.actual) !== null)
    .slice()
    .sort((a, b) => a.period_start.localeCompare(b.period_start))
    .slice(-maxPoints);
  if (!ordered.length) return [];

  const values: number[] = [];
  ordered.forEach(point => {
    const actual = finite(point.actual);
    const target = finite(point.target);
    if (actual !== null) values.push(actual);
    if (target !== null) values.push(target);
  });
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (min === max) {
    const pad = Math.max(Math.abs(min) * 0.1, 1);
    min -= pad;
    max += pad;
  }
  const padding = 12;
  const plotHeight = Math.max(1, height - padding * 2);
  const plotWidth = Math.max(1, width - padding * 2);
  const y = (value: number) => padding + (max - value) / (max - min) * plotHeight;

  return ordered.map((point, index) => {
    const actual = finite(point.actual) as number;
    const target = finite(point.target);
    return {
      ...point,
      x: ordered.length === 1 ? width / 2 : padding + index / (ordered.length - 1) * plotWidth,
      actualY: y(actual),
      targetY: target === null ? null : y(target),
      label: point.period_start.slice(0, 10),
    };
  });
}

export function numberLabel(value: unknown, language: 'en' | 'ar' = 'en'): string {
  const numeric = typeof value === 'number' ? value : Number(value);
  if (value === null || value === undefined || value === '' || !Number.isFinite(numeric)) return '—';
  return new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US', { maximumFractionDigits: 1 }).format(numeric);
}

export function dateLabel(value: unknown, language: 'en' | 'ar' = 'en', format: 'date' | 'time' | 'datetime' | 'month' = 'date'): string {
  if (value === null || value === undefined || value === '') return '—';
  const raw = String(value);
  const date = value instanceof Date ? value : /^\d{4}-\d{2}-\d{2}$/.test(raw)
    ? new Date(Number(raw.slice(0, 4)), Number(raw.slice(5, 7)) - 1, Number(raw.slice(8, 10)))
    : new Date(raw);
  if (!Number.isFinite(date.getTime())) return '—';
  const locale = language === 'ar' ? 'ar-EG' : 'en-US';
  const options: Intl.DateTimeFormatOptions = format === 'time'
    ? { hour: 'numeric', minute: '2-digit' }
    : format === 'datetime'
      ? { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }
      : format === 'month'
        ? { month: 'short', year: 'numeric' }
        : { year: 'numeric', month: 'short', day: 'numeric' };
  return new Intl.DateTimeFormat(locale, options).format(date);
}

function finite(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}
