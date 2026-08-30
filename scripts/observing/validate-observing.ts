import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { tonight } from "../../src/platform/live-sky/tonight";
import { buildObservingPlan } from "../../src/platform/observing/plan";
import { parseMetForecast, metForecastUrl, cloudDuring, describeCloud, COORDINATE_DECIMALS, MET_HOST } from "../../src/platform/observing/weather";
import { LIVE_PRODUCTS, LIVE_PROVIDERS, getLiveProvider } from "../../src/platform/live-providers/registry";
import { locationCacheControl } from "../../src/platform/space-weather/api";
import { LIVE_DASHBOARD_SLUGS } from "../../src/lib/routes";
import { sources as liveSources } from "../../src/knowledge-graph/data/live-data-catalog/data/sources";

/**
 * The permanent observing gate (Program CN).
 *
 * Offline, deterministic, and part of `npm run validate`. It exists for one reason above all others:
 * this platform makes a privacy promise that is enforced by ARCHITECTURE — the observer's location
 * is used in their own browser and never sent to this site — and an architectural promise decays the
 * moment somebody adds a convenient server call. A promise in a paragraph cannot notice that. A gate
 * can.
 *
 * The second job is the weather boundary. Exactly one weather quantity is connected, total cloud
 * cover, and the whole integration is only defensible while nothing renames it as astronomical
 * seeing or transparency. That is checked as a rule rather than left to reviewers' memory.
 */

const problems: string[] = [];
const notes: string[] = [];
const fail = (message: string): void => void problems.push(message);

const ROOT = resolve(process.cwd());

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(ts|tsx)$/.test(full)) out.push(full);
  }
  return out;
}

/* ------------------------------------------------------------------ 1. location privacy */

/**
 * The APIs that would obtain a location without the reader typing it, and the stores that would keep
 * one after they left. None of them may appear anywhere in the observing surfaces.
 */
/**
 * Two classes of rule, because they have different scopes.
 *
 * `always` has no legitimate use anywhere on this platform: nothing may ask the browser where the
 * reader is, or look it up from their address.
 *
 * `whenHandlingLocation` is about persistence, and persistence is not forbidden in general — the
 * Workspace deliberately keeps notes and collections in `localStorage`, which is its whole point.
 * What must never happen is a file that handles COORDINATES also writing to a store. Scoping the
 * rule this way is what lets it apply to the entire source tree instead of a hand-kept list of
 * folders, which is how the first version came to have holes.
 */
const FORBIDDEN = [
  { pattern: /navigator\s*\.\s*geolocation/, why: "asks the browser for the reader's position", scope: "always" as const },
  { pattern: /getCurrentPosition|watchPosition/, why: "reads the device's position", scope: "always" as const },
  { pattern: /\bipapi\b|ip-api|ipinfo|geoip/i, why: "would infer a location from an IP address", scope: "always" as const },
  { pattern: /localStorage|sessionStorage|indexedDB/, why: "handles coordinates and writes to browser storage", scope: "whenHandlingLocation" as const },
  { pattern: /document\s*\.\s*cookie/, why: "handles coordinates and writes a cookie", scope: "whenHandlingLocation" as const },
];

/** A file that names a coordinate is one where a persistence call could retain a location. */
const HANDLES_LOCATION = /\blatitude\b|\blongitude\b|latitudeDeg|longitudeDeg|\bcoordinates\b/i;

/*
 * EVERY file under `src/`, not a hand-kept list of directories.
 *
 * The first version named five folders, which meant the rule stopped applying the moment anyone
 * added a sixth: a client component dropped into `src/components/observing/` combining a
 * `localStorage` write, a third-party fetch and `getCurrentPosition` passed cleanly. A privacy gate
 * scoped by paths is a gate with an unbounded set of holes, and the holes are created by ordinary
 * work rather than by anyone trying.
 */
const ALL_SOURCE = walk(join(ROOT, "src"));

/** Comments are stripped so a rule can be DESCRIBED in the file it governs without self-tripping. */
function codeOf(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

/**
 * As `codeOf`, with string and template literals emptied too.
 *
 * Prose is what the platform SAYS, and several files say a great deal about localStorage and about
 * coordinates without touching either — `llms.txt` describes the Workspace's storage in one
 * paragraph and observing coordinates in another, and tripped a rule about doing both. What these
 * rules are looking for is an identifier being used, which survives this and a sentence does not.
 */
function identifiersOf(source: string): string {
  return codeOf(source)
    .replace(/`(?:\\.|[^`\\])*`/g, "``")
    .replace(/"(?:\\.|[^"\\])*"/g, '""')
    .replace(/'(?:\\.|[^'\\])*'/g, "''");
}

for (const file of ALL_SOURCE) {
  const source = readFileSync(file, "utf8");
  const code = codeOf(source);
  const identifiers = identifiersOf(source);
  const handlesLocation = HANDLES_LOCATION.test(identifiers);
  for (const { pattern, why, scope } of FORBIDDEN) {
    // The "always" rules read the code including its strings — a geolocation call built from a
    // string would still be a geolocation call. The scoped ones read identifiers only.
    const subject = scope === "always" ? code : identifiers;
    if (scope === "whenHandlingLocation" && !handlesLocation) continue;
    if (pattern.test(subject)) fail(`privacy: ${relative(ROOT, file)} ${why} (matched ${pattern})`);
  }
}
notes.push(`scanned ${ALL_SOURCE.length} source files for location inference and storage`);

/*
 * The one place a coordinate is allowed to leave the device, and it must be the only one.
 *
 * `fetch(` in a client component is how a coordinate would be shipped somewhere. The weather module
 * is the single sanctioned case; anything else in these directories is a new exfiltration path and
 * has to be a deliberate, reviewed decision rather than an accident.
 */
{
  /*
   * Every way a browser can send bytes somewhere, not just `fetch`.
   *
   * The first version checked `fetch(` alone and, worse, exempted the whole FILE if it mentioned
   * `fetchCloudForecast` — so the one component that holds the reader's coordinates had a permanent
   * licence to call anything. Both holes were demonstrated: a `fetch` to a collector inside
   * `TonightPlanner` passed, and so did `navigator.sendBeacon` and `new Image().src` anywhere.
   * `sendBeacon` is precisely the "sent to analytics" case the promise names.
   *
   * The exemption is now for the sanctioned CALL, which is removed from the text before the search
   * runs, rather than for any file that happens to mention it.
   */
  const OUTBOUND = [
    { pattern: /\bfetch\s*\(/, what: "fetch()" },
    { pattern: /navigator\s*\.\s*sendBeacon/, what: "navigator.sendBeacon()" },
    { pattern: /new\s+XMLHttpRequest|\.open\s*\(\s*["'`](?:GET|POST)/, what: "XMLHttpRequest" },
    { pattern: /new\s+WebSocket/, what: "a WebSocket" },
    { pattern: /new\s+EventSource/, what: "an EventSource" },
    { pattern: /new\s+Image\s*\([^)]*\)\s*\.\s*src|\.src\s*=\s*`https?:/, what: "an image beacon" },
    { pattern: /import\s*\(\s*[`"']https?:/, what: "a dynamic import from a URL" },
  ];
  let clientComponents = 0;
  for (const file of ALL_SOURCE) {
    const source = readFileSync(file, "utf8");
    if (!/^["']use client["']/.test(source)) continue;
    clientComponents += 1;
    // The sanctioned call is excised, so what remains is everything ELSE the file does.
    const code = codeOf(source).replace(/fetchCloudForecast\s*\([^)]*\)/g, "SANCTIONED_CLOUD_FORECAST");
    for (const { pattern, what } of OUTBOUND) {
      if (pattern.test(code)) {
        // The search index and the assistant are the platform's own same-origin components and
        // handle no location; they are named rather than pattern-matched so the exception is visible.
        const allowed = /components\/(search|assistant)\//.test(relative(ROOT, file));
        if (!allowed) {
          fail(`privacy: ${relative(ROOT, file)} uses ${what} from a client component; the only sanctioned outbound call from a browser is the cloud forecast`);
        }
      }
    }
  }
  notes.push(`checked ${clientComponents} client components for every way a browser can send bytes out`);
}

/*
 * No observing route may take a coordinate from the URL.
 *
 * The first version tested the five-element `LIVE_DASHBOARD_SLUGS` array for `?` and `&`, which a
 * Next route segment can never contain — so the rule could not fire, and a real
 * `src/app/live/tonight/[lat]/[lon]/page.tsx` reading coordinates out of the path passed it. What
 * has to be checked is the route tree on disk: a DYNAMIC segment under these roots is a place a
 * location could be put into a URL, and there is no legitimate reason for one.
 */
for (const root of ["src/app/live", "src/app/sky", "src/app/satellites", "src/app/events"]) {
  const full = join(ROOT, root);
  let entries: string[];
  try {
    entries = walk(full);
  } catch {
    fail(`privacy: ${root} does not exist, so this rule is checking nothing`);
    continue;
  }
  for (const file of entries) {
    const route = relative(ROOT, file);
    const segments = route.split("/").filter((part) => /^\[.+\]$/.test(part));
    for (const segment of segments) {
      const name = segment.replace(/[[\].]/g, "").toLowerCase();
      if (/lat|lon|lng|coord|place|location|site|position/.test(name)) {
        fail(`privacy: ${route} has a dynamic route segment "${segment}" that would put a location in a URL`);
      }
    }
  }
}

/*
 * The dashboard segments sit alongside `/live/[slug]`, the provider pages. A provider whose slug
 * collided with one would be unreachable — Next resolves the static segment first — and the
 * provider's page would vanish with no error anywhere.
 */
for (const record of liveSources) {
  if ((LIVE_DASHBOARD_SLUGS as readonly string[]).includes(record.slug)) {
    fail(`routing: the provider slug "${record.slug}" collides with a live-dashboard segment and its page would be unreachable`);
  }
}

/*
 * A response that echoes the caller's own coordinates must never be stored in a shared cache.
 *
 * These four routes take a latitude and a longitude. Their answers are deterministic and would be
 * cacheable in the abstract — which is exactly why they were `public` — but the cache key is a URL
 * containing somebody's observing location, and a CDN holding that, keyed by it, is retention by
 * another name. The website no longer calls them at all; they remain for people writing their own
 * software.
 */
/*
 * The policy is one shared FUNCTION, and the function is executed here.
 *
 * The first version searched each route file for the string "private, no-store", which is not the
 * same thing and was demonstrably vacuous: the Moon route contained the phrase in a branch that
 * could never run, so the location-aware response went on being cached publicly for a day while the
 * gate reported success. Importing a Next route handler into an offline gate pulls the whole server
 * runtime, so the decision was moved out of the four routes into `locationCacheControl` — one place
 * to get right, one place to test, and no way for a route to diverge without saying so.
 */
{
  const withLocation = locationCacheControl(true, 3600);
  if (!/no-store/.test(withLocation) || /\bpublic\b/.test(withLocation)) {
    fail(`privacy: a response carrying coordinates would be sent with "cache-control: ${withLocation}", which lets a shared cache keep an observer's location`);
  }
  if (!/public/.test(locationCacheControl(false, 3600))) {
    fail("privacy: a response carrying no location at all is no longer publicly cacheable, which is a different kind of wrong");
  }
  // Every location API must go through it, and none may write a policy of its own.
  for (const route of ["sun", "moon", "planets", "tonight"]) {
    const file = join(ROOT, `src/app/api/v0/live-sky/${route}/route.ts`);
    let source: string;
    try {
      source = readFileSync(file, "utf8");
    } catch {
      fail(`privacy: the location API ${route} no longer exists, so this rule is checking nothing`);
      continue;
    }
    const code = codeOf(source);
    if (!/locationCacheControl\(/.test(code)) {
      fail(`privacy: /api/v0/live-sky/${route} does not use the shared location cache policy`);
    }
    if (/cacheControl:\s*["'`]/.test(code)) {
      fail(`privacy: /api/v0/live-sky/${route} writes a cache policy of its own instead of using the shared one`);
    }
  }
  notes.push("checked the shared location cache policy and that all four location APIs use it");
}

/* ------------------------------------------------------------------ 2. the weather boundary */

const weatherSource = readFileSync(join(ROOT, "src/platform/observing/weather.ts"), "utf8");
const planSource = readFileSync(join(ROOT, "src/platform/observing/plan.ts"), "utf8");

/*
 * The plan module must keep cloud cover OUT of the deep-sky verdict. Folding a forecast into a
 * geometric band is the exact mistake this integration exists not to make: a clear sky does not make
 * a full Moon dark, and an overcast one does not change the geometry.
 */
{
  const code = planSource.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
  const start = code.indexOf("function deepSky(");
  const end = code.indexOf("\nexport interface PlanInputs", start);
  if (start < 0 || end < 0) fail("weather: the deep-sky function could not be located, so this rule is checking nothing");
  else {
    // String literals are stripped first. The verdict's own wording DENIES cloud in prose — "it says
    // nothing about cloud" — and that sentence must not trip the rule that enforces the denial. What
    // the rule is looking for is a cloud value being read, which is an identifier, not a sentence.
    const body = code
      .slice(start, end)
      .replace(/`(?:\\.|[^`\\])*`/g, "``")
      .replace(/"(?:\\.|[^"\\])*"/g, '""')
      .replace(/'(?:\\.|[^'\\])*'/g, "''");
    if (/cloud/i.test(body)) {
      fail("weather: the deep-sky band reads a cloud value; it must be derived from darkness and moonlight only");
    }
  }
}
if (!/plan\.cloud|cloud\?:/.test(planSource)) fail("weather: the plan no longer carries cloud cover as a separate field");

/**
 * Cloud cover is cloud cover.
 *
 * These words name quantities this platform does not have, produced by models it does not read. A
 * derivation of any of them from `cloud_area_fraction` would be a fabricated measurement wearing a
 * real one's name — so they may be MENTIONED, in prose that denies them, and never assigned.
 */
for (const banned of ["seeing", "transparency", "bortle"]) {
  const assignment = new RegExp(`\\b${banned}\\w*\\s*[:=]`, "i");
  if (assignment.test(weatherSource.replace(/\/\*[\s\S]*?\*\//g, ""))) {
    fail(`weather: the cloud-cover module assigns something called "${banned}", which is not a quantity it has`);
  }
}

if (!/cloud_area_fraction/.test(weatherSource)) fail("weather: the module no longer reads the provider's cloud-cover field by name");
if (!weatherSource.includes('!== "%"')) fail("weather: the module no longer checks the provider's published unit for cloud cover");
if (!new RegExp(`toFixed\\(COORDINATE_DECIMALS\\)`).test(weatherSource)) {
  fail("weather: coordinates are no longer rounded before they are sent to the provider");
}
if (COORDINATE_DECIMALS > 2) fail(`weather: coordinates are sent with ${COORDINATE_DECIMALS} decimals, which is finer than the forecast resolves and finer than a reader expects`);
if (!metForecastUrl(51.4779123, -0.0015987).startsWith(`https://${MET_HOST}/`)) fail("weather: the forecast URL is no longer the provider's own host");
if (metForecastUrl(51.4779123, -0.0015987).includes("51.4779")) fail("weather: the unrounded latitude reached the request URL");

/*
 * A CONNECTED provider must not still be described as absent, anywhere.
 *
 * This is the failure mode this platform keeps repeating: a provider gets connected and the eight
 * other places that said it was not go on saying it, sometimes for two programs. The gate above was
 * written to guard the observing surfaces and would have caught none of them, because they are in
 * discovery blurbs, a navigation description, an aurora page and `llms.txt`.
 *
 * So the rule is inverted. Rather than listing the places to check — which is the same mistake in a
 * different form — it takes the phrases that CLAIM absence and forbids them across the whole source
 * tree for as long as the provider is actually connected. Disconnect the provider and the phrases
 * become legal again, automatically.
 */
{
  const met = getLiveProvider("met-norway");
  if (met?.integration === "IMPLEMENTED") {
    const CLAIMS_OF_ABSENCE = [
      /no connected weather provider/i,
      /awaiting a licence-safe (?:open )?provider/i,
      /no licence-safe (?:open )?provider is connected/i,
      /no licence-safe provider of weather/i,
      /architecture-ready weather/i,
      /weather[^.]{0,40}awaits? a connected provider/i,
    ];
    const files = walk(join(ROOT, "src"));
    for (const file of files) {
      const source = readFileSync(file, "utf8");
      for (const claim of CLAIMS_OF_ABSENCE) {
        const match = claim.exec(source);
        if (match) {
          fail(`stale claim: ${relative(ROOT, file)} says "${match[0]}" while MET Norway is connected end-to-end`);
        }
      }
    }
    notes.push(`scanned ${files.length} source files for claims that weather is unconnected`);
  }
}

/* ------------------------------------------------------------------ 3. the plan is honest */

const NOW = new Date("2026-11-15T22:00:00Z");
const CASES: { name: string; latitude: number; longitude: number }[] = [
  { name: "Greenwich", latitude: 51.4779, longitude: -0.0015 },
  { name: "Tromsø (polar)", latitude: 69.65, longitude: 18.96 },
  { name: "Sydney (southern)", latitude: -33.87, longitude: 151.21 },
  { name: "Quito (equatorial)", latitude: -0.18, longitude: -78.47 },
  { name: "South Pole", latitude: -89.9, longitude: 0 },
];

for (const location of CASES) {
  const result = tonight.forLocationDate({ latitude: location.latitude, longitude: location.longitude }, NOW);
  if (!result.ok) { fail(`plan: ${location.name} produced no result — ${result.message}`); continue; }
  const data = result.value.data;
  if (!data) { fail(`plan: ${location.name} produced an empty composite`); continue; }
  const plan = buildObservingPlan({ tonight: data });

  // A plan with no weather MUST say so, every time. This is the sentence that stops a dark-sky
  // verdict being read as a forecast.
  if (!plan.excluded.some((x) => /cloud cover/i.test(x))) {
    fail(`plan: ${location.name} does not state that cloud cover is absent`);
  }
  if (!plan.excluded.some((x) => /seeing/i.test(x))) fail(`plan: ${location.name} does not state that seeing is not modelled`);
  if (!plan.excluded.some((x) => /light pollution/i.test(x))) fail(`plan: ${location.name} does not state that light pollution is not modelled`);
  // The verdict must always name what it is a verdict about.
  if (!/darkness and moonlight only/i.test(plan.deepSky.reason)) {
    fail(`plan: ${location.name}'s deep-sky reasoning does not say it is about darkness and moonlight only`);
  }
  if (/\bforecast\b/i.test(plan.deepSky.headline)) fail(`plan: ${location.name}'s deep-sky headline calls a geometric statement a forecast`);
  if (plan.darknessMinutes < 0 || plan.darknessMinutes > 1440) fail(`plan: ${location.name} reports ${plan.darknessMinutes} minutes of darkness`);
  if (plan.bestWindow && plan.bestWindow.minutes <= 0) fail(`plan: ${location.name} reports a window of ${plan.bestWindow.minutes} minutes`);
  // No darkness must mean no dark-sky verdict above "none".
  if (!data.summary.darknessAvailable && plan.deepSky.band !== "none") {
    fail(`plan: ${location.name} has no astronomical darkness but reports band "${plan.deepSky.band}"`);
  }
}
notes.push(`built an observing plan for ${CASES.length} locations from the pole to the equator`);

/* ------------------------------------------------------------------ 4. the cloud parser */

const FORECAST = {
  properties: {
    meta: { updated_at: "2026-11-15T21:00:00Z", units: { cloud_area_fraction: "%" } },
    timeseries: Array.from({ length: 12 }, (_, i) => ({
      time: new Date(Date.UTC(2026, 10, 15, 21 + i)).toISOString(),
      data: { instant: { details: { cloud_area_fraction: i * 8, air_temperature: 5, relative_humidity: 80, wind_speed: 3 } } },
    })),
  },
};
const parsed = parseMetForecast(FORECAST, "2026-11-15T21:30:00Z", 51.48, 0);
if (!parsed.ok) fail(`weather: the reference forecast no longer parses — ${parsed.problem}`);
else {
  const summary = cloudDuring(parsed.value, Date.UTC(2026, 10, 15, 22), Date.UTC(2026, 10, 16, 2));
  if (!summary) fail("weather: a window inside the forecast produced no summary");
  else if (summary.samples < 4) fail(`weather: only ${summary.samples} points inside a four-hour window`);
  // A window entirely outside the forecast must produce NOTHING, never an extrapolation.
  if (cloudDuring(parsed.value, Date.UTC(2027, 0, 1), Date.UTC(2027, 0, 2))) {
    fail("weather: a window outside the forecast produced a summary, which can only be an extrapolation");
  }
  for (const [value, expected] of [[0, "clear"], [50, "cloud"], [100, "Overcast"]] as [number, string][]) {
    if (!describeCloud(value).toLowerCase().includes(expected.toLowerCase())) {
      fail(`weather: ${value}% cloud is described as "${describeCloud(value)}"`);
    }
    if (/seeing|transparen/i.test(describeCloud(value))) fail(`weather: the description of ${value}% cloud mentions seeing or transparency`);
  }
}

// A unit change must be refused rather than silently misread by a factor of a hundred.
const rescaled = JSON.parse(JSON.stringify(FORECAST)) as typeof FORECAST;
rescaled.properties.meta.units.cloud_area_fraction = "1";
if (parseMetForecast(rescaled, "x", 0, 0).ok) fail("weather: a change of unit on the cloud field was accepted");

/* ------------------------------------------------------------------ 5. the registry */

const met = getLiveProvider("met-norway");
if (!met) fail("registry: met-norway is not registered");
else {
  if (met.runtime !== "browser") fail("registry: met-norway does not declare that it runs in the browser");
  if (!met.verifiedAt) fail("registry: met-norway claims an implemented integration with no verification date");
  if (LIVE_PRODUCTS.some((p) => p.providerKey === "met-norway")) {
    fail("registry: met-norway registers a server product, which would fetch a reader's location from the server");
  }
  if (!/not astronomical seeing|NOT astronomical seeing/i.test(met.providerCaveat ?? "")) {
    fail("registry: met-norway does not state that cloud cover is not astronomical seeing");
  }
  if (/non-commercial/i.test(met.license)) fail("registry: the connected weather provider carries a non-commercial licence restriction");
}

const browserProviders = LIVE_PROVIDERS.filter((p) => p.runtime === "browser");
if (browserProviders.length !== 1) {
  fail(`privacy: ${browserProviders.length} providers are fetched from the reader's browser; each one is a place a location can leave the device and must be justified individually`);
}

/* ------------------------------------------------------------------ report */

console.log(`Observing gate — ${LIVE_DASHBOARD_SLUGS.length} dashboard routes, ${browserProviders.length} browser-runtime provider.`);
for (const note of notes) console.log(`  · ${note}`);

if (problems.length > 0) {
  console.error(`\n✗ Observing gate failed — ${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  • ${problem}`);
  process.exit(1);
}
console.log("\n✓ Observing gate passed — no location inference, no location storage, one sanctioned outbound call, and cloud cover never renamed.");
