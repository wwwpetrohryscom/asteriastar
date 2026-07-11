"use client";

import { useRef } from "react";
import { EXPORT_FORMATS, exportWorkspace, resolveWorkspaceCitations, type ExportFormat } from "@/lib/workspace/exports";
import { importWorkspace, useWorkspace } from "@/lib/workspace/store";
import { EMPTY_WORKSPACE, type WorkspaceState } from "@/lib/workspace/types";

/** Export the workspace to JSON/Markdown/BibTeX/CSV, print a packet, or re-import JSON. All in-browser. */
export function ExportsPanel() {
  const state = useWorkspace();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const empty = state.savedEntities.length + state.collections.length + state.notes.length + state.citations.length === 0;

  function download(format: ExportFormat) {
    const meta = EXPORT_FORMATS.find((f) => f.id === format)!;
    const text = exportWorkspace(state, format);
    const blob = new Blob([text], { type: meta.mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `asteriastar-workspace.${meta.extension}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function onImport(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as WorkspaceState;
        if (parsed && typeof parsed === "object" && Array.isArray(parsed.savedEntities)) {
          if (window.confirm("Replace the current workspace with the imported file?")) importWorkspace({ ...EMPTY_WORKSPACE, ...parsed });
        } else {
          window.alert("That file is not a valid workspace export.");
        }
      } catch {
        window.alert("Could not read that file as JSON.");
      }
    };
    reader.readAsText(file);
  }

  const cites = resolveWorkspaceCitations(state);

  return (
    <div className="space-y-8">
      <section aria-labelledby="download-heading">
        <h2 id="download-heading" className="font-display text-2xl font-bold">Download</h2>
        <p className="mt-1 text-sm text-muted">Everything is generated in your browser from your local data — nothing is uploaded.</p>
        <div className="mt-4 flex flex-wrap gap-2 print:hidden">
          {EXPORT_FORMATS.map((f) => (
            <button key={f.id} type="button" disabled={empty} onClick={() => download(f.id)} className="rounded-lg border border-white/40 px-4 py-2 text-sm text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:border-white/10 disabled:text-faint">
              {f.name}
            </button>
          ))}
          <button type="button" onClick={() => window.print()} className="rounded-lg border border-white/20 px-4 py-2 text-sm text-fg hover:bg-white/5">Print packet</button>
          <button type="button" onClick={() => fileRef.current?.click()} className="rounded-lg border border-white/20 px-4 py-2 text-sm text-fg hover:bg-white/5">Import JSON</button>
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onImport(f); e.target.value = ""; }} />
        </div>
      </section>

      {/* The printable research packet — a clean summary that prints well. */}
      <section aria-labelledby="packet-heading" className="scientific-card p-6 print:border-0 print:bg-transparent print:p-0">
        <h2 id="packet-heading" className="font-display text-xl font-bold">Research packet</h2>
        {empty ? (
          <p className="mt-2 text-sm text-faint">Save entities, build collections, take notes, and collect citations — they will appear here, ready to print or export.</p>
        ) : (
          <div className="mt-4 space-y-6 text-sm">
            {state.savedEntities.length > 0 && (
              <div>
                <h3 className="font-semibold text-fg">Saved entities ({state.savedEntities.length})</h3>
                <ul className="mt-1 list-disc pl-5 text-muted">{state.savedEntities.map((e) => <li key={e.id}>{e.name} — {e.type}</li>)}</ul>
              </div>
            )}
            {state.collections.length > 0 && (
              <div>
                <h3 className="font-semibold text-fg">Collections ({state.collections.length})</h3>
                <ul className="mt-1 list-disc pl-5 text-muted">{state.collections.map((c) => <li key={c.id}>{c.name} — {c.entityIds.length} entities</li>)}</ul>
              </div>
            )}
            {state.notes.length > 0 && (
              <div>
                <h3 className="font-semibold text-fg">Notes ({state.notes.length})</h3>
                <ul className="mt-1 space-y-1 text-muted">{state.notes.map((n) => <li key={n.id}><span className="font-medium text-fg">{n.title}:</span> {n.body}</li>)}</ul>
              </div>
            )}
            {cites.length > 0 && (
              <div>
                <h3 className="font-semibold text-fg">Citations ({cites.length})</h3>
                <ul className="mt-1 space-y-1 text-muted">{cites.map((c) => <li key={c.id}>{c.title} — {c.organization}. {c.url}</li>)}</ul>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
