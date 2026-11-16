import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';

const result = await build({ entryPoints: ['src/lib/dialogFocus.ts'], bundle: true, platform: 'node', format: 'esm', write: false });
const { focusDialogStart } = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);

function panel({ alreadyInside = false, field = true, button = true } = {}) {
  const calls = [];
  const target = (name) => ({ focus: () => calls.push(name) });
  const node = {
    contains: () => alreadyInside,
    querySelector: (selector) => selector.startsWith('input') ? (field ? target('field') : null) : (button ? target('button') : null),
    focus: () => calls.push('panel'),
  };
  return { node, calls };
}

test('dialog initial focus prefers a field over the close button', () => {
  const { node, calls } = panel();
  focusDialogStart(node, null);
  assert.deepEqual(calls, ['field']);
});

test('dialog entrance never steals focus after interaction has begun', () => {
  const { node, calls } = panel({ alreadyInside: true });
  focusDialogStart(node, {});
  assert.deepEqual(calls, []);
  assert.doesNotThrow(() => focusDialogStart(null, null));
});

test('dialogs without fields focus a button, then the panel as a fallback', () => {
  const withoutField = panel({ field: false });
  focusDialogStart(withoutField.node, null);
  assert.deepEqual(withoutField.calls, ['button']);
  const empty = panel({ field: false, button: false });
  focusDialogStart(empty.node, null);
  assert.deepEqual(empty.calls, ['panel']);
});
