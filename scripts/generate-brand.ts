/**
 * Generate every static AsteriaStar brand asset from the single source of
 * truth — the <Emblem/> component in src/lib/brand/logo.tsx. Run after any
 * change to the emblem:
 *
 *   npx tsx scripts/generate-brand.ts
 *
 * Outputs (all committed):
 *   src/app/icon.svg              — SVG favicon (browser tab)
 *   src/app/apple-icon.png        — 180×180 Apple touch icon
 *   public/logo.svg               — primary brand mark (structured-data logo)
 *   public/favicon.ico            — legacy multi-size favicon (16/32/48)
 *   public/icons/icon-192.png     — PWA / Android
 *   public/icons/icon-512.png     — PWA / Android
 *   public/icons/maskable-512.png — PWA maskable
 *   public/brand/mark-512.png     — raster mark for the social (OG/Twitter) card
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import sharp from "sharp";
import { Emblem } from "../src/lib/brand/logo";

const ROOT = join(import.meta.dirname, "..");
const svg = (opts: { title?: string }) =>
  renderToStaticMarkup(createElement(Emblem, { size: 512, id: "asteriastar", tile: true, ...opts }));

/** Pack PNG buffers into a Vista-style .ico container (each entry is a PNG). */
function pngsToIco(entries: { size: number; buf: Buffer }[]): Buffer {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(entries.length, 4);
  const dir = Buffer.alloc(16 * entries.length);
  let offset = 6 + 16 * entries.length;
  const bodies: Buffer[] = [];
  entries.forEach((e, i) => {
    const b = i * 16;
    dir.writeUInt8(e.size >= 256 ? 0 : e.size, b + 0);
    dir.writeUInt8(e.size >= 256 ? 0 : e.size, b + 1);
    dir.writeUInt8(0, b + 2); // palette
    dir.writeUInt8(0, b + 3); // reserved
    dir.writeUInt16LE(1, b + 4); // colour planes
    dir.writeUInt16LE(32, b + 6); // bits per pixel
    dir.writeUInt32LE(e.buf.length, b + 8);
    dir.writeUInt32LE(offset, b + 12);
    offset += e.buf.length;
    bodies.push(e.buf);
  });
  return Buffer.concat([header, dir, ...bodies]);
}

async function main() {
  mkdirSync(join(ROOT, "public/icons"), { recursive: true });
  mkdirSync(join(ROOT, "public/brand"), { recursive: true });

  const markSvg = svg({ title: "AsteriaStar" });
  const buf = Buffer.from(markSvg);
  const png = (size: number) => sharp(buf, { density: 384 }).resize(size, size).png();

  // SVG files
  writeFileSync(join(ROOT, "src/app/icon.svg"), markSvg + "\n");
  writeFileSync(join(ROOT, "public/logo.svg"), markSvg + "\n");

  // Raster PNGs
  await png(180).toFile(join(ROOT, "src/app/apple-icon.png"));
  await png(192).toFile(join(ROOT, "public/icons/icon-192.png"));
  await png(512).toFile(join(ROOT, "public/icons/icon-512.png"));
  await png(512).toFile(join(ROOT, "public/icons/maskable-512.png"));
  await png(512).toFile(join(ROOT, "public/brand/mark-512.png"));

  // favicon.ico (16/32/48)
  const icoEntries = await Promise.all(
    [16, 32, 48].map(async (size) => ({ size, buf: await png(size).toBuffer() })),
  );
  writeFileSync(join(ROOT, "public/favicon.ico"), pngsToIco(icoEntries));

  console.log("[brand] generated icon.svg, logo.svg, apple-icon.png, favicon.ico, PWA icons, OG mark");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
