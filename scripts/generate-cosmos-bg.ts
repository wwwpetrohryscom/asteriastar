/**
 * Generate the optimized responsive variants of the official AsteriaStar cosmos
 * background from the single committed master (assets/brand/cosmos-source.jpg,
 * a brand-supplied deep-space image — used as decorative site chrome, not as a
 * catalogued scientific photograph). Run after replacing the master:
 *
 *   npx tsx scripts/generate-cosmos-bg.ts
 *
 * Outputs (all committed, served from /brand/):
 *   public/brand/cosmos-{640,1024,1536}.avif   — modern, smallest
 *   public/brand/cosmos-{640,1024,1536}.webp   — wide support
 *   public/brand/cosmos-{640,1024,1536}.jpg    — universal fallback
 *   public/brand/cosmos-og.jpg                 — 1200×630 crop for social cards
 *
 * The image is never recolored or regenerated — only re-encoded and resized, so
 * the stars, Milky Way, constellation lines and Earth's limb are preserved.
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = join(import.meta.dirname, "..");
const SRC = join(ROOT, "assets/brand/cosmos-source.jpg");
const OUT = join(ROOT, "public/brand");

const WIDTHS = [640, 1024, 1536] as const;

async function main() {
  mkdirSync(OUT, { recursive: true });

  for (const w of WIDTHS) {
    const base = sharp(SRC).resize(w, null, { withoutEnlargement: true });
    await base.clone().avif({ quality: 52, effort: 5 }).toFile(join(OUT, `cosmos-${w}.avif`));
    await base.clone().webp({ quality: 74 }).toFile(join(OUT, `cosmos-${w}.webp`));
    await base.clone().jpeg({ quality: 74, mozjpeg: true }).toFile(join(OUT, `cosmos-${w}.jpg`));
  }

  // Social-card crop (1200×630). Anchor low so Earth's limb stays in frame.
  await sharp(SRC)
    .resize(1200, 630, { fit: "cover", position: "bottom" })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(join(OUT, "cosmos-og.jpg"));

  console.log(`[cosmos-bg] generated ${WIDTHS.length * 3 + 1} assets in public/brand/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
