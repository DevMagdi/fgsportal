import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import React from 'react';
import TestRenderer from 'react-test-renderer';
import { build } from 'esbuild';

const require = createRequire(import.meta.url);
const { act } = TestRenderer;

async function compile(entry) {
  const result = await build({
    entryPoints: [entry], bundle: true, platform: 'node', format: 'cjs', write: false,
    external: ['react', 'framer-motion'],
  });
  const code = result.outputFiles[0].text;
  // Create a fresh module when a test needs an independent cached media query.
  return () => {
    const module = { exports: {} };
    new Function('require', 'module', 'exports', code)(require, module, module.exports);
    return module.exports;
  };
}

const loadEntrance = await compile('src/lib/useAccessibleMotion.ts');
const loadPreference = await compile('src/lib/usePrefersReducedMotion.ts');

test('enabling reduced motion stops in-flight entrance values without remounting', () => {
  const { useEntranceValues } = loadEntrance();
  let values;
  function Probe({ reduced }) {
    values = useEntranceValues(reduced, { opacity: 0, y: 6 });
    return null;
  }
  let tree;
  act(() => { tree = TestRenderer.create(React.createElement(Probe, { reduced: false })); });
  const original = values;
  assert.equal(values.opacity.get(), 0);
  assert.equal(values.y.get(), 6);
  values.opacity.set(0.4);
  values.y.set(3);
  let stopped = 0;
  void values.opacity.start(() => ({ stop: () => { stopped++; } }));
  void values.y.start(() => ({ stop: () => { stopped++; } }));

  act(() => { tree.update(React.createElement(Probe, { reduced: true })); });
  assert.equal(stopped, 2);
  assert.equal(values.opacity, original.opacity);
  assert.equal(values.y, original.y);
  assert.equal(values.opacity.get(), 1);
  assert.equal(values.y.get(), 0);
  act(() => { tree.unmount(); });
});

test('reduced motion values snap to the latest target and stay ready for later animation', () => {
  const { useReducedMotionValue } = loadEntrance();
  let value;
  function Probe({ reduced, target }) {
    value = useReducedMotionValue(reduced, 0, target);
    return null;
  }
  let tree;
  act(() => { tree = TestRenderer.create(React.createElement(Probe, { reduced: false, target: 0.7 })); });
  const original = value;
  value.set(0.25);
  let stopped = 0;
  void value.start(() => ({ stop: () => { stopped++; } }));
  act(() => { tree.update(React.createElement(Probe, { reduced: true, target: 0.7 })); });
  assert.equal(stopped, 1);
  assert.equal(value.get(), 0.7);
  act(() => { tree.update(React.createElement(Probe, { reduced: true, target: 0.4 })); });
  assert.equal(value, original);
  assert.equal(value.get(), 0.4);
  act(() => { tree.update(React.createElement(Probe, { reduced: false, target: 0.9 })); });
  assert.equal(value.get(), 0.4);
  act(() => { tree.unmount(); });
});

test('an exit keeps its starting preference until its presence boundary completes', () => {
  const { useExitMotionPreference } = loadEntrance();
  let preference;
  function Probe({ reduced, present }) {
    preference = useExitMotionPreference(reduced, present);
    return null;
  }
  let tree;
  const update = (reduced, present) => act(() => { tree.update(React.createElement(Probe, { reduced, present })); });
  act(() => { tree = TestRenderer.create(React.createElement(Probe, { reduced: false, present: true })); });
  update(true, true);
  assert.equal(preference, true);
  update(true, false);
  update(false, false);
  assert.equal(preference, true);
  update(false, true);
  assert.equal(preference, false);
  update(false, false);
  update(true, false);
  assert.equal(preference, false);
  act(() => { tree.unmount(); });
});

test('motion preference follows OS changes and removes its listener', () => {
  const originalWindow = globalThis.window;
  const listeners = new Set();
  const media = {
    matches: false,
    addEventListener(type, listener) { assert.equal(type, 'change'); listeners.add(listener); },
    removeEventListener(type, listener) { assert.equal(type, 'change'); listeners.delete(listener); },
  };
  globalThis.window = { matchMedia: (query) => { assert.equal(query, '(prefers-reduced-motion: reduce)'); return media; } };
  try {
    const { usePrefersReducedMotion } = loadPreference();
    let preference;
    function Probe() { preference = usePrefersReducedMotion(); return null; }
    let tree;
    act(() => { tree = TestRenderer.create(React.createElement(Probe)); });
    assert.equal(preference, false);
    assert.equal(listeners.size, 1);
    act(() => { media.matches = true; listeners.forEach((listener) => listener()); });
    assert.equal(preference, true);
    act(() => { media.matches = false; listeners.forEach((listener) => listener()); });
    assert.equal(preference, false);
    act(() => { tree.unmount(); });
    assert.equal(listeners.size, 0);
  } finally {
    if (originalWindow === undefined) delete globalThis.window;
    else globalThis.window = originalWindow;
  }
});

test('motion preference supports older media-query listeners and missing matchMedia', () => {
  const originalWindow = globalThis.window;
  const listeners = new Set();
  const media = {
    matches: true,
    addListener(listener) { listeners.add(listener); },
    removeListener(listener) { listeners.delete(listener); },
  };
  try {
    globalThis.window = { matchMedia: () => media };
    let preference;
    const legacy = loadPreference().usePrefersReducedMotion;
    function LegacyProbe() { preference = legacy(); return null; }
    let tree;
    act(() => { tree = TestRenderer.create(React.createElement(LegacyProbe)); });
    assert.equal(preference, true);
    act(() => { media.matches = false; listeners.forEach((listener) => listener()); });
    assert.equal(preference, false);
    act(() => { tree.unmount(); });
    assert.equal(listeners.size, 0);

    globalThis.window = {};
    const withoutMatchMedia = loadPreference().usePrefersReducedMotion;
    function FallbackProbe() { preference = withoutMatchMedia(); return null; }
    act(() => { tree = TestRenderer.create(React.createElement(FallbackProbe)); });
    assert.equal(preference, false);
    act(() => { tree.unmount(); });
  } finally {
    if (originalWindow === undefined) delete globalThis.window;
    else globalThis.window = originalWindow;
  }
});
