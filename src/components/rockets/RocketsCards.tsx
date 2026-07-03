import Link from "next/link";
import { rocketPath } from "@/lib/routes";
import { KIND_LABEL, type RocketRecord } from "@/knowledge-graph/data/rockets-catalog/types";

/** One compact fact chip. */
function Fact({ label, value }: { label: string; value?: string | number | null }) {
  if (value == null || value === "") return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.02] px-2 py-0.5 text-[0.7rem] text-muted">
      <span className="text-faint">{label}</span>
      <span className="text-fg">{value}</span>
    </span>
  );
}

function factsFor(r: RocketRecord): { label: string; value?: string | number | null }[] {
  switch (r.kind) {
    case "vehicle":
      return [
        { label: "Class", value: r.liftClass },
        { label: "First flight", value: r.firstFlight },
        { label: "LEO", value: r.payloadLeoKg != null ? `${r.payloadLeoKg.toLocaleString()} kg` : null },
        { label: "Status", value: r.status },
      ];
    case "engine":
      return [
        { label: "Cycle", value: r.engineCycle },
        { label: "SL thrust", value: r.thrustSeaLevelKn != null ? `${r.thrustSeaLevelKn.toLocaleString()} kN` : null },
        { label: "Vac thrust", value: r.thrustVacuumKn != null ? `${r.thrustVacuumKn.toLocaleString()} kN` : null },
      ];
    case "propellant":
      return [
        { label: "Fuel", value: r.fuel },
        { label: "Oxidizer", value: r.oxidizer },
        { label: "Class", value: r.propellantClass },
      ];
    case "stage":
      return [
        { label: "Role", value: r.stageRole },
        { label: "Engines", value: r.engineCount },
      ];
    case "pad":
      return [{ label: "Location", value: r.location }];
    case "family":
    case "provider":
    case "program":
      return [
        { label: "Country", value: r.country },
        { label: "Since", value: r.startYear },
        { label: "Status", value: r.status },
      ];
    default:
      return [];
  }
}

export function RocketsCards({ records }: { records: RocketRecord[] }) {
  if (records.length === 0) {
    return <p className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-muted">Nothing in this view yet.</p>;
  }
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {records.map((r) => (
        <li key={r.id} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-baseline justify-between gap-2">
            <Link href={rocketPath(r.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nebula hover:underline">{r.name}</Link>
            <span className="shrink-0 text-[0.65rem] uppercase tracking-wider text-faint">{KIND_LABEL[r.kind]}</span>
          </div>
          <p className="mt-1 flex-1 text-sm text-muted">{r.description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {factsFor(r).map((f, i) => <Fact key={i} label={f.label} value={f.value} />)}
          </div>
        </li>
      ))}
    </ul>
  );
}
