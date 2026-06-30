import {
  LEARNING_PATHS,
  getLearningPath,
  type LearningPath,
  type LearnLevel,
  type LearnStep,
} from "@/lib/learn";

/**
 * Learning Engine — structured, graph-driven learning (no AI). Delegates to the
 * learning-path registry and flattens stages into a recommended sequence.
 */
export const learningEngine = {
  all: (): LearningPath[] => LEARNING_PATHS,
  get: (slug: string): LearningPath | undefined => getLearningPath(slug),
  byLevel: (level: LearnLevel): LearningPath[] =>
    LEARNING_PATHS.filter((p) => p.stages.some((s) => s.level === level)),
  /** The ordered step sequence for a path. */
  sequence: (slug: string): LearnStep[] => {
    const p = getLearningPath(slug);
    return p ? p.stages.flatMap((s) => s.steps) : [];
  },
  /**
   * Recommend paths for a topic at (or below) a level. Pure text+level match
   * over the registry — deterministic, no fabricated curricula.
   */
  recommend(topic: string, level?: LearnLevel): LearningPath[] {
    const order: LearnLevel[] = ["Beginner", "Intermediate", "Advanced"];
    const max = level ? order.indexOf(level) : order.length - 1;
    const q = topic.trim().toLowerCase();
    return LEARNING_PATHS.filter((p) => {
      const matches = !q || `${p.title} ${p.description}`.toLowerCase().includes(q);
      const atLevel = p.stages.some((s) => order.indexOf(s.level) <= max);
      return matches && atLevel;
    });
  },
};
