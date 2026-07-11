import Link from "next/link";
import type { MeteoriteRecord } from "@/knowledge-graph/data/meteorites-catalog/types";
import { recordHref, CATEGORY_LABEL } from "@/components/meteorites/MeteoritesTable";

function Fact({ label, value }: { label: string; value?: string | number | null }) {
  if (value == null || value === "") return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.02] px-2 py-0.5 text-[0.7rem] text-muted">
      <span className="text-faint">{label}</span>
      <span className="text-fg">{value}</span>
    </span>
  );
}

export function MeteoritesCards({ records }: { records: MeteoriteRecord[] }) {
  if (records.length === 0) {
    return <p className="scientific-card p-4 text-sm text-muted">No meteorites match this view yet.</p>;
  }
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {records.map((r) => (
        <li key={r.id} className="flex flex-col scientific-card p-5">
          <div className="flex items-baseline justify-between gap-2">
            <Link href={recordHref(r)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nasa hover:underline">{r.name}</Link>
            {r.fallType && <span className="shrink-0 text-[0.7rem] uppercase tracking-wide text-faint">{r.fallType}</span>}
          </div>
          <p className="mt-1 flex-1 text-sm text-muted">{r.description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Fact label="Class" value={r.classificationLabel ?? (r.category ? CATEGORY_LABEL[r.category] ?? r.category : null)} />
            <Fact label="Country" value={r.country} />
            <Fact label="Date" value={r.fallDate ?? r.discoveryYear} />
            {r.massLabel && <Fact label="Mass" value={r.massLabel} />}
          </div>
        </li>
      ))}
    </ul>
  );
}
