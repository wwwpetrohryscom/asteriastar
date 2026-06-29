import type { ReactNode } from "react";

/** Consistent page width + horizontal padding. */
export function Container({
  children,
  className = "",
  size = "default",
}: {
  children: ReactNode;
  className?: string;
  size?: "default" | "narrow";
}) {
  const max = size === "narrow" ? "max-w-3xl" : "max-w-7xl";
  return (
    <div className={`mx-auto w-full ${max} px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}
