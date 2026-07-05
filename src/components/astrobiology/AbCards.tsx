import Link from "next/link";
import type { AstrobiologyRecord } from "@/knowledge-graph/data/astrobiology-catalog/types";
import { KIND_LABEL } from "@/knowledge-graph/data/astrobiology-catalog/types";
import { astrobiologyPath } from "@/lib/routes";

/** A card grid of astrobiology disciplines, biosignatures, factors, and protection measures. */
export function AbCards({ records }: { records: AstrobiologyRecord[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {records.map((r) => (
        <li key={r.id} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-start justify-between gap-2">
            <Link href={astrobiologyPath(r.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-aurora hover:underline">{r.name}</Link>
            <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[0.65rem] uppercase tracking-wide text-faint">{KIND_LABEL[r.kind]}</span>
          </div>
          <p className="mt-2 flex-1 text-sm text-muted">{r.description}</p>
        </li>
      ))}
    </ul>
  );
}
