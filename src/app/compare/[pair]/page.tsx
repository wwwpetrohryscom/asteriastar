import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { SourceList } from "@/components/ui/SourceList";
import { EntityCard } from "@/components/graph/EntityCard";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  COMPARISONS,
  getComparison,
  resolveSide,
  getSharedConnections,
  getComparisonSources,
  type ResolvedSide,
} from "@/lib/compare";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, comparePath } from "@/lib/routes";

export const dynamicParams = false;

export function generateStaticParams() {
  return COMPARISONS.map((c) => ({ pair: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/compare/[pair]">): Promise<Metadata> {
  const { pair } = await params;
  const c = getComparison(pair);
  if (!c) return {};
  return buildMetadata({ title: c.title, description: c.description, path: comparePath(c.slug) });
}

function SidePanel({ side }: { side: ResolvedSide }) {
  return (
    <div className="scientific-card p-6">
      <Badge tone="accent">{side.kindLabel}</Badge>
      <h2 className="mt-3 font-display text-2xl font-bold text-fg">
        {side.href ? (
          <Link href={side.href} className="transition hover:text-nasa">
            {side.name}
          </Link>
        ) : (
          side.name
        )}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{side.description}</p>
      {side.facts.length > 0 && (
        <dl className="mt-4 divide-y divide-white/5">
          {side.facts.map((f) => (
            <div key={f.label} className="flex justify-between gap-4 py-2">
              <dt className="text-sm text-faint">{f.label}</dt>
              <dd className="text-right text-sm font-medium text-fg">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

export default async function ComparePage({ params }: PageProps<"/compare/[pair]">) {
  const { pair } = await params;
  const comparison = getComparison(pair);
  if (!comparison) notFound();

  const left = resolveSide(comparison.left);
  const right = resolveSide(comparison.right);
  if (!left || !right) notFound();

  const url = comparePath(comparison.slug);
  const shared = getSharedConnections(left, right);
  const sources = getComparisonSources(left, right);

  const recs = [
    ...(left.entityId ? engine.recommendation.for(left.entityId, 3) : []),
    ...(right.entityId ? engine.recommendation.for(right.entityId, 3) : []),
  ];
  const seen = new Set([left.entityId, right.entityId]);
  const related = recs
    .map((r) => r.entity)
    .filter((e) => !seen.has(e.id))
    .filter((e, i, arr) => arr.findIndex((x) => x.id === e.id) === i)
    .slice(0, 6);

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Compare", url: ROUTES.compare },
    { name: comparison.title, url },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          collectionPageSchema({ name: comparison.title, description: comparison.description, url }),
        ]}
      />
      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>
      <HeroSection
        compact
        accent="nebula"
        eyebrow={<span>Comparison</span>}
        title={comparison.title}
        lead={comparison.description}
      />

      <Container className="mt-8 mb-12 space-y-12">
        <div className="grid gap-4 md:grid-cols-2">
          <SidePanel side={left} />
          <SidePanel side={right} />
        </div>

        {shared.length > 0 && (
          <section aria-labelledby="shared-heading">
            <h2 id="shared-heading" className="font-display text-xl font-semibold text-fg">
              Shared characteristics
            </h2>
            <p className="mt-1 text-sm text-faint">
              Connections both {left.name} and {right.name} share in the knowledge graph.
            </p>
            <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {shared.map((e) => (
                <li key={e.id} className="contents">
                  <EntityCard entity={e} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {related.length > 0 && (
          <section aria-labelledby="related-heading">
            <h2 id="related-heading" className="font-display text-xl font-semibold text-fg">
              Related entities
            </h2>
            <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((e) => (
                <li key={e.id} className="contents">
                  <EntityCard entity={e} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {sources.length > 0 && <SourceList keys={sources} />}
      </Container>
    </>
  );
}
