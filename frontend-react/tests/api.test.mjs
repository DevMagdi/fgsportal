import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { File as NodeFile } from 'node:buffer';
import Module from 'node:module';
import path from 'node:path';
import { build } from 'esbuild';

const calls = [];
const server = createServer(async (req, res) => {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString();
  let body = raw;
  if (req.headers['content-type']?.includes('application/json')) body = JSON.parse(raw || '{}');
  calls.push({ method: req.method, url: req.url, headers: req.headers, body });
  const missing = req.url === '/api/bms/bonuses' || (req.method === 'DELETE' && req.url === '/api/bms/opportunities/42');
  res.writeHead(missing ? 404 : 200, { 'Content-Type': 'application/json' });
  if (missing) return res.end(JSON.stringify({ message: 'Not implemented', data: null }));
  if (req.method === 'GET' && req.url === '/api/bms/employees/1') return res.end(JSON.stringify({ data: { id: 1, name: 'Test User', username: 'test', roles: [{ id: 1, name: 'Member' }] } }));
  if (req.method === 'GET' && req.url === '/api/bms/directory') return res.end(JSON.stringify({ data: [{ id: 1, name: 'Test User', username: 'test', certificates: [{ id: 7, name: 'PMP' }] }] }));
  if (req.method === 'GET' && req.url === '/api/bms/units/7') return res.end(JSON.stringify({ data: { id: 7, name: 'Research', development_manager: { id: 1, username: 'test' }, weekly_plans: [{ id: 3, business_unit_id: 7, week_start: '2026-11-15', status: 'draft', support_requests: [{ id: 4, title: 'Review', status: 'pending' }] }] } }));
  if (req.method === 'GET' && req.url === '/api/bms/weekly-plans/3') return res.end(JSON.stringify({ data: { id: 3, business_unit_id: 7, week_start: '2026-11-15', status: 'draft', support_requests: [{ id: 4, title: 'Review', status: 'pending' }] } }));
  if (req.method === 'GET' && req.url === '/api/bms/products') return res.end(JSON.stringify({ data: [{ id: 2, product_name: 'Product', business_units: [{ id: 7, name: 'Research' }], current_phase: { id: 8, name: 'Pilot', progress: 40 } }] }));
  if (req.method === 'GET' && req.url === '/api/bms/executive-dashboard') return res.end(JSON.stringify({ data: { products: [{ id: 2, product_name: 'Product', business_units: [{ id: 7, name: 'Research' }], current_phase: { id: 8, name: 'Pilot', progress: 40 } }] } }));
  res.end(JSON.stringify({ data: { id: 42, ...(typeof body === 'object' ? body : {}) } }));
});
server.listen(0, '127.0.0.1');
await once(server, 'listening');
after(() => server.close());
const port = server.address().port;
const compiled = await build({
  entryPoints: ['src/lib/api.ts'], bundle: true, packages: 'external', platform: 'node', format: 'cjs', write: false,
  define: { 'import.meta.env.VITE_DEMO_MODE': '"false"', 'import.meta.env.VITE_API_BASE_URL': JSON.stringify(`http://127.0.0.1:${port}`), 'import.meta.env.VITE_BMS_SERVER_TIME_ZONE': '"Africa/Cairo"' },

});
const testModule = new Module(path.resolve('tests/api-bundle.cjs'));
testModule.filename = path.resolve('tests/api-bundle.cjs');
testModule.paths = Module._nodeModulePaths(path.resolve('tests'));
testModule._compile(compiled.outputFiles[0].text, testModule.filename);
const { api, ApiError } = testModule.exports;
const storage = new Map([['bms.token', 'test-token']]);
globalThis.localStorage = { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, String(value)), removeItem: (key) => storage.delete(key) };
if (!globalThis.File) globalThis.File = NodeFile;

test('live creates and updates send authenticated BMS requests with the expected payload', async () => {
  await api.create('units', { name: 'Research', is_active: true });
  await api.update('units', 42, { name: 'Applied Research', is_active: true });
  const create = calls.find((call) => call.method === 'POST' && call.url === '/api/bms/units');
  const update = calls.find((call) => call.method === 'PUT' && call.url === '/api/bms/units/42');
  assert.equal(create.headers.authorization, 'Bearer test-token');
  assert.equal(create.body.name, 'Research');
  assert.equal(update.body.name, 'Applied Research');
});

test('nested tasks and supported archive/deactivation routes match Laravel route shapes', async () => {
  await api.create('tasks', { weekly_plan_id: 3, title: 'Prepare report', status: 'not_done' });
  await api.remove('employees', 1);
  await api.remove('products', 2);
  await api.remove('meetings', 3);
  const task = calls.find((call) => call.url === '/api/bms/weekly-plans/3/tasks');
  assert.equal(task.method, 'POST');
  assert.equal(task.body.title, 'Prepare report');
  assert.equal('weekly_plan_id' in task.body, false);
  assert.deepEqual(calls.find((call) => call.url === '/api/bms/employees/1/status').body, { active: false });
  assert.ok(calls.some((call) => call.method === 'POST' && call.url === '/api/bms/products/2/archive'));
  assert.ok(calls.some((call) => call.method === 'POST' && call.url === '/api/bms/meetings/3/cancel'));
});

test('live documents are submitted as multipart uploads', async () => {
  await api.create('documents', { name: 'Guide', category: 'handbook', file: new File(['contents'], 'guide.pdf', { type: 'application/pdf' }) });
  const upload = calls.find((call) => call.url === '/api/bms/documents');
  assert.match(upload.headers['content-type'], /^multipart\/form-data; boundary=/);
  assert.match(upload.body, /guide\.pdf/);
  assert.match(upload.body, /contents/);
});

test('employee details combine roles with directory certificates', async () => {
  const employee = await api.employee(1);
  assert.equal(employee.roles[0].name, 'Member');
  assert.equal(employee.certificates[0].name, 'PMP');
});

test('Laravel snake_case relationships are normalized for existing read views', async () => {
  const unit = await api.unit(7);
  assert.equal(unit.developmentManager.username, 'test');
  assert.equal(unit.weeklyPlans[0].supportRequests[0].title, 'Review');
  assert.equal((await api.weeklyPlan(3)).supportRequests[0].title, 'Review');
  const product = (await api.products())[0];
  assert.equal(product.businessUnits[0].name, 'Research');
  assert.equal(product.currentPhase.progress, 40);
  assert.equal((await api.executiveDashboard()).products[0].currentPhase.name, 'Pilot');
});

test('meeting creates send internal and external attendees in Laravel shape', async () => {
  await api.create('meetings', {
    title: 'Kickoff', starts_at: '2026-11-20 09:00:00', ends_at: '2026-11-20 10:00:00',
    attendees: [{ user_id: 1 }, { external_name: 'Guest', external_email: 'guest@example.com' }],
  });
  const meeting = calls.find((call) => call.method === 'POST' && call.url === '/api/bms/meetings');
  assert.deepEqual(meeting.body.attendees, [{ user_id: 1 }, { external_name: 'Guest', external_email: 'guest@example.com' }]);
});

test('missing live endpoints fail explicitly rather than writing demo data', async () => {
  await assert.rejects(api.bonuses(), (error) => error instanceof ApiError && error.status === 404);
  await assert.rejects(api.remove('opportunities', 42), (error) => error instanceof ApiError && error.status === 404);
  assert.ok(calls.some((call) => call.method === 'DELETE' && call.url === '/api/bms/opportunities/42'));
});
