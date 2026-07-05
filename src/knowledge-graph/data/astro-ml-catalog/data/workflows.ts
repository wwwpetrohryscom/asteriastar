import type { MlRecord } from "@/knowledge-graph/data/astro-ml-catalog/types";

/** Data-engineering workflows — the steps that make machine learning in astronomy work and stay
 *  trustworthy. Each links to the REUSED reproducibility and data-pipeline practices and the ML
 *  methods and workflows it depends on. */
const wfl = (r: Omit<MlRecord, "kind" | "id" | "sources"> & { slug: string; sources?: MlRecord["sources"] }): MlRecord => ({ sources: ["nasa"], ...r, kind: "workflow", id: `ml_workflow:${r.slug}` });

export const workflows: MlRecord[] = [
  wfl({ slug: "training-datasets", name: "Training Datasets", relatedKeys: ["ml_method:classification", "ml_workflow:benchmark-datasets"], description: "The labelled examples a model learns from. Their size, coverage, and biases largely determine how well a model works and where it fails — a classifier only knows the kinds of object it was shown, and inherits any selection effects in how those examples were gathered.", sources: ["nasa"] }),
  wfl({ slug: "benchmark-datasets", name: "Benchmark Datasets", relatedKeys: ["ml_workflow:model-evaluation", "open_science_practice:reproducibility-and-fair"], description: "Standard, shared datasets on which different methods are compared on equal footing — like the Galaxy Zoo morphology labels or the PLAsTiCC transient-classification challenge. They let the field measure real progress rather than incomparable claims.", sources: ["nasa"], highlights: ["Comparing methods on equal footing"] }),
  wfl({ slug: "feature-extraction", name: "Feature Extraction", relatedKeys: ["ml_method:representation-learning", "open_science_practice:data-pipelines-and-calibration"], description: "Turning raw data into the informative quantities a model uses — statistics of a light curve, cut-outs around a source, colours from photometry. Well-chosen features can make a simple model succeed; increasingly, representation learning discovers them automatically.", sources: ["nasa"] }),
  wfl({ slug: "model-evaluation", name: "Model Evaluation", relatedKeys: ["ml_workflow:benchmark-datasets", "ml_workflow:training-datasets"], description: "Measuring honestly how well a model performs — its accuracy, completeness, and purity, whether its confidences are calibrated, and how it behaves on data unlike its training set. Careful evaluation is what separates a genuinely useful model from one that has merely memorised its examples.", sources: ["nasa"], highlights: ["Completeness, purity, calibration — and guarding against overfitting"] }),
];
