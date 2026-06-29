import type { ReactNode } from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleSchema, breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";

/**
 * Shared layout for long-form editorial pages (about, policies). Emits
 * BreadcrumbList + Article JSON-LD and wraps the body in prose styling.
 */
export function EditorialPage({
  title,
  lead,
  path,
  description,
  updated,
  children,
}: {
  title: string;
  lead: string;
  path: string;
  description: string;
  /** ISO date (YYYY-MM-DD) the page was last reviewed. */
  updated: string;
  children: ReactNode;
}) {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: title, url: path },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          articleSchema({
            headline: title,
            description,
            url: path,
            dateModified: updated,
          }),
        ]}
      />

      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>

      <HeroSection compact accent="stone" title={title} lead={lead} />

      <Container size="narrow" className="mt-8">
        <div className="prose-cosmos">{children}</div>
        <p className="mt-12 border-t border-white/10 pt-6 text-sm text-faint">
          Last reviewed {updated}.
        </p>
      </Container>
    </>
  );
}
