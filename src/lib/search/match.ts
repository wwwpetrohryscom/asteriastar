/**
 * Deterministic, explainable matching for global search.
 *
 * Ranking is a fixed tier ladder, not a learned or semantic score, so any
 * result can be explained by pointing at the tier it matched in. There is no
 * LLM anywhere in this path.
 *
 * On fuzzy matching: it is deliberately the LAST tier and heavily bounded.
 * Unbounded edit distance over ~9,000 astronomical names produces
 * confident-looking nonsense — "mars" is within one edit of "Mara", "Marz",
 * "Maro", "Mari" and a dozen catalogue rows — and there is no relevance signal
 * in the corpus to rank it back down. Fuzzy therefore runs only when nothing
 * stronger matched, only on queries of 4+ characters, only against candidates
 * that share a first character, and only within a distance budget that scales
 * with query length.
 *
 * CLIENT-SAFE: no data-layer imports.
 */

/**
 * Casefold, strip diacritics, normalise the punctuation that differs between
 * how a name is stored and how a visitor types it.
 *
 * - NFD splits accents into combining marks, which U+0300–U+036F then removes,
 *   so "Bételgeuse" folds to "betelgeuse".
 * - Unicode apostrophes and the dash family are normalised to ASCII, so
 *   "Barnard’s Star" matches "Barnard's Star" and "67P/Churyumov–Gerasimenko"
 *   matches a hyphen typed on a normal keyboard.
 */
export function fold(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[‘’ʼ´`]/g, "'")
    .replace(/[‐-―−]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * A second, more aggressive normalisation used only for identifier matching:
 * strips every separator so "M 31", "M-31" and "M31" collapse to one key, and
 * "NGC 224" to "ngc224". Applied to both sides, so it never widens a match to
 * something a visitor would not recognise.
 */
export function foldId(value: string): string {
  return fold(value).replace(/[\s._/'-]+/g, "");
}

/**
 * Match tiers, strongest last. A plain const object rather than a `const enum`
 * because Next builds with `isolatedModules`, which cannot inline those.
 *
 * The ladder mirrors the product requirement exactly:
 *   Exact title > Exact alias/identifier > Title prefix > Alias prefix >
 *   Word prefix > Substring (title/description) > Fuzzy.
 */
export const Tier = {
  None: 0,
  Fuzzy: 1,
  Substring: 2,
  AllTokens: 3,
  WordPrefix: 4,
  AliasPrefix: 5,
  TitlePrefix: 6,
  AliasExact: 7,
  TitleExact: 8,
} as const;

export type Tier = (typeof Tier)[keyof typeof Tier];

export const TIER_LABELS: Record<Tier, string> = {
  [Tier.None]: "no match",
  [Tier.Fuzzy]: "close spelling",
  [Tier.Substring]: "contains",
  [Tier.AllTokens]: "matches every word",
  [Tier.WordPrefix]: "word starts with",
  [Tier.AliasPrefix]: "identifier starts with",
  [Tier.TitlePrefix]: "title starts with",
  [Tier.AliasExact]: "exact identifier",
  [Tier.TitleExact]: "exact title",
};

/** Where in a folded haystack the query begins a word. */
function wordStarts(haystack: string, query: string): boolean {
  let at = haystack.indexOf(query);
  while (at > 0) {
    const before = haystack[at - 1];
    if (before === " " || before === "-" || before === "(" || before === "/") return true;
    at = haystack.indexOf(query, at + 1);
  }
  return at === 0;
}

/**
 * Damerau–Levenshtein with an early-exit budget. Returns `budget + 1` as soon
 * as the distance is known to exceed it, so a long non-match costs almost
 * nothing.
 */
export function editDistance(a: string, b: string, budget: number): number {
  if (Math.abs(a.length - b.length) > budget) return budget + 1;
  if (a === b) return 0;
  const prev2 = new Array<number>(b.length + 1);
  let prev = new Array<number>(b.length + 1);
  let curr = new Array<number>(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  let prevPrev: number[] = prev2;
  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    let rowMin = curr[0];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
      // transposition
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        v = Math.min(v, prevPrev[j - 2] + 1);
      }
      curr[j] = v;
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > budget) return budget + 1;
    const spare = prevPrev;
    prevPrev = prev;
    prev = curr;
    curr = spare;
  }
  return prev[b.length];
}

/**
 * Distance budget by query length. Short queries get no slack at all, because
 * at 3 characters almost everything is within one edit of something.
 */
export function fuzzyBudget(queryLength: number): number {
  if (queryLength < 4) return 0;
  if (queryLength < 7) return 1;
  return 2;
}

export interface Haystacks {
  /** folded title */ title: string;
  /** folded aliases/identifiers */ aliases: string[];
  /** identifier-folded title + aliases, separators stripped */ ids: string[];
  /** folded description */ desc: string;
  /** title + aliases + description, folded — used for multi-token matching */ all: string;
}

/**
 * Rank one document's haystacks against a folded query.
 *
 * `allowFuzzy` is passed in rather than decided here: the caller runs a strict
 * pass first and only re-runs with fuzzy enabled when that produced too little,
 * which keeps typo tolerance from ever displacing a real match.
 */
export function rankDoc(h: Haystacks, q: string, qid: string, allowFuzzy: boolean): Tier {
  if (!q) return Tier.None;

  if (h.title === q) return Tier.TitleExact;
  for (const a of h.aliases) if (a === q) return Tier.AliasExact;
  // Identifier equality after separator stripping: "m31" === "m 31".
  if (qid) for (const id of h.ids) if (id === qid) return Tier.AliasExact;

  if (h.title.startsWith(q)) return Tier.TitlePrefix;
  for (const a of h.aliases) if (a.startsWith(q)) return Tier.AliasPrefix;
  if (qid) for (const id of h.ids) if (id.startsWith(qid)) return Tier.AliasPrefix;

  if (h.title.includes(q) && wordStarts(h.title, q)) return Tier.WordPrefix;
  for (const a of h.aliases) if (a.includes(q) && wordStarts(a, q)) return Tier.WordPrefix;

  // Multi-word query: every token must appear somewhere in the document.
  // "jupiter planet" and "webb telescope" are natural phrasings that no single
  // title contains verbatim, and requiring ALL tokens keeps this from
  // degenerating into an OR that matches half the corpus.
  if (q.includes(" ")) {
    const tokens = q.split(" ").filter(Boolean);
    if (tokens.length > 1 && tokens.every((tok) => h.all.includes(tok))) return Tier.AllTokens;
  }

  if (h.title.includes(q)) return Tier.Substring;
  if (h.desc && h.desc.includes(q)) return Tier.Substring;

  if (allowFuzzy) {
    const budget = fuzzyBudget(q.length);
    if (budget > 0) {
      // Anchor on a shared first character: a typo in the very first letter is
      // rare, and allowing one makes every short query match half the corpus.
      if (h.title[0] === q[0] && editDistance(h.title, q, budget) <= budget) return Tier.Fuzzy;
      // Try each WORD of the title too, so "plieades" still reaches
      // "The Pleiades" — where the leading article defeats a whole-title
      // comparison — and "androm3da galaxy" reaches "Andromeda Galaxy".
      if (h.title.includes(" ")) {
        for (const word of h.title.split(" ")) {
          if (word.length < 4 || word[0] !== q[0]) continue;
          if (editDistance(word, q, budget) <= budget) return Tier.Fuzzy;
        }
      }
      for (const a of h.aliases) {
        if (a[0] === q[0] && editDistance(a, q, budget) <= budget) return Tier.Fuzzy;
      }
    }
  }

  return Tier.None;
}

/**
 * Stable comparator. Tier first, then editorial priority, then title length (a
 * prefix hit on "Mars" beats one on "Marsden"), then alphabetical so identical
 * queries never reshuffle between renders.
 */
export function compareHits(
  a: { tier: Tier; p: number; t: string },
  b: { tier: Tier; p: number; t: string },
): number {
  if (a.tier !== b.tier) return b.tier - a.tier;
  if (a.p !== b.p) return b.p - a.p;
  if (a.t.length !== b.t.length) return a.t.length - b.t.length;
  return a.t.localeCompare(b.t);
}
