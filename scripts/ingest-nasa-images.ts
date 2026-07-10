/* eslint-disable @typescript-eslint/no-explicit-any -- build script parsing loose external API JSON */
/**
 * Deterministic, self-grounding scientific-image ingestion.
 *
 *   npx tsx scripts/ingest-nasa-images.ts <targets.json>
 *
 * For every knowledge-graph entity in the targets file this:
 *   1. queries the LIVE NASA Images API (and Wikimedia Commons for ground
 *      observatories / constellations) for REAL, openly-licensed imagery,
 *   2. filters results for relevance (the object's name must appear) and rejects
 *      artist concepts / illustrations / diagrams — only real observations,
 *   3. downloads up to MAX_PER_ENTITY images, optimizes them (<=1600px,
 *      high-quality mozjpeg), computes width/height + a blur-up placeholder,
 *   4. writes fully-attributed ImageAsset records (first = hero, rest = gallery).
 *
 * Everything is grounded in live API responses — no metadata is invented, and
 * any image that fails to download or verify is skipped. Output:
 *   public/media/entities/<slug>.jpg   +   src/lib/media/data/observations.ts
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = join(import.meta.dirname, "..");
const TARGETS = process.argv[2] ?? join(ROOT, "media-targets.json");
const OUT_DIR = join(ROOT, "public/media/entities");
const DATA_FILE = join(ROOT, "src/lib/media/data/observations.ts");

const MAX_PER_ENTITY = 4;
const CONCURRENCY = 6;
const MAX_EDGE = 1600;

const OPEN_WIKI_LICENSES: Record<string, string> = {
  "public domain": "public-domain",
  cc0: "cc0",
  "cc by 4.0": "cc-by",
  "cc by 3.0": "cc-by",
  "cc by 2.0": "cc-by",
  "cc by 2.5": "cc-by",
  "cc by-sa 4.0": "cc-by-sa",
  "cc by-sa 3.0": "cc-by-sa",
  "cc by-sa 2.0": "cc-by-sa",
};

// Reject non-observation imagery for real celestial objects.
const DENY_ALL = ["artist", "illustration", "animation", "concept art", "rendering", "render of", "artwork"];
const DENY_OBJECT = ["diagram", "infographic", "chart", "logo", "patch", "insignia", "emblem", "stamp", "poster", "map of the", "timeline"];
const HARDWARE = new Set(["space_mission", "spacecraft", "launch_vehicle", "space_telescope", "observatory", "satellite"]);

type Target = { id: string; name: string };
type Cand = {
  originalUrl: string; title: string; caption: string; credit: string;
  provider: string; license: string; sourceUrl: string; captureDate?: string;
  instrument?: string; mission?: string; alt: string; key: string;
};

const GENERIC = new Set(["the", "galaxy", "nebula", "cluster", "comet", "moon", "constellation", "space", "telescope", "observatory", "star", "system", "of", "a", "region", "great", "and"]);

function tokens(name: string): string[] {
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter((w) => w.length >= 3 && !GENERIC.has(w));
}

function searchTerm(t: Target): string {
  const type = t.id.split(":")[0];
  const n = t.name.replace(/\s*\(.*?\)\s*/g, "").trim();
  if (t.id === "moon:the-moon") return "Moon lunar surface";
  if (type === "moon") return `${n} moon`;
  if (type === "asteroid") return `${n} asteroid`;
  if (type === "comet") return `${n} comet`;
  if (type === "star_cluster") return `${n} star cluster`;
  if (type === "black_hole") return `${n} black hole`;
  if (type === "star") return t.id === "star:sun" ? "Sun solar" : `${n} star`;
  return n;
}

function relevant(text: string, toks: string[], type: string): boolean {
  const lc = text.toLowerCase();
  if (DENY_ALL.some((d) => lc.includes(d))) return false;
  if (!HARDWARE.has(type) && DENY_OBJECT.some((d) => lc.includes(d))) return false;
  return toks.some((tk) => lc.includes(tk));
}

function creditFromCenter(center?: string, secondary?: string): string {
  if (secondary && secondary.trim()) return secondary.trim();
  const map: Record<string, string> = {
    GSFC: "NASA/Goddard Space Flight Center", JPL: "NASA/JPL-Caltech", HQ: "NASA",
    STScI: "NASA/ESA/STScI", MSFC: "NASA/Marshall", ARC: "NASA/Ames", JSC: "NASA/Johnson",
    LARC: "NASA/Langley", KSC: "NASA/Kennedy", GRC: "NASA/Glenn",
  };
  return center ? (map[center] ?? `NASA/${center}`) : "NASA";
}

function providerFrom(text: string): string {
  const lc = text.toLowerCase();
  if (lc.includes("webb") || lc.includes("jwst")) return "jwst";
  if (lc.includes("hubble")) return "hubble";
  if (lc.includes("european southern") || lc.includes(" eso ") || lc.includes("very large telescope")) return "other";
  return "nasa";
}

function firstSentence(s: string, max = 220): string {
  const clean = s.replace(/\s+/g, " ").trim();
  const dot = clean.indexOf(". ");
  const out = dot > 40 ? clean.slice(0, dot + 1) : clean;
  return out.length > max ? out.slice(0, max - 1).trimEnd() + "…" : out;
}

async function getJson(url: string): Promise<any | null> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": "AsteriaStar-ingest/1.0 (+https://asteriastar.com)" } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function nasaCandidates(t: Target, toks: string[], type: string): Promise<Cand[]> {
  const data = await getJson(`https://images-api.nasa.gov/search?q=${encodeURIComponent(searchTerm(t))}&media_type=image`);
  const items: any[] = data?.collection?.items ?? [];
  const out: Cand[] = [];
  const seen = new Set<string>();
  // Prefer JPL Photojournal (PIA*) for solar-system bodies — real planetary imagery.
  const solar = ["planet", "dwarf_planet", "moon", "surface_feature", "asteroid", "comet"].includes(type);
  const ranked = items.slice(0, 40).sort((a, b) => {
    const ai = a.data?.[0]?.nasa_id ?? "", bi = b.data?.[0]?.nasa_id ?? "";
    const ap = solar && ai.startsWith("PIA") ? 0 : 1, bp = solar && bi.startsWith("PIA") ? 0 : 1;
    return ap - bp;
  });
  for (const it of ranked) {
    const d = it.data?.[0];
    if (!d?.nasa_id || seen.has(d.nasa_id)) continue;
    const text = `${d.title ?? ""} ${(d.keywords ?? []).join(" ")} ${d.description ?? ""}`;
    if (!relevant(text, toks, type)) continue;
    const asset = await getJson(`https://images-api.nasa.gov/asset/${encodeURIComponent(d.nasa_id)}`);
    const hrefs: string[] = (asset?.collection?.items ?? []).map((x: any) => x.href).filter((h: string) => /\.(jpg|jpeg|png)$/i.test(h));
    const url = hrefs.find((h) => /~orig\./i.test(h)) ?? hrefs.find((h) => /~large\./i.test(h)) ?? hrefs.find((h) => /~medium\./i.test(h));
    if (!url) continue;
    seen.add(d.nasa_id);
    const provider = providerFrom(text);
    out.push({
      originalUrl: url.replace(/^http:/, "https:"),
      title: firstSentence(d.title ?? t.name, 120),
      caption: firstSentence(d.description ?? d.title ?? "", 220),
      credit: creditFromCenter(d.center, d.secondary_creator),
      provider, license: "nasa-media",
      sourceUrl: `https://images.nasa.gov/details/${d.nasa_id}`,
      captureDate: (d.date_created ?? "").slice(0, 10) || undefined,
      alt: firstSentence(d.title ?? t.name, 150),
      key: d.nasa_id,
    });
    if (out.length >= MAX_PER_ENTITY) break;
  }
  return out;
}

async function wikimediaCandidates(t: Target, toks: string[], type: string): Promise<Cand[]> {
  const term = type === "constellation" ? `${t.name} constellation IAU` : t.name;
  const data = await getJson(
    `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(term)}&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=1600&format=json`,
  );
  const pages: any[] = data?.query?.pages ? Object.values(data.query.pages) : [];
  const out: Cand[] = [];
  for (const p of pages) {
    const ii = p.imageinfo?.[0];
    if (!ii) continue;
    const em = ii.extmetadata ?? {};
    const licRaw = String(em.LicenseShortName?.value ?? "").toLowerCase();
    const license = OPEN_WIKI_LICENSES[licRaw];
    const url: string = ii.url ?? "";
    if (!license || !/\.(jpg|jpeg|png)$/i.test(url)) continue;
    if ((ii.width ?? 0) < 700) continue;
    const title = String(p.title ?? "").replace(/^File:/, "").replace(/\.(jpg|jpeg|png)$/i, "");
    const text = `${title} ${String(em.ImageDescription?.value ?? "").replace(/<[^>]+>/g, "")}`;
    if (!relevant(text, toks, type)) continue;
    const credit = String(em.Artist?.value ?? em.Credit?.value ?? "Wikimedia Commons").replace(/<[^>]+>/g, "").trim().slice(0, 140) || "Wikimedia Commons";
    out.push({
      originalUrl: url,
      title: title.slice(0, 120),
      caption: firstSentence(String(em.ImageDescription?.value ?? "").replace(/<[^>]+>/g, ""), 220),
      credit, provider: "wikimedia", license,
      sourceUrl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(p.title)}`,
      alt: `${t.name} — ${title.slice(0, 120)}`,
      key: p.title,
    });
    if (out.length >= 2) break;
  }
  return out;
}

async function optimize(url: string): Promise<{ buf: Buffer; width: number; height: number; blur: string } | null> {
  try {
    const res = await fetch(url, { redirect: "follow", headers: { "User-Agent": "AsteriaStar-ingest/1.0 (+https://asteriastar.com)" } });
    if (!res.ok || !(res.headers.get("content-type") ?? "").startsWith("image/")) return null;
    const raw = Buffer.from(await res.arrayBuffer());
    if (raw.length < 4000) return null;
    const buf = await sharp(raw).rotate().resize(MAX_EDGE, MAX_EDGE, { fit: "inside", withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
    const meta = await sharp(buf).metadata();
    if (!meta.width || !meta.height) return null;
    const b = await sharp(buf).resize(16, 16, { fit: "inside" }).webp({ quality: 40 }).toBuffer();
    return { buf, width: meta.width, height: meta.height, blur: `data:image/webp;base64,${b.toString("base64")}` };
  } catch {
    return null;
  }
}

function esc(s: string): string {
  return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\s+/g, " ").trim();
}

async function pool<T, R>(items: T[], n: number, fn: (x: T, i: number) => Promise<R>): Promise<R[]> {
  const res: R[] = new Array(items.length);
  let idx = 0;
  await Promise.all(
    Array.from({ length: Math.min(n, items.length) }, async () => {
      while (idx < items.length) {
        const i = idx++;
        res[i] = await fn(items[i], i);
      }
    }),
  );
  return res;
}

async function main() {
  const targets: Record<string, Target[]> = JSON.parse(readFileSync(TARGETS, "utf8"));
  const flat: Target[] = Object.values(targets).flat();
  console.log(`[ingest] ${flat.length} target entities`);
  rmSync(OUT_DIR, { recursive: true, force: true });
  mkdirSync(OUT_DIR, { recursive: true });

  let done = 0;
  const perEntity = await pool(flat, CONCURRENCY, async (t) => {
    const type = t.id.split(":")[0];
    const toks = tokens(t.name);
    if (toks.length === 0) toks.push(t.name.toLowerCase());
    let cands: Cand[] = [];
    const useWiki = ["observatory", "constellation"].includes(type);
    if (!useWiki) cands = await nasaCandidates(t, toks, type);
    if (cands.length === 0) cands = await wikimediaCandidates(t, toks, type);
    cands = cands.slice(0, MAX_PER_ENTITY);

    const records: string[] = [];
    for (let i = 0; i < cands.length; i++) {
      const c = cands[i];
      const opt = await optimize(c.originalUrl);
      if (!opt) continue;
      const slug = `${t.id.replace(/:/g, "-")}-${records.length + 1}`.toLowerCase().replace(/[^a-z0-9-]/g, "-");
      writeFileSync(join(OUT_DIR, `${slug}.jpg`), opt.buf);
      const alt = esc(c.alt).length >= 8 ? esc(c.alt) : `${esc(t.name)} — real observation image.`;
      const fields = [
        `id: "${slug}"`, `entityId: "${esc(t.id)}"`, `title: "${esc(c.title) || esc(t.name)}"`,
        `alt: "${alt}"`, `url: "/media/entities/${slug}.jpg"`, `width: ${opt.width}`, `height: ${opt.height}`,
        `blurDataURL: "${opt.blur}"`, `credit: "${esc(c.credit) || "NASA"}"`, `provider: "${c.provider}"`,
        `sourceUrl: "${esc(c.sourceUrl)}"`, `originalUrl: "${esc(c.originalUrl)}"`, `license: "${c.license}"`,
        `object: "${esc(t.name)}"`, `author: "${esc(c.credit) || "NASA"}"`,
        `role: "${records.length === 0 ? "hero" : "gallery"}"`, `published: true`,
      ];
      if (c.caption) fields.splice(13, 0, `caption: "${esc(c.caption)}"`);
      if (c.instrument) fields.push(`instrument: "${esc(c.instrument)}"`);
      if (c.mission) fields.push(`mission: "${esc(c.mission)}"`);
      if (c.captureDate) fields.push(`captureDate: "${esc(c.captureDate)}"`);
      records.push(`  {\n    ${fields.join(",\n    ")},\n  },`);
    }
    done++;
    if (done % 25 === 0) console.log(`[ingest] ${done}/${flat.length} entities processed`);
    return { entityId: t.id, count: records.length, records };
  });

  const all = perEntity.filter((e) => e.count > 0);
  const body = all.flatMap((e) => e.records).join("\n");
  const header = `import type { ImageAsset } from "@/lib/media/types";

/**
 * Real, openly-licensed observation imagery attached to knowledge-graph
 * entities. GENERATED by \`npm run media:ingest\` (scripts/ingest-nasa-images.ts)
 * from live NASA Images API / Wikimedia Commons responses — downloaded,
 * optimized, blur-hashed, and fully attributed. Do not edit by hand.
 *
 * ${all.reduce((n, e) => n + e.count, 0)} images across ${all.length} entities.
 */
export const OBSERVATION_IMAGES: ImageAsset[] = [
`;
  writeFileSync(DATA_FILE, header + body + "\n];\n");
  console.log(`[ingest] DONE — ${all.reduce((n, e) => n + e.count, 0)} images across ${all.length}/${flat.length} entities`);
  const multi = all.filter((e) => e.count > 1).length;
  console.log(`[ingest] entities with galleries (>1 image): ${multi}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
