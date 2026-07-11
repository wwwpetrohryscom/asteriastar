"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Homepage search. Navigates to the (static) entity index with the query as a
 * URL param, which the index reads client-side — no server fetching.
 */
export function HeroSearch() {
  const [q, setQ] = useState("");
  const router = useRouter();

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const term = q.trim();
        router.push(`/search${term ? `?q=${encodeURIComponent(term)}` : ""}`);
      }}
      className="flex w-full max-w-xl items-center gap-2 rounded-lg border border-silver/18 bg-bg-elevated/76 p-1.5 shadow-[0_18px_60px_rgba(0,0,0,0.24)] backdrop-blur-md focus-within:border-nasa/55"
    >
      <span aria-hidden className="pl-3 text-faint">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      <label className="sr-only" htmlFor="hero-search">
        Search the knowledge graph
      </label>
      <input
        id="hero-search"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search the sky..."
        className="min-w-0 flex-1 bg-transparent px-1 py-2 text-fg placeholder:text-faint focus:outline-none focus-visible:outline-none"
      />
      <button
        type="submit"
        className="shrink-0 rounded-lg bg-white px-5 py-2 text-sm font-medium text-bg transition hover:bg-silver"
      >
        Search
      </button>
    </form>
  );
}
