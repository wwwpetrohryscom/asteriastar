"use client";

import { clearWorkspace, useWorkspace } from "@/lib/workspace/store";

/**
 * The privacy control (Program BV). States the design guarantees — local-only, no account, no server,
 * no cookie, no tracking — shows exactly what is held in the browser, and offers a single control to
 * erase all of it. These are properties of the code, not policy promises.
 */
export function PrivacyPanel() {
  const state = useWorkspace();
  const total = state.savedEntities.length + state.collections.length + state.notes.length + state.citations.length;

  const guarantees = [
    "Stored only in this browser's localStorage, under a single key.",
    "No account and no sign-in — the workspace is tied to this browser, not to you.",
    "No server persistence — your data is never uploaded or synced.",
    "No cookie is set, and no analytics or tracking records what you save.",
    "You can export everything, and erase everything, at any time.",
  ];

  return (
    <div className="space-y-8">
      <section aria-labelledby="guarantees" className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <h2 id="guarantees" className="font-display text-lg font-bold text-fg">What is guaranteed</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          {guarantees.map((g) => (
            <li key={g} className="flex gap-2"><span className="text-comet">✓</span>{g}</li>
          ))}
        </ul>
        <p className="mt-4 text-xs leading-relaxed text-faint">These are properties of how the workspace is built — it makes no network request — not a policy that could change.</p>
      </section>

      <section aria-labelledby="held" className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <h2 id="held" className="font-display text-lg font-bold text-fg">What is held in this browser</h2>
        <dl className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <div><dt className="text-faint">Saved entities</dt><dd className="font-display text-xl font-bold text-fg">{state.savedEntities.length}</dd></div>
          <div><dt className="text-faint">Collections</dt><dd className="font-display text-xl font-bold text-fg">{state.collections.length}</dd></div>
          <div><dt className="text-faint">Notes</dt><dd className="font-display text-xl font-bold text-fg">{state.notes.length}</dd></div>
          <div><dt className="text-faint">Citations</dt><dd className="font-display text-xl font-bold text-fg">{state.citations.length}</dd></div>
        </dl>
        <p className="mt-3 text-xs text-faint">Storage key: <code className="rounded bg-white/5 px-1">asteriastar:workspace:v1</code></p>
      </section>

      <section aria-labelledby="erase" className="rounded-2xl border border-ember/30 bg-ember/[0.04] p-6">
        <h2 id="erase" className="font-display text-lg font-bold text-fg">Erase everything</h2>
        <p className="mt-2 text-sm text-muted">Permanently delete all {total} items from this browser. This cannot be undone — export first if you want a copy.</p>
        <button
          type="button"
          disabled={total === 0}
          onClick={() => { if (window.confirm("Permanently erase your entire workspace from this browser?")) clearWorkspace(); }}
          className="mt-4 rounded-lg border border-ember/50 px-4 py-2 text-sm text-ember hover:bg-ember/10 disabled:cursor-not-allowed disabled:border-white/10 disabled:text-faint"
        >
          Erase all workspace data
        </button>
      </section>
    </div>
  );
}
