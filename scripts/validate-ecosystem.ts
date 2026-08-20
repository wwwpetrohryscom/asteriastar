/**
 * Ecosystem registry gate.
 *
 * The registry is a list of other people's canonical URLs. A typo here is a
 * broken outbound link on every page of the site, and nothing else in the build
 * would notice — so the shape of every entry is checked here, at build time.
 *
 * Network reachability is deliberately NOT checked by default: app stores and
 * some hosts block datacentre traffic, and a gate that deletes a valid link
 * because Apple rate-limited CI is worse than no gate. Pass --check-network for
 * an advisory sweep that reports but never fails the build.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  ECOSYSTEM_WEBSITES,
  ECOSYSTEM_APPS,
  ECOSYSTEM_CATEGORIES,
  ECOSYSTEM_PROJECTS,
  allEcosystemUrls,
} from "../src/lib/ecosystem/projects";

const failures: string[] = [];
const fail = (m: string) => failures.push(m);

// ---------------------------------------------------------------------------
// 1. The registry must stay dependency-free.
// ---------------------------------------------------------------------------
// It is imported by a component that ships to the browser. One import from the
// knowledge graph would pull megabytes of scientific data into the client
// bundle, and only a production build would reveal it.
const registrySrc = readFileSync(
  join(import.meta.dirname, "..", "src", "lib", "ecosystem", "projects.ts"),
  "utf-8",
);
const imports = registrySrc.match(/^\s*import\s+.*$/gm) ?? [];
if (imports.length > 0) {
  fail(
    `src/lib/ecosystem/projects.ts must have no imports (it reaches the client bundle); found:\n      ${imports.join("\n      ")}`,
  );
}

// ---------------------------------------------------------------------------
// 2. Identity: ids and canonical URLs are unique.
// ---------------------------------------------------------------------------
const seenIds = new Map<string, string>();
for (const p of ECOSYSTEM_PROJECTS) {
  const prev = seenIds.get(p.id);
  if (prev) fail(`duplicate project id "${p.id}" (${prev} and ${p.name})`);
  seenIds.set(p.id, p.name);
  if (!/^[a-z0-9][a-z0-9-]*$/.test(p.id)) fail(`project id "${p.id}" is not a lowercase slug`);
  if (!p.name.trim()) fail(`project "${p.id}" has an empty name`);
}

const seenSiteUrls = new Map<string, string>();
for (const p of ECOSYSTEM_WEBSITES) {
  const prev = seenSiteUrls.get(p.url);
  if (prev) fail(`two websites share the canonical URL ${p.url} (${prev} and ${p.name})`);
  seenSiteUrls.set(p.url, p.name);
}

// ---------------------------------------------------------------------------
// 3. URL shape.
// ---------------------------------------------------------------------------
// Everything must be https, absolute, and free of tracking parameters. The one
// campaign parameter that IS allowed is `pcampaignid`, because it is part of
// the Play Store URLs exactly as the product owner supplied them — stripping it
// would mean not using the canonical URL we were given.
const ALLOWED_QUERY_KEYS = new Set(["id", "pcampaignid"]);
const TRACKING_KEYS = /^(utm_|ref$|referrer$|fbclid$|gclid$|mc_|aff|partner)/i;

function checkUrl(label: string, raw: string) {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    fail(`${label}: "${raw}" is not a valid URL`);
    return;
  }
  if (u.protocol !== "https:") fail(`${label}: ${raw} is not https`);
  if (raw !== raw.trim()) fail(`${label}: ${raw} has surrounding whitespace`);
  for (const key of u.searchParams.keys()) {
    if (TRACKING_KEYS.test(key)) fail(`${label}: ${raw} carries a tracking parameter "${key}"`);
    else if (!ALLOWED_QUERY_KEYS.has(key)) fail(`${label}: ${raw} carries an unexpected query parameter "${key}"`);
  }
  if (u.hash) fail(`${label}: ${raw} has a fragment`);
}

for (const p of ECOSYSTEM_WEBSITES) checkUrl(`website ${p.name}`, p.url);

// ---------------------------------------------------------------------------
// 4. Apps: real store URLs, and one store listing per app.
// ---------------------------------------------------------------------------
const IOS_URL = /^https:\/\/apps\.apple\.com\/(?:[a-z]{2}\/)?app\/(?:[^/]+\/)?id\d+$/;
const PLAY_URL = /^https:\/\/play\.google\.com\/store\/apps\/details\?id=[A-Za-z0-9._]+(?:&pcampaignid=[A-Za-z0-9_]+)?$/;

const seenIos = new Map<string, string>();
const seenPlay = new Map<string, string>();

for (const a of ECOSYSTEM_APPS) {
  if (!a.iosUrl && !a.androidUrl) fail(`app "${a.name}" has no store link at all`);

  if (a.iosUrl !== undefined) {
    if (!a.iosUrl.trim()) fail(`app "${a.name}" has an empty iosUrl — omit the field instead`);
    checkUrl(`app ${a.name} (iOS)`, a.iosUrl);
    if (!IOS_URL.test(a.iosUrl)) fail(`app "${a.name}": ${a.iosUrl} is not a recognisable App Store URL`);
    // The same listing under two app entries means one product was split in two.
    const appleId = a.iosUrl.match(/id(\d+)$/)?.[1];
    if (appleId) {
      const prev = seenIos.get(appleId);
      if (prev) fail(`apps "${prev}" and "${a.name}" point at the same App Store listing id${appleId}`);
      seenIos.set(appleId, a.name);
    }
  }

  if (a.androidUrl !== undefined) {
    if (!a.androidUrl.trim()) fail(`app "${a.name}" has an empty androidUrl — omit the field instead`);
    checkUrl(`app ${a.name} (Android)`, a.androidUrl);
    if (!PLAY_URL.test(a.androidUrl)) fail(`app "${a.name}": ${a.androidUrl} is not a recognisable Google Play URL`);
    const pkg = new URL(a.androidUrl).searchParams.get("id");
    if (pkg) {
      const prev = seenPlay.get(pkg);
      if (prev) fail(`apps "${prev}" and "${a.name}" point at the same Play listing ${pkg}`);
      seenPlay.set(pkg, a.name);
    }
  }

  if (a.websiteUrl !== undefined) {
    checkUrl(`app ${a.name} (website)`, a.websiteUrl);
    // An app's website should be a product we already list, not a new one.
    if (!ECOSYSTEM_WEBSITES.some((w) => w.url === a.websiteUrl)) {
      fail(`app "${a.name}" links to ${a.websiteUrl}, which is not a registered ecosystem website`);
    }
  }
}

// ---------------------------------------------------------------------------
// 5. Categories resolve, and none is declared but unused.
// ---------------------------------------------------------------------------
const categoryIds = new Set(ECOSYSTEM_CATEGORIES.map((c) => c.id));
for (const p of ECOSYSTEM_PROJECTS) {
  if (!categoryIds.has(p.category)) fail(`project "${p.name}" has unknown category "${p.category}"`);
}
for (const c of ECOSYSTEM_CATEGORIES) {
  if (!ECOSYSTEM_PROJECTS.some((p) => p.category === c.id)) fail(`category "${c.id}" has no projects`);
}

// ---------------------------------------------------------------------------
// 6. Every supplied URL, pinned byte-for-byte.
// ---------------------------------------------------------------------------
// These are the exact canonical addresses handed over by the product owners.
// The checks above prove the registry is well-formed; this one proves it is
// still the list we were actually given. A silent edit to any character of any
// URL — a dropped `www.`, `.com` for `.net`, a changed Apple id — fails here.
const EXPECTED_WEBSITES: ReadonlyArray<readonly [string, string]> = [
  ["HELPERG", "https://helperg.com"],
  ["WebmasterID", "https://webmasterid.com"],
  ["Cash Workspace", "https://www.cashworkspace.com"],
  ["Twin Phone", "https://twin-phone.com"],
  ["TalentPartnerID", "https://talentpartnerid.com"],
  ["HRHelperG", "https://hrhelperg.com"],
  ["GeoBusinessIQ", "https://geobusinessiq.com"],
  ["Global City Intelligence", "https://globalcityintelligence.com"],
  ["SocialSportHub", "https://socialsporthub.com"],
  ["AgricultureID", "https://agricultureid.com"],
  ["FaunaHub", "https://faunahub.com"],
  ["BuildDesignHub", "https://builddesignhub.com"],
  ["PrinterArchive", "https://printerarchive.net"],
  ["Virtue & Power", "https://virtueandpower.com"],
  ["AsteriaStar", "https://asteriastar.com"],
  ["Petro Hrys", "https://petrohrys.com"],
  ["PDF Edit & Convert", "https://pdfeditconvert.top"],
  ["eSIMky", "https://esimky.com"],
];

const EXPECTED_APPS: ReadonlyArray<{ name: string; ios?: string; android?: string; website?: string }> = [
  { name: "ZIP", android: "https://play.google.com/store/apps/details?id=com.ziparchivator.zip&pcampaignid=web_share", ios: "https://apps.apple.com/app/id6753772583" },
  { name: "Printer", android: "https://play.google.com/store/apps/details?id=com.helperg.smart.printer", ios: "https://apps.apple.com/app/id6746067890" },
  { name: "Fax", android: "https://play.google.com/store/apps/details?id=com.helperg.fax.app&pcampaignid=web_share", ios: "https://apps.apple.com/app/id6760895885" },
  { name: "PDF", android: "https://play.google.com/store/apps/details?id=com.helperg.editor.documents&pcampaignid=web_share", ios: "https://apps.apple.com/app/id6747341672" },
  { name: "CV Resume", ios: "https://apps.apple.com/app/id6745150815" },
  { name: "Invoice Maker", android: "https://play.google.com/store/apps/details?id=com.helperg.invoicer", ios: "https://apps.apple.com/app/id6747311276" },
  { name: "Pocket Manager", android: "https://play.google.com/store/apps/details?id=com.helperg.money", ios: "https://apps.apple.com/app/id6743084126" },
  { name: "Twin Phone", ios: "https://apps.apple.com/app/id6792280945", website: "https://twin-phone.com" },
];

if (ECOSYSTEM_WEBSITES.length !== EXPECTED_WEBSITES.length) {
  fail(`expected ${EXPECTED_WEBSITES.length} websites, registry has ${ECOSYSTEM_WEBSITES.length}`);
}
for (const [name, url] of EXPECTED_WEBSITES) {
  const entry = ECOSYSTEM_WEBSITES.find((p) => p.name === name);
  if (!entry) fail(`website "${name}" is missing from the registry`);
  else if (entry.url !== url) fail(`website "${name}" is ${entry.url}, expected exactly ${url}`);
}

if (ECOSYSTEM_APPS.length !== EXPECTED_APPS.length) {
  fail(`expected ${EXPECTED_APPS.length} apps, registry has ${ECOSYSTEM_APPS.length}`);
}
for (const want of EXPECTED_APPS) {
  const entry = ECOSYSTEM_APPS.find((a) => a.name === want.name);
  if (!entry) {
    fail(`app "${want.name}" is missing from the registry`);
    continue;
  }
  for (const [field, expected] of [["iosUrl", want.ios], ["androidUrl", want.android], ["websiteUrl", want.website]] as const) {
    const actual = entry[field];
    if (expected === undefined && actual !== undefined) {
      // The brief supplied no URL here. An invented one is a broken link that
      // looks real, which is worse than a missing button.
      fail(`app "${want.name}" has a ${field} (${actual}) but none was ever supplied — it must not be invented`);
    } else if (expected !== undefined && actual !== expected) {
      fail(`app "${want.name}" ${field} is ${actual ?? "missing"}, expected exactly ${expected}`);
    }
  }
}

// ---------------------------------------------------------------------------
// 6. AsteriaStar's own entry must match this site.
// ---------------------------------------------------------------------------
// The directory lists the site it is served from; if the two disagree, one of
// them is wrong.
const selfEntry = ECOSYSTEM_WEBSITES.find((p) => p.id === "asteriastar");
if (!selfEntry) fail("the registry does not list AsteriaStar itself");
else if (selfEntry.url !== "https://asteriastar.com") {
  fail(`the AsteriaStar entry is ${selfEntry.url}, which is not this site's canonical origin`);
}

// ---------------------------------------------------------------------------
// Optional, advisory: are the URLs actually reachable?
// ---------------------------------------------------------------------------
async function checkNetwork() {
  const urls = allEcosystemUrls();
  console.log(`\n[ecosystem] advisory reachability sweep over ${urls.length} URL(s) — never fails the build`);
  const results = await Promise.all(
    urls.map(async (u) => {
      try {
        const res = await fetch(u, { redirect: "follow", headers: { "user-agent": "Mozilla/5.0 (compatible; asteriastar-linkcheck/1.0)" } });
        return { u, status: res.status };
      } catch (err) {
        return { u, status: 0, err: String(err) };
      }
    }),
  );
  for (const r of results) {
    const flag = r.status >= 200 && r.status < 400 ? "ok  " : "note";
    if (flag === "note") console.log(`  ${flag} ${r.status || "ERR"}  ${r.u}${r.err ? ` (${r.err})` : ""}`);
  }
  const bad = results.filter((r) => !(r.status >= 200 && r.status < 400));
  console.log(
    `[ecosystem] ${results.length - bad.length}/${results.length} reachable. ` +
      `Store and CDN hosts routinely refuse datacentre traffic, so a "note" here is a prompt to check by hand, not proof of a dead link.`,
  );
}

async function main() {
  if (failures.length > 0) {
    console.error("✗ Ecosystem registry gate FAILED:\n");
    for (const f of failures) console.error(`  · ${f}`);
    console.error("");
    process.exit(1);
  }

  const byCategory = ECOSYSTEM_CATEGORIES.map(
    (c) => `${c.title}=${ECOSYSTEM_PROJECTS.filter((p) => p.category === c.id).length}`,
  ).join(" · ");
  console.log(
    `✓ Ecosystem registry valid — ${ECOSYSTEM_WEBSITES.length} websites, ${ECOSYSTEM_APPS.length} apps, ` +
      `${allEcosystemUrls().length} outbound URLs, all https, no tracking parameters, ids and listings unique.`,
  );
  console.log(`    ${byCategory}`);

  if (process.argv.includes("--check-network")) await checkNetwork();
}

void main();
