#!/usr/bin/env node
/*
 * Static route inventory. Walks every TypeScript file under <root>/src/app,
 * finds the `Routes` arrays and prints one line per route:
 *
 *   <file> :: <full path> | component | guards | redirect | lazy | data
 *
 * Used to prove that a refactor preserved every URL, guard, redirect and
 * lazy-loaded module:  node scripts/route-inventory.js [frontendRoot]
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ts = require(path.resolve(__dirname, '..', 'node_modules', 'typescript'));

const root = path.resolve(process.argv[2] || path.join(__dirname, '..'));
const appDir = path.join(root, 'src', 'app');

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.spec.ts')) out.push(full);
  }
  return out;
}

const squash = (text) => text.replace(/\s+/g, ' ').trim();

function prop(obj, name) {
  const found = obj.properties.find((p) => ts.isPropertyAssignment(p) && p.name.getText() === name);
  return found ? found.initializer : undefined;
}

function describeRoutes(array, parent, lines, file) {
  for (const element of array.elements) {
    if (!ts.isObjectLiteralExpression(element)) {
      lines.push(`${file} :: ${parent || '/'} + DYNAMIC ${squash(element.getText())}`);
      continue;
    }
    const p = prop(element, 'path');
    if (!p) continue;
    const segment = p.getText().replace(/['"`]/g, '');
    const full = [parent, segment].filter((s) => s !== '' && s !== undefined).join('/');
    const text = (name) => { const node = prop(element, name); return node ? squash(node.getText()) : '-'; };
    const lazy = text('loadChildren').replace(/.*import\(([^)]*)\).*/, '$1');
    lines.push(`${file} :: /${full} | component=${text('component')} | canActivate=${text('canActivate')} | redirectTo=${text('redirectTo')} | pathMatch=${text('pathMatch')} | lazy=${lazy} | data=${text('data')}`);
    const children = prop(element, 'children');
    if (children && ts.isArrayLiteralExpression(children)) describeRoutes(children, full, lines, file);
  }
}

const lines = [];
for (const file of walk(appDir)) {
  const source = fs.readFileSync(file, 'utf8');
  if (!/\bRoutes\b/.test(source)) continue;
  const sf = ts.createSourceFile(file, source, ts.ScriptTarget.ES2019, true);
  const rel = path.relative(appDir, file);
  const visit = (node) => {
    if (ts.isVariableDeclaration(node) && node.type && node.type.getText() === 'Routes'
      && node.initializer && ts.isArrayLiteralExpression(node.initializer)) {
      describeRoutes(node.initializer, '', lines, rel);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
}
console.log(lines.join('\n'));
console.error(`${lines.length} route entries`);
