/**
 * Ingest planets and moons from the NASA Planetary Fact Sheet + JPL satellite
 * data (public domain). Maps each row to the existing graph entity id and emits
 * typed BodyRecords. Real values only; "Unknown"/missing fields are omitted.
 *
 * Usage: SS_DIR=/path/to/csvs npx tsx scripts/ingest-solar-system.ts
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { BodyRecord } from "../src/knowledge-graph/data/solar-system-catalog/types";

const DIR = process.env.SS_DIR ?? "/private/tmp/claude-501/-Users-agent/61280a7f-3faf-47ba-b9c9-75bdbbd53ac9/scratchpad";
const OUT = join(process.cwd(), "src/knowledge-graph/data/solar-system-catalog/generated-bodies.ts");

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const num = (s: string): number | undefined => {
  if (!s) return undefined;
  const v = s.split("±")[0].replace(/[R*]/g, "").trim();
  if (!v || /unknown/i.test(v)) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};
const round = (n: number, d: number) => Math.round(n * 10 ** d) / 10 ** d;
function parseCsv(text: string): Record<string, string>[] {
  const [head, ...rows] = text.trim().split("\n");
  const cols = head.split(",");
  return rows.map((r) => {
    const cells = r.split(",");
    return Object.fromEntries(cols.map((c, i) => [c, cells[i] ?? ""]));
  });
}

const PLANET_PARENT = "star:sun";
const PLANET_ID: Record<string, string> = {
  Mercury: "planet:mercury", Venus: "planet:venus", Earth: "planet:earth", Mars: "planet:mars",
  Jupiter: "planet:jupiter", Saturn: "planet:saturn", Uranus: "planet:uranus", Neptune: "planet:neptune",
  Pluto: "dwarf_planet:pluto",
};
const PLANET_CLASS: Record<string, string> = {
  Mercury: "Terrestrial planet", Venus: "Terrestrial planet", Earth: "Terrestrial planet", Mars: "Terrestrial planet",
  Jupiter: "Gas giant", Saturn: "Gas giant", Uranus: "Ice giant", Neptune: "Ice giant", Pluto: "Dwarf planet",
};
// Moon parent (CSV "planet" column) → parent entity id.
const MOON_PARENT: Record<string, string> = {
  Earth: "planet:earth", Mars: "planet:mars", Jupiter: "planet:jupiter", Saturn: "planet:saturn",
  Uranus: "planet:uranus", Neptune: "planet:neptune", Pluto: "dwarf_planet:pluto",
};

// Existing moon ids in the graph (only these are enriched/emitted).
const EXISTING_MOONS = new Set<string>([
  "amalthea", "ariel", "callisto", "charon", "deimos", "dione", "enceladus", "europa",
  "ganymede", "iapetus", "io", "mimas", "miranda", "nereid", "oberon", "phobos", "proteus",
  "rhea", "tethys", "the-moon", "titan", "titania", "triton", "umbriel",
]);

function ingestPlanets(): BodyRecord[] {
  const rows = parseCsv(readFileSync(join(DIR, "planets.csv"), "utf8"));
  const out: BodyRecord[] = [];
  for (const r of rows) {
    const name = r.planet;
    const id = PLANET_ID[name];
    if (!id) continue;
    const kind = name === "Pluto" ? "dwarf-planet" : "planet";
    const diameter = num(r.diameter);
    const dist = num(r.distance_from_sun);
    const days = num(r.orbital_period);
    const density = num(r.density);
    const rec: BodyRecord = {
      id, kind, name, classification: PLANET_CLASS[name], parent: PLANET_PARENT,
      sources: ["nasa", "jpl"],
    };
    const mass = num(r.mass); if (mass != null) rec.mass1e24Kg = mass;
    if (diameter != null) { rec.diameterKm = diameter; rec.radiusKm = round(diameter / 2, 0); }
    if (density != null) rec.densityGCm3 = round(density / 1000, 3);
    const g = num(r.gravity); if (g != null) rec.gravityMs2 = g;
    const esc = num(r.escape_velocity); if (esc != null) rec.escapeVelocityKms = esc;
    const rot = num(r.rotation_period); if (rot != null) rec.rotationPeriodHours = rot;
    if (dist != null) { rec.distanceFromSun1e6Km = dist; rec.semiMajorAxisAu = round(dist / 149.6, 3); }
    const peri = num(r.perihelion); if (peri != null) rec.perihelion1e6Km = peri;
    const apo = num(r.aphelion); if (apo != null) rec.aphelion1e6Km = apo;
    if (days != null) { rec.orbitalPeriodDays = days; rec.orbitalPeriodYears = round(days / 365.25, 2); }
    const ov = num(r.orbital_velocity); if (ov != null) rec.orbitalVelocityKms = ov;
    const inc = num(r.orbital_inclination); if (inc != null) rec.inclinationDeg = inc;
    const ecc = num(r.orbital_eccentricity); if (ecc != null) rec.eccentricity = ecc;
    const obl = num(r.obliquity_to_orbit); if (obl != null) rec.obliquityDeg = obl;
    const temp = num(r.mean_temperature); if (temp != null) rec.meanTemperatureC = temp;
    const sp = num(r.surface_pressure); if (sp != null && sp > 0) rec.surfacePressureBar = sp;
    const moons = num(r.number_of_moons); if (moons != null) rec.moonCount = moons;
    rec.hasRingSystem = r.has_ring_system === "Yes";
    if (r.has_global_magnetic_field === "Yes") rec.hasMagneticField = true;
    else if (r.has_global_magnetic_field === "No") rec.hasMagneticField = false;
    out.push(rec);
  }
  return out;
}

function ingestMoons(): BodyRecord[] {
  const rows = parseCsv(readFileSync(join(DIR, "satellites.csv"), "utf8"));
  const out: BodyRecord[] = [];
  for (const r of rows) {
    const moonSlug = r.name === "Moon" ? "the-moon" : slug(r.name);
    if (!EXISTING_MOONS.has(moonSlug)) continue;
    const id = `moon:${moonSlug}`;
    const parent = MOON_PARENT[r.planet];
    const rec: BodyRecord = { id, kind: "moon", name: r.name === "Moon" ? "The Moon" : r.name, parent, sources: ["nasa", "jpl"] };
    const radius = num(r.radius);
    if (radius != null) { rec.radiusKm = round(radius, 1); rec.diameterKm = round(radius * 2, 0); }
    const density = num(r.density); if (density != null) rec.densityGCm3 = round(density, 3);
    const mag = num(r.magnitude); if (mag != null) rec.magnitude = mag;
    const alb = num(r.albedo); if (alb != null) rec.albedo = alb;
    // Mass from GM (mass = GM·10^9 / G), a physical relation, not a fabrication.
    const gm = num(r.gm);
    if (gm != null) rec.mass1e24Kg = round((gm * 1e9) / 6.674e-11 / 1e24, 5);
    out.push(rec);
  }
  return out;
}

function main() {
  const planets = ingestPlanets();
  const moons = ingestMoons();
  const all = [...planets, ...moons];
  const body =
    `import type { BodyRecord } from "@/knowledge-graph/data/solar-system-catalog/types";\n\n` +
    `// Generated from the NASA Planetary Fact Sheet + JPL satellite data (public domain).\n` +
    `// Do not edit by hand — see scripts/ingest-solar-system.ts.\n` +
    `export const generatedBodies: BodyRecord[] = [\n` +
    all.map((r) => "  " + JSON.stringify(r)).join(",\n") +
    `,\n];\n`;
  writeFileSync(OUT, body);
  console.log(`Wrote ${planets.length} planets + ${moons.length} moons = ${all.length} bodies.`);
  console.log("moons matched:", moons.map((m) => m.name).join(", "));
}

main();
