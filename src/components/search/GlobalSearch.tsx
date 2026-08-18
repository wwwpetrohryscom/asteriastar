"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useSearchIndex } from "@/components/search/use-search-index";
import {
  trackSearchNoResults,
  trackSearchOpen,
  trackSearchQuery,
  trackSearchResultClick,
} from "@/components/search/analytics";
import { MIN_QUERY_LENGTH, quickResults, runSearch, type SearchHit } from "@/lib/search/query";
import { SEARCH_GROUP_LABELS, type SearchGroupId } from "@/lib/search/types";

/**
 * Global search overlay.
 *
 * Client-only and index-driven: it never imports `@/knowledge-graph`,
 * `@/platform/data-engine` or `@/lib/routes`, all of which would drag the
 * multi-megabyte data layer into the browser bundle. Result hrefs come from the
 * generated index, which already stores canonical URLs.
 *
 * Semantics follow the ARIA combobox pattern: the input owns
 * `aria-expanded` / `aria-controls` / `aria-activedescendant`, the panel is a
 * `listbox` of grouped `option`s, and selection is tracked by active descendant
 * so focus never leaves the input while arrowing through results.
 *
 * The panel is a full-screen sheet on mobile and a centred dialog on desktop —
 * one component, two layouts, so there is no second implementation to keep in
 * sync.
 */

/** Suggested destinations shown before anything is typed. */
const STARTERS: { label: string; href: string; hint: string }[] = [
  { label: "Solar System", href: "/solar-system", hint: "Planets, moons, small bodies" },
  { label: "Stars", href: "/stars", hint: "Catalogued stars with measured data" },
  { label: "Deep sky", href: "/deep-sky", hint: "Messier, NGC, IC objects" },
  { label: "Exoplanets", href: "/exoplanets", hint: "Archive-sourced planets" },
  { label: "Missions", href: "/exploration", hint: "Robotic and crewed exploration" },
  { label: "Guides", href: "/guides", hint: "Explainers, start to finish" },
];

const QUICK_LIMIT = 8;

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const router = useRouter();
  const { docs, stage, prime } = useSearchIndex();

  const baseId = useId();
  const listboxId = `${baseId}-listbox`;
  const inputId = `${baseId}-input`;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const announcedFor = useRef<string>("");

  const trimmed = query.trim();

  const outcome = useMemo(
    () => (docs.length ? runSearch(docs, trimmed, { limit: 60 }) : null),
    [docs, trimmed],
  );

  const shown = useMemo<SearchHit[]>(
    () => (outcome ? quickResults(outcome, QUICK_LIMIT) : []),
    [outcome],
  );

  /** Flat, ordered rows with stable ids — what the arrow keys walk. */
  const rows = useMemo(
    () =>
      shown.map((hit, i) => ({
        id: `${baseId}-r-${i}`,
        hit,
        group: hit.doc.g as SearchGroupId,
      })),
    [shown, baseId],
  );

  const grouped = useMemo(() => {
    const map = new Map<SearchGroupId, typeof rows>();
    for (const row of rows) {
      const arr = map.get(row.group);
      if (arr) arr.push(row);
      else map.set(row.group, [row]);
    }
    return [...map.entries()];
  }, [rows]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    // Return focus to the trigger so a keyboard user is not dumped at the top
    // of the document.
    triggerRef.current?.focus();
  }, []);

  const openNow = useCallback(
    (source: "keyboard" | "click") => {
      setOpen(true);
      prime();
      trackSearchOpen(source);
    },
    [prime],
  );

  /* Cmd/Ctrl+K anywhere; "/" when not already typing into a field. */
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const k = event.key.toLowerCase();
      if ((event.metaKey || event.ctrlKey) && k === "k") {
        event.preventDefault();
        if (open) close();
        else openNow("keyboard");
        return;
      }
      if (open) return;
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const el = event.target as HTMLElement | null;
      const tag = el?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el?.isContentEditable) return;
      event.preventDefault();
      openNow("keyboard");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, openNow]);

  /* Focus the input, and lock body scroll while the sheet is up. */
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const { overflow, paddingRight } = document.body.style;
    // Compensate for the removed scrollbar so the page behind does not shift.
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [open]);

  /* Announce result counts politely, once per settled query. */
  useEffect(() => {
    if (!open || !outcome || trimmed.length < MIN_QUERY_LENGTH) return;
    if (announcedFor.current === trimmed) return;
    announcedFor.current = trimmed;
    trackSearchQuery(trimmed.length, outcome.total);
    if (outcome.total === 0) trackSearchNoResults(trimmed.length, outcome.fuzzyOnly);
  }, [open, outcome, trimmed]);

  const go = useCallback(
    (hit: SearchHit, rank: number) => {
      trackSearchResultClick(hit.doc.g, rank + 1, "overlay");
      close();
      router.push(hit.doc.u);
    },
    [close, router],
  );

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === "Enter") {
      const target = rows[active];
      if (target) {
        event.preventDefault();
        go(target.hit, active);
      } else if (trimmed.length >= MIN_QUERY_LENGTH) {
        // No highlighted row — fall through to the full results page.
        event.preventDefault();
        close();
        router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      }
      return;
    }
    if (!rows.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => (i + 1) % rows.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => (i - 1 + rows.length) % rows.length);
    } else if (event.key === "Home") {
      event.preventDefault();
      setActive(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActive(rows.length - 1);
    }
  }

  /* Keep focus inside the dialog while it is open. */
  function onPanelKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab") return;
    const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
    );
    if (!focusables?.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  const tooShort = trimmed.length > 0 && trimmed.length < MIN_QUERY_LENGTH;
  const searching = trimmed.length >= MIN_QUERY_LENGTH;
  const noResults = searching && outcome !== null && outcome.total === 0 && stage !== "loading";

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => openNow("click")}
        onPointerEnter={prime}
        onFocus={prime}
        aria-label="Search Asteria Star"
        aria-haspopup="dialog"
        aria-expanded={open}
        className="inline-flex h-10 items-center gap-2 rounded-lg px-2.5 text-muted transition hover:bg-white/5 hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nasa sm:min-w-[13rem] sm:justify-start sm:border sm:border-silver/18 sm:bg-white/[0.03] sm:px-3"
      >
        <SearchIcon />
        <span className="hidden flex-1 text-left text-sm sm:inline">Search…</span>
        <kbd className="hidden rounded border border-silver/20 bg-white/[0.04] px-1.5 py-0.5 font-sans text-[11px] text-faint lg:inline-block">
          ⌘K
        </kbd>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-bg/80 backdrop-blur-sm sm:items-center sm:justify-start sm:pt-[8vh]"
          role="presentation"
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Search Asteria Star"
            onKeyDown={onPanelKeyDown}
            className="flex h-full w-full flex-col overflow-hidden border-silver/15 bg-bg-elevated shadow-[0_30px_90px_rgba(0,0,0,0.6)] sm:h-auto sm:max-h-[min(70vh,40rem)] sm:w-[min(42rem,calc(100vw-2rem))] sm:rounded-2xl sm:border"
          >
            {/* Sticky input row — stays put while results scroll under it. */}
            <div className="flex shrink-0 items-center gap-2 border-b border-silver/12 px-3 sm:px-4">
              <span aria-hidden className="text-faint">
                <SearchIcon />
              </span>
              <label className="sr-only" htmlFor={inputId}>
                Search stars, planets, missions, guides and tools
              </label>
              <input
                id={inputId}
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  // Reset the highlight here rather than in an effect: this is
                  // the event that invalidates it.
                  setActive(0);
                }}
                onKeyDown={onInputKeyDown}
                placeholder="Search the universe…"
                type="search"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="search"
                role="combobox"
                aria-expanded={rows.length > 0}
                aria-controls={listboxId}
                aria-autocomplete="list"
                aria-activedescendant={rows[active]?.id}
                className="min-h-[3.25rem] flex-1 bg-transparent text-base text-fg outline-none placeholder:text-faint sm:min-h-[3.5rem]"
              />
              <button
                type="button"
                onClick={close}
                aria-label="Close search"
                className="inline-flex h-11 min-w-11 items-center justify-center rounded-lg px-2 text-xs font-medium text-faint transition hover:bg-white/5 hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nasa"
              >
                <span className="hidden sm:inline">Esc</span>
                <span aria-hidden className="sm:hidden">
                  <CloseIcon />
                </span>
              </button>
            </div>

            {/* Results scroll independently of the input. */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              {!searching ? (
                <div className="px-3 py-3 sm:px-4">
                  <p className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
                    Start anywhere
                  </p>
                  <ul className="grid gap-1.5 sm:grid-cols-2">
                    {STARTERS.map((s) => (
                      <li key={s.href}>
                        <Link
                          href={s.href}
                          onClick={close}
                          className="flex min-h-11 flex-col justify-center rounded-lg px-3 py-2 transition hover:bg-white/[0.05] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nasa"
                        >
                          <span className="text-sm font-medium text-fg">{s.label}</span>
                          <span className="text-xs text-faint">{s.hint}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {tooShort ? (
                    <p className="px-1 pt-3 text-xs text-faint">
                      Keep typing — search starts at {MIN_QUERY_LENGTH} characters.
                    </p>
                  ) : null}
                </div>
              ) : (
                <>
                  <ul id={listboxId} role="listbox" aria-label="Search results" className="py-2">
                    {grouped.map(([group, groupRows]) => (
                      <li key={group} role="presentation">
                        <p className="px-4 pb-1 pt-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
                          {SEARCH_GROUP_LABELS[group]}
                        </p>
                        <ul role="group" aria-label={SEARCH_GROUP_LABELS[group]}>
                          {groupRows.map((row) => {
                            const rank = rows.indexOf(row);
                            return (
                              <ResultRow
                                key={row.id}
                                id={row.id}
                                hit={row.hit}
                                selected={rank === active}
                                onHover={() => setActive(rank)}
                                onPick={() => go(row.hit, rank)}
                              />
                            );
                          })}
                        </ul>
                      </li>
                    ))}
                  </ul>

                  {outcome && outcome.total > rows.length ? (
                    <div className="border-t border-silver/12 px-4 py-3">
                      <Link
                        href={`/search?q=${encodeURIComponent(trimmed)}`}
                        onClick={close}
                        className="inline-flex min-h-11 items-center text-sm font-medium text-nasa underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nasa"
                      >
                        View all {outcome.total.toLocaleString()} results →
                      </Link>
                    </div>
                  ) : null}

                  {stage === "loading" ? (
                    <p className="px-4 py-8 text-center text-sm text-faint">Loading search index…</p>
                  ) : null}

                  {noResults ? (
                    <div className="px-4 py-8 text-center">
                      <p className="text-sm text-muted">
                        No results for <span className="text-fg">“{trimmed}”</span>.
                      </p>
                      <p className="mt-2 text-xs text-faint">
                        Check the spelling, try an identifier like M31 or 67P, or browse a hub below.
                      </p>
                      <ul className="mt-4 flex flex-wrap justify-center gap-2">
                        {STARTERS.slice(0, 4).map((s) => (
                          <li key={s.href}>
                            <Link
                              href={s.href}
                              onClick={close}
                              className="inline-flex min-h-11 items-center rounded-full border border-silver/18 px-3.5 text-xs text-muted transition hover:border-silver/35 hover:text-fg"
                            >
                              {s.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {stage === "error" ? (
                    <p className="px-4 py-8 text-center text-sm text-faint">
                      Search is unavailable right now.{" "}
                      <Link href="/entity-index" onClick={close} className="text-nasa underline-offset-4 hover:underline">
                        Browse the entity index
                      </Link>{" "}
                      instead.
                    </p>
                  ) : null}
                </>
              )}
            </div>
          </div>

          <p aria-live="polite" className="sr-only">
            {searching && outcome
              ? `${outcome.total} result${outcome.total === 1 ? "" : "s"}`
              : ""}
          </p>
        </div>
      ) : null}
    </>
  );
}

function ResultRow({
  id,
  hit,
  selected,
  onHover,
  onPick,
}: {
  id: string;
  hit: SearchHit;
  selected: boolean;
  onHover: () => void;
  onPick: () => void;
}) {
  return (
    <li id={id} role="option" aria-selected={selected}>
      <Link
        href={hit.doc.u}
        onClick={onPick}
        onPointerMove={onHover}
        tabIndex={-1}
        className={`flex min-h-11 items-center gap-3 px-4 py-2.5 transition ${
          selected ? "bg-white/[0.07]" : "hover:bg-white/[0.04]"
        }`}
      >
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="truncate text-sm font-medium text-fg">{hit.doc.t}</span>
            {hit.doc.c === 1 ? (
              <span className="shrink-0 rounded-full border border-nasa/35 px-1.5 text-[10px] font-medium text-nasa">
                cultural
              </span>
            ) : null}
          </span>
          {hit.doc.d ? (
            <span className="mt-0.5 line-clamp-1 block text-xs text-faint">{hit.doc.d}</span>
          ) : null}
        </span>
        <span className="shrink-0 text-[11px] text-faint">{hit.doc.k}</span>
      </Link>
    </li>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
