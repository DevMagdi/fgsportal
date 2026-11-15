import { useId, useMemo, useState, type FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, Check, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useI18n } from '../../i18n';
import { api, ApiError } from '../../lib/api';
import { ENTITY_CONFIG, type FieldSpec } from '../../lib/entity-config';
import type { EntityKind, EntityMap, EntityPayload, Meeting, MeetingAttendeeInput } from '../../lib/types';
import { cn, formatCalendarDate } from '../../lib/utils';
import { ambiguousLocalDateTime, ambiguousServerDateTime, calendarDateValue, localDateTimeValue, serverDateTimeValue, validLocalDateTime } from '../../lib/dates';
import { emailPattern, validateGuests, type Guest } from '../../lib/guest-validation';
import { displayName } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { statusLabel } from '../ui/DataTable';
import { FormField, inputClass, TextInput } from '../ui/FormField';
import { Modal } from '../ui/Modal';

type Value = string | string[] | File;
type Values = Record<string, Value>;
type Option = { value: string; label: string; disabled?: boolean };

function initialValues(kind: EntityKind, fields: FieldSpec[], record: Record<string, unknown> | null, defaults?: EntityPayload): Values {
  const values: Values = {};
  fields.forEach((field) => {
    let value: unknown = defaults?.[field.name] ?? record?.[field.name] ?? field.defaultValue ?? '';
    if (field.name === 'business_unit_ids') value = defaults?.business_unit_ids ?? ((record?.units ?? record?.business_units ?? record?.businessUnits) as { id: number }[] | undefined)?.map((u) => u.id) ?? [];
    if (field.name === 'user_ids') value = defaults?.user_ids ?? (record?.members as { id: number }[] | undefined)?.map((u) => u.id) ?? [];
    if (field.name === 'attendee_user_ids') value = (record?.attendees as Meeting['attendees'])?.filter((a) => a.user_id).map((a) => a.user_id!) ?? [];
    if (field.name === 'business_unit_id' && !value) value = (record?.unit as { id: number } | undefined)?.id ?? (record?.business_unit as { id: number } | undefined)?.id ?? '';
    if (kind === 'employees' && (field.name === 'firstname' || field.name === 'lastname') && !value && record?.name) {
      const [first, ...last] = String(record.name).split(' ');
      value = field.name === 'firstname' ? first : last.join(' ');
    }
    if (field.name === 'services' && Array.isArray(value)) value = value.join(', ');
    if (field.name === 'is_active' || field.name === 'active') value = value === false || value === 0 || value === 'inactive' ? 'inactive' : 'active';
    if (field.type === 'multiselect') value = Array.isArray(value) ? value.map(String) : [];
    if ((field.type === 'date' || field.type === 'datetime-local') && typeof value === 'string' && value) {
      value = field.type === 'date' ? calendarDateValue(value) : localDateTimeValue(value);
    }
    values[field.name] = value instanceof File || Array.isArray(value) ? value : String(value ?? '');
  });
  return values;
}

function initialGuests(record: Meeting | null): Guest[] {
  return (record?.attendees ?? []).filter((attendee) => !attendee.user_id).map((attendee, index) => ({
    key: `existing-${index}`,
    name: attendee.external_name ?? '',
    email: attendee.external_email ?? '',
  }));
}

export function EntityDialog<K extends EntityKind>({ kind, record, defaults, onClose, onSave, busy }: {
  kind: K; record: EntityMap[K] | null; defaults?: EntityPayload; onClose: () => void;
  onSave: (data: EntityPayload, id?: number) => Promise<void>; busy: boolean;
}) {
  const config = ENTITY_CONFIG[kind];
  const { t, lang, dir } = useI18n();
  const { lookups } = useAuth();
  const id = useId();
  const isEdit = Boolean(record);
  const fields = useMemo(() => config.fields.filter((field) => !(field.createOnly && isEdit) && !(field.editOnly && !isEdit) && !(field.demoOnly && !api.demo)), [config, isEdit]);
  const [initial] = useState<Values>(() => initialValues(kind, fields, record as unknown as Record<string, unknown> | null, defaults));
  const [values, setValues] = useState<Values>(initial);
  const [originalGuests] = useState<Guest[]>(() => kind === 'meetings' ? initialGuests(record as Meeting | null) : []);
  const [guests, setGuests] = useState<Guest[]>(originalGuests);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const plansQuery = useQuery({ queryKey: ['bms', 'plans'], queryFn: () => api.weeklyPlans(), enabled: kind === 'tasks' });
  const teamUnitId = kind === 'teams' && typeof values.business_unit_id === 'string' ? values.business_unit_id : '';
  const teamUnit = useQuery({ queryKey: ['bms', 'unit', teamUnitId], queryFn: () => api.unit(teamUnitId), enabled: Boolean(teamUnitId) });

  const getOptions = (field: FieldSpec): Option[] => {
    if (field.source === 'units') return (lookups?.units ?? []).filter((u) => !(kind === 'units' && field.name === 'parent_id' && u.id === record?.id)).map((u) => ({ value: String(u.id), label: u.name }));
    if (field.source === 'users') {
      const users = kind === 'teams' ? teamUnit.data?.users ?? [] : lookups?.users ?? [];
      const options = users.filter((u) => !(kind === 'employees' && field.name === 'manager_id' && u.id === record?.id)).map((u) => ({ value: String(u.id), label: displayName(u) }));
      // Existing attendees can include inactive users not returned by /lookups.
      if (kind === 'meetings' && field.name === 'attendee_user_ids') {
        for (const attendee of (record as Meeting | null)?.attendees ?? []) {
          if (attendee.user_id && !options.some((option) => option.value === String(attendee.user_id))) {
            options.push({ value: String(attendee.user_id), label: attendee.user ? displayName(attendee.user) : `#${attendee.user_id}` });
          }
        }
      }
      return options;
    }
    if (field.source === 'products') return (lookups?.products ?? []).map((p) => ({ value: String(p.id), label: p.product_name }));
    if (field.source === 'degrees') return (lookups?.work_degrees ?? []).map((d) => ({ value: String(d.id), label: d.work_degree_name ?? d.name ?? String(d.id) }));
    if (field.source === 'leadStages') return (lookups?.lead_stages ?? []).map((s) => ({ value: s.code, label: s.name ?? statusLabel(s.code, t) }));
    if (field.source === 'plans') return (plansQuery.data ?? []).filter((p) => p.status === 'draft' || p.id === Number(values.weekly_plan_id)).map((p) => ({ value: String(p.id), label: `${p.unit?.name ?? '—'} · ${formatCalendarDate(p.week_start, lang)}` }));
    let options = field.options ?? [];
    // Live meeting cancellation has a dedicated server action with side effects.
    if (!api.demo && field.name === 'status' && kind === 'meetings') options = options.filter((value) => value !== 'cancelled');
    return options.map((value) => ({ value, label: statusLabel(value, t) }));
  };

  const attendeesChanged = () => {
    const currentIds = Array.isArray(values.attendee_user_ids) ? [...values.attendee_user_ids].sort() : [];
    const initialIds = Array.isArray(initial.attendee_user_ids) ? [...initial.attendee_user_ids].sort() : [];
    const currentGuests = guests.map(({ name, email }) => [name.trim(), email.trim()]);
    const previousGuests = originalGuests.map(({ name, email }) => [name.trim(), email.trim()]);
    return JSON.stringify(currentIds) !== JSON.stringify(initialIds) || JSON.stringify(currentGuests) !== JSON.stringify(previousGuests);
  };

  const validate = (onlyStep?: number) => {
    const next: Record<string, string> = {};
    fields.filter((field) => !onlyStep || (field.step ?? 1) === onlyStep).forEach((field) => {
      const value = values[field.name];
      const empty = value == null || (typeof value === 'string' && !value.trim()) || (Array.isArray(value) && !value.length);
      if (field.required && empty) next[field.name] = t('requiredField');
      else if (!api.demo && isEdit && empty && initial[field.name] && ((kind === 'employees' && field.name === 'work_degrees_id') || (kind === 'products' && ['owner_id', 'description'].includes(field.name)))) next[field.name] = t('clearNotSupported');
      else if (field.type === 'email' && typeof value === 'string' && value && !emailPattern.test(value.trim())) next[field.name] = t('invalidEmail');
      else if (field.type === 'password' && typeof value === 'string' && value && value.length < 8) next[field.name] = t('minPassword');
      else if (field.type === 'datetime-local' && typeof value === 'string' && value && (!isEdit || (kind === 'meetings' ? values.starts_at !== initial.starts_at || values.ends_at !== initial.ends_at : value !== initial[field.name]))) {
        if (!validLocalDateTime(value)) next[field.name] = t('invalidLocalTime');
        else if (ambiguousLocalDateTime(value)) next[field.name] = t('ambiguousLocalTime');
        else if (!api.demo && ambiguousServerDateTime(value)) next[field.name] = t('ambiguousServerTime');
      }
      else if (field.type === 'number' && typeof value === 'string' && value) {
        const number = Number(value);
        if (!Number.isFinite(number) || (field.min != null && number < field.min) || (field.max != null && number > field.max)) next[field.name] = t('invalidNumber');
        else if (['progress', 'quantity'].includes(field.name) && !Number.isInteger(number)) next[field.name] = t('invalidInteger');
      }
    });
    if (kind === 'meetings') {
      const timesChanged = !isEdit || values.starts_at !== initial.starts_at || values.ends_at !== initial.ends_at;
      if (timesChanged && values.starts_at && values.ends_at && String(values.ends_at) <= String(values.starts_at)) next.ends_at = t('invalidDateRange');
      if (!isEdit || attendeesChanged()) {
        const internal = Array.isArray(values.attendee_user_ids) ? values.attendee_user_ids : [];
        if (!internal.length && !guests.length) next.attendee_user_ids = t('attendeeRequired');
        if (internal.length + guests.length > 100) next.attendee_user_ids = t('tooManyAttendees');
        for (const issue of validateGuests(guests)) next[`guest-${issue.field}-${issue.key}`] = t(issue.code);
      }
    }
    if (kind === 'teams' && teamUnitId) {
      if (!teamUnit.data || teamUnit.isError) next.user_ids = t('teamMembersUnavailable');
      else {
        if (!api.demo && !teamUnit.data.can_manage_teams) next.business_unit_id = t('noAccessToAction');
        const allowed = new Set((teamUnit.data.users ?? []).map((user) => String(user.id)));
        const members = Array.isArray(values.user_ids) ? values.user_ids : [];
        if (members.some((member) => !allowed.has(member))) next.user_ids = t('teamMembersHint');
        if (values.lead_id && !allowed.has(String(values.lead_id))) next.lead_id = t('teamMembersHint');
      }
    }
    if (kind === 'plans' && !isEdit && typeof values.week_start === 'string' && values.week_start && new Date(`${values.week_start}T00:00:00`).getDay() !== 0) next.week_start = t('sundayRequired');
    setErrors(next);
    return next;
  };

  const setValue = (name: string, value: Value) => {
    setValues((prev) => {
      const changedUnit = kind === 'teams' && name === 'business_unit_id' && prev[name] !== value;
      return { ...prev, ...(changedUnit ? { lead_id: '', user_ids: [] } : {}), [name]: value };
    });
    setErrors((prev) => { const copy = { ...prev }; delete copy[name]; return copy; });
    setServerError('');
  };

  async function submit(event: FormEvent) {
    event.preventDefault();
    const validation = validate(config.steps && step === 1 ? 1 : undefined);
    if (Object.keys(validation).length) {
      if (config.steps && fields.some((field) => (field.step ?? 1) === 1 && validation[field.name])) setStep(1);
      return;
    }
    if (config.steps && step === 1) { setStep(2); return; }

    const payload: EntityPayload = {};
    fields.forEach((field) => {
      const value = values[field.name];
      if (field.name === 'attendee_user_ids') return;
      // Employee administration only returns a combined name. Avoid rewriting an
      // unchanged inferred split (which may contain multiple given names).
      if (!api.demo && kind === 'employees' && isEdit && ['firstname', 'lastname'].includes(field.name) && value === initial[field.name]) return;
      // Avoid rescheduling a meeting (and sending invitations) when its times
      // were not changed. When one changes, send both in the API timezone.
      if (kind === 'meetings' && isEdit && ['starts_at', 'ends_at'].includes(field.name) && values.starts_at === initial.starts_at && values.ends_at === initial.ends_at) return;
      // Preserve an unchanged event timestamp, including seconds and DST folds.
      if (kind === 'events' && isEdit && field.name === 'event_date' && value === initial.event_date) return;
      if (isEdit && field.type === 'select' && typeof value === 'string' && value && !getOptions(field).some((option) => option.value === value)) return;
      if (value instanceof File) { payload[field.name] = value; return; }
      if (Array.isArray(value)) { payload[field.name] = value.map(Number); return; }
      if (field.name === 'services') { payload[field.name] = String(value ?? '').split(',').map((v) => v.trim()).filter(Boolean); return; }
      if (field.name === 'active' || field.name === 'is_active') { payload[field.name] = value === 'active'; return; }
      if (field.type === 'number') {
        if (value !== '' && value != null) payload[field.name] = Number(value);
        else if (isEdit && kind === 'opportunities' && field.name === 'value') payload[field.name] = null;
        return;
      }
      if (field.name.endsWith('_id')) { payload[field.name] = value ? Number(value) : null; return; }
      if (field.type === 'date' || field.type === 'datetime-local') {
        if (value) payload[field.name] = field.type === 'datetime-local' ? (api.demo ? new Date(value).toISOString() : serverDateTimeValue(value)) : value;
        else if (isEdit) payload[field.name] = null;
        return;
      }
      if (value !== '' && value != null) payload[field.name] = field.type === 'password' ? value : value.trim();
      else if (field.type === 'textarea' || field.type === 'text' || !field.type) payload[field.name] = '';
    });
    if (kind === 'teams' && payload.lead_id && Array.isArray(payload.user_ids)) {
      payload.user_ids = Array.from(new Set([...payload.user_ids as number[], Number(payload.lead_id)]));
    }
    if (kind === 'meetings' && (!isEdit || attendeesChanged())) {
      const internal = Array.isArray(values.attendee_user_ids) ? values.attendee_user_ids.map((userId): MeetingAttendeeInput => ({ user_id: Number(userId) })) : [];
      payload.attendees = [...internal, ...guests.map((guest): MeetingAttendeeInput => ({ external_name: guest.name.trim() || null, external_email: guest.email.trim() || null }))];
    }
    // Published procedures are the only procedures returned by the current Laravel index.
    if (kind === 'procedures' && !isEdit) payload.is_published = true;
    try { await onSave(payload, record?.id); }
    catch (error) {
      const apiError = error as ApiError;
      setServerError(error instanceof Error ? error.message : t('saveError'));
      const body = apiError.payload as { errors?: Record<string, string[]>; data?: Record<string, string[]> } | undefined;
      const serverValidation = body?.errors ?? body?.data;
      if (serverValidation && typeof serverValidation === 'object') {
        const mapped = Object.fromEntries(Object.entries(serverValidation).map(([key, value]) => [key, Array.isArray(value) ? String(value[0]) : String(value)]));
        setErrors(mapped);
        if (config.steps && fields.some((field) => (field.step ?? 1) === 1 && mapped[field.name])) setStep(1);
      }
    }
  }

  const visibleFields = config.steps ? fields.filter((field) => (field.step ?? 1) === step) : fields;
  const title = isEdit ? `${t('edit')} ${t(config.singular).toLocaleLowerCase()}` : t(config.createLabel);
  return <Modal open parentPresence onClose={onClose} title={title} description={config.steps ? (step === 1 ? t('titleDetails') : t('moreDetails')) : t('titleDetails')} size="lg" busy={busy}>
    <form onSubmit={(event) => void submit(event)} className="flex min-h-0 flex-1 flex-col" noValidate>
      <div className="overflow-y-auto px-5 py-4 sm:px-6">
        {config.steps && <div className="mb-4 flex items-center gap-3">
          {[1, 2].map((number) => <div key={number} className="flex flex-1 items-center gap-2"><span className={cn('grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold', step >= number ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-400')}>{step > number ? <Check size={14} /> : number}</span><span className={cn('text-xs font-medium', step >= number ? 'text-slate-700' : 'text-slate-400')}>{number === 1 ? t('basicDetails') : t('additionalDetails')}</span>{number === 1 && <div className="ms-1 h-px flex-1 bg-slate-200" />}</div>)}
        </div>}
        <div className="grid gap-3 sm:grid-cols-2">{visibleFields.map((field) => {
          const fieldId = `${id}-${field.name}`;
          const value = values[field.name] ?? '';
          const disabled = busy || Boolean(isEdit && field.disabledOnEdit);
          const hint = kind === 'teams' && field.name === 'user_ids' && teamUnit.isFetching ? t('loading') : field.hint && (field.hint !== 'demoFileInfo' || api.demo) ? t(field.hint) : field.type === 'multiselect' ? t('selectMultiple') : undefined;
          const describedBy = errors[field.name] ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined;
          const options = getOptions(field);
          // Keep a legacy/inactive selected value visible without resubmitting an
          // invalid value; changing it still sends the new, valid selection.
          if (field.type === 'select' && typeof value === 'string' && value && !options.some((option) => option.value === value)) options.unshift({ value, label: field.source ? `#${value}` : statusLabel(value, t), disabled: true });
          return <div key={field.name} className={field.full ? 'sm:col-span-2' : ''}>
            <FormField htmlFor={fieldId} label={t(field.label)} required={field.required} error={errors[field.name]} hint={hint}>
              {field.type === 'select' || field.type === 'multiselect' ? <select id={fieldId} multiple={field.type === 'multiselect'} value={value instanceof File ? '' : value} disabled={disabled} aria-invalid={Boolean(errors[field.name])} aria-describedby={describedBy} onChange={(event) => setValue(field.name, field.type === 'multiselect' ? Array.from(event.target.selectedOptions).map((option) => option.value) : event.target.value)} className={cn(inputClass, field.type === 'multiselect' ? 'min-h-[100px] py-2' : 'h-10')}>
                {field.type !== 'multiselect' && <option value="">{t('chooseOption')}</option>}
                {options.map((option) => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}
              </select> : field.type === 'textarea' ? <textarea id={fieldId} value={typeof value === 'string' ? value : ''} disabled={disabled} aria-invalid={Boolean(errors[field.name])} aria-describedby={describedBy} onChange={(event) => setValue(field.name, event.target.value)} rows={3} className={cn(inputClass, 'min-h-[84px] resize-y py-2.5')} /> : field.type === 'file' ? <input id={fieldId} type="file" disabled={disabled} aria-invalid={Boolean(errors[field.name])} aria-describedby={describedBy} onChange={(event) => setValue(field.name, event.target.files?.[0] ?? '')} className={cn(inputClass, 'py-2 file:me-3 file:rounded-md file:border-0 file:bg-brand-50 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-brand-700')} /> : <TextInput id={fieldId} type={field.type ?? 'text'} min={field.min} max={field.max} value={typeof value === 'string' ? value : ''} disabled={disabled} aria-invalid={Boolean(errors[field.name])} aria-describedby={describedBy} onChange={(event) => setValue(field.name, event.target.value)} />}
            </FormField>
          </div>;
        })}</div>
        {kind === 'meetings' && <section className="mt-5 space-y-3">
          <div className="flex items-center justify-between gap-3"><h3 className="text-sm font-semibold text-slate-800">{t('externalGuests')}</h3><Button type="button" variant="secondary" size="sm" disabled={busy} onClick={() => setGuests((current) => [...current, { key: `new-${Date.now()}-${Math.random()}`, name: '', email: '' }])}><Plus size={14} />{t('addGuest')}</Button></div>
          {guests.map((guest) => {
            const nameId = `${id}-guest-name-${guest.key}`; const emailId = `${id}-guest-email-${guest.key}`;
            const nameError = errors[`guest-name-${guest.key}`]; const emailError = errors[`guest-email-${guest.key}`];
            const update = (change: Partial<Guest>) => { setGuests((current) => current.map((item) => item.key === guest.key ? { ...item, ...change } : item)); setErrors({}); setServerError(''); };
            return <div key={guest.key} className="grid items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/60 p-3 sm:grid-cols-[1fr_1fr_auto]">
              <FormField htmlFor={nameId} label={t('guestName')} error={nameError}><TextInput id={nameId} value={guest.name} disabled={busy} aria-invalid={Boolean(nameError)} aria-describedby={nameError ? `${nameId}-error` : undefined} onChange={(event) => update({ name: event.target.value })} /></FormField>
              <FormField htmlFor={emailId} label={t('guestEmail')} error={emailError}><TextInput id={emailId} type="email" value={guest.email} disabled={busy} aria-invalid={Boolean(emailError)} aria-describedby={emailError ? `${emailId}-error` : undefined} onChange={(event) => update({ email: event.target.value })} /></FormField>
              <button type="button" disabled={busy} aria-label={`${t('removeGuest')}: ${guest.name || guest.email}`} onClick={() => setGuests((current) => current.filter((item) => item.key !== guest.key))} className="mt-1 rounded-lg p-2 text-slate-400 hover:bg-white hover:text-brand-600 sm:mt-6"><Trash2 size={16} /></button>
            </div>;
          })}
        </section>}
        {serverError && <div role="alert" className="mt-5 rounded-lg border border-pink/40 bg-pink/20 px-3 py-2.5 text-sm text-brand-700">{serverError}</div>}
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-3 sm:px-6">
        <div>{config.steps && step > 1 && <Button type="button" variant="ghost" onClick={() => setStep(1)} disabled={busy}>{dir === 'rtl' ? <ArrowRight size={15} /> : <ArrowLeft size={15} />}{t('back')}</Button>}</div>
        <div className="flex gap-2"><Button type="button" variant="secondary" onClick={onClose} disabled={busy}>{t('cancel')}</Button><Button type="submit" disabled={busy || (kind === 'teams' && Boolean(teamUnitId) && teamUnit.isFetching)}>{busy ? (isEdit ? t('saving') : t('creating')) : config.steps && step === 1 ? <>{t('continue')}{dir === 'rtl' ? <ArrowLeft size={15} /> : <ArrowRight size={15} />}</> : isEdit ? t('saveChanges') : t('create')}</Button></div>
      </div>
    </form>
  </Modal>;
}
