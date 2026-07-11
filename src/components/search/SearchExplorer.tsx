"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { SearchGroup, SearchItem } from "@/lib/search";

/**
 * Universal search over a static, in-memory index. No fetching, no AI — pure
 * client-side filtering of real records (entities, articles, topics, paths,
 * timelines, comparisons). Reads an initial query from ?q.
 */
export function SearchExplorer({
  items,
  groups,
}: {
  items: SearchItem[];
  groups: SearchGroup[];
}) {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [group, setGroup] = useState<"all" | SearchGroup>("all");

  const q = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (q.length < 2) return [];
    return items
      .filter((it) => (group === "all" || it.group === group) && it.keywords.includes(q))
      .slice(0, 120);
  }, [items, q, group]);

  const grouped = useMemo(() => {
    const map = new Map<SearchGroup, SearchItem[]>();
    for (const it of results) {
      if (!map.has(it.group)) map.set(it.group, []);
      map.get(it.group)!.push(it);
    }
    return groups.map((g) => [g, map.get(g) ?? []] as const).filter(([, arr]) => arr.length > 0);
  }, [results, groups]);

  return (
    <div>
      <label className="relative block">
        <span className="sr-only">Search the universe</span>
        <input
          type="search"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stars, planets, missions, galaxies, telescopes, astronomers, mythology…"
          className="w-full rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-4 text-lg text-fg placeholder:text-faint focus:border-white/35 focus:outline-none focus-visible:outline-none"
        />
      </label>

      <div className="mt-4 flex flex-wrap gap-2">
        <Chip active={group === "all"} onClick={() => setGroup("all")}>All</Chip>
        {groups.map((g) => (
          <Chip key={g} active={group === g} onClick={() => setGroup(g)}>
            {g}
          </Chip>
        ))}
      </div>

      <div className="mt-8">
        {q.length < 2 ? (
          <p className="text-muted">Start typing to search {items.length.toLocaleString()} entries across the knowledge graph.</p>
        ) : grouped.length === 0 ? (
          <p className="text-muted">No matches for “{query}”.</p>
        ) : (
          <div className="space-y-8">
            {grouped.map(([g, arr]) => (
              <section key={g} aria-label={g}>
                <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-faint">
                  {g} <span className="text-faint/60">{arr.length}</span>
                </h2>
                <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {arr.map((it) => (
                    <li key={it.id}>
                      <Link
                        href={it.href}
                        className="group flex flex-col scientific-card px-4 py-3 transition hover:border-white/25 hover:bg-white/[0.04]"
                      >
                        <span className="font-medium text-fg group-hover:text-nasa">{it.name}</span>
                        <span className="text-xs text-faint">{it.kindLabel}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-sm transition ${
        active
          ? "border-white/30 bg-white/10 text-fg"
          : "border-white/12 bg-white/[0.02] text-muted hover:border-white/25 hover:text-fg"
      }`}
    >
      {children}
    </button>
  );
}
