import type { MissionPrimaryRow } from "@/knowledge-graph/data/mission-primary";
import { VERIFICATION_LABEL } from "@/knowledge-graph/data/mission-primary";
import type { FieldVerification } from "@/knowledge-graph/data/mission-primary/types";

/**
 * Program 4 — visible rendering of primary-source verification for mission engineering
 * facts. Each field's committed value is shown with the outcome of CORROBORATING it
 * against the official agency primary source: `confirmed_by_primary` only when that
 * document literally contains the value. Nothing is transcribed from the page; an
 * uncorroborated value is shown honestly as retained (secondary), never as primary.
 * Existing table/card styling only — no new design language.
 */

const CHIP: Record<FieldVerification, string> = {
  confirmed_by_primary: "text-success-strong border-success/30 bg-success/10",
  retained_secondary: "text-faint border-white/20 bg-white/5",
  superseded_by_primary: "text-nasa border-nasa/30 bg-nasa/10",
  conflict: "text-amber-400 border-amber-400/40 bg-amber-400/10",
  rejected: "text-red-400 border-red-400/40 bg-red-400/10",
};
const CHIP_LABEL: Record<FieldVerification, string> = {
  confirmed_by_primary: "Confirmed by primary",
  retained_secondary: "Not corroborated",
  superseded_by_primary: "Superseded by primary",
  conflict: "Conflict",
  rejected: "Rejected",
};

function VChip({ status }: { status: FieldVerification }) {
  return <span title={VERIFICATION_LABEL[status]} className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${CHIP[status]}`}>{CHIP_LABEL[status]}</span>;
}

export function PrimaryVerificationSection({ p }: { p: MissionPrimaryRow }) {
  const rows: { label: string; value: string; status: FieldVerification }[] = [];
  if (p.catalogueLaunchDate) rows.push({ label: "Launch date", value: p.catalogueLaunchDate, status: p.launchDateVerification });
  if (p.wikidataMassKg != null) rows.push({ label: "Launch mass", value: `${p.wikidataMassKg.toLocaleString()} kg`, status: p.massVerification });
  if (!rows.length) return null;

  const conflictMass = p.massVerification === "conflict" && p.primaryStatedMassKg?.length === 1 ? p.primaryStatedMassKg[0] : null;
  const conflictDate = p.launchDateVerification === "conflict" ? p.primaryStatedLaunchDate : null;

  return (
    <section aria-labelledby="primary-verification">
      <h2 id="primary-verification" className="font-display text-2xl font-bold">Primary-source verification</h2>
      <p className="mt-1 text-sm text-muted">
        Committed mission facts cross-checked against the official {p.agency} primary source —{" "}
        <a href={p.sourceUrl} className="text-nasa hover:underline" rel="noopener noreferrer" target="_blank">{p.sourceTitle}</a>
        {p.reachable ? "" : " (source unreachable at last check)"}.
      </p>
      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <tbody className="divide-y divide-white/5">
            {rows.map((r) => (
              <tr key={r.label} className="transition hover:bg-white/[0.02]">
                <td className="px-4 py-2.5 align-top text-faint">{r.label}</td>
                <td className="px-4 py-2.5 font-medium text-fg">
                  {r.value}
                  {r.label === "Launch mass" && conflictMass != null
                    ? <span className="text-amber-400/90"> · primary states {conflictMass.toLocaleString()} kg</span>
                    : null}
                  {r.label === "Launch date" && conflictDate != null
                    ? <span className="text-amber-400/90"> · primary states {conflictDate}</span>
                    : null}
                </td>
                <td className="px-4 py-2.5 text-right align-top"><VChip status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-faint">
        Verified by corroboration against the official agency document: a launch date is
        &ldquo;Confirmed by primary&rdquo; only when the page literally states it; a launch mass only when
        the page states a figure equal to it within catalogue rounding (±0.5%). Source precedence is
        primary agency &gt; peer-reviewed &gt; official mission page &gt; structured secondary &gt; Wikidata;
        a primary source outranks Wikidata but no engineering value is transcribed from the page — an
        uncorroborated value is kept as its original (secondary) source, never re-labelled primary. Checked {p.retrievedAt}.
      </p>
    </section>
  );
}
