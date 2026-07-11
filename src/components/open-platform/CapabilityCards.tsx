import Link from "next/link";
import { STATUS_LABEL, type PlatformCapabilityRecord } from "@/knowledge-graph/data/open-platform-catalog";

const STATUS_CLASS: Record<string, string> = {
  available: "border-white/40 text-faint",
  "architecture-ready": "border-nasa/40 text-nasa",
  planned: "border-white/20 text-faint",
};

/** Cards for the open-platform capabilities (Program BX), each with its honest status badge and, when
 *  available, a link to its real endpoint or export. */
export function CapabilityCards({ records }: { records: PlatformCapabilityRecord[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {records.map((r) => (
        <li key={r.id} className="flex h-full flex-col scientific-card p-5">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-base font-bold text-fg">{r.name}</h3>
            <span className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${STATUS_CLASS[r.status]}`}>{STATUS_LABEL[r.status]}</span>
          </div>
          {r.standard && <p className="mt-0.5 text-xs text-faint">{r.standard}</p>}
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{r.description}</p>
          {r.limitations && <p className="mt-2 text-xs leading-relaxed text-faint">{r.limitations}</p>}
          {r.status === "available" && r.endpoint && (
            <Link href={r.endpoint} className="mt-3 inline-block text-sm font-medium text-nasa hover:underline">
              {r.endpoint.startsWith("/api") || r.endpoint.startsWith("/data") ? `${r.endpoint} →` : "Open →"}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
