import { getEntity, apiResponse, apiError } from "@/platform/open-data";
import { provenanceForEntity } from "@/lib/provenance/registry";

/**
 * GET /api/v0/entities/[id]/provenance — the full field-level provenance for one
 * entity: every source-traced ScientificValue (value · unit · uncertainty · status ·
 * source · dataset/table/column/row · epoch · bibcode · method · retrievedAt).
 * This is the queryable surface the field-provenance Open Data export points to.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;
  const entityId = decodeURIComponent(id);
  const entity = getEntity(entityId);
  if (!entity) return apiError(404, `No entity with id '${entityId}'.`);
  const values = provenanceForEntity(entityId).map((e) => ({ field: e.field, domain: e.domain, ...e.value }));
  return apiResponse(
    { entityId, provenanceSchemaVersion: "1.0.0", count: values.length, values },
    { provenance: "Each value is a ScientificValue transcribed from the named authoritative source; status is never upgraded, and a field with no reliable value is absent." },
  );
}
