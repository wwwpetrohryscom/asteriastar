/**
 * De-duplicate observation media so every source image depicts a single entity.
 *
 *   npx tsx scripts/dedupe-media.ts
 *
 * The ingester can occasionally return the same source binary for two entities
 * (name collisions like the moon Ariel vs. the Ariel telescope, or ambiguous NGC
 * neighbours). Reusing one image across unrelated entities is forbidden, so this
 * keeps the FIRST entity to claim each source image and drops the rest (deleting
 * the orphaned local files). Editorial images are seeded first and always win.
 */
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { IMAGES } from "@/lib/media/registry";
import { OBSERVATION_IMAGES } from "@/lib/media/data/observations";
import type { ImageAsset } from "@/lib/media/types";

const ROOT = join(import.meta.dirname, "..");
const DATA_FILE = join(ROOT, "src/lib/media/data/observations.ts");

function esc(s: unknown): string {
  return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\s+/g, " ").trim();
}
function serialize(a: ImageAsset): string {
  const f: string[] = [];
  const q = (k: string, v: unknown) => { if (v !== undefined && v !== null && v !== "") f.push(`${k}: "${esc(v)}"`); };
  q("id", a.id); q("entityId", a.entityId); q("title", a.title); q("alt", a.alt); q("url", a.url);
  f.push(`width: ${Number(a.width) || 0}`); f.push(`height: ${Number(a.height) || 0}`);
  q("blurDataURL", a.blurDataURL); q("caption", a.caption); q("credit", a.credit); q("provider", a.provider);
  q("sourceUrl", a.sourceUrl); q("originalUrl", a.originalUrl); q("license", a.license);
  q("object", a.object); q("author", a.author); q("role", a.role);
  f.push("published: true");
  q("instrument", a.instrument); q("mission", a.mission); q("captureDate", a.captureDate);
  return `  {\n    ${f.join(",\n    ")},\n  },`;
}

function main() {
  const obsIds = new Set(OBSERVATION_IMAGES.map((o) => o.id));
  const seen = new Map<string, string>(); // originalUrl -> entityId (editorial first)
  for (const img of IMAGES) {
    if (!obsIds.has(img.id) && img.originalUrl && img.entityId) seen.set(img.originalUrl, img.entityId);
  }

  const kept: ImageAsset[] = [];
  const removed: string[] = [];
  for (const o of OBSERVATION_IMAGES) {
    const prev = o.originalUrl ? seen.get(o.originalUrl) : undefined;
    if (prev && prev !== o.entityId) {
      removed.push(o.url ?? "");
      continue;
    }
    if (o.originalUrl && o.entityId) seen.set(o.originalUrl, o.entityId);
    kept.push(o);
  }

  // Delete orphaned local files.
  for (const url of removed) {
    if (url.startsWith("/media/entities/")) {
      try { rmSync(join(ROOT, "public", url)); } catch { /* already gone */ }
    }
  }

  const header = readFileSync(DATA_FILE, "utf8").split("export const OBSERVATION_IMAGES")[0];
  const body = kept.map(serialize).join("\n");
  const entities = new Set(kept.map((k) => k.entityId)).size;
  writeFileSync(
    DATA_FILE,
    `${header.replace(/\d+ images across \d+ entities\./, `${kept.length} images across ${entities} entities.`)}export const OBSERVATION_IMAGES: ImageAsset[] = [\n${body}\n];\n`,
  );
  console.log(`[dedupe] removed ${removed.length} cross-entity duplicate images; kept ${kept.length} across ${entities} entities`);
}

main();
