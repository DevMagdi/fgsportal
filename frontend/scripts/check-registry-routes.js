#!/usr/bin/env node
/*
 * Static guard ensuring every card in module-pages.registry.ts points at a
 * route that actually exists in the Angular router configuration. The router
 * is split across app-routing.module.ts and the lazy *-routing.module.ts
 * files, so the check resolves each registry route's prefix to the file that
 * declares it and then verifies the remaining path segments there.
 *
 * Runs on Node without a browser:
 *   node scripts/check-registry-routes.js
 */

'use strict';

const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const FRONTEND_ROOT = path.resolve(__dirname, '..');
const REGISTRY = path.join(FRONTEND_ROOT, 'src/app/services/module-pages.registry.ts');

const PREFIX_TO_FILE = {
  manager: 'src/app/components/manager/manager/manager-routing.module.ts',
  dev: 'src/app/components/dev/dev/dev-routing.module.ts',
  'admin-panel': 'src/app/components/admin/admin/admin-routing.module.ts',
  CRM: 'src/app/components/crm/crm-routing.module.ts',
  hr: 'src/app/components/hr/hr-routing.module.ts',
};

const TOP_LEVEL_FILE = 'src/app/app-routing.module.ts';

function loadRegistryRoutes() {
  const source = fs.readFileSync(REGISTRY, 'utf8');
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2019,
    },
  });

  const module = { exports: {} };
  const localRequire = (request) => {
    if (request.endsWith('interfaces/user')) {
      // The registry only needs the enum values; compile the real file too.
      const userFile = path.join(FRONTEND_ROOT, 'src/app/interfaces/user.ts');
      const userModule = { exports: {} };
      new Function(
        'exports',
        'module',
        ts.transpileModule(fs.readFileSync(userFile, 'utf8'), {
          compilerOptions: { module: ts.ModuleKind.CommonJS },
        }).outputText
      )(userModule.exports, userModule);
      return userModule.exports;
    }
    return require(request);
  };
  new Function('exports', 'require', 'module', transpiled.outputText)(
    module.exports,
    localRequire,
    module
  );

  const routes = [];
  for (const pages of Object.values(module.exports.MODULE_PAGES)) {
    for (const page of pages) {
      routes.push(Array.isArray(page.route) ? page.route.join('/') : page.route);
    }
  }
  return [...new Set(routes)].sort();
}

function declaredSegments(fileRel) {
  const file = path.join(FRONTEND_ROOT, fileRel);
  if (!fs.existsSync(file)) {
    throw new Error(`Routing file not found: ${fileRel}`);
  }
  const content = fs.readFileSync(file, 'utf8');
  const segments = new Set();
  for (const line of content.match(/path:\s*'([^']+)'/g) || []) {
    const declaredPath = line.match(/'([^']+)'/)[1];
    // Keep every static segment; parameterised parts (':type') match their
    // parent segment, e.g. 'installments/:type' covers 'installments'.
    declaredPath.split('/').filter(Boolean).forEach((segment) => {
      if (!segment.startsWith(':')) {
        segments.add(segment);
      }
    });
  }
  return segments;
}

function main() {
  const routes = loadRegistryRoutes();
  const segmentCache = new Map();
  const getSegments = (fileRel) => {
    if (!segmentCache.has(fileRel)) {
      segmentCache.set(fileRel, declaredSegments(fileRel));
    }
    return segmentCache.get(fileRel);
  };

  const failures = [];
  for (const route of routes) {
    const segments = route.split('/').filter(Boolean);
    const [prefix, ...rest] = segments;
    const targetFile = PREFIX_TO_FILE[prefix] || TOP_LEVEL_FILE;
    const declared = getSegments(targetFile);

    // Top-level routes resolve their only segment in app-routing; lazy
    // routes resolve every sub-segment inside the feature routing file.
    const toCheck = PREFIX_TO_FILE[prefix] ? rest : segments;
    for (const segment of toCheck) {
      // Parameterised router targets (none today) and query-style second
      // segments ('t'/'v' for installments) are validated via the parent.
      if (segment === 't' || segment === 'v') {
        continue;
      }
      if (!declared.has(segment)) {
        failures.push(`${route} -> path '${segment}' not declared in ${targetFile}`);
      }
    }
  }

  console.log(`Validated ${routes.length} unique registry routes.`);
  if (failures.length > 0) {
    console.error('\nDead registry route(s):');
    failures.forEach((failure) => console.error(`  - ${failure}`));
    process.exit(1);
  }
  console.log('Every module card points at a declared Angular route.');
}

main();
