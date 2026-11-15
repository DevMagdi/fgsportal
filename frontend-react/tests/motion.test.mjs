import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { build } from 'esbuild';

const result = await build({ entryPoints: ['src/lib/motion.ts'], bundle: true, platform: 'node', format: 'esm', write: false });
const { attentionPulse, chartEntrance, entranceTransition, heroFloat, interactionSpring, rowEntrance, MAX_STAGGERED_ROWS, ROW_STAGGER_SECONDS } = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);

test('route entrance and interaction spring stay short and transform-friendly', () => {
  assert.equal(entranceTransition.duration, 0.28);
  assert.equal(entranceTransition.ease, 'easeOut');
  assert.equal(interactionSpring.type, 'spring');
  assert.ok(interactionSpring.stiffness > 0 && interactionSpring.damping > 0);
});

test('decorative hero drift is gentle, bounded and disabled for reduced motion', () => {
  const normal = heroFloat(false);
  assert.deepEqual(normal.animate.y, [0, -4, 0]);
  assert.ok(normal.transition.duration >= 0.2 && normal.transition.duration <= 0.6);
  assert.equal(normal.transition.repeat, 1);
  assert.ok(normal.transition.duration * (normal.transition.repeat + 1) + normal.transition.repeatDelay < 5);
  assert.deepEqual(heroFloat(false, -1).animate.y, [0, 4, 0]);
  assert.deepEqual(heroFloat(true), { animate: { y: 0 }, transition: { duration: 0 } });
});

test('attention pulses are bounded and only run for positive, non-reduced counts', () => {
  const active = attentionPulse(true, false, 2);
  assert.deepEqual(active.animate.scale, [1, 1.08, 1]);
  assert.equal(active.transition.duration, 0.6);
  assert.equal(active.transition.repeat, 1);
  assert.ok(active.transition.delay <= 0.24);
  assert.deepEqual(attentionPulse(false, false), { animate: { scale: 1 }, transition: { duration: 0 } });
  assert.deepEqual(attentionPulse(true, true), { animate: { scale: 1 }, transition: { duration: 0 } });
  assert.ok(attentionPulse(true, false, 100).transition.delay <= 0.24);
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

test('dashboard ambient motion and rows start explicitly inside hover-enabled cards', async () => {
  const dashboard = await readFile(new URL('../src/pages/DashboardPage.tsx', import.meta.url), 'utf8');
  // initial=false would put repeating keyframes at their final value without starting them.
  assert.match(dashboard, /initial=\{reduced \? false : \{ y: 0 \}\} \{\.\.\.heroFloat/);
  assert.match(dashboard, /initial=\{reduced \|\| value <= 0 \? false : \{ scale: 1 \}\} \{\.\.\.attentionPulse/);
  // A card's own hover variant must not prevent its list rows becoming visible.
  assert.match(dashboard, /initial: reduced \? false as const : 'hidden', animate: reduced \? \{ opacity: 1, y: 0, transition: \{ duration: 0 \} \} : 'visible'/);
});

test('responsive charts opt out of hover scaling', async () => {
  const card = await readFile(new URL('../src/components/ui/Card.tsx', import.meta.url), 'utf8');
  const dashboard = await readFile(new URL('../src/pages/DashboardPage.tsx', import.meta.url), 'utf8');
  const reports = await readFile(new URL('../src/pages/ReportsPage.tsx', import.meta.url), 'utf8');
  assert.match(card, /scale:\s*scaleOnHover \? 1\.005 : 1/);
  for (const title of ['pipeline', 'unitProgress']) {
    assert.match(dashboard, new RegExp(`<Card scaleOnHover=\\{false\\}[^>]*><CardHeader title=\\{t\\('${title}'\\)\\}`));
  }
  assert.match(reports, /<Card scaleOnHover=\{false\}>\s*<CardHeader title=\{t\('unitProgress'\)\}/);
  assert.match(reports, /<Card scaleOnHover=\{false\}>\s*<CardHeader title=\{kpis\.data\.history\[0\]\.name\}/);
});

test('animated values keep their accessible copy inside horizontal scroll regions', async () => {
  const value = await readFile(new URL('../src/components/ui/AnimatedValue.tsx', import.meta.url), 'utf8');
  assert.match(value, /className="relative inline-grid align-baseline"/);
  assert.match(value, /className="sr-only"/);
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
