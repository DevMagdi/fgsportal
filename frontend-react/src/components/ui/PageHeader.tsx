export function PageHeader({ eyebrow, title, subtitle, actions }: { eyebrow?: string; title: string; subtitle?: string; actions?: React.ReactNode }) {
  return <div className="flex flex-wrap items-start justify-between gap-3">
    <div className="min-w-0">
      {eyebrow && <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">{eyebrow}</p>}
      <h1 className="text-[24px] font-semibold leading-tight tracking-[-0.03em] text-brand-600 sm:text-[26px]">{title}</h1>
      {subtitle && <p className="mt-1 max-w-2xl text-[13px] leading-5 text-slate-500">{subtitle}</p>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </div>;
}
