import type { EnvRecord } from "@/knowledge-graph/data/space-environment-catalog/types";

/**
 * Monitoring assets — the spacecraft and organization that observe the space environment.
 * SOHO, SDO, ACE, and DSCOVR are created as `space_mission` entities (the type is reused;
 * they did not yet exist and land on the standalone graph pages); NOAA's Space Weather
 * Prediction Center is created as an `organization`. Parker Solar Probe, Solar Orbiter, and
 * NOAA already exist and are referenced by the phenomena above, never duplicated.
 */

const mission = (r: Omit<EnvRecord, "kind" | "id"> & { slug: string }): EnvRecord => ({ ...r, kind: "monitor-mission", id: `space_mission:${r.slug}`, category: r.category ?? "monitoring" });
const org = (r: Omit<EnvRecord, "kind" | "id"> & { slug: string }): EnvRecord => ({ ...r, kind: "monitor-org", id: `organization:${r.slug}`, category: r.category ?? "monitoring" });

export const monitors: EnvRecord[] = [
  mission({ slug: "soho", name: "SOHO (Solar and Heliospheric Observatory)", altNames: ["Solar and Heliospheric Observatory"], description: "A joint ESA/NASA solar observatory at the Sun–Earth L1 point, operating since 1995. Its coronagraphs image coronal mass ejections and it is a workhorse of space-weather monitoring (and a prolific comet discoverer).", sources: ["esa", "nasa"] }),
  mission({ slug: "sdo", name: "SDO (Solar Dynamics Observatory)", altNames: ["Solar Dynamics Observatory"], description: "A NASA mission that images the Sun in many ultraviolet wavelengths at high cadence, studying solar activity, flares, and the magnetic field that drives space weather.", sources: ["nasa"] }),
  mission({ slug: "ace", name: "ACE (Advanced Composition Explorer)", altNames: ["Advanced Composition Explorer"], description: "A NASA mission at the Sun–Earth L1 point that measures the solar wind and energetic particles upstream of Earth, giving roughly an hour of warning before disturbances reach the planet.", sources: ["nasa"] }),
  mission({ slug: "dscovr", name: "DSCOVR (Deep Space Climate Observatory)", altNames: ["Deep Space Climate Observatory"], description: "A NOAA/NASA mission at the Sun–Earth L1 point that provides real-time solar-wind measurements for operational space-weather forecasting, along with full-disc images of Earth.", sources: ["noaa", "nasa"] }),
  org({ slug: "swpc", name: "Space Weather Prediction Center (SWPC)", altNames: ["NOAA SWPC"], description: "NOAA's official source of space-weather forecasts, watches, and warnings — the operational centre that issues the Kp, G-, S-, and R-scale alerts used to protect power grids, satellites, and aviation.", sources: ["noaa"] }),
];
