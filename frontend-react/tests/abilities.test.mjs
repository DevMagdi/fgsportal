import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';

const result = await build({ entryPoints: ['src/lib/abilities.ts'], bundle: true, platform: 'node', format: 'esm', write: false });
const { firstAllowedPath, hasAbility } = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);

test('home redirects to a view the user is allowed to open', () => {
  const paths = {
    'dashboard.view': '/dashboard', 'opportunities.view': '/opportunities', 'plans.view': '/plans',
    'units.view': '/units', 'leads.view': '/leads', 'meetings.view': '/meetings', 'products.view': '/products',
    'directory.view': '/employees', 'bonuses.view': '/bonuses', 'recruitment.view': '/recruitment',
    'development.view': '/development', 'procurement.view': '/procurement', 'events.view': '/events',
    'documents.view': '/documents', 'reports.view': '/reports', 'roles.manage': '/access',
  };
  for (const [ability, path] of Object.entries(paths)) assert.equal(firstAllowedPath([ability]), path);
  assert.equal(firstAllowedPath(['*']), '/dashboard');
  assert.equal(firstAllowedPath([]), '/no-access');
});

test('ability checks require the named ability or administrator wildcard', () => {
  assert.equal(hasAbility(['directory.view'], 'bonuses.view'), false);
  assert.equal(hasAbility(['bonuses.view'], 'bonuses.view'), true);
  assert.equal(hasAbility(['*'], 'bonuses.manage'), true);
  assert.equal(hasAbility(null, 'bonuses.view'), false);
});
