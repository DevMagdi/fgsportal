import { beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { File as NodeFile } from 'node:buffer';
import Module from 'node:module';
import path from 'node:path';
import { build } from 'esbuild';

const result = await build({
  entryPoints: ['src/lib/api.ts'], bundle: true, packages: 'external', platform: 'node', format: 'cjs', write: false,
  define: { 'import.meta.env.VITE_DEMO_MODE': '"true"', 'import.meta.env.VITE_API_BASE_URL': '""', 'import.meta.env.VITE_BMS_SERVER_TIME_ZONE': '"Africa/Cairo"' },
});
const compiled = new Module(path.resolve('tests/demo-api-bundle.cjs'));
compiled.filename = path.resolve('tests/demo-api-bundle.cjs');
compiled.paths = Module._nodeModulePaths(path.resolve('tests'));
compiled._compile(result.outputFiles[0].text, compiled.filename);
const { api } = compiled.exports;
const memory = new Map();
globalThis.localStorage = { getItem: (key) => memory.get(key) ?? null, setItem: (key, value) => memory.set(key, String(value)), removeItem: (key) => memory.delete(key) };
if (!globalThis.File) globalThis.File = NodeFile;
beforeEach(() => memory.clear());

test('demo dashboard product and unit filters stay in sync across metrics', async () => {
  const product = await api.executiveDashboard({ product_id: '1' });
  assert.deepEqual(product.unit_progress.map((unit) => unit.id), [1]);
  assert.equal(product.summary.units, 1);
  assert.equal(product.summary.products, 1);
  assert.equal(product.procurement.pending, product.summary.pending_procurement);
  assert.ok(product.opportunities.every((item) => item.product_id === 1));
  const mismatched = await api.executiveDashboard({ product_id: '2', business_unit_id: '1' });
  assert.equal(mismatched.summary.units, 0);
  assert.equal(mismatched.summary.tasks, 0);
  assert.equal(mismatched.summary.products, 0);
});

test('demo document filters include only the selected unit', async () => {
  const documents = await api.documents({ business_unit_id: '1' });
  assert.ok(documents.length > 0);
  assert.ok(documents.every((item) => (item.business_unit_id ?? item.unit?.id) === 1));
});

test('demo upcoming meetings include only uncancelled meetings in the next week', async () => {
  const before = await api.executiveDashboard();
  const now = Date.now();
  const meeting = (title, offset, status) => ({
    title, starts_at: new Date(now + offset).toISOString(), ends_at: new Date(now + offset + 3_600_000).toISOString(),
    status, attendees: [{ user_id: 1 }],
  });
  await api.create('meetings', meeting('Upcoming', 3_600_000, 'scheduled'));
  await api.create('meetings', meeting('Cancelled', 7_200_000, 'cancelled'));
  await api.create('meetings', meeting('Far away', 9 * 86_400_000, 'scheduled'));
  const after = await api.executiveDashboard();
  assert.equal(after.summary.upcoming_meetings, before.summary.upcoming_meetings + 1);
  assert.ok(after.meetings.some((item) => item.title === 'Upcoming'));
  assert.ok(!after.meetings.some((item) => ['Cancelled', 'Far away'].includes(item.title)));
});
