import Link from "next/link";
import { ContributionStateBadge } from "@/components/contribute/ContributionStateBadge";
import {
  CONTRIBUTION_TYPES,
  CONTRIBUTION_STATES,
  STATE_DESCRIPTIONS,
  nextStates,
  CHANGE_KINDS,
  CHANGE_KIND_IMPACT,
  VERSION_IMPACT_DESCRIPTIONS,
  IMPACT_CATEGORIES,
  IMPACT_CATEGORY_LABELS,
  IMPACT_CATEGORY_DESCRIPTIONS,
  CONTROL_STAGES,
  controlsForStage,
  NOTIFICATION_EVENTS,
  CONTRIBUTE_TEMPLATES,
  contributionsEngine,
  type ContributionType,
} from "@/platform/contributions";
import { EVIDENCE_LEVELS, EVIDENCE_LABELS, EVIDENCE_DESCRIPTIONS } from "@/platform/authority/evidence";
import { ROUTES } from "@/lib/routes";

const card = "rounded-2xl border border-white/10 bg-white/[0.02] p-5";
const S = contributionsEngine.stats;

function Prose({ children }: { children: React.ReactNode }) {
  return <p className="max-w-2xl text-sm leading-relaxed text-muted">{children}</p>;
}
function A({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="text-comet underline-offset-4 hover:underline">{children}</Link>;
}
function typesForTrack(track: string): ContributionType[] {
  return CONTRIBUTION_TYPES.filter((t) => t.track === track).map((t) => t.id);
}

/** The honest empty-state block used by every dashboard. */
function EmptyState({ label, note }: { label: string; note: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.01] p-8 text-center">
      <p className="font-display text-lg font-semibold text-fg">Nothing here yet</p>
      <p className="mx-auto mt-2 max-w-lg text-sm text-muted">{note}</p>
      <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 font-mono text-xs text-faint">
        {label}: 0
      </p>
    </div>
  );
}

/* ------------------------------------------------------------ how it works */
function HowItWorks() {
  const flow = [
    ["Proposal", "A contributor drafts a structured proposal attached to real graph objects."],
    ["Validation", "Automated checks confirm targets resolve, sources are present, and domains are separated."],
    ["Editorial review", "An editor checks scope, clarity, and policy, then routes the proposal."],
    ["Scientific review", "Where a factual claim is made, a domain expert verifies accuracy and evidence."],
    ["Decision", "Accepted, rejected, or returned for sources/changes — always with a recorded reason."],
    ["Versioned update", "Only an accepted proposal may become a versioned graph update. The graph stays the source of truth."],
  ];
  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-comet/25 bg-comet/[0.05] p-4">
        <p className="text-sm leading-relaxed text-muted">
          <strong className="text-fg">Core principle.</strong> No contribution changes the knowledge graph directly. Every
          contribution is a proposal that is validated and reviewed before any versioned update. Contributions are proposals,
          not truth.
        </p>
      </div>
      <ol className="space-y-3">
        {flow.map(([title, desc], i) => (
          <li key={title} className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 text-xs text-faint">{i + 1}</span>
            <div><span className="font-display font-semibold text-fg">{title}</span><p className="text-sm text-muted">{desc}</p></div>
          </li>
        ))}
      </ol>
      <section>
        <h2 className="font-display text-xl font-bold">Review states</h2>
        <Prose>Every proposal moves through valid states only. Invalid transitions are rejected; no history is fabricated.</Prose>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead><tr className="text-xs uppercase tracking-wider text-faint"><th className="pb-2 pr-4 font-medium">State</th><th className="pb-2 pr-4 font-medium">Meaning</th><th className="pb-2 font-medium">Can move to</th></tr></thead>
            <tbody className="divide-y divide-white/5">
              {CONTRIBUTION_STATES.map((s) => (
                <tr key={s} className="align-top">
                  <td className="py-2 pr-4"><ContributionStateBadge state={s} /></td>
                  <td className="py-2 pr-4 text-xs text-muted">{STATE_DESCRIPTIONS[s]}</td>
                  <td className="py-2 font-mono text-[0.7rem] text-faint">{nextStates(s).join(", ") || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------- guidelines */
function Guidelines() {
  const rules = [
    "Attach to a real object. Every contribution references an existing entity, relationship, dataset, source, image, or timeline — no orphans.",
    "Bring a source. Scientific and factual claims must reference at least one authoritative source (existing or proposed).",
    "Keep domains honest. An interpretive (cultural/astrological) claim can never be marked scientific.",
    "Declare evidence. Where you assert a fact, state its evidence level; it is validated against the domain.",
    "Provenance for images. Image contributions must carry a license, a credit, and a source.",
    "One change, one proposal. Don't bundle unrelated edits; duplicates targeting the same object are merged, not double-applied.",
    "Explain why. Every proposal and changeset records a rationale and, for changes, rollback notes.",
  ];
  return (
    <div className="space-y-8">
      <Prose>A good contribution is small, sourced, attached to a real object, and honest about its domain and evidence. Reviewers check exactly these things. Start from a <A href="/contribute/templates">template</A>.</Prose>
      <ul className="space-y-2">
        {rules.map((r) => (
          <li key={r} className="flex gap-2 text-sm text-muted"><span aria-hidden className="mt-1 text-comet">✓</span><span>{r}</span></li>
        ))}
      </ul>
      <section>
        <h2 className="font-display text-xl font-bold">Contribution types ({S.types})</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {CONTRIBUTION_TYPES.map((t) => (
            <div key={t.id} className={card}>
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-display text-sm font-semibold text-fg">{t.label}</span>
                <span className="font-mono text-[0.65rem] uppercase tracking-wider text-faint">{t.track}</span>
              </div>
              <p className="mt-1 text-xs text-muted">{t.description}</p>
              <p className="mt-2 font-mono text-[0.65rem] text-faint">targets: {[...t.requiredTargets, ...t.optionalTargets].join(", ") || "proposes new"}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* --------------------------------------------------------------- a track page */
function TrackPage({ track, blurb, extra }: { track: string; blurb: string; extra?: React.ReactNode }) {
  const ids = typesForTrack(track);
  return (
    <div className="space-y-6">
      <Prose>{blurb}</Prose>
      <section>
        <h2 className="font-display text-xl font-bold">Contribution types on this track</h2>
        <div className="mt-4 space-y-3">
          {CONTRIBUTION_TYPES.filter((t) => ids.includes(t.id)).map((t) => (
            <div key={t.id} className={card}>
              <span className="font-display text-sm font-semibold text-fg">{t.label}</span>
              <p className="mt-1 text-xs text-muted">{t.description}</p>
              <p className="mt-2 text-[0.65rem] text-faint">Improves: {t.impact.map((c) => IMPACT_CATEGORY_LABELS[c]).join(", ") || "—"}</p>
            </div>
          ))}
        </div>
      </section>
      {extra}
      <p className="text-sm text-faint">Ready to draft one? Copy a <A href="/contribute/templates">proposal template</A>.</p>
    </div>
  );
}

/* -------------------------------------------------------------- standards */
function Standards() {
  return (
    <div className="space-y-8">
      <Prose>The standards every contribution is held to — evidence, domain separation, licensing, and the quality dimensions an accepted change improves.</Prose>
      <section>
        <h2 className="font-display text-xl font-bold">Evidence levels</h2>
        <Prose>Reused from the platform&apos;s <A href={ROUTES.authority}>Scientific Authority</A> model. Interpretive traditions use the interpretive level only.</Prose>
        <div className="mt-4 space-y-2">
          {EVIDENCE_LEVELS.map((lvl) => (
            <div key={lvl} className={card}><span className="font-medium text-fg">{EVIDENCE_LABELS[lvl]}</span><span className="ml-3 text-sm text-muted">{EVIDENCE_DESCRIPTIONS[lvl]}</span></div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="font-display text-xl font-bold">Quality impact ({IMPACT_CATEGORIES.length})</h2>
        <Prose>An accepted contribution can improve these deterministic dimensions. We never compute a fabricated quality score — only which dimensions are affected.</Prose>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {IMPACT_CATEGORIES.map((c) => (
            <div key={c} className={card}><span className="font-display text-sm font-semibold text-fg">{IMPACT_CATEGORY_LABELS[c]}</span><p className="mt-1 text-xs text-muted">{IMPACT_CATEGORY_DESCRIPTIONS[c]}</p></div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="font-display text-xl font-bold">Version impact</h2>
        <Prose>Every changeset declares how it would version the graph — never a live write.</Prose>
        <div className="mt-4 space-y-2">
          {(["none", "patch", "minor", "major"] as const).map((v) => (
            <div key={v} className={card}><span className="font-mono text-sm text-fg">{v}</span><span className="ml-3 text-sm text-muted">{VERSION_IMPACT_DESCRIPTIONS[v]}</span></div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* --------------------------------------------------------------- templates */
function Templates() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.04] p-4">
        <p className="text-sm leading-relaxed text-muted"><strong className="text-fg">Copy, don&apos;t submit.</strong> These are static templates to help you structure a proposal. There is no submission form, no backend, and nothing is sent. A future review system will accept structured proposals like these.</p>
      </div>
      {CONTRIBUTE_TEMPLATES.map((t) => (
        <section key={t.id} className={card}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-base font-semibold text-fg">{t.title}</h2>
            <span className="font-mono text-[0.65rem] text-faint">{t.type}</span>
          </div>
          <p className="mt-1 text-sm text-muted">{t.summary}</p>
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words rounded-lg border border-white/10 bg-black/30 p-4 font-mono text-xs leading-relaxed text-faint">{t.body}</pre>
        </section>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- roadmap */
function Roadmap() {
  const now = ["The contribution schema, types, states, roles, and changeset model.", "The pure, deterministic review-workflow engine (engine.contributions).", "Validation that attaches every proposal to real graph objects — no orphans.", "Read-only API endpoints for contribution types, review states, and guidelines.", "This portal, copyable templates, and honest empty-state dashboards."];
  const planned = ["A future write endpoint (POST /api/v1/contributions) behind authentication.", "Real submissions, persistence, reviewer accounts, and notifications.", "Dashboards populated with real (not fabricated) review activity.", "Applying accepted changesets as versioned graph updates."];
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className={card}>
        <h2 className="font-display text-lg font-semibold text-fg">Today — architecture</h2>
        <ul className="mt-3 space-y-2">{now.map((x) => <li key={x} className="flex gap-2 text-sm text-muted"><span aria-hidden className="mt-1 text-emerald-300">✓</span><span>{x}</span></li>)}</ul>
      </div>
      <div className={`${card} border-dashed`}>
        <h2 className="font-display text-lg font-semibold text-fg">Planned</h2>
        <ul className="mt-3 space-y-2">{planned.map((x) => <li key={x} className="flex gap-2 text-sm text-faint"><span aria-hidden className="mt-1">◦</span><span>{x}</span></li>)}</ul>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- dashboards */
function ReviewDashboard() {
  return (
    <div className="space-y-6">
      <Prose>How reviewers will see the workflow at a glance — coverage by track, open proposals, and where work is waiting. It is empty because there are no proposals: nothing here is fabricated.</Prose>
      <div className="grid gap-4 sm:grid-cols-3">
        {["editorial", "scientific", "source"].map((track) => (
          <div key={track} className={card}><p className="text-xs uppercase tracking-wider text-faint">{track} track</p><p className="mt-1 font-display text-2xl font-bold text-fg">0</p><p className="text-xs text-faint">open proposals</p></div>
        ))}
      </div>
      <EmptyState label="Open proposals" note="When submissions open, this dashboard will summarize real review activity by track and state. No metrics are invented." />
    </div>
  );
}
function ReviewQueue() {
  return (
    <div className="space-y-6">
      <Prose>Submitted proposals will wait here for triage and review, ordered and filterable by type, track, and state. There are no tickets — the queue is genuinely empty.</Prose>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead><tr className="text-xs uppercase tracking-wider text-faint"><th className="pb-2 pr-4 font-medium">Proposal</th><th className="pb-2 pr-4 font-medium">Type</th><th className="pb-2 pr-4 font-medium">Track</th><th className="pb-2 font-medium">State</th></tr></thead>
          <tbody><tr><td colSpan={4} className="py-8 text-center text-sm text-faint">No proposals in the queue.</td></tr></tbody>
        </table>
      </div>
      <EmptyState label="Queued proposals" note="Triage validates each proposal, checks for conflicts and duplicates, and routes it to a review track." />
    </div>
  );
}
function ChangeLog() {
  return (
    <div className="space-y-6">
      <Prose>The versioned record of accepted changes will appear here. It is empty: no changes have been accepted, and no approvals are fabricated. Each future entry declares its version impact.</Prose>
      <section>
        <h2 className="font-display text-xl font-bold">Change kinds &amp; version impact</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead><tr className="text-xs uppercase tracking-wider text-faint"><th className="pb-2 pr-4 font-medium">Change kind</th><th className="pb-2 font-medium">Default impact</th></tr></thead>
            <tbody className="divide-y divide-white/5">
              {CHANGE_KINDS.map((k) => (<tr key={k}><td className="py-1.5 pr-4 font-mono text-xs text-fg">{k}</td><td className="py-1.5 font-mono text-xs text-faint">{CHANGE_KIND_IMPACT[k]}</td></tr>))}
            </tbody>
          </table>
        </div>
      </section>
      <EmptyState label="Accepted changes" note="Only an accepted proposal becomes a versioned change here — after review, never automatically." />
    </div>
  );
}
function AuditTrail() {
  return (
    <div className="space-y-6">
      <Prose>Every state change on every proposal will be recorded as an immutable, per-proposal, ordered audit entry. The trail is empty and validated: any impossible or unauthorized transition is rejected, so no history can be faked.</Prose>
      <section>
        <h2 className="font-display text-xl font-bold">Notification events</h2>
        <Prose>The events a future system emits, and which roles receive them. Modelled only — nothing is sent.</Prose>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {NOTIFICATION_EVENTS.map((e) => (<div key={e.type} className={card}><span className="font-mono text-xs text-fg">{e.type}</span><p className="mt-1 text-xs text-faint">→ {e.recipients.join(", ")}</p></div>))}
        </div>
      </section>
      <EmptyState label="Audit entries" note="Each entry links a proposal, an actor role, and a valid from→to state transition, ordered by sequence." />
    </div>
  );
}

/* --------------------------------------------------------------- security */
function securitySection() {
  return (
    <section>
      <h2 className="font-display text-xl font-bold">Security &amp; abuse model</h2>
      <Prose>Controls a future review system applies at each stage. Designed, not implemented — there is no rate limiter or spam filter today.</Prose>
      <div className="mt-4 space-y-4">
        {CONTROL_STAGES.map((stage) => (
          <div key={stage}>
            <p className="text-xs font-semibold uppercase tracking-wider text-faint">{stage}</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {controlsForStage(stage).map((c) => (<div key={c.id} className={card}><span className="font-display text-sm font-semibold text-fg">{c.label}</span><p className="mt-1 text-xs text-muted">{c.description}</p></div>))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const BODIES: Record<string, () => React.ReactElement> = {
  "how-it-works": HowItWorks,
  guidelines: Guidelines,
  sources: () => <TrackPage track="source" blurb="Sources are the backbone of the platform. On the source track you add or strengthen the authoritative sources and citations behind entities and relationships. A Source Reviewer verifies every source is authoritative, licensed, and correctly attributed. Browse the current registry at /registry and /data/licensing." extra={securitySection()} />,
  images: () => <TrackPage track="image" blurb="Image contributions submit verified scientific images or correct image metadata. Provenance is mandatory: every image must carry a license, a credit, and a source. An Image Reviewer verifies provenance before acceptance. See the existing archive at /images." extra={<p className="text-sm text-faint">See real, provenanced imagery at <A href={ROUTES.images}>/images</A>.</p>} />,
  translations: () => <TrackPage track="translation" blurb="Translation contributions suggest localized titles and descriptions so the platform reads accurately in more languages. A Translator reviews each suggestion. Localized text is a proposal like any other — it never overwrites the canonical record until reviewed." />,
  "scientific-review": () => <TrackPage track="scientific" blurb="Sourced factual claims in the science domain must pass scientific review by a domain expert, who verifies accuracy and evidence. Interpretive claims never enter this track. Evidence levels follow the platform's Scientific Authority model." extra={<p className="text-sm text-faint">Evidence levels are defined on <A href="/contribute/standards">Standards</A>.</p>} />,
  "editorial-review": () => <TrackPage track="editorial" blurb="Editorial review checks scope, clarity, and policy, and routes each proposal to the right track. Editors triage submissions, request sources or changes, and record a reason for every decision. Editorial notes never assert science." extra={securitySection()} />,
  standards: Standards,
  templates: Templates,
  roadmap: Roadmap,
  "review-dashboard": ReviewDashboard,
  "review-queue": ReviewQueue,
  "change-log": ChangeLog,
  "audit-trail": AuditTrail,
};

export function ContributeSectionBody({ slug }: { slug: string }) {
  const Body = BODIES[slug];
  return Body ? <Body /> : null;
}
