import { orbital } from "@/knowledge-graph/data/scientific-calculators-catalog/data/orbital";
import { stellar } from "@/knowledge-graph/data/scientific-calculators-catalog/data/stellar";
import { observational } from "@/knowledge-graph/data/scientific-calculators-catalog/data/observational";
import { exoplanet } from "@/knowledge-graph/data/scientific-calculators-catalog/data/exoplanet";
import { cosmology } from "@/knowledge-graph/data/scientific-calculators-catalog/data/cosmology";
import { instrument } from "@/knowledge-graph/data/scientific-calculators-catalog/data/instrument";
import type { CalculatorRecord } from "@/knowledge-graph/data/scientific-calculators-catalog/types";

/**
 * Client-safe calculator registry. It imports only the pure calculator data (which in turn imports
 * only the physical constants), NOT the knowledge-graph index — so the interactive widget can
 * evaluate a calculator's formula on the client without pulling the whole graph into the bundle.
 */
export const ALL_CALCULATORS: CalculatorRecord[] = [...orbital, ...stellar, ...observational, ...exoplanet, ...cosmology, ...instrument];
export const CALC_BY_SLUG = new Map(ALL_CALCULATORS.map((r) => [r.slug, r]));
