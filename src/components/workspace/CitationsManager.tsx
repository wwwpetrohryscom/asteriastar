"use client";

import { useMemo, useState } from "react";
import { citationsForEntity, formatCitation, CITATION_STYLES, type CitationStyle } from "@/lib/citations";
import { resolveWorkspaceCitations } from "@/lib/workspace/exports";
import { addCitation, removeCitation, useWorkspace } from "@/lib/workspace/store";

/**
 * The citation folder (Program BV). Collects the REAL, source-backed citations behind saved entities
 * and renders them in any supported style via the platform's citation engine — nothing is fabricated.
 * All local; the export panel downloads BibTeX/RIS/etc.
 */
export function CitationsManager() {
  const state = useWorkspace();
  const [style, setStyle] = useState<CitationStyle>("apa");

  // Saved entities that actually have real citations available to add.
  const addable = useMemo(
    () => state.savedEntities
      .map((e) => ({ e, count: citationsForEntity(e.id).length }))
      .filter((x) => x.count > 0 && !state.citations.some((c) => c.entityId === x.e.id)),
    [state.savedEntities, state.citations],
  );

  const collected = resolveWorkspaceCitations(state);

  return (
    <div className="space-y-8">
      {addable.length > 0 && (
        <section aria-labelledby="add-cites" className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <h2 id="add-cites" className="text-sm font-semibold text-fg">Add citations from your saved entities</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {addable.map(({ e, count }) => (
              <li key={e.id}>
                <button type="button" onClick={() => addCitation({ entityId: e.id, label: e.name })} className="rounded-lg border border-halo/40 px-3 py-1.5 text-xs text-halo hover:bg-halo/10">
                  + {e.name} <span className="text-faint">({count})</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="folder">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="folder" className="font-display text-2xl font-bold">Citation folder <span className="text-base font-normal text-faint">({collected.length})</span></h2>
          <label className="text-sm text-muted">Style{" "}
            <select value={style} onChange={(e) => setStyle(e.target.value as CitationStyle)} className="ml-1 rounded-md border border-white/15 bg-white/[0.03] px-2 py-1 text-sm text-fg">
              {CITATION_STYLES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </label>
        </div>
        {collected.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-white/15 p-6 text-center text-sm text-faint">
            No citations yet. Save an entity that has source-backed citations, then add them here — every field comes from a real citation record.
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {collected.map((c) => {
              const ref = state.citations.find((x) => x.citationId === c.id || (x.entityId && citationsForEntity(x.entityId).some((y) => y.id === c.id)));
              return (
                <li key={c.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                  <p className="text-sm text-fg break-words">{formatCitation(c, style)}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs">
                    {c.url && <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-halo hover:underline">Source ↗</a>}
                    {ref && <button type="button" onClick={() => removeCitation(ref.id)} className="text-faint hover:text-ember">Remove</button>}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
