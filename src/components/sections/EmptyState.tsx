import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
  className = "",
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`scientific-card p-8 text-center ${className}`}>
      <div className="mx-auto h-10 w-10 rounded-full border border-white/20 bg-white/[0.045]" aria-hidden />
      <h2 className="mt-5 font-display text-2xl font-bold text-white">{title}</h2>
      {description && <p className="mx-auto mt-3 max-w-xl leading-relaxed text-muted">{description}</p>}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}
