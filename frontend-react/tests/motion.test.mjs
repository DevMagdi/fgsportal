import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { build } from 'esbuild';

const result = await build({ entryPoints: ['src/lib/motion.ts'], bundle: true, platform: 'node', format: 'esm', write: false });
const { chartEntrance, entranceTransition, interactionSpring, rowEntrance, MAX_STAGGERED_ROWS, ROW_STAGGER_SECONDS } = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);

test('route entrance and interaction spring stay short and transform-friendly', () => {
  assert.equal(entranceTransition.duration, 0.28);
  assert.equal(entranceTransition.ease, 'easeOut');
  assert.equal(interactionSpring.type, 'spring');
  assert.ok(interactionSpring.stiffness > 0 && interactionSpring.damping > 0);
});

test('chart entrances are short and opt out of motion when reduced', () => {
  assert.deepEqual(chartEntrance(false), { isAnimationActive: true, animationBegin: 0, animationDuration: 550, animationEasing: 'ease-out' });
  assert.deepEqual(chartEntrance(true), { isAnimationActive: false, animationBegin: 0, animationDuration: 550, animationEasing: 'ease-out' });
});

test('row entrances are staggered but capped, with a bounded total time', () => {
  assert.equal(MAX_STAGGERED_ROWS, 8);
  for (let index = 0; index < MAX_STAGGERED_ROWS; index++) {
    const row = rowEntrance(index, false);
    assert.deepEqual(row.initial, { opacity: 0, y: 6 });
    assert.deepEqual(row.animate, { opacity: 1, y: 0 });
    assert.equal(row.transition.delay, index * ROW_STAGGER_SECONDS);
    assert.ok(row.transition.duration + row.transition.delay <= 0.55);
  }
  for (const index of [-1, MAX_STAGGERED_ROWS, 1000]) {
    const row = rowEntrance(index, false);
    assert.equal(row.initial, false);
    assert.equal(row.transition.duration, 0);
  }
});

test('reduced motion makes every row immediately visible without a stagger', () => {
  for (const index of [0, 1, MAX_STAGGERED_ROWS - 1, MAX_STAGGERED_ROWS]) {
    const row = rowEntrance(index, true);
    assert.equal(row.initial, false);
    assert.deepEqual(row.animate, { opacity: 1, y: 0 });
    assert.deepEqual(row.transition, { duration: 0 });
  }
});

test('loading decorations stop within five seconds and respect reduced motion', async () => {
  const css = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');
  const spinner = await readFile(new URL('../src/components/ui/Spinner.tsx', import.meta.url), 'utf8');
  assert.match(css, /animation:\s*loading-spin 1s linear 4\s*;/);
  assert.match(css, /animation:\s*skeleton-sheen 1\.8s ease-in-out 2\s*;/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(spinner, /!reduceMotion && 'loading-spinner'/);
  assert.match(spinner, /!reduceMotion && 'skeleton-shimmer'/);
});
