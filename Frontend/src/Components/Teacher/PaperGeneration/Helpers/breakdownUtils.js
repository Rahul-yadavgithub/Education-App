// src/PaperGeneration/helpers/breakdownUtils.js

/**
 * Generate smart difficulty breakdowns based on total questions & user difficulty preference
 * Each breakdown represents a possible ratio of Easy / Medium / Hard questions.
 */
export const generateBreakdowns = (totalQuestions = 10, difficulty = "Medium") => {
  if (totalQuestions <= 0) return [];

  // Define difficulty weights — how strongly to bias toward each level
  const difficultyBias = {
    Easy: { easy: 0.6, medium: 0.3, hard: 0.1 },
    Medium: { easy: 0.3, medium: 0.5, hard: 0.2 },
    Hard: { easy: 0.2, medium: 0.4, hard: 0.4 },
  };

  const base = difficultyBias[difficulty] || difficultyBias["Medium"];

  // Generate multiple distribution patterns for the user to choose from
  const variations = [
    { label: "Balanced Mix", multiplier: [1, 1, 1] },
    { label: "Challenge Focused", multiplier: [0.8, 1, 1.2] },
    { label: "Conceptual Emphasis", multiplier: [1.2, 1, 0.8] },
    { label: "Medium-Dominant", multiplier: [0.9, 1.3, 0.8] },
    { label: "Exam-Style Balance", multiplier: [1.1, 1.1, 0.9] },
  ];

  const results = variations.map((v) => {
    const totalWeight =
      base.easy * v.multiplier[0] +
      base.medium * v.multiplier[1] +
      base.hard * v.multiplier[2];

    const easy = Math.round((totalQuestions * base.easy * v.multiplier[0]) / totalWeight);
    const medium = Math.round((totalQuestions * base.medium * v.multiplier[1]) / totalWeight);
    let hard = totalQuestions - easy - medium;

    // Handle rounding edge cases
    if (hard < 0) hard = 0;
    if (easy + medium + hard !== totalQuestions) {
      const diff = totalQuestions - (easy + medium + hard);
      hard += diff;
    }

    return { label: v.label, easy, medium, hard };
  });

  return results;
};
