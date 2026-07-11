import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  ENTITY_TYPES,
  ENTITY_TYPE_LABELS,
  RELATION_TYPES,
  RELATION_LABELS,
  DOMAINS,
  CONFIDENCES,
  GRAPH_VERSION_INFO,
  getEntityTypeCounts,
} from "@/knowledge-graph";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES } from "@/lib/routes";

const DESCRIPTION =
  "The Asteria Star knowledge registry — the schema, stable identifiers, relationship types, and entity/dataset registries that define how the platform is structured.";

export const metadata: Metadata = buildMetadata({ title: "Knowledge Registry", description: DESCRIPTION, path: ROUTES.registry });

export default function RegistryPage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Registry", url: ROUTES.registry },
  ];
  const counts = new Map(getEntityTypeCounts().map((c) => [c.type, c.count]));
  const v = GRAPH_VERSION_INFO;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          collectionPageSchema({ name: "Knowledge Registry", description: DESCRIPTION, url: ROUTES.registry }),
        ]}
      />
      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>
      <HeroSection
        compact
        accent="stone"
        eyebrow={<span>Schema v{v.schemaVersion}</span>}
        title="Knowledge registry"
        lead="How Asteria Star is structured: the schema, the stable identifier scheme, the relationship vocabulary, and the entity and dataset registries."
      />

      <Container className="mt-10 mb-12 space-y-12">
        <section aria-labelledby="registries-heading">
          <h2 id="registries-heading" className="font-display text-2xl font-bold">Registries</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: ROUTES.entityIndex, title: "Entity registry", desc: `${v.entityCount} entities, A–Z` },
              { href: ROUTES.datasets, title: "Dataset registry", desc: "Open datasets & exports" },
              { href: ROUTES.developers, title: "API contracts", desc: "Versioned, typed" },
              { href: ROUTES.openData, title: "Open data", desc: "Standards & access" },
            ].map((c) => (
              <Link key={c.href} href={c.href} className="scientific-card p-5 transition hover:border-white/25 hover:bg-white/[0.04]">
                <h3 className="font-display text-base font-semibold text-fg">{c.title}</h3>
                <p className="mt-1 text-sm text-muted">{c.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="identifiers-heading">
          <h2 id="identifiers-heading" className="font-display text-2xl font-bold">Identifier registry</h2>
          <p className="mt-2 max-w-2xl text-muted">
            Every entity has a permanent global identifier of the form{" "}
            <code className="text-fg">type:slug</code>. Identifiers are public,
            stable, and never changed or recycled.
          </p>
          <ul className="mt-4 grid grid-cols-1 gap-2 font-mono text-sm text-muted sm:grid-cols-2 lg:grid-cols-3">
            {["star:sirius", "planet:mars", "moon:europa", "galaxy:andromeda-galaxy", "nebula:orion-nebula", "black_hole:sagittarius-a-star", "space_mission:apollo-11", "space_telescope:james-webb-space-telescope", "organization:nasa", "astronomer:galileo-galilei"].map((id) => (
              <li key={id} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">{id}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="schema-heading">
          <h2 id="schema-heading" className="font-display text-2xl font-bold">Schema registry</h2>
          <p className="mt-2 text-muted">
            Entity domains: {DOMAINS.join(", ")}. Relation confidence: {CONFIDENCES.join(", ")}.
          </p>

          <h3 className="mt-6 font-display text-lg font-semibold text-fg">Entity types ({ENTITY_TYPES.length})</h3>
          <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm sm:grid-cols-3 lg:grid-cols-4">
            {ENTITY_TYPES.map((t) => (
              <li key={t} className="flex items-baseline justify-between gap-2 text-muted">
                <span>{ENTITY_TYPE_LABELS[t]}</span>
                <span className="text-xs text-faint">{counts.get(t) ?? 0}</span>
              </li>
            ))}
          </ul>

          <h3 className="mt-6 font-display text-lg font-semibold text-fg">Relationship types ({RELATION_TYPES.length})</h3>
          <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-muted sm:grid-cols-3 lg:grid-cols-4">
            {RELATION_TYPES.map((t) => (
              <li key={t}>
                <span className="font-mono text-xs text-faint">{t}</span> — {RELATION_LABELS[t]}
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </>
  );
}
