/**
 * Generate optimized responsive variants for the official AsteriaStar real
 * space background system. Every master image below is catalogued in
 * `src/lib/media/registry.ts` with credit, license, source URL, and original
 * archive URL. Run after adding or replacing an editorial master:
 *
 *   npx tsx scripts/generate-cosmos-bg.ts
 *
 * Outputs (all committed, served from /brand/):
 *   public/brand/backgrounds/{id}-{640,1024,1536}.{avif,webp,jpg}
 *   public/brand/cosmos-{640,1024,1536}.{avif,webp,jpg} — primary fallback
 *   public/brand/cosmos-og.jpg                         — 1200×630 social crop
 *
 * The images are never recolored or regenerated. They are only cropped,
 * resized, and re-encoded from official NASA/JWST/Hubble/Cassini/SDO/MER
 * observations so the backgrounds remain visually faithful and performant.
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = join(import.meta.dirname, "..");
const OUT = join(ROOT, "public/brand");
const BACKGROUNDS_OUT = join(OUT, "backgrounds");

const WIDTHS = [640, 1024, 1536] as const;
const ASPECT = 10 / 16;

const BACKGROUNDS = [
  ["webb-cosmic-cliffs", "public/editorial/cosmic-cliffs.jpg"],
  ["webb-first-deep-field", "public/editorial/webb-deep-field.jpg"],
  ["hubble-pillars-creation", "public/editorial/pillars-hubble.jpg"],
  ["trumpler-14-hubble", "public/editorial/trumpler-14-hubble.jpg"],
  ["sun-sdo", "public/editorial/sun-sdo.jpg"],
  ["blue-marble-viirs", "public/editorial/blue-marble.jpg"],
  ["jupiter-hubble", "public/editorial/jupiter-hubble.jpg"],
  ["saturn-cassini", "public/editorial/saturn-cassini.jpg"],
  ["mars-marathon-valley", "public/editorial/mars-marathon-valley.jpg"],
] as const;

async function generateSet(src: string, dir: string, prefix: string) {
  for (const w of WIDTHS) {
    const h = Math.round(w * ASPECT);
    const base = sharp(src).resize(w, h, { fit: "cover", position: "centre" });
    await base.clone().avif({ quality: 48, effort: 5 }).toFile(join(dir, `${prefix}-${w}.avif`));
    await base.clone().webp({ quality: 72 }).toFile(join(dir, `${prefix}-${w}.webp`));
    await base.clone().jpeg({ quality: 72, mozjpeg: true }).toFile(join(dir, `${prefix}-${w}.jpg`));
  }
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  mkdirSync(BACKGROUNDS_OUT, { recursive: true });

  for (const [id, relativeSrc] of BACKGROUNDS) {
    await generateSet(join(ROOT, relativeSrc), BACKGROUNDS_OUT, id);
  }

  const primary = join(ROOT, BACKGROUNDS[0][1]);
  await generateSet(primary, OUT, "cosmos");

  // Social-card crop (1200×630). Keep the nebular ridge and blue star field as
  // the stable brand fallback for existing metadata and OG rendering.
  await sharp(primary)
    .resize(1200, 630, { fit: "cover", position: "centre" })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(join(OUT, "cosmos-og.jpg"));

  console.log(`[cosmos-bg] generated ${BACKGROUNDS.length} real-photo background sets in public/brand/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
