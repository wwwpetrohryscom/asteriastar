"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export interface AssistantPickItem {
  id: string;
  name: string;
  type: string;
}

/** One searchable entity selector — queries the existing /api/v0/search API (so no large index is
 *  shipped) and reports the chosen entity. */
function EntitySelect({
  label,
  value,
  onPick,
}: {
  label: string;
  value: AssistantPickItem | null;
  onPick: (i: AssistantPickItem | null) => void;
}) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<AssistantPickItem[]>([]);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (value) return;
    const term = q.trim();
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (term.length < 2) { setResults([]); return; }
      setLoading(true);
      fetch(`/api/v0/search?q=${encodeURIComponent(term)}&limit=12`)
        .then((r) => r.json())
        // The /api/v0/search envelope is { meta, count, data: { results } }, and each hit carries the
        // entity name in `title` (not `name`); read it accordingly, with fallbacks.
        .then((d) => setResults((d?.data?.results ?? d?.results ?? []).map((x: { id: string; title?: string; name?: string; type: string }) => ({ id: x.id, name: x.title ?? x.name ?? x.id, type: x.type }))))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 200);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [q, value]);

  if (value) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border border-nebula/40 bg-nebula/[0.06] px-3 py-2">
        <span className="min-w-0 truncate text-sm text-fg">{value.name} <span className="text-faint">· {value.type}</span></span>
        <button type="button" onClick={() => { onPick(null); setQ(""); }} className="shrink-0 text-xs text-faint hover:text-fg">Change</button>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-xs text-faint">{label}</label>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search an entity…"
        className="mt-1 w-full rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-sm text-fg placeholder:text-faint focus:border-nebula/60 focus:outline-none"
      />
      {q.trim().length >= 2 && (
        <ul className="mt-1 max-h-56 overflow-y-auto rounded-lg border border-white/10">
          {loading && results.length === 0 ? (
            <li className="px-3 py-2 text-sm text-faint">Searching…</li>
          ) : results.length === 0 ? (
            <li className="px-3 py-2 text-sm text-faint">No matching entities.</li>
          ) : (
            results.map((i) => (
              <li key={i.id}>
                <button type="button" onClick={() => onPick(i)} className="block w-full truncate px-3 py-1.5 text-left text-sm text-fg hover:bg-white/5">
                  {i.name} <span className="text-faint">· {i.type}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

/**
 * The input form for a grounded-assistant tool (Program BW). It selects one or two real entities (via
 * the deterministic search API) and navigates to the tool page with them as query parameters; the page
 * then computes the grounded result on the server. No language model is involved at any step.
 */
export function AssistantTool({
  basePath,
  fields,
  runLabel = "Run",
}: {
  basePath: string;
  fields: { name: string; label: string }[];
  runLabel?: string;
}) {
  const router = useRouter();
  const [picks, setPicks] = useState<(AssistantPickItem | null)[]>(fields.map(() => null));
  const ready = picks.every((p) => p);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map((f, i) => (
          <EntitySelect
            key={f.name}
            label={f.label}
            value={picks[i] ?? null}
            onPick={(v) => setPicks((prev) => prev.map((p, j) => (j === i ? v : p)))}
          />
        ))}
      </div>
      <button
        type="button"
        disabled={!ready}
        onClick={() => {
          const qs = fields.map((f, i) => `${f.name}=${encodeURIComponent(picks[i]!.id)}`).join("&");
          router.push(`${basePath}?${qs}`);
        }}
        className="mt-4 rounded-lg border border-nebula/40 px-4 py-2 text-sm text-nebula hover:bg-nebula/10 disabled:cursor-not-allowed disabled:border-white/10 disabled:text-faint"
      >
        {runLabel}
      </button>
    </div>
  );
}
