import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SourceList } from "@/components/ui/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { DATASETS, getDataset, getDatasetEntities } from "@/lib/datasets";
import { ENTITY_TYPE_LABELS, entityGraphPath } from "@/knowledge-graph";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, datasetPath } from "@/lib/routes";
import { citationsForDataset } from "@/lib/citations";
import { CitationList } from "@/components/authority/CitationList";
import Link from "next/link";

export const dynamicParams = false;

export function generateStaticParams() {
  return DATASETS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/datasets/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getDataset(slug);
  if (!d) return {};
  return buildMetadata({ title: `${d.title} Dataset`, description: d.description, path: datasetPath(d.slug) });
}

export default async function DatasetPage({ params }: PageProps<"/datasets/[slug]">) {
  const { slug } = await params;
  const dataset = getDataset(slug);
  if (!dataset) notFound();

  const entities = getDatasetEntities(dataset);
  const sample = entities.slice(0, 24);
  const url = datasetPath(dataset.slug);

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Datasets", url: ROUTES.datasets },
    { name: dataset.title, url },
  ];

  const meta: { label: string; value: React.ReactNode }[] = [
    { label: "Version", value: dataset.version },
    { label: "Entities", value: dataset.entityCount.toLocaleString() },
    { label: "Last generated", value: dataset.lastGenerated },
    { label: "License", value: dataset.license },
    { label: "Checksum", value: <span className="text-faint">{dataset.checksum} (published at release)</span> },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          collectionPageSchema({ name: `${dataset.title} Dataset`, description: dataset.description, url }),
        ]}
      />
      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>
      <HeroSection
        compact
        accent="stone"
        eyebrow={<span>Dataset</span>}
        title={`${dataset.title} Dataset`}
        lead={dataset.description}
      />

      <Container className="mt-8 mb-12 space-y-10">
        <section aria-labelledby="download-heading" className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 id="download-heading" className="font-display text-xl font-semibold text-fg">Download</h2>
            <p className="mt-1 text-sm text-faint">
              Generated from the canonical knowledge graph. Open, machine-readable, and free to reuse under {dataset.license}.
            </p>
            <ul className="mt-4 flex flex-wrap gap-3">
              {dataset.formats.map((f) => (
                <li key={f.format}>
                  {f.status === "available" && f.href ? (
                    <a
                      href={f.href}
                      aria-label={`Download ${dataset.title} as ${f.format}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-4 py-2 text-sm font-medium text-fg transition hover:border-white/30 hover:bg-white/[0.06]"
                    >
                      {f.format} <span aria-hidden className="text-faint">↓</span>
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-faint">
                      {f.format} <span className="text-xs">(planned)</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <dl className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            {meta.map((m) => (
              <div key={m.label} className="flex justify-between gap-4 border-b border-white/5 py-2 text-sm last:border-0">
                <dt className="text-faint">{m.label}</dt>
                <dd className="text-right font-medium text-fg">{m.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="sample-heading">
          <h2 id="sample-heading" className="font-display text-xl font-semibold text-fg">
            Sample ({sample.length} of {dataset.entityCount})
          </h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.03] text-faint">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Name</th>
                  <th className="px-4 py-2.5 font-medium">Type</th>
                  <th className="hidden px-4 py-2.5 font-mono text-xs font-medium sm:table-cell">ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sample.map((e) => (
                  <tr key={e.id} className="transition hover:bg-white/[0.02]">
                    <td className="px-4 py-2.5">
                      <Link href={entityGraphPath(e)} className="font-medium text-fg transition hover:text-nebula">
                        {e.name}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5 text-muted">{ENTITY_TYPE_LABELS[e.type]}</td>
                    <td className="hidden px-4 py-2.5 font-mono text-xs text-faint sm:table-cell">{e.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {(() => {
          const citations = citationsForDataset(dataset.slug);
          return citations.length > 0 ? (
            <section aria-labelledby="dataset-citations" className="mt-10">
              <h2 id="dataset-citations" className="font-display text-xl font-bold">Scientific citations</h2>
              <p className="mt-1 text-sm text-muted">Real, source-backed references for this dataset — formatted through the citation engine.</p>
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <CitationList citations={citations} />
              </div>
            </section>
          ) : null;
        })()}

        <SourceList keys={dataset.sources} title="Source references" />
      </Container>
    </>
  );
}
