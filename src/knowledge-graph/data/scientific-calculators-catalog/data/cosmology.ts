import type { CalculatorRecord } from "@/knowledge-graph/data/scientific-calculators-catalog/types";
import { C } from "@/lib/calculators/constants";

/** Cosmology calculators. Reuses the redshift concept and the Hubble constant. The Hubble constant is
 *  an INPUT (default 70 km/s/Mpc), not asserted — its value is genuinely uncertain (the Hubble
 *  tension). The redshift–velocity relation is flagged as a low-redshift approximation. */
const calc = (r: Omit<CalculatorRecord, "id" | "sources" | "category"> & { slug: string; sources?: CalculatorRecord["sources"] }): CalculatorRecord => ({ sources: ["nasa"], ...r, category: "cosmology", id: `scientific_calculator:${r.slug}` });

export const cosmology: CalculatorRecord[] = [
  calc({ slug: "redshift-velocity", name: "Redshift Recession Velocity", formula: "v ≈ c z (low z)", resultUnit: "km/s", resultLabel: "Recession velocity", variables: [{ symbol: "z", label: "Redshift", unit: "", default: 0.01 }], compute: (v) => (C * v.z) / 1000, example: { expected: 2997.9, tol: 1, note: "z = 0.01 → ~2998 km/s" }, relatedKeys: ["cosmology_concept:redshift"], description: "The recession velocity implied by a small cosmological redshift, v ≈ cz. This linear form holds only for low redshift; at large z the full relativistic and cosmological treatment is required and this approximation overstates the speed.", highlights: ["Valid only at low redshift"] }),
  calc({ slug: "hubble-distance", name: "Hubble Distance", formula: "d = v / H₀", resultUnit: "Mpc", resultLabel: "Distance", variables: [{ symbol: "v", label: "Recession velocity", unit: "km/s", default: 7000 }, { symbol: "H0", label: "Hubble constant", unit: "km/s/Mpc", default: 70 }], compute: (v) => v.v / v.H0, example: { expected: 100, tol: 0.5, note: "7000 km/s at H₀ = 70 → 100 Mpc" }, relatedKeys: ["cosmology_concept:hubble-constant"], description: "The distance to a galaxy from its recession velocity and the Hubble constant, by Hubble's law. Because the measured value of H₀ is itself contested — the Hubble tension — it is left as an input rather than fixed.", highlights: ["H₀ is an input, not asserted"] }),
];
