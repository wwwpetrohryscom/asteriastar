import type { ReactNode } from "react";

export function EditorialProse({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`prose-cosmos max-w-3xl ${className}`}>{children}</div>;
}
