"use client";

import { useState } from "react";
import Link from "next/link";
import { addNote, removeNote, updateNote, useWorkspace } from "@/lib/workspace/store";

/** Take and manage research notes (Program BV), optionally attached to a saved entity. Browser-only. */
export function NotesManager() {
  const state = useWorkspace();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [entityId, setEntityId] = useState("");
  const byId = new Map(state.savedEntities.map((e) => [e.id, e]));

  return (
    <div className="space-y-8">
      <form
        className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4"
        onSubmit={(e) => { e.preventDefault(); if (title.trim() && body.trim()) { addNote(title.trim(), body.trim(), entityId || undefined); setTitle(""); setBody(""); setEntityId(""); } }}
      >
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title" aria-label="Note title" className="w-full rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-sm text-fg placeholder:text-faint focus:border-halo/60 focus:outline-none" />
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Your note…" aria-label="Note body" rows={3} className="w-full rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-sm text-fg placeholder:text-faint focus:border-halo/60 focus:outline-none" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <select value={entityId} onChange={(e) => setEntityId(e.target.value)} aria-label="Attach to entity" className="rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-sm text-muted">
            <option value="">Not attached to an entity</option>
            {state.savedEntities.map((e) => <option key={e.id} value={e.id}>On: {e.name}</option>)}
          </select>
          <button type="submit" className="rounded-lg border border-halo/40 px-4 py-2 text-sm text-halo hover:bg-halo/10">Add note</button>
        </div>
      </form>

      {state.notes.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/15 p-6 text-center text-sm text-faint">No notes yet. Your notes stay in your browser and are included in exports.</p>
      ) : (
        <ul className="space-y-3">
          {state.notes.map((n) => {
            const on = n.entityId ? byId.get(n.entityId) : undefined;
            return (
              <li key={n.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-base font-semibold text-fg">{n.title}</h3>
                  <button type="button" onClick={() => removeNote(n.id)} className="shrink-0 text-xs text-faint hover:text-ember">Delete</button>
                </div>
                {on && <p className="mt-0.5 text-xs text-faint">on <Link href={on.href} className="text-halo hover:underline">{on.name}</Link></p>}
                <textarea
                  defaultValue={n.body}
                  aria-label={`Edit ${n.title}`}
                  rows={2}
                  onBlur={(e) => { if (e.target.value !== n.body) updateNote(n.id, { body: e.target.value }); }}
                  className="mt-2 w-full resize-y rounded-lg border border-transparent bg-transparent text-sm text-muted hover:border-white/10 focus:border-halo/40 focus:bg-white/[0.02] focus:outline-none"
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
