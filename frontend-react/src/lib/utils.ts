import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { calendarDateValue } from './dates';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function initials(name?: string | null): string {
  if (!name) return '—';
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? '').join('') || '—';
}

export function formatNumber(n: number | string | null | undefined, lang: string): string {
  if (n === null || n === undefined || n === '') return '—';
  const num = typeof n === 'string' ? Number(n) : n;
  if (Number.isNaN(num)) return String(n);
  return new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US', { maximumFractionDigits: 0 }).format(num);
}

export function formatMoney(value: number | string | null | undefined, currency: string | null | undefined, lang: string): string {
  if (value === null || value === undefined || value === '') return '—';
  const num = typeof value === 'string' ? Number(value) : value;
  if (Number.isNaN(num)) return '—';
  const compact = Math.abs(num) >= 1_000_000;
  const formatted = new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: compact ? 1 : 0,
  }).format(num);
  return `${formatted} ${currency ?? 'SAR'}`;
}

export function formatDate(value: string | null | undefined, lang: string): string {
  if (!value) return '—';
  // A bare date is a calendar day, not midnight UTC in the viewer's timezone.
  const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const d = parts ? new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]), 12) : new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  if (parts && (d.getFullYear() !== Number(parts[1]) || d.getMonth() !== Number(parts[2]) - 1 || d.getDate() !== Number(parts[3]))) return '—';
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(d);
}

/** Format a server-side date-only field without shifting it to the viewer's timezone. */
export function formatCalendarDate(value: string | null | undefined, lang: string): string {
  return value ? formatDate(calendarDateValue(value), lang) : '—';
}

export function formatDateTime(value: string | null | undefined, lang: string): string {
  if (!value) return '—';
  // Support legacy demo events saved as bare dates without a UTC day shift.
  const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value);
  if (Number.isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(d);
}

export function timeAgo(value: string | null | undefined, lang: string): string {
  if (!value) return '—';
  const d = new Date(value).getTime();
  if (Number.isNaN(d)) return '—';
  const diff = Date.now() - d;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return lang === 'ar' ? 'الآن' : 'Just now';
  if (mins < 60) return lang === 'ar' ? `قبل ${mins} د` : `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return lang === 'ar' ? `قبل ${hours} س` : `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return lang === 'ar' ? `قبل ${days} يوم` : `${days}d ago`;
}

/** Laravel validation errors come back as { data: { field: ['msg'] } }. */
export function flattenErrors(data: unknown): string[] {
  if (!data) return [];
  if (typeof data === 'string') return [data];
  if (Array.isArray(data)) return data.map(String);
  if (typeof data === 'object') {
    return Object.values(data as Record<string, unknown>).flatMap((v) =>
      Array.isArray(v) ? v.map(String) : [String(v)],
    );
  }
  return [String(data)];
}
