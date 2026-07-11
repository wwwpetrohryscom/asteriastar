"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export interface BrowserItem {
  id: string;
  name: string;
  typeLabel: string;
  type: string;
  domain: "science" | "culture" | "astrology";
  href: string;
  description?: string;
}

const DOMAIN_DOT: Record<BrowserItem["domain"], string> = {
  science: "bg-white",
  culture: "bg-white",
  astrology: "bg-nasa",
};

function initial(name: string): string {
  const first = name.replace(/^the\s+/i, "").charAt(0).toUpperCase();
  return /[A-Z]/.test(first) ? first : "#";
}

/**
 * Client-side filter/search over a static list of entities. No data fetching —
 * the full list is passed in as props and filtered in the browser.
 */
export function EntityBrowser({
  items,
  typeFilters,
}: {
  items: BrowserItem[];
  typeFilters: { value: string; label: string; count: number }[];
}) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [type, setType] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (item) =>
        (type === "all" || item.type === type) &&
        (q === "" || item.name.toLowerCase().includes(q)),
    );
  }, [items, query, type]);

  const groups = useMemo(() => {
    const map = new Map<string, BrowserItem[]>();
    for (const item of [...filtered].sort((a, b) => a.name.localeCompare(b.name))) {
      const letter = initial(item.name);
      if (!map.has(letter)) map.set(letter, []);
      map.get(letter)!.push(item);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block w-full lg:max-w-md">
          <span className="sr-only">Search entities</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search entities…"
            className="w-full rounded-xl border border-white/12 bg-white/[0.03] px-4 py-2.5 text-fg placeholder:text-faint focus:border-white/30 focus:outline-none focus-visible:outline-none"
          />
        </label>
        <p className="text-sm text-faint">{filtered.length} of {items.length} entities</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <FilterChip active={type === "all"} onClick={() => setType("all")}>
          All
        </FilterChip>
        {typeFilters.map((f) => (
          <FilterChip key={f.value} active={type === f.value} onClick={() => setType(f.value)}>
            {f.label} <span className="text-faint">{f.count}</span>
          </FilterChip>
        ))}
      </div>

      <div className="mt-8 space-y-10">
        {groups.length === 0 ? (
          <p className="scientific-card p-6 text-muted">
            No entities match your search.
          </p>
        ) : (
          groups.map(([letter, group]) => (
            <section key={letter} aria-label={`Entities starting with ${letter}`}>
              <div className="mb-3 flex items-center gap-3">
                <h2 className="font-display text-xl font-bold text-nasa">{letter}</h2>
                <span className="h-px flex-1 bg-white/10" />
              </div>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className="group flex items-center gap-3 scientific-card px-4 py-3 transition hover:border-white/25 hover:bg-white/[0.04]"
                    >
                      <span aria-hidden className={`h-1.5 w-1.5 shrink-0 rounded-full ${DOMAIN_DOT[item.domain]}`} />
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-fg group-hover:text-nasa">
                          {item.name}
                        </span>
                        <span className="block text-xs text-faint">{item.typeLabel}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  );
}

function FilterChip({
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
