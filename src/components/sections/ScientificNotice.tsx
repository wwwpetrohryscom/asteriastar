import type { ReactNode } from "react";
import { StatusBadge, type StatusTone } from "@/components/ui/StatusBadge";

export function ScientificNotice({
  title,
  children,
  tone = "editorial-red",
  label = "Notice",
  className = "",
}: {
  title: ReactNode;
  children?: ReactNode;
  tone?: StatusTone;
  label?: ReactNode;
  className?: string;
}) {
  return (
    <aside className={`scientific-card p-5 sm:p-6 ${className}`}>
      <StatusBadge tone={tone}>{label}</StatusBadge>
      <h3 className="mt-4 font-display text-xl font-semibold text-white">{title}</h3>
      {children && <div className="prose-cosmos mt-3 text-sm">{children}</div>}
    </aside>
  );
}
