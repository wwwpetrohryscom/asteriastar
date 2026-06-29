import { DATASETS, getDataset, datasetRows } from "@/lib/datasets";

/**
 * Per-dataset JSON export (statically generated from the real graph).
 * Served at /datasets/[slug]/json.
 */
export const dynamic = "force-static";

export function generateStaticParams() {
  return DATASETS.map((d) => ({ slug: d.slug }));
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<Response> {
  const { slug } = await params;
  const dataset = getDataset(slug);
  if (!dataset) return new Response("Not found", { status: 404 });
  return Response.json({
    dataset: {
      slug: dataset.slug,
      title: dataset.title,
      description: dataset.description,
      version: dataset.version,
      lastGenerated: dataset.lastGenerated,
      license: dataset.license,
      entityCount: dataset.entityCount,
      sources: dataset.sources,
    },
    entities: datasetRows(dataset),
  });
}
