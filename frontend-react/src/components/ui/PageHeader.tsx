export function PageHeader({ eyebrow, title, subtitle, actions }: { eyebrow?: string; title: string; subtitle?: string; actions?: React.ReactNode }) {
  return <div className="flex flex-wrap items-start justify-between gap-4">
    <div>
      {eyebrow && <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-600">{eyebrow}</p>}
      <h1 className="text-[26px] font-semibold leading-tight tracking-[-0.035em] text-slate-900 sm:text-[30px]">{title}</h1>
      {subtitle && <p className="mt-2 max-w-2xl text-[13px] leading-5 text-slate-500">{subtitle}</p>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </div>;
}
