import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

interface CTAAction {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
}

/** A closing call-to-action band with a quiet editorial surface. */
export function CTASection({
  title,
  description,
  actions = [],
  children,
}: {
  title: string;
  description?: string;
  actions?: CTAAction[];
  children?: ReactNode;
}) {
  return (
    <Container className="my-20">
      <div className="scientific-card px-6 py-12 text-center sm:px-12 sm:py-16">
        <div className="relative">
          <h2 className="mx-auto max-w-2xl font-display text-2xl font-bold sm:text-3xl">
            {title}
          </h2>
          {description && (
            <p className="mx-auto mt-3 max-w-xl text-muted">{description}</p>
          )}
          {actions.length > 0 && (
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {actions.map((action) => (
                <Button key={action.href} href={action.href} variant={action.variant}>
                  {action.label}
                </Button>
              ))}
            </div>
          )}
          {children}
        </div>
      </div>
    </Container>
  );
}
