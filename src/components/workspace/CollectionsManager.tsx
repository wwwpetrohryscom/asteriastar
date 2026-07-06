"use client";

import { useState } from "react";
import Link from "next/link";
import { addCollection, removeCollection, removeFromCollection, useWorkspace } from "@/lib/workspace/store";
import { COLLECTION_KIND_LABELS, type CollectionKind } from "@/lib/workspace/types";

/** Manage collections, reading lists, and observation projects (Program BV) — all held in the browser. */
export function CollectionsManager() {
  const state = useWorkspace();
  const [name, setName] = useState("");
  const [kind, setKind] = useState<CollectionKind>("collection");
  const byId = new Map(state.savedEntities.map((e) => [e.id, e]));

  return (
    <div className="space-y-8">
      <form
        className="flex flex-wrap items-end gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4"
        onSubmit={(e) => { e.preventDefault(); if (name.trim()) { addCollection(name.trim(), kind); setName(""); } }}
      >
        <div className="flex-1">
          <label htmlFor="col-name" className="block text-xs text-faint">Name</label>
          <input id="col-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Nearby exoplanets" className="mt-1 w-full rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-sm text-fg placeholder:text-faint focus:border-halo/60 focus:outline-none" />
        </div>
        <div>
          <label htmlFor="col-kind" className="block text-xs text-faint">Kind</label>
          <select id="col-kind" value={kind} onChange={(e) => setKind(e.target.value as CollectionKind)} className="mt-1 rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-sm text-fg">
            {(Object.keys(COLLECTION_KIND_LABELS) as CollectionKind[]).map((k) => <option key={k} value={k}>{COLLECTION_KIND_LABELS[k]}</option>)}
          </select>
        </div>
        <button type="submit" className="rounded-lg border border-halo/40 px-4 py-2 text-sm text-halo hover:bg-halo/10">Create</button>
      </form>

      {state.collections.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/15 p-6 text-center text-sm text-faint">No collections yet. Create one above, then add saved entities to it from the workspace hub.</p>
      ) : (
        <ul className="space-y-4">
          {state.collections.map((c) => (
            <li key={c.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-bold text-fg">{c.name}</h3>
                  <span className="text-xs text-faint">{COLLECTION_KIND_LABELS[c.kind]} · {c.entityIds.length} {c.entityIds.length === 1 ? "entity" : "entities"}</span>
                </div>
                <button type="button" onClick={() => { if (window.confirm(`Delete collection "${c.name}"?`)) removeCollection(c.id); }} className="rounded-md border border-white/10 px-2 py-1 text-xs text-faint hover:border-ember/40 hover:text-ember">Delete</button>
              </div>
              {c.entityIds.length > 0 && (
                <ul className="mt-3 divide-y divide-white/5 rounded-xl border border-white/10">
                  {c.entityIds.map((id) => {
                    const e = byId.get(id);
                    return (
                      <li key={id} className="flex items-center justify-between gap-3 px-3 py-2">
                        {e ? <Link href={e.href} className="truncate text-sm text-fg hover:text-halo">{e.name} <span className="text-faint">· {e.type}</span></Link> : <span className="truncate text-sm text-faint">{id}</span>}
                        <button type="button" onClick={() => removeFromCollection(c.id, id)} className="shrink-0 text-xs text-faint hover:text-ember">Remove</button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
