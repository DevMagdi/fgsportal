import { beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { File as NodeFile } from 'node:buffer';
import { build } from 'esbuild';

// Bundle the TypeScript store for Node's built-in test runner; the app itself
// still runs through Vite and the store uses the same browser storage API.
const result = await build({ entryPoints: ['src/lib/demo-store.ts'], bundle: true, platform: 'node', format: 'esm', write: false });
const store = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
const memory = new Map();
globalThis.localStorage = {
  getItem: (key) => memory.get(key) ?? null,
  setItem: (key, value) => memory.set(key, String(value)),
  removeItem: (key) => memory.delete(key),
  clear: () => memory.clear(),
};
if (!globalThis.File) globalThis.File = NodeFile;
beforeEach(() => memory.clear());

test('new units, employees, and bonuses stay connected across reads', () => {
  const unit = store.demoSave('units', { name: 'Research', is_active: true });
  const employee = store.demoSave('employees', { firstname: 'Amina', lastname: 'Saleh', username: 'amina', email: 'amina@example.com', password: 'private-password', business_unit_ids: [unit.id], active: true });
  const bonus = store.demoSave('bonuses', { title: 'Great work', employee_id: employee.id, business_unit_id: unit.id, amount: 500, currency: 'SAR', awarded_on: '2026-11-15', status: 'draft' });
  assert.equal(store.demoFind('units', unit.id).headcount, 1);
  assert.equal(store.demoFind('units', unit.id).users[0].id, employee.id);
  assert.equal(store.demoFind('bonuses', bonus.id).employee.name, 'Amina Saleh');
  assert.equal(store.demoFind('bonuses', bonus.id).unit.name, 'Research');
  assert.equal(store.demoLookupsCurrent().users.some((person) => person.id === employee.id), true);
  assert.equal([...memory.values()].join('').includes('private-password'), false);
});

test('editing an employee or unit updates linked names and cleared relationships', () => {
  const unit = store.demoSave('units', { name: 'Research' });
  const employee = store.demoSave('employees', { firstname: 'Amina', lastname: 'Saleh', username: 'amina', email: 'amina@example.com', business_unit_ids: [unit.id] });
  store.demoSave('units', { name: 'Applied Research' }, unit.id);
  store.demoSave('employees', { firstname: 'Amina', lastname: 'Hassan', manager_id: null, business_unit_ids: [unit.id] }, employee.id);
  const saved = store.demoFind('employees', employee.id);
  assert.equal(saved.name, 'Amina Hassan');
  assert.equal(saved.units[0].name, 'Applied Research');
  assert.equal(saved.manager, null);
});

test('unit hierarchy cycles and deletion of dependent units are rejected', () => {
  const parent = store.demoSave('units', { name: 'Parent' });
  const child = store.demoSave('units', { name: 'Child', parent_id: parent.id });
  assert.throws(() => store.demoSave('units', { name: 'Parent', parent_id: child.id }, parent.id), /descendants/);
  assert.throws(() => store.demoDelete('units', parent.id), /related records/);
  assert.ok(store.demoFind('units', parent.id));
  store.demoDelete('units', child.id);
  store.demoDelete('units', parent.id);
  assert.equal(store.demoFind('units', parent.id), undefined);
});

test('opportunity updates retain stage history and documents are removed with their opportunity', () => {
  const opportunity = store.demoSave('opportunities', { title: 'New deal', client_name: 'Acme', business_unit_id: 1, owner_id: 1, stage: 'review' });
  store.demoSave('opportunities', { title: 'New deal', client_name: 'Acme', stage: 'proposal', notes: 'Next steps' }, opportunity.id);
  const updated = store.demoFind('opportunities', opportunity.id);
  assert.equal(updated.history.length, 2);
  assert.equal(updated.history[1].from_stage, 'review');
  assert.equal(updated.history[1].to_stage, 'proposal');
  assert.equal(updated.notes, 'Next steps');
  store.demoAddOpportunityDocument(opportunity.id, new File(['sample'], 'proposal.pdf'), 'rfp');
  assert.equal(store.demoOpportunityDocuments(opportunity.id).length, 1);
  store.demoDelete('opportunities', opportunity.id);
  assert.equal(store.demoOpportunityDocuments(opportunity.id).length, 0);
});

test('moving or clearing a seeded document updates its unit relationship', () => {
  assert.equal(store.demoFind('documents', 1).unit.id, 1);
  store.demoSave('documents', { business_unit_id: 2 }, 1);
  assert.equal(store.demoFind('documents', 1).unit.id, 2);
  store.demoSave('documents', { business_unit_id: null }, 1);
  assert.equal(store.demoFind('documents', 1).unit, null);
  const oldUnit = store.demoSave('units', { name: 'Old document unit' });
  const newUnit = store.demoSave('units', { name: 'New document unit' });
  const document = store.demoSave('documents', { name: 'Moved guide', category: 'guide', business_unit_id: oldUnit.id });
  store.demoSave('documents', { business_unit_id: newUnit.id }, document.id);
  store.demoDelete('units', oldUnit.id);
  assert.equal(store.demoFind('documents', document.id).unit.id, newUnit.id);
});

test('tasks are linked to their plan and deleted with it', () => {
  const plan = store.demoSave('plans', { business_unit_id: 1, week_start: '2026-11-15' });
  const task = store.demoSave('tasks', { weekly_plan_id: plan.id, title: 'Prepare report', status: 'in_progress', progress: 25 });
  assert.equal(store.demoFind('plans', plan.id).tasks[0].id, task.id);
  store.demoSave('tasks', { title: 'Prepare report', status: 'achieved', progress: 100 }, task.id);
  assert.equal(store.demoFind('plans', plan.id).tasks[0].progress, 100);
  store.demoDelete('plans', plan.id);
  assert.equal(store.demoFind('tasks', task.id), undefined);
});

test('document uploads store metadata only, and audit entries track changes', () => {
  const document = store.demoSave('documents', { name: 'Guide', category: 'handbook', file: new File(['secret-content'], 'guide.pdf', { type: 'application/pdf' }) });
  assert.equal(document.original_name, 'guide.pdf');
  assert.equal(document.is_published, true);
  assert.equal([...memory.values()].join('').includes('secret-content'), false);
  store.demoSave('documents', { name: 'Updated guide', category: 'handbook' }, document.id);
  assert.deepEqual(store.demoActivity('documents', document.id).map((entry) => entry.action), ['updated', 'created']);
  store.demoDelete('documents', document.id);
  assert.equal(store.demoFind('documents', document.id), undefined);
});

test('duplicate unit names and employee credentials are rejected', () => {
  assert.throws(() => store.demoSave('units', { name: 'kraken' }), /already exists/);
  assert.throws(() => store.demoSave('employees', { username: 'nora.alharbi', email: 'new@example.com' }), /username/);
  assert.throws(() => store.demoSave('employees', { username: 'new', email: 'nora@fgs.local' }), /email/);
});

test('team members must belong to the unit and are released when they leave it', () => {
  const unit = store.demoSave('units', { name: 'Test unit' });
  const other = store.demoSave('units', { name: 'Other unit' });
  const member = store.demoSave('employees', { firstname: 'Amina', lastname: 'Saleh', username: 'amina', email: 'amina@example.com', business_unit_ids: [unit.id] });
  assert.throws(() => store.demoSave('teams', { name: 'Invalid team', business_unit_id: other.id, user_ids: [member.id] }), /must belong/);
  const team = store.demoSave('teams', { name: 'Research team', business_unit_id: unit.id, lead_id: member.id, user_ids: [member.id] });
  assert.throws(() => store.demoSave('teams', { name: 'research team', business_unit_id: unit.id }), /already has a team/);
  assert.equal(store.demoFind('teams', team.id).lead.id, member.id);
  store.demoSave('employees', { business_unit_ids: [other.id] }, member.id);
  assert.equal(store.demoFind('teams', team.id).lead, null);
  assert.equal(store.demoFind('teams', team.id).members.length, 0);
});

test('submitted plans reject changes and new tasks while existing tasks remain editable', () => {
  const plan = store.demoSave('plans', { business_unit_id: 1, week_start: '2026-11-15' });
  const task = store.demoSave('tasks', { weekly_plan_id: plan.id, title: 'Prepare', status: 'not_done' });
  store.demoSave('plans', { status: 'submitted' }, plan.id);
  assert.throws(() => store.demoSave('plans', { objectives: 'Changed' }, plan.id), /read-only/);
  assert.throws(() => store.demoSave('tasks', { weekly_plan_id: plan.id, title: 'Late task' }), /cannot receive/);
  store.demoSave('tasks', { status: 'achieved' }, task.id);
  assert.equal(store.demoFind('tasks', task.id).status, 'achieved');
});

test('demo meetings persist attendees and preserve them on unrelated edits', () => {
  assert.throws(() => store.demoSave('meetings', { title: 'No attendees' }), /attendee/);
  const meeting = store.demoSave('meetings', { title: 'Kickoff', starts_at: '2026-11-20T09:00:00Z', ends_at: '2026-11-20T10:00:00Z', attendees: [{ user_id: 1 }, { external_name: 'Guest', external_email: 'guest@example.com' }] });
  store.demoSave('meetings', { title: 'Project kickoff' }, meeting.id);
  let saved = store.demoFind('meetings', meeting.id);
  assert.equal(saved.attendees[0].user.username, 'nora.alharbi');
  assert.equal(saved.attendees[1].external_email, 'guest@example.com');
  store.demoSave('meetings', { attendees: [{ user_id: 2 }] }, meeting.id);
  saved = store.demoFind('meetings', meeting.id);
  assert.equal(saved.attendees.length, 1);
  assert.equal(saved.attendees[0].user.username, 'omar.fahmy');
});

test('demo ids are not reused after the newest record is removed', () => {
  const first = store.demoSave('units', { name: 'Temporary unit' });
  store.demoDelete('units', first.id);
  const second = store.demoSave('units', { name: 'Another unit' });
  assert.ok(second.id > first.id);
});

test('demo employees cannot create manager cycles', () => {
  const first = store.demoSave('employees', { firstname: 'First', lastname: 'Person', username: 'first', email: 'first@example.com', business_unit_ids: [1] });
  const second = store.demoSave('employees', { firstname: 'Second', lastname: 'Person', username: 'second', email: 'second@example.com', manager_id: first.id, business_unit_ids: [1] });
  assert.throws(() => store.demoSave('employees', { manager_id: second.id }, first.id), /reporting cycle/);
});
