"use client";

import { useMemo, useState } from "react";
import { isSaved, saveEntity, useWorkspace } from "@/lib/workspace/store";
import type { WorkspacePickItem } from "@/lib/workspace/types";

/**
 * Find-and-save picker (Program BV). Filters the real entity index (built on the server and passed in
 * as props, so the graph never enters the client bundle) and saves a chosen entity to the local
 * workspace. Purely client-side over local data — no request is made.
 */
export function EntityPicker({ items }: { items: WorkspacePickItem[] }) {
  const [q, setQ] = useState("");
  const state = useWorkspace();
  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (term.length < 2) return [];
    return items.filter((i) => i.name.toLowerCase().includes(term) || i.type.toLowerCase().includes(term)).slice(0, 24);
  }, [q, items]);

  return (
    <div>
      <label htmlFor="wp-pick" className="sr-only">Find an entity to save</label>
      <input
        id="wp-pick"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Find a planet, star, mission, galaxy… to save"
        className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-2.5 text-sm text-fg placeholder:text-faint focus:border-white/60 focus:outline-none"
      />
      {q.trim().length >= 2 ? (
        <ul className="mt-3 divide-y divide-white/5 rounded-xl border border-white/10">
          {results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-faint">No matching entities.</li>
          ) : (
            results.map((i) => {
              const saved = isSaved(i.id, state);
              return (
                <li key={i.id} className="flex items-center justify-between gap-3 px-4 py-2">
                  <span className="min-w-0 truncate text-sm text-fg">
                    {i.name} <span className="text-faint">· {i.type}</span>
                  </span>
                  <button
                    type="button"
                    disabled={saved}
                    onClick={() => saveEntity({ id: i.id, name: i.name, type: i.type, href: i.href })}
                    className={`shrink-0 rounded-md border px-2.5 py-1 text-xs ${saved ? "border-white/10 text-faint" : "border-white/40 text-white hover:bg-white/10"}`}
                  >
                    {saved ? "Saved" : "Save"}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      ) : null}
    </div>
  );
}
