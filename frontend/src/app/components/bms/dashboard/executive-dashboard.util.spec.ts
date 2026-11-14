import {
  dashboardQuery,
  dateLabel,
  hasDashboardFilters,
  hasNonUnitDashboardFilters,
  kpiAchievement,
  kpiSeriesKey,
  kpiSeriesLabel,
  latestKpiSeriesKey,
  numberLabel,
  opportunityStages,
  taskStatusRows,
  trendChartPoints,
  unitProgressRows,
} from './executive-dashboard.util';

describe('Executive dashboard data helpers', () => {
  it('omits blank filter values and preserves only supported API filters', () => {
    expect(dashboardQuery({ business_unit_id: '4', product_id: '', opportunity_id: null, week_start: '2026-11-08', unsupported: 'x' } as any))
      .toEqual({ business_unit_id: '4', week_start: '2026-11-08' });
    expect(hasDashboardFilters({})).toBeFalse();
    expect(hasDashboardFilters({ week_start: '2026-11-08' })).toBeTrue();
    expect(hasNonUnitDashboardFilters({ business_unit_id: '4' })).toBeFalse();
    expect(hasNonUnitDashboardFilters({ business_unit_id: '4', product_id: '7' })).toBeTrue();
  });

  it('ranks only units with task data and clamps chart width without changing the reported value', () => {
    expect(unitProgressRows([
      { id: 1, name: 'No tasks', total: 0, progress: 0 },
      { id: 2, name: 'Beta', total: 3, progress: 73 },
      { id: 3, name: 'Alpha', total: 2, progress: 20 },
      { id: 4, name: 'Outlier', total: 1, progress: 120 },
    ])).toEqual([
      { id: 3, name: 'Alpha', total: 2, progress: 20, barWidth: 20 },
      { id: 2, name: 'Beta', total: 3, progress: 73, barWidth: 73 },
      { id: 4, name: 'Outlier', total: 1, progress: 120, barWidth: 100 },
    ]);
  });

  it('builds task-status distribution from unit rollups and keeps any unclassified remainder explicit', () => {
    expect(taskStatusRows([
      { total: 5, achieved: 2, in_progress: 1, not_done: 1 },
      { total: 3, achieved: 1, in_progress: 1, not_done: 1 },
      { total: 0, achieved: 0, in_progress: 0, not_done: 0 },
    ], key => key)).toEqual([
      { key: 'achieved', label: 'achieved', count: 3, percent: 37.5 },
      { key: 'inProgress', label: 'inProgress', count: 2, percent: 25 },
      { key: 'notDone', label: 'notDone', count: 2, percent: 25 },
      { key: 'other', label: 'other', count: 1, percent: 12.5 },
    ]);
    expect(taskStatusRows([{ total: 0 }])).toEqual([]);
  });

  it('calculates KPI attainment only for a positive stored target and clamps only the display width', () => {
    expect(kpiAchievement(125, 100)).toEqual({ actual: 125, target: 100, attainment: 125, barWidth: 100 });
    expect(kpiAchievement(4, null)).toEqual({ actual: 4, target: null, attainment: null, barWidth: 0 });
    expect(kpiAchievement(4, 0).attainment).toBeNull();
  });

  it('groups actual opportunity records by their current stage without creating empty stages', () => {
    const rows = opportunityStages([
      { stage: 'qualification' }, { stage: 'qualification' }, { stage: 'won' }, { stage: '' },
    ], key => ({ qualification: 'Qualification', won: 'Won' } as any)[key] || key);
    expect(rows).toEqual([
      { key: 'qualification', label: 'Qualification', count: 2, percent: 67 },
      { key: 'won', label: 'Won', count: 1, percent: 33 },
    ]);
    expect(opportunityStages([])).toEqual([]);
  });

  it('keeps KPI series distinct by unit and selects the series with the newest stored period', () => {
    const a = { business_unit_id: 1, unit: 'Unit A', name: 'Revenue', points: [{ period_start: '2026-01-01' }] };
    const b = { business_unit_id: 2, unit: 'Unit B', name: 'Revenue', points: [{ period_start: '2026-03-01' }] };
    expect(kpiSeriesKey(a)).not.toBe(kpiSeriesKey(b));
    expect(kpiSeriesLabel(a)).toBe('Revenue · Unit A');
    expect(latestKpiSeriesKey([a, b])).toBe(kpiSeriesKey(b));
    expect(latestKpiSeriesKey([])).toBe('');
  });

  it('plots only real KPI actual/target points and orders them by their stored period', () => {
    const points = trendChartPoints([
      { period_start: '2026-03-01', actual: 8, target: null },
      { period_start: '2026-01-01', actual: 4, target: 6 },
      { period_start: '2026-02-01', actual: 6, target: 6 },
      { period_start: '2026-04-01', actual: null, target: 10 },
    ], 360, 136, 3);
    expect(points.length).toBe(3);
    expect(points[0].label).toBe('2026-01-01');
    expect(points[0].x).toBeLessThan(points[2].x);
    expect(points[0].targetY).not.toBeNull();
    expect(points[2].targetY).toBeNull();
    expect(trendChartPoints([])).toEqual([]);
  });

  it('formats real zero distinctly from missing values in English and Arabic', () => {
    expect(numberLabel(0, 'en')).toBe('0');
    expect(numberLabel(null, 'en')).toBe('—');
    expect(numberLabel(undefined, 'ar')).toBe('—');
    expect(numberLabel(1200, 'ar')).not.toBe('—');
  });

  it('localizes dates for the active dashboard language and handles invalid input', () => {
    expect(dateLabel('not-a-date', 'en')).toBe('—');
    expect(dateLabel('2026-01-01T00:00:00Z', 'en')).not.toBe(dateLabel('2026-01-01T00:00:00Z', 'ar'));
  });

  it('treats date-only KPI values as local calendar dates', () => {
    const expectedLocalDate = new Intl.DateTimeFormat('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    }).format(new Date(2026, 0, 1));
    expect(dateLabel('2026-01-01', 'en')).toBe(expectedLocalDate);
  });
});
