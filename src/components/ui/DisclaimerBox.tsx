import { ASTROLOGY_DISCLAIMER } from "@/lib/site";

/**
 * The standard interpretive-content disclaimer. Shown on every astrology page
 * and on interpretive tools elsewhere. Defaults to the astrology wording; a
 * different `message` can be passed for other traditions (e.g. numerology).
 */
export function DisclaimerBox({
  message = ASTROLOGY_DISCLAIMER,
  title = "A note on interpretation",
}: {
  message?: string;
  title?: string;
}) {
  return (
    <aside
      role="note"
      className="flex gap-3 rounded-xl border border-nasa/25 bg-nasa/[0.06] p-4"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        className="mt-0.5 shrink-0 text-nasa"
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 8h.01M11 11h1v5h1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div>
        <p className="text-sm font-semibold text-nasa">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">{message}</p>
      </div>
    </aside>
  );
}
