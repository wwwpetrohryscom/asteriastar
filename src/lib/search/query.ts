import {
  compareHits,
  fold,
  foldId,
  rankDoc,
  Tier,
  type Haystacks,
} from "@/lib/search/match";
import {
  SEARCH_GROUPS,
  type SearchDoc,
  type SearchGroupId,
} from "@/lib/search/types";

/**
 * Query evaluation shared by every search surface — the header overlay, the
 * /search page, and the regression tests. Client-safe: no data-layer import,
 * so it can run in the browser bundle without dragging the knowledge graph in.
 */

export interface SearchHit {
  doc: SearchDoc;
  tier: Tier;
}

export interface GroupedResults {
  group: SearchGroupId;
  hits: SearchHit[];
}

export interface SearchOutcome {
  /** the raw query as typed */ query: string;
  hits: SearchHit[];
  grouped: GroupedResults[];
  /** total matches before any display limit */ total: number;
  /** true when the only matches came from the fuzzy tier */ fuzzyOnly: boolean;
}

export const EMPTY_OUTCOME: SearchOutcome = {
  query: "",
  hits: [],
  grouped: [],
  total: 0,
  fuzzyOnly: false,
};

/**
 * Haystacks are derived once per document and cached on a WeakMap keyed by the
 * doc object. Folding ~9,000 titles on every keystroke is the difference
 * between an instant panel and a janky one.
 */
const haystackCache = new WeakMap<SearchDoc, Haystacks>();

function haystacksFor(doc: SearchDoc): Haystacks {
  const cached = haystackCache.get(doc);
  if (cached) return cached;
  const aliases = (doc.a ?? []).map(fold);
  const title = fold(doc.t);
  const desc = doc.d ? fold(doc.d) : "";
  const built: Haystacks = {
    title,
    aliases,
    ids: [foldId(doc.t), ...(doc.a ?? []).map(foldId)],
    desc,
    all: [title, ...aliases, desc].join(" "),
  };
  haystackCache.set(doc, built);
  return built;
}

/** Minimum query length before the index is consulted at all. */
export const MIN_QUERY_LENGTH = 2;

export interface SearchOptions {
  /** hard cap on hits collected, before grouping. */ limit?: number;
  /** restrict to these groups. */ groups?: SearchGroupId[];
  /** restrict to scientific or cultural material. */ nature?: "science" | "cultural";
}

/**
 * Run a query over the index.
 *
 * Two passes: a strict one, then — only if that produced fewer than a handful
 * of hits — a second with fuzzy enabled. Typo tolerance can therefore add
 * results but never displace a stronger match, which is what keeps a query
 * like "mars" from surfacing catalogue rows one edit away from it.
 */
export function runSearch(
  docs: readonly SearchDoc[],
  rawQuery: string,
  options: SearchOptions = {},
): SearchOutcome {
  const limit = options.limit ?? 200;
  const q = fold(rawQuery);
  if (q.length < MIN_QUERY_LENGTH) return { ...EMPTY_OUTCOME, query: rawQuery };
  const qid = foldId(rawQuery);

  const groupFilter = options.groups?.length ? new Set(options.groups) : null;

  function collect(allowFuzzy: boolean): SearchHit[] {
    const out: SearchHit[] = [];
    for (const doc of docs) {
      if (groupFilter && !groupFilter.has(doc.g)) continue;
      if (options.nature === "science" && doc.c === 1) continue;
      if (options.nature === "cultural" && doc.c !== 1) continue;
      const tier = rankDoc(haystacksFor(doc), q, qid, allowFuzzy);
      if (tier !== Tier.None) out.push({ doc, tier });
    }
    return out;
  }

  let hits = collect(false);
  let fuzzyOnly = false;
  // 3 is the threshold at which a visitor is likely looking at a misspelling
  // rather than a narrow-but-correct query.
  if (hits.length < 3) {
    const withFuzzy = collect(true);
    if (withFuzzy.length > hits.length) {
      fuzzyOnly = hits.length === 0;
      hits = withFuzzy;
    }
  }

  hits.sort((a, b) =>
    compareHits(
      { tier: a.tier, p: a.doc.p, t: a.doc.t },
      { tier: b.tier, p: b.doc.p, t: b.doc.t },
    ),
  );

  const total = hits.length;
  const capped = hits.slice(0, limit);

  const byGroup = new Map<SearchGroupId, SearchHit[]>();
  for (const hit of capped) {
    const arr = byGroup.get(hit.doc.g);
    if (arr) arr.push(hit);
    else byGroup.set(hit.doc.g, [hit]);
  }
  const grouped: GroupedResults[] = SEARCH_GROUPS.filter((g) => byGroup.has(g)).map((g) => ({
    group: g,
    hits: byGroup.get(g)!,
  }));

  return { query: rawQuery, hits: capped, grouped, total, fuzzyOnly };
}

/**
 * Quick-search shaping: a small, balanced slice for the overlay.
 *
 * Takes the strongest hits overall, then guarantees at least one row from each
 * additional matching group so a query never returns eight rows from one
 * catalogue and hides the guide the visitor actually wanted.
 */
export function quickResults(outcome: SearchOutcome, max = 8): SearchHit[] {
  if (outcome.hits.length <= max) return outcome.hits;
  const picked: SearchHit[] = [];
  const seenGroups = new Set<SearchGroupId>();
  for (const hit of outcome.hits) {
    if (picked.length >= max) break;
    picked.push(hit);
    seenGroups.add(hit.doc.g);
  }
  for (const group of outcome.grouped) {
    if (seenGroups.has(group.group)) continue;
    const best = group.hits[0];
    if (!best) continue;
    picked.pop();
    picked.push(best);
    seenGroups.add(group.group);
  }
  return picked
    .sort((a, b) =>
      compareHits(
        { tier: a.tier, p: a.doc.p, t: a.doc.t },
        { tier: b.tier, p: b.doc.p, t: b.doc.t },
      ),
    )
    .slice(0, max);
}
