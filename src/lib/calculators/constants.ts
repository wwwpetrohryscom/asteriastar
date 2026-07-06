/**
 * Physical and astronomical constants for the Scientific Calculators (Program BP). Values are the
 * standard CODATA 2018 fundamental constants and IAU 2015 nominal solar/planetary values, in SI
 * units. These are measured/defined constants, cited — not fabricated. Calculators derive results
 * from these and the user's inputs; nothing is invented.
 *
 * Sources: CODATA 2018 (physics.nist.gov); IAU 2015 Resolution B3 nominal values; NASA planetary
 * fact sheets.
 */

// Fundamental constants (CODATA 2018, SI)
export const G = 6.6743e-11; // gravitational constant, m^3 kg^-1 s^-2
export const C = 2.99792458e8; // speed of light in vacuum, m/s (exact)
export const SIGMA_SB = 5.670374419e-8; // Stefan–Boltzmann constant, W m^-2 K^-4
export const WIEN_B = 2.897771955e-3; // Wien displacement-law constant, m K
export const H_PLANCK = 6.62607015e-34; // Planck constant, J s (exact)
export const K_B = 1.380649e-23; // Boltzmann constant, J/K (exact)

// Distances / time
export const AU = 1.495978707e11; // astronomical unit, m (exact, IAU 2012)
export const PARSEC = 3.0856775814913673e16; // parsec, m
export const LIGHT_YEAR = 9.4607304725808e15; // Julian light-year, m
export const YEAR = 3.15576e7; // Julian year, s
export const DAY = 86400; // day, s

// Sun (IAU 2015 nominal)
export const M_SUN = 1.98892e30; // solar mass, kg (from nominal GM_sun / G)
export const R_SUN = 6.957e8; // nominal solar radius, m
export const L_SUN = 3.828e26; // nominal solar luminosity, W
export const T_SUN = 5772; // nominal solar effective temperature, K

// Earth / Jupiter (IAU 2015 nominal + NASA fact sheets)
export const M_EARTH = 5.9722e24; // Earth mass, kg
export const R_EARTH = 6.371e6; // Earth volumetric mean radius, m
export const M_JUPITER = 1.89813e27; // Jupiter mass, kg
export const R_JUPITER = 6.9911e7; // Jupiter volumetric mean radius, m

/** Radians in one arcsecond → the small-angle constant 206264.806... arcsec per radian. */
export const ARCSEC_PER_RAD = 180 * 3600 / Math.PI; // ≈ 206264.806
