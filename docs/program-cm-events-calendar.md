# Program CM — Astronomical Events & Observing Calendar

A dated calendar for the platform, and the first surface that has to keep four completely different
kinds of claim from being mistaken for one another.

## What was built

Ten pages under `/events`, three JSON endpoints, and a subscribable iCalendar file:

| Route | What it is |
| --- | --- |
| `/events` | The hub: the soonest event of each kind, and what the calendar deliberately does not do |
| `/events/today`, `/events/this-week`, `/events/this-month` | Windows |
| `/events/moon` | Phases and apsides for the year ahead |
| `/events/eclipses` | Solar and lunar, from NASA's catalogue |
| `/events/meteor-showers` | Peak nights, with the Moon's interference computed |
| `/events/conjunctions` | Planet pairs, and the dates a planet vanishes into the Sun |
| `/events/oppositions` | The one date per apparition worth planning around |
| `/events/launches` | Planned launches, shown as plans |
| `/events/calendar.ics` | RFC 5545 export, subscribable, stable UIDs |
| `/api/v0/live/events` | The year ahead as JSON, basis and uncertainty on every entry |
| `/api/v0/live/events/eclipses` | The century catalogue, with both TD and UTC |
| `/api/v0/live/events/launches` | The launch feed, precision and confirmation time intact |

The pages also print: a scoped `@media print` block inverts them to black on white, drops the
navigation, and stops an event splitting across a page break. It deliberately does not try to force
open the `<details>` panels — there is no reliable cross-browser CSS way to do that, and a rule that
worked in one engine and failed silently in another would produce printouts missing their
provenance. The markup carries the weight instead: an event's basis, date and **uncertainty** are
always visible, so they are on the paper regardless.

## The four bases

Every event carries one, and it decides what language the page is allowed to use.

- **computed** — derived here from the platform's position series. Records `method.algorithm` and
  `method.version`. Never without both.
- **source-backed** — reproduced from an authority's own publication, with the document linked.
- **forecast** — recurs annually; the date is approximate and says so.
- **planned** — somebody's intention. `confirmed` is always false, and the time the source last
  confirmed it is always shown.

## Two providers connected

**NASA/GSFC Eclipse Web Site** — the Five Millennium Catalog of Solar and Lunar Eclipses by Espenak
and Meeus. The century tables are fetched and every eclipse of 2001–2100 is served: 224 solar, 228
lunar, matching the published totals exactly. It is a canon computed once in 2007, so nothing about
it is ever called live; it is cached for a week because there is no freshness to trade.

**Launch Library 2 (The Space Devs)** — the only provider on this platform that is not an
institution, and it is labelled that way everywhere. It carries the two fields that make an honest
launch calendar possible: `net_precision` (how precisely the date is known, from the second down to
the year) and `last_updated` (when a human last confirmed it). Both are passed through unchanged.
The provider allows fifteen requests an hour; the feed is cached for thirty minutes, which is two.

**IAU Meteor Data Center — evaluated, not connected.** Its established-shower list is fetchable and
carries λ☉ of maximum, which would date every shower peak to the hour. It also carries several
competing solutions per shower from different studies — the Perseids appear at 139.70°, 139.4° and
139.5° — and choosing between them is a research judgement this platform is not entitled to make.
The showers stay as annual forecasts from the IMO working list, approximate to about a day, which is
the honest resolution.

## Accuracy is measured, not asserted

Every computed event states an uncertainty. `npm run events:validate` runs on every build and checks
those statements against three independent authorities — 149 lunar phases from NASA/GSFC, 18 season
instants from the US Naval Observatory, and 32 geometric positions from JPL Horizons — all pinned in
`scripts/events/reference/almanac-reference.json` so the gate stays offline and deterministic.

| What is measured | Worst error, 2026–2028 | Stated on the page |
| --- | --- | --- |
| Lunar phases | 38 minutes | "about forty minutes" |
| Equinoxes and solstices | 12 minutes | "about fifteen minutes" |
| Earth perihelion/aphelion | 5.2 hours | "about six hours" |
| Planetary positions vs Horizons | 4.88 arcminutes (Saturn) | the basis for "a few hours" on the planetary events |

The planetary events — oppositions, conjunctions, elongations, planet pairs — have no published table
of instants to check against. What they have is a position series, and that can be checked: bounding
its error bounds the event times derived from it, so the hours quoted follow from a measurement
rather than from confidence.

Raising a tolerance to make a failing build pass is a change to a published claim, and the gate says
so in a comment.

## Two corrections the measurement forced

**Precession.** The platform's planetary series is referred to the mean equinox of J2000; its lunar
series is referred to the equinox of date. Every event here is an angle between two bodies or
between a body and the equinox, so mixing the frames injects the accumulated precession — 0.363° in
2026 — as a silent systematic error. It does not look like an error. It looks like an equinox nine
hours late and a full Moon three quarters of an hour early, which is exactly what the first version
produced when it was checked against NASA's table. `src/platform/events/frames.ts` brings everything
to the equinox of date in one place.

**The Earth–Moon barycentre.** The JPL approximate elements describe the barycentre, not Earth.
Earth swings about that point by about 4,670 km every month. On the sky that is six arcseconds. For
the date of perihelion, where the Sun–Earth distance is almost stationary, it is decisive: taking the
barycentre for Earth put aphelion 2026 a day and a third early against the USNO's published value.
Adding the offset back brings the six apsides of 2026–2028 to within five and a half hours, and
usually within one.

Both were found by measurement. Neither was visible by reading the code.

## Failure behaviour

Computed events and shower peaks need no network. A provider outage removes only what that provider
carried, and the missing categories are **reported** as gaps with the provider's own reason rather
than left as an empty list a reader would read as "there are none". `npm run live:test` includes a
total-outage case: every provider refused at the transport layer, the calendar still returns its
computed half, reports both gaps, and exports a well-formed — smaller — iCalendar file.

## Parser strictness

The eclipse parser refuses a response in which any row that *looks* like a catalogue entry failed to
parse. That rule exists because the first version required whitespace after the eclipse-type letter,
and the type field is one or two characters with no space — `An`, `Pb`, `H3`, `T+`. Thirteen solar
and thirty-three lunar eclipses vanished from the century, including the total lunar eclipses of 2007
and 2011, and the catalogue looked entirely healthy. A canon has a known total; a skipped row is a
missing eclipse nothing else would reveal.

The launch feed is treated the opposite way and the comment says why: it is open-ended and has no
total to check against, so one malformed record is dropped rather than discarding thirty-nine good
launches. A launch whose identifier had to be truncated is dropped outright — a truncated identifier
is not an identifier, and two of them could collide in a reader's subscribed calendar.

## Structured data

`Event` nodes are emitted only for events whose date is settled and known to at least the hour: a
computed instant or a published prediction. Planned launches and annual forecasts appear on the page
and deliberately not in the markup, because `Event.startDate` has no way to say "the provider thinks
the second quarter" and a consumer reading a fixed timestamp would be entitled to treat an intention
as an appointment. There is no `location`: an eclipse has a path and a full Moon happens to the
whole planet at once, and inventing a place to satisfy a rich-result requirement would be a
fabricated fact in machine-readable form.

## Privacy

Nothing here asks for, infers, stores or transmits a location. Every time is UTC. No coordinate,
date or filter ever enters a URL — the ten routes name windows rather than carrying them — so there
is no parameter space to crawl and nothing in the sitemap but evergreen hubs. The iCalendar export
is not in the sitemap either: it is a file for calendar software, not a page.

## Stale claims reconciled

Programs CJ, CK and CL connected providers that several older surfaces still described as
unavailable. This program's own additions made two more provenance strings false. All were corrected
rather than left to age:

- `live-sky/eclipses.ts` said eclipse dates "will be drawn from published NASA eclipse predictions
  when the eclipse module is connected". They now are.
- `live-sky/observingCalendar.ts` said exact dates "require a connected almanac provider and are not
  shown here".
- `/sky` described the ISS, aurora, space weather and close approaches as "prepared for integration";
  all four have been connected since CJ, CK and CL.
- The Live Scientific Data Platform description in the navigation, the open-data catalogue and
  `llms.txt` still said two providers were connected and the rest were architecture-ready. Seven are
  connected; the two that are not now record why.
- `PreparedForIntegration` hard-coded a pointer to the space-weather section. It now takes the
  destination, because not every connected counterpart is space weather.

## Adversarial review (independently verified, fixed before merge)

Four independent reviews ran against the finished branch — science and calculation, honesty and
provenance, security and failure behaviour, and accessibility/SEO/duplication. Every finding below
was reproduced before it was fixed, and several were reproduced *against external authorities*
rather than against my own reading of the code. Nothing was fixed on assertion.

**Two defects were serious enough to have shipped a wrong number.**

*Greatest elongation maximised the wrong angle.* The finder maximised the difference in ecliptic
longitude and the page published the result as the elongation. Those are different angles whenever
the planet has ecliptic latitude — and Mercury and Venus always do at greatest elongation, by several
degrees. Mercury's western elongation of June 2028 was published as 22.0° at 03:27; JPL Horizons and
Espenak's tables both put the maximum at 22.23°, eight hours earlier. The true Sun–Earth–planet angle
was already computed by the position series; it simply was not the one being maximised. The signed
longitude difference still decides east from west, which is the one thing it is right for.

*Events near New Year did not exist.* The extremum finder refuses a turning point at the very edge of
its window — correct, because with samples on one side only there is no way to tell one from the scan
running out. But the calendar scanned each year on exactly abutting windows, so the refused band at
the end of one year and the start of the next was covered by neither. The Moon's apogee of 1 January
2028 was absent from the site, leaving a twenty-eight-day gap between two consecutive perigees. Years
are now scanned with three days of overlap and filtered back.

The second one is the more instructive, because nothing would have caught it: the count check exists
only for lunar phases, which are the one family with a published table to count against. So a
structural gate was added — apsides alternate and are a fortnight apart, and Earth's are half a year
apart — and it was **verified by reintroducing the defect**, which it catches.

**Two more would have misled a reader about what a date means.**

The Launch Library API does not emit the word `Quarter`. It emits `Quarter 3` and `Quarter 4`, so a
lookup table keyed on `Quarter` missed every quarter-scheduled launch and fell through to "day" —
eight of the forty in the feed, each rendering as a definite calendar date for an entry the provider
itself marks *To Be Determined*, and each exporting to a subscriber's calendar as an all-day
appointment. That is precisely the failure this module exists to prevent, and it survived because the
fixtures used a word the API never sends. Both gates now use the provider's real vocabulary.

And a **partial** NASA outage reported no gap at all: solar and lunar eclipses are two products with
separate health records, and the gap was reported only when both failed. A lunar outage therefore
deleted every lunar eclipse from the page, the export and the API while the heading counted the solar
ones — the exact failure four separate comments in this program promise cannot happen. Each product
is now accounted for on its own, and `EnvelopeDetails` renders the provider's reported reason, which
it never had: an outage used to show a status of "Unavailable" and nothing about why.

**Claims that outran what the code did.** "Checked on every build against NASA and USNO" appeared on
every calendar page, but only three families were checked, and the Moon page said "every phase and
every apsis … checked" while its own apsis cards said the opposite. The fix went both ways: the
wording is now precise about which families are measured and which are not, and — because the gate
runs in under half a second — it was added to `prebuild`, so "on every build" became literally true
rather than being softened. A JPL Horizons comparison was also added, bounding the planetary
positions the remaining events are derived from, which turns "a few hours" on an opposition from a
statement of confidence into a consequence of a measurement.

Several smaller overstatements were corrected against measurement rather than argued down: a header
claiming lunar phases good to a quarter of an hour when the gate prints thirty-eight minutes; a
precession approximation described as "well under an arcsecond" when it reaches four at the latitudes
it is applied to; a frame-mixing error stated as two parts in a billion when it is two parts in ten
million; Earth's perihelion distance printed to the last kilometre on a value good to a few thousand.

**The knowledge graph asserted that Launch Library 2 is associated with NASA**, at confidence
`confirmed`, because `relatedKeys` becomes an `associated_with` edge. That is the agency/community
conflation the rest of the program spends paragraphs denying. It is now related to the launch sites
it reports from.

**Security and failure behaviour came back clean where it counts** — no SSRF, no HTML or iCalendar
injection, no ReDoS (worst case 52 ms on 2.1 MB), no location handling of any kind, and all four
routes returning 200 with an honest gap under five different provider failure modes. Four hardening
fixes were still made: the launch feed had no row cap, so a provider changing its page size could
have produced ten megabytes of HTML; a failed eclipse fetch was cached publicly for a *week*, turning
a momentary NASA outage into a seven-day one; one malformed ΔT cell could delete the whole catalogue
via a `RangeError`, and an merely absurd one silently dated a 2026 eclipse to 1994; and the iCalendar
`UID` was the one property not escaped. The JSON-LD serialiser was also fixed to escape `<`, which
was a genuine breakout waiting for the first provider-derived string to reach it — this program's
markup is the first that could have.

**Structured data was rebuilt around what can be filled honestly.** `Event` nodes were being emitted
for every confirmed event with no `location`, which consumers treat as required: markup guaranteed to
fail validation while producing nothing. Inventing a place was not available. So the nodes are now
emitted only where an authority publishes a point on Earth — NASA's eclipse catalogue, for every
eclipse — with the real coordinates. A full Moon happens to the whole planet at once and has no such
point, so it gets no node. Past events are excluded too: a past eclipse marked `EventScheduled` is a
claim about the future that has already been falsified.

**Accessibility and SEO.** Five cards on one page linked to two different catalogues under the
identical text "the published record"; the link now names the document. The hub was the only tab that
did not mark itself with `aria-current`. `<time datetime>` asserted a midnight instant for an event
whose text says "night of 21–22 October", and a month for one whose text says "the second quarter" —
the attribute is now held to the same precision rule as the words beside it. `/events` and
`/sky/observing-calendar` shipped the identical `<title>`; the perennial guide is now "The Observing
Year". Four `/sky` pages still advertised in their meta descriptions — the text that appears in search
results — that dates were "prepared for" a provider that is now connected. And the pointer from a
reference page to its working counterpart was conditional on that page's own provider being
connected, so `/sky/this-month` told readers nothing was available while `/events/this-month` served
fifteen dated events one click away.

**Verified clean, and worth recording as such:** the eclipse parser against the live catalogues (224
solar and 228 lunar, matching NASA's published totals, with TD→UTC verified against a known eclipse to
the second); every root-finder residual across 2020–2060 (worst 0.005°, entirely the minute-rounding);
opposition, conjunction and elongation definitions against Horizons; the barycentre correction, which
collapses the residual against 63 daily Horizons vectors from 9,716 km to 655 km; all 164 internal
links; and the iCalendar file — 164 events, unique stable UIDs, zero lines over 75 octets with
UTF-8-safe folding, and no unconfirmed event marked `CONFIRMED`.
