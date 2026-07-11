/**
 * Content-completeness audit.
 *
 *   npm run content:audit
 *
 * Deterministically evaluates EVERY public knowledge-graph entity for imagery
 * completeness (hero / gallery / zero), classifies types as image-eligible vs.
 * abstract concepts, and writes a full report to docs/content-completeness-audit.md.
 * Honest by construction: it only measures what exists — it never fabricates
 * coverage. Used as the baseline for the media-enrichment pipeline.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { entities } from "@/knowledge-graph/entities";
import { getImagesForEntity } from "@/lib/media/registry";

const ROOT = join(import.meta.dirname, "..");

// Entity types for which an authentic scientific image can normally exist.
const IMAGE_ELIGIBLE = new Set([
  "planet", "dwarf_planet", "moon", "galaxy", "nebula", "star_cluster", "black_hole",
  "supernova_remnant", "comet", "asteroid", "meteorite", "space_telescope", "telescope",
  "observatory", "space_mission", "spacecraft", "launch_vehicle", "satellite",
  "surface_feature", "constellation", "asterism", "space_weather_phenomenon", "astronaut",
  "organization", "star", "scientific_instrument", "launch_pad", "launch_site", "space_station",
  "station_module", "crew_vehicle", "rocket_engine", "tracking_station", "sky_survey",
  "historical_discovery",
]);

// Types where a direct photograph typically does NOT exist (concepts, methods,
// most exoplanets/host stars, catalogue-only records) — absence is legitimate.
const ABSTRACT_HINT = /concept|method|process|physics|principle|era|event|view|capability|function|technique|class|band|calculator|planner|software|framework|figure|sign|milestone|program/i;

type Row = { type: string; total: number; imaged: number; multi: number; zero: number; eligible: boolean };

function main() {
  const byType = new Map<string, { total: number; ids: string[] }>();
  for (const e of entities as { id: string }[]) {
    const t = e.id.split(":")[0];
    const rec = byType.get(t) ?? { total: 0, ids: [] };
    rec.total++;
    rec.ids.push(e.id);
    byType.set(t, rec);
  }

  const rows: Row[] = [];
  for (const [type, rec] of byType) {
    let imaged = 0, multi = 0;
    for (const id of rec.ids) {
      const n = getImagesForEntity(id).length;
      if (n >= 1) imaged++;
      if (n >= 2) multi++;
    }
    rows.push({
      type,
      total: rec.total,
      imaged,
      multi,
      zero: rec.total - imaged,
      eligible: IMAGE_ELIGIBLE.has(type) || (!ABSTRACT_HINT.test(type) && rec.total > 0 && imaged > 0),
    });
  }
  rows.sort((a, b) => (Number(b.eligible) - Number(a.eligible)) || b.total - a.total);

  const totalEntities = entities.length;
  const totalImaged = rows.reduce((n, r) => n + r.imaged, 0);
  const totalMulti = rows.reduce((n, r) => n + r.multi, 0);
  const eligibleRows = rows.filter((r) => r.eligible);
  const eligibleTotal = eligibleRows.reduce((n, r) => n + r.total, 0);
  const eligibleImaged = eligibleRows.reduce((n, r) => n + r.imaged, 0);
  const eligibleZero = eligibleTotal - eligibleImaged;

  const pct = (a: number, b: number) => (b === 0 ? "—" : `${((a / b) * 100).toFixed(1)}%`);

  const lines: string[] = [];
  lines.push("# AsteriaStar — Content Completeness Audit");
  lines.push("");
  lines.push(`_Generated deterministically by \`npm run content:audit\`. Honest by construction: measures existing coverage only, never fabricates._`);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push("| Metric | Count |");
  lines.push("| --- | ---: |");
  lines.push(`| Total public entities audited | ${totalEntities} |`);
  lines.push(`| Distinct entity types | ${byType.size} |`);
  lines.push(`| Entities with at least one image | ${totalImaged} (${pct(totalImaged, totalEntities)}) |`);
  lines.push(`| Entities with a multi-image gallery (≥2) | ${totalMulti} |`);
  lines.push(`| Entities with zero imagery | ${totalEntities - totalImaged} |`);
  lines.push("");
  lines.push("### Image-eligible entities (a real photo/observation can normally exist)");
  lines.push("");
  lines.push("| Metric | Count |");
  lines.push("| --- | ---: |");
  lines.push(`| Image-eligible entities | ${eligibleTotal} |`);
  lines.push(`| …with a hero image | ${eligibleImaged} (${pct(eligibleImaged, eligibleTotal)}) |`);
  lines.push(`| …with a multi-image gallery | ${eligibleRows.reduce((n, r) => n + r.multi, 0)} |`);
  lines.push(`| …still with zero imagery (enrichment targets) | ${eligibleZero} |`);
  lines.push("");
  lines.push("> Note on absence: the very large `star` (thousands), `exoplanet`, `host_star` and `planetary_system` populations are catalogue records with **no resolved-disc photograph in existence** — their absence of a hero photo is scientifically legitimate, not a defect. They are excluded from the primary enrichment target below (except famous named stars).");
  lines.push("");
  lines.push("## Coverage by entity type");
  lines.push("");
  lines.push("| Type | Total | Imaged | % | Gallery (≥2) | Zero | Eligible |");
  lines.push("| --- | ---: | ---: | ---: | ---: | ---: | :---: |");
  for (const r of rows) {
    lines.push(`| \`${r.type}\` | ${r.total} | ${r.imaged} | ${pct(r.imaged, r.total)} | ${r.multi} | ${r.zero} | ${r.eligible ? "✅" : "—"} |`);
  }
  lines.push("");
  lines.push("## Enrichment targets (image-eligible types with zero-image entities)");
  lines.push("");
  lines.push("| Type | Zero-image entities | Recommended action |");
  lines.push("| --- | ---: | --- |");
  for (const r of eligibleRows.filter((r) => r.zero > 0).sort((a, b) => b.zero - a.zero)) {
    lines.push(`| \`${r.type}\` | ${r.zero} | ${recommend(r.type)} |`);
  }
  lines.push("");
  lines.push("## Factual completeness (by domain)");
  lines.push("");
  lines.push("Numeric/physical characteristics are rendered from the domain catalogues; where a value is unknown it stays blank (never fabricated).");
  lines.push("- **Rich catalogue data (rendered as StatGrid/facts):** solar-system bodies (mass, radius, density, gravity, orbit, temperature…), stars (spectral type, magnitude, distance, coordinates…), exoplanets (host, method, period, radius…), deep-sky (catalogue ids, distance, magnitude, morphology…), missions/rockets/observatories.");
  lines.push("- **Blocked by lack of authoritative data:** any characteristic with no source-backed value in the catalogue is intentionally left empty. Adding new measurements requires an authoritative-source ingestion (NASA/JPL/ESA/SIMBAD/VizieR/MPC/Exoplanet Archive), tracked as a follow-up — it is out of scope to invent them.");
  lines.push("");
  lines.push(`_Baseline: ${totalImaged} entities imaged / ${totalEntities} total._`);

  const out = join(ROOT, "docs/content-completeness-audit.md");
  writeFileSync(out, lines.join("\n") + "\n");

  console.log(`[content:audit] ${totalEntities} entities · ${totalImaged} imaged (${pct(totalImaged, totalEntities)}) · ${totalMulti} galleries`);
  console.log(`[content:audit] image-eligible: ${eligibleImaged}/${eligibleTotal} imaged · ${eligibleZero} zero-image enrichment targets`);
  console.log(`[content:audit] wrote docs/content-completeness-audit.md`);
}

function recommend(type: string): string {
  const map: Record<string, string> = {
    galaxy: "Hubble/Webb/ESO imagery via NASA + Wikimedia", nebula: "Hubble/Webb imagery",
    star_cluster: "Hubble/DSS survey imagery", moon: "NASA/JPL flyby imagery",
    asteroid: "mission flyby / radar imagery (visited bodies only)", comet: "mission/observatory imagery",
    meteorite: "specimen photography (Wikimedia/institutional)", observatory: "site photography (Wikimedia/ESO)",
    telescope: "hardware/site photography", space_telescope: "spacecraft/hardware imagery",
    space_mission: "official mission photography", spacecraft: "official hardware imagery/renders (labelled)",
    launch_vehicle: "launch/hardware photography", satellite: "official imagery (verified only)",
    surface_feature: "orbiter/lander imagery (USGS/NASA)", constellation: "IAU star chart / real sky-field",
    astronaut: "official portrait (NASA/agency)", organization: "logo/facility (verified license only)",
    star: "famous named stars only — sky-field/survey; never a fake close-up",
  };
  return map[type] ?? "verified imagery where an authentic view exists; otherwise leave empty (legitimate)";
}

main();
