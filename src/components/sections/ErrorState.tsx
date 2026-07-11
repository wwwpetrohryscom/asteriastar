import type { ReactNode } from "react";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function ErrorState({
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
      <StatusBadge tone="warning-red">Attention</StatusBadge>
      <h2 className="mt-5 font-display text-2xl font-bold text-white">{title}</h2>
      {description && <p className="mx-auto mt-3 max-w-xl leading-relaxed text-muted">{description}</p>}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}
