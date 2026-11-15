/**
 * Laravel stores BMS DATETIME values without an offset in its application
 * timezone. Its Eloquent date/datetime casts serialize them as UTC instants.
 * Keep that timezone distinct from the browser's timezone and from date-only
 * calendar values (weekly-plan starts, deadlines, and so on). Events and
 * meetings are timestamps, not calendar-only values.
 */
export const BMS_SERVER_TIME_ZONE = import.meta.env.VITE_BMS_SERVER_TIME_ZONE || 'Africa/Cairo';

function dateParts(date: Date, timeZone: string, includeTime: boolean): Record<string, string> {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric', month: '2-digit', day: '2-digit',
    ...(includeTime ? { hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' as const } : {}),
  });
  return Object.fromEntries(formatter.formatToParts(date).map(({ type, value }) => [type, value]));
}

function partsAsUtc(parts: Record<string, string>): number {
  return Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(parts.hour), Number(parts.minute), Number(parts.second));
}

// A naive DATETIME cannot distinguish the two occurrences of a repeated wall
// time when clocks go back. Detect both offset candidates around the transition.
function isAmbiguous(date: Date, timeZone: string): boolean {
  const target = partsAsUtc(dateParts(date, timeZone, true));
  const offsets = new Set<number>();
  for (let hours = -36; hours <= 36; hours += 6) {
    const probe = new Date(date.getTime() + hours * 3_600_000);
    offsets.add(partsAsUtc(dateParts(probe, timeZone, true)) - probe.getTime());
  }
  let matches = 0;
  for (const offset of offsets) {
    const candidate = new Date(target - offset);
    if (partsAsUtc(dateParts(candidate, timeZone, true)) === target && ++matches > 1) return true;
  }
  return false;
}

/** Recover the intended server calendar date from an Eloquent date cast. */
export function calendarDateValue(value: string): string {
  if (!/(?:Z|[+-]\d{2}:?\d{2})$/i.test(value)) return value.slice(0, 10);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const parts = dateParts(date, BMS_SERVER_TIME_ZONE, false);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

/** Display a timestamp in the browser's local timezone in a datetime-local input. */
export function localDateTimeValue(value: string): string {
  // Older demo workspaces contain date-only events; keep their calendar day
  // editable as local midnight without interpreting the date as UTC.
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return `${value}T00:00`;
  if (!/(?:Z|[+-]\d{2}:?\d{2})$/i.test(value)) return value.replace(' ', 'T').slice(0, 16);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

/** Reject local times skipped by the browser timezone's daylight-saving change. */
export function validLocalDateTime(localValue: string): boolean {
  const date = new Date(localValue);
  return !Number.isNaN(date.getTime()) && localDateTimeValue(date.toISOString()) === localValue.slice(0, 16);
}

/** Reject repeated wall times that cannot be uniquely represented by the form or API. */
export function ambiguousLocalDateTime(localValue: string): boolean {
  return isAmbiguous(new Date(localValue), Intl.DateTimeFormat().resolvedOptions().timeZone);
}
export function ambiguousServerDateTime(localValue: string): boolean {
  return isAmbiguous(new Date(localValue), BMS_SERVER_TIME_ZONE);
}

/**
 * Send a browser-local input as server-local wall time, not as a UTC string.
 * Laravel 8 formats a supplied offset into a naive DATETIME without converting
 * it first, so sending `toISOString()` would shift the saved meeting.
 */
export function serverDateTimeValue(localValue: string): string {
  const date = new Date(localValue);
  if (Number.isNaN(date.getTime())) return '';
  const parts = dateParts(date, BMS_SERVER_TIME_ZONE, true);
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
}
