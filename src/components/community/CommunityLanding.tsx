import type { ReactNode } from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";

/**
 * Shared layout for community landing pages. Every page carries an honest
 * "architecture preview" notice: no accounts, profiles, posts, or data exist —
 * these pages explain the future, knowledge-first ecosystem.
 */
export function CommunityLanding({
  title,
  lead,
  path,
  description,
  crumbs,
  children,
}: {
  title: string;
  lead: string;
  path: string;
  description: string;
  crumbs: Crumb[];
  children: ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          collectionPageSchema({ name: title, description, url: path }),
        ]}
      />
      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>
      <HeroSection
        compact
        accent="comet"
        eyebrow={<span>Community · Architecture preview</span>}
        title={title}
        lead={lead}
      />
      <Container className="mt-6">
        <aside className="flex gap-3 scientific-card p-4">
          <span aria-hidden className="mt-0.5 text-muted">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
              <path d="M12 8h.01M11 11h1v5h1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <p className="text-sm leading-relaxed text-muted">
            <strong className="text-fg">Architecture preview.</strong> Asteria Star&apos;s
            community is being designed <em>knowledge-first</em>. There are no
            accounts, profiles, posts, feeds, or user data yet — this page
            explains the future ecosystem and the models it will build on.
          </p>
        </aside>
      </Container>
      <Container className="mt-10 mb-12 space-y-12">{children}</Container>
    </>
  );
}

/** A simple grid of explanatory feature cards (title + description). */
export function FeatureGrid({
  items,
  columns = 3,
}: {
  items: { title: string; description: string }[];
  columns?: 2 | 3 | 4;
}) {
  const cols = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[columns];
  return (
    <ul className={`grid grid-cols-1 gap-4 ${cols}`}>
      {items.map((item) => (
        <li key={item.title} className="scientific-card p-5">
          <h3 className="font-display text-base font-semibold text-fg">{item.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.description}</p>
        </li>
      ))}
    </ul>
  );
}
