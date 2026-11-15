import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';

// The API uses Africa/Cairo; simulate a browser in a different timezone.
process.env.TZ = 'America/New_York';
const result = await build({
  entryPoints: ['src/lib/dates.ts', 'src/lib/utils.ts'], bundle: true, platform: 'node', format: 'esm', write: false,
  outdir: 'test-bundle', define: { 'import.meta.env.VITE_BMS_SERVER_TIME_ZONE': '"Africa/Cairo"' },
});
const moduleAt = async (filename) => {
  const output = result.outputFiles.find((file) => file.path.endsWith(filename));
  return import(`data:text/javascript;base64,${Buffer.from(output.text).toString('base64')}`);
};
const { calendarDateValue, localDateTimeValue, serverDateTimeValue, validLocalDateTime, ambiguousLocalDateTime, ambiguousServerDateTime } = await moduleAt('dates.js');
const { formatDate, formatCalendarDate, formatDateTime } = await moduleAt('utils.js');

test('calendar dates survive Laravel UTC serialization and browser timezones', () => {
  // Midnight on 15 November in Cairo is 22:00 UTC on the preceding day.
  assert.equal(calendarDateValue('2026-11-14T22:00:00.000000Z'), '2026-11-15');
  assert.equal(calendarDateValue('2026-11-15'), '2026-11-15');
  assert.equal(formatDate('2026-11-15', 'en'), '15 Nov 2026');
  assert.equal(formatCalendarDate('2026-11-14T22:00:00.000000Z', 'en'), '15 Nov 2026');
  assert.equal(formatCalendarDate(null, 'en'), '—');
});

test('meeting and event inputs display browser time and submit Laravel server wall time', () => {
  assert.equal(localDateTimeValue('2026-12-20T14:00:00.000000Z'), '2026-12-20T09:00');
  assert.equal(localDateTimeValue('2026-12-20'), '2026-12-20T00:00');
  assert.equal(formatDateTime('2026-12-20T14:00:00.000000Z', 'en'), '20 Dec 2026, 09:00');
  assert.equal(formatDateTime('2026-12-20', 'en'), '20 Dec 2026, 00:00');
  assert.equal(serverDateTimeValue('2026-12-20T09:00'), '2026-12-20 16:00:00');
  // New York has changed to daylight saving time; Cairo has not yet changed.
  assert.equal(serverDateTimeValue('2026-03-20T09:00'), '2026-03-20 15:00:00');
  assert.equal(validLocalDateTime('2026-03-08T02:30'), false); // skipped in New York
  assert.equal(validLocalDateTime('2026-03-08T03:30'), true);
});

test('repeated daylight-saving wall times are detected rather than silently shifted', () => {
  assert.equal(ambiguousLocalDateTime('2026-11-01T01:30'), true); // New York clocks go back
  assert.equal(ambiguousLocalDateTime('2026-11-01T03:30'), false);
  assert.equal(ambiguousServerDateTime('2026-10-29T16:30'), true); // 23:30 occurs twice in Cairo
  assert.equal(ambiguousServerDateTime('2026-10-29T18:30'), false);
});
