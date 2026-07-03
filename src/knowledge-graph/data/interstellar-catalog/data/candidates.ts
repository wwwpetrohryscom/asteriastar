import type { InterstellarRecord } from "@/knowledge-graph/data/interstellar-catalog/types";

/**
 * CANDIDATE / DEBATED interstellar claims — objects proposed to be interstellar but NOT
 * confirmed. These are typed and labelled separately from the confirmed objects and are
 * NEVER presented as catalogued interstellar objects. Every record carries an explicit
 * uncertainty note; no eccentricity or trajectory class is asserted where the underlying
 * data are disputed, so the graph never claims an interstellar origin the sources do not
 * support.
 */

const mk = (r: Omit<InterstellarRecord, "kind" | "id"> & { slug: string }): InterstellarRecord => ({
  ...r,
  kind: "candidate",
  id: `interstellar_candidate:${r.slug}`,
  status: r.status ?? "debated_origin",
  category: r.category ?? "candidate",
});

export const candidates: InterstellarRecord[] = [
  mk({
    slug: "cneos-2014-01-08",
    name: "CNEOS 2014-01-08",
    altNames: ["2014-01-08 bolide", "IM1 (proposed name)"],
    description:
      "A bright meteor (bolide) that entered Earth's atmosphere near Papua New Guinea on 8 January 2014, recorded in NASA CNEOS's fireball database. From the reported high velocity it was proposed in 2019 to have originated outside the Solar System, which would make it a candidate interstellar meteor. The claim is disputed: the underlying velocity data come from US Government sensors whose uncertainties are not public, and the interstellar interpretation is not accepted by the wider community. It is not a confirmed interstellar object.",
    status: "debated_origin",
    discoveryDate: "2014-01-08",
    discoverySurveyLabel: "US Government sensors; NASA CNEOS fireball database",
    velocityLabel: "A high atmospheric-entry speed was reported, but with disputed uncertainties",
    activityLabel: "A bolide (bright fireball) — no object was recovered with certainty",
    originLabel: "Interstellar origin proposed from the reported velocity, but disputed",
    detectionMethodSlugs: ["excess-hyperbolic-velocity"],
    relatedKeys: ["organization:cneos", "planet:earth"],
    uncertaintyNote:
      "DEBATED. The proposed interstellar origin rests on a velocity derived from US Government sensors whose error bars are not published; independent researchers have questioned whether the data support a hyperbolic, interstellar trajectory at all. A 2023 sea-floor expedition recovered spherules claimed to be from the object, but that identification is also contested. This record is a candidate/debated claim, not a confirmed interstellar object.",
    sources: ["nasa", "jpl", "ads"],
    highlights: [
      "A 2014 bolide proposed — but not confirmed — to be interstellar",
      "Based on a disputed CNEOS velocity with non-public uncertainties",
      "Kept clearly separate from the confirmed interstellar objects",
    ],
  }),
];
