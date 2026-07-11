/**
 * Raw snapshot row types for the star-precision overlay. Each row is transcribed
 * verbatim from an authoritative TAP query and committed to the repo as a snapshot
 * (no runtime dependence on the live service). `null` means the source had no value.
 */

/** One SIMBAD `basic`-table row, matched to a star by its HIP identifier. */
export interface SimbadStarRow {
  hip: number;
  starId: string;
  main_id: string;
  ra: number | null;
  dec: number | null;
  coo_bibcode: string | null;
  plx_value: number | null;
  plx_err: number | null;
  plx_bibcode: string | null;
  pmra: number | null;
  pmdec: number | null;
  pm_bibcode: string | null;
  rvz_radvel: number | null;
  rvz_err: number | null;
  rvz_bibcode: string | null;
  sp_type: string | null;
  sp_bibcode: string | null;
  otype_txt: string | null;
}

/** One Gaia DR3 row (gaia_source ⨝ astrophysical_parameters ⨝ Bailer-Jones distance). */
export interface GaiaStarRow {
  hip: number;
  starId: string;
  source_id: string; // 64-bit id; CAST to VARCHAR in the ADQL so JSON.parse never rounds it as a float64
  ra: number | null;
  dec: number | null;
  parallax: number | null;
  parallax_error: number | null;
  pmra: number | null;
  pmdec: number | null;
  phot_g_mean_mag: number | null;
  bp_rp: number | null;
  ruwe: number | null;
  teff_gspphot: number | null;
  logg_gspphot: number | null;
  mh_gspphot: number | null;
  radius_gspphot: number | null;
  r_med_geo: number | null; // Bailer-Jones (2021) geometric distance, pc
  r_med_photogeo: number | null; // Bailer-Jones (2021) photogeometric distance, pc
}
