import Link from "next/link";
import type { InfraRecord } from "@/knowledge-graph/data/space-infrastructure-catalog/types";
import { KIND_LABEL, MATURITY_LABEL } from "@/knowledge-graph/data/space-infrastructure-catalog/types";
import { spaceInfrastructurePath } from "@/lib/routes";

/** A card grid of domains, ISRU techniques, manufacturing processes, and infrastructure. */
export function InfraCards({ records }: { records: InfraRecord[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {records.map((r) => (
        <li key={r.id} className="flex flex-col scientific-card p-5">
          <div className="flex items-start justify-between gap-2">
            <Link href={spaceInfrastructurePath(r.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nasa hover:underline">{r.name}</Link>
            <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[0.65rem] uppercase tracking-wide text-faint">{KIND_LABEL[r.kind]}</span>
          </div>
          {r.maturity ? <div className="mt-0.5 text-xs text-faint">{MATURITY_LABEL[r.maturity]}</div> : null}
          <p className="mt-2 flex-1 text-sm text-muted">{r.description}</p>
        </li>
      ))}
    </ul>
  );
}
