import Link from "next/link";
import type { AssistantRecord } from "@/knowledge-graph/data/scientific-assistant-catalog/types";
import { assistantPath } from "@/lib/routes";

/** A card grid of assistant capabilities. */
export function AsCards({ records }: { records: AssistantRecord[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {records.map((r) => (
        <li key={r.id} className="flex flex-col scientific-card p-5">
          <div className="flex items-start justify-between gap-2">
            <Link href={assistantPath(r.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nasa hover:underline">{r.name}</Link>
            <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[0.65rem] uppercase tracking-wide text-faint">{r.grounding === "grounded" ? "Grounded" : "Architecture"}</span>
          </div>
          <div className="mt-0.5 text-xs text-nasa">{r.capability}</div>
          <p className="mt-2 flex-1 text-sm text-muted">{r.description}</p>
        </li>
      ))}
    </ul>
  );
}
