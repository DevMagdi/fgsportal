import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import config from '../tailwind.config.js';

const read = (path) => readFile(new URL(path, import.meta.url));
const colors = JSON.parse(await read('../src/brand.json'));

function luminance(hex) {
  const values = hex.match(/[a-f\d]{2}/gi).map((part) => parseInt(part, 16) / 255);
  const linear = values.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}
function contrast(a, b) {
  const [dark, light] = [luminance(a), luminance(b)].sort((x, y) => x - y);
  return (light + 0.05) / (dark + 0.05);
}

test('the official palette drives the primary and highlight tokens', async () => {
  assert.deepEqual(colors, {
    indigo: '#45436E', skin: '#DBCEBF', white: '#FFFFFF', pink: '#F498C1',
    lavender: '#E7BAED', violet: '#B5AFF9', turquoise: '#A9F9ED', cyan: '#81E2FD',
  });
  const theme = config.theme.colors;
  assert.equal(theme.brand[600], colors.indigo);
  for (const name of ['skin', 'white', 'pink', 'lavender', 'violet', 'turquoise', 'cyan']) assert.equal(theme[name], colors[name]);
  const css = (await read('../src/index.css')).toString();
  for (const [variable, value] of Object.entries({ brand: colors.indigo, ...Object.fromEntries(Object.entries(colors).filter(([name]) => name !== 'indigo')) })) {
    assert.ok(css.includes(`--${variable}: ${value};`), `${variable} CSS variable matches the official palette`);
  }
  assert.ok(contrast(colors.indigo, colors.white) >= 7);
  assert.ok(contrast(theme.slate[400], theme.surface) >= 4.5, 'muted text remains readable on the content surface');
  assert.ok(contrast(theme.slate[500], theme.slate[50]) >= 4.5, 'secondary text remains readable on light surfaces');
});

test('shared controls retain a visible focus outline and non-blocking toast dismissal', async () => {
  const css = (await read('../src/index.css')).toString();
  const button = (await read('../src/components/ui/Button.tsx')).toString();
  const toast = (await read('../src/components/ui/Toast.tsx')).toString();
  assert.match(css, /:focus-visible\s*\{\s*outline:\s*2px solid var\(--brand\)/);
  assert.doesNotMatch(button, /focus-visible:outline-none/);
  assert.match(toast, /role=\{toast\.tone[^\n]+className="pointer-events-none /);
  assert.match(toast, /<button[^\n]+className="pointer-events-auto /);
});

test('the original logo is used for the app identity and favicon', async () => {
  const logo = await read('../src/assets/alphaiota-logo.png');
  assert.equal(createHash('sha256').update(logo).digest('hex'), 'fb5834a5b2d6a1c877bfd3caa826b7093de6686aee9358096d7734f426e84ff3');
  const html = (await read('../index.html')).toString();
  assert.match(html, /<title>Alphaiota BMS<\/title>/);
  assert.match(html, /rel="icon"[^>]*alphaiota-logo\.png/);
  for (const file of ['../src/components/layout/Sidebar.tsx', '../src/pages/LoginPage.tsx']) {
    const source = (await read(file)).toString();
    assert.match(source, /assets\/alphaiota-logo\.png/);
    assert.match(source, /Alphaiota BMS/);
  }
});
