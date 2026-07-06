import Link from "next/link";
import type { GraphViewRecord } from "@/knowledge-graph/data/graph-explorer-catalog/types";
import { graphViewPath } from "@/lib/routes";

const BACKING_LABEL: Record<string, string> = {
  computed: "Live algorithm",
  rendering: "Visualisation mode",
  architecture: "Architecture-ready",
};

/** A card grid of graph-explorer views. */
export function GxCards({ records }: { records: GraphViewRecord[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {records.map((r) => (
        <li key={r.id} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-start justify-between gap-2">
            <Link href={graphViewPath(r.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-halo hover:underline">{r.name}</Link>
            <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[0.65rem] uppercase tracking-wide text-faint">{BACKING_LABEL[r.backing] ?? r.backing}</span>
          </div>
          <div className="mt-0.5 text-xs text-halo">{r.capability}</div>
          <p className="mt-2 flex-1 text-sm text-muted">{r.description}</p>
        </li>
      ))}
    </ul>
  );
}
