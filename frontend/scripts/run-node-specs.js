#!/usr/bin/env node
/*
 * Node test harness for the pure-TypeScript specs (the ones without Angular
 * TestBed). The sandbox/CI image used for this repository has no Chrome, so
 * `ng test` (Karma) cannot run; this harness transpiles the selected specs
 * with the project's own TypeScript compiler and executes them on Node with
 * a small Jasmine-compatible global API (describe/it/expect).
 *
 * Usage:
 *   node scripts/run-node-specs.js [<glob-or-file> ...]
 *
 * With no arguments it runs every *.spec.ts file that is marked node-runnable
 * by the PURE_SPECS allow-list below. Component specs still run through Karma
 * in a browser-capable environment.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const FRONTEND_ROOT = path.resolve(__dirname, '..');

// Pure specs: no Angular TestBed / DOM imports, safe to run on Node.
const PURE_SPECS = [
  'src/app/pipes/max-length.pipe.spec.ts',
  'src/app/services/module-pages.registry.spec.ts',
  'src/app/services/user-perms.cache.spec.ts',
];

// Lightweight @angular/core shim: pure specs may import a class decorated
// with @Pipe/@Injectable, which only needs the decorator to be an identity
// function outside the Angular runtime.
const ANGULAR_CORE_SHIM = {
  Pipe: () => (target) => target,
  Component: () => (target) => target,
  Injectable: () => (target) => target,
  NgModule: () => (target) => target,
  Directive: () => (target) => target,
};

// ---------------------------------------------------------------------------
// Tiny Jasmine-compatible framework
// ---------------------------------------------------------------------------

const suites = [];
let currentSuite = null;
const failures = [];
let passCount = 0;

function describe(name, fn) {
  const suite = { name, specs: [], parent: currentSuite };
  suites.push(suite);
  const previous = currentSuite;
  currentSuite = suite;
  fn();
  currentSuite = previous;
}

function it(name, fn) {
  if (!currentSuite) {
    throw new Error(`it("${name}") called outside a describe()`);
  }
  currentSuite.specs.push({ name, fn });
}

function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a && b && typeof a === 'object') {
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every((key) => deepEqual(a[key], b[key]));
  }
  return false;
}

function fmt(value) {
  try {
    return JSON.stringify(value);
  } catch (_e) {
    return String(value);
  }
}

function makeExpect(actual, negated = false, context = '') {
  const check = (condition, message) => {
    const ok = negated ? !condition : condition;
    if (!ok) {
      throw new Error(
        `${context ? context + ': ' : ''}Expected ${fmt(actual)} ${
          negated ? 'not ' : ''
        }${message}`
      );
    }
  };

  const matchers = {
    toBe(expected) {
      check(actual === expected, `to be ${fmt(expected)}`);
    },
    toEqual(expected) {
      check(deepEqual(actual, expected), `to equal ${fmt(expected)}`);
    },
    toBeTrue() {
      check(actual === true, 'to be true');
    },
    toBeFalse() {
      check(actual === false, 'to be false');
    },
    toBeTruthy() {
      check(!!actual, 'to be truthy');
    },
    toBeFalsy() {
      check(!actual, 'to be falsy');
    },
    toBeUndefined() {
      check(actual === undefined, 'to be undefined');
    },
    toBeNull() {
      check(actual === null, 'to be null');
    },
    toBeDefined() {
      check(actual !== undefined, 'to be defined');
    },
    toContain(expected) {
      const ok =
        (typeof actual === 'string' || Array.isArray(actual)) &&
        actual.includes(expected);
      check(ok, `to contain ${fmt(expected)}`);
    },
    toBeGreaterThan(expected) {
      check(actual > expected, `to be greater than ${fmt(expected)}`);
    },
    toBeLessThan(expected) {
      check(actual < expected, `to be less than ${fmt(expected)}`);
    },
    toBeGreaterThanOrEqual(expected) {
      check(actual >= expected, `to be >= ${fmt(expected)}`);
    },
    toHaveBeenCalled() {
      check(typeof actual === 'function' && actual.calls > 0, 'to have been called');
    },
    toHaveBeenCalledOnceWith(...args) {
      check(
        typeof actual === 'function' &&
          actual.calls === 1 &&
          deepEqual(actual.callArgs[0], args),
        `to have been called once with ${fmt(args)}`
      );
    },
    toHaveBeenCalledWith(...args) {
      check(
        typeof actual === 'function' &&
          actual.callArgs.some((callArgs) => deepEqual(callArgs, args)),
        `to have been called with ${fmt(args)}`
      );
    },
  };

  Object.defineProperty(matchers, 'not', {
    get: () => makeExpect(actual, !negated, context),
  });
  Object.defineProperty(matchers, 'withContext', {
    value: (label) => makeExpect(actual, negated, String(label)),
  });
  return matchers;
}

function expect(actual) {
  return makeExpect(actual);
}

function createSpy(name = 'spy') {
  const spy = function (...args) {
    spy.calls += 1;
    spy.callArgs.push(args);
    return spy.returnValue;
  };
  spy.calls = 0;
  spy.callArgs = [];
  spy.returnValue = undefined;
  spy.and = {
    returnValue(value) {
      spy.returnValue = value;
      return spy;
    },
  };
  spy.name = name;
  return spy;
}

// ---------------------------------------------------------------------------
// Module loading: transpile TS in-memory, resolve relative imports from cache
// ---------------------------------------------------------------------------

const moduleCache = new Map();

function compileTs(filePath) {
  if (moduleCache.has(filePath)) {
    return moduleCache.get(filePath);
  }

  const source = fs.readFileSync(filePath, 'utf8');
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2019,
      experimentalDecorators: true,
      esModuleInterop: true,
      sourceMap: false,
    },
    fileName: filePath,
  });

  const localRequire = (request) => {
    if (request.startsWith('.')) {
      let resolved = path.resolve(path.dirname(filePath), request);
      if (!resolved.endsWith('.ts')) {
        resolved += '.ts';
      }
      return compileTs(resolved).exports;
    }
    if (request === '@angular/core') {
      return ANGULAR_CORE_SHIM;
    }
    return require(request); // node_modules (rxjs, etc.)
  };

  const module = { exports: {} };
  moduleCache.set(filePath, module);
  const fn = new Function('exports', 'require', 'module', '__filename', '__dirname', transpiled.outputText);
  fn(module.exports, localRequire, module, filePath, path.dirname(filePath));
  return module;
}

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

function resolveSpecs(argv) {
  if (argv.length === 0) {
    return PURE_SPECS.map((rel) => path.join(FRONTEND_ROOT, rel));
  }
  const files = [];
  for (const arg of argv) {
    const resolved = path.resolve(FRONTEND_ROOT, arg);
    if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
      for (const entry of fs.readdirSync(resolved)) {
        if (entry.endsWith('.spec.ts')) {
          files.push(path.join(resolved, entry));
        }
      }
    } else {
      files.push(resolved);
    }
  }
  return files;
}

function run() {
  const specs = resolveSpecs(process.argv.slice(2));

  global.describe = describe;
  global.it = it;
  global.expect = expect;
  global.beforeEach = (fn) => {
    if (!currentSuite) throw new Error('beforeEach outside describe()');
    currentSuite.beforeEach = currentSuite.beforeEach || [];
    currentSuite.beforeEach.push(fn);
  };
  global.createSpy = createSpy;

  for (const specFile of specs) {
    // Isolate module registry per spec file so stubs cannot leak.
    moduleCache.clear();
    suites.length = 0;
    compileTs(specFile);

    const rel = path.relative(FRONTEND_ROOT, specFile);
    console.log(`\n${rel}`);

    for (const suite of suites) {
      for (const spec of suite.specs) {
        try {
          (suite.beforeEach || []).forEach((fn) => fn());
          spec.fn();
          passCount += 1;
          console.log(`  ✓ ${suite.name} > ${spec.name}`);
        } catch (error) {
          failures.push({ file: rel, suite: suite.name, spec: spec.name, error });
          console.log(`  ✗ ${suite.name} > ${spec.name}`);
        }
      }
    }
  }

  console.log(`\n${passCount} passing, ${failures.length} failing`);
  if (failures.length > 0) {
    console.log('\nFailures:');
    failures.forEach((failure, index) => {
      console.log(
        `\n${index + 1}) ${failure.file} — ${failure.suite} > ${failure.spec}\n   ${failure.error.message}`
      );
    });
    process.exit(1);
  }
}

run();
