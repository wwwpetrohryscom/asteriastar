import Link from "next/link";
import { engine } from "@/platform/data-engine";
import { CITATIONS, type Citation } from "@/lib/citations";
import { SOURCES, type SourceKey } from "@/lib/sources";
import { EVIDENCE_LABELS, EVIDENCE_DESCRIPTIONS, EVIDENCE_ACCENT, type EvidenceLevel } from "@/platform/authority/evidence";

/**
 * "Provenance & sources" — exposes an entity's seeded scientific authority: the
 * sourced statements, their evidence level, primary sources, linked citations,
 * the internal review status/version, and any honest limitations. Renders
 * nothing when an entity has no provenance yet (honest gaps stay invisible, not
 * faked). Driven entirely by real registry data.
 */

const ACCENT_CLASS: Record<string, string> = {
  halo: "text-sky-300 border-sky-400/30 bg-sky-400/10",
  comet: "text-emerald-300 border-emerald-400/30 bg-emerald-400/10",
  gold: "text-amber-300 border-amber-400/30 bg-amber-400/10",
  stone: "text-slate-300 border-slate-400/30 bg-slate-400/10",
  plasma: "text-fuchsia-300 border-fuchsia-400/30 bg-fuchsia-400/10",
  ember: "text-amber-300 border-amber-400/30 bg-amber-400/10",
};

function EvidenceBadge({ level }: { level: EvidenceLevel }) {
  const cls = ACCENT_CLASS[EVIDENCE_ACCENT[level]] ?? ACCENT_CLASS.stone;
  return (
    <span title={EVIDENCE_DESCRIPTIONS[level]} className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {EVIDENCE_LABELS[level]} evidence
    </span>
  );
}

const CITATION_BY_ID = new Map<string, Citation>(CITATIONS.map((c) => [c.id, c]));

export function EntityProvenancePanel({ entityId }: { entityId: string }) {
  const records = engine.authority.provenanceFor(entityId);
  if (records.length === 0) return null;
  const review = engine.authority.review(entityId);

  return (
    <section aria-labelledby="provenance-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 id="provenance-heading" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">
          Provenance &amp; sources
        </h2>
        {review?.reviewVersion && <span className="text-xs text-faint">review {review.reviewVersion}</span>}
      </div>

      {review && (
        <p className="mt-2 text-xs leading-relaxed text-faint">
          {review.reviewedBy}
          {review.verificationLevel ? ` · verification: ${review.verificationLevel}` : ""}
          {review.scientificAccuracy ? ` · ${review.scientificAccuracy}` : ""}
        </p>
      )}

      <ul className="mt-4 space-y-4">
        {records.map((r) => {
          const src = r.primarySource;
          const srcKey = src?.source as SourceKey | undefined;
          const srcUrl = src?.url ?? (srcKey ? SOURCES[srcKey]?.url : undefined);
          const cites = (r.citationIds ?? []).map((id) => CITATION_BY_ID.get(id)).filter(Boolean) as Citation[];
          return (
            <li key={r.id} className="border-t border-white/5 pt-3 first:border-t-0 first:pt-0">
              <div className="flex flex-wrap items-center gap-2">
                <EvidenceBadge level={r.evidenceLevel} />
                {r.confidence && <span className="text-[0.65rem] uppercase tracking-wider text-faint">{r.confidence}</span>}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{r.statement}</p>

              {src && (
                <p className="mt-2 text-xs text-faint">
                  Source:{" "}
                  {srcUrl ? (
                    <a href={srcUrl} target="_blank" rel="noreferrer nofollow" className="text-nebula underline-offset-4 hover:underline">
                      {src.organization}
                    </a>
                  ) : (
                    <span className="text-muted">{src.organization}</span>
                  )}
                  {src.publication ? ` — ${src.publication}` : ""}
                  {src.license ? ` · ${src.license}` : ""}
                </p>
              )}

              {cites.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {cites.map((c) => (
                    <li key={c.id} className="text-xs text-faint">
                      <a href={c.url} target="_blank" rel="noreferrer nofollow" className="text-nebula underline-offset-4 hover:underline">
                        {c.title}
                      </a>
                      {c.publication ? `, ${c.publication}` : ""}
                      {c.date ? ` (${c.date})` : ""}
                      {c.doi ? <span className="ml-1 font-mono text-[0.65rem] text-faint">doi:{c.doi}</span> : null}
                    </li>
                  ))}
                </ul>
              )}

              {r.editorialNote && (
                <p className="mt-2 text-xs leading-relaxed text-amber-200/80">
                  <span className="font-medium">Limitation:</span> {r.editorialNote}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <p className="mt-4 border-t border-white/10 pt-3 text-xs leading-relaxed text-faint">
        Reviewed by the internal Asteria Scientific Review Process — not an external institutional review. See the{" "}
        <Link href="/transparency/evidence-framework" className="text-nebula underline-offset-4 hover:underline">evidence framework</Link>{" "}
        and <Link href="/authority" className="text-nebula underline-offset-4 hover:underline">authority dashboard</Link>.
      </p>
    </section>
  );
}
