import Link from "next/link";
import type { CometRecord } from "@/knowledge-graph/data/comets-catalog/types";
import { recordHref, periodLabel, CATEGORY_LABEL } from "@/components/comets/CometsTable";

function Fact({ label, value }: { label: string; value?: string | number | null }) {
  if (value == null || value === "") return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.02] px-2 py-0.5 text-[0.7rem] text-muted">
      <span className="text-faint">{label}</span>
      <span className="text-fg">{value}</span>
    </span>
  );
}

export function CometsCards({ records }: { records: CometRecord[] }) {
  if (records.length === 0) {
    return <p className="scientific-card p-4 text-sm text-muted">No comets match this view yet.</p>;
  }
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {records.map((r) => {
        const href = recordHref(r);
        return (
          <li key={r.id} className="flex flex-col scientific-card p-5">
            <div className="flex items-baseline justify-between gap-2">
              {href ? <Link href={href} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nasa hover:underline">{r.name}</Link> : <span className="font-display text-base font-semibold text-fg">{r.name}</span>}
              {r.designation && <span className="shrink-0 font-mono text-[0.7rem] text-faint">{r.designation.split(" ")[0]}</span>}
            </div>
            <p className="mt-1 flex-1 text-sm text-muted">{r.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Fact label="Type" value={r.cometTypeLabel ?? (r.category ? CATEGORY_LABEL[r.category] ?? r.category : null)} />
              <Fact label="Period" value={periodLabel(r)} />
              <Fact label="Discovered" value={r.discoveryYear} />
              {r.greatComet && <Fact label="Great comet" value="Yes" />}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
