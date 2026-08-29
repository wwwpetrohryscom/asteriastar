import {
  ENTITY_TYPE_LABELS,
  entityGraphPath,
  getAllGraphEntities,
} from "@/knowledge-graph";
import { getAllEntries } from "@/content/entries";
import { getAllSections, getAllCategories } from "@/lib/content/registry";
import { TOPICS } from "@/lib/discovery";
import { LEARNING_PATHS } from "@/lib/learn";
import { TIMELINES } from "@/lib/timelines";
import { COMPARISONS } from "@/lib/compare";
import { DATASETS } from "@/lib/datasets";
import { engine } from "@/platform/data-engine";
import {
  categoryPath,
  sectionPath,
  topicPath,
  learnPath,
  timelinePath,
  comparePath,
  datasetPath,
  ROUTES,
} from "@/lib/routes";
import { groupForEntityType, isCulturalType } from "@/lib/search/groups";
import type { SearchDoc, SearchGroupId } from "@/lib/search/types";

/**
 * Build-time search index construction.
 *
 * BUILD-ONLY, and deliberately located under `scripts/` rather than `src/`.
 *
 * This is the only part of search that touches the data layer, and keeping it
 * outside `src/` makes that structural instead of conventional: nothing in the
 * app can import it by accident, and the platform layer contract (which
 * forbids the explorer layer from reaching into the data engine) is satisfied
 * by construction rather than by a lint rule. The browser never sees this —
 * it loads the generated JSON instead.
 *
 * Everything indexed is a real, published record from a canonical registry.
 * Nothing is scraped from rendered HTML, and no document is invented to fill a
 * category.
 */

/** Short descriptions are trimmed hard: this text is repeated ~9,000 times. */
const DESC_MAX = 110;

function trim(text: string | undefined): string | undefined {
  if (!text) return undefined;
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return undefined;
  if (clean.length <= DESC_MAX) return clean;
  // Cut on a word boundary so the snippet never ends mid-word.
  const cut = clean.slice(0, DESC_MAX);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 60 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

/**
 * Expand a catalogue designation into the forms a visitor actually types.
 *
 * "Messier 1" and "M1" are the same designation by definition, but the graph
 * stores whichever form the source used — the Crab Nebula carries "Messier 1"
 * and nothing else, so the query "M1" reached it only as a weak prefix match
 * behind M10, M100 and M101. This adds the missing spelling of a designation
 * that already exists; it never invents one.
 */
function expandDesignations(aliases: string[]): string[] {
  const out: string[] = [];
  for (const a of aliases) {
    out.push(a);
    const long = a.match(/^(Messier|Caldwell)\s*(\d+)$/i);
    if (long) {
      out.push(`${long[1][0].toUpperCase()}${long[2]}`);
      continue;
    }
    const short = a.match(/^(M|C)\s*(\d+)$/);
    if (short) out.push(`${short[1] === "M" ? "Messier" : "Caldwell"} ${short[2]}`);
  }
  return out;
}

/**
 * Stellar spectral classes look like catalogue designations and are not.
 *
 * The exoplanet catalogue mirrors `hostSpectralType` onto host-star aliases, so
 * 228 host stars carried "M1", "K2 V", "M4.5" as their only alias — and
 * identifier folding collapses "M4.5" to "m45", putting seven red dwarfs at the
 * same exact-identifier tier as Messier 45. A shared physical property must
 * never be indexed as an identity.
 *
 * The filter is applied BY SOURCE, not by pattern: "M1" is a spectral class on
 * a star and the Crab Nebula's Messier designation on a nebula, and the strings
 * are identical. Only star-like types can carry a spectral class, so only they
 * are filtered — a pattern-only rule silently deleted Messier numbers.
 */
const SPECTRAL_CLASS = /^[OBAFGKMLTY]\d?(\.\d)?\s*(I{1,3}V?|IV|V|VI)?$/i;

/** Entity types for which a spectral-class-shaped alias is a property, not an id. */
const SPECTRAL_TYPES = new Set(["star", "host_star", "planetary_system", "exoplanet"]);

/** Dedupe, drop empties, drop aliases identical to the title, drop non-identities. */
function cleanAliases(
  title: string,
  raw: (string | undefined | null)[],
  entityType?: string,
): string[] | undefined {
  const seen = new Set<string>();
  const titleKey = title.toLowerCase();
  const out: string[] = [];
  for (const value of raw) {
    if (!value) continue;
    const v = String(value).replace(/\s+/g, " ").trim();
    if (!v) continue;
    if (entityType && SPECTRAL_TYPES.has(entityType) && SPECTRAL_CLASS.test(v)) continue;
    // Dedupe on the identifier-folded form as well as the literal one, so the
    // catalogue's "C 33" and our generated "C33" do not both ship.
    const key = v.toLowerCase();
    const idKey = key.replace(/[\s._/'-]+/g, "");
    if (key === titleKey || seen.has(key) || seen.has(idKey)) continue;
    seen.add(key);
    seen.add(idKey);
    out.push(v);
  }
  return out.length ? out : undefined;
}

/* --------------------------------------------- identifier enrichment */

/**
 * Catalogue identifiers that are NOT on the graph entity itself.
 *
 * The graph carries `aliases` for 4,346 of 7,351 entities, but the deep
 * catalogues hold designations the graph does not mirror — HD/HIP/HR/Gliese
 * numbers on stars, Messier/NGC/IC ids on deep-sky objects, provisional
 * designations on small bodies, IAU abbreviations on constellations. Without
 * these, "HD 48915" and "67P" find nothing.
 */
function buildIdentifierMap(): Map<string, string[]> {
  const map = new Map<string, string[]>();
  const add = (entityId: string | undefined, values: (string | undefined | null)[]) => {
    if (!entityId) return;
    const list = map.get(entityId) ?? [];
    for (const v of values) if (v) list.push(String(v));
    if (list.length) map.set(entityId, list);
  };

  const e = engine as unknown as Record<string, { all?: () => unknown[] }>;
  const rows = (key: string): Record<string, unknown>[] => {
    const eng = e[key];
    if (!eng || typeof eng.all !== "function") return [];
    try {
      return (eng.all() ?? []) as Record<string, unknown>[];
    } catch {
      return [];
    }
  };

  // Stars: HIP / HD / HR / Gliese, plus the Bayer-or-Flamsteed scientific name
  // and the three-letter constellation abbreviation.
  for (const r of rows("star")) {
    const ids = (r.ids ?? {}) as Record<string, string>;
    add(r.id as string, [
      ids.hip && `HIP ${ids.hip}`,
      ids.hd && `HD ${ids.hd}`,
      ids.hr && `HR ${ids.hr}`,
      ids.gliese,
      r.scientificName as string,
      // NOT constellationAbbr: it is the constellation's identifier, not the
      // star's, and aliasing all ~180 Orion stars to "Ori" makes the query
      // "Ori" return 180 exact-identifier matches and no constellation.
    ]);
  }

  // Deep sky: Messier / NGC / IC and any catalogue ids the record carries.
  for (const r of rows("deepSky")) {
    const ids = (r.ids ?? {}) as Record<string, string>;
    const extra: string[] = [];
    for (const [k, v] of Object.entries(ids)) {
      if (!v) continue;
      const raw = String(v).trim();
      if (!raw) continue;
      const label = k.toLowerCase();
      // Records store these inconsistently — some as a bare number ("31"),
      // some already prefixed ("NGC 6992"). Emitting `${PREFIX} ${raw}`
      // unconditionally produced "NGC NGC 6992", so strip an existing prefix
      // first and always publish both the bare and prefixed forms.
      const bare = raw.replace(/^(m|messier|ngc|ic|c|caldwell)\s*/i, "");
      if (label === "messier") extra.push(`M${bare}`, `Messier ${bare}`);
      else if (label === "ngc") extra.push(`NGC ${bare}`);
      else if (label === "ic") extra.push(`IC ${bare}`);
      else if (label === "caldwell") extra.push(`C${bare}`, `Caldwell ${bare}`);
      else extra.push(raw);
    }
    add(r.id as string, extra);
  }

  // Small bodies and everything else carrying altNames / designations.
  for (const key of [
    "comets", "asteroids", "meteorites", "interstellarObjects", "satellites",
    "launchVehicles", "humanSpaceflight", "missionOperations", "timeDomain",
    "dataArchives", "observatories", "observatoryFrontier", "astrochemistry", "spacePolicy",
    "astroinformatics", "solarPhysics", "skyCatalogs", "deepSkyEncyclopedia",
    "observationTechniques", "scientificAssistant", "liveScientificData",
  ]) {
    for (const r of rows(key)) {
      const alt = (r.altNames ?? []) as string[];
      add(r.id as string, [
        ...(Array.isArray(alt) ? alt : []),
        r.designation as string,
        r.abbrev as string,
        r.abbreviation as string,
        r.symbolLabel as string,
      ]);
    }
  }

  // Constellations: the IAU three-letter abbreviation and genitive form.
  for (const r of rows("constellations")) {
    add(r.id as string, [r.abbr as string, r.genitive as string]);
  }

  // Missions and programmes often go by an abbreviation only.
  for (const r of rows("exploration")) {
    add(r.id as string, [r.abbreviation as string]);
  }

  return map;
}

/* ---------------------------------------------------- priority model */

/**
 * Editorial priority, 0–100.
 *
 * This is NOT a popularity score. The platform has no traffic data and
 * inventing one would be fabrication. It encodes one thing only: how canonical
 * a page is for its own name, so that a hub outranks a leaf and a named object
 * outranks an anonymous catalogue row of the same name.
 */
const TYPE_PRIORITY: Record<string, number> = {
  planet: 95, dwarf_planet: 90, moon: 88, star: 60, galaxy: 82, nebula: 82,
  star_cluster: 80, constellation: 85, exoplanet: 62, host_star: 55,
  planetary_system: 52, space_mission: 84, launch_vehicle: 80, spacecraft: 80,
  space_telescope: 88, telescope: 82, observatory: 82, astronaut: 78,
  comet: 84, asteroid: 76, meteorite: 74, astronomer: 80, black_hole: 86,
  neutron_star: 84, scientific_calculator: 78, meteor_shower: 80,
  astrology_sign: 70, mythology_figure: 68, organization: 70,
};

function entityPriority(type: string, hasEntry: boolean): number {
  const base = TYPE_PRIORITY[type] ?? 50;
  // An entity with its own editorial page is more canonical than a bare
  // catalogue row of the same type.
  return Math.min(100, hasEntry ? base + 8 : base);
}

/* ------------------------------------------------------------ build */

/**
 * Collapse documents that resolve to the same canonical URL.
 *
 * A named object usually appears twice: once as a graph entity and once as the
 * editorial entry that owns the same page (Jupiter is both `entity:planet:jupiter`
 * and the entry at `/astronomy/planets/jupiter`). Shipping both would put two
 * identical rows in the results and split their identifiers across them, so
 * they are merged: the highest-priority document wins the title and kind, and
 * the aliases of every duplicate are unioned onto it.
 */
function dedupeByUrl(docs: SearchDoc[]): SearchDoc[] {
  const byUrl = new Map<string, SearchDoc>();
  for (const doc of docs) {
    const existing = byUrl.get(doc.u);
    if (!existing) {
      byUrl.set(doc.u, { ...doc });
      continue;
    }
    const winner = doc.p > existing.p ? { ...doc } : existing;
    const loser = doc.p > existing.p ? existing : doc;
    winner.a = cleanAliases(winner.t, [...(winner.a ?? []), ...(loser.a ?? []), loser.t]);
    // Keep whichever description exists; prefer the winner's own.
    winner.d = winner.d ?? loser.d;
    // A page is cultural if either record says so — never quietly drop the flag.
    if (loser.c === 1 || existing.c === 1) winner.c = 1;
    byUrl.set(doc.u, winner);
  }
  return [...byUrl.values()];
}

export function buildSearchDocs(): SearchDoc[] {
  const docs: SearchDoc[] = [];
  const identifiers = buildIdentifierMap();

  /* graph entities — the bulk of the corpus */
  for (const entity of getAllGraphEntities()) {
    const href = entityGraphPath(entity);
    docs.push({
      i: `e:${entity.id}`,
      t: entity.name,
      u: href,
      k: ENTITY_TYPE_LABELS[entity.type] ?? entity.type,
      g: groupForEntityType(entity.type),
      d: trim(entity.description),
      a: cleanAliases(
        entity.name,
        expandDesignations([...(entity.aliases ?? []), ...(identifiers.get(entity.id) ?? [])]),
        entity.type,
      ),
      p: entityPriority(entity.type, Boolean(entity.entryPath)),
      ...(isCulturalType(entity.type) || entity.domain === "astrology" ? { c: 1 as const } : {}),
    });
  }

  /* editorial entries */
  for (const entry of getAllEntries()) {
    docs.push({
      i: `n:${entry.path}`,
      t: entry.title,
      u: entry.path,
      k: entry.kind === "interpretive" ? "Cultural entry" : "Article",
      g: entry.section === "astrology" ? "history" : entry.section === "guides" ? "guides" : "reference",
      d: trim(entry.excerpt || entry.description),
      a: cleanAliases(entry.title, entry.tags),
      p: 86,
      ...(entry.kind === "interpretive" || entry.kind === "cultural" ? { c: 1 as const } : {}),
    });
  }

  /* section hubs and topic categories */
  for (const section of getAllSections()) {
    docs.push({
      i: `h:${section.slug}`,
      t: section.name,
      u: sectionPath(section),
      k: "Knowledge hub",
      g: section.slug === "astrology" ? "history" : section.slug === "guides" ? "guides" : "reference",
      d: trim(section.tagline),
      p: 96,
      ...(section.kind === "interpretive" ? { c: 1 as const } : {}),
    });
  }
  for (const { section, category } of getAllCategories()) {
    const cultural = section.kind === "interpretive" || Boolean(category.interpretive);
    docs.push({
      i: `c:${section.slug}/${category.slug}`,
      t: category.name,
      u: categoryPath(section, category),
      k: `${section.name} topic`,
      g: categoryGroup(section.slug, cultural),
      d: trim(category.summary),
      a: cleanAliases(category.name, category.keywords ?? []),
      p: 92,
      ...(cultural ? { c: 1 as const } : {}),
    });
  }

  /* discovery, learning, timelines, comparisons */
  for (const t of TOPICS) {
    docs.push({ i: `t:${t.slug}`, t: t.title, u: topicPath(t.slug), k: "Explore topic", g: "reference", d: trim(t.description), p: 74 });
  }
  for (const p of LEARNING_PATHS) {
    docs.push({ i: `l:${p.slug}`, t: p.title, u: learnPath(p.slug), k: "Learning path", g: "guides", d: trim(p.description), p: 88 });
  }
  for (const t of TIMELINES) {
    docs.push({ i: `m:${t.slug}`, t: t.title, u: timelinePath(t.slug), k: "Timeline", g: "history", d: trim(t.description), p: 80 });
  }
  for (const c of COMPARISONS) {
    docs.push({ i: `p:${c.slug}`, t: c.title, u: comparePath(c.slug), k: "Comparison", g: "tools", d: trim(c.description), p: 76 });
  }

  /* datasets and the open-data surface */
  for (const d of DATASETS) {
    docs.push({ i: `d:${d.slug}`, t: d.title, u: datasetPath(d.slug), k: "Dataset", g: "data", d: trim(d.description), p: 78 });
  }

  /* platform destinations that are pages in their own right */
  for (const [title, url, kind, group, desc] of PLATFORM_PAGES) {
    const a = PLATFORM_PAGE_ALIASES[url];
    docs.push({ i: `x:${url}`, t: title, u: url, k: kind, g: group, d: desc, p: 90, ...(a ? { a } : {}) });
  }

  return disambiguate(dedupeByUrl(docs));
}

/**
 * Make same-titled rows tellable apart.
 *
 * Two deep-sky records both called "Eastern Veil", or two stars both called
 * "41 Orionis", render as identical rows and a visitor cannot tell which one
 * they are about to open. Where the title, kind and description all collide,
 * the strongest catalogue identifier the record already carries is promoted
 * into the kind label — real data the row already holds, never an invented
 * distinction. If no identifier exists to separate them, the rows are left
 * alone and `search:validate` fails, so the ambiguity surfaces at build time
 * rather than in front of a reader.
 */
function disambiguate(docs: SearchDoc[]): SearchDoc[] {
  const byKey = new Map<string, SearchDoc[]>();
  for (const doc of docs) {
    const key = `${doc.t.toLowerCase()}|${doc.k}|${doc.d ?? ""}`;
    const arr = byKey.get(key);
    if (arr) arr.push(doc);
    else byKey.set(key, [doc]);
  }
  for (const group of byKey.values()) {
    if (group.length < 2) continue;
    // Count how often each alias occurs across the colliding rows. "41 Ori" is
    // carried by both 41 Orionis records and therefore separates nothing; only
    // an alias unique to one row can act as a disambiguator.
    const frequency = new Map<string, number>();
    for (const doc of group) {
      for (const alias of new Set(doc.a ?? [])) {
        frequency.set(alias, (frequency.get(alias) ?? 0) + 1);
      }
    }
    for (const doc of group) {
      const marker = (doc.a ?? []).find((a) => frequency.get(a) === 1 && /\d/.test(a));
      if (marker) doc.k = `${doc.k} · ${marker}`;
    }
  }
  return docs;
}

function categoryGroup(sectionSlug: string, cultural: boolean): SearchGroupId {
  if (cultural) return "history";
  if (sectionSlug === "guides") return "guides";
  if (sectionSlug === "calculators") return "tools";
  if (sectionSlug === "observatory") return "data";
  if (sectionSlug === "sky-guide") return "solar-system";
  return "reference";
}

/**
 * Hand-listed platform destinations. These are real routes with no registry of
 * their own; each is checked against the sitemap by the validator, so a renamed
 * route fails the build rather than shipping a dead search result.
 */
/**
 * Search vocabulary for pages whose subject people name differently from their title. Someone
 * looking for the aurora forecast types "aurora" or "northern lights", not "Aurora forecast"; the
 * geomagnetic page is what they mean by "Kp". Aliases are matched by the same tier ladder as titles,
 * so these make the live surfaces findable without inflating any other page's ranking.
 */
const PLATFORM_PAGE_ALIASES: Record<string, string[]> = {
  "/space-weather": ["solar storm", "sun activity", "heliophysics live", "SWPC", "NOAA space weather"],
  "/space-weather/live": ["current space weather", "space weather today", "live space weather"],
  "/space-weather/solar-wind": ["Bz", "IMF", "interplanetary magnetic field", "DSCOVR", "L1", "proton density"],
  "/space-weather/geomagnetic": ["Kp", "Kp index", "planetary K-index", "geomagnetic storm", "G1", "G2", "G3", "G4", "G5", "geomagnetic forecast"],
  "/space-weather/solar-activity": ["solar flare", "X-class flare", "M-class flare", "sunspots", "active regions", "F10.7", "solar radio flux"],
  "/space-weather/aurora": ["aurora", "aurora borealis", "aurora australis", "northern lights", "southern lights", "OVATION"],
  "/space-weather/events": ["CME", "coronal mass ejection", "solar events", "DONKI", "SEP", "solar energetic particles", "proton event"],
};

const PLATFORM_PAGES: [string, string, string, SearchGroupId, string][] = [
  // NOTE: /search is deliberately absent. It serves `noindex, follow`, it is
  // reachable from the header on every page, and indexing the search page
  // inside search itself is circular.
  ["Solar System", ROUTES.solarSystem, "Encyclopedia", "solar-system", "Every planet, moon, and small body with measured data."],
  ["Stars", ROUTES.stars, "Encyclopedia", "stars-exoplanets", "Catalogued stars with measured parameters and provenance."],
  ["Deep sky", ROUTES.deepSky, "Encyclopedia", "deep-sky", "Messier, NGC, IC and Caldwell objects with catalogue data."],
  ["Exoplanets", ROUTES.exoplanets, "Encyclopedia", "stars-exoplanets", "Archive-sourced planets and their host stars."],
  ["Space exploration", ROUTES.exploration, "Encyclopedia", "missions", "Missions, programmes, and agencies as catalogued entities."],
  ["Constellations", ROUTES.constellations, "Encyclopedia", "deep-sky", "All 88 IAU constellations with boundaries and bright stars."],
  ["Observatories", ROUTES.observatories, "Encyclopedia", "observatories", "Ground and space observatories with their instruments."],
  ["Entity index", ROUTES.entityIndex, "Platform", "reference", "Every catalogued entity on the platform, by type."],
  ["Topic index", ROUTES.topicIndex, "Platform", "reference", "Every topic, grouped."],
  ["Explore", ROUTES.explore, "Platform", "reference", "Browse the knowledge graph by topic."],
  ["Open data", ROUTES.openData, "Platform", "data", "Downloadable exports of the platform's catalogues."],
  ["Datasets", ROUTES.datasets, "Platform", "data", "Every published dataset with provenance."],
  ["Developers", ROUTES.developers, "Platform", "data", "API documentation and integration guides."],
  ["API reference", ROUTES.developersApi, "Platform", "data", "The v0 read-only HTTP API."],
  // NOTE: /authority/data-health and its sub-pages are real, indexable pages
  // with canonical metadata, but they are absent from the sitemap. Search only
  // points at published routes — `search:validate` enforces that — so they are
  // deliberately NOT indexed here. Adding them is a sitemap decision, not a
  // search one.
  ["Authority dashboard", ROUTES.authority, "Platform", "data", "Source, review, and provenance coverage."],
  ["Transparency", ROUTES.transparency, "Platform", "reference", "How the platform records evidence and uncertainty."],
  ["Editorial policy", ROUTES.editorialPolicy, "Platform", "reference", "What this platform will and will not publish."],
  ["Sources policy", ROUTES.sourcesPolicy, "Platform", "reference", "How sources and licences are handled."],
  ["Image archive", ROUTES.images, "Platform", "data", "Licensed imagery with verified provenance."],
  ["Galleries", "/gallery", "Platform", "data", "Curated image collections by subject."],
  ["Learning paths", ROUTES.learn, "Platform", "guides", "Structured multi-step routes through the platform."],
  ["Calculators", "/calculators", "Platform", "tools", "Executable scientific calculators with formulae."],
  ["Sky tonight", "/sky", "Platform", "solar-system", "Computed sky reference and observing conditions."],
  ["Graph explorer", "/graph", "Platform", "reference", "Traverse the knowledge graph directly."],
  ["Workspace", "/workspace", "Platform", "tools", "Local-first research workspace."],
  ["Assistant", "/assistant", "Platform", "tools", "Deterministic, grounded question answering."],
  ["Universe in 3D", "/universe-3d", "Platform", "tools", "Interactive three-dimensional model."],
  ["Sky atlas", "/sky-atlas", "Platform", "deep-sky", "Charts, catalogues, and coordinate frames."],
  ["Timelines", ROUTES.timelines, "Platform", "history", "Chronological threads through astronomy."],
  ["Compare", ROUTES.compare, "Platform", "tools", "Side-by-side entity comparisons."],
  ["About", ROUTES.about, "Platform", "reference", "What Asteria Star is and how it is built."],
  // Space weather (Program CJ). Live surfaces, indexed as the stable pages they are — the values
  // change by the minute, the destinations never do.
  ["Space weather", ROUTES.spaceWeather, "Live data", "tools", "Live solar wind, geomagnetic activity, flares and aurora from NOAA and NASA."],
  ["Space weather now", "/space-weather/live", "Live data", "tools", "Current conditions: solar wind, Kp index, NOAA scales, alerts, flares and aurora."],
  ["Solar wind", "/space-weather/solar-wind", "Live data", "tools", "Live solar wind speed, density and interplanetary magnetic field measured at L1."],
  ["Geomagnetic activity", "/space-weather/geomagnetic", "Live data", "tools", "Planetary Kp index observed and forecast, storm levels, and NOAA watches and warnings."],
  ["Solar activity", "/space-weather/solar-activity", "Live data", "tools", "GOES X-ray flares, active regions, sunspots and the 10.7 cm radio flux."],
  ["Aurora forecast", "/space-weather/aurora", "Live data", "tools", "NOAA OVATION aurora model: how far towards the equator the auroral oval reaches."],
  ["Space weather events", "/space-weather/events", "Live data", "tools", "Catalogued solar flares, coronal mass ejections, geomagnetic storms and particle events."],
];
