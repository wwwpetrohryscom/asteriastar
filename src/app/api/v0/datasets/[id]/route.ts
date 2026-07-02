import { CATALOGUE, getCatalogueEntry, apiResponse, apiError, LICENSES } from "@/platform/open-data";

/**
 * GET /api/v0/datasets/[id] — metadata for one dataset, including real
 * (manifest-backed) download size and sha256 where a file exists.
 */
export const dynamic = "force-static";

export function generateStaticParams() {
  return CATALOGUE.map((d) => ({ id: d.id }));
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;
  const entry = getCatalogueEntry(decodeURIComponent(id));
  if (!entry) return apiError(404, `No dataset with id '${decodeURIComponent(id)}'.`);
  return apiResponse(entry, {
    provenance: "Dataset registry entry. Checksums and byte sizes (when present) are read from the export manifest and computed from the real generated file.",
    license: LICENSES[entry.license]?.name ?? entry.license,
  });
}
