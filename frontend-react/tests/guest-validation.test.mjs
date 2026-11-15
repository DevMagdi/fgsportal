import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';

const result = await build({ entryPoints: ['src/lib/guest-validation.ts'], bundle: true, platform: 'node', format: 'esm', write: false });
const { validateGuests } = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);

test('multiple guests without an email are rejected before Laravel can collapse them', () => {
  const guests = [{ key: 'one', name: 'First', email: '' }, { key: 'two', name: 'Second', email: '  ' }];
  assert.deepEqual(validateGuests(guests), [{ key: 'two', field: 'email', code: 'duplicateGuest' }]);
});

test('guest email comparison is case insensitive and blank guests are required', () => {
  const guests = [
    { key: 'one', name: 'First', email: ' Guest@example.com ' },
    { key: 'two', name: 'Second', email: 'guest@EXAMPLE.com' },
    { key: 'three', name: ' ', email: '' },
    { key: 'four', name: 'Fourth', email: 'not-an-email' },
  ];
  assert.deepEqual(validateGuests(guests), [
    { key: 'two', field: 'email', code: 'duplicateGuest' },
    { key: 'three', field: 'name', code: 'requiredField' },
    { key: 'four', field: 'email', code: 'invalidEmail' },
  ]);
});
