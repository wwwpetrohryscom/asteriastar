import Link from "next/link";
import type { MinorBodyRecord } from "@/knowledge-graph/data/asteroids-catalog/types";
import { recordHref, diameterLabel, CATEGORY_LABEL, TAXONOMY_LABEL } from "@/components/asteroids/AsteroidsTable";

function Fact({ label, value }: { label: string; value?: string | number | null }) {
  if (value == null || value === "") return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.02] px-2 py-0.5 text-[0.7rem] text-muted">
      <span className="text-faint">{label}</span>
      <span className="text-fg">{value}</span>
    </span>
  );
}

export function AsteroidsCards({ records }: { records: MinorBodyRecord[] }) {
  if (records.length === 0) {
    return <p className="scientific-card p-4 text-sm text-muted">No bodies match this view yet.</p>;
  }
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {records.map((r) => {
        const href = recordHref(r);
        return (
          <li key={r.id} className="flex flex-col scientific-card p-5">
            <div className="flex items-baseline justify-between gap-2">
              {href ? <Link href={href} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nasa hover:underline">{r.name}</Link> : <span className="font-display text-base font-semibold text-fg">{r.name}</span>}
              {r.pha && <span className="shrink-0 rounded bg-nasa/10 px-1.5 py-0.5 text-[0.6rem] uppercase tracking-wide text-nasa">PHA</span>}
            </div>
            <p className="mt-1 flex-1 text-sm text-muted">{r.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Fact label="Category" value={r.category ? CATEGORY_LABEL[r.category] ?? r.category : null} />
              <Fact label="Type" value={r.taxonomyClass ? TAXONOMY_LABEL[r.taxonomyClass] ?? r.taxonomyClass : null} />
              <Fact label="Diameter" value={diameterLabel(r)} />
              <Fact label="Discovered" value={r.discoveryYear} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
