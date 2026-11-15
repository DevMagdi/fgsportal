import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import React from 'react';
import TestRenderer from 'react-test-renderer';
import { build } from 'esbuild';

const require = createRequire(import.meta.url);
const { act } = TestRenderer;
const result = await build({
  entryPoints: ['src/components/ui/CountUpValue.tsx'], bundle: true, platform: 'node', format: 'cjs', write: false,
  external: ['react', 'framer-motion'], jsx: 'automatic', define: { 'import.meta.env': '{}' },
});
const code = result.outputFiles[0].text;

function harness(initialReduced = false) {
  const oldWindow = globalThis.window;
  const listeners = new Set();
  const media = {
    matches: initialReduced,
    addEventListener(_type, listener) { listeners.add(listener); },
    removeEventListener(_type, listener) { listeners.delete(listener); },
  };
  globalThis.window = { matchMedia: () => media };
  const animations = [];
  const localRequire = (id) => id === 'framer-motion' ? {
    animate(from, to, options) {
      const animation = { from, to, options, stopped: false };
      animations.push(animation);
      return { stop() { animation.stopped = true; } };
    },
  } : require(id);
  const module = { exports: {} };
  new Function('require', 'module', 'exports', code)(localRequire, module, module.exports);
  return {
    CountUpValue: module.exports.CountUpValue, animations, media, listeners,
    restore() { if (oldWindow === undefined) delete globalThis.window; else globalThis.window = oldWindow; },
  };
}

function copies(tree) {
  const spans = tree.root.findAllByType('span');
  return { visual: spans[1].children.join(''), accessible: spans[2].children.join('') };
}

test('count-up updates only the visual copy and retargets from the current value', () => {
  const h = harness();
  let tree;
  try {
    act(() => { tree = TestRenderer.create(React.createElement(h.CountUpValue, { value: 100, lang: 'en' })); });
    assert.deepEqual(copies(tree), { visual: '0', accessible: '100' });
    assert.equal(h.animations.length, 1);
    assert.equal(h.animations[0].from, 0);
    assert.equal(h.animations[0].to, 100);
    assert.equal(h.animations[0].options.duration, 0.55);
    act(() => { h.animations[0].options.onUpdate(42.3); });
    assert.deepEqual(copies(tree), { visual: '42', accessible: '100' });

    act(() => { tree.update(React.createElement(h.CountUpValue, { value: 5, lang: 'en' })); });
    assert.equal(h.animations[0].stopped, true);
    assert.equal(h.animations[1].from, 42);
    assert.equal(h.animations[1].to, 5);
    assert.equal(copies(tree).accessible, '5');
    act(() => { h.animations[1].options.onUpdate(5); });
    assert.deepEqual(copies(tree), { visual: '5', accessible: '5' });
  } finally {
    if (tree) act(() => { tree.unmount(); });
    h.restore();
  }
  assert.equal(h.listeners.size, 0);
});

test('non-finite values do not start an animation and recover when a finite value arrives', () => {
  const h = harness();
  let tree;
  try {
    act(() => { tree = TestRenderer.create(React.createElement(h.CountUpValue, { value: NaN, lang: 'en' })); });
    assert.deepEqual(copies(tree), { visual: 'NaN', accessible: 'NaN' });
    assert.equal(h.animations.length, 0);
    act(() => { tree.update(React.createElement(h.CountUpValue, { value: 7, lang: 'en' })); });
    assert.equal(h.animations[0].from, 0);
    assert.equal(h.animations[0].to, 7);
  } finally {
    if (tree) act(() => { tree.unmount(); });
    h.restore();
  }
});

test('reduced motion renders the final localized number and stops a running count', () => {
  const h = harness();
  let tree;
  try {
    act(() => { tree = TestRenderer.create(React.createElement(h.CountUpValue, { value: 1234, lang: 'ar' })); });
    act(() => { h.animations[0].options.onUpdate(300); });
    act(() => { h.media.matches = true; h.listeners.forEach((listener) => listener()); });
    assert.equal(h.animations[0].stopped, true);
    const localized = new Intl.NumberFormat('ar-EG', { maximumFractionDigits: 0 }).format(1234);
    assert.deepEqual(copies(tree), { visual: localized, accessible: localized });
    act(() => { tree.update(React.createElement(h.CountUpValue, { value: 12, lang: 'en' })); });
    assert.deepEqual(copies(tree), { visual: '12', accessible: '12' });
    assert.equal(h.animations.length, 1);
    act(() => { h.media.matches = false; h.listeners.forEach((listener) => listener()); });
    assert.equal(h.animations[1].from, 12);
    assert.equal(h.animations[1].to, 12);
  } finally {
    if (tree) act(() => { tree.unmount(); });
    h.restore();
  }
});
