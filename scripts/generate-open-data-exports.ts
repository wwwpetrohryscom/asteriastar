/**
 * Generate the small, truthful open-data export files (run with
 * `npm run exports:generate`).
 *
 * These are the ONLY pre-generated downloadable files: a compact entity index,
 * a relationship index, the dataset catalogue, the source registry, the image
 * catalogue, and the live-sky provider registry. Every file is derived from the
 * real graph/engine, serialized deterministically (stable order, fixed
 * generatedAt = graph release date), and its sha256 is computed from the exact
 * bytes written. Checksums are never fabricated. Larger data is served through
 * the API and the graph.json/graph.jsonld exports, not pre-generated here.
 */
import { createHash } from "node:crypto";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

import { entities, relations, entityGraphPath } from "../src/knowledge-graph";
import { GRAPH_VERSION_INFO } from "../src/knowledge-graph/version";
import { SOURCES } from "../src/lib/sources";
import { imagesEngine } from "../src/platform/data-engine/images-engine";
import { liveSkyEngine } from "../src/platform/data-engine/live-sky-engine";
import { DATASETS } from "../src/lib/datasets";
import { DATA_GENERATED_AT } from "../src/platform/open-data/api";
import { collectProvenance, provenanceStats } from "../src/lib/provenance/registry";

const PUBLIC_DIR = join(process.cwd(), "public", "exports");
const MANIFEST_TS = join(process.cwd(), "src", "platform", "open-data", "export-manifest.json");

const baseMeta = {
  generatedAt: DATA_GENERATED_AT,
  dataVersion: GRAPH_VERSION_INFO.graphVersion,
  schemaVersion: GRAPH_VERSION_INFO.schemaVersion,
  source: "Asteria Star — Scientific Data Engine & Knowledge Graph",
};

interface ExportSpec {
  id: string;
  file: string;
  license: string;
  build: () => { records: unknown[]; body: unknown };
}

const byId = <T extends { id: string }>(a: T, b: T) => a.id.localeCompare(b.id);

const SPECS: ExportSpec[] = [
  {
    id: "entities-index",
    file: "entities-index.json",
    license: "cc-by-sa-4.0",
    build: () => {
      const records = entities
        .map((e) => ({ id: e.id, type: e.type, name: e.name, domain: e.domain, path: entityGraphPath(e) }))
        .sort(byId);
      return { records, body: { ...baseMeta, license: "cc-by-sa-4.0", count: records.length, entities: records } };
    },
  },
  {
    id: "relationships-index",
    file: "relationships-index.json",
    license: "cc-by-sa-4.0",
    build: () => {
      const records = relations
        .map((r) => ({ id: r.id, from: r.from, type: r.type, to: r.to, confidence: r.confidence, domain: r.domain }))
        .sort(byId);
      return { records, body: { ...baseMeta, license: "cc-by-sa-4.0", count: records.length, relationships: records } };
    },
  },
  {
    id: "dataset-catalogue",
    file: "dataset-catalogue.json",
    license: "cc-by-sa-4.0",
    build: () => {
      const records = DATASETS.map((d) => ({
        id: d.slug, title: d.title, description: d.description,
        recordCount: d.entityCount, version: d.version, license: d.license, sources: d.sources,
      })).sort((a, b) => a.id.localeCompare(b.id));
      return { records, body: { ...baseMeta, license: "cc-by-sa-4.0", count: records.length, datasets: records } };
    },
  },
  {
    // Program 5 — field-level provenance: every source-traced value with its exact
    // origin. Additive and backward-compatible (a new file); schema-versioned.
    id: "field-provenance",
    file: "field-provenance.json",
    license: "cc-by-sa-4.0",
    build: () => {
      const flat = (e: ReturnType<typeof collectProvenance>[number]) => {
        const v = e.value;
        return {
          entityId: e.entityId, domain: e.domain, field: e.field, value: v.value,
          ...(v.unit ? { unit: v.unit } : {}), ...(v.uncertainty ? { uncertainty: v.uncertainty } : {}),
          status: v.status, source: v.sourceRef,
          ...(v.sourceDataset ? { dataset: v.sourceDataset } : {}), ...(v.sourceTable ? { table: v.sourceTable } : {}),
          ...(v.sourceField ? { column: v.sourceField } : {}), ...(v.sourceRowId ? { rowId: v.sourceRowId } : {}),
          ...(v.bibcode ? { bibcode: v.bibcode } : {}), ...(v.doi ? { doi: v.doi } : {}),
          ...(v.epoch ? { epoch: v.epoch } : {}), ...(v.method ? { method: v.method } : {}),
          ...(v.retrievedAt ? { retrievedAt: v.retrievedAt } : {}),
        };
      };
      const all = collectProvenance();
      // Summary + a representative sample only — per-entity field provenance is served by
      // the API / registry, not pre-generated (matching the graph-export convention), so
      // this stays a small, truthful file rather than a multi-megabyte dump.
      const sample = all.filter((_, i) => i % Math.ceil(all.length / 200) === 0).map(flat);
      const records = sample;
      return {
        records,
        body: {
          ...baseMeta, license: "cc-by-sa-4.0", provenanceSchemaVersion: "1.0.0",
          schema: {
            description: "Each value is a ScientificValue: a source-traced measurement/derivation.",
            fields: ["entityId", "domain", "field", "value", "unit", "uncertainty", "status", "source", "dataset", "table", "column", "rowId", "bibcode", "doi", "epoch", "method", "retrievedAt"],
            statuses: ["measured", "catalogued", "estimated", "modeled", "calculated", "derived", "disputed", "upper_limit", "lower_limit", "planned", "historical"],
          },
          summary: provenanceStats(),
          note: "Full per-entity field provenance is served by GET /api/v0/entities/{id}/provenance; this file carries the schema, aggregate summary and a representative sample.",
          sampleCount: sample.length, sample,
        },
      };
    },
  },
  {
    id: "source-registry",
    file: "source-registry.json",
    license: "cc-by-sa-4.0",
    build: () => {
      const records = Object.values(SOURCES)
        .map((s) => ({ id: s.key, name: s.name, organization: s.organization, url: s.url, country: s.country, authorityType: s.authorityType, scope: s.scope }))
        .sort(byId);
      return { records, body: { ...baseMeta, license: "cc-by-sa-4.0", count: records.length, sources: records } };
    },
  },
  {
    id: "image-catalogue",
    file: "image-catalogue.json",
    license: "cc-by-sa-4.0",
    build: () => {
      const records = imagesEngine.all()
        .map((i) => ({ id: i.slug, title: i.title, objectName: i.objectName, imageType: i.imageType, source: i.sourceSlug, license: i.licenseSlug, publicationYear: i.publicationYear }))
        .sort((a, b) => a.id.localeCompare(b.id));
      return { records, body: { ...baseMeta, license: "cc-by-sa-4.0", count: records.length, images: records } };
    },
  },
  {
    id: "live-sky-providers",
    file: "live-sky-providers.json",
    license: "cc-by-sa-4.0",
    build: () => {
      const records = liveSkyEngine.providers()
        .map((p) => ({ id: p.key, name: p.name, organization: p.organization, url: p.url, status: p.status, access: p.access, license: p.license, dataKinds: p.dataKinds }))
        .sort(byId);
      return { records, body: { ...baseMeta, license: "cc-by-sa-4.0", count: records.length, providers: records } };
    },
  },
];

function main() {
  mkdirSync(PUBLIC_DIR, { recursive: true });
  const manifestExports: Record<string, { file: string; bytes: number; sha256: string; recordCount: number; format: string; license: string }> = {};

  for (const spec of SPECS) {
    const { records, body } = spec.build();
    const json = JSON.stringify(body, null, 2) + "\n";
    const bytes = Buffer.byteLength(json, "utf8");
    const sha256 = createHash("sha256").update(json, "utf8").digest("hex");
    writeFileSync(join(PUBLIC_DIR, spec.file), json, "utf8");
    manifestExports[spec.id] = {
      file: `/exports/${spec.file}`, bytes, sha256, recordCount: records.length, format: "JSON", license: spec.license,
    };
    console.log(`  ${spec.id.padEnd(20)} ${String(records.length).padStart(6)} records  ${(bytes / 1024).toFixed(1).padStart(8)} KiB  sha256:${sha256.slice(0, 12)}…`);
  }

  const manifest = { ...baseMeta, exports: manifestExports };
  const manifestJson = JSON.stringify(manifest, null, 2) + "\n";
  writeFileSync(MANIFEST_TS, manifestJson, "utf8");
  writeFileSync(join(PUBLIC_DIR, "manifest.json"), manifestJson, "utf8");
  console.log(`\nWrote ${SPECS.length} exports + manifest (generatedAt ${DATA_GENERATED_AT}).`);
}

main();
