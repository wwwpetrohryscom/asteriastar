import Link from "next/link";
import { satellitePath, satelliteConstellationPath, satelliteOrbitPath, satelliteOperatorPath, satelliteNetworkPath } from "@/lib/routes";
import { OPERATOR_BY_SLUG } from "@/knowledge-graph/data/satellites-catalog";
import type { SatelliteRecord } from "@/knowledge-graph/data/satellites-catalog/types";

export const CATEGORY_LABEL: Record<string, string> = {
  communications: "Communications",
  navigation: "Navigation",
  "earth-observation": "Earth observation",
  weather: "Weather",
  astronomy: "Astronomy",
  science: "Science",
  commercial: "Commercial",
  technology: "Technology",
  "military-history": "Military (historical)",
  "human-spaceflight": "Human spaceflight",
};

/** The published route for a record, by kind. */
export function recordPath(r: Pick<SatelliteRecord, "kind" | "slug">): string {
  switch (r.kind) {
    case "constellation":
      return satelliteConstellationPath(r.slug);
    case "orbit":
      return satelliteOrbitPath(r.slug);
    case "operator":
      return satelliteOperatorPath(r.slug);
    case "network":
      return satelliteNetworkPath(r.slug);
    default:
      return satellitePath(r.slug);
  }
}

/** Operator display name — free-text if given, else resolved from the operator record. */
export function operatorLabel(r: SatelliteRecord): string | undefined {
  return r.operatorName ?? (r.operatorSlug ? OPERATOR_BY_SLUG.get(r.operatorSlug)?.name : undefined);
}

/** Orbit display — the human orbit class if given, else the orbit slug uppercased. */
export function orbitLabel(r: SatelliteRecord): string | undefined {
  return r.orbitClass ?? (r.orbitSlug ? r.orbitSlug.toUpperCase() : undefined);
}

/** Status pill with an honest colour per lifecycle state. */
export function StatusPill({ status }: { status?: string }) {
  if (!status) return <span className="text-faint">—</span>;
  const s = status.toLowerCase();
  const cls = /active|operational/.test(s)
    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
    : /retired|decommission/.test(s)
      ? "border-white/15 bg-white/[0.03] text-faint"
      : /develop|planned/.test(s)
        ? "border-sky-400/30 bg-sky-400/10 text-sky-300"
        : "border-white/15 bg-white/[0.03] text-muted";
  return <span className={`inline-block rounded-full border px-2 py-0.5 text-[0.65rem] font-medium ${cls}`}>{status}</span>;
}

export function SatellitesTable({ records }: { records: SatelliteRecord[] }) {
  if (records.length === 0) {
    return <p className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-muted">No satellites match this view yet.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-faint">
            <th scope="col" className="px-4 py-3 font-medium">Name</th>
            <th scope="col" className="px-4 py-3 font-medium">Category</th>
            <th scope="col" className="px-4 py-3 font-medium">Operator</th>
            <th scope="col" className="px-4 py-3 font-medium">Orbit</th>
            <th scope="col" className="px-4 py-3 font-medium">Launched</th>
            <th scope="col" className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {records.map((r) => (
            <tr key={r.id} className="transition hover:bg-white/[0.02]">
              <td className="px-4 py-3">
                <Link href={recordPath(r)} className="font-medium text-fg underline-offset-4 hover:text-nebula hover:underline">{r.name}</Link>
                {r.kind === "constellation" && <span className="ml-2 rounded bg-white/[0.06] px-1.5 py-0.5 text-[0.6rem] uppercase tracking-wide text-faint">Constellation</span>}
              </td>
              <td className="px-4 py-3 text-muted">{r.category ? CATEGORY_LABEL[r.category] ?? r.category : "—"}</td>
              <td className="px-4 py-3 text-muted">{operatorLabel(r) ?? "—"}</td>
              <td className="px-4 py-3 font-mono text-xs text-muted">{orbitLabel(r) ?? "—"}</td>
              <td className="px-4 py-3 font-mono text-xs text-muted">{r.launchDate ?? "—"}</td>
              <td className="px-4 py-3"><StatusPill status={r.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
