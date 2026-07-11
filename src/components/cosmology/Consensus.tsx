import { CONSENSUS, CONSENSUS_LEVELS, type ConsensusLevel } from "@/knowledge-graph/data/cosmology-catalog/types";

/**
 * Consensus-classification UI. Cosmology's defining requirement: every topic is
 * visibly classified as one of five levels — Established Science, Strong
 * Evidence, Active Research, Scientific Debate, or Speculative Hypothesis — and
 * these are never visually mixed.
 */

/** A small colored pill stating a topic's scientific-consensus level. */
export function ConsensusBadge({ level, className = "" }: { level: ConsensusLevel; className?: string }) {
  const m = CONSENSUS[level];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${m.classes} ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} aria-hidden />
      {m.label}
    </span>
  );
}

/** The full five-level legend, for the hub and detail pages. */
export function ConsensusLegend() {
  return (
    <section aria-labelledby="consensus-legend" className="scientific-card p-5">
      <h2 id="consensus-legend" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">How we classify scientific consensus</h2>
      <p className="mt-2 text-sm text-muted">Every topic in this encyclopedia is labelled by how well established it is. Established science, strong evidence, active research, scientific debate, and speculation are kept distinct — never conflated.</p>
      <ul className="mt-4 space-y-2.5">
        {CONSENSUS_LEVELS.map((l) => (
          <li key={l} className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
            <div className="shrink-0"><ConsensusBadge level={l} /></div>
            <span className="text-sm text-muted">{CONSENSUS[l].description}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** A per-page callout stating this topic's classification. */
export function ConsensusCallout({ level, status }: { level: ConsensusLevel; status?: string }) {
  const m = CONSENSUS[level];
  return (
    <aside role="note" className={`flex flex-col gap-1 rounded-xl border p-4 ${m.classes}`}>
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${m.dot}`} aria-hidden />
        <span className="text-sm font-semibold">Consensus: {m.label}</span>
      </div>
      <p className="text-sm leading-relaxed text-muted">{status ?? m.description}</p>
    </aside>
  );
}

/** Sidebar card summarising the consensus level. */
export function ConsensusCard({ level }: { level: ConsensusLevel }) {
  const m = CONSENSUS[level];
  return (
    <section aria-labelledby="consensus" className="scientific-card p-5">
      <h2 id="consensus" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Scientific consensus</h2>
      <div className="mt-3"><ConsensusBadge level={level} /></div>
      <p className="mt-3 text-xs leading-relaxed text-faint">{m.description}</p>
    </section>
  );
}
