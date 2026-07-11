import { StatusBadge, type PortalStatus } from "@/components/data/StatusBadge";
import { LICENSES } from "@/platform/open-data/licenses";
import type { CatalogueEntry } from "@/platform/open-data/catalogue";

/** Human byte sizes for real, checksummed downloads. */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KiB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MiB`;
}

const STATUS_MAP: Record<CatalogueEntry["status"], PortalStatus> = {
  stable: "stable",
  prepared: "prepared",
  planned: "planned",
  architecture: "architecture",
};

/** A dataset card showing real record count, formats, license, and (real) checksums. */
export function DatasetCard({ entry }: { entry: CatalogueEntry }) {
  const license = LICENSES[entry.license];
  return (
    <div className="scientific-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-display text-base font-semibold text-fg">{entry.title}</h3>
        <StatusBadge status={STATUS_MAP[entry.status]} />
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{entry.description}</p>

      <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-faint">
        <div>
          <dt className="inline">Records: </dt>
          <dd className="inline font-mono text-muted">{entry.recordCount == null ? "—" : entry.recordCount.toLocaleString()}</dd>
        </div>
        <div>
          <dt className="inline">Version: </dt>
          <dd className="inline font-mono text-muted">{entry.version}</dd>
        </div>
        <div>
          <dt className="inline">License: </dt>
          <dd className="inline text-muted">{license.name}</dd>
        </div>
      </dl>

      <ul className="mt-3 flex flex-wrap gap-2">
        {entry.formats.map((f) => {
          const key = `${f.format}-${f.href ?? "planned"}`;
          if (f.status === "available" && f.href) {
            return (
              <li key={key}>
                <a
                  href={f.href}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 font-mono text-xs text-nasa underline-offset-4 hover:border-white/25 hover:underline"
                >
                  {f.format}
                  {f.bytes != null && <span className="text-faint">· {formatBytes(f.bytes)}</span>}
                </a>
              </li>
            );
          }
          return (
            <li key={key} className="inline-flex items-center rounded-lg border border-dashed border-white/10 px-2.5 py-1 font-mono text-xs text-faint">
              {f.format} · planned
            </li>
          );
        })}
      </ul>

      {entry.formats.some((f) => f.sha256) && (
        <details className="mt-3">
          <summary className="cursor-pointer text-xs text-faint hover:text-muted">Checksums (SHA-256)</summary>
          <ul className="mt-2 space-y-1">
            {entry.formats.filter((f) => f.sha256).map((f) => (
              <li key={f.href} className="break-all font-mono text-[0.7rem] text-faint">
                {f.format}: {f.sha256}
              </li>
            ))}
          </ul>
        </details>
      )}

      {entry.limitations && (
        <p className="mt-3 text-xs leading-relaxed text-nasa/80">{entry.limitations}</p>
      )}
    </div>
  );
}
