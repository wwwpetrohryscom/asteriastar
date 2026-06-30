import {
  DATASETS,
  getDataset,
  getDatasetEntities,
  datasetRows,
  datasetToCsv,
  type Dataset,
} from "@/lib/datasets";
import type { GraphEntity } from "@/knowledge-graph";

/**
 * Dataset Engine — generate dataset views and exports from the graph. Delegates
 * to the dataset registry; exports are real serializations (JSON/CSV) with
 * version metadata, never fabricated.
 */
export const datasetEngine = {
  all: (): Dataset[] => DATASETS,
  get: (slug: string): Dataset | undefined => getDataset(slug),
  entities: (d: Dataset): GraphEntity[] => getDatasetEntities(d),
  rows: (d: Dataset) => datasetRows(d),
  toCsv: (d: Dataset): string => datasetToCsv(d),
  toJson: (d: Dataset) => ({
    dataset: {
      slug: d.slug,
      title: d.title,
      version: d.version,
      lastGenerated: d.lastGenerated,
      license: d.license,
      entityCount: d.entityCount,
      sources: d.sources,
      checksum: d.checksum,
    },
    entities: datasetRows(d),
  }),
};
