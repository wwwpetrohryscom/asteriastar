import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

export function PageShell({
  children,
  className = "",
  containerClassName = "",
  size = "default",
  as = "main",
}: {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  size?: "default" | "narrow";
  as?: "main" | "section" | "div";
}) {
  const body = (
    <Container size={size} className={containerClassName}>
      {children}
    </Container>
  );

  if (as === "section") {
    return <section className={`bg-black py-14 sm:py-20 ${className}`}>{body}</section>;
  }

  if (as === "div") {
    return <div className={`bg-black py-14 sm:py-20 ${className}`}>{body}</div>;
  }

  return <main className={`bg-black py-14 sm:py-20 ${className}`}>{body}</main>;
}
