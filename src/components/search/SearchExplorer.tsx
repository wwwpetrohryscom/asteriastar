"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchIndex } from "@/components/search/use-search-index";
import {
  trackSearchNoResults,
  trackSearchQuery,
  trackSearchResultClick,
} from "@/components/search/analytics";
import { MIN_QUERY_LENGTH, runSearch } from "@/lib/search/query";
import {
  SEARCH_GROUPS,
  SEARCH_GROUP_LABELS,
  type SearchGroupId,
} from "@/lib/search/types";

/**
 * Full search results page.
 *
 * Loads the same generated index the header overlay uses — a lazily fetched,
 * CDN-cached static JSON file — rather than receiving the corpus as props. The
 * previous implementation serialised every document into the page HTML, which
 * made /search a 1.7 MB document that had to be parsed before anything could
 * render. The index is now shared with the overlay and cached at module level,
 * so arriving here from the overlay costs no additional fetch at all.
 */

const PAGE_SIZE = 40;

export function SearchExplorer() {
  const params = useSearchParams();
  const router = useRouter();
  const { docs, stage, prime } = useSearchIndex();

  const urlQuery = params.get("q") ?? "";
  const [query, setQuery] = useState(urlQuery);
  const [group, setGroup] = useState<"all" | SearchGroupId>("all");
  const [nature, setNature] = useState<"all" | "science" | "cultural">("all");
  const [shown, setShown] = useState(PAGE_SIZE);

  // Adjust state during render rather than in an effect (the pattern React
  // documents for "state derived from props"): keeps the field in step with
  // back/forward navigation without a cascading second render.
  const [lastUrlQuery, setLastUrlQuery] = useState(urlQuery);
  if (urlQuery !== lastUrlQuery) {
    setLastUrlQuery(urlQuery);
    setQuery(urlQuery);
  }

  const trimmed = query.trim();

  // Same pattern for the page window: a new query or filter resets it.
  const resetKey = `${trimmed}|${group}|${nature}`;
  const [lastResetKey, setLastResetKey] = useState(resetKey);
  if (resetKey !== lastResetKey) {
    setLastResetKey(resetKey);
    setShown(PAGE_SIZE);
  }

  useEffect(() => {
    prime();
  }, [prime]);

  const outcome = useMemo(
    () =>
      docs.length
        ? runSearch(docs, trimmed, {
            limit: 2000,
            groups: group === "all" ? undefined : [group],
            nature: nature === "all" ? undefined : nature,
          })
        : null,
    [docs, trimmed, group, nature],
  );

  /** Group counts for the filter chips, computed without the group filter. */
  const groupCounts = useMemo(() => {
    if (!docs.length || trimmed.length < MIN_QUERY_LENGTH) return null;
    const all = runSearch(docs, trimmed, {
      limit: 5000,
      nature: nature === "all" ? undefined : nature,
    });
    const counts = new Map<SearchGroupId, number>();
    for (const hit of all.hits) counts.set(hit.doc.g, (counts.get(hit.doc.g) ?? 0) + 1);
    return { counts, total: all.total };
  }, [docs, trimmed, nature]);

  useEffect(() => {
    // Wait for the whole index: a core-only pass would log false zero-result
    // events for every catalogue query.
    if (!outcome || trimmed.length < MIN_QUERY_LENGTH || stage !== "ready") return;
    trackSearchQuery(trimmed.length, outcome.total);
    if (outcome.total === 0) trackSearchNoResults(trimmed.length, outcome.fuzzyOnly);
  }, [outcome, trimmed, stage]);

  const submit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      // Keep the URL shareable without pushing a history entry per keystroke.
      router.replace(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
    },
    [router, trimmed],
  );

  const searching = trimmed.length >= MIN_QUERY_LENGTH;
  const visible = outcome ? outcome.hits.slice(0, shown) : [];

  return (
    <div>
      <form role="search" onSubmit={submit}>
        <label className="sr-only" htmlFor="search-page-input">
          Search Asteria Star
        </label>
        <input
          id="search-page-input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stars, planets, missions, galaxies, telescopes, guides…"
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="search"
          className="min-h-[3.5rem] w-full rounded-2xl border border-silver/18 bg-white/[0.04] px-5 text-lg text-fg placeholder:text-faint focus:border-silver/35 focus:outline-none"
        />
      </form>

      {/* Filters: group, then the science/cultural split the platform maintains. */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Chip active={group === "all"} onClick={() => setGroup("all")}>
          All{groupCounts ? ` (${groupCounts.total.toLocaleString()})` : ""}
        </Chip>
        {SEARCH_GROUPS.filter((g) => (groupCounts?.counts.get(g) ?? 0) > 0).map((g) => (
          <Chip key={g} active={group === g} onClick={() => setGroup(g)}>
            {SEARCH_GROUP_LABELS[g]} ({groupCounts!.counts.get(g)!.toLocaleString()})
          </Chip>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <Chip active={nature === "all"} onClick={() => setNature("all")} tone="quiet">
          Everything
        </Chip>
        <Chip active={nature === "science"} onClick={() => setNature("science")} tone="quiet">
          Astronomy only
        </Chip>
        <Chip active={nature === "cultural"} onClick={() => setNature("cultural")} tone="quiet">
          Cultural &amp; interpretive
        </Chip>
      </div>

      <div className="mt-8">
        {!searching ? (
          <p className="text-muted">
            Type at least {MIN_QUERY_LENGTH} characters to search
            {docs.length ? ` ${docs.length.toLocaleString()} indexed pages` : " the platform"}.
          </p>
        ) : stage === "idle" || stage === "loading" || (stage === "partial" && !outcome?.total) ? (
          <p className="text-muted">Loading search index…</p>
        ) : stage === "error" ? (
          <p className="text-muted">
            Search is unavailable right now.{" "}
            <Link href="/entity-index" className="text-nasa underline-offset-4 hover:underline">
              Browse the entity index
            </Link>{" "}
            instead.
          </p>
        ) : !outcome || (outcome.total === 0 && stage === "ready") ? (
          <div>
            <p className="text-muted">
              No results for <span className="text-fg">“{trimmed}”</span>
              {group !== "all" || nature !== "all" ? " with these filters" : ""}.
            </p>
            <p className="mt-2 text-sm text-faint">
              Try an identifier such as M31, NGC 224 or 67P, check the spelling, or clear the
              filters.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-faint">
              {outcome.total.toLocaleString()}
              {stage === "partial" ? "+" : ""} result{outcome.total === 1 ? "" : "s"}
              {stage === "partial" ? " — still loading the full catalogue" : ""}
              {outcome.fuzzyOnly ? " — showing close spellings" : ""}
            </p>
            <ul className="mt-4 space-y-1.5">
              {visible.map((hit, i) => (
                <li key={hit.doc.i}>
                  <Link
                    href={hit.doc.u}
                    onClick={() => trackSearchResultClick(hit.doc.g, i + 1, "page")}
                    className="flex min-h-11 flex-col justify-center rounded-xl border border-silver/12 bg-white/[0.02] px-4 py-3 transition hover:border-silver/28 hover:bg-white/[0.05]"
                  >
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-fg">{hit.doc.t}</span>
                      <span className="text-[11px] text-faint">{hit.doc.k}</span>
                      {hit.doc.c === 1 ? (
                        <span className="rounded-full border border-nasa/35 px-1.5 text-[10px] font-medium text-nasa">
                          cultural
                        </span>
                      ) : null}
                    </span>
                    {hit.doc.d ? (
                      <span className="mt-1 text-sm leading-relaxed text-muted">{hit.doc.d}</span>
                    ) : null}
                    {hit.doc.a?.length ? (
                      <span className="mt-1 text-xs text-faint">
                        Also: {hit.doc.a.slice(0, 4).join(" · ")}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>

            {outcome.hits.length > shown ? (
              <button
                type="button"
                onClick={() => setShown((n) => n + PAGE_SIZE)}
                className="mt-6 inline-flex min-h-11 items-center rounded-lg border border-silver/18 px-5 text-sm font-medium text-fg transition hover:border-silver/35 hover:bg-white/5"
              >
                Show more ({(outcome.hits.length - shown).toLocaleString()} remaining)
              </button>
            ) : null}
            {outcome.total > outcome.hits.length ? (
              <p className="mt-4 text-xs text-faint">
                Showing the {outcome.hits.length.toLocaleString()} strongest matches of{" "}
                {outcome.total.toLocaleString()}. Narrow the query or use a filter to see the rest.
              </p>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
  tone = "solid",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  tone?: "solid" | "quiet";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex min-h-11 items-center rounded-full border px-3.5 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nasa ${
        active
          ? tone === "quiet"
            ? "border-nasa/40 bg-nasa/10 text-fg"
            : "border-silver/32 bg-white/10 text-fg"
          : "border-silver/12 bg-white/[0.02] text-muted hover:border-silver/28 hover:text-fg"
      }`}
    >
      {children}
    </button>
  );
}
