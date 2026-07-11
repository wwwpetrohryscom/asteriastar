/**
 * Raw snapshot row types for the deep-sky precision overlay. Each row is transcribed
 * verbatim from an authoritative query and committed as a snapshot; `null` means the
 * source had no value.
 */

/** SIMBAD `basic` + best `mesDistance` row, matched by the object's catalogue id. */
export interface SimbadDeepSkyRow {
  queryId: string; // the identifier queried, e.g. "M 31", "NGC 224"
  dsId: string; // our deep-sky entity id
  main_id: string;
  otype_txt: string | null;
  ra: number | null; // deg, ICRS
  dec: number | null;
  coo_bibcode: string | null;
  rvz_redshift: number | null;
  rvz_radvel: number | null; // km/s
  rvz_err: number | null;
  rvz_type: string | null; // 'z' = a redshift measurement, 'v' = a velocity measurement
  rvz_bibcode: string | null;
  dist: number | null; // best mesDistance value
  dist_unit: string | null; // "pc" | "kpc" | "Mpc" | ...
  dist_method: string | null;
  dist_qual: string | null;
  dist_bibcode: string | null;
}

/** NED ObjectLookup row for an extragalactic object. */
export interface NedDeepSkyRow {
  queryId: string;
  dsId: string;
  ned_name: string | null;
  objtype: string | null;
  ra: number | null;
  dec: number | null;
  pos_bibcode: string | null;
  redshift: number | null;
  redshift_unc: number | null;
  redshift_bibcode: string | null;
  redshift_qual: string | null;
}
