import type { ReactNode } from "react";

export function CallToAction({
  title,
  description,
  actions,
  className = "",
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <section className={`scientific-card p-8 sm:p-10 ${className}`}>
      <h2 className="font-display text-3xl font-bold leading-tight text-white">{title}</h2>
      {description && <p className="mt-4 max-w-2xl leading-relaxed text-muted">{description}</p>}
      {actions && <div className="mt-7 flex flex-wrap gap-3">{actions}</div>}
    </section>
  );
}
