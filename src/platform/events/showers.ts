import { METEOR_SHOWERS } from "@/platform/live-sky/meteorShowers";
import type { MeteorShower } from "@/platform/live-sky/models";
import { computeMoon } from "@/platform/live-sky/providers/computed-moon";
import type { AstronomicalEvent } from "@/platform/events/model";

/**
 * Meteor showers, dated for a given year.
 *
 * A shower is not an instant. It is Earth crossing a debris stream, and the platform's reference
 * data records what that means in practice: an activity window of weeks and a peak night. Those are
 * the same every year to within about a day, which is why they are written without a year at all.
 *
 * Turning them into calendar entries therefore produces FORECASTS, not computed events, and the
 * distinction is not pedantry. The exact hour of maximum shifts from year to year, and the rate
 * varies by far more than the date does: a shower with a nominal ZHR of 100 has produced 15 and has
 * produced 400. Nothing here computes an hour of maximum, because nothing here has a source for one.
 *
 * A shower whose reference data does not state a peak night — the Taurids, whose maximum is a broad
 * plateau spanning weeks — is deliberately left out of the dated calendar rather than assigned an
 * invented date. It remains on the meteor-shower pages, where a plateau can be described as a
 * plateau.
 */

const MONTHS = new Map<string, number>(
  ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m, i) => [m, i]),
);

/** `night of 12–13 August` — a peak night, stated as two consecutive dates in one month. */
const PEAK_NIGHT_RE = /^night of (\d{1,2})[–-](\d{1,2}) ([A-Z][a-z]+)$/;

interface DatedShowerPeak {
  shower: MeteorShower;
  /** UTC midnight beginning the first date of the peak night. */
  fromMs: number;
  /** The last instant of the second date of the peak night. */
  toMs: number;
}

/**
 * The peak night of a shower in a given calendar year, or null when its reference data does not
 * state one. Never guesses: a shower with no stated peak night has no dated entry.
 */
function datePeak(shower: MeteorShower, year: number): DatedShowerPeak | null {
  const m = PEAK_NIGHT_RE.exec(shower.peakLabel);
  if (!m) return null;
  const month = MONTHS.get(m[3]);
  if (month === undefined) return null;
  const first = Number(m[1]);
  const second = Number(m[2]);
  // A peak night that straddles a month boundary would need the following month, which no shower in
  // the reference data does; if one ever did, it is refused rather than dated to the wrong day.
  if (second !== first + 1) return null;
  const fromMs = Date.UTC(year, month, first);
  return { shower, fromMs, toMs: Date.UTC(year, month, second, 23, 59, 59) };
}

/** Showers whose reference data states a peak night, so they can appear in a dated calendar. */
export const DATEABLE_SHOWERS = METEOR_SHOWERS.filter((s) => PEAK_NIGHT_RE.test(s.peakLabel));

/** Showers deliberately absent from the dated calendar, with the reason. */
export const UNDATEABLE_SHOWERS = METEOR_SHOWERS.filter((s) => !PEAK_NIGHT_RE.test(s.peakLabel));

function moonNote(atMs: number): string {
  const moon = computeMoon(new Date(atMs));
  const percent = Math.round(moon.illuminationFraction * 100);
  if (percent <= 15) return `The Moon is ${percent}% lit on the peak night, so moonlight is not a problem.`;
  if (percent <= 55) return `The Moon is ${percent}% lit on the peak night and will brighten part of the sky.`;
  return `The Moon is ${percent}% lit on the peak night, which will wash out all but the brightest meteors.`;
}

export function meteorShowerEvents(fromMs: number, toMs: number): AstronomicalEvent[] {
  const events: AstronomicalEvent[] = [];
  const firstYear = new Date(fromMs).getUTCFullYear();
  const lastYear = new Date(toMs).getUTCFullYear();

  for (let year = firstYear; year <= lastYear; year++) {
    for (const shower of DATEABLE_SHOWERS) {
      const dated = datePeak(shower, year);
      if (!dated || dated.toMs < fromMs || dated.fromMs > toMs) continue;
      // The Moon is evaluated at midnight UTC between the two dates — the middle of the peak night
      // for a European observer, and up to a few per cent of illumination away for one on the far
      // side of the world. The card says "lit", not "lit where you are".
      const midnight = dated.fromMs + 86_400_000;
      events.push({
        eventId: `shower-${shower.slug}-${year}`,
        title: `${shower.name} peak`,
        summary: `${shower.description} ${moonNote(midnight)}`,
        category: "meteor-shower",
        eventType: "meteor-shower-peak",
        basis: "forecast",
        start: new Date(dated.fromMs).toISOString().replace(".000", ""),
        end: new Date(dated.toMs).toISOString().replace(".000", ""),
        precision: "night",
        applicability: {
          scope: shower.bestHemisphere === "Both" ? "global" : "hemisphere",
          detail:
            shower.bestHemisphere === "Both"
              ? "Seen from both hemispheres, though the radiant's altitude — and so the rate — still depends on your latitude."
              : `Best from the ${shower.bestHemisphere.toLowerCase()} hemisphere, where the radiant climbs highest. The shower is not absent elsewhere, only poorer.`,
        },
        source: {
          providerKey: "imo",
          label: "IMO Meteor Shower Calendar working list",
          url: "https://www.imo.net/resources/calendar/",
          sources: ["imo"],
        },
        uncertainty:
          "The peak night recurs annually and is reliable to about a day. The hour of maximum and the rate are not: observed rates routinely land at a fraction or a multiple of the nominal figure.",
        entityIds: shower.graphEntityId ? [shower.graphEntityId] : undefined,
        confirmed: false,
        facts: [
          { label: "Activity window", value: shower.activeWindow },
          {
            label: "Nominal ZHR",
            value: `${shower.zhr} — the standardised rate for a radiant overhead in a perfectly dark sky, which no real site achieves. Expect fewer.`,
          },
          { label: "Entry speed", value: `${shower.velocityKmS} km/s` },
          ...(shower.parentBodyName ? [{ label: "Parent body", value: shower.parentBodyName }] : []),
          { label: "Moon on the peak night", value: `${Math.round(computeMoon(new Date(midnight)).illuminationFraction * 100)}% lit (computed)` },
        ],
      });
    }
  }
  return events;
}
