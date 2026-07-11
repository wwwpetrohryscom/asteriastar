import type { ReactNode } from "react";
import { StatusBadge, type StatusTone } from "@/components/ui/StatusBadge";

export function ToolPanel({
  title,
  description,
  status,
  statusTone = "neutral",
  children,
  className = "",
}: {
  title: ReactNode;
  description?: ReactNode;
  status?: ReactNode;
  statusTone?: StatusTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`scientific-card p-5 sm:p-6 ${className}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">{title}</h2>
          {description && <p className="mt-2 max-w-2xl leading-relaxed text-muted">{description}</p>}
        </div>
        {status && <StatusBadge tone={statusTone}>{status}</StatusBadge>}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}
