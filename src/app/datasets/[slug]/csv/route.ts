import { DATASETS, getDataset, datasetToCsv } from "@/lib/datasets";

/**
 * Per-dataset CSV export (statically generated from the real graph).
 * Served at /datasets/[slug]/csv.
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
  return new Response(datasetToCsv(dataset), {
    headers: { "Content-Type": "text/csv; charset=utf-8" },
  });
}
