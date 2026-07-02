import { apiResponse } from "@/platform/open-data";
import { imagesEngine } from "@/platform/data-engine/images-engine";

/**
 * GET /api/v0/images — catalogue of verified scientific images.
 * Dynamic (reads limit). Image files retain their own upstream license.
 */
export async function GET(req: Request): Promise<Response> {
  const raw = Number(new URL(req.url).searchParams.get("limit"));
  const limit = Number.isFinite(raw) && raw > 0 ? Math.min(Math.floor(raw), 200) : 50;
  const all = imagesEngine.all().slice().sort((a, b) => a.slug.localeCompare(b.slug));
  const items = all.slice(0, limit).map((i) => ({
    id: i.slug,
    title: i.title,
    objectName: i.objectName,
    imageType: i.imageType,
    source: i.sourceSlug,
    license: i.licenseSlug,
    publicationYear: i.publicationYear,
    path: `/images/${i.slug}`,
  }));
  return apiResponse(
    { total: all.length, count: items.length, items },
    {
      provenance: "Image-catalogue metadata via the images engine. Catalogue metadata is CC BY-SA 4.0; each image file keeps its upstream (NASA/ESA/ESO) license — verify per item.",
      count: items.length,
    },
  );
}
