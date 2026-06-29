import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { DATASETS } from "@/lib/datasets";
import { GRAPH_VERSION_INFO } from "@/knowledge-graph";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, datasetPath } from "@/lib/routes";

const DESCRIPTION =
  "Open, machine-readable datasets generated from the Asteria Star knowledge graph — stars, planets, galaxies, missions, telescopes, and more, free to reuse.";

export const metadata: Metadata = buildMetadata({ title: "Datasets", description: DESCRIPTION, path: ROUTES.datasets });

export default function DatasetsPage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Datasets", url: ROUTES.datasets },
  ];
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          collectionPageSchema({ name: "Datasets", description: DESCRIPTION, url: ROUTES.datasets }),
        ]}
      />
      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>
      <HeroSection
        compact
        accent="stone"
        eyebrow={<span>Open data · dataset v{GRAPH_VERSION_INFO.datasetVersion}</span>}
        title="Datasets"
        lead="Every dataset is a view over the canonical knowledge graph — generated from real, typed entities, openly licensed, and machine-readable."
      />
      <Container className="mt-8 mb-12">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DATASETS.map((d) => (
            <li key={d.slug}>
              <Link
                href={datasetPath(d.slug)}
                className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.04]"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="font-display text-lg font-semibold text-fg group-hover:text-nebula">{d.title}</h2>
                  <span className="text-xs text-faint">{d.entityCount}</span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{d.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
