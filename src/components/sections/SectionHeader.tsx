import type { ReactNode } from "react";

export function SectionHeader({
  eyebrow,
  title,
  lead,
  actions,
  className = "",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-8 flex flex-col gap-5 sm:mb-10 lg:flex-row lg:items-end lg:justify-between ${className}`}>
      <div className="max-w-3xl">
        {eyebrow && (
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-nasa">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
          {title}
        </h2>
        {lead && <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{lead}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
}
