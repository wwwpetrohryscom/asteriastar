"use client";

import Link from "next/link";
import { EntityPicker } from "@/components/workspace/EntityPicker";
import { addCollection, addToCollection, removeEntity, useWorkspace } from "@/lib/workspace/store";
import type { WorkspacePickItem } from "@/lib/workspace/types";
import { ROUTES } from "@/lib/routes";

/**
 * The workspace hub (Program BV) — a live view of the local workspace: counts, the find-and-save
 * picker, and the saved entities with quick actions. Everything renders from localStorage on the
 * client; the server sends only the empty shell and the entity index for the picker.
 */
export function WorkspaceHub({ items }: { items: WorkspacePickItem[] }) {
  const state = useWorkspace();

  const stats = [
    { label: "Saved entities", value: state.savedEntities.length, href: ROUTES.workspace },
    { label: "Collections", value: state.collections.length, href: `${ROUTES.workspace}/collections` },
    { label: "Notes", value: state.notes.length, href: `${ROUTES.workspace}/notes` },
    { label: "Citations", value: state.citations.length, href: `${ROUTES.workspace}/citations` },
  ];

  return (
    <div className="space-y-10">
      <section aria-label="Workspace summary">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <li key={s.label}>
              <Link href={s.href} className="block rounded-2xl border border-white/10 bg-white/[0.02] p-4 hover:border-white/25">
                <span className="block font-display text-2xl font-bold text-fg">{s.value}</span>
                <span className="text-xs text-faint">{s.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="add-heading">
        <h2 id="add-heading" className="font-display text-2xl font-bold">Find &amp; save an entity</h2>
        <p className="mt-1 text-sm text-muted">Search the knowledge graph and save any entity to your local workspace.</p>
        <div className="mt-4"><EntityPicker items={items} /></div>
      </section>

      <section aria-labelledby="saved-heading">
        <div className="flex items-baseline justify-between gap-3">
          <h2 id="saved-heading" className="font-display text-2xl font-bold">Saved entities</h2>
          {state.savedEntities.length > 0 && (
            <button
              type="button"
              onClick={() => {
                const name = window.prompt("New collection name?");
                if (name?.trim()) addCollection(name.trim(), "collection");
              }}
              className="text-sm text-halo hover:underline"
            >
              + New collection
            </button>
          )}
        </div>
        {state.savedEntities.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-white/15 p-6 text-center text-sm text-faint">
            Nothing saved yet. Use the search above to save your first entity — it stays in your browser only.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-white/5 rounded-2xl border border-white/10">
            {state.savedEntities.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5">
                <Link href={e.href} className="min-w-0 truncate text-sm font-medium text-fg hover:text-halo">
                  {e.name} <span className="font-normal text-faint">· {e.type}</span>
                </Link>
                <div className="flex shrink-0 items-center gap-2">
                  {state.collections.length > 0 && (
                    <select
                      aria-label={`Add ${e.name} to a collection`}
                      defaultValue=""
                      onChange={(ev) => { if (ev.target.value) { addToCollection(ev.target.value, e.id); ev.target.value = ""; } }}
                      className="rounded-md border border-white/15 bg-white/[0.03] px-2 py-1 text-xs text-muted"
                    >
                      <option value="" disabled>Add to…</option>
                      {state.collections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  )}
                  <button type="button" onClick={() => removeEntity(e.id)} className="rounded-md border border-white/10 px-2 py-1 text-xs text-faint hover:border-ember/40 hover:text-ember">
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
