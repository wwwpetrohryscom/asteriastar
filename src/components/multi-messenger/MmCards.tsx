import Link from "next/link";
import type { MmRecord } from "@/knowledge-graph/data/multi-messenger-catalog/types";
import { KIND_LABEL } from "@/knowledge-graph/data/multi-messenger-catalog/types";
import { multiMessengerPath } from "@/lib/routes";

/** A card grid of GW observatories, detection methods, source classes, channels, stages, and products. */
export function MmCards({ records }: { records: MmRecord[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {records.map((r) => (
        <li key={r.id} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-start justify-between gap-2">
            <Link href={multiMessengerPath(r.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nebula hover:underline">{r.name}</Link>
            <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[0.65rem] uppercase tracking-wide text-faint">{KIND_LABEL[r.kind]}</span>
          </div>
          {r.statusLabel ? <div className="mt-0.5 text-xs text-nebula">{r.statusLabel}</div> : null}
          <p className="mt-2 flex-1 text-sm text-muted">{r.description}</p>
        </li>
      ))}
    </ul>
  );
}
