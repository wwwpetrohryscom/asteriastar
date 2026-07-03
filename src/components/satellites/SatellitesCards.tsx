import Link from "next/link";
import type { SatelliteRecord } from "@/knowledge-graph/data/satellites-catalog/types";
import { recordPath, operatorLabel, orbitLabel, StatusPill } from "@/components/satellites/SatellitesTable";

function Fact({ label, value }: { label: string; value?: string | number | null }) {
  if (value == null || value === "") return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.02] px-2 py-0.5 text-[0.7rem] text-muted">
      <span className="text-faint">{label}</span>
      <span className="text-fg">{value}</span>
    </span>
  );
}

export function SatellitesCards({ records }: { records: SatelliteRecord[] }) {
  if (records.length === 0) {
    return <p className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-muted">No satellites match this view yet.</p>;
  }
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {records.map((r) => (
        <li key={r.id} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-baseline justify-between gap-2">
            <Link href={recordPath(r)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nebula hover:underline">{r.name}</Link>
            <StatusPill status={r.status} />
          </div>
          <p className="mt-1 flex-1 text-sm text-muted">{r.description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Fact label="Operator" value={operatorLabel(r)} />
            <Fact label="Orbit" value={orbitLabel(r)} />
            <Fact label="Launched" value={r.launchDate} />
            {r.kind === "constellation" && r.constellationSizeLabel && <Fact label="Size" value={r.constellationSizeLabel} />}
          </div>
        </li>
      ))}
    </ul>
  );
}
