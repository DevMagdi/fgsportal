import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';

const result = await build({ entryPoints: ['src/lib/dashboard.ts'], bundle: true, platform: 'node', format: 'esm', write: false });
const { percentage, formatPercentage, dashboardRatios, pipelineSegments, canQuickCreate } = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
const visuals = await build({ entryPoints: ['src/lib/dashboardVisuals.ts'], bundle: true, platform: 'node', format: 'esm', write: false });
const { pipelineDisplayColor } = await import(`data:text/javascript;base64,${Buffer.from(visuals.outputFiles[0].text).toString('base64')}`);

test('dashboard percentages describe actual totals and do not invent a zero-denominator result', () => {
  assert.equal(percentage(1, 3), 33);
  assert.equal(percentage(0, 4), 0);
  assert.equal(percentage(0, 0), null);
  assert.equal(percentage(1, Number.NaN), null);
  assert.equal(formatPercentage(17, 'en'), '17%');
  assert.match(formatPercentage(17, 'ar'), /١٧٪/);

  const data = {
    unit_progress: [{ total: 3 }, { total: 0 }, { total: 1 }],
    summary: { achieved: 2, tasks: 4 },
    opportunities: [{ is_delayed: true }, { is_delayed: false }],
    products: [{ currentPhase: { id: 1 } }, { currentPhase: null }],
    meetings: [{ business_unit_id: 7 }, { unit: { id: 8 } }, {}],
  };
  assert.deepEqual(dashboardRatios(data), {
    units: { count: 2, total: 3, percent: 67 },
    tasks: { count: 2, total: 4, percent: 50 },
    opportunities: { count: 1, total: 2, percent: 50 },
    products: { count: 1, total: 2, percent: 50 },
    meetings: { count: 2, total: 3, percent: 67 },
  });
  const empty = dashboardRatios({ unit_progress: [], summary: { achieved: 0, tasks: 0 }, opportunities: [], products: [], meetings: [] });
  assert.ok(Object.values(empty).every(({ count, total, percent }) => count === 0 && total === 0 && percent === null));
});

test('pipeline segments retain stage and delayed detail, totals and official palette', () => {
  const segments = pipelineSegments([
    { stage: 'won', is_delayed: false },
    { stage: 'review', is_delayed: false },
    { stage: 'review', is_delayed: true },
    { stage: 'review', is_delayed: true },
    { stage: 'lost', is_delayed: true },
    { stage: 'other_stage', is_delayed: false },
  ]);
  assert.deepEqual(segments.map(({ key, count, percent, color }) => ({ key, count, percent, color })), [
    { key: 'review:normal', count: 1, percent: 17, color: '#B5AFF9' },
    { key: 'review:delayed', count: 2, percent: 33, color: '#F498C1' },
    { key: 'won:normal', count: 1, percent: 17, color: '#A9F9ED' },
    { key: 'lost:normal', count: 1, percent: 17, color: '#F498C1' },
    { key: 'other_stage:normal', count: 1, percent: 17, color: '#B5AFF9' },
  ]);
  assert.equal(segments.reduce((sum, segment) => sum + segment.count, 0), 6);
  assert.deepEqual(pipelineSegments([]), []);
});

test('pipeline presentation distinguishes stages without changing groups or attention semantics', () => {
  const segments = pipelineSegments([
    { stage: 'review', is_delayed: false },
    { stage: 'qualification', is_delayed: false },
    { stage: 'proposal', is_delayed: false },
    { stage: 'review', is_delayed: true },
    { stage: 'won', is_delayed: false },
    { stage: 'lost', is_delayed: false },
    { stage: 'unknown_stage', is_delayed: false },
  ]);
  const before = structuredClone(segments);
  const colors = Object.fromEntries(segments.map((segment) => [segment.key, pipelineDisplayColor(segment)]));
  assert.equal(colors['review:normal'], '#B5AFF9');
  assert.equal(colors['qualification:normal'], '#81E2FD');
  assert.equal(colors['proposal:normal'], '#A9F9ED');
  assert.equal(colors['review:delayed'], '#F498C1');
  assert.equal(colors['won:normal'], '#A9F9ED');
  assert.equal(colors['lost:normal'], '#F498C1');
  assert.equal(colors['unknown_stage:normal'], '#B5AFF9');
  assert.deepEqual(segments, before, 'presentation must not change the data used for counts or tooltips');
});

test('quick create is shown only when both collection view and manage abilities are present', () => {
  const view = 'opportunities.view';
  assert.equal(canQuickCreate([], view, false), false);
  assert.equal(canQuickCreate([view], view, false), false);
  assert.equal(canQuickCreate([], view, true), false);
  assert.equal(canQuickCreate([view], view, true), true);
  assert.equal(canQuickCreate(['*'], view, true), true);
  assert.equal(canQuickCreate(['*'], view, false), false);
  assert.equal(canQuickCreate(['meetings.view'], view, true), false);
});
