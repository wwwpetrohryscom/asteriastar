import { CATALOGUE, EXPORT_MANIFEST } from "@/platform/open-data/catalogue";
import { LICENSES } from "@/platform/open-data/licenses";
import { ENDPOINTS, IMPLEMENTED_ENDPOINTS, PLANNED_ENDPOINTS } from "@/platform/open-data/endpoints";
import { buildOpenApiSpec } from "@/platform/open-data/openapi";
import { apiMeta } from "@/platform/open-data/api";
import { GRAPH_STATS } from "@/knowledge-graph";
import { SOURCES } from "@/lib/sources";
import { CITATIONS } from "@/lib/citations";
import { imagesEngine } from "@/platform/data-engine/images-engine";
import { liveSkyEngine } from "@/platform/data-engine/live-sky-engine";

/**
 * Open-data self-validation. Pure — returns an issue list, never throws.
 *
 * Enforces the anti-fabrication and read-only invariants of Program L:
 *  - every dataset declares a real license and honest status
 *  - every "available" download is backed by a real, checksummed manifest entry
 *    (no fabricated sha256 / bytes; no checksum without a file)
 *  - meta-dataset record counts match the live engine counts
 *  - the endpoint registry is internally consistent and read-only (GET only)
 *  - the OpenAPI spec contains implemented endpoints only (no planned leakage)
 *  - the response envelope always carries its required provenance fields
 */
export function validateOpenData(): string[] {
  const issues: string[] = [];
  const HEX64 = /^[0-9a-f]{64}$/;

  /* ---- catalogue: licenses, status, checksums ---- */
  const seen = new Set<string>();
  for (const d of CATALOGUE) {
    if (seen.has(d.id)) issues.push(`catalogue: duplicate dataset id ${d.id}`);
    seen.add(d.id);
    if (!LICENSES[d.license]) issues.push(`catalogue: dataset ${d.id} has unknown license ${d.license}`);
    if (!d.attribution) issues.push(`catalogue: dataset ${d.id} is missing attribution`);
    if (d.formats.length === 0) issues.push(`catalogue: dataset ${d.id} declares no formats`);
    for (const f of d.formats) {
      // A checksum may only appear on an available download backed by the manifest.
      if (f.sha256) {
        if (f.status !== "available") issues.push(`catalogue: dataset ${d.id} shows a checksum on a non-available format`);
        if (!HEX64.test(f.sha256)) issues.push(`catalogue: dataset ${d.id} has a non-sha256 checksum`);
        const backed = Object.values(EXPORT_MANIFEST.exports).some((m) => m.sha256 === f.sha256 && m.file === f.href);
        if (!backed) issues.push(`catalogue: dataset ${d.id} checksum is not backed by a real manifest file (possible fabrication)`);
      }
      if (f.status === "available" && !f.href) issues.push(`catalogue: dataset ${d.id} marks a format available without a href`);
    }
    // A "stable" meta dataset must report a positive record count.
    if (d.status === "stable" && (d.recordCount == null || d.recordCount < 0)) {
      issues.push(`catalogue: stable dataset ${d.id} has an invalid recordCount`);
    }
  }

  /* ---- meta-dataset counts match the live engine ---- */
  const expect = (id: string, actual: number) => {
    const entry = CATALOGUE.find((c) => c.id === id);
    if (entry && entry.recordCount !== actual) issues.push(`catalogue: ${id} recordCount ${entry.recordCount} != live ${actual}`);
  };
  expect("knowledge-graph-entities", GRAPH_STATS.entityCount);
  expect("knowledge-graph-relationships", GRAPH_STATS.relationCount);
  expect("source-registry", Object.keys(SOURCES).length);
  expect("scientific-images", imagesEngine.count);
  expect("live-sky-providers", liveSkyEngine.providers().length);
  expect("citation-registry", CITATIONS.length);

  /* ---- export manifest integrity ---- */
  for (const [id, m] of Object.entries(EXPORT_MANIFEST.exports)) {
    if (!HEX64.test(m.sha256)) issues.push(`manifest: export ${id} has an invalid sha256`);
    if (!(m.bytes > 0)) issues.push(`manifest: export ${id} has non-positive bytes`);
    if (m.recordCount < 0) issues.push(`manifest: export ${id} has a negative recordCount`);
    if (!m.file.startsWith("/exports/")) issues.push(`manifest: export ${id} has an unexpected file path`);
  }

  /* ---- endpoint registry: consistency + read-only ---- */
  const ids = new Set<string>();
  for (const e of ENDPOINTS) {
    if (ids.has(e.id)) issues.push(`endpoints: duplicate id ${e.id}`);
    ids.add(e.id);
    if (e.method !== "GET") issues.push(`endpoints: ${e.id} is not read-only (method ${e.method})`);
    if (/internal|admin|private/i.test(e.path)) issues.push(`endpoints: ${e.id} exposes a non-public path`);
    for (const p of e.params) {
      if (p.in === "path" && !e.path.includes(`{${p.name}}`)) issues.push(`endpoints: ${e.id} path param ${p.name} not present in path`);
    }
  }
  const implPaths = new Set(IMPLEMENTED_ENDPOINTS.map((e) => e.path));

  /* ---- OpenAPI: implemented only ---- */
  const spec = buildOpenApiSpec();
  const specPaths = Object.keys(spec.paths);
  for (const p of specPaths) {
    if (!implPaths.has(p)) issues.push(`openapi: spec path ${p} is not an implemented endpoint`);
  }
  for (const e of PLANNED_ENDPOINTS) {
    if (specPaths.includes(e.path)) issues.push(`openapi: planned endpoint ${e.path} leaked into the spec`);
  }
  if (specPaths.length !== implPaths.size) {
    issues.push(`openapi: spec has ${specPaths.length} paths but ${implPaths.size} endpoints are implemented`);
  }

  /* ---- envelope: required provenance fields present ---- */
  const meta = apiMeta({ provenance: "self-check" });
  for (const key of ["apiVersion", "schemaVersion", "dataVersion", "generatedAt", "source", "license", "attribution", "provenance"] as const) {
    if (!meta[key]) issues.push(`envelope: apiMeta is missing required field ${key}`);
  }

  return issues;
}
