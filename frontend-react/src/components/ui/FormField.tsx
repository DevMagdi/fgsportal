import { type InputHTMLAttributes, type ReactNode, useId } from 'react';
import { cn } from '../../lib/utils';

export const inputClass = 'w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 disabled:bg-slate-50 disabled:text-slate-400';

export function FormField({ label, required, error, hint, children, htmlFor }: { label: string; required?: boolean; error?: string; hint?: string; children: ReactNode; htmlFor: string }) {
  return <div className="min-w-0">
    <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-semibold text-slate-700">{label}{required && <span className="ms-1 text-rose-500" aria-hidden="true">*</span>}</label>
    {children}
    {error ? <p id={`${htmlFor}-error`} className="mt-1.5 text-xs text-rose-600" role="alert">{error}</p> : hint ? <p id={`${htmlFor}-hint`} className="mt-1.5 text-xs leading-5 text-slate-400">{hint}</p> : null}
  </div>;
}

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(inputClass, 'h-10', className)} {...props} />;
}
